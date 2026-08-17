/**
 * Template: Cadence
 * Sales theme — the whole portfolio sits inside a single rounded, shadowed
 * "card" floating on a warm cream canvas. Newsreader display serif over Inter
 * body copy with Space Mono labels, a two-column headline/portrait hero, a
 * conversational intro block, and a signature SVG quota gauge flanked by KPI
 * cards. Alternating plain / tinted / charcoal section bands.
 * Palette: cream #EFEBE1, card #FBF9F3, card-soft #F4F0E6, ink #2A2619,
 * gold #AD7A2C, gold-deep #8A5F1E, charcoal #252017, sage #57624C.
 * Fonts: Newsreader (display serif) · Inter (body) · Space Mono (labels).
 * Signature: animated quota gauge sweep, scroll reveals, expandable deal
 * details, image thumb strips, card hover lifts, mobile drawer nav.
 *
 * Ported from templates_add/sales_portfolio-02.html. The source's Performance
 * table (invented per-quarter targets), Languages table and dot-meter tool
 * ratings have no backing field in our data model and are dropped rather than
 * shipped as dead controls (Z15/Z16); the tools block becomes the data-backed
 * software_proficiency chip panel, and the source's separate "Projects" and
 * "Clients" blocks collapse into the single `deals` section the sales model
 * actually carries.
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap';

const ICON: Record<string, string> = {
	linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4z"/></svg>',
	github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>',
	x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.7zM17.8 20.2h1.7L7.3 3.7H5.5z"/></svg>',
	link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7L12.2 19"/></svg>'
};

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

/**
 * Best-effort percentage for the hero gauge, read from the most recent role's
 * `quota_attainment` (e.g. "128% of $2.4M quota (FY23)" → 128). Returns 0 when
 * no role states one, which makes statShown() hide the gauge entirely rather
 * than draw an invented number.
 */
function quotaPct(experience: NormalizedData['experience']): number {
	for (const exp of experience ?? []) {
		const m = (exp.quota_attainment ?? '').match(/(\d{1,3}(?:\.\d+)?)\s*%/);
		if (m) return Math.round(parseFloat(m[1]));
	}
	return 0;
}

function css(v: NormalizedData): string {
	const em = v.edit_mode;
	return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --cream:#EFEBE1;
  --card:#FBF9F3;
  --card-soft:#F4F0E6;
  --ink:#2A2619;
  --ink-soft:#726B58;
  --ink-faint:#A39C87;
  --gold:#AD7A2C;
  --gold-deep:#8A5F1E;
  --charcoal:#252017;
  --sage:#57624C;
  --line:rgba(42,38,25,0.13);
  --shadow:0 40px 80px -40px rgba(42,38,25,0.35);
}

html{scroll-behavior:smooth}
body{background:var(--cream);color:var(--ink);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
ul{list-style:none}
h1,h2,h3,h4{font-family:'Newsreader',serif;font-weight:500;line-height:1.15}
img{max-width:100%;display:block}
::selection{background:var(--gold);color:var(--card)}
.mono{font-family:'Space Mono',monospace}

/* ---------- OUTER FRAME ---------- */
.frame{max-width:1320px;margin:28px auto;background:var(--card);border-radius:26px;box-shadow:var(--shadow);overflow:hidden}
@media(max-width:900px){.frame{margin:0;border-radius:0}}

/* ---------- REVEAL ---------- */
.reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}#gaugeArc{transition:none}}

/* ---------- NAV ---------- */
nav.top{display:flex;align-items:center;justify-content:space-between;padding:34px 56px 0;position:relative}
.brand{font-family:'Newsreader',serif;font-size:19px;letter-spacing:0.01em}
.nav-links{display:flex;gap:34px;align-items:center}
.nav-links a{font-size:14px;color:var(--ink-soft);transition:color .2s}
.nav-links a:hover{color:var(--ink);text-decoration:underline;text-underline-offset:5px;text-decoration-color:var(--gold)}
.nav-toggle{display:none;background:none;border:none;font-size:22px;cursor:pointer;color:var(--ink);line-height:1}
@media(max-width:860px){
  nav.top{padding:26px 24px 0}
  .nav-links{position:absolute;left:0;right:0;top:64px;background:var(--card);flex-direction:column;align-items:flex-start;gap:0;max-height:0;overflow:hidden;transition:max-height .3s ease;z-index:50;border-bottom:1px solid var(--line)}
  .nav-links.open{max-height:520px;padding:10px 0 20px}
  .nav-links a{padding:12px 24px;width:100%}
  .nav-toggle{display:block}
}

