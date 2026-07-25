/**
 * Template: Salon (Designer)
 * Elegant luxury interior aesthetic — warm off-white canvas (#f9f7f4), near-black
 * ink, gold (#d4af37) + taupe accents, Playfair Display headings with a centered
 * gold-underline motif, Inter body. Framed hero portrait with gold corner accent,
 * sliding gold-fill buttons, refined cards, scroll reveals, header-scroll shadow.
 * Ported from "interiar-desginer-2.html", mapped to our designer data model
 * (FontAwesome + hero video dropped; renders every designer section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}
const ICONS = ['◆', '✦', '❖', '◇', '⬡', '✧', '❋', '◈'];

function css(): string {
	return `
:root{--primary:#0d0d0d;--gold:#d4af37;--accent:#8b7355;--light:#f9f7f4;--gray:#e8e5e0;
  --text-dark:#1a1a1a;--text-light:#8a8a8a;--trans:all .5s cubic-bezier(.25,.46,.45,.94);
  --shadow:0 20px 40px rgba(0,0,0,0.08);--shadow-hover:0 30px 60px rgba(0,0,0,0.12);
  --pf:'Playfair Display',serif;--in:'Inter',sans-serif;}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--in);background:var(--light);color:var(--text-dark);line-height:1.7;overflow-x:hidden}
h1,h2,h3,h4,h5{font-family:var(--pf);font-weight:600;line-height:1.2}
p{color:var(--text-light);margin-bottom:1.5rem}
img{display:block;max-width:100%}
a{text-decoration:none;color:inherit}
ul{list-style:none}
.container{width:90%;max-width:1400px;margin:0 auto;padding:0 20px}
section{padding:90px 0;position:relative}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .9s ease,transform .9s ease}
.reveal.in{opacity:1;transform:none}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--gold);color:var(--primary);padding:16px 34px;font-weight:600;letter-spacing:1.5px;transition:var(--trans);border:2px solid var(--gold);text-transform:uppercase;font-size:.9rem;position:relative;overflow:hidden;z-index:1}
.btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:var(--primary);transition:var(--trans);z-index:-1}
.btn:hover::before{left:0}.btn:hover{color:#fff;border-color:var(--primary);transform:translateY(-5px)}
.btn-outline{background:transparent;color:var(--primary);border-color:var(--primary)}
.btn-outline:hover{color:#fff}

.section-header{text-align:center;margin-bottom:60px}
.section-header h2{position:relative;padding-bottom:20px;margin-bottom:20px;font-size:clamp(2.2rem,4vw,3.2rem);display:inline-block}
.section-header h2::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:80px;height:3px;background:var(--gold)}
.section-header p{max-width:700px;margin:0 auto;font-size:1.1rem}
.eyebrow{font-family:var(--in);font-size:.8rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;display:block}

header{position:fixed;top:0;left:0;width:100%;padding:22px 0;z-index:1000;transition:var(--trans);background:rgba(249,247,244,0.95);backdrop-filter:blur(10px)}
header.scrolled{padding:14px 0;box-shadow:var(--shadow)}
.header-container{display:flex;justify-content:space-between;align-items:center}
.logo{font-family:var(--pf);font-size:2rem;font-weight:700;color:var(--primary);position:relative}
.logo::after{content:'';position:absolute;bottom:6px;right:-10px;width:9px;height:9px;background:var(--gold);border-radius:50%}
.nav-links{display:flex;gap:38px}
.nav-links a{color:var(--primary);font-weight:500;font-size:.95rem;letter-spacing:1px;position:relative;padding:5px 0;transition:var(--trans)}
.nav-links a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--gold);transition:var(--trans)}
.nav-links a:hover::after{width:100%}.nav-links a:hover{color:var(--gold)}
@media(max-width:900px){.nav-links{display:none}}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;background:linear-gradient(135deg,#141414,#0d0d0d)}
.hero .container{display:flex;align-items:center;justify-content:space-between;gap:60px;position:relative;z-index:2}
.hero-content{color:#fff;max-width:760px}
.hero-content .eyebrow{color:var(--gold)}
.hero-content h1{font-size:clamp(3rem,7vw,5rem);letter-spacing:-1px;color:#fff;margin-bottom:1.2rem}
.hero-content h1 em{font-style:italic;color:var(--gold)}
.hero-content .subtitle{font-size:1.15rem;color:rgba(255,255,255,.7);max-width:520px;margin-bottom:2rem}
.hero-actions{display:flex;gap:16px;flex-wrap:wrap}
.hero-photo-frame{position:relative;flex-shrink:0;width:340px;height:430px}
.hero-photo-frame::before{content:'';position:absolute;top:-16px;right:-16px;bottom:16px;left:16px;border:2px solid var(--gold);z-index:0}
.hero-photo{position:relative;z-index:1;width:100%;height:100%;object-fit:cover;background:linear-gradient(160deg,#2a2a2a,#0d0d0d)}
.hero-photo-ph{display:flex;align-items:center;justify-content:center;font-family:var(--pf);font-size:5rem;color:var(--gold);opacity:.4}
@media(max-width:900px){.hero .container{flex-direction:column;text-align:center}.hero-photo-frame{width:280px;height:350px;order:-1}.hero-actions{justify-content:center}}

/* GRID CARDS */
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:30px}
.lcard{background:#fff;border:1px solid var(--gray);box-shadow:var(--shadow);transition:var(--trans);position:relative}
.lcard:hover{transform:translateY(-8px);box-shadow:var(--shadow-hover)}
.lcard-media{aspect-ratio:4/3;overflow:hidden;position:relative;background:linear-gradient(160deg,var(--gray),#dcd7cf)}
.lcard-media img{width:100%;height:100%;object-fit:cover;transition:transform 1s ease}
.lcard:hover .lcard-media img{transform:scale(1.06)}
.lcard-media-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--pf);font-size:2.6rem;color:var(--accent);opacity:.5}
.lcard-body{padding:30px 28px}
.lcard-cat{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;display:block}
.lcard-title{font-family:var(--pf);font-size:1.6rem;margin-bottom:12px}
.lcard-desc{font-size:.95rem;color:var(--text-light);line-height:1.7;margin-bottom:14px}
.lcard-pts{list-style:none;margin-bottom:14px}
.lcard-pts li{font-size:.9rem;color:var(--text-light);line-height:1.6;padding-left:1.1rem;position:relative}
.lcard-pts li::before{content:'—';position:absolute;left:0;color:var(--gold)}
.lcard-tags{display:flex;flex-wrap:wrap;gap:8px}
.ltag{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);border:1px solid var(--gray);padding:.35rem .7rem}
.lcard-year{display:inline-block;font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold);padding:.3rem .8rem;margin-top:10px}
.lcard-link{display:inline-block;margin-top:12px;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);border-bottom:1px solid var(--gold)}

