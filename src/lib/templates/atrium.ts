/**
 * Template: Atrium
 * HR theme — a "personnel file" layout on parchment with deep forest-ink bands,
 * sage and brass accents. Fraunces display, Inter body, IBM Plex Mono labels; a
 * fixed vertical folder-tab side navigation, a fine dot-grid paper texture, a
 * tilted ID-badge hero card with a brass tab, bordered stat cells and numbered
 * "file" record cards.
 * Palette: ink #0B2621, ink-soft #16332C, parchment #F6F1E7, parchment-deep
 * #EFE7D6, sage #7C9A82, sage-deep #597C63, brass #C89B5C, brass-light #E3C48C.
 * Fonts: Fraunces (display serif) · Inter (body) · IBM Plex Mono (labels).
 * Signature: vertical writing-mode tab nav with active brass rule, dot-grid
 * overlay, radial hero glow, rotated ID card, scroll reveals, dark award cards.
 *
 * Ported from templates_add/hr-portfolio-06.html. The eleven themed people-work
 * sections collapse to one `hr_programs` list (Z15); the language proficiency
 * bars, save bar, reset link and crop modal are dropped (Z15/Z16).
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,450;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

function initials(name: string): string {
	const p = name.trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1]?.[0] ?? '' : '')).toUpperCase() || '••';
}

function yearsExperience(experience: NormalizedData['experience']): number {
	if (!experience?.length) return 0;
	let earliest = new Date().getFullYear();
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/\b(19|20)\d{2}\b/);
		if (m) {
			const y = parseInt(m[0], 10);
			if (y < earliest) earliest = y;
		}
	}
	return Math.max(0, new Date().getFullYear() - earliest);
}

function css(): string {
	return `
:root{
  --ink:#0B2621; --ink-soft:#16332C; --parchment:#F6F1E7; --parchment-deep:#EFE7D6;
  --sage:#7C9A82; --sage-deep:#597C63; --brass:#C89B5C; --brass-light:#E3C48C;
  --text:#1C2B27; --text-soft:#4B5D57;
  --line:rgba(11,38,33,0.14); --line-light:rgba(246,241,231,0.18); --white:#FFFDF8;
  --radius:14px; --radius-sm:8px;
  --shadow:0 20px 50px -20px rgba(11,38,33,0.35);
  --shadow-sm:0 8px 24px -12px rgba(11,38,33,0.25);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;margin-left:64px;background:var(--parchment);color:var(--text);font-family:'Inter',sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
body::before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.5;background-image:radial-gradient(rgba(11,38,33,0.045) 1px, transparent 1px);background-size:3px 3px;z-index:1;}
h1,h2,h3,h4{font-family:'Fraunces',serif;margin:0;color:var(--ink);letter-spacing:-0.01em;}
p{margin:0;}
a{color:inherit;text-decoration:none;}
ul{margin:0;padding:0;list-style:none;}
img{max-width:100%;display:block;}
::selection{background:var(--brass-light);}

.eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--sage-deep);display:flex;align-items:center;gap:10px;}
.eyebrow::before{content:"";width:22px;height:1px;background:var(--brass);display:inline-block;flex:none;}
.wrap{max-width:1180px;margin:0 auto;padding:0 40px;position:relative;z-index:2;}

/* FOLDER-TAB SIDE NAV */
#tabnav{position:fixed;left:0;top:0;height:100vh;width:64px;background:var(--ink);z-index:50;display:flex;flex-direction:column;align-items:center;padding:26px 0;gap:2px;overflow-y:auto;scrollbar-width:none;}
#tabnav::-webkit-scrollbar{display:none;}
#tabnav .brandmark{width:34px;height:34px;border-radius:50%;background:var(--brass);color:var(--ink);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:700;font-size:16px;margin-bottom:22px;flex-shrink:0;}
#tabnav a{writing-mode:vertical-rl;transform:rotate(180deg);color:rgba(246,241,231,0.45);font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;padding:10px 0;border-left:2px solid transparent;transition:.2s;white-space:nowrap;}
#tabnav a:hover,#tabnav a.active{color:var(--brass-light);border-left-color:var(--brass);}
#mobilebar{display:none;position:sticky;top:0;z-index:50;background:var(--ink);color:var(--parchment);padding:14px 20px;align-items:center;justify-content:space-between;gap:12px;}
#mobilebar select{background:var(--ink-soft);color:var(--parchment);border:1px solid var(--line-light);border-radius:8px;padding:8px 10px;font-family:'IBM Plex Mono',monospace;font-size:11px;max-width:60%;}