/* ---------- HERO ---------- */
.hero{display:grid;grid-template-columns:1.05fr 0.95fr;gap:60px;padding:56px 56px 0;align-items:start}
.hero-eyebrow{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:14px}
.hero-headline{font-size:clamp(38px,4.6vw,58px);line-height:1.08;letter-spacing:-0.01em;margin-top:14px}
.hero-name{font-family:'Newsreader',serif;font-size:22px;color:var(--ink-soft);margin-top:18px}
.hero-photo{position:relative;border-radius:18px;overflow:hidden;height:440px;background:var(--card-soft)}
.hero-photo img{width:100%;height:100%;object-fit:cover}
.hero-photo .ph-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Newsreader',serif;font-size:64px;color:var(--ink-faint)}
@media(max-width:900px){
  .hero{grid-template-columns:1fr;padding:36px 24px 0;gap:30px}
  .hero-photo{height:320px;order:-1}
}

.hero-bottom{display:grid;grid-template-columns:0.85fr 1.15fr;gap:60px;padding:44px 56px 0}
.wave-line{font-size:16px;color:var(--ink);font-family:'Newsreader',serif}
.hero-body p{font-size:14.5px;line-height:1.75;color:var(--ink-soft);margin-bottom:14px}
.cta-btn{display:inline-block;background:var(--charcoal);color:var(--card);font-size:11.5px;letter-spacing:0.08em;text-transform:uppercase;padding:15px 26px;border-radius:100px;margin-top:6px;border:none;cursor:pointer;transition:transform .2s ease,background .2s ease}
.cta-btn:hover{transform:translateY(-2px);background:var(--gold-deep)}
@media(max-width:900px){.hero-bottom{grid-template-columns:1fr;padding:28px 24px 0;gap:18px}}

/* ---------- KPI / GAUGE ---------- */
.kpi-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:34px;align-items:center;padding:56px}
.gauge-wrap{display:flex;flex-direction:column;align-items:center;gap:10px}
.gauge-label{font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-faint)}
#gaugeArc{transition:stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)}
.kpi-card{background:var(--card-soft);border-radius:16px;padding:24px 26px}
.kpi-num{font-family:'Space Mono',monospace;font-size:32px;color:var(--gold-deep);font-weight:700}
.kpi-tag{font-size:12.5px;color:var(--ink-soft);margin-top:6px}
@media(max-width:900px){.kpi-row{grid-template-columns:1fr;padding:36px 24px;gap:24px;justify-items:center}}

/* ---------- SECTION SHELL ---------- */
section.block{padding:64px 56px;border-top:1px solid var(--line)}
section.block.tint{background:var(--card-soft)}
section.block.dark{background:var(--charcoal);color:var(--card);border-top:none}
.eyebrow{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:14px}
.block.dark .eyebrow{color:var(--gold)}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:40px;flex-wrap:wrap}
.section-title{font-size:clamp(26px,3vw,36px)}
.block.dark .section-title{color:var(--card)}
.section-sub{font-size:14px;color:var(--ink-soft);max-width:440px;margin-top:8px;line-height:1.6}
.block.dark .section-sub{color:rgba(251,249,243,0.62)}
@media(max-width:760px){section.block{padding:48px 24px}}

/* ---------- TAGS ---------- */
.tag-row{display:flex;flex-wrap:wrap;gap:8px}
.tag{font-size:12.5px;padding:7px 13px;border-radius:100px;background:var(--card-soft);border:1px solid var(--line)}
.block.tint .tag{background:var(--card)}
.block.dark .tag{background:rgba(251,249,243,0.06);border-color:rgba(251,249,243,0.18);color:var(--card)}

/* ---------- SKILLS ---------- */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:32px}
.skill-group{position:relative}
.skill-group-title{font-size:13.5px;font-weight:600;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--line)}

/* ---------- PANEL ---------- */
.panel{background:var(--card-soft);border:1px solid var(--line);border-radius:16px;padding:28px 30px}
.block.tint .panel{background:var(--card)}

/* ---------- EXPERIENCE ---------- */
.exp-card{position:relative;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:30px 32px;margin-bottom:22px;transition:transform .25s ease,box-shadow .25s ease}
.exp-card:hover{transform:translateY(-3px);box-shadow:0 26px 50px -34px rgba(42,38,25,0.55)}
.exp-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:14px}
.exp-role{font-family:'Newsreader',serif;font-size:21px}
.exp-company{color:var(--gold-deep);font-weight:600;font-family:'Inter',sans-serif;font-size:15px;margin-top:2px}
.exp-meta{font-family:'Space Mono',monospace;font-size:11.5px;color:var(--ink-faint);text-align:right}
.exp-body{font-size:14px;line-height:1.7;color:var(--ink-soft);margin-bottom:16px}
.exp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:16px}
.meta-label{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:4px}
.meta-value{font-size:13px;font-weight:500}
.exp-list li{font-size:13.5px;line-height:1.7;color:var(--ink-soft);padding-left:16px;position:relative}
.exp-list li::before{content:'\\2022';position:absolute;left:0;color:var(--gold)}
.exp-stats{display:flex;gap:14px;flex-wrap:wrap;margin-top:18px}
.exp-stat{background:var(--card-soft);border-radius:10px;padding:12px 16px;min-width:130px}
.block.tint .exp-stat{background:var(--card)}
.exp-stat .lbl{font-family:'Space Mono',monospace;font-size:9.5px;text-transform:uppercase;color:var(--ink-faint)}
.exp-stat .val{font-family:'Space Mono',monospace;font-size:18px;color:var(--gold-deep);font-weight:700;margin-top:3px}
@media(max-width:640px){.exp-card{padding:24px 20px}.exp-meta{text-align:left}}

