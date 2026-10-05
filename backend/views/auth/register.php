<form method="POST" action="/register">
  <?= \App\Core\View::csrfField() ?>

  <div class="form-group">
    <label class="form-label">Full Name / Operator Handle</label>
    <input type="text" name="name" class="form-control" placeholder="Jane Doe" required autofocus>
  </div>

  <div class="form-group">
    <label class="form-label">Corporate Email</label>
    <input type="email" name="email" class="form-control" placeholder="jane@enterprise.com" required>
  </div>

  <div class="form-group">
    <label class="form-label">Security Passphrase</label>
    <input type="password" name="password" class="form-control" placeholder="Minimum 6 characters" required>
  </div>

  <div style="margin: 1.5rem 0 1rem;">
    <button type="submit" class="btn btn-teal" style="width: 100%; justify-content: center; padding: 0.75rem;">
      <span>PROVISION ANALYST PROFILE</span>
    </button>
  </div>

  <div style="text-align: center; margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-muted);">
    Already possess credentials? <a href="/login" style="font-weight: 700;">Access Terminal</a>
  </div>
</form>
