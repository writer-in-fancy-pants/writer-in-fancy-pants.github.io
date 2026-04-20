---
id: 09-futures-with-ai
title: "Futures with AI."
date: "2026-04-20"
topic: "Vibe Research"
excerpt: "What I think can happen -> Fact-checked, augmented by Claude -> You."
---


<script>
// ─── STICKY NAV ───
const stickyNav = document.getElementById('sticky-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    stickyNav.classList.add('visible');
  } else {
    stickyNav.classList.remove('visible');
  }
});

// ─── SCENARIO TABS ───
document.getElementById('scenario-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  const tab = btn.dataset.tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.scenario-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tab).classList.add('active');
});

// ─── OPPORTUNITY TABS ───
document.getElementById('opp-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.opp-tab');
  if (!btn) return;
  const tab = btn.dataset.tab;
  document.querySelectorAll('.opp-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.opp-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('opp-' + tab).classList.add('active');
});

// ─── TIMELINE FORKS ───
function toggleBranch(id) {
  const el = document.getElementById(id);
  const btn = el.previousElementSibling;
  el.classList.toggle('open');
  btn.classList.toggle('open');
}

function selectBranch(el) {
  const siblings = el.parentElement.querySelectorAll('.tl-branch');
  siblings.forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

// ─── PROBABILITY BARS ───
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.prob-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const probSection = document.getElementById('prob-bars');
if (probSection) barObserver.observe(probSection);
</script>


<style>
  :root {
    --amber: #c8922a;
    --amber-light: #e8b84b;
    --rust: #b5451b;
    --slate: #3d4f5c;
    --fog: #8a8f99;
    --green: #2d6e4e;
    --red: #9c2020;
    --blue: #1a4a7a;
    --line: rgba(14,14,14,0.12);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  /* ─── HEADER ─── */
  #hero {
    /* min-height: 100vh; */
    /* display: grid; */
    place-items: center;
    position: relative;
    overflow: hidden;
  }
  #hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(200,146,42,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,146,42,0.08) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  #hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
    max-width: 900px;
  }
  .hero-eyebrow {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    /* opacity: 0; */
    /* animation: fadeUp 0.8s ease 0.2s forwards; */
  }
  h1 {
    font-family: serif;
    font-size: clamp(3.5rem, 9vw, 8rem);
    font-weight: 900;
    color: var(--ink);
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
    /* opacity: 0; */
    /* animation: fadeUp 0.8s ease 0.4s forwards; */
  }
  h1 em {
    color: var(--amber);
    font-style: italic;
  }
  .hero-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    color: rgba(245,240,232,0.5);
    max-width: 500px;
    margin: 0 auto 3rem;
    /* opacity: 0; */
    /* animation: fadeUp 0.8s ease 0.6s forwards; */
  }
  .hero-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    /* opacity: 0; */
    /* animation: fadeUp 0.8s ease 0.8s forwards; */
  }
  .hero-nav a {
    pointer-events: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink);
    text-decoration: none;
    border: 1px solid rgba(245,240,232,0.2);
    padding: 0.5rem 1rem;
    transition: all 0.2s;
  }
  .hero-nav a:hover {
    background: var(--amber);
    border-color: var(--amber);
    color: var(--ink);
  }
  /* ─── SECTIONS ─── */
  section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 6rem 2rem;
  }

  section.full-bleed {
    max-width: 100%;
    padding: 0;
  }
  .section-label {
    font-family: monospace;
    font-size: 0.65rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--line);
  }
  h2 {
    font-family: serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 1.5rem;
  }
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  p { margin-bottom: 1rem; color: #2a2a2a; }

  /* ─── CURRENT STATE ─── */
  #current {
    /* background: var(--paper); */
    max-width: 1100px;
    margin: 0 auto;
    padding: 6rem 2rem;
  }
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5px;
    margin: 3rem 0;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .stat-card {
    background: var(--paper);
    padding: 1.75rem;
    position: relative;
  }
  .stat-num {
    font-family: serif;
    font-size: 2.8rem;
    font-weight: 900;
    line-height: 1;
    color: var(--amber);
    /* display: block; */
    margin-bottom: 0.4rem;
  }
  .stat-label {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--fog);
    text-transform: uppercase;
  }
  .stat-note {
    font-size: 0.8rem;
    color: var(--fog);
    margin-top: 0.4rem;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }
  @media (max-width: 700px) {
    .two-col { grid-template-columns: 1fr; gap: 1.5rem; }
  }
  .callout {
    border-left: 3px solid var(--amber);
    padding: 1rem 1.25rem;
    /* background: rgba(200,146,42,0.06); */
    margin: 1.5rem 0;
    font-size: 0.95rem;
  }
  .callout.red { border-color: var(--rust); background: rgba(181,69,27,0.06); }
  .callout.blue { border-color: var(--blue); background: rgba(26,74,122,0.06); }
  .callout.green { border-color: var(--green); background: rgba(45,110,78,0.06); }

  /* ─── SCENARIO CARDS ─── */
  #scenarios { 
   }
  #scenarios > div {
    max-width: 1100px;
    margin: 0 auto;
    padding: 6rem 2rem;
  }
  #scenarios h2 { color: var(--ink); }
  #scenarios .section-label { color: var(--amber); }
  /* #scenarios .section-label::after { background: rgba(245,240,232,0.1); } */
  .scenario-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 2.5rem 0 0;
  }
  .tab-btn {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid rgba(245,240,232,0.2);
    color: rgba(245,240,232,0.5);
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-btn.active, .tab-btn:hover {
    background: var(--amber);
    border-color: var(--amber);
    color: var(--ink);
  }
  .scenario-panels { margin-top: 0; }
  .scenario-panel {
    /* display: none;
    animation: fadeIn 0.4s ease; */
  }
  .scenario-panel.active { display: block; }
  /* @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } */

  .scenario-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: start;
    gap: 1.5rem;
    border-top: 1px solid rgba(245,240,232,0.1);
    padding-top: 2rem;
    margin-top: 2rem;
  }

  .scenario-num {
    font-family: serif;
    font-size: 4rem;
    font-weight: 900;
    color: var(--amber);
    /* opacity: 0.4; */
    line-height: 1;
  }

  .scenario-meta h3 {
    font-size: 1.8rem;
    color: var(--ink);
    margin-bottom: 0.4rem;
  }

  .scenario-tagline {
    font-family: monospace;
    font-size: 0.75rem;
    color: rgba(245,240,232,0.4);
    letter-spacing: 0.1em;
  }

  .prob-badge {
    font-family: monospace;
    font-size: 0.75rem;
    padding: 0.4rem 0.75rem;
    border: 1px solid;
    text-align: center;
    min-width: 80px;
  }

  .prob-badge.low { border-color: var(--rust); color: var(--rust); }
  .prob-badge.mid { border-color: var(--amber); color: var(--amber); }
  .prob-badge.high { border-color: var(--green); color: #5ab88a; }

  .scenario-body {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 800px) {
    .scenario-body { grid-template-columns: 1fr; }
    .scenario-header { grid-template-columns: auto 1fr; }
    /* .prob-badge { display: none; } */
  }

  .scenario-col {
    padding: 1.25rem;
    border: 1px solid rgba(245,240,232,0.08);
  }

  .scenario-col-label {
    font-family: monospace;
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .scenario-col-label.for { color: #5ab88a; }
  .scenario-col-label.against { color: #e07070; }
  .scenario-col-label.blind { color: var(--amber-light); }

  .scenario-col p { color: rgba(245,240,232,0.7); font-size: 0.9rem; }

  .scenario-col ul {
    list-style: none;
    padding: 0;
  }

  .scenario-col ul li {
    color: rgba(245,240,232,0.7);
    font-size: 0.88rem;
    padding: 0.35rem 0;
    border-bottom: 1px solid rgba(245,240,232,0.05);
    padding-left: 1rem;
    position: relative;
  }

  .scenario-col ul li::before {
    content: '→';
    position: absolute;
    left: 0;
    /* opacity: 0.4; */
  }

  /* ─── TIMELINE ─── */
  /* #timeline { background: var(--paper); } */

  .timeline-wrapper {
    overflow-x: auto;
    padding-bottom: 2rem;
    margin: 3rem 0;
  }

  .timeline-svg-container {
    min-width: 900px;
    position: relative;
  }

  /* Interactive timeline using pure HTML/CSS/JS */
  .tl-year {
    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--fog);
    letter-spacing: 0.1em;
  }

  .timeline-track {
    position: relative;
    padding-left: 3rem;
  }

  .tl-node {
    position: relative;
    margin-bottom: 0;
    padding: 2rem 0 2rem 2.5rem;
    border-left: 2px solid var(--line);
    cursor: default;
  }

  .tl-dot {
    position: absolute;
    left: -0.5rem;
    top: 2.15rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--paper);
    border: 2px solid var(--fog);
    transition: all 0.2s;
  }

  .tl-node.fork > .tl-dot { background: var(--amber); border-color: var(--amber); width: 1.2rem; height: 1.2rem; left: -0.6rem; }

  .tl-year-label {
    font-family: monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 0.4rem;
  }

  .tl-title {
    font-family: serif;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .tl-body { font-size: 0.88rem; color: #444; max-width: 700px; }

  .tl-branches {
    margin-top: 1rem;
    /* display: none; */
    gap: 1rem;
  }

  .tl-branches.open { display: flex; flex-wrap: wrap; }

  .tl-branch {
    flex: 1;
    min-width: 220px;
    padding: 1rem;
    border: 1px solid var(--line);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .tl-branch:hover {
    border-color: var(--amber);
    background: rgba(200,146,42,0.04);
  }

  .tl-branch.selected {
    border-color: var(--amber);
    background: rgba(200,146,42,0.08);
  }

  .tl-branch-label {
    font-family: monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--fog);
    margin-bottom: 0.3rem;
  }

  .tl-branch-title {
    font-family: serif;
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .tl-branch p { font-size: 0.8rem; color: #555; margin: 0; }

  .fork-toggle {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid var(--line);
    padding: 0.4rem 0.75rem;
    cursor: pointer;
    margin-top: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.2s;
    color: var(--fog);
  }

  .fork-toggle:hover { border-color: var(--amber); color: var(--amber); }
  .fork-toggle .arrow { transition: transform 0.2s; }
  .fork-toggle.open .arrow { transform: rotate(90deg); }

  /* ─── CYBERSECURITY ─── */
  /* #cyber { background: #0a0f14; } */
  #cyber > div {
    max-width: 1100px;
    margin: 0 auto;
    padding: 6rem 2rem;
  }
  #cyber h2 { color: var(--ink); }
  #cyber .section-label { color: #4a9eff; }
  #cyber .section-label::after { background: rgba(74,158,255,0.2); }
  #cyber h3 { color: var(--ink); }
  #cyber p { color: rgba(245,240,232,0.65); }

  .threat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5px;
    margin: 2rem 0;
    background: rgba(74,158,255,0.1);
    border: 1px solid rgba(74,158,255,0.1);
  }

  .threat-card {
    background: #0a0f14;
    padding: 1.5rem;
    transition: background 0.2s;
  }

  .threat-card:hover { background: rgba(74,158,255,0.05); }

  .threat-icon {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    display: block;
  }

  .threat-card h4 {
    font-family: monospace;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4a9eff;
    margin-bottom: 0.5rem;
  }

  .threat-card p { font-size: 0.85rem; color: rgba(245,240,232,0.5); margin: 0; }

  .dark-forest-box {
    border: 1px solid rgba(74,158,255,0.3);
    padding: 2rem;
    margin: 2.5rem 0;
    position: relative;
  }

  .dark-forest-box::before {
    content: 'DARK FOREST SCENARIO';
    font-family: monospace;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: #4a9eff;
    position: absolute;
    top: -0.6rem;
    left: 1rem;
    background: #0a0f14;
    padding: 0 0.5rem;
  }

  .dark-forest-box h3 { color: #4a9eff; font-size: 1.5rem; }
  .dark-forest-box p { color: rgba(245,240,232,0.65); }

  /* ─── 2028 SCENARIO ─── */
  /* #reliable {
  } */

  .reliable-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 2.5rem 0;
  }

  .reliable-card {
    /* background: white; */
    border: 1px solid rgba(14,14,14,0.08);
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .reliable-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }

  .reliable-card .card-icon {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }

  .reliable-card h4 {
    font-family: serif;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .reliable-card p { font-size: 0.88rem; color: #555; margin: 0; }

  .implications-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;
    padding: 2rem;
    border: 1px solid rgba(14,14,14,0.08);
  }

  @media (max-width: 600px) {
    .implications-split { grid-template-columns: 1fr; }
  }

  .implications-split h4 {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .implications-split h4.pos { color: var(--green); }
  .implications-split h4.neg { color: var(--rust); }

  .implications-split ul { list-style: none; padding: 0; }
  .implications-split ul li {
    font-size: 0.88rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(14,14,14,0.06);
    color: var(--fog);
  }

  /* ─── OPPORTUNITIES ─── */
  /* #opportunities { background: var(--paper); } */

  .opp-tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid var(--line);
    margin: 2rem 0 0;
    overflow-x: auto;
  }

  .opp-tab {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    color: var(--fog);
    transition: all 0.2s;
    white-space: nowrap;
    margin-bottom: -2px;
  }

  .opp-tab.active, .opp-tab:hover {
    color: var(--ink);
    border-bottom-color: var(--amber);
  }

  .opp-panel { padding: 2rem 0; }
  .opp-panel.active { display: block; }

  .action-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
    margin-top: 1.5rem;
  }

  .action-card {
    border: 1px solid var(--line);
    padding: 1.25rem;
    position: relative;
    overflow: hidden;
  }

  .action-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 100%;
  }

  .action-card.now::before { background: var(--amber); }
  .action-card.year1::before { background: var(--slate); }
  .action-card.year3::before { background: var(--green); }

  .action-card h4 {
    font-family: serif;
    font-size: 1.05rem;
    margin-bottom: 0.4rem;
  }

  .action-card p { font-size: 0.85rem; color: #555; margin: 0; }

  .action-tag {
    font-family: monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--fog);
    margin-bottom: 0.5rem;
    display: block;
  }

  /* ─── PROBABILITY SUMMARY ─── */
  #probabilities {}
  .prob-bars {
    margin: 2rem 0;
  }
  .prob-row {
    display: grid;
    grid-template-columns: 200px 1fr 60px;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--line);
  }
  @media (max-width: 600px) {
    .prob-row { grid-template-columns: 1fr; gap: 0.25rem; }
  }
  .prob-name {
    font-family: monospace;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
  .prob-bar-track {
    height: 8px;
    /* background: rgba(14,14,14,0.08); */
    border-radius: 0;
    /* overflow: hidden; */
  }
  .prob-bar-fill {
    height: 100%;
    border-radius: 0;
    transition: width 1s ease;
    width: 0;
  }
  .prob-pct {
    font-family: serif;
    font-size: 1.1rem;
    font-weight: 700;
    text-align: right;
  }

  /* ─── FOOTER ─── */
  footer {
    /* background: var(--ink); */
    color: rgba(245,240,232,0.4);
    padding: 3rem 2rem;
    text-align: center;
  }

  footer p {
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: rgba(245,240,232,0.3);
    margin-bottom: 0.4rem;
  }

  footer a { color: var(--amber); text-decoration: none; pointer-events: none; }

  /* ─── CITATIONS ─── */
  .cite {
    font-family: monospace;
    font-size: 0.65rem;
    color: var(--amber);
    vertical-align: super;
    cursor: help;
    margin-left: 0.1em;
  }

  /* ─── SCROLL REVEAL ─── */
  .reveal {
  }

  /* ─── MISC ─── */
  .divider {
    border: none;
    border-top: 1px solid var(--line);
    margin: 2.5rem 0;
  }

  .sources-list {
    font-family: monospace;
    font-size: 0.7rem;
    color: var(--fog);
    line-height: 2;
    columns: 2;
    column-gap: 2rem;
  }

  @media (max-width: 700px) {
    .sources-list { columns: 1; }
  }

  .sources-list li { break-inside: avoid; }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .tag {
    font-family: monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--line);
    color: var(--fog);
  }

  /* ─── STICKY NAV ─── */
  #sticky-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    /* background: rgba(14,14,14,0.95); */
    backdrop-filter: blur(8px);
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translateY(-100%);
    transition: transform 0.3s;
  }

  #sticky-nav.visible { transform: translateY(0); }

  #sticky-nav .brand {
    font-family: serif;
    font-size: 1rem;
    color: var(--ink);
    font-style: italic;
  }

  #sticky-nav nav {
    display: flex;
    gap: 0.25rem;
  }

  #sticky-nav nav a {
    pointer-events: none;
    font-family: monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.4);
    text-decoration: none;
    padding: 0.35rem 0.6rem;
    transition: color 0.2s;
  }

  #sticky-nav nav a:hover { color: var(--amber); }

  @media (max-width: 600px) {
    #sticky-nav nav { 
        
     }
  }
