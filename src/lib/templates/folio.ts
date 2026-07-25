/**
 * Template: Folio (Designer)
 * Light editorial with a fixed left sidebar — cream canvas (#f4f2ec), forest-green
 * (#2f4a3d) + gold accents, Fraunces serif, Inter body, IBM Plex Mono labels.
 * Sidebar holds avatar, identity, section nav and socials; main column scrolls
 * with a ghost-word hero, stat grid, panel service cards, mono timeline, 2-up
 * work grid, scroll reveals.
 * Ported from "designe-6.html", mapped to our designer data model
 * (external stock images dropped; skill % bars → skill lists per Z16;
 * renders every designer section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}

function css(): string {
	return `
:root{
  --bg:#f4f2ec;--bg-alt:#ebe7dd;--panel:#fbfaf7;--ink:#17160f;--ink-soft:#5d594c;--ink-faint:#948e7b;
  --line:#dcd6c6;--accent:#2f4a3d;--accent-soft:#4c6b5a;--gold:#b5985a;--white:#fff;
  --sidebar-w:320px;--ease:cubic-bezier(.65,0,.35,1);
  --fr:'Fraunces',serif;--inter:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--inter);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden}
::selection{background:var(--accent);color:var(--white)}
a{color:inherit;text-decoration:none}
ul{list-style:none}
img{display:block;max-width:100%}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);display:flex;align-items:center;gap:10px}
.eyebrow::before{content:'';width:22px;height:1px;background:var(--accent);display:inline-block}
.eyebrow .count{color:var(--ink-faint)}
.shell{display:flex;min-height:100vh}

/* SIDEBAR */
.sidebar{width:var(--sidebar-w);flex-shrink:0;background:var(--panel);border-right:1px solid var(--line);position:fixed;top:0;left:0;bottom:0;padding:52px 40px 34px;display:flex;flex-direction:column;z-index:100;overflow-y:auto}
.brand-mark{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--ink-faint);text-transform:uppercase;margin-bottom:40px;display:flex;align-items:center;justify-content:space-between}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px rgba(47,74,61,.15)}
.avatar-wrap{position:relative;width:112px;height:112px;border-radius:50%;margin-bottom:24px;overflow:hidden;background:linear-gradient(160deg,var(--bg-alt),var(--line))}
.avatar-wrap img{width:100%;height:100%;object-fit:cover;border-radius:50%;border:1px solid var(--line)}
.avatar-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--fr);font-size:2.2rem;color:var(--ink-faint)}
.id-name{font-family:var(--fr);font-size:24px;font-weight:500;letter-spacing:-.01em;margin-bottom:4px}
.id-role{font-size:12.5px;color:var(--ink-soft);margin-bottom:34px}
.id-role span{color:var(--gold)}
.side-nav{display:flex;flex-direction:column;gap:2px;margin-bottom:auto}
.side-nav a{font-size:13px;color:var(--ink-soft);padding:10px 0;display:flex;align-items:center;gap:12px;transition:color .25s var(--ease),padding-left .25s var(--ease)}
.side-nav a .num{font-family:var(--mono);font-size:10px;color:var(--ink-faint);width:16px}
.side-nav a:hover{color:var(--ink);padding-left:4px}
.side-foot{padding-top:28px;border-top:1px solid var(--line);margin-top:28px}
.side-social{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.side-social a{font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--line);border-radius:20px;padding:6px 12px;transition:.25s var(--ease)}
.side-social a:hover{background:var(--accent);border-color:var(--accent);color:var(--white)}
.side-loc{font-size:11px;color:var(--ink-faint);line-height:1.6}

/* MAIN */
.main{margin-left:var(--sidebar-w);flex:1;min-width:0}
section{padding:120px 80px;position:relative;border-bottom:1px solid var(--line)}
section.alt{background:var(--bg-alt)}
.section-head{margin-bottom:60px;max-width:680px}
.section-title{font-family:var(--fr);font-size:clamp(32px,3.6vw,46px);font-weight:500;letter-spacing:-.01em;margin-top:14px;line-height:1.15}
.section-title em{font-style:italic;font-weight:400;color:var(--accent)}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.reveal.in{opacity:1;transform:translateY(0)}
@media(max-width:1100px){
  .sidebar{position:static;width:100%;height:auto;flex-direction:row;flex-wrap:wrap;align-items:center;gap:20px;padding:24px 28px;border-right:none;border-bottom:1px solid var(--line)}
  .avatar-wrap{width:56px;height:56px;margin-bottom:0}.id-role,.side-nav,.side-foot,.brand-mark{display:none}.id-name{margin-bottom:0}
  .main{margin-left:0}.shell{flex-direction:column}section{padding:80px 28px}
}

