/**
 * Template: Flux
 * Near-black (#0a0a0f) multi-accent developer portfolio. Blue→cyan→purple gradient (#4f8ef7/
 * #00d9ff/#a78bfa) with pink/green highlights. Inter + Fira Code mono labels. Particle-network
 * canvas + scroll progress bar + custom cursor (published only). Spinning gradient avatar ring
 * with floating stat badges. Gradient headings. Skill cards with tag chips (NO bars). Dotted
 * timeline. Project card grid with image zones.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Fira+Code:wght@400;500&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['github_url', 'GH'], ['linkedin_url', 'IN'], ['twitter_url', 'X'], ['portfolio_url', 'PF'],
	];
	return items.filter(([k]) => !!v[k]).map(([k, l]) => `<a href="${v[k]}" target="_blank" rel="noopener noreferrer">${l}</a>`).join('');
}

function css(em: boolean): string {
	return `
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--bg2:#0f0f1a;--bg3:#13131f;--card:#16162a;--card2:#1a1a2e;--border:#ffffff12;--border2:#ffffff20;--blue:#4f8ef7;--cyan:#00d9ff;--purple:#a78bfa;--pink:#f472b6;--green:#34d399;--text:#e2e8f0;--muted:#94a3b8;--dim:#475569;--mono:'Fira Code',monospace}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden${em ? '' : ';cursor:none'}}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
${em ? '' : `#cursor{position:fixed;width:10px;height:10px;background:var(--cyan);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .1s;mix-blend-mode:screen}
#cursor-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--cyan);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all .18s ease;opacity:.5}`}
#progress{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--blue),var(--cyan),var(--purple));z-index:1000;transition:width .1s;width:0}
#particles{position:fixed;inset:0;pointer-events:none;z-index:0}

nav{position:fixed;top:0;left:0;right:0;z-index:900;padding:16px 40px;display:flex;justify-content:space-between;align-items:center;background:rgba(10,10,15,.7);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.logo{font-size:20px;font-weight:700;background:linear-gradient(135deg,var(--blue),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.5px;display:flex;align-items:center;gap:10px}
.logo .av{width:30px;height:30px;border-radius:8px;overflow:hidden;-webkit-text-fill-color:initial}
.logo .av img{width:100%;height:100%;object-fit:cover}
.nav-links{display:flex;gap:24px;list-style:none}
.nav-links a{color:var(--muted);font-size:12px;font-weight:500;letter-spacing:.5px;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:var(--cyan)}
.nav-btn{background:linear-gradient(135deg,var(--blue),var(--purple));color:#fff;padding:8px 20px;border-radius:6px;font-size:13px;font-weight:600}
@media(max-width:900px){.nav-links{display:none}nav{padding:12px 20px}}

section{position:relative;z-index:1}
#hero{min-height:100vh;display:flex;align-items:center;padding:80px 40px 0}
.hero-inner{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 400px;gap:60px;align-items:center}
.hero-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(79,142,247,.1);border:1px solid rgba(79,142,247,.3);color:var(--blue);padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px}
.hero-tag span{width:6px;height:6px;background:var(--cyan);border-radius:50%;animation:blink 1.4s infinite}
.hero-name{font-size:clamp(40px,6vw,68px);font-weight:900;line-height:1.05;letter-spacing:-2px;margin-bottom:14px}
.grad{background:linear-gradient(135deg,var(--blue) 0%,var(--cyan) 40%,var(--purple) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-role{font-size:20px;color:var(--muted);font-weight:400;margin-bottom:14px}
.hero-desc{color:var(--muted);font-size:15px;line-height:1.8;max-width:520px;margin-bottom:30px}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:30px}
.btn-primary{background:linear-gradient(135deg,var(--blue),var(--cyan));color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px}
.btn-outline{color:var(--cyan);border:1.5px solid var(--cyan);padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:8px}
.social-links{display:flex;gap:12px}
.social-links a{width:40px;height:40px;border:1px solid var(--border2);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;font-weight:700;transition:all .2s}
.social-links a:hover{border-color:var(--cyan);color:var(--cyan);background:rgba(0,217,255,.08)}
.hero-avatar{display:flex;justify-content:center;align-items:center}
.avatar-ring{width:320px;height:320px;position:relative}
.avatar-ring::before{content:'';position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan),var(--purple));animation:spin 6s linear infinite}
.avatar-inner{position:absolute;inset:3px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer}
.avatar-inner img{width:100%;height:100%;object-fit:cover}
.avatar-inner .ph{font-size:96px;font-weight:900;background:linear-gradient(135deg,var(--blue),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.floating-badge{position:absolute;background:var(--card2);border:1px solid var(--border2);border-radius:10px;padding:8px 14px;font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px;animation:float 3s ease-in-out infinite;color:var(--text)}
.fb1{bottom:20px;left:-20px}.fb2{top:40px;right:-30px;animation-delay:1.5s}
.fb-dot{width:8px;height:8px;border-radius:50%}
@media(max-width:900px){.hero-inner{grid-template-columns:1fr;gap:40px}.hero-avatar{display:none}}

.sec{padding:100px 40px}
#about,#experience,#projects,#certifications{background:var(--bg2)}
.section-inner{max-width:1200px;margin:0 auto}
.section-tag{font-family:var(--mono);color:var(--cyan);font-size:13px;margin-bottom:10px;display:block}
.section-title{font-size:clamp(30px,4vw,46px);font-weight:800;letter-spacing:-1px;margin-bottom:46px;line-height:1.15}
@media(max-width:900px){.sec{padding:80px 20px}}

.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.about-img{width:100%;aspect-ratio:1;border-radius:16px;background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--border);display:grid;place-items:center;position:relative;overflow:hidden;cursor:pointer}
.about-img img{width:100%;height:100%;object-fit:cover}
.about-img .ph{font-size:100px;font-weight:900;color:rgba(79,142,247,.4)}
.about-content p{color:var(--muted);font-size:15px;line-height:1.9;margin-bottom:14px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:28px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;text-align:center}
.stat-num{font-size:30px;font-weight:800;background:linear-gradient(135deg,var(--blue),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat-label{font-size:12px;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
@media(max-width:900px){.about-grid{grid-template-columns:1fr}}

.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.skill-cat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;transition:border-color .2s,transform .2s}
.skill-cat:hover{border-color:var(--border2);transform:translateY(-3px)}
.skill-cat-header{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.skill-cat-icon{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;background:rgba(79,142,247,.15);color:var(--blue);font-family:var(--mono);font-weight:600}
.skill-cat-title{font-weight:700;font-size:15px}
.tech-chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:rgba(79,142,247,.1);border:1px solid rgba(79,142,247,.2);color:var(--blue);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600}

.timeline{position:relative;padding-left:32px}
.timeline::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:1.5px;background:linear-gradient(to bottom,var(--blue),var(--purple),transparent)}
.tl-item{position:relative;margin-bottom:36px}
.tl-item:last-child{margin-bottom:0}
.tl-dot{position:absolute;left:-40px;top:4px;width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--cyan));border:3px solid var(--bg2)}
.tl-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;transition:border-color .2s}
.tl-card:hover{border-color:var(--border2)}
.tl-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:8px}
.tl-role{font-size:17px;font-weight:700}
.tl-company{color:var(--cyan);font-size:14px;font-weight:600}
.tl-date{font-size:12px;color:var(--muted);background:var(--bg3);padding:4px 10px;border-radius:20px;border:1px solid var(--border);white-space:nowrap}
.tl-desc{color:var(--muted);font-size:14px;line-height:1.8;margin-top:12px}
.tl-block .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);font-weight:700;margin:12px 0 5px}
.tl-block ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.tl-block ul li{color:var(--muted);font-size:13.5px;padding-left:16px;position:relative}
.tl-block ul li::before{content:'▹';position:absolute;left:0;color:var(--cyan)}
.tl-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.tl-tag{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2);color:var(--purple);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}

.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px}
.proj-card{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .25s;display:flex;flex-direction:column}
.proj-card:hover{border-color:var(--border2);transform:translateY(-4px)}
.proj-img{height:180px;background:linear-gradient(135deg,var(--bg3),var(--card2));display:grid;place-items:center;position:relative;overflow:hidden;cursor:pointer}
.proj-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.proj-img .glyph{font-family:var(--mono);font-size:40px;color:rgba(0,217,255,.4)}
.proj-body{padding:20px;flex:1;display:flex;flex-direction:column;gap:8px}
.proj-cat{font-family:var(--mono);font-size:11px;color:var(--cyan);text-transform:uppercase;letter-spacing:.1em}
.proj-title{font-size:16px;font-weight:700}
.proj-desc{color:var(--muted);font-size:13px;line-height:1.7}
.proj-stack{display:flex;flex-wrap:wrap;gap:6px}
.proj-tech{background:var(--bg3);border:1px solid var(--border);color:var(--muted);padding:3px 10px;border-radius:20px;font-size:11px}
.proj-links{display:flex;gap:14px;margin-top:auto;padding-top:4px}
.proj-links a{color:var(--cyan);font-size:12px;font-weight:700}

.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.info-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px}
.info-card .yr{font-family:var(--mono);font-size:12px;color:var(--cyan);margin-bottom:6px}
.info-card h3{font-size:16px;font-weight:700;margin-bottom:5px}
.info-card h3 a:hover{color:var(--cyan)}
.info-card .sub{color:var(--muted);font-size:13px}
.info-card p{color:var(--muted);font-size:13.5px;margin-top:8px;line-height:1.7}

.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
.contact-info h3{font-size:26px;font-weight:800;margin-bottom:14px}
.contact-info p{color:var(--muted);font-size:15px;line-height:1.8;margin-bottom:26px}
.contact-item{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.contact-icon{width:44px;height:44px;border-radius:10px;background:rgba(79,142,247,.1);border:1px solid rgba(79,142,247,.2);display:grid;place-items:center;font-family:var(--mono);color:var(--cyan);flex-shrink:0}
.contact-item-text strong{display:block;font-size:13px;color:var(--muted);margin-bottom:2px}
.contact-item-text span{font-size:14px;font-weight:600}
@media(max-width:900px){.contact-grid{grid-template-columns:1fr}}

footer{background:var(--bg);border-top:1px solid var(--border);padding:36px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px}
.footer-copy{color:var(--dim);font-size:13px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
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
		experience: 'Experience', skills: 'Skills', projects: 'Projects',
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
	if (statShown(v, 'years_experience', yearsExp)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('years_experience')}>${yearsExp}</span>+</div><div class="stat-label">Years Exp.</div></div>`);
	if (statShown(v, 'projects_count', projCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('projects_count')}>${projCount}</span>+</div><div class="stat-label">Projects</div></div>`);
	if (statShown(v, 'certifications_count', certsCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('certifications_count')}>${certsCount}</span></div><div class="stat-label">Certs</div></div>`);
	const badges: string[] = [];
	if (statShown(v, 'years_experience', yearsExp)) badges.push(`<div class="floating-badge fb1"><div class="fb-dot" style="background:var(--green)"></div><span>${yearsExp}+ Years</span></div>`);
	if (statShown(v, 'projects_count', projCount)) badges.push(`<div class="floating-badge fb2"><div class="fb-dot" style="background:var(--blue)"></div><span>${projCount}+ Projects</span></div>`);

	const skillIcons = ['&#60;/&#62;', '{ }', '[ ]', '( )', '&#35;', '&#36;'];

	const heroHtml = `<section id="hero">
<div class="hero-inner">
<div class="hero-left">
<div class="hero-tag"><span></span>Available for work</div>
<h1 class="hero-name">Hi, I'm <span class="grad" ${ed('profile.full_name')}>${v.name}</span></h1>
${v.headline ? `<div class="hero-role" ${ed('portfolio.headline')}>${v.headline}</div>` : ''}
${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="hero-btns"><a class="btn-primary" href="#projects">View Work</a><a class="btn-outline" href="#contact">Contact Me</a></div>
${socialLinksHtml(v) ? `<div class="social-links">${socialLinksHtml(v)}</div>` : ''}
</div>
<div class="hero-avatar"><div class="avatar-ring"><div class="avatar-inner" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>${badges.join('')}</div></div>
</div>
</section>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="sec"><div class="section-inner">
<span class="section-tag">// about me</span><h2 class="section-title">Who Am <span class="grad">I?</span></h2>
<div class="about-grid">
<div class="about-img" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
<div class="about-content">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}${stats.length ? `<div class="stats-row">${stats.join('')}</div>` : ''}</div>
</div>
</div></div></section>`
		: '';

	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="sec"><div class="section-inner">
<span class="section-tag">// skills &amp; tech</span><h2 class="section-title">What I <span class="grad">Work With</span></h2>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-cat"${iw}>${delBtn('skills', i)}<div class="skill-cat-header"><div class="skill-cat-icon">${skillIcons[i % skillIcons.length]}</div><div class="skill-cat-title" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="tech-chips" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span class="chip">${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="sec"><div class="section-inner">
<span class="section-tag">// work experience</span><h2 class="section-title">My <span class="grad">Journey</span></h2>
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
</div></div></section>`
		: '';

	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="sec"><div class="section-inner">
<span class="section-tag">// featured work</span><h2 class="section-title">My <span class="grad">Projects</span></h2>
<div class="projects-grid">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const thumb = imgs.length ? `<div class="proj-img" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>` : `<div class="proj-img" ${zone}><span class="glyph">{ }</span></div>`;
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
</div></div></section>`
		: '';

	const eduHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="sec"><div class="section-inner">
<span class="section-tag">// education</span><h2 class="section-title">Where I <span class="grad">Studied</span></h2>
<div class="card-grid">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="info-card"${iw}>${delBtn('education', i)}${range ? `<div class="yr">${range}</div>` : ''}<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>${edu.institution ? `<div class="sub" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}${edu.grade_or_score ? `<div class="sub" style="color:var(--cyan);margin-top:4px" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="sec"><div class="section-inner">
<span class="section-tag">// credentials</span><h2 class="section-title">My <span class="grad">Certifications</span></h2>
<div class="card-grid">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="info-card"${iw}>${delBtn('certifications', i)}${c.year ? `<div class="yr" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}<h3 ${ed(`certifications.${i}.name`)}>${nameHtml}</h3>${c.issuer ? `<div class="sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></div></section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="sec"><div class="section-inner">
<span class="section-tag">// recognition</span><h2 class="section-title">My <span class="grad">Achievements</span></h2>
<div class="card-grid">
${v.achievements.map((a, i) => `<div class="info-card"${iw}>${delBtn('achievements', i)}${a.year ? `<div class="yr" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}<h3 ${ed(`achievements.${i}.title`)}>${a.title}</h3>${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></div></section>`
		: '';

	const customHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			const csDel = (i: number) => em ? `<button class="ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>` : '';
			const csIw = ` data-item-wrap data-cs-idx="${csIdx}"`;
			const items = (cs.items ?? []).map((item, i) => `<div class="info-card"${csIw}>${csDel(i)}${item.subtitle ? `<div class="yr" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="proj-stack" style="margin-top:10px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span class="proj-tech">${t}</span>`).join('')}</div>` : ''}${item.url ? `<div class="proj-links" style="margin-top:10px"><a href="${item.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a></div>` : ''}</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="sec"><div class="section-inner">
<span class="section-tag">// more</span><h2 class="section-title" ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</h2>
<div class="card-grid">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</div></div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const cItems = [
		v.email ? `<div class="contact-item"><div class="contact-icon">@</div><div class="contact-item-text"><strong>Email</strong><span ${ed('profile.email')}>${v.email}</span></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-icon">#</div><div class="contact-item-text"><strong>Phone</strong><span ${ed('profile.phone')}>${v.phone}</span></div></div>` : '',
		v.location ? `<div class="contact-item"><div class="contact-icon">&#9678;</div><div class="contact-item-text"><strong>Location</strong><span ${ed('profile.location')}>${v.location}</span></div></div>` : '',
	].filter(Boolean);
	const contactHtml = (cItems.length || em)
		? `<section id="contact"><div class="sec"><div class="section-inner">
<span class="section-tag">// get in touch</span><h2 class="section-title">Let's <span class="grad">Work Together</span></h2>
<div class="contact-grid">
<div class="contact-info"><h3>Have a project in mind?</h3><p>I'm always open to discussing new projects and opportunities.</p>${cItems.join('')}</div>
<div class="contact-info">${socialLinksHtml(v) ? `<div class="social-links">${socialLinksHtml(v)}</div>` : ''}${v.email ? `<a class="btn-primary" style="margin-top:18px" href="mailto:${v.email}">Send a message &#8594;</a>` : ''}</div>
</div>
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
${em ? '' : '<div id="cursor"></div><div id="cursor-ring"></div>'}
<div id="progress"></div>
${em ? '' : '<canvas id="particles"></canvas>'}
<nav>
<div class="logo"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span>&lt;${v.name.split(' ')[0]} /&gt;</div>
<ul class="nav-links">${navItems}</ul>
<a class="nav-btn" href="#contact">Hire Me</a>
</nav>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><div class="footer-copy">&copy; ${new Date().getFullYear()} ${v.name}. Crafted with care.</div><div class="footer-copy">Portfolio</div></footer>
${em ? '' : `<script>
var c=document.getElementById('cursor'),r=document.getElementById('cursor-ring');
if(c){addEventListener('mousemove',function(e){c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px'});document.querySelectorAll('a,button').forEach(function(el){el.addEventListener('mouseenter',function(){r.style.width='52px';r.style.height='52px'});el.addEventListener('mouseleave',function(){r.style.width='36px';r.style.height='36px'})})}
addEventListener('scroll',function(){var p=(scrollY/(document.body.scrollHeight-innerHeight))*100;document.getElementById('progress').style.width=Math.min(p,100)+'%'});
(function(){var cv=document.getElementById('particles');if(!cv)return;var x=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;var d=Array.from({length:70},function(){return{x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.5}});function draw(){x.clearRect(0,0,cv.width,cv.height);d.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>cv.width)p.vx*=-1;if(p.y<0||p.y>cv.height)p.vy*=-1;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle='rgba(79,142,247,.35)';x.fill()});for(var i=0;i<d.length;i++)for(var j=i+1;j<d.length;j++){var dx=d[i].x-d[j].x,dy=d[i].y-d[j].y,ds=Math.sqrt(dx*dx+dy*dy);if(ds<120){x.beginPath();x.moveTo(d[i].x,d[i].y);x.lineTo(d[j].x,d[j].y);x.strokeStyle='rgba(79,142,247,'+(1-ds/120)*.12+')';x.lineWidth=.6;x.stroke()}}requestAnimationFrame(draw)}draw();addEventListener('resize',function(){cv.width=innerWidth;cv.height=innerHeight})})();
</script>`}
${edScript}
</body>
</html>`;
}
