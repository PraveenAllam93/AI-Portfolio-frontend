/**
 * Template: Citrus
 * Warm light (#f6f3ee cream) editorial front-end portfolio. Burnt-orange (#ff5b2e) accent,
 * near-black ink (#14110f). Fraunces serif display (with italic + outline-stroke variants) +
 * Inter sans. Badge pulse, sliding skill marquee, hover-indent timeline rows, an inverted
 * dark skills band with tag chips (NO bars), 6-col featured work grid, dark rounded contact card.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,800&family=Inter:wght@300;400;500;600;700&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialRows(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['linkedin_url', 'LinkedIn'],
		['github_url', 'GitHub'],
		['twitter_url', 'X / Twitter'],
		['portfolio_url', 'Portfolio'],
	];
	return items
		.filter(([key]) => !!v[key])
		.map(([key, label]) => `<a class="link-row" href="${v[key]}" target="_blank" rel="noopener noreferrer"><span class="lbl">${label}</span><span class="val">Visit &#8599;</span></a>`)
		.join('');
}

function css(): string {
	return `
:root{
  --bg:#f6f3ee;--bg-2:#efeae1;--ink:#14110f;--ink-2:#3a352f;--muted:#7b7268;
  --line:#1a1714;--accent:#ff5b2e;--accent-2:#e94a1d;--card:#fff;
  --radius:18px;--maxw:1240px;--shadow:0 30px 60px -30px rgba(20,17,15,.25);
  --serif:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--bg);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 32px}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);font-weight:600;display:inline-flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:24px;height:1px;background:currentColor}

nav{position:fixed;inset:0 0 auto 0;z-index:50;backdrop-filter:saturate(180%) blur(14px);background:rgba(246,243,238,.78);border-bottom:1px solid rgba(26,23,20,.08)}
nav .wrap{display:flex;align-items:center;justify-content:space-between;height:72px}
.logo{font-family:var(--serif);font-size:22px;font-weight:600;letter-spacing:-.02em;display:flex;align-items:center;gap:8px}
.logo .dot{width:24px;height:24px;border-radius:50%;background:var(--accent);display:inline-flex;overflow:hidden;flex-shrink:0}
.logo .dot img{width:100%;height:100%;object-fit:cover}
.nav-links{display:flex;gap:32px;font-size:14px;font-weight:500}
.nav-links a{position:relative;color:var(--ink-2)}
.nav-links a:hover{color:var(--ink)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;background:var(--ink);color:var(--bg);font-size:13px;font-weight:600;transition:transform .2s ease,background .2s ease;border:1px solid var(--ink)}
.btn:hover{transform:translateY(-1px);background:var(--accent);border-color:var(--accent);color:#fff}
.btn.ghost{background:transparent;color:var(--ink)}
.btn.ghost:hover{background:var(--ink);color:var(--bg)}
@media(max-width:900px){.nav-links{display:none}}

header.hero{padding:140px 0 60px;position:relative;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1.3fr .9fr;gap:60px;align-items:end}
.badge{display:inline-flex;align-items:center;gap:10px;padding:6px 14px 6px 8px;border-radius:999px;background:#fff;border:1px solid rgba(26,23,20,.1);font-size:12px;color:var(--ink-2);font-weight:500}
.badge .pulse{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.18)}
h1.title{font-family:var(--serif);font-weight:300;font-size:clamp(52px,9vw,132px);line-height:.92;letter-spacing:-.045em;margin:26px 0 22px}
h1.title em{font-style:italic;font-weight:400;color:var(--accent)}
.lede{font-size:18px;color:var(--ink-2);max-width:520px;margin-bottom:32px}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.hero-meta{display:flex;gap:32px;margin-top:44px;padding-top:26px;border-top:1px solid rgba(26,23,20,.12);flex-wrap:wrap}
.hero-meta div{font-size:13px;color:var(--muted)}
.hero-meta strong{display:block;color:var(--ink);font-size:15px;font-weight:600;margin-bottom:2px}
.portrait{position:relative;aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;background:linear-gradient(135deg,var(--accent),#ff8a5b);box-shadow:var(--shadow);display:grid;place-items:center;cursor:pointer}
.portrait img{width:100%;height:100%;object-fit:cover}
.portrait .ph{font-family:var(--serif);font-size:96px;color:#fff;font-weight:300;font-style:italic}
.portrait .tag{position:absolute;left:16px;right:16px;bottom:16px;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:12px;background:rgba(246,243,238,.92);backdrop-filter:blur(10px);font-size:12px;font-weight:500;color:var(--ink)}
.portrait .tag span:last-child{color:var(--accent);font-weight:600}
@media(max-width:900px){.hero-grid{grid-template-columns:1fr;gap:44px}.portrait{max-width:400px}}

.marquee{margin-top:70px;padding:18px 0;border-top:1px solid rgba(26,23,20,.12);border-bottom:1px solid rgba(26,23,20,.12);overflow:hidden;white-space:nowrap}
.marquee-track{display:inline-flex;gap:48px;animation:slide 35s linear infinite;font-family:var(--serif);font-size:22px;color:var(--ink-2)}
.marquee-track span{display:inline-flex;align-items:center;gap:48px}
.marquee-track span::after{content:"\\2726";color:var(--accent)}
@keyframes slide{from{transform:translateX(0)}to{transform:translateX(-50%)}}

section{padding:110px 0;position:relative}
.section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:56px;flex-wrap:wrap}
.section-head h2{font-family:var(--serif);font-weight:400;font-size:clamp(34px,5vw,62px);line-height:1;letter-spacing:-.035em;max-width:700px;margin-top:14px}
.section-head h2 em{font-style:italic;color:var(--accent)}
.section-head p{color:var(--muted);max-width:340px;font-size:15px}

.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
.about-text p{font-size:17px;color:var(--ink-2);margin-bottom:16px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px}
.stat{padding:22px;background:#fff;border-radius:14px;border:1px solid rgba(26,23,20,.08)}
.stat .num{font-family:var(--serif);font-size:40px;line-height:1;color:var(--accent);font-weight:500}
.stat .lbl{font-size:12px;color:var(--muted);margin-top:8px;letter-spacing:.05em;text-transform:uppercase;font-weight:500}
.about-visual{aspect-ratio:1/1.1;border-radius:var(--radius);overflow:hidden;background:linear-gradient(135deg,var(--accent),#ff8a5b);position:relative;box-shadow:var(--shadow);display:grid;place-items:center;cursor:pointer}
.about-visual img{width:100%;height:100%;object-fit:cover}
.about-visual .ph{font-family:var(--serif);font-size:110px;color:rgba(255,255,255,.85);font-style:italic}
@media(max-width:900px){.about-grid{grid-template-columns:1fr;gap:48px}.stats{grid-template-columns:1fr 1fr}}

.timeline{display:flex;flex-direction:column}
.row{display:grid;grid-template-columns:140px 1fr auto;gap:40px;align-items:start;padding:34px 0;border-top:1px solid rgba(26,23,20,.12);transition:padding .3s ease;position:relative}
.row:last-child{border-bottom:1px solid rgba(26,23,20,.12)}
.row:hover{padding-left:16px}
.row .year{font-family:var(--serif);font-size:22px;color:var(--muted);font-weight:400}
.row h3{font-family:var(--serif);font-size:26px;font-weight:500;letter-spacing:-.02em;margin-bottom:6px}
.row .org{color:var(--muted);font-size:14px;margin-bottom:10px}
.row p{color:var(--ink-2);font-size:15px;max-width:600px;margin-bottom:10px}
.row ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.row ul li{font-size:12px;padding:5px 11px;border-radius:999px;background:var(--bg-2);color:var(--ink-2);font-weight:500}
.row .tag-sm{font-size:12px;padding:6px 12px;border-radius:999px;background:var(--bg-2);color:var(--ink-2);font-weight:500;white-space:nowrap}
@media(max-width:900px){.row{grid-template-columns:1fr;gap:8px}.row .tag-sm{justify-self:start}}

.skills-section{background:var(--ink);color:var(--bg);border-radius:var(--radius)}
.skills-section .section-head{padding:0 40px;margin-top:60px}
.skills-section .section-head h2,.skills-section .eyebrow{color:var(--bg)}
.skills-section .section-head p{color:#a39a8e}
.skills-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#2a2520;border-radius:var(--radius);overflow:hidden;margin:0 40px 40px}
.skill{padding:34px 26px;background:var(--ink);transition:background .3s ease}
.skill:hover{background:#1e1a16}
.skill .ico{width:42px;height:42px;border-radius:12px;background:rgba(255,91,46,.18);color:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-family:var(--serif);font-size:18px}
.skill h4{font-family:var(--serif);font-size:21px;font-weight:500;margin-bottom:14px}
.skill .list{display:flex;flex-wrap:wrap;gap:6px}
.skill .list span{font-size:11px;padding:4px 10px;border-radius:999px;background:#2a2520;color:#d5cdc1}
@media(max-width:900px){.skills-grid{grid-template-columns:1fr 1fr;margin:0 20px 30px}.skills-section .section-head{padding:0 20px}}

.work-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:24px}
.project{grid-column:span 3;background:#fff;border-radius:var(--radius);overflow:hidden;border:1px solid rgba(26,23,20,.08);transition:transform .35s ease,box-shadow .35s ease;display:flex;flex-direction:column}
.project.featured{grid-column:span 6}
.project:hover{transform:translateY(-6px);box-shadow:var(--shadow)}
.project .thumb{aspect-ratio:16/10;overflow:hidden;background:var(--bg-2);display:grid;place-items:center;cursor:pointer;position:relative}
.project.featured .thumb{aspect-ratio:21/8}
.project .thumb img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
.project:hover .thumb img{transform:scale(1.04)}
.project .thumb .glyph{font-family:var(--serif);font-size:40px;font-style:italic;color:var(--muted)}
.project .body{padding:26px 26px 30px;display:flex;flex-direction:column;gap:10px}
.project .meta-top{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted);font-weight:500;letter-spacing:.05em;text-transform:uppercase}
.project h3{font-family:var(--serif);font-size:28px;font-weight:500;letter-spacing:-.02em}
.project p.desc{color:var(--ink-2);font-size:15px}
.proj-block .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;margin-bottom:6px}
.proj-block ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.proj-block ul li{font-size:14px;color:var(--ink-2);padding-left:16px;position:relative}
.proj-block ul li::before{content:"\\2192";position:absolute;left:0;color:var(--accent)}
.project .stack{display:flex;gap:8px;flex-wrap:wrap}
.project .stack span{font-size:11px;padding:5px 11px;border-radius:999px;background:var(--bg-2);color:var(--ink-2);font-weight:500}
.project .links{display:flex;gap:16px;margin-top:6px;font-size:13px;font-weight:600}
.project .links a{color:var(--ink)}
.project .links a:hover{color:var(--accent)}
@media(max-width:900px){.work-grid{grid-template-columns:1fr}.project,.project.featured{grid-column:span 1}}

.contact{background:var(--ink);color:var(--bg);border-radius:32px;padding:80px 56px;position:relative;overflow:hidden}
.contact::before{content:"";position:absolute;right:-100px;top:-100px;width:400px;height:400px;background:radial-gradient(circle,var(--accent) 0%,transparent 70%);opacity:.35}
.contact-inner{position:relative;display:grid;grid-template-columns:1.4fr 1fr;gap:60px;align-items:center}
.contact h2{font-family:var(--serif);font-weight:300;font-size:clamp(40px,6vw,76px);line-height:1;letter-spacing:-.04em;margin-bottom:22px}
.contact h2 em{font-style:italic;color:var(--accent);font-weight:400}
.contact p{color:#bdb4a7;max-width:480px;margin-bottom:32px;font-size:17px}
.contact .btn{background:var(--accent);border-color:var(--accent);color:#fff;padding:16px 28px;font-size:14px}
.contact .btn:hover{background:#fff;border-color:#fff;color:var(--ink)}
.links{display:flex;flex-direction:column;gap:2px}
.link-row{display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-top:1px solid #2a2520;font-size:15px;transition:padding .3s ease}
.link-row:last-child{border-bottom:1px solid #2a2520}
.link-row:hover{padding-left:12px}
.link-row .lbl{color:#a39a8e;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.link-row .val{font-family:var(--serif);font-size:18px}
.link-row .val:hover{color:var(--accent)}
@media(max-width:900px){.contact{padding:56px 30px}.contact-inner{grid-template-columns:1fr;gap:40px}}

footer{padding:40px 0 60px;color:var(--muted);font-size:13px}
footer .wrap{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
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
		experience: 'Experience', education: 'Education', skills: 'Skills',
		projects: 'Work', certifications: 'Certs', achievements: 'Awards',
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
	const navItems = navAnchors.map(([a, l]) => `<a href="#${a}">${l}</a>`).join('');

	// stats
	const yearsExp = v.template_overrides?.years_experience ?? 0;
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certsCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const stats: string[] = [];
	if (statShown(v, 'years_experience', yearsExp)) stats.push(`<div class="stat"><div class="num"><span ${ted('years_experience')}>${yearsExp}</span>+</div><div class="lbl">Years experience</div></div>`);
	if (statShown(v, 'projects_count', projCount)) stats.push(`<div class="stat"><div class="num"><span ${ted('projects_count')}>${projCount}</span></div><div class="lbl">Projects shipped</div></div>`);
	if (statShown(v, 'certifications_count', certsCount)) stats.push(`<div class="stat"><div class="num"><span ${ted('certifications_count')}>${certsCount}</span></div><div class="lbl">Certifications</div></div>`);

	// marquee from flattened skills
	const flat = (v.skill_groups ?? []).flatMap((g) => g.skills).slice(0, 10);
	const marqueeInner = flat.length ? `<span>${flat.join('</span><span>')}</span>` : '';
	const marquee = flat.length ? `<div class="marquee"><div class="marquee-track">${marqueeInner}${marqueeInner}</div></div>` : '';

	const heroHtml = `<header class="hero">
<div class="wrap">
<div class="hero-grid">
<div>
<span class="badge"><span class="pulse"></span> ${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Open for opportunities'}</span>
<h1 class="title">Hi, I'm <em ${ed('profile.full_name')}>${v.name}</em>.</h1>
${v.bio ? `<p class="lede" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="lede" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
<div class="hero-cta"><a class="btn" href="#work">View selected work &#8594;</a><a class="btn ghost" href="#contact">Get in touch</a></div>
${(v.location || v.email) ? `<div class="hero-meta">${v.location ? `<div><strong ${ed('profile.location')}>${v.location}</strong>Available &middot; Remote</div>` : ''}${v.email ? `<div><strong ${ed('profile.email')}>${v.email}</strong>Get in touch</div>` : ''}</div>` : ''}
</div>
<div class="portrait" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}<div class="tag"><span>Currently</span><span>Building things &#10022;</span></div></div>
</div>
${marquee}
</div>
</header>`;

	const aboutHtml = (v.bio || em)
		? `<section id="about"><div class="wrap">
<div class="section-head"><div><span class="eyebrow">About me</span><h2>A curious mind with a <em>builder's</em> heart.</h2></div><p>Craft, curiosity, and a refusal to ship anything ugly.</p></div>
<div class="about-grid">
<div class="about-visual" ${_imgUpload('profile.summary_image', em)}>${v.summary_image ? `<img src="${v.summary_image}" alt="">` : `<span class="ph">${initials(v.name)}</span>`}</div>
<div class="about-text">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}${stats.length ? `<div class="stats">${stats.join('')}</div>` : ''}</div>
</div>
</div></section>`
		: '';

	const rowsFrom = (kind: 'experience' | 'education') => {
		if (kind === 'experience') {
			return v.experience.map((exp, i) => {
				const range = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em);
				return `<div class="row"${iw}>${delBtn('experience', i)}
<div class="year">${range || ''}</div>
<div>
<h3 ${ed(`experience.${i}.role`)}>${exp.role}</h3>
<div class="org">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.location ? ` &middot; <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>
${exp.description ? `<p ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul ${led(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>
<span class="tag-sm">Role</span>
</div>`;
			}).join('\n');
		}
		return v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="row"${iw}>${delBtn('education', i)}
<div class="year">${range || ''}</div>
<div>
<h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>
<div class="org">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.grade_or_score ? ` &middot; <span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}</div>
</div>
<span class="tag-sm">Study</span>
</div>`;
		}).join('\n');
	};

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience"><div class="wrap">
<div class="section-head"><div><span class="eyebrow">Experience</span><h2>A focused <em>journey</em> so far.</h2></div><p>Roles, internships, and the long nights in between.</p></div>
<div class="timeline">${rowsFrom('experience')}</div>
${addBtn('experience', 'Experience')}
</div></section>`
		: '';

	const eduHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="wrap">
<div class="section-head"><div><span class="eyebrow">Education</span><h2>Where I <em>studied</em>.</h2></div><p>Formal study and the foundations.</p></div>
<div class="timeline">${rowsFrom('education')}</div>
${addBtn('education', 'Education')}
</div></section>`
		: '';

	const skillIcons = ['&#9671;', '&#9670;', '&#9733;', '&#9632;', '&#9679;', '&#9650;'];
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="wrap"><div class="skills-section">
<div class="section-head"><div><span class="eyebrow">What I do</span><h2>Skills across <em>design</em> &amp; <em>code</em>.</h2></div><p>I move between the brief, the design file, and the pull request.</p></div>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill"${iw}>${delBtn('skills', i)}<div class="ico">${skillIcons[i % skillIcons.length]}</div><h4 ${ed(`skills.${i}.category`)}>${g.category}</h4><div class="list" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${em ? `<div style="padding:0 40px 40px">${addBtn('skills', 'Skill Group')}</div>` : ''}
</div></div></section>`
		: '';

	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects"><div class="wrap">
<div class="section-head"><div><span class="eyebrow">Selected work</span><h2>Recent things I've <em>shipped</em>.</h2></div><p>A small, honest sample.</p></div>
<div class="work-grid">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const thumb = imgs.length ? `<div class="thumb" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>` : `<div class="thumb" ${zone}><span class="glyph">${p.title ? p.title.slice(0, 2) : '&#9671;'}</span></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">Live &#8599;</a>` : '',
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<article class="project${i === 0 ? ' featured' : ''}"${iw}>${delBtn('projects', i)}${thumb}
<div class="body">
<div class="meta-top"><span ${ed(`projects.${i}.project_category`)}>${p.project_category}</span><span>${String(i + 1).padStart(2, '0')}</span></div>
<h3 ${ed(`projects.${i}.title`)}>${p.title}</h3>
${p.description ? `<p class="desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${resp.length ? `<div class="proj-block"><div class="lbl">Responsibilities</div><ul ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${outcomes.length ? `<div class="proj-block"><div class="lbl">Outcomes</div><ul ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
${techSource.length ? `<div class="stack" ${led(p.tech_stack?.length ? `projects.${i}.tech_stack` : `projects.${i}.software_used`)}>${techSource.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}
${links ? `<div class="links">${links}</div>` : ''}
</div>
</article>`;
		}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications"><div class="wrap">
<div class="section-head"><div><span class="eyebrow">Credentials</span><h2>Certifications.</h2></div></div>
<div class="timeline">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="row"${iw}>${delBtn('certifications', i)}<div class="year">${c.year ? `<span ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}</div><div><h3 ${ed(`certifications.${i}.name`)}>${nameHtml}</h3>${c.issuer ? `<div class="org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div><span class="tag-sm">Cert</span></div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements"><div class="wrap">
<div class="section-head"><div><span class="eyebrow">Recognition</span><h2>Selected <em>highlights</em>.</h2></div></div>
<div class="timeline">
${v.achievements.map((a, i) => `<div class="row"${iw}>${delBtn('achievements', i)}<div class="year">${a.year ? `<span ${ed(`achievements.${i}.year`)}>${a.year}</span>` : ''}</div><div><h3 ${ed(`achievements.${i}.title`)}>${a.title}</h3>${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}</div><span class="tag-sm">Award</span></div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>`
		: '';

	const customHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			const csDel = (i: number) => em ? `<button class="ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>` : '';
			const csIw = ` data-item-wrap data-cs-idx="${csIdx}"`;
			const items = (cs.items ?? []).map((item, i) => `<div class="row"${csIw}>${csDel(i)}<div class="year">${item.subtitle ? `<span ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}</div><div>${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<ul ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}${item.url ? `<div class="links" style="margin-top:10px"><a href="${item.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a></div>` : ''}</div><span class="tag-sm">Item</span></div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="wrap">
<div class="section-head"><div><span class="eyebrow">More</span><h2 ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</h2></div></div>
<div class="timeline">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const contactHtml = (v.email || v.phone || v.location || socialRows(v) || em)
		? `<section id="contact"><div class="wrap">
<div class="contact">
<div class="contact-inner">
<div>
<span class="eyebrow" style="color:#a39a8e">Let's work together</span>
<h2 style="margin-top:16px">Have a role, a project, or just a <em>hello</em>?</h2>
<p>The fastest way to reach me is email &mdash; I reply within a day.</p>
${v.email ? `<a class="btn" href="mailto:${v.email}"><span ${ed('profile.email')}>${v.email}</span> &#8594;</a>` : ''}
</div>
<div class="links">
${v.email ? `<a class="link-row" href="mailto:${v.email}"><span class="lbl">Email</span><span class="val">Say hello</span></a>` : ''}
${v.phone ? `<div class="link-row"><span class="lbl">Phone</span><span class="val" ${ed('profile.phone')}>${v.phone}</span></div>` : ''}
${v.location ? `<div class="link-row"><span class="lbl">Location</span><span class="val" ${ed('profile.location')}>${v.location}</span></div>` : ''}
${socialRows(v)}
</div>
</div>
</div>
</div></section>`
		: '';

	const sectionRenderers: Record<string, string> = {
		experience: expHtml, education: eduHtml, skills: skillsHtml, projects: projectsHtml,
		certifications: certsHtml, achievements: achHtml, custom_sections: customHtml,
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
<nav><div class="wrap">
<a class="logo" href="#"><span class="dot">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span>${v.name}</a>
<div class="nav-links">${navItems}</div>
<a class="btn" href="#contact">Let's talk &#8594;</a>
</div></nav>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<footer><div class="wrap"><div>&copy; ${new Date().getFullYear()} ${v.name}. Designed &amp; built with care.</div><div>Portfolio</div></div></footer>
${edScript}
</body>
</html>`;
}
