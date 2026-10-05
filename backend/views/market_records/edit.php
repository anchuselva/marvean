<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>📊</span>
      <span>Edit Intelligence: <?= htmlspecialchars($record['title']) ?></span>
    </div>
    <div class="panel-actions">
      <a href="/market-records/<?= $record['id'] ?>" class="btn btn-outline btn-sm">Return to Record</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/market-records/<?= $record['id'] ?>">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Intelligence Title *</label>
        <input type="text" name="title" class="form-control" value="<?= htmlspecialchars($record['title']) ?>" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Target Industry *</label>
          <input type="text" name="industry" class="form-control" value="<?= htmlspecialchars($record['industry']) ?>" required>
        </div>
        <div class="form-group">
          <label class="form-label">Classification *</label>
          <select name="classification" class="form-control" required>
            <?php foreach (['Direct Pricing Audit', 'SEC Filing', 'Patent Registry', 'Industry Benchmark', 'Earnings Call Telemetry'] as $c): ?>
              <option value="<?= $c ?>" <?= $record['classification'] === $c ? 'selected' : '' ?>><?= $c ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Confidence Score (%) *</label>
          <input type="number" step="0.1" min="50" max="100" name="confidence_score" class="form-control" value="<?= htmlspecialchars($record['confidence_score']) ?>" required>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select name="status" class="form-control">
            <?php foreach (['Published', 'Draft', 'Under Peer Review'] as $st): ?>
              <option value="<?= $st ?>" <?= $record['status'] === $st ? 'selected' : '' ?>><?= $st ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Executive Briefing Summary *</label>
        <textarea name="executive_summary" class="form-control" rows="3" required><?= htmlspecialchars($record['executive_summary']) ?></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Deep Strategic Analysis</label>
        <textarea name="deep_analysis" class="form-control" rows="5"><?= htmlspecialchars($record['deep_analysis'] ?? '') ?></textarea>
      </div>

      <div class="form-group" style="padding: 1rem; background: rgba(0, 229, 163, 0.05); border: 1px solid var(--border-card); border-radius: 6px;">
        <label class="form-label" style="color: var(--accent-teal);">Revision Log Summary (Recorded in Changelog) *</label>
        <input type="text" name="change_summary" class="form-control" placeholder="Describe the updates made in this revision..." required>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/market-records/<?= $record['id'] ?>" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>SAVE REVISION &amp; UPDATE</span>
        </button>
      </div>
    </form>
  </div>
</div>
