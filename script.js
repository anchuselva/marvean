/**
 * MARVEAN - AI Model Optimization & Decision Engine
 * Interactive Retro Arcade Engine Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSynthesizer();
  initCrtToggle();
  initSimulator();
  initSdkTerminal();
  initPricingToggle();
  initContactTerminal();
  initFaqAccordion();
  initSystemTicker();
  initMobileNav();
});

/* ==========================================================================
   1. Web Audio API - Retro 8-bit Sound Synthesizer (No external files)
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

  // Attach sound triggers to interactive elements
  document.querySelectorAll('button, .btn-arcade, .nav-btn, .card-btn, .btn-cartridge, input[type="checkbox"], select').forEach(elem => {
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
    // Crisp retro micro-blip
    osc.type = 'square';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'select') {
    // 8-bit coin jump tone
    osc.type = 'square';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.06); // A5
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  } else if (type === 'powerup') {
    // Retro level start chime
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      o.connect(g);
      g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.07, now + idx * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.1);
      o.start(now + idx * 0.07);
      o.stop(now + idx * 0.07 + 0.1);
    });
  } else if (type === 'compute') {
    // Data packet processing tone
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

/* ==========================================================================
   2. CRT Scanline Toggle
   ========================================================================== */
function initCrtToggle() {
  const crtBtn = document.getElementById('crtToggleBtn');
  if (!crtBtn) return;

  crtBtn.addEventListener('click', () => {
    document.body.classList.toggle('crt-active');
    const isActive = document.body.classList.contains('crt-active');
    crtBtn.classList.toggle('active-toggle', isActive);
    crtBtn.innerText = isActive ? '📺 CRT: ON' : '📺 CRT: OFF';
    if (soundEnabled) playArcadeSound('select');
  });
}

/* ==========================================================================
   3. Interactive Model Optimizer & Benchmark Simulator
   ========================================================================== */
const MODEL_SPECS = {
  'llama-70b': { name: 'Llama 3 70B (Base)', baseLatency: 142, baseVram: 140, baseTok: 38, baseCost: 4800 },
  'mistral-large': { name: 'Mistral Large 2', baseLatency: 125, baseVram: 128, baseTok: 42, baseCost: 4200 },
  'deepseek-v2': { name: 'DeepSeek V2.5 (MoE)', baseLatency: 98, baseVram: 160, baseTok: 55, baseCost: 3900 },
  'qwen-72b': { name: 'Qwen 2.5 72B', baseLatency: 135, baseVram: 144, baseTok: 40, baseCost: 4600 },
  'custom-vit': { name: 'Custom Vision-LLM', baseLatency: 84, baseVram: 80, baseTok: 62, baseCost: 2800 }
};

const HARDWARE_MODS = {
  'h100': { mult: 1.0, name: 'NVIDIA H100 SXM5' },
  'l40s': { mult: 1.35, name: 'NVIDIA L40S' },
  'm3-max': { mult: 1.7, name: 'Apple M3 Max (Unified)' },
  'webgpu': { mult: 2.2, name: 'Edge Client (WebGPU)' },
  'inferentia': { mult: 1.25, name: 'AWS Inferentia 2' }
};

