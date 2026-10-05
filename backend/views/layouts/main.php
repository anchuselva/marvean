<?php
use App\Core\Auth;
$user = Auth::user();
$active = $activeNav ?? 'dashboard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($title ?? 'MARVEAN Intelligence Command Center') ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/dashboard.css?v=3.1">
  <script src="/assets/chart.min.js"></script>
</head>
<body>

  <!-- Sidebar Navigation -->
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-title">
        <span class="brand-dot"></span>
        <span>MARVEAN</span>
      </div>
      <div class="brand-subtitle">// INTELLIGENCE COMMAND</div>
    </div>

    <ul class="sidebar-nav">
      <li class="nav-section-title">Core Operations</li>
      <li>
        <a href="/dashboard" class="sidebar-link <?= $active === 'dashboard' ? 'active' : '' ?>">
          <svg class="nav-icon" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span>Command Center</span>
        </a>
      </li>
      <li>
        <a href="/competitors" class="sidebar-link <?= $active === 'competitors' ? 'active' : '' ?>">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M10 6h4"/><path d="M10 18h4"/></svg>
          <span>Competitor Registry</span>
        </a>
      </li>
      <li>
        <a href="/signals" class="sidebar-link <?= $active === 'signals' ? 'active' : '' ?>">
          <svg class="nav-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
          <span>Signal Radar</span>
          <span class="sidebar-link-badge">LIVE</span>
        </a>
      </li>
      <li>
        <a href="/market-records" class="sidebar-link <?= $active === 'market_records' ? 'active' : '' ?>">
          <svg class="nav-icon" viewBox="0 0 24 24"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/><path d="M3 20h18"/></svg>
          <span>Market Intelligence</span>
        </a>
      </li>
      <li>
        <a href="/product-comparisons" class="sidebar-link <?= $active === 'product_comparisons' ? 'active' : '' ?>">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
          <span>Product Shootout</span>
        </a>
      </li>
      <li>
        <a href="/evidence" class="sidebar-link <?= $active === 'evidence' ? 'active' : '' ?>">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          <span>Evidence &amp; Insights</span>
        </a>
      </li>

      <?php if (Auth::role() === 'admin'): ?>
      <li class="nav-section-title">Administration</li>
      <li>
        <a href="/users" class="sidebar-link <?= $active === 'users' ? 'active' : '' ?>">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>User &amp; RBAC Mgmt</span>
        </a>
      </li>
      <?php endif; ?>
    </ul>

    <div class="sidebar-footer">
      <div class="user-snippet">
        <div class="user-avatar"><?= strtoupper(substr($user['name'] ?? 'U', 0, 1)) ?></div>
        <div class="user-info">
          <span class="user-name"><?= htmlspecialchars($user['name'] ?? 'Analyst') ?></span>
          <span class="user-role"><?= htmlspecialchars($user['role'] ?? 'analyst') ?></span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Wrapper -->
  <div class="main-wrapper">
    <!-- Topbar -->
    <header class="topbar">
      <div class="topbar-left">
        <h1 class="page-title"><?= htmlspecialchars($title ?? 'Command Center') ?></h1>
      </div>
      <div class="topbar-right">
        <div class="sys-status-badge">
          <span class="brand-dot"></span>
          <span>DB: logicstrand_marvean (CONNECTED)</span>
        </div>
        <form method="POST" action="/logout" style="margin: 0;">
          <?= \App\Core\View::csrfField() ?>
          <button type="submit" class="btn-logout">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            <span>LOGOUT</span>
          </button>
        </form>
      </div>
    </header>

    <!-- Body Container -->
    <main class="content-body">
      <?php if (!empty($flashSuccess)): ?>
        <div class="alert alert-success">
          <span><?= htmlspecialchars($flashSuccess) ?></span>
          <button type="button" onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.1rem;">&times;</button>
        </div>
      <?php endif; ?>

      <?php if (!empty($flashError)): ?>
        <div class="alert alert-danger">
          <span><?= htmlspecialchars($flashError) ?></span>
          <button type="button" onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:1.1rem;">&times;</button>
        </div>
      <?php endif; ?>

      <?= $content ?>
    </main>
  </div>

  <script src="/assets/dashboard.js"></script>
</body>
</html>
