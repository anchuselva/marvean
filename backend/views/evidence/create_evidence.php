<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>🛡️</span>
      <span>Deposit Audited Evidence Document</span>
    </div>
    <div class="panel-actions">
      <a href="/evidence" class="btn btn-outline btn-sm">Cancel</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/evidence">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-group">
        <label class="form-label">Evidence Title *</label>
        <input type="text" name="title" class="form-control" placeholder="e.g. Nexus Enterprise Inc. Q3 2026 Form 10-Q Filing" required autofocus>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Evidence Governance Type *</label>
          <select name="evidence_type" class="form-control" required>
            <option value="SEC Filing (10-K/10-Q)">SEC Filing (10-K/10-Q)</option>
            <option value="Patent Registry Audit">Patent Registry Audit</option>
            <option value="Direct Pricing Audit" selected>Direct Pricing Audit</option>
            <option value="Antitrust / Legal Record">Antitrust / Legal Record</option>
            <option value="Earnings Telemetry Transcript">Earnings Telemetry Transcript</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Official Document Reference ID *</label>
          <input type="text" name="document_reference" class="form-control" placeholder="e.g. SEC-EDGAR-0001844910-26-000042" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Cryptographic Verification Hash (SHA-256)</label>
        <input type="text" name="verification_hash" class="form-control" placeholder="Leave empty for auto-generated SHA-256 integrity hash...">
      </div>

      <div class="form-group">
        <label class="form-label">Evidence Audit Summary &amp; Legal Fact Record *</label>
        <textarea name="summary" class="form-control" rows="5" placeholder="Detail verified corporate disclosures, audited pricing delta, patent claims, or legal filings..." required></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/evidence" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>+ DEPOSIT EVIDENCE RECORD</span>
        </button>
      </div>
    </form>
  </div>
</div>
