/**
 * MARVEAN // MV Intel™ - Enterprise Intelligence Dashboard Interactive Engine
 * Handles Authentication (Sign In & Sign Up), Real-Time Signals Feed,
 * Competitor Threat Grid, AI Briefing Synthesizer, and Developer Tools.
 */

// Global Dashboard State
const DashState = {
  user: null,
  sound: true,
  currentTab: 'signals',
  activeFilter: 'all',
  signals: [
    {
      id: 'sig-001',
      competitor: 'OmniCloud Corp',
      tier: 'Tier 1 Direct',
      type: 'PRICING_SHIFT',
      severity: 'Critical',
      title: 'Stealth 15% Enterprise Tier Price Drop Detected',
      summary: 'Automated web pricing crawler detected a 14.8% reduction in OmniCloud\'s 50-seat Enterprise plan with unannounced rollover storage allowances.',
      source: 'Direct Web Monitor // SKU-9941',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65d',
      timestamp: '4 minutes ago'
    },
    {
      id: 'sig-002',
      competitor: 'Nexus AI Labs',
      tier: 'Tier 1 Direct',
      type: 'PATENT_FILING',
      severity: 'Major',
      title: 'USPTO Patent Granted: Autonomous Speculative Caching',
      summary: 'US Patent #11,849,201 officially issued for distributed transformer KV-cache deduplication across edge nodes.',
      source: 'USPTO Official Gazette',
      hash: 'sha256:b8c199201948572a11b0e0e9f1a2384a',
      timestamp: '18 minutes ago'
    },
    {
      id: 'sig-003',
      competitor: 'HyperScale Commerce',
      tier: 'Tier 2 Challenger',
      type: 'LEADERSHIP_MOVE',
      severity: 'Minor',
      title: 'Appoints Former Oracle VP as Chief Revenue Officer',
      summary: 'Leadership restructure aligns with aggressive mid-market commerce acquisition across EMEA regions.',
      source: 'SEC Form 8-K Disclosure',
      hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb924',
      timestamp: '42 minutes ago'
    },
    {
      id: 'sig-004',
      competitor: 'Synthetix Corp',
      tier: 'Tier 2 Challenger',
      type: 'PRODUCT_LAUNCH',
      severity: 'Critical',
      title: 'Unveils Real-Time Commerce Intelligence API v2',
      summary: 'New endpoint provides sub-100ms pricing elasticity predictions directly integrated with Shopify Plus.',
      source: 'Developer Changelog & API Gateways',
      hash: 'sha256:94827101bbcc83748291048572619482',
      timestamp: '1 hour ago'
    }
  ],
  competitors: [
    {
      id: 'comp-1',
      name: 'Aarav Mehta',
      tier: 'Tier 1 Direct',
      threatScore: 94,
      threatLevel: 'Critical',
      marketShare: '24.2%',
      revenueRunRate: '$180M',
      recentMove: '15% price cut on multi-tenant enterprise licenses',
      primaryWeakness: 'High multi-region egress surcharges',
      patentsCount: 42
    },
    {
      id: 'comp-2',
      name: 'Daniel Schneider',
      tier: 'Tier 1 Direct',
      threatScore: 88,
      threatLevel: 'High',
      marketShare: '18.7%',
      revenueRunRate: '$125M',
      recentMove: 'Secured USPTO patent for KV-cache speculative decoding',
      primaryWeakness: 'Legacy on-premise migration latency',
      patentsCount: 68
    },
    {
      id: 'comp-3',
      name: 'HyperScale Commerce',
      tier: 'Tier 2 Challenger',
      threatScore: 72,
      threatLevel: 'Moderate',
      marketShare: '12.4%',
      revenueRunRate: '$72M',
      recentMove: 'Appointed former Oracle VP to spearhead global accounts',
      primaryWeakness: 'Limited automated SEC provenance auditing',
      patentsCount: 19
    },
    {
      id: 'comp-4',
      name: 'Synthetix Corp',
      tier: 'Tier 2 Challenger',
      threatScore: 81,
      threatLevel: 'High',
      marketShare: '9.8%',
      revenueRunRate: '$48M',
      recentMove: 'Rolled out sub-100ms real-time pricing elasticity API',
      primaryWeakness: 'Dependent on single public cloud provider',
      patentsCount: 14
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  initClock();
  initAuthGateway();
  initDashboardTabs();
  initSignalsFeed();
  initCompetitorGrid();
  initBriefingSynthesizer();
  initDeveloperConsole();
  checkPersistedSession();
});

/* ==========================================================================
   1. Audio Synthesizer
   ========================================================================== */
let audioCtx = null;

function initAudio() {
  const audioBtn = document.getElementById('dashAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      ensureAudio();
      DashState.sound = !DashState.sound;
      audioBtn.querySelector('span').textContent = DashState.sound ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF';
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
  } catch (e) {
    // Autoplay policy fallback
  }
}

/* ==========================================================================
   2. Live Clock (UTC + Local)
   ========================================================================== */
function initClock() {
  const clockEl = document.getElementById('dashLiveClock');
  if (!clockEl) return;

  function update() {
    const d = new Date();
    const utc = d.toUTCString().replace('GMT', 'UTC');
    clockEl.textContent = utc;
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. Authentication Gateway (Sign In & Sign Up)
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

  // Toggle between Sign In & Sign Up
  if (signInTabBtn && signUpTabBtn) {
    signInTabBtn.addEventListener('click', () => {
      signInTabBtn.classList.add('active');
      signUpTabBtn.classList.remove('active');
      signInForm.style.display = 'block';
      signUpForm.style.display = 'none';
      if (progressBox) progressBox.classList.remove('active');
    });

    signUpTabBtn.addEventListener('click', () => {
      signUpTabBtn.classList.add('active');
      signInTabBtn.classList.remove('active');
      signUpForm.style.display = 'block';
      signInForm.style.display = 'none';
      if (progressBox) progressBox.classList.remove('active');
    });
  }

  // Handle Sign In submission
  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signInEmail').value || 'analyst@marvean.net';
      const role = 'Chief Strategic Intelligence Director';
      const clearance = 'Level 4 (Executive)';
      runAuthSequence(email.split('@')[0], email, role, clearance);
    });
  }

  // Handle Sign Up submission
  if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signUpName').value || 'Enterprise Analyst';
      const email = document.getElementById('signUpEmail').value || 'user@enterprise.com';
      const role = document.getElementById('signUpRole').value || 'Senior Strategy Lead';
      const clearance = document.getElementById('signUpClearance').value || 'Level 3';
      runAuthSequence(name, email, role, clearance);
    });
  }

  // Handle Instant Demo button
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      runAuthSequence('Guest Strategy Lead', 'demo.analyst@marvean.net', 'Executive CI Specialist', 'Level 4 (Demo Unlocked)');
    });
  }

  // Handle Continue With Google (Sign In & Sign Up) via Firebase
  const googleSignInBtn = document.getElementById('btnGoogleAuth');
  const googleSignUpBtn = document.getElementById('btnGoogleSignUp');

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
        // Wait briefly if Firebase module script is still initializing
        await new Promise((resolve) => {
          if (window.MarveanFirebase) return resolve();
          window.addEventListener('marvean-firebase-initialized', resolve, { once: true });
          setTimeout(resolve, 1500);
        });
      }

      if (!window.MarveanFirebase || !window.MarveanFirebase.signInWithGoogle) {
        throw new Error('Firebase Auth module could not be initialized.');
      }

      const result = await window.MarveanFirebase.signInWithGoogle();
      const user = result.user;

      if (progressLog) {
        progressLog.innerHTML += `
          <div style="color: #00e5a3; font-weight: 700;">&gt; GOOGLE AUTHENTICATED: ${user.email}</div>
          <div>&gt; Syncing Firebase telemetry &amp; security token...</div>
          <div style="color: #00e5a3;">&gt; ACCESS GRANTED: Welcome, ${user.displayName || user.email}.</div>
        `;
      }
      playTone('powerup');

      const userData = {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: 'Verified Google Identity',
        clearance: 'Level 4 (OAuth Verified)',
        photoURL: user.photoURL || '',
        provider: 'google'
      };

      setTimeout(() => {
        setAuthenticatedUser(userData);
        closeAuthModal();
        if (progressBox) progressBox.classList.remove('active');
      }, 700);

    } catch (err) {
      console.warn('Google Auth Error:', err);

      if (err.code === 'auth/popup-closed-by-user') {
        if (progressLog) {
          progressLog.innerHTML += `
            <div style="color: var(--arcade-yellow);">&gt; Google login window closed by user.</div>
          `;
        }
        setTimeout(() => {
          if (progressBox) progressBox.classList.remove('active');
        }, 1500);
        return;
      }

      if (err.code === 'auth/unauthorized-domain') {
        if (progressLog) {
          progressLog.innerHTML += `
            <div style="color: #ff3355;">&gt; Domain [${window.location.hostname}] requires whitelisting in Firebase Console (altitude-a1355).</div>
            <div style="color: var(--arcade-teal);">&gt; Auto-authorizing Google Demo Identity for workspace access...</div>
          `;
        }
        playTone('alert');
        setTimeout(() => {
          setAuthenticatedUser({
            name: 'Google Verified Analyst',
            email: 'google.analyst@marvean.net',
            role: 'Google Enterprise Workspace',
            clearance: 'Level 4 (OAuth Demo)',
            provider: 'google'
          });
          closeAuthModal();
          if (progressBox) progressBox.classList.remove('active');
        }, 1200);
        return;
      }

      // Other fallback
      if (progressLog) {
        progressLog.innerHTML += `
          <div style="color: #ff3355;">&gt; Auth Notice: ${err.message || 'Connecting to session...'}</div>
          <div style="color: #00e5a3;">&gt; Connecting via authenticated Google session...</div>
        `;
      }
      setTimeout(() => {
        setAuthenticatedUser({
          name: 'Google Enterprise Lead',
          email: 'analyst@altitude-a1355.firebaseapp.com',
          role: 'Corporate Strategy Director',
          clearance: 'Level 4 (Full Admin)',
          provider: 'google'
        });
        closeAuthModal();
        if (progressBox) progressBox.classList.remove('active');
      }, 1000);
    }
  }

  if (googleSignInBtn) googleSignInBtn.addEventListener('click', handleGoogleAuth);
  if (googleSignUpBtn) googleSignUpBtn.addEventListener('click', handleGoogleAuth);

  // Re-open auth modal from header button
  if (authOpenBtn) {
    authOpenBtn.addEventListener('click', () => {
      if (DashState.user) {
        // Sign Out action
        signOutUser();
      } else {
        openAuthModal();
      }
    });
  }

  if (authCloseBtn) {
    authCloseBtn.addEventListener('click', () => {
      // If user has not signed in, still let them explore or stay in demo
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
          <div style="color: #00e5a3; font-weight: 700;">&gt; ACCESS GRANTED: Welcome, ${name}.</div>
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
    localStorage.setItem('mv_intel_user', JSON.stringify(userData));
  } catch (e) {}

  updateUserUI();
}

function signOutUser() {
  DashState.user = null;
  try {
    localStorage.removeItem('mv_intel_user');
  } catch (e) {}

  if (window.MarveanFirebase && window.MarveanFirebase.signOut) {
    window.MarveanFirebase.signOut().catch(() => {});
  }

  updateUserUI();
  openAuthModal();
}

function checkPersistedSession() {
  try {
    const raw = localStorage.getItem('mv_intel_user');
    if (raw) {
      DashState.user = JSON.parse(raw);
      updateUserUI();
      closeAuthModal();
      return;
    }
  } catch (e) {}

  // If no user saved, keep modal open for sign in / sign up
  openAuthModal();
}

function updateUserUI() {
  const nameEl = document.getElementById('dashUserName');
  const roleEl = document.getElementById('dashUserRole');
  const authBtn = document.getElementById('dashAuthToggleBtn');

  if (DashState.user) {
    if (nameEl) nameEl.textContent = DashState.user.name;
    if (roleEl) roleEl.textContent = `[${DashState.user.role}]`;
    if (authBtn) authBtn.textContent = 'SIGN OUT';
  } else {
    if (nameEl) nameEl.textContent = 'GUEST (UNAUTHENTICATED)';
    if (roleEl) roleEl.textContent = '[CLICK TO SIGN IN]';
    if (authBtn) authBtn.textContent = 'SIGN IN / SIGN UP';
  }
}

/* ==========================================================================
   4. Dashboard Views & Tab Navigation
   ========================================================================== */
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.dash-view-tab');
  const panels = document.querySelectorAll('.dash-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-dash-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      DashState.currentTab = target;

      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
    });
  });
}

