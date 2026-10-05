<div class="panel" style="max-width: 650px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>👥</span>
      <span>Provision New User / Analyst Account</span>
    </div>
    <div class="panel-actions">
      <a href="/users" class="btn btn-outline btn-sm">Cancel</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/users">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Full Name / Operator Handle *</label>
        <input type="text" name="name" class="form-control" placeholder="e.g. Dr. Aris Thorne" required autofocus>
      </div>

      <div class="form-group">
        <label class="form-label">Corporate Email Address *</label>
        <input type="email" name="email" class="form-control" placeholder="e.g. aris@marvean.net" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">RBAC Security Role *</label>
          <select name="role" class="form-control" required>
            <option value="analyst" selected>Analyst (CRUD Intel &amp; Signals)</option>
            <option value="admin">Administrator (Full System &amp; RBAC Control)</option>
            <option value="viewer">Viewer (Read-only Briefings)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Account Status *</label>
          <select name="status" class="form-control" required>
            <option value="active" selected>Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Initial Security Passphrase *</label>
        <input type="password" name="password" class="form-control" placeholder="Minimum 6 characters" required>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/users" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>+ PROVISION USER</span>
        </button>
      </div>
    </form>
  </div>
</div>
