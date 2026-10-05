<!-- Record Header -->
<div class="panel" style="margin-bottom: 1.5rem;">
  <div class="panel-body" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <span class="badge badge-high"><?= htmlspecialchars($record['classification']) ?></span>
        <h2 style="font-size: 1.6rem; color: #fff; font-weight: 700;">
          <?= htmlspecialchars($record['title']) ?>
        </h2>
      </div>

      <div style="display: flex; gap: 1.5rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
        <span>Industry: <strong style="color: #fff;"><?= htmlspecialchars($record['industry']) ?></strong></span>
        <span>Confidence: <strong style="color: var(--accent-teal);"><?= number_format((float)$record['confidence_score'], 1) ?>% AUDITED</strong></span>
        <span>Status: <strong style="color: #fff;"><?= htmlspecialchars($record['status']) ?></strong></span>
        <span>Published by: <strong style="color: #fff;"><?= htmlspecialchars($record['creator_name'] ?? 'Senior Intel Analyst') ?></strong></span>
      </div>
    </div>

    <div style="display: flex; gap: 0.65rem;">
      <a href="/market-records/<?= $record['id'] ?>/edit" class="btn btn-outline">
        <span>✏️ Edit Record</span>
      </a>
      <a href="/market-records" class="btn btn-outline">
        <span>← Records List</span>
      </a>
    </div>
  </div>
</div>

<!-- Intelligence Content -->
<div class="panel">
  <div class="panel-header">
    <div class="panel-title">
      <span>📑</span>
      <span>Executive Intelligence Briefing</span>
    </div>
  </div>
  <div class="panel-body">
    <div style="padding: 1.25rem; background: rgba(0, 229, 163, 0.05); border-left: 4px solid var(--accent-teal); border-radius: 4px; margin-bottom: 1.5rem; font-size: 1rem; color: #fff; line-height: 1.6;">
      <?= nl2br(htmlspecialchars($record['executive_summary'])) ?>
    </div>

    <?php if (!empty($record['deep_analysis'])): ?>
      <h3 style="font-size: 1rem; color: #fff; margin-bottom: 0.75rem; font-family: var(--font-mono);">
        // METHODOLOGICAL &amp; ECONOMETRIC ANALYSIS
      </h3>
      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.7;">
        <?= nl2br(htmlspecialchars($record['deep_analysis'])) ?>
      </p>
    <?php endif; ?>
  </div>
</div>

<!-- Two Columns: Sources & History -->
<div style="display: grid; grid-template-columns: 3fr 2fr; gap: 2rem;">
  
  <!-- Associated Sources -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <span>🔗</span>
        <span>Associated Evidence Sources (<?= count($sources) ?>)</span>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Source Citation</th>
            <th>Type</th>
            <th>Key</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($sources)): ?>
            <tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No external source citations attached yet.</td></tr>
          <?php else: ?>
            <?php foreach ($sources as $src): ?>
              <tr>
                <td><strong><?= htmlspecialchars($src['source_name']) ?></strong></td>
                <td><span class="badge badge-neutral"><?= htmlspecialchars($src['source_type']) ?></span></td>
                <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-yellow);"><?= htmlspecialchars($src['citation_key'] ?? '') ?></td>
                <td>
                  <?php if (!empty($src['source_url'])): ?>
                    <a href="<?= htmlspecialchars($src['source_url']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                      Inspect ↗
                    </a>
                  <?php else: ?>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">Internal Audit</span>
                  <?php endif; ?>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

    <!-- Quick Add Source Form -->
    <div style="padding: 1.25rem; border-top: 1px solid var(--border-card); background: rgba(7, 12, 24, 0.4);">
      <form method="POST" action="/market-records/<?= $record['id'] ?>/sources">
        <?= \App\Core\View::csrfField() ?>
        <div style="font-weight: 700; font-size: 0.8rem; color: var(--accent-teal); margin-bottom: 0.75rem;">+ Associate Regulatory / Market Citation</div>
        <div class="form-row" style="margin-bottom: 0.75rem;">
          <input type="text" name="source_name" class="form-control" placeholder="Source Citation Name *" required style="font-size: 0.82rem;">
          <input type="text" name="source_type" class="form-control" placeholder="Type (e.g. SEC Filing)" style="font-size: 0.82rem;">
        </div>
        <div class="form-row">
          <input type="url" name="source_url" class="form-control" placeholder="Citation URL" style="font-size: 0.82rem;">
          <button type="submit" class="btn btn-teal btn-sm" style="height: 38px;">Attach Source</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Revision History -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <span>🕒</span>
        <span>Intelligence Revision Changelog</span>
      </div>
    </div>
    <div class="panel-body">
      <ul class="timeline">
        <?php foreach ($history as $h): ?>
          <li class="timeline-item">
            <div class="timeline-time"><?= date('M j, Y H:i', strtotime($h['created_at'])) ?> &bull; Rev #<?= $h['revision_number'] ?></div>
            <div class="timeline-title"><?= htmlspecialchars($h['user_name'] ?? 'Senior Analyst') ?></div>
            <div class="timeline-body"><?= htmlspecialchars($h['change_summary']) ?></div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>

</div>