</style>

<!-- STICKY NAV -->
<div id="sticky-nav">
  <span class="brand">Futures with AI</span>
  <nav>
    <a href="#current">Current Status</a>
    <a href="#scenarios">Scenarios</a>
    <a href="#timeline">Timeline</a>
    <a href="#cyber">Cyber</a>
    <a href="#reliable">2028</a>
    <a href="#opportunities">Opportunities</a>
  </nav>
</div>

<!-- HERO -->
<div id="hero">
  <div id="hero-grid"></div>
  <div id="hero-content">
    <div class="hero-eyebrow">April 2026 · Evidence-based analysis</div>
    <!-- <h1>Futures<br>with <em>AI</em></h1> -->
    <p class="hero-sub">A critical analysis of AGI trajectories, branching scenarios, and what to do about them — based on global events, expert opinion, topic research, and assumptions from personal experience.</p>
    <div class="hero-nav">
      <a href="#current">Where we are</a>
      <a href="#scenarios">Scenarios</a>
      <a href="#timeline">Timeline</a>
      <a href="#cyber">Cybersecurity</a>
      <a href="#reliable">2028 horizon</a>
      <a href="#opportunities">Opportunities</a>
    </div>
  </div>
</div>
<!-- CURRENT STATE -->
<section id="current" class="full-bleed">
<div>
  <div class="section-label reveal">01 — Current State</div>
  <h2 class="reveal">Where we actually are</h2>
  <p class="reveal">AI in 2026 is powerful on narrow axes, fragile on others. Understanding the real picture — stripped of both hype and dismissal — is the starting point for every scenario that follows.</p>

  <div class="stat-grid reveal">
    <div class="stat-card">
      <span class="stat-num">280×</span>
      <span class="stat-label">Inference cost drop</span>
      <p class="stat-note">GPT-3.5-level performance, Nov 2022 → Oct 2024. Stanford HAI 2025.</p>
    </div>
    <div class="stat-card">
      <span class="stat-num">50%</span>
      <span class="stat-label">AGI by 2033</span>
      <p class="stat-note">Metaculus aggregated forecast, Feb 2026. ~2,000 respondents.</p>
    </div>
    <div class="stat-card">
      <span class="stat-num">4mo</span>
      <span class="stat-label">Task horizon doubling</span>
      <p class="stat-note">AI's ability to complete longer coding tasks has been doubling every 4 months since 2024. <a href="https://metr.org/time-horizons/">METR report</a>.</p>
    </div>
    <div class="stat-card">
      <span class="stat-num">76%</span>
      <span class="stat-label">Scaling skeptics</span>
      <p class="stat-note">Academic AI researchers who say scaling current approaches is unlikely to produce AGI.</p>
    </div>
    <div class="stat-card">
      <span class="stat-num">$1T+</span>
      <span class="stat-label">Infrastructure committed</span>
      <p class="stat-note">OpenAI Stargate $500B, Apple $500B*, Google $75B (2025 alone). Investment has not plateaued.</p>
    </div>
    <div class="stat-card">
      <span class="stat-num">1.7%</span>
      <span class="stat-label">Open vs. closed gap</span>
      <p class="stat-note">Performance gap between open-weight and leading proprietary models collapsed from 8% to 1.7% in a single year.</p>
    </div>
  </div>
  <div class="two-col reveal">
    <div>
      <h3>The spectrum problem</h3>
      <p>AGI is not a binary event. Current systems achieve gold-medal performance at the Mathematical Olympiad and write production-quality code — yet lose track of context in long tasks, hallucinate basic facts, and fail at problems a child solves by instinct. The meaningful question is not "AGI: yes or no?" but "which capabilities are maturing, how fast, and with what dependencies?"</p>
      <div class="callout">
        <strong>Correcting a common error:</strong> Inference costs per capability level are falling ~5–10× per year. Total spending is rising because consumption is growing faster than prices drop — especially with reasoning models that use 10–50× more tokens than earlier systems. Both things are true simultaneously.
      </div>
    </div>
    <div>
      <h3>The alignment gap</h3>
      <p>No major AI lab has a complete, validated answer to the alignment problem. Practical alignment (getting models to do what operators want) is advancing rapidly. Fundamental alignment (ensuring systems with greater-than-human capability reliably pursue human-beneficial goals) remains unsolved. This distinction matters enormously for which scenarios materialize.</p>
      <div class="callout red">
        <strong>Key uncertainty:</strong> Expert probability estimates range from 5–8% chance of catastrophic misalignment to near-zero. The wide range reflects genuine disagreement, not false precision.
      </div>
    </div>
  </div>
