/**
 * Template: Clarion
 * Sales theme — editorial "deal ledger" on an ivory canvas with a parchment hero
 * panel, ink-dark bands and a forest/brass/rust accent trio. Fraunces display
 * serif over Inter body copy with IBM Plex Mono labels, numbered section tabs,
 * a dark pipeline stat strip under the hero, bordered cards and a dark footer.
 * Palette: ink #14181A, parchment #F1EAD9, ivory #FBF8F2, forest #1F4436,
 * brass #AD8636, rust #8A3B27.
 * Fonts: Fraunces (display serif) · Inter (body) · IBM Plex Mono (labels).
 * Signature: bobbing scroll cue, numbered section tabs, dark stat strip, card
 * hover lifts, sticky nav with mobile drawer, scroll reveals.
 *
 * Ported from templates_add/sales_portfolio-01.html. The source's Performance
 * table (invented per-quarter targets), Languages table and dot-meter tool
 * ratings have no field behind them in our data model, so they are dropped
 * rather than shipped as dead controls (Z15/Z16); the tools block becomes the
 * data-backed software_proficiency chip panel and the source's "Clients" and
 * "Projects" blocks collapse into the single `deals` section our sales model
 * actually carries.
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

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

function css(v: NormalizedData): string {
	const em = v.edit_mode;
	return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --ink:#14181A;
  --ink-soft:#1E2422;
  --parchment:#F1EAD9;
  --parchment-soft:#F8F4EA;
  --ivory:#FBF8F2;
  --forest:#1F4436;
  --forest-soft:#2C5A48;
  --brass:#AD8636;
  --brass-light:#D7B96A;
  --rust:#8A3B27;
  --line:rgba(20,24,26,0.12);
  --ink-text:#1B1812;
  --muted:#4A4436;
  --muted-soft:#6B6455;
  --faint:#8a8474;
}

html{scroll-behavior:smooth}
body{
  background:var(--ivory);color:var(--ink-text);
  font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
a{color:inherit;text-decoration:none}
ul{list-style:none}
h1,h2,h3,h4{font-family:'Fraunces',serif;font-weight:500;line-height:1.15}
img{max-width:100%;display:block}
::selection{background:var(--forest);color:var(--parchment)}
.mono{font-family:'IBM Plex Mono',monospace}

.container{max-width:1240px;margin:0 auto;padding:0 40px}

/* ---------- REVEAL ---------- */
.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}

/* ---------- NAV ---------- */
header.nav{position:sticky;top:0;z-index:100;background:var(--ink);border-bottom:1px solid rgba(241,234,217,0.12)}
.nav-inner{max-width:1240px;margin:0 auto;padding:0 40px;display:flex;align-items:center;justify-content:space-between;height:64px;color:var(--parchment)}
.nav-mark{font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:0.14em;color:var(--brass);font-weight:600}
.nav-links{display:flex;gap:30px;align-items:center}
.nav-links a{font-size:12.5px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(241,234,217,0.72);transition:color .2s ease}
.nav-links a:hover{color:var(--brass)}
.nav-toggle{display:none;background:none;border:none;color:var(--parchment);font-size:22px;cursor:pointer;line-height:1}
@media(max-width:980px){
  .nav-links{position:absolute;top:64px;left:0;right:0;background:var(--ink);flex-direction:column;align-items:flex-start;gap:0;max-height:0;overflow:hidden;transition:max-height .3s ease}
  .nav-links.open{max-height:640px;padding:8px 0 20px}
  .nav-links a{padding:10px 40px;width:100%}
  .nav-toggle{display:block}
}