/* HERO */
#hero{background:var(--ink);color:var(--parchment);position:relative;overflow:hidden;padding:90px 0 70px;}
#hero::after{content:"";position:absolute;right:-120px;top:-120px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(200,155,92,0.18),transparent 70%);pointer-events:none;}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:60px;align-items:center;position:relative;}
.badge-line{display:inline-flex;align-items:center;gap:8px;background:rgba(246,241,231,0.08);border:1px solid var(--line-light);padding:7px 14px 7px 8px;border-radius:100px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--brass-light);margin-bottom:26px;}
.badge-line .dot{width:7px;height:7px;border-radius:50%;background:var(--sage);flex:none;}
.hero-name{font-size:15px;font-family:'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--sage);margin-bottom:10px;}
h1.headline{font-size:clamp(34px,4.4vw,54px);font-weight:600;line-height:1.06;margin-bottom:22px;color:var(--parchment);}
h1.headline em{font-style:italic;font-weight:500;color:var(--brass-light);}
.hero-sum{font-size:17px;color:rgba(246,241,231,0.75);max-width:520px;margin-bottom:32px;}
.contact-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:30px;}
.chip{background:rgba(246,241,231,0.07);border:1px solid var(--line-light);border-radius:100px;padding:9px 16px;font-size:13px;display:flex;align-items:center;gap:8px;color:var(--parchment);}
.social-row{display:flex;gap:10px;}
.social-row a{width:38px;height:38px;border:1px solid var(--line-light);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-family:'IBM Plex Mono',monospace;transition:.2s;}
.social-row a:hover{background:var(--brass);color:var(--ink);border-color:var(--brass);}
.cta-row{display:flex;gap:14px;margin-top:32px;flex-wrap:wrap;}
.btn{padding:13px 26px;border-radius:100px;font-size:13.5px;font-weight:600;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:8px;border:1px solid transparent;transition:.2s;cursor:pointer;}
.btn-primary{background:var(--brass);color:var(--ink);}
.btn-primary:hover{background:var(--brass-light);transform:translateY(-1px);}
.btn-ghost{border-color:var(--line-light);color:var(--parchment);}
.btn-ghost:hover{background:rgba(246,241,231,0.08);}

/* ID CARD */
.idcard{background:var(--parchment);border-radius:20px;padding:22px 22px 26px;box-shadow:var(--shadow);position:relative;transform:rotate(2deg);max-width:320px;margin:0 auto;}
.idcard::before{content:"";position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:70px;height:26px;background:var(--brass);border-radius:0 0 10px 10px;}
.photo-frame{width:100%;aspect-ratio:1/1;border-radius:12px;overflow:hidden;background:linear-gradient(135deg,var(--sage),var(--ink-soft));position:relative;margin-bottom:16px;display:flex;align-items:center;justify-content:center;}
.photo-frame img{width:100%;height:100%;object-fit:cover;}
.photo-empty{color:var(--white);text-align:center;font-family:'IBM Plex Mono',monospace;font-size:11px;opacity:.9;padding:10px;}
.photo-empty .ini{font-family:'Fraunces',serif;font-size:44px;display:block;margin-bottom:6px;}
.idcard-name{font-family:'Fraunces',serif;font-weight:600;font-size:19px;color:var(--ink);}
.idcard-role{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--sage-deep);text-transform:uppercase;letter-spacing:.06em;margin-top:2px;}
.idcard-id{margin-top:12px;padding-top:12px;border-top:1px dashed var(--line);display:flex;justify-content:space-between;gap:10px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-soft);}

