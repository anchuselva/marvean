<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>📊</span>
      <span>Authoritative Market Intelligence Records</span>
    </div>
    <div class="panel-actions">
      <a href="/market-records/create" class="btn btn-teal">
        <span>+ Publish Market Record</span>
      </a>
    </div>
  </div>

  <!-- Filters Toolbar -->
  <div style="padding: 1rem 1.5rem; background: rgba(7, 12, 24, 0.5); border-bottom: 1px solid var(--border-card); display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
    <form method="GET" action="/market-records" style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin: 0;">
      <select name="classification" class="form-control" style="width: auto; padding: 0.45rem 0.75rem;">
        <option value="">All Classifications</option>
        <option value="SEC Filing" <?= $classification === 'SEC Filing' ? 'selected' : '' ?>>SEC Filing</option>
        <option value="Patent Registry" <?= $classification === 'Patent Registry' ? 'selected' : '' ?>>Patent Registry</option>
        <option value="Direct Pricing Audit" <?= $classification === 'Direct Pricing Audit' ? 'selected' : '' ?>>Direct Pricing Audit</option>
        <option value="Industry Benchmark" <?= $classification === 'Industry Benchmark' ? 'selected' : '' ?>>Industry Benchmark</option>
        <option value="Earnings Call Telemetry" <?= $classification === 'Earnings Call Telemetry' ? 'selected' : '' ?>>Earnings Call Telemetry</option>
      </select>

      <input type="text" name="search" class="form-control" placeholder="Search intel reports..." value="<?= htmlspecialchars($search ?? '') ?>" style="width: 220px; padding: 0.45rem 0.75rem;">

      <button type="submit" class="btn btn-outline btn-sm">Filter</button>
      <?php if (!empty($classification) || !empty($search)): ?>
        <a href="/market-records" class="btn btn-outline btn-sm" style="color: var(--accent-red);">Reset</a>
      <?php endif; ?>
    </form>

    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
      Total Records: <strong style="color: var(--accent-teal);"><?= count($records) ?></strong>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table" data-searchable-table>
      <thead>
        <tr>
          <th>Intel Title</th>
          <th>Industry</th>
          <th>Classification</th>
          <th>Confidence</th>
          <th>Sources</th>
          <th>Status</th>
          <th>Published Date</th>
          <th style="text-align: right;">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($records)): ?>
          <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No market intelligence records matching criteria.</td></tr>
        <?php else: ?>
          <?php foreach ($records as $r): ?>
            <tr>
              <td>
                <a href="/market-records/<?= $r['id'] ?>" style="font-weight: 700; font-size: 0.92rem;">
                  <?= htmlspecialchars($r['title']) ?>
                </a>
              </td>
              <td><span class="badge badge-neutral"><?= htmlspecialchars($r['industry']) ?></span></td>
              <td><span class="badge badge-high"><?= htmlspecialchars($r['classification']) ?></span></td>
              <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-teal);">
                <?= number_format((float)$r['confidence_score'], 1) ?>%
              </td>
              <td style="font-family: var(--font-mono); font-size: 0.8rem;">
                <?= $r['sources_count'] ?> citations
              </td>
              <td><span class="badge badge-verified"><?= htmlspecialchars($r['status']) ?></span></td>
              <td style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
                <?= date('Y-m-d', strtotime($r['created_at'])) ?>
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <a href="/market-records/<?= $r['id'] ?>" class="btn btn-outline btn-sm">Inspect</a>
                <a href="/market-records/<?= $r['id'] ?>/edit" class="btn btn-outline btn-sm">Edit</a>
                <form method="POST" action="/market-records/<?= $r['id'] ?>/delete" style="display: inline-block; margin: 0;" data-confirm="Delete market intelligence record?">
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
