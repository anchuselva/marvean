/**
 * MARVEAN - AI Market & Competitive Intelligence Platform (marvean.net)
 * Core Frontend Application Logic & Interactive Intelligence Console
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSynthesizer();
  initCrtToggle();
  initWorkspaceApp();
  initIntegrationTabs();
  initPricingToggle();
  initContactTerminal();
  initFaqAccordion();
  initSystemTicker();
  initMobileNav();
  initAnchorTabLinks();
});

/* ==========================================================================
   1. Web Audio API - Retro 8-bit Sound Synthesizer (No external assets)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSynthesizer() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    soundEnabled = !soundEnabled;
    audioBtn.classList.toggle('active-toggle', soundEnabled);
    audioBtn.innerText = soundEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF';

    if (soundEnabled) {
      playArcadeSound('powerup');
    }
  });

  // Sound triggers on interactive controls
  document.querySelectorAll('button, .btn-arcade, .nav-btn, .app-tab, select').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      if (soundEnabled) playArcadeSound('hover');
    });
    elem.addEventListener('click', () => {
      if (soundEnabled) playArcadeSound('select');
    });
  });
}

function playArcadeSound(type) {
  if (!audioCtx || !soundEnabled) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'hover') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.04);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'select') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.setValueAtTime(640, now + 0.05);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'compute') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.start(now);
    osc.stop(now + 0.14);
  } else if (type === 'powerup') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now);
    osc.frequency.setValueAtTime(329.63, now + 0.06);
    osc.frequency.setValueAtTime(392.00, now + 0.12);
    osc.frequency.setValueAtTime(523.25, now + 0.18);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.28);
  }
}

/* ==========================================================================
   2. CRT Scanline Toggle
   ========================================================================== */
function initCrtToggle() {
  const crtBtn = document.getElementById('crtToggleBtn');
  if (!crtBtn) return;

  let crtActive = false;
  crtBtn.addEventListener('click', () => {
    crtActive = !crtActive;
    document.body.classList.toggle('crt-active', crtActive);
    crtBtn.querySelector('span').textContent = crtActive ? 'CRT: ON' : 'CRT: OFF';
    crtBtn.classList.toggle('active-toggle', crtActive);
  });
}

/* ==========================================================================
   3. Interactive Web Application / Intelligence Console
   ========================================================================== */

