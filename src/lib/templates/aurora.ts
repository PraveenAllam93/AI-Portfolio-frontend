/**
 * Template: Aurora
 * Clean, contemporary 2024 award-winning portfolio site. White (#ffffff) with
 * deep navy text (#1a1f36) and coral (#ff6b6b) highlights. Gradient blob
 * backgrounds, DM Sans bold headlines, card-based sections with soft shadows,
 * generous rounded corners, full-bleed hero with split layout.
 *
 * NOTE: Values from NormalizedData are already HTML-escaped by normalize().
 */

import { type NormalizedData, DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const _CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Inter:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --white:   #ffffff;
  --bg:      #f8f9fa;
  --navy:    #1a1f36;
  --navy2:   #2d3555;
  --coral:   #ff6b6b;
  --coral2:  #ff8e8e;
  --text:    #1a1f36;
  --text2:   #4a5180;
  --muted:   #8892b0;
  --border:  rgba(26,31,54,.08);
  --shadow:  0 4px 24px rgba(26,31,54,.08);
  --shadow2: 0 12px 40px rgba(26,31,54,.14);
  --radius:  20px;
  --font-h:  'DM Sans', system-ui, sans-serif;
  --font-b:  'Inter', system-ui, sans-serif;
}

html{scroll-behavior:smooth}
body{
  background:var(--bg);color:var(--text);
  font-family:var(--font-b);font-size:16px;line-height:1.7;
  overflow-x:hidden;
}

/* Blobs */
.blob-wrap{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55}
.blob1{width:600px;height:600px;background:rgba(255,107,107,.12);top:-100px;right:-150px;animation:b-float 16s ease-in-out infinite alternate}
.blob2{width:500px;height:500px;background:rgba(26,31,54,.07);bottom:-100px;left:-100px;animation:b-float 20s ease-in-out infinite alternate-reverse}
.blob3{width:350px;height:350px;background:rgba(255,107,107,.07);top:40%;left:30%;animation:b-float 24s ease-in-out infinite alternate}
@keyframes b-float{from{transform:translate(0,0) scale(1)}to{transform:translate(30px,20px) scale(1.05)}}

