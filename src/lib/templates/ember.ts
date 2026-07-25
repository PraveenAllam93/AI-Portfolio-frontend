/**
 * Template: Ember (Designer)
 * Dark cinematic "film" aesthetic — near-black canvas (#0c0b09), rust (#b8402f)
 * + brass (#c9a35a) accents, Bricolage Grotesque display, Inter body, JetBrains
 * Mono EXIF labels. Film-strip sprocket rails, grain cover hero, framed photo,
 * contact-sheet project grid, mono timeline, scroll reveals, nav-scroll.
 * Ported from "desginer-5.html", mapped to our designer data model
 * (external stock images dropped; skill % bars → tool chips per Z16;
 * renders every designer section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}
const SVC_ICONS = ['◐', '◇', '❖', '◆', '⬡', '✦', '❋', '◈'];

function css(): string {
	return `
:root{
  --bg:#0c0b09;--bg-alt:#141210;--panel:#18160f;--ink:#f3efe6;--ink-soft:#b3ab9a;--ink-faint:#686253;
  --line:#2b271f;--accent:#b8402f;--accent-soft:#8f3225;--brass:#c9a35a;--ease:cubic-bezier(.65,0,.35,1);
  --bri:'Bricolage Grotesque',sans-serif;--inter:'Inter',sans-serif;--mono:'JetBrains Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--inter);-webkit-font-smoothing:antialiased;overflow-x:hidden}
::selection{background:var(--accent);color:#fff}
a{color:inherit;text-decoration:none}
ul{list-style:none}
img{display:block;max-width:100%}
button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
::-webkit-scrollbar{width:9px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--line)}

.exif{font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;color:var(--ink-faint);text-transform:uppercase}
.exif span{color:var(--brass)}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);display:flex;align-items:center;gap:10px}
.eyebrow::before{content:'';width:22px;height:1px;background:var(--accent)}
.eyebrow .count{color:var(--ink-faint)}

.sprockets{position:fixed;top:0;bottom:0;width:22px;z-index:60;background:#050504;background-image:repeating-linear-gradient(to bottom,transparent 0 14px,var(--bg) 14px 26px);background-size:8px 26px;background-position:center 14px;background-repeat:repeat-y}
.sprockets.left{left:0}.sprockets.right{right:0}
@media(max-width:860px){.sprockets{display:none}}

.topnav{position:fixed;top:0;left:22px;right:22px;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:26px 48px;transition:background .4s var(--ease),padding .4s var(--ease),border-color .4s var(--ease);border-bottom:1px solid transparent}
.topnav.scrolled{background:rgba(12,11,9,.88);backdrop-filter:blur(10px);padding:16px 48px;border-color:var(--line)}
.logo{font-family:var(--bri);font-size:19px;font-weight:600;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}
.logo .dot{width:6px;height:6px;border-radius:50%;background:var(--accent)}
.nav-links{display:flex;gap:36px}
.nav-links a{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);position:relative;padding-bottom:4px;transition:color .3s}
.nav-links a:hover{color:var(--ink)}
.nav-cta{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--ink-faint);padding:10px 20px;transition:.3s var(--ease)}
.nav-cta:hover{background:var(--ink);color:var(--bg);border-color:var(--ink)}
@media(max-width:860px){.nav-links,.nav-cta{display:none}}

.reveal{opacity:0;transform:translateY(30px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.reveal.in{opacity:1;transform:translateY(0)}
main{margin:0 22px}
section{padding:130px 64px;border-bottom:1px solid var(--line);position:relative}
section.alt{background:var(--bg-alt)}
@media(max-width:860px){section{padding:100px 26px}main{margin:0}}
.section-head{max-width:660px;margin-bottom:64px}
.section-title{font-family:var(--bri);font-size:clamp(32px,3.8vw,50px);font-weight:600;letter-spacing:-.02em;margin-top:16px;line-height:1.1}
.section-title em{font-style:normal;color:var(--accent)}

/* HOME */
#home{min-height:100vh;padding:0;display:flex;align-items:flex-end;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0;background:linear-gradient(160deg,#1a140f,#0c0b09)}
.hero-bg img{width:100%;height:100%;object-fit:cover;filter:grayscale(.25) brightness(.55) contrast(1.1)}
.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,11,9,.15) 0%,rgba(12,11,9,.55) 60%,rgba(12,11,9,.96) 100%)}
.hero-content{position:relative;z-index:1;padding:0 64px 90px;width:100%}
.hero-title{font-family:var(--bri);font-size:clamp(52px,8.5vw,120px);font-weight:600;letter-spacing:-.03em;line-height:.98;margin-top:20px}
.hero-title .acc{color:var(--accent);font-style:italic;font-weight:400}
.hero-sub{display:flex;justify-content:space-between;align-items:flex-end;margin-top:34px;flex-wrap:wrap;gap:24px;border-top:1px solid var(--line);padding-top:26px}
.hero-desc{font-size:15px;color:var(--ink-soft);max-width:420px;line-height:1.7}
.hero-exif{display:flex;gap:26px;flex-wrap:wrap}
@media(max-width:860px){.hero-content{padding:0 26px 60px}}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:70px;align-items:start}
.film-frame{position:relative;border:1px solid var(--line);padding:14px;background:var(--panel)}
.film-frame .frame-inner{position:relative;aspect-ratio:3/4;overflow:hidden;background:linear-gradient(160deg,#26201a,#141210)}
.film-frame img{width:100%;height:100%;object-fit:cover;filter:grayscale(.5);transition:.6s var(--ease)}
.film-frame:hover img{filter:grayscale(0);transform:scale(1.03)}
.film-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--bri);font-size:3rem;color:var(--ink-faint)}
.film-frame .sprocket-row{display:flex;justify-content:space-between;padding:10px 4px 0}
.film-frame .sprocket-row span{width:9px;height:6px;background:var(--bg)}
.about-lead{font-family:var(--bri);font-size:24px;font-weight:400;line-height:1.5}
.about-lead em{font-style:normal;color:var(--accent)}
.about-copy{margin-top:20px;font-size:15px;line-height:1.9;color:var(--ink-soft);max-width:560px}
.stat-row{display:flex;gap:0;margin-top:40px;border-top:1px solid var(--line);flex-wrap:wrap}
.stat{flex:1;min-width:120px;padding:24px 20px 0;border-right:1px solid var(--line)}
.stat:last-child{border-right:none}
.stat-num{font-family:var(--bri);font-size:36px;font-weight:600;color:var(--brass)}
.stat-label{margin-top:6px;font-size:11.5px;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em}
@media(max-width:860px){.about-grid{grid-template-columns:1fr;gap:40px}}

