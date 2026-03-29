/**
 * Template: Luxury
 * Ultra-premium editorial aesthetic. Deep midnight navy canvas with gold (#c9a84c) accents.
 * Typography: Cormorant Garamond (headings), Raleway (body).
 */

import { type NormalizedData, DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const _FONTS =
  'https://fonts.googleapis.com/css2' +
  '?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600' +
  '&family=Raleway:wght@300;400;500&display=swap';

const _CSS = `
/* ── Luxury Template ─────────────────────────────────────────── */

:root {
    --gold:      #c9a84c;
    --gold-lt:   #f0d080;
    --gold-dk:   #8b6914;
    --gold-dim:  rgba(201,168,76,0.12);
    --gold-glow: rgba(201,168,76,0.35);
    --bg:        #060c18;
    --bg-card:   rgba(255,255,255,0.03);
    --bg-card-h: rgba(201,168,76,0.05);
    --border:    rgba(201,168,76,0.18);
    --border-h:  rgba(201,168,76,0.45);
    --text:      #f0e8d8;
    --muted:     rgba(220,210,190,0.6);
    --dot:       rgba(201,168,76,0.06);
}

*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }

body {
    font-family: 'Raleway', -apple-system, sans-serif;
    background: var(--bg); color: var(--text);
    line-height: 1.7; overflow-x: hidden; min-height: 100vh;
}
.dot-grid {
    position: fixed; inset: 0;
    background-image: radial-gradient(var(--dot) 1px, transparent 1px);
    background-size: 28px 28px; pointer-events: none; z-index: 0;
}
.container { max-width: 820px; margin: 0 auto; padding: 0 1.75rem; position: relative; z-index: 1; }

/* ── Hero ─────────────────────────────────────────────────── */
.hero { padding: 7rem 0 5.5rem; text-align: center; position: relative; z-index: 1; border-bottom: 1px solid var(--border); }
.hero-inner { animation: fade-up 1s ease-out both; }
.hero-greeting {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.4rem,4vw,2rem); font-weight: 300; font-style: italic;
    color: var(--gold); letter-spacing: 0.08em; margin-bottom: 0.3rem;
}
.hero-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(3.2rem,9vw,6rem); font-weight: 600; letter-spacing: -0.01em; line-height: 1.0;
    background: linear-gradient(90deg,var(--gold-dk) 0%,var(--gold) 25%,var(--gold-lt) 45%,var(--gold) 55%,var(--gold-dk) 80%,var(--gold) 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: gold-sweep 6s linear infinite; margin-bottom: 1.1rem;
}
@keyframes gold-sweep { 0%{background-position:200% center} 100%{background-position:-200% center} }
.hero-headline {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.1rem,3vw,1.4rem); font-style: italic; font-weight: 400;
    color: rgba(240,232,216,0.75); margin-bottom: 0.4rem;
}
.hero-rule {
    width: 80px; height: 1px; background: var(--gold); margin: 1.5rem auto; opacity: 0.55;
    position: relative; animation: rule-expand 1.2s 0.4s ease-out both;
}
.hero-rule::before,.hero-rule::after {
    content:''; position:absolute; top:50%; transform:translateY(-50%);
    width:4px; height:4px; border-radius:50%; background:var(--gold);
}
.hero-rule::before{left:-8px} .hero-rule::after{right:-8px}
@keyframes rule-expand { from{width:0;opacity:0} to{width:80px;opacity:0.55} }
.hero-location { font-size:0.85rem; color:rgba(201,168,76,0.6); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:2.25rem; }
.hero-links { display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap; }
.hero-links a {
    text-decoration:none; font-family:'Raleway',sans-serif;
    font-size:0.78rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase;
    padding:0.6rem 1.6rem; border-radius:2px; border:1px solid var(--border); color:var(--gold);
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.hero-links a:hover { border-color:var(--gold); background:var(--gold-dim); box-shadow:0 0 20px var(--gold-glow); transform:translateY(-1px); }
@keyframes fade-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

/* ── Sections ─────────────────────────────────────────────── */
main { padding: 5rem 0; }
section { margin-bottom: 4.5rem; animation: fade-up 0.7s ease-out both; }
h2 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.6rem; font-weight: 400; color: var(--text); letter-spacing: 0.06em;
    margin-bottom: 2rem; display: inline-block; position: relative;
}
h2::after {
    content:''; display:block; position:absolute; bottom:-6px; left:0;
    width:100%; height:1px; background:linear-gradient(90deg,var(--gold),transparent);
    transform-origin:left center; animation:underline-in 0.8s ease-out both;
}
@keyframes underline-in { from{transform:scaleX(0)} to{transform:scaleX(1)} }

.bio { font-size:1.05rem; font-weight:300; color:rgba(240,232,216,0.72); line-height:1.95; max-width:680px; }

/* Skills */
.skill-group { margin-bottom: 1rem; }
.skill-group-label { font-family:'Raleway',sans-serif; font-size:0.72rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:rgba(201,168,76,0.75); margin-bottom:0.4rem; }
.tag-row { display:flex; flex-wrap:wrap; gap:0.5rem; }
.skill-tag {
    font-family:'Raleway',sans-serif; font-size:0.75rem; font-weight:500;
    letter-spacing:0.1em; text-transform:uppercase; padding:0.32rem 0.9rem; border-radius:2px;
    border:1px solid var(--border); color:rgba(201,168,76,0.75); background:transparent;
    transition: border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s;
}
.skill-tag:hover { border-color:var(--gold); color:var(--gold); background:var(--gold-dim); box-shadow:0 0 12px var(--gold-glow); }

/* Timeline */
.timeline { position:relative; padding-left:2.25rem; }
.timeline::before { content:''; position:absolute; left:0.4rem; top:0.6rem; bottom:0.6rem; width:1px; background:linear-gradient(180deg,var(--gold),transparent); }
.t-item { position:relative; margin-bottom:2.25rem; }
.t-item::before { content:''; position:absolute; left:-1.9rem; top:0.5rem; width:9px; height:9px; border-radius:50%; background:var(--gold); box-shadow:0 0 0 3px var(--bg),0 0 0 5px rgba(201,168,76,0.2); transition:box-shadow 0.2s; }
.t-item:hover::before { box-shadow:0 0 0 3px var(--bg),0 0 0 7px rgba(201,168,76,0.35),0 0 12px var(--gold-glow); }
.t-item-inner { background:var(--bg-card); border:1px solid var(--border); border-radius:4px; padding:1.4rem 1.5rem; transition:border-color 0.22s,background 0.22s,transform 0.18s; }
.t-item-inner:hover { border-color:var(--border-h); background:var(--bg-card-h); transform:translateX(4px); }
.t-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.1rem; font-weight:600; color:var(--text); margin-bottom:0.1rem; }
.t-company { font-size:0.85rem; color:var(--gold); letter-spacing:0.04em; margin-bottom:0.25rem; }
.t-duration { font-size:0.75rem; letter-spacing:0.08em; color:rgba(201,168,76,0.5); text-transform:uppercase; margin-bottom:0.75rem; }
.t-desc { font-size:0.92rem; color:var(--muted); line-height:1.75; }
.t-list { margin-top:0.6rem; padding-left:0; list-style:none; }
.t-list li { font-size:0.88rem; color:var(--muted); margin-bottom:0.3rem; padding-left:1rem; position:relative; }
.t-list li::before { content:'◆'; position:absolute; left:0; color:var(--gold); font-size:0.45rem; top:0.3em; }

/* Education */
.edu-card { background:var(--bg-card); border:1px solid var(--border); border-radius:4px; padding:1.25rem 1.5rem; margin-bottom:1rem; transition:border-color 0.22s,background 0.22s; }
.edu-card:hover { border-color:var(--border-h); background:var(--bg-card-h); }
.edu-degree { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.05rem; font-weight:600; color:var(--text); margin-bottom:0.25rem; }
.edu-meta { font-size:0.8rem; letter-spacing:0.05em; color:rgba(201,168,76,0.6); }
.edu-grade { font-size:0.8rem; color:var(--muted); margin-top:0.2rem; }

/* Lux cards */
.lux-card { background:var(--bg-card); border:1px solid var(--border); border-radius:4px; padding:1.25rem 1.5rem; margin-bottom:1rem; transition:border-color 0.22s,background 0.22s,transform 0.18s; }
.lux-card:hover { border-color:var(--border-h); background:var(--bg-card-h); transform:translateX(3px); }
.lux-card h3 { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.1rem; font-weight:600; color:var(--text); margin-bottom:0.2rem; }
.lux-meta { font-size:0.78rem; letter-spacing:0.06em; color:rgba(201,168,76,0.6); text-transform:uppercase; margin-bottom:0.5rem; }
.lux-body { font-size:0.92rem; color:var(--muted); line-height:1.75; }
.lux-list { margin-top:0.5rem; padding-left:0; list-style:none; }
.lux-list li { font-size:0.88rem; color:var(--muted); margin-bottom:0.3rem; padding-left:1rem; position:relative; }
.lux-list li::before { content:'◆'; position:absolute; left:0; color:var(--gold); font-size:0.45rem; top:0.3em; }

.cert-row { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.25rem; padding:0.75rem 1.25rem; margin-bottom:0.5rem; background:var(--bg-card); border:1px solid var(--border); border-radius:4px; }
.cert-name { font-size:0.95rem; color:var(--text); }
.cert-meta { font-size:0.78rem; letter-spacing:0.06em; color:rgba(201,168,76,0.6); }

.tech-tag { font-size:0.72rem; padding:0.2rem 0.5rem; border-radius:2px; background:var(--gold-dim); color:var(--gold); border:1px solid rgba(201,168,76,0.2); letter-spacing:0.06em; }
.philosophy { font-size:1.05rem; font-weight:300; color:rgba(240,232,216,0.72); line-height:1.95; font-style:italic; }
.ip-stats { display:flex; gap:1.5rem; flex-wrap:wrap; margin-top:0.4rem; }
.ip-stat { font-size:0.85rem; color:var(--muted); }
.ip-stat strong { color:var(--gold); }

footer { padding:4rem 0; text-align:center; position:relative; z-index:1; }
.footer-rule { width:120px; height:1px; background:var(--gold); margin:0 auto 1.5rem; opacity:0.35; }
.footer-sig { font-family:'Cormorant Garamond',Georgia,serif; font-size:1.2rem; font-style:italic; font-weight:300; color:rgba(201,168,76,0.6); margin-bottom:0.4rem; }
.footer-text { font-size:0.75rem; letter-spacing:0.1em; color:var(--muted); opacity:0.5; }

@media (max-width:640px) {
    .hero { padding: 4rem 0 3.5rem; }
    .hero-name { font-size: 3rem; }
    .timeline { padding-left: 1.5rem; }
    .timeline::before { left: 0.3rem; }
    .t-item::before { left: -1.25rem; }
}
`;

// ---------------------------------------------------------------------------
// Section helper
// ---------------------------------------------------------------------------

function _section(title: string, content: string): string {
  if (!content) return '';
  return `<section><h2>${title}</h2>${content}</section>`;
}

// ---------------------------------------------------------------------------
// Content renderers
// ---------------------------------------------------------------------------

function _about(v: NormalizedData): string {
  const bio = v.bio || '';
  return bio ? `<p class="bio" ${_editable('portfolio.bio', true)}>${bio}</p>` : '';
}

function _skills(v: NormalizedData): string {
  const groups = v.skill_groups || [];
  let out = '';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const tags = (g.skills || []).map((s: string) => `<span class="skill-tag">${s}</span>`).join('');
    if (g.category || tags) {
      out += `<div class="skill-group" data-item-wrap>` +
        `<button class="ce-del-btn" data-del-section="skills" data-del-index="${i}">×</button>` +
        (g.category ? `<p class="skill-group-label" ${_editable(`skills.${i}.category`)}>${g.category}</p>` : '') +
        (tags ? `<div class="tag-row" ${_listEditable(`skills.${i}.skills`)}>${tags}</div>` : '') +
        `</div>`;
    }
  }
  if (!out) return '';
  return out + `<button class="ce-add-btn" data-add-section="skills">+ Add Skill Group</button>`;
}

