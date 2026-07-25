/**
 * Template: Ledger
 * Finance theme — warm editorial "accounting ledger" aesthetic on a cream
 * canvas with rust, sage, gold and wine accents. Serif display type (Fraunces),
 * a scrolling ticker strip, a ledger spec card, case-study cards for financial
 * models, and a coloured stat row.
 * Palette: cream #E9EAE6, paper #F6F7F4, ink #1E241F, rust #BE6134,
 * sage #6C7A55, gold #C99A3B, wine #7B3B3F.
 * Fonts: Fraunces (serif) · Inter (body) · IBM Plex Mono (mono).
 * Signature: scroll reveals, animated ticker + tools marquee, hover card lifts.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';

function initials(name: string): string {
	const parts = name.trim().split(/\s+/);
	return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[1]?.[0] ?? '' : '')).toUpperCase() || '??';
}

function yearsExperience(experience: NormalizedData['experience']): number {
	if (!experience?.length) return 0;
	let earliest = new Date().getFullYear();
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/\b(19|20)(\d{2})\b/);
		if (m) {
			const y = parseInt(m[0]);
			if (y < earliest) earliest = y;
		}
	}
	return Math.max(0, new Date().getFullYear() - earliest);
}

function css(): string {
	return `
*{box-sizing:border-box}
:root{
  --cream:#E9EAE6;--cream-2:#DFE1DC;--ink:#1E241F;--ink-soft:#4B534C;
  --rust:#BE6134;--sage:#6C7A55;--gold:#C99A3B;--wine:#7B3B3F;
  --line:rgba(30,36,31,0.14);--paper:#F6F7F4;--radius:18px;
  --fh:'Fraunces',serif;--fb:'Inter',sans-serif;--fm:'IBM Plex Mono',monospace;
}
html{scroll-behavior:smooth}
body{margin:0;background:var(--cream);color:var(--ink);font-family:var(--fb);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
h1,h2,h3,h4,h5{font-family:var(--fh);font-weight:600;margin:0;letter-spacing:-.01em}
.wrap{max-width:1240px;margin:0 auto;padding:0 32px}
.eyebrow{font-family:var(--fm);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);display:flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:18px;height:1px;background:var(--rust);display:inline-block}

/* HEADER */
header{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(233,234,230,0.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;max-width:1240px;margin:0 auto}
.logo{display:flex;align-items:center;gap:10px;font-family:var(--fh);font-weight:600;font-size:19px}
.logo-mark{width:36px;height:36px;border:1.5px solid var(--ink);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:var(--fm);font-size:13px;font-weight:500;background:var(--paper)}
nav.menu ul{list-style:none;display:flex;gap:34px;margin:0;padding:0}
nav.menu a{font-size:14px;font-weight:500;color:var(--ink-soft);transition:color .2s}
nav.menu a:hover{color:var(--rust)}
.btn{font-family:var(--fb);font-weight:600;font-size:14px;padding:11px 22px;border-radius:100px;border:1px solid var(--ink);background:var(--ink);color:var(--paper);cursor:pointer;transition:transform .2s,background .2s;display:inline-flex;align-items:center;gap:8px}
.btn:hover{transform:translateY(-2px);background:var(--rust);border-color:var(--rust)}
.btn.ghost{background:transparent;color:var(--ink)}
.btn.ghost:hover{background:var(--ink);color:var(--paper)}

/* HERO */
.hero{padding:168px 0 90px}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center}
.hero h1{font-size:clamp(38px,5vw,64px);line-height:1.05;margin:18px 0 22px}
.hero h1 em{font-style:italic;color:var(--rust);font-weight:500}
.hero p.lede{font-size:18px;line-height:1.6;color:var(--ink-soft);max-width:480px;margin-bottom:32px}
.hero-actions{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:36px}
.hero-meta{display:flex;gap:28px;padding-top:24px;border-top:1px solid var(--line);flex-wrap:wrap}
.hero-meta div{font-family:var(--fm)}
.hero-meta strong{display:block;font-size:20px;font-family:var(--fh);font-weight:600}
.hero-meta span{font-size:11px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.08em}
.hero-visual{position:relative}
.portrait-card{aspect-ratio:4/5;border-radius:var(--radius);background:linear-gradient(155deg,#2C3527 0%,#1E241F 55%,#3A2A22 100%);position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:24px}
.portrait-card>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.portrait-card::before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(180deg,transparent 0 38px,rgba(255,255,255,.05) 38px 39px);opacity:.5}
.portrait-mark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--fh);font-weight:600;font-size:72px;color:rgba(201,154,59,.55)}
.portrait-tag{position:relative;background:var(--paper);color:var(--ink);padding:10px 16px;border-radius:12px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;z-index:2}
.portrait-tag .dot{width:7px;height:7px;border-radius:50%;background:var(--sage)}
.float-badge{position:absolute;top:-22px;right:-18px;background:var(--gold);color:var(--ink);border-radius:16px;padding:16px 18px;box-shadow:0 14px 30px rgba(30,36,31,.18);font-family:var(--fh);transform:rotate(-4deg);z-index:2}
.float-badge strong{display:block;font-size:26px;line-height:1}
.float-badge span{font-family:var(--fb);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}

