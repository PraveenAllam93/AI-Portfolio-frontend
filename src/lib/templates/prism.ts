/**
 * Template: Prism (Designer)
 * Clean light product-design aesthetic — warm off-white canvas (#F5F5F3),
 * generous white rounded cards, blue (#4A90C4) accent with pastel highlight
 * chips, Cormorant Garamond display serif + Manrope body. Big rounded hero card
 * with portrait, icon achievement grid, philosophy quote, case-study project
 * cards, scroll reveals, nav-scroll.
 * Ported from "product-designer-1.html", mapped to our designer data model
 * (SVG portrait dropped; renders every designer section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Manrope:wght@300;400;500;600;700&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}
const ICONS = ['✦', '◆', '❖', '◇', '⬡', '✧', '❋', '◈'];

function css(): string {
	return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#F5F5F3;--white:#FFF;--text:#2D2D2D;--muted:#6B6B6B;--accent-bg:#EAF5FF;--accent:#4A90C4;
  --border:#ECECEC;--shadow:rgba(0,0,0,0.06);--serif:'Cormorant Garamond',Georgia,serif;--sans:'Manrope',system-ui,sans-serif;}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}
img{display:block;max-width:100%}
a{text-decoration:none;color:inherit}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}

nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:22px 56px;background:rgba(245,245,243,0.85);backdrop-filter:blur(16px);border-bottom:1px solid transparent;transition:border-color .3s,background .3s}
nav.scrolled{border-bottom-color:var(--border)}
.nav-logo{display:flex;align-items:center;gap:12px;font-weight:700;font-size:15px;letter-spacing:-.3px}
.nav-logo-mark{width:34px;height:34px;background:var(--text);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700;letter-spacing:-1px}
.nav-links{display:flex;align-items:center;gap:36px;list-style:none}
.nav-links a{font-size:13.5px;font-weight:500;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--text)}
.nav-cta{padding:8px 18px;background:var(--text);color:#fff!important;border-radius:20px;font-size:13px;font-weight:600;transition:opacity .2s}
.nav-cta:hover{opacity:.8}
@media(max-width:900px){nav{padding:18px 24px}.nav-links a:not(.nav-cta){display:none}}

main{padding-top:100px}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s ease}
.reveal.in{opacity:1;transform:none}

/* HERO */
.hero{padding:24px 48px 40px}
.hero-card{background:var(--white);border-radius:36px;padding:64px 72px;overflow:hidden;box-shadow:0 4px 40px var(--shadow);display:grid;grid-template-columns:1fr 1fr;gap:40px;min-height:480px;position:relative}
.hero-left{display:flex;flex-direction:column;justify-content:center}
.hero-eyebrow{display:flex;align-items:center;gap:14px;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);margin-bottom:20px}
.hero-eyebrow::before{content:'';display:block;width:32px;height:1.5px;background:var(--muted)}
.hero-title{font-family:var(--serif);font-size:clamp(56px,7vw,110px);font-weight:400;line-height:.92;letter-spacing:-2px;margin-bottom:28px}
.hero-desc{font-size:17px;color:var(--muted);line-height:1.65;max-width:420px}
.hero-desc .hl{background:var(--accent-bg);color:var(--accent);border-radius:4px;padding:1px 4px}
.hero-actions{display:flex;align-items:center;gap:16px;margin-top:32px;flex-wrap:wrap}
.btn-primary{padding:13px 28px;background:var(--text);color:#fff;border-radius:50px;font-size:13.5px;font-weight:600;transition:transform .2s,box-shadow .2s}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15)}
.btn-outline{padding:13px 28px;border:1.5px solid var(--border);border-radius:50px;font-size:13.5px;font-weight:500;transition:border-color .2s,background .2s}
.btn-outline:hover{border-color:#ccc;background:rgba(0,0,0,0.02)}
.hero-right{display:flex;align-items:center;justify-content:center}
.portrait{width:100%;max-width:400px;aspect-ratio:4/5;border-radius:28px;overflow:hidden;background:linear-gradient(150deg,var(--accent-bg),#f0f0ee)}
.portrait img{width:100%;height:100%;object-fit:cover}
.portrait-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:6rem;color:var(--accent);opacity:.5}
@media(max-width:900px){.hero{padding:16px 20px 30px}.hero-card{grid-template-columns:1fr;padding:40px 32px}.hero-right{order:-1}.portrait{max-width:280px}}

/* SECTION */
.section{padding:70px 48px;max-width:1280px;margin:0 auto}
.section-label{display:flex;align-items:center;gap:14px;font-size:10.5px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:40px}
.section-label::after{content:'';flex:1;height:1px;background:var(--border)}
.section-title{font-family:var(--serif);font-size:clamp(40px,5vw,64px);font-weight:400;line-height:1.05;letter-spacing:-1.5px;margin-bottom:20px}
.section-body{font-size:16px;color:var(--muted);line-height:1.75;max-width:560px}

/* ACHIEVEMENTS icon grid */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
.ach-card{background:var(--white);border-radius:20px;padding:28px 22px;text-align:center;border:1px solid var(--border);transition:transform .25s,box-shadow .25s;position:relative}
.ach-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.08)}
.ach-icon{width:52px;height:52px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;color:var(--accent)}
.ach-title{font-size:13.5px;font-weight:600;line-height:1.4}
.ach-sub{font-size:11.5px;color:var(--muted);margin-top:6px;line-height:1.5}
.ach-year{font-family:var(--serif);font-size:1.6rem;color:var(--accent);margin-bottom:6px}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:start}
.about-stats{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:40px}
.stat-card{background:var(--white);border-radius:20px;padding:28px 24px;border:1px solid var(--border)}
.stat-num{font-family:var(--serif);font-size:52px;font-weight:400;letter-spacing:-2px;line-height:1}
.stat-label{font-size:12px;color:var(--muted);margin-top:8px;font-weight:500}
.philosophy-tag{display:inline-block;padding:6px 14px;background:var(--accent-bg);color:var(--accent);border-radius:20px;font-size:12px;font-weight:600;margin-bottom:20px}
.about-philosophy{font-family:var(--serif);font-size:28px;font-weight:400;line-height:1.45;letter-spacing:-.5px;margin-bottom:24px;font-style:italic}
.about-body{font-size:16px;color:var(--muted);line-height:1.75}
@media(max-width:900px){.about-grid{grid-template-columns:1fr;gap:40px}}

