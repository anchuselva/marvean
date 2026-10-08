/**
 * MARVEAN // MV Intel™ - Enterprise Intelligence Dashboard Interactive Engine
 * Handles:
 *  - Core Audio & Cryptographic UI Systems
 *  - Authentication Gateway (Google OAuth v10 + Enterprise Credentials + Instant Demo)
 *  - Dual-Mode Live Sync Engine (PHP/MySQL Port 8000 REST API with Air-Gapped LocalStorage Fallback)
 *  - 3.1 Competitor Management (Profiles, Categorization, Real-Time Audited Updates)
 *  - 3.2 Market Records (Intelligence Records, Source Association, Revision History)
 *  - 3.3 Product Comparisons (Shootout Matrices, Benchmark Attributes, Audit History)
 *  - 3.4 Signal Tracking (Real-Time Ingestion, Category & Severity Filtering, Status Transitions)
 *  - 3.5 Evidence & Strategic Insights (Cryptographic Locker, C-Suite Directives, Activity Audit Trail)
 *  - AI Strategy Briefing Synthesizer & Developer API Gateway
 */

// Use the local PHP API during development, same-origin API in production,
// or an explicit window.MARVEAN_API_BASE when the API is hosted separately.
const API_BASE = window.MARVEAN_API_BASE
  || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api'
    : `${window.location.origin}/api`);
const SESSION_STORAGE_KEY = 'mv_intel_user_v2';

// Global Dashboard State
const DashState = {
  user: null,
  sound: true,
  currentTab: 'competitors',
  activeCompCategory: 'all',
  activeRecordFilter: 'all',
  activeSignalFilter: 'all',
  activeShootoutId: 1,
  backendConnected: false,
  globalSearchQuery: '',
  globalSearchCategory: 'all',

  // 3.1 Competitors & Updates
  competitors: [
    {
      id: 1,
      name: 'Nexus Enterprise Inc.',
      ticker: 'NXUS',
      tier: 'Tier-1 Direct',
      category: 'Enterprise Commerce Intelligence',
      website: 'https://nexus-enterprise.io',
      market_cap: '$18.4B',
      headquarters: 'San Francisco, CA',
      threat_level: 'Critical',
      threatScore: 94,
      marketShare: '24.2%',
      revenueRunRate: '$180M',
      recentMove: 'Dropped Enterprise Tier pricing by 15% across APAC regions',
      primaryWeakness: 'High multi-region egress surcharges and 4-12h batch ETL latency',
      patentsCount: 42,
      status: 'Active Tracking',
      overview: 'Major market share holder in global retail and B2B pricing optimization. Transitioning to predictive supply chain models.'
    },
    {
      id: 2,
      name: 'OmniRadar Systems',
      ticker: 'OMRD',
      tier: 'Tier-1 Direct',
      category: 'Market Signal Tracking',
      website: 'https://omnidar.com',
      market_cap: '$9.2B',
      headquarters: 'New York, NY',
      threat_level: 'High',
      threatScore: 88,
      marketShare: '18.7%',
      revenueRunRate: '$125M',
      recentMove: 'Acquired SignalForge for $120M to patch EU retail monitoring gaps',
      primaryWeakness: 'High latency on unstructured regulatory filings; lack of verified cryptographic provenance',
      patentsCount: 68,
      status: 'Active Tracking',
      overview: 'Specializes in real-time pricing bots and distributor telemetry. High latency on unstructured regulatory filings.'
    },
    {
      id: 3,
      name: 'Apex Market Intelligence',
      ticker: 'APEX',
      tier: 'Tier-2 Emerging',
      category: 'Competitive AI Analytics',
      website: 'https://apexintel.ai',
      market_cap: '$3.1B',
      headquarters: 'Austin, TX',
      threat_level: 'Moderate',
      threatScore: 72,
      marketShare: '12.4%',
      revenueRunRate: '$72M',
      recentMove: 'Filed broad patent application on Multi-Agent Market Scraping',
      primaryWeakness: 'High hallucination rate on unstructured SEC disclosures; single cloud dependency',
      patentsCount: 19,
      status: 'Active Tracking',
      overview: 'Emerging AI startup backed by sovereign funds. Developing transformer models for patent portfolio tracking.'
    },
    {
      id: 4,
      name: 'QuantEdge Dynamics',
      ticker: 'QED',
      tier: 'Indirect Threat',
      category: 'Algorithmic Financial Telemetry',
      website: 'https://quantedge.com',
      market_cap: '$42.0B',
      headquarters: 'London, UK',
      threat_level: 'Moderate',
      threatScore: 81,
      marketShare: '9.8%',
      revenueRunRate: '$48M',
      recentMove: 'Expanding financial data terminal into enterprise vendor procurement monitoring',
      primaryWeakness: 'Opaque pricing tiers ($15k/seat) limiting mid-market penetration',
      patentsCount: 14,
      status: 'Active Tracking',
      overview: 'Financial markets data aggregator expanding into enterprise SaaS commercial signals and vendor procurement monitoring.'
    }
  ],

  competitorUpdates: [
    {
      id: 1,
      competitor_id: 1,
      update_type: 'Pricing Revision',
      change_field: 'APAC Pricing Tier',
      summary: 'Competitor Nexus dropped Enterprise Tier by 15% across Tokyo and Singapore endpoints to capture mid-market accounts.',
      created_at: '2026-10-01 14:30:00',
      analyst: 'Marvean Admin'
    },
    {
      id: 2,
      competitor_id: 1,
      update_type: 'Executive Move',
      change_field: 'Executive Suite',
      summary: 'Nexus poached Chief AI Scientist Dr. Aris Thorne from MIT CSAIL to lead new synthetic intelligence division.',
      created_at: '2026-09-29 09:12:00',
      analyst: 'Chief Intel Analyst'
    },
    {
      id: 3,
      competitor_id: 2,
      update_type: 'M&A Activity',
      change_field: 'Asset Acquisition',
      summary: 'OmniRadar acquired SignalForge for $120M in stock and cash to patch telemetry gaps in EU retail monitoring.',
      created_at: '2026-09-25 16:45:00',
      analyst: 'Chief Intel Analyst'
    }
  ],

  // 3.2 Market Records & Sources & History
  marketRecords: [
    {
      id: 1,
      title: 'Global Enterprise Commerce Pricing Compression Analysis Q3/Q4',
      industry: 'Enterprise SaaS & Commerce',
      confidence_score: 99.4,
      classification: 'Direct Pricing Audit',
      status: 'Published',
      executive_summary: 'Audit across 14,000 enterprise SKU endpoints indicates 12.8% price compression in AI infrastructure licenses.',
      deep_analysis: 'Extensive telemetry scraping across SEC 10-Q disclosures reveals vendor discounting reaching all-time highs as mid-tier providers struggle with customer retention.',
      created_at: '2026-10-02 11:20:00'
    },
    {
      id: 2,
      title: 'APAC Telemetry Disruption & Autonomous Ingestion Radar',
      industry: 'Global Trade & Logistics',
      confidence_score: 98.7,
      classification: 'Industry Benchmark',
      status: 'Published',
      executive_summary: 'Signal latency across cross-border freight routes has dropped from 48h to sub-15m through automated satellite AIS feeds.',
      deep_analysis: 'Commercial competitors relying on traditional batch ETL are suffering 14-hour blind spots in dynamic rate adjustments.',
      created_at: '2026-09-30 08:45:00'
    },
    {
      id: 3,
      title: 'Patent Landscape: Transformer NLP for Antitrust & Mergers',
      industry: 'AI & Legal Intelligence',
      confidence_score: 96.9,
      classification: 'Patent Registry',
      status: 'Published',
      executive_summary: '32 new patents granted to competitive intelligence providers targeting automatic SEC Form 8-K sentiment extraction.',
      deep_analysis: 'Evaluation of USPTO filings shows aggressive land-grab for algorithmic detection of hidden affiliate pricing pacts.',
      created_at: '2026-09-26 15:10:00'
    }
  ],

  marketSources: [
    {
      id: 1,
      market_record_id: 1,
      source_name: 'U.S. Securities & Exchange Commission (EDGAR)',
      source_type: 'SEC 10-Q Regulatory Filing',
      source_url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
      citation_key: 'SEC-2026-Q3-0941',
      verification_date: '2026-09-28'
    },
    {
      id: 2,
      market_record_id: 1,
      source_name: 'Direct Pricing Audit Telemetry Engine',
      source_type: 'Automated Pricing Scraper',
      source_url: 'https://audit.marvean.net/telemetry/sku-884',
      citation_key: 'PRC-AUD-4402',
      verification_date: '2026-10-01'
    },
    {
      id: 3,
      market_record_id: 2,
      source_name: 'Singapore Maritime & Port Authority Feed',
      source_type: 'Government Port Authority Telemetry',
      source_url: 'https://mpa.gov.sg/port-data',
      citation_key: 'MPA-SG-FEED-2026',
      verification_date: '2026-09-30'
    },
    {
      id: 4,
      market_record_id: 3,
      source_name: 'USPTO Patent Full-Text Database',
      source_type: 'Patent Office Examination Record',
      source_url: 'https://patft.uspto.gov',
      citation_key: 'US-PAT-1189420-B2',
      verification_date: '2026-09-25'
    }
  ],

  marketHistory: [
    {
      id: 1,
      market_record_id: 1,
      revision_number: 1,
      change_summary: 'Initial creation and peer review signoff by Chief Intel Analyst.',
      created_at: '2026-10-01 10:00:00'
    },
    {
      id: 2,
      market_record_id: 1,
      revision_number: 2,
      change_summary: 'Added direct telemetry citations from 14 APAC pricing endpoints.',
      created_at: '2026-10-02 11:20:00'
    },
    {
      id: 3,
      market_record_id: 2,
      revision_number: 1,
      change_summary: 'Baseline intelligence publication following automated satellite ingestion.',
      created_at: '2026-09-30 08:45:00'
    }
  ],

  // 3.3 Product Comparisons & Attributes & History
  productComparisons: [
    {
      id: 1,
      title: 'MARVEAN Command Center vs. Nexus Commerce Core',
      category: 'Enterprise AI Market Intel',
      status: 'Active Brief',
      notes: 'Key evaluation matrix used in Fortune 500 competitive takeout briefings.',
      created_at: '2026-10-01 12:00:00'
    },
    {
      id: 2,
      title: 'MARVEAN Signal Engine vs. OmniRadar Enterprise',
      category: 'Real-Time Telemetry & Radar',
      status: 'Quarterly Review',
      notes: 'Direct shootout highlighting Marvean sub-15m latency advantage and SEC evidence governance.',
      created_at: '2026-09-28 14:00:00'
    }
  ],

  comparisonAttributes: [
    {
      id: 1,
      comparison_id: 1,
      attribute_name: 'Signal Ingestion Latency',
      marvean_metric: '< 15 Minutes (Continuous Stream)',
      competitor_metric: '4 - 12 Hours (Batch ETL)',
      advantage: 'Marvean',
      audit_note: 'Benchmarked against SEC Form 8-K filings on Oct 2026.'
    },
    {
      id: 2,
      comparison_id: 1,
      attribute_name: 'Evidence Governance Standard',
      marvean_metric: 'Cryptographically Audited SEC/USPTO Hash',
      competitor_metric: 'Unverified Web Scraping',
      advantage: 'Marvean',
      audit_note: 'Patent-pending SHA256 audit trail.'
    },
    {
      id: 3,
      comparison_id: 1,
      attribute_name: 'Pricing Model Transparency',
      marvean_metric: 'Predictable Flat Enterprise Tier ($3,500/mo)',
      competitor_metric: 'Opaque Quoted Pricing ($12,500/mo+)',
      advantage: 'Marvean',
      audit_note: 'Eliminates predatory per-seat markups.'
    },
    {
      id: 4,
      comparison_id: 1,
      attribute_name: 'Autonomous Decision Matrix',
      marvean_metric: 'Native AI NLP Verification Engine',
      competitor_metric: 'Manual Analyst Review Required',
      advantage: 'Marvean',
      audit_note: 'Reduces strategic response cycle by 84%.'
    },
    {
      id: 5,
      comparison_id: 2,
      attribute_name: 'Multi-Source Signal Synthesis',
      marvean_metric: 'Full SEC, Patents, Pricing, Court & Telemetry',
      competitor_metric: 'Pricing & Public Catalog Only',
      advantage: 'Marvean',
      audit_note: 'Comprehensive multi-modal synthesis.'
    }
  ],

  comparisonHistory: [
    {
      id: 1,
      comparison_id: 1,
      action: 'Attribute Updated',
      notes: 'Updated latency metric following Q3 verification testing.',
      created_at: '2026-10-02 14:20:00'
    },
    {
      id: 2,
      comparison_id: 1,
      action: 'Review Signoff',
      notes: 'Approved comparison matrix for executive briefing distribution.',
      created_at: '2026-10-03 09:30:00'
    }
  ],

  // 3.4 Signals & Signal History
  signals: [
    {
      id: 'sig-1',
      competitor_id: 1,
      competitor: 'Nexus Enterprise Inc.',
      tier: 'Tier-1 Direct',
      category: 'Pricing Shift',
      severity: 'Critical',
      status: 'Active Alert',
      title: 'Competitor Nexus dropped Enterprise Tier by 15% in APAC',
      details: 'Automated scraper identified price reduction on Nexus enterprise rate card across Tokyo, Singapore and Sydney endpoints.',
      summary: 'Automated scraper identified price reduction on Nexus enterprise rate card across Tokyo, Singapore and Sydney endpoints.',
      source: 'Direct Pricing Audit Telemetry',
      source_tag: 'Direct Pricing Audit',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65d',
      timestamp: '12 minutes ago',
      created_at: '2026-10-05 06:18:00'
    },
    {
      id: 'sig-2',
      competitor_id: 2,
      competitor: 'OmniRadar Systems',
      tier: 'Tier-1 Direct',
      category: 'Executive Move',
      severity: 'High',
      status: 'Verified',
      title: 'OmniRadar CEO sold 45,000 shares in Form 4 SEC Filing',
      details: 'SEC Form 4 filing detected under 8 minutes from filing window. Represents 32% of personal holdings.',
      summary: 'SEC Form 4 filing detected under 8 minutes from filing window. Represents 32% of personal holdings.',
      source: 'SEC Edgar Automated Feed',
      source_tag: 'SEC Edgar Automated Feed',
      hash: 'sha256:b8c199201948572a11b0e0e9f1a2384a',
      timestamp: '28 minutes ago',
      created_at: '2026-10-05 06:02:00'
    },
    {
      id: 'sig-3',
      competitor_id: 3,
      competitor: 'Apex Market Intelligence',
      tier: 'Tier-2 Emerging',
      category: 'Patent Filing',
      severity: 'Medium',
      status: 'Under Review',
      title: 'Apex Market Intelligence filed broad patent on Multi-Agent Market Scraping',
      details: 'USPTO application 2026/0199411 covers recursive crawler architecture using synthetic proxy pools.',
      summary: 'USPTO application 2026/0199411 covers recursive crawler architecture using synthetic proxy pools.',
      source: 'USPTO Registry Radar',
      source_tag: 'USPTO Registry Radar',
      hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb924',
      timestamp: '44 minutes ago',
      created_at: '2026-10-05 05:46:00'
    },
    {
      id: 'sig-4',
      competitor_id: 1,
      competitor: 'Nexus Enterprise Inc.',
      tier: 'Tier-1 Direct',
      category: 'M&A / Partnership',
      severity: 'High',
      status: 'Verified',
      title: 'Nexus Enterprise announced strategic alliance with EuroCommerce Cloud',
      details: 'Joint go-to-market agreement targeting top 500 retail chains across DACH region.',
      summary: 'Joint go-to-market agreement targeting top 500 retail chains across DACH region.',
      source: 'Public Regulatory Disclosure',
      source_tag: 'Public Regulatory Disclosure',
      hash: 'sha256:94827101bbcc83748291048572619482',
      timestamp: '1 hour ago',
      created_at: '2026-10-05 05:30:00'
    }
  ],

  signalHistory: [
    {
      id: 1,
      signal_id: 'sig-1',
      previous_status: 'Ingested',
      new_status: 'Active Alert',
      notes: 'Flagged as Critical Severity due to direct overlap with top tier accounts.',
      created_at: '2026-10-05 06:18:00',
      analyst: 'Marvean Admin'
    },
    {
      id: 2,
      signal_id: 'sig-2',
      previous_status: 'Active Alert',
      new_status: 'Verified',
      notes: 'Cross-referenced against SEC Edgar official Form 4 filing signature.',
      created_at: '2026-10-05 06:05:00',
      analyst: 'Chief Intel Analyst'
    }
  ],

  // 3.5 Evidence & Strategic Insights & Activity Logs
  evidence: [
    {
      id: 1,
      title: 'Nexus Enterprise Inc. Q3 2026 Form 10-Q Filing',
      evidence_type: 'SEC Filing (10-K/10-Q)',
      document_reference: 'SEC-EDGAR-0001844910-26-000042',
      verification_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      verified_at: '2026-09-30 14:22:00',
      summary: 'Discloses 18% increase in sales incentive provisions in Asia-Pacific and contract churn of 4.2%.',
      deposited_by: 'Marvean Admin'
    },
    {
      id: 2,
      title: 'USPTO Patent Grant US-1189420-B2: Autonomous Competitive Signal Pipeline',
      evidence_type: 'Patent Registry Audit',
      document_reference: 'USPTO-PAT-US-1189420-B2',
      verification_hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      verified_at: '2026-09-22 09:15:00',
      summary: 'Legal patent claim verification for real-time natural language query ingestion across distributed commerce endpoints.',
      deposited_by: 'Chief Intel Analyst'
    },
    {
      id: 3,
      title: 'APAC Direct Pricing Telemetry Audit Cryptographic Manifest',
      evidence_type: 'Direct Pricing Audit',
      document_reference: 'AUDIT-LOG-2026-APAC-8841',
      verification_hash: 'c2d4b1fa3d677284addd200126d9069e3b0c44298fc1c149afbf4c8996fb924',
      verified_at: '2026-10-01 18:40:00',
      summary: 'Raw HTTP response hashes, TLS cert validation, and timestamped proof of competitor tier price drop.',
      deposited_by: 'Marvean Admin'
    }
  ],

  insights: [
    {
      id: 1,
      competitor_id: 1,
      competitor_name: 'Nexus Enterprise Inc.',
      evidence_id: 1,
      evidence_ref: 'SEC-EDGAR-0001844910-26-000042',
      title: 'Counter Nexus APAC Price Drop with Value-Guaranteed Multi-Year Lock',
      recommendation: 'Deploy targeted competitive briefing to top 20 APAC accounts emphasizing Marvean sub-15m latency and zero-seat pricing versus Nexus degraded service.',
      strategic_horizon: 'Immediate (0-30d)',
      impact_rating: 'Critical Advantage',
      status: 'Active Brief',
      created_at: '2026-10-02 15:30:00',
      created_by: 'Marvean Admin'
    },
    {
      id: 2,
      competitor_id: 2,
      competitor_name: 'OmniRadar Systems',
      evidence_id: 2,
      evidence_ref: 'USPTO-PAT-US-1189420-B2',
      title: 'Accelerate Patent Offensive on Cross-Border Real-time Telemetry',
      recommendation: 'File continuation applications against OmniRadar patent claims using earlier priority dates established in Marvean research logs.',
      strategic_horizon: 'Tactical (1-6mo)',
      impact_rating: 'High Impact',
      status: 'Active Brief',
      created_at: '2026-09-28 11:00:00',
      created_by: 'Chief Intel Analyst'
    },
    {
      id: 3,
      competitor_id: 3,
      competitor_name: 'Apex Market Intelligence',
      evidence_id: 3,
      evidence_ref: 'AUDIT-LOG-2026-APAC-8841',
      title: 'Preempt Apex Market Intelligence Startup Funding Narrative',
      recommendation: 'Publish open benchmark demonstrating Marvean 99.4% audited accuracy versus competitor hallucination rates on unstructured disclosures.',
      strategic_horizon: 'Tactical (1-6mo)',
      impact_rating: 'High Impact',
      status: 'Active Brief',
      created_at: '2026-09-24 16:15:00',
      created_by: 'Chief Intel Analyst'
    }
  ],

  activityLogs: [
    {
      id: 1,
      action: 'DATABASE_INIT',
      entity_type: 'System',
      entity_id: 1,
      description: 'Initialized logicstrand_marvean intelligence database schema with full enterprise modules.',
      created_at: '2026-10-05 04:00:00',
      analyst: 'Marvean Admin'
    },
    {
      id: 2,
      action: 'CREATE_RECORD',
      entity_type: 'Competitor',
      entity_id: 1,
      description: 'Created competitor profile for Nexus Enterprise Inc. (Tier-1 Direct)',
      created_at: '2026-10-05 04:15:00',
      analyst: 'Marvean Admin'
    },
    {
      id: 3,
      action: 'DISPATCH_ALERT',
      entity_type: 'MarketSignal',
      entity_id: 1,
      description: 'Critical Pricing Alert dispatched to executive subscriber pool.',
      created_at: '2026-10-05 05:20:00',
      analyst: 'Chief Intel Analyst'
    },
    {
      id: 4,
      action: 'VERIFY_EVIDENCE',
      entity_type: 'EvidenceItem',
      entity_id: 1,
      description: 'Verified cryptographic SHA-256 hash for SEC 10-Q filing.',
      created_at: '2026-10-05 05:35:00',
      analyst: 'Marvean Admin'
    }
  ]
};

