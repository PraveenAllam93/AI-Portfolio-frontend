/**
 * Template: Quantum
 * Sci-fi holographic UI. Near-black (#030712) with prismatic iridescent accents
 * (cyan #06b6d4 → violet #8b5cf6 → pink #ec4899). JetBrains Mono labels,
 * glowing borders, animated gradient hero bar, dot-matrix background.
 * Feels like a dashboard from a near-future sci-fi film.
 *
 * NOTE: Values from NormalizedData are already HTML-escaped by normalize().
 */

import { type NormalizedData, DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const _CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:     #030712;
  --bg2:    #060d1f;
  --panel:  rgba(6,13,31,.8);
  --cyan:   #06b6d4;
  --violet: #8b5cf6;
  --pink:   #ec4899;
  --text:   #e2e8f0;
  --muted:  #64748b;
  --dim:    rgba(226,232,240,.08);
  --border: rgba(6,182,212,.15);
  --glow:   rgba(6,182,212,.25);
  --font-h: 'Inter', system-ui, sans-serif;
  --font-m: 'JetBrains Mono', 'Fira Code', monospace;
}

html{scroll-behavior:smooth}
body{
  background:var(--bg);color:var(--text);
  font-family:var(--font-h);font-size:16px;line-height:1.65;
  overflow-x:hidden;
}

/* ── Dot-matrix background ── */
body::before{
  content:'';position:fixed;inset:0;z-index:0;
  background-image:radial-gradient(rgba(6,182,212,.12) 1px, transparent 1px);
  background-size:28px 28px;pointer-events:none;
}

/* ── Scan-line overlay ── */
body::after{
  content:'';position:fixed;inset:0;z-index:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px);
  pointer-events:none;
}

/* ── Ambient orbs ── */
.q-orb{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0;animation:q-drift 20s ease-in-out infinite alternate}
.q-orb1{width:500px;height:500px;background:rgba(8,182,212,.12);top:-80px;left:-80px}
.q-orb2{width:400px;height:400px;background:rgba(139,92,246,.10);bottom:-60px;right:-60px;animation-delay:-10s}
.q-orb3{width:300px;height:300px;background:rgba(236,72,153,.07);top:40%;left:35%;animation-delay:-5s}
@keyframes q-drift{from{transform:translate(0,0)}to{transform:translate(30px,25px)}}

/* ── Hero ── */
.hero{
  position:relative;z-index:1;
  padding:100px 5vw 80px;
  border-bottom:1px solid var(--border);
  overflow:hidden;
}
/* Animated gradient top bar */
.hero-bar{
  position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--cyan),var(--violet),var(--pink),var(--cyan));
  background-size:200% 100%;
  animation:bar-slide 4s linear infinite;
}
@keyframes bar-slide{0%{background-position:0% 0}100%{background-position:200% 0}}

.hero-inner{max-width:920px;margin:0 auto;position:relative;z-index:1}
.hero-id{
  font-family:var(--font-m);font-size:.72rem;font-weight:500;
  letter-spacing:.12em;
  background:linear-gradient(90deg,var(--cyan),var(--violet));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  margin-bottom:20px;
  display:flex;align-items:center;gap:10px;
}
.hero-id::before{
  content:'';display:block;width:6px;height:6px;border-radius:50%;
  background:var(--cyan);
  -webkit-text-fill-color:initial;
  box-shadow:0 0 8px var(--cyan);
  animation:q-pulse 2s ease-in-out infinite;
}
@keyframes q-pulse{0%,100%{opacity:1;box-shadow:0 0 8px var(--cyan)}50%{opacity:.3;box-shadow:0 0 2px var(--cyan)}}