/* ---------- DEALS ---------- */
.deals-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:26px}
.deal-card{position:relative;background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:transform .25s ease,box-shadow .25s ease}
.deal-card:hover{transform:translateY(-3px);box-shadow:0 26px 50px -34px rgba(42,38,25,0.55)}
.deal-body{padding:22px 24px 26px;display:flex;flex-direction:column;gap:10px}
.deal-name{font-family:'Newsreader',serif;font-size:19px}
.deal-type{font-family:'Space Mono',monospace;font-size:10.5px;text-transform:uppercase;color:var(--gold-deep)}
.deal-desc{font-size:13px;line-height:1.6;color:var(--ink-soft)}
.deal-stats{display:flex;gap:10px;flex-wrap:wrap}
.deal-stats .exp-stat{flex:1;min-width:120px;padding:10px 12px}
.deal-stats .val{font-size:15px}
details.deal-details{margin-top:4px;border-top:1px solid var(--line);padding-top:12px}
details.deal-details summary{cursor:pointer;font-size:12px;color:var(--gold-deep);font-weight:600;list-style:none;display:flex;align-items:center;gap:6px}
details.deal-details summary::-webkit-details-marker{display:none}
details.deal-details summary::after{content:'+';margin-left:auto;font-size:15px}
details.deal-details[open] summary::after{content:'\\2013'}
.details-body{padding-top:14px;font-size:12.5px;line-height:1.7;color:var(--ink-soft);display:flex;flex-direction:column;gap:12px}
.drow-k{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:6px}
.deal-list li{padding-left:15px;position:relative;line-height:1.65}
.deal-list li::before{content:'\\2022';position:absolute;left:0;color:var(--gold)}
.deal-outcomes{border-left:2px solid var(--gold);padding-left:14px}
.deal-outcomes li{font-family:'Newsreader',serif;font-style:italic;font-size:13.5px;color:var(--gold-deep);line-height:1.6;padding:2px 0}

/* ---------- IMAGE SHOTS (Z12) ---------- */
.shots{position:relative;width:100%;height:190px;overflow:hidden;background:var(--card-soft);flex:none}
.shots img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s ease}
.shots img.active{opacity:1}
.shots-dots{position:absolute;bottom:10px;left:12px;display:flex;gap:5px;z-index:2}
.shots-dots i{width:6px;height:6px;border-radius:50%;background:rgba(251,249,243,0.55)}
.shots-dots i.on{background:var(--gold)}
.exp-shots{height:120px;max-width:280px;border-radius:10px;margin-top:16px}

/* ---------- ACHIEVEMENTS ---------- */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.ach-card{position:relative;border:1px solid rgba(251,249,243,0.15);border-radius:14px;padding:24px 22px;background:rgba(251,249,243,0.05);transition:transform .25s ease,border-color .25s ease}
.ach-card:hover{transform:translateY(-3px);border-color:rgba(173,122,44,0.65)}
.ach-year{font-family:'Space Mono',monospace;font-size:11px;color:var(--gold)}
.ach-title{font-family:'Newsreader',serif;font-size:18px;margin:8px 0}
.ach-desc{font-size:13px;line-height:1.6;color:rgba(251,249,243,0.66)}
.ach-link{font-size:11.5px;color:var(--gold);border-bottom:1px solid var(--gold);display:inline-block;margin-top:10px}

/* ---------- EDU / CERT ---------- */
.split-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:8px 56px}
.edu-item,.cert-item{position:relative;border-bottom:1px solid var(--line);padding:18px 0}
.edu-degree{font-family:'Newsreader',serif;font-size:17px}
.edu-inst{color:var(--gold-deep);font-weight:600;font-size:13.5px;margin-top:4px}
.edu-meta{font-family:'Space Mono',monospace;font-size:11px;color:var(--ink-faint);margin-top:6px}
.cert-item{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}
.cert-name{font-family:'Newsreader',serif;font-size:16px}
.cert-issuer{font-size:12.5px;color:var(--gold-deep);font-weight:600;margin-top:3px}
.cert-link{font-family:'Space Mono',monospace;font-size:10.5px;color:var(--gold-deep);margin-top:5px;display:inline-block;border-bottom:1px solid var(--gold-deep)}
.cert-year{font-family:'Space Mono',monospace;font-size:12px;color:var(--ink-faint);white-space:nowrap}