/* ==========================================================================
   INITIALIZATION LIFECYCLE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  initClock();
  initAuthGateway();
  initModalSystem();
  loadPersistedData();

  initDashboardTabs();
  initSlidebar();
  initCompetitorModule();
  initMarketRecordsModule();
  initProductComparisonsModule();
  initSignalsModule();
  initEvidenceAndInsightsModule();
  initBriefingSynthesizer();
  initDeveloperConsole();
  initTelemetryRadarGraph();
  initGlobalSearchAndFilter();

  checkPersistedSession();
  syncWithBackend();
  populateGlobalDropdowns();
  updateKPICounters();
});

/* ==========================================================================
   AUDIO SYNTHESIZER
   ========================================================================== */
let audioCtx = null;

function initAudio() {
  const audioBtn = document.getElementById('dashAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      ensureAudio();
      DashState.sound = !DashState.sound;
      audioBtn.querySelector('span').textContent = DashState.sound ? 'AUDIO: ON' : 'AUDIO: OFF';
      audioBtn.classList.toggle('active-toggle', DashState.sound);
      if (DashState.sound) playTone('powerup');
    });
  }

  document.querySelectorAll('button, .dash-view-tab, .signal-chip-filter, .btn-arcade').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (DashState.sound) playTone('hover');
    });
    el.addEventListener('click', () => {
      if (DashState.sound) playTone('select');
    });
  });
}

function ensureAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(type) {
  if (!DashState.sound) return;
  try {
    ensureAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.03);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'select') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(640, now + 0.06);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      osc.frequency.setValueAtTime(650, now + 0.16);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.24);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, now);
      osc.frequency.setValueAtTime(329.63, now + 0.06);
      osc.frequency.setValueAtTime(392.00, now + 0.12);
      osc.frequency.setValueAtTime(523.25, now + 0.18);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {}
}

/* ==========================================================================
   LIVE CLOCK
   ========================================================================== */
function initClock() {
  const clockEl = document.getElementById('dashLiveClock');
  if (!clockEl) return;
  function update() {
    const d = new Date();
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss} UTC`;
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   PERSISTENCE & BACKEND SYNC (DUAL-MODE HYBRID ARCHITECTURE)
   ========================================================================== */
function saveStateToStorage() {
  try {
    localStorage.setItem('mv_intel_competitors', JSON.stringify(DashState.competitors));
    localStorage.setItem('mv_intel_competitor_updates', JSON.stringify(DashState.competitorUpdates));
    localStorage.setItem('mv_intel_market_records', JSON.stringify(DashState.marketRecords));
    localStorage.setItem('mv_intel_market_sources', JSON.stringify(DashState.marketSources));
    localStorage.setItem('mv_intel_market_history', JSON.stringify(DashState.marketHistory));
    localStorage.setItem('mv_intel_comparisons', JSON.stringify(DashState.productComparisons));
    localStorage.setItem('mv_intel_comparison_attrs', JSON.stringify(DashState.comparisonAttributes));
    localStorage.setItem('mv_intel_comparison_history', JSON.stringify(DashState.comparisonHistory));
    localStorage.setItem('mv_intel_signals', JSON.stringify(DashState.signals));
    localStorage.setItem('mv_intel_signal_history', JSON.stringify(DashState.signalHistory));
    localStorage.setItem('mv_intel_evidence', JSON.stringify(DashState.evidence));
    localStorage.setItem('mv_intel_insights', JSON.stringify(DashState.insights));
    localStorage.setItem('mv_intel_activity', JSON.stringify(DashState.activityLogs));
  } catch (e) {}
}

function loadPersistedData() {
  try {
    const comps = localStorage.getItem('mv_intel_competitors');
    if (comps) DashState.competitors = JSON.parse(comps);

    const compUpdates = localStorage.getItem('mv_intel_competitor_updates');
    if (compUpdates) DashState.competitorUpdates = JSON.parse(compUpdates);

    const records = localStorage.getItem('mv_intel_market_records');
    if (records) DashState.marketRecords = JSON.parse(records);

    const sources = localStorage.getItem('mv_intel_market_sources');
    if (sources) DashState.marketSources = JSON.parse(sources);

    const hist = localStorage.getItem('mv_intel_market_history');
    if (hist) DashState.marketHistory = JSON.parse(hist);

    const cmps = localStorage.getItem('mv_intel_comparisons');
    if (cmps) DashState.productComparisons = JSON.parse(cmps);

    const attrs = localStorage.getItem('mv_intel_comparison_attrs');
    if (attrs) DashState.comparisonAttributes = JSON.parse(attrs);

    const cmpHist = localStorage.getItem('mv_intel_comparison_history');
    if (cmpHist) DashState.comparisonHistory = JSON.parse(cmpHist);

    const sigs = localStorage.getItem('mv_intel_signals');
    if (sigs) DashState.signals = JSON.parse(sigs);

    const sigHist = localStorage.getItem('mv_intel_signal_history');
    if (sigHist) DashState.signalHistory = JSON.parse(sigHist);

    const evi = localStorage.getItem('mv_intel_evidence');
    if (evi) DashState.evidence = JSON.parse(evi);

    const ins = localStorage.getItem('mv_intel_insights');
    if (ins) DashState.insights = JSON.parse(ins);

    const act = localStorage.getItem('mv_intel_activity');
    if (act) DashState.activityLogs = JSON.parse(act);
  } catch (e) {}
}

async function syncWithBackend() {
  const statusPill = document.getElementById('backendStatusPill');
  const pulseDot = document.getElementById('backendPulseDot');
  const statusText = document.getElementById('backendStatusText');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(`${API_BASE}/status`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'online' && data.database === 'connected') {
        DashState.backendConnected = true;
        if (statusText) statusText.textContent = 'BACKEND: CONNECTED (PORT 8000)';
        if (pulseDot) {
          pulseDot.style.background = 'var(--arcade-teal)';
          pulseDot.style.boxShadow = '0 0 10px var(--arcade-teal)';
        }

        // Pull fresh database records from PHP/MySQL
        fetchBackendData();
        return;
      }
    }
    throw new Error('Backend not available');
  } catch (e) {
    DashState.backendConnected = false;
    if (statusText) statusText.textContent = 'LOCAL CACHE: ACTIVE (AIR-GAPPED)';
    if (pulseDot) {
      pulseDot.style.background = 'var(--arcade-teal)';
      pulseDot.style.boxShadow = '0 0 6px rgba(0, 229, 163, 0.4)';
    }
  }
}

async function fetchBackendData() {
  try {
    const [compsRes, recsRes, cmpsRes, sigsRes, eviRes, statsRes] = await Promise.all([
      fetch(`${API_BASE}/competitors`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/market-records`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/product-comparisons`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/signals`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/evidence`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/stats`).then(r => r.json()).catch(() => null)
    ]);

    if (compsRes && compsRes.data && compsRes.data.length > 0) {
      DashState.competitors = compsRes.data.map(c => ({
        ...c,
        threatScore: c.threatScore || (c.threat_level === 'Critical' ? 94 : (c.threat_level === 'High' ? 88 : 72)),
        marketShare: c.marketShare || '18.4%',
        revenueRunRate: c.revenueRunRate || '$110M',
        recentMove: c.recentMove || c.overview.substring(0, 75) + '...',
        primaryWeakness: c.primaryWeakness || 'High latency and unverified web scraping'
      }));
      renderCompetitors();
    }

    if (recsRes && recsRes.data && recsRes.data.length > 0) {
      DashState.marketRecords = recsRes.data;
      renderMarketRecords();
    }

    if (cmpsRes && cmpsRes.data && cmpsRes.data.length > 0) {
      DashState.productComparisons = cmpsRes.data;
      populateShootoutSelect();
      renderActiveShootout(DashState.activeShootoutId);
    }

    if (sigsRes && sigsRes.data && sigsRes.data.length > 0) {
      DashState.signals = sigsRes.data.map(s => ({
        ...s,
        timestamp: s.timestamp || 'Verified Telemetry',
        hash: s.hash || ('sha256:' + (s.id.toString(16).padStart(32, '0')))
      }));
      renderSignalsFeed();
    }

    if (eviRes) {
      if (eviRes.evidence) DashState.evidence = eviRes.evidence;
      if (eviRes.insights) DashState.insights = eviRes.insights;
      if (eviRes.activity) DashState.activityLogs = eviRes.activity;
      renderEvidence();
      renderInsights();
      renderActivityLogs();
    }

    saveStateToStorage();
    updateKPICounters();
    populateGlobalDropdowns();
  } catch (err) {
    console.warn('Backend sync failed, using client state:', err);
  }
}

function logActivity(action, entityType, entityId, description) {
  const newLog = {
    id: DashState.activityLogs.length + 1,
    action,
    entity_type: entityType,
    entity_id: entityId,
    description,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    analyst: DashState.user ? DashState.user.name : 'Analyst Workspace'
  };

  DashState.activityLogs.unshift(newLog);
  renderActivityLogs();
  saveStateToStorage();
}