/* SERVICES (skills) */
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.service-card{background:var(--panel);padding:38px 30px;transition:background .3s var(--ease);position:relative}
.service-card:hover{background:#201c14}
.service-index{font-family:var(--mono);font-size:11px;color:var(--ink-faint);display:block;margin-bottom:20px}
.service-icon{font-size:1.8rem;color:var(--accent);margin-bottom:18px}
.service-title{font-family:var(--bri);font-size:19px;font-weight:600;margin-bottom:14px}
.service-tags{display:flex;flex-wrap:wrap;gap:.4rem}
.svc-tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);border:1px solid var(--line);padding:.3rem .6rem}

/* TOOL CLOUD (software proficiency) */
.tool-cloud{display:flex;flex-wrap:wrap;gap:10px;margin-top:1rem}
.tool-chip{font-size:12.5px;padding:10px 18px;border:1px solid var(--line);color:var(--ink-soft);transition:.25s var(--ease)}
.tool-chip:hover{border-color:var(--accent);color:var(--ink)}

/* TIMELINE */
.timeline{position:relative;max-width:800px;padding-left:40px}
.timeline::before{content:'';position:absolute;left:0;top:6px;bottom:6px;width:1px;background:var(--line)}
.t-item{position:relative;padding-bottom:48px}
.t-item:last-child{padding-bottom:0}
.t-item::before{content:'';position:absolute;left:-40px;top:4px;width:9px;height:9px;border-radius:50%;background:var(--bg);border:1.5px solid var(--accent)}
.t-year{font-family:var(--mono);font-size:11px;color:var(--brass);margin-bottom:8px;display:block}
.t-title{font-family:var(--bri);font-size:22px;font-weight:600;margin-bottom:6px}
.t-sub{font-size:13px;color:var(--ink-soft);margin-bottom:12px}
.t-desc{font-size:14px;line-height:1.75;color:var(--ink-soft);max-width:560px}
.t-kps{margin-top:10px;padding-left:1rem;list-style:none}
.t-kp{font-size:13.5px;line-height:1.7;color:var(--ink-soft);position:relative}
.t-kp::before{content:'—';position:absolute;left:-1rem;color:var(--accent)}

