/**
 * Template: Nimbus
 * Deep-navy (#070912) cloud/DevOps portfolio. Blue→cyan→violet gradient (#5b8bff/#7ad7ff/#b69cff)
 * with gold (#e8c07a) grade accents. Fraunces serif + Inter sans + JetBrains Mono labels.
 * Radial-glow + faint grid background. Fixed blur nav. Two-column hero with gradient-bordered
 * portrait card and floating stat chips. Centered section heads. Gradient-icon skill cards
 * (tag chips, NO bars). Left-rail dotted timeline. 3-col project cards. Scroll reveal (published only).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['github_url', 'GitHub'],
		['linkedin_url', 'LinkedIn'],
		['twitter_url', 'X'],
		['portfolio_url', 'Portfolio'],
	];
	return items
		.filter(([key]) => !!v[key])
		.map(([key, label]) => `<a href="${v[key]}" target="_blank" rel="noopener noreferrer">${label}</a>`)
		.join('');
}

function css(): string {
	return `
:root{
  --bg:#070912;--bg-2:#0b1124;--surface:#0f1530;
  --line:rgba(140,170,255,.12);--text:#e8ecff;--muted:#9aa3c7;
  --primary:#5b8bff;--primary-2:#7ad7ff;--accent:#b69cff;--gold:#e8c07a;
  --shadow:0 30px 80px -20px rgba(10,20,60,.6);
  --grad:linear-gradient(135deg,#5b8bff 0%,#7ad7ff 50%,#b69cff 100%);
  --grad-soft:linear-gradient(135deg,rgba(91,139,255,.18),rgba(122,215,255,.06) 60%,rgba(182,156,255,.18));
  --serif:'Fraunces',serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0;z-index:-2;background:radial-gradient(800px 600px at 10% 0%,rgba(91,139,255,.18),transparent 60%),radial-gradient(700px 500px at 90% 20%,rgba(182,156,255,.15),transparent 60%),radial-gradient(900px 700px at 50% 100%,rgba(122,215,255,.12),transparent 60%),var(--bg)}
body::after{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background-image:linear-gradient(rgba(140,170,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(140,170,255,.04) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%);mask-image:radial-gradient(ellipse at center,#000 30%,transparent 80%)}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:1240px;margin:0 auto;padding:0 32px}

.nav{position:fixed;top:0;left:0;right:0;z-index:50;backdrop-filter:blur(20px);background:rgba(7,9,18,.55);border-bottom:1px solid var(--line)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:72px}
.brand{font-family:var(--serif);font-size:24px;font-weight:600;letter-spacing:-.02em;display:flex;align-items:center;gap:10px}
.brand .av{width:34px;height:34px;border-radius:50%;background:var(--grad);overflow:hidden;flex-shrink:0}
.brand .av img{width:100%;height:100%;object-fit:cover}
.brand span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.nav-links{display:flex;gap:32px;list-style:none}
.nav-links a{font-size:14px;color:var(--muted);transition:.2s}
.nav-links a:hover{color:var(--text)}
.nav-cta{padding:10px 22px;border-radius:999px;background:var(--grad);color:#0a0f24;font-weight:600;font-size:14px;transition:.3s;box-shadow:0 10px 30px -10px rgba(91,139,255,.6)}
.nav-cta:hover{transform:translateY(-2px)}
@media(max-width:960px){.nav-links{display:none}}

.hero{min-height:100vh;display:flex;align-items:center;padding:140px 0 80px;position:relative;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:center}
.eyebrow{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border:1px solid var(--line);border-radius:999px;font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);background:rgba(255,255,255,.02)}
.eyebrow .dot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80}
h1.title{font-family:var(--serif);font-weight:400;font-size:clamp(46px,7vw,88px);line-height:1.02;letter-spacing:-.03em;margin:28px 0 20px}
h1.title em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:300}
.role{font-family:var(--mono);font-size:14px;color:var(--primary-2);letter-spacing:.05em;margin-bottom:22px}
.hero-desc{font-size:18px;color:var(--muted);max-width:560px;margin-bottom:36px}
.cta-row{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:44px}
.btn{padding:15px 26px;border-radius:999px;font-weight:600;font-size:15px;display:inline-flex;align-items:center;gap:10px;transition:.3s;border:0}
.btn-primary{background:var(--grad);color:#0a0f24;box-shadow:0 14px 40px -10px rgba(91,139,255,.55)}
.btn-primary:hover{transform:translateY(-3px)}
.btn-ghost{background:rgba(255,255,255,.04);color:var(--text);border:1px solid var(--line)}
.btn-ghost:hover{background:rgba(255,255,255,.08)}
.socials{display:flex;gap:12px;flex-wrap:wrap}
.socials a{padding:10px 18px;border-radius:999px;background:rgba(255,255,255,.03);border:1px solid var(--line);transition:.3s;color:var(--muted);font-size:13px}
.socials a:hover{color:var(--text);border-color:var(--primary);transform:translateY(-3px)}
.portrait-wrap{position:relative;display:flex;justify-content:center}
.portrait{width:min(460px,100%);aspect-ratio:4/5;border-radius:32px;overflow:hidden;position:relative;background:linear-gradient(135deg,#1a2348,#0d1228);border:1px solid rgba(140,170,255,.2);box-shadow:var(--shadow),0 0 80px rgba(91,139,255,.2);display:grid;place-items:center;cursor:pointer}
.portrait img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2}
.portrait .ph{position:relative;z-index:2;font-family:var(--serif);font-size:96px;font-weight:300;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.portrait::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,rgba(122,215,255,.4),transparent 50%),radial-gradient(circle at 70% 80%,rgba(182,156,255,.35),transparent 50%);z-index:1}
.chip{position:absolute;padding:14px 18px;border-radius:16px;background:rgba(15,21,48,.85);border:1px solid var(--line);backdrop-filter:blur(20px);box-shadow:0 20px 60px -10px rgba(0,0,0,.5);font-size:13px;animation:float 6s ease-in-out infinite;z-index:3}
.chip strong{display:block;font-family:var(--serif);font-size:22px;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.chip span{color:var(--muted);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.chip-1{top:8%;left:-6%}.chip-2{bottom:16%;right:-8%;animation-delay:-3s}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}

section{padding:110px 0;position:relative}
.section-head{text-align:center;margin-bottom:72px}
.section-head .eyebrow{margin-bottom:18px}
.section-head h2{font-family:var(--serif);font-weight:400;font-size:clamp(34px,5vw,60px);letter-spacing:-.02em;line-height:1.1}
.section-head h2 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.section-head p{color:var(--muted);max-width:600px;margin:18px auto 0;font-size:17px}

.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
.about-text p{color:var(--muted);font-size:17px;margin-bottom:18px}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.stat{padding:26px;border-radius:20px;background:var(--grad-soft);border:1px solid var(--line)}
.stat-num{font-family:var(--serif);font-size:44px;font-weight:300;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1}
.stat-lbl{color:var(--muted);font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin-top:8px}
@media(max-width:960px){.about-grid{grid-template-columns:1fr;gap:48px}}

.skills-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:28px}
.skill-card{padding:34px;border-radius:24px;background:linear-gradient(180deg,rgba(15,21,48,.7),rgba(15,21,48,.3));border:1px solid var(--line);transition:.4s;position:relative;overflow:hidden}
.skill-card:hover{transform:translateY(-6px);border-color:rgba(91,139,255,.3);box-shadow:0 30px 60px -20px rgba(91,139,255,.3)}
.skill-card h3{font-family:var(--serif);font-size:23px;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:14px}
.skill-card h3 .ico{width:42px;height:42px;border-radius:12px;background:var(--grad);display:grid;place-items:center;color:#0a0f24;font-weight:700;font-family:var(--mono);flex-shrink:0}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{font-size:12px;padding:6px 13px;border-radius:999px;background:rgba(91,139,255,.1);color:var(--primary-2);border:1px solid rgba(91,139,255,.2)}
@media(max-width:960px){.skills-grid{grid-template-columns:1fr}}

.timeline{position:relative;max-width:880px;margin:0 auto;padding-left:32px}
.timeline::before{content:"";position:absolute;top:8px;bottom:8px;left:8px;width:2px;background:linear-gradient(180deg,var(--primary),var(--accent),transparent)}
.t-item{position:relative;padding-bottom:52px}
.t-item:last-child{padding-bottom:0}
.t-item::before{content:"";position:absolute;left:-32px;top:6px;width:18px;height:18px;border-radius:50%;background:var(--bg);border:2px solid var(--primary);box-shadow:0 0 0 6px rgba(91,139,255,.15),0 0 20px var(--primary)}
.t-meta{font-family:var(--mono);font-size:12px;color:var(--primary-2);letter-spacing:.1em;margin-bottom:8px}
.t-item h3{font-family:var(--serif);font-size:25px;font-weight:500;margin-bottom:4px}
.t-co{color:var(--muted);margin-bottom:16px;font-size:15px}
.t-desc{color:var(--muted);font-size:15px;margin-bottom:14px}
.t-list{list-style:none;display:grid;gap:10px}
.t-list li{padding-left:24px;position:relative;color:var(--muted);font-size:15px}
.t-list li::before{content:"";position:absolute;left:0;top:11px;width:12px;height:1px;background:var(--primary)}

.proj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.proj{border-radius:24px;overflow:hidden;background:var(--surface);border:1px solid var(--line);transition:.4s;display:flex;flex-direction:column}
.proj:hover{transform:translateY(-8px);border-color:rgba(91,139,255,.4);box-shadow:0 30px 70px -20px rgba(91,139,255,.3)}
.proj-img{aspect-ratio:16/10;background:var(--grad-soft);position:relative;overflow:hidden;display:grid;place-items:center;cursor:pointer}
.proj-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.proj-img .glyph{font-family:var(--serif);font-size:40px;font-style:italic;color:rgba(232,236,255,.5)}
.proj-body{padding:26px;flex:1;display:flex;flex-direction:column;gap:12px}
.proj-tag{font-family:var(--mono);font-size:11px;color:var(--primary-2);letter-spacing:.15em;text-transform:uppercase}
.proj h3{font-family:var(--serif);font-size:21px;font-weight:500}
.proj p.desc{color:var(--muted);font-size:14px}
.proj-block .lbl{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:6px}
.proj-block ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.proj-block ul li{font-size:13.5px;color:var(--muted);padding-left:16px;position:relative}
.proj-block ul li::before{content:"";position:absolute;left:0;top:10px;width:10px;height:1px;background:var(--primary)}
.tech{display:flex;flex-wrap:wrap;gap:6px}
.tech span{font-size:11px;padding:4px 10px;border-radius:999px;background:rgba(91,139,255,.1);color:var(--primary-2);border:1px solid rgba(91,139,255,.2)}
.proj-links{display:flex;gap:14px;margin-top:auto;padding-top:6px}
.proj-links a{color:var(--primary-2);font-size:13px;font-weight:500}
.proj-links a:hover{color:var(--text)}
@media(max-width:960px){.proj-grid{grid-template-columns:1fr}}

.card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:28px;max-width:980px;margin:0 auto}
.card{padding:34px;border-radius:24px;background:linear-gradient(180deg,rgba(15,21,48,.7),rgba(15,21,48,.3));border:1px solid var(--line);position:relative;overflow:hidden}
.card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:var(--grad)}
.card-yr{font-family:var(--mono);font-size:12px;color:var(--primary-2);letter-spacing:.1em;margin-bottom:8px}
.card h3{font-family:var(--serif);font-size:21px;font-weight:500;margin-bottom:6px}
.card h3 a:hover{color:var(--primary-2)}
.card-sub{color:var(--muted);font-size:14px;margin-bottom:12px}
.card-grade{font-size:14px;color:var(--gold)}
.card p{color:var(--muted);font-size:14px;margin-top:8px}
@media(max-width:960px){.card-grid{grid-template-columns:1fr}}

.contact-wrap{max-width:760px;margin:0 auto;padding:52px;border-radius:32px;background:linear-gradient(180deg,rgba(15,21,48,.8),rgba(15,21,48,.4));border:1px solid var(--line);box-shadow:var(--shadow);text-align:center}
.contact-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:18px;margin-bottom:30px}
.info{padding:22px;border-radius:16px;background:rgba(255,255,255,.02);border:1px solid var(--line)}
.info-lbl{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.info a,.info span{color:var(--text);font-size:14px}
.email-btn{display:inline-flex;align-items:center;gap:10px;padding:15px 30px;border-radius:999px;background:var(--grad);color:#0a0f24;font-weight:600}

footer{padding:40px 0;border-top:1px solid var(--line);text-align:center;color:var(--muted);font-size:13px}
footer span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:600}

.reveal{opacity:0;transform:translateY(30px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)}
.reveal.in-view{opacity:1;transform:translateY(0)}
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
	const rev = em ? '' : ' reveal';
	const edScript = em ? EDITOR_SCRIPT : '';
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const NAV_LABELS: Record<string, string> = {
		experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements',
	};
	const navAnchors: [string, string][] = [];
	if (v.bio || em) navAnchors.push(['about', 'About']);
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (key === 'custom_sections') {
			for (const cs of v.custom_sections ?? []) {
				if (cs.items?.length || em) navAnchors.push([cs.section_id, cs.title]);
			}
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

	// stats
	const yearsExp = v.template_overrides?.years_experience ?? 0;
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certsCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const stats: string[] = [];
	if (statShown(v, 'years_experience', yearsExp)) stats.push(`<div class="stat"><div class="stat-num"><span ${ted('years_experience')}>${yearsExp}</span>+</div><div class="stat-lbl">Years Experience</div></div>`);
	if (statShown(v, 'projects_count', projCount)) stats.push(`<div class="stat"><div class="stat-num"><span ${ted('projects_count')}>${projCount}</span>+</div><div class="stat-lbl">Projects Shipped</div></div>`);
	if (statShown(v, 'certifications_count', certsCount)) stats.push(`<div class="stat"><div class="stat-num"><span ${ted('certifications_count')}>${certsCount}</span></div><div class="stat-lbl">Certifications</div></div>`);
	const chips: string[] = [];
	if (statShown(v, 'years_experience', yearsExp)) chips.push(`<div class="chip chip-1"><strong>${yearsExp}+</strong><span>Years</span></div>`);
	if (statShown(v, 'projects_count', projCount)) chips.push(`<div class="chip chip-2"><strong>${projCount}+</strong><span>Projects</span></div>`);

	const skillIcons = ['&#9729;', '&#9096;', '&#9881;', '&#10227;', '&#128421;', '&#9874;'];

	const heroHtml = `<header class="hero">
<div class="container hero-grid">
<div>
<span class="eyebrow"><span class="dot"></span>Available for new opportunities</span>
<h1 class="title">Hi, I'm <em ${ed('profile.full_name')}>${v.name}</em></h1>
${v.headline ? `<div class="role" ${ed('portfolio.headline')}>${v.headline}</div>` : ''}
${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="cta-row"><a class="btn btn-primary" href="#projects">View my work &#8594;</a><a class="btn btn-ghost" href="#contact">Get in touch</a></div>
${socialLinksHtml(v) ? `<div class="socials">${socialLinksHtml(v)}</div>` : ''}
</div>
<div class="portrait-wrap">
<div class="portrait" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
${chips.join('')}
</div>
</div>
</header>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">About</span><h2>A craftsman of <em>reliable systems</em>.</h2></div>
<div class="about-grid">
<div class="about-text${rev}">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}</div>
${stats.length ? `<div class="stats${rev}">${stats.join('')}</div>` : ''}
</div>
</div></section>`
		: '';

	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">Toolkit</span><h2>Skills <em>&amp;</em> expertise.</h2><p>A curated stack refined across production deployments.</p></div>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-card${rev}"${iw}>${delBtn('skills', i)}<h3><span class="ico">${skillIcons[i % skillIcons.length]}</span><span ${ed(`skills.${i}.category`)}>${g.category}</span></h3><div class="chips" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">Journey</span><h2>Professional <em>experience</em>.</h2></div>
<div class="timeline">
${v.experience.map((exp, i) => {
			const range = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em);
			return `<div class="t-item${rev}"${iw}>${delBtn('experience', i)}
${range ? `<div class="t-meta">${range}</div>` : ''}
<h3 ${ed(`experience.${i}.role`)}>${exp.role}</h3>
<div class="t-co">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.location ? ` &middot; <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>
${exp.description ? `<p class="t-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="t-list" ${led(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>`;
		}).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>`
		: '';

	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">Selected Work</span><h2>Featured <em>projects</em>.</h2><p>Systems I've designed, scaled, or rescued.</p></div>
<div class="proj-grid">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const img = imgs.length ? `<div class="proj-img" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>` : `<div class="proj-img" ${zone}><span class="glyph">${p.title ? p.title.slice(0, 2) : '&#9671;'}</span></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">Live &#8599;</a>` : '',
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<article class="proj${rev}"${iw}>${delBtn('projects', i)}${img}
<div class="proj-body">
${p.project_category ? `<div class="proj-tag" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
<h3 ${ed(`projects.${i}.title`)}>${p.title}</h3>
${p.description ? `<p class="desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${resp.length ? `<div class="proj-block"><div class="lbl">Responsibilities</div><ul ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${outcomes.length ? `<div class="proj-block"><div class="lbl">Outcomes</div><ul ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
${techSource.length ? `<div class="tech" ${led(p.tech_stack?.length ? `projects.${i}.tech_stack` : `projects.${i}.software_used`)}>${techSource.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}
${links ? `<div class="proj-links">${links}</div>` : ''}
</div>
</article>`;
		}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</div></section>`
		: '';

	const eduHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">Background</span><h2>Education <em>&amp;</em> study.</h2></div>
<div class="card-grid">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="card${rev}"${iw}>${delBtn('education', i)}
${range ? `<div class="card-yr">${range}</div>` : ''}
<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>
${edu.institution ? `<div class="card-sub" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
${edu.grade_or_score ? `<div class="card-grade">&#9733; <span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span></div>` : ''}
</div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">Credentials</span><h2>Certifications.</h2></div>
<div class="card-grid">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="card${rev}"${iw}>${delBtn('certifications', i)}${c.year ? `<div class="card-yr" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}<h3 ${ed(`certifications.${i}.name`)}>${nameHtml}</h3>${c.issuer ? `<div class="card-sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">Recognition</span><h2>Achievements.</h2></div>
<div class="card-grid">
${v.achievements.map((a, i) => `<div class="card${rev}"${iw}>${delBtn('achievements', i)}${a.year ? `<div class="card-yr" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}<h3 ${ed(`achievements.${i}.title`)}>${a.title}</h3>${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>`
		: '';

	const customHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			const csDel = (i: number) => em ? `<button class="ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>` : '';
			const csIw = ` data-item-wrap data-cs-idx="${csIdx}"`;
			const items = (cs.items ?? []).map((item, i) => `<div class="card"${csIw}>${csDel(i)}${item.subtitle ? `<div class="card-yr" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="tech" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}${item.url ? `<div class="proj-links" style="margin-top:12px"><a href="${item.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a></div>` : ''}</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">More</span><h2 ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</h2></div>
<div class="card-grid">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const infoItems = [
		v.email ? `<div class="info"><div class="info-lbl">Email</div><a href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a></div>` : '',
		v.phone ? `<div class="info"><div class="info-lbl">Phone</div><span ${ed('profile.phone')}>${v.phone}</span></div>` : '',
		v.location ? `<div class="info"><div class="info-lbl">Location</div><span ${ed('profile.location')}>${v.location}</span></div>` : '',
	].filter(Boolean);
	const contactHtml = (infoItems.length || em)
		? `<section id="contact"><div class="container">
<div class="section-head${rev}"><span class="eyebrow">Contact</span><h2>Let's build something <em>remarkable</em>.</h2></div>
<div class="contact-wrap${rev}">
${infoItems.length ? `<div class="contact-info">${infoItems.join('')}</div>` : ''}
${v.email ? `<a class="email-btn" href="mailto:${v.email}">Send a message &#8594;</a>` : ''}
</div>
</div></section>`
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
<nav class="nav"><div class="container nav-inner">
<a href="#" class="brand"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span> ${v.name.split(' ')[0]}<span>.</span></a>
<ul class="nav-links">${navItems}</ul>
<a href="#contact" class="nav-cta">Let's talk</a>
</div></nav>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><div class="container">&copy; ${new Date().getFullYear()} <span>${v.name}</span> &middot; Crafted with care.</div></footer>
${em ? '' : `<script>
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const nav=document.querySelector('.nav');addEventListener('scroll',()=>{nav.style.background=scrollY>40?'rgba(7,9,18,.85)':'rgba(7,9,18,.55)'});
</script>`}
${edScript}
</body>
</html>`;
}
