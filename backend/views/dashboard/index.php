<!-- KPI Metrics Grid -->
<div class="kpi-grid">
  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">Competitors</span>
      <svg class="kpi-icon" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/></svg>
    </div>
    <div class="kpi-value"><?= $stats['competitors_count'] ?></div>
    <div class="kpi-sub">Continuous tracking</div>
  </div>

  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">Market Signals</span>
      <svg class="kpi-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49"/></svg>
    </div>
    <div class="kpi-value"><?= $stats['signals_count'] ?></div>
    <div class="kpi-sub <?= $stats['critical_signals'] > 0 ? 'critical' : '' ?>">
      <?= $stats['critical_signals'] > 0 ? $stats['critical_signals'] . ' Critical Alert' . ($stats['critical_signals'] == 1 ? '' : 's') : 'All signals monitored' ?>
    </div>
  </div>

  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">Market Records</span>
      <svg class="kpi-icon" viewBox="0 0 24 24"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
    </div>
    <div class="kpi-value"><?= $stats['market_records'] ?></div>
    <div class="kpi-sub">Audited intelligence</div>
  </div>

  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">Product Shootouts</span>
      <svg class="kpi-icon" viewBox="0 0 24 24"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/></svg>
    </div>
    <div class="kpi-value"><?= $stats['comparisons_count'] ?></div>
    <div class="kpi-sub">Active matrices</div>
  </div>

  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">Evidence Locker</span>
      <svg class="kpi-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
    </div>
    <div class="kpi-value"><?= $stats['evidence_count'] ?></div>
    <div class="kpi-sub">SHA-256 verified</div>
  </div>

  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">Strategic Briefs</span>
      <svg class="kpi-icon" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    </div>
    <div class="kpi-value"><?= $stats['insights_count'] ?></div>
    <div class="kpi-sub">Executive actions</div>
  </div>
</div>

<!-- Cohesive Action Toolbar -->
<div class="action-toolbar">
  <span class="action-toolbar-label">Quick Actions</span>
  <a href="/signals/create" class="btn btn-primary">
    <span>+ Ingest Signal</span>
  </a>
  <a href="/competitors/create" class="btn btn-secondary">
    <span>+ Register Competitor</span>
  </a>
  <a href="/market-records/create" class="btn btn-secondary">
    <span>+ Publish Market Intel</span>
  </a>
  <a href="/product-comparisons/create" class="btn btn-secondary">
    <span>+ New Shootout</span>
  </a>
  <a href="/evidence/create" class="btn btn-secondary">
    <span>+ Deposit Evidence</span>
  </a>
</div>

<!-- ============================================================================
     Visual Telemetry & Strategic Intelligence Graphs
     ============================================================================ -->