// Competitor Registry Dataset
const competitorData = [
  {
    id: 'NX-8842',
    name: 'Nexus Analytics',
    hq: 'San Francisco, CA',
    tier: 'tier-1',
    tierLabel: 'Tier 1 Direct',
    segment: 'analytics',
    score: '8.4/10',
    marketShare: '28.1%',
    products: 'Cloud BI, Predictive Forecasting, Deal Intelligence',
    pricing: 'Usage-Based (+15% revision in Q2)',
    leadership: 'Sarah Chen appointed CEO; David Lee left CTO',
    evidenceCount: 12,
    recentMove: 'Launched unannounced 15% enterprise discounting in APAC to unseat incumbents.',
    history: [
      { date: '2026 Q2', event: 'Discounted APAC Enterprise Tier by 15% (Verified via SEC Edgar)' },
      { date: '2025 Q4', event: 'Acquired PulseMetrics for $42M to enter retail analytics' },
      { date: '2025 Q1', event: 'Shifted from seat licensing to volume consumption pricing' }
    ]
  },
  {
    id: 'AD-9910',
    name: 'Acme Dynamics',
    hq: 'Boston, MA',
    tier: 'tier-1',
    tierLabel: 'Tier 1 Direct',
    segment: 'commerce',
    score: '7.8/10',
    marketShare: '22.4%',
    products: 'B2B Commerce Engine, Inventory Optimization, Order Mesh',
    pricing: 'Annual Contract + 0.8% GMV Take-rate',
    leadership: 'Marcus Brody, VP Commerce Strategy',
    evidenceCount: 8,
    recentMove: 'Filed 4 automated cart replenishment patents to defend mid-market retail base.',
    history: [
      { date: '2026 Q2', event: 'Announced Autonomous Agent Cart beta at NRF Commerce' },
      { date: '2025 Q3', event: 'Raised $65M Series C led by Highland Ventures' },
      { date: '2024 Q4', event: 'Expanded direct integration with Shopify Plus & SAP' }
    ]
  },
  {
    id: 'IS-4421',
    name: 'InnoSys Intelligence',
    hq: 'Austin, TX',
    tier: 'tier-2',
    tierLabel: 'Tier 2 Challenger',
    segment: 'analytics',
    score: '6.5/10',
    marketShare: '11.8%',
    products: 'Visual Dashboards, Executive Alert Hub, Embeddable BI',
    pricing: 'Flat Monthly Workspace ($490 - $1,200/mo)',
    leadership: 'Michael Ray, Chief Product Officer',
    evidenceCount: 6,
    recentMove: 'Aggressive pricing undercut targeting tier-2 suppliers and emerging brands.',
    history: [
      { date: '2026 Q1', event: 'Launched freemium tier with 5 user limits to capture SMB market' },
      { date: '2025 Q2', event: 'Abandoned on-premise installer in favor of pure SaaS cloud' }
    ]
  },
  {
    id: 'AX-3029',
    name: 'AdventurEx Cloud',
    hq: 'Seattle, WA',
    tier: 'tier-1',
    tierLabel: 'Tier 1 Direct',
    segment: 'cloud',
    score: '8.1/10',
    marketShare: '19.6%',
    products: 'Data Warehouse Connector, Event Broker, Streaming ETL',
    pricing: 'Compute-Hour Tiered ($0.45/vCPU/hr)',
    leadership: 'Elena Vance, Founder & CEO',
    evidenceCount: 14,
    recentMove: 'Opened Frankfurt sovereign datacenter region to comply with EU AI Act data sovereignty.',
    history: [
      { date: '2026 Q2', event: 'Achieved ISO 27001 & SOC2 Type II audit certification' },
      { date: '2025 Q4', event: 'Partnered with Snowflake on zero-copy data sharing' }
    ]
  },
  {
    id: 'SS-5512',
    name: 'Synapse Solutions',
    hq: 'New York, NY',
    tier: 'tier-2',
    tierLabel: 'Tier 2 Challenger',
    segment: 'commerce',
    score: '6.9/10',
    marketShare: '9.3%',
    products: 'Retail Search AI, Merchandising Automation, Recommendation Graph',
    pricing: 'Custom Tiered by Query Volume',
    leadership: 'Kevin Park, VP Enterprise Sales',
    evidenceCount: 5,
    recentMove: 'Acquired VectorIQ for $18M to build neural catalog search for global fashion brands.',
    history: [
      { date: '2026 Q1', event: 'Vector search patent publication under WIPO registry' },
      { date: '2025 Q3', event: 'Signed multi-year enterprise contract with major European retailer' }
    ]
  }
];