/* ---------- CUSTOM SECTIONS ---------- */
.cs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.cs-card{position:relative;border:1px solid var(--line);border-radius:12px;padding:18px 20px;background:var(--card-soft)}
.block.tint .cs-card{background:var(--card)}
.cs-list{display:flex;flex-direction:column}
.cs-list-item{position:relative;border-bottom:1px solid var(--line);padding:16px 0}
.cs-timeline{border-left:1px solid var(--line);padding-left:24px;display:flex;flex-direction:column;gap:20px}
.cs-tl-item{position:relative}
.cs-tl-item::before{content:'';position:absolute;left:-29px;top:6px;width:9px;height:9px;border-radius:50%;background:var(--gold)}
.cs-sub{font-family:'Space Mono',monospace;font-size:10.5px;color:var(--gold-deep);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em}
.cs-label{font-weight:600;font-size:14px;margin-bottom:6px}
.cs-value{font-size:12.5px;color:var(--ink-soft);line-height:1.6}
.cs-link{font-family:'Space Mono',monospace;font-size:10.5px;color:var(--gold-deep);border-bottom:1px solid var(--gold-deep);display:inline-block;margin-top:10px}

/* ---------- CONTACT ---------- */
.contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px;align-items:start}
.contact-tagline{font-family:'Newsreader',serif;font-size:21px;line-height:1.45;color:var(--card);max-width:520px}
.contact-rows{margin-top:24px;display:flex;flex-direction:column;gap:16px}
.contact-k{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(251,249,243,0.45);margin-bottom:5px}
.contact-v{font-size:14.5px;color:var(--card)}
.contact-cta{border:1px solid rgba(251,249,243,0.18);border-radius:16px;padding:30px 28px;background:rgba(251,249,243,0.04)}
.contact-cta h3{font-size:20px;color:var(--card);margin-bottom:10px}
.contact-cta p{font-size:13px;line-height:1.7;color:rgba(251,249,243,0.62);margin-bottom:18px}
.btn-gold{display:inline-block;background:var(--gold);color:var(--charcoal);font-size:11.5px;letter-spacing:0.08em;text-transform:uppercase;padding:14px 24px;border-radius:100px;font-weight:600;transition:transform .2s ease,background .2s ease}
.btn-gold:hover{transform:translateY(-2px);background:#c9913c}
.socials{display:flex;gap:12px;margin-top:20px}
.socials a{width:36px;height:36px;border-radius:50%;border:1px solid rgba(251,249,243,0.22);display:flex;align-items:center;justify-content:center;color:rgba(251,249,243,0.75);transition:all .2s ease}
.socials a svg{width:15px;height:15px}
.socials a:hover{background:var(--gold);border-color:var(--gold);color:var(--charcoal);transform:translateY(-2px)}

/* ---------- FOOTER ---------- */
footer{background:var(--charcoal);color:rgba(251,249,243,0.6);padding:60px 56px 30px}
.footer-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:36px;margin-bottom:44px}
.footer-name{font-family:'Newsreader',serif;font-size:30px;color:var(--card)}
.footer-links{display:flex;gap:20px;flex-wrap:wrap;align-items:center}
.footer-links a{font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:rgba(251,249,243,0.6);transition:color .2s}
.footer-links a:hover{color:var(--gold)}
.footer-bottom{border-top:1px solid rgba(251,249,243,0.12);padding-top:20px;font-size:11px;font-family:'Space Mono',monospace;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
@media(max-width:760px){footer{padding:44px 24px 26px}}
${em ? '' : ''}
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
	const firstName = v.name.trim().split(/\s+/)[0] || v.name;

	// ── STATS ─────────────────────────────────────────────────────────────────
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const dealsCount = v.template_overrides?.deals_count ?? (v.deals?.length ?? 0);
	const quota = v.template_overrides?.quota_attainment ?? quotaPct(v.experience);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	// r=58 → circumference ≈ 364. Offset shrinks as attainment rises (capped at full).
	const CIRC = 364;
	const gaugeOffset = Math.max(0, Math.round(CIRC * (1 - Math.min(quota, 100) / 100)));
	const gaugeHtml = statShown(v, 'quota_attainment', quota)
		? `<div class="gauge-wrap reveal">
        <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="Quota attainment ${quota}%">
          <circle cx="70" cy="70" r="58" fill="none" stroke="var(--line)" stroke-width="12"/>
          <circle id="gaugeArc" cx="70" cy="70" r="58" fill="none" stroke="var(--gold)" stroke-width="12"
            stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}" data-target="${gaugeOffset}" transform="rotate(-90 70 70)"/>
          <text x="70" y="66" text-anchor="middle" font-family="Space Mono, monospace" font-size="24" font-weight="700" fill="#2A2619">${quota}%</text>
          <text x="70" y="86" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#726B58">of quota</text>
        </svg>
        <div class="gauge-label">Quota Attainment${em ? ` &middot; <span ${ted('quota_attainment')}>${quota}</span>%` : ''}</div>
      </div>` : '';
	const kpiCards = [
		statShown(v, 'years_experience', years)
			? `<div class="kpi-card reveal"><div class="kpi-num"><span ${ted('years_experience')}>${years}</span>+</div><div class="kpi-tag">Years carrying a number</div></div>` : '',
		statShown(v, 'deals_count', dealsCount)
			? `<div class="kpi-card reveal"><div class="kpi-num"><span ${ted('deals_count')}>${dealsCount}</span></div><div class="kpi-tag">Deals &amp; accounts closed</div></div>` : ''
	].filter(Boolean).join('');

	/** Crossfading gallery for an item's images[] (Z12). */
	const shots = (images: string[], path: string, cls = ''): string => {
		if (!images.length && !em) return '';
		const imgs = images.map((src, k) => `<img src="${src}" alt=""${k === 0 ? ' class="active"' : ''}>`).join('');
		const dots = images.length > 1
			? `<div class="shots-dots">${images.map((_, k) => `<i${k === 0 ? ' class="on"' : ''}></i>`).join('')}</div>`
			: '';
		return `<div class="shots${cls ? ` ${cls}` : ''}" ${_imgUpload(path, em, 'Upload image')}>${imgs}${dots}</div>`;
	};

	const head = (eyebrow: string, title: string, sub: string, add: string): string => `
    <div class="eyebrow reveal">${eyebrow}</div>
    <div class="section-head reveal">
      <div>
        <h2 class="section-title">${title}</h2>
        ${sub ? `<p class="section-sub">${sub}</p>` : ''}
      </div>
      ${add}
    </div>`;

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = `<section class="block tint" id="skills">
    ${head('Core Skills', 'How I sell', 'Methodology, pipeline discipline, and the tools I run it on.', addBtn('skills', 'Skill Group'))}
    <div class="skills-grid">
${v.skill_groups.map((g, gi) => `      <div class="skill-group reveal"${iw}>
        ${delBtn('skills', gi)}
        <div class="skill-group-title" ${ed(`skills.${gi}.category`)}>${g.category}</div>
        <div class="tag-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
      </div>`).join('\n')}
    </div>
</section>`;

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = `<section class="block" id="experience">
    ${head('Professional Experience', "Where I've carried a number", 'Role, market, and what the quarter actually said.', addBtn('experience', 'Experience'))}
    <div>
${v.experience.map((exp, i) => {
		const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
		// Territory sits in the meta grid; quota attainment gets the source design's
		// highlighted stat chip, which is where a sales resume's headline number belongs.
		const metaPairs = exp.territory
			? `<div><div class="meta-label">Territory</div><div class="meta-value" ${ed(`experience.${i}.territory`)}>${exp.territory}</div></div>`
			: '';
		const expStats = exp.quota_attainment
			? `<div class="exp-stats"><div class="exp-stat"><div class="lbl">Quota Attainment</div><div class="val" ${ed(`experience.${i}.quota_attainment`)}>${exp.quota_attainment}</div></div></div>`
			: '';
		return `      <div class="exp-card reveal"${iw}>
        ${delBtn('experience', i)}
        <div class="exp-top">
          <div>
            ${exp.role ? `<div class="exp-role" ${ed(`experience.${i}.role`)}>${exp.role}</div>` : ''}
            ${exp.company ? `<div class="exp-company" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
          </div>
          <div class="exp-meta">
            ${exp.location ? `<div ${ed(`experience.${i}.location`)}>${exp.location}</div>` : ''}
            ${period ? `<div>${period}</div>` : ''}
          </div>
        </div>
        ${exp.description ? `<p class="exp-body" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
        ${metaPairs ? `<div class="exp-grid">${metaPairs}</div>` : ''}
        ${exp.key_points?.length ? `<ul class="exp-list" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
        ${expStats}
        ${shots(exp.images ?? [], `experience.${i}.images`, 'exp-shots')}
      </div>`;
	}).join('\n')}
    </div>