function initSimulator() {
  const modelSelect = document.getElementById('simModelSelect');
  const hardwareSelect = document.getElementById('simHardwareSelect');
  const checkQuant = document.getElementById('chkQuant');
  const checkFusion = document.getElementById('chkFusion');
  const checkKVCache = document.getElementById('chkKVCache');
  const checkDecEngine = document.getElementById('chkDecEngine');

  if (!modelSelect || !hardwareSelect) return;

  function updateSimulation() {
    const model = MODEL_SPECS[modelSelect.value] || MODEL_SPECS['llama-70b'];
    const hw = HARDWARE_MODS[hardwareSelect.value] || HARDWARE_MODS['h100'];

    let latency = model.baseLatency * hw.mult;
    let vram = model.baseVram;
    let tokSec = model.baseTok / hw.mult;
    let cost = model.baseCost;

    // Feature impacts
    if (checkQuant && checkQuant.checked) {
      latency *= 0.45;
      vram *= 0.28; // -72% VRAM
      tokSec *= 2.4;
      cost *= 0.35;
    }

    if (checkFusion && checkFusion.checked) {
      latency *= 0.62;
      tokSec *= 1.6;
    }

    if (checkKVCache && checkKVCache.checked) {
      vram *= 0.65;
      latency *= 0.88;
      tokSec *= 1.3;
    }

    if (checkDecEngine && checkDecEngine.checked) {
      // Intelligent decision router cuts overall redundant token calls by 60%
      latency *= 0.75;
      tokSec *= 1.2;
      cost *= 0.45;
    }

    // Round values
    const finalLatency = Math.max(8.5, latency).toFixed(1);
    const finalVram = Math.max(12, vram).toFixed(0);
    const finalTok = Math.round(tokSec);
    const finalCost = Math.round(cost);

    // Update UI elements
    animateCounter('resLatency', finalLatency + ' ms');
    animateCounter('resVram', finalVram + ' GB');
    animateCounter('resTok', finalTok + ' tok/s');
    animateCounter('resCost', '$' + finalCost + '/mo');

    // Update Progress Bars
    const latencyPct = Math.min(100, Math.max(10, (1 - (finalLatency / (model.baseLatency * hw.mult))) * 100));
    const vramPct = Math.min(100, Math.max(10, (1 - (finalVram / model.baseVram)) * 100));

    const latencyBar = document.getElementById('latencyBarFill');
    const vramBar = document.getElementById('vramBarFill');
    const latencyText = document.getElementById('latencyReductionText');
    const vramText = document.getElementById('vramReductionText');

    if (latencyBar) latencyBar.style.width = latencyPct.toFixed(0) + '%';
    if (vramBar) vramBar.style.width = vramPct.toFixed(0) + '%';
    if (latencyText) latencyText.innerText = '-' + latencyPct.toFixed(0) + '% LATENCY CUT';
    if (vramText) vramText.innerText = '-' + vramPct.toFixed(0) + '% VRAM SAVED';

    if (soundEnabled) playArcadeSound('compute');
  }

  [modelSelect, hardwareSelect, checkQuant, checkFusion, checkKVCache, checkDecEngine].forEach(el => {
    if (el) el.addEventListener('change', updateSimulation);
  });

  // Run initial state calculation
  updateSimulation();
}

function animateCounter(elementId, targetValue) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerText = targetValue;
}

/* ==========================================================================
   4. Pricing Billing Period Toggle
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.getElementById('billingToggle');
  const starterPrice = document.getElementById('starterPrice');
  const turboPrice = document.getElementById('turboPrice');
  const enterprisePrice = document.getElementById('enterprisePrice');

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isYearly = toggle.checked;

    if (starterPrice) {
      starterPrice.innerText = isYearly ? '39' : '49';
    }
    if (turboPrice) {
      turboPrice.innerText = isYearly ? '199' : '249';
    }
    if (enterprisePrice) {
      enterprisePrice.innerText = isYearly ? '799' : '999';
    }

    if (soundEnabled) playArcadeSound('select');
  });
}

/* ==========================================================================
   5. Vintage Mainframe Comms Console / Form Dispatch
   ========================================================================== */
function initContactTerminal() {
  const form = document.getElementById('commsTerminalForm');
  const logBox = document.getElementById('terminalLogBox');

  if (!form || !logBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const callsign = document.getElementById('callsignInput')?.value || 'AGENT-01';
    const email = document.getElementById('frequencyInput')?.value || 'USER@QUANT.NET';
    const modelTarget = document.getElementById('targetArchInput')?.value || 'TRANSFORMER';
    const msg = document.getElementById('directiveInput')?.value || 'OPTIMIZATION REQUEST';

    // Terminal typing animation simulation
    logBox.innerHTML = `
      <div class="terminal-line">&gt; PACKET ENCRYPTION: SHA-256 [INITIALIZED]</div>
      <div class="terminal-line">&gt; CALLSIGN: ${callsign.toUpperCase()}</div>
      <div class="terminal-line">&gt; UPLINK: ${email.toUpperCase()}</div>
      <div class="terminal-line">&gt; TARGET ARCH: ${modelTarget.toUpperCase()}</div>
      <div class="terminal-line" style="color: var(--arcade-yellow);">&gt; TRANSMITTING PAYLOAD TO CLUSTER...</div>
    `;

    if (soundEnabled) playArcadeSound('powerup');

    setTimeout(() => {
      logBox.innerHTML += `
        <div class="terminal-line" style="color: var(--arcade-teal);">&gt; [STATUS: 200 OK] DISPATCH SUCCESSFUL.</div>
        <div class="terminal-line" style="color: #fff;">&gt; AN AGENT ENGINEER WILL RESPOND IN &lt; 4 HOURS.</div>
        <div class="terminal-line">&gt; AWAITING NEXT DIRECTIVE<span class="terminal-cursor"></span></div>
      `;
      form.reset();
    }, 1200);
  });
}