/* ---------- HERO ---------- */
.hero{display:grid;grid-template-columns:1fr 1fr;min-height:640px;background:var(--ink)}
.hero-left{background:var(--parchment);padding:76px 64px 56px;display:flex;flex-direction:column;justify-content:center;gap:26px;position:relative}
.hero-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:var(--rust);display:flex;align-items:center;gap:10px}
.hero-eyebrow::before{content:'';width:26px;height:1px;background:var(--rust);display:inline-block;flex:none}
.hero-name{font-size:clamp(46px,6vw,84px);line-height:0.98;color:var(--ink-text);letter-spacing:-0.01em;font-weight:500}
.hero-headline{font-size:17px;line-height:1.5;color:#4A4436;max-width:440px;font-weight:400}
.hero-summary{font-size:14.5px;line-height:1.7;color:#5B5546;max-width:460px}
.hero-contacts{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:6px}
.hero-contacts .chip{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#4A4436;display:flex;align-items:center;gap:6px}
.hero-links{display:flex;flex-wrap:wrap;gap:14px;margin-top:4px;align-items:center}
.hero-links a{font-size:12px;letter-spacing:0.05em;text-transform:uppercase;color:var(--forest);border-bottom:1px solid var(--forest);padding-bottom:2px;font-weight:600;display:inline-flex;align-items:center;gap:7px;transition:color .2s ease,border-color .2s ease}
.hero-links a svg{width:14px;height:14px}
.hero-links a:hover{color:var(--rust);border-color:var(--rust)}
.hero-right{position:relative;overflow:hidden;background:var(--ink-soft);min-height:420px}
.hero-photo-frame{position:absolute;inset:0}
.hero-photo-frame img{width:100%;height:100%;object-fit:cover;object-position:center 20%;filter:saturate(1.02) contrast(1.03)}
.hero-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:76px;color:rgba(241,234,217,0.28);letter-spacing:0.05em}
.hero-frame-accent{position:absolute;top:22px;left:22px;right:22px;bottom:22px;border:1px solid rgba(241,234,217,0.35);pointer-events:none;z-index:3}
.scroll-cue{position:absolute;bottom:30px;left:64px;width:44px;height:44px;border-radius:50%;border:1px solid var(--rust);display:flex;align-items:center;justify-content:center;color:var(--rust);animation:bob 2.6s ease-in-out infinite;z-index:4}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
@media(max-width:980px){
  .hero{grid-template-columns:1fr}
  .hero-right{height:420px;order:-1}
  .hero-left{padding:60px 26px 48px}
  .scroll-cue{display:none}
}

/* ---------- PIPELINE STRIP ---------- */
.pipeline{background:var(--ink);color:var(--parchment);border-top:1px solid rgba(241,234,217,0.1)}
.pipeline-inner{max-width:1240px;margin:0 auto;padding:0 40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}
.pipeline-item{padding:26px 24px;border-right:1px solid rgba(241,234,217,0.12)}
.pipeline-item:last-child{border-right:none}
.pipeline-label{font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(241,234,217,0.5);margin-bottom:8px}
.pipeline-value{font-family:'IBM Plex Mono',monospace;font-size:26px;color:var(--brass);font-weight:600}
@media(max-width:720px){
  .pipeline-inner{grid-template-columns:repeat(2,1fr);padding:0 20px}
  .pipeline-item{border-bottom:1px solid rgba(241,234,217,0.12)}
}

/* ---------- SECTION SHELL ---------- */
section.block{padding:96px 0;border-bottom:1px solid var(--line)}
section.block.dark{background:var(--ink);color:var(--parchment);border-bottom:none}
.section-tab{display:inline-flex;align-items:center;gap:10px;font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--rust);padding:6px 14px 6px 0;margin-bottom:20px;border-bottom:1px solid var(--line)}
.block.dark .section-tab{color:var(--brass);border-color:rgba(241,234,217,0.18)}
.section-tab .tab-index{background:var(--ink);color:var(--parchment);padding:4px 9px;border-radius:2px;font-size:10.5px}
.block.dark .section-tab .tab-index{background:var(--brass);color:var(--ink)}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:44px;flex-wrap:wrap}
.section-title{font-size:clamp(28px,3.4vw,42px);letter-spacing:-0.01em}
.section-sub{font-size:14.5px;color:var(--muted-soft);max-width:460px;margin-top:10px;line-height:1.6}
.block.dark .section-sub{color:rgba(241,234,217,0.6)}

