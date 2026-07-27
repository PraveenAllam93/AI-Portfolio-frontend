/**
 * Template: Terra (Designer)
 * Warm architectural / interior aesthetic — off-white canvas, gold (#c9a96e) +
 * sage accents, Cormorant Garamond serif, Outfit body, DM Mono labels.
 * Full-bleed hero (profile photo or warm gradient) with fade-up intro, framed
 * about photo with gold corner + stat badge, gilded section labels, featured
 * project grid with hover-zoom overlays, cert grid, scroll reveals.
 * Ported from "interiar-desginer-1.html", mapped to our designer data model
 * (external stock images dropped; renders every designer section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}

const SKILL_ICONS = ['◈', '◇', '❖', '◆', '⬡', '✦'];

function css(): string {
	return `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --ink:#1a1916;--ash:#3a3835;--stone:#7a7672;--sand:#b8b0a4;--linen:#ede9e3;
  --cream:#f7f4f0;--white:#fdfcfb;--accent:#c9a96e;--accent2:#8fa68e;--danger:#c96e6e;
  --serif:'Cormorant Garamond',serif;--sans:'Outfit',sans-serif;--mono:'DM Mono',monospace;
  --ease:cubic-bezier(0.25,0.46,0.45,0.94);--ease-out:cubic-bezier(0.16,1,0.3,1);
}
html{scroll-behavior:smooth}
body{background:var(--white);color:var(--ink);font-family:var(--sans);font-weight:300;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}

nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:24px 60px;transition:background .5s var(--ease),padding .4s}
nav.scrolled{background:rgba(253,252,251,.96);backdrop-filter:blur(16px);padding:16px 60px;border-bottom:1px solid var(--linen)}
.nav-logo{font-family:var(--serif);font-size:1.2rem;font-weight:400;letter-spacing:.06em;color:var(--white);transition:color .3s}
nav.scrolled .nav-logo{color:var(--ink)}
.nav-links{display:flex;gap:36px;list-style:none}
.nav-links a{font-family:var(--mono);font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.75);transition:color .3s}
.nav-links a:hover{color:var(--white)}
nav.scrolled .nav-links a{color:var(--stone)}
nav.scrolled .nav-links a:hover{color:var(--ink)}
.nav-cta{font-family:var(--mono);font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:var(--white);border:1px solid rgba(255,255,255,.4);padding:10px 22px;transition:all .3s}
.nav-cta:hover{background:var(--white);color:var(--ink)}
nav.scrolled .nav-cta{color:var(--ink);border-color:var(--ink)}
@media(max-width:1024px){nav{padding:20px 40px}.nav-links,.nav-cta{display:none}}

/* HERO */
.hero{min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:flex-end}
.hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#2c2a26,#1a1916 60%,#3a3530);background-size:cover;background-position:center 40%}
.hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 40%}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,19,17,.85) 0%,rgba(20,19,17,.35) 50%,rgba(20,19,17,.15) 100%)}
.hero-content{position:relative;z-index:2;padding:0 60px 80px;max-width:900px}
.hero-eyebrow{font-family:var(--mono);font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:var(--accent);margin-bottom:20px;opacity:0;transform:translateY(20px);animation:fadeUp .9s .3s var(--ease-out) forwards}
.hero-name{font-family:var(--serif);font-size:clamp(3.2rem,7vw,7rem);font-weight:300;line-height:1.05;color:var(--white);letter-spacing:-.01em;margin-bottom:12px;opacity:0;transform:translateY(30px);animation:fadeUp 1s .5s var(--ease-out) forwards}
.hero-name em{font-style:italic;color:var(--accent)}
.hero-title{font-size:1rem;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:32px;opacity:0;transform:translateY(20px);animation:fadeUp .9s .7s var(--ease-out) forwards}
.hero-tagline{font-family:var(--serif);font-size:clamp(1.15rem,2vw,1.55rem);font-weight:300;font-style:italic;color:rgba(255,255,255,.78);margin-bottom:48px;max-width:480px;line-height:1.6;opacity:0;transform:translateY(20px);animation:fadeUp .9s .9s var(--ease-out) forwards}
.hero-actions{display:flex;align-items:center;gap:32px;opacity:0;transform:translateY(20px);animation:fadeUp .9s 1.1s var(--ease-out) forwards;flex-wrap:wrap}
.btn-primary{font-family:var(--mono);font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);background:var(--white);padding:16px 36px;transition:all .35s var(--ease);position:relative;overflow:hidden}
.btn-primary span{position:relative;z-index:1}
.btn-primary::before{content:'';position:absolute;inset:0;background:var(--accent);transform:translateX(-101%);transition:transform .4s var(--ease)}
.btn-primary:hover::before{transform:translateX(0)}
.hero-scroll{font-family:var(--mono);font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.5);display:flex;align-items:center;gap:12px}
.hero-scroll::before{content:'';width:40px;height:1px;background:rgba(255,255,255,.35)}
@keyframes fadeUp{to{opacity:1;transform:translateY(0)}}

