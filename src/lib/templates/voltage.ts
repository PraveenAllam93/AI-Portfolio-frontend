/**
 * Template: Voltage
 * Dark (#0b0b0d) editorial-engineer portfolio. Electric-lime (#e8ff5a) + burnt-orange (#ff6a3d)
 * gradient accents. Fraunces serif display + Inter sans + JetBrains Mono labels.
 * Ambient radial-gradient glow + SVG fractal-noise overlay. Floating pill nav.
 * Numbered section heads, drop-cap about, 4-col skill grid, featured project grid,
 * hover-indent timeline, glowing contact card. Scroll reveal (published only).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['twitter_url', 'Twitter'],
		['linkedin_url', 'LinkedIn'],
		['github_url', 'GitHub'],
		['portfolio_url', 'Portfolio'],
	];
	return items
		.filter(([key]) => !!v[key])
		.map(([key, label]) => `<a href="${v[key]}" target="_blank" rel="noopener noreferrer">&#8599; ${label}</a>`)
		.join('');
}

function css(): string {
	return `
:root{
  --bg:#0b0b0d;--bg-2:#111114;--surface:#15151a;
  --line:rgba(255,255,255,0.08);--line-2:rgba(255,255,255,0.14);
  --text:#f5f3ef;--muted:#9a978f;--dim:#6b6864;
  --accent:#e8ff5a;--accent-2:#ff6a3d;
  --grad:linear-gradient(135deg,#e8ff5a 0%,#9bff8c 35%,#ff6a3d 100%);
  --serif:'Fraunces',ui-serif,Georgia,serif;
  --sans:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  --radius:18px;--maxw:1240px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
html{scroll-behavior:smooth}
body{overflow-x:hidden;line-height:1.55;font-weight:400;font-size:16px}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
::selection{background:var(--accent);color:#000}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(900px 600px at 85% -10%,rgba(232,255,90,0.10),transparent 60%),radial-gradient(700px 500px at -10% 30%,rgba(255,106,61,0.08),transparent 60%),radial-gradient(600px 400px at 50% 110%,rgba(155,255,140,0.06),transparent 60%)}
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
.wrap{position:relative;z-index:1;max-width:var(--maxw);margin:0 auto;padding:0 28px}

nav.top{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:50;width:min(960px,calc(100% - 32px));display:flex;align-items:center;justify-content:space-between;padding:10px 14px 10px 20px;background:rgba(15,15,18,0.65);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);border:1px solid var(--line);border-radius:999px}
.logo{display:flex;align-items:center;gap:10px;font-family:var(--serif);font-weight:600;font-size:18px;letter-spacing:-.01em}
.logo .dot{width:10px;height:10px;border-radius:50%;background:var(--grad);box-shadow:0 0 14px rgba(232,255,90,.6);overflow:hidden}
.logo .dot img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.nav-links{display:flex;gap:6px}
.nav-links a{font-size:13.5px;color:var(--muted);padding:8px 14px;border-radius:999px;transition:all .25s ease}
.nav-links a:hover{color:var(--text);background:rgba(255,255,255,0.06)}
.nav-cta{display:inline-flex;align-items:center;gap:8px;background:var(--text);color:#0a0a0a;font-size:13px;font-weight:600;padding:9px 16px;border-radius:999px;transition:transform .2s ease}
.nav-cta:hover{transform:translateY(-1px)}
@media(max-width:720px){.nav-links{display:none}}

header.hero{padding:170px 0 90px;position:relative}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;padding:7px 14px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,0.02)}
.eyebrow .pulse{width:7px;height:7px;border-radius:50%;background:#9bff8c;box-shadow:0 0 0 0 rgba(155,255,140,.7);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(155,255,140,.7)}70%{box-shadow:0 0 0 12px rgba(155,255,140,0)}100%{box-shadow:0 0 0 0 rgba(155,255,140,0)}}
h1.display{font-family:var(--serif);font-weight:400;letter-spacing:-0.035em;font-size:clamp(48px,8vw,112px);line-height:0.98;margin:26px 0 0}
h1.display em{font-style:italic;font-weight:300;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:60px;align-items:end;margin-top:48px}
.lede{color:var(--muted);font-size:18px;max-width:520px;line-height:1.6}
.lede strong{color:var(--text);font-weight:500}
.hero-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:36px}
.meta{border-top:1px solid var(--line);padding-top:14px}
.meta .k{font-family:var(--mono);font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.1em}
.meta .v{font-family:var(--serif);font-size:22px;margin-top:6px}
@media(max-width:860px){.hero-grid{grid-template-columns:1fr;gap:32px}.hero-meta{grid-template-columns:repeat(2,1fr)}}

section{padding:100px 0;position:relative}
.section-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:56px;border-bottom:1px solid var(--line);padding-bottom:24px}
.section-num{font-family:var(--mono);font-size:12px;color:var(--dim);letter-spacing:.15em}
.section-title{font-family:var(--serif);font-weight:400;font-size:clamp(34px,5vw,58px);letter-spacing:-0.025em;line-height:1;margin:8px 0 0}
.section-title em{font-style:italic;color:var(--accent)}
.section-aside{color:var(--muted);font-size:14px;max-width:340px;text-align:right}
@media(max-width:720px){.section-head{flex-direction:column;align-items:flex-start}.section-aside{text-align:left}}

.about-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:60px;align-items:start}
.about p{font-size:18px;color:#d8d4cc;line-height:1.75;margin:0 0 22px}
.about p:first-child::first-letter{font-family:var(--serif);font-size:62px;float:left;line-height:.9;padding:6px 12px 0 0;color:var(--accent)}
.portrait{aspect-ratio:4/5;border-radius:var(--radius);background:radial-gradient(circle at 30% 30%,rgba(232,255,90,.25),transparent 55%),radial-gradient(circle at 70% 80%,rgba(255,106,61,.25),transparent 60%),linear-gradient(135deg,#1a1a20,#0e0e12);border:1px solid var(--line);position:relative;overflow:hidden;display:grid;place-items:center;cursor:pointer}
.portrait img{width:100%;height:100%;object-fit:cover}
.portrait .ph{font-family:var(--serif);font-style:italic;font-size:120px;color:rgba(255,255,255,.10);font-weight:300}
@media(max-width:860px){.about-grid{grid-template-columns:1fr}}

.skills{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.skill{background:var(--bg-2);padding:30px 26px;transition:background .3s ease;position:relative}
.skill:hover{background:#1a1a20}
.skill .icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(232,255,90,.08);color:var(--accent);margin-bottom:18px;border:1px solid rgba(232,255,90,.15);font-family:var(--mono);font-size:15px}
.skill h3{font-family:var(--serif);font-weight:500;font-size:20px;margin:0 0 12px;letter-spacing:-.01em}
.tags{display:flex;flex-wrap:wrap;gap:6px}
.tag{font-family:var(--mono);font-size:10.5px;color:var(--muted);padding:4px 9px;border:1px solid var(--line);border-radius:999px;letter-spacing:.04em}
@media(max-width:980px){.skills{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.skills{grid-template-columns:1fr}}

.timeline{position:relative}
.item{display:grid;grid-template-columns:180px 1fr;gap:40px;padding:32px 0;border-top:1px solid var(--line);transition:padding .3s ease;position:relative}
.item:last-child{border-bottom:1px solid var(--line)}
.item:hover{padding-left:14px}
.item .when{font-family:var(--mono);font-size:12px;color:var(--dim);letter-spacing:.08em;padding-top:6px}
.item h4{font-family:var(--serif);font-weight:500;font-size:24px;margin:0;letter-spacing:-.015em}
.item h4 .at{color:var(--muted);font-style:italic;font-weight:400}
.item .role{font-size:13px;color:var(--accent);font-family:var(--mono);margin:8px 0 12px;letter-spacing:.04em;text-transform:uppercase}
.item p{color:var(--muted);font-size:15.5px;line-height:1.7;margin:0;max-width:680px}
.item ul.pts{margin:14px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:8px}
.item ul.pts li{font-family:var(--mono);font-size:11px;color:var(--muted);padding:4px 10px;border:1px solid var(--line);border-radius:999px}
.item .grade{font-family:var(--mono);font-size:12px;color:var(--dim);margin-top:8px}
@media(max-width:720px){.item{grid-template-columns:1fr;gap:8px}}

.projects{display:grid;grid-template-columns:repeat(6,1fr);gap:20px}
.project{grid-column:span 3;background:var(--bg-2);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;position:relative;transition:transform .4s ease,border-color .3s ease;display:flex;flex-direction:column}
.project:hover{transform:translateY(-4px);border-color:var(--line-2)}
.project.featured{grid-column:span 6}
.project .thumb{aspect-ratio:16/10;position:relative;overflow:hidden;background:linear-gradient(135deg,#1a1a22,#0d0d12);border-bottom:1px solid var(--line);display:grid;place-items:center;cursor:pointer}
.project.featured .thumb{aspect-ratio:21/9}
.project .thumb::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,rgba(232,255,90,.25),transparent 55%),radial-gradient(circle at 75% 70%,rgba(255,106,61,.25),transparent 60%)}
.project .thumb .glyph{position:relative;font-family:var(--serif);font-style:italic;font-size:40px;color:rgba(255,255,255,.85);letter-spacing:-.02em}
.project .thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.project .body{padding:24px 26px 26px;display:flex;flex-direction:column;gap:12px;flex:1}
.project .meta-row{display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:11px;color:var(--dim);letter-spacing:.08em;text-transform:uppercase}
.project .meta-row .cat{color:var(--accent)}
.project h3{font-family:var(--serif);font-weight:500;font-size:24px;margin:0;letter-spacing:-.015em;line-height:1.15}
.project p.desc{color:var(--muted);font-size:14.5px;line-height:1.65;margin:0}
.proj-block{margin-top:2px}
.proj-block .lbl{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--dim);margin-bottom:6px}
.proj-block ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.proj-block ul li{font-size:13.5px;color:var(--muted);padding-left:14px;position:relative}
.proj-block ul li::before{content:'›';position:absolute;left:0;color:var(--accent)}
.project .links{display:flex;gap:16px;border-top:1px solid var(--line);padding-top:14px;margin-top:auto}
.project .links a{color:var(--text);font-size:13px;font-weight:500}
.project .links a:hover{color:var(--accent)}
@media(max-width:860px){.project,.project.featured{grid-column:span 6}}

.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.mini{background:var(--bg-2);border:1px solid var(--line);border-radius:var(--radius);padding:26px;transition:border-color .3s ease}
.mini:hover{border-color:var(--line-2)}
.mini h4{font-family:var(--serif);font-weight:500;font-size:20px;margin:0 0 8px}
.mini h4 a{color:inherit}
.mini h4 a:hover{color:var(--accent)}
.mini .sub{font-family:var(--mono);font-size:12px;color:var(--accent);margin:0 0 6px;letter-spacing:.04em}
.mini .yr{font-family:var(--mono);font-size:11px;color:var(--dim);letter-spacing:.08em}
.mini p{color:var(--muted);font-size:14px;line-height:1.65;margin:8px 0 0}

.ach-list{display:flex;flex-direction:column}
.ach{display:grid;grid-template-columns:120px 1fr;gap:32px;padding:26px 0;border-top:1px solid var(--line)}
.ach:last-child{border-bottom:1px solid var(--line)}
.ach .yr{font-family:var(--mono);font-size:12px;color:var(--accent);padding-top:4px}
.ach h4{font-family:var(--serif);font-weight:500;font-size:20px;margin:0}
.ach p{color:var(--muted);font-size:14.5px;line-height:1.7;margin:8px 0 0}
@media(max-width:720px){.ach{grid-template-columns:1fr;gap:6px}}

.contact-card{border-radius:28px;padding:70px 54px;position:relative;overflow:hidden;background:radial-gradient(700px 400px at 80% 20%,rgba(232,255,90,.18),transparent 60%),radial-gradient(500px 360px at 10% 90%,rgba(255,106,61,.16),transparent 60%),linear-gradient(180deg,#13131a,#0c0c10);border:1px solid var(--line-2)}
.contact-card h2{font-family:var(--serif);font-weight:400;font-size:clamp(34px,5vw,68px);letter-spacing:-.03em;line-height:1;margin:0 0 26px;max-width:780px}
.contact-card h2 em{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.contact-rows{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:8px}
.contact-rows .cr{display:inline-flex;flex-direction:column;gap:4px;border:1px solid var(--line-2);border-radius:14px;padding:14px 18px;min-width:160px}
.contact-rows .cr .k{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--dim)}
.contact-rows .cr .v{font-size:15px;color:var(--text)}
.email-btn{display:inline-flex;align-items:center;gap:14px;background:var(--accent);color:#0a0a0a;padding:16px 26px;border-radius:999px;font-weight:600;font-size:15px;margin-top:26px;transition:transform .2s ease,box-shadow .3s ease;box-shadow:0 10px 40px -10px rgba(232,255,90,.6)}
.email-btn:hover{transform:translateY(-2px);box-shadow:0 20px 50px -10px rgba(232,255,90,.8)}
.socials{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap}
.socials a{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid var(--line-2);border-radius:999px;font-size:13px;color:var(--muted);transition:all .25s ease}
.socials a:hover{color:var(--text);border-color:var(--text);background:rgba(255,255,255,.04)}

footer{padding:40px 0 60px;border-top:1px solid var(--line);margin-top:70px;display:flex;justify-content:space-between;color:var(--dim);font-family:var(--mono);font-size:12px;letter-spacing:.05em}
@media(max-width:560px){footer{flex-direction:column;gap:12px}}

.reveal{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s ease}
.reveal.in{opacity:1;transform:none}
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
		experience: 'Work', skills: 'Skills', projects: 'Projects',
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
	const navItems = navAnchors.map(([a, l]) => `<a href="#${a}">${l}</a>`).join('');

	let n = 0;
	const num = () => String(++n).padStart(2, '0');

	// stats
	const yearsExp = v.template_overrides?.years_experience ?? 0;
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const metas: string[] = [];
	if (v.location) metas.push(`<div class="meta"><div class="k">Based in</div><div class="v" ${ed('profile.location')}>${v.location}</div></div>`);
	if (statShown(v, 'years_experience', yearsExp)) metas.push(`<div class="meta"><div class="k">Experience</div><div class="v"><span ${ted('years_experience')}>${yearsExp || '&mdash;'}</span></div></div>`);
	if (statShown(v, 'projects_count', projCount)) metas.push(`<div class="meta"><div class="k">Shipped</div><div class="v"><span ${ted('projects_count')}>${projCount}</span>+</div></div>`);

	const heroHtml = `<header class="hero${rev}">
<span class="eyebrow"><span class="pulse"></span> ${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Available for work'}</span>
<h1 class="display">Hi, I'm <em ${ed('profile.full_name')}>${v.name}</em></h1>
<div class="hero-grid">
${v.bio ? `<p class="lede" ${ed('portfolio.bio', true)}>${v.bio}</p>` : `<p class="lede">${em ? '<span data-path="portfolio.bio" contenteditable="true">Add a short introduction.</span>' : ''}</p>`}
${metas.length ? `<div class="hero-meta">${metas.join('')}</div>` : ''}
</div>
</header>`;

	// About
	const aboutHtml = (v.bio || em)
		? `<section id="about" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; About</div><h2 class="section-title">A short <em>introduction</em></h2></div><p class="section-aside">${v.headline ? v.headline : 'Who I am and how I work.'}</p></div>
<div class="about-grid">
<div class="about">${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add your bio.</p>` : '')}${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}</div>
<div class="portrait" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<span class="ph">${initials(v.name)}</span>`}</div>
</div>
</section>`
		: '';

	// Skills
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; Skills</div><h2 class="section-title">What I do <em>well</em></h2></div><p class="section-aside">A focused toolkit, sharpened over years of shipping.</p></div>
<div class="skills">
${v.skill_groups.map((g, i) => `<div class="skill"${iw}>${delBtn('skills', i)}<div class="icon">${String(i + 1).padStart(2, '0')}</div><h3 ${ed(`skills.${i}.category`)}>${g.category}</h3><div class="tags" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span class="tag">${s}</span>`).join('')}</div></div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>`
		: '';

	// Projects
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; Projects</div><h2 class="section-title">Selected <em>projects</em></h2></div><p class="section-aside">A handful of recent things I'm proud of.</p></div>
<div class="projects">
${v.projects.map((p, i) => {
			const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
			const imgs = p.images ?? [];
			const zone = _imgUpload(`projects.${i}.images`, em, 'Upload image');
			const thumb = imgs.length
				? `<div class="thumb" ${zone}><img src="${imgs[0]}" alt="${p.title}"></div>`
				: `<div class="thumb" ${zone}><span class="glyph">${p.title ? p.title.slice(0, 2) : '&#9671;'}</span></div>`;
			const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const links = [
				p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '',
				p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<article class="project${i === 0 ? ' featured' : ''}"${iw}>${delBtn('projects', i)}${thumb}
<div class="body">
<div class="meta-row"><span class="cat" ${ed(`projects.${i}.project_category`)}>${p.project_category || 'Project'}</span></div>
<h3 ${ed(`projects.${i}.title`)}>${p.title}</h3>
${p.description ? `<p class="desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${resp.length ? `<div class="proj-block"><div class="lbl">Responsibilities</div><ul ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
${outcomes.length ? `<div class="proj-block"><div class="lbl">Outcomes</div><ul ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''}
${techSource.length ? `<div class="tags" ${led(p.tech_stack?.length ? `projects.${i}.tech_stack` : `projects.${i}.software_used`)}>${techSource.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
${links ? `<div class="links">${links}</div>` : ''}
</div>
</article>`;
		}).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>`
		: '';

	// Experience
	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; Experience</div><h2 class="section-title">Selected <em>work</em></h2></div><p class="section-aside">Teams, products, and the occasional all-nighter.</p></div>
<div class="timeline">
${v.experience.map((exp, i) => {
			const range = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em);
			return `<article class="item"${iw}>${delBtn('experience', i)}
<div class="when">${range || ''}</div>
<div>
<h4><span ${ed(`experience.${i}.role`)}>${exp.role}</span>${exp.company ? ` <span class="at" ${ed(`experience.${i}.company`)}>/ ${exp.company}</span>` : ''}</h4>
${exp.location ? `<div class="role" ${ed(`experience.${i}.location`)}>${exp.location}</div>` : ''}
${exp.description ? `<p ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="pts" ${led(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>
</article>`;
		}).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>`
		: '';

	// Education
	const eduHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; Education</div><h2 class="section-title">Where I <em>studied</em></h2></div><p class="section-aside">Formal training, plus a great deal of self-teaching.</p></div>
<div class="timeline">
${v.education.map((edu, i) => {
			const range = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `<article class="item"${iw}>${delBtn('education', i)}
<div class="when">${range || ''}</div>
<div>
<h4>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h4>
${edu.institution ? `<div class="role" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
${edu.grade_or_score ? `<div class="grade" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>
</article>`;
		}).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>`
		: '';

	// Certifications
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; Certifications</div><h2 class="section-title">Certified <em>&amp; credentialed</em></h2></div><p class="section-aside">Formal credentials worth mentioning.</p></div>
<div class="cards-grid">
${v.certifications.map((c, i) => {
			const nameHtml = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
			return `<div class="mini"${iw}>${delBtn('certifications', i)}<h4${!c.url ? ` ${ed(`certifications.${i}.name`)}` : ''}>${nameHtml}</h4>${c.issuer ? `<p class="sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</p>` : ''}${c.year ? `<span class="yr" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}</div>`;
		}).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>`
		: '';

	// Achievements
	const achHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; Achievements</div><h2 class="section-title">Notable <em>highlights</em></h2></div><p class="section-aside">Moments I'm proud of.</p></div>
<div class="ach-list">
${v.achievements.map((a, i) => `<div class="ach"${iw}>${delBtn('achievements', i)}<div class="yr" ${ed(`achievements.${i}.year`)}>${a.year || ''}</div><div><h4 ${ed(`achievements.${i}.title`)}>${a.title}</h4>${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}</div></div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>`
		: '';

	// Custom sections
	const customHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			const csDel = (i: number) => em ? `<button class="ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>` : '';
			const csIw = ` data-item-wrap data-cs-idx="${csIdx}"`;
			const items = (cs.items ?? []).map((item, i) => `<div class="mini"${csIw}>${csDel(i)}${item.label ? `<h4 ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</h4>` : ''}${item.subtitle ? `<p class="sub" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</p>` : ''}${item.value ? `<p ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="tags" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}${item.url ? `<p style="margin-top:10px"><a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);font-family:var(--mono);font-size:12px">View &#8599;</a></p>` : ''}</div>`).join('\n');
			return `<section id="${cs.section_id}" class="${rev.trim()}">
<div class="section-head"><div><div class="section-num">${num()} &mdash; ${cs.title}</div><h2 class="section-title">${cs.title}</h2></div></div>
<div class="cards-grid">${items}</div>
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	// Contact
	const infoRows = [
		v.email ? `<div class="cr"><span class="k">Email</span><span class="v" ${ed('profile.email')}>${v.email}</span></div>` : '',
		v.phone ? `<div class="cr"><span class="k">Phone</span><span class="v" ${ed('profile.phone')}>${v.phone}</span></div>` : '',
		v.location ? `<div class="cr"><span class="k">Location</span><span class="v" ${ed('profile.location')}>${v.location}</span></div>` : '',
	].filter(Boolean);
	const socialHtml = socialLinksHtml(v);
	const contactHtml = (infoRows.length || socialHtml || em)
		? `<section id="contact" class="${rev.trim()}">
<div class="contact-card">
<div class="section-num" style="margin-bottom:16px">${num()} &mdash; Contact</div>
<h2>Have something <em>good</em> in mind?</h2>
${infoRows.length ? `<div class="contact-rows">${infoRows.join('')}</div>` : ''}
${v.email ? `<a class="email-btn" href="mailto:${v.email}"><span ${_editable('profile.email')}>${v.email}</span> <span>&#8599;</span></a>` : ''}
${socialHtml ? `<div class="socials">${socialHtml}</div>` : ''}
</div>
<footer><span>&copy; ${new Date().getFullYear()} ${v.name}</span><span>Portfolio</span></footer>
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
<nav class="top">
<a href="#" class="logo"><span class="dot">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : ''}</span> ${v.name}</a>
<div class="nav-links">${navItems}</div>
<a class="nav-cta" href="#contact">Let's talk &#8594;</a>
</nav>
<div class="wrap">
${heroHtml}
<main>
${aboutHtml}
${orderedContent}
${contactHtml}
</main>
</div>
${em ? '' : `<script>
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
</script>`}
${edScript}
</body>
</html>`;
}
