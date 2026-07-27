/**
 * Template: Orbit
 * Deep-space (#020510) sci-fi engineer portfolio. Cyan (#00f5ff) + purple (#8b5cf6) + pink/gold
 * glow. Orbitron display headings + Exo 2 body + Space Mono labels. Animated star-field canvas +
 * blurred nebula blobs + custom cursor + scroll glow (published only). Glassy bordered cards with
 * cyan glow, tag chips (NO bars). Dotted timeline, project grid.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;1,300&family=Space+Mono:wght@400;700&display=swap';

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

function css(em: boolean): string {
	return `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#020510;--bg2:#060d1f;--cyan:#00f5ff;--purple:#8b5cf6;--pink:#f472b6;--gold:#fbbf24;--text:#e2e8f0;--muted:#64748b;--card:rgba(255,255,255,.03);--border:rgba(0,245,255,.12);--glow-cyan:0 0 20px rgba(0,245,255,.35);--orbitron:'Orbitron',sans-serif;--exo:'Exo 2',sans-serif;--mono:'Space Mono',monospace}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--exo);font-weight:300;overflow-x:hidden${em ? '' : ';cursor:none'}}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
${em ? '' : `.cursor{position:fixed;width:12px;height:12px;background:var(--cyan);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .1s;mix-blend-mode:screen}
.cursor-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(0,245,255,.5);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all .12s ease;mix-blend-mode:screen}
#star-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}`}
.nebula{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0}
.nebula-1{width:600px;height:600px;background:rgba(139,92,246,.07);top:-100px;left:-100px}
.nebula-2{width:500px;height:500px;background:rgba(0,245,255,.05);bottom:10%;right:-100px}
.nebula-3{width:400px;height:400px;background:rgba(244,114,182,.06);top:40%;left:30%}

nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:16px 5%;background:rgba(2,5,16,.7);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-logo{font-family:var(--orbitron);font-weight:700;font-size:1.15rem;color:var(--cyan);letter-spacing:.1em;text-shadow:var(--glow-cyan);display:flex;align-items:center;gap:10px}
.nav-logo .av{width:30px;height:30px;border-radius:50%;overflow:hidden;background:var(--bg2)}
.nav-logo .av img{width:100%;height:100%;object-fit:cover}
.nav-logo span{color:var(--purple)}
.nav-links{display:flex;gap:1.8rem;list-style:none}
.nav-links a{color:var(--muted);font-size:.82rem;letter-spacing:.1em;text-transform:uppercase;font-family:var(--mono);transition:color .3s}
.nav-links a:hover{color:var(--cyan)}
.nav-cta{padding:8px 20px;border:1px solid var(--cyan);color:var(--cyan);font-family:var(--mono);font-size:.78rem;letter-spacing:.1em;transition:all .3s}
.nav-cta:hover{background:var(--cyan);color:var(--bg);box-shadow:var(--glow-cyan)}
@media(max-width:880px){.nav-links{display:none}}

section{position:relative;z-index:1}
#hero{min-height:100vh;display:flex;align-items:center;padding:0 5%;overflow:hidden}
.hero-content{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.3fr .7fr;gap:60px;align-items:center;position:relative;z-index:2}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border:1px solid var(--border);border-radius:100px;font-family:var(--mono);font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--cyan);margin-bottom:28px}
.hero-badge .dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.hero-title{font-family:var(--orbitron);font-weight:900;font-size:clamp(42px,6.6vw,84px);line-height:1;letter-spacing:.01em;margin-bottom:22px;text-shadow:0 0 30px rgba(0,245,255,.2)}
.hero-title .cyan{color:var(--cyan)}
.hero-role{font-family:var(--mono);font-size:.95rem;color:var(--purple);letter-spacing:.08em;margin-bottom:20px}
.hero-sub{font-size:1.05rem;color:var(--muted);line-height:1.8;max-width:520px;margin-bottom:34px}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:var(--cyan);color:var(--bg);font-family:var(--mono);font-weight:700;font-size:.85rem;letter-spacing:.05em;transition:all .3s;box-shadow:var(--glow-cyan)}
.btn-primary:hover{transform:translateY(-2px)}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:.85rem;letter-spacing:.05em}
.btn-ghost:hover{border-color:var(--cyan)}
.hero-socials{display:flex;gap:16px;margin-top:20px;font-family:var(--mono);font-size:.78rem}
.hero-socials a{color:var(--muted)}
.hero-socials a:hover{color:var(--cyan)}
.hero-photo{aspect-ratio:1;border-radius:50%;overflow:hidden;background:var(--bg2);border:1px solid var(--border);position:relative;display:grid;place-items:center;box-shadow:0 0 60px rgba(0,245,255,.15);cursor:pointer}
.hero-photo img{width:100%;height:100%;object-fit:cover}
.hero-photo .ph{font-family:var(--orbitron);font-size:88px;font-weight:900;color:rgba(0,245,255,.25)}
@media(max-width:900px){.hero-content{grid-template-columns:1fr;gap:40px}.hero-photo{max-width:300px;margin:0 auto}#hero{padding:100px 5%}}

.sec{padding:110px 5%;max-width:1200px;margin:0 auto}
.sec-tag{font-family:var(--mono);font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;color:var(--cyan);margin-bottom:14px;display:block}
.sec-title{font-family:var(--orbitron);font-weight:700;font-size:clamp(28px,4.4vw,52px);letter-spacing:.02em;margin-bottom:46px;text-shadow:0 0 24px rgba(0,245,255,.15)}

.about-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:56px;align-items:center}
.about-text p{color:var(--muted);font-size:1rem;line-height:1.9;margin-bottom:16px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:22px;text-align:center;backdrop-filter:blur(10px)}
.stat-num{font-family:var(--orbitron);font-size:30px;font-weight:700;color:var(--cyan);text-shadow:var(--glow-cyan)}
.stat-label{font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:6px;text-transform:uppercase;letter-spacing:.1em}
.about-visual{aspect-ratio:1;border-radius:16px;background:var(--card);border:1px solid var(--border);display:grid;place-items:center;position:relative;overflow:hidden;backdrop-filter:blur(10px)}
.about-visual .ph{font-family:var(--orbitron);font-size:90px;font-weight:900;color:rgba(139,92,246,.3)}
@media(max-width:900px){.about-grid{grid-template-columns:1fr}}

.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.skill-cat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:26px;backdrop-filter:blur(10px);transition:all .3s}
.skill-cat:hover{border-color:rgba(0,245,255,.4);box-shadow:0 0 30px rgba(0,245,255,.1)}
.skill-cat-header{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.skill-cat-icon{width:40px;height:40px;border-radius:10px;background:rgba(0,245,255,.1);color:var(--cyan);display:grid;place-items:center;font-family:var(--mono);font-weight:700;flex-shrink:0}
.skill-cat-title{font-family:var(--orbitron);font-weight:600;font-size:15px;letter-spacing:.02em}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.25);color:#b9a8f5;padding:5px 13px;border-radius:100px;font-size:12px;font-family:var(--mono)}

.timeline{position:relative;padding-left:32px}
.timeline::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:1px;background:linear-gradient(to bottom,var(--cyan),var(--purple),transparent)}
.tl-item{position:relative;margin-bottom:36px}
.tl-item:last-child{margin-bottom:0}
.tl-dot{position:absolute;left:-38px;top:5px;width:14px;height:14px;border-radius:50%;background:var(--cyan);box-shadow:var(--glow-cyan)}
.tl-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;backdrop-filter:blur(10px);transition:all .3s}
.tl-card:hover{border-color:rgba(0,245,255,.3)}
.tl-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.tl-role{font-family:var(--orbitron);font-size:16px;font-weight:600}
.tl-company{color:var(--cyan);font-size:14px}
.tl-date{font-family:var(--mono);font-size:11px;color:var(--muted);border:1px solid var(--border);padding:4px 10px;border-radius:100px;white-space:nowrap}
.tl-desc{color:var(--muted);font-size:14px;line-height:1.8;margin-top:10px}
.tl-block .lbl{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin:12px 0 5px}
.tl-block ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.tl-block ul li{color:var(--muted);font-size:13.5px;padding-left:16px;position:relative}
.tl-block ul li::before{content:'›';position:absolute;left:0;color:var(--cyan)}
.tl-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.tl-tag{background:rgba(0,245,255,.08);border:1px solid var(--border);color:var(--cyan);padding:3px 10px;border-radius:100px;font-size:11px;font-family:var(--mono)}

.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px}
.proj-card{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;backdrop-filter:blur(10px);transition:all .3s;display:flex;flex-direction:column}
.proj-card:hover{border-color:rgba(0,245,255,.35);box-shadow:0 0 40px rgba(0,245,255,.1);transform:translateY(-6px)}
.proj-img{height:190px;background:linear-gradient(135deg,rgba(0,245,255,.06),rgba(139,92,246,.06));display:grid;place-items:center;position:relative;overflow:hidden;cursor:pointer}
.proj-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.proj-img .glyph{font-family:var(--orbitron);font-size:42px;font-weight:900;color:rgba(0,245,255,.3)}
.proj-body{padding:22px;flex:1;display:flex;flex-direction:column;gap:10px}
.proj-cat{font-family:var(--mono);font-size:11px;color:var(--cyan);text-transform:uppercase;letter-spacing:.1em}
.proj-title{font-family:var(--orbitron);font-size:17px;font-weight:600}
.proj-desc{color:var(--muted);font-size:14px;line-height:1.7}
.proj-stack{display:flex;flex-wrap:wrap;gap:6px}
.proj-tech{background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--muted);padding:3px 10px;border-radius:100px;font-size:11px;font-family:var(--mono)}
.proj-links{display:flex;gap:14px;margin-top:auto;padding-top:4px;font-family:var(--mono);font-size:12px}
.proj-links a{color:var(--cyan)}

.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.info-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;backdrop-filter:blur(10px)}
.info-card .yr{font-family:var(--mono);font-size:12px;color:var(--cyan);margin-bottom:6px}
.info-card h3{font-family:var(--orbitron);font-size:15px;font-weight:600;margin-bottom:6px;line-height:1.3}
.info-card h3 a:hover{color:var(--cyan)}
.info-card .sub{color:var(--muted);font-size:13px}
.info-card p{color:var(--muted);font-size:13.5px;margin-top:8px;line-height:1.7}

.contact{text-align:center;max-width:760px;margin:0 auto}
.contact-sub{color:var(--muted);font-size:1rem;margin-bottom:30px}
.cmeta{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-bottom:26px}
.cm{border:1px solid var(--border);border-radius:12px;padding:16px 20px;background:var(--card);backdrop-filter:blur(10px)}
.cm .k{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);display:block;margin-bottom:5px}
.cm .v{font-size:15px}

footer{padding:36px 5%;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-family:var(--mono);font-size:12px;color:var(--muted);position:relative;z-index:1}
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
		experience: 'Experience', skills: 'Skills', projects: 'Missions',
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
<div class="hero-content">
<div>
<span class="hero-badge"><span class="dot"></span> ${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Available for work'}</span>
<h1 class="hero-title">I'm <span class="cyan" ${ed('profile.full_name')}>${v.name}</span></h1>
${v.bio ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="hero-actions"><a class="btn-primary" href="#projects">View Missions</a><a class="btn-ghost" href="#contact">Contact</a></div>
${socialLinksHtml(v) ? `<div class="hero-socials">${socialLinksHtml(v)}</div>` : ''}
</div>
<div class="hero-photo" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</div>
</section>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="sec">
<span class="sec-tag">// about</span><h2 class="sec-title">Mission Log</h2>
<div class="about-grid">
<div class="about-text">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}${stats.length ? `<div class="stats-row">${stats.join('')}</div>` : ''}</div>
<div class="about-visual" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}" style="width:100%;height:100%;object-fit:cover;border-radius:16px">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</div>
</div></section>`
		: '';

	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="sec">
<span class="sec-tag">// systems</span><h2 class="sec-title">Skills &amp; Tech</h2>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-cat"${iw}>${delBtn('skills', i)}<div class="skill-cat-header"><div class="skill-cat-icon">${skillIcons[i % skillIcons.length]}</div><div class="skill-cat-title" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="chips" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="sec">
<span class="sec-tag">// trajectory</span><h2 class="sec-title">Experience</h2>
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
<span class="sec-tag">// missions</span><h2 class="sec-title">Selected Work</h2>
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
<span class="sec-tag">// training</span><h2 class="sec-title">Education</h2>
<div class="card-grid">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="info-card"${iw}>${delBtn('education', i)}${range ? `<div class="yr">${range}</div>` : ''}<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>${edu.institution ? `<div class="sub" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}${edu.grade_or_score ? `<div class="sub" style="color:var(--cyan);margin-top:4px" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="sec">
<span class="sec-tag">// credentials</span><h2 class="sec-title">Certifications</h2>
<div class="card-grid">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="info-card"${iw}>${delBtn('certifications', i)}${c.year ? `<div class="yr" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}<h3 ${ed(`certifications.${i}.name`)}>${nameHtml}</h3>${c.issuer ? `<div class="sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="sec">
<span class="sec-tag">// honors</span><h2 class="sec-title">Achievements</h2>
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
<span class="sec-tag">// more</span><h2 class="sec-title" ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</h2>
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
<span class="sec-tag">// transmission</span><h2 class="sec-title">Get In Touch</h2>
<p class="contact-sub">Open a channel &mdash; new missions welcome.</p>
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
<style>${css(em)}</style>
</head>
<body>
${em ? '' : '<div class="cursor"></div><div class="cursor-ring"></div><canvas id="star-canvas"></canvas>'}
<div class="nebula nebula-1"></div><div class="nebula nebula-2"></div><div class="nebula nebula-3"></div>
<nav>
<a href="#" class="nav-logo"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span>${v.name.split(' ')[0]}<span>_</span></a>
<ul class="nav-links">${navItems}</ul>
<a href="#contact" class="nav-cta">Contact</a>
</nav>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><span>&copy; ${new Date().getFullYear()} ${v.name}</span><span>Portfolio</span></footer>
${em ? '' : `<script>
var c=document.querySelector('.cursor'),r=document.querySelector('.cursor-ring');
if(c){addEventListener('mousemove',function(e){c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px'});document.querySelectorAll('a,button').forEach(function(el){el.addEventListener('mouseenter',function(){r.style.width='52px';r.style.height='52px'});el.addEventListener('mouseleave',function(){r.style.width='36px';r.style.height='36px'})})}
(function(){var cv=document.getElementById('star-canvas');if(!cv)return;var x=cv.getContext('2d');function rs(){cv.width=innerWidth;cv.height=innerHeight}rs();var st=Array.from({length:140},function(){return{x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.3+.2,o:Math.random(),s:Math.random()*.02+.005}});function draw(){x.clearRect(0,0,cv.width,cv.height);st.forEach(function(p){p.o+=p.s;if(p.o>1||p.o<0)p.s*=-1;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle='rgba(0,245,255,'+Math.abs(p.o)*.7+')';x.fill()});requestAnimationFrame(draw)}draw();addEventListener('resize',rs)})();
</script>`}
${edScript}
</body>
</html>`;
}