/* TICKER */
.ticker-strip{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--ink);color:var(--cream);overflow:hidden;padding:14px 0}
.ticker-track{display:flex;width:max-content;animation:scroll 32s linear infinite}
.ticker-track span{font-family:var(--fm);font-size:13px;letter-spacing:.04em;padding:0 28px;white-space:nowrap;display:flex;align-items:center;gap:10px}
.ticker-track span::after{content:"\\25C6";color:var(--rust);font-size:8px}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.ticker-track,.tools-track{animation:none}}

/* SECTION SHELL */
.section{padding:100px 0}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:52px;flex-wrap:wrap}
.section-head h2{font-size:clamp(28px,3.4vw,42px);max-width:600px}
.section-head p{color:var(--ink-soft);max-width:360px;font-size:15px;line-height:1.6}
.rule{height:1px;background:var(--line);width:100%}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
.reveal.in{opacity:1;transform:none}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px}
.ledger-card{background:var(--paper);border-radius:var(--radius);padding:28px;border:1px solid var(--line)}
.ledger-card .row{display:flex;justify-content:space-between;gap:1rem;padding:11px 0;border-bottom:1px dashed var(--line);font-size:13px}
.ledger-card .row:last-child{border-bottom:none}
.ledger-card .row span:first-child{color:var(--ink-soft)}
.ledger-card .row span:last-child{font-weight:600;font-family:var(--fm);text-align:right}
.about-copy p{font-size:16.5px;line-height:1.75;color:var(--ink-soft);margin-bottom:18px}
.about-copy h2{font-size:clamp(26px,3vw,36px);margin-bottom:20px}
.pull-quote{font-family:var(--fh);font-style:italic;font-size:24px;line-height:1.4;color:var(--ink);border-left:3px solid var(--rust);padding-left:22px;margin:28px 0}

/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.stat-pill{border-radius:var(--radius);padding:26px 22px;color:var(--paper)}
.stat-pill h3{font-size:38px;color:inherit;line-height:1}
.stat-pill p{margin:8px 0 0;font-size:13px;font-weight:600;opacity:.9}
.stat-pill.c1{background:var(--rust)}.stat-pill.c2{background:var(--sage)}.stat-pill.c3{background:var(--wine)}.stat-pill.c4{background:var(--ink)}

/* SKILLS */
.skills-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.skill-cat{background:var(--paper);padding:24px 20px;position:relative}
.skill-cat h5{font-family:var(--fm);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--rust);margin-bottom:14px;font-weight:500}
.skill-cat ul{list-style:none;margin:0;padding:0}
.skill-cat li{font-size:13.5px;padding:6px 0;color:var(--ink-soft);border-bottom:1px dashed var(--line)}
.skill-cat li:last-child{border-bottom:none}

