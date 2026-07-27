/**
 * Template: Obsidian (Designer)
 * Dark gold-luxury UI/UX aesthetic — near-black (#0b0b0b), warm gold (#d4af6d)
 * accents, Cormorant Garamond serif with a gold gradient title, Inter body.
 * Ambient grain + vignette, framed about photo with gold outline, in-depth
 * case-study project cards, gold timeline, skill category tag-clouds, scroll
 * reveals.
 * Ported from "desginer-3.html", mapped to our designer data model
 * (external stock images dropped; skill % bars → tag clouds per Z16;
 * renders every designer section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';

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
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0b0b0b;--ink:#ece8e1;--gold:#d4af6d;--muted:#b8b1a5;--faint:#8a8378;--line:rgba(255,255,255,.08);
  --serif:'Cormorant Garamond',serif;--sans:'Inter',sans-serif;}
html,body{background:var(--bg);color:var(--ink);font-family:var(--sans);overflow-x:hidden;scroll-behavior:smooth}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
.serif{font-family:var(--serif);font-weight:400}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(120% 80% at 50% 0%,rgba(212,175,109,0.08),transparent 60%),radial-gradient(120% 80% at 50% 100%,rgba(0,0,0,0.6),transparent 60%)}
.wrap{position:relative;z-index:3;max-width:1280px;margin:0 auto;padding:0 2rem}

nav.top{position:fixed;top:0;left:0;right:0;z-index:50;padding:1.4rem 2rem;display:flex;justify-content:space-between;align-items:center;backdrop-filter:blur(14px);background:rgba(11,11,11,0.55);border-bottom:1px solid var(--line)}
nav.top .logo{font-family:var(--serif);font-size:1.5rem;letter-spacing:.18em;text-transform:uppercase}
nav.top ul{display:flex;gap:2rem;list-style:none}
nav.top ul a{font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;color:#cfc9be;transition:color .3s;position:relative}
nav.top ul a::after{content:"";position:absolute;left:0;bottom:-6px;height:1px;width:0;background:var(--gold);transition:width .35s ease}
nav.top ul a:hover{color:#fff}nav.top ul a:hover::after{width:100%}
@media(max-width:720px){nav.top ul{display:none}}

.hero{min-height:100vh;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:3rem;padding:8rem 0 4rem}
.hero-left h1{font-family:var(--serif);font-weight:500;font-size:clamp(3.5rem,9vw,7.5rem);line-height:.95;letter-spacing:-.02em;background:linear-gradient(180deg,#f5efe3 0%,#d4af6d 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero-left .kicker{display:inline-block;font-size:.75rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem}
.hero-left h1 em{font-style:italic}
.hero-left p.tag{margin-top:1.5rem;max-width:480px;color:var(--muted);font-size:1.05rem;line-height:1.7}
.hero-cta{margin-top:2.5rem;display:flex;gap:1rem;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:.6rem;padding:1rem 2rem;font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;border-radius:999px;transition:all .4s cubic-bezier(.2,.7,.2,1);border:1px solid transparent}
.btn-primary{background:linear-gradient(135deg,#d4af6d,#8a6a3d);color:#0b0b0b;box-shadow:0 12px 40px -10px rgba(212,175,109,.5)}
.btn-primary:hover{transform:translateY(-3px)}
.btn-ghost{border-color:rgba(255,255,255,.2);color:var(--ink)}
.btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
.profile-links{display:flex;gap:1.2rem;flex-wrap:wrap;margin-top:2rem}
.profile-links a{font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;color:var(--faint);padding-bottom:2px;border-bottom:1px solid transparent;transition:all .3s}
.profile-links a:hover{color:var(--gold);border-color:var(--gold)}
.hero-right{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:4px;box-shadow:0 40px 80px -20px rgba(0,0,0,.8);background:linear-gradient(160deg,#211a12,#0b0b0b)}
.hero-right img{width:100%;height:100%;object-fit:cover;filter:grayscale(.15) contrast(1.05);transition:transform 8s ease}
.hero-right:hover img{transform:scale(1.08)}
.hero-right-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:5rem;color:rgba(212,175,109,.4)}
.hero-right::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(0,0,0,.5))}
@media(max-width:900px){.hero{grid-template-columns:1fr;padding-top:7rem}.hero-right{max-width:420px;margin:0 auto}}

section{padding:6rem 0;position:relative}
.sec-label{font-size:.7rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;display:block}
.sec-title{font-family:var(--serif);font-size:clamp(2.5rem,5vw,4.5rem);line-height:1;margin-bottom:2rem;font-weight:500}
.sec-title em{font-style:italic;color:var(--gold)}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .9s ease,transform .9s ease}
.reveal.in{opacity:1;transform:none}

/* ABOUT */
.about{display:grid;grid-template-columns:1fr 1.2fr;gap:5rem;align-items:center}
.about-img{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:4px;background:linear-gradient(160deg,#211a12,#0b0b0b)}
.about-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(.3);transition:filter .8s,transform 1.2s}
.about-img:hover img{filter:none;transform:scale(1.05)}
.about-img-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:4rem;color:rgba(212,175,109,.35)}
.about-img::before{content:"";position:absolute;inset:-15px;border:1px solid var(--gold);border-radius:4px;z-index:-1}
.about p{color:var(--muted);line-height:1.9;font-size:1.05rem;margin-bottom:1.2rem}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:2rem;margin-top:3rem;padding-top:2.5rem;border-top:1px solid var(--line)}
.stat .n{font-family:var(--serif);font-size:2.8rem;color:var(--gold);line-height:1}
.stat .l{font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:var(--faint);margin-top:.6rem}
@media(max-width:900px){.about{grid-template-columns:1fr;gap:3rem}}

