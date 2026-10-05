<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>⚔️</span>
      <span>Product &amp; Service Comparison Matrices</span>
    </div>
    <div class="panel-actions">
      <a href="/product-comparisons/create" class="btn btn-teal">
        <span>+ New Shootout Matrix</span>
      </a>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table" data-searchable-table>
      <thead>
        <tr>
          <th>Matrix Title</th>
          <th>Target Competitor &amp; Product</th>
          <th>Domain Category</th>
          <th>Evaluated Attributes</th>
          <th>Status</th>
          <th>Created By</th>
          <th style="text-align: right;">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($comparisons)): ?>
          <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No comparison shootouts configured.</td></tr>
        <?php else: ?>
          <?php foreach ($comparisons as $pc): ?>
            <tr>
              <td>
                <a href="/product-comparisons/<?= $pc['id'] ?>" style="font-weight: 700; font-size: 0.92rem;">
                  <?= htmlspecialchars($pc['title']) ?>
                </a>
              </td>
              <td>
                <?php if (!empty($pc['competitor_name'])): ?>
                  <strong><?= htmlspecialchars($pc['competitor_name']) ?></strong>
                  <div style="font-size: 0.78rem; color: var(--accent-yellow);">
                    <?= htmlspecialchars($pc['target_product_name'] ?? 'Product Suite') ?>
                  </div>
                <?php else: ?>
                  <span style="color: var(--text-muted);">Multi-Competitor Benchmark</span>
                <?php endif; ?>
              </td>
              <td><span class="badge badge-neutral"><?= htmlspecialchars($pc['category']) ?></span></td>
              <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-teal);">
                <?= $pc['attributes_count'] ?> attributes
              </td>
              <td><span class="badge badge-verified"><?= htmlspecialchars($pc['status']) ?></span></td>
              <td style="font-size: 0.8rem; color: var(--text-muted);"><?= htmlspecialchars($pc['creator_name'] ?? 'Analyst') ?></td>
              <td style="text-align: right; white-space: nowrap;">
                <a href="/product-comparisons/<?= $pc['id'] ?>" class="btn btn-outline btn-sm">Inspect Matrix</a>
                <a href="/product-comparisons/<?= $pc['id'] ?>/edit" class="btn btn-outline btn-sm">Edit</a>
                <form method="POST" action="/product-comparisons/<?= $pc['id'] ?>/delete" style="display: inline-block; margin: 0;" data-confirm="Delete comparison matrix?">
                  <?= \App\Core\View::csrfField() ?>
                  <button type="submit" class="btn btn-red btn-sm" style="padding: 0.3rem 0.5rem;">Delete</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Competitor Product Cataloger -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>📦</span>
      <span>Catalog Competitor Product / Service</span>
    </div>
  </div>
  <div class="panel-body">
    <form method="POST" action="/products">
      <?= \App\Core\View::csrfField() ?>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Competitor *</label>
          <select name="competitor_id" class="form-control" required>
            <?php foreach ($competitors as $c): ?>
              <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['name']) ?> (<?= htmlspecialchars($c['tier']) ?>)</option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Product / Service Name *</label>
          <input type="text" name="name" class="form-control" placeholder="e.g. Nexus PriceScout" required>
        </div>
        <div class="form-group">
          <label class="form-label">Category *</label>
          <input type="text" name="category" class="form-control" placeholder="e.g. Dynamic Pricing Bot" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Pricing Model</label>
          <input type="text" name="pricing_model" class="form-control" placeholder="e.g. Seat-based, Consumption, Annual Contract" value="Annual Contract">
        </div>
        <div class="form-group">
          <label class="form-label">Pricing Tier / Rate *</label>
          <input type="text" name="pricing_tier" class="form-control" placeholder="e.g. $8,500 / month" required>
        </div>
        <div class="form-group">
          <label class="form-label">Feature &amp; Limitation Notes</label>
          <input type="text" name="feature_summary" class="form-control" placeholder="Key specs, latency limitations...">
        </div>
      </div>
      <button type="submit" class="btn btn-teal btn-sm">+ Catalog Product for Shootout</button>
    </form>
  </div>
</div>
