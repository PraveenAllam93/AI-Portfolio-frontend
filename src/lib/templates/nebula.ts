/**
 * Template: Nebula
 * Cyberpunk / dark-space aesthetic. Deep black canvas with neon purple (#a855f7)
 * and cyan (#22d3ee) dual accents. Auto-numbered sections, animated grid background,
 * glassmorphism cards.
 *
 * NOTE: Values in NormalizedData are already HTML-escaped by normalize().
 * Do NOT apply _e() again — that would cause double-escaping.
 */

import { type NormalizedData, DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const _CSS = `
/* ============================================================
   Nebula — Cyberpunk dark-space portfolio theme
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

/* ---- Reset & tokens ---- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #07070f;
  --surface:  #0e0e1a;
  --card:     #13131f;
  --border:   rgba(168,85,247,.18);
  --purple:   #a855f7;
  --cyan:     #22d3ee;
  --text:     #e2e8f0;
  --muted:    #94a3b8;
  --radius:   12px;
  --font-h:   'Space Grotesk', sans-serif;
  --font-b:   'Inter', sans-serif;
}

html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-b);
  font-size: 16px;
  line-height: 1.65;
  overflow-x: hidden;
  position: relative;
}

/* ---- Animated grid background ---- */
.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(168,85,247,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168,85,247,.06) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: grid-drift 20s linear infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes grid-drift {
  0%   { background-position: 0 0; }
  100% { background-position: 48px 48px; }
}

/* ---- Drifting orbs ---- */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
  animation: orb-float 18s ease-in-out infinite alternate;
}
.orb1 {
  width: 500px; height: 500px;
  background: rgba(168,85,247,.18);
  top: -120px; left: -120px;
}
.orb2 {
  width: 400px; height: 400px;
  background: rgba(34,211,238,.14);
  bottom: -100px; right: -100px;
  animation-delay: -9s;
}
@keyframes orb-float {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(40px,40px) scale(1.08); }
}

/* ---- Hero ---- */
.hero {
  position: relative;
  z-index: 1;
  padding: 100px 5vw 80px;
  text-align: center;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}
.hero-inner { position: relative; z-index: 2; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-h);
  font-size: .75rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 20px;
}
.eyebrow-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--cyan);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: .4; transform: scale(.7); }
}

.hero-name {
  font-family: var(--font-h);
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: 700;
  letter-spacing: -.02em;
  line-height: 1.05;
  background: linear-gradient(135deg, var(--purple) 0%, var(--cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.hero-title {
  font-family: var(--font-h);
  font-size: 1.15rem;
  color: var(--muted);
  font-weight: 400;
  margin-bottom: 24px;
}

.hero-links { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.hero-link {
  display: inline-block;
  padding: 7px 18px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--cyan);
  text-decoration: none;
  font-size: .85rem;
  font-family: var(--font-h);
  font-weight: 500;
  transition: border-color .2s, background .2s;
  background: rgba(34,211,238,.05);
}
.hero-link:hover { border-color: var(--cyan); background: rgba(34,211,238,.12); }

/* Shimmer line across bottom of hero */
.hero-shimmer {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--purple), var(--cyan), transparent);
  background-size: 200% 100%;
  animation: shimmer-slide 3s linear infinite;
}
@keyframes shimmer-slide {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ---- Layout ---- */
.container {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  padding: 60px 24px 100px;
}

/* ---- Sections ---- */
section {
  margin-bottom: 60px;
}
section h2 {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-h);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--muted);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.snum {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 20px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--purple), var(--cyan));
  color: #07070f;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .04em;
  flex-shrink: 0;
}

/* ---- Card ---- */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  transition: border-color .25s, transform .2s;
}
.card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--purple), var(--cyan));
  opacity: 0;
  transition: opacity .25s;
}
.card:hover { border-color: rgba(168,85,247,.4); transform: translateX(3px); }
.card:hover::before { opacity: 1; }

.card-title {
  font-family: var(--font-h);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}
.card-sub, .card-grade {
  font-size: .85rem;
  color: var(--muted);
  margin-bottom: 4px;
}
.card-body {
  font-size: .9rem;
  color: var(--muted);
  margin-top: 8px;
}
.card-list {
  margin: 8px 0 0 16px;
  font-size: .88rem;
  color: var(--muted);
}
.card-list li { margin-bottom: 4px; }

/* ---- About ---- */
.about-text { font-size: 1rem; color: var(--text); margin-bottom: 10px; }
.tagline    { font-size: .95rem; color: var(--cyan); font-style: italic; margin-bottom: 10px; }
.about-meta { font-size: .85rem; color: var(--muted); }

/* ---- Skills ---- */
.skill-grid  { display: flex; flex-direction: column; gap: 14px; }
.skill-group { display: flex; flex-direction: column; gap: 8px; }
.skill-label {
  font-family: var(--font-h);
  font-size: .75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--purple);
}
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(168,85,247,.1);
  border: 1px solid rgba(168,85,247,.25);
  color: var(--text);
  font-size: .8rem;
  font-family: var(--font-h);
  transition: background .2s, border-color .2s;
}
.tag:hover { background: rgba(168,85,247,.22); border-color: var(--purple); }

/* ---- Experience ---- */
.exp-list   { display: flex; flex-direction: column; gap: 0; }
.exp-card   { margin-bottom: 14px; }
.exp-header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; margin-bottom: 4px; }
.exp-role   { font-family: var(--font-h); font-size: 1rem; font-weight: 600; color: var(--text); }
.exp-company { font-size: .9rem; color: var(--cyan); }
.exp-meta   { font-size: .82rem; color: var(--muted); margin-bottom: 6px; }
.exp-desc   { font-size: .9rem; color: var(--muted); margin-bottom: 6px; }

/* ---- Education ---- */
.edu-list { display: flex; flex-direction: column; gap: 0; }

/* ---- Projects ---- */
.project-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 14px; }
.proj-card    { margin-bottom: 0; }
.proj-header  { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px; }
.proj-links   { display: flex; gap: 8px; flex-shrink: 0; }
.proj-link {
  font-size: .75rem;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--cyan);
  text-decoration: none;
  font-family: var(--font-h);
  transition: border-color .2s;
}
.proj-link:hover { border-color: var(--cyan); }

/* ---- Certs / Awards ---- */
.cert-list, .award-list { display: flex; flex-direction: column; gap: 10px; }
.cert-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 18px;
}
.cert-name, .cert-link {
  font-family: var(--font-h);
  font-size: .95rem;
  font-weight: 500;
  color: var(--text);
}
.cert-link { color: var(--cyan); text-decoration: none; }
.cert-link:hover { text-decoration: underline; }
.cert-meta { font-size: .82rem; color: var(--muted); }
.yr { font-size: .8rem; color: var(--muted); }

/* ---- Achievements ---- */
.ach-list { display: flex; flex-direction: column; gap: 0; }

/* ---- Philosophy ---- */
.philosophy-card p { font-size: .95rem; color: var(--muted); font-style: italic; line-height: 1.75; }

/* ---- Software Proficiency ---- */
.sw-row { gap: 10px; }

/* ---- Campaigns ---- */
.camp-list { display: flex; flex-direction: column; gap: 0; }

/* ---- Financial Modeling ---- */
.fm-list { display: flex; flex-direction: column; gap: 0; }

/* ---- Investment Portfolios ---- */
.ip-list  { display: flex; flex-direction: column; gap: 0; }
.ip-stats { display: flex; gap: 24px; margin-top: 10px; flex-wrap: wrap; }
.ip-stats span { display: flex; flex-direction: column; }
.ip-stats label { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 2px; }

/* ---- Footer ---- */
.footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 32px;
  font-size: .78rem;
  color: var(--muted);
  border-top: 1px solid var(--border);
}

/* ---- Responsive ---- */
@media (max-width: 600px) {
  .hero { padding: 72px 20px 60px; }
  .container { padding: 40px 16px 60px; }
  .project-grid { grid-template-columns: 1fr; }
  .cert-row { flex-direction: column; align-items: flex-start; }
}
`;

// ---------------------------------------------------------------------------
// Section helper — auto-numbered
// ---------------------------------------------------------------------------

function _section(title: string, content: string, counter: { n: number }): string {
  if (!content) return '';
  counter.n += 1;
  const num = String(counter.n).padStart(2, '0');
  return `<section><h2><span class="snum">${num}</span> ${title}</h2>${content}</section>`;
}

// ---------------------------------------------------------------------------
// Content renderers
// NOTE: All values already escaped by normalize() — do NOT re-escape.
// ---------------------------------------------------------------------------

function _about(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const parts: string[] = [];
  if (v.bio)      parts.push(`<p class="about-text" ${ed('portfolio.bio', true)}>${v.bio}</p>`);
  if (v.headline) parts.push(`<p class="tagline">${v.headline}</p>`);
  const meta = [v.location, v.email, v.phone].filter(Boolean).join(' &bull; ');
  if (meta) parts.push(`<p class="about-meta">${meta}</p>`);
  return parts.join('');
}

function _skills(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const led = (p: string) => em ? _listEditable(p) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const groups = v.skill_groups || [];
  if (!groups.length && !em) return '';
  let out = '<div class="skill-grid">';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const skills = g.skills || [];
    if (!skills.length && !g.category) continue;
    const tags = skills.map((t: string) => `<span class="tag">${t}</span>`).join('');
    out += `<div class="skill-group"${iw}>` +
      delBtn('skills', i) +
      (g.category ? `<span class="skill-label" ${ed(`skills.${i}.category`)}>${g.category}</span>` : '') +
      (tags ? `<div class="tag-row" ${led(`skills.${i}.skills`)}>${tags}</div>` : '') +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('skills', 'Skill Group');
  return out;
}

function _experience(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const led = (p: string) => em ? _listEditable(p) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.experience || [];
  if (!items.length && !em) return '';
  let out = '<div class="exp-list">';
  for (let i = 0; i < items.length; i++) {
    const exp = items[i];
    const metaParts = [exp.location, exp.duration].filter(Boolean);
    const meta = metaParts.join(' &bull; ');
    const pts = exp.key_points || [];
    const ptsHtml = pts.length
      ? `<ul class="card-list" ${led(`experience.${i}.key_points`)}>${pts.map((p: string) => `<li>${p}</li>`).join('')}</ul>`
      : '';
    out += `<div class="card exp-card"${iw}>` +
      delBtn('experience', i) +
      `<div class="exp-header">` +
      `<span class="exp-role" ${ed(`experience.${i}.role`)}>${exp.role || ''}</span>` +
      `<span class="exp-company" ${ed(`experience.${i}.company`)}>${exp.company || ''}</span>` +
      `</div>` +
      (meta ? `<p class="exp-meta">${meta}</p>` : '') +
      (exp.description ? `<p class="exp-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : '') +
      ptsHtml +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('experience', 'Experience');
  return out;
}

function _education(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.education || [];
  if (!items.length && !em) return '';
  let out = '<div class="edu-list">';
  for (let i = 0; i < items.length; i++) {
    const edu = items[i];
    const degree = edu.degree || '';
    const field = edu.field_of_study || '';
    const inst = edu.institution || '';
    const loc = edu.location || '';
    const yr = edu.year_range || '';
    const grade = edu.grade_or_score || '';
    const titleParts = [degree, field].filter(Boolean);
    const title = titleParts.length ? titleParts.join(', ') : inst;
    const metaParts = [titleParts.length ? inst : '', loc, yr].filter(Boolean);
    const meta = metaParts.join(' &bull; ');
    out += `<div class="card"${iw}>` +
      delBtn('education', i) +
      `<div class="card-title" ${ed(`education.${i}.degree`)}>${title}</div>` +
      (meta ? `<div class="card-sub">${meta}</div>` : '') +
      (grade ? `<div class="card-grade">${grade}</div>` : '') +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('education', 'Education');
  return out;
}

function _projects(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const led = (p: string) => em ? _listEditable(p) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.projects || [];
  if (!items.length && !em) return '';
  let out = '<div class="project-grid">';
  for (let i = 0; i < items.length; i++) {
    const proj = items[i];
    const stack = proj.tech_stack || proj.software_used || [];
    const gh = proj.github_repo || '';
    const url = proj.project_url || '';
    const resp = proj.responsibilities || [];
    const outcomes = proj.measurable_outcomes || [];

    const tags = stack.map((t: string) => `<span class="tag">${t}</span>`).join('');
    const tagRow = tags ? `<div class="tag-row" ${led(`projects.${i}.tech_stack`)}>${tags}</div>` : '';

    let links = '';
    if (gh)  links += `<a class="proj-link" href="${gh}" target="_blank" rel="noopener">GitHub</a>`;
    if (url) links += `<a class="proj-link" href="${url}" target="_blank" rel="noopener">Live</a>`;

    const respHtml = resp.length ? `<ul class="card-list" ${led(`projects.${i}.responsibilities`)}>${resp.map((r: string) => `<li>${r}</li>`).join('')}</ul>` : '';
    const outHtml  = outcomes.length ? `<ul class="card-list" ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o: string) => `<li>${o}</li>`).join('')}</ul>` : '';

    out += `<div class="card proj-card"${iw}>` +
      delBtn('projects', i) +
      `<div class="proj-header">` +
      `<span class="card-title" ${ed(`projects.${i}.title`)}>${proj.title || ''}</span>` +
      (links ? `<div class="proj-links">${links}</div>` : '') +
      `</div>` +
      (proj.description ? `<p class="card-body" ${ed(`projects.${i}.description`, true)}>${proj.description}</p>` : '') +
      tagRow +
      respHtml +
      outHtml +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('projects', 'Project');
  return out;
}

function _certifications(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.certifications || [];
  if (!items.length && !em) return '';
  let out = '<div class="cert-list">';
  for (let i = 0; i < items.length; i++) {
    const cert = items[i];
    const meta = [cert.issuer, cert.year ? String(cert.year) : ''].filter(Boolean).join(' &bull; ');
    const certUrl = cert.url || '';
    const label = certUrl
      ? `<a class="cert-link" href="${certUrl}" target="_blank" rel="noopener">${cert.name || ''}</a>`
      : `<span class="cert-name" ${ed(`certifications.${i}.name`)}>${cert.name || ''}</span>`;
    out += `<div class="card cert-row"${iw}>` +
      delBtn('certifications', i) +
      label +
      (meta ? `<span class="cert-meta">${meta}</span>` : '') +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('certifications', 'Certification');
  return out;
}

function _achievements(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.achievements || [];
  if (!items.length && !em) return '';
  let out = '<div class="ach-list">';
  for (let i = 0; i < items.length; i++) {
    const ach = items[i];
    const year = ach.year ? String(ach.year) : '';
    out += `<div class="card"${iw}>` +
      delBtn('achievements', i) +
      `<div class="card-title"><span ${ed(`achievements.${i}.title`)}>${ach.title || ''}</span>${year ? `&nbsp;<span class="yr">${year}</span>` : ''}</div>` +
      (ach.description ? `<p class="card-body" ${ed(`achievements.${i}.description`, true)}>${ach.description}</p>` : '') +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('achievements', 'Achievement');
  return out;
}

function _awards(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.awards || [];
  if (!items.length && !em) return '';
  let out = '<div class="award-list">';
  for (let i = 0; i < items.length; i++) {
    const aw = items[i];
    const meta = [aw.awarding_body, aw.year ? String(aw.year) : ''].filter(Boolean).join(' &bull; ');
    const awUrl = aw.url || '';
    const label = awUrl
      ? `<a class="cert-link" href="${awUrl}" target="_blank" rel="noopener">${aw.title || ''}</a>`
      : `<span class="card-title" ${ed(`awards.${i}.title`)}>${aw.title || ''}</span>`;
    out += `<div class="card"${iw}>` +
      delBtn('awards', i) +
      label +
      (meta ? `<span class="cert-meta">${meta}</span>` : '') +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('awards', 'Award');
  return out;
}

function _design_philosophy(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const dp = v.design_philosophy || '';
  return dp ? `<div class="card philosophy-card"><p ${ed('design_philosophy', true)}>${dp}</p></div>` : '';
}

function _software_proficiency(v: NormalizedData): string {
  const items = v.software_proficiency || [];
  if (!items.length) return '';
  const tags = items.map((s: string) => `<span class="tag">${s}</span>`).join('');
  return `<div class="tag-row sw-row">${tags}</div>`;
}

function _campaigns(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const led = (p: string) => em ? _listEditable(p) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.campaigns || [];
  if (!items.length && !em) return '';
  let out = '<div class="camp-list">';
  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    const ctype = c.campaign_type || '';
    const budget = c.budget || '';
    const channels = c.channels_used || [];
    const metrics = c.performance_metrics || [];
    const chTags = channels.map((ch: string) => `<span class="tag">${ch}</span>`).join('');
    const mItems = metrics.map((m: string) => `<li>${m}</li>`).join('');
    out += `<div class="card"${iw}>` +
      delBtn('campaigns', i) +
      `<div class="card-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || ''}${ctype ? `&nbsp;<span class="cert-meta">${ctype}</span>` : ''}</div>` +
      (chTags ? `<div class="tag-row">${chTags}</div>` : '') +
      (budget ? `<p class="card-body">Budget: ${budget}</p>` : '') +
      (mItems ? `<ul class="card-list" ${led(`campaigns.${i}.performance_metrics`)}>${mItems}</ul>` : '') +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('campaigns', 'Campaign');
  return out;
}