/* STATS */
#stats{background:var(--white);margin-top:-1px;border-bottom:1px solid var(--line);}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);}
.stat-cell{padding:34px 30px;border-right:1px solid var(--line);}
.stat-cell:last-child{border-right:none;}
.stat-num{font-family:'Fraunces',serif;font-size:36px;font-weight:600;color:var(--ink);}
.stat-label{font-size:12.5px;color:var(--text-soft);margin-top:4px;}

/* SECTION SHELL */
.section{padding:90px 0;border-bottom:1px solid var(--line);position:relative;}
.section.alt{background:var(--white);}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:44px;gap:20px;flex-wrap:wrap;}
.section-title{font-size:clamp(26px,3vw,36px);font-weight:600;margin-top:10px;}
.section-title em{font-style:italic;color:var(--brass);}
.section-desc{color:var(--text-soft);max-width:460px;font-size:14.5px;margin-top:10px;}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease;}
.reveal.in{opacity:1;transform:translateY(0);}

/* RECORD CARD */
.record-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:28px 30px;margin-bottom:20px;box-shadow:var(--shadow-sm);position:relative;}
.section.alt .record-card{background:var(--parchment);}
.record-file-no{position:absolute;top:-11px;left:26px;background:var(--ink);color:var(--brass-light);font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.08em;padding:4px 10px;border-radius:100px;}
.record-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:16px;flex-wrap:wrap;}
.record-title{font-family:'Fraunces',serif;font-weight:600;font-size:20px;color:var(--ink);}
.record-sub{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--sage-deep);text-transform:uppercase;letter-spacing:.05em;margin-top:4px;}
.record-tag{background:rgba(124,154,130,0.15);color:var(--sage-deep);font-size:11px;font-family:'IBM Plex Mono',monospace;padding:5px 11px;border-radius:100px;white-space:nowrap;}
.record-tag.brass{background:rgba(200,155,92,0.18);color:#8a662f;}
.record-fields{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px 22px;margin:16px 0;}
.field-block label{display:block;font-family:'IBM Plex Mono',monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-soft);margin-bottom:4px;}
.field-block .val{font-size:14px;font-weight:500;color:var(--ink);}
.record-para{font-size:14.5px;color:var(--text-soft);margin-top:14px;line-height:1.65;}
.record-para strong{display:block;font-family:'IBM Plex Mono',monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--sage-deep);margin-bottom:5px;font-weight:600;}
.record-list{margin-top:14px;display:flex;flex-direction:column;gap:8px;}
.record-list li{font-size:14.5px;color:var(--text-soft);line-height:1.7;padding-left:18px;position:relative;}
.record-list li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--brass);}
.record-imgs{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;}
.img-tile{width:96px;height:96px;border-radius:10px;overflow:hidden;position:relative;background:var(--parchment-deep);border:1px solid var(--line);flex-shrink:0;}
.img-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s;}
.img-tile img.active{opacity:1;}
.img-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--sage-deep);text-align:center;padding:8px;line-height:1.3;}
.shots-dots{position:absolute;bottom:5px;left:0;right:0;display:flex;gap:4px;justify-content:center;z-index:2;}
.shots-dots i{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.7);}
.shots-dots i.on{background:var(--brass);}

/* SKILLS */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;}
.skill-cat{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:24px 24px 20px;position:relative;}
.section.alt .skill-cat{background:var(--parchment);}
.skill-cat h4{font-size:15px;margin-bottom:4px;}
.skill-cat .cat-tag{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--sage-deep);text-transform:uppercase;letter-spacing:.06em;}
.pill-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;}
.pill{background:var(--parchment-deep);border:1px solid var(--line);padding:7px 13px;border-radius:100px;font-size:12.5px;}
.section.alt .pill{background:var(--white);}

/* LIST TABLE */
.lang-table{width:100%;border-collapse:collapse;background:var(--white);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);}
.section.alt .lang-table{background:var(--parchment);}
.lang-table td{padding:14px 18px;border-top:1px solid var(--line);font-size:14px;}
.lang-table tr:first-child td{border-top:none;}
.lang-table td:first-child{font-family:'Fraunces',serif;font-weight:600;}
.lang-table td:last-child{text-align:right;font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--sage-deep);}

