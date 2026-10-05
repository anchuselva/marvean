<div style="display: flex; gap: 0.75rem; margin-bottom: 2rem;">
  <a href="/evidence/create" class="btn btn-teal">
    <span>🛡️ Deposit Evidence Document</span>
  </a>
</div>

<!-- Two Columns: Evidence Locker & Strategic Insights -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
  
  <!-- Left: Evidence Locker -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <span>🛡️</span>
        <span>Cryptographic Evidence Vault (<?= count($evidence) ?>)</span>
      </div>
      <div class="panel-actions">
        <a href="/evidence/create" class="btn btn-outline btn-sm">+ Deposit</a>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Document / Reference</th>
            <th>Type</th>
            <th>Verification Hash</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($evidence)): ?>
            <tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No evidence documents registered.</td></tr>
          <?php else: ?>
            <?php foreach ($evidence as $e): ?>
              <tr>
                <td>
                  <a href="/evidence/<?= $e['id'] ?>" style="font-weight: 700;">
                    <?= htmlspecialchars($e['title']) ?>
                  </a>
                  <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--text-muted);">
                    Ref: <?= htmlspecialchars($e['document_reference']) ?>
                  </div>
                </td>
                <td><span class="badge badge-neutral"><?= htmlspecialchars($e['evidence_type']) ?></span></td>
                <td>
                  <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-teal); background: rgba(0,229,163,0.08); padding: 2px 6px; border-radius: 4px;">
                    <?= substr($e['verification_hash'], 0, 14) ?>...
                  </span>
                </td>
                <td>
                  <a href="/evidence/<?= $e['id'] ?>" class="btn btn-outline btn-sm">Inspect</a>
                  <form method="POST" action="/evidence/<?= $e['id'] ?>/delete" style="display: inline-block; margin: 0;" data-confirm="Remove evidence document from vault?">
                    <?= \App\Core\View::csrfField() ?>
                    <button type="submit" class="btn btn-red btn-sm" style="padding: 0.2rem 0.4rem;">&times;</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Right: Strategic Insights Dossiers -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <span>⚡</span>
        <span>Strategic Insights &amp; Briefs (<?= count($insights) ?>)</span>
      </div>
    </div>
    <div class="panel-body" style="padding: 1rem 1.25rem;">
      <?php if (empty($insights)): ?>
        <p style="color: var(--text-muted); font-size: 0.85rem;">No strategic insights cataloged yet.</p>
      <?php else: ?>
        <?php foreach ($insights as $ins): ?>
          <div style="margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-card);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span class="badge badge-verified"><?= htmlspecialchars($ins['impact_rating']) ?></span>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);"><?= htmlspecialchars($ins['strategic_horizon']) ?></span>
            </div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.35rem;">
              <?= htmlspecialchars($ins['title']) ?>
            </div>
            <?php if (!empty($ins['competitor_name'])): ?>
              <div style="font-size: 0.76rem; color: var(--accent-yellow); margin-bottom: 0.35rem;">
                Target: <?= htmlspecialchars($ins['competitor_name']) ?>
              </div>
            <?php endif; ?>
            <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.65rem;">
              <?= htmlspecialchars($ins['recommendation']) ?>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
                Author: <?= htmlspecialchars($ins['creator_name'] ?? 'Senior Intel Officer') ?>
              </span>
              <form method="POST" action="/insights/<?= $ins['id'] ?>/delete" style="margin: 0;" data-confirm="Archive strategic insight?">
                <?= \App\Core\View::csrfField() ?>
                <button type="submit" class="btn btn-red btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">Archive</button>
              </form>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </div>

</div>

<!-- Historical Activity Audit Trail -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>🕒</span>
      <span>Historical Activity &amp; Governance Audit Trail</span>
    </div>
  </div>
  <div class="panel-body">
    <ul class="timeline">
      <?php foreach ($recentActivity as $act): ?>
        <li class="timeline-item">
          <div class="timeline-time"><?= date('M j, Y H:i:s', strtotime($act['created_at'])) ?> &bull; IP: <?= htmlspecialchars($act['ip_address'] ?? '127.0.0.1') ?></div>
          <div class="timeline-title">
            <span style="color: var(--accent-teal);"><?= htmlspecialchars($act['action']) ?></span> &bull; <?= htmlspecialchars($act['entity_type']) ?> #<?= $act['entity_id'] ?> (<?= htmlspecialchars($act['user_name'] ?? 'System') ?>)
          </div>
          <div class="timeline-body"><?= htmlspecialchars($act['description']) ?></div>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</div>