/* TIMELINE (experience) */
.timeline{position:relative;padding-left:32px;border-left:1px solid var(--line)}
.tl-item{position:relative;padding-bottom:48px}
.tl-item:last-child{padding-bottom:0}
.tl-item::before{content:"";position:absolute;left:-38px;top:4px;width:11px;height:11px;border-radius:50%;background:var(--paper);border:2px solid var(--rust)}
.tl-head{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:6px}
.tl-head h4{font-size:20px}
.tl-head span{font-family:var(--fm);font-size:12px;color:var(--ink-soft)}
.tl-company{color:var(--rust);font-weight:600;font-size:14px;margin-bottom:10px}
.tl-desc{color:var(--ink-soft);font-size:14.5px;line-height:1.7;margin:0 0 8px}
.tl-item ul{margin:10px 0 0;padding-left:18px;color:var(--ink-soft);font-size:14.5px;line-height:1.7}

/* WORK / financial models */
.work-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.work-card{border-radius:var(--radius);padding:26px;position:relative;overflow:hidden;color:var(--paper);min-height:300px;display:flex;flex-direction:column}
.work-card:nth-child(3n+1){background:linear-gradient(160deg,var(--rust),#8f4423)}
.work-card:nth-child(3n+2){background:linear-gradient(160deg,var(--sage),#495338)}
.work-card:nth-child(3n+3){background:linear-gradient(160deg,var(--wine),#4d2528)}
.work-tag{align-self:flex-start;background:rgba(255,255,255,.18);font-size:11px;font-weight:600;padding:6px 12px;border-radius:100px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:18px}
.work-card h4{font-size:21px;color:var(--paper);margin-bottom:10px;line-height:1.3}
.work-flow{font-size:14px;line-height:1.65;opacity:.92;margin-bottom:auto}
.work-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:18px;border-top:1px solid rgba(255,255,255,.25);padding-top:14px}
.work-tool{font-family:var(--fm);font-size:11px;padding:4px 10px;border-radius:100px;background:rgba(255,255,255,.16)}

/* INVESTMENT PORTFOLIOS */
.inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.inv-card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:26px;border-left:3px solid var(--gold);transition:transform .25s,box-shadow .25s}
.inv-card:hover{transform:translateY(-6px);box-shadow:0 18px 30px rgba(30,36,31,.1)}
.inv-type{font-size:18px;margin-bottom:12px}
.inv-row{display:flex;justify-content:space-between;gap:1rem;padding:10px 0;border-bottom:1px dashed var(--line);font-size:13.5px}
.inv-row:last-child{border-bottom:none}
.inv-row .k{color:var(--ink-soft);font-family:var(--fm);font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.inv-row .val{font-weight:600;text-align:right}
.inv-row .val.pos{color:var(--sage)}

/* TWO-COL (education/certs) */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.entry-list .entry{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid var(--line);position:relative}
.entry-list .entry:last-child{border-bottom:none}
.entry-num{font-family:var(--fm);font-size:12px;color:var(--rust);min-width:26px;padding-top:3px}
.entry h5{font-size:16px;margin-bottom:4px}
.entry p{margin:0;font-size:13.5px;color:var(--ink-soft)}

/* ACHIEVEMENTS */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
.ach-card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:22px;display:flex;gap:14px;align-items:flex-start;position:relative}
.ach-icon{width:38px;height:38px;flex:none;border-radius:10px;background:var(--cream-2);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:1.1rem}
.ach-card h5{font-size:15px;margin-bottom:4px}
.ach-card p{margin:0;font-size:13px;color:var(--ink-soft);line-height:1.5}
.ach-year{font-family:var(--fm);font-size:11px;color:var(--rust);margin-bottom:4px;display:block}
.ach-link{display:inline-block;margin-top:8px;font-family:var(--fm);font-size:11px;color:var(--rust);border-bottom:1px solid var(--rust)}

/* TOOLS MARQUEE */
.tools-strip{overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:26px 0}
.tools-track{display:flex;width:max-content;animation:scroll 26s linear infinite;gap:64px;align-items:center}
.tools-track span{font-family:var(--fh);font-size:20px;color:var(--ink-soft);white-space:nowrap}

/* CONTACT */
.contact-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:56px}
.contact-info h2{font-size:clamp(30px,4vw,48px);margin-bottom:18px}
.contact-info p{color:var(--ink-soft);font-size:15.5px;line-height:1.7;max-width:400px;margin-bottom:28px}
.contact-rows .row{display:flex;align-items:center;gap:14px;padding:14px 0;border-top:1px solid var(--line)}
.contact-rows .row:last-child{border-bottom:1px solid var(--line)}
.contact-rows .row .lbl{font-family:var(--fm);font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-soft);width:90px;flex:none}
.contact-rows .row .val{font-weight:600}
.social-row{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap}
.social-row a{padding:10px 18px;border-radius:100px;border:1px solid var(--line);display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;transition:background .2s,color .2s}
.social-row a:hover{background:var(--ink);color:var(--paper)}
.contact-side{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.contact-side .mark{font-family:var(--fh);font-size:64px;color:var(--gold)}
.contact-side .lbl{font-family:var(--fm);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin-top:14px}

/* FOOTER */
footer{background:var(--ink);color:var(--cream);padding:48px 0 28px}
.foot-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;margin-bottom:36px}
.foot-brand p{color:#B9C0B4;font-size:14px;line-height:1.7;max-width:320px;margin-top:14px}
.foot-bottom{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.12);padding-top:24px;flex-wrap:wrap;gap:12px}
.foot-bottom p{margin:0;font-size:12.5px;color:#8A9382}

/* EDIT CONTROLS */
.add-btn{display:block;margin-top:24px;padding:12px 18px;border:1px dashed var(--line);background:var(--paper);color:var(--rust);font-family:var(--fm);font-size:11px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;width:100%;text-align:center}
.add-btn:hover{border-color:var(--rust)}
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:10px;right:10px;width:22px;height:22px;border-radius:50%;border:none;background:rgba(30,36,31,.8);color:#fff;font-size:11px;line-height:22px;text-align:center;cursor:pointer;z-index:10;padding:0}
.work-card .del-btn{background:rgba(255,255,255,.25)}
[data-item-wrap]:hover .del-btn{display:block}

@media (max-width:980px){
  nav.menu ul{display:none}
  .hero-grid,.about-grid,.contact-grid{grid-template-columns:1fr}
  .hero-visual{order:-1;max-width:340px;margin:0 auto}
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .two-col{grid-template-columns:1fr}
}
@media (max-width:600px){
  .wrap{padding:0 20px}
  .stats-grid{grid-template-columns:1fr}
  .hero-meta{row-gap:16px}
}
`;
}

const LEDGER_SCRIPT = `<script>
(function(){
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.12});
    reveals.forEach(function(r){io.observe(r);});
  }
})();
<\/script>`;

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const em = v.edit_mode;
	const inits = initials(v.name);
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const modelsCount = v.template_overrides?.models_count ?? (v.financial_modeling?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const skillsCount = (v.skill_groups ?? []).reduce((a, g) => a + g.skills.length, 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	const nameParts = v.name.split(/\s+/);
	const firstName = nameParts.slice(0, -1).join(' ') || v.name;
	const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

	// Experience dates bound to real start/end fields.
	const datePeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const showStart = exp.start_date || em;
		const showEnd = exp.end_date || em;
		if (!showStart && !showEnd) return '';
		const s = showStart ? `<span ${_editable(`experience.${i}.start_date`)}>${exp.start_date || 'Start'}</span>` : '';
		const e = showEnd ? `<span ${_editable(`experience.${i}.end_date`)}>${exp.end_date || 'End'}</span>` : '';
		return `<span>${s}${showStart && showEnd ? ' — ' : ''}${e}</span>`;
	};
	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const showS = edu.start_year || em;
		const showE = edu.end_year || em;
		if (!showS && !showE) return '';
		const s = showS ? `<span ${_editable(`education.${i}.start_year`)}>${edu.start_year || 'Start'}</span>` : '';
		const e = showE ? `<span ${_editable(`education.${i}.end_year`)}>${edu.end_year || 'End'}</span>` : '';
		return `${s}${showS && showE ? '–' : ''}${e}`;
	};

	const NAV_LABELS: Record<string, string> = {
		about: 'About', skills: 'Skills', experience: 'Experience', financial_modeling: 'Work',
		investment_portfolios: 'Portfolios', education: 'Education', certifications: 'Certifications',
		achievements: 'Achievements', contact: 'Contact',
	};
	const navAnchors: string[] = [];
	if (v.bio) navAnchors.push('about');
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (['skills', 'experience', 'financial_modeling', 'investment_portfolios', 'education', 'certifications', 'achievements'].includes(key)) {
			const dk = key === 'skills' ? 'skill_groups' : key;
			const d = (v as unknown as Record<string, unknown>)[dk];
			if (Array.isArray(d) && d.length > 0) navAnchors.push(key);
		}
	}
	if (v.email || v.phone || v.location) navAnchors.push('contact');
	const navItems = navAnchors.map(a => `<li><a href="#${a}">${NAV_LABELS[a] ?? a}</a></li>`).join('');

	// Ticker content — from skill categories (fallback to a finance set).
	const tickerItems = ((v.skill_groups ?? []).map(g => g.category).filter(Boolean).length
		? (v.skill_groups ?? []).map(g => g.category).filter(Boolean)
		: ['Financial Reporting', 'Corporate Tax', 'Internal Audit', 'Budget Forecasting', 'Risk Assessment']);
	const ticker = tickerItems.concat(tickerItems).map(t => `<span>${t}</span>`).join('');

	// HERO
	const portrait = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="portrait-mark">${inits}</div>`;
	const heroMeta = [
		statShown(v, 'years_experience', years) ? `<div><strong><span ${ted('years_experience')}>${years}</span>+</strong><span>Years Experience</span></div>` : '',
		statShown(v, 'models_count', modelsCount) ? `<div><strong><span ${ted('models_count')}>${modelsCount}</span>+</strong><span>Models Built</span></div>` : '',
		statShown(v, 'certifications_count', certCount) ? `<div><strong><span ${ted('certifications_count')}>${certCount}</span></strong><span>Certifications</span></div>` : '',
		skillsCount > 0 ? `<div><strong>${skillsCount}+</strong><span>Core Skills</span></div>` : '',
	].filter(Boolean).join('');

	// STATS row (coloured pills) — computed, hidden when zero.
	const statPills = [
		statShown(v, 'years_experience', years) ? `<div class="stat-pill c1"><h3><span ${ted('years_experience')}>${years}</span>+</h3><p>Years Experience</p></div>` : '',
		(v.experience?.length ?? 0) > 0 ? `<div class="stat-pill c2"><h3>${v.experience.length}</h3><p>Engagements</p></div>` : '',
		statShown(v, 'models_count', modelsCount) ? `<div class="stat-pill c3"><h3><span ${ted('models_count')}>${modelsCount}</span></h3><p>Financial Models</p></div>` : '',
		statShown(v, 'certifications_count', certCount) ? `<div class="stat-pill c4"><h3><span ${ted('certifications_count')}>${certCount}</span></h3><p>Certifications</p></div>` : '',
	].filter(Boolean).join('');
	const statsHtml = statPills
		? `<section class="section"><div class="wrap"><div class="section-head reveal"><h2>The work, in numbers.</h2><p>A quick ledger of scale — the detail that usually lives three pages deep in a CV.</p></div><div class="stats-grid reveal">${statPills}</div></div></section>` : '';

	// ABOUT
	const ledgerRows = [
		v.location ? `<div class="row"><span>Based in</span><span ${_editable('profile.location')}>${v.location}</span></div>` : '',
		v.headline ? `<div class="row"><span>Focus</span><span ${_editable('portfolio.headline')}>${v.headline}</span></div>` : '',
		statShown(v, 'years_experience', years) ? `<div class="row"><span>Experience</span><span><span ${ted('years_experience')}>${years}</span>+ years</span></div>` : '',
		v.email ? `<div class="row"><span>Email</span><span ${_editable('profile.email')}>${v.email}</span></div>` : '',
		`<div class="row"><span>Availability</span><span>Open to new work</span></div>`,
	].filter(Boolean).join('');
	const aboutHtml = v.bio
		? `<section class="section" id="about">
  <div class="wrap about-grid">
    <div class="reveal">
      <p class="eyebrow">About</p>
      <div class="ledger-card" style="margin-top:18px">${ledgerRows}</div>
    </div>
    <div class="about-copy reveal">
      <p class="eyebrow" style="margin-bottom:14px">Who I am</p>
      ${v.headline ? `<h2 ${_editable('portfolio.headline')}>${v.headline}</h2>` : ''}
      <p ${_editable('portfolio.bio', true)}>${v.bio}</p>
      ${v.uniqueValue ? `<p class="pull-quote" ${_editable('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
    </div>
  </div>
</section>
<div class="wrap"><div class="rule"></div></div>` : '';

	// SKILLS
	const skillsHtml = v.skill_groups?.length
		? `<section class="section" id="skills">
  <div class="wrap">
    <div class="section-head reveal"><h2>Core skills, by discipline.</h2><p>Years of practice spread across specialised areas.</p></div>
    <div class="skills-cats reveal">
${v.skill_groups.map((g, gi) => `<div class="skill-cat" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${gi}">&#x2715;</button>
      <h5 ${_editable(`skills.${gi}.category`)}>${g.category || 'Skills'}</h5>
      <ul ${_listEditable(`skills.${gi}.skills`)}>${(g.skills ?? []).map(s => `<li>${s}</li>`).join('')}</ul>
    </div>`).join('\n')}
    </div>
    <button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
  </div>
</section>` : '';

	// EXPERIENCE
	const expHtml = v.experience?.length
		? `<section class="section" id="experience">
  <div class="wrap">
    <div class="section-head reveal"><h2>Professional experience.</h2><p>A timeline of engagements, not just employers.</p></div>
    <div class="timeline reveal">
${v.experience.map((exp, i) => `<div class="tl-item" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
      <div class="tl-head"><h4 ${_editable(`experience.${i}.role`)}>${exp.role}</h4>${datePeriod(i, exp)}</div>
      ${exp.company ? `<div class="tl-company"><span ${_editable(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${_editable(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
      ${exp.description ? `<p class="tl-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
      ${exp.key_points?.length ? `<ul ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
    </div>`).join('\n')}
    </div>
    <button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
  </div>
</section>` : '';

	// FINANCIAL MODELING — case-study cards
	const finHtml = v.financial_modeling?.length
		? `<section class="section" id="financial_modeling">
  <div class="wrap">
    <div class="section-head reveal"><h2>Selected work.</h2><p>Financial models worth a longer look — the tools and the outcome.</p></div>
    <div class="work-grid reveal">
${v.financial_modeling.map((f, i) => `<div class="work-card" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">&#x2715;</button>
      <span class="work-tag">Model</span>
      <h4 ${_editable(`financial_modeling.${i}.model_type`)}>${f.model_type}</h4>
      ${f.outcome ? `<div class="work-flow" ${_editable(`financial_modeling.${i}.outcome`, true)}>${f.outcome}</div>` : ''}
      ${f.tools_used?.length ? `<div class="work-tools" ${_listEditable(`financial_modeling.${i}.tools_used`)}>${f.tools_used.map(t => `<span class="work-tool">${t}</span>`).join('')}</div>` : ''}
    </div>`).join('\n')}
    </div>
    <button class="add-btn ce-add-btn" data-add-section="financial_modeling">+ Add Financial Model</button>
  </div>
</section>` : '';

	// INVESTMENT PORTFOLIOS
	const invHtml = v.investment_portfolios?.length
		? `<section class="section" id="investment_portfolios">
  <div class="wrap">
    <div class="section-head reveal"><h2>Investment portfolios.</h2><p>Mandates managed, with scale and performance.</p></div>
    <div class="inv-grid reveal">
${v.investment_portfolios.map((p, i) => `<div class="inv-card" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">&#x2715;</button>
      <h4 class="inv-type" ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${p.portfolio_type}</h4>
      ${p.assets_under_management ? `<div class="inv-row"><span class="k">AUM</span><span class="val" ${_editable(`investment_portfolios.${i}.assets_under_management`)}>${p.assets_under_management}</span></div>` : ''}
      ${p.performance_return ? `<div class="inv-row"><span class="k">Return</span><span class="val pos" ${_editable(`investment_portfolios.${i}.performance_return`)}>${p.performance_return}</span></div>` : ''}
    </div>`).join('\n')}
    </div>
    <button class="add-btn ce-add-btn" data-add-section="investment_portfolios">+ Add Portfolio</button>
  </div>
</section>` : '';

	// EDUCATION + CERTIFICATIONS (two-col, separate sections styled cohesively)
	const educationHtml = v.education?.length
		? `<section class="section" id="education">
  <div class="wrap">
    <div class="section-head reveal"><h2>Education.</h2></div>
    <div class="entry-list reveal">
${v.education.map((edu, i) => `<div class="entry" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
      <div class="entry-num">${String(i + 1).padStart(2, '0')}</div>
      <div><h5>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h5><p>${edu.institution ? `<span ${_editable(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${eduYears(i, edu) ? ` — ${eduYears(i, edu)}` : ''}${edu.grade_or_score ? ` · <span ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}</p></div>
    </div>`).join('\n')}
    </div>
    <button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
  </div>
</section>` : '';

	const certsHtml = v.certifications?.length
		? `<section class="section" id="certifications">
  <div class="wrap">
    <div class="section-head reveal"><h2>Certifications.</h2></div>
    <div class="entry-list reveal">
${v.certifications.map((c, i) => `<div class="entry" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
      <div class="entry-num">${String(i + 1).padStart(2, '0')}</div>
      <div><h5 ${_editable(`certifications.${i}.name`)}>${c.name}</h5><p>${c.issuer ? `<span ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</span>` : ''}${c.year ? ` — <span ${_editable(`certifications.${i}.year`)}>${c.year}</span>` : ''}${c.url ? ` · <a href="${c.url}" class="ach-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}</p></div>
    </div>`).join('\n')}
    </div>
    <button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
  </div>
</section>` : '';

	// ACHIEVEMENTS
	const achHtml = v.achievements?.length
		? `<section class="section" id="achievements">
  <div class="wrap">
    <div class="section-head reveal"><h2>Achievements &amp; recognition.</h2><p>Milestones that mattered more than the plaque.</p></div>
    <div class="ach-grid reveal">
${v.achievements.map((a, i) => `<div class="ach-card" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
      <div class="ach-icon">&#9733;</div>
      <div>${a.year ? `<span class="ach-year" ${_editable(`achievements.${i}.year`)}>${a.year}</span>` : ''}<h5 ${_editable(`achievements.${i}.title`)}>${a.title}</h5>${a.description ? `<p ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}${a.url ? `<a href="${a.url}" class="ach-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}</div>
    </div>`).join('\n')}
    </div>
    <button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
  </div>
</section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length) return '';
			const cards = cs.items.map((item, i) => `<div class="ach-card" data-item-wrap data-cs-idx="${ci}">
      <button class="del-btn ce-del-btn" data-del-section="custom_sections.${ci}" data-del-index="${i}">&#x2715;</button>
      <div class="ach-icon">&#9679;</div>
      <div>${item.subtitle ? `<span class="ach-year" ${_editable(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}${item.label ? `<h5 ${_editable(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</h5>` : ''}${item.value ? `<p ${_editable(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</p>` : ''}${item.tags?.length ? `<div class="work-tools" style="border:none;padding-top:8px" ${_listEditable(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="work-tool" style="background:var(--cream-2);color:var(--ink-soft)">${t}</span>`).join('')}</div>` : ''}${item.url ? `<a href="${item.url}" class="ach-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}</div>
    </div>`).join('\n');
			return `<section class="section" id="${cs.section_id}">
  <div class="wrap">
    <div class="section-head reveal"><h2>${cs.title}</h2></div>
    <div class="ach-grid reveal">${cards}</div>
    <button class="add-btn ce-add-btn" data-add-section="custom_sections.${ci}.items">+ Add Item</button>
  </div>
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		skills: skillsHtml, experience: expHtml, financial_modeling: finHtml,
		investment_portfolios: invHtml, education: educationHtml, certifications: certsHtml,
		achievements: achHtml, custom_sections: customHtml,
	};
	const orderedSections = order
		.filter(k => !hidden.has(k) && k in sectionMap)
		.map(k => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	// TOOLS MARQUEE — from skills (all) if present.
	const allSkills = (v.skill_groups ?? []).flatMap(g => g.skills).filter(Boolean);
	const toolsStrip = allSkills.length
		? `<div class="tools-strip"><div class="tools-track">${allSkills.concat(allSkills).map(t => `<span>${t}</span>`).join('')}</div></div>` : '';

	// CONTACT
	const contactRows = [
		v.email ? `<div class="row"><span class="lbl">Email</span><span class="val" ${_editable('profile.email')}>${v.email}</span></div>` : '',
		v.phone ? `<div class="row"><span class="lbl">Phone</span><span class="val" ${_editable('profile.phone')}>${v.phone}</span></div>` : '',
		v.location ? `<div class="row"><span class="lbl">Location</span><span class="val" ${_editable('profile.location')}>${v.location}</span></div>` : '',
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">in · LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">&#127760; · Website</a>` : '',
		v.email ? `<a href="mailto:${v.email}">@ · Email</a>` : '',
	].filter(Boolean).join('');
	const contactHtml = (contactRows || socials)
		? `<section class="section" id="contact">
  <div class="wrap contact-grid">
    <div class="contact-info reveal">
      <p class="eyebrow">Get in touch</p>
      <h2>Let's talk about your numbers.</h2>
      <p>Whether it's a single engagement or an ongoing advisory retainer, I typically respond within one business day.</p>
      <div class="contact-rows">${contactRows}</div>
      ${socials ? `<div class="social-row">${socials}</div>` : ''}
    </div>
    <div class="contact-side reveal"><div class="mark">${inits}</div><div class="lbl">Open to Engagements</div></div>
  </div>
</section>` : '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Finance</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<header>
  <div class="nav">
    <div class="logo"><span class="logo-mark">${inits}</span> <span ${_editable('profile.full_name')}>${v.name}</span></div>
    <nav class="menu"><ul>${navItems}</ul></nav>
    <a href="#contact" class="btn">Book a consultation</a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <p class="eyebrow">${v.profile_headline ? `<span ${_editable('profile.headline')}>${v.profile_headline}</span>` : 'Finance Professional'}${v.location ? ` · ${v.location}` : ''}</p>
        <h1 ${_editable('portfolio.headline')}>${v.headline || v.name}</h1>
        ${v.bio ? `<p class="lede" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
        <div class="hero-actions">
          <a href="#financial_modeling" class="btn">View Work</a>
          <a href="#contact" class="btn ghost">Contact Me</a>
        </div>
        ${heroMeta ? `<div class="hero-meta">${heroMeta}</div>` : ''}
      </div>
      <div class="hero-visual">
        <div class="portrait-card" ${_imgUpload('profile.profile_image', em)}>
          ${statShown(v, 'years_experience', years) ? `<div class="float-badge"><strong><span ${ted('years_experience')}>${years}</span>+</strong><span>Years Experience</span></div>` : ''}
          ${portrait}
          <div class="portrait-tag"><span class="dot"></span> Available for engagements</div>
        </div>
      </div>
    </div>
  </section>

  <div class="ticker-strip"><div class="ticker-track">${ticker}</div></div>

  ${aboutHtml}
  ${statsHtml}
  ${orderedSections}
  ${toolsStrip}
  ${contactHtml}
</main>

<footer>
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <div class="logo" style="color:var(--cream)"><span class="logo-mark" style="background:transparent;border-color:var(--cream);color:var(--cream)">${inits}</span> ${v.name}</div>
        <p>${v.headline || 'Finance professional'} helping businesses report, plan, and grow with confidence.</p>
      </div>
    </div>
    <div class="foot-bottom">
      <p>&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</p>
      <p>${v.location || ''}</p>
    </div>
  </div>
</footer>
${LEDGER_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