/* HOME */
#home{padding:0 80px;min-height:100vh;display:flex;align-items:center;border-bottom:1px solid var(--line)}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:60px;align-items:center;width:100%;padding:80px 0}
.hero-text .eyebrow{margin-bottom:26px}
.hero-title{font-family:var(--fr);font-size:clamp(46px,6vw,84px);line-height:1.02;font-weight:500;letter-spacing:-.02em}
.hero-title em{font-style:italic;font-weight:400;color:var(--accent)}
.hero-desc{font-size:16px;line-height:1.75;color:var(--ink-soft);max-width:440px;margin:28px 0 38px}
.hero-cta{display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.btn{font-family:var(--mono);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;padding:16px 30px;border:1px solid var(--ink);display:inline-flex;align-items:center;gap:10px;transition:.3s var(--ease)}
.btn:hover{background:var(--ink);color:var(--bg)}
.btn-ghost{border-color:transparent;color:var(--ink-soft)}
.btn-ghost:hover{background:none;color:var(--ink);text-decoration:underline}
.hero-visual{position:relative;aspect-ratio:4/5;width:100%}
.hero-ghost{position:absolute;top:-6%;left:-8%;font-family:var(--fr);font-size:clamp(70px,10vw,140px);font-style:italic;font-weight:300;color:transparent;-webkit-text-stroke:1px var(--ink-faint);opacity:.55;z-index:0;pointer-events:none;white-space:nowrap}
.hero-photo{position:relative;width:88%;margin-left:auto;height:100%;z-index:1;overflow:hidden;border:1px solid var(--line);background:linear-gradient(160deg,var(--bg-alt),var(--line))}
.hero-photo img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.05);transition:transform .6s var(--ease),filter .6s var(--ease)}
.hero-photo:hover img{transform:scale(1.035);filter:grayscale(.2)}
.hero-photo-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fr);font-size:4rem;color:var(--ink-faint)}
@media(max-width:1100px){#home{padding:0 28px}.hero-grid{grid-template-columns:1fr;gap:40px;padding:40px 0}.hero-visual{max-width:360px}}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:70px}
.about-lead{font-family:var(--fr);font-size:26px;line-height:1.5;font-weight:400;color:var(--ink)}
.about-lead em{color:var(--accent);font-style:italic}
.about-copy{margin-top:24px;font-size:15px;line-height:1.9;color:var(--ink-soft);max-width:520px}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line)}
.stat{background:var(--panel);padding:32px 28px}
.stat-num{font-family:var(--fr);font-size:42px;font-weight:500;color:var(--accent);line-height:1}
.stat-label{margin-top:10px;font-size:12px;letter-spacing:.04em;color:var(--ink-soft)}
@media(max-width:900px){.about-grid{grid-template-columns:1fr;gap:40px}}

/* SERVICES (skills) */
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.service-card{background:var(--panel);padding:42px;transition:background .3s var(--ease);position:relative}
.service-card:hover{background:var(--bg-alt)}
.service-num{font-family:var(--mono);font-size:11px;color:var(--ink-faint);display:block;margin-bottom:22px}
.service-icon{font-size:1.8rem;color:var(--accent);margin-bottom:18px}
.service-title{font-family:var(--fr);font-size:22px;font-weight:500;margin-bottom:14px}
.service-tags{display:flex;flex-wrap:wrap;gap:.4rem}
.svc-tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);border:1px solid var(--line);padding:.3rem .6rem}

/* TOOLS */
.tool-cloud{display:flex;flex-wrap:wrap;gap:12px}
.tool-chip{font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;padding:11px 20px;border:1px solid var(--line);color:var(--ink-soft);background:var(--panel);transition:.25s var(--ease)}
.tool-chip:hover{border-color:var(--accent);color:var(--accent)}