.hero-name{
  font-family:var(--font-h);
  font-size:clamp(2.8rem,7vw,5.5rem);
  font-weight:600;line-height:1.0;letter-spacing:-.025em;
  background:linear-gradient(135deg,var(--cyan) 0%,var(--violet) 50%,var(--pink) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  margin-bottom:16px;
}
.hero-title{
  font-family:var(--font-h);font-size:1.1rem;font-weight:300;
  color:var(--muted);margin-bottom:28px;
}
.hero-meta{font-family:var(--font-m);font-size:.78rem;color:var(--muted);margin-bottom:28px}
.hero-links{display:flex;flex-wrap:wrap;gap:12px}
.hero-link{
  display:inline-block;
  padding:8px 20px;
  border:1px solid var(--border);
  border-radius:6px;
  font-family:var(--font-m);font-size:.76rem;font-weight:500;
  color:var(--cyan);text-decoration:none;
  background:rgba(6,182,212,.04);
  transition:border-color .2s,background .2s,box-shadow .2s;
}
.hero-link:hover{
  border-color:var(--cyan);
  background:rgba(6,182,212,.1);
  box-shadow:0 0 12px var(--glow);
}

/* ── Layout ── */
.page{position:relative;z-index:1;max-width:880px;margin:0 auto;padding:60px 24px 120px}

/* ── Sections ── */
section{margin-bottom:60px}
.sec-head{display:flex;align-items:center;gap:14px;margin-bottom:28px}
.sec-label{
  font-family:var(--font-m);font-size:.68rem;font-weight:700;
  letter-spacing:.16em;text-transform:uppercase;
  background:linear-gradient(90deg,var(--cyan),var(--violet));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  flex-shrink:0;
}
.sec-line{
  flex:1;height:1px;
  background:linear-gradient(90deg,var(--border),transparent);
}

/* ── Cards (holographic panel) ── */
.card{
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:10px;
  padding:20px 24px;
  margin-bottom:12px;
  position:relative;overflow:hidden;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  transition:border-color .25s,box-shadow .25s;
}
.card::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
  background:linear-gradient(180deg,var(--cyan),var(--violet));
  opacity:0;transition:opacity .25s;
}
.card:hover{border-color:rgba(6,182,212,.35);box-shadow:0 0 20px rgba(6,182,212,.08)}
.card:hover::before{opacity:1}
.card-title{font-family:var(--font-h);font-size:1rem;font-weight:600;color:var(--text);margin-bottom:4px}
.card-sub{font-family:var(--font-m);font-size:.8rem;color:var(--cyan);margin-bottom:4px}
.card-meta{font-family:var(--font-m);font-size:.75rem;color:var(--muted);margin-bottom:8px}
.card-body{font-size:.9rem;color:var(--muted);line-height:1.75}
.card-list{margin:8px 0 0 18px;font-size:.88rem;color:var(--muted)}
.card-list li{margin-bottom:4px}

/* ── About ── */
.about-text{font-size:1rem;color:var(--text);margin-bottom:10px;line-height:1.8}
.about-headline{
  font-family:var(--font-h);font-size:1.15rem;font-weight:500;
  background:linear-gradient(90deg,var(--cyan),var(--violet));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  margin-bottom:12px;line-height:1.35;
}

/* ── Skills — data-viz style ── */
.skill-grid{display:flex;flex-direction:column;gap:16px}
.skill-group{display:flex;flex-direction:column;gap:6px}
.skill-label{
  font-family:var(--font-m);font-size:.65rem;font-weight:700;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--violet);margin-bottom:4px;
}
.tag-row{display:flex;flex-wrap:wrap;gap:8px}
.tag{
  display:inline-block;padding:4px 12px;
  border-radius:4px;
  border:1px solid rgba(6,182,212,.2);
  background:rgba(6,182,212,.04);
  font-family:var(--font-m);font-size:.76rem;color:var(--text);
  transition:border-color .2s,background .2s,color .2s,box-shadow .2s;
}
.tag:hover{
  border-color:var(--cyan);background:rgba(6,182,212,.1);
  color:var(--cyan);box-shadow:0 0 8px rgba(6,182,212,.2);
}

/* ── Projects ── */
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.proj-header{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px}
.proj-links{display:flex;gap:8px;flex-shrink:0}
.proj-link{
  font-family:var(--font-m);font-size:.7rem;
  padding:3px 10px;border-radius:4px;
  border:1px solid var(--border);
  color:var(--cyan);text-decoration:none;
  transition:border-color .2s,box-shadow .2s;
}
.proj-link:hover{border-color:var(--cyan);box-shadow:0 0 8px var(--glow)}

/* ── Certs ── */
.cert-list{display:flex;flex-direction:column;gap:8px}
.cert-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:14px 20px}
.cert-name,.cert-link{font-size:.95rem;font-weight:500;color:var(--text)}
.cert-link{color:var(--cyan);text-decoration:none}
.cert-link:hover{text-decoration:underline}
.cert-meta{font-family:var(--font-m);font-size:.75rem;color:var(--muted)}
.yr{font-family:var(--font-m);font-size:.72rem;color:var(--muted)}

/* ── Footer ── */
.footer{
  position:relative;z-index:1;
  text-align:center;padding:32px;
  font-family:var(--font-m);font-size:.72rem;
  color:var(--muted);border-top:1px solid var(--border);
  letter-spacing:.06em;
}

