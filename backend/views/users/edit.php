<div class="panel" style="max-width: 650px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>👥</span>
      <span>Edit User Account: <?= htmlspecialchars($targetUser['name']) ?></span>
    </div>
    <div class="panel-actions">
      <a href="/users" class="btn btn-outline btn-sm">Cancel</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/users/<?= $targetUser['id'] ?>">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Full Name *</label>
        <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($targetUser['name']) ?>" required>
      </div>

      <div class="form-group">
        <label class="form-label">Corporate Email Address *</label>
        <input type="email" name="email" class="form-control" value="<?= htmlspecialchars($targetUser['email']) ?>" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">RBAC Security Role *</label>
          <select name="role" class="form-control" required>
            <option value="analyst" <?= $targetUser['role'] === 'analyst' ? 'selected' : '' ?>>Analyst</option>
            <option value="admin" <?= $targetUser['role'] === 'admin' ? 'selected' : '' ?>>Administrator</option>
            <option value="viewer" <?= $targetUser['role'] === 'viewer' ? 'selected' : '' ?>>Viewer</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Account Status *</label>
          <select name="status" class="form-control" required>
            <option value="active" <?= $targetUser['status'] === 'active' ? 'selected' : '' ?>>Active</option>
            <option value="suspended" <?= $targetUser['status'] === 'suspended' ? 'selected' : '' ?>>Suspended</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Reset Passphrase (leave blank to maintain current)</label>
        <input type="password" name="password" class="form-control" placeholder="••••••••••••">
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/users" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>UPDATE USER PERMISSIONS</span>
        </button>
      </div>
    </form>
  </div>
</div>
