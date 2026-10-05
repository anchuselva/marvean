<!-- Comparison Header -->
<div class="panel" style="margin-bottom: 1.5rem;">
  <div class="panel-body" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <span class="badge badge-verified">SHOOTOUT MATRIX</span>
        <h2 style="font-size: 1.6rem; color: #fff; font-weight: 700;">
          <?= htmlspecialchars($comparison['title']) ?>
        </h2>
      </div>

      <div style="display: flex; gap: 1.5rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
        <span>Target: <strong style="color: var(--accent-yellow);"><?= htmlspecialchars($comparison['competitor_name'] ?? 'General') ?></strong></span>
        <span>Product: <strong style="color: #fff;"><?= htmlspecialchars($comparison['target_product_name'] ?? 'Competitive Suite') ?></strong></span>
        <span>Pricing Tier: <strong style="color: var(--accent-red);"><?= htmlspecialchars($comparison['pricing_tier'] ?? 'Unlisted') ?></strong></span>
        <span>Status: <strong style="color: var(--accent-teal);"><?= htmlspecialchars($comparison['status']) ?></strong></span>
      </div>
    </div>

    <div style="display: flex; gap: 0.65rem;">
      <a href="/product-comparisons/<?= $comparison['id'] ?>/edit" class="btn btn-outline">
        <span>✏️ Edit Matrix</span>
      </a>
      <a href="/product-comparisons" class="btn btn-outline">
        <span>← All Shootouts</span>
      </a>
    </div>
  </div>
</div>

<!-- Battlecard Notes -->
<?php if (!empty($comparison['notes'])): ?>
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>💡</span>
      <span>Strategic Battlecard Takeaway &amp; Positioning</span>
    </div>
  </div>
  <div class="panel-body">
    <p style="font-size: 0.95rem; color: #fff; line-height: 1.6;">
      <?= nl2br(htmlspecialchars($comparison['notes'])) ?>
    </p>
  </div>
</div>
<?php endif; ?>

<!-- Attributes Matrix Table -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>⚖️</span>
      <span>Feature &amp; Metric Shootout Matrix</span>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table comparison-matrix-table">
      <thead>
        <tr>
          <th style="width: 24%;">Evaluation Dimension</th>
          <th style="width: 28%; color: var(--accent-teal);">MARVEAN Enterprise Advantage</th>
          <th style="width: 28%; color: var(--accent-yellow);"><?= htmlspecialchars($comparison['competitor_name'] ?? 'Competitor') ?> Offering</th>
          <th style="width: 12%;">Advantage</th>
          <th style="width: 8%; text-align: right;">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($attributes)): ?>
          <tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No comparison attributes added yet. Use the form below to populate benchmark rows.</td></tr>
        <?php else: ?>
          <?php foreach ($attributes as $attr): ?>
            <tr>
              <td>
                <div style="font-weight: 700; color: #fff;"><?= htmlspecialchars($attr['attribute_name']) ?></div>
                <?php if (!empty($attr['audit_note'])): ?>
                  <div style="font-size: 0.74rem; color: var(--text-muted); font-family: var(--font-mono);">
                    Audit: <?= htmlspecialchars($attr['audit_note']) ?>
                  </div>
                <?php endif; ?>
              </td>
              <td class="<?= $attr['advantage'] === 'Marvean' ? 'marvean-win' : '' ?>">
                <strong><?= htmlspecialchars($attr['marvean_metric']) ?></strong>
              </td>
              <td class="<?= $attr['advantage'] === 'Competitor' ? 'competitor-win' : '' ?>">
                <?= htmlspecialchars($attr['competitor_metric']) ?>
              </td>
              <td>
                <span class="badge badge-<?= $attr['advantage'] === 'Marvean' ? 'verified' : ($attr['advantage'] === 'Competitor' ? 'critical' : 'neutral') ?>">
                  <?= htmlspecialchars($attr['advantage']) ?>
                </span>
              </td>
              <td style="text-align: right;">
                <form method="POST" action="/product-comparisons/<?= $comparison['id'] ?>/attributes/<?= $attr['id'] ?>/delete" style="margin: 0;" data-confirm="Remove this benchmark attribute?">
                  <?= \App\Core\View::csrfField() ?>
                  <button type="submit" class="btn btn-red btn-sm" style="padding: 0.2rem 0.45rem;">&times;</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>

  <!-- Add Attribute Form -->
  <div style="padding: 1.5rem; background: rgba(7, 12, 24, 0.4); border-top: 1px solid var(--border-card);">
    <form method="POST" action="/product-comparisons/<?= $comparison['id'] ?>/attributes">
      <?= \App\Core\View::csrfField() ?>
      <div style="font-weight: 700; font-size: 0.85rem; color: var(--accent-teal); margin-bottom: 0.85rem;">+ Add New Shootout Dimension</div>
      <div class="form-row" style="margin-bottom: 0.75rem;">
        <input type="text" name="attribute_name" class="form-control" placeholder="Dimension Name (e.g. Signal Ingestion SLA) *" required style="font-size: 0.84rem;">
        <input type="text" name="marvean_metric" class="form-control" placeholder="MARVEAN Metric (e.g. < 15m Continuous) *" required style="font-size: 0.84rem;">
      </div>
      <div class="form-row" style="margin-bottom: 0.75rem;">
        <input type="text" name="competitor_metric" class="form-control" placeholder="Competitor Metric (e.g. 4-12h Batch ETL) *" required style="font-size: 0.84rem;">
        <select name="advantage" class="form-control" style="font-size: 0.84rem;">
          <option value="Marvean" selected>Advantage: Marvean</option>
          <option value="Competitor">Advantage: Competitor</option>
          <option value="Parity">Parity / Neutral</option>
        </select>
      </div>
      <div class="form-row">
        <input type="text" name="audit_note" class="form-control" placeholder="Audited Citation / Benchmark Test ID" style="font-size: 0.84rem;">
        <button type="submit" class="btn btn-teal btn-sm" style="height: 38px;">Insert Dimension</button>
      </div>
    </form>
  </div>
</div>

<!-- Comparison History Timeline -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>🕒</span>
      <span>Comparison Matrix Audit Trail &amp; Revisions</span>
    </div>
  </div>
  <div class="panel-body">
    <ul class="timeline">
      <?php foreach ($history as $h): ?>
        <li class="timeline-item">
          <div class="timeline-time"><?= date('M j, Y H:i', strtotime($h['created_at'])) ?> &bull; <?= htmlspecialchars($h['user_name'] ?? 'System') ?></div>
          <div class="timeline-title"><?= htmlspecialchars($h['action']) ?></div>
          <div class="timeline-body"><?= htmlspecialchars($h['notes']) ?></div>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</div>
