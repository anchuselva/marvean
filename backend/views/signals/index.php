<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>📡</span>
      <span>Real-Time Market Signal Radar</span>
    </div>
    <div class="panel-actions">
      <a href="/signals/create" class="btn btn-primary">
        <span>+ Ingest Signal Alert</span>
      </a>
    </div>
  </div>

  <!-- Filters Toolbar -->
  <div style="padding: 1rem 1.5rem; background: rgba(7, 12, 24, 0.5); border-bottom: 1px solid var(--border-card); display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
    <form method="GET" action="/signals" style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin: 0;">
      <select name="severity" class="form-control" style="width: auto; padding: 0.45rem 0.75rem;">
        <option value="">All Severities</option>
        <option value="Critical" <?= $severity === 'Critical' ? 'selected' : '' ?>>Critical</option>
        <option value="High" <?= $severity === 'High' ? 'selected' : '' ?>>High</option>
        <option value="Medium" <?= $severity === 'Medium' ? 'selected' : '' ?>>Medium</option>
        <option value="Low" <?= $severity === 'Low' ? 'selected' : '' ?>>Low</option>
      </select>

      <select name="category" class="form-control" style="width: auto; padding: 0.45rem 0.75rem;">
        <option value="">All Categories</option>
        <option value="Pricing Shift" <?= $category === 'Pricing Shift' ? 'selected' : '' ?>>Pricing Shift</option>
        <option value="Product Launch" <?= $category === 'Product Launch' ? 'selected' : '' ?>>Product Launch</option>
        <option value="Patent Filing" <?= $category === 'Patent Filing' ? 'selected' : '' ?>>Patent Filing</option>
        <option value="Executive Move" <?= $category === 'Executive Move' ? 'selected' : '' ?>>Executive Move</option>
        <option value="M&A / Partnership" <?= $category === 'M&A / Partnership' ? 'selected' : '' ?>>M&A / Partnership</option>
        <option value="Regulatory Action" <?= $category === 'Regulatory Action' ? 'selected' : '' ?>>Regulatory Action</option>
      </select>

      <select name="status" class="form-control" style="width: auto; padding: 0.45rem 0.75rem;">
        <option value="">All Lifecycle Statuses</option>
        <option value="Active Alert" <?= $status === 'Active Alert' ? 'selected' : '' ?>>Active Alert</option>
        <option value="Under Review" <?= $status === 'Under Review' ? 'selected' : '' ?>>Under Review</option>
        <option value="Verified" <?= $status === 'Verified' ? 'selected' : '' ?>>Verified</option>
        <option value="Archived" <?= $status === 'Archived' ? 'selected' : '' ?>>Archived</option>
      </select>

      <input type="text" name="search" class="form-control" placeholder="Search signal alerts..." value="<?= htmlspecialchars($search ?? '') ?>" style="width: 200px; padding: 0.45rem 0.75rem;">

      <button type="submit" class="btn btn-outline btn-sm">Filter</button>
      <?php if (!empty($severity) || !empty($category) || !empty($status) || !empty($search)): ?>
        <a href="/signals" class="btn btn-outline btn-sm" style="color: var(--accent-red);">Reset</a>
      <?php endif; ?>
    </form>

    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
      Signals Stream: <strong style="color: var(--accent-teal);"><?= count($signals) ?></strong>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table" data-searchable-table>
      <thead>
        <tr>
          <th>Severity</th>
          <th>Signal Title</th>
          <th>Competitor Target</th>
          <th>Category</th>
          <th>Latency</th>
          <th>Confidence</th>
          <th>Status</th>
          <th>Ingestion Source</th>
          <th style="text-align: right;">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($signals)): ?>
          <tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2rem;">No signal telemetry matching current filter.</td></tr>
        <?php else: ?>
          <?php foreach ($signals as $sig): ?>
            <tr>
              <td>
                <span class="badge badge-<?= strtolower($sig['severity']) ?>">
                  <?= htmlspecialchars($sig['severity']) ?>
                </span>
              </td>
              <td>
                <a href="/signals/<?= $sig['id'] ?>" style="font-weight: 700; font-size: 0.92rem;">
                  <?= htmlspecialchars($sig['title']) ?>
                </a>
              </td>
              <td>
                <?php if (!empty($sig['competitor_name'])): ?>
                  <a href="/competitors/<?= $sig['competitor_id'] ?>" style="color: #fff; font-weight: 600;">
                    <?= htmlspecialchars($sig['competitor_name']) ?>
                  </a>
                <?php else: ?>
                  <span style="color: var(--text-muted);">Global Sector</span>
                <?php endif; ?>
              </td>
              <td><span class="badge badge-neutral"><?= htmlspecialchars($sig['category']) ?></span></td>
              <td style="font-family: var(--font-mono); font-size: 0.78rem;"><?= htmlspecialchars($sig['shift_latency']) ?></td>
              <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-teal);">
                <?= number_format((float)$sig['confidence'], 1) ?>%
              </td>
              <td>
                <span class="badge badge-<?= $sig['status'] === 'Verified' ? 'verified' : ($sig['status'] === 'Active Alert' ? 'critical' : 'high') ?>">
                  <?= htmlspecialchars($sig['status']) ?>
                </span>
              </td>
              <td style="font-size: 0.76rem; color: var(--text-muted); font-family: var(--font-mono);">
                <?= htmlspecialchars($sig['source_tag']) ?>
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <a href="/signals/<?= $sig['id'] ?>" class="btn btn-outline btn-sm">Inspect</a>
                <a href="/signals/<?= $sig['id'] ?>/edit" class="btn btn-outline btn-sm">Edit</a>
                <form method="POST" action="/signals/<?= $sig['id'] ?>/delete" style="display: inline-block; margin: 0;" data-confirm="Archive/Delete this market signal alert?">
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
