/**
 * Template: Journal
 * HR theme — a "people journal" on warm cream stock with berry and gold accents.
 * Newsreader serif headlines with berry italics, Manrope body and Space Mono
 * micro-labels; a concentric-ring portrait frame with an ID badge tag, a dark
 * ink stats strip, and pillow "record cards" with floating numbered rings, a
 * dashed-rail experience timeline and sealed achievement cards.
 * Palette: ink #241220, cream #FBF3EC, cream-deep #F3E4D8, blush #F0D9CE,
 * berry #9C4258, berry-deep #7A2F42, gold #C9A24A, gold-light #E4C878.
 * Fonts: Newsreader (display serif) · Manrope (body) · Space Mono (labels).
 * Signature: SVG ring frame, alternating tinted bands, scroll reveals, record
 * ring counters, pill clusters, hover-lift buttons.
 *
 * Ported from templates_add/hr-portfolio-05.html. The source's eleven themed
 * people-work sections all map to one model section and render as `hr_programs`
 * (Z15); the language proficiency bars, crop modal, save bar and reset link had
 * no backing data and are dropped (Z15/Z16).
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap';

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
  --ink:#241220; --ink-soft:#341C30; --cream:#FBF3EC; --cream-deep:#F3E4D8;
  --blush:#F0D9CE; --berry:#9C4258; --berry-deep:#7A2F42; --gold:#C9A24A;
  --gold-light:#E4C878; --text:#2B1B24; --text-soft:#6B5560;
  --line:rgba(36,18,32,0.12); --line-light:rgba(251,243,236,0.2); --white:#FFFDF9;
  --radius:22px; --radius-sm:14px;
  --shadow:0 24px 60px -24px rgba(36,18,32,0.32);
  --shadow-sm:0 10px 28px -14px rgba(36,18,32,0.22);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;background:var(--cream);color:var(--text);font-family:'Manrope',sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
h1,h2,h3,h4{font-family:'Newsreader',serif;margin:0;color:var(--ink);letter-spacing:-0.01em;}
h1 em,h2 em,h3 em{font-style:italic;color:var(--berry);}
p{margin:0;}
a{color:inherit;text-decoration:none;}
ul{margin:0;padding:0;list-style:none;}
img{max-width:100%;display:block;}
::selection{background:var(--gold-light);}

.eyebrow{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--berry);display:flex;align-items:center;gap:10px;}
.eyebrow::before{content:"\\25CF";font-size:7px;color:var(--gold);}
.wrap{max-width:1160px;margin:0 auto;padding:0 40px;}

/* NAV */
#topnav{position:sticky;top:0;z-index:60;background:rgba(251,243,236,0.86);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);}
.nav-inner{max-width:1160px;margin:0 auto;padding:16px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px;}
.nav-brand{display:flex;align-items:center;gap:10px;font-family:'Newsreader',serif;font-weight:600;font-size:19px;flex-shrink:0;}
.nav-brand .ring{width:30px;height:30px;border-radius:50%;border:2px solid var(--berry);position:relative;flex-shrink:0;}
.nav-brand .ring::after{content:"";position:absolute;inset:5px;border-radius:50%;border:2px solid var(--gold);}
.nav-links{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;flex:1;justify-content:flex-end;}
.nav-links::-webkit-scrollbar{display:none;}
.nav-links a{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--text-soft);padding:9px 13px;border-radius:100px;white-space:nowrap;transition:.2s;}
.nav-links a:hover,.nav-links a.active{background:var(--ink);color:var(--cream);}