/* SECTION */
section{padding:120px 60px;border-bottom:1px solid var(--linen)}
.sec-inner{max-width:1280px;margin:0 auto}
.section-label{font-family:var(--mono);font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
.section-heading{font-family:var(--serif);font-size:clamp(2.2rem,4vw,3.8rem);font-weight:300;line-height:1.1;letter-spacing:-.01em;color:var(--ink)}
.section-heading em{font-style:italic;color:var(--stone)}
.reveal{opacity:0;transform:translateY(40px);transition:opacity .9s var(--ease-out),transform .9s var(--ease-out)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}

/* ABOUT */
#about{background:var(--cream)}
.about-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;max-width:1200px;margin:0 auto}
.about-image-wrap{position:relative}
.about-image-wrap::before{content:'';position:absolute;top:-20px;left:-20px;width:50%;height:50%;border:1px solid var(--accent);z-index:0}
.about-img{width:100%;aspect-ratio:3/4;object-fit:cover;object-position:top;position:relative;z-index:1;background:linear-gradient(160deg,var(--linen),var(--sand))}
.about-img-ph{display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:4rem;color:var(--white);opacity:.6}
.about-badge{position:absolute;bottom:-20px;right:-20px;z-index:2;background:var(--ink);color:var(--white);padding:24px;font-family:var(--serif);text-align:center}
.about-badge strong{display:block;font-size:2.4rem;font-weight:300;line-height:1}
.about-badge span{font-family:var(--mono);font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;color:var(--sand)}
.about-text p{font-size:1.05rem;line-height:1.85;color:var(--ash);margin-bottom:20px}
@media(max-width:1024px){.about-inner{grid-template-columns:1fr;gap:48px}}

/* ROWS (experience/education) */
.row-list{max-width:1000px;margin:56px auto 0;display:flex;flex-direction:column}
.rrow{display:grid;grid-template-columns:200px 1fr;gap:48px;padding:36px 0;border-bottom:1px solid var(--linen);position:relative}
.rrow:first-child{padding-top:0}
.rrow:last-of-type{border-bottom:none}
.rrow-period{font-family:var(--mono);font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);padding-top:6px}
.rrow-role{font-family:var(--serif);font-size:1.6rem;font-weight:400;color:var(--ink);margin-bottom:4px}
.rrow-firm{font-size:.8rem;letter-spacing:.05em;text-transform:uppercase;color:var(--stone);margin-bottom:14px}
.rrow-desc{font-size:.95rem;line-height:1.75;color:var(--ash);max-width:660px}
.rrow-kps{margin-top:12px;padding-left:1.1rem;list-style:none}
.rrow-kp{font-size:.9rem;line-height:1.7;color:var(--ash);position:relative}
.rrow-kp::before{content:'—';position:absolute;left:-1.1rem;color:var(--accent)}
@media(max-width:768px){.rrow{grid-template-columns:1fr;gap:12px}}