@media(max-width:600px){
  .hero{padding:72px 20px 60px}
  .page{padding:40px 16px 60px}
  .proj-grid{grid-template-columns:1fr}
  .cert-row{flex-direction:column;align-items:flex-start}
}
`;

function _section(title: string, content: string, counter: { n: number }): string {
  if (!content.trim()) return '';
  counter.n += 1;
  const num = String(counter.n).padStart(2, '0');
  return `<section id="${title.toLowerCase().replace(/\s+/g, '-')}">
<div class="sec-head">
  <span class="sec-label">[${num}] ${title}</span>
  <div class="sec-line" aria-hidden="true"></div>
</div>
${content}
</section>`;
}

function _em(em: boolean) {
  const ed  = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const led = (p: string) => em ? _listEditable(p) : '';
  const del = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const add = (sec: string, lbl: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${lbl}</button>` : '';
  const iw  = em ? ' data-item-wrap' : '';
  return { ed, led, del, add, iw };
}

function _about(v: NormalizedData): string {
  const { ed } = _em(v.edit_mode);
  const parts: string[] = [];
  if (v.headline) parts.push(`<p class="about-headline" ${ed('portfolio.headline', true)}>${v.headline}</p>`);
  if (v.bio)      parts.push(`<p class="about-text" ${ed('portfolio.bio', true)}>${v.bio}</p>`);
  const meta = [v.location, v.email, v.phone].filter(Boolean).join(' // ');
  if (meta) parts.push(`<p class="card-meta">${meta}</p>`);
  return parts.join('');
}

function _skills(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const groups = v.skill_groups || [];
  if (!groups.length && !v.edit_mode) return '';
  let out = '<div class="skill-grid">';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const tags = (g.skills || []).map((t: string) => `<span class="tag">${t}</span>`).join('');
    out += `<div class="skill-group"${iw}>${del('skills', i)}
<div class="skill-label" ${ed(`skills.${i}.category`)}>${g.category || ''}</div>
<div class="tag-row" ${led(`skills.${i}.skills`)}>${tags}</div>
</div>`;
  }
  out += `</div>${add('skills', 'Skill Group')}`;
  return out;
}

function _experience(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.experience || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const exp = items[i];
    const meta = [exp.location, exp.duration].filter(Boolean).join(' // ');
    const pts = (exp.key_points || []);
    const ptsHtml = pts.length ? `<ul class="card-list" ${led(`experience.${i}.key_points`)}>${pts.map((p: string) => `<li>${p}</li>`).join('')}</ul>` : '';
    out += `<div class="card"${iw}>${del('experience', i)}
<div class="card-title" ${ed(`experience.${i}.role`)}>${exp.role || ''}</div>
<div class="card-sub" ${ed(`experience.${i}.company`)}>${exp.company || ''}</div>
${meta ? `<div class="card-meta">${meta}</div>` : ''}
${exp.description ? `<p class="card-body" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${ptsHtml}
</div>`;
  }
  out += add('experience', 'Experience');
  return out;
}

function _education(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.education || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const edu = items[i];
    const titleParts = [edu.degree, edu.field_of_study].filter(Boolean);
    const title = titleParts.length ? titleParts.join(', ') : edu.institution;
    const meta = [titleParts.length ? edu.institution : '', edu.location, edu.year_range].filter(Boolean).join(' // ');
    out += `<div class="card"${iw}>${del('education', i)}
<div class="card-title" ${ed(`education.${i}.degree`)}>${title}</div>
${meta ? `<div class="card-meta">${meta}</div>` : ''}
${edu.grade_or_score ? `<div class="card-body">${edu.grade_or_score}</div>` : ''}
</div>`;
  }
  out += add('education', 'Education');
  return out;
}

function _projects(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.projects || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div class="proj-grid">';
  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const stack = (p.tech_stack || p.software_used || []);
    const tags = stack.map((t: string) => `<span class="tag">${t}</span>`).join('');
    let links = '';
    if (p.github_repo) links += `<a class="proj-link" href="${p.github_repo}" target="_blank" rel="noopener">repo</a>`;
    if (p.project_url) links += `<a class="proj-link" href="${p.project_url}" target="_blank" rel="noopener">live</a>`;
    const resp = (p.responsibilities || []);
    const respHtml = resp.length ? `<ul class="card-list" ${led(`projects.${i}.responsibilities`)}>${resp.map((r: string) => `<li>${r}</li>`).join('')}</ul>` : '';
    out += `<div class="card"${iw}>${del('projects', i)}
<div class="proj-header">
  <span class="card-title" ${ed(`projects.${i}.title`)}>${p.title || ''}</span>
  ${links ? `<div class="proj-links">${links}</div>` : ''}
</div>
${p.description ? `<p class="card-body" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${tags ? `<div class="tag-row" ${led(`projects.${i}.tech_stack`)} style="margin:8px 0">${tags}</div>` : ''}
${respHtml}
</div>`;
  }
  out += `</div>${add('projects', 'Project')}`;
  return out;
}