function _experience(v: NormalizedData): string {
  const items = v.experience || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const exp = items[i];
    const metaParts: string[] = [];
    if (exp.duration) metaParts.push(exp.duration);
    if (exp.location) metaParts.push(exp.location);
    const meta = metaParts.join(' · ');
    const points = (exp.key_points || []).map((p: string) => `<li>${p}</li>`).join('');
    const desc = exp.description || '';
    out += `<div class="t-item" data-item-wrap><div class="t-item-inner">` +
      `<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">×</button>` +
      `<p class="t-title" ${_editable(`experience.${i}.role`)}>${exp.role || ''}</p>` +
      `<p class="t-company" ${_editable(`experience.${i}.company`)}>${exp.company || ''}</p>` +
      `<p class="t-duration">${meta}</p>` +
      (desc ? `<p class="t-desc" ${_editable(`experience.${i}.description`, true)}>${desc}</p>` : '') +
      (points ? `<ul class="t-list" ${_listEditable(`experience.${i}.key_points`)}>${points}</ul>` : '') +
      `</div></div>`;
  }
  return `<div class="timeline">${out}</div><button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>`;
}

function _education(v: NormalizedData): string {
  const items = v.education || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const edu = items[i];
    let degree = edu.degree || '';
    if (edu.field_of_study) degree = `${degree} in ${edu.field_of_study}`;
    const metaParts: string[] = [];
    if (edu.institution) metaParts.push(edu.institution);
    if (edu.year_range) metaParts.push(edu.year_range);
    const meta = metaParts.join(' · ');
    const grade = edu.grade_or_score || '';
    out += `<div class="edu-card" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">×</button>` +
      `<p class="edu-degree" ${_editable(`education.${i}.degree`)}>${degree}</p>` +
      `<p class="edu-meta">${meta}</p>` +
      (grade ? `<p class="edu-grade">${grade}</p>` : '') +
      `</div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="education">+ Add Education</button>`;
}

