/**
 * Template: Monolith
 * Near-black (#080808) editorial-luxury engineer portfolio. Cream/taupe (#d4c9b0) accent on
 * off-white (#f5f5f0). Cormorant Garamond serif display + DM Sans body + DM Mono labels.
 * Split cover hero with a grayscale B&W photo + RGB double-exposure glitch ghost (published only).
 * Mono section indices, hairline rules, ruled editorial rows for experience/skills/education,
 * large numbered project blocks with tag chips (NO bars).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap';

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
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--black:#080808;--white:#f5f5f0;--grey-100:#e8e8e2;--grey-200:#c8c8c0;--grey-400:#888880;--grey-600:#444440;--grey-800:#1a1a18;--accent:#d4c9b0;--rule:rgba(255,255,255,.08);--serif:'Cormorant Garamond',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--mono:'DM Mono',monospace}
html{scroll-behavior:smooth}
body{background:var(--black);color:var(--white);font-family:var(--sans);font-weight:300;line-height:1.7;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.mono{font-family:var(--mono);font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--grey-400)}

nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:1.3rem 3rem;border-bottom:1px solid var(--rule);backdrop-filter:blur(12px);background:rgba(8,8,8,.7)}
.nav-logo{font-family:var(--serif);font-size:1.1rem;letter-spacing:.12em;text-transform:uppercase;display:flex;align-items:center;gap:.7rem}
.nav-logo .av{width:30px;height:30px;border-radius:50%;overflow:hidden;background:var(--grey-800);filter:grayscale(100%)}
.nav-logo .av img{width:100%;height:100%;object-fit:cover}
.nav-links{display:flex;gap:2.2rem;list-style:none}
.nav-links a{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--grey-200);transition:color .3s}
.nav-links a:hover{color:var(--white)}
@media(max-width:880px){.nav-links{display:none}nav{padding:1.1rem 1.5rem}}

#hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden}
.hero-image-col{position:relative;background:var(--grey-800);overflow:hidden;cursor:pointer}
.hero-photo-wrap{width:100%;height:100%;position:relative}
.hero-photo-wrap>img{width:100%;height:100%;object-fit:cover;object-position:top center;filter:grayscale(100%) contrast(1.15) brightness(.9)}
.hero-photo-wrap::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,8,8,.55) 0,transparent 60%);z-index:1;pointer-events:none}
.ghost{position:absolute;top:0;left:-14%;width:70%;height:100%;z-index:3;pointer-events:none;overflow:hidden;mix-blend-mode:screen}
.ghost img{width:100%;height:100%;object-fit:cover;object-position:top center}
.ghost-r{transform:translateX(-6px);opacity:.07}.ghost-r img{filter:grayscale(100%) sepia(1) hue-rotate(-20deg) saturate(2) blur(1px)}
.ghost-b{transform:translateX(8px) translateY(4px);opacity:.06}.ghost-b img{filter:grayscale(100%) sepia(1) hue-rotate(200deg) saturate(2) blur(1px)}
.photo-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2rem;background:linear-gradient(160deg,#1a1a18 0,#0e0e0c 100%)}
.photo-placeholder .ph-mono{font-family:var(--serif);font-size:6rem;color:var(--grey-600)}
.hero-text-col{display:flex;flex-direction:column;justify-content:center;padding:6rem 4rem}
.hero-text-col .eyebrow{margin-bottom:1.6rem}
.hero-text-col h1{font-family:var(--serif);font-weight:300;font-size:clamp(3rem,6vw,6rem);line-height:.98;letter-spacing:-.01em}
.hero-text-col h1 em{font-style:italic;color:var(--accent)}
.hero-text-col .headline{font-family:var(--serif);font-style:italic;font-size:clamp(1.2rem,1.8vw,1.7rem);color:var(--grey-200);margin-top:1.4rem;max-width:26ch}
.hero-text-col .lede{color:var(--grey-200);font-size:1rem;max-width:46ch;margin-top:1.6rem}
.hero-meta{display:flex;flex-wrap:wrap;gap:1.6rem 2.6rem;margin-top:2.2rem}
.hero-meta .k{display:block;margin-bottom:.3rem}
.hero-meta .v{font-family:var(--serif);font-size:1.4rem}
.hero-actions{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2.2rem}
.hero-actions a{font-family:var(--mono);font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;padding:.9rem 1.4rem;border:1px solid var(--rule);color:var(--white)}
.hero-actions a.primary{background:var(--accent);color:var(--black);border-color:var(--accent)}
.hero-actions a:hover{background:var(--white);color:var(--black)}
@media(max-width:880px){#hero{grid-template-columns:1fr}.hero-image-col{min-height:60vh}.hero-text-col{padding:4rem 1.5rem}}

.section{padding:clamp(4rem,9vw,8rem) 3rem;max-width:1280px;margin:0 auto}
.sec-head{display:grid;grid-template-columns:1fr;gap:1rem;margin-bottom:3.4rem;border-bottom:1px solid var(--rule);padding-bottom:1.6rem}
@media(min-width:820px){.sec-head{grid-template-columns:auto 1fr;align-items:baseline;gap:2.4rem}}
.sec-head .idx{font-family:var(--mono);font-size:.7rem;letter-spacing:.2em;color:var(--accent);text-transform:uppercase}
.sec-head h2{font-family:var(--serif);font-weight:300;font-size:clamp(2.2rem,4.4vw,3.8rem);line-height:1;letter-spacing:-.01em}
.sec-head h2 em{font-style:italic;color:var(--accent)}
@media(max-width:880px){.section{padding:4rem 1.5rem}}

.summary p{font-family:var(--serif);font-size:clamp(1.5rem,2.6vw,2.4rem);font-weight:300;line-height:1.3;color:var(--white);max-width:30ch}
.summary p+p{font-family:var(--sans);font-size:1rem;color:var(--grey-200);margin-top:1.2rem;max-width:60ch}

.rows{display:grid;grid-template-columns:1fr}
.rrow{display:grid;grid-template-columns:1fr;gap:.8rem;padding:2.2rem 0;border-bottom:1px solid var(--rule);position:relative}
@media(min-width:760px){.rrow{grid-template-columns:200px 1fr;gap:2.6rem;align-items:start}}
.rrow .cat{font-family:var(--serif);font-size:1.6rem;font-weight:300}
.rrow .when{font-family:var(--mono);font-size:.7rem;letter-spacing:.14em;color:var(--grey-400);text-transform:uppercase;margin-top:.4rem}
.rrow .body h3{font-family:var(--serif);font-size:1.7rem;font-weight:300;line-height:1.1}
.rrow .body .org{font-family:var(--mono);font-size:.72rem;letter-spacing:.1em;color:var(--grey-400);text-transform:uppercase;margin-top:.4rem}
.rrow .body p{color:var(--grey-200);font-size:1rem;margin-top:.9rem;max-width:62ch}
.rrow .list{display:flex;flex-wrap:wrap;gap:.5rem}
.rrow .list span{font-family:var(--mono);font-size:.68rem;letter-spacing:.06em;padding:.4rem .8rem;border:1px solid var(--rule);color:var(--grey-100)}
.rrow ul.pts{list-style:none;margin:.9rem 0 0;padding:0;display:grid;gap:.6rem}
.rrow ul.pts li{position:relative;padding-left:1.3rem;font-size:.95rem;color:var(--grey-200)}
.rrow ul.pts li::before{content:'';position:absolute;left:0;top:.7em;width:12px;height:1px;background:var(--accent)}
.rrow .grade{font-family:var(--mono);font-size:.72rem;color:var(--accent);margin-top:.5rem}

.projects{display:grid;gap:0}
.project{padding:3rem 0;border-bottom:1px solid var(--rule);display:grid;grid-template-columns:1fr;gap:1.8rem}
@media(min-width:900px){.project{grid-template-columns:1.1fr 1fr;gap:3rem;align-items:start}}
.project .p-media{aspect-ratio:16/11;background:var(--grey-800);overflow:hidden;position:relative;cursor:pointer}
.project .p-media img{width:100%;height:100%;object-fit:cover;filter:grayscale(60%) contrast(1.05)}
.project .p-media .ph{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--serif);font-size:3rem;color:var(--grey-600)}
.project .p-num{font-family:var(--mono);font-size:.7rem;letter-spacing:.2em;color:var(--accent);text-transform:uppercase}
.project h3{font-family:var(--serif);font-size:clamp(1.8rem,2.8vw,2.6rem);font-weight:300;line-height:1.05;margin-top:.4rem}
.project .p-desc{color:var(--grey-200);font-size:1rem;margin-top:.9rem;max-width:60ch}
.project .p-block{margin-top:1.2rem}
.project .p-block .lbl{font-family:var(--mono);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:var(--grey-400);margin-bottom:.5rem}
.project .p-block ul{list-style:none;margin:0;padding:0;display:grid;gap:.5rem}
.project .p-block ul li{position:relative;padding-left:1.3rem;font-size:.95rem;color:var(--grey-200)}
.project .p-block ul li::before{content:'';position:absolute;left:0;top:.7em;width:12px;height:1px;background:var(--accent)}
.project .chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.2rem}
.project .chips span{font-family:var(--mono);font-size:.68rem;letter-spacing:.06em;padding:.4rem .8rem;border:1px solid var(--rule);color:var(--grey-100)}
.project .p-links{display:flex;gap:1.4rem;margin-top:1.3rem;font-family:var(--mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase}
.project .p-links a{color:var(--accent)}

.contact{padding:clamp(4rem,9vw,8rem) 3rem;border-top:1px solid var(--rule);text-align:center}
.contact h2{font-family:var(--serif);font-weight:300;font-size:clamp(2.4rem,6vw,5rem);line-height:1;letter-spacing:-.01em}
.contact h2 em{font-style:italic;color:var(--accent)}
.contact .cmeta{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin-top:2rem}
.contact .cm{border:1px solid var(--rule);padding:1rem 1.4rem}
.contact .cm .k{display:block;margin-bottom:.4rem}
.contact .cm .v{font-family:var(--serif);font-size:1.2rem}
.contact .cta{display:inline-flex;margin-top:2rem;font-family:var(--mono);font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;padding:1rem 1.8rem;background:var(--accent);color:var(--black)}
.contact .socials{display:flex;justify-content:center;gap:1.4rem;margin-top:1.8rem;font-family:var(--mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase}
.contact .socials a{color:var(--grey-200)}
.contact .socials a:hover{color:var(--white)}

footer{padding:2.4rem 3rem;border-top:1px solid var(--rule);display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;font-family:var(--mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--grey-400)}
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

	let sn = 0;
	const idx = () => 'N&deg; ' + String(++sn).padStart(2, '0');

	const yearsExp = v.template_overrides?.years_experience ?? 0;
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certsCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const metas: string[] = [];
	if (v.location) metas.push(`<div><span class="k mono">Based</span><span class="v" ${ed('profile.location')}>${v.location}</span></div>`);
	if (statShown(v, 'years_experience', yearsExp)) metas.push(`<div><span class="k mono">Experience</span><span class="v"><span ${ted('years_experience')}>${yearsExp}</span> yrs</span></div>`);
	if (statShown(v, 'projects_count', projCount)) metas.push(`<div><span class="k mono">Shipped</span><span class="v"><span ${ted('projects_count')}>${projCount}</span>+</span></div>`);
	if (statShown(v, 'certifications_count', certsCount)) metas.push(`<div><span class="k mono">Certs</span><span class="v"><span ${ted('certifications_count')}>${certsCount}</span></span></div>`);

	const photo = v.profile_image
		? `<div class="hero-photo-wrap"><img src="${v.profile_image}" alt="${v.name}">${em ? '' : `<div class="ghost ghost-r"><img src="${v.profile_image}" alt=""></div><div class="ghost ghost-b"><img src="${v.profile_image}" alt=""></div>`}</div>`
		: `<div class="photo-placeholder"><span class="ph-mono">${initials(v.name)}</span><span class="mono">Add a photo</span></div>`;

	const heroHtml = `<section id="hero">
<div class="hero-image-col" ${_imgUpload('profile.profile_image', em)}>${photo}</div>
<div class="hero-text-col">
<span class="eyebrow mono">${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Portfolio'}</span>
<h1 ${ed('profile.full_name')}>${(() => { const parts = v.name.split(' '); return parts.length > 1 ? `${parts.slice(0, -1).join(' ')} <em>${parts.slice(-1)}</em>` : `<em>${v.name}</em>`; })()}</h1>
${v.bio ? `<p class="lede" ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p class="lede" ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
${metas.length ? `<div class="hero-meta">${metas.join('')}</div>` : ''}
<div class="hero-actions"><a class="primary" href="#projects">View work</a><a href="#contact">Contact</a></div>
</div>
</section>`;
	// note: full_name editable lives on the last-name span above; ensure name always editable even single-word (handled).

	const aboutHtml = (v.bio || v.uniqueValue || em)
		? `<section id="about" class="section summary">
<div class="sec-head"><span class="idx">${idx()}</span><h2>About</h2></div>
${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : (v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : ''))}
${v.uniqueValue && v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
</section>`
		: '';

	let pn = 0;
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects" class="section">
<div class="sec-head"><span class="idx">${idx()}</span><h2>Selected <em>work</em></h2></div>
<div class="projects">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const media = imgs.length ? `<div class="p-media" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>` : `<div class="p-media" ${zone}><span class="ph">${p.title ? p.title.slice(0, 2) : '&#9671;'}</span></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">Live &#8599;</a>` : '',
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">Source &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<article class="project"${iw}>${delBtn('projects', i)}
${media}
<div class="p-text">
<div class="p-num">${String(++pn).padStart(2, '0')}${p.project_category ? ` &middot; <span ${ed(`projects.${i}.project_category`)}>${p.project_category}</span>` : ''}</div>
<h3 ${ed(`projects.${i}.title`)}>${p.title}</h3>
${p.description ? `<p class="p-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${resp.length ? `<div class="p-block"><div class="lbl">Responsibilities</div><ul ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${outcomes.length ? `<div class="p-block"><div class="lbl">Outcomes</div><ul ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
${techSource.length ? `<div class="chips" ${led(p.tech_stack?.length ? `projects.${i}.tech_stack` : `projects.${i}.software_used`)}>${techSource.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}
${links ? `<div class="p-links">${links}</div>` : ''}
</div>
</article>`;
		}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>`
		: '';

	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" class="section">
<div class="sec-head"><span class="idx">${idx()}</span><h2>Experience</h2></div>
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
</section>`
		: '';

	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" class="section">
<div class="sec-head"><span class="idx">${idx()}</span><h2>Skills</h2></div>
<div class="rows">
${v.skill_groups.map((g, i) => `<div class="rrow"${iw}>${delBtn('skills', i)}<div><div class="cat" ${ed(`skills.${i}.category`)}>${g.category}</div></div><div class="list" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span>${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>`
		: '';

	const eduHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="section">
<div class="sec-head"><span class="idx">${idx()}</span><h2>Education</h2></div>
<div class="rows">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
			return `<div class="rrow"${iw}>${delBtn('education', i)}<div><div class="cat">${range || ''}</div></div><div class="body"><h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>${edu.institution ? `<div class="org" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}${edu.grade_or_score ? `<div class="grade" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}</div></div>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>`
		: '';

	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" class="section">
<div class="sec-head"><span class="idx">${idx()}</span><h2>Certifications</h2></div>
<div class="rows">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="rrow"${iw}>${delBtn('certifications', i)}<div><div class="cat">${c.year ? `<span ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}</div></div><div class="body"><h3${!c.url ? ` ${ed(`certifications.${i}.name`)}` : ''}>${nameHtml}</h3>${c.issuer ? `<div class="org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}</div></div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>`
		: '';

	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="section">
<div class="sec-head"><span class="idx">${idx()}</span><h2>Recognition</h2></div>
<div class="rows">
${v.achievements.map((a, i) => `<div class="rrow"${iw}>${delBtn('achievements', i)}<div><div class="cat">${a.year ? `<span ${ed(`achievements.${i}.year`)}>${a.year}</span>` : ''}</div></div><div class="body"><h3 ${ed(`achievements.${i}.title`)}>${a.title}</h3>${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}</div></div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>`
		: '';

	const customHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			const csDel = (i: number) => em ? `<button class="ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>` : '';
			const csIw = ` data-item-wrap data-cs-idx="${csIdx}"`;
			const items = (cs.items ?? []).map((item, i) => `<div class="rrow"${csIw}>${csDel(i)}<div><div class="cat">${item.subtitle ? `<span ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}</div></div><div class="body">${item.label ? `<h3 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h3>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="list" style="margin-top:.9rem" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}${item.url ? `<div style="margin-top:.9rem"><a href="${item.url}" target="_blank" rel="noopener noreferrer" class="mono" style="color:var(--accent)">View &#8599;</a></div>` : ''}</div></div>`).join('\n');
			return `<section id="${cs.section_id}" class="section">
<div class="sec-head"><span class="idx">${idx()}</span><h2>${cs.title}</h2></div>
<div class="rows">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	const cmeta = [
		v.email ? `<div class="cm"><span class="k mono">Email</span><span class="v" ${ed('profile.email')}>${v.email}</span></div>` : '',
		v.phone ? `<div class="cm"><span class="k mono">Phone</span><span class="v" ${ed('profile.phone')}>${v.phone}</span></div>` : '',
		v.location ? `<div class="cm"><span class="k mono">Location</span><span class="v" ${ed('profile.location')}>${v.location}</span></div>` : '',
	].filter(Boolean);
	const socials = socialLinksHtml(v);
	const contactHtml = (cmeta.length || socials || em)
		? `<section id="contact" class="contact">
<span class="mono">Contact</span>
<h2>Let's build something <em>lasting</em>.</h2>
${cmeta.length ? `<div class="cmeta">${cmeta.join('')}</div>` : ''}
${v.email ? `<a class="cta" href="mailto:${v.email}">Send an email</a>` : ''}
${socials ? `<div class="socials">${socials}</div>` : ''}
</section>`
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
<a href="#" class="nav-logo"><span class="av">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span>${v.name}</a>
<ul class="nav-links">${navItems}</ul>
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