/* TIMELINE */
.timeline{position:relative;max-width:800px;padding-left:40px}
.timeline::before{content:'';position:absolute;left:0;top:6px;bottom:6px;width:1px;background:var(--line)}
.t-item{position:relative;padding-bottom:48px}
.t-item:last-child{padding-bottom:0}
.t-item::before{content:'';position:absolute;left:-40px;top:4px;width:9px;height:9px;border-radius:50%;background:var(--bg);border:1.5px solid var(--accent)}
.t-year{font-family:var(--mono);font-size:11px;color:var(--gold);margin-bottom:8px;display:block}
.t-title{font-family:var(--fr);font-size:22px;font-weight:500;margin-bottom:6px}
.t-sub{font-size:13px;color:var(--ink-soft);margin-bottom:12px}
.t-desc{font-size:14px;line-height:1.75;color:var(--ink-soft);max-width:560px}
.t-kps{margin-top:10px;padding-left:1rem;list-style:none}
.t-kp{font-size:13.5px;line-height:1.7;color:var(--ink-soft);position:relative}
.t-kp::before{content:'—';position:absolute;left:-1rem;color:var(--accent)}

/* WORK grid (projects) */
.work-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:40px 32px}
.work-card{position:relative}
.work-thumb{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--bg-alt);border:1px solid var(--line)}
.work-thumb img{width:100%;height:100%;object-fit:cover;filter:grayscale(.6);transition:.5s var(--ease)}
.work-card:hover .work-thumb img{filter:grayscale(0);transform:scale(1.03)}
.work-thumb-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fr);font-size:2.4rem;color:var(--ink-faint)}
.work-meta{display:flex;justify-content:space-between;align-items:baseline;margin-top:18px;gap:1rem}
.work-name{font-family:var(--fr);font-size:19px;font-weight:500}
.work-cat{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;color:var(--ink-faint);text-transform:uppercase;white-space:nowrap}
.work-desc{font-size:13.5px;color:var(--ink-soft);line-height:1.7;margin-top:10px}
.proj-pts{list-style:none;margin-top:.5rem;display:flex;flex-direction:column;gap:.3rem}
.proj-pts li{font-size:13px;color:var(--ink-soft);line-height:1.6;padding-left:.9rem;position:relative}
.proj-pts li::before{content:'—';position:absolute;left:0;color:var(--accent)}
.work-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:10px}
.work-tag{font-family:var(--mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);border:1px solid var(--line);padding:.25rem .5rem}
.work-link{display:inline-block;margin-top:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--accent)}

/* CERT / ACH card grid */
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.d-card{background:var(--panel);padding:32px 28px;position:relative;transition:background .3s}
.d-card:hover{background:var(--bg-alt)}
.d-card-year{font-family:var(--mono);font-size:11px;color:var(--gold);margin-bottom:12px;display:block}
.d-card-name{font-family:var(--fr);font-size:19px;font-weight:500;margin-bottom:6px}
.d-card-org{font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-faint)}
.d-card-desc{font-size:13px;color:var(--ink-soft);line-height:1.7;margin-top:8px}
.d-card-link{display:inline-block;margin-top:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--accent)}
.cs-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:8px}

/* AWARDS rows */
.awards-list{max-width:900px}
.award-row{display:grid;grid-template-columns:1fr auto auto;gap:2rem;align-items:baseline;padding:22px 0;border-bottom:1px solid var(--line);position:relative}
.award-row:first-child{border-top:1px solid var(--line)}
.award-title{font-family:var(--fr);font-size:20px;font-weight:500}
.award-body{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint)}
.award-year{font-family:var(--mono);font-size:11px;color:var(--gold)}
@media(max-width:768px){.award-row{grid-template-columns:1fr;gap:.4rem}}

/* PHILOSOPHY */
.philo{font-family:var(--fr);font-style:italic;font-size:clamp(24px,3vw,36px);font-weight:400;line-height:1.4;max-width:22ch;color:var(--ink)}
.philo em{font-style:normal;color:var(--accent)}

/* CONTACT */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px}
.contact-info-item{margin-bottom:30px}
.contact-info-item h5{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:10px}
.contact-info-item p,.contact-info-item a{font-family:var(--fr);font-size:20px;font-weight:500}
.contact-info-item a:hover{color:var(--accent)}
.contact-social{display:flex;gap:12px;flex-wrap:wrap;margin-top:1rem}
.contact-social a{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--line);padding:10px 18px;transition:.25s var(--ease)}
.contact-social a:hover{border-color:var(--accent);color:var(--accent)}
@media(max-width:900px){.contact-grid{grid-template-columns:1fr;gap:40px}}