/* ==========================================================================
   6. Live System Ticker (Ping & Heartbeat)
   ========================================================================== */
function initSystemTicker() {
  const pingElem = document.getElementById('livePingTicker');
  const tokCountElem = document.getElementById('globalTokCounter');

  if (pingElem) {
    setInterval(() => {
      const ping = Math.floor(7 + Math.random() * 6);
      pingElem.innerText = ping + 'ms';
    }, 3500);
  }

  if (tokCountElem) {
    let baseTok = 18492040;
    setInterval(() => {
      baseTok += Math.floor(400 + Math.random() * 350);
      tokCountElem.innerText = baseTok.toLocaleString();
    }, 1200);
  }
}

/* ==========================================================================
   7. Mobile Navigation Toggle (Neat, Accessible & Responsive)
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!menuBtn || !navLinks) return;

  function toggleMenu(open) {
    const shouldOpen = open !== undefined ? open : !navLinks.classList.contains('mobile-open');
    navLinks.classList.toggle('mobile-open', shouldOpen);
    menuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    menuBtn.innerText = shouldOpen ? '✕' : '☰';
    if (soundEnabled) playArcadeSound('select');
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('mobile-open') && !navLinks.contains(e.target) && e.target !== menuBtn) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   8. FAQ Accordion Interaction
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const icon = item.querySelector('.faq-toggle-icon');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items for neat accordion behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherIcon = otherItem.querySelector('.faq-toggle-icon');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherIcon) otherIcon.innerText = '[+]';
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
      trigger.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      if (icon) icon.innerText = !isActive ? '[-]' : '[+]';

      if (soundEnabled) playArcadeSound('select');
    });
  });
}

/* ==========================================================================
   9. Developer SDK & Compiler Terminal Interaction
   ========================================================================== */