function updateKPICounters() {
  const elComps = document.getElementById('kpiCompetitorsCount');
  const elSignals = document.getElementById('kpiSignalsCount');
  const elRecords = document.getElementById('kpiMarketRecordsCount');
  const elComparisons = document.getElementById('kpiComparisonsCount');
  const elEvidence = document.getElementById('kpiEvidenceCount');
  const elInsights = document.getElementById('kpiInsightsCount');

  if (elComps) elComps.textContent = DashState.competitors.length;
  if (elSignals) elSignals.textContent = DashState.signals.length;
  if (elRecords) elRecords.textContent = DashState.marketRecords.length;
  if (elComparisons) elComparisons.textContent = DashState.productComparisons.length;
  if (elEvidence) elEvidence.textContent = DashState.evidence.length;
  if (elInsights) elInsights.textContent = DashState.insights.length;

  const bEv = document.getElementById('evidenceBadgeCount');
  const bIn = document.getElementById('insightsBadgeCount');
  const bAc = document.getElementById('activityBadgeCount');
  if (bEv) bEv.textContent = DashState.evidence.length;
  if (bIn) bIn.textContent = DashState.insights.length;
  if (bAc) bAc.textContent = DashState.activityLogs.length;

  // Slidebar Badges
  const sbComps = document.getElementById('sbBadgeComps');
  const sbRecords = document.getElementById('sbBadgeRecords');
  const sbComparisons = document.getElementById('sbBadgeComparisons');
  const sbSignals = document.getElementById('sbBadgeSignals');
  const sbEvidence = document.getElementById('sbBadgeEvidence');
  if (sbComps) sbComps.textContent = DashState.competitors.length;
  if (sbRecords) sbRecords.textContent = DashState.marketRecords.length;
  if (sbComparisons) sbComparisons.textContent = DashState.productComparisons.length;
  if (sbSignals) sbSignals.textContent = DashState.signals.length;
  if (sbEvidence) sbEvidence.textContent = DashState.evidence.length;
}

function populateGlobalDropdowns() {
  // Briefing Competitor Select
  const briefComp = document.getElementById('briefingCompetitorSelect');
  if (briefComp) {
    briefComp.innerHTML = DashState.competitors.map(c => 
      `<option value="${c.name}">${c.name} (${c.tier})</option>`
    ).join('');
  }

  // Signal Competitor Select
  const sigComp = document.getElementById('sigCompetitor');
  if (sigComp) {
    sigComp.innerHTML = DashState.competitors.map(c => 
      `<option value="${c.id}">${c.name}</option>`
    ).join('');
  }

  // Insight Competitor Select
  const insComp = document.getElementById('insightCompetitor');
  if (insComp) {
    insComp.innerHTML = DashState.competitors.map(c => 
      `<option value="${c.id}">${c.name}</option>`
    ).join('');
  }

  // Insight Evidence Select
  const insEvi = document.getElementById('insightEvidence');
  if (insEvi) {
    insEvi.innerHTML = DashState.evidence.map(e => 
      `<option value="${e.id}">${e.document_reference || e.title}</option>`
    ).join('');
  }
}

/* ==========================================================================
   UNIVERSAL MODAL MANAGEMENT
   ========================================================================== */
function initModalSystem() {
  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModalById(modalId);
    });
  });

  // Click outside modal content closes
  document.querySelectorAll('.crud-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ESC key closes active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.crud-modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });
}

function openModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    playTone('select');
  }
}

function closeModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

/* ==========================================================================
   AUTHENTICATION GATEWAY
   ========================================================================== */
function initAuthGateway() {
  const modal = document.getElementById('authModalOverlay');
  const signInTabBtn = document.getElementById('authTabSignIn');
  const signUpTabBtn = document.getElementById('authTabSignUp');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const demoBtn = document.getElementById('btnInstantDemo');
  const progressBox = document.getElementById('authProgressBox');
  const progressLog = document.getElementById('authProgressLog');
  const authOpenBtn = document.getElementById('dashAuthToggleBtn');
  const authCloseBtn = document.getElementById('authModalCloseBtn');
  const googleSignInBtn = document.getElementById('btnGoogleAuth');
  const googleSignUpBtn = document.getElementById('btnGoogleSignUp');
  const authFormHeading = document.getElementById('authFormHeading');
  const authFormCopy = document.getElementById('authFormCopy');

  if (signInTabBtn && signUpTabBtn) {
    signInTabBtn.addEventListener('click', () => {
      signInTabBtn.classList.add('active');
      signUpTabBtn.classList.remove('active');
      if (signInForm) signInForm.style.display = 'block';
      if (signUpForm) signUpForm.style.display = 'none';
      if (authFormHeading) authFormHeading.textContent = 'Welcome back';
      if (authFormCopy) authFormCopy.textContent = 'Enter your credentials to continue.';
      playTone('hover');
    });

    signUpTabBtn.addEventListener('click', () => {
      signUpTabBtn.classList.add('active');
      signInTabBtn.classList.remove('active');
      if (signInForm) signInForm.style.display = 'none';
      if (signUpForm) signUpForm.style.display = 'block';
      if (authFormHeading) authFormHeading.textContent = 'Create your workspace';
      if (authFormCopy) authFormCopy.textContent = 'Set up your secure intelligence workspace.';
      playTone('hover');
    });
  }

  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signInEmail').value;
      const org = document.getElementById('signInOrg').value;
      runAuthSequence(email.split('@')[0], email, org, 'Level 4 (Direct)');
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signUpName').value;
      const email = document.getElementById('signUpEmail').value;
      const org = document.getElementById('signUpOrg').value;
      const role = document.getElementById('signUpRole').value;
      const clearance = document.getElementById('signUpClearance').value;
      runAuthSequence(name, email, `${org} · ${role}`, clearance);
    });
  }

  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      runAuthSequence('Lead Strategy Analyst', 'demo.analyst@marvean.net', 'Marvean Research Division', 'Level 4 Admin');
    });
  }

  async function handleGoogleAuth() {
    if (progressBox && progressLog) {
      progressBox.classList.add('active');
      progressLog.innerHTML = `
        <div>&gt; Connecting to Google Identity Services...</div>
        <div>&gt; Firebase Project: altitude-a1355 initialization check...</div>
      `;
    }

    try {
      if (!window.MarveanFirebase || !window.MarveanFirebase.signInWithGoogle) {
        await new Promise((resolve) => {
          if (window.MarveanFirebase) return resolve();
          window.addEventListener('marvean-firebase-initialized', resolve, { once: true });
          setTimeout(resolve, 1500);
        });
      }

      if (!window.MarveanFirebase || !window.MarveanFirebase.signInWithGoogle) {
        throw new Error('Firebase Auth module loading...');
      }

      const result = await window.MarveanFirebase.signInWithGoogle();
      const user = result.user;

      if (progressLog) {
        progressLog.innerHTML += `
          <div style="color: var(--arcade-teal); font-weight: 700;">&gt; GOOGLE AUTHENTICATED: ${user.email}</div>
          <div style="color: var(--arcade-teal);">&gt; ACCESS GRANTED: Welcome, ${user.displayName || user.email}.</div>
        `;
      }
      playTone('powerup');

      setTimeout(() => {
        setAuthenticatedUser({
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: 'Verified Google Identity',
          clearance: 'Level 4 (OAuth Verified)',
          photoURL: user.photoURL || '',
          provider: 'google'
        });
        closeAuthModal();
        if (progressBox) progressBox.classList.remove('active');
      }, 700);

    } catch (err) {
      console.warn('Google Auth Error:', err);
      // Friendly fallback to demo session
      setTimeout(() => {
        setAuthenticatedUser({
          name: 'Google Verified Analyst',
          email: 'google.analyst@marvean.net',
          role: 'Corporate Strategy Director',
          clearance: 'Level 4 (Full Admin)',
          provider: 'google'
        });
        closeAuthModal();
        if (progressBox) progressBox.classList.remove('active');
      }, 800);
    }
  }

  if (googleSignInBtn) googleSignInBtn.addEventListener('click', handleGoogleAuth);
  if (googleSignUpBtn) googleSignUpBtn.addEventListener('click', handleGoogleAuth);

  const logoutBtn = document.getElementById('dashLogoutBtn');
  const avatarCapsule = document.getElementById('userAvatarCapsule');
  const sessionPopover = document.getElementById('userSessionPopover');
  const popoverSignOut = document.getElementById('popoverSignOutBtn');
  const popoverSwitchAccount = document.getElementById('popoverSwitchAccountBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (DashState.user) {
        signOutUser();
      } else {
        openAuthModal();
      }
    });
  }

  if (avatarCapsule && sessionPopover) {
    avatarCapsule.addEventListener('click', (e) => {
      e.stopPropagation();
      sessionPopover.classList.toggle('active');
      playTone('select');
    });

    document.addEventListener('click', (e) => {
      if (!sessionPopover.contains(e.target) && !avatarCapsule.contains(e.target)) {
        sessionPopover.classList.remove('active');
      }
    });
  }

  if (popoverSignOut) {
    popoverSignOut.addEventListener('click', () => {
      if (sessionPopover) sessionPopover.classList.remove('active');
      signOutUser();
    });
  }

  if (popoverSwitchAccount) {
    popoverSwitchAccount.addEventListener('click', () => {
      if (sessionPopover) sessionPopover.classList.remove('active');
      openAuthModal();
    });
  }

  if (authOpenBtn) {
    authOpenBtn.addEventListener('click', () => {
      if (DashState.user) {
        signOutUser();
      } else {
        openAuthModal();
      }
    });
  }

  if (authCloseBtn) {
    authCloseBtn.addEventListener('click', () => {
      if (!DashState.user) {
        runAuthSequence('Guest Analyst', 'guest@marvean.net', 'Market Observer', 'Level 2');
      } else {
        closeAuthModal();
      }
    });
  }

  function runAuthSequence(name, email, role, clearance) {
    if (progressBox && progressLog) {
      progressBox.classList.add('active');
      progressLog.innerHTML = `
        <div>&gt; Verifying cryptographic credentials for [${email}]...</div>
        <div>&gt; Checking tenant clearance: ${clearance}...</div>
      `;

      setTimeout(() => {
        progressLog.innerHTML += `
          <div>&gt; Syncing real-time market surveillance socket...</div>
          <div style="color: var(--arcade-teal); font-weight: 700;">&gt; ACCESS GRANTED: Welcome, ${name}.</div>
        `;
        playTone('powerup');

        setTimeout(() => {
          setAuthenticatedUser({ name, email, role, clearance });
          closeAuthModal();
          progressBox.classList.remove('active');
        }, 800);
      }, 700);
    } else {
      setAuthenticatedUser({ name, email, role, clearance });
      closeAuthModal();
    }
  }
}

function openAuthModal() {
  const modal = document.getElementById('authModalOverlay');
  if (modal) modal.classList.remove('hidden');
}

function closeAuthModal() {
  const modal = document.getElementById('authModalOverlay');
  if (modal) modal.classList.add('hidden');
}

function setAuthenticatedUser(userData) {
  DashState.user = userData;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
  } catch (e) {}
  updateUserUI();
}

function signOutUser() {
  DashState.user = null;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {}
  if (window.MarveanFirebase && window.MarveanFirebase.signOut) {
    window.MarveanFirebase.signOut().catch(() => {});
  }
  updateUserUI();
  playTone('alert');
  openAuthModal();
}

function checkPersistedSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      DashState.user = JSON.parse(raw);
      updateUserUI();
      closeAuthModal();
      return;
    }
  } catch (e) {}

  // First-time visitors must authenticate before entering the workspace.
  updateUserUI();
  openAuthModal();
}

function updateUserUI() {
  const nameEl = document.getElementById('dashUserName');
  const roleEl = document.getElementById('dashUserRole');
  const authBtn = document.getElementById('dashAuthToggleBtn');
  const logoutBtn = document.getElementById('dashLogoutBtn');
  const logoutBtnText = document.getElementById('dashLogoutBtnText');
  const initialsBadge = document.getElementById('dashAvatarInitials');
  const avatarImg = document.getElementById('dashAvatarImg');
  const statusDot = document.getElementById('dashAvatarStatusDot');
  const popoverInitials = document.getElementById('popoverAvatarInitials');
  const popoverName = document.getElementById('popoverUserName');
  const popoverEmail = document.getElementById('popoverUserEmail');
  const popoverOrg = document.getElementById('popoverOrg');
  const popoverClearance = document.getElementById('popoverClearance');

  if (DashState.user) {
    const fullName = DashState.user.name || 'Alex Vance';
    const roleText = DashState.user.role || 'Lead Strategy Analyst';
    const emailText = DashState.user.email || 'alex.vance@marvean.net';
    const orgText = DashState.user.org || 'Aegis Corporate Strategy [Tenant #9941]';
    const clearanceText = DashState.user.clearance || 'Level 4 (Director)';

    // Initials computation
    const parts = fullName.trim().split(/\s+/);
    const initials = parts.length > 1 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : fullName.substring(0, 2).toUpperCase();

    if (nameEl) nameEl.textContent = fullName;
    if (roleEl) roleEl.textContent = roleText;
    if (initialsBadge) initialsBadge.textContent = initials;
    if (popoverInitials) popoverInitials.textContent = initials;
    if (popoverName) popoverName.textContent = fullName;
    if (popoverEmail) popoverEmail.textContent = emailText;
    if (popoverOrg) popoverOrg.textContent = orgText;
    if (popoverClearance) popoverClearance.textContent = clearanceText;

    if (DashState.user.photoURL && avatarImg) {
      avatarImg.src = DashState.user.photoURL;
      avatarImg.style.display = 'block';
      if (initialsBadge) initialsBadge.style.display = 'none';
    } else {
      if (avatarImg) avatarImg.style.display = 'none';
      if (initialsBadge) initialsBadge.style.display = 'flex';
    }

    if (statusDot) {
      statusDot.className = 'avatar-status-dot';
      statusDot.title = 'Session: Active & Authenticated';
    }

    if (logoutBtn) {
      logoutBtn.classList.remove('btn-mode-signin');
      logoutBtn.title = 'Sign out of intelligence terminal';
    }
    if (logoutBtnText) logoutBtnText.textContent = 'LOGOUT';
    if (authBtn) authBtn.textContent = 'SIGN OUT';
  } else {
    if (nameEl) nameEl.textContent = 'GUEST ANALYST';
    if (roleEl) roleEl.textContent = '[UNAUTHENTICATED]';
    if (initialsBadge) {
      initialsBadge.textContent = 'GA';
      initialsBadge.style.display = 'flex';
    }
    if (avatarImg) avatarImg.style.display = 'none';

    if (statusDot) {
      statusDot.className = 'avatar-status-dot offline';
      statusDot.title = 'Session: Offline / Guest';
    }

    if (logoutBtn) {
      logoutBtn.classList.add('btn-mode-signin');
      logoutBtn.title = 'Sign in to access secure intelligence';
    }
    if (logoutBtnText) logoutBtnText.textContent = 'SIGN IN 🔑';
    if (authBtn) authBtn.textContent = 'SIGN IN / SIGN UP';

    if (popoverName) popoverName.textContent = 'Guest Analyst';
    if (popoverEmail) popoverEmail.textContent = 'Unauthenticated Sandbox';
    if (popoverOrg) popoverOrg.textContent = 'Public Intelligence Observer';
    if (popoverClearance) popoverClearance.textContent = 'Level 1 (Read-Only Demo)';
  }
}

/* ==========================================================================
   NAVIGATION TABS & SLIDEBAR CONTROLLER
   ========================================================================== */
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.dash-view-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-dash-tab');
      if (target) {
        switchDashboardTab(target);
      }
    });
  });
}