/* ---------- TAGS ---------- */
.tag-row{display:flex;flex-wrap:wrap;gap:9px}
.tag{font-size:12.5px;padding:7px 13px;border:1px solid var(--line);border-radius:100px;background:var(--parchment-soft);color:var(--ink-text)}
.block.dark .tag{background:rgba(241,234,217,0.06);border-color:rgba(241,234,217,0.2);color:var(--parchment)}

/* ---------- SKILLS ---------- */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:36px}
.skill-group{position:relative}
.skill-group-title{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest);margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--line)}

/* ---------- PANEL (list sections) ---------- */
.panel{border:1px solid var(--line);border-radius:8px;background:var(--parchment-soft);padding:30px 32px}

/* ---------- EXPERIENCE ---------- */
.exp-card{position:relative;border:1px solid var(--line);border-radius:6px;padding:32px 36px;margin-bottom:24px;background:var(--ivory);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
.exp-card:hover{transform:translateY(-3px);box-shadow:0 22px 44px -30px rgba(20,24,26,0.5);border-color:rgba(173,134,54,0.5)}
.exp-top{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:18px}
.exp-role{font-family:'Fraunces',serif;font-size:22px;font-weight:500}
.exp-company{color:var(--forest);font-weight:600}
.exp-meta{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--faint);text-align:right}
.exp-body{font-size:14px;line-height:1.7;color:var(--muted);margin-bottom:18px}
.exp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;margin-bottom:18px}
.meta-pair .meta-label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#a39a83;margin-bottom:4px}
.meta-pair .meta-value{font-size:13.5px;color:#2B281F;font-weight:500}
.exp-list{margin-top:10px}
.exp-list li{font-size:13.5px;line-height:1.7;color:var(--muted);padding-left:16px;position:relative}
.exp-list li::before{content:'—';position:absolute;left:0;color:var(--brass)}
@media(max-width:640px){.exp-card{padding:24px 20px}.exp-meta{text-align:left}}

/* ---------- DEALS ---------- */
.deals-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:28px}
.deal-card{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--ivory);position:relative;display:flex;flex-direction:column;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
.deal-card:hover{transform:translateY(-3px);box-shadow:0 22px 44px -30px rgba(20,24,26,0.5);border-color:rgba(173,134,54,0.5)}
.deal-body{padding:24px 26px 28px;display:flex;flex-direction:column;gap:12px}
.deal-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.deal-name{font-family:'Fraunces',serif;font-size:20px;font-weight:500}
.deal-type{font-family:'IBM Plex Mono',monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:0.06em;color:var(--rust);white-space:nowrap;margin-top:5px}
.deal-desc{font-size:13.5px;line-height:1.65;color:var(--muted)}
.deal-stats,.exp-stats{display:flex;gap:14px;flex-wrap:wrap}
.exp-stats{margin-top:20px}
.exp-stats .stat-chip{flex:0 1 auto}
.stat-chip{background:var(--ink);color:var(--parchment);padding:12px 16px;border-radius:6px;flex:1;min-width:130px}
.stat-chip .stat-label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(241,234,217,0.5)}
.stat-chip .stat-num{font-family:'IBM Plex Mono',monospace;font-size:17px;color:var(--brass);font-weight:600;margin-top:4px}
.deal-sub{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#a39a83;margin-bottom:7px}
.deal-list li{font-size:13px;line-height:1.7;color:var(--muted);padding-left:16px;position:relative}
.deal-list li::before{content:'—';position:absolute;left:0;color:var(--brass)}
.deal-outcomes{border-left:2px solid var(--forest);padding-left:14px}
.deal-outcomes li{font-family:'Fraunces',serif;font-style:italic;font-size:14px;color:var(--forest);line-height:1.6;padding:2px 0}

/* ---------- IMAGE SHOTS (Z12) ---------- */
.shots{position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;background:var(--parchment) linear-gradient(160deg,rgba(31,68,54,0.12),rgba(173,134,54,0.1));flex:none}
.shots img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s ease}
.shots img.active{opacity:1}
.shots-dots{position:absolute;bottom:10px;right:12px;display:flex;gap:5px;z-index:2}
.shots-dots i{width:6px;height:6px;border-radius:50%;background:rgba(251,248,242,0.5)}
.shots-dots i.on{background:var(--brass)}
.exp-shots{max-width:320px;border-radius:6px;margin-top:16px}