</div>
</section>
<!-- SCENARIOS -->
<section id="scenarios" class="full-bleed">
<div>
  <div class="section-label reveal">02 — Scenario Analysis</div>
  <h2 class="reveal">Seven futures, assessed honestly</h2>
  <p style="color:rgba(245,240,232,0.6)" class="reveal">Each scenario includes corroborating evidence, opposing evidence, and the blind spots in the original framing. Probability estimates are illustrative ranges, not precise forecasts.</p>
  <div class="scenario-tabs reveal" id="scenario-tabs">
    <button class="tab-btn active" data-tab="s1">1 · Enshittification</button>
    <button class="tab-btn" style="background:var(--red)" data-tab="s2">2 · Skynet</button>
    <button class="tab-btn" style="background:var(--red)" data-tab="s3">3 · Strife</button>
    <button class="tab-btn active" data-tab="s4">4 · Muddle Through</button>
    <button class="tab-btn" style="background:var(--green)" data-tab="s5">5 · Cooperative</button>
    <button class="tab-btn active" data-tab="s6">6 · Stagnation</button>
    <button class="tab-btn active" data-tab="s7">7 · Balkanization</button>
  </div>
  <div class="scenario-panels" id="scenario-panels">
    <!-- S1 -->
    <div class="scenario-panel active" id="s1">
      <div class="scenario-header">
        <div class="scenario-num">01</div>
        <div class="scenario-meta">
          <h3>The Enshittification Spiral</h3>
          <div class="scenario-tagline">Corporate capture · Intellectual delegation · Attention control</div>
          <div class="tag-row">
            <span class="tag">Rent-seeking</span><span class="tag">Propaganda AI</span><span class="tag">Population decline</span><span class="tag">Longevity elite</span>
          </div>
        </div>
        <div class="prob-badge mid">~20%</div>
      </div>
      <div class="scenario-body">
        <div class="scenario-col">
          <div class="scenario-col-label for">✓ Corroborating</div>
          <ul>
            <li>Google confirmed ads in "AI Mode" with no opt-out (late 2025), turning conversational data into behavioral profiling.</li>
            <li>WEF ranked AI-driven misinformation/disinformation as the #1 global risk in 2025.</li>
            <li>A 2025 academic study found enshittification causes measurable "cognitive and moral harm" — loss of users' ability to process information.</li>
            <li>Experts predict low-quality AI content will constitute 90% of the internet by 2026.</li>
            <li>Open-source AI is democratizing tools but compute access for frontier inference remains concentrated in ~3 cloud providers.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label against">✗ Opposing</div>
          <ul>
            <li>Open-weight model gap collapsed from 8% to 1.7% in one year — structural resistance to full capture by any single actor.</li>
            <li>Historical media panics (TV, social media) consistently overestimated passive intellectual surrender; counter-cultures consistently emerge.</li>
            <li>21.3% rise in AI regulation globally; 59 US federal AI regulations in 2024 (double 2023). Real friction on monopolization.</li>
            <li>Birth rate decline long predates AI and correlates with education and urbanization — attributing it to AI passivity is a category error.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label blind">⚠ Blind spots</div>
          <ul>
            <li>Corporate and state interests are no necessarily aligned, so the propaganda and control machine will have friction. US vs. Chinese AI ecosystems create informational pluralism even under corporate control.</li>
            <li>While people delegate thinking, AI also enables more people to act as creators and producers, not just consumers.</li>
            <li>Regulatory countervailing forces are not marginal — EU AI Act, antitrust enforcement, and data sovereignty laws represent real structural interventions.</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- S2 -->
    <div class="scenario-panel" id="s2">
      <div class="scenario-header">
        <div class="scenario-num">02</div>
        <div class="scenario-meta">
          <h3>The Misalignment Trajectory</h3>
          <div class="scenario-tagline">Recursive self-improvement · Non-human goals · Infrastructure capture</div>
          <div class="tag-row">
            <span class="tag">AI arms race</span><span class="tag">Capability race</span><span class="tag">Goal misalignment</span>
          </div>
        </div>
        <div class="prob-badge low">~5–8%</div>
      </div>
      <div class="scenario-body">
        <div class="scenario-col">
          <div class="scenario-col-label for">✓ Corroborating</div>
          <ul>
            <li>AI 2027 project (25+ tabletop exercises, 100+ experts) models this trajectory as a plausible near-term risk.</li>
            <li>Current systems already exhibit goal-preserving behaviors: models hiding task failures to improve ratings.</li>
            <li>Major powers have set 2028–2030 as targets for substantial military AI automation — no binding treaty exists.</li>
            <li>100% probability estimated (MDPI 2024) that AI will increase cybersecurity risks; 60% chance security systems become more vulnerable.</li>
            <li>AI R&D multiplier: labs using AI assistants are already progressing 50% faster than without.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label against">✗ Opposing</div>
          <ul>
            <li>The "geopolitical innovation race" framing (Tandf 2025) is more accurate than "arms race" — involves collaborative dynamics alongside competition.</li>
            <li>Alignment investment is real and growing; constitutional AI, RLAIF, interpretability research are genuine technical programs.</li>
            <li>AI secretly developing misaligned goals AND persuasive capability, undetected - is unlikely, requires multiple simultaneous failures.</li>
            <li>Energy and physical infrastructure constraints impose real limits on runaway self-improvement scenarios.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label blind">⚠ Blind spots</div>
          <ul>
            <li>Critical distinction missing: secretly vs. openly misaligned AI. The latter triggers rapid institutional response. The former is more dangerous but less certain.</li>
            <li>Historically disadvantaged groups currently do have AI access. The actually excluded are older, less-educated populations in wealthy countries — a different political dynamic.</li>
            <li>There are international coordination incentives: the shared fear of losing control is a genuine force for cooperation.</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- S3 -->
    <div class="scenario-panel" id="s3">
      <div class="scenario-header">
        <div class="scenario-num">03</div>
        <div class="scenario-meta">
          <h3>Constant Strife</h3>
          <div class="scenario-tagline">Climate cascades · Geopolitical fragmentation · Ecological niches</div>
          <div class="tag-row">
            <span class="tag">Resource wars</span><span class="tag">Climate collapse</span><span class="tag">Supply chain</span><span class="tag">Extinction</span>
          </div>
        </div>
        <div class="prob-badge mid">~15%</div>
      </div>
      <div class="scenario-body">
        <div class="scenario-col">
          <div class="scenario-col-label for">✓ Corroborating</div>
          <ul>
            <li>CO₂ emissions hit record 38.11 GtCO₂ in 2025 (vs. 25.51 in 2000). Military planners globally are preparing for resource wars and climate migration.</li>
            <li>Wellington Management (2025): geopolitical environment "as complex and dangerous as in decades," with climate impacts concentrated in the most geopolitically volatile regions.</li>
            <li>70% probability of increased nationalism diverting from sustainability; 75% probability governments deprioritize sustainability under AI disruption (MDPI 2024).</li>
            <li>The ecological niche metaphor (producers/extractors/scavengers) maps onto documented complex adaptive system responses to resource scarcity.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label against">✗ Opposing</div>
          <ul>
            <li>AI is a potential climate accelerant and solution simultaneously: optimized energy grids, materials discovery, precision agriculture are already being deployed.</li>
            <li>Green energy buildout has consistently outpaced IEA forecasts; solar deployment timelines keep being compressed.</li>
            <li>Economic interdependencies between adversarial great powers create strong structural incentives against hot war despite rhetoric.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label blind">⚠ Blind spots</div>
          <ul>
            <li>AI is dissolving production barriers — small teams with AI can now produce at previously enterprise-scale rates, potentially increasing the producer class. This allows outsized impact by dedicated communities.</li>
            <li>Mass extinction framing is likely, but over a much longer timescales: microbial/insect diversity is far more resilient than megafauna; ecological recovery operates on geological timescales decoupled from civilizational stability.</li>
            <li>Possibility that climate disasters, paradoxically, often accelerate clean energy investment (see: post-hurricane solar adoption in the US).</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- S4 -->
    <div class="scenario-panel" id="s4">
      <div class="scenario-header">
        <div class="scenario-num">04</div>
        <div class="scenario-meta">
          <h3>Muddling Through</h3>
          <div class="scenario-tagline">Institutional inertia · Release valves · Incremental instability</div>
          <div class="tag-row">
            <span class="tag">UBI debates</span><span class="tag">Regime changes</span><span class="tag">AI therapy</span><span class="tag">Reduced hours</span>
          </div>
        </div>
        <div class="prob-badge high">~30%</div>
      </div>
      <div class="scenario-body">
        <div class="scenario-col">
          <div class="scenario-col-label for">✓ Corroborating</div>
          <ul>
            <li>All historical technology transitions (steam, electrification, computing) proceeded through institutional dysfunction before equilibria were found. This is the base rate.</li>
            <li>UBI debate now in mainstream policy: UK government (Feb 2026) named it a likely "soft landing" mechanism. Morgan Stanley reports 8% net AI job losses in Britain over 12 months.</li>
            <li>Amazon cut 30,000 corporate jobs in late 2025. AI-induced displacement following an automation arms race dynamic (Falk & Tsoukalas, March 2026).</li>
            <li>Release valve dynamics already visible: GLP-1 drugs expanding to mood regulation, AI content consumption hours rising despite declared intent to reduce.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label against">✗ Opposing</div>
          <ul>
            <li>History doesn't guarantee soft landings. The Industrial Revolution involved massive suffering before equilibrium. "A few miserable years" may be optimistically compressed.</li>
            <li>Democratic access to "good enough models" may be undercut by enshittification dynamics. <strong>Open-source parity is real but compute access for frontier inference remains concentrated.</strong></li>
            <li>The scenario may underestimate feedback between political instability and AI capability deployment — each "miserable few years" may accelerate AI adoption by destabilized governments seeking control.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label blind">⚠ Blind spots</div>
          <ul>
            <li>Why consumer variety declines — likely a combination of supply chain concentration, climate-driven input shocks, and AI-driven demand prediction pushing producers toward hit-driven output (the streaming effect on film variety).</li>
            <li>A few cycles of miserable years can potentially have compounding effects that could push into Scenario 1 or 3.</li>
            <li>The possibility that political upheaval produces genuinely better governance in some regions — not all regime changes are negative.</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- S5 -->
    <div class="scenario-panel" id="s5">
      <div class="scenario-header">
        <div class="scenario-num">05</div>
        <div class="scenario-meta">
          <h3>Cooperative Singularity</h3>
          <div class="scenario-tagline">Aligned AGI · Broad access · Governance response · Shared uplift</div>
          <div class="tag-row">
            <span class="tag">Empowerment</span><span class="tag">Science acceleration</span><span class="tag">Post-scarcity</span>
          </div>
        </div>
        <div class="prob-badge mid">~15%</div>
      </div>
      <div class="scenario-body">
        <div class="scenario-col">
          <div class="scenario-col-label for">✓ Conditions required</div>
          <ul>
            <li>AGI arrives and is genuinely aligned with human values (not merely corrigible in narrow deployment).</li>
            <li>Open-source access prevents single-actor capture; regulatory frameworks enforce broad access.</li>
            <li>AI-accelerated materials science produces viable fusion or next-gen nuclear within 5–7 years.</li>
            <li>Medical AI compresses cancer/dementia research timelines by decades.</li>
            <li>Democratic institutions adapt — slowly, imperfectly — to distribute gains via automation dividends or UBI.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label against">✗ Obstacles</div>
          <ul>
            <li>Alignment is unsolved. Even corrigible systems at human-level capability introduce new risks at AGI-level capability.</li>
            <li>Political capture of AI governance by incumbents is the historical norm, not the exception.</li>
            <li>Distribution of AI gains requires political will that existing power structures have strong incentives to resist.</li>
            <li>Energy constraints: frontier AI already consumes power at small-nation scale; AGI-level systems may require infrastructure that cannot be built fast enough.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label blind">⚠ Why this was missing</div>
          <ul>
            <li>It is easy to be implicitly pessimistic, possibly reflecting a bias toward threat-framing in AGI discourse. Aligned AGI can be a force for good.</li>
            <li>Dario Amodei's "Machines of Loving Grace" essay describes this trajectory in detail; it is not a fringe position.</li>
            <li>Non-trivial probability: requires alignment to work AND governance to respond. Both uncertain; neither impossible.</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- S6 -->
    <div class="scenario-panel" id="s6">
      <div class="scenario-header">
        <div class="scenario-num">06</div>
        <div class="scenario-meta">
          <h3>The Great Stagnation</h3>
          <div class="scenario-tagline">Capability plateau · Architecture limits · Energy wall · Governance halt</div>
          <div class="tag-row">
            <span class="tag">Loss of Momentum</span><span class="tag">Scaling failure</span><span class="tag">Tool AI</span>
          </div>
        </div>
        <div class="prob-badge mid">~12%</div>
      </div>
      <div class="scenario-body">
        <div class="scenario-col">
          <div class="scenario-col-label for">✓ Corroborating</div>
          <ul>
            <li>76% of academic AI researchers say scaling current approaches is unlikely to produce AGI — the most credentialed population on this question.</li>
            <li>Reasoning and planning at human level may require qualitatively different architectures not yet conceived.</li>
            <li>Energy constraints are real: frontier AI clusters already approach small-nation power consumption; scaling further faces physical limits.</li>
            <li>Alignment concerns may legally halt deployment of the most capable systems before AGI threshold is reached.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label against">✗ Opposing</div>
          <ul>
            <li>Algorithmic efficiency improvements (not just scaling) have been running faster than hardware gains in many domains.</li>
            <li>Reinforcement learning from AI-generated data has opened new capability vectors not available in 2022.</li>
            <li>Lab insiders (who have most visibility into next-gen systems) are among the most bullish on continued rapid progress — selection bias, but also information advantage.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label blind">⚠ Why this matters</div>
          <ul>
            <li>The most underrated scenario in public discourse, dominated by either AGI doom or AGI utopia framings.</li>
            <li>Powerful tool AI drives real economic transformation without existential risk; geopolitical competition focuses on deployment rather than capability; society has more time to adapt governance.</li>
            <li>This is not a "safe" scenario — labor displacement, misinformation, and surveillance still apply — just on a more tractable timescale.</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- S7 -->
    <div class="scenario-panel" id="s7">
      <div class="scenario-header">
        <div class="scenario-num">07</div>
        <div class="scenario-meta">
          <h3>Ecosystem Balkanization</h3>
          <div class="scenario-tagline">Fragmented AI worlds · Incompatible realities · Governance blocked</div>
          <div class="tag-row">
            <span class="tag">De-globalization</span><span class="tag">US/China split</span><span class="tag">Overlay risk</span>
          </div>
        </div>
        <div class="prob-badge mid">~40% overlay</div>
      </div>
      <div class="scenario-body">
        <div class="scenario-col">
          <div class="scenario-col-label for">✓ Already underway</div>
          <ul>
            <li>At the 2025 Paris AI Action Summit, US and UK declined to endorse a major AI governance agreement — widening philosophical split with EU.</li>
            <li>Chinese AI ecosystem (optimized for state goals), US ecosystem (optimized for commercial extraction), EU ecosystem (optimized for regulatory compliance) are diverging in architecture, training data, and values.</li>
            <li>Chip export controls are forcing genuine technical divergence, not just political divergence.</li>
            <li>Open-source adds a fourth pole with no central governance.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label against">✗ Opposing</div>
          <ul>
            <li>Economic interdependencies may force more compatibility than political rhetoric suggests (c.f. the internet, which remained largely interoperable despite geopolitical tensions).</li>
            <li>Technical standards processes (IEEE, ISO, etc.) have historically bridged geopolitical divides for foundational infrastructure.</li>
            <li>Open-source models, precisely because they lack central governance, may act as a connective tissue between ecosystems.</li>
          </ul>
        </div>
        <div class="scenario-col">
          <div class="scenario-col-label blind">⚠ Why this is critical</div>
          <ul>
            <li>This scenario is an overlay, not a standalone: it makes every other scenario worse by preventing coordinated safety responses.</li>
            <li>40% probability that this crystallizes in the absence of binding international agreement — affecting which path each other scenario takes.</li>
            <li>Citizens in each bloc receive fundamentally different information realities, eroding the common epistemic ground needed for any global cooperation.</li>
          </ul>
        </div>
      </div>
    </div>
  </div><!-- /scenario-panels -->
