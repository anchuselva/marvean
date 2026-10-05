<form method="POST" action="/login">
  <?= \App\Core\View::csrfField() ?>

  <div class="form-group">
    <label class="form-label" for="login-email">Analyst Email</label>
    <input type="email" id="login-email" name="email" class="form-control" placeholder="admin@marvean.net" value="admin@marvean.net" required autofocus>
  </div>

  <div class="form-group">
    <label class="form-label" for="login-password">Access Passphrase</label>
    <input type="password" id="login-password" name="password" class="form-control" placeholder="••••••••••••" value="password123" required>
  </div>

  <div style="margin: 1.5rem 0 1rem;">
    <button type="submit" class="btn btn-teal" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.5px;">
      <span>⚡</span>
      <span>AUTHENTICATE &amp; ENTER COMMAND CENTER</span>
    </button>
  </div>

  <div style="text-align: center; margin-top: 1.25rem; font-size: 0.82rem; color: var(--text-muted);">
    Need analyst clearance? <a href="/register" style="font-weight: 700; color: var(--accent-teal);">Provision New Account &rarr;</a>
  </div>

  <div style="margin-top: 1.5rem; padding: 0.9rem; background: rgba(7, 12, 24, 0.75); border: 1px dashed rgba(40, 60, 108, 0.8); border-radius: 8px; font-family: var(--font-mono); font-size: 0.74rem;">
    <div style="font-weight: 700; color: var(--accent-yellow); margin-bottom: 0.45rem; letter-spacing: 0.5px;">[DEMO CREDENTIALS — CLICK TO AUTOFILL]</div>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.7rem;" onclick="fillCreds('admin@marvean.net', 'password123')">🔑 Admin</button>
      <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.7rem;" onclick="fillCreds('analyst@marvean.net', 'password123')">📊 Analyst</button>
      <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.7rem;" onclick="fillCreds('executive@marvean.net', 'password123')">👁️ Executive</button>
    </div>
  </div>
</form>

<script>
function fillCreds(email, pass) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = pass;
}
</script>