// Commercial Signals Dataset
const signalsData = [
  {
    type: 'pricing',
    typeLabel: 'PRICING SHIFT',
    competitor: 'Nexus Analytics',
    impact: 'critical',
    time: '4m ago',
    title: 'Nexus Analytics Drops APAC Enterprise Tier Pricing by 15%',
    desc: 'Automated scraping confirmed a 15% discount across multi-year contracts in Tokyo and Singapore. Direct counter-strategy recommended for field sales.',
    confidence: '98.8%',
    analyst: 'Sarah Chen',
    evidence: 'SEC Edgar 10-Q & Public Pricing API'
  },
  {
    type: 'patent',
    typeLabel: 'PATENT FILING',
    competitor: 'Acme Dynamics',
    impact: 'major',
    time: '18m ago',
    title: 'Autonomous Replenishment Agent Algorithm Published (USPTO #2026-0814)',
    desc: 'Patent covers predictive procurement triggers for B2B e-commerce platforms without human intervention.',
    confidence: '97.5%',
    analyst: 'Alex Carter',
    evidence: 'USPTO Official Gazette'
  },
  {
    type: 'leadership',
    typeLabel: 'LEADERSHIP MOVE',
    competitor: 'Nexus Analytics',
    impact: 'minor',
    time: '42m ago',
    title: 'David Lee Departs as CTO; Replaced by Former AWS Principal',
    desc: 'Executive restructuring suggests pivot toward hyperscaler cloud native architecture and real-time streaming pipelines.',
    confidence: '99.2%',
    analyst: 'Sarah Chen',
    evidence: 'Corporate 8-K Notice'
  },
  {
    type: 'launch',
    typeLabel: 'PRODUCT LAUNCH',
    competitor: 'AdventurEx Cloud',
    impact: 'major',
    time: '1h ago',
    title: 'Frankfurt Sovereign Data Pipeline Cluster Deployed',
    desc: 'Air-gapped telemetry and processing dedicated for EU banking and enterprise commerce compliance.',
    confidence: '99.4%',
    analyst: 'David Smith',
    evidence: 'Verified Press Wire & Registry'
  },
  {
    type: 'launch',
    typeLabel: 'PRODUCT LAUNCH',
    competitor: 'Synapse Solutions',
    impact: 'minor',
    time: '3h ago',
    title: 'Neural Recommendation Graph 2.0 Beta Released',
    desc: 'Self-serve catalog embedding tool launched for digital commerce merchants processing under $50M GMV.',
    confidence: '95.1%',
    analyst: 'Alex Carter',
    evidence: 'Product Beta Changelog'
  }
];

function initWorkspaceApp() {
  const tabs = document.querySelectorAll('.app-tab');
  const panels = document.querySelectorAll('.app-tab-panel');
  const searchInput = document.getElementById('appSearchInput');
  const industrySelect = document.getElementById('industryFilterSelect');
  const tierSelect = document.getElementById('tierFilterSelect');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const signalPillFilters = document.querySelectorAll('.signal-filter-pill');

  // Render initial views
  renderCompetitorCards(competitorData);
  renderSignalsFeed(signalsData);

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-app-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById('tabPanel' + capitalizeFirstLetter(tabTarget));
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Filter handlers
  function applyFilters() {
    const term = (searchInput ? searchInput.value.toLowerCase() : '');
    const industry = (industrySelect ? industrySelect.value : 'all');
    const tier = (tierSelect ? tierSelect.value : 'all');

    const filteredCompetitors = competitorData.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(term) ||
                          c.products.toLowerCase().includes(term) ||
                          c.recentMove.toLowerCase().includes(term);
      const matchIndustry = (industry === 'all') || (c.segment === industry);
      const matchTier = (tier === 'all') || (c.tier === tier);
      return matchSearch && matchIndustry && matchTier;
    });

    renderCompetitorCards(filteredCompetitors);

    const filteredSignals = signalsData.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(term) ||
                          s.competitor.toLowerCase().includes(term) ||
                          s.desc.toLowerCase().includes(term);
      return matchSearch;
    });

    renderSignalsFeed(filteredSignals);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (industrySelect) industrySelect.addEventListener('change', applyFilters);
  if (tierSelect) tierSelect.addEventListener('change', applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (industrySelect) industrySelect.value = 'all';
      if (tierSelect) tierSelect.value = 'all';
      signalPillFilters.forEach(p => p.classList.remove('active'));
      if (signalPillFilters[0]) signalPillFilters[0].classList.add('active');
      renderCompetitorCards(competitorData);
      renderSignalsFeed(signalsData);
    });
  }

  // Signal type pills
  signalPillFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      signalPillFilters.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const type = pill.getAttribute('data-event-type');

      if (type === 'all') {
        renderSignalsFeed(signalsData);
      } else {
        const filtered = signalsData.filter(s => s.type === type);
        renderSignalsFeed(filtered);
      }
    });
  });

  // Setup Modal Controls
  initCompetitorModal();
}

