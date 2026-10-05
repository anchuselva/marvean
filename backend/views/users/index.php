<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>👥</span>
      <span>User Accounts &amp; RBAC Access Control</span>
    </div>
    <div class="panel-actions">
      <a href="/users/create" class="btn btn-teal">
        <span>+ Provision User</span>
      </a>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table" data-searchable-table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Corporate Email</th>
          <th>Role / Clearance</th>
          <th>Account Status</th>
          <th>Last Login</th>
          <th>Provisioned Date</th>
          <th style="text-align: right;">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($users as $u): ?>
          <tr>
            <td>
              <div style="font-weight: 700; color: #fff;"><?= htmlspecialchars($u['name']) ?></div>
            </td>
            <td style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--accent-teal);">
              <?= htmlspecialchars($u['email']) ?>
            </td>
            <td>
              <span class="badge badge-<?= $u['role'] === 'admin' ? 'critical' : ($u['role'] === 'analyst' ? 'verified' : 'neutral') ?>">
                <?= strtoupper(htmlspecialchars($u['role'])) ?>
              </span>
            </td>
            <td>
              <span class="badge badge-<?= $u['status'] === 'active' ? 'verified' : 'high' ?>">
                <?= strtoupper(htmlspecialchars($u['status'])) ?>
              </span>
            </td>
            <td style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);">
              <?= $u['last_login_at'] ? date('Y-m-d H:i', strtotime($u['last_login_at'])) : 'Never' ?>
            </td>
            <td style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);">
              <?= date('Y-m-d', strtotime($u['created_at'])) ?>
            </td>
            <td style="text-align: right; white-space: nowrap;">
              <a href="/users/<?= $u['id'] ?>/edit" class="btn btn-outline btn-sm">Edit Role</a>
              <?php if ((int)$u['id'] !== (int)\App\Core\Auth::id()): ?>
                <form method="POST" action="/users/<?= $u['id'] ?>/delete" style="display: inline-block; margin: 0;" data-confirm="Revoke access for user <?= htmlspecialchars($u['name']) ?>?">
                  <?= \App\Core\View::csrfField() ?>
                  <button type="submit" class="btn btn-red btn-sm" style="padding: 0.3rem 0.5rem;">Revoke</button>
                </form>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
