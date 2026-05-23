/**
 * Template: Luxe
 * High-end luxury editorial portfolio. Near-black (#0a0a0a) and warm white
 * (#fafafa) with gold (#c9a84c) accents. Cormorant Garant serif headlines,
 * light-weight sans body, asymmetric layouts, thin gold rule lines,
 * generous whitespace. Feels like Vogue or Wallpaper* magazine.
 *
 * NOTE: Values from NormalizedData are already HTML-escaped by normalize().
 */

import { type NormalizedData, DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const _CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:    #0a0a0a;
  --bg2:   #111111;
  --white: #fafafa;
  --gold:  #c9a84c;
  --gold2: #e8c97d;
  --text:  #fafafa;
  --muted: rgba(250,250,250,.5);
  --dim:   rgba(250,250,250,.2);
  --rule:  rgba(201,168,76,.2);
  --font-h:'Cormorant Garant',Georgia,serif;
  --font-b:'DM Sans',system-ui,sans-serif;
}

html{scroll-behavior:smooth}
body{
  background:var(--bg);color:var(--text);
  font-family:var(--font-b);font-size:16px;
  font-weight:300;line-height:1.75;
  overflow-x:hidden;
}

/* ── Hero ── */
.hero{
  min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;
  padding:60px 6vw 80px;
  position:relative;overflow:hidden;
  border-bottom:1px solid var(--rule);
}
.hero-bg-num{
  position:absolute;right:-0.04em;bottom:-0.12em;
  font-family:var(--font-h);font-size:clamp(18rem,35vw,40rem);
  font-weight:700;line-height:1;
  color:rgba(250,250,250,.025);
  pointer-events:none;user-select:none;
  letter-spacing:-.06em;
}
.hero-label{
  font-family:var(--font-b);font-size:.68rem;font-weight:500;
  letter-spacing:.3em;text-transform:uppercase;
  color:var(--gold);margin-bottom:32px;
  display:flex;align-items:center;gap:12px;
}
.hero-label::before{content:'';display:block;width:40px;height:1px;background:var(--gold)}
.hero-name{
  font-family:var(--font-h);
  font-size:clamp(3.5rem,9vw,8rem);
  font-weight:300;line-height:.95;
  letter-spacing:-.02em;
  color:var(--white);
  margin-bottom:28px;
}
.hero-name strong{font-weight:700;font-style:italic;color:var(--gold)}
.hero-title{
  font-family:var(--font-b);font-size:1rem;font-weight:300;
  color:var(--muted);letter-spacing:.06em;
  text-transform:uppercase;margin-bottom:40px;
}
.hero-links{display:flex;flex-wrap:wrap;gap:0;align-items:center}
.hero-link{
  font-family:var(--font-b);font-size:.72rem;font-weight:500;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--gold);text-decoration:none;
  padding:10px 24px;border:1px solid var(--rule);
  margin-right:-1px;
  transition:background .25s,color .25s;
}
.hero-link:first-child{padding-left:0;border-left:none}
.hero-link:hover{background:rgba(201,168,76,.08);color:var(--gold2)}

/* ── Layout ── */
.page{max-width:960px;margin:0 auto;padding:80px 6vw 120px}

/* ── Sections ── */
section{margin-bottom:72px}
.sec-head{
  display:grid;grid-template-columns:120px 1fr;gap:24px;
  align-items:start;margin-bottom:40px;
}
.sec-label{
  font-family:var(--font-b);font-size:.65rem;font-weight:500;
  letter-spacing:.3em;text-transform:uppercase;color:var(--gold);
  padding-top:10px;
}
.sec-title{
  font-family:var(--font-h);font-size:clamp(1.8rem,4vw,2.8rem);
  font-weight:300;font-style:italic;color:var(--white);
  border-bottom:1px solid var(--rule);padding-bottom:16px;
  line-height:1.1;
}