/* ACHIEVEMENTS */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}
.ach-card{background:var(--ink);color:var(--parchment);border-radius:var(--radius);padding:26px;position:relative;overflow:hidden;}
.ach-card .yr{font-family:'IBM Plex Mono',monospace;color:var(--brass-light);font-size:11px;letter-spacing:.08em;}
.ach-card h4{color:var(--parchment);font-size:17px;margin-top:8px;}
.ach-card p{font-size:13px;color:rgba(246,241,231,0.65);margin-top:8px;}
.ach-link{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--brass-light);display:inline-block;margin-top:12px;}
.ach-link:hover{text-decoration:underline;}
.ach-card .pill{background:rgba(246,241,231,0.08);border-color:var(--line-light);color:var(--parchment);}

/* FOOTER */
#footer{background:var(--ink);color:rgba(246,241,231,0.6);padding:60px 0 30px;}
.footer-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:30px;padding-bottom:36px;border-bottom:1px solid var(--line-light);}
.footer-top h3{color:var(--parchment);font-size:24px;}
#footer .social-row a{border-color:var(--line-light);color:var(--parchment);}
.footer-bottom{padding-top:24px;display:flex;justify-content:space-between;font-size:12px;flex-wrap:wrap;gap:10px;}

[data-item-wrap]{position:relative;}
.ce-add-btn{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1.5px dashed var(--brass);color:#8a662f;padding:12px 22px;border-radius:100px;font-size:13px;font-weight:600;margin-top:16px;}
.ce-add-btn:hover{background:rgba(200,155,92,0.08);}

@media(max-width:900px){
  #tabnav{display:none;}
  #mobilebar{display:flex;}
  body{margin-left:0;}
  .hero-grid{grid-template-columns:1fr;gap:40px;}
  .wrap{padding:0 20px;}
}
@media(max-width:800px){
  .stats-grid{grid-template-columns:repeat(2,1fr);}
  .stat-cell{border-bottom:1px solid var(--line);}
}
@media(prefers-reduced-motion:reduce){ .reveal{opacity:1;transform:none;transition:none;} }
`;
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const ed = (path: string, multi = false): string => (em ? _editable(path, multi) : '');
	const le = (path: string): string => (em ? _listEditable(path) : '');
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const inits = initials(v.name);

	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const programmes = v.template_overrides?.campaigns_count ?? (v.hr_programs?.length ?? 0);
	const roles = v.template_overrides?.roles_count ?? (v.experience?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	const tiles = (images: string[], path: string): string => {
		if (!images.length && !em) return '';
		const imgs = images.map((src, k) => `<img src="${src}" alt="" class="${k === 0 ? 'active' : ''}">`).join('');
		const dots = images.length > 1
			? `<div class="shots-dots">${images.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>`
			: '';
		const ph = !images.length ? '<div class="img-ph">Add image</div>' : '';
		return `<div class="record-imgs"><div class="img-tile" ${_imgUpload(path, em, 'Upload image')}>${imgs}${ph}${dots}</div></div>`;
	};
	const fileNo = (prefix: string, n: number) => `<div class="record-file-no">${prefix}-${String(n + 1).padStart(3, '0')}</div>`;

	// ── HERO ──────────────────────────────────────────────────────────────────
	const contactChips = [
		v.email ? `<span class="chip">&#9993; <span ${ed('profile.email')}>${v.email}</span></span>` : '',
		v.phone ? `<span class="chip">&#128222; <span ${ed('profile.phone')}>${v.phone}</span></span>` : '',
		v.location ? `<span class="chip">&#128205; <span ${ed('profile.location')}>${v.location}</span></span>` : ''
	].filter(Boolean).join('');
	const socialRow = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" title="LinkedIn">in</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" title="X">tw</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" title="Website">we</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" title="GitHub">gh</a>` : ''
	].filter(Boolean).join('');
	const statCells = [
		statShown(v, 'years_experience', years) ? `<div class="stat-cell"><div class="stat-num"><span ${ted('years_experience')}>${years}</span>+</div><div class="stat-label">Years in HR</div></div>` : '',
		statShown(v, 'campaigns_count', programmes) ? `<div class="stat-cell"><div class="stat-num"><span ${ted('campaigns_count')}>${programmes}</span></div><div class="stat-label">Programmes delivered</div></div>` : '',
		statShown(v, 'roles_count', roles) ? `<div class="stat-cell"><div class="stat-num"><span ${ted('roles_count')}>${roles}</span></div><div class="stat-label">Roles held</div></div>` : '',
		statShown(v, 'certifications_count', certCount) ? `<div class="stat-cell"><div class="stat-num"><span ${ted('certifications_count')}>${certCount}</span></div><div class="stat-label">Credentials</div></div>` : ''
	].filter(Boolean).join('');

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Capability Map</div><h2 class="section-title">Skills, <em>organised by discipline.</em></h2></div>
    </div>
    <div class="skills-grid">
${v.skill_groups.map((g, gi) => `      <div class="skill-cat reveal"${iw}>
        ${delBtn('skills', gi)}
        <div class="cat-tag">Cluster ${String(gi + 1).padStart(2, '0')}</div>
        <h4 ${ed(`skills.${gi}.category`)}>${g.category}</h4>
        <div class="pill-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="pill">${s}</span>`).join('')}</div>
      </div>`).join('\n')}
    </div>
    ${addBtn('skills', 'Skill Group')}
  </div>` : '';

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = (v.experience?.length || em)
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Employment Record</div><h2 class="section-title">Professional <em>Experience.</em></h2>
      <p class="section-desc">Roles held, responsibilities owned, and the teams &amp; tools behind each one.</p></div>
    </div>
${v.experience.map((exp, i) => {
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
			const fields = [
				exp.location ? `<div class="field-block"><label>Location</label><div class="val" ${ed(`experience.${i}.location`)}>${exp.location}</div></div>` : '',
				period ? `<div class="field-block"><label>Period</label><div class="val">${period}</div></div>` : ''
			].filter(Boolean).join('');
			return `    <div class="record-card reveal"${iw}>
      ${delBtn('experience', i)}
      ${fileNo('EXP', i)}
      <div class="record-top">
        <div>
          <div class="record-title" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
          ${exp.company ? `<div class="record-sub" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
        </div>
        ${exp.is_current ? '<span class="record-tag brass">Current</span>' : ''}
      </div>
      ${fields ? `<div class="record-fields">${fields}</div>` : ''}
      ${exp.description ? `<div class="record-para"><strong>Overview</strong><span ${ed(`experience.${i}.description`, true)}>${exp.description}</span></div>` : ''}
      ${exp.key_points?.length ? `<ul class="record-list" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
      ${tiles(exp.images ?? [], `experience.${i}.images`)}
    </div>`;
		}).join('\n')}
    ${addBtn('experience', 'Experience')}
  </div>` : '';

	// ── HR PROGRAMS ───────────────────────────────────────────────────────────
	const programsHtml = (v.hr_programs?.length || em)
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Strategic Programs</div><h2 class="section-title">HR <em>Initiatives.</em></h2>
      <p class="section-desc">Programmes owned end to end — scope, actions and outcomes.</p></div>
    </div>
${v.hr_programs.map((p, i) => {
			const period = _rangeEditable(`hr_programs.${i}.start_date`, p.start_date, `hr_programs.${i}.end_date`, p.end_date, em, ' — ');
			const fields = [
				p.organization ? `<div class="field-block"><label>Organisation</label><div class="val" ${ed(`hr_programs.${i}.organization`)}>${p.organization}</div></div>` : '',
				p.scope ? `<div class="field-block"><label>Scope</label><div class="val" ${ed(`hr_programs.${i}.scope`)}>${p.scope}</div></div>` : '',
				period ? `<div class="field-block"><label>Period</label><div class="val">${period}</div></div>` : ''
			].filter(Boolean).join('');
			return `    <div class="record-card reveal"${iw}>
      ${delBtn('hr_programs', i)}
      ${fileNo('PRG', i)}
      <div class="record-top">
        <div>
          <div class="record-title" ${ed(`hr_programs.${i}.program_name`)}>${p.program_name || (em ? 'Programme' : '')}</div>
          ${p.program_type ? `<div class="record-sub" ${ed(`hr_programs.${i}.program_type`)}>${p.program_type}</div>` : ''}
        </div>
      </div>
      ${fields ? `<div class="record-fields">${fields}</div>` : ''}
      ${p.description ? `<div class="record-para"><strong>Overview</strong><span ${ed(`hr_programs.${i}.description`, true)}>${p.description}</span></div>` : ''}
      ${p.activities?.length ? `<ul class="record-list" ${le(`hr_programs.${i}.activities`)}>${p.activities.map((a) => `<li>${a}</li>`).join('')}</ul>` : ''}
      ${p.measurable_outcomes?.length ? `<div class="record-para"><strong>Outcomes</strong></div><div class="pill-row" ${le(`hr_programs.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map((m) => `<span class="pill">${m}</span>`).join('')}</div>` : ''}
      ${p.tools_used?.length ? `<div class="record-para"><strong>Tools</strong></div><div class="pill-row" ${le(`hr_programs.${i}.tools_used`)}>${p.tools_used.map((t) => `<span class="pill">${t}</span>`).join('')}</div>` : ''}
      ${tiles(p.images ?? [], `hr_programs.${i}.images`)}
    </div>`;
		}).join('\n')}
    ${addBtn('hr_programs', 'Program')}
  </div>` : '';

	// ── SOFTWARE / COMPLIANCE ─────────────────────────────────────────────────
	const softwareHtml = v.software_proficiency?.length
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Systems Fluency</div><h2 class="section-title">HR Tools &amp; <em>Technologies.</em></h2></div>
    </div>
    <div class="skill-cat reveal">
      <div class="cat-tag">Platforms</div>
      <div class="pill-row" ${le('software_proficiency')}>${v.software_proficiency.map((s) => `<span class="pill">${s}</span>`).join('')}</div>
    </div>
  </div>` : '';

	const complianceHtml = v.compliance_expertise?.length
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Governance</div><h2 class="section-title">Employment Law &amp; <em>Compliance.</em></h2></div>
    </div>
    <div class="skill-cat reveal">
      <div class="cat-tag">Frameworks</div>
      <div class="pill-row" ${le('compliance_expertise')}>${v.compliance_expertise.map((s) => `<span class="pill">${s}</span>`).join('')}</div>
    </div>
  </div>` : '';

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = (v.achievements?.length || em)
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Milestones</div><h2 class="section-title">Achievements.</h2></div>
    </div>
    <div class="ach-grid">
${v.achievements.map((a, i) => `      <div class="ach-card reveal"${iw}>
        ${delBtn('achievements', i)}
        ${a.year ? `<div class="yr" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <h4 ${ed(`achievements.${i}.title`)}>${a.title}</h4>
        ${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
        ${a.url ? `<a class="ach-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View &rarr;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('achievements', 'Achievement')}
  </div>` : '';

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = (v.education?.length || em)
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Academic Record</div><h2 class="section-title">Education.</h2></div>
    </div>
${v.education.map((edu, i) => {
			const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `    <div class="record-card reveal"${iw}>
      ${delBtn('education', i)}
      ${fileNo('EDU', i)}
      <div class="record-top">
        <div>
          <div class="record-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
          ${edu.institution ? `<div class="record-sub" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
        </div>
        ${yr ? `<span class="record-tag">${yr}</span>` : ''}
      </div>
      ${(edu.location || edu.grade_or_score) ? `<div class="record-fields">
        ${edu.location ? `<div class="field-block"><label>Location</label><div class="val" ${ed(`education.${i}.location`)}>${edu.location}</div></div>` : ''}
        ${edu.grade_or_score ? `<div class="field-block"><label>Result</label><div class="val" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div></div>` : ''}
      </div>` : ''}
    </div>`;
		}).join('\n')}
    ${addBtn('education', 'Education')}
  </div>` : '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certsHtml = (v.certifications?.length || em)
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Verified Credentials</div><h2 class="section-title">Certifications.</h2></div>
    </div>
${v.certifications.map((c, i) => `    <div class="record-card reveal"${iw}>
      ${delBtn('certifications', i)}
      ${fileNo('CRT', i)}
      <div class="record-top">
        <div>
          <div class="record-title" ${ed(`certifications.${i}.name`)}>${c.name}</div>
          ${c.issuer ? `<div class="record-sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
        </div>
        ${c.year ? `<span class="record-tag brass" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
      </div>
      ${c.url ? `<a class="record-sub" style="color:#8a662f" href="${c.url}" target="_blank" rel="noopener noreferrer">Verify &rarr;</a>` : ''}
    </div>`).join('\n')}
    ${addBtn('certifications', 'Certification')}
  </div>` : '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customBodies = (v.custom_sections ?? []).map((cs, ci) => {
		if (!cs.items?.length && !em) return null;
		const items = cs.items ?? [];
		const tags = (i: number, t: string[]) => t?.length
			? `<div class="pill-row" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span class="pill">${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="ach-link" href="${u}" target="_blank" rel="noopener noreferrer">View &rarr;</a>` : '';

		let body: string;
		if (cs.display_type === 'timeline') {
			body = items.map((it, i) => `<div class="record-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}${fileNo('DOC', i)}
        <div class="record-top"><div>
          ${it.label ? `<div class="record-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</div>` : ''}
          ${it.subtitle ? `<div class="record-sub" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</div>` : ''}
        </div></div>
        ${it.value ? `<div class="record-para"><span ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</span></div>` : ''}
        ${tags(i, it.tags)}${link(it.url)}</div>`).join('');
		} else if (cs.display_type === 'list') {
			body = `<table class="lang-table"><tbody>${items.map((it, i) => `<tr${iw}><td>${delBtn(`custom_sections.${ci}`, i)}<span ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</span></td><td>${it.value ? `<span ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</span>` : ''}</td><td>${it.subtitle ? `<span ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</span>` : ''}${link(it.url)}</td></tr>`).join('')}</tbody></table>`;
		} else {
			body = `<div class="ach-grid">${items.map((it, i) => `<div class="ach-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}
        ${it.subtitle ? `<div class="yr" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</div>` : ''}
        ${it.label ? `<h4 ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</h4>` : ''}
        ${it.value ? `<p ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</p>` : ''}
        ${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		}
		return { cs, ci, body };
	}).filter(Boolean) as Array<{ cs: NormalizedData['custom_sections'][number]; ci: number; body: string }>;

	// ── ORDERED SECTIONS ──────────────────────────────────────────────────────
	const sectionMap: Record<string, { body: string; label: string }> = {
		skills: { body: skillsHtml, label: 'Skills' },
		experience: { body: experienceHtml, label: 'Experience' },
		hr_programs: { body: programsHtml, label: 'Initiatives' },
		software_proficiency: { body: softwareHtml, label: 'Tools' },
		compliance_expertise: { body: complianceHtml, label: 'Compliance' },
		achievements: { body: achievementsHtml, label: 'Achievements' },
		education: { body: educationHtml, label: 'Education' },
		certifications: { body: certsHtml, label: 'Certs' }
	};
	let alt = false;
	const navEntries: Array<{ id: string; label: string }> = [{ id: 'hero', label: 'Profile' }];
	const orderedSections = order
		.filter((k) => !hidden.has(k) && (k === 'custom_sections' ? customBodies.length > 0 : !!sectionMap[k]?.body))
		.map((k) => {
			if (k === 'custom_sections') {
				return customBodies.map(({ cs, ci, body }) => {
					navEntries.push({ id: cs.section_id, label: cs.title });
					const cls = (alt = !alt) ? 'section alt' : 'section';
					return `<section class="${cls}" id="${cs.section_id}">
  <div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Open Files</div><h2 class="section-title" ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2></div>
    </div>
    ${body}
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>
</section>`;
				}).join('\n');
			}
			navEntries.push({ id: k, label: sectionMap[k].label });
			const cls = (alt = !alt) ? 'section alt' : 'section';
			return `<section class="${cls}" id="${k}">${sectionMap[k].body}</section>`;
		})
		.join('\n');

	const tabLinks = navEntries.map((n) => `<a href="#${n.id}">${n.label}</a>`).join('');
	const mobileOptions = navEntries.map((n) => `<option value="#${n.id}">${n.label}</option>`).join('');
	const workAnchor = navEntries.find((n) => n.id === 'hr_programs')?.id
		?? navEntries.find((n) => n.id === 'experience')?.id ?? 'hero';

	const RUNTIME = `<script>
(function(){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  document.querySelectorAll('.img-tile').forEach(function(box){
    var imgs=box.querySelectorAll('img');
    if(imgs.length<2)return;
    var dots=box.querySelectorAll('.shots-dots i'),i=0;
    setInterval(function(){
      imgs[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('on');
      i=(i+1)%imgs.length;
      imgs[i].classList.add('active'); if(dots[i])dots[i].classList.add('on');
    },3200);
  });

  var secs=document.querySelectorAll('section[id]'), links=document.querySelectorAll('#tabnav a');
  window.addEventListener('scroll',function(){
    var cur='';
    secs.forEach(function(s){ if(window.scrollY>=s.offsetTop-160) cur=s.id; });
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')==='#'+cur); });
  },{passive:true});

  var sel=document.querySelector('#mobilebar select');
  if(sel){ sel.addEventListener('change',function(){ location.hash=this.value; }); }
})();
<\/script>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — ${v.profile_headline || 'People & Talent'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>

<nav id="tabnav">
  <div class="brandmark">${inits}</div>
  ${tabLinks}
</nav>

<div id="mobilebar">
  <strong style="font-family:'Fraunces',serif;">${v.name}</strong>
  <select aria-label="Jump to section">${mobileOptions}</select>
</div>

<section id="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <div class="badge-line"><span class="dot"></span> <span ${ed('profile.contact_tagline')}>${v.contact_tagline || 'Open to opportunities'}</span></div>
        <div class="hero-name" ${ed('profile.full_name')}>${v.name}</div>
        <h1 class="headline" ${ed('portfolio.headline')}>${v.headline || v.name}</h1>
        ${v.bio ? `<p class="hero-sum" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${contactChips ? `<div class="contact-row">${contactChips}</div>` : ''}
        ${socialRow ? `<div class="social-row">${socialRow}</div>` : ''}
        <div class="cta-row">
          <a class="btn btn-primary" href="#${workAnchor}">View my work</a>
          ${v.email ? `<a class="btn btn-ghost" href="mailto:${v.email}">Get in touch</a>` : ''}
        </div>
      </div>
      <div>
        <div class="idcard">
          <div class="photo-frame" ${_imgUpload('profile.profile_image', em)}>
            ${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="photo-empty"><span class="ini">${inits}</span>${em ? 'Upload photo' : ''}</div>`}
          </div>
          <div class="idcard-name">${v.name}</div>
          ${v.profile_headline ? `<div class="idcard-role" ${ed('profile.headline')}>${v.profile_headline}</div>` : ''}
          <div class="idcard-id"><span>PERSONNEL FILE</span><span>${v.location || 'HR'}</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

${statCells ? `<section id="stats"><div class="stats-grid">${statCells}</div></section>` : ''}

${v.uniqueValue ? `<section class="section" id="about"><div class="wrap"><div class="section-head reveal"><div><div class="eyebrow">Point of view</div><h2 class="section-title">What I <em>believe.</em></h2></div></div><p class="section-desc" style="max-width:760px;font-size:18px" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p></div></section>` : ''}

${orderedSections}

<footer id="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <h3>Let's build a workplace people love.</h3>
        <p style="margin-top:8px;color:rgba(246,241,231,0.55);">${v.profile_headline || 'Open to HR leadership & consulting engagements.'}</p>
      </div>
      ${socialRow ? `<div class="social-row">${socialRow}</div>` : ''}
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</span>
      <span>${v.location || ''}</span>
    </div>
  </div>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
