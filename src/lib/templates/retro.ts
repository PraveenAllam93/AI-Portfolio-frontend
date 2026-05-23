/**
 * Template: Retro
 * 1970s–80s print-inspired portfolio. Warm cream canvas, Playfair Display serif
 * headlines, burnt-orange / mustard earth accents, grainy texture overlay,
 * ruled dividers, chunky underlines. Feels like a beautifully typeset
 * vintage annual report brought to the web.
 *
 * NOTE: Values from NormalizedData are already HTML-escaped by normalize().
 * Do NOT apply _e() again — that would cause double-escaping.
 */

import { type NormalizedData, DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const _CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --cream:  #f5f0e8;
  --cream2: #ede7db;
  --paper:  #faf7f2;
  --orange: #c85a1e;
  --mustard:#c48b14;
  --forest: #2d5a27;
  --ink:    #1c1410;
  --ink2:   #4a3f35;
  --ink3:   #7a6a5a;
  --rule:   rgba(28,20,16,.18);
  --font-h: 'Playfair Display', Georgia, serif;
  --font-b: 'DM Sans', system-ui, sans-serif;
}

html{scroll-behavior:smooth}
body{
  background:var(--cream);
  color:var(--ink);
  font-family:var(--font-b);
  font-size:16px;
  line-height:1.7;
  overflow-x:hidden;
}

/* Grain overlay */
body::before{
  content:'';
  position:fixed;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
  pointer-events:none;z-index:9999;opacity:.6;
}

/* ── Hero ── */
.hero{
  background:var(--ink);
  color:var(--cream);
  padding:90px 5vw 80px;
  position:relative;
  overflow:hidden;
}
.hero-rule{
  position:absolute;top:0;left:0;right:0;height:6px;
  background:repeating-linear-gradient(90deg,var(--orange) 0,var(--orange) 60px,var(--mustard) 60px,var(--mustard) 120px,var(--forest) 120px,var(--forest) 180px);
}
.hero-inner{max-width:900px;margin:0 auto;position:relative;z-index:1}
.hero-eyebrow{
  font-family:var(--font-b);font-size:.72rem;font-weight:600;
  letter-spacing:.25em;text-transform:uppercase;
  color:var(--mustard);margin-bottom:20px;
}
.hero-name{
  font-family:var(--font-h);
  font-size:clamp(3rem,8vw,6.5rem);
  font-weight:900;line-height:1;
  letter-spacing:-.02em;
  color:var(--cream);
  margin-bottom:16px;
}
.hero-name em{font-style:italic;color:var(--orange)}
.hero-title{
  font-family:var(--font-b);
  font-size:1.1rem;font-weight:300;
  color:rgba(245,240,232,.7);
  margin-bottom:28px;letter-spacing:.03em;
}
.hero-links{display:flex;flex-wrap:wrap;gap:14px;align-items:center}
.hero-link{
  font-family:var(--font-b);font-size:.8rem;font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--cream);text-decoration:none;
  padding:8px 20px;
  border:1.5px solid rgba(245,240,232,.35);
  transition:border-color .2s,color .2s;
}
.hero-link:hover{border-color:var(--orange);color:var(--orange)}
.hero-deco{
  position:absolute;right:-40px;top:20px;
  font-family:var(--font-h);font-size:clamp(10rem,20vw,18rem);
  font-weight:900;font-style:italic;
  color:rgba(245,240,232,.04);line-height:1;
  pointer-events:none;user-select:none;
}

/* ── Layout ── */
.container{max-width:860px;margin:0 auto;padding:60px 24px 100px}

/* ── Section ── */
section{margin-bottom:56px}
.sec-head{
  display:flex;align-items:center;gap:16px;
  margin-bottom:28px;padding-bottom:12px;
}
.sec-rule-wrap{display:flex;flex:1;align-items:center;gap:0}
.sec-rule-line{flex:1;height:1px;background:var(--rule)}
.sec-rule-dot{
  width:7px;height:7px;border-radius:50%;
  background:var(--orange);flex-shrink:0;margin:0 6px;
}
.sec-title{
  font-family:var(--font-h);font-size:1.35rem;font-weight:700;
  color:var(--ink);letter-spacing:-.01em;
  text-decoration:underline;text-decoration-color:var(--orange);
  text-decoration-thickness:2px;text-underline-offset:5px;
  flex-shrink:0;
}
.sec-num{
  font-family:var(--font-b);font-size:.65rem;font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;
  color:var(--ink3);margin-top:4px;flex-shrink:0;
}

