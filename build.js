const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const filesToCopy = [
  'index.html',
  'privacy-policy.html',
  'terms-and-conditions.html',
  'dashboard.html',
  'product.html',
  'mv-intel.html',
  'ProductPage.jsx',
  'dashboard.js',
  'script.js',
  'style.css',
  'mv-intel.css',
  'mv-intel.js',
  'Logo.svg',
  'vercel.json',
  '.vercelignore',
  'server.js',
  'package.json',
  'README.md'
];
const directoriesToCopy = ['assets', 'MARVEAN', 'backend'];

const apacheRules = `Options -Indexes

DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Route backend API calls directly to the PHP Database Controller
  RewriteRule ^api/(.*)$ backend/public/index.php [QSA,L]

  # Keep real files and directories accessible.
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Serve clean URLs such as /dashboard and /product.
  RewriteRule ^([A-Za-z0-9_-]+)/?$ $1.html [L]
</IfModule>

# Prevent caching of HTML documents so clients always fetch current asset revisions
<IfModule mod_headers.c>
  <FilesMatch "\\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>
  <FilesMatch "\\.(css|js)$">
    Header set Cache-Control "public, max-age=86400, must-revalidate"
  </FilesMatch>
</IfModule>

# Never expose environment files, server secrets, or database dump files directly
<FilesMatch "(^|\\/)(\\.env|package(-lock)?\\.json|build\\.js|.*\\.map|schema\\.sql)$">
  Require all denied
</FilesMatch>
`;

const buildTimestamp = Date.now().toString(36);

function copyEntry(relativePath) {
  const source = path.join(rootDir, relativePath);
  const destination = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });

  if (relativePath.endsWith('.html')) {
    let content = fs.readFileSync(source, 'utf8');
    // Ensure all CSS & JS references have cache-busting version params
    content = content.replace(/(href=["'])style\.css(?:\?v=[^"']*)?(["'])/g, `$1style.css?v=${buildTimestamp}$2`);
    content = content.replace(/(href=["'])mv-intel\.css(?:\?v=[^"']*)?(["'])/g, `$1mv-intel.css?v=${buildTimestamp}$2`);
    content = content.replace(/(src=["'])script\.js(?:\?v=[^"']*)?(["'])/g, `$1script.js?v=${buildTimestamp}$2`);
    content = content.replace(/(src=["'])dashboard\.js(?:\?v=[^"']*)?(["'])/g, `$1dashboard.js?v=${buildTimestamp}$2`);
    content = content.replace(/(src=["'])mv-intel\.js(?:\?v=[^"']*)?(["'])/g, `$1mv-intel.js?v=${buildTimestamp}$2`);
    fs.writeFileSync(destination, content, 'utf8');
  } else {
    fs.cpSync(source, destination, { recursive: true });
  }
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const file of filesToCopy) {
  if (fs.existsSync(path.join(rootDir, file))) copyEntry(file);
}

for (const directory of directoriesToCopy) {
  if (fs.existsSync(path.join(rootDir, directory))) copyEntry(directory);
}

const distBackendEnv = path.join(distDir, 'backend', '.env');
if (fs.existsSync(distBackendEnv)) {
  fs.rmSync(distBackendEnv, { force: true });
}

fs.writeFileSync(path.join(distDir, '.htaccess'), apacheRules, 'utf8');
console.log(`Built deployable site in ${path.relative(rootDir, distDir)}/ (Asset Version: ${buildTimestamp})`);