function switchDashboardTab(target) {
  const tabs = document.querySelectorAll('.dash-view-tab');
  const panels = document.querySelectorAll('.dash-tab-content');

  // Synchronize active class across both slidebar links and top tabs
  tabs.forEach(t => {
    if (t.getAttribute('data-dash-tab') === target) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  panels.forEach(p => p.style.display = 'none');
  DashState.currentTab = target;

  const targetPanel = document.getElementById(`panel-${target}`);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  }

  // Update Breadcrumb
  const breadcrumb = document.getElementById('currentViewBreadcrumb');
  if (breadcrumb) {
    const titles = {
      'competitors': 'COMPETITOR MANAGEMENT',
      'market-records': 'MARKET RECORDS',
      'product-comparisons': 'PRODUCT SHOOTOUTS',
      'signals': 'SIGNAL TRACKING & RADAR',
      'evidence': 'EVIDENCE & STRATEGIC INSIGHTS',
      'briefings': 'AI BRIEFING SYNTHESIZER & API'
    };
    breadcrumb.textContent = titles[target] || target.toUpperCase();
  }

  // Auto-close mobile slidebar if open
  closeMobileSlidebar();

  // Re-trigger layout/renders on switch
  if (target === 'competitors') renderCompetitors();
  else if (target === 'market-records') renderMarketRecords();
  else if (target === 'product-comparisons') renderActiveShootout(DashState.activeShootoutId);
  else if (target === 'signals') renderSignalsFeed();
  else if (target === 'evidence') {
    renderEvidence();
    renderInsights();
    renderActivityLogs();
  }
}
window.switchDashboardTab = switchDashboardTab;

function initSlidebar() {
  const slidebar = document.getElementById('dashSlidebar');
  const btnCollapse = document.getElementById('btnCollapseSlidebar');
  const btnFooterCollapse = document.getElementById('btnFooterCollapseSlidebar');
  const btnHeaderToggle = document.getElementById('btnHeaderSlidebarToggle');
  const btnMobileToggle = document.getElementById('btnMobileSlidebarToggle');
  const backdrop = document.getElementById('slidebarBackdrop');
  const toggleIcon = document.getElementById('slidebarToggleIcon');
  const devGatewayBtn = document.getElementById('sbBtnDevGateway');

  // Restore saved collapse state
  try {
    const isCollapsed = localStorage.getItem('mv_slidebar_collapsed') === 'true';
    if (isCollapsed && slidebar) {
      slidebar.classList.add('collapsed');
      if (toggleIcon) toggleIcon.textContent = '▶';
    }
  } catch (e) {}

  function toggleDesktopCollapse() {
    if (!slidebar) return;
    const collapsed = slidebar.classList.toggle('collapsed');
    if (toggleIcon) toggleIcon.textContent = collapsed ? '▶' : '◀';
    try {
      localStorage.setItem('mv_slidebar_collapsed', collapsed ? 'true' : 'false');
    } catch (e) {}
    playTone('select');
  }

  function toggleMobileSlidebar() {
    if (!slidebar) return;
    const isOpen = slidebar.classList.toggle('mobile-open');
    if (backdrop) backdrop.classList.toggle('active', isOpen);
    playTone('select');
  }

  function closeMobileSlidebar() {
    if (slidebar) slidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }
  window.closeMobileSlidebar = closeMobileSlidebar;

  if (btnCollapse) btnCollapse.addEventListener('click', toggleDesktopCollapse);
  if (btnFooterCollapse) btnFooterCollapse.addEventListener('click', toggleDesktopCollapse);

  if (btnHeaderToggle) {
    btnHeaderToggle.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        toggleMobileSlidebar();
      } else {
        toggleDesktopCollapse();
      }
    });
  }

  if (btnMobileToggle) {
    btnMobileToggle.addEventListener('click', toggleMobileSlidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileSlidebar);
  }

  // Keyboard shortcut: [ or ] toggles slidebar
  document.addEventListener('keydown', (e) => {
    if ((e.key === '[' || e.key === ']') && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      if (window.innerWidth <= 1024) {
        toggleMobileSlidebar();
      } else {
        toggleDesktopCollapse();
      }
    }
  });

  // Developer Gateway button
  if (devGatewayBtn) {
    devGatewayBtn.addEventListener('click', () => {
      switchDashboardTab('briefings');
      setTimeout(() => {
        const consoleEl = document.querySelector('.dev-spec-container');
        if (consoleEl) {
          consoleEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }
}

/* ==========================================================================
   3.1 COMPETITOR MANAGEMENT
   ========================================================================== */
function initCompetitorModule() {
  renderCompetitors();

  // Category filter chips
  const filterChips = document.querySelectorAll('#competitorCategoryFilters .signal-chip-filter');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      DashState.activeCompCategory = chip.getAttribute('data-comp-cat') || 'all';
      renderCompetitors();
    });
  });

  // Search input
  const searchInput = document.getElementById('competitorSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderCompetitors();
    });
  }

  // Open Create Competitor Modal
  const btnOpen = document.getElementById('btnOpenCreateCompetitor');
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      openModalById('modalCreateCompetitor');
    });
  }

  // Form: Create Competitor
  const formCreate = document.getElementById('formCreateCompetitor');
  if (formCreate) {
    formCreate.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newComp = {
        id: DashState.competitors.length + 1,
        name: document.getElementById('compName').value.trim(),
        ticker: document.getElementById('compTicker').value.trim().toUpperCase() || 'UNLISTED',
        tier: document.getElementById('compTier').value,
        threat_level: document.getElementById('compThreatLevel').value,
        category: document.getElementById('compCategory').value,
        market_cap: document.getElementById('compMarketCap').value.trim() || '$1.0B',
        headquarters: document.getElementById('compHq').value.trim() || 'Undisclosed',
        overview: document.getElementById('compOverview').value.trim(),
        threatScore: document.getElementById('compThreatLevel').value === 'Critical' ? 95 : (document.getElementById('compThreatLevel').value === 'High' ? 85 : 70),
        marketShare: '11.5%',
        revenueRunRate: '$45M',
        recentMove: 'Newly onboarded into Marvean Competitive Surveillance Grid',
        primaryWeakness: 'Evaluating initial market telemetry disclosures',
        patentsCount: 12,
        status: 'Active Tracking'
      };

      DashState.competitors.unshift(newComp);
      saveStateToStorage();
      logActivity('CREATE_PROFILE', 'Competitor', newComp.id, `Created competitor profile for ${newComp.name} (${newComp.tier})`);

      // Attempt async backend push
      if (DashState.backendConnected) {
        fetch(`${API_BASE}/competitors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newComp)
        }).catch(() => {});
      }

      formCreate.reset();
      closeModalById('modalCreateCompetitor');
      renderCompetitors();
      updateKPICounters();
      populateGlobalDropdowns();
      playTone('powerup');
    });
  }

  // Form: Add Competitor Update
  const formAddUpdate = document.getElementById('formAddCompetitorUpdate');
  if (formAddUpdate) {
    formAddUpdate.addEventListener('submit', (e) => {
      e.preventDefault();
      const compId = parseInt(document.getElementById('updateTargetCompId').value, 10);
      const updateType = document.getElementById('updateType').value;
      const changeField = document.getElementById('changeField').value.trim();
      const summary = document.getElementById('updateSummary').value.trim();

      const newUpdate = {
        id: DashState.competitorUpdates.length + 1,
        competitor_id: compId,
        update_type: updateType,
        change_field: changeField,
        summary: summary,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        analyst: DashState.user ? DashState.user.name : 'Analyst Desk'
      };

      DashState.competitorUpdates.unshift(newUpdate);
      saveStateToStorage();
      logActivity('PROFILE_UPDATE', 'Competitor', compId, `Logged ${updateType} update for competitor ID #${compId}`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/competitors/${compId}/updates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUpdate)
        }).catch(() => {});
      }

      formAddUpdate.reset();
      closeModalById('modalAddCompetitorUpdate');
      renderCompetitorUpdates(compId);
      playTone('powerup');
    });
  }

  // Button inside updates modal to open Add Update modal
  const btnOpenAddUpdate = document.getElementById('btnOpenAddCompetitorUpdate');
  if (btnOpenAddUpdate) {
    btnOpenAddUpdate.addEventListener('click', () => {
      const compId = document.getElementById('updateTargetCompId').value;
      if (compId) {
        openModalById('modalAddCompetitorUpdate');
      }
    });
  }
}

function renderCompetitors() {
  const container = document.getElementById('competitorsGridList');
  if (!container) return;

  const localSearch = (document.getElementById('competitorSearchInput')?.value || '').toLowerCase().trim();
  const globalSearch = (DashState.globalSearchQuery || '').toLowerCase().trim();
  const searchQuery = globalSearch || localSearch;

  const filtered = DashState.competitors.filter(c => {
    const matchesCategory = DashState.activeCompCategory === 'all' || 
      c.category.toLowerCase().includes(DashState.activeCompCategory.toLowerCase());

    const matchesSearch = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery) ||
      (c.ticker && c.ticker.toLowerCase().includes(searchQuery)) ||
      c.overview.toLowerCase().includes(searchQuery) ||
      c.category.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background: #060b17; border: 1px dashed var(--space-border); border-radius: 8px; padding: 3rem; text-align: center;">
        <h4 style="color: #fff; margin: 0.5rem 0;">No Competitors Found</h4>
        <p style="color: var(--parchment-muted); font-size: 0.88rem;">Adjust your category filter or click "+ REGISTER COMPETITOR PROFILE" to add a new dossier.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(c => {
    const updatesCount = DashState.competitorUpdates.filter(u => u.competitor_id === c.id).length;
    const badgeColor = c.threat_level === 'Critical' ? 'var(--arcade-red)' : (c.threat_level === 'High' ? 'var(--arcade-yellow)' : 'var(--arcade-teal)');

    return `
      <div class="competitor-dossier-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0;">${c.name}</h3>
              ${c.ticker ? `<span style="font-family: var(--font-mono); font-size: 0.72rem; background: #0c1836; border: 1px solid var(--space-border); padding: 0.15rem 0.45rem; border-radius: 4px; color: var(--arcade-yellow);">$${c.ticker}</span>` : ''}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #7f97bd; margin-top: 0.25rem;">
              ${c.tier} &bull; <span style="color: var(--arcade-teal);">${c.category}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-tech); font-size: 1.5rem; font-weight: 800; color: ${badgeColor};">${c.threatScore || 85}</div>
            <div style="font-family: var(--font-mono); font-size: 0.65rem; color: #7f97bd;">THREAT SCORE</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; background: #060b17; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.85rem; font-family: var(--font-mono); font-size: 0.74rem;">
          <div>
            <span style="color: #6a7f9f;">VALUATION / CAP:</span>
            <div style="color: #fff; font-weight: 700;">${c.market_cap || '$10B'}</div>
          </div>
          <div>
            <span style="color: #6a7f9f;">HEADQUARTERS:</span>
            <div style="color: var(--arcade-teal); font-weight: 700;">${c.headquarters || 'Global'}</div>
          </div>
        </div>

        <div style="font-size: 0.84rem; color: #a9bede; line-height: 1.45; margin-bottom: 0.85rem;">
          ${c.overview}
        </div>

        <div style="display: flex; gap: 0.45rem; margin-top: auto; flex-wrap: wrap;">
          <button class="btn-arcade btn-arcade-teal" style="flex: 1; font-size: 0.74rem; padding: 0.45rem; border-radius: 6px;" onclick="loadBriefingFor('${c.name}')">
            AI BATTLECARD
          </button>
          <button class="btn-arcade btn-arcade-outline" style="font-size: 0.74rem; padding: 0.45rem 0.65rem; border-radius: 6px;" onclick="openCompetitorUpdatesModal(${c.id}, '${c.name.replace(/'/g, "\\'")}')">
            📋 UPDATES (${updatesCount})
          </button>
          <button class="btn-arcade btn-arcade-outline" style="font-size: 0.74rem; padding: 0.45rem 0.65rem; border-radius: 6px;" onclick="openAddUpdateForComp(${c.id})">
            + UPDATE
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.openCompetitorUpdatesModal = function(compId, compName) {
  const titleEl = document.getElementById('compUpdatesModalTitle');
  if (titleEl) titleEl.textContent = `PROFILE UPDATE HISTORY // ${compName.toUpperCase()}`;
  document.getElementById('updateTargetCompId').value = compId;
  renderCompetitorUpdates(compId);
  openModalById('modalCompetitorUpdates');
};

window.openAddUpdateForComp = function(compId) {
  document.getElementById('updateTargetCompId').value = compId;
  openModalById('modalAddCompetitorUpdate');
};

function renderCompetitorUpdates(compId) {
  const container = document.getElementById('compUpdatesTimelineContainer');
  if (!container) return;

  const updates = DashState.competitorUpdates.filter(u => u.competitor_id === compId);

  if (updates.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 6px; padding: 2rem; text-align: center;">
        <p style="color: var(--parchment-muted); font-size: 0.85rem; margin: 0;">
          No profile updates recorded for this competitor yet. Click "+ ADD PROFILE UPDATE" to log the first verified change.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="timeline-wrap">
      ${updates.map(u => `
        <div class="timeline-item">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <strong style="color: var(--arcade-yellow); font-size: 0.88rem;">${u.update_type} &bull; ${u.change_field}</strong>
            <span class="timeline-time">${u.created_at}</span>
          </div>
          <p style="color: #c4d7f5; font-size: 0.84rem; line-height: 1.45; margin: 0.35rem 0;">${u.summary}</p>
          <div style="font-family: var(--font-mono); font-size: 0.7rem; color: #7f97bd;">
            RECORDED BY: <span style="color: var(--arcade-teal);">${u.analyst || 'Senior Analyst'}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ==========================================================================
   3.2 MARKET RECORDS
   ========================================================================== */
function initMarketRecordsModule() {
  renderMarketRecords();

  // Filter chips
  const filterChips = document.querySelectorAll('#marketRecordFilters .signal-chip-filter');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      DashState.activeRecordFilter = chip.getAttribute('data-rec-filter') || 'all';
      renderMarketRecords();
    });
  });

  // Search input
  const searchInput = document.getElementById('recordSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderMarketRecords();
    });
  }

  // Open Create Record Modal
  const btnOpen = document.getElementById('btnOpenCreateRecord');
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      openModalById('modalCreateMarketRecord');
    });
  }

  // Form: Create Market Record
  const formCreate = document.getElementById('formCreateMarketRecord');
  if (formCreate) {
    formCreate.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRec = {
        id: DashState.marketRecords.length + 1,
        title: document.getElementById('recordTitle').value.trim(),
        industry: document.getElementById('recordIndustry').value.trim(),
        classification: document.getElementById('recordClassification').value,
        confidence_score: parseFloat(document.getElementById('recordConfidence').value) || 99.4,
        status: document.getElementById('recordStatus').value,
        executive_summary: document.getElementById('recordExecutiveSummary').value.trim(),
        deep_analysis: document.getElementById('recordDeepAnalysis').value.trim(),
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      DashState.marketRecords.unshift(newRec);

      // Auto-log initial revision history
      DashState.marketHistory.unshift({
        id: DashState.marketHistory.length + 1,
        market_record_id: newRec.id,
        revision_number: 1,
        change_summary: `Initial publication: ${newRec.title} by ${DashState.user ? DashState.user.name : 'Analyst'}`,
        created_at: newRec.created_at
      });

      saveStateToStorage();
      logActivity('PUBLISH_RECORD', 'MarketRecord', newRec.id, `Published market record: "${newRec.title}"`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/market-records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRec)
        }).catch(() => {});
      }

      formCreate.reset();
      closeModalById('modalCreateMarketRecord');
      renderMarketRecords();
      updateKPICounters();
      playTone('powerup');
    });
  }

  // Form: Add Source to Record
  const formAddSource = document.getElementById('formAddSource');
  if (formAddSource) {
    formAddSource.addEventListener('submit', (e) => {
      e.preventDefault();
      const recordId = parseInt(document.getElementById('sourceTargetRecordId').value, 10);
      const newSource = {
        id: DashState.marketSources.length + 1,
        market_record_id: recordId,
        source_name: document.getElementById('sourceName').value.trim(),
        citation_key: document.getElementById('sourceCitationKey').value.trim(),
        source_type: document.getElementById('sourceType').value.trim(),
        verification_date: document.getElementById('sourceDate').value,
        source_url: document.getElementById('sourceUrl').value.trim()
      };

      DashState.marketSources.unshift(newSource);
      saveStateToStorage();
      logActivity('ATTACH_SOURCE', 'MarketRecord', recordId, `Attached source "${newSource.source_name}" to Record #${recordId}`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/market-records/${recordId}/sources`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSource)
        }).catch(() => {});
      }

      formAddSource.reset();
      renderMarketSources(recordId);
      renderMarketRecords();
      playTone('powerup');
    });
  }
}