/* ── Cards ── */
.card{
  background:var(--paper);
  border:1px solid var(--rule);
  padding:20px 24px;
  margin-bottom:12px;
  position:relative;
}
.card::before{
  content:'';position:absolute;left:0;top:0;bottom:0;
  width:4px;background:var(--orange);
}
.card-title{
  font-family:var(--font-h);font-size:1.05rem;font-weight:600;
  color:var(--ink);margin-bottom:4px;
}
.card-sub,.card-grade{font-size:.85rem;color:var(--ink3);margin-bottom:4px}
.card-body{font-size:.9rem;color:var(--ink2);margin-top:8px;line-height:1.7}
.card-list{margin:8px 0 0 18px;font-size:.88rem;color:var(--ink2)}
.card-list li{margin-bottom:4px}

/* ── About ── */
.about-text{font-size:1.05rem;color:var(--ink2);margin-bottom:10px;line-height:1.8}
.about-pull{
  font-family:var(--font-h);font-size:1.2rem;font-style:italic;
  color:var(--orange);margin-bottom:12px;line-height:1.5;
  border-left:3px solid var(--mustard);padding-left:16px;
}
.about-meta{font-size:.85rem;color:var(--ink3)}

/* ── Skills ── */
.skill-grid{display:flex;flex-direction:column;gap:14px}
.skill-group{display:flex;flex-direction:column;gap:8px}
.skill-label{
  font-family:var(--font-b);font-size:.72rem;font-weight:700;
  letter-spacing:.18em;text-transform:uppercase;color:var(--orange);
}
.tag-row{display:flex;flex-wrap:wrap;gap:8px}
.tag{
  display:inline-block;padding:4px 14px;
  border:1.5px solid var(--rule);
  background:transparent;
  font-family:var(--font-b);font-size:.78rem;font-weight:500;
  color:var(--ink2);letter-spacing:.03em;
  transition:border-color .2s,color .2s,background .2s;
}
.tag:hover{border-color:var(--orange);color:var(--ink);background:rgba(200,90,30,.06)}

/* ── Experience ── */
.exp-header{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;margin-bottom:4px}
.exp-role{font-family:var(--font-h);font-size:1rem;font-weight:600;color:var(--ink)}
.exp-company{font-size:.9rem;color:var(--orange);font-weight:600}
.exp-meta{font-size:.82rem;color:var(--ink3);margin-bottom:6px}
.exp-desc{font-size:.9rem;color:var(--ink2);line-height:1.7}

/* ── Projects ── */
.project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.proj-header{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px}
.proj-links{display:flex;gap:8px;flex-shrink:0}
.proj-link{
  font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  padding:3px 10px;border:1.5px solid var(--rule);
  color:var(--orange);text-decoration:none;
  transition:border-color .2s,background .2s;
}
.proj-link:hover{border-color:var(--orange);background:rgba(200,90,30,.06)}

/* ── Certifications / Awards ── */
.cert-list,.award-list{display:flex;flex-direction:column;gap:10px}
.cert-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:14px 20px}
.cert-name,.cert-link{font-family:var(--font-h);font-size:.95rem;font-weight:600;color:var(--ink)}
.cert-link{color:var(--orange);text-decoration:none}
.cert-link:hover{text-decoration:underline}
.cert-meta{font-size:.82rem;color:var(--ink3)}
.yr{font-size:.78rem;color:var(--ink3)}

/* ── Philosophy ── */
.philosophy-card p{font-family:var(--font-h);font-size:1rem;font-style:italic;color:var(--ink2);line-height:1.8}

/* ── Footer ── */
.footer{
  background:var(--ink);color:rgba(245,240,232,.5);
  text-align:center;padding:28px 24px;
  font-family:var(--font-b);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;
}

