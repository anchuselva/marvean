<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>📡</span>
      <span>Edit Signal #<?= $signal['id'] ?>: <?= htmlspecialchars($signal['title']) ?></span>
    </div>
    <div class="panel-actions">
      <a href="/signals/<?= $signal['id'] ?>" class="btn btn-outline btn-sm">Return to Signal</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/signals/<?= $signal['id'] ?>">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Signal Headline *</label>
        <input type="text" name="title" class="form-control" value="<?= htmlspecialchars($signal['title']) ?>" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Target Competitor</label>
          <select name="competitor_id" class="form-control">
            <option value="">-- Sector Wide / General --</option>
            <?php foreach ($competitors as $c): ?>
              <option value="<?= $c['id'] ?>" <?= $signal['competitor_id'] == $c['id'] ? 'selected' : '' ?>>
                <?= htmlspecialchars($c['name']) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Signal Category *</label>
          <select name="category" class="form-control" required>
            <?php foreach (['Pricing Shift', 'Product Launch', 'Patent Filing', 'Executive Move', 'M&A / Partnership', 'Regulatory Action'] as $cat): ?>
              <option value="<?= $cat ?>" <?= $signal['category'] === $cat ? 'selected' : '' ?>><?= $cat ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Severity Level *</label>
          <select name="severity" class="form-control" required>
            <?php foreach (['Critical', 'High', 'Medium', 'Low'] as $sev): ?>
              <option value="<?= $sev ?>" <?= $signal['severity'] === $sev ? 'selected' : '' ?>><?= $sev ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Detection Latency *</label>
          <input type="text" name="shift_latency" class="form-control" value="<?= htmlspecialchars($signal['shift_latency']) ?>" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Confidence Score (%)</label>
          <input type="number" step="0.1" min="50" max="100" name="confidence" class="form-control" value="<?= htmlspecialchars($signal['confidence']) ?>">
        </div>
        <div class="form-group">
          <label class="form-label">Ingestion Source / Tag</label>
          <input type="text" name="source_tag" class="form-control" value="<?= htmlspecialchars($signal['source_tag']) ?>">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Signal Telemetry Details *</label>
        <textarea name="details" class="form-control" rows="5" required><?= htmlspecialchars($signal['details']) ?></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/signals/<?= $signal['id'] ?>" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>UPDATE SIGNAL</span>
        </button>
      </div>
    </form>
  </div>
</div>