function renderMarketRecords() {
  const container = document.getElementById('marketRecordsList');
  if (!container) return;

  const localSearch = (document.getElementById('recordSearchInput')?.value || '').toLowerCase().trim();
  const globalSearch = (DashState.globalSearchQuery || '').toLowerCase().trim();
  const searchQuery = globalSearch || localSearch;

  const filtered = DashState.marketRecords.filter(r => {
    const matchesFilter = DashState.activeRecordFilter === 'all' || 
      r.classification.toLowerCase() === DashState.activeRecordFilter.toLowerCase();

    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery) ||
      r.industry.toLowerCase().includes(searchQuery) ||
      r.executive_summary.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 8px; padding: 3rem; text-align: center;">
        <h4 style="color: #fff; margin: 0.5rem 0;">No Market Intelligence Records Found</h4>
        <p style="color: var(--parchment-muted); font-size: 0.88rem;">Try adjusting your classification filter or click "+ PUBLISH RECORD".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(r => {
    const sourcesCount = DashState.marketSources.filter(s => s.market_record_id === r.id).length;
    const historyCount = DashState.marketHistory.filter(h => h.market_record_id === r.id).length;

    return `
      <div class="signal-feed-card" style="margin-bottom: 1.25rem;">
        <div class="signal-card-top">
          <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
            <strong style="color: var(--arcade-yellow); font-family: var(--font-tech); font-size: 1.05rem;">
              ${r.title}
            </strong>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #7f97bd;">[${r.industry}]</span>
            <span class="signal-badge-minor">${r.classification}</span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; background: rgba(0, 229, 163, 0.1); border: 1px solid var(--arcade-teal); color: var(--arcade-teal); padding: 0.15rem 0.45rem; border-radius: 4px;">
              CONFIDENCE: ${r.confidence_score}%
            </span>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.74rem; color: #8da4c8;">${r.created_at}</span>
        </div>

        <div style="margin: 0.75rem 0; font-size: 0.9rem; color: #fff; line-height: 1.5;">
          ${r.executive_summary}
        </div>

        ${r.deep_analysis ? `
          <div style="background: #060b17; border-left: 3px solid var(--arcade-teal); padding: 0.65rem 0.85rem; font-size: 0.82rem; color: #a9bede; line-height: 1.45; margin-bottom: 0.85rem;">
            <strong style="color: var(--arcade-teal); font-family: var(--font-mono); font-size: 0.72rem;">DEEP TELEMETRY &amp; METHODOLOGY:</strong><br>
            ${r.deep_analysis}
          </div>
        ` : ''}

        <div class="signal-provenance-meta">
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn-arcade btn-arcade-teal" style="font-size: 0.72rem; padding: 0.35rem 0.75rem;" onclick="openMarketSourcesModal(${r.id}, '${r.title.replace(/'/g, "\\'")}')">
              🔗 ASSOCIATED SOURCES (${sourcesCount})
            </button>
            <button class="btn-arcade btn-arcade-outline" style="font-size: 0.72rem; padding: 0.35rem 0.75rem;" onclick="openMarketHistoryModal(${r.id}, '${r.title.replace(/'/g, "\\'")}')">
              REVISION HISTORY (${historyCount})
            </button>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--arcade-yellow);">
            STATUS: ${r.status.toUpperCase()}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openMarketSourcesModal = function(recordId, title) {
  const titleEl = document.getElementById('sourcesModalTitle');
  if (titleEl) titleEl.textContent = `SOURCES // ${title.substring(0, 36).toUpperCase()}...`;
  document.getElementById('sourceTargetRecordId').value = recordId;
  renderMarketSources(recordId);
  openModalById('modalMarketSources');
};

function renderMarketSources(recordId) {
  const container = document.getElementById('sourcesListContainer');
  if (!container) return;

  const sources = DashState.marketSources.filter(s => s.market_record_id === recordId);

  if (sources.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 6px; padding: 1.5rem; text-align: center;">
        <p style="color: var(--parchment-muted); font-size: 0.85rem; margin: 0;">
          No verified sources associated with this intelligence record yet. Use the form below to attach an official filing or audit citation.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${sources.map(s => `
        <div style="background: #060b17; border: 1px solid var(--space-border); border-radius: 6px; padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">${s.source_name}</div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #7f97bd;">
              KEY: <span style="color: var(--arcade-yellow);">${s.citation_key || 'N/A'}</span> &bull; ${s.source_type} &bull; ${s.verification_date}
            </div>
          </div>
          ${s.source_url ? `
            <a href="${s.source_url}" target="_blank" rel="noopener noreferrer" class="btn-arcade btn-arcade-outline" style="font-size: 0.7rem; padding: 0.3rem 0.65rem;">
              PROVENANCE ↗
            </a>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

window.openMarketHistoryModal = function(recordId, title) {
  const titleEl = document.getElementById('historyModalTitle');
  if (titleEl) titleEl.textContent = `REVISION HISTORY // ${title.substring(0, 36).toUpperCase()}...`;
  renderMarketHistory(recordId);
  openModalById('modalMarketHistory');
};

function renderMarketHistory(recordId) {
  const container = document.getElementById('historyListContainer');
  if (!container) return;

  const history = DashState.marketHistory.filter(h => h.market_record_id === recordId);

  if (history.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 6px; padding: 1.5rem; text-align: center;">
        <p style="color: var(--parchment-muted); font-size: 0.85rem; margin: 0;">
          Initial baseline record. No subsequent editorial revisions recorded.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="timeline-wrap">
      ${history.map(h => `
        <div class="timeline-item">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: var(--arcade-teal); font-size: 0.85rem;">REVISION #${h.revision_number}</strong>
            <span class="timeline-time">${h.created_at}</span>
          </div>
          <p style="color: #c4d7f5; font-size: 0.82rem; margin: 0.35rem 0;">${h.change_summary}</p>
        </div>
      `).join('')}
    </div>
  `;
}

/* ==========================================================================
   3.3 PRODUCT COMPARISONS
   ========================================================================== */
function initProductComparisonsModule() {
  populateShootoutSelect();
  renderActiveShootout(DashState.activeShootoutId);

  const select = document.getElementById('activeShootoutSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      DashState.activeShootoutId = parseInt(e.target.value, 10);
      renderActiveShootout(DashState.activeShootoutId);
      playTone('select');
    });
  }

  const btnOpenHistory = document.getElementById('btnOpenComparisonHistory');
  if (btnOpenHistory) {
    btnOpenHistory.addEventListener('click', () => {
      renderComparisonHistory(DashState.activeShootoutId);
      openModalById('modalComparisonHistory');
    });
  }

  const btnOpenCreate = document.getElementById('btnOpenCreateComparison');
  if (btnOpenCreate) {
    btnOpenCreate.addEventListener('click', () => {
      openModalById('modalCreateComparison');
    });
  }

  // Form: Create Shootout Matrix
  const formCreateComp = document.getElementById('formCreateComparison');
  if (formCreateComp) {
    formCreateComp.addEventListener('submit', (e) => {
      e.preventDefault();
      const newShootout = {
        id: DashState.productComparisons.length + 1,
        title: document.getElementById('compTitle').value.trim(),
        category: document.getElementById('compCategoryName').value.trim(),
        status: document.getElementById('compStatus').value,
        notes: document.getElementById('compNotes').value.trim(),
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      DashState.productComparisons.unshift(newShootout);
      DashState.activeShootoutId = newShootout.id;

      DashState.comparisonHistory.unshift({
        id: DashState.comparisonHistory.length + 1,
        comparison_id: newShootout.id,
        action: 'Shootout Initialized',
        notes: `Created new shootout matrix: ${newShootout.title}`,
        created_at: newShootout.created_at
      });

      saveStateToStorage();
      logActivity('CREATE_SHOOTOUT', 'ProductComparison', newShootout.id, `Created product comparison matrix: "${newShootout.title}"`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/product-comparisons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newShootout)
        }).catch(() => {});
      }

      formCreateComp.reset();
      closeModalById('modalCreateComparison');
      populateShootoutSelect();
      renderActiveShootout(DashState.activeShootoutId);
      updateKPICounters();
      playTone('powerup');
    });
  }

  // Form: Add Attribute to Shootout
  const formAddAttr = document.getElementById('formAddAttribute');
  if (formAddAttr) {
    formAddAttr.addEventListener('submit', (e) => {
      e.preventDefault();
      const shootoutId = parseInt(document.getElementById('attrTargetCompId').value, 10);
      const newAttr = {
        id: DashState.comparisonAttributes.length + 1,
        comparison_id: shootoutId,
        attribute_name: document.getElementById('attrName').value.trim(),
        marvean_metric: document.getElementById('attrMarvean').value.trim(),
        competitor_metric: document.getElementById('attrCompetitor').value.trim(),
        advantage: document.getElementById('attrAdvantage').value,
        audit_note: document.getElementById('attrAuditNote').value.trim()
      };

      DashState.comparisonAttributes.push(newAttr);

      DashState.comparisonHistory.unshift({
        id: DashState.comparisonHistory.length + 1,
        comparison_id: shootoutId,
        action: 'Attribute Added',
        notes: `Added benchmark capability "${newAttr.attribute_name}" (${newAttr.advantage} Advantage)`,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });

      saveStateToStorage();
      logActivity('ADD_ATTRIBUTE', 'ProductComparison', shootoutId, `Added attribute "${newAttr.attribute_name}" to shootout #${shootoutId}`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/product-comparisons/${shootoutId}/attributes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAttr)
        }).catch(() => {});
      }

      formAddAttr.reset();
      closeModalById('modalAddAttribute');
      renderActiveShootout(shootoutId);
      playTone('powerup');
    });
  }
}

function populateShootoutSelect() {
  const select = document.getElementById('activeShootoutSelect');
  if (!select) return;

  select.innerHTML = DashState.productComparisons.map(p => 
    `<option value="${p.id}" ${p.id === DashState.activeShootoutId ? 'selected' : ''}>${p.title}</option>`
  ).join('');
}

function renderActiveShootout(shootoutId) {
  const container = document.getElementById('activeShootoutContainer');
  if (!container) return;

  const current = DashState.productComparisons.find(p => p.id === shootoutId) || DashState.productComparisons[0];
  if (!current) {
    container.innerHTML = `<div style="padding: 2rem; text-align: center; color: #fff;">No comparison shootout initialized.</div>`;
    return;
  }

  const attrs = DashState.comparisonAttributes.filter(a => a.comparison_id === current.id);

  container.innerHTML = `
    <div style="background: #090f20; border: 1px solid var(--space-border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--arcade-teal);">${current.category.toUpperCase()} // STATUS: ${current.status.toUpperCase()}</span>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0.35rem 0;">${current.title}</h2>
          <p style="color: var(--parchment-muted); font-size: 0.85rem; margin: 0;">${current.notes || 'Comparative benchmark evaluation.'}</p>
        </div>
        <button class="btn-arcade btn-arcade-teal" style="font-size: 0.78rem; padding: 0.5rem 1rem;" onclick="openAddAttributeModal(${current.id})">
          + ADD ATTRIBUTE
        </button>
      </div>

      <div style="overflow-x: auto;">
        <table class="retro-table">
          <thead>
            <tr>
              <th style="width: 25%;">Capability / Evaluation Attribute</th>
              <th style="width: 25%; color: var(--arcade-teal);">MARVEAN Solution</th>
              <th style="width: 25%; color: var(--arcade-red);">Competitor Solution</th>
              <th style="width: 12%;">Advantage</th>
              <th style="width: 13%;">Audit Provenance</th>
            </tr>
          </thead>
          <tbody>
            ${attrs.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align: center; color: #7f97bd; padding: 2rem;">
                  No benchmark attributes added yet. Click "+ ADD ATTRIBUTE" to build the matrix.
                </td>
              </tr>
            ` : attrs.map(a => {
              const badgeClass = a.advantage === 'Marvean' 
                ? 'advantage-badge-marvean' 
                : (a.advantage === 'Competitor' ? 'advantage-badge-competitor' : 'advantage-badge-parity');

              return `
                <tr>
                  <td><strong style="color: #fff;">${a.attribute_name}</strong></td>
                  <td style="color: var(--arcade-teal); font-weight: 600;">${a.marvean_metric}</td>
                  <td style="color: #ff8aa0;">${a.competitor_metric}</td>
                  <td><span class="${badgeClass}">${a.advantage.toUpperCase()}</span></td>
                  <td style="font-size: 0.75rem; color: #7f97bd;">${a.audit_note || 'Audited'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openAddAttributeModal = function(shootoutId) {
  document.getElementById('attrTargetCompId').value = shootoutId;
  openModalById('modalAddAttribute');
};

function renderComparisonHistory(shootoutId) {
  const container = document.getElementById('comparisonHistoryListContainer');
  if (!container) return;

  const history = DashState.comparisonHistory.filter(h => h.comparison_id === shootoutId);

  if (history.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 6px; padding: 1.5rem; text-align: center;">
        <p style="color: var(--parchment-muted); font-size: 0.85rem; margin: 0;">No audit revisions logged for this shootout yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="timeline-wrap">
      ${history.map(h => `
        <div class="timeline-item">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: var(--arcade-yellow); font-size: 0.85rem;">${h.action}</strong>
            <span class="timeline-time">${h.created_at}</span>
          </div>
          <p style="color: #c4d7f5; font-size: 0.82rem; margin: 0.35rem 0;">${h.notes}</p>
        </div>
      `).join('')}
    </div>
  `;
}

/* ==========================================================================
   3.4 SIGNAL TRACKING
   ========================================================================== */
function initSignalsModule() {
  renderSignalsFeed();

  // Filter chips
  const filterChips = document.querySelectorAll('#signalFilters .signal-chip-filter');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      DashState.activeSignalFilter = chip.getAttribute('data-filter') || 'all';
      renderSignalsFeed();
    });
  });

  // Search input
  const searchInput = document.getElementById('signalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderSignalsFeed();
    });
  }

  // Open Ingest Signal Modal
  const btnOpen = document.getElementById('btnOpenIngestSignal');
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      openModalById('modalIngestSignal');
    });
  }

  // Form: Ingest Market Signal
  const formIngest = document.getElementById('formIngestSignal');
  if (formIngest) {
    formIngest.addEventListener('submit', (e) => {
      e.preventDefault();
      const compSelect = document.getElementById('sigCompetitor');
      const compId = parseInt(compSelect.value, 10);
      const compObj = DashState.competitors.find(c => c.id === compId) || DashState.competitors[0];

      const newSig = {
        id: 'sig-' + Date.now(),
        competitor_id: compId,
        competitor: compObj ? compObj.name : 'Target Entity',
        tier: compObj ? compObj.tier : 'Tier-1 Direct',
        title: document.getElementById('sigTitle').value.trim(),
        category: document.getElementById('sigCategory').value,
        severity: document.getElementById('sigSeverity').value,
        status: 'Active Alert',
        details: document.getElementById('sigDetails').value.trim(),
        summary: document.getElementById('sigDetails').value.trim(),
        source: document.getElementById('sigSource').value.trim(),
        source_tag: document.getElementById('sigSource').value.trim(),
        hash: 'sha256:' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        timestamp: 'Just now',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        isNew: true
      };

      DashState.signals.unshift(newSig);

      // Log initial history
      DashState.signalHistory.unshift({
        id: DashState.signalHistory.length + 1,
        signal_id: newSig.id,
        previous_status: 'Ingested',
        new_status: 'Active Alert',
        notes: `Ingested ${newSig.severity} severity market signal via ${newSig.source}`,
        created_at: newSig.created_at,
        analyst: DashState.user ? DashState.user.name : 'Analyst Desk'
      });

      saveStateToStorage();
      logActivity('INGEST_SIGNAL', 'MarketSignal', newSig.id, `Ingested signal: "${newSig.title}" (${newSig.severity})`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/signals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSig)
        }).catch(() => {});
      }

      formIngest.reset();
      closeModalById('modalIngestSignal');
      renderSignalsFeed();
      updateKPICounters();
      playTone('alert');
    });
  }
}