@media(max-width:600px){
  .hero{padding:72px 20px 60px}
  .container{padding:40px 16px 60px}
  .project-grid{grid-template-columns:1fr}
  .cert-row{flex-direction:column;align-items:flex-start}
}
`;

// ── helpers ──────────────────────────────────────────────────────────────────

function _section(title: string, content: string, counter: { n: number }): string {
  if (!content.trim()) return '';
  counter.n += 1;
  const num = String(counter.n).padStart(2, '0');
  return `<section>
<div class="sec-head">
  <span class="sec-num">${num}</span>
  <h2 class="sec-title">${title}</h2>
  <div class="sec-rule-wrap"><div class="sec-rule-line"></div><div class="sec-rule-dot"></div></div>
</div>
${content}
</section>`;
}

function _em(em: boolean) {
  const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const led = (p: string) => em ? _listEditable(p) : '';
  const del = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">×</button>` : '';
  const add = (sec: string, lbl: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${lbl}</button>` : '';
  const iw = em ? ' data-item-wrap' : '';
  return { ed, led, del, add, iw };
}

function _about(v: NormalizedData): string {
  const { ed } = _em(v.edit_mode);
  const parts: string[] = [];
  if (v.headline) parts.push(`<p class="about-pull" ${ed('portfolio.headline', true)}>${v.headline}</p>`);
  if (v.bio)      parts.push(`<p class="about-text" ${ed('portfolio.bio', true)}>${v.bio}</p>`);
  const meta = [v.location, v.email, v.phone].filter(Boolean).join(' &bull; ');
  if (meta) parts.push(`<p class="about-meta">${meta}</p>`);
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
    out += `<div class="skill-group"${iw}>${del('skills', i)}` +
      (g.category ? `<span class="skill-label" ${ed(`skills.${i}.category`)}>${g.category}</span>` : '') +
      (tags ? `<div class="tag-row" ${led(`skills.${i}.skills`)}>${tags}</div>` : '') +
      `</div>`;
  }
  out += `</div>${add('skills', 'Skill Group')}`;
  return out;
}

function _experience(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.experience || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div>';
  for (let i = 0; i < items.length; i++) {
    const exp = items[i];
    const meta = [exp.location, exp.duration].filter(Boolean).join(' &bull; ');
    const pts = (exp.key_points || []);
    const ptsHtml = pts.length
      ? `<ul class="card-list" ${led(`experience.${i}.key_points`)}>${pts.map((p: string) => `<li>${p}</li>`).join('')}</ul>`
      : '';
    out += `<div class="card"${iw}>${del('experience', i)}
<div class="exp-header">
  <span class="exp-role" ${ed(`experience.${i}.role`)}>${exp.role || ''}</span>
  <span class="exp-company" ${ed(`experience.${i}.company`)}>${exp.company || ''}</span>
</div>
${meta ? `<p class="exp-meta">${meta}</p>` : ''}
${exp.description ? `<p class="exp-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${ptsHtml}
</div>`;
  }
  out += `</div>${add('experience', 'Experience')}`;
  return out;
}

function _education(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.education || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div>';
  for (let i = 0; i < items.length; i++) {
    const edu = items[i];
    const titleParts = [edu.degree, edu.field_of_study].filter(Boolean);
    const title = titleParts.length ? titleParts.join(', ') : edu.institution;
    const meta = [titleParts.length ? edu.institution : '', edu.location, edu.year_range].filter(Boolean).join(' &bull; ');
    out += `<div class="card"${iw}>${del('education', i)}
<div class="card-title" ${ed(`education.${i}.degree`)}>${title}</div>
${meta ? `<div class="card-sub">${meta}</div>` : ''}
${edu.grade_or_score ? `<div class="card-grade">${edu.grade_or_score}</div>` : ''}
</div>`;
  }
  out += `</div>${add('education', 'Education')}`;
  return out;
}