/* PROJECTS (case study cards) */
.featured-projects{display:flex;flex-direction:column;gap:3rem}
.fp-card{border:1px solid var(--line);border-radius:8px;padding:3rem;background:linear-gradient(180deg,rgba(255,255,255,.025),transparent);position:relative}
.fp-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:2rem;margin-bottom:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid var(--line)}
.fp-title h3{font-family:var(--serif);font-size:2.6rem;font-weight:500}
.fp-client{color:var(--gold);font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;margin-top:.6rem}
.fp-cover{width:100%;aspect-ratio:16/8;border-radius:6px;overflow:hidden;margin-bottom:2.8rem;background:linear-gradient(160deg,#1a140d,#0b0b0b)}
.fp-cover img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s ease}
.fp-cover:hover img{transform:scale(1.04)}
.fp-cover-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:3rem;color:rgba(212,175,109,.3)}
.fp-body{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:2.5rem 3rem;margin-bottom:2rem}
.fp-block h4{font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:.8rem}
.fp-block p{color:var(--muted);line-height:1.85;font-size:.98rem}
.fp-block ul{list-style:none}
.fp-block li{padding:.35rem 0;font-size:.92rem;color:#cfc9be;position:relative;padding-left:1.1rem}
.fp-block li::before{content:"—";color:var(--gold);position:absolute;left:0}
.tag-cloud{display:flex;flex-wrap:wrap;gap:.6rem}
.tag-chip{padding:.5rem 1rem;font-size:.78rem;border:1px solid rgba(255,255,255,.12);border-radius:999px;color:#cfc9be}
.fp-links{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem}
.fp-links a{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.6rem;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;border-radius:999px;border:1px solid rgba(255,255,255,.18);transition:all .35s}
.fp-links a:hover{border-color:var(--gold);color:var(--gold)}
@media(max-width:768px){.fp-body{grid-template-columns:1fr}}

/* SKILLS categories */
.skills-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem}
.skills-cat{border:1px solid var(--line);border-radius:6px;padding:2rem;background:rgba(255,255,255,.02);position:relative}
.skills-cat h3{font-family:var(--serif);font-size:1.5rem;margin-bottom:1.4rem;color:var(--gold);font-weight:500}
@media(max-width:900px){.skills-cats{grid-template-columns:1fr}}

/* TOOLS */
.tools-cloud{display:flex;flex-wrap:wrap;gap:1rem}
.tool-card{border:1px solid var(--line);border-radius:999px;padding:.8rem 1.5rem;font-family:var(--serif);font-size:1.2rem;background:linear-gradient(180deg,rgba(255,255,255,.02),transparent);transition:.3s}
.tool-card:hover{border-color:var(--gold);color:var(--gold)}

/* TIMELINE */
.timeline{position:relative;max-width:860px;padding-left:2.5rem;border-left:1px solid rgba(255,255,255,.1)}
.tl-item{position:relative;padding-bottom:3rem}
.tl-item:last-child{padding-bottom:0}
.tl-dot{position:absolute;left:-2.56rem;top:.3rem;width:12px;height:12px;border-radius:50%;background:var(--bg);border:2px solid var(--gold);box-shadow:0 0 0 4px rgba(212,175,109,.12)}
.tl-year{font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:.6rem}
.tl-item h3{font-family:var(--serif);font-size:1.7rem;font-weight:500;margin-bottom:.4rem}
.tl-place{font-size:.85rem;color:var(--faint);letter-spacing:.08em;margin-bottom:.8rem}
.tl-item p{color:var(--muted);line-height:1.8;font-size:.98rem;max-width:640px}
.tl-kps{list-style:none;margin-top:.6rem}
.tl-kp{padding:.3rem 0;font-size:.9rem;color:#cfc9be;position:relative;padding-left:1.1rem}
.tl-kp::before{content:"—";color:var(--gold);position:absolute;left:0}

/* EXPERIENCE cards */
.exp-list{display:flex;flex-direction:column;gap:2.5rem}
.exp-card{border:1px solid var(--line);border-radius:8px;padding:2.5rem;background:linear-gradient(180deg,rgba(255,255,255,.02),transparent);position:relative}
.exp-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1.5rem;margin-bottom:1.8rem;padding-bottom:1.8rem;border-bottom:1px solid var(--line)}
.exp-top h3{font-family:var(--serif);font-size:2rem;font-weight:500}
.exp-company{color:var(--gold);font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;margin-top:.5rem}
.exp-year{font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--faint);text-align:right}
.exp-summary{color:var(--muted);line-height:1.85;margin-bottom:1.4rem}
.exp-kps{list-style:none;margin-bottom:1rem}
.exp-kps li{padding:.4rem 0;font-size:.88rem;color:#cfc9be;position:relative;padding-left:1.1rem}
.exp-kps li::before{content:"—";color:var(--gold);position:absolute;left:0}

/* ACHIEVEMENTS / AWARDS */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem}
.ach-card{border:1px solid var(--line);border-radius:6px;padding:1.8rem;background:rgba(255,255,255,.02);position:relative}
.a-year{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:.6rem}
.ach-card h4{font-family:var(--serif);font-size:1.35rem;margin-bottom:.6rem;font-weight:500}
.ach-card p{color:var(--muted);font-size:.88rem;line-height:1.7;margin-bottom:.8rem}
.ach-link{font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);border-bottom:1px solid rgba(212,175,109,.4)}
.ach-body{font-family:var(--mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}

/* CERTIFICATIONS */
.cert-list{display:flex;flex-direction:column;gap:1rem}
.cert-item{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;padding:1.4rem 1.8rem;border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.02);position:relative}
.c-name{font-family:var(--serif);font-size:1.25rem}
.c-org{font-size:.75rem;color:var(--faint);letter-spacing:.08em;margin-top:.3rem}
.c-year{font-size:.75rem;color:var(--gold);letter-spacing:.15em;text-transform:uppercase}
.cert-item a{font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;border:1px solid rgba(255,255,255,.18);padding:.5rem 1rem;border-radius:999px;transition:all .3s}
.cert-item a:hover{border-color:var(--gold);color:var(--gold)}