/* HERO */
#hero{padding:76px 0 60px;position:relative;overflow:hidden;}
.hero-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:64px;align-items:center;}
.rings-frame{position:relative;width:100%;max-width:420px;margin:0 auto;aspect-ratio:1/1;}
.rings-frame svg{position:absolute;inset:0;width:100%;height:100%;z-index:0;}
.photo-circle{position:relative;z-index:1;width:78%;aspect-ratio:1/1;margin:11% auto;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,var(--berry),var(--ink));box-shadow:var(--shadow);display:flex;align-items:center;justify-content:center;}
.photo-circle img{width:100%;height:100%;object-fit:cover;}
.photo-empty{color:var(--cream);text-align:center;font-family:'Space Mono',monospace;font-size:10.5px;padding:14px;}
.photo-empty .ini{font-family:'Newsreader',serif;font-size:44px;display:block;margin-bottom:6px;color:var(--gold-light);}
.badge-tag{position:absolute;top:2%;right:2%;background:var(--gold);color:var(--ink);font-family:'Space Mono',monospace;font-size:10.5px;padding:8px 14px;border-radius:100px;box-shadow:var(--shadow-sm);z-index:3;}
.hero-eyebrow{margin-bottom:20px;}
h1.headline{font-size:clamp(32px,4.6vw,52px);font-weight:500;line-height:1.1;margin-bottom:22px;}
.hero-sum{font-size:17px;color:var(--text-soft);max-width:480px;margin-bottom:28px;}
.contact-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px;}
.chip{background:var(--white);border:1px solid var(--line);border-radius:100px;padding:8px 15px;font-size:13px;display:flex;align-items:center;gap:7px;box-shadow:var(--shadow-sm);}
.social-row{display:flex;gap:10px;margin-bottom:30px;}
.social-row a{width:36px;height:36px;border:1px solid var(--line);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-family:'Space Mono',monospace;background:var(--white);transition:.2s;}
.social-row a:hover{background:var(--ink);color:var(--cream);border-color:var(--ink);}
.cta-row{display:flex;gap:14px;flex-wrap:wrap;}
.btn{padding:14px 28px;border-radius:100px;font-size:13.5px;font-weight:700;display:inline-flex;align-items:center;gap:8px;border:1px solid transparent;transition:.2s;font-family:'Manrope',sans-serif;cursor:pointer;}
.btn-primary{background:var(--ink);color:var(--cream);}
.btn-primary:hover{background:var(--berry);transform:translateY(-1px);}
.btn-outline{border-color:var(--line);color:var(--ink);background:var(--white);}
.btn-outline:hover{border-color:var(--ink);}

/* STATS */
#stats{padding:0 0 70px;}
.stats-strip{background:var(--ink);border-radius:var(--radius);padding:38px 34px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;color:var(--cream);}
.stat-num{font-family:'Newsreader',serif;font-size:32px;font-weight:600;color:var(--gold-light);}
.stat-label{font-size:12px;color:rgba(251,243,236,0.65);margin-top:4px;}

/* SECTIONS */
.section{padding:78px 0;border-top:1px solid var(--line);}
.section.tint{background:var(--cream-deep);}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:42px;gap:20px;flex-wrap:wrap;}
.section-title{font-size:clamp(26px,3vw,36px);font-weight:500;margin-top:10px;}
.section-desc{color:var(--text-soft);max-width:460px;font-size:14.5px;margin-top:10px;}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease;}
.reveal.in{opacity:1;transform:translateY(0);}

/* RECORD CARDS */
.record-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:30px 32px;margin-bottom:22px;box-shadow:var(--shadow-sm);position:relative;}
.section.tint .record-card{background:var(--cream);}
.record-ring{position:absolute;top:-14px;left:28px;width:40px;height:40px;border-radius:50%;background:var(--ink);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:10px;box-shadow:var(--shadow-sm);}
.record-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin:12px 0 16px;flex-wrap:wrap;}
.record-title{font-family:'Newsreader',serif;font-weight:600;font-size:21px;color:var(--ink);}
.record-sub{font-family:'Space Mono',monospace;font-size:11.5px;color:var(--berry);text-transform:uppercase;letter-spacing:.05em;margin-top:5px;}
.record-tag{background:var(--blush);color:var(--berry-deep);font-size:11px;font-family:'Space Mono',monospace;padding:6px 12px;border-radius:100px;white-space:nowrap;}
.record-fields{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px 22px;margin:16px 0;}
.field-block label{display:block;font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-soft);margin-bottom:4px;}
.field-block .val{font-size:14px;font-weight:600;color:var(--ink);}
.record-para{font-size:14.5px;color:var(--text-soft);margin-top:14px;line-height:1.7;}
.record-para strong{display:block;font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--berry);margin-bottom:5px;font-weight:700;}
.record-list{margin-top:14px;display:flex;flex-direction:column;gap:8px;}
.record-list li{font-size:14.5px;color:var(--text-soft);line-height:1.7;padding-left:18px;position:relative;}
.record-list li::before{content:"\\25CF";position:absolute;left:0;top:0;font-size:6px;color:var(--gold);line-height:2.6;}
.record-imgs{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;}
.img-tile{width:96px;height:96px;border-radius:14px;overflow:hidden;position:relative;background:var(--cream-deep);border:1px solid var(--line);flex-shrink:0;}
.img-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s;}
.img-tile img.active{opacity:1;}
.img-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:9px;color:var(--berry);text-align:center;padding:8px;line-height:1.3;}
.shots-dots{position:absolute;bottom:5px;left:0;right:0;display:flex;gap:4px;justify-content:center;z-index:2;}
.shots-dots i{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.7);}
.shots-dots i.on{background:var(--gold);}