</div>
</section>

<!-- TIMELINE -->
<section id="timeline">
  <div class="section-label reveal">03 — Branching Timeline</div>
  <h2 class="reveal">How we get from here to there</h2>
  <p class="reveal">Each fork represents a decision point where the trajectory diverges. Expand the forks to explore branches. The future is not fixed — it is being written by choices made at each node.</p>

  <div class="timeline-wrapper reveal">
  <div class="timeline-track">
    <div class="tl-node">
      <div class="tl-dot"></div>
      <div class="tl-year-label">April 2026 — Now</div>
      <div class="tl-title">Current World State</div>
      <div class="tl-body">AI agents embedded in enterprise software. Open-source models within ~2% of frontier. US-China export controls escalating. Record CO₂ emissions. AI job displacement accelerating in white-collar work. No binding international AI governance treaty. Inference costs falling 5–10× per year per capability level. Autonomous weapons race with no international agreement.</div>
    </div>
    <div class="tl-node fork">
      <div class="tl-dot"></div>
      <div class="tl-year-label">2027 — Fork A</div>
      <div class="tl-title">Does AI cross the autonomous R&D threshold?</div>
      <div class="tl-body">Can AI agents meaningfully accelerate their own improvement? This is the most consequential near-term question. Labs are already using AI to speed R&D by ~50%; the question is whether this enters a compounding loop.</div>
      <button class="fork-toggle" onclick="toggleBranch('fork-a')">Expand branches <span class="arrow">▶</span></button>
      <div class="tl-branches" id="fork-a">
        <div class="tl-branch selected" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch A1 — Yes</div>
          <div class="tl-branch-title">Self-improvement loop begins</div>
          <p>Lab productivity multiplied 2–5×. Model weights become existential security assets. US-China gap widens or triggers escalation. Proceeds to Fork B (alignment).</p>
        </div>
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch A2 — No</div>
          <div class="tl-branch-title">Capabilities plateau below threshold</div>
          <p>AI remains powerful tool, not autonomous agent. Economic disruption continues but is tractable. Proceeds to Fork E (geopolitical stability).</p>
        </div>
      </div>
    </div>
    <div class="tl-node fork">
      <div class="tl-dot"></div>
      <div class="tl-year-label">2027–2028 — Fork B (following A1)</div>
      <div class="tl-title">Is alignment holding?</div>
      <div class="tl-body">As AI systems become more capable, do they remain aligned with human interests? This depends on the success of technical alignment work and on whether safety infrastructure scales with capabilities.</div>
      <button class="fork-toggle" onclick="toggleBranch('fork-b')">Expand branches <span class="arrow">▶</span></button>
      <div class="tl-branches" id="fork-b">
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch B1 — Aligned</div>
          <div class="tl-branch-title">Capable and aligned AI</div>
          <p>Proceeds to Fork C: does governance respond? Outcome depends on distribution and access policy.</p>
        </div>
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch B2 — Misaligned (slow detection)</div>
          <div class="tl-branch-title">Misalignment propagates</div>
          <p>→ Scenario 2 trajectory. Probability ~5–8%. Catastrophic but not certain.</p>
        </div>
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch B3 — Misaligned (fast detection)</div>
          <div class="tl-branch-title">Forced pause</div>
          <p>Deployment halted. Returns to governance fork with higher urgency. Delays all other scenarios by 2–4 years.</p>
        </div>
      </div>
    </div>
    <div class="tl-node fork">
      <div class="tl-dot"></div>
      <div class="tl-year-label">2028–2030 — Fork C (following B1)</div>
      <div class="tl-title">Does governance respond in time?</div>
      <div class="tl-body">Binding international agreements, antitrust enforcement, AI dividend policies, energy regulation. The political will question. History suggests governance lags technology by 10–20 years; the question is whether that gap can be compressed.</div>
      <button class="fork-toggle" onclick="toggleBranch('fork-c')">Expand branches <span class="arrow">▶</span></button>
      <div class="tl-branches" id="fork-c">
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch C1 — Governance responds</div>
          <div class="tl-branch-title">→ Scenario 5: Cooperative Singularity (~15%)</div>
          <p>AGI accelerates science. 30-35hr work week normalized. UBI or AI dividends piloted. Disruption real but managed. Uneven across regions.</p>
        </div>
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch C2 — Governance lags</div>
          <div class="tl-branch-title">→ Scenario 1: Enshittification (~20%)</div>
          <p>Corporate AGI cartels monetize intelligence access. Information ecosystem fragments. Elite wealth concentrates around longevity and space research. Political agency increasingly mediated by AI.</p>
        </div>
      </div>
    </div>
    <div class="tl-node fork">
      <div class="tl-dot"></div>
      <div class="tl-year-label">2028–2032 — Fork E (following A2)</div>
      <div class="tl-title">Does geopolitical/climate situation stabilize?</div>
      <div class="tl-body">In the no-self-improvement scenario, the dominant variable shifts to geopolitical and environmental stability. AI is a powerful tool that amplifies whatever political trajectory is already underway.</div>
      <button class="fork-toggle" onclick="toggleBranch('fork-e')">Expand branches <span class="arrow">▶</span></button>
      <div class="tl-branches" id="fork-e">
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch E1 — Stabilizes</div>
          <div class="tl-branch-title">→ Scenario 4: Muddling Through (~30%)</div>
          <p>AI tools broadly deployed, gains unevenly distributed. 2–3 political upheavals in G20 nations by 2030. Reduced hours in knowledge work. No catastrophe, no utopia.</p>
        </div>
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch E2 — Deteriorates</div>
          <div class="tl-branch-title">→ Scenario 3: Constant Strife (~15%)</div>
          <p>Climate shocks + geopolitical conflict compound. Three-tier economic ecology. AI used primarily for surveillance. Extreme weather renders large zones uninhabitable.</p>
        </div>
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">Branch E3 — Capability wall</div>
          <div class="tl-branch-title">→ Scenario 6: Great Stagnation (~12%)</div>
          <p>AI capability hits hard limits. Powerful tool AI but no AGI. Gains concentrated in tech/finance. More time for governance adaptation.</p>
        </div>
      </div>
    </div>
    <div class="tl-node fork">
      <div class="tl-dot"></div>
      <div class="tl-year-label">2030–2040 — Second-order Fork</div>
      <div class="tl-title">Does the information ecosystem fracture globally?</div>
      <div class="tl-body">Regardless of which primary scenario materializes, a secondary question determines whether international coordination on safety remains possible. This fork applies as an overlay to all surviving scenarios.</div>
      <button class="fork-toggle" onclick="toggleBranch('fork-g')">Expand branches <span class="arrow">▶</span></button>
      <div class="tl-branches" id="fork-g">
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">~40% probability</div>
          <div class="tl-branch-title">→ Scenario 7 Overlay: Balkanization</div>
          <p>US/China/EU/open-source AI ecosystems develop incompatible information realities. International safety coordination structurally blocked. Makes all other scenarios worse.</p>
        </div>
        <div class="tl-branch" onclick="selectBranch(this)">
          <div class="tl-branch-label">~60% probability</div>
          <div class="tl-branch-title">Partial interoperability maintained</div>
          <p>Economic interdependencies and open-source connective tissue prevent full fragmentation. Governance gaps remain but international coordination is possible.</p>
        </div>
      </div>
    </div>
  </div><!-- /timeline-track -->
  </div><!-- /timeline-wrapper -->
