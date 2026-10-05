import React from "react";

/* ---------- Design tokens ---------- */
const C = {
  bg: "#070b16", // --space-dark
  panel: "#0c152a",
  line: "#16233f",
  text: "#ffffff",
  muted: "#8ea3c7",
  accent: "#00e5a3",
  red: "#ff4d6d",
  amber: "#ffc23d",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
:root{--space-dark:${C.bg};--panel:${C.panel};--line:${C.line};--text:${C.text};--muted:${C.muted};--accent:${C.accent};}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--space-dark)}
.mv{background:var(--space-dark);color:var(--text);font-family:Inter,system-ui,sans-serif;line-height:1.6;min-height:100vh}
.mv a{color:inherit;text-decoration:none}
.mv :focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.wrap{max-width:1240px;margin:0 auto;padding:0 28px}
.px{font-family:Silkscreen,'Courier New',monospace;text-transform:uppercase;letter-spacing:.02em}
.mono{font-family:'JetBrains Mono',ui-monospace,monospace}
.nav{position:sticky;top:0;z-index:20;background:rgba(7,11,22,.94);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:78px;gap:20px}
.logo{font-size:30px;font-weight:700;color:var(--accent)}
.pill{display:flex;gap:6px;padding:8px 14px;border:1px solid var(--line);border-radius:999px;background:var(--panel)}
.pill a{padding:6px 16px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);border-radius:999px}
.pill a:hover{color:var(--accent)}
.badge{border:1px solid var(--accent);color:var(--accent);padding:10px 20px;border-radius:999px;font-weight:600;font-size:14px;background:rgba(0,229,163,.08)}
.tag{display:inline-block;border:1px solid var(--accent);color:var(--accent);padding:8px 16px;font-size:12px;background:rgba(0,229,163,.06)}
h1{font-size:clamp(40px,6vw,76px);line-height:1.02;margin:22px 0 24px;font-weight:700}
h1 .a{color:var(--accent)}
h2{font-size:clamp(26px,3.4vw,40px);line-height:1.15;margin:0 0 14px}
.lead{color:var(--muted);font-size:18px;max-width:640px}
.hero{display:grid;grid-template-columns:1.05fr 1fr;gap:48px;padding:64px 0 56px;align-items:start}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:36px 0}
.stat{border:1px solid var(--line);background:var(--panel);padding:16px}
.stat b{display:block;font-size:26px;color:var(--accent)}
.stat span{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.btn{display:inline-block;padding:16px 26px;font-weight:700;letter-spacing:.06em;font-size:14px;text-transform:uppercase}
.btn.p{background:var(--accent);color:#04120d!important}
.btn.s{border:2px solid #fff;margin-left:14px}
.code{border:1px solid var(--line);background:var(--panel);padding:16px 18px;font-size:13px;color:var(--muted)}
.code b{color:var(--accent);font-weight:600}
.cc{border:1px solid var(--line);background:var(--panel)}
.cc .bar{display:flex;gap:7px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line);font-size:11px;color:var(--muted)}
.dot{width:11px;height:11px;border-radius:2px;display:inline-block}
.kpis{display:flex;gap:12px;padding:14px 16px;flex-wrap:wrap}
.kpi{border:1px solid var(--accent);padding:8px 12px;font-size:12px}
.kpi b{color:var(--accent)}
.gpus{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:0 16px 16px}
.gpu{border:1px solid var(--line);background:var(--bg);padding:10px}
.gpu small{display:block;color:var(--muted);font-size:11px;margin-bottom:6px}
.meter{height:7px;background:var(--line);margin-top:6px}
.meter i{display:block;height:100%;background:var(--accent)}
.alert{border-top:1px solid var(--line);padding:16px}
.sec{padding:84px 0;border-top:1px solid var(--line)}
.sec.alt{background:var(--panel)}
.grid{display:grid;gap:18px;margin-top:34px}
.g2{grid-template-columns:repeat(2,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.card{border:1px solid var(--line);background:var(--panel);padding:24px}
.sec.alt .card{background:var(--bg)}
.card h3{margin:0 0 8px;font-size:18px}
.card p{margin:0;color:var(--muted);font-size:15px}
.card .k{color:var(--accent);font-size:12px;margin-bottom:10px;display:block}
table{width:100%;border-collapse:collapse;margin-top:30px;font-size:15px}
th,td{text-align:left;padding:14px 16px;border:1px solid var(--line);vertical-align:top}
th{background:var(--bg);color:var(--accent);font-size:12px}
td:first-child{font-weight:600;white-space:nowrap}
td:nth-child(2){color:var(--muted)}
.flow{display:grid;grid-template-columns:1fr;gap:0;justify-items:center;margin-top:34px}
.node{border:1px solid var(--line);background:var(--bg);padding:14px 22px;text-align:center;min-width:280px;font-size:14px}
.node.h{border-color:var(--accent);color:var(--accent)}
.arrow{color:var(--accent);padding:6px 0}
.split{display:grid;grid-template-columns:1fr 1fr;gap:18px;width:100%;max-width:760px}
.road{display:grid;gap:0;margin-top:30px;border-left:2px solid var(--accent);margin-left:6px}
.rm{padding:0 0 28px 28px;position:relative}
.rm:before{content:"";position:absolute;left:-7px;top:6px;width:12px;height:12px;background:var(--accent)}
.rm .q{color:var(--accent);font-size:13px}
.rm h3{margin:4px 0;font-size:18px}
.rm p{margin:0;color:var(--muted)}
.sdk{display:grid;grid-template-columns:1fr 1.2fr;gap:40px;align-items:start}
pre{margin:0;padding:22px;background:var(--bg);border:1px solid var(--accent);color:#cfe1ff;font-size:13px;overflow-x:auto;line-height:1.7}
pre .c{color:var(--muted)} pre .k{color:var(--accent)}
.price{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:34px}
.price .card.f{border-color:var(--accent)}
.price ul{padding-left:18px;margin:14px 0 0;color:var(--muted);font-size:15px}
.faq details{border:1px solid var(--line);background:var(--panel);padding:18px 22px;margin-bottom:12px}
.faq summary{font-weight:600;cursor:pointer}
.faq p{color:var(--muted);margin:10px 0 0}
.cta{text-align:center;padding:90px 0}
.foot{border-top:1px solid var(--line);padding:30px 0;color:var(--muted);font-size:14px}
.foot .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:980px){
 .hero,.sdk{grid-template-columns:1fr}
 .stats{grid-template-columns:repeat(2,1fr)}
 .g2,.g3,.price{grid-template-columns:1fr}
 .pill{display:none}
 .btn.s{margin:12px 0 0}
 .split{grid-template-columns:1fr}
 .gpus{grid-template-columns:repeat(2,1fr)}
}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

/* ---------- Content (from the NVIDIA Inception technical profile) ---------- */
const stats = [
  ["6", "NVIDIA integrations"],
  ["1M+", "Telemetry points / sec"],
  ["3", "Deploy modes"],
  ["SDK", "Python + REST"],
];

const challenges = [
  ["GPU underutilization & memory bottlenecks", "Poor batching, inefficient data pipelines and VRAM fragmentation leave high-end GPUs idle while costs keep running."],
  ["Black-box model execution", "CPU and RAM dashboards miss Time-To-First-Token, inter-agent handoff delays, model drift and embedding search latency."],
  ["Unpredictable compute costs", "Bursting inference and distributed training across clouds hides which models and workloads consume the most compute."],
  ["Security & operational risk", "Prompt injection, data leaks in context buffers and failures at peak inference load need AI-specific detection."],
];

const layers = [
  ["Hardware & telemetry ingestion", "Real-time, high-frequency metrics from GPU clusters, NVLink and InfiniBand interconnects, thermal monitors and memory controllers.", "NVML + RAPIDS (cuDF)"],
  ["AI application & LLM observability", "Tracks inference pipelines, prompt handling, token throughput and multi-agent topologies. Finds queue time and batching gaps.", "Triton Inference Server"],
  ["Autonomous compute optimization", "Balances workloads, tunes batch sizes, adjusts quantization and reroutes requests across GPU nodes.", "TensorRT-LLM (FP8 / INT8 / FP16)"],
  ["Security, guardrails & anomaly detection", "Scans payloads, model traffic and system events for threats, prompt injection and data leakage.", "Morpheus + NeMo"],
];

const matrix = [
  ["NVIDIA NVML", "GPU management & telemetry", "Captures real-time GPU utilization, VRAM usage, temperature and power metrics."],
  ["NVIDIA Triton", "Model serving & performance metrics", "Tracks concurrent model execution, request latency and dynamic batching efficiency."],
  ["NVIDIA TensorRT-LLM", "Inference optimization", "Analyzes runtime profiles to tune LLM serving configurations and token efficiency."],
  ["NVIDIA RAPIDS", "GPU data analytics", "Speeds up log analytics, time-series telemetry processing and cluster health scoring."],
  ["NVIDIA Morpheus", "Operational cybersecurity", "Inspects AI workload data streams for security anomalies, prompt injections and data leaks."],
  ["NVIDIA NeMo", "LLM guardrails & governance", "Tracks LLM safety compliance and response quality through framework integrations."],
];

const roadmap = [
  ["Q4 2026", "NVML & RAPIDS engine launch", "GPU-accelerated telemetry ingestion and real-time cluster health scoring."],
  ["Q4 2026", "Triton performance profiler", "Real-time inference latency and queue monitoring across multi-tenant deployments."],
  ["Q4 2026 – Q1 2027", "TensorRT-LLM auto-tuner", "Automated runtime recommendations for LLM quantization and batch sizing."],
  ["Q1 2027", "Morpheus security integration", "GPU-driven anomaly detection for prompt injection and data leak prevention."],
  ["Q1 – Q2 2027", "Multi-cloud fleet governance", "Unified cross-cloud GPU scheduling and automated cost optimization."],
];

const faq = [
  ["What does Marvean monitor?", "Hardware metrics (GPU use, VRAM, interconnect bandwidth) and application metrics (TTFT, token throughput, model drift, prompt latency, agent execution graphs) in one view."],
  ["How do I connect my workloads?", "Install the Marvean SDK, point it at your Triton instances and GPU nodes, and telemetry starts streaming. A REST API is also available."],
  ["Where can Marvean run?", "Multi-cloud, hybrid and on-premises HPC fleets, with H100 / A100 for global analytics and L4 / L40S for edge observability."],
  ["How do we get access to a demo?", "Development dashboards, API endpoints and demo environments are provided securely through enterprise single sign-on on request."],
];

const gpus = [
  ["GPU-0 · H100", 92, "61°C"],
  ["GPU-1 · H100", 78, "58°C"],
  ["GPU-2 · A100", 41, "49°C"],
  ["GPU-3 · L40S", 66, "54°C"],
];

/* ---------- Sections ---------- */
function Nav() {
  return (
    <header className="nav">
      <div className="wrap">
        <a href="#hero" className="logo" aria-label="Marvean home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "rgba(0, 229, 163, 0.12)", border: "1px solid rgba(0, 229, 163, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(0, 229, 163, 0.2)", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00e5a3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#00e5a3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#00e5a3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "0.08em", color: "#ffffff", textTransform: "uppercase" }}>MARVEAN</span>
        </a>
        <nav className="pill" aria-label="Primary">
          <a href="#challenge">Challenge</a>
          <a href="#platform">Platform</a>
          <a href="#sdk">SDK</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact us</a>
        </nav>
        <a href="#sdk" className="badge">⚡ Get the SDK</a>
      </div>
    </header>
  );
}

function CommandCenter() {
  return (
    <div className="cc" role="img" aria-label="Marvean command center showing live GPU telemetry">
      <div className="bar mono">
        <span className="dot" style={{ background: C.red }} />
        <span className="dot" style={{ background: C.amber }} />
        <span className="dot" style={{ background: C.accent }} />
        <span style={{ marginLeft: "auto" }} className="px">Command center // Marvean intelligence</span>
      </div>
      <div className="kpis mono">
        <div className="kpi">TTFT: <b>182 ms</b></div>
        <div className="kpi">TOKENS/SEC: <b>14,860</b></div>
        <div className="kpi">FLEET HEALTH: <b>98.1</b></div>
      </div>
      <div className="gpus mono">
        {gpus.map(([n, u, t]) => (
          <div className="gpu" key={n}>
            <small>{n}</small>
            <b style={{ color: C.accent }}>{u}%</b> <small style={{ display: "inline" }}>{t}</small>
            <div className="meter"><i style={{ width: u + "%" }} /></div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <svg viewBox="0 0 520 150" width="100%" aria-hidden="true">
          <rect width="520" height="150" fill={C.bg} stroke={C.line} />
          {[30, 60, 90, 120].map((y) => <line key={y} x1="0" x2="520" y1={y} y2={y} stroke={C.line} />)}
          <polyline fill="none" stroke={C.accent} strokeWidth="2.5" points="0,110 40,96 80,102 120,70 160,78 200,52 240,60 280,40 320,48 360,30 400,44 440,26 480,34 520,18" />
          <polyline fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="5 4" points="0,126 60,120 120,124 180,110 240,114 300,100 360,106 420,92 480,98 520,88" />
          <text x="10" y="18" fill={C.muted} fontSize="11" fontFamily="monospace">tokens/sec vs. GPU memory pressure</text>
        </svg>
      </div>
      <div className="alert">
        <div className="px" style={{ color: C.red, fontSize: 12 }}>● Anomaly detected</div>
        <div style={{ margin: "6px 0 2px", fontWeight: 600 }}>GPU-2 memory fragmentation raised queue time by 23%</div>
        <div className="mono" style={{ color: C.muted, fontSize: 12 }}>Auto-tuner proposed batch size 32 → 48 · via Triton metrics</div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" className="wrap hero">
      <div>
        <span className="tag px">AI infrastructure & application intelligence // marvean.net</span>
        <h1 className="px">
          See every GPU.<br />
          <span className="a">Tune every token.</span><br />
          Govern every model.
        </h1>
        <p className="lead">
          Marvean joins low-level hardware telemetry with LLM-level observability, so teams running large language models,
          vision pipelines and multi-agent systems can cut GPU waste, control costs and secure their AI workloads. Connect with
          the Marvean SDK in minutes.
        </p>
        <div className="stats">
          {stats.map(([v, l]) => (
            <div className="stat" key={l}><b className="px">{v}</b><span>{l}</span></div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
          <a className="btn p" href="#sdk">Explore the SDK</a>
          <a className="btn s" href="dashboard.html" target="_blank" style={{ marginLeft: 0 }}>Live Dashboard ↗</a>
        </div>
        <div className="code mono" style={{ marginTop: 34 }}>
          <div><span>// </span>BUILT ON: <b>NVML · Triton · TensorRT-LLM · RAPIDS · Morpheus · NeMo</b></div>
          <div><span>// </span>DEPLOY: <b>Multi-cloud · Hybrid · On-prem HPC</b></div>
        </div>
      </div>
      <CommandCenter />
    </section>
  );
}

function Challenge() {
  return (
    <section id="challenge" className="sec">
      <div className="wrap">
        <h2 className="px">Enterprise AI is hard to see inside</h2>
        <p className="lead">Dense GPU clusters and layered software stacks create waste and risk that standard IT monitoring cannot see.</p>
        <div className="grid g2">
          {challenges.map(([t, d]) => (
            <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section id="platform" className="sec alt">
      <div className="wrap">
        <h2 className="px">One intelligence layer, four jobs</h2>
        <p className="lead">Each layer of the Marvean platform is paired with the NVIDIA technology that powers it.</p>
        <div className="grid g2">
          {layers.map(([t, d, n]) => (
            <div className="card" key={t}>
              <span className="k mono">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <h2 className="px" style={{ marginTop: 70, fontSize: 28 }}>NVIDIA technology integration</h2>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th className="px">Technology</th><th className="px">Function</th><th className="px">In Marvean</th></tr></thead>
            <tbody>
              {matrix.map(([a, b, c]) => (
                <tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Deployment() {
  return (
    <section className="sec">
      <div className="wrap">
        <h2 className="px">Deployment architecture</h2>
        <p className="lead">H100 / A100 GPUs power fleet analytics and benchmarking. L4 / L40S GPUs run local telemetry and dashboards.</p>
        <div className="flow mono">
          <div className="node">Enterprise AI workloads · LLMs, vision, multi-agent</div>
          <div className="arrow">▼</div>
          <div className="node h">Marvean intelligence core</div>
          <div className="arrow">▼</div>
          <div className="node" style={{ minWidth: 0, width: "100%", maxWidth: 760 }}>
            NVML telemetry engine · Triton metric collector · Morpheus security pipeline
          </div>
          <div className="arrow">▼</div>
          <div className="split">
            <div className="node h" style={{ minWidth: 0 }}>
              NVIDIA H100 / A100 cloud engine
              <div style={{ color: C.muted, marginTop: 6 }}>Global analytics & auto-scaling</div>
            </div>
            <div className="node h" style={{ minWidth: 0 }}>
              NVIDIA L4 / L40S enterprise nodes
              <div style={{ color: C.muted, marginTop: 6 }}>Real-time telemetry & local dashboards</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sdk() {
  return (
    <section id="sdk" className="sec alt">
      <div className="wrap sdk">
        <div>
          <h2 className="px">Marvean SDK</h2>
          <p className="lead">
            Add the Marvean SDK to your serving code and start streaming GPU and LLM metrics. Use the REST API when you
            prefer to send data from your own agents.
          </p>
          <ul style={{ color: C.muted, paddingLeft: 18, marginTop: 20 }}>
            <li>Python SDK for training jobs and inference services</li>
            <li>Triton collector that reads model instance metrics</li>
            <li>Token, TTFT and queue-time tracing for every request</li>
            <li>Enterprise single sign-on for dashboards and API keys</li>
          </ul>
        </div>
        <pre className="mono"><code>{`# pip install marvean-sdk
`}<span className="c">{`# connect the SDK to your fleet
`}</span>{`from marvean import Client, Triton

mv = Client(api_key="MV_API_KEY")

mv.attach(`}<span className="k">Triton</span>{`(url="http://triton:8000"))
mv.gpu.watch(nodes="all", interval="1s")

`}<span className="c">{`# trace one LLM request
`}</span>{`with mv.trace("support-agent") as t:
    answer = llm.generate(prompt)
    t.record(ttft=True, tokens=True)`}</code></pre>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section id="roadmap" className="sec">
      <div className="wrap">
        <h2 className="px">Technical roadmap</h2>
        <div className="road">
          {roadmap.map(([q, t, d]) => (
            <div className="rm" key={t}>
              <span className="q mono">{q}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    ["Starter", "For one GPU cluster", ["GPU & VRAM telemetry", "Python SDK", "Community support"]],
    ["Enterprise", "For production AI fleets", ["Triton & LLM observability", "Cost & TCO analytics", "Single sign-on and SDK keys", "Guardrails & anomaly alerts"], true],
    ["Hybrid & HPC", "For multi-cloud and on-prem", ["Fleet governance", "Edge L4 / L40S nodes", "Dedicated onboarding"]],
  ];
  return (
    <section id="pricing" className="sec alt">
      <div className="wrap">
        <h2 className="px">Pricing</h2>
        <p className="lead">Pricing is quoted per fleet. Tell us about your clusters and we will send a plan.</p>
        <div className="price">
          {plans.map(([n, d, items, f]) => (
            <div className={"card" + (f ? " f" : "")} key={n}>
              <h3 className="px">{n}</h3>
              <p>{d}</p>
              <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="sec">
      <div className="wrap faq">
        <h2 className="px" style={{ marginBottom: 28 }}>FAQ</h2>
        {faq.map(([q, a]) => (
          <details open key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="sec alt">
      <div className="wrap cta">
        <h2 className="px">Run your AI fleet with full visibility</h2>
        <p className="lead" style={{ margin: "0 auto 30px" }}>
          Request access to the dashboards, API endpoints and SDK demo environment. Access is provided through enterprise single sign-on.
        </p>
        <a className="btn p" href="https://marvean.net">Request access</a>
        <a className="btn s" href="https://marvean.net">Visit marvean.net</a>
      </div>
    </section>
  );
}

export default function MarveanPage() {
  return (
    <div className="mv">
      <style>{css}</style>
      <Nav />
      <Hero />
      <Challenge />
      <Platform />
      <Deployment />
      <Sdk />
      <Roadmap />
      <Pricing />
      <Faq />
      <Contact />
      <footer className="foot">
        <div className="wrap">
          <span>© 2026 Marvean · AI Infrastructure & Application Intelligence</span>
          <span>Document v1.0 · October 5, 2026 · NVIDIA Inception technical profile</span>
        </div>
      </footer>
    </div>
  );
}
