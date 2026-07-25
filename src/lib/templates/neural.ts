/**
 * Template: Neural
 * Warm-parchment (#EDE5D2) editorial engineer portfolio with a deep-aubergine (#1F1A22) hero block,
 * amber/rust accents. Instrument Serif display + IBM Plex Sans body + IBM Plex Mono labels.
 * Rounded ink hero with radial glow + grid, serif meta stats, photo card. Editorial project cards
 * (index, big serif title, responsibilities/outcomes columns, tech chips). Skills as ruled rows
 * (category + chips, NO bars). Ruled editorial rows for experience/education/certs/awards.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['github_url', 'GitHub'], ['linkedin_url', 'LinkedIn'], ['twitter_url', 'Twitter'], ['portfolio_url', 'Site'],
	];
	return items.filter(([k]) => !!v[k]).map(([k, l]) => `<a href="${v[k]}" target="_blank" rel="noopener noreferrer">${l}</a>`).join('');
}

function css(): string {
	return `
:root{
  --paper:#EDE5D2;--paper-2:#E4DAC2;--paper-3:#F5EEDD;--ink:#1F1A22;--ink-2:#3A323F;
  --mute:#6E6470;--rule:#C9BFA8;--rule-dark:rgba(237,229,210,.18);
  --accent:#d8a24a;--accent-2:#b8502c;--maxw:1340px;--pad:clamp(20px,4vw,64px);
  --serif:"Instrument Serif","Times New Roman",serif;--sans:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace;--radius:20px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}
body{background:radial-gradient(1200px 600px at 80% -10%,rgba(255,255,255,.45),transparent 60%),radial-gradient(900px 500px at -10% 100%,rgba(31,26,34,.05),transparent 60%),var(--paper)}
::selection{background:var(--ink);color:var(--paper)}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.wrap{max-width:var(--maxw);margin:0 auto;padding-left:var(--pad);padding-right:var(--pad)}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute)}
.eyebrow::before{content:"";width:28px;height:1px;background:currentColor;opacity:.7}

.nav{position:sticky;top:0;z-index:50;background:rgba(237,229,210,.88);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:68px}
.brand{display:flex;align-items:center;gap:12px}
.brand .mark{width:30px;height:30px;border-radius:50%;background:var(--ink);position:relative;overflow:hidden;flex:none}
.brand .mark img{width:100%;height:100%;object-fit:cover}
.brand .mark::after{content:"";position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;background:var(--accent);transform:translate(-60%,-60%)}
.brand .mark.has-img::after{display:none}
.brand .name{font-family:var(--serif);font-size:24px;line-height:1}
.nav ul{display:flex;gap:28px;list-style:none;margin:0;padding:0}
.nav ul a{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2)}
.nav ul a:hover{color:var(--ink)}
.nav .cta{display:inline-flex;align-items:center;gap:8px;background:var(--ink);color:var(--paper);padding:10px 16px;border-radius:999px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase}
.nav .cta .dot{width:7px;height:7px;border-radius:50%;background:#9FE3B0}
@media(max-width:880px){.nav ul{display:none}}

.hero-shell{padding:clamp(20px,2.4vw,40px) 0 0}
.hero{background:var(--ink);color:var(--paper);border-radius:var(--radius);overflow:hidden;position:relative;padding:clamp(36px,5vw,72px)}
.hero::before{content:"";position:absolute;right:-220px;top:-220px;width:680px;height:680px;border-radius:50%;background:radial-gradient(closest-side,rgba(216,162,74,.5),transparent 70%);opacity:.55}
.hero::after{content:"";position:absolute;inset:0;background-image:linear-gradient(transparent calc(100% - 1px),rgba(237,229,210,.045) 0),linear-gradient(90deg,transparent calc(100% - 1px),rgba(237,229,210,.045) 0);background-size:64px 64px;pointer-events:none}
.hero-inner{position:relative;display:grid;grid-template-columns:1fr;gap:48px;z-index:1}
@media(min-width:980px){.hero-inner{grid-template-columns:1.4fr 1fr;gap:64px;align-items:end}}
.hero .eyebrow{color:rgba(237,229,210,.7)}
.hero h1{font-family:var(--serif);font-size:clamp(50px,9vw,128px);line-height:1;letter-spacing:-.018em;margin:18px 0 0}
.hero h1 em{font-style:italic;color:var(--accent)}
.hero .headline{margin-top:32px;font-family:var(--serif);font-size:clamp(22px,2.2vw,30px);line-height:1.3;max-width:30ch;color:rgba(237,229,210,.92)}
.hero .meta{margin-top:38px;display:grid;grid-template-columns:repeat(2,1fr);gap:20px 32px;max-width:560px}
@media(min-width:560px){.hero .meta{grid-template-columns:repeat(4,1fr)}}
.hero .meta .k{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(237,229,210,.6);display:block;margin-bottom:6px}
.hero .meta .v{font-family:var(--serif);font-size:20px;line-height:1.15}
.hero .actions{margin-top:34px;display:flex;flex-wrap:wrap;gap:10px}
.hero .actions a{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;padding:11px 16px;border-radius:999px;border:1px solid rgba(237,229,210,.3);color:var(--paper)}
.hero .actions a.primary{background:var(--accent);color:var(--ink);border-color:var(--accent)}
.hero .actions a:hover{background:var(--paper);color:var(--ink)}
.hero-card{background:rgba(237,229,210,.06);border:1px solid var(--rule-dark);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:16px}
.hero-card .photo{aspect-ratio:4/5;border-radius:12px;background:repeating-linear-gradient(135deg,rgba(237,229,210,.1) 0 10px,rgba(237,229,210,.04) 10px 20px);position:relative;overflow:hidden;border:1px solid var(--rule-dark);display:grid;place-items:center;cursor:pointer}
.hero-card .photo img{width:100%;height:100%;object-fit:cover}
.hero-card .photo .ph{font-family:var(--serif);font-size:80px;color:rgba(237,229,210,.5)}
.hero-card .row{display:flex;align-items:center;justify-content:space-between;gap:14px}
.hero-card .row .k{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:rgba(237,229,210,.6)}
.hero-card .row .v{font-family:var(--serif);font-size:19px;line-height:1.1;text-align:right}

.section{padding:clamp(56px,8vw,110px) 0}
.sec-head{display:grid;grid-template-columns:1fr;gap:18px;margin-bottom:52px}
@media(min-width:880px){.sec-head{grid-template-columns:220px 1fr;gap:48px;align-items:end}}
.sec-head h2{font-family:var(--serif);font-size:clamp(34px,5vw,64px);line-height:1;letter-spacing:-.012em;margin:0;max-width:20ch}
.sec-head h2 em{font-style:italic;color:var(--accent-2)}
.sec-head .desc{color:var(--ink-2);max-width:54ch}

.summary{padding:clamp(48px,7vw,90px) 0 0}
.summary p{font-family:var(--serif);font-size:clamp(22px,2.2vw,30px);line-height:1.35;margin:0;color:var(--ink);max-width:34ch}
.summary p+p{margin-top:16px;font-family:var(--sans);font-size:17px;line-height:1.6;color:var(--ink-2);max-width:60ch}

.projects{display:grid;gap:26px}
.project{background:var(--paper-3);border:1px solid var(--rule);border-radius:var(--radius);overflow:hidden}
.project-head{display:grid;grid-template-columns:1fr;gap:14px;padding:26px clamp(24px,3vw,40px);border-bottom:1px solid var(--rule)}
.project-head .index{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--mute);text-transform:uppercase}
.project-head h3{font-family:var(--serif);font-size:clamp(30px,4vw,48px);line-height:1.05;margin:6px 0 0;letter-spacing:-.012em}
.project-head .desc{margin-top:12px;font-size:17px;color:var(--ink-2);max-width:62ch}
.project-head .when{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--mute);text-transform:uppercase;margin-top:8px}
.project-head .links{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.project-head .links a{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:9px 14px;border-radius:999px;border:1px solid var(--rule);color:var(--ink);background:var(--paper)}
.project-head .links a:hover{background:var(--ink);color:var(--paper)}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1px;background:var(--rule);border-bottom:1px solid var(--rule)}
.shot{aspect-ratio:16/10;position:relative;overflow:hidden;background:var(--paper-2);display:grid;place-items:center;cursor:pointer}
.shot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.shot .ph{font-family:var(--serif);font-style:italic;font-size:34px;color:var(--mute)}
.project-body{display:grid;grid-template-columns:1fr}
@media(min-width:980px){.project-body{grid-template-columns:1.2fr 1fr}}
.project-col{padding:26px clamp(24px,3vw,40px)}
.project-col+.project-col{border-top:1px solid var(--rule)}
@media(min-width:980px){.project-col+.project-col{border-top:0;border-left:1px solid var(--rule)}}
.col-title{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--mute);text-transform:uppercase;margin:0 0 14px}
.bullets{margin:0;padding:0;list-style:none;display:grid;gap:12px}
.bullets li{position:relative;padding-left:22px;font-size:16px;line-height:1.55;color:var(--ink)}
.bullets li::before{content:"";position:absolute;left:0;top:.65em;width:10px;height:1px;background:var(--ink)}
.project-foot{padding:22px clamp(24px,3vw,40px);background:var(--paper-2);border-top:1px solid var(--rule)}
.project-foot h4{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--mute);text-transform:uppercase;margin:0 0 12px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chips span{font-family:var(--mono);font-size:11px;letter-spacing:.08em;padding:6px 11px;border-radius:999px;background:var(--paper);border:1px solid var(--rule);color:var(--ink)}

.rows{display:grid;grid-template-columns:1fr;gap:0;border-top:1px solid var(--rule)}
.rrow{display:grid;grid-template-columns:1fr;gap:12px;padding:26px 0;border-bottom:1px solid var(--rule);position:relative}
@media(min-width:760px){.rrow{grid-template-columns:220px 1fr;gap:36px;align-items:start}}
.rrow .cat{font-family:var(--serif);font-size:clamp(22px,2.4vw,30px);line-height:1.1}
.rrow .when{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--mute);text-transform:uppercase;margin-top:8px}
.rrow .body h3{font-family:var(--serif);font-size:clamp(22px,2.4vw,30px);line-height:1.1;margin:0}
.rrow .body .org{color:var(--mute);font-size:14px;margin-top:4px;font-family:var(--mono);letter-spacing:.04em}
.rrow .body p{color:var(--ink-2);font-size:16px;margin:12px 0 0;max-width:62ch}
.rrow .list{display:flex;flex-wrap:wrap;gap:8px}
.rrow .list span{font-family:var(--mono);font-size:11px;letter-spacing:.06em;padding:6px 11px;border-radius:999px;background:var(--paper-3);border:1px solid var(--rule);color:var(--ink)}
.rrow ul.pts{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
.rrow ul.pts li{position:relative;padding-left:22px;font-size:15.5px;color:var(--ink)}
.rrow ul.pts li::before{content:"";position:absolute;left:0;top:.65em;width:10px;height:1px;background:var(--ink)}
.rrow .grade{font-family:var(--mono);font-size:12px;color:var(--accent-2);margin-top:8px}

.contact{background:var(--ink);color:var(--paper);border-radius:var(--radius);padding:clamp(40px,6vw,80px);position:relative;overflow:hidden}
.contact::before{content:"";position:absolute;left:-160px;bottom:-160px;width:520px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgba(184,80,44,.5),transparent 70%);opacity:.5}
.contact-inner{position:relative;z-index:1}
.contact h2{font-family:var(--serif);font-size:clamp(38px,6vw,84px);line-height:1;margin:16px 0 20px}
.contact h2 em{font-style:italic;color:var(--accent)}
.contact .cmeta{display:flex;flex-wrap:wrap;gap:14px;margin-top:24px}
.contact .cmeta .cm{border:1px solid rgba(237,229,210,.3);border-radius:14px;padding:14px 18px}
.contact .cmeta .cm .k{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(237,229,210,.6);display:block;margin-bottom:5px}
.contact .cmeta .cm .v{font-family:var(--serif);font-size:19px}
.contact .actions{margin-top:28px;display:flex;flex-wrap:wrap;gap:10px}
.contact .actions a{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;padding:11px 16px;border-radius:999px;border:1px solid rgba(237,229,210,.3);color:var(--paper)}
.contact .actions a.primary{background:var(--accent);color:var(--ink);border-color:var(--accent)}
.contact .actions a:hover{background:var(--paper);color:var(--ink)}

footer{padding:36px 0 60px;color:var(--mute);font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
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
	const metas: string[] = [];
	if (v.location) metas.push(`<div><span class="k">Based in</span><span class="v" ${ed('profile.location')}>${v.location}</span></div>`);
	if (statShown(v, 'years_experience', yearsExp)) metas.push(`<div><span class="k">Experience</span><span class="v"><span ${ted('years_experience')}>${yearsExp}</span> yrs</span></div>`);
	if (statShown(v, 'projects_count', projCount)) metas.push(`<div><span class="k">Shipped</span><span class="v"><span ${ted('projects_count')}>${projCount}</span>+</span></div>`);
	if (statShown(v, 'certifications_count', certsCount)) metas.push(`<div><span class="k">Certs</span><span class="v"><span ${ted('certifications_count')}>${certsCount}</span></span></div>`);

	const heroHtml = `<div class="hero-shell"><div class="wrap"><div class="hero"><div class="hero-inner">
<div>
<span class="eyebrow">${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Portfolio'}</span>
<h1>Hi, I'm <em ${ed('profile.full_name')}>${v.name}</em></h1>
${v.bio ? `<p class="headline" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="headline" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
${metas.length ? `<div class="meta">${metas.join('')}</div>` : ''}
<div class="actions"><a class="primary" href="#projects">View work</a><a href="#contact">Get in touch</a></div>
</div>
<div class="hero-card">
<div class="photo" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
${v.email ? `<div class="row"><span class="k">Email</span><span class="v" ${ed('profile.email')}>${v.email}</span></div>` : ''}
</div>
</div></div></div></div>`;

	const aboutHtml = (v.bio || v.uniqueValue || em)
		? `<section id="about" class="summary"><div class="wrap">
<div class="sec-head"><span class="eyebrow">About</span></div>
${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : (v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : ''))}
${v.uniqueValue && v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
</div></section>`
		: '';

	let pn = 0;
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects" class="section"><div class="wrap">
<div class="sec-head"><h2>Selected <em>work</em></h2><p class="desc">A few systems I've designed, built, or scaled.</p></div>
<div class="projects">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const shots = imgs.length
				? `<div class="shots">${imgs.slice(0, 3).map((u) => `<div class="shot" ${zone}><img src="${u}" alt="${p.title}"></div>`).join('')}</div>`
				: `<div class="shots"><div class="shot" ${zone}><span class="ph">${p.title ? p.title.slice(0, 2) : '&#9671;'}</span></div></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">Live</a>` : '',
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">Source</a>` : '',
			].filter(Boolean).join('');
			const body = (resp.length || outcomes.length)
				? `<div class="project-body">
${resp.length ? `<div class="project-col"><p class="col-title">Responsibilities</p><ul class="bullets" ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${outcomes.length ? `<div class="project-col"><p class="col-title">Outcomes</p><ul class="bullets" ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
</div>` : '';
			return `<article class="project"${iw}>${delBtn('projects', i)}
<div class="project-head">
<div><div class="index">${String(++pn).padStart(2, '0')}${p.project_category ? ` &middot; <span ${ed(`projects.${i}.project_category`)}>${p.project_category}</span>` : ''}</div>
<h3 ${ed(`projects.${i}.title`)}>${p.title}</h3>
${p.description ? `<p class="desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${links ? `<div class="links">${links}</div>` : ''}</div>
</div>
${shots}
${body}
${techSource.length ? `<div class="project-foot"><h4>Stack</h4><div class="chips" ${led(p.tech_stack?.length ? `projects.${i}.tech_stack` : `projects.${i}.software_used`)}>${techSource.map((t) => `<span>${t}</span>`).join('')}</div></div>` : ''}
</article>`;
		}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</div></section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" class="section"><div class="wrap">
<div class="sec-head"><h2>Where I've <em>worked</em></h2><p class="desc">Roles, teams, and the problems I helped solve.</p></div>
<div class="rows">
${v.experience.map((exp, i) => {
			const range = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em);
			return `<div class="rrow"${iw}>${delBtn('experience', i)}
<div><div class="cat">${range || ''}</div></div>
<div class="body">
<h3 ${ed(`experience.${i}.role`)}>${exp.role}</h3>
<div class="org">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.location ? ` &middot; <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>
${exp.description ? `<p ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="pts" ${led(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>
</div>`;
		}).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>`
		: '';

	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" class="section"><div class="wrap">
<div class="sec-head"><h2>Tools &amp; <em>craft</em></h2><p class="desc">The stack I reach for, grouped by domain.</p></div>
<div class="rows">
${v.skill_groups.map((g, i) => `<div class="rrow"${iw}>${delBtn('skills', i)}<div><div class="cat" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="list" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>`
		: '';

	const eduHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="section"><div class="wrap">
<div class="sec-head"><h2>Education</h2></div>
<div class="rows">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="rrow"${iw}>${delBtn('education', i)}<div><div class="cat">${range || ''}</div></div><div class="body"><h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>${edu.institution ? `<div class="org" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}${edu.grade_or_score ? `<div class="grade" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}</div></div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" class="section"><div class="wrap">
<div class="sec-head"><h2>Certifications</h2></div>
<div class="rows">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="rrow"${iw}>${delBtn('certifications', i)}<div><div class="cat">${c.year ? `<span ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}</div></div><div class="body"><h3${!c.url ? ` ${ed(`certifications.${i}.name`)}` : ''}>${nameHtml}</h3>${c.issuer ? `<div class="org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div></div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="section"><div class="wrap">
<div class="sec-head"><h2>Recognition</h2></div>
<div class="rows">
${v.achievements.map((a, i) => `<div class="rrow"${iw}>${delBtn('achievements', i)}<div><div class="cat">${a.year ? `<span ${ed(`achievements.${i}.year`)}>${a.year}</span>` : ''}</div></div><div class="body"><h3 ${ed(`achievements.${i}.title`)}>${a.title}</h3>${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}</div></div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>`
		: '';

	const customHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			const csDel = (i: number) => em ? `<button class="ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>` : '';
			const csIw = ` data-item-wrap data-cs-idx="${csIdx}"`;
			const items = (cs.items ?? []).map((item, i) => `<div class="rrow"${csIw}>${csDel(i)}<div><div class="cat">${item.subtitle ? `<span ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}</div></div><div class="body">${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="list" style="margin-top:12px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}${item.url ? `<div style="margin-top:12px"><a href="${item.url}" target="_blank" rel="noopener noreferrer" style="font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-2)">View &#8599;</a></div>` : ''}</div></div>`).join('\n');
			return `<section id="${cs.section_id}" class="section"><div class="wrap">
<div class="sec-head"><h2>${cs.title}</h2></div>
<div class="rows">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const cmeta = [
		v.email ? `<div class="cm"><span class="k">Email</span><span class="v" ${ed('profile.email')}>${v.email}</span></div>` : '',
		v.phone ? `<div class="cm"><span class="k">Phone</span><span class="v" ${ed('profile.phone')}>${v.phone}</span></div>` : '',
		v.location ? `<div class="cm"><span class="k">Location</span><span class="v" ${ed('profile.location')}>${v.location}</span></div>` : '',
	].filter(Boolean);
	const socials = socialLinksHtml(v);
	const contactHtml = (cmeta.length || socials || em)
		? `<section id="contact" class="section"><div class="wrap"><div class="contact"><div class="contact-inner">
<span class="eyebrow" style="color:rgba(237,229,210,.7)">Contact</span>
<h2>Let's build something <em>good</em>.</h2>
${cmeta.length ? `<div class="cmeta">${cmeta.join('')}</div>` : ''}
<div class="actions">${v.email ? `<a class="primary" href="mailto:${v.email}">Send an email</a>` : ''}${socials}</div>
</div></div></div></section>`
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
<div class="nav"><div class="wrap nav-inner">
<div class="brand"><span class="mark${v.profile_image ? ' has-img' : ''}">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span><span class="name">${v.name}</span></div>
<ul>${navItems}</ul>
<a class="cta" href="#contact"><span class="dot"></span> Available</a>
</div></div>
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
<div class="wrap"><footer><span>&copy; ${new Date().getFullYear()} ${v.name}</span><span>Portfolio</span></footer></div>
${edScript}
</body>
</html>`;
}