/* ── Cards ── */
.card-grid{display:grid;grid-template-columns:120px 1fr;gap:24px;margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid rgba(250,250,250,.06);align-items:start}
.card-grid:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.card-left{font-family:var(--font-b);font-size:.78rem;font-weight:300;color:var(--muted);letter-spacing:.04em;line-height:1.6;padding-top:4px}
.card-right{}
.card-title{font-family:var(--font-h);font-size:1.3rem;font-weight:600;color:var(--white);margin-bottom:6px;line-height:1.2}
.card-sub{font-family:var(--font-b);font-size:.85rem;color:var(--gold);margin-bottom:8px;letter-spacing:.04em}
.card-body{font-size:.9rem;color:var(--muted);line-height:1.8}
.card-list{margin:10px 0 0 16px;font-size:.88rem;color:var(--muted);line-height:1.8}
.card-list li{margin-bottom:4px}

/* ── About ── */
.about-text{font-family:var(--font-h);font-size:1.25rem;font-weight:300;color:var(--muted);line-height:1.85;margin-bottom:16px}
.about-pull{font-family:var(--font-h);font-size:1.8rem;font-weight:300;font-style:italic;color:var(--white);line-height:1.3;margin-bottom:20px}
.about-meta{font-size:.8rem;color:var(--dim);letter-spacing:.08em;text-transform:uppercase}

/* ── Skills ── */
.skill-row{display:grid;grid-template-columns:120px 1fr;gap:24px;margin-bottom:20px;align-items:start}
.skill-label{font-family:var(--font-b);font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);padding-top:6px}
.tag-row{display:flex;flex-wrap:wrap;gap:8px}
.tag{
  display:inline-block;
  padding:4px 16px;
  border:1px solid var(--rule);
  font-family:var(--font-b);font-size:.78rem;font-weight:300;
  color:var(--muted);letter-spacing:.06em;
  transition:border-color .2s,color .2s;
}
.tag:hover{border-color:var(--gold);color:var(--gold)}

/* ── Projects ── */
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:var(--rule)}
.proj-card{background:var(--bg);padding:28px;position:relative}
.proj-title{font-family:var(--font-h);font-size:1.15rem;font-weight:600;color:var(--white);margin-bottom:8px}
.proj-desc{font-size:.88rem;color:var(--muted);line-height:1.8;margin-bottom:12px}
.proj-link{
  font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;
  color:var(--gold);text-decoration:none;
  border-bottom:1px solid var(--rule);padding-bottom:2px;
  transition:border-color .2s;margin-right:16px;
}
.proj-link:hover{border-color:var(--gold)}

/* ── Certs ── */
.cert-list{display:flex;flex-direction:column;gap:1px;background:var(--rule)}
.cert-row{background:var(--bg);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:18px 24px}
.cert-name,.cert-link{font-family:var(--font-h);font-size:1rem;font-weight:400;color:var(--white)}
.cert-link{color:var(--gold);text-decoration:none}
.cert-link:hover{text-decoration:underline;text-decoration-color:var(--gold)}
.cert-meta{font-size:.8rem;color:var(--muted);letter-spacing:.04em}
.yr{font-size:.78rem;color:var(--muted)}

/* ── Footer ── */
.footer{text-align:center;padding:40px;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);border-top:1px solid var(--rule)}

@media(max-width:640px){
  .hero{min-height:auto;padding:80px 24px 60px}
  .sec-head,.card-grid,.skill-row{grid-template-columns:1fr}
  .sec-label,.skill-label{padding-top:0}
  .proj-grid{grid-template-columns:1fr;background:none;gap:1px}
  .proj-card{background:var(--bg2)}
}
`;

function _section(label: string, title: string, content: string, counter: { n: number }): string {
  if (!content.trim()) return '';
  counter.n += 1;
  const num = String(counter.n).padStart(2, '0');
  return `<section>
<div class="sec-head">
  <span class="sec-label">&mdash;&nbsp;${num}&nbsp;&mdash;</span>
  <h2 class="sec-title">${title}</h2>
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
  if (v.headline) parts.push(`<p class="about-pull" ${ed('portfolio.headline', true)}>${v.headline}</p>`);
  if (v.bio)      parts.push(`<p class="about-text" ${ed('portfolio.bio', true)}>${v.bio}</p>`);
  const meta = [v.location, v.email, v.phone].filter(Boolean).join('&ensp;&mdash;&ensp;');
  if (meta) parts.push(`<p class="about-meta">${meta}</p>`);
  return parts.join('');
}