/* ── Nav (minimal top strip) ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  background:rgba(248,249,250,.85);
  border-bottom:1px solid var(--border);
  padding:16px 5vw;
  display:flex;justify-content:space-between;align-items:center;
}
.nav-brand{font-family:var(--font-h);font-size:.9rem;font-weight:700;color:var(--navy);letter-spacing:-.01em}
.nav-coral{color:var(--coral)}
.nav-links{display:flex;gap:24px}
.nav-links a{font-family:var(--font-b);font-size:.8rem;color:var(--muted);text-decoration:none;transition:color .2s}
.nav-links a:hover{color:var(--coral)}

/* ── Hero ── */
.hero{
  position:relative;z-index:1;
  min-height:100vh;display:flex;align-items:center;
  padding:100px 5vw 80px;
}
.hero-inner{max-width:1040px;margin:0 auto;display:grid;grid-template-columns:1fr auto;gap:60px;align-items:center;width:100%}
.hero-text{}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  font-family:var(--font-b);font-size:.75rem;font-weight:500;
  letter-spacing:.18em;text-transform:uppercase;
  color:var(--coral);margin-bottom:24px;
  background:rgba(255,107,107,.08);
  padding:6px 14px;border-radius:999px;border:1px solid rgba(255,107,107,.2);
}
.hero-name{
  font-family:var(--font-h);
  font-size:clamp(3rem,7vw,5.5rem);
  font-weight:900;line-height:1.0;
  letter-spacing:-.03em;color:var(--navy);
  margin-bottom:20px;
}
.hero-title{
  font-size:1.15rem;font-weight:400;color:var(--text2);
  margin-bottom:32px;max-width:500px;line-height:1.65;
}
.hero-meta{font-size:.85rem;color:var(--muted);margin-bottom:36px}
.hero-links{display:flex;flex-wrap:wrap;gap:12px}
.hero-link{
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 22px;border-radius:999px;
  font-family:var(--font-b);font-size:.85rem;font-weight:500;
  text-decoration:none;transition:all .25s;
}
.hero-link.primary{background:var(--coral);color:#fff;box-shadow:0 4px 16px rgba(255,107,107,.4)}
.hero-link.primary:hover{background:var(--coral2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,107,.45)}
.hero-link.secondary{background:var(--white);color:var(--navy);border:1px solid var(--border);box-shadow:var(--shadow)}
.hero-link.secondary:hover{border-color:rgba(255,107,107,.3);transform:translateY(-2px)}

/* Avatar placeholder */
.hero-avatar{
  width:220px;height:220px;border-radius:28px;
  background:linear-gradient(135deg,rgba(255,107,107,.15),rgba(26,31,54,.1));
  border:1.5px solid rgba(255,107,107,.2);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  font-family:var(--font-h);font-size:5rem;font-weight:900;
  color:rgba(255,107,107,.3);letter-spacing:-.04em;
  box-shadow:var(--shadow2);
}

/* ── Layout ── */
.page{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:60px 24px 120px}

/* ── Sections ── */
section{margin-bottom:64px}
.sec-head{display:flex;align-items:center;gap:16px;margin-bottom:28px}
.sec-dot{width:10px;height:10px;border-radius:50%;background:var(--coral);flex-shrink:0}
.sec-title{font-family:var(--font-h);font-size:1.5rem;font-weight:700;color:var(--navy);letter-spacing:-.02em}
.sec-line{flex:1;height:1px;background:var(--border)}

/* ── Cards ── */
.card{
  background:var(--white);border-radius:var(--radius);
  padding:24px 28px;margin-bottom:16px;
  box-shadow:var(--shadow);
  border:1px solid var(--border);
  position:relative;overflow:hidden;
  transition:box-shadow .25s,transform .2s;
}
.card::after{
  content:'';position:absolute;top:0;left:0;width:4px;height:100%;
  background:var(--coral);opacity:0;transition:opacity .25s;
}
.card:hover{box-shadow:var(--shadow2);transform:translateY(-2px)}
.card:hover::after{opacity:1}
.card-title{font-family:var(--font-h);font-size:1.05rem;font-weight:700;color:var(--navy);margin-bottom:4px}
.card-sub{font-size:.85rem;color:var(--coral);font-weight:500;margin-bottom:6px}
.card-meta{font-size:.82rem;color:var(--muted);margin-bottom:8px}
.card-body{font-size:.9rem;color:var(--text2);line-height:1.75}
.card-list{margin:10px 0 0 18px;font-size:.88rem;color:var(--text2);line-height:1.75}
.card-list li{margin-bottom:4px}

/* ── About ── */
.about-card{padding:32px 36px}
.about-headline{font-family:var(--font-h);font-size:1.4rem;font-weight:700;color:var(--navy);margin-bottom:12px;line-height:1.35}
.about-bio{font-size:1rem;color:var(--text2);line-height:1.8;margin-bottom:16px}
.about-meta{font-size:.82rem;color:var(--muted)}

/* ── Skills ── */
.skill-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.skill-card{background:var(--white);border-radius:16px;padding:18px 20px;box-shadow:var(--shadow);border:1px solid var(--border)}
.skill-label{font-family:var(--font-h);font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--coral);margin-bottom:10px}
.tag-row{display:flex;flex-wrap:wrap;gap:7px}
.tag{
  display:inline-block;padding:3px 12px;
  border-radius:999px;
  background:rgba(26,31,54,.06);
  border:1px solid rgba(26,31,54,.09);
  font-family:var(--font-b);font-size:.78rem;color:var(--text2);
  transition:background .2s,border-color .2s;
}
.tag:hover{background:rgba(255,107,107,.1);border-color:rgba(255,107,107,.3);color:var(--coral)}