/* ---------- ACHIEVEMENTS (dark) ---------- */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.ach-card{border:1px solid rgba(241,234,217,0.16);border-radius:8px;padding:26px 24px;position:relative;background:var(--ink-soft);transition:transform .25s ease,border-color .25s ease}
.ach-card:hover{transform:translateY(-3px);border-color:rgba(173,134,54,0.6)}
.ach-year{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--brass);letter-spacing:0.06em}
.ach-title{font-family:'Fraunces',serif;font-size:19px;margin:8px 0 10px}
.ach-desc{font-size:13.5px;line-height:1.65;color:rgba(241,234,217,0.68)}
.ach-link{font-size:11.5px;color:var(--brass);border-bottom:1px solid var(--brass);display:inline-block;margin-top:12px}

/* ---------- EDUCATION / CERTS ---------- */
.split-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px 60px}
.edu-item,.cert-item{border-bottom:1px solid var(--line);padding:20px 0;position:relative}
.edu-degree{font-family:'Fraunces',serif;font-size:18px}
.edu-inst{color:var(--forest);font-weight:600;font-size:14px;margin-top:4px}
.edu-meta{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--faint);margin-top:6px}
.cert-item{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}
.cert-name{font-family:'Fraunces',serif;font-size:17px}
.cert-issuer{font-size:12.5px;color:var(--forest);margin-top:4px;font-weight:600}
.cert-link{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--rust);margin-top:6px;display:inline-block;border-bottom:1px solid var(--rust)}
.cert-year{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--rust);white-space:nowrap}

/* ---------- CUSTOM SECTIONS ---------- */
.cs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}
.cs-card{border:1px solid var(--line);border-radius:8px;padding:22px 24px;position:relative;background:var(--parchment-soft)}
.cs-list{display:flex;flex-direction:column;gap:2px}
.cs-list-item{border-bottom:1px solid var(--line);padding:16px 0;position:relative}
.cs-timeline{border-left:1px solid var(--line);padding-left:26px;display:flex;flex-direction:column;gap:22px}
.cs-tl-item{position:relative}
.cs-tl-item::before{content:'';position:absolute;left:-31px;top:6px;width:9px;height:9px;border-radius:50%;background:var(--brass)}
.cs-sub{font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--rust);margin-bottom:7px}
.cs-label{font-family:'Fraunces',serif;font-size:17px;margin-bottom:6px}
.cs-value{font-size:13.5px;color:var(--muted);line-height:1.65}
.cs-link{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--forest);border-bottom:1px solid var(--forest);display:inline-block;margin-top:10px}

/* ---------- CONTACT ---------- */
.contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px;align-items:start}
.contact-tagline{font-family:'Fraunces',serif;font-size:22px;line-height:1.45;color:var(--parchment);max-width:520px}
.contact-rows{margin-top:26px;display:flex;flex-direction:column;gap:18px}
.contact-k{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(241,234,217,0.45);margin-bottom:5px}
.contact-v{font-size:15px;color:var(--parchment)}
.contact-cta{border:1px solid rgba(241,234,217,0.25);border-radius:8px;padding:32px 30px;background:var(--ink-soft)}
.contact-cta h3{font-size:22px;color:var(--parchment);margin-bottom:12px}
.contact-cta p{font-size:13.5px;line-height:1.7;color:rgba(241,234,217,0.62);margin-bottom:20px}
.btn-brass{display:inline-block;background:var(--brass);color:var(--ink);font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:0.08em;text-transform:uppercase;padding:13px 22px;border-radius:100px;font-weight:600;transition:transform .2s ease,background .2s ease}
.btn-brass:hover{transform:translateY(-2px);background:var(--brass-light)}
.socials{display:flex;gap:12px;margin-top:22px}
.socials a{width:38px;height:38px;border-radius:50%;border:1px solid rgba(241,234,217,0.25);display:flex;align-items:center;justify-content:center;color:rgba(241,234,217,0.75);transition:all .2s ease}
.socials a svg{width:16px;height:16px}
.socials a:hover{background:var(--brass);border-color:var(--brass);color:var(--ink);transform:translateY(-2px)}

