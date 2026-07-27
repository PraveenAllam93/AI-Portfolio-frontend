/**
 * Template: Clean Slate (Designer)
 * Modern clean dark aesthetic — #0a0a0a bg, #c8f560 lime + #7effc4 cyan accents.
 * Syne (display) + DM Sans (body). Custom cursor (publish-only), fade animations.
 * Designed for the `designer` profession category.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = exp.duration.match(/^(\d{4})/);
		if (m) { const y = parseInt(m[1], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}

function css(): string {
	return `
:root{
  --bg:#0a0a0a;--bg2:#111111;--bg3:#161616;--card:#1a1a1a;
  --border:rgba(255,255,255,0.07);--accent:#c8f560;--accent2:#7effc4;
  --text:#f0ede6;--muted:#8a8680;
  --font-display:'Syne',sans-serif;--font-body:'DM Sans',sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);font-weight:300;line-height:1.65;overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--accent);color:#000}
/* cursor */
.cs-cursor{position:fixed;top:0;left:0;z-index:9999;pointer-events:none}
.cs-cursor-dot{width:8px;height:8px;background:var(--accent);border-radius:50%;transform:translate(-50%,-50%);transition:width .2s,height .2s,background .2s}
.cs-cursor-ring{width:36px;height:36px;border:1.5px solid rgba(200,245,96,0.4);border-radius:50%;transform:translate(-50%,-50%);transition:all .12s ease-out}
@media(hover:none){.cs-cursor{display:none}}
/* nav */
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:24px 60px;backdrop-filter:blur(24px);background:rgba(10,10,10,0.7);border-bottom:1px solid var(--border);animation:fadeDown .8s ease both}
@keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
.nav-logo{font-family:var(--font-display);font-size:1.15rem;font-weight:800;letter-spacing:-.02em;display:flex;align-items:center;gap:8px}
.nav-logo-dot{display:inline-block;width:8px;height:8px;background:var(--accent);border-radius:50%;animation:pulse 2s ease infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(0.85)}}
.nav-links{display:flex;gap:36px;list-style:none}
.nav-links a{font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--accent)}
.nav-cta{font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;font-weight:500;color:#000;background:var(--accent);padding:10px 22px;border-radius:100px;transition:background .2s,transform .2s}
.nav-cta:hover{background:var(--accent2);transform:scale(1.03)}
@media(max-width:768px){nav{padding:18px 24px}.nav-links{display:none}}
/* hero */
#hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 60px 80px;overflow:hidden;position:relative}
.hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 60% 60% at 70% 30%,rgba(200,245,96,.06) 0%,transparent 70%),radial-gradient(ellipse 40% 50% at 20% 80%,rgba(126,255,196,.05) 0%,transparent 60%)}
.hero-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)}
.hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:.75rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);border:1px solid rgba(200,245,96,.25);padding:7px 16px;border-radius:100px;margin-bottom:32px;animation:fadeUp .8s .2s ease both;position:relative;z-index:1}
.hero-badge::before{content:'';width:6px;height:6px;background:var(--accent);border-radius:50%;animation:pulse 2s ease infinite}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.hero-title{font-family:var(--font-display);font-size:clamp(3.5rem,9vw,8.5rem);font-weight:800;line-height:.92;letter-spacing:-.03em;position:relative;z-index:1;animation:fadeUp .9s .35s ease both}
.hero-title .line{display:block;overflow:hidden}
.hero-title em{font-style:normal;color:transparent;-webkit-text-stroke:1.5px rgba(240,237,230,.35)}
.hero-title .acc{color:var(--accent)}
.hero-bottom{display:flex;align-items:flex-end;justify-content:space-between;margin-top:48px;position:relative;z-index:1;animation:fadeUp 1s .5s ease both}
.hero-desc{max-width:380px;font-size:1rem;color:var(--muted);line-height:1.7}
.hero-stats{display:flex;gap:48px}
.stat-item{text-align:right}
.stat-num{font-family:var(--font-display);font-size:2.4rem;font-weight:700;color:var(--text);line-height:1}
.stat-label{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:4px}
.scroll-hint{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);z-index:1}
.scroll-line{width:1px;height:48px;background:linear-gradient(to bottom,var(--accent),transparent);animation:scrollAnim 2s ease infinite}
@keyframes scrollAnim{0%{opacity:0;transform:scaleY(0);transform-origin:top}50%{opacity:1;transform:scaleY(1)}100%{opacity:0;transform:scaleY(1);transform-origin:bottom}}
@media(max-width:768px){#hero{padding:0 24px 70px}.hero-bottom{flex-direction:column;gap:32px}.hero-stats{gap:28px}}
/* shared section */
.section-wrap{max-width:1200px;margin:0 auto;padding:120px 60px}
.section-label{display:inline-flex;align-items:center;gap:10px;font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:500;margin-bottom:20px}
.section-label::before{content:'';display:block;width:24px;height:1px;background:var(--accent)}
.section-title{font-family:var(--font-display);font-size:clamp(2rem,4vw,3.5rem);font-weight:800;letter-spacing:-.02em;line-height:1.05;margin-bottom:64px}
@media(max-width:768px){.section-wrap{padding:80px 24px}.section-title{margin-bottom:40px}}
/* education */
#education{background:var(--bg2)}
.edu-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.edu-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:36px;position:relative;overflow:hidden;transition:border-color .3s,transform .3s}
.edu-card:hover{border-color:rgba(200,245,96,.3);transform:translateY(-4px)}
.edu-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:0;transition:opacity .3s}
.edu-card:hover::before{opacity:1}
.edu-year{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);font-weight:500;margin-bottom:16px}
.edu-degree{font-family:var(--font-display);font-size:1.3rem;font-weight:700;margin-bottom:8px}
.edu-school{font-size:.9rem;color:var(--muted);margin-bottom:16px}
.edu-gpa{position:absolute;top:32px;right:32px;font-family:var(--font-display);font-size:.72rem;font-weight:700;background:rgba(200,245,96,.12);color:var(--accent);padding:6px 12px;border-radius:100px;letter-spacing:.06em}
@media(max-width:768px){.edu-grid{grid-template-columns:1fr}}
/* work experience */
#work{background:var(--bg)}
.work-list{display:flex;flex-direction:column}
.work-item{display:grid;grid-template-columns:200px 1fr;gap:48px;padding:40px 0;border-bottom:1px solid var(--border);position:relative;transition:all .3s}
.work-item:first-child{border-top:1px solid var(--border)}
.work-period{font-size:.78rem;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;line-height:1.5}
.work-type{display:inline-block;margin-top:10px;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);border:1px solid rgba(200,245,96,.25);padding:4px 10px;border-radius:100px}
.work-role{font-family:var(--font-display);font-size:1.4rem;font-weight:700;letter-spacing:-.01em}
.work-company{font-size:.9rem;color:var(--accent);margin-top:4px}
.work-desc{font-size:.9rem;color:var(--muted);line-height:1.75;margin:14px 0 20px;max-width:560px}
.work-tags{display:flex;flex-wrap:wrap;gap:8px}
.work-tag{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:rgba(255,255,255,.05);padding:5px 12px;border-radius:6px}
@media(max-width:768px){.work-item{grid-template-columns:1fr;gap:18px}}
/* projects / case studies */
#projects{background:var(--bg3)}
.case-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.case-featured{grid-column:span 2}
.case-card{background:var(--card);border:1px solid var(--border);border-radius:24px;overflow:hidden;transition:transform .35s,border-color .3s;position:relative}
.case-card:hover{transform:translateY(-6px);border-color:rgba(200,245,96,.25)}
.case-thumb{height:260px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.case-featured .case-thumb{height:380px}
.case-thumb-bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:6rem;transition:transform .5s}
.case-card:hover .case-thumb-bg{transform:scale(1.08)}
.bg-a{background:linear-gradient(135deg,#1a2a1a,#0d1f15)}
.bg-b{background:linear-gradient(135deg,#1a1a2a,#0d0d20)}
.bg-c{background:linear-gradient(135deg,#2a1a1a,#1f0d0d)}
.case-num{position:absolute;top:24px;left:24px;font-family:var(--font-display);font-size:.7rem;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.3)}
.case-chip{position:absolute;top:24px;right:24px;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);background:rgba(200,245,96,.12);border:1px solid rgba(200,245,96,.2);padding:5px 12px;border-radius:100px}
.case-body{padding:28px 32px 32px}
.case-category{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.case-title{font-family:var(--font-display);font-size:1.3rem;font-weight:700;margin-bottom:12px;line-height:1.2}
.case-featured .case-title{font-size:2rem}
.case-excerpt{font-size:.88rem;color:var(--muted);line-height:1.7;margin-bottom:24px}
.case-link{display:inline-flex;align-items:center;gap:8px;font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);font-weight:500;transition:gap .2s}
.case-link:hover{gap:12px}
@media(max-width:768px){.case-grid{grid-template-columns:1fr}.case-featured{grid-column:span 1}.case-featured .case-thumb{height:260px}.case-featured .case-title{font-size:1.3rem}}
/* skills */
#skills{background:var(--bg2)}
.skills-groups{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:32px}
.skill-group-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px}
.skill-group-name{font-family:var(--font-display);font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:20px}
.skill-tags{display:flex;flex-wrap:wrap;gap:10px}
.skill-tag{font-size:.8rem;color:var(--text);background:rgba(255,255,255,.06);border:1px solid var(--border);padding:7px 14px;border-radius:8px;transition:border-color .2s,color .2s}
.skill-tag:hover{border-color:rgba(200,245,96,.35);color:var(--accent)}
/* design philosophy */
#design-philosophy{background:var(--bg)}
.philosophy-text{font-family:var(--font-display);font-size:clamp(1.3rem,3vw,2.2rem);font-weight:400;line-height:1.4;color:var(--text);max-width:70ch;font-style:italic}
/* software proficiency */
#software-proficiency{background:var(--bg3)}
.tools-wrap{display:flex;flex-wrap:wrap;gap:14px}
.tool-pill{font-size:.82rem;letter-spacing:.06em;color:var(--text);background:rgba(200,245,96,.08);border:1px solid rgba(200,245,96,.2);padding:10px 20px;border-radius:100px;transition:background .2s,border-color .2s}
.tool-pill:hover{background:rgba(200,245,96,.15);border-color:var(--accent)}
/* awards */
#awards{background:var(--bg2)}
.award-row{display:flex;align-items:baseline;gap:28px;padding:22px 0;border-bottom:1px solid var(--border);transition:background .3s;position:relative}
.award-row:first-child{border-top:1px solid var(--border)}
.award-title{font-family:var(--font-display);font-size:1.1rem;font-weight:700;flex:1}
.award-body{font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.award-year{font-size:.8rem;color:var(--accent);font-weight:500;min-width:50px;text-align:right}
.award-link{color:var(--accent);font-size:.8rem;margin-left:8px;opacity:.7;transition:opacity .2s}
.award-link:hover{opacity:1}
/* education within section */
/* certifications */
#certifications{background:var(--bg)}
.cert-list{display:flex;flex-direction:column;gap:16px}
.cert-item{display:flex;align-items:center;gap:20px;padding:20px 24px;background:var(--card);border:1px solid var(--border);border-radius:14px;position:relative;transition:border-color .25s}
.cert-item:hover{border-color:rgba(200,245,96,.3)}
.cert-dot{width:10px;height:10px;border-radius:50%;background:var(--accent);flex-shrink:0}
.cert-name{font-family:var(--font-display);font-size:1rem;font-weight:700}
.cert-issuer{font-size:.82rem;color:var(--muted);margin-top:3px}
.cert-year{font-size:.8rem;color:var(--accent);margin-left:auto;flex-shrink:0}
/* achievements */
#achievements{background:var(--bg2)}
.ach-list{display:flex;flex-direction:column;gap:0}
.ach-row{padding:20px 0;border-bottom:1px solid var(--border);display:flex;align-items:baseline;gap:24px;position:relative}
.ach-row:first-child{border-top:1px solid var(--border)}
.ach-title{font-family:var(--font-display);font-size:1rem;font-weight:700;flex:1}
.ach-desc{font-size:.85rem;color:var(--muted);line-height:1.6;margin-top:4px}
.ach-year{font-size:.8rem;color:var(--accent);flex-shrink:0}
/* custom sections */
.cs-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:48px}
.cs-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;position:relative;transition:border-color .25s}
.cs-card:hover{border-color:rgba(200,245,96,.3)}
.cs-card h3{font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:8px}
.cs-card p{font-size:.85rem;color:var(--muted);line-height:1.6}
.cs-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.cs-chip{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:rgba(255,255,255,.05);padding:4px 10px;border-radius:6px}
.cs-list{display:flex;flex-direction:column;gap:0;margin-top:32px}
.cs-list-row{display:flex;align-items:baseline;gap:20px;padding:16px 0;border-bottom:1px solid var(--border);position:relative}
.cs-list-row:first-child{border-top:1px solid var(--border)}
.cs-tl{display:flex;flex-direction:column;gap:0;margin-top:32px}
.cs-tl-row{display:grid;grid-template-columns:140px 1fr;gap:24px;padding:20px 0;border-bottom:1px solid var(--border);position:relative}
.cs-tl-row:first-child{border-top:1px solid var(--border)}
.cs-tl-sub{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
.cs-tl-label{font-family:var(--font-display);font-size:1rem;font-weight:700}
.cs-tl-val{font-size:.85rem;color:var(--muted);line-height:1.6;margin-top:6px}
/* contact */
#contact{background:var(--bg)}
.contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.contact-intro{font-size:1rem;color:var(--muted);line-height:1.75;max-width:380px;margin-bottom:48px}
.contact-links{display:flex;flex-direction:column;gap:20px}
.contact-link-item{display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--card);border:1px solid var(--border);border-radius:16px;transition:border-color .3s,transform .2s}
.contact-link-item:hover{border-color:rgba(200,245,96,.35);transform:translateX(6px)}
.contact-icon{width:40px;height:40px;border-radius:50%;background:rgba(200,245,96,.1);border:1px solid rgba(200,245,96,.2);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.contact-link-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:2px}
.contact-link-value{font-size:.95rem;color:var(--text)}
.contact-form-title{font-family:var(--font-display);font-size:1.8rem;font-weight:800;letter-spacing:-.02em;margin-bottom:32px}
@media(max-width:768px){.contact-wrap{grid-template-columns:1fr;gap:48px}}
/* footer */
footer{background:var(--bg2);border-top:1px solid var(--border);padding:40px 60px;display:flex;align-items:center;justify-content:space-between}
.footer-name{font-family:var(--font-display);font-size:1rem;font-weight:800}
.footer-copy{font-size:.8rem;color:var(--muted)}
@media(max-width:768px){footer{padding:28px 24px;flex-direction:column;gap:12px;text-align:center}}
/* editing */
[contenteditable]:hover{outline:2px dashed rgba(99,102,241,.45);border-radius:3px}
[contenteditable]:focus{outline:2px solid rgba(99,102,241,.85);border-radius:3px}
`;
}

function customSectionsHtml(v: NormalizedData, em: boolean): string {
	const hidden = v.hidden_sections;
	if (hidden.has('custom_sections') && !em) return '';
	if (!v.custom_sections?.length && !em) return '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number) =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string) =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	return (v.custom_sections ?? []).map((cs, csIdx) => {
		if (!cs.items?.length && !em) return '';
		let inner = '';
		if (cs.display_type === 'cards') {
			inner = `<div class="cs-cards">
${(cs.items ?? []).map((item, i) => `<div class="cs-card"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
${item.label ? `<h3 ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</h3>` : ''}
${item.subtitle ? `<p class="cert-issuer" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</p>` : ''}
${item.value ? `<p ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</p>` : ''}
${item.tags?.length ? `<div class="cs-tags" ${em ? _listEditable(`custom_sections.${csIdx}.items.${i}.tags`) : ''}>${item.tags.map(t => `<span class="cs-chip">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="case-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
		} else if (cs.display_type === 'timeline') {
			inner = `<div class="cs-tl">
${(cs.items ?? []).map((item, i) => `<div class="cs-tl-row"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
<div>${item.subtitle ? `<div class="cs-tl-sub" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</div>` : ''}</div>
<div>
${item.label ? `<div class="cs-tl-label" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</div>` : ''}
${item.value ? `<div class="cs-tl-val" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="cs-tags" ${em ? _listEditable(`custom_sections.${csIdx}.items.${i}.tags`) : ''}>${item.tags.map(t => `<span class="cs-chip">${t}</span>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
		} else {
			inner = `<div class="cs-list">
${(cs.items ?? []).map((item, i) => `<div class="cs-list-row"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
<div style="flex:1">
${item.label ? `<div class="ach-title" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</div>` : ''}
${item.value ? `<div class="ach-desc" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</div>` : ''}
</div>
${item.subtitle ? `<div class="ach-year" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</div>` : ''}
</div>`).join('\n')}
</div>${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
		}
		return `<section id="${cs.section_id}" style="background:var(--bg)">
<div class="section-wrap">
<div class="section-label">Custom</div>
<h2 class="section-title" ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</h2>
${inner}
</div>
</section>`;
	}).filter(Boolean).join('\n');
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const hidden = v.hidden_sections;
	const order = v.section_order ?? DEFAULT_SECTION_ORDER;
	const ed = (path: string, multi = false): string => em ? _editable(path, multi) : '';
	const le = (path: string): string => em ? _listEditable(path) : '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const yearsExp = v.template_overrides?.years_experience ?? yearsFromExperience(v.experience);
	const projectsCount = v.template_overrides?.projects_count ?? v.projects.length;
	const clientsCount = v.template_overrides?.clients_count ?? Math.max(3, v.experience.length + 2);

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = !hidden.has('education') && (v.education.length || em)
		? `<section id="education">
<div class="section-wrap">
<div class="section-label">Formation</div>
<h2 class="section-title">Academic <span style="color:var(--accent)">Background</span></h2>
<div class="edu-grid">
${v.education.map((edu, i) => `<div class="edu-card"${iw}>
${delBtn('education', i)}
${edu.grade_or_score ? `<div class="edu-gpa" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
<div class="edu-year">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : ''}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : ''}</div>
<div class="edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
<div class="edu-school" ${ed(`education.${i}.institution`)}>${edu.institution}</div>
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div>
</section>`
		: '';

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = !hidden.has('experience') && (v.experience.length || em)
		? `<section id="work">
<div class="section-wrap">
<div class="section-label">Career</div>
<h2 class="section-title">Work <span style="color:var(--accent)">Experience</span></h2>
<div class="work-list">
${v.experience.map((exp, i) => `<div class="work-item"${iw}>
${delBtn('experience', i)}
<div class="work-left">
<div class="work-period">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : ''}${(exp.start_date && exp.end_date) ? ' — ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : ''}</div>
${exp.company ? `<div class="work-type" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
</div>
<div class="work-right">
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
<div>
<div class="work-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
${exp.company ? `<div class="work-company" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
</div>
<div style="width:40px;height:40px;border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--muted);flex-shrink:0">→</div>
</div>
${exp.description ? `<div class="work-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<div class="work-tags" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(kp => `<span class="work-tag">${kp}</span>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div>
</section>`
		: '';

	// ── PROJECTS ──────────────────────────────────────────────────────────────
	const projectsHtml = !hidden.has('projects') && (v.projects.length || em)
		? `<section id="projects">
<div class="section-wrap">
<div class="section-label">Portfolio</div>
<h2 class="section-title">Case <span style="color:var(--accent)">Studies</span></h2>
<div class="case-grid">
${v.projects.map((p, i) => {
	const isFeatured = i === 0 ? ' case-featured' : '';
	const bgs = ['bg-a', 'bg-b', 'bg-c'];
	const emojis = ['🎨', '✦', '◈', '⬡', '◉'];
	return `<div class="case-card${isFeatured}"${iw}>
${delBtn('projects', i)}
<div class="case-thumb" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}>
${p.images?.[0]
		? `<img src="${p.images[0]}" alt="${p.title}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy">`
		: `<div class="case-thumb-bg ${bgs[i % 3]}"><span>${emojis[i % 5]}</span></div>`}
<div class="case-num">0${i + 1}</div>
${p.project_category ? `<span class="case-chip">${p.project_category}</span>` : (p.tech_stack?.[0] ? `<span class="case-chip">${p.tech_stack[0]}</span>` : '')}
</div>
<div class="case-body">
${p.project_category ? `<div class="case-category" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
<div class="case-title" ${ed(`projects.${i}.title`)}>${p.title || (em ? 'Project' : '')}</div>
${p.description ? `<p class="case-excerpt" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
<div style="display:flex;align-items:center;justify-content:space-between">
${p.tech_stack?.length ? `<div class="work-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="work-tag">${t}</span>`).join('')}</div>` : '<div></div>'}
${p.project_url ? `<a href="${p.project_url}" class="case-link" target="_blank" rel="noopener noreferrer">View <span>→</span></a>` : ''}
</div>
</div>
</div>`;
}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</div>
</section>`
		: '';

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = !hidden.has('skills') && (v.skill_groups.length || em)
		? `<section id="skills">
<div class="section-wrap">
<div class="section-label">Capabilities</div>
<h2 class="section-title">Skills &amp; <span style="color:var(--accent)">Expertise</span></h2>
<div class="skills-groups">
${v.skill_groups.map((g, gi) => `<div class="skill-group-card">
<div class="skill-group-name" ${ed(`skills.${gi}.category`)}>${g.category}</div>
<div class="skill-tags" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
</div>
</section>`
		: '';

	// ── DESIGN PHILOSOPHY ─────────────────────────────────────────────────────
	const designPhilosophyHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design-philosophy">
<div class="section-wrap">
<div class="section-label">Philosophy</div>
<h2 class="section-title">Design <span style="color:var(--accent)">Thinking</span></h2>
<p class="philosophy-text" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</div>
</section>`
		: '';

	// ── SOFTWARE PROFICIENCY ─────────────────────────────────────────────────
	const softwareProficiencyHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software-proficiency">
<div class="section-wrap">
<div class="section-label">Toolkit</div>
<h2 class="section-title">Software <span style="color:var(--accent)">Proficiency</span></h2>
<div class="tools-wrap" ${le('software_proficiency')}>
${(v.software_proficiency ?? []).map(t => `<span class="tool-pill">${t}</span>`).join('')}
</div>
${em ? '<p style="font-size:12px;color:var(--muted);margin-top:14px;font-family:var(--font-body)">Click to edit list</p>' : ''}
</div>
</section>`
		: '';

	// ── AWARDS ────────────────────────────────────────────────────────────────
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards">
<div class="section-wrap">
<div class="section-label">Recognition</div>
<h2 class="section-title">Awards &amp; <span style="color:var(--accent)">Honors</span></h2>
<div>
${(v.awards ?? []).map((a, i) => `<div class="award-row"${iw}>
${delBtn('awards', i)}
<div class="award-title" ${ed(`awards.${i}.title`)}>${a.title}</div>
<div class="award-body" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>
<div class="award-year" ${ed(`awards.${i}.year`)}>${a.year}</div>
${a.url ? `<a href="${a.url}" class="award-link" target="_blank" rel="noopener noreferrer">↗</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</div>
</section>`
		: '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certificationsHtml = !hidden.has('certifications') && (v.certifications.length || em)
		? `<section id="certifications">
<div class="section-wrap">
<div class="section-label">Credentials</div>
<h2 class="section-title">Certifications &amp; <span style="color:var(--accent)">Training</span></h2>
<div class="cert-list">
${v.certifications.map((c, i) => `<div class="cert-item"${iw}>
${delBtn('certifications', i)}
<div class="cert-dot"></div>
<div style="flex:1">
<div class="cert-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="cert-issuer" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
</div>
${c.year ? `<div class="cert-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div>
</section>`
		: '';

	// ── ACHIEVEMENTS ─────────────────────────────────────────────────────────
	const achievementsHtml = !hidden.has('achievements') && (v.achievements.length || em)
		? `<section id="achievements">
<div class="section-wrap">
<div class="section-label">Milestones</div>
<h2 class="section-title">Key <span style="color:var(--accent)">Achievements</span></h2>
<div class="ach-list">
${v.achievements.map((a, i) => `<div class="ach-row"${iw}>
${delBtn('achievements', i)}
<div style="flex:1">
<div class="ach-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="ach-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>
${a.year ? `<div class="ach-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div>
</section>`
		: '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customSections = customSectionsHtml(v, em);

	// ── SECTION ORDER ─────────────────────────────────────────────────────────
	const sectionRenderers: Record<string, string> = {
		experience: experienceHtml,
		projects: projectsHtml,
		skills: skillsHtml,
		education: educationHtml,
		design_philosophy: designPhilosophyHtml,
		software_proficiency: softwareProficiencyHtml,
		awards: awardsHtml,
		certifications: certificationsHtml,
		achievements: achievementsHtml,
		custom_sections: customSections,
	};

	const orderedSections = order
		.filter(key => !hidden.has(key) && key in sectionRenderers)
		.map(key => sectionRenderers[key])
		.filter(Boolean)
		.join('\n');

	// ── CURSOR + JS (runs in both edit preview and published page) ────────────
	const cursorCss = 'body{cursor:none}';
	const cursorHtml = `<div class="cs-cursor" id="cs-cursor"><div class="cs-cursor-dot" id="cs-dot"></div></div>
<div style="position:fixed;top:0;left:0;pointer-events:none;z-index:9998" id="cs-ring"><div class="cs-cursor-ring"></div></div>`;
	const interactiveJs = `<script>
(function(){
  var dot=document.getElementById('cs-dot'),ring=document.getElementById('cs-ring');
  if(!dot)return;
  var mx=0,my=0;
  window.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    dot.parentElement.style.transform='translate('+mx+'px,'+my+'px)';
    ring.style.transform='translate('+(mx-18)+'px,'+(my-18)+'px)';
  });
})();
(function(){
  var els=document.querySelectorAll('[data-reveal]');
  function check(){var vh=window.innerHeight;els.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<vh*.9)el.style.opacity='1';});}
  window.addEventListener('scroll',check,{passive:true});
  check();
})();
</script>`;

	// ── SOCIAL LINKS ─────────────────────────────────────────────────────────
	const socialLinks = [
		{ url: v.linkedin_url, icon: '💼', label: 'LinkedIn', val: v.linkedin_url },
		{ url: v.github_url, icon: '⌨', label: 'GitHub', val: v.github_url },
		{ url: v.portfolio_url, icon: '🔗', label: 'Portfolio', val: v.portfolio_url },
		{ url: v.twitter_url, icon: '✦', label: 'Twitter', val: v.twitter_url },
	].filter(l => l.url);

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Designer Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}${cursorCss}</style>
${em ? EDITOR_SCRIPT : ''}
</head>
<body>
${cursorHtml}

<!-- NAV -->
<nav>
<a href="#hero" class="nav-logo">
<span class="nav-logo-dot"></span>
<span ${ed('profile.full_name')}>${v.name}</span>
</a>
<ul class="nav-links">
<li><a href="#work">Experience</a></li>
<li><a href="#projects">Projects</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
${v.email ? `<a href="mailto:${v.email}" class="nav-cta">Hire me</a>` : ''}
</nav>

<!-- HERO -->
<section id="hero">
<div class="hero-bg"></div>
<div class="hero-grid"></div>
<div class="hero-badge">
${v.location ? `<span ${ed('profile.location')}>${v.location}</span>` : ''}
</div>
<h1 class="hero-title">
<span class="line" ${ed('profile.full_name')}>${v.name}</span>
<span class="line">${(v.headline || v.profile_headline) ? `<em ${ed(v.headline ? 'portfolio.headline' : 'profile.headline')}>${v.headline || v.profile_headline}</em> &amp; ` : ''}<span class="acc">Creator</span></span>
</h1>
<div class="hero-bottom">
${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="hero-stats">
${statShown(v, 'years_experience', yearsExp) ? `<div class="stat-item">
<div class="stat-num" ${ed('template_overrides.years_experience')}>${yearsExp}+</div>
<div class="stat-label">Years active</div>
</div>` : ''}
${statShown(v, 'projects_count', projectsCount) ? `<div class="stat-item">
<div class="stat-num" ${ed('template_overrides.projects_count')}>${projectsCount}+</div>
<div class="stat-label">Projects</div>
</div>` : ''}
${statShown(v, 'clients_count', clientsCount) ? `<div class="stat-item">
<div class="stat-num" ${ed('template_overrides.clients_count')}>${clientsCount}+</div>
<div class="stat-label">Clients</div>
</div>` : ''}
</div>
</div>
<div class="scroll-hint">
<span>scroll</span>
<div class="scroll-line"></div>
</div>
</section>

<!-- ORDERED SECTIONS -->
${orderedSections}

<!-- CONTACT -->
<section id="contact">
<div class="section-wrap">
<div class="section-label">Get in touch</div>
<h2 class="section-title">Let's <span style="color:var(--accent)">Collaborate</span></h2>
<div class="contact-wrap">
<div class="contact-left">
${v.uniqueValue ? `<p class="contact-intro" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : (em ? `<p class="contact-intro" ${ed('portfolio.uniqueValue', true)}>Add your unique value proposition.</p>` : '')}
<div class="contact-links">
${v.email ? `<a href="mailto:${v.email}" class="contact-link-item">
<div class="contact-icon">✉</div>
<div><div class="contact-link-label">Email</div><div class="contact-link-value" ${ed('profile.email')}>${v.email}</div></div>
</a>` : ''}
${v.phone ? `<a href="tel:${v.phone}" class="contact-link-item">
<div class="contact-icon">📞</div>
<div><div class="contact-link-label">Phone</div><div class="contact-link-value" ${ed('profile.phone')}>${v.phone}</div></div>
</a>` : ''}
${socialLinks.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="contact-link-item">
<div class="contact-icon">${l.icon}</div>
<div><div class="contact-link-label">${l.label}</div><div class="contact-link-value">${l.val}</div></div>
</a>`).join('\n')}
</div>
</div>
</div>
</div>
</section>

<!-- FOOTER -->
<footer>
<span class="footer-name" ${ed('profile.full_name')}>${v.name}</span>
<span class="footer-copy">&copy; ${new Date().getFullYear()} · Designer Portfolio</span>
</footer>

${interactiveJs}
</body>
</html>`;
}
