/**
 * Template: Muse (Designer)
 * Playful neo-brutalist "sketchbook" aesthetic — soft lavender-grey canvas,
 * pastel sticky-note cards (yellow/blue/lavender/mint/pink), thick ink borders
 * with hard offset shadows, corner brackets, highlighter-marker underlines.
 * Caveat + Kalam handwritten display, Plus Jakarta Sans body, Space Mono labels.
 * Ported from "desginer-4.html", mapped to our designer data model
 * (external stock images dropped; proficiency dots → tags per Z16;
 * renders every designer section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Kalam:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}
const PASTELS = ['yellow', 'blue', 'lav', 'mint', 'pink'];

function css(): string {
	return `
:root{
  --bg:#e9e2e6;--bg-soft:#efe9ec;--ink:#191919;--ink-soft:#4a4550;--paper:#f6f2ee;
  --yellow:#f0e874;--blue:#a9c6ea;--lav:#cabdea;--mint:#b6e0b0;--pink:#eab3cf;--green-hi:#aee06a;
  --radius:4px;--shadow-hard:6px 6px 0 rgba(25,25,25,0.9);--shadow-hard-sm:4px 4px 0 rgba(25,25,25,0.9);
  --fd:'Caveat',cursive;--ft:'Kalam',cursive;--fm:'Space Mono',monospace;--fb:'Plus Jakarta Sans',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--fb);line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;border:none;background:none}
::selection{background:var(--green-hi);color:var(--ink)}
.wrap{max-width:1180px;margin:0 auto;padding:0 28px}
.bracketed{position:relative}
.bk{position:absolute;width:12px;height:12px;background:var(--ink);z-index:3}
.bk-tl{top:-6px;left:-6px}.bk-tr{top:-6px;right:-6px}.bk-bl{bottom:-6px;left:-6px}.bk-br{bottom:-6px;right:-6px}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
.reveal.in{opacity:1;transform:translateY(0)}

.nav-outer{position:sticky;top:0;z-index:100;padding:18px 0 0}
.nav-outer .wrap{display:flex;justify-content:center}
.nav-pill{display:flex;align-items:center;gap:4px;background:var(--bg-soft);border:2.5px solid var(--ink);border-radius:999px;padding:6px;box-shadow:var(--shadow-hard-sm);flex-wrap:wrap;max-width:92vw;overflow-x:auto}
.nav-pill a{font-family:var(--fm);font-size:13px;padding:9px 18px;border-radius:999px;color:var(--ink-soft);transition:background .2s,color .2s;white-space:nowrap}
.nav-pill a:hover{color:var(--ink);background:var(--blue)}

.eyebrow{font-family:var(--fm);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);display:inline-flex;align-items:center;gap:8px;margin-bottom:10px}
.eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--green-hi);border:1.5px solid var(--ink);display:inline-block}
.section-title{font-family:var(--fd);font-weight:700;font-size:clamp(38px,5vw,58px);line-height:1;display:inline-block;position:relative;margin-bottom:8px}
.section-title .hi{position:relative;z-index:1}
.section-title .hi::after{content:'';position:absolute;left:-4px;right:-4px;bottom:2px;height:14px;background:var(--green-hi);z-index:-1;transform:rotate(-1deg)}
.section-head{margin-bottom:44px}
.section-sub{color:var(--ink-soft);max-width:560px;margin-top:10px;font-size:15.5px}
section{padding:90px 0}
.btn{font-family:var(--fm);font-size:13px;font-weight:700;padding:13px 24px;border:2.5px solid var(--ink);border-radius:6px;box-shadow:var(--shadow-hard-sm);display:inline-flex;align-items:center;gap:8px;transition:transform .15s,box-shadow .15s;background:var(--paper)}
.btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 rgba(25,25,25,.9)}
.btn.primary{background:var(--yellow)}.btn.ghost{background:var(--paper)}
.chip{font-family:var(--fm);font-size:12px;border:2px solid var(--ink);border-radius:999px;padding:7px 14px;background:var(--bg-soft)}
.tag{font-family:var(--fm);font-size:12px;padding:7px 12px;border:2px solid var(--ink);border-radius:999px;background:#fff}

/* HERO */
.hero{padding-top:60px;padding-bottom:80px}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center}
.hero-eyebrow{font-family:var(--fm);font-size:13px;background:var(--paper);border:2px solid var(--ink);display:inline-block;padding:6px 14px;border-radius:999px;margin-bottom:22px}
.hero-name{font-family:var(--fd);font-weight:700;font-size:clamp(52px,7.2vw,90px);line-height:.98}
.hero-headline{font-family:var(--ft);font-style:italic;font-size:clamp(20px,2.4vw,27px);margin-top:14px;color:var(--ink-soft)}
.hero-summary{margin-top:22px;font-size:16px;max-width:520px;color:var(--ink-soft)}
.hero-cta{display:flex;gap:14px;margin-top:32px;flex-wrap:wrap}
.hero-links{display:flex;gap:10px;margin-top:26px;flex-wrap:wrap}
.hero-photo-wrap{position:relative}
.hero-photo{width:100%;aspect-ratio:4/5;object-fit:cover;border:3px solid var(--ink);border-radius:var(--radius);box-shadow:var(--shadow-hard);background:var(--lav)}
.hero-photo-ph{display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:5rem;color:var(--ink);opacity:.35}
@media(max-width:980px){.hero-grid{grid-template-columns:1fr}.hero-photo-wrap{order:-1;max-width:320px}}