/* SKILLS cards */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px;margin-top:48px}
.skill-card{background:var(--cream);padding:36px 28px;transition:all .3s;border:1px solid transparent;position:relative}
.skill-card:hover{background:var(--white);border-color:var(--sand);transform:translateY(-5px);box-shadow:0 15px 25px -10px rgba(0,0,0,0.06)}
.skill-icon{font-size:2.2rem;margin-bottom:18px;color:var(--accent)}
.skill-card h4{font-family:var(--serif);font-size:1.35rem;font-weight:400;margin-bottom:14px}
.skill-tags{display:flex;flex-wrap:wrap;gap:.4rem}
.skill-tag{font-family:var(--mono);font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:var(--stone);border:1px solid var(--linen);padding:.3rem .6rem}

/* PROJECTS featured */
.projects-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
.project-feat{position:relative;overflow:hidden;aspect-ratio:1/1.2}
.project-feat img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.project-feat:hover img{transform:scale(1.05)}
.project-feat-ph{position:absolute;inset:0;background:linear-gradient(160deg,var(--ash),var(--ink));display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:2.4rem;color:rgba(255,255,255,.25)}
.project-feat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,25,22,.92) 0%,rgba(26,25,22,.2) 65%,transparent 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:28px}
.pf-cat{font-family:var(--mono);font-size:.58rem;letter-spacing:.2em;color:var(--accent);text-transform:uppercase}
.pf-title{font-family:var(--serif);font-size:1.4rem;color:var(--white);margin-top:6px}
.pf-desc{font-size:.78rem;color:rgba(255,255,255,.8);margin-top:8px;line-height:1.5}
.pf-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:10px}
.pf-tag{font-family:var(--mono);font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.25);padding:.25rem .5rem}
.pf-link{margin-top:10px;font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--accent)}
@media(max-width:1024px){.projects-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.projects-grid{grid-template-columns:1fr}}

/* CERT / ACH grid */
.cert-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px;margin-top:56px;background:var(--linen);border:1px solid var(--linen)}
.cert-card{background:var(--white);padding:32px 24px;transition:background .3s;text-align:center;position:relative}
.cert-card:hover{background:var(--ink)}
.cert-card:hover .cert-year,.cert-card:hover .cert-name,.cert-card:hover .cert-org,.cert-card:hover .cert-desc{color:var(--white)}
.cert-year{font-family:var(--mono);font-size:.7rem;letter-spacing:.2em;color:var(--accent);margin-bottom:12px;display:block}
.cert-name{font-family:var(--serif);font-size:1.15rem;font-weight:400;margin-bottom:6px;color:var(--ink)}
.cert-org{font-size:.7rem;color:var(--stone);text-transform:uppercase;letter-spacing:.05em}
.cert-desc{font-size:.78rem;color:var(--ash);line-height:1.6;margin-top:8px}
.cert-link{display:inline-block;margin-top:8px;font-family:var(--mono);font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--accent)}

/* AWARDS rows */
.awards-list{max-width:1000px;margin:48px auto 0}
.award-row{display:grid;grid-template-columns:1fr auto auto;gap:2rem;align-items:baseline;padding:24px 0;border-bottom:1px solid var(--linen);position:relative}
.award-row:first-child{border-top:1px solid var(--linen)}
.award-title{font-family:var(--serif);font-size:1.4rem}
.award-body{font-family:var(--mono);font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--stone)}
.award-year{font-family:var(--mono);font-size:.68rem;color:var(--accent)}
@media(max-width:768px){.award-row{grid-template-columns:1fr;gap:.4rem}}

/* PHILOSOPHY + TOOLS */
.philo{max-width:60ch;margin:40px auto 0;font-family:var(--serif);font-style:italic;font-size:clamp(1.5rem,2.6vw,2.3rem);line-height:1.45;color:var(--ash);text-align:center}
.tools-wrap{background:var(--cream);margin-top:48px;padding:48px;display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.tool-tag{font-family:var(--mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);border:1px solid var(--sand);padding:.7rem 1.3rem;background:var(--white);transition:all .25s}
.tool-tag:hover{border-color:var(--accent);color:var(--accent)}
.cs-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.6rem;justify-content:center}

