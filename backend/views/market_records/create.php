<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>📊</span>
      <span>Publish New Market Intelligence Record</span>
    </div>
    <div class="panel-actions">
      <a href="/market-records" class="btn btn-outline btn-sm">Cancel</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/market-records">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Intelligence Title *</label>
        <input type="text" name="title" class="form-control" placeholder="e.g. Enterprise Cloud Commerce Pricing Compression Analysis Q3" required autofocus>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Target Industry *</label>
          <input type="text" name="industry" class="form-control" placeholder="e.g. Enterprise SaaS & Global Commerce" required>
        </div>
        <div class="form-group">
          <label class="form-label">Governance Classification *</label>
          <select name="classification" class="form-control" required>
            <option value="Direct Pricing Audit">Direct Pricing Audit</option>
            <option value="SEC Filing">SEC Filing</option>
            <option value="Patent Registry">Patent Registry</option>
            <option value="Industry Benchmark" selected>Industry Benchmark</option>
            <option value="Earnings Call Telemetry">Earnings Call Telemetry</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Evidence Confidence Score (%) *</label>
          <input type="number" step="0.1" min="50" max="100" name="confidence_score" class="form-control" value="99.4" required>
        </div>
        <div class="form-group">
          <label class="form-label">Publication Status</label>
          <select name="status" class="form-control">
            <option value="Published" selected>Published (Authoritative)</option>
            <option value="Draft">Draft</option>
            <option value="Under Peer Review">Under Peer Review</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Executive Briefing Summary *</label>
        <textarea name="executive_summary" class="form-control" rows="3" placeholder="Core executive takeaway..." required></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Deep Strategic Analysis</label>
        <textarea name="deep_analysis" class="form-control" rows="5" placeholder="In-depth methodology, econometric breakdown, competitor exposure..."></textarea>
      </div>

      <!-- Initial Source Association -->
      <div style="padding: 1rem; background: rgba(7, 12, 24, 0.6); border: 1px dashed var(--border-card); border-radius: 6px; margin-bottom: 1.5rem;">
        <div style="font-weight: 700; font-size: 0.8rem; color: var(--accent-teal); margin-bottom: 0.75rem;">+ Primary Source Association</div>
        <div class="form-row">
          <div class="form-group" style="margin-bottom: 0.5rem;">
            <label class="form-label">Source Citation Name</label>
            <input type="text" name="source_name" class="form-control" placeholder="e.g. SEC EDGAR Form 10-Q">
          </div>
          <div class="form-group" style="margin-bottom: 0.5rem;">
            <label class="form-label">Source Type</label>
            <input type="text" name="source_type" class="form-control" placeholder="e.g. Regulatory Filing">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Source URL / Endpoint</label>
          <input type="url" name="source_url" class="form-control" placeholder="https://www.sec.gov/edgar/...">
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        <a href="/market-records" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>+ PUBLISH INTELLIGENCE RECORD</span>
        </button>
      </div>
    </form>
  </div>
</div>