/* CARDS (about) */
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:40px}
.card{border:3px solid var(--ink);border-radius:6px;padding:32px 28px;box-shadow:var(--shadow-hard);position:relative;transition:transform .2s}
.card:hover{transform:translateY(-4px)}
.card.yellow{background:var(--yellow)}.card.blue{background:var(--blue)}.card.lav{background:var(--lav)}.card.mint{background:var(--mint)}.card.pink{background:var(--pink)}
.card .icon{font-size:32px;margin-bottom:16px;display:block}
.card h3{font-family:var(--ft);font-style:italic;font-weight:700;font-size:22px;margin-bottom:10px}
.card p{font-size:14.5px;color:#252017}
.fact-strip{display:flex;gap:16px;flex-wrap:wrap;margin-top:36px}
.fact{font-family:var(--fm);font-size:12.5px;border:2px solid var(--ink);border-radius:8px;padding:14px 18px;background:var(--paper);min-width:130px}
.fact b{display:block;font-family:var(--fd);font-size:28px;margin-bottom:2px}

/* SKILLS panels */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:30px}
.skill-panel{border:3px solid var(--ink);border-radius:6px;background:var(--paper);box-shadow:var(--shadow-hard);overflow:hidden;position:relative}
.skill-panel .head{padding:18px 22px;border-bottom:3px solid var(--ink);font-family:var(--ft);font-style:italic;font-weight:700;font-size:19px}
.skill-list{padding:20px 22px;display:flex;flex-wrap:wrap;gap:9px}