/* CONTACT */
#contact{background:var(--white)}
.contact-inner{max-width:1000px;margin:0 auto}
.contact-layout{max-width:640px;margin:56px auto 0}
.contact-info p{font-size:1rem;line-height:1.8;color:var(--ash);margin-bottom:40px;max-width:520px}
.contact-items{display:flex;flex-direction:column;gap:20px}
.contact-item{display:flex;align-items:center;gap:16px}
.contact-item-icon{width:44px;height:44px;min-width:44px;border:1px solid var(--linen);display:flex;align-items:center;justify-content:center;color:var(--accent)}
.contact-item-text strong{display:block;font-family:var(--mono);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--stone);margin-bottom:3px}
.contact-item-text span{font-size:.95rem;color:var(--ink)}
.contact-social{display:flex;gap:16px;margin-top:36px;flex-wrap:wrap}
.contact-social a{padding:.75rem 1.3rem;border:1px solid var(--linen);color:var(--ink);font-family:var(--mono);font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;transition:all .3s}
.contact-social a:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-3px)}

footer{background:var(--ink);padding:60px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px}
.footer-logo{font-family:var(--serif);font-size:1.3rem;font-weight:300;color:var(--white);letter-spacing:.06em}
.footer-logo span{color:var(--accent)}
.footer-copy{font-family:var(--mono);font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3)}

