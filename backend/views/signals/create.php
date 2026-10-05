<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>📡</span>
      <span>Ingest Real-Time Commercial Signal</span>
    </div>
    <div class="panel-actions">
      <a href="/signals" class="btn btn-outline btn-sm">Cancel</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/signals">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Signal Headline / Alert Title *</label>
        <input type="text" name="title" class="form-control" placeholder="e.g. Competitor Nexus dropped Enterprise Tier by 15% in APAC" required autofocus>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Target Competitor</label>
          <select name="competitor_id" class="form-control">
            <option value="">-- Sector Wide / General --</option>
            <?php foreach ($competitors as $c): ?>
              <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['name']) ?> (<?= htmlspecialchars($c['tier']) ?>)</option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Signal Category *</label>
          <select name="category" class="form-control" required>
            <option value="Pricing Shift">Pricing Shift</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Patent Filing">Patent Filing</option>
            <option value="Executive Move">Executive Move</option>
            <option value="M&A / Partnership">M&A / Partnership</option>
            <option value="Regulatory Action">Regulatory Action</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Severity Level *</label>
          <select name="severity" class="form-control" required>
            <option value="Critical">Critical</option>
            <option value="High" selected>High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Detection Latency *</label>
          <input type="text" name="shift_latency" class="form-control" value="< 15m" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Confidence Score (%)</label>
          <input type="number" step="0.1" min="50" max="100" name="confidence" class="form-control" value="99.4">
        </div>
        <div class="form-group">
          <label class="form-label">Ingestion Source / Tag</label>
          <input type="text" name="source_tag" class="form-control" placeholder="e.g. SEC Edgar Ingestion / Direct Audit" value="Direct Pricing Telemetry">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Signal Telemetry Details &amp; Raw Evidence *</label>
        <textarea name="details" class="form-control" rows="5" placeholder="Detail the observed market event, endpoints impacted, and strategic implications..." required></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/signals" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-red">
          <span>+ INGEST SIGNAL TO RADAR</span>
        </button>
      </div>
    </form>
  </div>
</div>