footer{padding:40px 80px;display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:11px;color:var(--ink-faint);flex-wrap:wrap;gap:14px}
@media(max-width:1100px){footer{padding:40px 28px}}

/* EDIT CONTROLS */
.ce-add-btn{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);background:none;border:1px solid var(--ink);padding:14px 30px;cursor:pointer;transition:.3s var(--ease);margin-top:32px;display:block;width:100%;text-align:center}
.ce-add-btn:hover{background:var(--ink);color:var(--bg)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:50%;border:none;background:var(--ink);color:var(--white);font-size:12px;line-height:26px;text-align:center;cursor:pointer;z-index:20;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const FOLIO_SCRIPT = `<script>
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(r){io.observe(r);});
})();
<\/script>`;

const SVC_ICONS = ['◈', '◇', '❖', '◆', '⬡', '✦', '❋', '◐'];

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
	const awardsCount = v.awards?.length ?? 0;
	const certCount = v.certifications?.length ?? 0;
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'D';
	const nameParts = v.name.split(/\s+/);
	const heroTitle = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')} <em>${nameParts[nameParts.length - 1]}</em>`
		: `<em>${v.name}</em>`;

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

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="section-head reveal"><span class="eyebrow">Selected Work</span><h2 class="section-title">Recent <em>projects</em></h2></div>
<div class="work-grid">
${v.projects.map((p, i) => `<div class="work-card reveal"${iw}>
${delBtn('projects', i)}
<div class="work-thumb" ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="work-thumb-ph">${initials}</div>`}</div>
<div class="work-meta"><div class="work-name" ${ed(`projects.${i}.title`)}>${p.title || 'Project'}</div>${p.project_category ? `<div class="work-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}</div>
${p.description ? `<p class="work-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${p.responsibilities?.length ? `<ul class="proj-pts" ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
${p.measurable_outcomes?.length ? `<ul class="proj-pts" ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul>` : ''}
${p.tech_stack?.length ? `<div class="work-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="work-tag">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="work-tags" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="work-tag">${t}</span>`).join('')}</div>` : ''}
${p.project_url ? `<a href="${p.project_url}" class="work-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>` : '';

	// SKILLS (services)
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" class="alt"><div class="section-head reveal"><span class="eyebrow">Capabilities</span><h2 class="section-title">Craft &amp; <em>services</em></h2></div>
<div class="services-grid">
${v.skill_groups.map((g, gi) => `<div class="service-card reveal"${iw}>
${delBtn('skills', gi)}
<span class="service-num">${String(gi + 1).padStart(2, '0')}</span>
<div class="service-icon">${SVC_ICONS[gi % SVC_ICONS.length]}</div>
<div class="service-title" ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
<div class="service-tags" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="svc-tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency"><div class="section-head reveal"><span class="eyebrow">Toolkit</span><h2 class="section-title">Software, <em>mastered</em></h2></div>
<div class="tool-cloud reveal" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map(t => `<span class="tool-chip">${t}</span>`).join('') || `<span class="tool-chip" style="opacity:.5">+ Add</span>`}</div>
</section>` : '';

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="section-head reveal"><span class="eyebrow">Experience</span><h2 class="section-title">A working <em>life</em></h2></div>
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

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="alt"><div class="section-head reveal"><span class="eyebrow">Education</span><h2 class="section-title">Where it <em>began</em></h2></div>
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
		? `<section id="certifications"><div class="section-head reveal"><span class="eyebrow">Credentials</span><h2 class="section-title">Formally <em>recognised</em></h2></div>
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
		? `<section id="achievements" class="alt"><div class="section-head reveal"><span class="eyebrow">Milestones</span><h2 class="section-title">Moments that <em>mattered</em></h2></div>
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
		? `<section id="awards"><div class="section-head reveal"><span class="eyebrow">Honours</span><h2 class="section-title">Awards &amp; <em>prizes</em></h2></div>
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

	// PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy" class="alt"><div class="section-head reveal"><span class="eyebrow">Philosophy</span><h2 class="section-title">The <em>why</em></h2></div>
<p class="philo reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</section>` : '';

	// CUSTOM
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
			return `<section id="${cs.section_id}"><div class="section-head reveal"><span class="eyebrow">${cs.title}</span><h2 class="section-title">${cs.title}</h2></div>
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
		statShown(v, 'years_experience', yearsExp) ? `<div class="stat"><div class="stat-num" ${ed('template_overrides.years_experience')}>${yearsExp}+</div><div class="stat-label">Years active</div></div>` : '',
		statShown(v, 'projects_count', projCount) ? `<div class="stat"><div class="stat-num" ${ed('template_overrides.projects_count')}>${projCount}</div><div class="stat-label">Projects</div></div>` : '',
		awardsCount > 0 ? `<div class="stat"><div class="stat-num">${awardsCount}</div><div class="stat-label">Awards</div></div>` : '',
		certCount > 0 ? `<div class="stat"><div class="stat-num">${certCount}</div><div class="stat-label">Certifications</div></div>` : '',
	].filter(Boolean).join('');

	// SIDEBAR socials + CONTACT
	const sideSocials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">Li</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Pf</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Tw</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">Gh</a>` : '',
	].filter(Boolean).join('');
	const cInfo = [
		v.email ? `<div class="contact-info-item"><h5>Email</h5><a href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a></div>` : '',
		v.phone ? `<div class="contact-info-item"><h5>Phone</h5><a href="tel:${v.phone}" ${ed('profile.phone')}>${v.phone}</a></div>` : '',
		v.location ? `<div class="contact-info-item"><h5>Based in</h5><p ${ed('profile.location')}>${v.location}</p></div>` : '',
	].filter(Boolean).join('');
	const contactSocials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Twitter</a>` : '',
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
<div class="shell">
<aside class="sidebar">
<div class="brand-mark"><span>Portfolio ${new Date().getFullYear()}</span><span class="status-dot"></span></div>
<div class="avatar-wrap" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="avatar-ph">${initials}</div>`}</div>
<div class="id-name" ${ed('profile.full_name')}>${v.name}</div>
<div class="id-role">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : (v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Designer')}</div>
<nav class="side-nav">
<a href="#home"><span class="num">00</span> Home</a>
<a href="#about"><span class="num">01</span> About</a>
<a href="#projects"><span class="num">02</span> Work</a>
<a href="#experience"><span class="num">03</span> Experience</a>
<a href="#contact"><span class="num">04</span> Contact</a>
</nav>
<div class="side-foot">
${sideSocials ? `<div class="side-social">${sideSocials}</div>` : ''}
${v.location ? `<div class="side-loc" ${ed('profile.location')}>${v.location}</div>` : ''}
</div>
</aside>

<div class="main">
<section id="home">
<div class="hero-grid">
<div class="hero-text">
<div class="eyebrow">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Design & Craft'}</div>
<h1 class="hero-title" ${ed('profile.full_name')}>${heroTitle}</h1>
${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="hero-cta">
<a href="#projects" class="btn">View Work &#8599;</a>
${v.email ? `<a href="mailto:${v.email}" class="btn btn-ghost">Get in touch</a>` : ''}
</div>
</div>
<div class="hero-visual">
<div class="hero-ghost">${nameParts[0] || 'work'}</div>
<div class="hero-photo" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="hero-photo-ph">${initials}</div>`}</div>
</div>
</div>
</section>

<section id="about" class="alt">
<div class="section-head reveal"><span class="eyebrow">About</span><h2 class="section-title">The story <em>so far</em></h2></div>
<div class="about-grid">
<div class="reveal">
${v.uniqueValue ? `<p class="about-lead" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : (v.bio ? `<p class="about-lead" ${ed('portfolio.bio', true)}>${v.bio}</p>` : '')}
${v.uniqueValue && v.bio ? `<p class="about-copy" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
</div>
<div class="reveal">${aboutStats ? `<div class="stat-grid">${aboutStats}</div>` : ''}</div>
</div>
</section>

${orderedSections}

<section id="contact">
<div class="section-head reveal"><span class="eyebrow">Contact</span><h2 class="section-title">Let's <em>collaborate</em></h2></div>
<div class="contact-grid">
<div class="reveal">${cInfo}</div>
<div class="reveal">${contactSocials ? `<div class="contact-social">${contactSocials}</div>` : ''}</div>
</div>
</section>

<footer>
<span>&copy; ${new Date().getFullYear()} ${v.name}</span>
<span>${v.profile_headline || v.headline || 'Designer Portfolio'}</span>
</footer>
</div>
</div>
${FOLIO_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
