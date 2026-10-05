<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>⚔️</span>
      <span>Configure Product Comparison Shootout</span>
    </div>
    <div class="panel-actions">
      <a href="/product-comparisons" class="btn btn-outline btn-sm">Cancel</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/product-comparisons">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Comparison Title *</label>
        <input type="text" name="title" class="form-control" placeholder="e.g. MARVEAN Command Center vs. Nexus Commerce Core" required autofocus>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Target Competitor Product</label>
          <select name="target_product_id" class="form-control">
            <option value="">-- General Multi-Product Benchmark --</option>
            <?php foreach ($products as $p): ?>
              <option value="<?= $p['id'] ?>">
                <?= htmlspecialchars($p['competitor_name']) ?> &bull; <?= htmlspecialchars($p['name']) ?> (<?= htmlspecialchars($p['pricing_tier']) ?>)
              </option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Comparison Domain Category *</label>
          <input type="text" name="category" class="form-control" placeholder="e.g. Enterprise AI Market Intelligence" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Strategic Notes &amp; Battlecard Takeaways</label>
        <textarea name="notes" class="form-control" rows="3" placeholder="Core executive takeaways for sales & leadership takeout briefs..."></textarea>
      </div>

      <!-- Initial Attribute Row -->
      <div style="padding: 1rem; background: rgba(7, 12, 24, 0.6); border: 1px dashed var(--border-card); border-radius: 6px; margin-bottom: 1.5rem;">
        <div style="font-weight: 700; font-size: 0.8rem; color: var(--accent-teal); margin-bottom: 0.75rem;">+ Primary Benchmark Attribute</div>
        <div class="form-row" style="margin-bottom: 0.75rem;">
          <input type="text" name="attribute_name" class="form-control" placeholder="Attribute (e.g. Ingestion Latency)" style="font-size: 0.82rem;">
          <input type="text" name="marvean_metric" class="form-control" placeholder="Marvean Metric (e.g. < 15m Continuous)" style="font-size: 0.82rem;">
        </div>
        <div class="form-row">
          <input type="text" name="competitor_metric" class="form-control" placeholder="Competitor Metric (e.g. 4-12h Batch)" style="font-size: 0.82rem;">
          <select name="advantage" class="form-control" style="font-size: 0.82rem;">
            <option value="Marvean">Advantage: Marvean</option>
            <option value="Competitor">Advantage: Competitor</option>
            <option value="Parity">Parity</option>
          </select>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        <a href="/product-comparisons" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>INITIALIZE COMPARISON MATRIX</span>
        </button>
      </div>
    </form>
  </div>
</div>