/* ── Projects ── */
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.proj-card{height:100%;display:flex;flex-direction:column}
.proj-card .card-body{flex:1}
.proj-links{display:flex;gap:8px;margin-top:14px}
.proj-link{
  font-size:.75rem;font-weight:500;
  padding:5px 14px;border-radius:999px;
  text-decoration:none;transition:all .2s;
  border:1px solid var(--border);color:var(--navy);
}
.proj-link:hover{border-color:var(--coral);color:var(--coral);background:rgba(255,107,107,.05)}

/* ── Certs ── */
.cert-list{display:flex;flex-direction:column;gap:10px}
.cert-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:16px 24px}
.cert-name,.cert-link{font-family:var(--font-h);font-size:.95rem;font-weight:600;color:var(--navy)}
.cert-link{color:var(--coral);text-decoration:none}
.cert-link:hover{text-decoration:underline}
.cert-meta{font-size:.8rem;color:var(--muted)}
.yr{font-size:.78rem;color:var(--muted)}

/* ── Footer ── */
.footer{position:relative;z-index:1;text-align:center;padding:32px;font-size:.78rem;color:var(--muted);border-top:1px solid var(--border)}

@media(max-width:680px){
  .hero-inner{grid-template-columns:1fr}
  .hero-avatar{display:none}
  .nav-links{display:none}
  .skill-cards,.proj-grid{grid-template-columns:1fr}
  .cert-row{flex-direction:column;align-items:flex-start}
}
`;

function _section(title: string, content: string, counter: { n: number }): string {
  if (!content.trim()) return '';
  counter.n += 1;
  return `<section id="${title.toLowerCase().replace(/\s+/g, '-')}">