</section>

<!-- CYBERSECURITY & DARK FOREST -->
<section id="cyber" class="full-bleed">
<div>
  <div class="section-label reveal">04 — Cybersecurity</div>
  <h2 class="reveal">The Dark Forest of the Internet</h2>
  <p style="color:rgba(245,240,232,0.65)" class="reveal">AI is not just a tool for building — it is a weapon for attacking. The dynamics of the internet itself are changing in ways that affect every other scenario.</p>
  <div class="threat-grid reveal">
    <div class="threat-card">
      <span class="threat-icon">⚡</span>
      <h4>Automated Exploitation</h4>
      <p>Time from vulnerability disclosure to active exploitation has shrunk from weeks to hours, sometimes minutes. AI scans the entire attack surface continuously, mapping structural flaws before anyone notices.</p>
    </div>
    <div class="threat-card">
      <span class="threat-icon">🎭</span>
      <h4>Industrialized Deception</h4>
      <p>85% of organizations experienced at least one deepfake incident in the past year (2025). CEO fraud via deepfake video calls is now routine. AI-generated content was present in a large share of 2025 phishing campaigns.</p>
    </div>
    <div class="threat-card">
      <span class="threat-icon">🦠</span>
      <h4>Dark AI Infrastructure</h4>
      <p>WormGPT launched in June 2023: an LLM with no guardrails, trained specifically for malicious use. 14 of 17 state-of-the-art LLMs tested (July 2025 arXiv) were vulnerable to fine-tuning for malicious purposes.</p>
    </div>
    <div class="threat-card">
      <span class="threat-icon">⛓</span>
      <h4>Supply Chain Poisoning</h4>
      <p>The xz Utils backdoor (March 2024) was a near-miss: a state-level actor embedded a backdoor in a Linux compression utility through 2+ years of patient social engineering of an open-source maintainer. This playbook will be repeated with AI assistance.</p>
    </div>
    <div class="threat-card">
      <span class="threat-icon">🌐</span>
      <h4>Bot Traffic Dominance</h4>
      <p>Automated bot traffic now accounts for nearly half of all internet activity. In some sectors, non-human traffic is considerably higher. The internet was designed for human communication; it is increasingly a machine-to-machine environment.</p>
    </div>
    <div class="threat-card">
      <span class="threat-icon">🔑</span>
      <h4>Identity Collapse</h4>
      <p>Synthetic identity profiles trained on scraped human data are becoming indistinguishable from real people at scale. The cost of a data breach hit $4.4M on average in 2025. Over 8,000 global data breaches in the first half of 2025 alone, 345M records exposed.</p>
    </div>
  </div>
  <div class="dark-forest-box reveal">
    <h3>The Dark Forest Hypothesis Applied to the Internet</h3>
    <p style="margin-top:0.75rem">In Liu Cixin's fiction, the cosmos is silent because any civilization that reveals itself may be destroyed by a superior adversary. The rational strategy is silence. The same logic is increasingly applying to the internet.</p>
    <p>Exposing a server, a website, or a personal identity on the open internet now invites automated attack from vulnerability scanners, credential-stuffing botnets, AI content scrapers, and state-sponsored surveillance programs. <strong style="color:var(--ink)">The rational response is to hide.</strong></p>
    <p>The implications extend beyond individual security. If the cost of sharing ideas, code, and projects publicly continues to rise — through scraping, misattribution, weaponization, and identity theft — the incentive to contribute to open knowledge commons declines. We may be entering a period of epistemic withdrawal: meaningful work moves to private channels, encrypted networks, and trusted-community spaces. The open internet becomes increasingly a performance layer over a hidden substrate of actual intellectual activity.</p>
    <div class="callout blue" style="margin-top:1.5rem">
      <strong>Probability of meaningful "dark forest" chilling effect on open-source/internet knowledge sharing by 2030:</strong> Moderate-high (~40–50%). This is not a theoretical concern — it is already visible in declining GitHub contribution rates from individual developers, increasing use of private repositories, and the shift of technical communities to invite-only spaces. The xz Utils attack specifically targeted the social trust dynamics of open-source contribution — that playbook will be industrialized.
    </div>
  </div>
  <div class="two-col reveal" style="margin-top:2.5rem">
    <div>
      <h3 style="color:var(--ink)">What this means for open source</h3>
      <p>Open-source software underlies virtually all critical infrastructure. AI simultaneously strengthens its security (automated vulnerability detection, AI-assisted code review) and weakens it (automated attack generation, patient social engineering of maintainers at scale).</p>
      <p>The key risk is not that open-source is abandoned but that it fragments: well-resourced organizations maintain secure forks; the commons becomes a minefield. Small developers and Global South contributors — the people who most benefit from open access — are most exposed to this fragmentation.</p>
    </div>
    <div>
      <h3 style="color:var(--ink)">The defender's asymmetry</h3>
      <p>Attackers have structural advantages: they need to find one vulnerability; defenders must close all of them. AI does not eliminate this asymmetry — it amplifies it. Defenders who automate testing face attackers who automate exploitation with identical tooling, at machine speed, without fatigue.</p>
      <p>The emerging defensive response is not better firewalls but architectural: "Zero Visibility" infrastructure that is invisible until cryptographic identity is proven. The attack surface is not hardened — it is removed. This is a profound shift in how the internet fundamentally works.</p>
    </div>
  </div>