/* EDIT CONTROLS */
.ce-add-btn{font-family:var(--mono);font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink);background:none;border:1px solid var(--ink);padding:14px 32px;cursor:pointer;transition:all .3s;margin-top:40px;display:block;width:100%;text-align:center}
.ce-add-btn:hover{background:var(--ink);color:var(--white)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:50%;border:none;background:var(--ink);color:var(--white);font-size:12px;line-height:26px;text-align:center;cursor:pointer;z-index:20;padding:0}
.project-feat .ce-del-btn,.cert-card .ce-del-btn{background:rgba(20,19,17,.65)}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}[class*="hero-"]{animation:none;opacity:1;transform:none}}
`;
}

const TERRA_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>60);});}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:.12});
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
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'D';
	const nameParts = v.name.split(/\s+/);
	const heroName = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')} <em>${nameParts[nameParts.length - 1]}</em>`
		: `<em>${v.name}</em>`;

	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const s = edu.start_year, e = edu.end_year;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : '';
		const b = e ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : '';
		return `${a}${s && e ? ' — ' : ''}${b}`;
	};
	const expPeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const s = exp.start_date, e = exp.end_date;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : '';
		const b = e ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : '';
		return `${a}${s && e ? ' — ' : ''}${b}`;
	};

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="sec-inner">
<p class="section-label reveal">Signature Work</p><h2 class="section-heading reveal reveal-delay-1">Featured <em>projects</em></h2>
<div class="projects-grid">
${v.projects.map((p, i) => `<div class="project-feat reveal"${iw} ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>
${delBtn('projects', i)}
${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="project-feat-ph">${initials}</div>`}
<div class="project-feat-overlay">
${p.project_category ? `<div class="pf-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
<div class="pf-title" ${ed(`projects.${i}.title`)}>${p.title || (em ? 'Project' : '')}</div>
${p.description ? `<div class="pf-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</div>` : ''}
${p.responsibilities?.length ? `<div class="pf-desc" ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `• ${r}`).join('<br>')}</div>` : ''}
${p.measurable_outcomes?.length ? `<div class="pf-desc" ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `• ${o}`).join('<br>')}</div>` : ''}
${p.tech_stack?.length ? `<div class="pf-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="pf-tag">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="pf-tags" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="pf-tag">${t}</span>`).join('')}</div>` : ''}
${p.project_url ? `<a href="${p.project_url}" class="pf-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('projects', 'Project')}
</div></section>` : '';

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="sec-inner">
<p class="section-label reveal">Professional Journey</p><h2 class="section-heading reveal reveal-delay-1">Career <em>experience</em></h2>
<div class="row-list">
${v.experience.map((exp, i) => `<div class="rrow reveal"${iw}>
${delBtn('experience', i)}
<div class="rrow-period">${expPeriod(i, exp)}</div>
<div>
<div class="rrow-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
${(exp.company || exp.location) ? `<div class="rrow-firm">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.company && exp.location ? ' · ' : ''}${exp.location ? `<span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="rrow-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<ul class="rrow-kps" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li class="rrow-kp">${k}</li>`).join('')}</ul>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>` : '';

	// SKILLS cards
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="sec-inner">
<p class="section-label reveal">Core Competencies</p><h2 class="section-heading reveal reveal-delay-1">Expertise &amp; <em>services</em></h2>
<div class="skills-grid">
${v.skill_groups.map((g, gi) => `<div class="skill-card reveal"${iw}>
${delBtn('skills', gi)}
<div class="skill-icon">${SKILL_ICONS[gi % SKILL_ICONS.length]}</div>
<h4 ${ed(`skills.${gi}.category`)}>${g.category}</h4>
<div class="skill-tags" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>` : '';

	// DESIGN PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy" style="background:var(--cream)"><div class="sec-inner" style="text-align:center">
<p class="section-label reveal" style="margin-left:auto;margin-right:auto">Design Philosophy</p><h2 class="section-heading reveal reveal-delay-1">The <em>why</em> behind the work</h2>
<p class="philo reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</div></section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency"><div class="sec-inner">
<p class="section-label reveal">Toolkit</p><h2 class="section-heading reveal reveal-delay-1">Software &amp; <em>tools</em></h2>
<div class="tools-wrap reveal" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map(t => `<span class="tool-tag">${t}</span>`).join('') || `<span class="tool-tag" style="opacity:.5">+ Add</span>`}</div>
</div></section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="sec-inner">
<p class="section-label reveal">Academic Foundation</p><h2 class="section-heading reveal reveal-delay-1">Education &amp; <em>training</em></h2>
<div class="row-list">
${v.education.map((edu, i) => `<div class="rrow reveal"${iw}>
${delBtn('education', i)}
<div class="rrow-period">${eduYears(i, edu)}</div>
<div>
<div class="rrow-role">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
${(edu.institution || edu.location) ? `<div class="rrow-firm">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.institution && edu.location ? ' · ' : ''}${edu.location ? `<span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<div class="rrow-desc"><span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span></div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" style="background:var(--cream)"><div class="sec-inner">
<p class="section-label reveal">Credentials</p><h2 class="section-heading reveal reveal-delay-1"><em>Certifications</em></h2>
<div class="cert-grid">
${v.certifications.map((c, i) => `<div class="cert-card reveal"${iw}>
${delBtn('certifications', i)}
${c.year ? `<span class="cert-year" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
<div class="cert-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="cert-org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.url ? `<a href="${c.url}" class="cert-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="sec-inner">
<p class="section-label reveal">Recognition</p><h2 class="section-heading reveal reveal-delay-1">Moments that <em>mattered</em></h2>
<div class="cert-grid">
${v.achievements.map((a, i) => `<div class="cert-card reveal"${iw}>
${delBtn('achievements', i)}
${a.year ? `<span class="cert-year" ${ed(`achievements.${i}.year`)}>${a.year}</span>` : ''}
<div class="cert-name" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="cert-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>` : '';

	// AWARDS
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards"><div class="sec-inner">
<p class="section-label reveal">Honours</p><h2 class="section-heading reveal reveal-delay-1">Awards &amp; <em>prizes</em></h2>
<div class="awards-list">
${(v.awards ?? []).map((a, i) => `<div class="award-row"${iw}>
${delBtn('awards', i)}
<div class="award-title" ${ed(`awards.${i}.title`)}>${a.title}</div>
<div class="award-body" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body || ''}</div>
<div class="award-year" ${ed(`awards.${i}.year`)}>${a.year || ''}</div>
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</div></section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="cert-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<span class="cert-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}
${item.label ? `<div class="cert-name" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="cert-desc" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="cs-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="cert-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="sec-inner">
<p class="section-label reveal" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</p><h2 class="section-heading reveal reveal-delay-1" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</h2>
<div class="cert-grid">${cards}</div>
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

	// CONTACT
	const ci = [
		v.location ? `<div class="contact-item"><div class="contact-item-icon">◈</div><div class="contact-item-text"><strong>Location</strong><span ${ed('profile.location')}>${v.location}</span></div></div>` : '',
		v.email ? `<div class="contact-item"><div class="contact-item-icon">✉</div><div class="contact-item-text"><strong>Email</strong><span ${ed('profile.email')}>${v.email}</span></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-item-icon">☎</div><div class="contact-item-text"><strong>Phone</strong><span ${ed('profile.phone')}>${v.phone}</span></div></div>` : '',
	].filter(Boolean).join('');
	const socials = [
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
<nav>
<a href="#home" class="nav-logo" ${ed('profile.full_name')}>${v.name}</a>
<ul class="nav-links">
<li><a href="#about">About</a></li>
<li><a href="#projects">Projects</a></li>
<li><a href="#experience">Experience</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
${v.email ? `<a href="mailto:${v.email}" class="nav-cta">Inquire</a>` : ''}
</nav>

<section class="hero" id="home">
<div class="hero-bg" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</div>
<div class="hero-overlay"></div>
<div class="hero-content">
<p class="hero-eyebrow">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : ''}</p>
<h1 class="hero-name" ${ed('profile.full_name')}>${heroName}</h1>
${v.headline ? `<p class="hero-title" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
${(v.uniqueValue || v.bio) ? `<p class="hero-tagline" ${ed(v.uniqueValue ? 'portfolio.uniqueValue' : 'portfolio.bio', true)}>${v.uniqueValue || v.bio}</p>` : ''}
<div class="hero-actions">
<a href="#projects" class="btn-primary"><span>View Projects</span></a>
<a href="#about" class="hero-scroll">Discover</a>
</div>
</div>
</section>

<section id="about">
<div class="about-inner">
<div class="about-image-wrap reveal">
${v.profile_image ? `<img class="about-img" src="${v.profile_image}" alt="${v.name}">` : `<div class="about-img about-img-ph">${initials}</div>`}
${statShown(v, 'years_experience', yearsExp) ? `<div class="about-badge"><strong ${ed('template_overrides.years_experience')}>${yearsExp}+</strong><span>Years<br>Practice</span></div>` : ''}
</div>
<div class="about-text reveal reveal-delay-1">
<p class="section-label">About</p>
<h2 class="section-heading">Where form meets <em>purpose</em></h2>
<div style="margin-top:1.5rem">
${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${v.uniqueValue && v.bio ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
</div>
</div>
</div>
</section>

${orderedSections}

<section id="contact">
<div class="contact-inner">
<p class="section-label reveal">Studio Inquiries</p><h2 class="section-heading reveal reveal-delay-1">Start a <em>conversation</em></h2>
<div class="contact-layout reveal">
<div class="contact-info">
<p>Every significant project begins with a dialogue. Whether you have a clear brief or just an idea — I'd love to hear from you.</p>
<div class="contact-items">${ci}</div>
${socials ? `<div class="contact-social">${socials}</div>` : ''}
</div>
</div>
</div>
</section>

<footer>
<div class="footer-logo">${nameParts.slice(0, -1).join(' ') || v.name} <span>${lastNameOf(v.name)}</span></div>
<div class="footer-copy">&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</div>
</footer>
${TERRA_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}

function lastNameOf(name: string): string {
	const p = name.split(/\s+/);
	return p.length > 1 ? p[p.length - 1] : '';
}
