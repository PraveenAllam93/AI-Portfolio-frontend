/**
 * Template: Beacon
 * Light (#f4f6fb) SaaS-dashboard engineer / QA portfolio. Indigo→purple gradient (#6366f1/
 * #8b5cf6/#a855f7) with soft indigo shadows. Sora display headings + DM Sans body + JetBrains
 * Mono labels. Pill section tags, gradient text, rounded glassy cards. Skill cards with tag chips
 * (NO bars). Dotted timeline, project grid.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap';

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
:root{--bg:#f4f6fb;--bg2:#eef1f8;--surface:#fff;--border:rgba(99,102,241,.12);--border2:rgba(99,102,241,.2);--text:#0f1729;--text2:#3d4466;--text3:#6b7280;--accent:#6366f1;--accent3:#4f46e5;--purple:#7c3aed;--grad1:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);--grad3:linear-gradient(135deg,#e0e7ff 0%,#ede9fe 50%,#fae8ff 100%);--shadow:0 4px 24px rgba(99,102,241,.1);--shadow2:0 8px 40px rgba(99,102,241,.16);--radius:16px;--radius2:12px;--sora:'Sora',sans-serif;--body:'DM Sans',sans-serif;--mono:'JetBrains Mono',monospace}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--body);background:var(--bg);color:var(--text);line-height:1.65;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
h1,h2,h3,h4{font-family:var(--sora)}

nav{position:fixed;top:0;left:0;right:0;z-index:100;backdrop-filter:blur(20px) saturate(180%);background:rgba(244,246,251,.85);border-bottom:1px solid var(--border);padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:var(--sora);font-weight:700;font-size:1.05rem;display:flex;align-items:center;gap:10px}
.nav-logo .txt{background:var(--grad1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.nav-logo .av{width:30px;height:30px;border-radius:8px;overflow:hidden;background:var(--bg2)}
.nav-logo .av img{width:100%;height:100%;object-fit:cover}
.nav-links{display:flex;gap:1.8rem;list-style:none}
.nav-links a{color:var(--text2);font-size:.86rem;font-weight:500;transition:color .2s}
.nav-links a:hover{color:var(--accent)}
.nav-cta{background:var(--grad1);color:#fff;padding:8px 20px;border-radius:50px;font-weight:600;font-size:.8rem}
@media(max-width:880px){.nav-links{display:none}}

section{padding:100px 5%}
.wrap{max-width:1200px;margin:0 auto}
.section-tag{display:inline-flex;align-items:center;gap:6px;background:var(--grad3);border:1px solid var(--border2);border-radius:50px;padding:6px 16px;font-size:.76rem;font-weight:600;color:var(--accent3);letter-spacing:.05em;text-transform:uppercase;margin-bottom:18px}
.section-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent)}
.section-title{font-size:clamp(2rem,4vw,2.8rem);font-weight:800;line-height:1.15;margin-bottom:14px}
.section-subtitle{font-size:1.02rem;color:var(--text2);max-width:580px;line-height:1.7;margin-bottom:50px}
.gradient-text{background:var(--grad1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

#hero{min-height:100vh;padding-top:120px;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:60px;position:relative;max-width:1200px;margin:0 auto}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border2);border-radius:50px;padding:6px 16px;font-size:.78rem;font-weight:500;color:var(--text2);margin-bottom:24px;box-shadow:var(--shadow)}
.hero-badge .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e}
.hero-title{font-size:clamp(2.6rem,5.4vw,4.2rem);font-weight:800;line-height:1.05;letter-spacing:-.02em;margin-bottom:18px}
.hero-role{font-family:var(--mono);font-size:.95rem;color:var(--accent);margin-bottom:18px}
.hero-sub{font-size:1.05rem;color:var(--text2);max-width:500px;margin-bottom:30px}
.hero-actions{display:flex;gap:.8rem;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.7rem;background:var(--grad1);color:#fff;border-radius:50px;font-weight:600;font-size:.9rem;box-shadow:var(--shadow);transition:all .3s}
.btn-primary:hover{transform:translateY(-2px);box-shadow:var(--shadow2)}
.btn-ghost{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.7rem;background:var(--surface);border:1px solid var(--border2);border-radius:50px;font-weight:500;font-size:.9rem;color:var(--text)}
.hero-socials{display:flex;gap:1.2rem;margin-top:1.4rem;font-family:var(--mono);font-size:.82rem}
.hero-socials a{color:var(--text3)}
.hero-socials a:hover{color:var(--accent)}
.hero-photo{aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;background:var(--grad3);border:1px solid var(--border);box-shadow:var(--shadow2);display:grid;place-items:center;position:relative;cursor:pointer}
.hero-photo img{width:100%;height:100%;object-fit:cover}
.hero-photo .ph{font-family:var(--sora);font-weight:800;font-size:96px;color:rgba(99,102,241,.3)}
@media(max-width:900px){#hero{grid-template-columns:1fr;gap:40px}.hero-photo{max-width:340px}}

.about-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:3rem;align-items:center}
.about-text p{color:var(--text2);font-size:1rem;line-height:1.85;margin-bottom:1rem}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1.6rem}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius2);padding:1.3rem;text-align:center;box-shadow:var(--shadow)}
.stat-num{font-family:var(--sora);font-size:2rem;font-weight:800;background:var(--grad1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.stat-label{font-family:var(--mono);font-size:.62rem;color:var(--text3);margin-top:.2rem;text-transform:uppercase;letter-spacing:.08em}
.about-visual{aspect-ratio:1;border-radius:var(--radius);background:var(--grad3);border:1px solid var(--border);display:grid;place-items:center;box-shadow:var(--shadow);overflow:hidden}
.about-visual .ph{font-family:var(--sora);font-weight:800;font-size:100px;color:rgba(124,58,237,.3)}
@media(max-width:900px){.about-grid{grid-template-columns:1fr}}

.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.3rem}
.skill-cat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.6rem;box-shadow:var(--shadow);transition:all .3s}
.skill-cat:hover{transform:translateY(-4px);box-shadow:var(--shadow2)}
.skill-cat-header{display:flex;align-items:center;gap:.8rem;margin-bottom:1.1rem}
.skill-cat-icon{width:38px;height:38px;border-radius:10px;background:var(--grad1);color:#fff;display:grid;place-items:center;font-family:var(--mono);font-weight:600;flex-shrink:0}
.skill-cat-title{font-family:var(--sora);font-weight:600;font-size:1.05rem}
.chips{display:flex;flex-wrap:wrap;gap:.4rem}
.chips span{background:var(--grad3);border:1px solid var(--border);color:var(--accent3);padding:.3rem .8rem;border-radius:50px;font-size:.74rem;font-weight:500}

.timeline{position:relative;padding-left:2rem}
.timeline::before{content:'';position:absolute;left:5px;top:8px;bottom:8px;width:2px;background:var(--grad1);opacity:.4}
.tl-item{position:relative;margin-bottom:1.6rem}
.tl-item:last-child{margin-bottom:0}
.tl-dot{position:absolute;left:-2rem;top:1.6rem;width:12px;height:12px;border-radius:50%;background:var(--grad1);border:2px solid var(--bg);box-shadow:0 0 0 3px rgba(99,102,241,.15)}
.tl-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;box-shadow:var(--shadow)}
.tl-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem;margin-bottom:.3rem}
.tl-role{font-family:var(--sora);font-size:1.15rem;font-weight:600}
.tl-company{color:var(--accent);font-size:.88rem;font-weight:500}
.tl-date{font-family:var(--mono);font-size:.7rem;color:var(--text3);background:var(--bg2);padding:.25rem .7rem;border-radius:50px;white-space:nowrap}
.tl-desc{color:var(--text2);font-size:.92rem;line-height:1.8;margin-top:.6rem}
.tl-block .lbl{font-family:var(--mono);font-size:.62rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin:.9rem 0 .3rem}
.tl-block ul{list-style:none;margin:0;padding:0;display:grid;gap:.35rem}
.tl-block ul li{color:var(--text2);font-size:.88rem;padding-left:1.2rem;position:relative}
.tl-block ul li::before{content:'▸';position:absolute;left:0;color:var(--accent)}

.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.5rem}
.proj-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);transition:all .3s;display:flex;flex-direction:column}
.proj-card:hover{transform:translateY(-5px);box-shadow:var(--shadow2)}
.proj-img{height:180px;background:var(--grad3);display:grid;place-items:center;position:relative;overflow:hidden;cursor:pointer}
.proj-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.proj-img .glyph{font-family:var(--sora);font-weight:800;font-size:42px;color:rgba(99,102,241,.35)}
.proj-body{padding:1.4rem;flex:1;display:flex;flex-direction:column;gap:.6rem}
.proj-cat{font-family:var(--mono);font-size:.68rem;color:var(--accent);text-transform:uppercase;letter-spacing:.08em}
.proj-title{font-family:var(--sora);font-size:1.2rem;font-weight:600}
.proj-desc{color:var(--text2);font-size:.9rem;line-height:1.7}
.proj-stack{display:flex;flex-wrap:wrap;gap:.4rem}
.proj-tech{background:var(--bg2);border:1px solid var(--border);color:var(--text2);padding:.2rem .7rem;border-radius:50px;font-size:.72rem;font-family:var(--mono)}
.proj-links{display:flex;gap:1rem;margin-top:auto;padding-top:.3rem;font-family:var(--mono);font-size:.78rem}
.proj-links a{color:var(--accent)}

.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem}
.info-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;box-shadow:var(--shadow)}
.info-card .yr{font-family:var(--mono);font-size:.72rem;color:var(--accent);margin-bottom:.3rem}
.info-card h3{font-family:var(--sora);font-size:1.1rem;font-weight:600;margin-bottom:.3rem}
.info-card h3 a:hover{color:var(--accent)}
.info-card .sub{color:var(--text2);font-size:.85rem}
.info-card p{color:var(--text2);font-size:.86rem;margin-top:.5rem;line-height:1.7}

.contact{max-width:760px;margin:0 auto;text-align:center}
.contact-sub{color:var(--text2);font-size:1.02rem;margin-bottom:1.8rem}
.cmeta{display:flex;flex-wrap:wrap;justify-content:center;gap:.8rem;margin-bottom:1.6rem}
.cm{border:1px solid var(--border);border-radius:var(--radius2);padding:1rem 1.3rem;background:var(--surface);box-shadow:var(--shadow)}
.cm .k{font-family:var(--mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);display:block;margin-bottom:.3rem}
.cm .v{font-size:.94rem}

footer{padding:2.4rem 5%;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:.8rem;font-family:var(--mono);font-size:.74rem;color:var(--text3)}
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

	const skillIcons = ['&#60;/&#62;', '{ }', '[ ]', '( )', '&#35;', '&#42;'];

	const heroHtml = `<section id="hero">
<div>
<span class="hero-badge"><span class="dot"></span> ${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Available for work'}</span>
<h1 class="hero-title">Hi, I'm <span class="gradient-text" ${ed('profile.full_name')}>${v.name}</span></h1>
${v.bio ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="hero-actions"><a class="btn-primary" href="#projects">View Work</a><a class="btn-ghost" href="#contact">Contact</a></div>
${socialLinksHtml(v) ? `<div class="hero-socials">${socialLinksHtml(v)}</div>` : ''}
</div>
<div class="hero-photo" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</section>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="wrap">
<span class="section-tag">About</span><h2 class="section-title">A little <span class="gradient-text">about me</span></h2>
<div class="about-grid">
<div class="about-text">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}${stats.length ? `<div class="stats-row">${stats.join('')}</div>` : ''}</div>
<div class="about-visual" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius)">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</div>
</div></section>`
		: '';

	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="wrap">
<span class="section-tag">Toolkit</span><h2 class="section-title">Skills &amp; <span class="gradient-text">stack</span></h2>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-cat"${iw}>${delBtn('skills', i)}<div class="skill-cat-header"><div class="skill-cat-icon">${skillIcons[i % skillIcons.length]}</div><div class="skill-cat-title" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="chips" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="wrap">
<span class="section-tag">Journey</span><h2 class="section-title">Where I've <span class="gradient-text">worked</span></h2>
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
		? `<section id="projects"><div class="wrap">
<span class="section-tag">Selected work</span><h2 class="section-title">Things I've <span class="gradient-text">built</span></h2>
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
		? `<section id="education"><div class="wrap">
<span class="section-tag">Education</span><h2 class="section-title">Where I <span class="gradient-text">studied</span></h2>
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
		? `<section id="certifications"><div class="wrap">
<span class="section-tag">Credentials</span><h2 class="section-title">Certifications</h2>
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
		? `<section id="achievements"><div class="wrap">
<span class="section-tag">Recognition</span><h2 class="section-title">Achievements</h2>
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
			return `<section id="${cs.section_id}"><div class="wrap">
<span class="section-tag">More</span><h2 class="section-title">${cs.title}</h2>
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
		? `<section id="contact"><div class="wrap"><div class="contact">
<span class="section-tag">Contact</span><h2 class="section-title">Let's <span class="gradient-text">work together</span></h2>
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
<nav>
<a href="#" class="nav-logo"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span><span class="txt">${v.name}</span></a>
<ul class="nav-links">${navItems}</ul>
<a href="#contact" class="nav-cta">Let's talk</a>
</nav>
<main>
${heroHtml}
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><span>&copy; ${new Date().getFullYear()} ${v.name}</span><span>Portfolio</span></footer>
${edScript}
</body>
</html>`;
}