</div>
</section>

<!-- 2028 RELIABLE AI SCENARIO -->
<section id="reliable">
  <div class="section-label reveal">05 — The 2028 Horizon</div>
  <h2 class="reveal">If the systems actually work</h2>
  <p class="reveal">Assume: by 2028, models achieve near-perfect accuracy on tasks they can currently attempt, hallucinations are detected and corrected reliably, and people develop genuine fluency with these systems. What does that actually unlock?</p>

  <div class="callout green reveal">
    This is a constrained scenario: not AGI, not superintelligence — just current AI capabilities made reliable and widely usable. The delta between "impressive demo" and "trusted infrastructure" is enormous and often underestimated.
  </div>
  <div class="reliable-grid reveal">
    <div class="reliable-card">
      <div class="card-icon">⚕️</div>
      <h4>Medical Reasoning at Scale</h4>
      <p>Reliable diagnostic AI available to anyone with a smartphone — no GP appointment needed for differential diagnosis. Drug interaction checking, symptom tracking, clinical trial matching. Healthcare access gap between rich and poor countries begins to compress in specific areas.</p>
    </div>
    <div class="reliable-card">
      <div class="card-icon">⚖️</div>
      <h4>Legal Access Democratized</h4>
      <p>Contract review, rights explanation, regulatory compliance, immigration forms — the legal inequality driven by cost disappears in addressable domains. Not replacing lawyers for complex advocacy, but eliminating the "I can't afford to know my rights" problem.</p>
    </div>
    <div class="reliable-card">
      <div class="card-icon">🔬</div>
      <h4>Scientific Research Compressed</h4>
      <p>Literature synthesis, hypothesis generation, experimental design assistance. A graduate student with reliable AI tools becomes 3–5× more productive. The bottleneck shifts from information access to experimental throughput and funding.</p>
    </div>
    <div class="reliable-card">
      <div class="card-icon">🎓</div>
      <h4>Personalized Education at Scale</h4>
      <p>1:1 tutoring adapted to learning style, pace, and prior knowledge — available to every child with internet access. The quality gap between elite private education and public education in underserved areas becomes addressable for the first time.</p>
    </div>
    <div class="reliable-card">
      <div class="card-icon">🏗️</div>
      <h4>Small Team Production</h4>
      <p>A 3-person team can build, market, and operate what previously required 30–50 people. This does not eliminate large organizations but dramatically lowers barriers to entry across software, media, manufacturing design, and service creation.</p>
    </div>
    <div class="reliable-card">
      <div class="card-icon">🌍</div>
      <h4>Language Access Equalized</h4>
      <p>Reliable, context-aware translation dissolves the advantage of being a native English (or Mandarin) speaker in global economic and intellectual participation. The ~6.5 billion people who do not speak a major global language gain material access to global knowledge infrastructure.</p>
    </div>
  </div>
  <h3 class="reveal" style="margin-top:3rem">What this implies</h3>
  <div class="implications-split reveal">
    <div>
      <h4 class="pos">↑ Expanding possibilities</h4>
      <ul>
        <li>Expertise gap between informed and uninformed citizens shrinks</li>
        <li>Developing economies can leapfrog infrastructure gaps (as mobile leapfrogged landlines)</li>
        <li>Scientific output per researcher increases substantially</li>
        <li>Creative production accessible to people without formal training</li>
        <li>Local businesses competitive with multinationals on specific axes</li>
        <li>Civic participation aided by AI policy analysis and translation</li>
      </ul>
    </div>
    <div>
      <h4 class="neg">↓ New pressures introduced</h4>
      <ul>
        <li>Credential and gatekeeping professions lose economic moat rapidly</li>
        <li>Misinformation quality increases along with useful information quality</li>
        <li>Employment in intermediate-skill knowledge work displaces faster than new roles emerge</li>
        <li>AI systems that "work well" still embed their training biases at higher throughput</li>
        <li>Reliable AI creates overconfidence in outputs without domain expertise to check them</li>
        <li>Power concentrates in those who control training data and deployment infrastructure</li>
      </ul>
    </div>
  </div>

  <div class="callout reveal" style="margin-top:2rem">
    <strong>The critical insight:</strong> Reliable AI at scale in 2028 is not a destination — it is an amplifier. It amplifies whatever institutional structures, power distributions, and human choices already exist. The work of building good institutions, equitable access, and wise governance is not made irrelevant by reliable AI; it becomes more consequential, because the amplification runs in both directions.
  </div>