/* TIMELINE */
.timeline{position:relative;padding-left:34px;}
.timeline::before{content:"";position:absolute;left:9px;top:6px;bottom:6px;width:2px;background:repeating-linear-gradient(var(--berry),var(--berry) 4px,transparent 4px,transparent 9px);}
.timeline-item{position:relative;margin-bottom:26px;}
.timeline-dot{position:absolute;left:-34px;top:30px;width:20px;height:20px;border-radius:50%;background:var(--gold);border:3px solid var(--cream);box-shadow:0 0 0 2px var(--berry);z-index:2;}
.section.tint .timeline-dot{border-color:var(--cream-deep);}

/* SKILL CLUSTERS */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;}
.skill-cat{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:26px 26px 22px;box-shadow:var(--shadow-sm);position:relative;}
.section.tint .skill-cat{background:var(--cream);}
.skill-cat h4{font-size:16px;margin-bottom:4px;}
.skill-cat .cat-tag{font-family:'Space Mono',monospace;font-size:10px;color:var(--berry);text-transform:uppercase;letter-spacing:.06em;}
.pill-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;}
.pill{background:var(--cream-deep);border:1px solid var(--line);padding:7px 13px;border-radius:100px;font-size:12.5px;}
.section.tint .pill{background:var(--white);}

/* ACHIEVEMENTS */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;}
.ach-card{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:26px;position:relative;overflow:hidden;box-shadow:var(--shadow-sm);}
.section.tint .ach-card{background:var(--cream);}
.ach-seal{position:absolute;top:20px;right:20px;width:44px;height:44px;border-radius:50%;background:var(--gold);color:var(--ink);display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;text-align:center;line-height:1.2;}
.ach-card .yr{font-family:'Space Mono',monospace;color:var(--berry);font-size:11px;letter-spacing:.08em;}
.ach-card h4{font-size:18px;margin-top:10px;max-width:80%;}
.ach-card p{font-size:13px;color:var(--text-soft);margin-top:8px;}
.ach-link{font-family:'Space Mono',monospace;font-size:11px;color:var(--berry);display:inline-block;margin-top:12px;}
.ach-link:hover{text-decoration:underline;}

/* LIST TABLE (custom list layout) */
.lang-table{width:100%;border-collapse:separate;border-spacing:0 10px;}
.lang-table td{padding:16px 18px;background:var(--white);font-size:14px;}
.section.tint .lang-table td{background:var(--cream);}
.lang-table tr td:first-child{border-radius:14px 0 0 14px;font-weight:600;font-family:'Newsreader',serif;}
.lang-table tr td:last-child{border-radius:0 14px 14px 0;text-align:right;}

/* FOOTER */
#footer{background:var(--ink);color:rgba(251,243,236,0.65);padding:60px 0 30px;}
.footer-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:30px;padding-bottom:36px;border-bottom:1px solid var(--line-light);}
.footer-top h3{color:var(--cream);font-size:26px;}
#footer .social-row a{border-color:var(--line-light);color:var(--cream);background:transparent;}
#footer .social-row a:hover{background:var(--gold);color:var(--ink);border-color:var(--gold);}
.footer-bottom{padding-top:24px;display:flex;justify-content:space-between;font-size:12px;flex-wrap:wrap;gap:10px;}

[data-item-wrap]{position:relative;}
.ce-add-btn{display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1.5px dashed var(--berry);color:var(--berry-deep);padding:12px 22px;border-radius:100px;font-size:13px;font-weight:700;box-shadow:var(--shadow-sm);margin-top:18px;}
.ce-add-btn:hover{background:var(--blush);}

