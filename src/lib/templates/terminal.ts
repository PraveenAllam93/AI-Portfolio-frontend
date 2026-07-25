/**
 * Template: Terminal
 * Warm-light (#f5f4f0) QA / software-testing engineer portfolio. Terminal-green (#00c896) with
 * bug-red (#ff4545) + info-blue (#1a6fff) status accents. Bricolage Grotesque display + IBM Plex
 * Mono labels + DM Sans body. macOS-style terminal window cards, blinking status pills, mono
 * section indices. Skill cards with tag chips (NO bars). Test-case timeline, project grid.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['github_url', 'github'], ['linkedin_url', 'linkedin'], ['twitter_url', 'x'], ['portfolio_url', 'site'],
	];
	return items.filter(([k]) => !!v[k]).map(([k, l]) => `<a href="${v[k]}" target="_blank" rel="noopener noreferrer">${l}</a>`).join('');
}

function css(): string {
	return `
:root{--ink:#0d0e12;--ink-soft:#3b3e4a;--ink-muted:#8a8e9e;--paper:#f5f4f0;--paper2:#eeecea;--paper3:#e6e3de;--white:#fff;--accent:#00c896;--accent-dim:rgba(0,200,150,.12);--accent2:#ff4545;--accent3:#1a6fff;--border:rgba(13,14,18,.1);--border-strong:rgba(13,14,18,.18);--radius:14px;--radius-sm:8px;--display:'Bricolage Grotesque',sans-serif;--mono:'IBM Plex Mono',monospace;--body:'DM Sans',sans-serif;--shadow-sm:0 2px 8px rgba(13,14,18,.07);--shadow-md:0 8px 32px rgba(13,14,18,.1)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--paper);color:var(--ink);font-family:var(--body);line-height:1.65;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}

nav{position:fixed;top:0;left:0;right:0;z-index:100;height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,5vw,5rem);background:rgba(245,244,240,.82);backdrop-filter:blur(18px) saturate(180%);border-bottom:1px solid var(--border)}
.nav-logo{font-family:var(--mono);font-weight:600;font-size:.92rem;display:flex;align-items:center;gap:.5rem}
.nav-logo .av{width:26px;height:26px;border-radius:6px;overflow:hidden;background:var(--paper3)}
.nav-logo .av img{width:100%;height:100%;object-fit:cover}
.nav-logo-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);animation:blink 2s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.nav-links{display:flex;gap:1.8rem;list-style:none}
.nav-links a{font-size:.8rem;font-weight:500;color:var(--ink-muted);letter-spacing:.04em;transition:color .3s}
.nav-links a:hover{color:var(--ink)}
.nav-status{display:flex;align-items:center;gap:.5rem;background:var(--accent-dim);border:1px solid rgba(0,200,150,.25);border-radius:99px;padding:.28rem .8rem;font-family:var(--mono);font-size:.68rem;color:#028a68;font-weight:600}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
@media(max-width:880px){.nav-links,.nav-status{display:none}}

#hero{min-height:100vh;padding:62px 0 0;display:flex;align-items:stretch;position:relative;overflow:hidden}
.hero-layout{display:grid;grid-template-columns:1.1fr .9fr;width:100%}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:clamp(3rem,7vw,6rem) clamp(2rem,5vw,5rem)}
.hero-eyebrow{font-family:var(--mono);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:1.2rem;display:inline-flex;align-items:center;gap:.5rem}
.hero-title{font-family:var(--display);font-weight:800;font-size:clamp(2.6rem,5.6vw,4.6rem);line-height:1.02;letter-spacing:-.02em;margin-bottom:1.2rem}
.hero-title .g{color:var(--accent)}
.hero-role{font-family:var(--mono);font-size:.95rem;color:var(--ink-soft);margin-bottom:1.4rem}
.hero-sub{font-size:1.05rem;color:var(--ink-soft);max-width:480px;margin-bottom:2rem}
.hero-actions{display:flex;gap:.8rem;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.6rem;background:var(--ink);color:var(--paper);border-radius:99px;font-weight:600;font-size:.88rem;transition:all .3s}
.btn-primary:hover{background:var(--accent);color:var(--ink)}
.btn-ghost{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.6rem;border:1px solid var(--border-strong);border-radius:99px;font-weight:500;font-size:.88rem}
.btn-ghost:hover{background:var(--paper2)}
.hero-socials{display:flex;gap:1.2rem;margin-top:1.4rem;font-family:var(--mono);font-size:.8rem}
.hero-socials a{color:var(--ink-muted)}
.hero-socials a:hover{color:var(--accent)}
.hero-right{background:var(--paper2);border-left:1px solid var(--border);display:flex;align-items:center;justify-content:center;padding:2rem}
.term{width:100%;max-width:420px;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-md);overflow:hidden}
.term-bar{display:flex;align-items:center;gap:.4rem;padding:.7rem .9rem;background:var(--paper3);border-bottom:1px solid var(--border)}
.term-dot{width:11px;height:11px;border-radius:50%}
.term-r{background:#ff5f57}.term-y{background:#febc2e}.term-g{background:#28c840}
.term-title{font-family:var(--mono);font-size:.7rem;color:var(--ink-muted);margin-left:.6rem}
.term-photo{aspect-ratio:1;overflow:hidden;position:relative;background:linear-gradient(135deg,var(--paper2),var(--paper3));display:grid;place-items:center;cursor:pointer}
.term-photo img{width:100%;height:100%;object-fit:cover}
.term-photo .ph{font-family:var(--display);font-weight:800;font-size:80px;color:var(--paper3);text-shadow:0 2px 0 rgba(0,0,0,.04)}
.term-body{padding:1rem 1.1rem;font-family:var(--mono);font-size:.76rem;color:var(--ink-soft);border-top:1px solid var(--border)}
.term-body .ln{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.term-body .ok{color:var(--accent)}
@media(max-width:900px){.hero-layout{grid-template-columns:1fr}.hero-right{display:none}#hero{padding-top:80px}}

.sec{padding:clamp(4rem,9vw,7rem) clamp(1.5rem,5vw,5rem);max-width:1200px;margin:0 auto}
.sec-head{display:flex;align-items:baseline;gap:1rem;margin-bottom:3rem;flex-wrap:wrap}
.sec-idx{font-family:var(--mono);font-size:.78rem;color:var(--accent);font-weight:600}
.sec-title{font-family:var(--display);font-weight:700;font-size:clamp(2rem,4vw,3.2rem);letter-spacing:-.02em;line-height:1.05}

.about-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:3rem;align-items:center}
.about-text p{color:var(--ink-soft);font-size:1rem;line-height:1.85;margin-bottom:1rem}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1.6rem}
.stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1.2rem;text-align:center;box-shadow:var(--shadow-sm)}
.stat-num{font-family:var(--display);font-size:2rem;font-weight:800;color:var(--accent)}
.stat-label{font-family:var(--mono);font-size:.62rem;color:var(--ink-muted);margin-top:.2rem;text-transform:uppercase;letter-spacing:.08em}
.about-visual{aspect-ratio:1;border-radius:var(--radius);background:var(--white);border:1px solid var(--border);display:grid;place-items:center;box-shadow:var(--shadow-sm);overflow:hidden}
.about-visual .ph{font-family:var(--display);font-weight:800;font-size:90px;color:var(--paper3)}
@media(max-width:900px){.about-grid{grid-template-columns:1fr}}

.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem}
.skill-cat{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;box-shadow:var(--shadow-sm);transition:all .3s}
.skill-cat:hover{transform:translateY(-4px);box-shadow:var(--shadow-md)}
.skill-cat-header{display:flex;align-items:center;gap:.7rem;margin-bottom:1rem}
.skill-cat-icon{width:34px;height:34px;border-radius:8px;background:var(--accent-dim);color:#028a68;display:grid;place-items:center;font-family:var(--mono);font-weight:600;flex-shrink:0}
.skill-cat-title{font-family:var(--display);font-weight:600;font-size:1rem}
.chips{display:flex;flex-wrap:wrap;gap:.4rem}
.chips span{font-family:var(--mono);background:var(--paper2);border:1px solid var(--border);color:var(--ink-soft);padding:.25rem .7rem;border-radius:99px;font-size:.72rem}

.timeline{position:relative;padding-left:2rem}
.timeline::before{content:'';position:absolute;left:5px;top:8px;bottom:8px;width:1px;background:var(--border-strong)}
.tl-item{position:relative;margin-bottom:1.6rem}
.tl-item:last-child{margin-bottom:0}
.tl-dot{position:absolute;left:-2rem;top:1.5rem;width:11px;height:11px;border-radius:50%;background:var(--accent);border:2px solid var(--paper)}
.tl-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.4rem;box-shadow:var(--shadow-sm)}
.tl-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem;margin-bottom:.3rem}
.tl-role{font-family:var(--display);font-size:1.1rem;font-weight:600}
.tl-company{color:#028a68;font-size:.85rem;font-family:var(--mono)}
.tl-date{font-family:var(--mono);font-size:.7rem;color:var(--ink-muted);background:var(--paper2);padding:.2rem .6rem;border-radius:99px;white-space:nowrap}
.tl-desc{color:var(--ink-soft);font-size:.9rem;line-height:1.75;margin-top:.6rem}
.tl-block .lbl{font-family:var(--mono);font-size:.62rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-muted);margin:.8rem 0 .3rem}
.tl-block ul{list-style:none;margin:0;padding:0;display:grid;gap:.3rem}
.tl-block ul li{color:var(--ink-soft);font-size:.86rem;padding-left:1.1rem;position:relative;font-family:var(--mono)}
.tl-block ul li::before{content:'✓';position:absolute;left:0;color:var(--accent)}

.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.4rem}
.proj-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);transition:all .3s;display:flex;flex-direction:column}
.proj-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-md)}
.proj-img{height:180px;background:linear-gradient(135deg,var(--paper2),var(--paper3));display:grid;place-items:center;position:relative;overflow:hidden;cursor:pointer}
.proj-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.proj-img .glyph{font-family:var(--display);font-weight:800;font-size:40px;color:var(--paper)}
.proj-body{padding:1.3rem;flex:1;display:flex;flex-direction:column;gap:.6rem}
.proj-cat{font-family:var(--mono);font-size:.68rem;color:#028a68;text-transform:uppercase;letter-spacing:.08em}
.proj-title{font-family:var(--display);font-size:1.15rem;font-weight:600}
.proj-desc{color:var(--ink-soft);font-size:.88rem;line-height:1.7}
.proj-stack{display:flex;flex-wrap:wrap;gap:.4rem}
.proj-tech{font-family:var(--mono);background:var(--paper2);border:1px solid var(--border);color:var(--ink-soft);padding:.2rem .6rem;border-radius:99px;font-size:.7rem}
.proj-links{display:flex;gap:1rem;margin-top:auto;padding-top:.3rem;font-family:var(--mono);font-size:.76rem}
.proj-links a{color:#028a68}

.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.1rem}
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:1.4rem;box-shadow:var(--shadow-sm)}
.info-card .yr{font-family:var(--mono);font-size:.72rem;color:#028a68;margin-bottom:.3rem}
.info-card h3{font-family:var(--display);font-size:1.05rem;font-weight:600;margin-bottom:.3rem}
.info-card h3 a:hover{color:var(--accent)}
.info-card .sub{color:var(--ink-soft);font-size:.82rem}
.info-card p{color:var(--ink-soft);font-size:.85rem;margin-top:.5rem;line-height:1.7}

.contact{max-width:760px;margin:0 auto;text-align:center}
.contact-sub{color:var(--ink-soft);font-size:1rem;margin-bottom:1.8rem}
.cmeta{display:flex;flex-wrap:wrap;justify-content:center;gap:.8rem;margin-bottom:1.6rem}
.cm{border:1px solid var(--border);border-radius:var(--radius-sm);padding:.9rem 1.2rem;background:var(--white);box-shadow:var(--shadow-sm)}
.cm .k{font-family:var(--mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:var(--ink-muted);display:block;margin-bottom:.3rem}
.cm .v{font-size:.92rem}

footer{padding:2rem clamp(1.5rem,5vw,5rem);border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:.8rem;font-family:var(--mono);font-size:.72rem;color:var(--ink-muted)}
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
		experience: 'experience', skills: 'skills', projects: 'work',
		education: 'education', certifications: 'certs', achievements: 'awards',
	};
	const navAnchors: [string, string][] = [];
	if (v.bio || em) navAnchors.push(['about', 'about']);
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
	if (v.email || v.phone || v.location) navAnchors.push(['contact', 'contact']);
	const navItems = navAnchors.map(([a, l]) => `<li><a href="#${a}">${l}</a></li>`).join('');

	let sn = 0;
	const idx = () => String(++sn).padStart(2, '0');

	const yearsExp = v.template_overrides?.years_experience ?? 0;
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certsCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const stats: string[] = [];
	if (statShown(v, 'years_experience', yearsExp)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('years_experience')}>${yearsExp}</span>+</div><div class="stat-label">Years</div></div>`);
	if (statShown(v, 'projects_count', projCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('projects_count')}>${projCount}</span>+</div><div class="stat-label">Projects</div></div>`);
	if (statShown(v, 'certifications_count', certsCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('certifications_count')}>${certsCount}</span></div><div class="stat-label">Certs</div></div>`);

	const skillIcons = ['&#60;/&#62;', '{ }', '[ ]', '( )', '&#35;', '&#42;'];

	const heroHtml = `<section id="hero"><div class="hero-layout">
<div class="hero-left">
<span class="hero-eyebrow"><span class="nav-logo-dot"></span> ${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Available for work'}</span>
<h1 class="hero-title">Hi, I'm <span class="g" ${ed('profile.full_name')}>${v.name}</span></h1>
${v.bio ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="hero-actions"><a class="btn-primary" href="#projects">View Work</a><a class="btn-ghost" href="#contact">Contact</a></div>
${socialLinksHtml(v) ? `<div class="hero-socials">${socialLinksHtml(v)}</div>` : ''}
</div>
<div class="hero-right">
<div class="term">
<div class="term-bar"><span class="term-dot term-r"></span><span class="term-dot term-y"></span><span class="term-dot term-g"></span><span class="term-title">~/portfolio</span></div>
<div class="term-photo" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
<div class="term-body"><span class="ln">$ run tests</span><span class="ln ok">&#10003; all suites passing</span></div>
</div>
</div>
</div></section>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="sec">
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">About</h2></div>
<div class="about-grid">
<div class="about-text">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}${stats.length ? `<div class="stats-row">${stats.join('')}</div>` : ''}</div>
<div class="about-visual" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}" style="width:100%;height:100%;object-fit:cover">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</div>
</div></section>`
		: '';

	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="sec">
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">Skills &amp; Stack</h2></div>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-cat"${iw}>${delBtn('skills', i)}<div class="skill-cat-header"><div class="skill-cat-icon">${skillIcons[i % skillIcons.length]}</div><div class="skill-cat-title" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="chips" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="sec">
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">Experience</h2></div>
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
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">Selected Work</h2></div>
<div class="proj-grid">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const thumb = imgs.length ? `<div class="proj-img" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>` : `<div class="proj-img" ${zone}><span class="glyph">${p.title ? p.title.slice(0, 2) : '&#9671;'}</span></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">github &#8599;</a>` : '',
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">live &#8599;</a>` : '',
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
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">Education</h2></div>
<div class="card-grid">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="info-card"${iw}>${delBtn('education', i)}${range ? `<div class="yr">${range}</div>` : ''}<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>${edu.institution ? `<div class="sub" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}${edu.grade_or_score ? `<div class="sub" style="color:#028a68;margin-top:4px" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="sec">
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">Certifications</h2></div>
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
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">Achievements</h2></div>
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
			const items = (cs.items ?? []).map((item, i) => `<div class="info-card"${csIw}>${csDel(i)}${item.subtitle ? `<div class="yr" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="proj-stack" style="margin-top:10px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span class="proj-tech">${t}</span>`).join('')}</div>` : ''}${item.url ? `<div class="proj-links" style="margin-top:10px"><a href="${item.url}" target="_blank" rel="noopener noreferrer">view &#8599;</a></div>` : ''}</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="sec">
<div class="sec-head"><span class="sec-idx">${idx()}</span><h2 class="sec-title">${cs.title}</h2></div>
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
<div class="sec-head" style="justify-content:center"><span class="sec-idx">${idx()}</span><h2 class="sec-title">Get In Touch</h2></div>
<p class="contact-sub">Open to QA, SDET, and platform roles.</p>
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
<a href="#" class="nav-logo"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span><span class="nav-logo-dot"></span>${v.name}</a>
<ul class="nav-links">${navItems}</ul>
<div class="nav-status"><span class="status-dot"></span> available</div>
</nav>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><span>&copy; ${new Date().getFullYear()} ${v.name}</span><span>Portfolio</span></footer>
${edScript}
</body>
</html>`;
}