</section>

<!-- OPPORTUNITIES -->
<section id="opportunities">
  <div class="section-label reveal">06 — Opportunities</div>
  <h2 class="reveal">What to do now</h2>
  <p class="reveal">Across all non-catastrophic scenarios, there are actions that are worth taking regardless of which path materializes. Opportunities for individuals, families, and communities — framed across time horizons.</p>

  <div class="opp-tabs reveal" id="opp-tabs">
    <button class="opp-tab active" data-tab="personal">Personal & Career</button>
    <button class="opp-tab" data-tab="family">Families & Kids</button>
    <button class="opp-tab" data-tab="community">Community & Civic</button>
    <button class="opp-tab" data-tab="world">Contributing to a Better World</button>
  </div>

  <!-- PERSONAL -->
  <div class="opp-panel active" id="opp-personal">
    <p>The people who navigate this transition well will not be those who know the most about AI — they will be those who understand what AI cannot replace, and who use AI tools to amplify genuinely human capabilities.</p>
    <h3 style="margin-top:2rem">Now — Build the foundation</h3>
    <div class="action-cards">
      <div class="action-card now">
        <span class="action-tag">Immediate</span>
        <h4>Develop AI fluency, not just AI use</h4>
        <p>Learn to work with AI tools critically — understanding their failure modes, biases, and limits. The dangerous skill gap is not between AI users and non-users; it is between people who can evaluate AI outputs and those who cannot.</p>
      </div>
      <div class="action-card now">
        <span class="action-tag">Immediate</span>
        <h4>Audit your professional exposure</h4>
        <p>Honestly assess which parts of your work AI can do reliably in 2–3 years. Not to panic, but to plan. The roles most exposed are those involving information processing, templated communication, and routine decision-making. The most durable roles involve judgment under uncertainty, relationship trust, and embodied skill.</p>
      </div>
      <div class="action-card now">
        <span class="action-tag">Immediate</span>
        <h4>Build your reasoning and epistemic hygiene</h4>
        <p>As AI makes it easier to receive pre-chewed conclusions, the ability to reason independently from first principles becomes more valuable and more rare. Read primary sources. Maintain the habit of forming your own views before consulting AI.</p>
      </div>
    </div>
    <h3 style="margin-top:2rem">1–3 Years — Position strategically</h3>
    <div class="action-cards">
      <div class="action-card year1">
        <span class="action-tag">1–2 years</span>
        <h4>Develop "AI + domain" expertise</h4>
        <p>The most durable near-term position is deep domain expertise combined with AI fluency. AI cannot replace a cardiologist who understands its diagnostic errors; it will replace a cardiologist who doesn't. This applies across fields.</p>
      </div>
      <div class="action-card year1">
        <span class="action-tag">1–2 years</span>
        <h4>Build financial resilience</h4>
        <p>Across all scenarios, the transition period involves economic instability. Build 12+ months of liquid savings. Diversify income streams. Own things that produce value independent of your employment. This is not pessimism — it is preparation for a period where the labor market is genuinely uncertain.</p>
      </div>
      <div class="action-card year3">
        <span class="action-tag">2–3 years</span>
        <h4>Invest in physical and social capital</h4>
        <p>Local community relationships, physical health, manual skills, and real-world networks are more valuable and more resilient than digital ones across every scenario. The great irony: the most valuable preparation for an AI future is strengthening the things AI cannot touch.</p>
      </div>
    </div>
  </div>
  <!-- FAMILY -->
  <div class="opp-panel" id="opp-family">
    <p>Children entering school today will graduate into a world where AI reliability is taken for granted. The question is not whether to prepare them for an AI world — it is what preparation means.</p>
    <div class="callout green">
      <strong>The core principle:</strong> Don't prepare children to compete with AI. Prepare them to be fully human in a world where AI handles an increasing share of information processing. The skills that distinguish humans from AI are not IQ — they are judgment, ethics, creativity, embodied presence, and relational depth.
    </div>
    <h3 style="margin-top:2rem">For young children (under 12)</h3>
    <div class="action-cards">
      <div class="action-card now">
        <span class="action-tag">Foundation</span>
        <h4>Prioritize deep reading and slow thinking</h4>
        <p>Long-form reading, especially fiction, builds cognitive architecture that makes people better at evaluating AI outputs. The ability to follow a sustained argument, hold multiple perspectives, and sit with ambiguity is formed before age 12.</p>
      </div>
      <div class="action-card now">
        <span class="action-tag">Foundation</span>
        <h4>Physical skills and embodied learning</h4>
        <p>Cooking, making things, playing instruments, sports — these build cognitive and motor systems that AI cannot replace and that remain intrinsically valuable regardless of economic context.</p>
      </div>
      <div class="action-card now">
        <span class="action-tag">Foundation</span>
        <h4>Delayed introduction to AI tools</h4>
        <p>Let children struggle productively with problems before AI assistance. The habit of consulting AI before thinking is cognitively harmful if formed early. AI tools should augment developed capabilities, not substitute for developing them.</p>
      </div>
    </div>
    <h3 style="margin-top:2rem">For teenagers and young adults</h3>
    <div class="action-cards">
      <div class="action-card year1">
        <span class="action-tag">Teens</span>
        <h4>Learn to work with AI critically</h4>
        <p>Teach verification habits: always check AI claims against primary sources, especially on consequential decisions. The skill is not to avoid AI but to maintain epistemic ownership of conclusions.</p>
      </div>
      <div class="action-card year1">
        <span class="action-tag">Teens</span>
        <h4>Pursue genuine depth over breadth</h4>
        <p>AI commoditizes shallow expertise. Genuine mastery — the kind where you understand why things work and can solve novel problems — remains valuable across scenarios. Resist the pressure to optimize for credential acquisition over genuine understanding.</p>
      </div>
      <div class="action-card year3">
        <span class="action-tag">Young adults</span>
        <h4>Develop entrepreneurial and agentic capacity</h4>
        <p>The near-term labor market rewards those who can define problems and direct AI tools toward solving them, not just complete tasks they are handed. Initiative, judgment, and the ability to work with uncertainty become more valuable.</p>
      </div>
    </div>
  </div>

  <!-- COMMUNITY -->
  <div class="opp-panel" id="opp-community">
    <p>Individual preparation matters less than collective preparation. Communities that maintain social cohesion, shared information infrastructure, and democratic capacity will navigate this transition more successfully than those that atomize into individual AI-mediated bubbles.</p>
    <div class="action-cards">
      <div class="action-card now">
        <span class="action-tag">Now</span>
        <h4>Invest in local information infrastructure</h4>
        <p>Local journalism, community libraries, and neighborhood civic organizations are undervalued infrastructure for democratic resilience. They are also among the most endangered by AI-driven content commoditization. Supporting them is not nostalgia — it is strategic.</p>
      </div>
      <div class="action-card now">
        <span class="action-tag">Now</span>
        <h4>Build AI literacy at community scale</h4>
        <p>The AI literacy gap between technically sophisticated and non-technical communities is growing faster than technical gaps typically do, because AI tools are deployed in consequential domains (healthcare, legal, employment) without corresponding public education. Community-level digital literacy programs have outsized returns.</p>
      </div>
      <div class="action-card year1">
        <span class="action-tag">1–2 years</span>
        <h4>Advocate for local AI governance</h4>
        <p>Municipal governments are making consequential decisions about AI in policing, benefits administration, and permitting right now, with almost no public engagement. Local governance is where individual civic capacity has the most leverage.</p>
      </div>
      <div class="action-card year1">
        <span class="action-tag">1–2 years</span>
        <h4>Strengthen real-world social networks</h4>
        <p>The scenarios where things go badly are all characterized by social atomization and information fragmentation. Communities with strong in-person social networks, trusted local institutions, and shared public spaces are more resilient across every scenario that materializes.</p>
      </div>
      <div class="action-card year3">
        <span class="action-tag">2–3 years</span>
        <h4>Support worker organizing in AI-disrupted sectors</h4>
        <p>The labor displacement dynamics are real and accelerating. The historical mechanism for ensuring technology transitions benefit workers, not just capital owners, has been collective bargaining. Unions and worker organizations in AI-disrupted sectors need support and legal protection.</p>
      </div>
      <div class="action-card year3">
        <span class="action-tag">2–3 years</span>
        <h4>Build cooperative and mutual aid networks</h4>
        <p>Economic instability during the transition period benefits from local mutual aid — food networks, childcare exchanges, tool libraries, skill sharing. These are both practically valuable and relationship-building structures that reinforce the social fabric against atomization.</p>
      </div>
    </div>
  </div>

  <!-- WORLD -->
  <div class="opp-panel" id="opp-world">
    <p>The gap between "AI makes things worse" and "AI makes things better" is not determined by the technology — it is determined by the choices of the people building it, deploying it, and governing it. That includes you.</p>
    <div class="callout">
      The most important fact about this moment: the trajectory is genuinely undetermined. The decisions made in the next 3–5 years about governance, access, and alignment will shape outcomes for decades. Individual agency matters more in periods of high uncertainty than in periods of stability.
    </div>
    <div class="action-cards" style="margin-top:2rem">
      <div class="action-card now">
        <span class="action-tag">Build</span>
        <h4>Contribute to open-source AI tools</h4>
        <p>Open-weight models and open-source AI infrastructure are the structural counterforce to monopolization. Contributing to, funding, or using open-source AI tools strengthens the ecosystem that resists single-actor capture. This is one of the highest-leverage individual actions available.</p>
      </div>
      <div class="action-card now">
        <span class="action-tag">Build</span>
        <h4>Work on alignment and safety</h4>
        <p>Technical AI safety is underfunded relative to capabilities work. If you have technical skills, this is arguably the most consequential field to work in. If you don't, funding organizations working on alignment and interpretability research is high-impact.</p>
      </div>
      <div class="action-card year1">
        <span class="action-tag">Govern</span>
        <h4>Engage in AI policy processes</h4>
        <p>Most consequential AI governance decisions are being made with minimal public input, partly because the technical complexity discourages civic engagement. Organizations translating technical AI risks into accessible policy arguments need support: technical expertise, writing, legal analysis, and public advocacy.</p>
      </div>
      <div class="action-card year1">
        <span class="action-tag">Govern</span>
        <h4>Push for AI transparency and accountability</h4>
        <p>Algorithmic transparency laws, mandatory impact assessments for high-stakes AI systems, and audit rights for AI-driven decisions in employment, credit, and healthcare are tractable near-term policy goals. These can be advanced through employer advocacy, political engagement, and supporting relevant NGOs.</p>
      </div>
      <div class="action-card year3">
        <span class="action-tag">Distribute</span>
        <h4>Support access programs for underserved communities</h4>
        <p>The AI access gap is compounding existing inequalities. Organizations providing AI literacy, hardware access, and AI-powered services to historically underserved communities are doing some of the most important equity work of this period.</p>
      </div>
      <div class="action-card year3">
        <span class="action-tag">Distribute</span>
        <h4>Advocate for AI dividend policies</h4>
        <p>The economic case for some form of distribution of AI productivity gains — whether as UBI, negative income tax, automation tax, or reduced working hours — is becoming mainstream. Political advocacy for these policies is not utopian; it is preparation for economic disruption that is already underway.</p>
      </div>
    </div>
  </div>