<div class="chart-grid">

  <!-- Left: Signal Velocity & Severity Trajectory Chart -->
  <div class="panel chart-panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <span>Market Signal Velocity &amp; Threat Trajectory</span>
        <span class="sys-status-badge" style="padding: 2px 7px; font-size: 0.65rem; margin-left: 6px;">LIVE TELEMETRY</span>
      </div>
      <div class="panel-actions">
        <div class="chart-range-selector" id="signalRangeSelector">
          <button type="button" class="chart-range-btn active" data-range="6m">6M</button>
          <button type="button" class="chart-range-btn" data-range="30d">30D</button>
          <button type="button" class="chart-range-btn" data-range="7d">7D</button>
        </div>
      </div>
    </div>
    <div class="panel-body">
      <!-- Live metric legend bar -->
      <div class="chart-telemetry-legend">
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background: #f43f5e; box-shadow: 0 0 8px rgba(244, 63, 94, 0.4);"></span>
          <span>Critical Threat Velocity:</span>
          <span class="chart-legend-val"><?= $stats['critical_signals'] ?> events</span>
        </div>
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);"></span>
          <span>Verified Signals:</span>
          <span class="chart-legend-val"><?= $stats['signals_count'] ?> signals</span>
        </div>
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background: #38bdf8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);"></span>
          <span>Market Intel Volume:</span>
          <span class="chart-legend-val"><?= $stats['market_records'] ?> records</span>
        </div>
      </div>

      <!-- Canvas container -->
      <div class="chart-canvas-wrap">
        <canvas id="signalVelocityChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Right: Competitor Threat & Intelligence Distribution -->
  <div class="panel chart-panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
        <span>Competitor Threat Distribution</span>
      </div>
      <div class="panel-actions">
        <span class="badge badge-neutral" style="font-family: var(--font-mono); font-size: 0.68rem;">
          <?= $stats['competitors_count'] ?> RIVALS PROFILED
        </span>
      </div>
    </div>
    <div class="panel-body">
      <!-- Doughnut Canvas with Centered Counter -->
      <div class="chart-doughnut-wrap">
        <canvas id="threatDistributionChart"></canvas>
        <div class="chart-doughnut-center">
          <div class="chart-doughnut-value"><?= $stats['competitors_count'] + $stats['signals_count'] ?></div>
          <div class="chart-doughnut-label">Indexed Entities</div>
        </div>
      </div>

      <!-- Breakdown Key -->
      <div class="threat-breakdown-list">
        <div class="threat-breakdown-row">
          <span class="threat-name">
            <span class="chart-legend-dot" style="background: #f43f5e;"></span>
            <span>Critical Threat (Apex)</span>
          </span>
          <span class="threat-count-pill" style="color: #fb7185; border-color: rgba(244,63,94,0.3); background: rgba(244,63,94,0.08);">
            <?= $threatCounts['Critical'] ?? 0 ?> (<?= $stats['competitors_count'] > 0 ? round((($threatCounts['Critical'] ?? 0) / $stats['competitors_count']) * 100) : 0 ?>%)
          </span>
        </div>
        <div class="threat-breakdown-row">
          <span class="threat-name">
            <span class="chart-legend-dot" style="background: #f59e0b;"></span>
            <span>High Priority Contenders</span>
          </span>
          <span class="threat-count-pill" style="color: #fbbf24; border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.08);">
            <?= $threatCounts['High'] ?? 0 ?> (<?= $stats['competitors_count'] > 0 ? round((($threatCounts['High'] ?? 0) / $stats['competitors_count']) * 100) : 0 ?>%)
          </span>
        </div>
        <div class="threat-breakdown-row">
          <span class="threat-name">
            <span class="chart-legend-dot" style="background: #10b981;"></span>
            <span>Moderate Watchlist</span>
          </span>
          <span class="threat-count-pill" style="color: #34d399; border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.08);">
            <?= $threatCounts['Moderate'] ?? 0 ?> (<?= $stats['competitors_count'] > 0 ? round((($threatCounts['Moderate'] ?? 0) / $stats['competitors_count']) * 100) : 0 ?>%)
          </span>
        </div>
        <div class="threat-breakdown-row">
          <span class="threat-name">
            <span class="chart-legend-dot" style="background: #64748b;"></span>
            <span>Low Risk / Passive</span>
          </span>
          <span class="threat-count-pill" style="color: #94a3b8;">
            <?= $threatCounts['Low'] ?? 0 ?> (<?= $stats['competitors_count'] > 0 ? round((($threatCounts['Low'] ?? 0) / $stats['competitors_count']) * 100) : 0 ?>%)
          </span>
        </div>
      </div>
    </div>
  </div>

</div>