/* CASE STUDIES (projects) */
.case-grid{display:grid;gap:16px}
.case-card{background:var(--white);border-radius:28px;overflow:hidden;border:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr;transition:box-shadow .3s;position:relative}
.case-card:hover{box-shadow:0 16px 48px rgba(0,0,0,0.1)}
.case-visual{background:linear-gradient(135deg,#f0f0ee 0%,#e8e8e6 100%);min-height:300px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.case-visual img{width:100%;height:100%;object-fit:cover}
.case-visual-ph{font-family:var(--serif);font-size:4rem;color:var(--accent);opacity:.4}
.case-content{padding:44px 48px;display:flex;flex-direction:column;justify-content:center}
.case-cat{display:inline-block;padding:5px 12px;background:var(--accent-bg);color:var(--accent);border-radius:16px;font-size:11px;font-weight:600;letter-spacing:.5px;margin-bottom:16px;width:fit-content}
.case-title{font-family:var(--serif);font-size:34px;font-weight:400;letter-spacing:-1px;line-height:1.1;margin-bottom:16px}
.case-desc{font-size:15px;color:var(--muted);line-height:1.7;margin-bottom:16px}
.case-pts{list-style:none;margin-bottom:16px}
.case-pts li{font-size:14px;color:var(--muted);line-height:1.6;padding-left:1.1rem;position:relative}
.case-pts li::before{content:'—';position:absolute;left:0;color:var(--accent)}
.case-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
.chip{font-size:11.5px;font-weight:500;padding:6px 13px;border-radius:20px;border:1px solid var(--border);color:var(--muted)}
.case-link{margin-top:16px;font-size:13px;font-weight:600;color:var(--accent);width:fit-content}
@media(max-width:768px){.case-card{grid-template-columns:1fr}}

/* SKILLS / cards grid */
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.wcard{background:var(--white);border-radius:24px;padding:32px 28px;border:1px solid var(--border);transition:transform .25s,box-shadow .25s;position:relative}
.wcard:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.07)}
.wcard-icon{font-size:1.6rem;color:var(--accent);margin-bottom:16px}
.wcard-title{font-family:var(--serif);font-size:24px;font-weight:500;margin-bottom:14px}
.wcard-meta{font-size:14px;color:var(--muted);line-height:1.7}
.wcard-year{display:inline-block;margin-top:12px;padding:5px 12px;background:var(--accent-bg);color:var(--accent);border-radius:16px;font-size:12px;font-weight:600}
.wcard-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.wcard-link{display:inline-block;margin-top:12px;font-size:13px;font-weight:600;color:var(--accent)}