function _projects(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.projects || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div class="project-grid">';
  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const stack = (p.tech_stack || p.software_used || []);
    const tags = stack.map((t: string) => `<span class="tag">${t}</span>`).join('');
    const tagRow = tags ? `<div class="tag-row" ${led(`projects.${i}.tech_stack`)}>${tags}</div>` : '';
    let links = '';
    if (p.github_repo) links += `<a class="proj-link" href="${p.github_repo}" target="_blank" rel="noopener">GitHub</a>`;
    if (p.project_url) links += `<a class="proj-link" href="${p.project_url}" target="_blank" rel="noopener">Live</a>`;
    const resp = (p.responsibilities || []);
    const respHtml = resp.length ? `<ul class="card-list" ${led(`projects.${i}.responsibilities`)}>${resp.map((r: string) => `<li>${r}</li>`).join('')}</ul>` : '';
    out += `<div class="card"${iw}>${del('projects', i)}
<div class="proj-header">
  <span class="card-title" ${ed(`projects.${i}.title`)}>${p.title || ''}</span>
  ${links ? `<div class="proj-links">${links}</div>` : ''}
</div>
${p.description ? `<p class="card-body" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${tagRow}${respHtml}
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
    const meta = [c.issuer, c.year ? String(c.year) : ''].filter(Boolean).join(' &bull; ');
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
  let out = '<div>';
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    out += `<div class="card"${iw}>${del('achievements', i)}
<div class="card-title"><span ${ed(`achievements.${i}.title`)}>${a.title || ''}</span>${a.year ? `&nbsp;<span class="yr">${a.year}</span>` : ''}</div>
${a.description ? `<p class="card-body" ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>`;
  }
  out += `</div>${add('achievements', 'Achievement')}`;
  return out;
}

function _awards(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.awards || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div class="award-list">';
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    const meta = [a.awarding_body, a.year ? String(a.year) : ''].filter(Boolean).join(' &bull; ');
    const label = a.url
      ? `<a class="cert-link" href="${a.url}" target="_blank" rel="noopener">${a.title || ''}</a>`
      : `<span class="card-title" ${ed(`awards.${i}.title`)}>${a.title || ''}</span>`;
    out += `<div class="card cert-row"${iw}>${del('awards', i)}${label}${meta ? `<span class="cert-meta">${meta}</span>` : ''}</div>`;
  }
  out += `</div>${add('awards', 'Award')}`;
  return out;
}

function _design_philosophy(v: NormalizedData): string {
  const { ed } = _em(v.edit_mode);
  const dp = v.design_philosophy || '';
  return dp ? `<div class="card philosophy-card"><p ${ed('design_philosophy', true)}>${dp}</p></div>` : '';
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
  let out = '<div>';
  for (let i = 0; i < items.length; i++) {
    const c = items[i];
    const chTags = (c.channels_used || []).map((ch: string) => `<span class="tag">${ch}</span>`).join('');
    const metrics = (c.performance_metrics || []).map((m: string) => `<li>${m}</li>`).join('');
    out += `<div class="card"${iw}>${del('campaigns', i)}
<div class="card-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || ''}${c.campaign_type ? `&nbsp;<span class="cert-meta">${c.campaign_type}</span>` : ''}</div>
${chTags ? `<div class="tag-row">${chTags}</div>` : ''}
${c.budget ? `<p class="card-body">Budget: ${c.budget}</p>` : ''}
${metrics ? `<ul class="card-list" ${led(`campaigns.${i}.performance_metrics`)}>${metrics}</ul>` : ''}
</div>`;
  }
  out += `</div>${add('campaigns', 'Campaign')}`;
  return out;
}

function _financial_modeling(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.financial_modeling || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div>';
  for (let i = 0; i < items.length; i++) {
    const fm = items[i];
    const toolTags = (fm.tools_used || []).map((t: string) => `<span class="tag">${t}</span>`).join('');
    out += `<div class="card"${iw}>${del('financial_modeling', i)}
<div class="card-title" ${ed(`financial_modeling.${i}.model_type`)}>${fm.model_type || ''}</div>
${toolTags ? `<div class="tag-row" ${led(`financial_modeling.${i}.tools_used`)}>${toolTags}</div>` : ''}
${fm.outcome ? `<p class="card-body" ${ed(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : ''}
</div>`;
  }
  out += `</div>${add('financial_modeling', 'Model')}`;
  return out;
}

