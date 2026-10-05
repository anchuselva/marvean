<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>⚔️</span>
      <span>Edit Comparison: <?= htmlspecialchars($comparison['title']) ?></span>
    </div>
    <div class="panel-actions">
      <a href="/product-comparisons/<?= $comparison['id'] ?>" class="btn btn-outline btn-sm">Return to Matrix</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/product-comparisons/<?= $comparison['id'] ?>">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Comparison Title *</label>
        <input type="text" name="title" class="form-control" value="<?= htmlspecialchars($comparison['title']) ?>" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Target Competitor Product</label>
          <select name="target_product_id" class="form-control">
            <option value="">-- General Multi-Product Benchmark --</option>
            <?php foreach ($products as $p): ?>
              <option value="<?= $p['id'] ?>" <?= $comparison['target_product_id'] == $p['id'] ? 'selected' : '' ?>>
                <?= htmlspecialchars($p['competitor_name']) ?> &bull; <?= htmlspecialchars($p['name']) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Domain Category *</label>
          <input type="text" name="category" class="form-control" value="<?= htmlspecialchars($comparison['category']) ?>" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Status</label>
        <select name="status" class="form-control">
          <?php foreach (['Active Brief', 'Quarterly Review', 'Archived'] as $s): ?>
            <option value="<?= $s ?>" <?= $comparison['status'] === $s ? 'selected' : '' ?>><?= $s ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Strategic Notes &amp; Battlecard Takeaways</label>
        <textarea name="notes" class="form-control" rows="4"><?= htmlspecialchars($comparison['notes'] ?? '') ?></textarea>
      </div>

      <div class="form-group" style="padding: 1rem; background: rgba(0, 229, 163, 0.05); border: 1px solid var(--border-card); border-radius: 6px;">
        <label class="form-label" style="color: var(--accent-teal);">Changelog Action Note *</label>
        <input type="text" name="history_notes" class="form-control" placeholder="Describe the change made..." required>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/product-comparisons/<?= $comparison['id'] ?>" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>UPDATE MATRIX &amp; RECORD LOG</span>
        </button>
      </div>
    </form>
  </div>
</div>