/* ---------- FOOTER ---------- */
footer{background:var(--ink);color:rgba(241,234,217,0.6);padding:70px 0 30px;border-top:1px solid rgba(241,234,217,0.12)}
.footer-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:40px;margin-bottom:50px}
.footer-name{font-family:'Fraunces',serif;font-size:34px;color:var(--parchment)}
.footer-links{display:flex;gap:22px;flex-wrap:wrap;align-items:center}
.footer-links a{font-size:12.5px;text-transform:uppercase;letter-spacing:0.06em;color:rgba(241,234,217,0.6);transition:color .2s ease}
.footer-links a:hover{color:var(--brass)}
.footer-bottom{border-top:1px solid rgba(241,234,217,0.12);padding-top:22px;font-size:11.5px;font-family:'IBM Plex Mono',monospace;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}

@media(max-width:640px){
  .container{padding:0 20px}
  section.block{padding:64px 0}
  .skills-grid{gap:26px}
  .footer-name{font-size:26px}
}
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

	// ── STATS ─────────────────────────────────────────────────────────────────
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const dealsCount = v.template_overrides?.deals_count ?? (v.deals?.length ?? 0);
	const clientsCount =
		v.template_overrides?.clients_count ??
		new Set((v.deals ?? []).map((d) => d.client_name).filter(Boolean)).size;
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	const pipelineItems = [
		statShown(v, 'years_experience', years)
			? `<div class="pipeline-item"><div class="pipeline-label">Years Selling</div><div class="pipeline-value"><span ${ted('years_experience')}>${years}</span>+</div></div>` : '',
		statShown(v, 'deals_count', dealsCount)
			? `<div class="pipeline-item"><div class="pipeline-label">Deals Closed</div><div class="pipeline-value"><span ${ted('deals_count')}>${dealsCount}</span></div></div>` : '',
		statShown(v, 'clients_count', clientsCount)
			? `<div class="pipeline-item"><div class="pipeline-label">Accounts Owned</div><div class="pipeline-value"><span ${ted('clients_count')}>${clientsCount}</span></div></div>` : '',
		statShown(v, 'certifications_count', certCount)
			? `<div class="pipeline-item"><div class="pipeline-label">Certifications</div><div class="pipeline-value"><span ${ted('certifications_count')}>${certCount}</span></div></div>` : ''
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

	const sectionHead = (n: number, tab: string, title: string, sub: string, add: string): string => `
    <div class="section-tab reveal"><span class="tab-index">${String(n).padStart(2, '0')}</span> ${tab}</div>
    <div class="section-head reveal">
      <div>
        <h2 class="section-title">${title}</h2>
        ${sub ? `<p class="section-sub">${sub}</p>` : ''}
      </div>
      ${add}
    </div>`;

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = (n: number) => `<section class="block" id="skills">
  <div class="container">
    ${sectionHead(n, 'Core Skills', 'What I bring to the table', 'Sales craft, pipeline discipline and account depth — filed the way a deal desk would.', addBtn('skills', 'Skill Group'))}
    <div class="skills-grid">
${v.skill_groups.map((g, gi) => `      <div class="skill-group reveal"${iw}>
        ${delBtn('skills', gi)}
        <div class="skill-group-title" ${ed(`skills.${gi}.category`)}>${g.category}</div>
        <div class="tag-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
      </div>`).join('\n')}
    </div>
  </div>
</section>`;

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = (n: number) => `<section class="block" id="experience">
  <div class="container">
    ${sectionHead(n, 'Professional Experience', "Where I've carried a number", 'Each role, the market I sold into, and what the quarter-end numbers actually said.', addBtn('experience', 'Experience'))}
    <div>
${v.experience.map((exp, i) => {
		const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
		// Territory sits in the meta grid; quota attainment gets the source design's
		// dark stat chip, which is where a sales resume's headline number belongs.
		const metaPairs = exp.territory
			? `<div class="meta-pair"><div class="meta-label">Territory</div><div class="meta-value" ${ed(`experience.${i}.territory`)}>${exp.territory}</div></div>`
			: '';
		const expStats = exp.quota_attainment
			? `<div class="exp-stats"><div class="stat-chip"><div class="stat-label">Quota Attainment</div><div class="stat-num" ${ed(`experience.${i}.quota_attainment`)}>${exp.quota_attainment}</div></div></div>`
			: '';
		return `      <div class="exp-card reveal"${iw}>
        ${delBtn('experience', i)}
        <div class="exp-top">
          <div class="exp-role">${exp.role ? `<span ${ed(`experience.${i}.role`)}>${exp.role}</span>` : ''}${exp.role && exp.company ? ' · ' : ''}${exp.company ? `<span class="exp-company" ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}</div>
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
  </div>
</section>`;

	// ── DEALS ─────────────────────────────────────────────────────────────────
	const dealsHtml = (n: number) => `<section class="block" id="deals">
  <div class="container">
    ${sectionHead(n, 'Deals &amp; Accounts', "Accounts I've carried", 'Selected deals worth walking a buyer through — the need, the motion, and what landed.', addBtn('deals', 'Deal'))}
    <div class="deals-grid">
${v.deals.map((d, i) => {
		const period = _rangeEditable(`deals.${i}.start_date`, d.start_date, `deals.${i}.end_date`, d.end_date, em, ' — ');
		const metaTags = [
			d.industry ? `<span class="tag" ${ed(`deals.${i}.industry`)}>${d.industry}</span>` : '',
			period ? `<span class="tag">${period}</span>` : '',
			d.sales_cycle_length ? `<span class="tag" ${ed(`deals.${i}.sales_cycle_length`)}>${d.sales_cycle_length}</span>` : ''
		].filter(Boolean).join('');
		const statChips = [
			d.deal_value ? `<div class="stat-chip"><div class="stat-label">Deal Value</div><div class="stat-num" ${ed(`deals.${i}.deal_value`)}>${d.deal_value}</div></div>` : ''
		].filter(Boolean).join('');
		return `      <div class="deal-card reveal"${iw}>
        ${delBtn('deals', i)}
        ${shots(d.images ?? [], `deals.${i}.images`)}
        <div class="deal-body">
          <div class="deal-top">
            <div class="deal-name" ${ed(`deals.${i}.client_name`)}>${d.client_name || (em ? 'Client / Account' : '')}</div>
            ${d.deal_type ? `<div class="deal-type" ${ed(`deals.${i}.deal_type`)}>${d.deal_type}</div>` : ''}
          </div>
          ${metaTags ? `<div class="tag-row">${metaTags}</div>` : ''}
          ${d.description ? `<p class="deal-desc" ${ed(`deals.${i}.description`, true)}>${d.description}</p>` : ''}
          ${statChips ? `<div class="deal-stats">${statChips}</div>` : ''}
          ${d.products_sold?.length ? `<div><div class="deal-sub">Products Sold</div><div class="tag-row" ${le(`deals.${i}.products_sold`)}>${d.products_sold.map((p) => `<span class="tag">${p}</span>`).join('')}</div></div>` : ''}
          ${d.stakeholders_engaged?.length ? `<div><div class="deal-sub">Stakeholders</div><div class="tag-row" ${le(`deals.${i}.stakeholders_engaged`)}>${d.stakeholders_engaged.map((s) => `<span class="tag">${s}</span>`).join('')}</div></div>` : ''}
          ${d.responsibilities?.length ? `<div><div class="deal-sub">What I Owned</div><ul class="deal-list" ${le(`deals.${i}.responsibilities`)}>${d.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : ''}
          ${d.measurable_outcomes?.length ? `<ul class="deal-outcomes" ${le(`deals.${i}.measurable_outcomes`)}>${d.measurable_outcomes.map((o) => `<li>${o}</li>`).join('')}</ul>` : ''}
        </div>
      </div>`;
	}).join('\n')}
    </div>
  </div>