/* PHILOSOPHY */
.philo{font-family:var(--serif);font-style:italic;font-size:clamp(1.8rem,3vw,3rem);line-height:1.4;color:var(--ink);max-width:22ch}
.philo em{font-style:normal;color:var(--gold)}
.cs-tags{margin-top:.6rem}

/* CONTACT */
.contact-wrap{display:grid;grid-template-columns:1fr 1.2fr;gap:4rem;align-items:start}
.contact-info p{color:var(--muted);line-height:1.8;margin-bottom:2.5rem}
.info-item{display:flex;align-items:flex-start;gap:1rem;padding:1.2rem 0;border-top:1px solid var(--line)}
.info-item:last-of-type{border-bottom:1px solid var(--line)}
.info-item .ic{width:40px;height:40px;border-radius:50%;background:rgba(212,175,109,.1);display:flex;align-items:center;justify-content:center;color:var(--gold);flex-shrink:0}
.info-item .lbl{font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:var(--faint)}
.info-item .val{margin-top:.3rem;font-size:1rem}
.socials{display:flex;gap:.8rem;margin-top:2rem;flex-wrap:wrap}
.socials a{padding:.7rem 1.3rem;border-radius:999px;border:1px solid rgba(255,255,255,.15);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;transition:all .4s}
.socials a:hover{background:var(--gold);color:#0b0b0b;border-color:var(--gold)}
@media(max-width:900px){.contact-wrap{grid-template-columns:1fr}}

footer{padding:3rem 0;border-top:1px solid var(--line);text-align:center;color:var(--faint);font-size:.8rem;letter-spacing:.15em}

/* EDIT CONTROLS */
.ce-add-btn{font-family:var(--sans);font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink);background:none;border:1px solid rgba(255,255,255,.2);padding:1rem 2rem;border-radius:999px;cursor:pointer;transition:.3s;margin-top:2rem;display:block;width:100%;text-align:center}
.ce-add-btn:hover{border-color:var(--gold);color:var(--gold)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:1.2rem;right:1.2rem;width:26px;height:26px;border-radius:50%;border:none;background:var(--gold);color:#0b0b0b;font-size:12px;line-height:26px;text-align:center;cursor:pointer;z-index:20;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const OBSIDIAN_SCRIPT = `<script>
(function(){
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
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'D';
	const nameParts = v.name.split(/\s+/);
	const heroName = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')}<br><em>${nameParts[nameParts.length - 1]}</em>`
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
		? `<section id="projects" class="wrap">
<span class="sec-label reveal">Featured Work</span><h2 class="sec-title reveal">In-depth <em>case studies</em>.</h2>
<div class="featured-projects">
${v.projects.map((p, i) => {
			const links = [
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">View project &#8599;</a>` : '',
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">Repository &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<div class="fp-card reveal"${iw}>
${delBtn('projects', i)}
<div class="fp-top"><div class="fp-title"><h3 ${ed(`projects.${i}.title`)}>${p.title || (em ? 'Project' : '')}</h3>${p.project_category ? `<div class="fp-client" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}</div></div>
<div class="fp-cover" ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="fp-cover-ph">${initials}</div>`}</div>
<div class="fp-body">
${p.description ? `<div class="fp-block"><h4>Overview</h4><p ${ed(`projects.${i}.description`, true)}>${p.description}</p></div>` : ''}
${p.responsibilities?.length ? `<div class="fp-block"><h4>Responsibilities</h4><ul ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${p.measurable_outcomes?.length ? `<div class="fp-block"><h4>Outcomes</h4><ul ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul></div>` : ''}
</div>
${p.tech_stack?.length ? `<div class="tag-cloud" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="tag-cloud" style="margin-top:.8rem" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>` : ''}
${links ? `<div class="fp-links">${links}</div>` : ''}
</div>`;
		}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>` : '';

	// SKILLS
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" class="wrap">
<span class="sec-label reveal">Capabilities</span><h2 class="sec-title reveal">Craft &amp; <em>expertise</em>.</h2>
<div class="skills-cats">
${v.skill_groups.map((g, gi) => `<div class="skills-cat reveal"${iw}>
${delBtn('skills', gi)}
<h3 ${ed(`skills.${gi}.category`)}>${g.category}</h3>
<div class="tag-cloud" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="tag-chip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency" class="wrap">
<span class="sec-label reveal">Toolkit</span><h2 class="sec-title reveal">Software, <em>mastered</em>.</h2>
<div class="tools-cloud reveal" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map(t => `<span class="tool-card">${t}</span>`).join('') || `<span class="tool-card" style="opacity:.5">+ Add</span>`}</div>
</section>` : '';

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" class="wrap">
<span class="sec-label reveal">Experience</span><h2 class="sec-title reveal">A working <em>life</em>.</h2>
<div class="exp-list">
${v.experience.map((exp, i) => `<div class="exp-card reveal"${iw}>
${delBtn('experience', i)}
<div class="exp-top"><div><h3 ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</h3>${(exp.company || exp.location) ? `<div class="exp-company">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.company && exp.location ? ' · ' : ''}${exp.location ? `<span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}</div><div class="exp-year">${expPeriod(i, exp)}</div></div>
${exp.description ? `<p class="exp-summary" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="exp-kps" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="wrap">
<span class="sec-label reveal">Education</span><h2 class="sec-title reveal">Where it <em>began</em>.</h2>
<div class="timeline">
${v.education.map((edu, i) => `<div class="tl-item reveal"${iw}>
${delBtn('education', i)}
<div class="tl-dot"></div>
<div class="tl-year">${eduYears(i, edu)}</div>
<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>
${(edu.institution || edu.location) ? `<div class="tl-place">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.institution && edu.location ? ' · ' : ''}${edu.location ? `<span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<p><span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span></p>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" class="wrap">
<span class="sec-label reveal">Credentials</span><h2 class="sec-title reveal"><em>Certifications</em>.</h2>
<div class="cert-list">
${v.certifications.map((c, i) => `<div class="cert-item reveal"${iw}>
${delBtn('certifications', i)}
<div><div class="c-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>${c.issuer ? `<div class="c-org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div>
<div style="display:flex;align-items:center;gap:1rem">${c.year ? `<span class="c-year" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">View</a>` : ''}</div>
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="wrap">
<span class="sec-label reveal">Milestones</span><h2 class="sec-title reveal">Moments that <em>mattered</em>.</h2>
<div class="ach-grid">
${v.achievements.map((a, i) => `<div class="ach-card reveal"${iw}>
${delBtn('achievements', i)}
${a.year ? `<div class="a-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
<h4 ${ed(`achievements.${i}.title`)}>${a.title}</h4>
${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>` : '';

	// AWARDS
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards" class="wrap">
<span class="sec-label reveal">Honours</span><h2 class="sec-title reveal">Awards &amp; <em>prizes</em>.</h2>
<div class="ach-grid">
${(v.awards ?? []).map((a, i) => `<div class="ach-card reveal"${iw}>
${delBtn('awards', i)}
${a.year ? `<div class="a-year" ${ed(`awards.${i}.year`)}>${a.year}</div>` : ''}
<h4 ${ed(`awards.${i}.title`)}>${a.title}</h4>
${a.awarding_body ? `<div class="ach-body" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</section>` : '';

	// PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy" class="wrap">
<span class="sec-label reveal">Philosophy</span><h2 class="sec-title reveal">The <em>why</em>.</h2>
<p class="philo reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</section>` : '';

	// CUSTOM
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="ach-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<div class="a-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.label ? `<h4 ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</h4>` : ''}
${item.value ? `<p ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</p>` : ''}
${item.tags?.length ? `<div class="tag-cloud cs-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="ach-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}" class="wrap">
<span class="sec-label reveal" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</span><h2 class="sec-title reveal" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</h2>
<div class="ach-grid">${cards}</div>
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
		statShown(v, 'years_experience', yearsExp) ? `<div class="stat"><div class="n" ${ed('template_overrides.years_experience')}>${yearsExp}+</div><div class="l">Years Experience</div></div>` : '',
		statShown(v, 'projects_count', projCount) ? `<div class="stat"><div class="n" ${ed('template_overrides.projects_count')}>${projCount}</div><div class="l">Projects</div></div>` : '',
		certCount > 0 ? `<div class="stat"><div class="n">${certCount}</div><div class="l">Certifications</div></div>` : '',
	].filter(Boolean).join('');

	// PROFILE LINKS + CONTACT
	const profLinks = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Twitter</a>` : '',
	].filter(Boolean).join('');
	const cInfo = [
		v.email ? `<div class="info-item"><div class="ic">@</div><div><div class="lbl">Email</div><div class="val" ${ed('profile.email')}>${v.email}</div></div></div>` : '',
		v.phone ? `<div class="info-item"><div class="ic">☎</div><div><div class="lbl">Phone</div><div class="val" ${ed('profile.phone')}>${v.phone}</div></div></div>` : '',
		v.location ? `<div class="info-item"><div class="ic">◈</div><div><div class="lbl">Location</div><div class="val" ${ed('profile.location')}>${v.location}</div></div></div>` : '',
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">Li</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Pf</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Tw</a>` : '',
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
<nav class="top">
<div class="logo" ${ed('profile.full_name')}>${v.name}</div>
<ul>
<li><a href="#about">About</a></li>
<li><a href="#projects">Work</a></li>
<li><a href="#experience">Experience</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
</nav>

<section id="home" class="wrap hero">
<div class="hero-left">
<span class="kicker">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : ''}</span>
<h1 class="serif" ${ed('profile.full_name')}>${heroName}</h1>
${v.headline ? `<p class="tag" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
${v.bio && !v.headline ? `<p class="tag" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="hero-cta">
<a href="#projects" class="btn btn-primary">View Portfolio →</a>
${v.email ? `<a href="mailto:${v.email}" class="btn btn-ghost">Start a Project</a>` : ''}
</div>
${profLinks ? `<div class="profile-links">${profLinks}</div>` : ''}
</div>
<div class="hero-right" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="hero-right-ph">${initials}</div>`}</div>
</section>

<section id="about" class="wrap">
<div class="about">
<div class="about-img" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="about-img-ph">${initials}</div>`}</div>
<div class="reveal">
<span class="sec-label">About Me</span>
<h2 class="sec-title">A designer with <em>an eye for clarity</em>.</h2>
${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${aboutStats ? `<div class="stats">${aboutStats}</div>` : ''}
</div>
</div>
</section>

${orderedSections}

<section id="contact" class="wrap">
<span class="sec-label reveal">Contact</span><h2 class="sec-title reveal">Let's <em>collaborate</em>.</h2>
<div class="contact-wrap">
<div class="contact-info reveal">
<p>Whether you have a brand to build, a product to shape, or simply want to talk about design — I'd love to hear from you.</p>
${socials ? `<div class="socials">${socials}</div>` : ''}
</div>
<div class="reveal">${cInfo}</div>
</div>
</section>

<footer>&copy; ${new Date().getFullYear()} ${v.name} · ${v.profile_headline || v.headline || 'Designer Portfolio'}</footer>
${OBSIDIAN_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