<div class="sec-head">
  <span class="sec-dot" aria-hidden="true"></span>
  <h2 class="sec-title">${title}</h2>
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
  const meta = [v.location, v.email, v.phone].filter(Boolean).join(' &bull; ');
  return `<div class="card about-card">
${v.headline ? `<h3 class="about-headline" ${ed('portfolio.headline', true)}>${v.headline}</h3>` : ''}
${v.bio ? `<p class="about-bio" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${meta ? `<p class="about-meta">${meta}</p>` : ''}
</div>`;
}

function _skills(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const groups = v.skill_groups || [];
  if (!groups.length && !v.edit_mode) return '';
  let out = '<div class="skill-cards">';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const tags = (g.skills || []).map((t: string) => `<span class="tag">${t}</span>`).join('');
    out += `<div class="skill-card"${iw}>${del('skills', i)}
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
    const meta = [exp.location, exp.duration].filter(Boolean).join(' &bull; ');
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
    const meta = [titleParts.length ? edu.institution : '', edu.location, edu.year_range].filter(Boolean).join(' &bull; ');
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
    if (p.github_repo) links += `<a class="proj-link" href="${p.github_repo}" target="_blank" rel="noopener">GitHub</a>`;
    if (p.project_url) links += `<a class="proj-link" href="${p.project_url}" target="_blank" rel="noopener">Live</a>`;
    const resp = (p.responsibilities || []);
    const respHtml = resp.length ? `<ul class="card-list" ${led(`projects.${i}.responsibilities`)}>${resp.map((r: string) => `<li>${r}</li>`).join('')}</ul>` : '';
    out += `<div class="card proj-card"${iw}>${del('projects', i)}
<div class="card-title" ${ed(`projects.${i}.title`)}>${p.title || ''}</div>
${p.description ? `<p class="card-body" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${tags ? `<div class="tag-row" ${led(`projects.${i}.tech_stack`)} style="margin:10px 0">${tags}</div>` : ''}
${respHtml}
${links ? `<div class="proj-links">${links}</div>` : ''}
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
    const meta = [a.awarding_body, a.year ? String(a.year) : ''].filter(Boolean).join(' &bull; ');
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
  return dp ? `<div class="card" style="border-left:4px solid var(--coral);padding-left:28px"><p style="font-size:1.05rem;font-style:italic;color:var(--text2);line-height:1.8" ${ed('design_philosophy', true)}>${dp}</p></div>` : '';
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
<div class="card-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || ''}${c.campaign_type ? `&nbsp;<span class="cert-meta">&mdash; ${c.campaign_type}</span>` : ''}</div>
${chTags ? `<div class="tag-row" style="margin:8px 0">${chTags}</div>` : ''}
${c.budget ? `<div class="card-meta">Budget: ${c.budget}</div>` : ''}
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
<div style="display:flex;gap:24px;margin-top:10px;flex-wrap:wrap">
${ip.assets_under_management ? `<span><span style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);display:block">AUM</span><strong>${ip.assets_under_management}</strong></span>` : ''}
${ip.performance_return ? `<span><span style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);display:block">Return</span><strong style="color:var(--coral)">${ip.performance_return}</strong></span>` : ''}
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
  const initials = name.split(' ').map((w: string) => w[0] || '').slice(0, 2).join('');
  const em       = v.edit_mode;
  const ed       = (p: string, ml = false) => em ? _editable(p, ml) : '';
  const edScript = em ? EDITOR_SCRIPT : '';

  let liHtml = '';
  if (v.linkedin_url)  liHtml += `<a class="hero-link secondary" href="${v.linkedin_url}" target="_blank" rel="noopener">LinkedIn</a>`;
  if (v.github_url)    liHtml += `<a class="hero-link secondary" href="${v.github_url}" target="_blank" rel="noopener">GitHub</a>`;
  if (v.portfolio_url) liHtml += `<a class="hero-link secondary" href="${v.portfolio_url}" target="_blank" rel="noopener">Portfolio</a>`;
  if (v.twitter_url)   liHtml += `<a class="hero-link secondary" href="${v.twitter_url}" target="_blank" rel="noopener">Twitter</a>`;

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
${item.url ? `<a href="${item.url}" style="font-size:.8rem;color:var(--coral);text-decoration:none;margin-top:8px;display:inline-block" target="_blank" rel="noopener">View &rarr;</a>` : ''}
</div>`;
        }).join('\n');
        const addBtn = em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : '';
        const inner = cs.display_type === 'cards'
          ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">${itemsHtml}</div>${addBtn}`
          : `<div style="display:flex;flex-direction:column;gap:1rem">${itemsHtml}</div>${addBtn}`;
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
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>${_CSS}</style>
</head>
<body>
<div class="blob-wrap" aria-hidden="true"><div class="blob blob1"></div><div class="blob blob2"></div><div class="blob blob3"></div></div>
<nav class="nav" aria-label="Site navigation">
  <span class="nav-brand">${initials}<span class="nav-coral">.</span></span>
  <div class="nav-links">
    ${v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
    ${v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener">GitHub</a>` : ''}
  </div>
</nav>
<header class="hero">
  <div class="hero-inner">
    <div class="hero-text">
      <p class="hero-eyebrow" aria-hidden="true">Available for opportunities</p>
      <h1 class="hero-name" ${ed('profile.full_name')}>${name}</h1>
      ${v.headline ? `<p class="hero-title" ${ed('profile.headline')}>${v.headline}</p>` : ''}
      ${v.location || v.phone ? `<p class="hero-meta"><span ${ed('profile.location')}>${v.location || ''}</span>${v.phone ? ` &bull; <span ${ed('profile.phone')}>${v.phone}</span>` : ''}</p>` : ''}
      ${liHtml ? `<div class="hero-links" style="margin-top:${v.phone || v.location ? '24px' : '0'}">${liHtml}</div>` : ''}
    </div>
    <div class="hero-avatar" aria-hidden="true">${initials}</div>
  </div>
</header>
<main class="page">
${aboutSec}
${contentSecs}
</main>
<footer class="footer">Built with AI &bull; Aurora Theme</footer>
${edScript}
</body>
</html>`;
}