@media(max-width:900px){
  .hero-grid{display:flex;flex-direction:column-reverse;gap:44px;}
  .wrap{padding:0 22px;}
  .nav-inner{padding:14px 22px;}
}
@media(max-width:800px){ .stats-strip{grid-template-columns:repeat(2,1fr);} }
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

	const ring = (n: number) => `<div class="record-ring">${String(n + 1).padStart(2, '0')}</div>`;

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
		statShown(v, 'years_experience', years) ? `<div><div class="stat-num"><span ${ted('years_experience')}>${years}</span>+ yrs</div><div class="stat-label">HR &amp; People Ops experience</div></div>` : '',
		statShown(v, 'campaigns_count', programmes) ? `<div><div class="stat-num"><span ${ted('campaigns_count')}>${programmes}</span></div><div class="stat-label">People programmes built</div></div>` : '',
		statShown(v, 'roles_count', roles) ? `<div><div class="stat-num"><span ${ted('roles_count')}>${roles}</span></div><div class="stat-label">Roles held</div></div>` : '',
		statShown(v, 'certifications_count', certCount) ? `<div><div class="stat-num"><span ${ted('certifications_count')}>${certCount}</span></div><div class="stat-label">Credentials earned</div></div>` : ''
	].filter(Boolean).join('');

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Capability Map</div><h2 class="section-title">Skills, <em>by discipline.</em></h2></div>
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
      <div><div class="eyebrow">Career Path</div><h2 class="section-title">Professional <em>Experience.</em></h2>
      <p class="section-desc">Every role, and the people work behind it.</p></div>
    </div>
    <div class="timeline">
