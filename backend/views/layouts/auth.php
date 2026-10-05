<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($title ?? 'MARVEAN Intelligence Command Center') ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/dashboard.css?v=3.0">
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: radial-gradient(circle at center, #0f1c3a 0%, #060910 85%);
      padding: 1.5rem;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #f8fafc;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      background: rgba(13, 21, 39, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2.25rem;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(16, 185, 129, 0.2);
    }
    .auth-brand {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-brand h1 {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }
    .auth-brand p {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--accent-teal);
      margin-top: 0.35rem;
      letter-spacing: 0.04em;
    }
  </style>
</head>
<body>

  <div class="auth-card">
    <div class="auth-brand">
      <h1><span class="brand-dot"></span> MARVEAN</h1>
      <p>// ENTERPRISE INTELLIGENCE GATEWAY</p>
    </div>

    <?php if (!empty($flashSuccess)): ?>
      <div class="alert alert-success">
        <span><?= htmlspecialchars($flashSuccess) ?></span>
      </div>
    <?php endif; ?>

    <?php if (!empty($flashError)): ?>
      <div class="alert alert-danger">
        <span><?= htmlspecialchars($flashError) ?></span>
      </div>
    <?php endif; ?>

    <?= $content ?>
  </div>

  <script src="/assets/dashboard.js"></script>
</body>
</html>