function _skills(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const groups = v.skill_groups || [];
  if (!groups.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const tags = (g.skills || []).map((t: string) => `<span class="tag">${t}</span>`).join('');
    out += `<div class="skill-row"${iw}>${del('skills', i)}
<span class="skill-label" ${ed(`skills.${i}.category`)}>${g.category || ''}</span>
<div class="tag-row" ${led(`skills.${i}.skills`)}>${tags}</div>
</div>`;
  }
  out += add('skills', 'Skill Group');
  return out;
}

function _experience(v: NormalizedData): string {
  const { ed, led, del, add, iw } = _em(v.edit_mode);
  const items = v.experience || [];
  if (!items.length && !v.edit_mode) return '';
  let out = '';
  for (let i = 0; i < items.length; i++) {
    const exp = items[i];
    const pts = (exp.key_points || []);
    const ptsHtml = pts.length ? `<ul class="card-list" ${led(`experience.${i}.key_points`)}>${pts.map((p: string) => `<li>${p}</li>`).join('')}</ul>` : '';
    out += `<div class="card-grid"${iw}>${del('experience', i)}
<div class="card-left"><span ${ed(`experience.${i}.company`)}>${exp.company || ''}</span><br/>${exp.duration || ''}</div>
<div class="card-right">
  <div class="card-title" ${ed(`experience.${i}.role`)}>${exp.role || ''}</div>
  ${exp.location ? `<div class="card-sub">${exp.location}</div>` : ''}
  ${exp.description ? `<p class="card-body" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
  ${ptsHtml}
</div>
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
    const meta = [titleParts.length ? edu.institution : '', edu.location].filter(Boolean).join(', ');
    out += `<div class="card-grid"${iw}>${del('education', i)}
<div class="card-left">${edu.year_range || ''}${edu.grade_or_score ? `<br/>${edu.grade_or_score}` : ''}</div>
<div class="card-right">
  <div class="card-title" ${ed(`education.${i}.degree`)}>${title}</div>
  ${meta ? `<div class="card-sub">${meta}</div>` : ''}
</div>
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
    out += `<div class="proj-card"${iw}>${del('projects', i)}
<div class="proj-title" ${ed(`projects.${i}.title`)}>${p.title || ''}</div>
${p.description ? `<p class="proj-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${tags ? `<div class="tag-row" ${led(`projects.${i}.tech_stack`)} style="margin-bottom:12px">${tags}</div>` : ''}
${links}
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
    out += `<div class="cert-row"${iw}>${del('certifications', i)}${label}${meta ? `<span class="cert-meta">${meta}</span>` : ''}</div>`;
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
    out += `<div class="card-grid"${iw}>${del('achievements', i)}
<div class="card-left">${a.year || ''}</div>
<div class="card-right">
  <div class="card-title" ${ed(`achievements.${i}.title`)}>${a.title || ''}</div>
  ${a.description ? `<p class="card-body" ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>
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
    out += `<div class="cert-row"${iw}>${del('awards', i)}${label}${meta ? `<span class="cert-meta">${meta}</span>` : ''}</div>`;
  }
  out += `</div>${add('awards', 'Award')}`;
  return out;
}

function _design_philosophy(v: NormalizedData): string {
  const { ed } = _em(v.edit_mode);
  const dp = v.design_philosophy || '';
  return dp ? `<blockquote style="font-family:var(--font-h);font-size:1.3rem;font-weight:300;font-style:italic;color:var(--muted);line-height:1.8;border-left:1px solid var(--gold);padding-left:24px" ${ed('design_philosophy', true)}>${dp}</blockquote>` : '';
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
    out += `<div class="card-grid"${iw}>${del('campaigns', i)}
<div class="card-left">${c.campaign_type || ''}<br/>${c.budget || ''}</div>
<div class="card-right">
  <div class="card-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || ''}</div>
  ${chTags ? `<div class="tag-row" style="margin:8px 0">${chTags}</div>` : ''}
  ${metrics ? `<ul class="card-list" ${led(`campaigns.${i}.performance_metrics`)}>${metrics}</ul>` : ''}
</div>
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
    out += `<div class="card-grid"${iw}>${del('financial_modeling', i)}
<div class="card-left">${toolTags ? `<div class="tag-row" ${led(`financial_modeling.${i}.tools_used`)}>${toolTags}</div>` : ''}</div>
<div class="card-right">
  <div class="card-title" ${ed(`financial_modeling.${i}.model_type`)}>${fm.model_type || ''}</div>
  ${fm.outcome ? `<p class="card-body" ${ed(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : ''}
</div>
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
    out += `<div class="card-grid"${iw}>${del('investment_portfolios', i)}
<div class="card-left">${ip.assets_under_management ? `AUM<br/><strong style="color:var(--gold)">${ip.assets_under_management}</strong>` : ''}</div>
<div class="card-right">
  <div class="card-title" ${ed(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type || ''}</div>
  ${ip.performance_return ? `<div class="card-sub">Return: ${ip.performance_return}</div>` : ''}
</div>
</div>`;
  }
  out += add('investment_portfolios', 'Portfolio');
  return out;
}

const _RENDERERS: Record<string, [string, string, (v: NormalizedData) => string]> = {
  experience:            ['Work',         'Experience',            _experience],
  projects:              ['Work',         'Projects',              _projects],
  skills:                ['Expertise',    'Skills',                _skills],
  education:             ['Background',   'Education',             _education],
  certifications:        ['Credentials',  'Certifications',        _certifications],
  achievements:          ['Recognition',  'Achievements',          _achievements],
  awards:                ['Honours',      'Awards',                _awards],
  campaigns:             ['Campaigns',    'Campaigns',             _campaigns],
  financial_modeling:    ['Models',       'Financial Modeling',    _financial_modeling],
  investment_portfolios: ['Portfolios',   'Investment Portfolios', _investment_portfolios],
  design_philosophy:     ['Philosophy',   'Design Philosophy',     _design_philosophy],
  software_proficiency:  ['Tools',        'Software Proficiency',  _software_proficiency],
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
  const aboutSec = _section('About', 'Profile', _about(v), counter);

  const contentSecs = order.flatMap(key => {
    if (hidden.has(key)) return [];
    if (key === 'custom_sections') {
      return (v.custom_sections ?? []).filter(cs => cs.items?.length || em).map((cs, csIdx) => {
        const itemsHtml = (cs.items ?? []).map((item, i) => {
          const del = em ? `<button class="ce-del-btn" data-del-section="custom_sections" data-del-index="${i}">&#x2715;</button>` : '';
          return `<div class="card-grid" style="position:relative">${del}
<div class="card-left">${item.subtitle || ''}</div>
<div class="card-right">
${item.label ? `<div class="card-title">${item.label}</div>` : ''}
${item.value ? `<p class="card-body">${item.value}</p>` : ''}
${item.tags?.length ? `<div class="tag-row" style="margin-top:10px">${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" style="font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);text-decoration:none;margin-top:8px;display:inline-block;border-bottom:1px solid var(--rule);padding-bottom:2px" target="_blank" rel="noopener">View</a>` : ''}
</div>
</div>`;
        }).join('\n');
        const addBtn = em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : '';
        return _section('Custom', cs.title, `<div>${itemsHtml}</div>${addBtn}`, counter);
      });
    }
    if (key in _RENDERERS) {
      const [label, title, renderer] = _RENDERERS[key];
      return [_section(label, title, renderer(v), counter)];
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
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>${_CSS}</style>
</head>
<body>
<header class="hero">
  <div class="hero-bg-num" aria-hidden="true">01</div>
  <div>
    <p class="hero-label">Portfolio</p>
    <h1 class="hero-name" ${ed('profile.full_name')}>${name}</h1>
    ${v.headline ? `<p class="hero-title" ${ed('profile.headline')}>${v.headline}</p>` : ''}
    ${v.location || v.phone ? `<p class="hero-title" style="margin-top:-24px;margin-bottom:32px;font-size:.82rem"><span ${ed('profile.location')}>${v.location || ''}</span>${v.phone ? `&ensp;&mdash;&ensp;<span ${ed('profile.phone')}>${v.phone}</span>` : ''}</p>` : ''}
    ${liHtml ? `<div class="hero-links">${liHtml}</div>` : ''}
  </div>
</header>
<main class="page">
${aboutSec}
${contentSecs}
</main>
<footer class="footer">Built with AI &mdash; Luxe Theme</footer>
${edScript}
</body>
</html>`;
}