function _investment_portfolios(v: NormalizedData): string {
  const { ed, del, add, iw } = _em(v.edit_mode);
  const items = v.investment_portfolios || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '<div>';
  for (let i = 0; i < items.length; i++) {
    const ip = items[i];
    out += `<div class="card"${iw}>${del('investment_portfolios', i)}
<div class="card-title" ${ed(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type || ''}</div>
<div style="display:flex;gap:24px;margin-top:10px;flex-wrap:wrap">
${ip.assets_under_management ? `<span><span style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);display:block">AUM</span>${ip.assets_under_management}</span>` : ''}
${ip.performance_return ? `<span><span style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);display:block">Return</span>${ip.performance_return}</span>` : ''}
</div>
</div>`;
  }
  out += `</div>${add('investment_portfolios', 'Portfolio')}`;
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
  if (v.linkedin_url)  liHtml += `<a class="hero-link" href="${v.linkedin_url}" target="_blank" rel="noopener">LinkedIn</a>`;
  if (v.github_url)    liHtml += `<a class="hero-link" href="${v.github_url}" target="_blank" rel="noopener">GitHub</a>`;
  if (v.portfolio_url) liHtml += `<a class="hero-link" href="${v.portfolio_url}" target="_blank" rel="noopener">Portfolio</a>`;
  if (v.twitter_url)   liHtml += `<a class="hero-link" href="${v.twitter_url}" target="_blank" rel="noopener">Twitter</a>`;

  const order  = v.section_order || DEFAULT_SECTION_ORDER;
  const hidden = new Set(v.hidden_sections || []);
  const counter = { n: 0 };
  const aboutSec = _section('About', _about(v), counter);

  const contentSecs = order.flatMap(key => {
    if (hidden.has(key)) return [];
    if (key === 'custom_sections') {
      return (v.custom_sections ?? []).filter(cs => cs.items?.length || em).map((cs, csIdx) => {
        const itemsHtml = (cs.items ?? []).map((item, i) => {
          const del = em ? `<button class="ce-del-btn" data-del-section="custom_sections" data-del-index="${i}">&#x2715;</button>` : '';
          return `<div class="card" style="position:relative">${del}
${item.label ? `<p class="card-title">${item.label}</p>` : ''}
${item.subtitle ? `<p style="opacity:.65;font-size:.85rem;margin-top:4px">${item.subtitle}</p>` : ''}
${item.value ? `<p style="margin-top:8px;line-height:1.7">${item.value}</p>` : ''}
${item.tags?.length ? `<div class="tag-row" style="margin-top:10px">${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" style="font-size:.82rem;margin-top:8px;display:inline-block;color:var(--orange)" target="_blank" rel="noopener">View &#8599;</a>` : ''}
</div>`;
        }).join('\n');
        const addBtn = em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : '';
        const inner = cs.display_type === 'cards'
          ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">${itemsHtml}</div>${addBtn}`
          : `<div style="display:flex;flex-direction:column;gap:.75rem">${itemsHtml}</div>${addBtn}`;
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
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>${_CSS}</style>
</head>
<body>
<header class="hero">
  <div class="hero-rule" aria-hidden="true"></div>
  <div class="hero-inner">
    <p class="hero-eyebrow">Portfolio &mdash; ${new Date().getFullYear()}</p>
    <h1 class="hero-name" ${ed('profile.full_name')}>${name}</h1>
    ${v.headline ? `<p class="hero-title" ${ed('profile.headline')}>${v.headline}</p>` : ''}
    ${v.location || v.phone ? `<p class="hero-title" style="font-size:.9rem;margin-top:-18px;margin-bottom:24px;opacity:.6"><span ${ed('profile.location')}>${v.location || ''}</span>${v.phone ? ` &bull; <span ${ed('profile.phone')}>${v.phone}</span>` : ''}</p>` : ''}
    ${liHtml ? `<div class="hero-links">${liHtml}</div>` : ''}
  </div>
  <div class="hero-deco" aria-hidden="true">&amp;</div>
</header>
<main class="container">
${aboutSec}
${contentSecs}
</main>
<footer class="footer">Built with AI &bull; Retro Theme</footer>
${edScript}
</body>
</html>`;
}