/* TIMELINE (experience) */
.timeline{position:relative;padding-left:2rem;border-left:1.5px solid var(--border);max-width:820px}
.t-item{position:relative;padding-bottom:2.5rem}
.t-item:last-child{padding-bottom:0}
.t-item::before{content:'';position:absolute;left:calc(-2rem - 6px);top:6px;width:11px;height:11px;border-radius:50%;background:var(--accent);border:2px solid var(--bg)}
.t-year{font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--accent);margin-bottom:.4rem}
.t-title{font-family:var(--serif);font-size:26px;font-weight:500;margin-bottom:.2rem}
.t-sub{font-size:14px;color:var(--muted);margin-bottom:.6rem}
.t-desc{font-size:15px;color:var(--muted);line-height:1.7;max-width:600px}
.t-kps{list-style:none;margin-top:.6rem}
.t-kp{font-size:14px;color:var(--muted);line-height:1.6;padding-left:1.1rem;position:relative}
.t-kp::before{content:'—';position:absolute;left:0;color:var(--accent)}

/* TOOLS + PHILOSOPHY */
.tool-cloud{display:flex;flex-wrap:wrap;gap:12px}
.tool-chip{font-size:14px;font-weight:500;padding:11px 20px;border-radius:24px;background:var(--white);border:1px solid var(--border);transition:.2s}
.tool-chip:hover{border-color:var(--accent);color:var(--accent)}
.philo-quote{font-family:var(--serif);font-style:italic;font-size:clamp(26px,3.5vw,40px);line-height:1.4;letter-spacing:-.5px;max-width:20ch}