function _financial_modeling(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const led = (p: string) => em ? _listEditable(p) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.financial_modeling || [];
  if (!items.length && !em) return '';
  let out = '<div class="fm-list">';
  for (let i = 0; i < items.length; i++) {
    const fm = items[i];
    const tools = fm.tools_used || [];
    const toolTags = tools.map((t: string) => `<span class="tag">${t}</span>`).join('');
    out += `<div class="card"${iw}>` +
      delBtn('financial_modeling', i) +
      `<div class="card-title" ${ed(`financial_modeling.${i}.model_type`)}>${fm.model_type || ''}</div>` +
      (toolTags ? `<div class="tag-row" ${led(`financial_modeling.${i}.tools_used`)}>${toolTags}</div>` : '') +
      (fm.outcome ? `<p class="card-body" ${ed(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : '') +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('financial_modeling', 'Model');
  return out;
}

function _investment_portfolios(v: NormalizedData): string {
  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  const items = v.investment_portfolios || [];
  if (!items.length && !em) return '';
  let out = '<div class="ip-list">';
  for (let i = 0; i < items.length; i++) {
    const ip = items[i];
    const aum = ip.assets_under_management || '';
    const ret = ip.performance_return || '';
    out += `<div class="card"${iw}>` +
      delBtn('investment_portfolios', i) +
      `<div class="card-title" ${ed(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type || ''}</div>` +
      `<div class="ip-stats">` +
      (aum ? `<span><label>AUM</label>${aum}</span>` : '') +
      (ret ? `<span><label>Return</label>${ret}</span>` : '') +
      `</div>` +
      `</div>`;
  }
  out += '</div>';
  out += addBtn('investment_portfolios', 'Portfolio');
  return out;
}

const _SECTION_RENDERERS: Record<string, [string, (v: NormalizedData) => string]> = {
  experience:            ['Experience',            _experience],
  projects:              ['Projects',              _projects],
  skills:                ['Skills',                _skills],
  education:             ['Education',             _education],
  certifications:        ['Certifications',        _certifications],
  achievements:          ['Achievements',          _achievements],
  awards:                ['Awards',                _awards],
  campaigns:             ['Campaigns',             _campaigns],
  financial_modeling:    ['Financial Modeling',    _financial_modeling],
  investment_portfolios: ['Investment Portfolios', _investment_portfolios],
  design_philosophy:     ['Design Philosophy',     _design_philosophy],
  software_proficiency:  ['Software Proficiency',  _software_proficiency],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function html(v: NormalizedData): string {
  const name = v.name || 'Portfolio';
  const title = v.headline || '';

  let liHtml = '';
  if (v.linkedin_url)  liHtml += `<a class="hero-link" href="${v.linkedin_url}" target="_blank" rel="noopener">LinkedIn</a>`;
  if (v.github_url)    liHtml += `<a class="hero-link" href="${v.github_url}" target="_blank" rel="noopener">GitHub</a>`;
  if (v.portfolio_url) liHtml += `<a class="hero-link" href="${v.portfolio_url}" target="_blank" rel="noopener">Portfolio</a>`;
  if (v.twitter_url)   liHtml += `<a class="hero-link" href="${v.twitter_url}" target="_blank" rel="noopener">Twitter</a>`;

  const em = v.edit_mode;
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const edScript = em ? EDITOR_SCRIPT : '';

  const order = v.section_order || DEFAULT_SECTION_ORDER;
  const hidden = new Set(v.hidden_sections || []);
  const counter = { n: 0 };

  const aboutSec = _section('About', _about(v), counter);
  const contentSections = order
    .flatMap(key => {
      if (hidden.has(key)) return [];
      if (key === 'custom_sections') {
        return (v.custom_sections ?? [])
          .filter(cs => cs.items?.length || em)
          .map((cs, csIdx) => {
            const itemsHtml = (cs.items ?? []).map((item, i) => {
              const del = em ? `<button class="ce-del-btn" data-del-section="custom_sections" data-del-index="${i}">&#x2715;</button>` : '';
              return `<div class="card" style="position:relative">${del}
${item.label ? `<p class="card-title">${item.label}</p>` : ''}
${item.subtitle ? `<p style="opacity:.65;font-size:.85rem;margin-top:4px">${item.subtitle}</p>` : ''}
${item.value ? `<p style="margin-top:8px;line-height:1.6">${item.value}</p>` : ''}
${item.tags?.length ? `<div class="tag-row" style="margin-top:10px">${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" style="font-size:.82rem;margin-top:8px;display:inline-block;color:var(--cyan)" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`;
            }).join('\n');
            const add = em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : '';
            const inner = cs.display_type === 'cards'
              ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">${itemsHtml}</div>${add}`
              : `<div style="display:flex;flex-direction:column;gap:.75rem">${itemsHtml}</div>${add}`;
            return _section(cs.title, inner, counter);
          });
      }
      if (key in _SECTION_RENDERERS) {
        const [label, renderer] = _SECTION_RENDERERS[key];
        return [_section(label, renderer(v), counter)];
      }
      return [];
    })
    .filter(Boolean)
    .join('\n');

  const sections = [aboutSec, contentSections].filter(Boolean).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${name} — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>${_CSS}</style>
</head>
<body>
  <!-- Animated background -->
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="orb orb1" aria-hidden="true"></div>
  <div class="orb orb2" aria-hidden="true"></div>

  <header class="hero">
    <div class="hero-inner">
      <p class="eyebrow"><span class="eyebrow-dot"></span>Portfolio</p>
      <h1 class="hero-name" ${ed('profile.full_name')}>${name}</h1>
      ${title ? `<p class="hero-title" ${ed('profile.headline')}>${title}</p>` : ''}
      ${v.location || v.phone ? `<p class="hero-title" style="font-size:.9rem;margin-top:-16px;margin-bottom:24px"><span ${ed('profile.location')}>${v.location || ''}</span>${v.phone ? ` &bull; <span ${ed('profile.phone')}>${v.phone}</span>` : ''}</p>` : ''}
      ${liHtml ? `<div class="hero-links">${liHtml}</div>` : ''}
    </div>
    <div class="hero-shimmer" aria-hidden="true"></div>
  </header>

  <main class="container">
    ${sections}
  </main>

  <footer class="footer">
    <span>Built with AI &bull; Nebula Theme</span>
  </footer>
${edScript}
</body>
</html>`;
}