/* SKILLS cards */
.skill-card{background:#fff;border:1px solid var(--gray);box-shadow:var(--shadow);padding:36px 30px;transition:var(--trans);position:relative;text-align:center}
.skill-card:hover{transform:translateY(-8px);box-shadow:var(--shadow-hover)}
.skill-icon{font-size:2rem;color:var(--gold);margin-bottom:16px}
.skill-card h3{font-size:1.5rem;margin-bottom:14px}
.skill-tags{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}

/* TIMELINE */
.timeline{position:relative;max-width:860px;margin:0 auto;padding-left:2.5rem;border-left:2px solid var(--gray)}
.t-item{position:relative;padding-bottom:3rem}
.t-item:last-child{padding-bottom:0}
.t-item::before{content:'';position:absolute;left:calc(-2.5rem - 7px);top:6px;width:12px;height:12px;border-radius:50%;background:var(--gold);border:2px solid var(--light)}
.t-year{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem}
.t-title{font-family:var(--pf);font-size:1.7rem;margin-bottom:.2rem}
.t-sub{font-size:.9rem;color:var(--accent);margin-bottom:.7rem}
.t-desc{font-size:.98rem;color:var(--text-light);line-height:1.8;max-width:620px}
.t-kps{list-style:none;margin-top:.7rem}
.t-kp{font-size:.92rem;color:var(--text-light);line-height:1.7;padding-left:1.1rem;position:relative}
.t-kp::before{content:'—';position:absolute;left:0;color:var(--gold)}

/* PHILOSOPHY + TOOLS */
.philo{font-family:var(--pf);font-style:italic;font-size:clamp(1.8rem,3vw,2.8rem);line-height:1.4;text-align:center;max-width:22ch;margin:0 auto;color:var(--text-dark)}
.tool-cloud{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.tool-chip{font-size:.9rem;letter-spacing:.06em;padding:.8rem 1.6rem;border:1px solid var(--gray);background:#fff;color:var(--text-dark);transition:var(--trans)}
.tool-chip:hover{border-color:var(--gold);color:var(--gold)}

/* CONTACT */
.contact-wrap{background:var(--primary);color:#fff;padding:70px 56px;text-align:center;position:relative}
.contact-wrap h2{color:#fff;font-size:clamp(2.4rem,4vw,3.4rem);margin-bottom:18px}
.contact-wrap h2 em{font-style:italic;color:var(--gold)}
.contact-wrap p{color:rgba(255,255,255,.6);max-width:480px;margin:0 auto 30px}
.contact-items{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:26px}
.contact-item{padding:12px 24px;border:1px solid rgba(255,255,255,.2);color:#fff;font-size:.9rem;letter-spacing:.05em;transition:var(--trans)}
.contact-item:hover{border-color:var(--gold);color:var(--gold)}
.socials{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.socials a{padding:11px 22px;background:var(--gold);color:var(--primary);font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;transition:var(--trans)}
.socials a:hover{transform:translateY(-3px)}

footer{padding:36px 0;text-align:center;font-size:.85rem;color:var(--text-light);border-top:1px solid var(--gray)}

/* EDIT CONTROLS */
.ce-add-btn{font-family:var(--in);font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--primary);background:#fff;border:2px solid var(--gold);padding:14px 30px;cursor:pointer;margin:30px auto 0;display:block;transition:var(--trans)}
.ce-add-btn:hover{background:var(--gold)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:14px;right:14px;width:28px;height:28px;border-radius:50%;border:none;background:var(--primary);color:#fff;font-size:12px;line-height:28px;text-align:center;cursor:pointer;z-index:20;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const SALON_SCRIPT = `<script>
(function(){
  var h=document.querySelector('header');
  if(h){window.addEventListener('scroll',function(){h.classList.toggle('scrolled',window.scrollY>40);});}
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
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'D';
	const nameParts = v.name.split(/\s+/);
	const heroName = nameParts.length > 1
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
	const shead = (eyebrow: string, title: string) => `<div class="section-header reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>`;

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="container">
${shead('Portfolio', 'Selected Work')}
<div class="card-grid">
${v.projects.map((p, i) => `<div class="lcard reveal"${iw}>
${delBtn('projects', i)}
<div class="lcard-media" ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="lcard-media-ph">${initials}</div>`}</div>
<div class="lcard-body">
${p.project_category ? `<span class="lcard-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</span>` : ''}
<div class="lcard-title" ${ed(`projects.${i}.title`)}>${p.title || 'Project'}</div>
${p.description ? `<p class="lcard-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${p.responsibilities?.length ? `<ul class="lcard-pts" ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
${p.measurable_outcomes?.length ? `<ul class="lcard-pts" ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul>` : ''}
${p.tech_stack?.length ? `<div class="lcard-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="ltag">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="lcard-tags" style="margin-top:8px" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="ltag">${t}</span>`).join('')}</div>` : ''}
${p.project_url ? `<a href="${p.project_url}" class="lcard-link" target="_blank" rel="noopener noreferrer">View project &#8599;</a>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('projects', 'Project')}
</div></section>` : '';

	// SKILLS
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" style="background:var(--gray)"><div class="container">
${shead('Expertise', 'Craft & Services')}
<div class="card-grid">
${v.skill_groups.map((g, gi) => `<div class="skill-card reveal"${iw}>
${delBtn('skills', gi)}
<div class="skill-icon">${ICONS[gi % ICONS.length]}</div>
<h3 ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</h3>
<div class="skill-tags" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="ltag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency"><div class="container">
${shead('Toolkit', 'Software & Tools')}
<div class="tool-cloud reveal" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map(t => `<span class="tool-chip">${t}</span>`).join('') || `<span class="tool-chip" style="opacity:.5">+ Add</span>`}</div>
</div></section>` : '';

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" style="background:var(--gray)"><div class="container">
${shead('Journey', 'Career Experience')}
<div class="timeline">
${v.experience.map((exp, i) => `<div class="t-item reveal"${iw}>
${delBtn('experience', i)}
<div class="t-year">${expPeriod(i, exp)}</div>
<div class="t-title" ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}</div>
${(exp.company || exp.location) ? `<div class="t-sub">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.company && exp.location ? ' · ' : ''}${exp.location ? `<span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="t-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<ul class="t-kps" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li class="t-kp">${k}</li>`).join('')}</ul>` : ''}
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="container">
${shead('Academic', 'Education & Training')}
<div class="card-grid">
${v.education.map((edu, i) => `<div class="skill-card reveal" style="text-align:left"${iw}>
${delBtn('education', i)}
<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>
${(edu.institution || edu.location) ? `<p style="margin-bottom:8px">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.institution && edu.location ? ' · ' : ''}${edu.location ? `<span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</p>` : ''}
${eduYears(i, edu) ? `<span class="lcard-year">${eduYears(i, edu)}</span>` : ''}
${edu.grade_or_score ? `<span class="lcard-year" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" style="background:var(--gray)"><div class="container">
${shead('Credentials', 'Certifications')}
<div class="card-grid">
${v.certifications.map((c, i) => `<div class="skill-card reveal" style="text-align:left"${iw}>
${delBtn('certifications', i)}
<h3 ${ed(`certifications.${i}.name`)}>${c.name}</h3>
${c.issuer ? `<p style="margin-bottom:8px" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</p>` : ''}
${c.year ? `<span class="lcard-year" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
${c.url ? `<a href="${c.url}" class="lcard-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="container">
${shead('Recognition', 'Achievements')}
<div class="card-grid">
${v.achievements.map((a, i) => `<div class="skill-card reveal" style="text-align:left"${iw}>
${delBtn('achievements', i)}
${a.year ? `<span class="lcard-year" style="margin-top:0;margin-bottom:12px" ${ed(`achievements.${i}.year`)}>${a.year}</span>` : ''}
<h3 ${ed(`achievements.${i}.title`)}>${a.title}</h3>
${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>` : '';

	// AWARDS
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards" style="background:var(--gray)"><div class="container">
${shead('Honours', 'Awards & Prizes')}
<div class="card-grid">
${(v.awards ?? []).map((a, i) => `<div class="skill-card reveal" style="text-align:left"${iw}>
${delBtn('awards', i)}
<h3 ${ed(`awards.${i}.title`)}>${a.title}</h3>
${a.awarding_body ? `<p ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body}</p>` : ''}
${a.year ? `<span class="lcard-year" ${ed(`awards.${i}.year`)}>${a.year}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</div></section>` : '';

	// PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy"><div class="container">
${shead('Philosophy', 'The Why')}
<p class="philo reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</div></section>` : '';

	// CUSTOM
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="skill-card" style="text-align:left"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<span class="lcard-year" style="margin-top:0;margin-bottom:12px" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}
${item.label ? `<h3 ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</h3>` : ''}
${item.value ? `<p ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</p>` : ''}
${item.tags?.length ? `<div class="skill-tags" style="justify-content:flex-start" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="ltag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="lcard-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="container">
${shead(cs.title, cs.title)}
<div class="card-grid">${cards}</div>
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
	const cItems = [
		v.email ? `<a class="contact-item" href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a>` : '',
		v.phone ? `<span class="contact-item" ${ed('profile.phone')}>${v.phone}</span>` : '',
		v.location ? `<span class="contact-item" ${ed('profile.location')}>${v.location}</span>` : '',
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
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<header>
<div class="container header-container">
<a href="#home" class="logo" ${ed('profile.full_name')}>${nameParts[0] || v.name}</a>
<nav><ul class="nav-links">
<li><a href="#projects">Work</a></li>
<li><a href="#skills">Expertise</a></li>
<li><a href="#experience">Experience</a></li>
<li><a href="#contact">Contact</a></li>
</ul></nav>
</div>
</header>

<section class="hero" id="home">
<div class="container">
<div class="hero-content">
<span class="eyebrow">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Design & Craft'}</span>
<h1 ${ed('profile.full_name')}>${heroName}</h1>
${v.headline ? `<p class="subtitle" ${ed('portfolio.headline')}>${v.headline}</p>` : (v.bio ? `<p class="subtitle" ${ed('portfolio.bio', true)}>${v.bio}</p>` : '')}
<div class="hero-actions">
<a href="#projects" class="btn">View Work</a>
${v.email ? `<a href="mailto:${v.email}" class="btn btn-outline" style="color:#fff;border-color:#fff">Contact</a>` : ''}
</div>
</div>
<div class="hero-photo-frame" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img class="hero-photo" src="${v.profile_image}" alt="${v.name}">` : `<div class="hero-photo hero-photo-ph">${initials}</div>`}</div>
</div>
</section>

${(v.bio || v.uniqueValue || em) ? `<section id="about"><div class="container">
${shead('About', 'The Practice')}
<div style="max-width:780px;margin:0 auto;text-align:center">
${v.uniqueValue ? `<p class="philo reveal" style="font-size:clamp(1.4rem,2.4vw,2rem);margin-bottom:2rem" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${v.bio ? `<p class="reveal" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
</div>
</div></section>` : ''}

${orderedSections}

<section id="contact"><div class="container">
<div class="contact-wrap reveal">
<h2>Let's create <em>something timeless</em></h2>
<p>Whether you have a space to shape or a story to tell — I'd love to hear from you.</p>
${cItems ? `<div class="contact-items">${cItems}</div>` : ''}
${socials ? `<div class="socials">${socials}</div>` : ''}
</div>
</div></section>

<footer><div class="container">&copy; ${new Date().getFullYear()} ${v.name} · ${v.profile_headline || v.headline || 'Designer Portfolio'}</div></footer>
${SALON_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