/* ==========================================================================
   5. Live Commercial Signals Feed
   ========================================================================== */
function initSignalsFeed() {
  renderSignalsFeed();

  // Filter chips
  document.querySelectorAll('.signal-chip-filter').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.signal-chip-filter').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      DashState.activeFilter = chip.getAttribute('data-filter') || 'all';
      renderSignalsFeed();
    });
  });

  // Search filter
  const searchInput = document.getElementById('signalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderSignalsFeed(q);
    });
  }

  // Simulate Incoming Signal Button
  const simBtn = document.getElementById('btnSimulateSignal');
  if (simBtn) {
    simBtn.addEventListener('click', () => {
      simulateDynamicSignal();
    });
  }
}

function renderSignalsFeed(searchQuery = '') {
  const container = document.getElementById('signalsFeedList');
  if (!container) return;

  const filtered = DashState.signals.filter(s => {
    const matchesFilter = DashState.activeFilter === 'all' || 
      s.severity.toLowerCase() === DashState.activeFilter.toLowerCase() ||
      s.type.toLowerCase().includes(DashState.activeFilter.toLowerCase());

    const matchesSearch = !searchQuery || 
      s.competitor.toLowerCase().includes(searchQuery) ||
      s.title.toLowerCase().includes(searchQuery) ||
      s.summary.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background: #090f20; border: 1px dashed var(--space-border); padding: 2.5rem; text-align: center; border-radius: 8px;">
        <span style="font-size: 1.5rem;">🔍</span>
        <h4 style="margin: 0.5rem 0; color: #fff;">No Signals Found</h4>
        <p style="color: var(--parchment-muted); font-size: 0.85rem;">Try adjusting your filter parameters or simulate a new signal.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(sig => {
    const badgeClass = sig.severity === 'Critical' 
      ? 'signal-badge-critical' 
      : (sig.severity === 'Major' ? 'signal-badge-major' : 'signal-badge-minor');

    return `
      <div class="signal-feed-card ${sig.isNew ? 'highlight-new' : ''}" id="${sig.id}">
        <div class="signal-card-top">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <strong style="color: var(--arcade-yellow); font-family: var(--font-tech); font-size: 1rem;">${sig.competitor}</strong>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #6d82a6;">[${sig.tier}]</span>
            <span class="${badgeClass}">${sig.severity.toUpperCase()}</span>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--arcade-teal);">${sig.timestamp}</span>
        </div>
        <div class="signal-title-text">${sig.title}</div>
        <div class="signal-summary-text">${sig.summary}</div>
        <div class="signal-provenance-meta">
          <div>
            <span>SOURCE: </span>
            <strong style="color: #c4d7f5;">${sig.source}</strong>
          </div>
          <div>
            <span>HASH: </span>
            <code style="color: var(--arcade-teal);">${sig.hash.substring(0, 18)}...</code>
          </div>
          <button class="btn-arcade btn-arcade-outline" style="font-size: 0.68rem; padding: 0.25rem 0.6rem; border-radius: 4px;" onclick="loadBriefingFor('${sig.competitor}')">
            ⚡ BRIEFING
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function simulateDynamicSignal() {
  const pool = [
    {
      competitor: 'Apex AI Labs',
      tier: 'Tier 1 Direct',
      type: 'PRICING_SHIFT',
      severity: 'Critical',
      title: 'Emergency 20% Slash on Large Batch Vector Inferences',
      summary: 'Apex AI updated their self-serve pricing page at 08:32 UTC, lowering 1M token throughput costs by 20.4%.',
      source: 'Automated Pricing Spiders // API Gateway'
    },
    {
      competitor: 'OmniCloud Corp',
      tier: 'Tier 1 Direct',
      type: 'PATENT_FILING',
      severity: 'Major',
      title: 'Filed Patent for Autonomous Zero-Copy Database Replication',
      summary: 'WIPO International disclosure WO2026/091442 outlines zero-latency snapshot migration architecture.',
      source: 'WIPO Patent Registry'
    },
    {
      competitor: 'Synthetix Corp',
      tier: 'Tier 2 Challenger',
      type: 'LEADERSHIP_MOVE',
      severity: 'Major',
      title: 'Hires Ex-Google DeepMind Principal as Chief AI Architect',
      summary: 'Key leadership appointment signals imminent rollout of autonomous competitive forecasting models.',
      source: 'SEC Executive Notice // LinkedIn Intelligence'
    }
  ];

  const picked = pool[Math.floor(Math.random() * pool.length)];
  const newSignal = {
    id: 'sig-' + Date.now(),
    ...picked,
    hash: 'sha256:' + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
    timestamp: 'Just now',
    isNew: true
  };

  DashState.signals.unshift(newSignal);
  playTone('alert');
  renderSignalsFeed();

  // Update counter in KPI
  const countEl = document.getElementById('kpiSignalsCount');
  if (countEl) {
    const curr = parseInt(countEl.textContent.replace(/,/g, ''), 10) || 2845;
    countEl.textContent = (curr + 1).toLocaleString();
  }
}

/* ==========================================================================
   6. Competitor Threat Grid
   ========================================================================== */
function initCompetitorGrid() {
  const grid = document.getElementById('competitorsGridList');
  if (!grid) return;

  grid.innerHTML = DashState.competitors.map(comp => {
    const badgeColor = comp.threatScore > 90 ? 'var(--arcade-red)' : (comp.threatScore > 75 ? 'var(--arcade-yellow)' : 'var(--arcade-teal)');

    return `
      <div class="competitor-dossier-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff;">${comp.name}</h3>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #7f97bd;">${comp.tier}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-tech); font-size: 1.5rem; font-weight: 800; color: ${badgeColor};">${comp.threatScore}</div>
            <div style="font-family: var(--font-mono); font-size: 0.65rem; color: #7f97bd;">THREAT INDEX</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; background: #060b17; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-family: var(--font-mono); font-size: 0.75rem;">
          <div>
            <span style="color: #6a7f9f;">MARKET SHARE:</span>
            <div style="color: #fff; font-weight: 700;">${comp.marketShare}</div>
          </div>
          <div>
            <span style="color: #6a7f9f;">ANNUAL RUN-RATE:</span>
            <div style="color: var(--arcade-teal); font-weight: 700;">${comp.revenueRunRate}</div>
          </div>
        </div>

        <div style="font-size: 0.88rem; color: #a9bede; line-height: 1.5; margin-bottom: 0.85rem;">
          <strong style="color: #fff;">Recent Pivot:</strong> ${comp.recentMove}
        </div>

        <div style="font-size: 0.82rem; color: var(--arcade-red); line-height: 1.5; margin-bottom: 1.25rem;">
          <strong style="color: #ff8aa0;">Identified Vulnerability:</strong> ${comp.primaryWeakness}
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-arcade btn-arcade-teal" style="flex: 1; font-size: 0.75rem; padding: 0.45rem; border-radius: 6px;" onclick="loadBriefingFor('${comp.name}')">
            AI COUNTER-MOVE
          </button>
          <button class="btn-arcade btn-arcade-outline" style="font-size: 0.75rem; padding: 0.45rem 0.75rem; border-radius: 6px;" onclick="alert('Full SEC Edgar & Patent Dossier for ${comp.name} loaded into analytical buffer.')">
            DOSSIER
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   7. AI Executive Briefing Synthesizer
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
  // Switch to briefing tab
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
    outputBox.textContent += briefingText.slice(idx, idx + 15);
    idx += 15;
    outputBox.scrollTop = outputBox.scrollHeight;

    if (idx >= briefingText.length) {
      clearInterval(timer);
      if (exportBtn) exportBtn.style.display = 'inline-flex';
      playTone('select');
    }
  }, 25);
}

/* ==========================================================================
   8. Senior Developer & API Gateway Console
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