function _certifications(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.certifications || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div class="cert-list">';
  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    const meta = [c.issuer, c.year ? String(c.year) : ''].filter(Boolean).join(' // ');
    const label = c.url
      ? `<a class="cert-link" href="${c.url}" target="_blank" rel="noopener">${c.name || ''}</a>`
      : `<span class="cert-name" ${ed(`certifications.${i}.name`)}>${c.name || ''}</span>`;
    out += `<div class="card cert-row"${iw}>${del('certifications', i)}${label}${meta ? `<span class="cert-meta">${meta}</span>` : ''}</div>`;
  }
  out += `</div>${add('certifications', 'Certification')}`;
  return out;
}

function _achievements(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.achievements || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    out += `<div class="card"${iw}>${del('achievements', i)}
<div class="card-title"><span ${ed(`achievements.${i}.title`)}>${a.title || ''}</span>${a.year ? `&nbsp;<span class="yr">${a.year}</span>` : ''}</div>
${a.description ? `<p class="card-body" ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>`;
  }
  out += add('achievements', 'Achievement');
  return out;
}

function _awards(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.awards || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div class="cert-list">';
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    const meta = [a.awarding_body, a.year ? String(a.year) : ''].filter(Boolean).join(' // ');
    const label = a.url
      ? `<a class="cert-link" href="${a.url}" target="_blank" rel="noopener">${a.title || ''}</a>`
      : `<span class="cert-name" ${ed(`awards.${i}.title`)}>${a.title || ''}</span>`;
    out += `<div class="card cert-row"${iw}>${del('awards', i)}${label}${meta ? `<span class="cert-meta">${meta}</span>` : ''}</div>`;
  }
  out += `</div>${add('awards', 'Award')}`;
  return out;
}

function _design_philosophy(v: NormalizedData): string {
  const { ed } = _em(v.edit_mode);
  const dp = v.design_philosophy || '';
  return dp ? `<div class="card" style="border-color:rgba(139,92,246,.3)"><p style="font-size:.95rem;color:var(--text);line-height:1.8;font-style:italic" ${ed('design_philosophy', true)}>${dp}</p></div>` : '';
}

function _software_proficiency(v: NormalizedData): string {
  const items = v.software_proficiency || [];
  if (!items.length) return '';
  return `<div class="tag-row">${items.map((s: string) => `<span class="tag">${s}</span>`).join('')}</div>`;
}

function _campaigns(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.campaigns || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    const chTags = (c.channels_used || []).map((ch: string) => `<span class="tag">${ch}</span>`).join('');
    const metrics = (c.performance_metrics || []).map((m: string) => `<li>${m}</li>`).join('');
    out += `<div class="card"${iw}>${del('campaigns', i)}
<div class="card-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || ''}${c.campaign_type ? `&nbsp;<span class="cert-meta">// ${c.campaign_type}</span>` : ''}</div>
${chTags ? `<div class="tag-row" style="margin:8px 0">${chTags}</div>` : ''}
${c.budget ? `<div class="card-meta">budget: ${c.budget}</div>` : ''}
${metrics ? `<ul class="card-list" ${led(`campaigns.${i}.performance_metrics`)}>${metrics}</ul>` : ''}
</div>`;
  }
  out += add('campaigns', 'Campaign');
  return out;
}

function _financial_modeling(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.financial_modeling || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const fm = items[i];
    const toolTags = (fm.tools_used || []).map((t: string) => `<span class="tag">${t}</span>`).join('');
    out += `<div class="card"${iw}>${del('financial_modeling', i)}
<div class="card-title" ${ed(`financial_modeling.${i}.model_type`)}>${fm.model_type || ''}</div>
${toolTags ? `<div class="tag-row" ${led(`financial_modeling.${i}.tools_used`)} style="margin:8px 0">${toolTags}</div>` : ''}
${fm.outcome ? `<p class="card-body" ${ed(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : ''}
</div>`;
  }
  out += add('financial_modeling', 'Model');
  return out;
}