<!-- Grid: Signals Stream & Strategic Briefs -->
<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
  
  <!-- Left: Real-Time Signal Stream -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49"/></svg>
        <span>Real-Time Market Signal Radar</span>
      </div>
      <div class="panel-actions">
        <a href="/signals" class="btn btn-outline btn-sm">Full Radar &rarr;</a>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Severity</th>
            <th>Title &amp; Target</th>
            <th>Category</th>
            <th>Latency</th>
            <th>Status</th>
            <th style="text-align: right;">Action</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($recentSignals)): ?>
            <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No signals recorded yet.</td></tr>
          <?php else: ?>
            <?php foreach ($recentSignals as $sig): ?>
              <tr>
                <td>
                  <span class="badge badge-<?= strtolower($sig['severity']) ?>">
                    <span class="badge-dot"></span>
                    <?= htmlspecialchars($sig['severity']) ?>
                  </span>
                </td>
                <td>
                  <div style="font-weight: 600; color: #fff; margin-bottom: 2px;"><?= htmlspecialchars($sig['title']) ?></div>
                  <div style="font-size: 0.76rem; color: var(--accent-blue);">
                    <?= htmlspecialchars($sig['competitor_name'] ?? 'General Market') ?>
                  </div>
                </td>
                <td><span class="badge badge-neutral"><?= htmlspecialchars($sig['category']) ?></span></td>
                <td style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);"><?= htmlspecialchars($sig['shift_latency']) ?></td>
                <td>
                  <span class="badge badge-<?= $sig['status'] === 'Verified' ? 'verified' : ($sig['status'] === 'Active Alert' ? 'critical' : 'high') ?>">
                    <span class="badge-dot"></span>
                    <?= htmlspecialchars($sig['status']) ?>
                  </span>
                </td>
                <td style="text-align: right;">
                  <a href="/signals/<?= $sig['id'] ?>" class="btn btn-outline btn-sm">Inspect</a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Right: Strategic Insights & Recommendations -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        <span>Active Strategic Briefs</span>
      </div>
      <div class="panel-actions">
        <a href="/evidence" class="btn btn-outline btn-sm">All Briefs &rarr;</a>
      </div>
    </div>
    <div class="panel-body">
      <?php if (empty($recentInsights)): ?>
        <p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 2rem;">No strategic briefs generated yet.</p>
      <?php else: ?>
        <?php foreach ($recentInsights as $ins): ?>
          <div class="insight-brief-item">
            <div class="insight-brief-header">
              <span class="badge badge-verified" style="font-size: 0.65rem;">
                <span class="badge-dot"></span>
                <?= htmlspecialchars($ins['impact_rating']) ?>
              </span>
              <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-dim);"><?= htmlspecialchars($ins['strategic_horizon']) ?></span>
            </div>
            <div class="insight-brief-title">
              <?= htmlspecialchars($ins['title']) ?>
            </div>
            <div class="insight-brief-desc">
              <?= htmlspecialchars($ins['recommendation']) ?>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </div>

</div>

<!-- Bottom Grid: Competitors Status & Activity Log -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
  
  <!-- Competitor Status List -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/></svg>
        <span>Competitor Radar Summary</span>
      </div>
      <div class="panel-actions">
        <a href="/competitors" class="btn btn-outline btn-sm">Registry &rarr;</a>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Competitor</th>
            <th>Tier</th>
            <th>Category</th>
            <th>Threat</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($recentCompetitors as $comp): ?>
            <tr>
              <td>
                <a href="/competitors/<?= $comp['id'] ?>" style="font-weight: 600; color: #fff;">
                  <?= htmlspecialchars($comp['name']) ?>
                </a>
                <?php if (!empty($comp['ticker'])): ?>
                  <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); margin-left: 4px;">
                    <?= htmlspecialchars($comp['ticker']) ?>
                  </span>
                <?php endif; ?>
              </td>
              <td><span class="badge badge-neutral"><?= htmlspecialchars($comp['tier']) ?></span></td>
              <td style="color: var(--text-muted); font-size: 0.8rem;"><?= htmlspecialchars($comp['category']) ?></td>
              <td>
                <span class="badge badge-<?= strtolower($comp['threat_level']) ?>">
                  <span class="badge-dot"></span>
                  <?= htmlspecialchars($comp['threat_level']) ?>
                </span>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Activity Audit Trail -->
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
        <span>Governance &amp; Audit Trail</span>
      </div>
    </div>
    <div class="panel-body">
      <ul class="timeline">
        <?php foreach ($recentActivity as $act): ?>
          <li class="timeline-item">
            <div class="timeline-time"><?= date('M j, H:i', strtotime($act['created_at'])) ?> &bull; <?= htmlspecialchars($act['user_name'] ?? 'System') ?></div>
            <div class="timeline-title"><?= htmlspecialchars($act['action']) ?> &bull; <?= htmlspecialchars($act['entity_type']) ?> #<?= $act['entity_id'] ?></div>
            <div class="timeline-body"><?= htmlspecialchars($act['description']) ?></div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>

</div>

