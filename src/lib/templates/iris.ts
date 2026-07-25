/**
 * Template: Iris
 * Warm-light (#f4f4ef) refined portfolio with a violet→pink gradient (#5b47e0/#c94d8c) and teal
 * (#0f9d7a) highlights. Fraunces italic display + Outfit body. Scroll progress bar (published only),
 * gradient italic logo, soft glow. Glassy surface cards with gradient headings. Skill cards with
 * tag chips (NO bars). Dotted timeline, project grid.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Outfit:wght@200;300;400;500;600&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['github_url', 'GitHub'], ['linkedin_url', 'LinkedIn'], ['twitter_url', 'X'], ['portfolio_url', 'Site'],
	];
	return items.filter(([k]) => !!v[k]).map(([k, l]) => `<a href="${v[k]}" target="_blank" rel="noopener noreferrer">${l}</a>`).join('');
}

function css(): string {
	return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f4f4ef;--surface:rgba(0,0,0,.04);--surface-hover:rgba(0,0,0,.07);--border:rgba(0,0,0,.1);--border-bright:rgba(0,0,0,.22);--text-primary:#0c0c0c;--text-secondary:rgba(12,12,12,.6);--text-muted:rgba(12,12,12,.36);--accent:#5b47e0;--accent-2:#c94d8c;--accent-3:#0f9d7a;--glow:rgba(91,71,224,.18);--display:'Fraunces',Georgia,serif;--body:'Outfit',sans-serif;--radius:20px}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text-primary);font-family:var(--body);font-weight:400;line-height:1.7;overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
#scroll-progress{position:fixed;top:0;left:0;height:2px;width:0;background:linear-gradient(90deg,var(--accent),var(--accent-2));z-index:1000;transition:width .1s linear;box-shadow:0 0 12px var(--glow)}
.grad-text{background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}

nav{position:fixed;top:0;left:0;right:0;z-index:900;padding:18px 40px;display:flex;align-items:center;justify-content:space-between;background:rgba(244,244,239,.88);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-logo{font-family:var(--display);font-size:1.4rem;font-weight:600;font-style:italic;display:flex;align-items:center;gap:10px}
.nav-logo .name{background:linear-gradient(135deg,var(--text-primary),var(--accent));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.nav-logo .av{width:32px;height:32px;border-radius:50%;overflow:hidden;background:var(--surface)}
.nav-logo .av img{width:100%;height:100%;object-fit:cover}
.nav-links{display:flex;gap:30px;list-style:none}
.nav-links a{color:var(--text-secondary);font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;transition:color .3s}
.nav-links a:hover{color:var(--text-primary)}
@media(max-width:880px){.nav-links{display:none}}

section{position:relative}
#hero{min-height:100vh;display:flex;align-items:center;padding:0 40px;position:relative;overflow:hidden}
#hero::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,var(--glow),transparent 70%);top:-100px;right:-100px;filter:blur(40px)}
#hero::after{content:'';position:absolute;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,var(--glow-pink,rgba(201,77,140,.15)),transparent 70%);bottom:-100px;left:5%;filter:blur(40px)}
.hero-content{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.3fr .7fr;gap:60px;align-items:center;position:relative;z-index:2}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border:1px solid var(--border);border-radius:100px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-secondary);margin-bottom:28px;background:rgba(255,255,255,.5)}
.hero-badge .dot{width:6px;height:6px;border-radius:50%;background:var(--accent-3);box-shadow:0 0 8px var(--accent-3)}
.hero-title{font-family:var(--display);font-weight:400;font-size:clamp(44px,6.6vw,88px);line-height:1;letter-spacing:-.02em;margin-bottom:22px}
.hero-title em{font-style:italic}
.hero-role{font-size:1.05rem;color:var(--accent);font-weight:500;margin-bottom:16px}
.hero-sub{font-size:1.05rem;color:var(--text-secondary);line-height:1.8;max-width:520px;margin-bottom:34px}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;border-radius:100px;font-weight:500;font-size:.9rem;transition:all .3s;box-shadow:0 10px 30px -10px var(--glow)}
.btn-primary:hover{transform:translateY(-2px)}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border:1px solid var(--border-bright);border-radius:100px;font-weight:500;font-size:.9rem;color:var(--text-primary)}
.btn-ghost:hover{background:var(--surface)}
.hero-socials{display:flex;gap:16px;margin-top:20px;font-size:.85rem}
.hero-socials a{color:var(--text-secondary)}
.hero-socials a:hover{color:var(--accent)}
.hero-photo{aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;background:linear-gradient(135deg,rgba(91,71,224,.12),rgba(201,77,140,.12));border:1px solid var(--border);display:grid;place-items:center;position:relative;cursor:pointer}
.hero-photo img{width:100%;height:100%;object-fit:cover}
.hero-photo .ph{font-family:var(--display);font-style:italic;font-size:96px;color:rgba(91,71,224,.35)}
@media(max-width:900px){.hero-content{grid-template-columns:1fr;gap:40px}.hero-photo{max-width:340px}#hero{padding:100px 20px}}

.sec{padding:120px 40px;max-width:1200px;margin:0 auto}
.sec-tag{font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;display:block;font-weight:500}
.sec-title{font-family:var(--display);font-weight:400;font-size:clamp(32px,4.6vw,60px);letter-spacing:-.02em;line-height:1;margin-bottom:48px}
.sec-title em{font-style:italic}
@media(max-width:880px){.sec{padding:80px 20px}}

.about-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:56px;align-items:center}
.about-text p{color:var(--text-secondary);font-size:1.05rem;line-height:1.9;margin-bottom:16px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px}
.stat-card{background:rgba(255,255,255,.5);border:1px solid var(--border);border-radius:14px;padding:22px;text-align:center}
.stat-num{font-family:var(--display);font-size:38px;font-weight:500;background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.stat-label{font-size:11px;color:var(--text-muted);margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
.about-visual{aspect-ratio:1;border-radius:var(--radius);background:linear-gradient(135deg,rgba(91,71,224,.12),rgba(15,157,122,.1));border:1px solid var(--border);display:grid;place-items:center;position:relative;overflow:hidden}
.about-visual .ph{font-family:var(--display);font-style:italic;font-size:100px;color:rgba(201,77,140,.4)}
@media(max-width:900px){.about-grid{grid-template-columns:1fr}}

.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.skill-cat{background:rgba(255,255,255,.5);border:1px solid var(--border);border-radius:16px;padding:26px;transition:all .3s}
.skill-cat:hover{border-color:var(--border-bright);transform:translateY(-4px);box-shadow:0 20px 40px -20px var(--glow)}
.skill-cat-header{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.skill-cat-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;display:grid;place-items:center;font-weight:600;flex-shrink:0}
.skill-cat-title{font-family:var(--display);font-weight:500;font-size:18px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{background:var(--surface);border:1px solid var(--border);color:var(--text-secondary);padding:5px 13px;border-radius:100px;font-size:12px}

.timeline{position:relative;padding-left:32px}
.timeline::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:1px;background:linear-gradient(to bottom,var(--accent),var(--accent-2),transparent)}
.tl-item{position:relative;margin-bottom:36px}
.tl-item:last-child{margin-bottom:0}
.tl-dot{position:absolute;left:-38px;top:5px;width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-2));box-shadow:0 0 12px var(--glow)}
.tl-card{background:rgba(255,255,255,.5);border:1px solid var(--border);border-radius:16px;padding:24px;transition:all .3s}
.tl-card:hover{border-color:var(--border-bright);box-shadow:0 20px 40px -24px var(--glow)}
.tl-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.tl-role{font-family:var(--display);font-size:19px;font-weight:500}
.tl-company{color:var(--accent);font-size:14px}
.tl-date{font-size:12px;color:var(--text-muted);border:1px solid var(--border);padding:4px 10px;border-radius:100px;white-space:nowrap}
.tl-desc{color:var(--text-secondary);font-size:14px;line-height:1.8;margin-top:10px}
.tl-block .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:600;margin:12px 0 5px}
.tl-block ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.tl-block ul li{color:var(--text-secondary);font-size:13.5px;padding-left:16px;position:relative}
.tl-block ul li::before{content:'›';position:absolute;left:0;color:var(--accent)}

.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px}
.proj-card{background:rgba(255,255,255,.5);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all .3s;display:flex;flex-direction:column}
.proj-card:hover{border-color:var(--border-bright);transform:translateY(-6px);box-shadow:0 30px 50px -30px var(--glow)}
.proj-img{height:190px;background:linear-gradient(135deg,rgba(91,71,224,.1),rgba(201,77,140,.1));display:grid;place-items:center;position:relative;overflow:hidden;cursor:pointer}
.proj-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.proj-img .glyph{font-family:var(--display);font-style:italic;font-size:44px;color:rgba(91,71,224,.35)}
.proj-body{padding:22px;flex:1;display:flex;flex-direction:column;gap:10px}
.proj-cat{font-size:11px;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;font-weight:500}
.proj-title{font-family:var(--display);font-size:20px;font-weight:500}
.proj-desc{color:var(--text-secondary);font-size:14px;line-height:1.7}
.proj-stack{display:flex;flex-wrap:wrap;gap:6px}
.proj-tech{background:var(--surface);border:1px solid var(--border);color:var(--text-secondary);padding:3px 10px;border-radius:100px;font-size:11px}
.proj-links{display:flex;gap:14px;margin-top:auto;padding-top:4px;font-size:12px;font-weight:500}
.proj-links a{color:var(--accent)}

.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.info-card{background:rgba(255,255,255,.5);border:1px solid var(--border);border-radius:16px;padding:24px}
.info-card .yr{font-size:12px;color:var(--accent);margin-bottom:6px;font-weight:500}
.info-card h3{font-family:var(--display);font-size:19px;font-weight:500;margin-bottom:5px}
.info-card h3 a:hover{color:var(--accent)}
.info-card .sub{color:var(--text-secondary);font-size:13px}
.info-card p{color:var(--text-secondary);font-size:13.5px;margin-top:8px;line-height:1.7}

.contact{text-align:center;max-width:760px;margin:0 auto}
.contact-sub{color:var(--text-secondary);font-size:1.05rem;margin-bottom:30px}
.cmeta{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-bottom:26px}
.cm{border:1px solid var(--border);border-radius:14px;padding:16px 20px;background:rgba(255,255,255,.5)}
.cm .k{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--text-muted);display:block;margin-bottom:5px}
.cm .v{font-size:15px}

footer{padding:36px 40px;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--text-muted)}
`;
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
	const led = (p: string) => em ? _listEditable(p) : '';
	const ted = (key: string) => em ? `contenteditable="true" data-path="template_overrides.${key}"` : '';
	const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
	const iw = em ? ' data-item-wrap' : '';
	const edScript = em ? EDITOR_SCRIPT : '';
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const NAV_LABELS: Record<string, string> = {
		experience: 'Experience', skills: 'Skills', projects: 'Work',
		education: 'Education', certifications: 'Certs', achievements: 'Awards',
	};
	const navAnchors: [string, string][] = [];
	if (v.bio || em) navAnchors.push(['about', 'About']);
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (key === 'custom_sections') {
			for (const cs of v.custom_sections ?? []) if (cs.items?.length || em) navAnchors.push([cs.section_id, cs.title]);
			continue;
		}
		if (key in NAV_LABELS) {
			const dataKey = key === 'skills' ? 'skill_groups' : key;
			const data = (v as unknown as Record<string, unknown>)[dataKey];
			if ((Array.isArray(data) && data.length > 0) || em) navAnchors.push([key, NAV_LABELS[key]]);
		}
	}
	if (v.email || v.phone || v.location) navAnchors.push(['contact', 'Contact']);
	const navItems = navAnchors.map(([a, l]) => `<li><a href="#${a}">${l}</a></li>`).join('');

	const yearsExp = v.template_overrides?.years_experience ?? 0;
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certsCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const stats: string[] = [];
	if (statShown(v, 'years_experience', yearsExp)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('years_experience')}>${yearsExp}</span>+</div><div class="stat-label">Years</div></div>`);
	if (statShown(v, 'projects_count', projCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('projects_count')}>${projCount}</span>+</div><div class="stat-label">Projects</div></div>`);
	if (statShown(v, 'certifications_count', certsCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('certifications_count')}>${certsCount}</span></div><div class="stat-label">Certs</div></div>`);

	const heroHtml = `<section id="hero">
<div class="hero-content">
<div>
<span class="hero-badge"><span class="dot"></span> ${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Available for work'}</span>
<h1 class="hero-title">Hi, I'm <em class="grad-text" ${ed('profile.full_name')}>${v.name}</em></h1>
${v.bio ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="hero-actions"><a class="btn-primary" href="#projects">View Work</a><a class="btn-ghost" href="#contact">Get in Touch</a></div>
${socialLinksHtml(v) ? `<div class="hero-socials">${socialLinksHtml(v)}</div>` : ''}
</div>
<div class="hero-photo" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</div>
</section>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="sec">
<span class="sec-tag">About</span><h2 class="sec-title">A little <em>about me</em></h2>
<div class="about-grid">
<div class="about-text">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}${stats.length ? `<div class="stats-row">${stats.join('')}</div>` : ''}</div>
<div class="about-visual" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius)">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</div>
</div></section>`
		: '';

	const skillIcons = ['&#9671;', '&#9670;', '&#9733;', '&#9632;', '&#9679;', '&#9650;'];
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="sec">
<span class="sec-tag">Toolkit</span><h2 class="sec-title">Skills &amp; <em>tools</em></h2>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-cat"${iw}>${delBtn('skills', i)}<div class="skill-cat-header"><div class="skill-cat-icon">${skillIcons[i % skillIcons.length]}</div><div class="skill-cat-title" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="chips" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="sec">
<span class="sec-tag">Journey</span><h2 class="sec-title">Where I've <em>worked</em></h2>
<div class="timeline">
${v.experience.map((exp, i) => {
			const range = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em);
			return `<div class="tl-item"${iw}>${delBtn('experience', i)}<div class="tl-dot"></div>
<div class="tl-card">
<div class="tl-header"><div><div class="tl-role" ${ed(`experience.${i}.role`)}>${exp.role}</div>${exp.company ? `<div class="tl-company" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}</div>${range ? `<div class="tl-date">${range}</div>` : ''}</div>
${exp.location ? `<div class="tl-company" ${ed(`experience.${i}.location`)}>${exp.location}</div>` : ''}
${exp.description ? `<div class="tl-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<div class="tl-block"><div class="lbl">Highlights</div><ul ${led(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul></div>` : ''}
</div>
</div>`;
		}).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>`
		: '';

	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="sec">
<span class="sec-tag">Selected work</span><h2 class="sec-title">Things I've <em>built</em></h2>
<div class="proj-grid">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const thumb = imgs.length ? `<div class="proj-img" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>` : `<div class="proj-img" ${zone}><span class="glyph">${p.title ? p.title.slice(0, 2) : '&#9671;'}</span></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>` : '',
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">Live &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<div class="proj-card"${iw}>${delBtn('projects', i)}${thumb}
<div class="proj-body">
${p.project_category ? `<div class="proj-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
<div class="proj-title" ${ed(`projects.${i}.title`)}>${p.title}</div>
${p.description ? `<div class="proj-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</div>` : ''}
${resp.length ? `<div class="tl-block"><div class="lbl">Responsibilities</div><ul ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${outcomes.length ? `<div class="tl-block"><div class="lbl">Outcomes</div><ul ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
${techSource.length ? `<div class="proj-stack" ${led(p.tech_stack?.length ? `projects.${i}.tech_stack` : `projects.${i}.software_used`)}>${techSource.map((t) => `<span class="proj-tech">${t}</span>`).join('')}</div>` : ''}
${links ? `<div class="proj-links">${links}</div>` : ''}
</div>
</div>`;
		}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</div></section>`
		: '';

	const eduHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="sec">
<span class="sec-tag">Education</span><h2 class="sec-title">Where I <em>studied</em></h2>
<div class="card-grid">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="info-card"${iw}>${delBtn('education', i)}${range ? `<div class="yr">${range}</div>` : ''}<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>${edu.institution ? `<div class="sub" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}${edu.grade_or_score ? `<div class="sub" style="color:var(--accent);margin-top:4px" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="sec">
<span class="sec-tag">Credentials</span><h2 class="sec-title">Certifications</h2>
<div class="card-grid">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="info-card"${iw}>${delBtn('certifications', i)}${c.year ? `<div class="yr" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}<h3${!c.url ? ` ${ed(`certifications.${i}.name`)}` : ''}>${nameHtml}</h3>${c.issuer ? `<div class="sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="sec">
<span class="sec-tag">Recognition</span><h2 class="sec-title">Achievements</h2>
<div class="card-grid">
${v.achievements.map((a, i) => `<div class="info-card"${iw}>${delBtn('achievements', i)}${a.year ? `<div class="yr" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}<h3 ${ed(`achievements.${i}.title`)}>${a.title}</h3>${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>`
		: '';

	const customHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			const csDel = (i: number) => em ? `<button class="ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>` : '';
			const csIw = ` data-item-wrap data-cs-idx="${csIdx}"`;
			const items = (cs.items ?? []).map((item, i) => `<div class="info-card"${csIw}>${csDel(i)}${item.subtitle ? `<div class="yr" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="proj-stack" style="margin-top:10px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span class="proj-tech">${t}</span>`).join('')}</div>` : ''}${item.url ? `<div class="proj-links" style="margin-top:10px"><a href="${item.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a></div>` : ''}</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="sec">
<span class="sec-tag">More</span><h2 class="sec-title">${cs.title}</h2>
<div class="card-grid">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const cmeta = [
		v.email ? `<div class="cm"><span class="k">Email</span><span class="v" ${ed('profile.email')}>${v.email}</span></div>` : '',
		v.phone ? `<div class="cm"><span class="k">Phone</span><span class="v" ${ed('profile.phone')}>${v.phone}</span></div>` : '',
		v.location ? `<div class="cm"><span class="k">Location</span><span class="v" ${ed('profile.location')}>${v.location}</span></div>` : '',
	].filter(Boolean);
	const contactHtml = (cmeta.length || em)
		? `<section id="contact"><div class="sec"><div class="contact">
<span class="sec-tag">Contact</span><h2 class="sec-title">Let's <em>work together</em></h2>
<p class="contact-sub">Open to new projects and opportunities.</p>
${cmeta.length ? `<div class="cmeta">${cmeta.join('')}</div>` : ''}
${v.email ? `<a class="btn-primary" href="mailto:${v.email}">Send a message</a>` : ''}
</div></div></section>`
		: '';

	const sectionRenderers: Record<string, string> = {
		experience: expHtml, skills: skillsHtml, projects: projectsHtml,
		education: eduHtml, certifications: certsHtml, achievements: achHtml,
		custom_sections: customHtml,
	};
	const orderedContent = order
		.filter((key) => !hidden.has(key) && key in sectionRenderers)
		.map((key) => sectionRenderers[key])
		.filter(Boolean)
		.join('\n');

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} - Portfolio</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div id="scroll-progress"></div>
<nav>
<a href="#" class="nav-logo"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span><span class="name">${v.name}</span></a>
<ul class="nav-links">${navItems}</ul>
</nav>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><span>&copy; ${new Date().getFullYear()} ${v.name}</span><span>Portfolio</span></footer>
${em ? '' : `<script>
addEventListener('scroll',function(){var p=(scrollY/(document.body.scrollHeight-innerHeight))*100;document.getElementById('scroll-progress').style.width=Math.min(p,100)+'%'});
</script>`}
${edScript}
</body>
</html>`;
}