function _projects(v: NormalizedData): string {
  const items = v.projects || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const url = p.project_url || p.github_repo || '';
    const linkHtml = url
      ? ` <a href="${url}" target="_blank" rel="noopener noreferrer" style="font-size:0.72rem;color:var(--gold);text-decoration:none;border:1px solid rgba(201,168,76,0.3);padding:0.15rem 0.5rem;border-radius:2px;letter-spacing:0.08em;">Link</a>`
      : '';
    const tags = (p.tech_stack || p.software_used || []).map((t: string) => `<span class="tech-tag">${t}</span>`).join('');
    const respLis = (p.responsibilities || []).map((r: string) => `<li>${r}</li>`).join('');
    const outcomeLis = (p.measurable_outcomes || []).map((o: string) => `<li>${o}</li>`).join('');
    out += `<div class="lux-card" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">×</button>` +
      `<h3 ${_editable(`projects.${i}.title`)}>${p.title || ''}${linkHtml}</h3>` +
      (p.description ? `<p class="lux-body" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : '') +
      (tags ? `<div class="tag-row" style="margin-top:0.5rem" ${_listEditable(`projects.${i}.tech_stack`)}>${tags}</div>` : '') +
      (respLis ? `<ul class="lux-list" ${_listEditable(`projects.${i}.responsibilities`)}>${respLis}</ul>` : '') +
      (outcomeLis ? `<ul class="lux-list" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${outcomeLis}</ul>` : '') +
      `</div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="projects">+ Add Project</button>`;
}

function _certifications(v: NormalizedData): string {
  const items = v.certifications || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    const metaParts: string[] = [];
    if (c.issuer) metaParts.push(c.issuer);
    if (c.year) metaParts.push(c.year);
    const meta = metaParts.join(' · ');
    out += `<div class="cert-row" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="certifications" data-del-index="${i}">×</button>` +
      `<span class="cert-name" ${_editable(`certifications.${i}.name`)}>${c.name || ''}</span>` +
      (meta ? `<span class="cert-meta">${meta}</span>` : '') +
      `</div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="certifications">+ Add Certification</button>`;
}

function _achievements(v: NormalizedData): string {
  const items = v.achievements || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    out += `<div class="lux-card" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">×</button>` +
      `<h3 ${_editable(`achievements.${i}.title`)}>${a.title || ''}</h3>` +
      (a.description ? `<p class="lux-body" ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : '') +
      `</div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>`;
}

function _awards(v: NormalizedData): string {
  const items = v.awards || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    const metaParts = [a.awarding_body, a.year].filter(Boolean);
    const meta = metaParts.join(' · ');
    out += `<div class="lux-card" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="awards" data-del-index="${i}">×</button>` +
      `<h3 ${_editable(`awards.${i}.title`)}>${a.title || ''}</h3>` +
      (meta ? `<p class="lux-meta">${meta}</p>` : '') +
      `</div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="awards">+ Add Award</button>`;
}

function _design_philosophy(v: NormalizedData): string {
  const text = v.design_philosophy || '';
  return text ? `<p class="philosophy" ${_editable('design_philosophy', true)}>${text}</p>` : '';
}

function _software_proficiency(v: NormalizedData): string {
  const items = v.software_proficiency || [];
  if (!items.length) return '';
  const tags = items.map((s: string) => `<span class="skill-tag">${s}</span>`).join('');
  return `<div class="tag-row">${tags}</div>`;
}

function _campaigns(v: NormalizedData): string {
  const items = v.campaigns || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    const ctype = c.campaign_type || '';
    const channels = (c.channels_used || []).join(', ');
    const budget = c.budget || '';
    const metaParts = [ctype, budget ? `Budget: ${budget}` : '', channels ? `Channels: ${channels}` : ''].filter(Boolean);
    const meta = metaParts.join(' · ');
    const metrics = (c.performance_metrics || []).map((m: string) => `<li>${m}</li>`).join('');
    out += `<div class="lux-card" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="campaigns" data-del-index="${i}">×</button>` +
      `<h3 ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name || ''}</h3>` +
      (meta ? `<p class="lux-meta">${meta}</p>` : '') +
      (metrics ? `<ul class="lux-list" ${_listEditable(`campaigns.${i}.performance_metrics`)}>${metrics}</ul>` : '') +
      `</div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="campaigns">+ Add Campaign</button>`;
}

function _financial_modeling(v: NormalizedData): string {
  const items = v.financial_modeling || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const fm = items[i];
    const tools = (fm.tools_used || []).map((t: string) => `<span class="tech-tag">${t}</span>`).join('');
    out += `<div class="lux-card" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">×</button>` +
      `<h3 ${_editable(`financial_modeling.${i}.model_type`)}>${fm.model_type || ''}</h3>` +
      (tools ? `<div class="tag-row" style="margin:0.4rem 0" ${_listEditable(`financial_modeling.${i}.tools_used`)}>${tools}</div>` : '') +
      (fm.outcome ? `<p class="lux-body" ${_editable(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : '') +
      `</div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="financial_modeling">+ Add Model</button>`;
}

function _investment_portfolios(v: NormalizedData): string {
  const items = v.investment_portfolios || [];
  if (!items.length) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const ip = items[i];
    const aum = ip.assets_under_management || '';
    const ret = ip.performance_return || '';
    out += `<div class="lux-card" data-item-wrap>` +
      `<button class="ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">×</button>` +
      `<h3 ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type || ''}</h3>` +
      `<div class="ip-stats">` +
      (aum ? `<span class="ip-stat"><strong>AUM:</strong> ${aum}</span>` : '') +
      (ret ? `<span class="ip-stat"><strong>Return:</strong> ${ret}</span>` : '') +
      `</div></div>`;
  }
  return out + `<button class="ce-add-btn" data-add-section="investment_portfolios">+ Add Portfolio</button>`;
}

const _SECTION_RENDERERS: Record<string, [string, (v: NormalizedData) => string]> = {
  experience:            ['Experience',            _experience],
  projects:              ['Projects',              _projects],
  skills:                ['Expertise',             _skills],
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
  let links = '';
  if (v.linkedin_url)  links += `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
  if (v.github_url)    links += `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
  if (v.portfolio_url) links += `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>`;
  if (v.email)         links += `<a href="mailto:${v.email}">Email</a>`;

  const locationHtml = v.location
    ? `<p class="hero-location"><span ${_editable('profile.location')}>${v.location}</span>${v.phone ? ` · <span ${_editable('profile.phone')}>${v.phone}</span>` : ''}</p>`
    : '';

  const order = v.section_order || DEFAULT_SECTION_ORDER;
  const hidden = new Set(v.hidden_sections || []);

  const aboutHtml = _section('About', _about(v));
  const contentSections = order
    .filter(key => !hidden.has(key) && key in _SECTION_RENDERERS)
    .map(key => {
      const [label, renderer] = _SECTION_RENDERERS[key];
      return _section(label, renderer(v));
    })
    .filter(Boolean)
    .join('\n');

  const sections = [aboutHtml, contentSections].filter(Boolean).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${v.name} - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${_FONTS}" rel="stylesheet">
    <style>${_CSS}</style>
</head>
<body>
    <div class="dot-grid" aria-hidden="true"></div>

    <header class="hero">
        <div class="container">
            <div class="hero-inner">
                <p class="hero-greeting">Hello, I am</p>
                <h1 class="hero-name" ${_editable('profile.full_name')}>${v.name}</h1>
                <p class="hero-headline" ${_editable('profile.headline')}>${v.headline || ''}</p>
                <div class="hero-rule" aria-hidden="true"></div>
                ${locationHtml}
                <div class="hero-links">${links}</div>
            </div>
        </div>
    </header>

    <main class="container">
        ${sections}
    </main>

    <footer>
        <div class="container">
            <div class="footer-rule" aria-hidden="true"></div>
            <p class="footer-sig">${v.name}</p>
            <p class="footer-text">Built with AI Portfolio Builder</p>
        </div>
    </footer>
${EDITOR_SCRIPT}
</body>
</html>`;
}
