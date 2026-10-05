<!-- Dossier Header -->
<div class="panel" style="margin-bottom: 1.5rem;">
  <div class="panel-body" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <h2 style="font-size: 1.75rem; color: #fff; font-weight: 700;">
          <?= htmlspecialchars($competitor['name']) ?>
        </h2>
        <?php if (!empty($competitor['ticker'])): ?>
          <span style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-teal); background: rgba(0,229,163,0.1); padding: 2px 8px; border-radius: 4px;">
            <?= htmlspecialchars($competitor['ticker']) ?>
          </span>
        <?php endif; ?>
        <span class="badge badge-<?= strtolower($competitor['threat_level']) ?>">
          <?= htmlspecialchars($competitor['threat_level']) ?> THREAT
        </span>
      </div>

      <div style="display: flex; gap: 1.25rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
        <span>Tier: <strong style="color: #fff;"><?= htmlspecialchars($competitor['tier']) ?></strong></span>
        <span>Category: <strong style="color: #fff;"><?= htmlspecialchars($competitor['category']) ?></strong></span>
        <span>HQ: <strong style="color: #fff;"><?= htmlspecialchars($competitor['headquarters'] ?: 'Undisclosed') ?></strong></span>
        <span>Valuation: <strong style="color: var(--accent-yellow);"><?= htmlspecialchars($competitor['market_cap'] ?: 'Private') ?></strong></span>
      </div>
    </div>

    <div style="display: flex; gap: 0.65rem;">
      <a href="/competitors/<?= $competitor['id'] ?>/edit" class="btn btn-outline">
        <span>✏️ Edit Profile</span>
      </a>
      <a href="/signals/create" class="btn btn-red">
        <span>📡 Log Signal</span>
      </a>
    </div>
  </div>
</div>

<!-- Overview Box -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>📑</span>
      <span>Executive Intelligence Overview</span>
    </div>
    <?php if (!empty($competitor['website'])): ?>
      <a href="<?= htmlspecialchars($competitor['website']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        Visit Corporate Portal ↗
      </a>
    <?php endif; ?>
  </div>
  <div class="panel-body">
    <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6;">
      <?= nl2br(htmlspecialchars($competitor['overview'])) ?>
    </p>
  </div>
</div>

<!-- Two-Column Layout: Signals/Products & Profile Update History -->
<div style="display: grid; grid-template-columns: 3fr 2fr; gap: 2rem;">
  
  <!-- Left: Products & Tracked Signals -->
  <div>
    <!-- Products Catalog -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>📦</span>
          <span>Cataloged Products &amp; Services (<?= count($products) ?>)</span>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Pricing Tier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($products)): ?>
              <tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No products cataloged for this competitor yet.</td></tr>
            <?php else: ?>
              <?php foreach ($products as $prod): ?>
                <tr>
                  <td><strong><?= htmlspecialchars($prod['name']) ?></strong></td>
                  <td><span class="badge badge-neutral"><?= htmlspecialchars($prod['category']) ?></span></td>
                  <td style="font-family: var(--font-mono); color: var(--accent-yellow);"><?= htmlspecialchars($prod['pricing_tier']) ?></td>
                  <td><span class="badge badge-verified"><?= htmlspecialchars($prod['status']) ?></span></td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Active Market Signals -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>📡</span>
          <span>Correlated Market Signals (<?= count($signals) ?>)</span>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Signal Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($signals)): ?>
              <tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No signals correlated with this competitor.</td></tr>
            <?php else: ?>
              <?php foreach ($signals as $s): ?>
                <tr>
                  <td><span class="badge badge-<?= strtolower($s['severity']) ?>"><?= htmlspecialchars($s['severity']) ?></span></td>
                  <td><strong><?= htmlspecialchars($s['title']) ?></strong></td>
                  <td><?= htmlspecialchars($s['category']) ?></td>
                  <td><span class="badge badge-verified"><?= htmlspecialchars($s['status']) ?></span></td>
                  <td><a href="/signals/<?= $s['id'] ?>" class="btn btn-outline btn-sm">Inspect</a></td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Right: Profile Updates & Historical Activity -->
  <div>
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>🕒</span>
          <span>Profile Update History</span>
        </div>
      </div>
      <div class="panel-body">
        
        <!-- Quick Log Form -->
        <form method="POST" action="/competitors/<?= $competitor['id'] ?>/updates" style="margin-bottom: 2rem; padding: 1rem; background: rgba(7, 12, 24, 0.6); border: 1px dashed var(--border-card); border-radius: 6px;">
          <?= \App\Core\View::csrfField() ?>
          <div style="font-weight: 700; font-size: 0.8rem; color: var(--accent-teal); margin-bottom: 0.5rem;">+ Log Strategic Intel Note</div>
          
          <div class="form-row" style="margin-bottom: 0.75rem;">
            <select name="update_type" class="form-control" style="font-size: 0.8rem; padding: 0.4rem;">
              <option value="Pricing Shift">Pricing Shift</option>
              <option value="Product Launch">Product Launch</option>
              <option value="Executive Departure">Executive Departure</option>
              <option value="Contract Win/Loss">Contract Win/Loss</option>
              <option value="General Intel Note">General Intel Note</option>
            </select>
            <input type="text" name="change_field" class="form-control" placeholder="Target Field (e.g. Rate Card)" style="font-size: 0.8rem; padding: 0.4rem;">
          </div>

          <textarea name="summary" class="form-control" rows="2" placeholder="Record raw intelligence observation..." style="font-size: 0.82rem; margin-bottom: 0.75rem;" required></textarea>
          
          <button type="submit" class="btn btn-teal btn-sm" style="width: 100%; justify-content: center;">
            Record to Timeline
          </button>
        </form>

        <!-- Chronological Timeline -->
        <ul class="timeline">
          <?php if (empty($updates)): ?>
            <li style="color: var(--text-muted); font-size: 0.85rem;">No historical updates logged yet.</li>
          <?php else: ?>
            <?php foreach ($updates as $up): ?>
              <li class="timeline-item">
                <div class="timeline-time"><?= date('M j, Y H:i', strtotime($up['created_at'])) ?> &bull; <?= htmlspecialchars($up['user_name'] ?? 'System') ?></div>
                <div class="timeline-title"><?= htmlspecialchars($up['update_type']) ?> [<?= htmlspecialchars($up['change_field']) ?>]</div>
                <div class="timeline-body"><?= htmlspecialchars($up['summary']) ?></div>
              </li>
            <?php endforeach; ?>
          <?php endif; ?>
        </ul>

      </div>
    </div>
  </div>

</div>
