<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>🏢</span>
      <span>Edit Profile: <?= htmlspecialchars($competitor['name']) ?></span>
    </div>
    <div class="panel-actions">
      <a href="/competitors/<?= $competitor['id'] ?>" class="btn btn-outline btn-sm">Return to Dossier</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/competitors/<?= $competitor['id'] ?>">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Competitor Name *</label>
          <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($competitor['name']) ?>" required>
        </div>
        <div class="form-group">
          <label class="form-label">Stock Ticker</label>
          <input type="text" name="ticker" class="form-control" value="<?= htmlspecialchars($competitor['ticker'] ?? '') ?>">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Competitive Tier *</label>
          <select name="tier" class="form-control" required>
            <?php foreach (['Tier-1 Direct', 'Tier-2 Emerging', 'Indirect Threat', 'Strategic Partner'] as $t): ?>
              <option value="<?= $t ?>" <?= $competitor['tier'] === $t ? 'selected' : '' ?>><?= $t ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Industry / Category *</label>
          <input type="text" name="category" class="form-control" value="<?= htmlspecialchars($competitor['category']) ?>" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Threat Severity Level *</label>
          <select name="threat_level" class="form-control" required>
            <?php foreach (['Critical', 'High', 'Moderate', 'Low'] as $th): ?>
              <option value="<?= $th ?>" <?= $competitor['threat_level'] === $th ? 'selected' : '' ?>><?= $th ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tracking Status</label>
          <select name="status" class="form-control">
            <?php foreach (['Active Tracking', 'Under Audit', 'Archived'] as $st): ?>
              <option value="<?= $st ?>" <?= $competitor['status'] === $st ? 'selected' : '' ?>><?= $st ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Corporate Website</label>
          <input type="url" name="website" class="form-control" value="<?= htmlspecialchars($competitor['website'] ?? '') ?>">
        </div>
        <div class="form-group">
          <label class="form-label">Market Capitalization / Valuation</label>
          <input type="text" name="market_cap" class="form-control" value="<?= htmlspecialchars($competitor['market_cap'] ?? '') ?>">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Strategic Overview *</label>
        <textarea name="overview" class="form-control" rows="5" required><?= htmlspecialchars($competitor['overview']) ?></textarea>
      </div>

      <div class="form-group" style="padding: 1rem; background: rgba(0, 229, 163, 0.05); border: 1px solid var(--border-card); border-radius: 6px;">
        <label class="form-label" style="color: var(--accent-teal);">Change Summary (Recorded in Timeline Audit) *</label>
        <input type="text" name="update_summary" class="form-control" placeholder="Describe the rationale for this edit (e.g. Threat level escalated due to pricing discount)..." required>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/competitors/<?= $competitor['id'] ?>" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>UPDATE PROFILE &amp; RECORD LOG</span>
        </button>
      </div>
    </form>
  </div>
</div>