/* CONTACT */
.contact-card{background:var(--white);border-radius:32px;padding:64px 56px;border:1px solid var(--border);text-align:center;box-shadow:0 4px 40px var(--shadow)}
.contact-title{font-family:var(--serif);font-size:clamp(40px,5vw,64px);font-weight:400;letter-spacing:-1.5px;line-height:1.05;margin-bottom:20px}
.contact-sub{font-size:16px;color:var(--muted);max-width:460px;margin:0 auto 32px;line-height:1.7}
.contact-items{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:24px}
.contact-item{padding:12px 22px;border:1px solid var(--border);border-radius:24px;font-size:14px;font-weight:500;transition:.2s}
.contact-item:hover{border-color:var(--accent);color:var(--accent)}
.socials{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.socials a{padding:10px 20px;border-radius:24px;background:var(--accent-bg);color:var(--accent);font-size:13px;font-weight:600;transition:.2s}
.socials a:hover{opacity:.8}

footer{padding:40px 48px;text-align:center;font-size:13px;color:var(--muted)}

/* EDIT CONTROLS */
.ce-add-btn{font-size:13px;font-weight:600;color:var(--text);background:var(--white);border:1.5px solid var(--border);border-radius:24px;padding:13px 28px;cursor:pointer;margin-top:24px;display:block;width:100%;text-align:center;transition:.2s}
.ce-add-btn:hover{border-color:var(--accent);color:var(--accent)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:16px;right:16px;width:26px;height:26px;border-radius:50%;border:none;background:var(--text);color:#fff;font-size:12px;line-height:26px;text-align:center;cursor:pointer;z-index:20;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const PRISM_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>20);});}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
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
	const certCount = v.certifications?.length ?? 0;
	const awardsCount = v.awards?.length ?? 0;
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'D';

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

	// PROJECTS (case cards)
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects" class="section">
<div class="section-label reveal">Selected Work</div>
<div class="case-grid">
${v.projects.map((p, i) => `<div class="case-card reveal"${iw}>
${delBtn('projects', i)}
<div class="case-visual" ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="case-visual-ph">${initials}</div>`}</div>
<div class="case-content">
${p.project_category ? `<span class="case-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</span>` : ''}
<div class="case-title" ${ed(`projects.${i}.title`)}>${p.title || (em ? 'Project' : '')}</div>
${p.description ? `<p class="case-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${p.responsibilities?.length ? `<ul class="case-pts" ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
${p.measurable_outcomes?.length ? `<ul class="case-pts" ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul>` : ''}
${p.tech_stack?.length ? `<div class="case-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="case-tags" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
${p.project_url ? `<a href="${p.project_url}" class="case-link" target="_blank" rel="noopener noreferrer">View project &#8599;</a>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>` : '';

	// SKILLS cards
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" class="section">
<div class="section-label reveal">Capabilities</div>
<h2 class="section-title reveal">Craft &amp; expertise</h2>
<div class="card-grid" style="margin-top:40px">
${v.skill_groups.map((g, gi) => `<div class="wcard reveal"${iw}>
${delBtn('skills', gi)}
<div class="wcard-icon">${ICONS[gi % ICONS.length]}</div>
<div class="wcard-title" ${ed(`skills.${gi}.category`)}>${g.category}</div>
<div class="wcard-tags" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="chip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency" class="section">
<div class="section-label reveal">Toolkit</div>
<h2 class="section-title reveal">Software, mastered</h2>
<div class="tool-cloud reveal" style="margin-top:32px" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map(t => `<span class="tool-chip">${t}</span>`).join('') || `<span class="tool-chip" style="opacity:.5">+ Add</span>`}</div>
</section>` : '';

	// EXPERIENCE timeline
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" class="section">
<div class="section-label reveal">Experience</div>
<h2 class="section-title reveal">A working life</h2>
<div class="timeline" style="margin-top:40px">
${v.experience.map((exp, i) => `<div class="t-item reveal"${iw}>
${delBtn('experience', i)}
<div class="t-year">${expPeriod(i, exp)}</div>
<div class="t-title" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
${(exp.company || exp.location) ? `<div class="t-sub">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.company && exp.location ? ' · ' : ''}${exp.location ? `<span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="t-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<ul class="t-kps" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li class="t-kp">${k}</li>`).join('')}</ul>` : ''}
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="section">
<div class="section-label reveal">Education</div>
<h2 class="section-title reveal">Academic background</h2>
<div class="card-grid" style="margin-top:40px">
${v.education.map((edu, i) => `<div class="wcard reveal"${iw}>
${delBtn('education', i)}
<div class="wcard-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
${(edu.institution || edu.location) ? `<div class="wcard-meta">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.institution && edu.location ? ' · ' : ''}${edu.location ? `<span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${eduYears(i, edu) ? `<span class="wcard-year">${eduYears(i, edu)}</span>` : ''}
${edu.grade_or_score ? `<span class="wcard-year" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" class="section">
<div class="section-label reveal">Credentials</div>
<h2 class="section-title reveal">Certifications</h2>
<div class="card-grid" style="margin-top:40px">
${v.certifications.map((c, i) => `<div class="wcard reveal"${iw}>
${delBtn('certifications', i)}
<div class="wcard-title" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="wcard-meta" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.year ? `<span class="wcard-year" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
${c.url ? `<a href="${c.url}" class="wcard-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>` : '';

	// ACHIEVEMENTS (icon grid)
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="section">
<div class="section-label reveal">Recognition</div>
<h2 class="section-title reveal">Moments that mattered</h2>
<div class="ach-grid" style="margin-top:40px">
${v.achievements.map((a, i) => `<div class="ach-card reveal"${iw}>
${delBtn('achievements', i)}
${a.year ? `<div class="ach-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : `<div class="ach-icon">${ICONS[i % ICONS.length]}</div>`}
<div class="ach-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="ach-sub" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>` : '';

	// AWARDS
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards" class="section">
<div class="section-label reveal">Honours</div>
<h2 class="section-title reveal">Awards &amp; prizes</h2>
<div class="card-grid" style="margin-top:40px">
${(v.awards ?? []).map((a, i) => `<div class="wcard reveal"${iw}>
${delBtn('awards', i)}
<div class="wcard-title" ${ed(`awards.${i}.title`)}>${a.title}</div>
${a.awarding_body ? `<div class="wcard-meta" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}
${a.year ? `<span class="wcard-year" ${ed(`awards.${i}.year`)}>${a.year}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</section>` : '';

	// PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy" class="section">
<div class="section-label reveal">Philosophy</div>
<p class="philo-quote reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</section>` : '';

	// CUSTOM
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="wcard"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<span class="wcard-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}
${item.label ? `<div class="wcard-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="wcard-meta" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="wcard-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="wcard-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}" class="section">
<div class="section-label reveal" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</div>
<h2 class="section-title reveal" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</h2>
<div class="card-grid" style="margin-top:40px">${cards}</div>
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

	// ABOUT
	const aboutStats = [
		statShown(v, 'years_experience', yearsExp) ? `<div class="stat-card"><div class="stat-num" ${ed('template_overrides.years_experience')}>${yearsExp}+</div><div class="stat-label">Years Experience</div></div>` : '',
		statShown(v, 'projects_count', projCount) ? `<div class="stat-card"><div class="stat-num" ${ed('template_overrides.projects_count')}>${projCount}</div><div class="stat-label">Projects</div></div>` : '',
		certCount > 0 ? `<div class="stat-card"><div class="stat-num">${certCount}</div><div class="stat-label">Certifications</div></div>` : '',
		awardsCount > 0 ? `<div class="stat-card"><div class="stat-num">${awardsCount}</div><div class="stat-label">Awards</div></div>` : '',
	].filter(Boolean).join('');

	// CONTACT
	const cItems = [
		v.email ? `<a class="contact-item" href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a>` : '',
		v.phone ? `<span class="contact-item" ${ed('profile.phone')}>${v.phone}</span>` : '',
		v.location ? `<span class="contact-item" ${ed('profile.location')}>${v.location}</span>` : '',
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
<a href="#home" class="nav-logo"><span class="nav-logo-mark">${initials}</span><span ${ed('profile.full_name')}>${v.name}</span></a>
<ul class="nav-links">
<li><a href="#about">About</a></li>
<li><a href="#projects">Work</a></li>
<li><a href="#experience">Experience</a></li>
${v.email ? `<li><a href="mailto:${v.email}" class="nav-cta">Contact</a></li>` : ''}
</ul>
</nav>

<main>
<section class="hero" id="home">
<div class="hero-card">
<div class="hero-left">
<div class="hero-eyebrow">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : ''}</div>
<h1 class="hero-title" ${ed('profile.full_name')}>${v.name}</h1>
${v.headline ? `<p class="hero-desc" ${ed('portfolio.headline')}>${v.headline}</p>` : (v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : '')}
<div class="hero-actions">
<a href="#projects" class="btn-primary">View Work</a>
${v.email ? `<a href="mailto:${v.email}" class="btn-outline">Get in touch</a>` : ''}
</div>
</div>
<div class="hero-right">
<div class="portrait" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="portrait-ph">${initials}</div>`}</div>
</div>
</div>
</section>

<section id="about" class="section">
<div class="section-label reveal">About</div>
<div class="about-grid">
<div class="reveal">
<h2 class="section-title">A designer with an eye for clarity.</h2>
${v.bio ? `<p class="about-body" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${aboutStats ? `<div class="about-stats">${aboutStats}</div>` : ''}
</div>
<div class="reveal about-right">
<span class="philosophy-tag">Approach</span>
${v.uniqueValue ? `<p class="about-philosophy" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
</div>
</div>
</section>

${orderedSections}

<section id="contact" class="section">
<div class="contact-card reveal">
<h2 class="contact-title">Let's work together</h2>
<p class="contact-sub">Whether you have a product to shape or just want to talk design — I'd love to hear from you.</p>
${cItems ? `<div class="contact-items">${cItems}</div>` : ''}
${socials ? `<div class="socials">${socials}</div>` : ''}
</div>
</section>
</main>

<footer>&copy; ${new Date().getFullYear()} ${v.name} · ${v.profile_headline || v.headline || 'Designer Portfolio'}</footer>
${PRISM_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