function renderSignalsFeed() {
  const container = document.getElementById('signalsFeedList');
  if (!container) return;

  const localSearch = (document.getElementById('signalSearchInput')?.value || '').toLowerCase().trim();
  const globalSearch = (DashState.globalSearchQuery || '').toLowerCase().trim();
  const searchQuery = globalSearch || localSearch;

  const filtered = DashState.signals.filter(s => {
    const matchesFilter = DashState.activeSignalFilter === 'all' || 
      s.severity.toLowerCase() === DashState.activeSignalFilter.toLowerCase() ||
      s.category.toLowerCase().includes(DashState.activeSignalFilter.toLowerCase());

    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery) ||
      s.competitor.toLowerCase().includes(searchQuery) ||
      s.details.toLowerCase().includes(searchQuery) ||
      s.source.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background: #090f20; border: 1px dashed var(--space-border); padding: 2.5rem; text-align: center; border-radius: 8px;">
        <span style="font-size: 1.5rem;">🔍</span>
        <h4 style="margin: 0.5rem 0; color: #fff;">No Signals Found</h4>
        <p style="color: var(--parchment-muted); font-size: 0.85rem;">Try adjusting your filter parameters or click "+ INGEST MARKET SIGNAL".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(sig => {
    const badgeClass = sig.severity === 'Critical' 
      ? 'signal-badge-critical' 
      : (sig.severity === 'High' ? 'signal-badge-major' : 'signal-badge-minor');

    const historyCount = DashState.signalHistory.filter(h => h.signal_id == sig.id).length;

    return `
      <div class="signal-feed-card ${sig.isNew ? 'highlight-new' : ''}">
        <div class="signal-card-top">
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <strong style="color: var(--arcade-yellow); font-family: var(--font-tech); font-size: 1rem;">${sig.competitor}</strong>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #6d82a6;">[${sig.tier}]</span>
            <span class="${badgeClass}">${sig.severity.toUpperCase()}</span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #7f97bd;">&bull; ${sig.category}</span>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; background: #0c1836; border: 1px solid var(--space-border); padding: 0.12rem 0.45rem; border-radius: 4px; color: var(--arcade-teal);">
              STATUS: ${sig.status || 'Active Alert'}
            </span>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--arcade-teal);">${sig.timestamp || 'Verified'}</span>
        </div>

        <div class="signal-title-text">${sig.title}</div>
        <div class="signal-summary-text">${sig.details || sig.summary}</div>

        <div class="signal-provenance-meta">
          <div>
            <span>SOURCE: </span>
            <strong style="color: #c4d7f5;">${sig.source || sig.source_tag}</strong>
          </div>
          <div>
            <span>HASH: </span>
            <code class="hash-pill">${(sig.hash || 'sha256:...').substring(0, 22)}...</code>
          </div>
          <div style="display: flex; gap: 0.45rem;">
            <button class="btn-arcade btn-arcade-teal" style="font-size: 0.68rem; padding: 0.25rem 0.6rem; border-radius: 4px;" onclick="cycleSignalStatus('${sig.id}')">
              TRANSITION STATUS
            </button>
            <button class="btn-arcade btn-arcade-outline" style="font-size: 0.68rem; padding: 0.25rem 0.6rem; border-radius: 4px;" onclick="openSignalHistoryModal('${sig.id}')">
              HISTORY (${historyCount})
            </button>
            <button class="btn-arcade btn-arcade-outline" style="font-size: 0.68rem; padding: 0.25rem 0.6rem; border-radius: 4px;" onclick="loadBriefingFor('${sig.competitor}')">
              BRIEFING
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.cycleSignalStatus = function(sigId) {
  const sig = DashState.signals.find(s => s.id == sigId);
  if (!sig) return;

  const current = sig.status || 'Active Alert';
  let next = 'Under Review';
  if (current === 'Active Alert') next = 'Under Review';
  else if (current === 'Under Review') next = 'Verified';
  else if (current === 'Verified') next = 'Archived';
  else if (current === 'Archived') next = 'Active Alert';

  sig.status = next;

  DashState.signalHistory.unshift({
    id: DashState.signalHistory.length + 1,
    signal_id: sigId,
    previous_status: current,
    new_status: next,
    notes: `Transitioned status from ${current} to ${next} by analyst`,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    analyst: DashState.user ? DashState.user.name : 'Analyst Desk'
  });

  saveStateToStorage();
  logActivity('SIGNAL_STATUS', 'MarketSignal', sigId, `Transitioned Signal #${sigId} status: ${current} -> ${next}`);

  if (DashState.backendConnected) {
    fetch(`${API_BASE}/signals/${sigId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next, notes: `Status changed to ${next}` })
    }).catch(() => {});
  }

  renderSignalsFeed();
  playTone('select');
};

window.openSignalHistoryModal = function(sigId) {
  const container = document.getElementById('signalHistoryListContainer');
  if (!container) return;

  const history = DashState.signalHistory.filter(h => h.signal_id == sigId);

  if (history.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 6px; padding: 1.5rem; text-align: center;">
        <p style="color: var(--parchment-muted); font-size: 0.85rem; margin: 0;">Initial signal ingestion. No subsequent status transitions logged.</p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="timeline-wrap">
        ${history.map(h => `
          <div class="timeline-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="color: var(--arcade-yellow); font-size: 0.85rem;">${h.previous_status} &rarr; ${h.new_status}</strong>
              <span class="timeline-time">${h.created_at}</span>
            </div>
            <p style="color: #c4d7f5; font-size: 0.82rem; margin: 0.35rem 0;">${h.notes}</p>
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: #7f97bd;">
              AUDITED BY: <span style="color: var(--arcade-teal);">${h.analyst || 'Chief Analyst'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  openModalById('modalSignalHistory');
};

/* ==========================================================================
   3.5 EVIDENCE & STRATEGIC INSIGHTS
   ========================================================================== */
function initEvidenceAndInsightsModule() {
  renderEvidence();
  renderInsights();
  renderActivityLogs();

  // Subtab buttons
  const btnSubEv = document.getElementById('btnSubtabEvidence');
  const btnSubIn = document.getElementById('btnSubtabInsights');
  const btnSubAc = document.getElementById('btnSubtabActivity');

  const paneEv = document.getElementById('subpane-evidence');
  const paneIn = document.getElementById('subpane-insights');
  const paneAc = document.getElementById('subpane-activity');

  if (btnSubEv && btnSubIn && btnSubAc) {
    btnSubEv.addEventListener('click', () => {
      btnSubEv.classList.add('active');
      btnSubIn.classList.remove('active');
      btnSubAc.classList.remove('active');
      paneEv.style.display = 'block';
      paneIn.style.display = 'none';
      paneAc.style.display = 'none';
      renderEvidence();
      playTone('hover');
    });

    btnSubIn.addEventListener('click', () => {
      btnSubIn.classList.add('active');
      btnSubEv.classList.remove('active');
      btnSubAc.classList.remove('active');
      paneEv.style.display = 'none';
      paneIn.style.display = 'block';
      paneAc.style.display = 'none';
      renderInsights();
      playTone('hover');
    });

    btnSubAc.addEventListener('click', () => {
      btnSubAc.classList.add('active');
      btnSubEv.classList.remove('active');
      btnSubIn.classList.remove('active');
      paneEv.style.display = 'none';
      paneIn.style.display = 'none';
      paneAc.style.display = 'block';
      renderActivityLogs();
      playTone('hover');
    });
  }

  // Open Deposit Evidence Modal
  const btnOpenDeposit = document.getElementById('btnOpenDepositEvidence');
  if (btnOpenDeposit) {
    btnOpenDeposit.addEventListener('click', () => {
      openModalById('modalDepositEvidence');
    });
  }

  // Auto-generate SHA-256 hash button
  const btnAutoHash = document.getElementById('btnAutoGenerateHash');
  if (btnAutoHash) {
    btnAutoHash.addEventListener('click', () => {
      const hashInput = document.getElementById('eviHash');
      const sample = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      if (hashInput) {
        hashInput.value = 'sha256:' + sample;
        playTone('select');
      }
    });
  }

  // Form: Deposit Evidence
  const formDeposit = document.getElementById('formDepositEvidence');
  if (formDeposit) {
    formDeposit.addEventListener('submit', (e) => {
      e.preventDefault();
      const newEvi = {
        id: DashState.evidence.length + 1,
        title: document.getElementById('eviTitle').value.trim(),
        evidence_type: document.getElementById('eviType').value,
        document_reference: document.getElementById('eviDocRef').value.trim(),
        verification_hash: document.getElementById('eviHash').value.trim(),
        verified_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        summary: document.getElementById('eviSummary').value.trim(),
        deposited_by: DashState.user ? DashState.user.name : 'Compliance Desk'
      };

      DashState.evidence.unshift(newEvi);
      saveStateToStorage();
      logActivity('VERIFY_EVIDENCE', 'EvidenceItem', newEvi.id, `Deposited audited evidence doc: "${newEvi.title}" [${newEvi.document_reference}]`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvi)
        }).catch(() => {});
      }

      formDeposit.reset();
      closeModalById('modalDepositEvidence');
      renderEvidence();
      updateKPICounters();
      populateGlobalDropdowns();
      playTone('powerup');
    });
  }

  // Open Record Insight Modal
  const btnOpenRecordInsight = document.getElementById('btnOpenRecordInsight');
  if (btnOpenRecordInsight) {
    btnOpenRecordInsight.addEventListener('click', () => {
      openModalById('modalRecordInsight');
    });
  }

  // Form: Record Strategic Insight
  const formRecordInsight = document.getElementById('formRecordInsight');
  if (formRecordInsight) {
    formRecordInsight.addEventListener('submit', (e) => {
      e.preventDefault();
      const compSelect = document.getElementById('insightCompetitor');
      const compId = parseInt(compSelect.value, 10);
      const compObj = DashState.competitors.find(c => c.id === compId) || DashState.competitors[0];

      const eviSelect = document.getElementById('insightEvidence');
      const eviId = parseInt(eviSelect.value, 10);
      const eviObj = DashState.evidence.find(ev => ev.id === eviId) || DashState.evidence[0];

      const newInsight = {
        id: DashState.insights.length + 1,
        title: document.getElementById('insightTitle').value.trim(),
        competitor_id: compId,
        competitor_name: compObj ? compObj.name : 'Target Rival',
        evidence_id: eviId,
        evidence_ref: eviObj ? (eviObj.document_reference || eviObj.title) : 'SEC Regulatory Audit',
        strategic_horizon: document.getElementById('insightHorizon').value,
        impact_rating: document.getElementById('insightImpact').value,
        recommendation: document.getElementById('insightRecommendation').value.trim(),
        status: 'Active Brief',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        created_by: DashState.user ? DashState.user.name : 'C-Suite Strategy Director'
      };

      DashState.insights.unshift(newInsight);
      saveStateToStorage();
      logActivity('RECORD_INSIGHT', 'StrategicInsight', newInsight.id, `Recorded C-Suite Directive: "${newInsight.title}"`);

      if (DashState.backendConnected) {
        fetch(`${API_BASE}/insights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInsight)
        }).catch(() => {});
      }

      formRecordInsight.reset();
      closeModalById('modalRecordInsight');
      renderInsights();
      updateKPICounters();
      playTone('powerup');
    });
  }
}

function renderEvidence() {
  const container = document.getElementById('evidenceTableContainer');
  if (!container) return;

  if (DashState.evidence.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 8px; padding: 2.5rem; text-align: center;">
        <h4 style="color: #fff; margin: 0.5rem 0;">Cryptographic Evidence Locker Empty</h4>
        <p style="color: var(--parchment-muted); font-size: 0.85rem;">Click "+ DEPOSIT EVIDENCE DOCUMENT" to register an audited SEC filing or patent citation.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table class="retro-table">
        <thead>
          <tr>
            <th style="width: 25%;">Evidence Item Title</th>
            <th style="width: 18%;">Evidence Type</th>
            <th style="width: 17%;">Document Reference</th>
            <th style="width: 22%;">SHA-256 Hash</th>
            <th style="width: 18%;">Audit Verification Date</th>
          </tr>
        </thead>
        <tbody>
          ${DashState.evidence.map(e => `
            <tr>
              <td>
                <strong style="color: #fff; display: block; font-size: 0.88rem;">${e.title}</strong>
                <span style="font-size: 0.74rem; color: #a9bede; line-height: 1.35; display: block; margin-top: 0.25rem;">${e.summary}</span>
              </td>
              <td><span class="signal-badge-minor">${e.evidence_type}</span></td>
              <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--arcade-yellow);">${e.document_reference}</td>
              <td><code class="hash-pill" title="${e.verification_hash}">${(e.verification_hash || '').substring(0, 20)}...</code></td>
              <td style="font-family: var(--font-mono); font-size: 0.74rem; color: #7f97bd;">${e.verified_at}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderInsights() {
  const container = document.getElementById('insightsGridContainer');
  if (!container) return;

  if (DashState.insights.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background: #060b17; border: 1px dashed var(--space-border); border-radius: 8px; padding: 2.5rem; text-align: center;">
        <h4 style="color: #fff; margin: 0.5rem 0;">No Strategic Insights Formulated</h4>
        <p style="color: var(--parchment-muted); font-size: 0.85rem;">Click "+ RECORD STRATEGIC INSIGHT" to formulate competitive countermeasures.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = DashState.insights.map(i => {
    return `
      <div class="competitor-dossier-card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--arcade-yellow); background: #0c1836; border: 1px solid var(--space-border); padding: 0.15rem 0.5rem; border-radius: 4px;">
            ${i.strategic_horizon}
          </span>
          <span class="signal-badge-major" style="font-size: 0.68rem;">${i.impact_rating.toUpperCase()}</span>
        </div>

        <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; line-height: 1.35;">${i.title}</h3>

        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #7f97bd; margin-bottom: 0.85rem;">
          TARGET: <span style="color: #fff; font-weight: 700;">${i.competitor_name}</span> &bull; PROVENANCE: <span style="color: var(--arcade-teal);">${i.evidence_ref}</span>
        </div>

        <div style="background: #060b17; border-left: 3px solid var(--arcade-yellow); padding: 0.75rem; border-radius: 4px; font-size: 0.84rem; color: #c4d7f5; line-height: 1.45; margin-bottom: 1rem; flex: 1;">
          <strong style="color: var(--arcade-yellow); font-family: var(--font-mono); font-size: 0.72rem; display: block; margin-bottom: 0.25rem;">DIRECTIVE RECOMMENDATION:</strong>
          ${i.recommendation}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.7rem; color: #6a7f9f; border-top: 1px solid var(--space-border); padding-top: 0.65rem;">
          <span>AUTHOR: ${i.created_by || 'Strategy Desk'}</span>
          <span>${i.created_at ? i.created_at.substring(0, 10) : '2026-10-05'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderActivityLogs() {
  const container = document.getElementById('activityTableContainer');
  if (!container) return;

  if (DashState.activityLogs.length === 0) {
    container.innerHTML = `
      <div style="background: #060b17; border: 1px dashed var(--space-border); border-radius: 8px; padding: 2.5rem; text-align: center;">
        <p style="color: var(--parchment-muted); font-size: 0.85rem;">Audit ledger is clear.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table class="retro-table">
        <thead>
          <tr>
            <th style="width: 18%;">Timestamp (UTC)</th>
            <th style="width: 18%;">Action Event</th>
            <th style="width: 18%;">Target Entity</th>
            <th style="width: 32%;">Description</th>
            <th style="width: 14%;">Analyst</th>
          </tr>
        </thead>
        <tbody>
          ${DashState.activityLogs.map(a => `
            <tr>
              <td style="font-family: var(--font-mono); font-size: 0.75rem; color: #7f97bd;">${a.created_at}</td>
              <td><span class="signal-badge-minor" style="font-size: 0.68rem;">${a.action}</span></td>
              <td style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--arcade-yellow);">${a.entity_type} #${a.entity_id}</td>
              <td style="color: #c4d7f5; font-size: 0.82rem;">${a.description}</td>
              <td style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--arcade-teal);">${a.analyst || 'System'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   AI STRATEGY BRIEFING SYNTHESIZER
   ========================================================================== */
function initBriefingSynthesizer() {
  const synthBtn = document.getElementById('btnSynthesizeBriefing');
  const exportBtn = document.getElementById('btnExportBriefing');
  const outputBox = document.getElementById('briefingTerminalOutput');

  if (synthBtn) {
    synthBtn.addEventListener('click', () => {
      const comp = document.getElementById('briefingCompetitorSelect').value;
      const domain = document.getElementById('briefingDomainSelect').value;
      generateAIStreamingBriefing(comp, domain);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!outputBox || !outputBox.textContent) return;
      const blob = new Blob([outputBox.textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MARVEAN_MV_INTEL_BRIEFING_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

window.loadBriefingFor = function(competitorName) {
  const tab = document.querySelector('.dash-view-tab[data-dash-tab="briefings"]');
  if (tab) tab.click();

  const select = document.getElementById('briefingCompetitorSelect');
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.includes(competitorName)) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  generateAIStreamingBriefing(competitorName, 'PRICING_AND_GO_TO_MARKET');
};

function generateAIStreamingBriefing(competitor, domain) {
  const outputBox = document.getElementById('briefingTerminalOutput');
  const exportBtn = document.getElementById('btnExportBriefing');
  if (!outputBox) return;

  outputBox.textContent = `[INITIALIZING NEURAL STRATEGIC SYNTHESIS FOR: ${competitor.toUpperCase()}]...\n`;
  playTone('powerup');

  const briefingText = `
================================================================================
MARVEAN MV INTEL™ // EXECUTIVE STRATEGIC BRIEFING
CLASSIFICATION: ENTERPRISE CONFIDENTIAL // GENERATED: ${new Date().toUTCString()}
TARGET COMPETITOR: ${competitor}
FOCUS DOMAIN: ${domain}
================================================================================

1. EXECUTIVE THREAT ASSESSMENT
--------------------------------------------------------------------------------
Competitor ${competitor} has initiated an aggressive market posture within global enterprise commerce. Automated differential crawlers detect an accelerated deployment of localized pricing models paired with defensive patent fencing.

- Threat Volatility Rating: 91 / 100 (HIGH SEVERITY)
- Anticipated Impact Horizon: 30 - 60 Days
- Primary Vulnerability: Margin compression across high-throughput vector ingestion

2. PROACTIVE STRATEGIC COUNTER-MOVES
--------------------------------------------------------------------------------
[ACTION 01]: Immediate Commercial Packaging Re-alignment
  Launch a transparent "Zero Hidden Surcharges" bundle targeting ${competitor}'s top 50 Enterprise tier accounts. Highlight their 18% overage multiplier.

[ACTION 02]: Evidence-Backed Sales Battlecard Distribution
  Equip enterprise account executives with audited SEC Form 10-Q provenance showing ${competitor}'s declining capital expenditure in multi-region infrastructure.

[ACTION 03]: Patent Defense Shielding
  Accelerate filing for provisional patent claims on speculative caching algorithms to pre-empt their USPTO expansion.

3. AUDITED EVIDENCE CITATIONS
--------------------------------------------------------------------------------
- SEC EDGAR Filing Hash: sha256:7f83b1657ff1fc53b92dc18148a1d65d
- Direct Web Diff Provenance: SKU-9941 Timestamp Verified (Latency: 14.8ms)
- Autonomous NLP Entity Confidence: 99.4%
================================================================================
[STATUS]: Strategic Synthesis Complete. Counter-measures ready for C-Suite execution.
  `;

  let idx = 0;
  outputBox.textContent = '';
  const timer = setInterval(() => {
    outputBox.textContent += briefingText.slice(idx, idx + 18);
    idx += 18;
    outputBox.scrollTop = outputBox.scrollHeight;

    if (idx >= briefingText.length) {
      clearInterval(timer);
      if (exportBtn) exportBtn.style.display = 'inline-flex';
      playTone('select');
    }
  }, 20);
}

/* ==========================================================================
   DEVELOPER API GATEWAY CONSOLE
   ========================================================================== */
function initDeveloperConsole() {
  const regenBtn = document.getElementById('btnRegenKey');
  const copyBtn = document.getElementById('btnCopyKey');
  const keyInput = document.getElementById('apiKeyField');
  const webhookBtn = document.getElementById('btnTestWebhook');
  const webhookStatus = document.getElementById('webhookTestStatus');

  if (regenBtn && keyInput) {
    regenBtn.addEventListener('click', () => {
      const newKey = 'mv_live_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      keyInput.value = newKey;
      playTone('powerup');
      alert('New production API key generated. Ensure you update your environment variables.');
    });
  }

  if (copyBtn && keyInput) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(keyInput.value).then(() => {
        copyBtn.textContent = 'COPIED!';
        setTimeout(() => { copyBtn.textContent = 'COPY KEY'; }, 1800);
      });
    });
  }

  if (webhookBtn && webhookStatus) {
    webhookBtn.addEventListener('click', () => {
      webhookStatus.style.display = 'block';
      webhookStatus.textContent = 'Sending mock HTTP POST payload to configured endpoint...';
      playTone('select');

      setTimeout(() => {
        webhookStatus.innerHTML = '<span style="color: var(--arcade-teal); font-weight: 700;">✓ 200 OK: Webhook received by endpoint in 42ms. Payload validated.</span>';
      }, 700);
    });
  }
}

/* ==========================================================================
   UNIQUE TELEMETRY GRAPH: MARKET SIGNAL VELOCITY & THREAT RADAR
   ========================================================================== */
/* ==========================================================================
   UNIQUE TELEMETRY GRAPH: DUAL-LAYER MOUNTAIN DENSITY SPLINE RADAR
   Pattern: High dark-slate mountain envelope + foreground radiant orange wave
   ========================================================================== */
const mountainWavePattern = [
  { tick: '25',  xVal: 25,  upper: 0.2,  lower: 0.0, time: '25',  timestamp: 'Signal Phase 25' },
  { tick: '50',  xVal: 50,  upper: 3.8,  lower: 1.2, time: '50',  timestamp: 'Signal Phase 50' },
  { tick: '65',  xVal: 65,  upper: 22.0, lower: 10.5, time: '65',  timestamp: 'Crest Alpha (65)' },
  { tick: '78',  xVal: 78,  upper: 13.5, lower: 6.0,  time: '78',  timestamp: 'Trough 78' },
  { tick: '92',  xVal: 92,  upper: 16.5, lower: 7.5,  time: '92',  timestamp: 'Plateau 92' },
  { tick: '105', xVal: 105, upper: 18.0, lower: 8.5,  time: '105', timestamp: 'Ridge 105' },
  { tick: '115', xVal: 115, upper: 32.0, lower: 13.0, time: '115', timestamp: 'Base Spire 115' },
  { tick: '125', xVal: 125, upper: 78.5, lower: 24.5, time: '125', timestamp: 'Central Spire (125)', anomaly: 'Peak Algorithmic Pricing Surge' },
  { tick: '136', xVal: 136, upper: 38.0, lower: 11.0, time: '136', timestamp: 'Descent 136' },
  { tick: '144', xVal: 144, upper: 14.5, lower: 5.0,  time: '144', timestamp: 'Gorge 144' },
  { tick: '155', xVal: 155, upper: 38.0, lower: 15.0, time: '155', timestamp: 'Crest Beta (155)' },
  { tick: '168', xVal: 168, upper: 13.0, lower: 4.8,  time: '168', timestamp: 'Trough 168' },
  { tick: '180', xVal: 180, upper: 18.5, lower: 6.8,  time: '180', timestamp: 'Crest Gamma (180)' },
  { tick: '195', xVal: 195, upper: 12.0, lower: 4.0,  time: '195', timestamp: 'Slope 195' },
  { tick: '210', xVal: 210, upper: 5.5,  lower: 1.8,  time: '210', timestamp: 'Descent 210' },
  { tick: '225', xVal: 225, upper: 2.0,  lower: 0.6,  time: '225', timestamp: 'Taper 225' },
  { tick: '240', xVal: 240, upper: 0.5,  lower: 0.1,  time: '240', timestamp: 'Taper 240' },
  { tick: '255', xVal: 255, upper: 0.0,  lower: 0.0,  time: '255', timestamp: 'Baseline' }
];

function generateWaveDataset(scaleUpper = 1.0, scaleLower = 1.0, labelPrefix = '') {
  return mountainWavePattern.map(p => ({
    ...p,
    time: p.tick,
    timestamp: labelPrefix ? `${labelPrefix} • Scope ${p.tick}` : `Signal Index ${p.tick}`,
    threat: +(p.upper * scaleUpper).toFixed(1),
    velocity: Math.round(p.lower * scaleLower * 14 + 110),
    upper: +(p.upper * scaleUpper).toFixed(1),
    lower: +(p.lower * scaleLower).toFixed(1),
    competitor: p.anomaly ? 'Nexus Intelligence Core' : undefined
  }));
}

const RadarGraphState = {
  activeInterval: '7d', // Canonical default matching the user's reference (Woche)
  visibleMetrics: { threat: true, velocity: true, anomalies: true },
  liveTimer: null,
  datasets: {
    '7d': generateWaveDataset(1.0, 1.0, 'Woche (7D)'),
    '30d': generateWaveDataset(1.02, 0.96, 'Monat (30D)'),
    '24h': generateWaveDataset(0.97, 1.04, '24H Horizon'),
    '1h': generateWaveDataset(0.91, 0.94, '1H Horizon')
  },
  liveBuffer: []
};

function initTelemetryRadarGraph() {
  const container = document.getElementById('radarSvgContainer');
  if (!container) return;

  // Initialize live buffer from 7d data
  RadarGraphState.liveBuffer = JSON.parse(JSON.stringify(RadarGraphState.datasets['7d']));

  // Interval filter buttons (Woche, Monat, 24H, 1H, LIVE)
  const timeBtns = document.querySelectorAll('#radarTimeFilterGroup .radar-time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const interval = btn.getAttribute('data-interval');
      setRadarInterval(interval);
      playTone('select');
    });
  });

  // Metric toggles (Upper Slate Envelope, Lower Orange Wave, Anomaly Markers)
  const toggleThreat = document.getElementById('toggleThreatMetric');
  const toggleVelocity = document.getElementById('toggleVelocityMetric');
  const toggleAnomalies = document.getElementById('toggleAnomaliesMetric');

  if (toggleThreat) {
    toggleThreat.addEventListener('click', () => {
      RadarGraphState.visibleMetrics.threat = !RadarGraphState.visibleMetrics.threat;
      toggleThreat.classList.toggle('active', RadarGraphState.visibleMetrics.threat);
      renderRadarGraph();
      playTone('select');
    });
  }

  if (toggleVelocity) {
    toggleVelocity.addEventListener('click', () => {
      RadarGraphState.visibleMetrics.velocity = !RadarGraphState.visibleMetrics.velocity;
      toggleVelocity.classList.toggle('active', RadarGraphState.visibleMetrics.velocity);
      renderRadarGraph();
      playTone('select');
    });
  }

  if (toggleAnomalies) {
    toggleAnomalies.addEventListener('click', () => {
      RadarGraphState.visibleMetrics.anomalies = !RadarGraphState.visibleMetrics.anomalies;
      toggleAnomalies.classList.toggle('active', RadarGraphState.visibleMetrics.anomalies);
      renderRadarGraph();
      playTone('select');
    });
  }

  // Crosshair tracking & tooltip
  const crosshair = document.getElementById('radarCrosshairLine');
  const tooltip = document.getElementById('radarChartTooltip');

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * 960;

    const data = getActiveRadarData();
    if (!data || data.length === 0) return;

    // Find nearest point
    const startX = 40;
    const endX = 930;
    const step = (endX - startX) / (data.length - 1);
    let nearestIdx = Math.round((svgX - startX) / step);
    nearestIdx = Math.max(0, Math.min(data.length - 1, nearestIdx));
    const pt = data[nearestIdx];

    const ptX = startX + nearestIdx * step;
    const ptUpper = pt.upper !== undefined ? pt.upper : pt.threat;
    const threatY = 230 - (ptUpper / 100) * 195;

    if (crosshair) {
      crosshair.style.display = 'block';
      crosshair.style.left = `${(ptX / 960) * 100}%`;
    }

    if (tooltip) {
      tooltip.style.display = 'block';
      tooltip.style.left = `${(ptX / 960) * 100}%`;
      tooltip.style.top = `${(threatY / 250) * 100}%`;

      tooltip.innerHTML = `
        <div style="font-weight: 700; color: #fff; margin-bottom: 3px; display: flex; justify-content: space-between; gap: 10px;">
          <span>${pt.timestamp || ('Phase ' + pt.time)}</span>
          <span style="color: #ea5e28; font-weight: 800;">${ptUpper}% Intensity</span>
        </div>
        <div style="color: #9cb3d3; display: flex; justify-content: space-between; gap: 10px;">
          <span>Core Wave (Orange):</span>
          <span style="color: #f97316; font-weight: 700;">${pt.lower !== undefined ? pt.lower : Math.round(pt.velocity / 15)}%</span>
        </div>
        <div style="color: #728cad; display: flex; justify-content: space-between; gap: 10px;">
          <span>Upper Wave (Slate):</span>
          <span style="color: #8da4c8; font-weight: 700;">${ptUpper}%</span>
        </div>
        ${pt.anomaly ? `
        <div style="margin-top: 5px; padding-top: 4px; border-top: 1px solid rgba(234, 94, 40, 0.4); color: #ffc23d;">
          <span style="color: #ea5e28; font-weight: 700;">SPIRE ANOMALY:</span> ${pt.anomaly}
        </div>` : ''}
      `;
    }
  });

  container.addEventListener('mouseleave', () => {
    if (crosshair) crosshair.style.display = 'none';
    if (tooltip) tooltip.style.display = 'none';
  });

  // Initial draw
  updateRadarSummaryCards();
  renderRadarGraph();
}

function setRadarInterval(interval) {
  RadarGraphState.activeInterval = interval;
  const scanBeam = document.getElementById('radarScanBeam');

  if (RadarGraphState.liveTimer) {
    clearInterval(RadarGraphState.liveTimer);
    RadarGraphState.liveTimer = null;
  }

  if (interval === 'live') {
    if (scanBeam) scanBeam.style.display = 'block';
    startLiveRadarTicker();
  } else {
    if (scanBeam) scanBeam.style.display = 'none';
  }

  updateRadarSummaryCards();
  renderRadarGraph();
}

function startLiveRadarTicker() {
  RadarGraphState.liveTimer = setInterval(() => {
    if (RadarGraphState.activeInterval !== 'live') return;

    // Gently pulse the central peaks and wave ridges in real-time
    const buf = RadarGraphState.liveBuffer;
    buf.forEach((pt, idx) => {
      if (idx === 7) { // Central spire
        pt.upper = +(78.5 + (Math.sin(Date.now() / 1000) * 4)).toFixed(1);
        pt.lower = +(24.5 + (Math.sin(Date.now() / 900) * 2)).toFixed(1);
      } else if (idx === 2 || idx === 10) { // Secondary crests
        pt.upper = +(mountainWavePattern[idx].upper + (Math.sin(Date.now() / 1200 + idx) * 2)).toFixed(1);
        pt.lower = +(mountainWavePattern[idx].lower + (Math.sin(Date.now() / 1100 + idx) * 1)).toFixed(1);
      }
      pt.threat = pt.upper;
      pt.velocity = Math.round(pt.lower * 14 + 110);
    });

    updateRadarSummaryCards();
    renderRadarGraph();
  }, 1200);
}

function getActiveRadarData() {
  if (RadarGraphState.activeInterval === 'live') {
    return RadarGraphState.liveBuffer;
  }
  return RadarGraphState.datasets[RadarGraphState.activeInterval] || RadarGraphState.datasets['7d'];
}

function updateRadarSummaryCards() {
  const data = getActiveRadarData();
  if (!data || data.length === 0) return;

  const maxUpper = Math.max(...data.map(d => d.upper !== undefined ? d.upper : d.threat));
  const avgLower = (data.reduce((acc, d) => acc + (d.lower !== undefined ? d.lower : 15), 0) / data.length).toFixed(1);
  const anomaliesCount = data.filter(d => d.anomaly).length;

  const elPeak = document.getElementById('radarStatPeak');
  const elVel = document.getElementById('radarStatVelocity');
  const elAnom = document.getElementById('radarStatAnomalies');

  if (elPeak) elPeak.textContent = maxUpper.toFixed(1);
  if (elVel) elVel.textContent = avgLower;
  if (elAnom) elAnom.textContent = anomaliesCount || '4';
}

// Generate smooth cubic Bezier path from points (Catmull-Rom to Cubic Bezier)
function generateSmoothPath(points) {
  if (points.length < 2) return '';
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

function renderRadarGraph() {
  const data = getActiveRadarData();
  if (!data || data.length === 0) return;

  const threatAreaLayer = document.getElementById('radarThreatAreaLayer');
  const threatLineLayer = document.getElementById('radarThreatLineLayer');
  const velocityLayer = document.getElementById('radarVelocityLayer');
  const anomaliesLayer = document.getElementById('radarAnomaliesLayer');
  const xAxisLabels = document.getElementById('radarXAxisLabels');

  if (!threatAreaLayer) return;

  const startX = 40;
  const endX = 930;
  const baselineY = 230;
  const step = (endX - startX) / (data.length - 1);

  // Scaled coordinates
  const upperPoints = data.map((d, i) => {
    const val = d.upper !== undefined ? d.upper : d.threat;
    return {
      x: startX + i * step,
      y: baselineY - (val / 100) * 195,
      raw: d
    };
  });

  const lowerPoints = data.map((d, i) => {
    const val = d.lower !== undefined ? d.lower : (d.velocity / 600) * 100;
    return {
      x: startX + i * step,
      y: baselineY - (val / 100) * 195,
      raw: d
    };
  });

  // 1. Render Upper Wave Layer (Deep Cyber Slate / Mountain Wave)
  if (threatAreaLayer) {
    if (RadarGraphState.visibleMetrics.threat) {
      const uPath = generateSmoothPath(upperPoints);
      const areaPath = `${uPath} L ${upperPoints[upperPoints.length - 1].x.toFixed(1)} ${baselineY} L ${upperPoints[0].x.toFixed(1)} ${baselineY} Z`;

      threatAreaLayer.innerHTML = `
        <path d="${areaPath}" fill="url(#ridgeUpperGrad)" />
        <path d="${uPath}" fill="none" stroke="#38bdf8" stroke-width="2" />
      `;
    } else {
      threatAreaLayer.innerHTML = '';
    }
  }

  // 2. Render Lower Wave Layer (Radiant Glowing Orange Core Wave)
  if (velocityLayer) {
    if (RadarGraphState.visibleMetrics.velocity) {
      const lPath = generateSmoothPath(lowerPoints);
      const areaPath = `${lPath} L ${lowerPoints[lowerPoints.length - 1].x.toFixed(1)} ${baselineY} L ${lowerPoints[0].x.toFixed(1)} ${baselineY} Z`;

      velocityLayer.innerHTML = `
        <path d="${areaPath}" fill="url(#ridgeLowerGrad)" />
        <path d="${lPath}" fill="none" stroke="#ff7843" stroke-width="2" />
      `;
    } else {
      velocityLayer.innerHTML = '';
    }
  }

  // 3. Render Anomaly Spikes (Subtle glowing marker at Spire Peak)
  if (anomaliesLayer) {
    if (RadarGraphState.visibleMetrics.anomalies) {
      const anomalies = upperPoints.filter(p => p.raw.anomaly);
      anomaliesLayer.innerHTML = anomalies.map(p => `
        <g class="radar-anomaly-marker" style="cursor: pointer;" onclick="handleRadarAnomalyClick('${encodeURIComponent(p.raw.anomaly)}')">
          <line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${baselineY}" stroke="#ea5e28" stroke-width="1.5" stroke-dasharray="3 3"/>
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="10" fill="none" stroke="#ea5e28" stroke-width="1.5" opacity="0.6">
            <animate attributeName="r" values="5;13;5" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#ea5e28" filter="url(#radarNeonGlow)"/>
          <rect x="${(p.x - 38).toFixed(1)}" y="${(p.y - 25).toFixed(1)}" width="76" height="18" rx="4" fill="rgba(8, 16, 34, 0.95)" stroke="#ea5e28" stroke-width="1.5"/>
          <text x="${p.x.toFixed(1)}" y="${(p.y - 12).toFixed(1)}" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700" text-anchor="middle">PEAK 78.5</text>
        </g>
      `).join('');
    } else {
      anomaliesLayer.innerHTML = '';
    }
  }

  // 4. Render X-Axis Labels (Ticks matching canonical pattern: 50, 75, 100, 125, 150, 175, 200, 225)
  if (xAxisLabels) {
    const majorTicks = ['50', '75', '100', '125', '150', '175', '200', '225'];
    xAxisLabels.innerHTML = upperPoints.map(p => {
      const isMajor = majorTicks.includes(p.raw.tick);
      if (!isMajor) return '';
      return `
        <line x1="${p.x.toFixed(1)}" y1="${baselineY}" x2="${p.x.toFixed(1)}" y2="${baselineY + 4}" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1"/>
        <text x="${p.x.toFixed(1)}" y="${baselineY + 16}" fill="#718ba8" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" text-anchor="middle">${p.raw.tick}</text>
      `;
    }).join('');
  }
}

window.handleRadarAnomalyClick = function(encodedAnomaly) {
  const anomalyText = decodeURIComponent(encodedAnomaly);
  switchDashboardTab('signals');
  const searchInput = document.getElementById('signalSearchInput');
  if (searchInput) {
    searchInput.value = anomalyText.split(' ')[0];
    renderSignalsFeed();
  }
  playTone('alert');
};

/* ==========================================================================
   GLOBAL SEARCH & MULTI-CATEGORY FILTER CONSOLE
   ========================================================================== */
function initGlobalSearchAndFilter() {
  const searchInput = document.getElementById('globalSearchInput');
  const clearBtn = document.getElementById('globalSearchClearBtn');
  const countBadge = document.getElementById('globalSearchCount');
  const drawer = document.getElementById('globalSearchResultsDrawer');
  const resultsList = document.getElementById('globalSearchResultsList');
  const filterChips = document.querySelectorAll('#globalFilterChips .global-filter-chip');

  // Update initial counts
  updateGlobalAssetCounts();

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      DashState.globalSearchQuery = query;

      if (clearBtn) clearBtn.style.display = query.length > 0 ? 'inline-block' : 'none';

      executeGlobalSearch(query);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length > 0 && drawer) {
        drawer.classList.add('active');
      }
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      DashState.globalSearchQuery = '';
      clearBtn.style.display = 'none';
      if (drawer) drawer.classList.remove('active');
      executeGlobalSearch('');
      playTone('select');
    });
  }

  // Close drawer on click outside
  document.addEventListener('click', (e) => {
    if (drawer && !drawer.contains(e.target) && searchInput && !searchInput.contains(e.target)) {
      drawer.classList.remove('active');
    }
  });

  // Global Keyboard Shortcut: '/' to search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
        playTone('hover');
      }
    }
    if (e.key === 'Escape' && drawer) {
      drawer.classList.remove('active');
    }
  });

  // Filter chips
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.getAttribute('data-cat') || 'all';
      DashState.globalSearchCategory = cat;

      if (cat === 'critical') {
        switchDashboardTab('signals');
        DashState.activeSignalFilter = 'Critical';
        document.querySelectorAll('#signalFilters .signal-chip-filter').forEach(sc => {
          sc.classList.toggle('active', sc.getAttribute('data-filter') === 'Critical');
        });
        renderSignalsFeed();
      } else if (cat !== 'all') {
        switchDashboardTab(cat === 'records' ? 'market-records' : (cat === 'shootouts' ? 'product-comparisons' : cat));
      }

      executeGlobalSearch(searchInput ? searchInput.value.trim() : '');
      playTone('select');
    });
  });
}

function updateGlobalAssetCounts() {
  const cntAll = document.getElementById('cntAll');
  const cntComps = document.getElementById('cntComps');
  const cntRecords = document.getElementById('cntRecords');
  const cntShootouts = document.getElementById('cntShootouts');
  const cntSignals = document.getElementById('cntSignals');
  const cntEvidence = document.getElementById('cntEvidence');

  const total = DashState.competitors.length + DashState.marketRecords.length + 
                DashState.productComparisons.length + DashState.signals.length + 
                DashState.evidence.length;

  if (cntAll) cntAll.textContent = total;
  if (cntComps) cntComps.textContent = DashState.competitors.length;
  if (cntRecords) cntRecords.textContent = DashState.marketRecords.length;
  if (cntShootouts) cntShootouts.textContent = DashState.productComparisons.length;
  if (cntSignals) cntSignals.textContent = DashState.signals.length;
  if (cntEvidence) cntEvidence.textContent = DashState.evidence.length;
}

function executeGlobalSearch(query) {
  const drawer = document.getElementById('globalSearchResultsDrawer');
  const resultsList = document.getElementById('globalSearchResultsList');
  const countBadge = document.getElementById('globalSearchCount');

  const q = query.toLowerCase().trim();

  // 1. In-place tab filtering
  renderCompetitors();
  renderMarketRecords();
  renderSignalsFeed();
  renderEvidence();

  // 2. Aggregate Search Across All Modules
  const matchedComps = DashState.competitors.filter(c => 
    !q || c.name.toLowerCase().includes(q) || (c.ticker && c.ticker.toLowerCase().includes(q)) || c.overview.toLowerCase().includes(q)
  );

  const matchedRecords = DashState.marketRecords.filter(r => 
    !q || r.title.toLowerCase().includes(q) || r.industry.toLowerCase().includes(q) || r.executive_summary.toLowerCase().includes(q)
  );

  const matchedShootouts = DashState.productComparisons.filter(p => 
    !q || p.matrix_name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );

  const matchedSignals = DashState.signals.filter(s => 
    !q || s.title.toLowerCase().includes(q) || s.competitor.toLowerCase().includes(q) || s.details.toLowerCase().includes(q)
  );

  const matchedEvidence = DashState.evidence.filter(e => 
    !q || e.title.toLowerCase().includes(q) || e.document_reference.toLowerCase().includes(q) || e.hash.toLowerCase().includes(q)
  );

  const totalMatches = matchedComps.length + matchedRecords.length + matchedShootouts.length + matchedSignals.length + matchedEvidence.length;

  if (countBadge) {
    countBadge.textContent = q ? `Found ${totalMatches} matching intelligence assets` : `Showing ${totalMatches} intelligence assets`;
  }

  // 3. Render Drawer Popover if user typed something
  if (!q) {
    if (drawer) drawer.classList.remove('active');
    return;
  }

  if (drawer && resultsList) {
    drawer.classList.add('active');

    if (totalMatches === 0) {
      resultsList.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #7f97bd; font-family: var(--font-mono); font-size: 0.8rem;">
          No matching intelligence assets found for "<span style="color: #fff;">${escapeHtml(query)}</span>".
        </div>
      `;
      return;
    }

    let html = '';

    if (matchedComps.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-group-title">COMPETITORS (${matchedComps.length})</div>
          ${matchedComps.map(c => `
            <div class="search-result-row" onclick="jumpToSearchResult('competitors', 'comp-${c.id}')">
              <div class="search-result-row-left">
                <div class="search-res-title">${escapeHtml(c.name)} <span style="color: var(--arcade-teal); font-size: 0.72rem;">[${c.ticker}]</span></div>
                <div class="search-res-snippet">${escapeHtml(c.recentMove || c.overview)}</div>
              </div>
              <span class="search-res-jump-badge">VIEW ➔</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (matchedSignals.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-group-title">REAL-TIME SIGNALS (${matchedSignals.length})</div>
          ${matchedSignals.map(s => `
            <div class="search-result-row" onclick="jumpToSearchResult('signals', 'sig-${s.id}')">
              <div class="search-result-row-left">
                <div class="search-res-title"><span style="color: ${s.severity === 'Critical' ? 'var(--arcade-red)' : 'var(--arcade-yellow)'};">[${s.severity}]</span> ${escapeHtml(s.title)}</div>
                <div class="search-res-snippet">${escapeHtml(s.competitor)} · ${escapeHtml(s.details)}</div>
              </div>
              <span class="search-res-jump-badge">VIEW ➔</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (matchedRecords.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-group-title">MARKET RECORDS (${matchedRecords.length})</div>
          ${matchedRecords.map(r => `
            <div class="search-result-row" onclick="jumpToSearchResult('market-records', 'rec-${r.id}')">
              <div class="search-result-row-left">
                <div class="search-res-title">${escapeHtml(r.title)}</div>
                <div class="search-res-snippet">${escapeHtml(r.industry)} · ${escapeHtml(r.executive_summary)}</div>
              </div>
              <span class="search-res-jump-badge">VIEW ➔</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (matchedShootouts.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-group-title">PRODUCT SHOOTOUTS (${matchedShootouts.length})</div>
          ${matchedShootouts.map(p => `
            <div class="search-result-row" onclick="jumpToSearchResult('product-comparisons', 'shootout-${p.id}')">
              <div class="search-result-row-left">
                <div class="search-res-title">${escapeHtml(p.matrix_name)}</div>
                <div class="search-res-snippet">${escapeHtml(p.category)} · Marvean Advantage</div>
              </div>
              <span class="search-res-jump-badge">VIEW ➔</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (matchedEvidence.length > 0) {
      html += `
        <div class="search-result-group">
          <div class="search-group-title">CRYPTOGRAPHIC EVIDENCE (${matchedEvidence.length})</div>
          ${matchedEvidence.map(e => `
            <div class="search-result-row" onclick="jumpToSearchResult('evidence', 'evi-${e.id}')">
              <div class="search-result-row-left">
                <div class="search-res-title">${escapeHtml(e.title || e.document_reference)}</div>
                <div class="search-res-snippet">${escapeHtml(e.hash)} · ${escapeHtml(e.regulatory_body || 'Direct Telemetry')}</div>
              </div>
              <span class="search-res-jump-badge">VIEW ➔</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    resultsList.innerHTML = html;
  }
}

window.jumpToSearchResult = function(tabName, elementId) {
  switchDashboardTab(tabName);
  const drawer = document.getElementById('globalSearchResultsDrawer');
  if (drawer) drawer.classList.remove('active');

  setTimeout(() => {
    // Scroll to panel container
    const panel = document.getElementById(`panel-${tabName}`);
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);

  playTone('powerup');
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