function initSdkTerminal() {
  const codeDisplay = document.getElementById('sdkCodeDisplay');
  const lineNumbers = document.getElementById('codeLineNumbers');
  const langName = document.getElementById('sdkLangName');
  const copyBtn = document.getElementById('copyCodeBtn');
  const copyText = document.getElementById('copyBtnText');
  const tabs = document.querySelectorAll('.editor-tab');
  const runBtn = document.getElementById('runCompilerTestBtn');
  const consoleLog = document.getElementById('compilerConsoleLog');
  const badgeStatus = document.getElementById('compilerBadgeStatus');
  const timeTicker = document.getElementById('compilerTimeTicker');

  if (!codeDisplay) return;

  const codeSnippets = {
    python: {
      lang: 'PYTHON 3.11+',
      code: `import marvean as mvn

# 1. Initialize autonomous decision router
engine = mvn.DecisionEngine(routing="speculative", budget_ms=10)

# 2. Compile model with FP8/INT4 AWQ + Kernel Fusion
model = engine.compile(
    checkpoint="meta-llama/Llama-3-70B-Instruct",
    precision="int4-awq",
    target_silicon="nvidia-h100"
)

# 3. Stream optimized inference with sub-10ms first-token latency
response = model.generate("Synthesize quantum routing protocol", max_tokens=512)
print(response.throughput) # >> 284 tok/s (VRAM: 18.2GB)`
    },
    cli: {
      lang: 'BASH / ZSH',
      code: `# 1. Install 16-bit kernel optimizer CLI
curl -sSL https://get.marvean.ai/install.sh | bash

# 2. Compile weights + fused CUDA kernels in one step
marvean optimize \\
  --model mistralai/Mistral-Large-Instruct-2407 \\
  --quant int4-awq \\
  --fuse-kernels flashattention-3 \\
  --target nvidia-h100 \\
  --output ./opt-kernels/

# 3. Launch high-throughput OpenAI-compatible server
marvean serve --port 8000 --workers 4`
    },
    rust: {
      lang: 'RUST 1.78+ / BARE-METAL',
      code: `use marvean_core::{DecisionRouter, QuantKernel, Precision};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Initialize zero-cost memory mapped tensor runtime
    let router = DecisionRouter::init_deterministic("cluster.conf")?;
    let kernel = QuantKernel::load("./weights/llama3_int4.so", Precision::INT4)?;

    // 2. Dispatch parallel multi-agent arbitration query
    let tokens = router.arbitrate_and_stream("query_vector_0x88")?;
    println!("Dispatched with 0.38ms arbitration latency");
    Ok(())
}`
    },
    docker: {
      lang: 'DOCKER COMPOSE',
      code: `version: '3.8'
services:
  marvean-engine:
    image: ghcr.io/marvean/engine:v4.2-cuda12.4
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    environment:
      - MODEL_ID=deepseek-ai/DeepSeek-V2.5
      - OPTIMIZATION_PASS=INT4_AWQ_FUSED
      - KV_CACHE_COMPACTION=4X
    ports:
      - "8842:8842"`
    }
  };

  let currentTab = 'python';

  function updateCodeView(tabKey) {
    const data = codeSnippets[tabKey];
    if (!data) return;

    currentTab = tabKey;
    codeDisplay.textContent = data.code;
    if (langName) langName.textContent = data.lang;

    // Render line numbers
    const lines = data.code.split('\n').length;
    let numHtml = '';
    for (let i = 1; i <= lines; i++) {
      numHtml += `<span>${i < 10 ? '0' + i : i}</span>`;
    }
    if (lineNumbers) lineNumbers.innerHTML = numHtml;
  }

  // Initialize with python snippet
  updateCodeView('python');

  // Tab click listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.getAttribute('data-tab');
      updateCodeView(tabKey);
      if (soundEnabled) playArcadeSound('select');
    });
  });

  // Copy code button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = codeSnippets[currentTab]?.code || '';
      navigator.clipboard.writeText(code).then(() => {
        if (copyText) copyText.textContent = '✔ COPIED!';
        copyBtn.style.background = 'var(--arcade-teal)';
        copyBtn.style.color = '#000';
        if (soundEnabled) playArcadeSound('powerup');

        setTimeout(() => {
          if (copyText) copyText.textContent = 'COPY CODE';
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      }).catch(() => {
        if (copyText) copyText.textContent = 'PRESS CTRL+C';
      });
    });
  }

  // Compiler simulation test
  if (runBtn && consoleLog) {
    let isCompiling = false;

    runBtn.addEventListener('click', () => {
      if (isCompiling) return;
      isCompiling = true;
      runBtn.disabled = true;
      runBtn.style.opacity = '0.6';

      if (soundEnabled) playArcadeSound('compute');
      if (badgeStatus) {
        badgeStatus.textContent = 'STATUS: COMPILING...';
        badgeStatus.style.color = 'var(--arcade-yellow)';
      }

      consoleLog.innerHTML = '<div class="compiler-line">&gt; MARVEAN STATIC COMPILER PASS INITIATED...</div>';

      const steps = [
        { time: '0.08s', text: '> [0.08s] Parsing tensor graph: Llama-3-70B-Instruct (140.2 GB checkpoint)...' },
        { time: '0.19s', text: '> [0.19s] Profiling activation variance: Salience metric score computed.' },
        { time: '0.31s', text: '> [0.31s] Quantizing 99% weights to INT4; 1% anchor channels pinned in FP16.' },
        { time: '0.42s', text: '> [0.42s] Compiling fused Triton kernels: LayerNorm + FlashAttention-3.' },
        { time: '0.50s', text: '> [0.50s] Pruning sparse attention heads: KV-cache compaction 4x active.' },
        { time: '0.55s', text: '> [0.55s] COMPILATION COMPLETE // Output binary: 38.6 GB (-72.4% VRAM)', highlight: true }
      ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = step.highlight ? 'compiler-line text-success' : 'compiler-line';
          div.textContent = step.text;
          consoleLog.appendChild(div);
          consoleLog.scrollTop = consoleLog.scrollHeight;
          if (timeTicker) timeTicker.textContent = `ELAPSED: ${step.time}`;
          if (soundEnabled) playArcadeSound('hover');

          if (idx === steps.length - 1) {
            const finalDiv = document.createElement('div');
            finalDiv.className = 'compiler-line text-highlight';
            finalDiv.textContent = '> [0.55s] STATUS: 200 OK // READY FOR DETERMINISTIC INFERENCE AT 284 TOK/S';
            consoleLog.appendChild(finalDiv);
            consoleLog.scrollTop = consoleLog.scrollHeight;

            if (badgeStatus) {
              badgeStatus.textContent = 'STATUS: READY (200 OK)';
              badgeStatus.style.color = 'var(--arcade-teal)';
            }
            if (soundEnabled) playArcadeSound('powerup');

            isCompiling = false;
            runBtn.disabled = false;
            runBtn.style.opacity = '1';
          }
        }, (idx + 1) * 220);
      });
    });
  }
}