/* PROJECTS */
.project{border:3px solid var(--ink);border-radius:8px;background:var(--paper);box-shadow:var(--shadow-hard);margin-bottom:52px;overflow:hidden;position:relative}
.project-media{position:relative;border-bottom:3px solid var(--ink);background:var(--lav)}
.project-media img{width:100%;height:340px;object-fit:cover}
.project-media-ph{height:280px;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:4rem;color:var(--ink);opacity:.3}
.project-body{padding:34px}
.project-top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:16px}
.project-title{font-family:var(--fd);font-weight:700;font-size:34px}
.project-meta{font-family:var(--fm);font-size:12px;color:var(--ink-soft);margin-top:6px}
.project-links{display:flex;gap:10px;flex-wrap:wrap}
.project-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;margin-top:18px}
.pblock h4{font-family:var(--fm);font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-soft);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.pblock h4::before{content:'';width:6px;height:6px;background:var(--green-hi);border:1.5px solid var(--ink);border-radius:2px}
.pblock p{font-size:14px;color:#2a2530}
.pblock ul{list-style:none;font-size:14px;color:#2a2530}
.pblock ul li{margin-bottom:4px;padding-left:1rem;position:relative}
.pblock ul li::before{content:'–';position:absolute;left:0}
.tech-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}

/* TIMELINE */
.timeline{position:relative;padding-left:34px}
.timeline::before{content:'';position:absolute;left:6px;top:6px;bottom:6px;width:3px;background:var(--ink)}
.t-item{position:relative;margin-bottom:48px}
.t-item::before{content:'';position:absolute;left:-34px;top:6px;width:16px;height:16px;background:var(--yellow);border:3px solid var(--ink);border-radius:50%}
.t-card{border:3px solid var(--ink);border-radius:8px;background:var(--paper);box-shadow:var(--shadow-hard-sm);padding:28px;position:relative}
.t-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;align-items:flex-start}
.t-title{font-family:var(--fd);font-weight:700;font-size:28px}
.t-company{font-family:var(--ft);font-style:italic;font-size:16px;color:var(--ink-soft)}
.t-dur{font-family:var(--fm);font-size:11.5px;border:2px solid var(--ink);border-radius:999px;padding:5px 12px;background:var(--blue);white-space:nowrap}
.t-kps{list-style:none;margin-top:14px;font-size:14px}
.t-kps li{margin-bottom:5px;padding-left:1rem;position:relative}
.t-kps li::before{content:'–';position:absolute;left:0}
.t-desc{margin-top:12px;font-size:14px;color:var(--ink-soft)}

/* MINI CARDS (edu/cert/ach) */
.mini-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.mini-card{border:2.5px solid var(--ink);border-radius:8px;padding:20px 22px;background:var(--paper);box-shadow:var(--shadow-hard-sm);position:relative}
.mini-card h5{font-family:var(--ft);font-style:italic;font-weight:700;font-size:18px;margin-bottom:4px}
.mini-card .sub{font-size:13px;color:var(--ink-soft);margin-top:2px}
.mini-card .desc{font-size:13px;color:#2a2530;margin-top:8px;line-height:1.6}
.mini-card .yr{font-family:var(--fm);font-size:11px;margin-top:10px;display:inline-block;background:var(--mint);border:1.5px solid var(--ink);padding:3px 9px;border-radius:999px}
.mini-card .ml{display:inline-block;margin-top:10px;font-family:var(--fm);font-size:11px;border-bottom:2px solid var(--ink)}
.mini-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}

/* TOOLS */
.tools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:18px}
.tool-card{border:2.5px solid var(--ink);border-radius:8px;background:var(--paper);padding:20px;text-align:center;box-shadow:var(--shadow-hard-sm)}
.tool-card .glyph{font-size:26px;margin-bottom:8px}
.tool-card h5{font-family:var(--ft);font-style:italic;font-size:16px}

/* PHILOSOPHY */
.philo-card{border:3px solid var(--ink);border-radius:8px;background:var(--mint);box-shadow:var(--shadow-hard);padding:44px;font-family:var(--ft);font-style:italic;font-size:clamp(20px,2.6vw,30px);line-height:1.4}