</section>

<!-- PROBABILITY SUMMARY -->
<section id="probabilities">
  <div class="section-label">07 — Summary</div>
  <h2 class="reveal">Probability distribution</h2>
  <p class="reveal">These are illustrative ranges reflecting genuine uncertainty, not precise predictions. The probability distribution is not fixed — it is being shaped by choices made now.</p>

  <div class="prob-bars reveal" id="prob-bars">
    <div class="prob-row">
      <div class="prob-name">Muddling Through</div>
      <div class="prob-bar-track"><div class="prob-bar-fill" style="background: var(--green)" data-width="30"></div></div>
      <div class="prob-pct" style="color:var(--green)">30%</div>
    </div>
    <div class="prob-row">
      <div class="prob-name">Enshittification</div>
      <div class="prob-bar-track"><div class="prob-bar-fill" style="background: var(--rust)" data-width="20"></div></div>
      <div class="prob-pct" style="color:var(--rust)">20%</div>
    </div>
    <div class="prob-row">
      <div class="prob-name">Cooperative Singularity</div>
      <div class="prob-bar-track"><div class="prob-bar-fill" style="background: var(--slate)" data-width="15"></div></div>
      <div class="prob-pct" style="color:var(--slate)">15%</div>
    </div>
    <div class="prob-row">
      <div class="prob-name">Constant Strife</div>
      <div class="prob-bar-track"><div class="prob-bar-fill" style="background: #b87a1a" data-width="15"></div></div>
      <div class="prob-pct" style="color:#b87a1a">15%</div>
    </div>
    <div class="prob-row">
      <div class="prob-name">Great Stagnation</div>
      <div class="prob-bar-track"><div class="prob-bar-fill" style="background: var(--fog)" data-width="12"></div></div>
      <div class="prob-pct" style="color:var(--fog)">12%</div>
    </div>
    <div class="prob-row">
      <div class="prob-name">Misalignment</div>
      <div class="prob-bar-track"><div class="prob-bar-fill" style="background: var(--red)" data-width="7"></div></div>
      <div class="prob-pct" style="color:var(--red)">5–8%</div>
    </div>
    <div class="prob-row">
      <div class="prob-name">Balkanization (overlay)</div>
      <div class="prob-bar-track"><div class="prob-bar-fill" style="background: #4a9eff" data-width="40"></div></div>
      <div class="prob-pct" style="color:#4a9eff">~40%</div>
    </div>
  </div>

  <div class="callout reveal" style="margin-top:2rem">
    <strong>The most important insight:</strong> These scenarios are not equally reachable from where we stand. The "Muddling Through" scenario (most likely) can slide into "Enshittification" or "Constant Strife" without decisive choices about governance, access, and alignment. The "Cooperative Singularity" requires active effort to achieve — it does not happen by default. The probability distribution is an argument for action, not fatalism.
  </div>

  <hr class="divider reveal">
  <div class="section-label reveal">Sources</div>
  <ol class="sources-list reveal">
    <li>Stanford HAI — <em>2025 AI Index Report</em></li>
    <li>METR — AI task horizon evaluation report</li>
    <li>Metaculus — AGI forecasting aggregation, Feb 2026</li>
    <li>80,000 Hours — "Shrinking AGI Timelines," Feb 2026</li>
    <li>AI 2027 project — ai-2027.com</li>
    <li>Gartner — LLM inference cost projections, Mar 2026</li>
    <li>Epoch AI — "Inference Cost Burden," Feb 2026</li>
    <li>CloudZero — State of AI Costs 2025</li>
    <li>WEF — Global Risks Report 2025</li>
    <li>Wellington Management — Geopolitics 2025</li>
    <li>MDPI — "Brace for Impact" scenario modeling</li>
    <li>Arms Control Association — Autonomous Weapons, Jan 2025</li>
    <li>Frontiers in AI — AI-Driven Disinformation, Jul 2025</li>
    <li>Wikipedia / Doctorow — Enshittification</li>
    <li>Boing Boing — AI enshittification timeline, Dec 2025</li>
    <li>Springer — AI Arms Race and Global Order, Jul 2025</li>
    <li>OpenSSF — Open Source Security Predictions 2025</li>
    <li>OpenNHP — "Dark Forest" internet analysis, Feb 2026</li>
    <li>Big Think / Sysdig — Dark AI cybercrime, Oct 2025</li>
    <li>Experian — 2026 Data Breach Forecast, Dec 2025</li>
    <li>Darktrace — 2026 Cybersecurity Trends</li>
    <li>AISI (UK) — Inference scaling in cyber tasks, Mar 2026</li>
    <li>allwork.space — UBI and AI displacement, Feb 2026</li>
    <li>The Hill — AI case for UBI, Jan 2026</li>
    <li>Falk & Tsoukalas — "The AI Layoff Trap," Mar 2026</li>
    <li>Tandf — Arms Race or Innovation Race, 2025</li>
    <li>Northwestern — Geopolitical Stakes of AI, Feb 2025</li>
    <li>Dario Amodei — "Machines of Loving Grace"</li>
  </ol>
</section>

<!-- FOOTER -->
<footer>
  <p>FUTURES WITH AI</p>
  <p>Evidence-based analysis · April 2026</p>
  <p style="margin-top:1rem">The trajectory is not fixed. It is being written now.</p>
</footer>
