<div class="panel" style="max-width: 800px; margin: 0 auto;">
  <div class="panel-header">
    <div class="panel-title">
      <span>🏢</span>
      <span>Register New Enterprise Competitor Profile</span>
    </div>
    <div class="panel-actions">
      <a href="/competitors" class="btn btn-outline btn-sm">Cancel &amp; Return</a>
    </div>
  </div>

  <div class="panel-body">
    <form method="POST" action="/competitors">
      <?= \App\Core\View::csrfField() ?>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Competitor Name *</label>
          <input type="text" name="name" class="form-control" placeholder="e.g. Nexus Enterprise Inc." required autofocus>
        </div>
        <div class="form-group">
          <label class="form-label">Stock Ticker (if public)</label>
          <input type="text" name="ticker" class="form-control" placeholder="e.g. NXUS">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Competitive Tier *</label>
          <select name="tier" class="form-control" required>
            <option value="Tier-1 Direct">Tier-1 Direct</option>
            <option value="Tier-2 Emerging">Tier-2 Emerging</option>
            <option value="Indirect Threat">Indirect Threat</option>
            <option value="Strategic Partner">Strategic Partner</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Industry / Domain Category *</label>
          <input type="text" name="category" class="form-control" placeholder="e.g. Enterprise Commerce Intelligence" required>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Threat Severity Level *</label>
          <select name="threat_level" class="form-control" required>
            <option value="Critical">Critical</option>
            <option value="High" selected>High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Market Capitalization / Valuation</label>
          <input type="text" name="market_cap" class="form-control" placeholder="e.g. $18.4B or $500M Series C">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Corporate Website</label>
          <input type="url" name="website" class="form-control" placeholder="https://competitor.com">
        </div>
        <div class="form-group">
          <label class="form-label">Headquarters Location</label>
          <input type="text" name="headquarters" class="form-control" placeholder="e.g. San Francisco, CA">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Strategic Overview &amp; Commercial Positioning *</label>
        <textarea name="overview" class="form-control" rows="5" placeholder="Detail the competitor's core value proposition, pricing structure, key accounts, and vulnerabilities..." required></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
        <a href="/competitors" class="btn btn-outline">Cancel</a>
        <button type="submit" class="btn btn-teal">
          <span>+ SAVE COMPETITOR PROFILE</span>
        </button>
      </div>
    </form>
  </div>
</div>