function renderCompetitorCards(data) {
  const container = document.getElementById('competitorCardsContainer');
  const countBadge = document.getElementById('competitorCountBadge');
  if (!container) return;

  if (countBadge) countBadge.textContent = data.length;

  if (data.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: #94a3b8; background: var(--space-card); border: 2px dashed var(--space-border);">
        <p style="font-family: var(--font-display); font-size: 0.9rem; margin-bottom: 0.5rem;">NO COMPETITOR RECORDS MATCH CURRENT FILTERS</p>
        <p style="font-size: 0.82rem;">Try adjusting your keyword search or resetting industry &amp; tier criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="competitor-card" onclick="openCompetitorDossier('${item.id}')">
      <div class="competitor-head">
        <div>
          <span class="competitor-tier-pill ${item.tier}">${item.tierLabel}</span>
          <h4 class="competitor-name">${item.name}</h4>
          <span class="competitor-hq">${item.hq} // ID: ${item.id}</span>
        </div>
        <div class="competitor-score" title="Market Leadership Score">
          ${item.score}
        </div>
      </div>

      <div class="competitor-metrics-grid">
        <div class="c-metric-item">
          <span>MARKET SHARE:</span>
          <strong>${item.marketShare}</strong>
        </div>
        <div class="c-metric-item">
          <span>EVIDENCE SOURCES:</span>
          <strong class="text-teal">${item.evidenceCount} Audited</strong>
        </div>
        <div class="c-metric-item" style="grid-column: 1 / -1;">
          <span>PRICING MODEL:</span>
          <strong class="text-yellow">${item.pricing}</strong>
        </div>
      </div>

      <div class="c-move-box">
        <strong>LATEST STRATEGIC MOVE:</strong><br>
        ${item.recentMove}
      </div>

      <div class="competitor-footer-actions">
        <span>Click card to inspect full dossier</span>
        <span class="text-teal">DOSSIER &rarr;</span>
      </div>
    </div>
  `).join('');
}

function renderSignalsFeed(data) {
  const container = document.getElementById('signalsFeedContainer');
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #94a3b8; background: var(--space-card); border: 2px dashed var(--space-border);">
        <p style="font-family: var(--font-display); font-size: 0.85rem;">NO COMMERCIAL SIGNALS FOR THIS FILTER</p>
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="signal-event-card">
      <div class="signal-impact-col">
        <span class="impact-badge ${item.impact}">${item.impact}</span>
        <span class="signal-time">${item.time}</span>
      </div>

      <div class="signal-content-col">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <div class="signal-meta-tags">
          <span>Target: <strong>${item.competitor}</strong></span>
          <span>Confidence: <strong>${item.confidence}</strong></span>
          <span>Analyst: <strong>${item.analyst}</strong></span>
          <span>Source: <strong>${item.evidence}</strong></span>
        </div>
      </div>

      <div class="signal-action-col">
        <button class="btn-arcade btn-arcade-small" onclick="event.stopPropagation(); alert('Signal alert flagged. Added to Strategic Countermeasure queue for ' + '${item.competitor}')">
          <span>FLAG MOVE</span>
        </button>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   4. Competitor Detail Modal Dossier
   ========================================================================== */
function initCompetitorModal() {
  const modal = document.getElementById('competitorModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const closeActionBtn = document.getElementById('modalCloseActionBtn');

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeActionBtn) closeActionBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

window.openCompetitorDossier = function(competitorId) {
  const item = competitorData.find(c => c.id === competitorId);
  if (!item) return;

  const modal = document.getElementById('competitorModal');
  const modalTitle = document.getElementById('modalCompanyName');
  const modalBadge = document.getElementById('modalTierBadge');
  const modalBody = document.getElementById('modalBodyContent');

  if (!modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = item.name + ' (' + item.id + ')';
  modalBadge.textContent = item.tierLabel.toUpperCase();
  modalBadge.className = 'modal-badge ' + item.tier;

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #090e1c; padding: 1rem; border: 1px solid var(--space-border);">
      <div>
        <span style="font-size: 0.72rem; color: #64748b;">GLOBAL HEADQUARTERS</span>
        <div style="font-size: 0.95rem; color: #fff; font-weight: 700;">${item.hq}</div>
      </div>
      <div>
        <span style="font-size: 0.72rem; color: #64748b;">ESTIMATED MARKET SHARE</span>
        <div style="font-size: 0.95rem; color: var(--arcade-teal); font-family: var(--font-pixel);">${item.marketShare}</div>
      </div>
      <div>
        <span style="font-size: 0.72rem; color: #64748b;">PRICING & LICENSING MODEL</span>
        <div style="font-size: 0.88rem; color: var(--arcade-yellow);">${item.pricing}</div>
      </div>
      <div>
        <span style="font-size: 0.72rem; color: #64748b;">LEADERSHIP SHIFTS</span>
        <div style="font-size: 0.88rem; color: #e2e8f0;">${item.leadership}</div>
      </div>
    </div>

    <div>
      <h4 style="font-family: var(--font-display); font-size: 0.85rem; color: var(--arcade-teal); margin-bottom: 0.4rem;">
        // PRODUCT & SERVICE SUITE
      </h4>
      <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; background: rgba(255,255,255,0.02); padding: 0.75rem; border-left: 2px solid var(--arcade-teal);">
        ${item.products}
      </p>
    </div>

    <div>
      <h4 style="font-family: var(--font-display); font-size: 0.85rem; color: var(--arcade-red); margin-bottom: 0.4rem;">
        // HISTORICAL STRATEGIC CHANGE AUDIT TRAIL
      </h4>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${item.history.map(h => `
          <div style="display: flex; gap: 0.75rem; align-items: baseline; font-size: 0.82rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.35rem;">
            <span style="font-family: var(--font-mono); color: var(--arcade-yellow); min-width: 65px;">${h.date}</span>
            <span style="color: #e2e8f0;">${h.event}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="font-size: 0.78rem; color: #64748b; background: #050811; padding: 0.6rem; border: 1px solid var(--space-border);">
      ✔ Provenance Verified: Backed by ${item.evidenceCount} primary documentation citations (SEC filings, verified web pricing, patent databases). Zero hallucination.
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  if (soundEnabled) playArcadeSound('compute');
};

window.inspectEvidence = function(projectName) {
  alert('Audited Evidence Inspection for [' + projectName + ']:\n\n- Primary Source 01: SEC Form 10-Q (Timestamp Hash: 0x88F4A19B)\n- Primary Source 02: USPTO Published Application #2026-0814\n- Primary Source 03: Direct Public Commerce Pricing Snapshot\n\nAll evidence cryptographically locked & verified with 99.2% provenance confidence.');
};

window.viewTrendDetails = function() {
  alert('Commerce Trend Observation Audit Log:\n\n- Entity Linked: 3 of 5 direct rivals actively filing conversational replenishment patents.\n- Target Sector: B2B Wholesale & High-Velocity Retail.\n- Recommended Action: Accelerate Marvean Agent Integration API.');
};

/* ==========================================================================
   5. Developer & Systems Integration Code Tabs
   ========================================================================== */
function initIntegrationTabs() {
  const tabs = document.querySelectorAll('#integrationCodeTabs .editor-tab');
  const codeDisplay = document.getElementById('integrationCodeDisplay');
  const titleElem = document.getElementById('explanationTitle');
  const descElem = document.getElementById('explanationDesc');
  const copyBtn = document.getElementById('copyCodeBtn');
  const copyBtnText = document.getElementById('copyBtnText');

  const snippets = {
    php: {
      title: 'PHP / Laravel Enterprise Integration',
      desc: 'Seamlessly query Marvean Competitor Registries and Commercial Signals from within your Laravel enterprise controllers, jobs, and scheduled commands.',
      code: `use Illuminate\\Support\\Facades\\Http;

// 1. Fetch real-time commercial signals for high-impact rivals
$response = Http::withToken(config('services.marvean.token'))
    ->withHeaders(['X-Marvean-Workspace' => 'corp-strategy'])
    ->get('https://api.marvean.net/v1/signals', [
        'impact'   => 'critical',
        'industry' => 'commerce',
        'limit'    => 25,
    ]);

$signals = $response->json('data');

// 2. Triage signals into automated sales battlecards
foreach ($signals as $signal) {
    if ($signal['type'] === 'pricing_shift') {
        event(new CompetitorPricingAlert($signal));
    }
}`
    },
    api: {
      title: 'REST API / cURL Query Endpoint',
      desc: 'Standard authenticated HTTPS REST API endpoint with strict bearer tokens and JSON response schemas.',
      code: `# 1. Query verified competitor profile dossier
curl -X GET "https://api.marvean.net/v1/competitors/NX-8842" \\
  -H "Authorization: Bearer mvn_live_8842f9a102" \\
  -H "Content-Type: application/json"

# 2. Output:
# {
#   "status": "success",
#   "id": "NX-8842",
#   "name": "Nexus Analytics",
#   "tier": "tier-1",
#   "market_share": "28.1%",
#   "confidence_score": 0.988,
#   "active_alerts": 1
# }`
    },
    python: {
      title: 'Python Analyst SDK',
      desc: 'Native client library for market researchers and quantitative strategy teams using Jupyter or Pandas.',
      code: `import marvean as mvn
import pandas as pd

# 1. Connect to enterprise intelligence repository
client = mvn.Workspace(api_key="mvn_live_8842f9a102")

# 2. Load competitor registry into DataFrame
competitors = client.competitors.list(tier="tier-1")
df = pd.DataFrame(competitors)

# 3. Compute quadrant distance & pricing shifts
pricing_changes = client.signals.filter(event_type="pricing", since="30d")
print(f"Captured {len(pricing_changes)} verified pricing movements.")`
    },
    webhook: {
      title: 'Real-Time Webhook Alert Dispatch',
      desc: 'Instant cryptographic JSON webhook dispatch to your Slack, Microsoft Teams, or custom internal message bus.',
      code: `{
  "event": "commercial_signal.detected",
  "timestamp": "2026-10-01T04:22:15Z",
  "signal_id": "SIG-99104",
  "competitor": {
    "id": "NX-8842",
    "name": "Nexus Analytics"
  },
  "event_type": "pricing_shift",
  "impact": "critical",
  "summary": "15% Enterprise Tier discount introduced in APAC",
  "confidence": 0.988,
  "sources": [
    "sec_edgar_10q_q2",
    "live_pricing_audit"
  ],
  "signature": "sha256=88f4a19b22a0c7..."
}`
    }
  };

  let activeTab = 'php';

  function updateCodeView(tabKey) {
    const data = snippets[tabKey];
    if (!data || !codeDisplay) return;

    activeTab = tabKey;
    codeDisplay.textContent = data.code;
    if (titleElem) titleElem.textContent = data.title;
    if (descElem) descElem.textContent = data.desc;

    tabs.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabKey);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-tab');
      updateCodeView(key);
    });
  });

  if (codeDisplay) {
    updateCodeView('php');
  }

  if (copyBtn && copyBtnText) {
    copyBtn.addEventListener('click', () => {
      const code = codeDisplay.textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtnText.textContent = 'COPIED!';
        if (soundEnabled) playArcadeSound('powerup');
        setTimeout(() => {
          copyBtnText.textContent = 'COPY CODE';
        }, 2000);
      });
    });
  }
}