/* WORK contact sheet (projects) */
.contact-sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--line);border:1px solid var(--line)}
.frame{position:relative;aspect-ratio:1/1;overflow:hidden;background:var(--panel)}
.frame>img{width:100%;height:100%;object-fit:cover;filter:grayscale(.65) contrast(1.05);transition:transform .7s var(--ease),filter .5s var(--ease)}
.frame:hover>img{transform:scale(1.06);filter:grayscale(0)}
.frame-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--bri);font-size:2rem;color:var(--ink-faint)}
.frame-num{position:absolute;top:12px;left:12px;font-family:var(--mono);font-size:10px;color:var(--brass);background:rgba(0,0,0,.55);padding:3px 7px;z-index:2}
.frame-overlay{position:absolute;inset:0;background:rgba(0,0,0,.65);display:flex;flex-direction:column;justify-content:flex-end;gap:6px;opacity:0;transition:opacity .35s var(--ease);padding:20px}
.frame:hover .frame-overlay{opacity:1}
.f-cat{font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--brass)}
.f-title{font-family:var(--bri);font-size:18px;font-weight:600}
.f-desc{font-size:12px;color:var(--ink-soft);line-height:1.5}
.f-tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:4px}
.f-tag{font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);border:1px solid var(--ink-faint);padding:.2rem .4rem}
.f-link{margin-top:6px;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brass)}
@media(max-width:860px){.contact-sheet{grid-template-columns:repeat(2,1fr)}}

/* CARD GRID (certs/achievements) */
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.d-card{background:var(--panel);padding:32px 28px;position:relative;transition:background .3s}
.d-card:hover{background:#201c14}
.d-card-year{font-family:var(--mono);font-size:11px;color:var(--brass);margin-bottom:12px;display:block}
.d-card-name{font-family:var(--bri);font-size:18px;font-weight:600;margin-bottom:6px}
.d-card-org{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-faint)}
.d-card-desc{font-size:13px;color:var(--ink-soft);line-height:1.7;margin-top:8px}
.d-card-link{display:inline-block;margin-top:10px;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brass);border-bottom:1px solid var(--brass)}

/* AWARDS rows */
.awards-list{max-width:900px}
.award-row{display:grid;grid-template-columns:1fr auto auto;gap:2rem;align-items:baseline;padding:22px 0;border-bottom:1px solid var(--line);position:relative}
.award-row:first-child{border-top:1px solid var(--line)}
.award-title{font-family:var(--bri);font-size:20px;font-weight:500}
.award-body{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint)}
.award-year{font-family:var(--mono);font-size:11px;color:var(--brass)}
@media(max-width:860px){.award-row{grid-template-columns:1fr;gap:.4rem}}

/* PHILOSOPHY */
.philo{font-family:var(--bri);font-style:italic;font-size:clamp(24px,3vw,38px);font-weight:400;line-height:1.4;max-width:20ch;color:var(--ink)}
.philo em{font-style:normal;color:var(--accent)}
.cs-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:8px}