${v.experience.map((exp, i) => {
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
			const fields = [
				exp.company ? `<div class="field-block"><label>Organisation</label><div class="val" ${ed(`experience.${i}.company`)}>${exp.company}</div></div>` : '',
				exp.location ? `<div class="field-block"><label>Location</label><div class="val" ${ed(`experience.${i}.location`)}>${exp.location}</div></div>` : '',
				period ? `<div class="field-block"><label>Period</label><div class="val">${period}</div></div>` : ''
			].filter(Boolean).join('');
			return `      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="record-card"${iw}>
          ${delBtn('experience', i)}
          ${ring(i)}
          <div class="record-top">
            <div>
              <div class="record-title" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
              ${exp.company ? `<div class="record-sub" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
            </div>
            ${exp.is_current ? '<span class="record-tag">Current</span>' : ''}
          </div>
          ${fields ? `<div class="record-fields">${fields}</div>` : ''}
          ${exp.description ? `<div class="record-para"><strong>Overview</strong><span ${ed(`experience.${i}.description`, true)}>${exp.description}</span></div>` : ''}
          ${exp.key_points?.length ? `<ul class="record-list" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
          ${tiles(exp.images ?? [], `experience.${i}.images`)}
        </div>
      </div>`;
		}).join('\n')}
    </div>
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
      ${ring(i)}
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
        <div class="ach-seal">ACH<br>${String(i + 1).padStart(2, '0')}</div>
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
      ${ring(i)}
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
      ${ring(i)}
      <div class="record-top">
        <div>
          <div class="record-title" ${ed(`certifications.${i}.name`)}>${c.name}</div>
          ${c.issuer ? `<div class="record-sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
        </div>
        ${c.year ? `<span class="record-tag" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
      </div>
      ${c.url ? `<a class="ach-link" href="${c.url}" target="_blank" rel="noopener noreferrer">Verify &rarr;</a>` : ''}
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
			body = `<div class="timeline">${items.map((it, i) => `<div class="timeline-item"><div class="timeline-dot"></div><div class="record-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}${ring(i)}
        <div class="record-top"><div>
          ${it.label ? `<div class="record-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</div>` : ''}
          ${it.subtitle ? `<div class="record-sub" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</div>` : ''}
        </div></div>
        ${it.value ? `<div class="record-para"><span ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</span></div>` : ''}
        ${tags(i, it.tags)}${link(it.url)}</div></div>`).join('')}</div>`;
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

	// ── ORDERED SECTIONS (alternating tint) ───────────────────────────────────
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
	let tint = false;
	const navEntries: Array<{ id: string; label: string }> = [{ id: 'hero', label: 'Profile' }];
	const orderedSections = order
		.filter((k) => !hidden.has(k) && (k === 'custom_sections' ? customBodies.length > 0 : !!sectionMap[k]?.body))
		.map((k) => {
			if (k === 'custom_sections') {
				return customBodies.map(({ cs, ci, body }) => {
					navEntries.push({ id: cs.section_id, label: cs.title });
					const cls = (tint = !tint) ? 'section tint' : 'section';
					return `<section class="${cls}" id="${cs.section_id}">
  <div class="wrap">
    <div class="section-head reveal">
      <div><div class="eyebrow">Open Pages</div><h2 class="section-title" ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2></div>
    </div>
    ${body}
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>
</section>`;
				}).join('\n');
			}
			navEntries.push({ id: k, label: sectionMap[k].label });
			const cls = (tint = !tint) ? 'section tint' : 'section';
			return `<section class="${cls}" id="${k}">${sectionMap[k].body}</section>`;
		})
		.join('\n');

	const navItems = navEntries.map((n) => `<a href="#${n.id}">${n.label}</a>`).join('');
	const journeyAnchor = navEntries.find((n) => n.id === 'experience')?.id ?? navEntries[1]?.id ?? 'hero';

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

  var secs=document.querySelectorAll('section[id]'), links=document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll',function(){
    var cur='';
    secs.forEach(function(s){ if(window.scrollY>=s.offsetTop-140) cur=s.id; });
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')==='#'+cur); });
  },{passive:true});
})();
<\/script>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — ${v.profile_headline || 'People Journal'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>

<nav id="topnav">
  <div class="nav-inner">
    <div class="nav-brand"><span class="ring"></span> <span ${ed('profile.full_name')}>${v.name}</span></div>
    <div class="nav-links">${navItems}</div>
  </div>
</nav>

<main>

<section id="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        ${v.profile_headline ? `<div class="eyebrow hero-eyebrow" ${ed('profile.headline')}>${v.profile_headline}</div>` : ''}
        <h1 class="headline" ${ed('portfolio.headline')}>${v.headline || v.name}</h1>
        ${v.bio ? `<p class="hero-sum" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${contactChips ? `<div class="contact-row">${contactChips}</div>` : ''}
        ${socialRow ? `<div class="social-row">${socialRow}</div>` : ''}
        <div class="cta-row">
          <a class="btn btn-primary" href="#${journeyAnchor}">See my journey &rarr;</a>
          ${v.email ? `<a class="btn btn-outline" href="mailto:${v.email}">Get in touch</a>` : ''}
        </div>
      </div>
      <div>
        <div class="rings-frame">
          <svg viewBox="0 0 420 420" aria-hidden="true"><circle cx="210" cy="210" r="205" fill="none" stroke="#9C4258" stroke-width="1" opacity="0.35"/><circle cx="210" cy="210" r="185" fill="none" stroke="#C9A24A" stroke-width="1" opacity="0.45"/><circle cx="210" cy="210" r="165" fill="none" stroke="#9C4258" stroke-width="1" opacity="0.55"/></svg>
          <div class="badge-tag">${v.profile_headline ? 'ID &middot; HR' : 'ID &middot; HR'}</div>
          <div class="photo-circle" ${_imgUpload('profile.profile_image', em)}>
            ${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="photo-empty"><span class="ini">${inits}</span>${em ? 'Upload profile photo' : ''}</div>`}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

${statCells ? `<section id="stats"><div class="wrap"><div class="stats-strip">${statCells}</div></div></section>` : ''}

${v.uniqueValue ? `<section class="section" id="about"><div class="wrap"><div class="section-head reveal"><div><div class="eyebrow">Point of view</div><h2 class="section-title">What I <em>believe.</em></h2></div></div><p class="hero-sum" style="max-width:760px;font-size:19px" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p></div></section>` : ''}

${orderedSections}

</main>

<footer id="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <h3 ${ed('profile.contact_tagline')}>${v.contact_tagline || "Let's build a workplace people love."}</h3>
        <p style="margin-top:8px;color:rgba(251,243,236,0.55);">${v.profile_headline || 'Open to HR leadership & consulting engagements.'}</p>
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