/* ==========================================================================
   6. Pricing Period Toggle
   ========================================================================== */
function initPricingToggle() {
  const switchBtn = document.getElementById('pricingSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual = document.getElementById('labelAnnual');
  const priceVals = document.querySelectorAll('.price-val');
  if (!switchBtn) return;

  let isAnnual = false;

  switchBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    switchBtn.classList.toggle('annual', isAnnual);
    if (labelMonthly) labelMonthly.classList.toggle('active', !isAnnual);
    if (labelAnnual) labelAnnual.classList.toggle('active', isAnnual);

    priceVals.forEach(val => {
      const price = isAnnual ? val.getAttribute('data-annual') : val.getAttribute('data-monthly');
      val.textContent = price;
    });

    if (soundEnabled) playArcadeSound('select');
  });
}

/* ==========================================================================
   7. Contact & Uplink Terminal
   ========================================================================== */
function initContactTerminal() {
  const form = document.getElementById('contactForm');
  const logBox = document.getElementById('terminalLogBox');
  if (!form || !logBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const industry = document.getElementById('contactIndustry').value;

    const timeStr = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = 'terminal-line';
    entry.style.color = 'var(--arcade-teal)';
    entry.innerHTML = `&gt; [${timeStr}] UPLINK DISPATCHED FOR: ${name} &lt;${email}&gt; // SECTOR: ${industry}`;
    logBox.appendChild(entry);

    const confirmation = document.createElement('div');
    confirmation.className = 'terminal-line';
    confirmation.style.color = 'var(--arcade-yellow)';
    confirmation.innerHTML = `&gt; [${timeStr}] STRATEGY BRIEFING SCHEDULED // ACCESS CREDENTIALS ROUTED VIA MARVEAN.NET`;
    logBox.appendChild(confirmation);

    logBox.scrollTop = logBox.scrollHeight;
    if (soundEnabled) playArcadeSound('powerup');

    alert(`Thank you, ${name}. Your enterprise briefing request has been registered with Marvean Competitive Intelligence. An intelligence advisor will connect with you.`);
    form.reset();
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-answer-panel');
    const icon = item.querySelector('.faq-toggle-icon');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherTrigger = other.querySelector('.faq-trigger');
        const otherIcon = other.querySelector('.faq-toggle-icon');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '[+]';
      });

      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '[-]';
      }
    });
  });
}

