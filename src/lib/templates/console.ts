/**
 * Template: Console
 * Bright animated-sky hero (gradient sky, pulsing sun, drifting clouds, wave divider, floating
 * tech badges) flowing into deep-navy content sections (#0f1525 / #0b111e). Fira Code monospace
 * section labels + Inter sans. Sky-cyan (#29b6e8/#4ecde6) + blue (#4285f4) accents. Scroll
 * progress bar. Dark skill cards with tag chips (NO bars). Left-rail dotted timeline. Card grids.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Fira+Code:wght@400;500&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['github_url', 'GH'], ['linkedin_url', 'IN'], ['twitter_url', 'X'], ['portfolio_url', 'PF'],
	];
	return items.filter(([k]) => !!v[k]).map(([k, l]) => `<a class="social-icon" href="${v[k]}" target="_blank" rel="noopener noreferrer">${l}</a>`).join('');
}

function css(): string {
	return `
*{margin:0;padding:0;box-sizing:border-box}
:root{--sky1:#29b6e8;--sky2:#4ecde6;--sky4:#aee8f5;--sky5:#d4f1f9;--blue:#4285f4;--dark:#0f1525;--serif:'Inter',sans-serif;--mono:'Fira Code',monospace}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:#0a0f1e;overflow-x:hidden;color:#e2e8f0}
a{text-decoration:none;color:inherit}
img{display:block;max-width:100%}
#progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#fff,var(--sky2),#fff);z-index:1000;transition:width .1s;width:0}

nav{position:fixed;top:0;left:0;right:0;z-index:900;padding:16px 48px;display:flex;justify-content:space-between;align-items:center;background:rgba(41,182,232,.15);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.15)}
.logo{font-size:20px;font-weight:800;color:#fff;letter-spacing:-.5px;display:flex;align-items:center;gap:10px}
.logo .av{width:32px;height:32px;border-radius:8px;overflow:hidden;background:#fff}
.logo .av img{width:100%;height:100%;object-fit:cover}
.logo span{color:var(--sky4)}
.nav-links{display:flex;gap:26px;list-style:none}
.nav-links a{color:rgba(255,255,255,.8);font-size:12px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:#fff}
.nav-hire{background:#fff;color:var(--blue);padding:9px 22px;border-radius:8px;font-size:13px;font-weight:700}
@media(max-width:880px){.nav-links{display:none}nav{padding:12px 20px}}

#hero{min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:center}
.sky-bg{position:absolute;inset:0;background:linear-gradient(180deg,#1ab0e8 0%,#29c5ef 30%,#50d4f5 60%,#90e3f7 85%,#c8f2fc 100%);z-index:0}
.sun{position:absolute;top:60px;right:200px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,#fff9c4,#ffe082);z-index:1;animation:sunpulse 4s ease-in-out infinite}
@keyframes sunpulse{0%,100%{box-shadow:0 0 40px 10px rgba(255,230,100,.4)}50%{box-shadow:0 0 80px 30px rgba(255,230,100,.6)}}
.cloud-wrap{position:absolute;inset:0;z-index:2;pointer-events:none}
.cloud{position:absolute;animation:cloudFloat linear infinite}
.cloud svg ellipse{fill:#fff}
@keyframes cloudFloat{from{transform:translateX(-120%)}to{transform:translateX(110vw)}}
.hero-content{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:80px 48px 0;width:100%;display:grid;grid-template-columns:1fr 440px;gap:40px;align-items:center}
.hero-tag-line{font-size:15px;font-weight:600;color:rgba(15,31,60,.85);margin-bottom:14px}
.hero-h1{font-size:clamp(38px,5.5vw,62px);font-weight:900;color:#0f1f3d;line-height:1.08;letter-spacing:-1.5px;margin-bottom:8px}
.hero-h1 .accent{color:var(--blue)}
.hero-desc{font-size:16px;color:#1a2e50;line-height:1.75;max-width:480px;margin:16px 0 26px}
.hero-socials{display:flex;gap:12px;margin-bottom:26px}
.social-icon{width:44px;height:44px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(30,80,180,.12);transition:transform .18s;font-weight:800;color:var(--blue);font-size:13px}
.social-icon:hover{transform:translateY(-3px)}
.resume-btn{background:var(--blue);color:#fff;padding:13px 40px;border-radius:10px;font-size:15px;font-weight:700;display:inline-block}
.hero-right{position:relative;display:flex;justify-content:center;align-items:center;height:420px}
.hero-photo{width:300px;height:360px;border-radius:20px;overflow:hidden;background:linear-gradient(135deg,#1a2a4a,#162340);box-shadow:0 20px 60px rgba(15,31,60,.35);display:grid;place-items:center;cursor:pointer;position:relative}
.hero-photo img{width:100%;height:100%;object-fit:cover}
.hero-photo .ph{font-size:96px;font-weight:900;color:rgba(255,255,255,.85)}
.tech-badge{position:absolute;background:#fff;border-radius:10px;padding:7px 14px;font-size:13px;font-weight:700;color:#1a3a6b;box-shadow:0 4px 16px rgba(30,80,180,.15);animation:floatBadge ease-in-out infinite;white-space:nowrap;z-index:3}
.tb-0{top:10px;left:-10px;animation-duration:3.2s}.tb-1{top:110px;right:-20px;animation-duration:2.8s;animation-delay:.6s}.tb-2{bottom:60px;left:-20px;animation-duration:3.5s;animation-delay:1s}.tb-3{bottom:10px;right:0;animation-duration:3s;animation-delay:.3s}
@keyframes floatBadge{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.wave-div{position:absolute;bottom:0;left:0;right:0;z-index:5;line-height:0}
@media(max-width:880px){.hero-content{grid-template-columns:1fr}.hero-right{display:none}}

section{position:relative;z-index:1}
.sec{padding:90px 48px}
.section-inner{max-width:1200px;margin:0 auto}
#about{background:#0f1525}#skills{background:#0b111e}#experience{background:#0f1525}#projects{background:#0b111e}#education{background:#0f1525}#certifications{background:#0b111e}#achievements{background:#0f1525}#contact{background:#0b111e}
main>section:nth-of-type(even) .sec{background:inherit}
.sec-label{font-family:var(--mono);font-size:13px;color:var(--sky2);font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;display:block}
.sec-title{font-size:clamp(28px,4vw,42px);font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:44px;line-height:1.15}
.sec-title span{color:var(--sky2)}

.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.about-img-box{border-radius:20px;background:linear-gradient(135deg,#1a2a4a,#162340);border:1px solid rgba(78,205,230,.15);aspect-ratio:1;display:grid;place-items:center;position:relative;overflow:hidden;cursor:pointer}
.about-img-box img{width:100%;height:100%;object-fit:cover}
.about-img-box .ph{font-size:90px;font-weight:900;color:rgba(78,205,230,.4)}
.about-text p{color:#94a3b8;font-size:15px;line-height:1.85;margin-bottom:14px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:28px}
.stat-card{background:#162340;border:1px solid rgba(78,205,230,.12);border-radius:12px;padding:18px;text-align:center}
.stat-num{font-size:30px;font-weight:800;color:var(--sky2)}
.stat-lbl{font-size:11px;color:#64748b;margin-top:3px;text-transform:uppercase;letter-spacing:.5px}
@media(max-width:880px){.about-grid{grid-template-columns:1fr}.sec{padding:70px 20px}}

.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
.skill-card{background:#111e35;border:1px solid rgba(78,205,230,.1);border-radius:14px;padding:22px;transition:border-color .2s,transform .2s}
.skill-card:hover{border-color:rgba(78,205,230,.4);transform:translateY(-3px)}
.sk-head{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.sk-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;background:rgba(41,182,232,.15);color:var(--sky2);font-family:var(--mono);font-weight:600}
.sk-title{font-size:14px;font-weight:700;color:#e2e8f0}
.sk-tags{display:flex;flex-wrap:wrap;gap:6px}
.sk-tags span{background:rgba(78,205,230,.1);border:1px solid rgba(78,205,230,.2);color:var(--sky2);padding:4px 11px;border-radius:20px;font-size:12px;font-weight:600}

.tl{padding-left:28px;position:relative}
.tl::before{content:'';position:absolute;left:0;top:6px;bottom:6px;width:1.5px;background:linear-gradient(to bottom,var(--sky2),rgba(78,205,230,0))}
.tl-item{position:relative;margin-bottom:32px}
.tl-item:last-child{margin-bottom:0}
.tl-dot{position:absolute;left:-36px;top:4px;width:15px;height:15px;border-radius:50%;background:var(--sky2);border:3px solid #0f1525}
.tl-card{background:#111e35;border:1px solid rgba(78,205,230,.1);border-radius:14px;padding:22px;transition:border-color .2s}
.tl-card:hover{border-color:rgba(78,205,230,.3)}
.tl-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.tl-role{font-size:16px;font-weight:700;color:#e2e8f0}
.tl-company{font-size:13px;color:var(--sky2);font-weight:600;margin-top:2px}
.tl-date{font-size:11px;color:#64748b;background:#0f1525;padding:4px 10px;border-radius:20px;border:1px solid rgba(78,205,230,.1);white-space:nowrap}
.tl-desc{color:#64748b;font-size:14px;line-height:1.8;margin-top:10px}
.tl-block .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#475569;font-weight:700;margin:12px 0 5px}
.tl-block ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.tl-block ul li{color:#94a3b8;font-size:13.5px;padding-left:16px;position:relative}
.tl-block ul li::before{content:'▹';position:absolute;left:0;color:var(--sky2)}
.tl-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.tl-tag{background:rgba(78,205,230,.1);border:1px solid rgba(78,205,230,.2);color:var(--sky2);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}

.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:22px}
.proj-card{background:#111e35;border:1px solid rgba(78,205,230,.1);border-radius:16px;overflow:hidden;transition:all .22s;display:flex;flex-direction:column}
.proj-card:hover{border-color:rgba(78,205,230,.3);transform:translateY(-4px)}
.proj-thumb{height:170px;display:grid;place-items:center;position:relative;overflow:hidden;background:linear-gradient(135deg,rgba(41,182,232,.12),rgba(66,133,244,.08));cursor:pointer}
.proj-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.proj-thumb .glyph{font-family:var(--mono);font-size:40px;color:rgba(78,205,230,.5)}
.proj-body{padding:18px;flex:1;display:flex;flex-direction:column;gap:8px}
.proj-cat{font-family:var(--mono);font-size:11px;color:var(--sky2);text-transform:uppercase;letter-spacing:.1em}
.proj-title{font-size:16px;font-weight:700;color:#e2e8f0}
.proj-desc{color:#64748b;font-size:13px;line-height:1.7}
.proj-stack{display:flex;flex-wrap:wrap;gap:6px}
.ptag{background:#0f1525;border:1px solid rgba(78,205,230,.15);color:#94a3b8;padding:3px 10px;border-radius:20px;font-size:11px}
.proj-links{display:flex;gap:14px;margin-top:auto;padding-top:4px}
.proj-links a{color:var(--sky2);font-size:12px;font-weight:700}

.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.info-card{background:#111e35;border:1px solid rgba(78,205,230,.1);border-radius:14px;padding:24px}
.info-card .yr{font-family:var(--mono);font-size:12px;color:var(--sky2);margin-bottom:6px}
.info-card h3{font-size:16px;font-weight:700;color:#e2e8f0;margin-bottom:5px}
.info-card h3 a:hover{color:var(--sky2)}
.info-card .sub{color:#64748b;font-size:13px}
.info-card p{color:#94a3b8;font-size:13.5px;margin-top:8px;line-height:1.7}

.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
.contact-info h3{font-size:24px;font-weight:800;color:#fff;margin-bottom:14px}
.contact-info p{color:#64748b;font-size:15px;line-height:1.8;margin-bottom:24px}
.c-item{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.c-ic{width:42px;height:42px;border-radius:10px;background:rgba(41,182,232,.12);border:1px solid rgba(41,182,232,.2);display:grid;place-items:center;font-family:var(--mono);color:var(--sky2);flex-shrink:0}
.c-item-text strong{display:block;font-size:12px;color:#64748b;margin-bottom:2px}
.c-item-text span{font-size:14px;font-weight:600;color:#e2e8f0}
@media(max-width:880px){.contact-grid{grid-template-columns:1fr}}

footer{background:#0a0f1e;border-top:1px solid rgba(78,205,230,.1);padding:30px 48px;display:flex;justify-content:space-between;align-items:center;color:#475569;font-size:13px}
@media(max-width:880px){footer{flex-direction:column;gap:14px;text-align:center}}
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
	if (statShown(v, 'years_experience', yearsExp)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('years_experience')}>${yearsExp}</span>+</div><div class="stat-lbl">Years Exp.</div></div>`);
	if (statShown(v, 'projects_count', projCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('projects_count')}>${projCount}</span>+</div><div class="stat-lbl">Projects</div></div>`);
	if (statShown(v, 'certifications_count', certsCount)) stats.push(`<div class="stat-card"><div class="stat-num"><span ${ted('certifications_count')}>${certsCount}</span></div><div class="stat-lbl">Certs</div></div>`);

	const badges = (v.skill_groups ?? []).flatMap((g) => g.skills).slice(0, 4)
		.map((s, i) => `<div class="tech-badge tb-${i}">${s}</div>`).join('');

	const heroHtml = `<section id="hero">
<div class="sky-bg"></div><div class="sun"></div><div class="cloud-wrap" id="cloud-wrap"></div>
<div class="hero-content">
<div class="hero-left">
<div class="hero-tag-line">&#128075; Welcome to my portfolio</div>
<h1 class="hero-h1">Hi, I am <span class="accent" ${ed('profile.full_name')}>${v.name}</span></h1>
${v.headline ? `<div class="hero-tag-line" style="color:#1a5fb4;font-weight:700" ${ed('portfolio.headline')}>${v.headline}</div>` : ''}
${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
${socialLinksHtml(v) ? `<div class="hero-socials">${socialLinksHtml(v)}</div>` : ''}
<a class="resume-btn" href="#contact">Get in touch</a>
</div>
<div class="hero-right">
<div class="hero-photo" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
${badges}
</div>
</div>
<div class="wave-div"><svg viewBox="0 0 1440 80" preserveAspectRatio="none" style="width:100%;display:block"><path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#0f1525"/></svg></div>
</section>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="sec"><div class="section-inner">
<span class="sec-label">// about me</span><h2 class="sec-title">Who Am <span>I?</span></h2>
<div class="about-grid">
<div class="about-img-box" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
<div class="about-text">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}${stats.length ? `<div class="stats-row">${stats.join('')}</div>` : ''}</div>
</div>
</div></div></section>`
		: '';

	const skillIcons = ['&#60;/&#62;', '{ }', '[ ]', '( )', '&#35;', '&#36;'];
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="sec"><div class="section-inner">
<span class="sec-label">// skills &amp; tech</span><h2 class="sec-title">What I <span>Work With</span></h2>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-card"${iw}>${delBtn('skills', i)}<div class="sk-head"><div class="sk-icon">${skillIcons[i % skillIcons.length]}</div><div class="sk-title" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="sk-tags" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="sec"><div class="section-inner">
<span class="sec-label">// work experience</span><h2 class="sec-title">My <span>Journey</span></h2>
<div class="tl">
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
<span class="sec-label">// featured work</span><h2 class="sec-title">My <span>Projects</span></h2>
<div class="proj-grid">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const thumb = imgs.length ? `<div class="proj-thumb" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>` : `<div class="proj-thumb" ${zone}><span class="glyph">{ }</span></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>` : '',
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">Live Demo &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<div class="proj-card"${iw}>${delBtn('projects', i)}${thumb}
<div class="proj-body">
${p.project_category ? `<div class="proj-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
<div class="proj-title" ${ed(`projects.${i}.title`)}>${p.title}</div>
${p.description ? `<div class="proj-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</div>` : ''}
${resp.length ? `<div class="tl-block"><div class="lbl">Responsibilities</div><ul ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${outcomes.length ? `<div class="tl-block"><div class="lbl">Outcomes</div><ul ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
${techSource.length ? `<div class="proj-stack" ${led(p.tech_stack?.length ? `projects.${i}.tech_stack` : `projects.${i}.software_used`)}>${techSource.map((t) => `<span class="ptag">${t}</span>`).join('')}</div>` : ''}
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
<span class="sec-label">// education</span><h2 class="sec-title">Where I <span>Studied</span></h2>
<div class="card-grid">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="info-card"${iw}>${delBtn('education', i)}${range ? `<div class="yr">${range}</div>` : ''}<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>${edu.institution ? `<div class="sub" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}${edu.grade_or_score ? `<div class="sub" style="color:var(--sky2);margin-top:4px" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="sec"><div class="section-inner">
<span class="sec-label">// credentials</span><h2 class="sec-title">My <span>Certifications</span></h2>
<div class="card-grid">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="info-card"${iw}>${delBtn('certifications', i)}${c.year ? `<div class="yr" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}<h3${!c.url ? ` ${ed(`certifications.${i}.name`)}` : ''}>${nameHtml}</h3>${c.issuer ? `<div class="sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></div></section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="sec"><div class="section-inner">
<span class="sec-label">// recognition</span><h2 class="sec-title">My <span>Achievements</span></h2>
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
			const items = (cs.items ?? []).map((item, i) => `<div class="info-card"${csIw}>${csDel(i)}${item.subtitle ? `<div class="yr" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="proj-stack" style="margin-top:10px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span class="ptag">${t}</span>`).join('')}</div>` : ''}${item.url ? `<div class="proj-links" style="margin-top:10px"><a href="${item.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a></div>` : ''}</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="sec"><div class="section-inner">
<span class="sec-label">// more</span><h2 class="sec-title">${cs.title}</h2>
<div class="card-grid">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</div></div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const cItems = [
		v.email ? `<div class="c-item"><div class="c-ic">@</div><div class="c-item-text"><strong>Email</strong><span ${ed('profile.email')}>${v.email}</span></div></div>` : '',
		v.phone ? `<div class="c-item"><div class="c-ic">#</div><div class="c-item-text"><strong>Phone</strong><span ${ed('profile.phone')}>${v.phone}</span></div></div>` : '',
		v.location ? `<div class="c-item"><div class="c-ic">&#9678;</div><div class="c-item-text"><strong>Location</strong><span ${ed('profile.location')}>${v.location}</span></div></div>` : '',
	].filter(Boolean);
	const contactHtml = (cItems.length || em)
		? `<section id="contact"><div class="sec"><div class="section-inner">
<span class="sec-label">// get in touch</span><h2 class="sec-title">Let's <span>Work Together</span></h2>
<div class="contact-grid">
<div class="contact-info"><h3>Have a project in mind?</h3><p>I'm always open to discussing new projects, ideas, or opportunities.</p>${cItems.join('')}</div>
<div class="contact-info">${socialLinksHtml(v) ? `<div class="hero-socials">${socialLinksHtml(v)}</div>` : ''}${v.email ? `<a class="resume-btn" style="margin-top:16px" href="mailto:${v.email}">Send a message &#8594;</a>` : ''}</div>
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
<style>${css()}</style>
</head>
<body>
<div id="progress"></div>
<nav>
<div class="logo"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span>&lt;<span>Dev</span>/&gt;</div>
<ul class="nav-links">${navItems}</ul>
<a class="nav-hire" href="#contact">Hire Me</a>
</nav>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><div>&copy; ${new Date().getFullYear()} ${v.name}. Built with care.</div><div>Portfolio</div></footer>
${em ? '' : `<script>
addEventListener('scroll',function(){var p=(scrollY/(document.body.scrollHeight-innerHeight))*100;document.getElementById('progress').style.width=Math.min(p,100)+'%'});
(function(){var wrap=document.getElementById('cloud-wrap');if(!wrap)return;var cfgs=[[220,65,70,90,0,.95],[300,75,130,130,15,.85],[180,55,55,80,5,.95],[260,68,160,110,30,.75],[200,60,40,95,20,.9],[280,72,90,140,8,.8]];cfgs.forEach(function(c){var d=document.createElement('div');d.className='cloud';d.style.cssText='top:'+c[2]+'px;opacity:'+c[5]+';animation-duration:'+c[3]+'s;animation-delay:-'+c[4]+'s';var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 '+c[0]+' '+c[1]);s.setAttribute('width',c[0]);s.setAttribute('height',c[1]);[[c[0]*.5,c[1]*.62,c[0]*.48,c[1]*.42],[c[0]*.3,c[1]*.45,c[0]*.25,c[1]*.38],[c[0]*.65,c[1]*.38,c[0]*.22,c[1]*.33],[c[0]*.5,c[1]*.28,c[0]*.17,c[1]*.27]].forEach(function(e){var el=document.createElementNS('http://www.w3.org/2000/svg','ellipse');el.setAttribute('cx',e[0]);el.setAttribute('cy',e[1]);el.setAttribute('rx',e[2]);el.setAttribute('ry',e[3]);s.appendChild(el)});d.appendChild(s);wrap.appendChild(d)})})();
</script>`}
${edScript}
</body>
</html>`;
}
