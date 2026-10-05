<!-- Signal Header -->
<div class="panel" style="margin-bottom: 1.5rem;">
  <div class="panel-body" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <span class="badge badge-<?= strtolower($signal['severity']) ?>" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
          <?= htmlspecialchars($signal['severity']) ?> SEVERITY
        </span>
        <span class="badge badge-verified"><?= htmlspecialchars($signal['status']) ?></span>
      </div>

      <h2 style="font-size: 1.6rem; color: #fff; font-weight: 700; margin-bottom: 0.5rem;">
        <?= htmlspecialchars($signal['title']) ?>
      </h2>

      <div style="display: flex; gap: 1.5rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
        <span>Target: 
          <?php if (!empty($signal['competitor_name'])): ?>
            <a href="/competitors/<?= $signal['competitor_id'] ?>" style="color: var(--accent-teal); font-weight: 700;">
              <?= htmlspecialchars($signal['competitor_name']) ?>
            </a>
          <?php else: ?>
            <strong style="color: #fff;">Sector Wide</strong>
          <?php endif; ?>
        </span>
        <span>Category: <strong style="color: #fff;"><?= htmlspecialchars($signal['category']) ?></strong></span>
        <span>Detection Latency: <strong style="color: var(--accent-teal);"><?= htmlspecialchars($signal['shift_latency']) ?></strong></span>
        <span>Confidence: <strong style="color: var(--accent-yellow);"><?= number_format((float)$signal['confidence'], 1) ?>%</strong></span>
        <span>Ingestion: <strong style="color: #fff;"><?= htmlspecialchars($signal['source_tag']) ?></strong></span>
      </div>
    </div>

    <div style="display: flex; gap: 0.65rem;">
      <a href="/signals/<?= $signal['id'] ?>/edit" class="btn btn-outline">
        <span>✏️ Edit Signal</span>
      </a>
      <a href="/signals" class="btn btn-outline">
        <span>← All Signals</span>
      </a>
    </div>
  </div>
</div>

<!-- Two Columns: Signal Telemetry & Status Lifecycle Audit -->
<div style="display: grid; grid-template-columns: 3fr 2fr; gap: 2rem;">
  
  <!-- Left: Signal Details -->
  <div>
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>📡</span>
          <span>Telemetry Evidence &amp; Impact Analysis</span>
        </div>
      </div>
      <div class="panel-body">
        <div style="padding: 1.25rem; background: rgba(7, 12, 24, 0.6); border: 1px solid var(--border-card); border-radius: 6px; font-size: 0.95rem; line-height: 1.6; color: #fff;">
          <?= nl2br(htmlspecialchars($signal['details'])) ?>
        </div>
      </div>
    </div>

    <!-- Convert to Strategic Insight Action -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>⚡</span>
          <span>Formulate Strategic Insight from this Signal</span>
        </div>
      </div>
      <div class="panel-body">
        <form method="POST" action="/insights">
          <?= \App\Core\View::csrfField() ?>
          <input type="hidden" name="competitor_id" value="<?= $signal['competitor_id'] ?? '' ?>">
          
          <div class="form-group">
            <label class="form-label">Strategic Insight Title *</label>
            <input type="text" name="title" class="form-control" value="Response Playbook: <?= htmlspecialchars($signal['title']) ?>" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Horizon *</label>
              <select name="strategic_horizon" class="form-control" required>
                <option value="Immediate (0-30d)">Immediate (0-30d)</option>
                <option value="Tactical (1-6mo)" selected>Tactical (1-6mo)</option>
                <option value="Strategic (6-18mo)">Strategic (6-18mo)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Impact Rating *</label>
              <select name="impact_rating" class="form-control" required>
                <option value="Critical Advantage">Critical Advantage</option>
                <option value="High Impact" selected>High Impact</option>
                <option value="Moderate Impact">Moderate Impact</option>
                <option value="Observation Only">Observation Only</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Actionable Response Recommendation *</label>
            <textarea name="recommendation" class="form-control" rows="3" placeholder="Define tactical counter-maneuvers for enterprise leadership..." required></textarea>
          </div>

          <button type="submit" class="btn btn-teal btn-sm">Generate Strategic Insight</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Right: Status Lifecycle & Signal History -->
  <div>
    <!-- Status Transition Box -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>🔄</span>
          <span>Signal Lifecycle State</span>
        </div>
      </div>
      <div class="panel-body">
        <form method="POST" action="/signals/<?= $signal['id'] ?>/status">
          <?= \App\Core\View::csrfField() ?>
          
          <div class="form-group">
            <label class="form-label">Transition State *</label>
            <select name="status" class="form-control" required>
              <option value="Active Alert" <?= $signal['status'] === 'Active Alert' ? 'selected' : '' ?>>Active Alert (High Priority)</option>
              <option value="Under Review" <?= $signal['status'] === 'Under Review' ? 'selected' : '' ?>>Under Review (Analyst Triaging)</option>
              <option value="Verified" <?= $signal['status'] === 'Verified' ? 'selected' : '' ?>>Verified (Evidence Confirmed)</option>
              <option value="Archived" <?= $signal['status'] === 'Archived' ? 'selected' : '' ?>>Archived (Resolved)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Transition Audit Note</label>
            <textarea name="notes" class="form-control" rows="2" placeholder="Reason for status update (e.g. Cross-referenced against 10-Q filing)..."></textarea>
          </div>

          <button type="submit" class="btn btn-teal btn-sm" style="width: 100%; justify-content: center;">
            Commit State Transition
          </button>
        </form>
      </div>
    </div>

    <!-- Signal History Timeline -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>🕒</span>
          <span>Signal History &amp; Audit Trail</span>
        </div>
      </div>
      <div class="panel-body">
        <ul class="timeline">
          <?php foreach ($history as $sh): ?>
            <li class="timeline-item">
              <div class="timeline-time"><?= date('M j, Y H:i', strtotime($sh['created_at'])) ?> &bull; <?= htmlspecialchars($sh['user_name'] ?? 'System') ?></div>
              <div class="timeline-title"><?= htmlspecialchars($sh['previous_status']) ?> &rarr; <?= htmlspecialchars($sh['new_status']) ?></div>
              <div class="timeline-body"><?= htmlspecialchars($sh['notes']) ?></div>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>
  </div>

</div>
