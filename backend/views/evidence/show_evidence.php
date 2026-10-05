<!-- Evidence Header -->
<div class="panel" style="margin-bottom: 1.5rem;">
  <div class="panel-body" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <span class="badge badge-verified">CRYPTOGRAPHICALLY VERIFIED</span>
        <span class="badge badge-neutral"><?= htmlspecialchars($evidence['evidence_type']) ?></span>
      </div>

      <h2 style="font-size: 1.6rem; color: #fff; font-weight: 700; margin-bottom: 0.5rem;">
        <?= htmlspecialchars($evidence['title']) ?>
      </h2>

      <div style="display: flex; gap: 1.5rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
        <span>Reference ID: <strong style="color: var(--accent-yellow);"><?= htmlspecialchars($evidence['document_reference']) ?></strong></span>
        <span>Verified At: <strong style="color: #fff;"><?= date('Y-m-d H:i:s', strtotime($evidence['verified_at'])) ?></strong></span>
        <span>Custodian: <strong style="color: #fff;"><?= htmlspecialchars($evidence['creator_name'] ?? 'Senior Intel Officer') ?></strong></span>
      </div>
    </div>

    <div style="display: flex; gap: 0.65rem;">
      <a href="/evidence" class="btn btn-outline">
        <span>← Evidence Locker</span>
      </a>
    </div>
  </div>
</div>

<!-- Cryptographic Hash Banner -->
<div class="panel" style="margin-bottom: 1.5rem; border-color: var(--accent-teal); background: rgba(0, 229, 163, 0.04);">
  <div class="panel-body" style="display: flex; align-items: center; gap: 1rem;">
    <div style="font-size: 1.5rem;">🛡️</div>
    <div style="flex: 1;">
      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">
        SHA-256 Cryptographic Integrity Signature
      </div>
      <div style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--accent-teal); word-break: break-all; font-weight: 700;">
        <?= htmlspecialchars($evidence['verification_hash']) ?>
      </div>
    </div>
  </div>
</div>

<!-- Summary & Details -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>📑</span>
      <span>Audited Evidence Manifest</span>
    </div>
  </div>
  <div class="panel-body">
    <div style="font-size: 0.95rem; color: #fff; line-height: 1.7;">
      <?= nl2br(htmlspecialchars($evidence['summary'])) ?>
    </div>
  </div>
</div>

<!-- Linked Strategic Insights -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>⚡</span>
      <span>Strategic Insights Derived From This Evidence (<?= count($insights) ?>)</span>
    </div>
  </div>
  <div class="panel-body">
    <?php if (empty($insights)): ?>
      <p style="color: var(--text-muted); font-size: 0.85rem;">No strategic insights currently linked to this evidence document.</p>
    <?php else: ?>
      <?php foreach ($insights as $ins): ?>
        <div style="margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-card);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span class="badge badge-verified"><?= htmlspecialchars($ins['impact_rating']) ?></span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);"><?= htmlspecialchars($ins['strategic_horizon']) ?></span>
          </div>
          <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 0.35rem;">
            <?= htmlspecialchars($ins['title']) ?>
          </div>
          <div style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">
            <?= htmlspecialchars($ins['recommendation']) ?>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>
</div>
