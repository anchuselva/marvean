<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>🏢</span>
      <span>Enterprise Competitor Registry</span>
    </div>
    <div class="panel-actions">
      <a href="/competitors/create" class="btn btn-teal">
        <span>+ Register Competitor</span>
      </a>
    </div>
  </div>

  <!-- Filters & Search Toolbar -->
  <div style="padding: 1rem 1.5rem; background: rgba(7, 12, 24, 0.5); border-bottom: 1px solid var(--border-card); display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
    <form method="GET" action="/competitors" style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin: 0;">
      <select name="category" class="form-control" style="width: auto; padding: 0.45rem 0.75rem;">
        <option value="">All Categories</option>
        <?php foreach ($categories as $cat): ?>
          <option value="<?= htmlspecialchars($cat['category']) ?>" <?= ($category === $cat['category']) ? 'selected' : '' ?>>
            <?= htmlspecialchars($cat['category']) ?>
          </option>
        <?php endforeach; ?>
      </select>

      <select name="tier" class="form-control" style="width: auto; padding: 0.45rem 0.75rem;">
        <option value="">All Tiers</option>
        <option value="Tier-1 Direct" <?= $tier === 'Tier-1 Direct' ? 'selected' : '' ?>>Tier-1 Direct</option>
        <option value="Tier-2 Emerging" <?= $tier === 'Tier-2 Emerging' ? 'selected' : '' ?>>Tier-2 Emerging</option>
        <option value="Indirect Threat" <?= $tier === 'Indirect Threat' ? 'selected' : '' ?>>Indirect Threat</option>
        <option value="Strategic Partner" <?= $tier === 'Strategic Partner' ? 'selected' : '' ?>>Strategic Partner</option>
      </select>

      <input type="text" name="search" class="form-control" placeholder="Search competitor name..." value="<?= htmlspecialchars($search ?? '') ?>" style="width: 220px; padding: 0.45rem 0.75rem;">

      <button type="submit" class="btn btn-outline btn-sm">Filter</button>
      <?php if (!empty($category) || !empty($tier) || !empty($search)): ?>
        <a href="/competitors" class="btn btn-outline btn-sm" style="color: var(--accent-red);">Reset</a>
      <?php endif; ?>
    </form>

    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
      Total Tracked: <strong style="color: var(--accent-teal);"><?= count($competitors) ?></strong>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table" data-searchable-table>
      <thead>
        <tr>
          <th>Name / Ticker</th>
          <th>Tier</th>
          <th>Category</th>
          <th>Market Cap</th>
          <th>Threat Level</th>
          <th>Signals</th>
          <th>Products</th>
          <th>Status</th>
          <th style="text-align: right;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($competitors)): ?>
          <tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2rem;">No competitor profiles matching criteria.</td></tr>
        <?php else: ?>
          <?php foreach ($competitors as $comp): ?>
            <tr>
              <td>
                <a href="/competitors/<?= $comp['id'] ?>" style="font-weight: 700; font-size: 0.92rem;">
                  <?= htmlspecialchars($comp['name']) ?>
                </a>
                <?php if (!empty($comp['ticker'])): ?>
                  <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-teal);">
                    (<?= htmlspecialchars($comp['ticker']) ?>)
                  </span>
                <?php endif; ?>
              </td>
              <td><span class="badge badge-neutral"><?= htmlspecialchars($comp['tier']) ?></span></td>
              <td><?= htmlspecialchars($comp['category']) ?></td>
              <td style="font-family: var(--font-mono); font-size: 0.8rem;"><?= htmlspecialchars($comp['market_cap'] ?: 'Private') ?></td>
              <td>
                <span class="badge badge-<?= strtolower($comp['threat_level']) ?>">
                  <?= htmlspecialchars($comp['threat_level']) ?>
                </span>
              </td>
              <td>
                <a href="/signals?competitor_id=<?= $comp['id'] ?>" style="font-family: var(--font-mono); font-size: 0.8rem;">
                  <?= $comp['signals_count'] ?> signals
                </a>
              </td>
              <td style="font-family: var(--font-mono); font-size: 0.8rem;"><?= $comp['products_count'] ?></td>
              <td>
                <span class="badge badge-verified"><?= htmlspecialchars($comp['status']) ?></span>
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <a href="/competitors/<?= $comp['id'] ?>" class="btn btn-outline btn-sm">Dossier</a>
                <a href="/competitors/<?= $comp['id'] ?>/edit" class="btn btn-outline btn-sm">Edit</a>
                <form method="POST" action="/competitors/<?= $comp['id'] ?>/delete" style="display: inline-block; margin: 0;" data-confirm="Delete competitor <?= htmlspecialchars($comp['name']) ?> and all associated signals?">
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