function _investment_portfolios(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.investment_portfolios || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const ip = items[i];
    out += `<div class="card"${iw}>${del('investment_portfolios', i)}
<div class="card-title" ${ed(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type || ''}</div>
<div style="display:flex;gap:28px;margin-top:10px;flex-wrap:wrap">
${ip.assets_under_management ? `<span><span class="card-meta" style="display:block">AUM</span><strong style="color:var(--cyan)">${ip.assets_under_management}</strong></span>` : ''}
${ip.performance_return ? `<span><span class="card-meta" style="display:block">Return</span><strong style="color:var(--pink)">${ip.performance_return}</strong></span>` : ''}
</div>
</div>`;
  }
  out += add('investment_portfolios', 'Portfolio');
  return out;
}

const _RENDERERS: Record<string, [string, (v: NormalizedData) => string]> = {
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

export function html(v: NormalizedData): string {
  const name     = v.name || 'Portfolio';
  const em       = v.edit_mode;
  const ed       = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const edScript = em ? EDITOR_SCRIPT : '';

  let liHtml = '';
  if (v.linkedin_url)  liHtml += `<a class="hero-link" href="${v.linkedin_url}" target="_blank" rel="noopener">linkedin</a>`;
  if (v.github_url)    liHtml += `<a class="hero-link" href="${v.github_url}" target="_blank" rel="noopener">github</a>`;
  if (v.portfolio_url) liHtml += `<a class="hero-link" href="${v.portfolio_url}" target="_blank" rel="noopener">portfolio</a>`;
  if (v.twitter_url)   liHtml += `<a class="hero-link" href="${v.twitter_url}" target="_blank" rel="noopener">twitter</a>`;

  const order   = v.section_order || DEFAULT_SECTION_ORDER;
  const hidden  = new Set(v.hidden_sections || []);
  const counter = { n: 0 };
  const aboutSec = _section('About', _about(v), counter);

  const contentSecs = order.flatMap(key => {
    if (hidden.has(key)) return [];
    if (key === 'custom_sections') {
      return (v.custom_sections ?? []).filter(cs => cs.items?.length || em).map((cs, csIdx) => {
        const itemsHtml = (cs.items ?? []).map((item, i) => {
          const del = em ? `<button class="ce-del-btn" data-del-section="custom_sections" data-del-index="${i}">&#x2715;</button>` : '';
          return `<div class="card" style="position:relative">${del}
${item.label ? `<div class="card-title">${item.label}</div>` : ''}
${item.subtitle ? `<div class="card-meta">${item.subtitle}</div>` : ''}
${item.value ? `<p class="card-body">${item.value}</p>` : ''}
${item.tags?.length ? `<div class="tag-row" style="margin-top:10px">${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" style="font-family:var(--font-m);font-size:.72rem;color:var(--cyan);text-decoration:none;margin-top:8px;display:inline-block" target="_blank" rel="noopener">→ view</a>` : ''}
</div>`;
        }).join('\n');
        const addBtn = em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : '';
        const inner = cs.display_type === 'cards'
          ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">${itemsHtml}</div>${addBtn}`
          : `<div style="display:flex;flex-direction:column;gap:12px">${itemsHtml}</div>${addBtn}`;
        return _section(cs.title, inner, counter);
      });
    }
    if (key in _RENDERERS) {
      const [label, renderer] = _RENDERERS[key];
      return [_section(label, renderer(v), counter)];
    }
    return [];
  }).filter(Boolean).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name} — Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>${_CSS}</style>
</head>
<body>
<div aria-hidden="true"><div class="q-orb q-orb1"></div><div class="q-orb q-orb2"></div><div class="q-orb q-orb3"></div></div>
<header class="hero">
  <div class="hero-bar" aria-hidden="true"></div>
  <div class="hero-inner">
    <p class="hero-id">PORTFOLIO.SYS // IDENTITY MODULE</p>
    <h1 class="hero-name" ${ed('profile.full_name')}>${name}</h1>
    ${v.headline ? `<p class="hero-title" ${ed('profile.headline')}>${v.headline}</p>` : ''}
    ${v.location || v.phone ? `<p class="hero-meta"><span ${ed('profile.location')}>${v.location || ''}</span>${v.phone ? ` // <span ${ed('profile.phone')}>${v.phone}</span>` : ''}</p>` : ''}
    ${liHtml ? `<div class="hero-links">${liHtml}</div>` : ''}
  </div>
</header>
<main class="page">
${aboutSec}
${contentSecs}
</main>
<footer class="footer">// PORTFOLIO.SYS &mdash; QUANTUM THEME &mdash; BUILT WITH AI</footer>
${edScript}
</body>
</html>`;
}