/* ==========================================================================
   9. Live Telemetry Tickers
   ========================================================================== */
function initSystemTicker() {
  const pingTicker = document.getElementById('livePingTicker');
  const counter = document.getElementById('globalTokCounter');
  const throughput = document.getElementById('hudThroughput');

  setInterval(() => {
    if (pingTicker) {
      const ping = Math.floor(9 + Math.random() * 8);
      pingTicker.textContent = ping + 'ms';
    }

    if (counter) {
      const current = parseInt(counter.textContent.replace(/,/g, ''), 10) || 148290;
      const inc = Math.floor(1 + Math.random() * 3);
      counter.textContent = (current + inc).toLocaleString();
    }

    if (throughput) {
      const val = 180 + Math.floor(Math.random() * 12);
      throughput.textContent = `${val} SIGNALS / HR`;
    }
  }, 3500);
}

/* ==========================================================================
   10. Mobile Menu Drawer
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
  }

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  links.forEach(l => {
    l.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   11. Smooth Scroll & Anchor Tab Links
   ========================================================================== */
function initAnchorTabLinks() {
  document.querySelectorAll('[data-tab-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetTab = link.getAttribute('data-tab-target');
      const tabBtn = document.querySelector(`.app-tab[data-app-tab="${targetTab}"]`);
      if (tabBtn) {
        tabBtn.click();
      }
    });
  });
}

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