/* CONTACT */
.contact-wrap{border:3px solid var(--ink);border-radius:12px;background:var(--yellow);box-shadow:var(--shadow-hard);padding:56px;position:relative;overflow:hidden}
.contact-wrap::after{content:'✷';position:absolute;right:36px;top:26px;font-size:60px;opacity:.25;font-family:var(--fd)}
.contact-title{font-family:var(--fd);font-weight:700;font-size:clamp(40px,5vw,62px);line-height:1}
.contact-sub{max-width:480px;margin-top:14px;color:#2a2510}
.contact-detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-top:34px}
.detail-card{background:var(--paper);border:2.5px solid var(--ink);border-radius:8px;padding:16px 18px}
.detail-card .lbl{font-family:var(--fm);font-size:10.5px;text-transform:uppercase;color:var(--ink-soft)}
.detail-card .val{font-weight:700;margin-top:4px;font-size:14.5px;word-break:break-word}
.social-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}
.social-btn{font-family:var(--fm);font-size:12px;border:2px solid var(--ink);border-radius:999px;padding:9px 16px;background:#fff}
.social-btn:hover{background:var(--ink);color:#fff}

footer{padding:34px 0 50px;text-align:center;font-family:var(--fm);font-size:11.5px;color:var(--ink-soft)}

/* EDIT CONTROLS */
.ce-add-btn{font-family:var(--fm);font-size:12px;font-weight:700;color:var(--ink);background:var(--paper);border:2.5px solid var(--ink);border-radius:6px;box-shadow:var(--shadow-hard-sm);padding:12px 22px;cursor:pointer;margin-top:26px;display:block;width:100%;text-align:center}
.ce-add-btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 rgba(25,25,25,.9)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:50%;border:2px solid var(--ink);background:var(--pink);color:var(--ink);font-size:12px;line-height:22px;text-align:center;cursor:pointer;z-index:20;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const MUSE_SCRIPT = `<script>
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(r){io.observe(r);});
})();
<\/script>`;

const HEAD_COLORS = ['background:var(--yellow)', 'background:var(--blue)', 'background:var(--lav)', 'background:var(--mint)', 'background:var(--pink)'];
const ICONS = ['✏️', '🎨', '🧩', '📐', '💡', '🔍', '✦', '◆'];

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
	const certCount = v.certifications?.length ?? 0;
	const awardsCount = v.awards?.length ?? 0;
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'D';

	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const s = edu.start_year, e = edu.end_year;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : '';
		const b = e ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : '';
		return `${a}${s && e ? '–' : ''}${b}`;
	};
	const expPeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const s = exp.start_date, e = exp.end_date;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : '';
		const b = e ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : '';
		return `${a}${s && e ? '–' : ''}${b}`;
	};

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / My-Work</div><br><h2 class="section-title"><span class="hi">My work</span></h2></div>
${v.projects.map((p, i) => {
			const links = [
				p.project_url ? `<a href="${p.project_url}" class="btn sm" target="_blank" rel="noopener noreferrer">Live ↗</a>` : '',
				p.github_repo ? `<a href="${p.github_repo}" class="btn sm ghost" target="_blank" rel="noopener noreferrer">Repo ↗</a>` : '',
			].filter(Boolean).join('');
			return `<div class="project reveal"${iw}>
${delBtn('projects', i)}
<div class="project-media" ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="project-media-ph">${initials}</div>`}</div>
<div class="project-body">
<div class="project-top"><div><div class="project-title" ${ed(`projects.${i}.title`)}>${p.title || (em ? 'Project' : '')}</div>${p.project_category ? `<div class="project-meta" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}</div>${links ? `<div class="project-links">${links}</div>` : ''}</div>
${p.description ? `<div class="pblock"><h4>Overview</h4><p ${ed(`projects.${i}.description`, true)}>${p.description}</p></div>` : ''}
<div class="project-cols">
${p.responsibilities?.length ? `<div class="pblock"><h4>What I did</h4><ul ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${p.measurable_outcomes?.length ? `<div class="pblock"><h4>Outcomes</h4><ul ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul></div>` : ''}
</div>
${p.tech_stack?.length ? `<div class="tech-row" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="tech-row" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
</div>
</div>`;
		}).join('\n')}
${addBtn('projects', 'Project')}
</div></section>` : '';

	// SKILLS
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / What-I-Do</div><br><h2 class="section-title"><span class="hi">What I do</span></h2></div>
<div class="skills-grid">
${v.skill_groups.map((g, gi) => `<div class="skill-panel reveal"${iw}>
${delBtn('skills', gi)}
<div class="head" style="${HEAD_COLORS[gi % HEAD_COLORS.length]}" ${ed(`skills.${gi}.category`)}>${g.category}</div>
<div class="skill-list" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / Toolbox</div><br><h2 class="section-title"><span class="hi">My toolbox</span></h2></div>
<div class="tools-grid reveal" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map((t, i) => `<div class="tool-card"><div class="glyph">${ICONS[i % ICONS.length]}</div><h5>${t}</h5></div>`).join('') || `<div class="tool-card"><h5 style="opacity:.5">+ Add</h5></div>`}</div>
</div></section>` : '';

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / Experience</div><br><h2 class="section-title"><span class="hi">Experience</span></h2></div>
<div class="timeline">
${v.experience.map((exp, i) => `<div class="t-item reveal"${iw}>
${delBtn('experience', i)}
<div class="t-card">
<div class="t-top"><div><div class="t-title" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>${(exp.company || exp.location) ? `<div class="t-company">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.company && exp.location ? ' · ' : ''}${exp.location ? `<span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}</div><div class="t-dur">${expPeriod(i, exp)}</div></div>
${exp.description ? `<div class="t-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<ul class="t-kps" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / Education</div><br><h2 class="section-title"><span class="hi">Education</span></h2></div>
<div class="mini-grid">
${v.education.map((edu, i) => `<div class="mini-card"${iw}>
${delBtn('education', i)}
<h5>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h5>
${(edu.institution || edu.location) ? `<div class="sub">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.institution && edu.location ? ' · ' : ''}${edu.location ? `<span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${eduYears(i, edu) ? `<span class="yr">${eduYears(i, edu)}</span>` : ''}
${edu.grade_or_score ? `<span class="yr" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / Credentials</div><br><h2 class="section-title"><span class="hi">Certifications</span></h2></div>
<div class="mini-grid">
${v.certifications.map((c, i) => `<div class="mini-card"${iw}>
${delBtn('certifications', i)}
<h5 ${ed(`certifications.${i}.name`)}>${c.name}</h5>
${c.issuer ? `<div class="sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.year ? `<span class="yr" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
${c.url ? `<a href="${c.url}" class="ml" target="_blank" rel="noopener noreferrer">View ↗</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / Wins</div><br><h2 class="section-title"><span class="hi">Achievements</span></h2></div>
<div class="mini-grid">
${v.achievements.map((a, i) => `<div class="mini-card"${iw}>
${delBtn('achievements', i)}
<h5 ${ed(`achievements.${i}.title`)}>${a.title}</h5>
${a.description ? `<div class="desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
${a.year ? `<span class="yr" ${ed(`achievements.${i}.year`)}>${a.year}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>` : '';

	// AWARDS
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / Honours</div><br><h2 class="section-title"><span class="hi">Awards</span></h2></div>
<div class="mini-grid">
${(v.awards ?? []).map((a, i) => `<div class="mini-card"${iw}>
${delBtn('awards', i)}
<h5 ${ed(`awards.${i}.title`)}>${a.title}</h5>
${a.awarding_body ? `<div class="sub" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}
${a.year ? `<span class="yr" ${ed(`awards.${i}.year`)}>${a.year}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</div></section>` : '';

	// PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / Philosophy</div><br><h2 class="section-title"><span class="hi">How I think</span></h2></div>
<div class="philo-card reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</div>
</div></section>` : '';

	// CUSTOM
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="mini-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.label ? `<h5 ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</h5>` : ''}
${item.subtitle ? `<div class="sub" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.value ? `<div class="desc" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="mini-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="ml" target="_blank" rel="noopener noreferrer">View ↗</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / ${cs.title}</div><br><h2 class="section-title"><span class="hi" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</span></h2></div>
<div class="mini-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		experience: experienceHtml, projects: projectsHtml, skills: skillsHtml,
		design_philosophy: philoHtml, software_proficiency: softwareHtml, awards: awardsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// ABOUT
	const aboutCards = (v.skill_groups ?? []).slice(0, 3).map((g, i) => `<div class="card ${PASTELS[i % PASTELS.length]}"><span class="icon">${ICONS[i % ICONS.length]}</span><h3>${g.category || 'Craft'}</h3><p>${g.skills.slice(0, 4).join(', ')}</p></div>`).join('');
	const facts = [
		statShown(v, 'years_experience', yearsExp) ? `<div class="fact"><b ${ed('template_overrides.years_experience')}>${yearsExp}+</b>Years</div>` : '',
		statShown(v, 'projects_count', projCount) ? `<div class="fact"><b ${ed('template_overrides.projects_count')}>${projCount}</b>Projects</div>` : '',
		certCount > 0 ? `<div class="fact"><b>${certCount}</b>Certs</div>` : '',
		awardsCount > 0 ? `<div class="fact"><b>${awardsCount}</b>Awards</div>` : '',
	].filter(Boolean).join('');

	// HERO chips + CONTACT
	const heroChips = [
		// Icons live OUTSIDE the editable span — inside it they become part of the
		// value the editor reads back, so the chip saved "📍 Hyderabad" into
		// profile.location and permanently disagreed with the contact-card copy.
		v.location ? `<span class="chip">📍 <span ${ed('profile.location')}>${v.location}</span></span>` : '',
		v.email ? `<span class="chip">✉ <span ${ed('profile.email')}>${v.email}</span></span>` : '',
	].filter(Boolean).join('');
	const details = [
		v.email ? `<div class="detail-card"><div class="lbl">Email</div><div class="val" ${ed('profile.email')}>${v.email}</div></div>` : '',
		v.phone ? `<div class="detail-card"><div class="lbl">Phone</div><div class="val" ${ed('profile.phone')}>${v.phone}</div></div>` : '',
		v.location ? `<div class="detail-card"><div class="lbl">Location</div><div class="val" ${ed('profile.location')}>${v.location}</div></div>` : '',
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" class="social-btn" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" class="social-btn" target="_blank" rel="noopener noreferrer">Portfolio</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" class="social-btn" target="_blank" rel="noopener noreferrer">Twitter</a>` : '',
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
<div class="nav-outer"><div class="wrap"><nav class="nav-pill">
<a href="#home">Home</a><a href="#about">About</a><a href="#projects">Work</a><a href="#skills">What I do</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
</nav></div></div>

<section id="home" class="hero"><div class="wrap">
<div class="hero-grid">
<div>
<span class="hero-eyebrow">✦ ${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Available for work'}</span>
<h1 class="hero-name" ${ed('profile.full_name')}>${v.name}</h1>
${v.headline ? `<p class="hero-headline" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
${v.bio ? `<p class="hero-summary" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="hero-cta">
<a href="#projects" class="btn primary">View my work ↗</a>
${v.email ? `<a href="mailto:${v.email}" class="btn ghost">Let's talk</a>` : ''}
</div>
${heroChips ? `<div class="hero-links">${heroChips}</div>` : ''}
</div>
<div class="hero-photo-wrap bracketed" ${_imgUpload('profile.profile_image', em)}>
<span class="bk bk-tl"></span><span class="bk bk-tr"></span><span class="bk bk-bl"></span><span class="bk bk-br"></span>
${v.profile_image ? `<img class="hero-photo" src="${v.profile_image}" alt="${v.name}">` : `<div class="hero-photo hero-photo-ph">${initials}</div>`}
</div>
</div>
</div></section>

<section id="about"><div class="wrap">
<div class="section-head reveal"><div class="eyebrow"><span class="dot"></span>Frame / About-Me</div><br><h2 class="section-title"><span class="hi">About me</span></h2>
${v.uniqueValue ? `<p class="section-sub" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}</div>
${aboutCards ? `<div class="card-grid reveal">${aboutCards}</div>` : ''}
${facts ? `<div class="fact-strip reveal">${facts}</div>` : ''}
</div></section>

${orderedSections}

<section id="contact"><div class="wrap">
<div class="contact-wrap reveal">
<h2 class="contact-title">Let's make<br>something good.</h2>
<p class="contact-sub">Whether you've got a product to shape or just want to talk shop — say hi.</p>
${details ? `<div class="contact-detail-grid">${details}</div>` : ''}
${socials ? `<div class="social-row">${socials}</div>` : ''}
</div>
</div></section>

<footer>&copy; ${new Date().getFullYear()} ${v.name} · Made with care</footer>
${MUSE_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