<!-- Interactive Chart Initialization Engine -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') {
    console.warn('MARVEAN Chart Engine: Chart.js library not detected.');
    return;
  }

  // Global Executive Styling Defaults
  Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
  Chart.defaults.color = '#94a3b8';

  // --------------------------------------------------------------------------
  // 1. Signal Velocity & Severity Trajectory Chart
  // --------------------------------------------------------------------------
  const velocityCanvas = document.getElementById('signalVelocityChart');
  if (velocityCanvas) {
    const ctx = velocityCanvas.getContext('2d');

    // Create subtle vertical gradients
    const gradCritical = ctx.createLinearGradient(0, 0, 0, 240);
    gradCritical.addColorStop(0, 'rgba(244, 63, 94, 0.28)');
    gradCritical.addColorStop(0.7, 'rgba(244, 63, 94, 0.04)');
    gradCritical.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

    const gradVerified = ctx.createLinearGradient(0, 0, 0, 240);
    gradVerified.addColorStop(0, 'rgba(16, 185, 129, 0.24)');
    gradVerified.addColorStop(0.7, 'rgba(16, 185, 129, 0.03)');
    gradVerified.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const gradIntel = ctx.createLinearGradient(0, 0, 0, 240);
    gradIntel.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
    gradIntel.addColorStop(0.7, 'rgba(56, 189, 248, 0.02)');
    gradIntel.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    // Multi-Range Datasets
    const rangeData = {
      '6m': {
        labels: ['Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'],
        critical: [1, 3, 2, 4, 3, <?= max(1, (int)($stats['critical_signals'] ?? 1)) ?>],
        verified: [4, 7, 6, 9, 8, <?= max(4, (int)($stats['signals_count'] ?? 4)) ?>],
        intel: [8, 14, 12, 18, 15, <?= max(10, (int)($stats['market_records'] ?? 10)) ?>]
      },
      '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        critical: [1, 2, 1, <?= (int)($stats['critical_signals'] ?? 1) ?>],
        verified: [2, 3, 3, <?= (int)($stats['signals_count'] ?? 4) ?>],
        intel: [4, 6, 5, <?= (int)($stats['market_records'] ?? 10) ?>]
      },
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
        critical: [0, 1, 0, 1, 0, 0, <?= (int)($stats['critical_signals'] ?? 1) ?>],
        verified: [1, 1, 2, 1, 2, 0, <?= (int)($stats['signals_count'] ?? 4) ?>],
        intel: [2, 3, 2, 4, 3, 1, <?= (int)($stats['market_records'] ?? 10) ?>]
      }
    };

    const initial = rangeData['6m'];

    const velocityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: initial.labels,
        datasets: [
          {
            label: 'Critical Threats',
            data: initial.critical,
            borderColor: '#f43f5e',
            backgroundColor: gradCritical,
            borderWidth: 2.2,
            tension: 0.38,
            fill: true,
            pointBackgroundColor: '#f43f5e',
            pointBorderColor: '#090d16',
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Verified Signals',
            data: initial.verified,
            borderColor: '#10b981',
            backgroundColor: gradVerified,
            borderWidth: 2.2,
            tension: 0.38,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#090d16',
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Market Intel Volume',
            data: initial.intel,
            borderColor: '#38bdf8',
            backgroundColor: gradIntel,
            borderWidth: 2,
            borderDash: [4, 4],
            tension: 0.38,
            fill: true,
            pointBackgroundColor: '#38bdf8',
            pointBorderColor: '#090d16',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5.5,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#060910',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
            padding: 11,
            cornerRadius: 8,
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '700' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            boxPadding: 4,
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.04)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: { family: 'JetBrains Mono', size: 11 },
              stepSize: 2,
              precision: 0
            }
          }
        }
      }
    });

    // Time-range selector buttons
    const rangeButtons = document.querySelectorAll('#signalRangeSelector .chart-range-btn');
    rangeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        rangeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const range = btn.getAttribute('data-range');
        const data = rangeData[range];
        if (data) {
          velocityChart.data.labels = data.labels;
          velocityChart.data.datasets[0].data = data.critical;
          velocityChart.data.datasets[1].data = data.verified;
          velocityChart.data.datasets[2].data = data.intel;
          velocityChart.update();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Competitor Threat Distribution Doughnut Chart
  // --------------------------------------------------------------------------
  const threatCanvas = document.getElementById('threatDistributionChart');
  if (threatCanvas) {
    const threatCounts = <?= json_encode($threatCounts ?? ['Critical' => 1, 'High' => 1, 'Moderate' => 2, 'Low' => 0]) ?>;
    
    new Chart(threatCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Critical Threat (Apex)', 'High Priority Contender', 'Moderate Watchlist', 'Low Risk / Passive'],
        datasets: [{
          data: [
            threatCounts.Critical || 0,
            threatCounts.High || 0,
            threatCounts.Moderate || 0,
            threatCounts.Low || 0
          ],
          backgroundColor: [
            '#f43f5e',
            '#f59e0b',
            '#10b981',
            '#475569'
          ],
          borderColor: '#0d1527',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '74%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#060910',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: '700' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            boxPadding: 4,
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 900
        }
      }
    });
  }
});
</script>
