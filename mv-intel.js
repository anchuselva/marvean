/**
 * MARVEAN // MV Intel™ - Product Page Interactive Logic
 * Features Web Audio feedback, real-time live telemetry preview, and developer tools.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initDevTabs();
  initCodeCopyButtons();
  initProductTelemetryStream();
});

/* ==========================================================================
   1. Retro Web Audio Synthesizer
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioEngine() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      ensureAudioContext();
      soundEnabled = !soundEnabled;
      audioBtn.classList.toggle('active-toggle', soundEnabled);
      audioBtn.querySelector('span').textContent = soundEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF';
      if (soundEnabled) playSound('powerup');
    });
  }

  // Bind interactive elements
  document.querySelectorAll('button, .btn-arcade, .nav-btn, .dev-tab-btn, .kpi-card, .pillar-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playSound('hover');
    });
    el.addEventListener('click', () => {
      if (soundEnabled) playSound('select');
    });
  });
}

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    ensureAudioContext();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.03);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'select') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.setValueAtTime(680, now + 0.06);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
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
    // Ignore audio autoplay restrictions
  }
}

/* ==========================================================================
   2. Senior Developer Specification Tab Switcher
   ========================================================================== */
function initDevTabs() {
  const tabs = document.querySelectorAll('.dev-tab-btn');
  const panels = document.querySelectorAll('.dev-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
    });
  });
}

/* ==========================================================================
   3. Code Copy Buttons
   ========================================================================== */
function initCodeCopyButtons() {
  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.dev-code-box').querySelector('code');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText.trim()).then(() => {
          const orig = btn.innerText;
          btn.innerText = 'COPIED!';
          btn.style.color = '#fff';
          btn.style.background = '#00e5a3';
          setTimeout(() => {
            btn.innerText = orig;
            btn.style.color = '';
            btn.style.background = '';
          }, 1800);
        });
      }
    });
  });
}

/* ==========================================================================
   4. Live Simulated Telemetry Stream
   ========================================================================== */
function initProductTelemetryStream() {
  const streamCounter = document.getElementById('liveStreamEventsCount');
  const feedNode = document.getElementById('liveProductFeedBox');
  if (!streamCounter && !feedNode) return;

  const mockSignals = [
    { source: "SEC EDGAR", text: "CloudScale Inc files Form 8-K: +$45M Enterprise Debt restructuring", severity: "MAJOR" },
    { source: "USPTO PATENTS", text: "NexusCore grants Patent #US11849201 for distributed LLM inference caching", severity: "CRITICAL" },
    { source: "PRICING MONITOR", text: "DataMesh deprecates $199 Pro tier; moves to usage-based vector querying", severity: "CRITICAL" },
    { source: "EXEC RADAR", text: "Apex AI appoints former Oracle VP as Head of Strategic Cloud Alliances", severity: "MINOR" },
    { source: "GLOBAL COMMERCE", text: "Synthetix deploys direct Shopify Plus checkout automation widget", severity: "MAJOR" }
  ];

  let eventCount = 28419;

  setInterval(() => {
    eventCount += Math.floor(1 + Math.random() * 4);
    if (streamCounter) {
      streamCounter.innerText = eventCount.toLocaleString();
    }

    if (feedNode && Math.random() > 0.4) {
      const item = mockSignals[Math.floor(Math.random() * mockSignals.length)];
      const entry = document.createElement('div');
      entry.className = 'telemetry-log-item';
      entry.style.padding = '0.35rem 0';
      entry.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
      entry.style.fontFamily = 'var(--font-mono)';
      entry.style.fontSize = '0.74rem';
      entry.innerHTML = `
        <span style="color: var(--arcade-teal);">[${new Date().toLocaleTimeString()}]</span>
        <span style="color: var(--arcade-yellow); font-weight: 700;">[${item.source}]</span>
        <span style="color: #c4d7f5;">${item.text}</span>
      `;
      feedNode.prepend(entry);
      if (feedNode.children.length > 8) {
        feedNode.removeChild(feedNode.lastChild);
      }
    }
  }, 3200);
}