</section>`;

	// ── SALES METHODOLOGIES ───────────────────────────────────────────────────
	const methodologiesHtml = (n: number) => `<section class="block" id="sales_methodologies">
  <div class="container">
    ${sectionHead(n, 'Methodology', 'How I run a deal', 'The frameworks behind the qualification, the discovery and the close.', '')}
    <div class="panel reveal">
      <div class="tag-row" ${le('sales_methodologies')}>${v.sales_methodologies.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>`;

	// ── SOFTWARE PROFICIENCY ──────────────────────────────────────────────────
	const softwareHtml = (n: number) => `<section class="block" id="software_proficiency">
  <div class="container">
    ${sectionHead(n, 'Tools &amp; Technologies', 'Stack I run the desk on', 'CRM, prospecting and revenue-intelligence tooling I work in daily.', '')}
    <div class="panel reveal">
      <div class="tag-row" ${le('software_proficiency')}>${v.software_proficiency.map((s) => `<span class="tag">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>`;

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = (n: number) => `<section class="block dark" id="achievements">
  <div class="container">
    ${sectionHead(n, 'Achievements', 'Recognition along the way', "Not every quarter makes the highlight reel — these did.", addBtn('achievements', 'Achievement'))}
    <div class="ach-grid">
${v.achievements.map((a, i) => `      <div class="ach-card reveal"${iw}>
        ${delBtn('achievements', i)}
        ${a.year ? `<div class="ach-year mono" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <div class="ach-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.description ? `<p class="ach-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
        ${a.url ? `<a class="ach-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View announcement &rarr;</a>` : ''}
      </div>`).join('\n')}
    </div>
  </div>
</section>`;

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = (n: number) => `<section class="block" id="education">
  <div class="container">
    ${sectionHead(n, 'Education', 'Foundations', '', addBtn('education', 'Education'))}
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
  </div>
</section>`;

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certsHtml = (n: number) => `<section class="block" id="certifications">
  <div class="container">
    ${sectionHead(n, 'Certifications', 'Credentials', '', addBtn('certifications', 'Certification'))}
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
  </div>
</section>`;

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	// Numbered over the RENDERED custom sections only, so an empty one being
	// skipped never leaves a gap in the section-tab sequence.
	const customHtml = (startN: number) => (v.custom_sections ?? [])
		.map((cs, ci) => ({ cs, ci }))
		.filter(({ cs }) => cs.items?.length || em)
		.map(({ cs, ci }, n) => {
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
  <div class="container">
    ${sectionHead(startN + n, 'More', `<span ${ed(`custom_sections.${ci}.title`)}>${cs.title}</span>`, '', addBtn(`custom_sections.${ci}.items`, 'Item'))}
    <div class="reveal">${body}</div>
  </div>
</section>`;
	}).join('\n');

	// ── ORDERED SECTIONS (numbered by final position) ─────────────────────────
	const has: Record<string, boolean> = {
		skills: !!(v.skill_groups?.length || em),
		experience: !!(v.experience?.length || em),
		deals: !!(v.deals?.length || em),
		sales_methodologies: !!v.sales_methodologies?.length,
		software_proficiency: !!v.software_proficiency?.length,
		achievements: !!(v.achievements?.length || em),
		education: !!(v.education?.length || em),
		certifications: !!(v.certifications?.length || em),
		custom_sections: (v.custom_sections ?? []).some((cs) => !!cs.items?.length || em)
	};
	const renderers: Record<string, (n: number) => string> = {
		skills: skillsHtml,
		experience: experienceHtml,
		deals: dealsHtml,
		sales_methodologies: methodologiesHtml,
		software_proficiency: softwareHtml,
		achievements: achievementsHtml,
		education: educationHtml,
		certifications: certsHtml,
		custom_sections: customHtml
	};
	const activeKeys = order.filter((k) => !hidden.has(k) && has[k] && renderers[k]);
	let counter = 0;
	const orderedSections = activeKeys.map((k) => {
		counter += 1;
		const out = renderers[k](counter);
		// custom_sections renders N sections; advance past the extras it consumed.
		if (k === 'custom_sections') {
			const rendered = (v.custom_sections ?? []).filter((cs) => cs.items?.length || em).length;
			counter += Math.max(0, rendered - 1);
		}
		return out;
	}).filter(Boolean).join('\n');

	// ── NAV ───────────────────────────────────────────────────────────────────
	const NAV_LABELS: Record<string, string> = {
		skills: 'Skills', experience: 'Experience', deals: 'Deals',
		sales_methodologies: 'Methodology', software_proficiency: 'Tools',
		achievements: 'Achievements', education: 'Education', certifications: 'Certifications'
	};
	const navKeys = activeKeys.filter((k) => k !== 'custom_sections');
	const navItems = navKeys.map((k) => `<a href="#${k}">${NAV_LABELS[k] ?? k}</a>`).join('') +
		'<a href="#contact">Contact</a>';

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
  <div class="container">
    <div class="section-tab reveal"><span class="tab-index">&#9679;</span> Contact</div>
    <div class="contact-grid">
      <div class="reveal">
        <p class="contact-tagline" ${ed('profile.contact_tagline', true)}>${v.contact_tagline || "Let's talk pipeline — where it is now, and where it should be next quarter."}</p>
        <div class="contact-rows">${contactRows}</div>
      </div>
      <div class="contact-cta reveal">
        <h3>Open to the next number.</h3>
        <p>Send over the territory, the segment and the target — I&#39;ll come back with how I&#39;d build the pipeline against it.</p>
        ${v.email ? `<a class="btn-brass" href="mailto:${v.email}">Start a conversation &rarr;</a>` : ''}
        ${socialLinks ? `<div class="socials">${socialLinks}</div>` : ''}
      </div>
    </div>
  </div>
</section>` : '';

	// ── HERO ──────────────────────────────────────────────────────────────────
	const heroLinks = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">${ICON.linkedin} LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">${ICON.link} Portfolio</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">${ICON.x} X</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">${ICON.github} GitHub</a>` : ''
	].filter(Boolean).join('');
	const heroContacts = [
		v.email ? `<span class="chip" ${ed('profile.email')}>${v.email}</span>` : '',
		v.phone ? `<span class="chip" ${ed('profile.phone')}>${v.phone}</span>` : '',
		v.location ? `<span class="chip" ${ed('profile.location')}>${v.location}</span>` : ''
	].filter(Boolean).join('');

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

<header class="nav">
  <div class="nav-inner">
    <div class="nav-mark">${inits}</div>
    <nav class="nav-links" id="navLinks">${navItems}</nav>
    <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
  </div>
</header>

<section class="hero">
  <div class="hero-left">
    ${v.profile_headline ? `<div class="hero-eyebrow"><span ${ed('profile.headline')}>${v.profile_headline}</span></div>` : ''}
    <h1 class="hero-name" ${ed('profile.full_name')}>${v.name}</h1>
    ${v.headline ? `<p class="hero-headline" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
    ${v.bio ? `<p class="hero-summary" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
    ${heroContacts ? `<div class="hero-contacts">${heroContacts}</div>` : ''}
    ${heroLinks ? `<div class="hero-links">${heroLinks}</div>` : ''}
  </div>
  <div class="hero-right">
    <div class="hero-photo-frame" ${_imgUpload('profile.profile_image', em)}>
      ${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="hero-mark">${inits}</div>`}
    </div>
    <div class="hero-frame-accent"></div>
    ${activeKeys.length ? `<a href="#${activeKeys[0]}" class="scroll-cue" aria-label="Scroll">&#8595;</a>` : ''}
  </div>
</section>

${pipelineItems ? `<div class="pipeline"><div class="pipeline-inner">${pipelineItems}</div></div>` : ''}

${orderedSections}
${contactHtml}

<footer>
  <div class="container">
    <div class="footer-top">
      <div class="footer-name">${v.uniqueValue ? `<span ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</span>` : "Let's talk pipeline."}</div>
      ${footerLinks ? `<div class="footer-links">${footerLinks}</div>` : ''}
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</span>
      <span>${v.profile_headline || 'Sales &amp; Business Development'}</span>
    </div>
  </div>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