/* CONTACT */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px}
.contact-info-item{margin-bottom:30px}
.contact-info-item h5{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:10px}
.contact-info-item p,.contact-info-item a{font-family:var(--bri);font-size:20px;font-weight:600}
.contact-info-item a:hover{color:var(--accent)}
.contact-social{display:flex;gap:12px;flex-wrap:wrap;margin-top:1rem}
.contact-social a{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--line);padding:10px 18px;transition:.25s var(--ease)}
.contact-social a:hover{border-color:var(--accent);color:var(--accent)}
@media(max-width:860px){.contact-grid{grid-template-columns:1fr;gap:40px}}

footer{padding:40px 64px;display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:11px;color:var(--ink-faint);flex-wrap:wrap;gap:14px;margin:0 22px}
footer a:hover{color:var(--accent)}

/* EDIT CONTROLS */
.ce-add-btn{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);background:none;border:1px solid var(--ink-faint);padding:14px 30px;cursor:pointer;transition:.3s var(--ease);margin-top:32px;display:block;width:100%;text-align:center}
.ce-add-btn:hover{background:var(--ink);color:var(--bg)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:50%;border:none;background:var(--accent);color:#fff;font-size:12px;line-height:26px;text-align:center;cursor:pointer;z-index:20;padding:0}
.frame .ce-del-btn{top:10px;right:10px}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const EMBER_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('.topnav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);});}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(r){io.observe(r);});
})();
<\/script>`;

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const hidden = v.hidden_sections;
	const order = v.section_order ?? DEFAULT_SECTION_ORDER;
	const ed = (path: string, multi = false): string => em ? _editable(path, multi) : '';
	const le = (path: string): string => em ? _listEditable(path) : '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const yearsExp = v.template_overrides?.years_experience ?? yearsFromExperience(v.experience);
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const pubCount = v.certifications?.length ?? 0;
	const exhCount = v.awards?.length ?? 0;
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'D';
	const nameParts = v.name.split(/\s+/);
	const heroTitle = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')}<br><span class="acc">${nameParts[nameParts.length - 1]}</span>`
		: `<span class="acc">${v.name}</span>`;

	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const s = edu.start_year || em, e = edu.end_year || em;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year || 'Start'}</span>` : '';
		const b = e ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year || 'End'}</span>` : '';
		return `${a}${s && e ? ' — ' : ''}${b}`;
	};
	const expPeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const s = exp.start_date || em, e = exp.end_date || em;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date || 'Start'}</span>` : '';
		const b = e ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date || 'End'}</span>` : '';
		return `${a}${s && e ? ' — ' : ''}${b}`;
	};
	let secN = 0;
	const nn = () => `0${++secN} / 10`;

	// PROJECTS (contact sheet)
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects" class="alt">
<div class="section-head reveal"><span class="eyebrow">Selected Work <span class="count">${nn()}</span></span><h2 class="section-title">The <em>contact sheet</em>.</h2></div>
<div class="contact-sheet">
${v.projects.map((p, i) => `<div class="frame reveal"${iw} ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>
${delBtn('projects', i)}
<div class="frame-num">${String(i + 1).padStart(2, '0')}</div>
${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="frame-ph">${initials}</div>`}
<div class="frame-overlay">
${p.project_category ? `<div class="f-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
<div class="f-title" ${ed(`projects.${i}.title`)}>${p.title || 'Project'}</div>
${p.description ? `<div class="f-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</div>` : ''}
${p.responsibilities?.length ? `<div class="f-desc" ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `• ${r}`).join('<br>')}</div>` : ''}
${p.measurable_outcomes?.length ? `<div class="f-desc" ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `• ${o}`).join('<br>')}</div>` : ''}
${p.tech_stack?.length ? `<div class="f-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="f-tag">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="f-tags" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="f-tag">${t}</span>`).join('')}</div>` : ''}
${p.project_url ? `<a href="${p.project_url}" class="f-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>` : '';

	// SKILLS (services grid)
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills">
<div class="section-head reveal"><span class="eyebrow">Capabilities <span class="count">${nn()}</span></span><h2 class="section-title">What I <em>bring</em>.</h2></div>
<div class="services-grid">
${v.skill_groups.map((g, gi) => `<div class="service-card reveal"${iw}>
${delBtn('skills', gi)}
<span class="service-index">${String(gi + 1).padStart(2, '0')}</span>
<div class="service-icon">${SVC_ICONS[gi % SVC_ICONS.length]}</div>
<div class="service-title" ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
<div class="service-tags" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="svc-tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency" class="alt">
<div class="section-head reveal"><span class="eyebrow">Toolkit <span class="count">${nn()}</span></span><h2 class="section-title">Tools of the <em>trade</em>.</h2></div>
<div class="tool-cloud reveal" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map(t => `<span class="tool-chip">${t}</span>`).join('') || `<span class="tool-chip" style="opacity:.5">+ Add</span>`}</div>
</section>` : '';

	// EXPERIENCE (timeline)
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience">
<div class="section-head reveal"><span class="eyebrow">Experience <span class="count">${nn()}</span></span><h2 class="section-title">The working <em>life</em>.</h2></div>
<div class="timeline">
${v.experience.map((exp, i) => `<div class="t-item reveal"${iw}>
${delBtn('experience', i)}
<span class="t-year">${expPeriod(i, exp)}</span>
<div class="t-title" ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}</div>
${(exp.company || exp.location) ? `<div class="t-sub">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.company && exp.location ? ' · ' : ''}${exp.location ? `<span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="t-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<ul class="t-kps" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li class="t-kp">${k}</li>`).join('')}</ul>` : ''}
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>` : '';

	// EDUCATION (timeline)
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="alt">
<div class="section-head reveal"><span class="eyebrow">Education <span class="count">${nn()}</span></span><h2 class="section-title">Where it <em>began</em>.</h2></div>
<div class="timeline">
${v.education.map((edu, i) => `<div class="t-item reveal"${iw}>
${delBtn('education', i)}
<span class="t-year">${eduYears(i, edu)}</span>
<div class="t-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
${(edu.institution || edu.location) ? `<div class="t-sub">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.institution && edu.location ? ' · ' : ''}${edu.location ? `<span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<div class="t-desc"><span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span></div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications">
<div class="section-head reveal"><span class="eyebrow">Credentials <span class="count">${nn()}</span></span><h2 class="section-title">Formally <em>recognised</em>.</h2></div>
<div class="card-grid">
${v.certifications.map((c, i) => `<div class="d-card"${iw}>
${delBtn('certifications', i)}
${c.year ? `<span class="d-card-year" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
<div class="d-card-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="d-card-org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.url ? `<a href="${c.url}" class="d-card-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="alt">
<div class="section-head reveal"><span class="eyebrow">Milestones <span class="count">${nn()}</span></span><h2 class="section-title">Moments that <em>mattered</em>.</h2></div>
<div class="card-grid">
${v.achievements.map((a, i) => `<div class="d-card"${iw}>
${delBtn('achievements', i)}
${a.year ? `<span class="d-card-year" ${ed(`achievements.${i}.year`)}>${a.year}</span>` : ''}
<div class="d-card-name" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="d-card-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>` : '';

	// AWARDS
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards">
<div class="section-head reveal"><span class="eyebrow">Honours <span class="count">${nn()}</span></span><h2 class="section-title">Awards &amp; <em>prizes</em>.</h2></div>
<div class="awards-list">
${(v.awards ?? []).map((a, i) => `<div class="award-row"${iw}>
${delBtn('awards', i)}
<div class="award-title" ${ed(`awards.${i}.title`)}>${a.title}</div>
<div class="award-body" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body || ''}</div>
<div class="award-year" ${ed(`awards.${i}.year`)}>${a.year || ''}</div>
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</section>` : '';

	// DESIGN PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy" class="alt">
<div class="section-head reveal"><span class="eyebrow">Philosophy <span class="count">${nn()}</span></span><h2 class="section-title">The <em>why</em>.</h2></div>
<p class="philo reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="d-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<span class="d-card-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}
${item.label ? `<div class="d-card-name" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="d-card-desc" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="cs-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="svc-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="d-card-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}">
<div class="section-head reveal"><span class="eyebrow">${cs.title} <span class="count">${nn()}</span></span><h2 class="section-title">${cs.title}</h2></div>
<div class="card-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		experience: experienceHtml, projects: projectsHtml, skills: skillsHtml,
		design_philosophy: philoHtml, software_proficiency: softwareHtml, awards: awardsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// ABOUT stats
	const aboutStats = [
		statShown(v, 'years_experience', yearsExp) ? `<div class="stat"><div class="stat-num" ${ed('template_overrides.years_experience')}>${yearsExp}+</div><div class="stat-label">Years</div></div>` : '',
		statShown(v, 'projects_count', projCount) ? `<div class="stat"><div class="stat-num" ${ed('template_overrides.projects_count')}>${projCount}</div><div class="stat-label">Projects</div></div>` : '',
		pubCount > 0 ? `<div class="stat"><div class="stat-num">${pubCount}</div><div class="stat-label">Certifications</div></div>` : '',
		exhCount > 0 ? `<div class="stat"><div class="stat-num">${exhCount}</div><div class="stat-label">Awards</div></div>` : '',
	].filter(Boolean).join('');

	// CONTACT
	const cInfo = [
		v.email ? `<div class="contact-info-item"><h5>Email</h5><a href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a></div>` : '',
		v.phone ? `<div class="contact-info-item"><h5>Phone</h5><a href="tel:${v.phone}" ${ed('profile.phone')}>${v.phone}</a></div>` : '',
		v.location ? `<div class="contact-info-item"><h5>Based in</h5><p ${ed('profile.location')}>${v.location}</p></div>` : '',
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Instagram</a>` : '',
	].filter(Boolean).join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Designer Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div class="sprockets left"></div>
<div class="sprockets right"></div>
<nav class="topnav">
<div class="logo"><span class="dot"></span><span ${ed('profile.full_name')}>${v.name}</span></div>
<div class="nav-links">
<a href="#about">About</a>
<a href="#projects">Work</a>
<a href="#skills">Skills</a>
<a href="#experience">Experience</a>
<a href="#contact">Contact</a>
</div>
${v.email ? `<a href="mailto:${v.email}" class="nav-cta">Get in touch</a>` : ''}
</nav>

<main>
<section id="home">
<div class="hero-bg" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</div>
<div class="hero-content reveal">
<span class="eyebrow">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Designer'}</span>
<h1 class="hero-title" ${ed('profile.full_name')}>${heroTitle}</h1>
<div class="hero-sub">
${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : '<span></span>'}
<div class="hero-exif"><span class="exif">F/<span>2.8</span></span><span class="exif">1/<span>250</span>s</span><span class="exif">ISO <span>200</span></span><span class="exif">35<span>mm</span></span></div>
</div>
</div>
</section>

<section id="about">
<div class="section-head reveal"><span class="eyebrow">About <span class="count">01 / 10</span></span><h2 class="section-title">Behind the <em>lens</em>.</h2></div>
<div class="about-grid">
<div class="film-frame reveal" ${_imgUpload('profile.profile_image', em)}>
<div class="frame-inner">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="film-ph">${initials}</div>`}</div>
<div class="sprocket-row"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
</div>
<div class="reveal">
${v.uniqueValue ? `<p class="about-lead" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${v.bio ? `<p class="about-copy" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${aboutStats ? `<div class="stat-row">${aboutStats}</div>` : ''}
</div>
</div>
</section>

${orderedSections}

<section id="contact">
<div class="section-head reveal"><span class="eyebrow">Contact</span><h2 class="section-title">Let's <em>collaborate</em>.</h2></div>
<div class="contact-grid">
<div class="reveal">${cInfo}</div>
<div class="reveal">${socials ? `<div class="contact-social">${socials}</div>` : ''}</div>
</div>
</section>
</main>

<footer>
<span>&copy; ${new Date().getFullYear()} ${v.name}</span>
<span>${v.profile_headline || v.headline || 'Designer Portfolio'}</span>
</footer>
${EMBER_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