</section>`;

	// ── DEALS ─────────────────────────────────────────────────────────────────
	const dealsHtml = `<section class="block tint" id="deals">
    ${head('Deals &amp; Accounts', 'Sneak peek of recent deals', 'The accounts I owned — what they needed, how it was sold, and what it grew into.', addBtn('deals', 'Deal'))}
    <div class="deals-grid">
${v.deals.map((d, i) => {
		const period = _rangeEditable(`deals.${i}.start_date`, d.start_date, `deals.${i}.end_date`, d.end_date, em, ' — ');
		const metaTags = [
			d.industry ? `<span class="tag" ${ed(`deals.${i}.industry`)}>${d.industry}</span>` : '',
			period ? `<span class="tag">${period}</span>` : '',
			d.sales_cycle_length ? `<span class="tag" ${ed(`deals.${i}.sales_cycle_length`)}>${d.sales_cycle_length}</span>` : ''
		].filter(Boolean).join('');
		const stats = d.deal_value
			? `<div class="deal-stats"><div class="exp-stat"><div class="lbl">Deal Value</div><div class="val" ${ed(`deals.${i}.deal_value`)}>${d.deal_value}</div></div></div>` : '';
		const detailRows = [
			d.products_sold?.length ? `<div><div class="drow-k">Products Sold</div><div class="tag-row" ${le(`deals.${i}.products_sold`)}>${d.products_sold.map((p) => `<span class="tag">${p}</span>`).join('')}</div></div>` : '',
			d.stakeholders_engaged?.length ? `<div><div class="drow-k">Stakeholders Engaged</div><div class="tag-row" ${le(`deals.${i}.stakeholders_engaged`)}>${d.stakeholders_engaged.map((s) => `<span class="tag">${s}</span>`).join('')}</div></div>` : '',
			d.responsibilities?.length ? `<div><div class="drow-k">What I Owned</div><ul class="deal-list" ${le(`deals.${i}.responsibilities`)}>${d.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : '',
			d.measurable_outcomes?.length ? `<div><div class="drow-k">Results</div><ul class="deal-outcomes" ${le(`deals.${i}.measurable_outcomes`)}>${d.measurable_outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : ''
		].filter(Boolean).join('');
		return `      <div class="deal-card reveal"${iw}>
        ${delBtn('deals', i)}
        ${shots(d.images ?? [], `deals.${i}.images`)}
        <div class="deal-body">
          <div class="deal-name" ${ed(`deals.${i}.client_name`)}>${d.client_name || (em ? 'Client / Account' : '')}</div>
          ${d.deal_type ? `<div class="deal-type" ${ed(`deals.${i}.deal_type`)}>${d.deal_type}</div>` : ''}
          ${metaTags ? `<div class="tag-row">${metaTags}</div>` : ''}
          ${d.description ? `<p class="deal-desc" ${ed(`deals.${i}.description`, true)}>${d.description}</p>` : ''}
          ${stats}
          ${detailRows ? `<details class="deal-details"${em ? ' open' : ''}><summary>Details</summary><div class="details-body">${detailRows}</div></details>` : ''}
        </div>
      </div>`;
	}).join('\n')}
    </div>
</section>`;

	// ── SALES METHODOLOGIES ───────────────────────────────────────────────────
	const methodologiesHtml = `<section class="block" id="sales_methodologies">
    ${head('Methodology', 'How I run a deal', 'The frameworks behind the qualification, the discovery and the close.', '')}
    <div class="panel reveal">
      <div class="tag-row" ${le('sales_methodologies')}>${v.sales_methodologies.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
    </div>
</section>`;

	// ── SOFTWARE PROFICIENCY ──────────────────────────────────────────────────
	const softwareHtml = `<section class="block" id="software_proficiency">
    ${head('Tools &amp; Technologies', 'Stack I run the desk on', 'CRM, prospecting and revenue-intelligence tooling I work in daily.', '')}
    <div class="panel reveal">
      <div class="tag-row" ${le('software_proficiency')}>${v.software_proficiency.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
    </div>
</section>`;

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = `<section class="block dark" id="achievements">
    ${head('Achievements', 'Recognition along the way', 'Not every quarter makes the highlight reel — these did.', addBtn('achievements', 'Achievement'))}
    <div class="ach-grid">
${v.achievements.map((a, i) => `      <div class="ach-card reveal"${iw}>
        ${delBtn('achievements', i)}
        ${a.year ? `<div class="ach-year mono" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <div class="ach-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.description ? `<p class="ach-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
        ${a.url ? `<a class="ach-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View announcement &rarr;</a>` : ''}
      </div>`).join('\n')}
    </div>
</section>`;

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = `<section class="block" id="education">
    ${head('Education', 'Foundations', '', addBtn('education', 'Education'))}
    <div class="split-grid">
${v.education.map((edu, i) => {
		const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, ' — ');
		const meta = [
			edu.location ? `<span ${ed(`education.${i}.location`)}>${edu.location}</span>` : '',
			yr,
			edu.grade_or_score ? `<span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''
		].filter(Boolean).join(' · ');
		return `      <div class="edu-item reveal"${iw}>
        ${delBtn('education', i)}
        <div class="edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
        ${edu.institution ? `<div class="edu-inst" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
        ${meta ? `<div class="edu-meta">${meta}</div>` : ''}
      </div>`;
	}).join('\n')}
    </div>
</section>`;

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certsHtml = `<section class="block tint" id="certifications">
    ${head('Certifications', 'Credentials', '', addBtn('certifications', 'Certification'))}
    <div class="split-grid">
${v.certifications.map((c, i) => `      <div class="cert-item reveal"${iw}>
        ${delBtn('certifications', i)}
        <div>
          <div class="cert-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
          ${c.issuer ? `<div class="cert-issuer" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
          ${c.url ? `<a class="cert-link" href="${c.url}" target="_blank" rel="noopener noreferrer">Verify &rarr;</a>` : ''}
        </div>
        ${c.year ? `<div class="cert-year mono" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
      </div>`).join('\n')}
    </div>
</section>`;

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customHtml = (v.custom_sections ?? []).map((cs, ci) => {
		if (!cs.items?.length && !em) return '';
		const items = cs.items ?? [];
		const sub = (i: number, t: string) => t ? `<div class="cs-sub" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${t}</div>` : '';
		const label = (i: number, t: string) => t ? `<div class="cs-label" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${t}</div>` : '';
		const value = (i: number, t: string) => t ? `<div class="cs-value" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${t}</div>` : '';
		const tags = (i: number, t: string[]) => t?.length
			? `<div class="tag-row" style="margin-top:12px" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span class="tag">${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="cs-link" href="${u}" target="_blank" rel="noopener noreferrer">View &rarr;</a>` : '';
		const inner = (it: typeof items[number], i: number) =>
			`${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}`;

		let body: string;
		if (cs.display_type === 'timeline') {
			body = `<div class="cs-timeline">${items.map((it, i) => `<div class="cs-tl-item"${iw}>${inner(it, i)}</div>`).join('')}</div>`;
		} else if (cs.display_type === 'list') {
			body = `<div class="cs-list">${items.map((it, i) => `<div class="cs-list-item"${iw}>${inner(it, i)}</div>`).join('')}</div>`;
		} else {
			body = `<div class="cs-grid">${items.map((it, i) => `<div class="cs-card"${iw}>${inner(it, i)}</div>`).join('')}</div>`;
		}
		return `<section class="block" id="${cs.section_id}">
    ${head('More', `<span ${ed(`custom_sections.${ci}.title`)}>${cs.title}</span>`, '', addBtn(`custom_sections.${ci}.items`, 'Item'))}
    <div class="reveal">${body}</div>
</section>`;
	}).filter(Boolean).join('\n');

	// ── ORDERED SECTIONS ──────────────────────────────────────────────────────
	const sectionMap: Record<string, string> = {
		skills: (v.skill_groups?.length || em) ? skillsHtml : '',
		experience: (v.experience?.length || em) ? experienceHtml : '',
		deals: (v.deals?.length || em) ? dealsHtml : '',
		sales_methodologies: v.sales_methodologies?.length ? methodologiesHtml : '',
		software_proficiency: v.software_proficiency?.length ? softwareHtml : '',
		achievements: (v.achievements?.length || em) ? achievementsHtml : '',
		education: (v.education?.length || em) ? educationHtml : '',
		certifications: (v.certifications?.length || em) ? certsHtml : '',
		custom_sections: customHtml
	};
	const activeKeys = order.filter((k) => !hidden.has(k) && sectionMap[k]);
	const orderedSections = activeKeys.map((k) => sectionMap[k]).join('\n');

	// ── NAV ───────────────────────────────────────────────────────────────────
	const NAV_LABELS: Record<string, string> = {
		skills: 'Skills', experience: 'Experience', deals: 'Deals',
		sales_methodologies: 'Methodology', software_proficiency: 'Tools',
		achievements: 'Achievements', education: 'Education', certifications: 'Certifications'
	};
	const navKeys = activeKeys.filter((k) => k !== 'custom_sections');
	const navItems = navKeys.map((k) => `<a href="#${k}">${NAV_LABELS[k] ?? k}</a>`).join('') +
		'<a href="#contact">Get in touch</a>';

	// ── CONTACT ───────────────────────────────────────────────────────────────
	const contactRows = [
		v.email ? `<div><div class="contact-k">Email</div><div class="contact-v" ${ed('profile.email')}>${v.email}</div></div>` : '',
		v.phone ? `<div><div class="contact-k">Phone</div><div class="contact-v" ${ed('profile.phone')}>${v.phone}</div></div>` : '',
		v.location ? `<div><div class="contact-k">Based in</div><div class="contact-v" ${ed('profile.location')}>${v.location}</div></div>` : ''
	].filter(Boolean).join('');
	const socialLinks = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${ICON.linkedin}</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" aria-label="X">${ICON.x}</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${ICON.github}</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" aria-label="Website">${ICON.link}</a>` : ''
	].filter(Boolean).join('');
	const contactHtml = (contactRows || socialLinks)
		? `<section class="block dark" id="contact">
    <div class="eyebrow reveal">Get in touch</div>
    <div class="contact-grid">
      <div class="reveal">
        <p class="contact-tagline" ${ed('profile.contact_tagline', true)}>${v.contact_tagline || "Let's talk pipeline — where it is now, and where it should be next quarter."}</p>
        <div class="contact-rows">${contactRows}</div>
      </div>
      <div class="contact-cta reveal">
        <h3>Open to the next number.</h3>
        <p>Send over the territory, the segment and the target — I&#39;ll come back with how I&#39;d build the pipeline against it.</p>
        ${v.email ? `<a class="btn-gold" href="mailto:${v.email}">Let&#39;s talk &rarr;</a>` : ''}
        ${socialLinks ? `<div class="socials">${socialLinks}</div>` : ''}
      </div>
    </div>
</section>` : '';

	const footerLinks = navKeys.slice(0, 5).map((k) => `<a href="#${k}">${NAV_LABELS[k] ?? k}</a>`).join('');

	// ── RUNTIME ───────────────────────────────────────────────────────────────
	const RUNTIME = `<script>
(function(){
  var t=document.getElementById('navToggle'),l=document.getElementById('navLinks');
  if(t&&l){
    t.addEventListener('click',function(){l.classList.toggle('open');});
    l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');});});
  }

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
  },{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  var arc=document.getElementById('gaugeArc');
  if(arc){
    var swept=false;
    var sweep=function(){if(swept)return;swept=true;arc.setAttribute('stroke-dashoffset',arc.dataset.target);};
    var go=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){requestAnimationFrame(sweep);go.unobserve(e.target);}
      });
    },{threshold:0.3});
    go.observe(arc);
    /* Failsafe: an un-swept arc reads as 0% rather than "not animated yet", so
       draw it anyway if the observer never fires (scaled preview iframes, tabs
       restored in the background, reduced-motion setups). */
    setTimeout(sweep,1400);
  }

  document.querySelectorAll('.shots').forEach(function(box){
    var imgs=box.querySelectorAll('img');
    if(imgs.length<2)return;
    var dots=box.querySelectorAll('.shots-dots i'),i=0;
    setInterval(function(){
      imgs[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('on');
      i=(i+1)%imgs.length;
      imgs[i].classList.add('active'); if(dots[i])dots[i].classList.add('on');
    },3200);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var h=this.getAttribute('href');
      if(h.length<2)return;
      var target=document.querySelector(h);
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
    });
  });
})();
<\/script>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${v.name} — ${v.profile_headline || 'Sales Portfolio'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css(v)}</style>
</head>
<body>
<div class="frame">

  <nav class="top">
    <div class="brand" ${ed('profile.full_name')}>${v.name}</div>
    <div class="nav-links" id="navLinks">${navItems}</div>
    <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
  </nav>

  <div class="hero" id="top">
    <div>
      ${v.profile_headline ? `<div class="hero-eyebrow" ${ed('profile.headline')}>${v.profile_headline}</div>` : ''}
      ${v.headline ? `<h1 class="hero-headline" ${ed('portfolio.headline')}>${v.headline}</h1>` : `<h1 class="hero-headline" ${ed('profile.full_name')}>${v.name}</h1>`}
      ${v.headline ? `<div class="hero-name" ${ed('profile.full_name')}>${v.name}</div>` : ''}
    </div>
    <div class="hero-photo" ${_imgUpload('profile.profile_image', em)}>
      ${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="ph-mark">${inits}</div>`}
    </div>
  </div>

  <div class="hero-bottom">
    <div>
      <p class="wave-line">&#128075; Hi there — ${firstName} here</p>
    </div>
    <div class="hero-body">
      ${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
      ${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
      ${v.email ? `<a class="cta-btn" href="mailto:${v.email}">Let&#39;s talk</a>` : ''}
    </div>
  </div>

  ${(gaugeHtml || kpiCards) ? `<div class="kpi-row">${gaugeHtml}${kpiCards}</div>` : ''}

${orderedSections}
${contactHtml}

  <footer>
    <div class="footer-top">
      <div class="footer-name">${v.name}</div>
      ${footerLinks ? `<div class="footer-links">${footerLinks}</div>` : ''}
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</span>
      <span>${v.profile_headline || 'Sales &amp; Business Development'}</span>
    </div>
  </footer>
</div>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
