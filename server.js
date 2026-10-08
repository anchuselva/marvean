const http = require('http');
const fs = require('fs');
const path = require('path');

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const PHP_BACKEND_PORT = parseInt(process.env.PHP_PORT, 10) || 8000;
const PHP_BACKEND_HOST = process.env.PHP_HOST || 'localhost';

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  if (req.method === 'POST' && reqPath === '/api/contact') {
    handleContactSubmission(req, res);
    return;
  }

  // Forward all other /api/ requests to the database backend
  if (reqPath.startsWith('/api/')) {
    proxyToBackend(req, res);
    return;
  }

  let filePath = path.join(__dirname, reqPath);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  function tryServeFile(targetPath) {
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(targetPath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT' && !ext) {
          // Clean URL fallback: try with .html
          return tryServeFile(targetPath + '.html');
        }
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Server Error: ' + err.code);
        }
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(content);
      }
    });
  }

  tryServeFile(filePath);
});

async function handleContactSubmission(req, res) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    sendJson(res, 500, { success: false, message: 'Contact verification is not configured.' });
    return;
  }

  try {
    const body = await readRequestBody(req);
    const submission = JSON.parse(body);
    const token = typeof submission.recaptchaToken === 'string' ? submission.recaptchaToken : '';

    if (!token) {
      sendJson(res, 400, { success: false, message: 'Please complete the reCAPTCHA challenge.' });
      return;
    }

    const verificationResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
        remoteip: req.socket.remoteAddress || ''
      })
    });
    const verification = await verificationResponse.json();

    if (!verification.success) {
      sendJson(res, 403, { success: false, message: 'reCAPTCHA verification failed. Please try again.' });
      return;
    }

    sendJson(res, 200, { success: true });
  } catch (error) {
    console.error('Contact verification failed:', error.message);
    sendJson(res, 400, { success: false, message: 'Unable to verify the request right now.' });
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function proxyToBackend(req, res) {
  const options = {
    hostname: PHP_BACKEND_HOST,
    port: PHP_BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${PHP_BACKEND_HOST}:${PHP_BACKEND_PORT}`
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('PHP Backend Proxy error:', err.message);
    sendJson(res, 502, {
      status: 'offline',
      database: 'disconnected',
      error: 'Backend proxy error',
      message: 'Could not connect to database backend on port ' + PHP_BACKEND_PORT,
      hint: 'Ensure PHP backend is running (run backend/serve.bat or start PHP backend)'
    });
  });

  req.pipe(proxyReq, { end: true });
}

const PORT = parseInt(process.env.PORT, 10) || 3000;

function startServer(port) {
  const instance = server.listen(port, () => {
    console.log(`MARVEAN Server running at http://localhost:${port}/`);
  });

  instance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, attempting port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
