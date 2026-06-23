/**
 * Template: Precision
 * Mechanical-engineering theme — warm ivory canvas with a fixed engineering
 * blueprint background (gears, title block, P&ID schematic, section callouts)
 * and brass-gold accents.
 * Palette: ivory #F2EFE9, charcoal #1A1A1C, gold #B8944A, steel #4A5A6A.
 * Features: blueprint SVG backdrop + radial overlay, serif display headings,
 * photo frame with corner marks, hero stat bar, spec-sheet panel, scroll
 * reveals, experience timeline.
 * Fonts: Cormorant Garamond · DM Sans · DM Mono.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap';

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

const SKILL_ICONS = ['⚙️', '🔬', '🏭', '🌡️', '📋', '📐'];

function css(): string {
	return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ivory:#F2EFE9;--ivory-2:#E8E4DC;--ivory-3:#DDD8CE;
  --charcoal:#1A1A1C;--charcoal-2:#2C2C2E;--muted:#5A5650;--ghost:#8A847C;
  --gold:#B8944A;--gold-lt:#D4AE6A;--gold-dim:rgba(184,148,74,0.10);
  --steel:#4A5A6A;--blue-steel:#2E3E50;
  --rule:rgba(90,80,60,0.13);--rule-md:rgba(90,80,60,0.20);
  --card:rgba(255,252,246,0.80);--card-border:rgba(184,148,74,0.16);
}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--ivory);color:var(--charcoal);overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
ul{list-style:none}
.bg-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.bg-canvas svg{position:absolute;inset:0;width:100%;height:100%}
.bg-overlay{position:fixed;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 90% 70% at 50% 50%,rgba(242,239,233,0.82) 0%,rgba(242,239,233,0.55) 100%)}

nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:20px 64px;background:rgba(242,239,233,0.90);backdrop-filter:blur(24px) saturate(1.3);border-bottom:1px solid var(--rule)}
.nav-logo{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:20px;letter-spacing:0.04em;color:var(--charcoal)}
.nav-logo span{color:var(--gold)}
.nav-links{display:flex;gap:36px}
.nav-links a{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--gold)}

section{position:relative;z-index:2;padding:112px 64px;max-width:1180px;margin:0 auto}
#hero{max-width:100%;padding-top:140px;padding-bottom:80px;min-height:100vh;display:flex;flex-direction:column;justify-content:center}
.hero-inner{max-width:1180px;margin:0 auto;width:100%}
.lbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:12px;margin-bottom:16px}
.lbl::before{content:'';width:28px;height:1px;background:var(--gold);flex-shrink:0}
h2.stitle{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,62px);font-weight:400;letter-spacing:-0.01em;color:var(--charcoal);margin-bottom:60px;line-height:1.08}
.divider{width:100%;height:1px;background:var(--rule-md);position:relative;z-index:2;max-width:1180px;margin:0 auto}

/* HERO */
.hero-grid{display:grid;grid-template-columns:1fr auto;gap:60px;align-items:center}
.hero-badge{display:inline-flex;align-items:center;gap:10px;padding:7px 16px;border:1px solid var(--card-border);background:var(--card);margin-bottom:36px}
.badge-dot{width:6px;height:6px;border-radius:50%;background:var(--gold)}
.badge-txt{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted)}
.hero-name{font-family:'Cormorant Garamond',serif;font-size:clamp(54px,8.5vw,118px);font-weight:300;line-height:.92;letter-spacing:-0.025em;color:var(--charcoal);margin-bottom:20px}
.hero-name em{font-style:italic;color:var(--gold)}
.hero-role{font-size:15px;font-weight:400;color:var(--muted);letter-spacing:0.06em;margin-bottom:28px}
.hero-bio{font-size:15.5px;font-weight:300;color:var(--muted);max-width:440px;line-height:1.85;margin-bottom:44px}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.btn-p{display:inline-flex;align-items:center;gap:9px;padding:13px 34px;background:var(--charcoal);color:var(--ivory);font-weight:400;font-size:12px;letter-spacing:.1em;text-transform:uppercase;transition:background .2s}
.btn-p:hover{background:var(--gold)}
.btn-g{display:inline-flex;align-items:center;gap:9px;padding:13px 34px;border:1px solid var(--rule-md);color:var(--charcoal);font-size:12px;letter-spacing:.1em;text-transform:uppercase;background:transparent;transition:border-color .2s,color .2s}
.btn-g:hover{border-color:var(--gold);color:var(--gold)}
.hero-photo-wrap{position:relative;flex-shrink:0;width:320px}
.photo-frame{width:300px;height:380px;position:relative;background:var(--ivory-2);border:1px solid var(--card-border);overflow:hidden}
.photo-frame img{width:100%;height:100%;object-fit:cover}
.photo-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:linear-gradient(145deg,var(--ivory-2),var(--ivory-3))}
.photo-placeholder-icon{font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:300;color:var(--gold);opacity:.55}
.photo-placeholder-txt{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--ghost)}
.photo-frame::before,.photo-frame::after{content:'';position:absolute;z-index:3;width:16px;height:16px;border-color:var(--gold);border-style:solid}
.photo-frame::before{top:10px;left:10px;border-width:1.5px 0 0 1.5px}
.photo-frame::after{bottom:10px;right:10px;border-width:0 1.5px 1.5px 0}
.photo-decorline{position:absolute;right:-18px;top:30px;bottom:30px;width:1px;background:linear-gradient(to bottom,transparent,var(--gold),transparent);opacity:.35}
.hero-stats{display:flex;gap:0;margin-top:80px;padding-top:44px;border-top:1px solid var(--rule);flex-wrap:wrap}
.hstat{flex:1;min-width:120px;padding:0 32px;border-right:1px solid var(--rule)}
.hstat:first-child{padding-left:0}
.hstat:last-child{border-right:none}
.sv{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:300;color:var(--charcoal);line-height:1;margin-bottom:6px;letter-spacing:-0.02em}
.sv sup{font-size:22px;color:var(--gold);vertical-align:super}
.sl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--ghost)}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:72px;align-items:start}
.atext p{font-size:15.5px;line-height:1.88;color:var(--muted);margin-bottom:20px;font-weight:300}
.atext p strong{color:var(--charcoal);font-weight:500}
.aspec{background:var(--card);border:1px solid var(--card-border);padding:40px;backdrop-filter:blur(8px)}
.aspec-hdr{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--rule)}
.arow{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:12px 0;border-bottom:1px solid var(--rule)}
.arow:last-child{border-bottom:none}
.ak{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.1em;color:var(--ghost);text-transform:uppercase;flex-shrink:0}
.av{font-size:13px;font-weight:400;color:var(--charcoal);text-align:right}

/* EDUCATION */
.edu-list{display:flex;flex-direction:column;gap:2px}
.ecard{background:var(--card);border:1px solid var(--rule);border-left:2px solid transparent;padding:34px 40px;display:grid;grid-template-columns:76px 1fr auto;gap:18px 32px;align-items:start;transition:border-left-color .25s,background .25s;backdrop-filter:blur(6px);position:relative}
.ecard:hover{border-left-color:var(--gold);background:rgba(255,252,246,.97)}
.eyear{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;color:var(--gold);padding-top:2px}
.edeg{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:500;color:var(--charcoal);margin-bottom:4px;line-height:1.2}
.eschl{font-size:12.5px;color:var(--ghost);margin-bottom:8px}
.edsc{font-size:13.5px;font-weight:300;color:var(--muted);line-height:1.65}
.ebadge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:5px 12px;border:1px solid var(--card-border);color:var(--gold);height:fit-content;white-space:nowrap;background:var(--gold-dim)}

/* SKILLS */
.skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.sblock{background:var(--card);border:1px solid var(--rule);padding:32px 30px;backdrop-filter:blur(6px);transition:background .2s;position:relative}
.sblock:hover{background:rgba(255,252,246,.97)}
.sicon{font-size:20px;margin-bottom:12px;opacity:.65}
.scat{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:500;color:var(--charcoal);margin-bottom:18px}
.stags{display:flex;flex-wrap:wrap;gap:6px}
.stag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(184,148,74,.2)}

/* PROJECTS */
.projects-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.proj-card{background:var(--card);border:1px solid var(--rule);position:relative;overflow:hidden;display:flex;flex-direction:column;backdrop-filter:blur(6px)}
.proj-img-wrap{position:relative;height:180px;overflow:hidden;background:var(--ivory-2)}
.proj-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.proj-card:hover .proj-img-wrap img{transform:scale(1.04)}
.proj-img-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--ivory-2),var(--ivory-3));font-family:'Cormorant Garamond',serif;font-size:42px;color:var(--gold);opacity:.5}
.proj-body{padding:24px 24px 28px}
.proj-cat{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
.proj-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--charcoal);margin-bottom:8px;line-height:1.2}
.proj-desc{font-size:13px;font-weight:300;color:var(--muted);line-height:1.65;margin-bottom:14px}
.proj-points{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.proj-points li{font-size:12.5px;font-weight:300;color:var(--muted);line-height:1.5;padding-left:14px;position:relative}
.proj-points li::before{content:'\\2014';position:absolute;left:0;color:var(--gold)}
.proj-taglabel{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ghost);margin:14px 0 6px}
.proj-tags{display:flex;flex-wrap:wrap;gap:5px}
.ptag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(184,148,74,.2)}
.ptag.soft{background:rgba(74,90,106,.10);color:var(--steel);border-color:rgba(74,90,106,.2)}
.ptag.ghost{background:transparent;border:1px dashed var(--card-border);color:var(--ghost)}
.plink{display:inline-block;margin-top:14px;margin-right:14px;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--charcoal);border-bottom:1px solid var(--gold);padding-bottom:2px}
.plink:hover{color:var(--gold)}

/* EXPERIENCE */
.exp-tl{position:relative}
.exp-tl::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--rule-md)}
.eitem{padding-left:44px;padding-bottom:56px;position:relative}
.eitem:last-child{padding-bottom:0}
.eitem::before{content:'';position:absolute;left:-4px;top:9px;width:9px;height:9px;background:var(--ivory);border:1.5px solid var(--gold);transform:rotate(45deg)}
.emeta{display:flex;gap:20px;margin-bottom:8px;flex-wrap:wrap}
.eperiod{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;color:var(--gold)}
.eloc{font-family:'DM Mono',monospace;font-size:10px;color:var(--ghost)}
.erole{font-family:'Cormorant Garamond',serif;font-size:25px;font-weight:500;color:var(--charcoal);margin-bottom:2px;line-height:1.2}
.eco{font-size:13px;color:var(--muted);margin-bottom:14px}
.edesc{font-size:14px;font-weight:300;color:var(--muted);line-height:1.82;max-width:640px;margin-bottom:18px}
.epoints{display:flex;flex-direction:column;gap:7px;margin-bottom:16px;max-width:640px}
.epoints li{font-size:13.5px;font-weight:300;color:var(--muted);line-height:1.6;padding-left:16px;position:relative}
.epoints li::before{content:'\\2014';position:absolute;left:0;color:var(--gold)}
.etags{display:flex;flex-wrap:wrap;gap:5px}
.etag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;background:var(--gold-dim);color:var(--gold);border:1px solid rgba(184,148,74,.2)}

/* GENERIC (certs/achievements/awards/custom) */
.gen-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:2px}
.gen-card{background:var(--card);border:1px solid var(--rule);border-left:2px solid transparent;padding:28px 32px;backdrop-filter:blur(6px);transition:border-left-color .25s,background .25s;position:relative}
.gen-card:hover{border-left-color:var(--gold);background:rgba(255,252,246,.97)}
.gen-year{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.14em;color:var(--gold)}
.gen-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--charcoal);margin:4px 0 6px;line-height:1.2}
.gen-meta{font-size:13px;font-weight:300;color:var(--muted);line-height:1.6}
.dp-text{font-size:16px;font-weight:300;color:var(--muted);line-height:1.9;max-width:760px}

/* CONTACT */
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start}
.cintro{font-size:15.5px;font-weight:300;color:var(--muted);line-height:1.85;margin-bottom:44px}
.cchans{display:flex;flex-direction:column;gap:2px}
.cchan{display:flex;align-items:center;gap:18px;padding:16px 0;border-bottom:1px solid var(--rule);transition:gap .25s}
.cchan:hover{gap:26px}
.ch-icon{width:36px;height:36px;border:1px solid var(--rule-md);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;color:var(--muted);transition:border-color .2s,color .2s;font-family:'DM Mono',monospace}
.cchan:hover .ch-icon{border-color:var(--gold);color:var(--gold)}
.ch-lbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--ghost);margin-bottom:2px}
.ch-val{font-size:13.5px;color:var(--charcoal)}
.ch-arr{margin-left:auto;color:var(--gold);font-size:16px}
.cside{background:var(--card);border:1px solid var(--card-border);padding:48px 40px;backdrop-filter:blur(8px);text-align:center}
.cside-mark{font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:300;color:var(--gold);opacity:.5;line-height:1}
.cside-txt{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ghost);margin-top:18px}

footer{position:relative;z-index:2;border-top:1px solid var(--rule);padding:28px 64px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;max-width:1180px;margin:0 auto}
.fcopy{font-family:'DM Mono',monospace;font-size:10px;color:var(--ghost);letter-spacing:.1em}
.fright{font-family:'DM Mono',monospace;font-size:10px;color:var(--ghost)}
.fright span{color:var(--gold)}

/* EDIT CONTROLS */
.add-btn{display:block;margin-top:24px;padding:12px 18px;border:1px dashed var(--card-border);background:var(--card);color:var(--gold);font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;width:100%;text-align:center}
.add-btn:hover{border-color:var(--gold)}
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;border:none;background:rgba(26,26,28,.8);color:#fff;font-size:12px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

/* REVEAL */
.reveal{opacity:0;transform:translateY(22px);transition:opacity .8s ease,transform .8s ease}
.reveal.visible{opacity:1;transform:translateY(0)}

@media(max-width:960px){
  nav{padding:18px 24px}.nav-links{display:none}
  section,#hero{padding-left:24px;padding-right:24px}
  .hero-grid{grid-template-columns:1fr;gap:40px}
  .hero-photo-wrap{order:-1;width:100%}
  .photo-frame{width:200px;height:250px}
  .about-grid,.cgrid{grid-template-columns:1fr;gap:40px}
  .skills-grid,.projects-grid,.gen-grid{grid-template-columns:1fr 1fr}
  .hero-stats{flex-wrap:wrap}
  .hstat{flex:1 1 45%;border-right:none;border-bottom:1px solid var(--rule);padding:16px 0}
  footer{padding:24px;flex-direction:column;gap:10px}
  .ecard{grid-template-columns:1fr}
}
@media(max-width:600px){.skills-grid,.projects-grid,.gen-grid{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const BG_SVG = `<div class="bg-canvas" aria-hidden="true">
<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs><style>.bgel{fill:none;stroke:#8A7A5A;opacity:0.13}.bgel2{fill:none;stroke:#6A5A3A;opacity:0.09}.bgfill{fill:#8A7A5A;opacity:0.06}.bgtxt{font-family:'DM Mono',monospace;font-size:9px;fill:#6A5A3A;opacity:0.18;letter-spacing:0.1em}</style></defs>
  <g transform="translate(-60,-60)">
    <circle cx="180" cy="160" r="140" class="bgel" stroke-width="1"/>
    <circle cx="180" cy="160" r="120" class="bgel" stroke-width="0.5"/>
    <circle cx="180" cy="160" r="48" class="bgel" stroke-width="1"/>
    <g class="bgel" stroke-width="1.2">
      <rect x="170" y="12" width="20" height="28" rx="2"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(30,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(60,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(90,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(120,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(150,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(180,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(210,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(240,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(270,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(300,180,160)"/>
      <rect x="170" y="12" width="20" height="28" rx="2" transform="rotate(330,180,160)"/>
    </g>
    <line x1="180" y1="70" x2="180" y2="250" class="bgel2" stroke-width="0.5"/>
    <line x1="90" y1="160" x2="270" y2="160" class="bgel2" stroke-width="0.5"/>
    <circle cx="180" cy="160" r="8" class="bgel" stroke-width="1"/>
  </g>
  <g transform="translate(1280,700)">
    <circle cx="80" cy="80" r="72" class="bgel" stroke-width="0.8"/>
    <circle cx="80" cy="80" r="56" class="bgel" stroke-width="0.5"/>
    <circle cx="80" cy="80" r="22" class="bgel" stroke-width="0.8"/>
    <g class="bgel" stroke-width="1">
      <rect x="74" y="2" width="12" height="18" rx="1"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(40,80,80)"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(80,80,80)"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(120,80,80)"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(160,80,80)"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(200,80,80)"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(240,80,80)"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(280,80,80)"/>
      <rect x="74" y="2" width="12" height="18" rx="1" transform="rotate(320,80,80)"/>
    </g>
    <line x1="80" y1="20" x2="80" y2="140" class="bgel2" stroke-width="0.5"/>
    <line x1="20" y1="80" x2="140" y2="80" class="bgel2" stroke-width="0.5"/>
    <circle cx="80" cy="80" r="5" class="bgel" stroke-width="0.8"/>
  </g>
  <g transform="translate(950,30)">
    <rect x="0" y="0" width="380" height="200" class="bgel" stroke-width="0.6"/>
    <line x1="0" y1="40" x2="380" y2="40" class="bgel" stroke-width="0.5"/>
    <line x1="0" y1="80" x2="380" y2="80" class="bgel" stroke-width="0.5"/>
    <line x1="0" y1="120" x2="380" y2="120" class="bgel" stroke-width="0.5"/>
    <line x1="0" y1="160" x2="380" y2="160" class="bgel" stroke-width="0.5"/>
    <line x1="120" y1="0" x2="120" y2="200" class="bgel" stroke-width="0.5"/>
    <line x1="240" y1="0" x2="240" y2="200" class="bgel" stroke-width="0.5"/>
    <text x="8" y="28" class="bgtxt">DWG. NO.</text>
    <text x="8" y="58" class="bgtxt">MATERIAL</text>
    <text x="8" y="98" class="bgtxt">TOLERANCE</text>
    <text x="8" y="138" class="bgtxt">SCALE</text>
    <text x="8" y="178" class="bgtxt">DATE</text>
    <text x="128" y="28" class="bgtxt">MW-2024-041</text>
    <text x="128" y="58" class="bgtxt">AISI 316L S/S</text>
    <text x="128" y="98" class="bgtxt">&#177;0.05 mm</text>
    <text x="128" y="138" class="bgtxt">1:2</text>
    <text x="128" y="178" class="bgtxt">2024-11-01</text>
  </g>
  <g transform="translate(0,600)">
    <line x1="40" y1="60" x2="280" y2="60" class="bgel" stroke-width="1.5"/>
    <line x1="40" y1="80" x2="280" y2="80" class="bgel" stroke-width="1.5"/>
    <line x1="280" y1="60" x2="280" y2="180" class="bgel" stroke-width="1.5"/>
    <line x1="280" y1="80" x2="300" y2="80" class="bgel" stroke-width="1.5"/>
    <line x1="300" y1="80" x2="300" y2="200" class="bgel" stroke-width="1.5"/>
    <polygon points="120,40 160,40 140,60" class="bgfill"/>
    <polygon points="120,100 160,100 140,80" class="bgfill"/>
    <text x="40" y="155" class="bgtxt">P&amp;ID &#8212; COOLING CIRCUIT &#8212; LINE 3B</text>
  </g>
  <g transform="translate(1100,380)">
    <circle cx="60" cy="60" r="55" class="bgel" stroke-width="0.7"/>
    <circle cx="60" cy="60" r="44" class="bgel" stroke-width="0.5"/>
    <circle cx="60" cy="60" r="20" class="bgel" stroke-width="0.7"/>
    <line x1="60" y1="0" x2="60" y2="115" class="bgel" stroke-width="0.6" stroke-dasharray="4,3"/>
    <text x="30" y="145" class="bgtxt">SECTION A-A  SCALE 2:1</text>
  </g>
</svg>
</div>
<div class="bg-overlay" aria-hidden="true"></div>`;

const PRECISION_SCRIPT = `<script>
(function(){
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },{threshold:.12});
    reveals.forEach(function(r){io.observe(r);});
  }
})();
<\/script>`;

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const inits = initials(v.name);
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const totalSkills = (v.skill_groups ?? []).reduce((acc, g) => acc + g.skills.length, 0);
	const ted = (key: string) => (v.edit_mode ? `contenteditable="true" data-path="template_overrides.${key}"` : '');
	const em = v.edit_mode;

	// Bind start_date/end_date separately so inline preview edits round-trip with the form.
	const datePeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const showStart = exp.start_date || em;
		const showEnd = exp.end_date || em;
		if (!showStart && !showEnd) return '';
		const s = showStart ? `<span ${_editable(`experience.${i}.start_date`)}>${exp.start_date || 'Start'}</span>` : '';
		const e = showEnd ? `<span ${_editable(`experience.${i}.end_date`)}>${exp.end_date || 'End'}</span>` : '';
		return `<span class="eperiod">${s}${showStart && showEnd ? ' — ' : ''}${e}</span>`;
	};

	// Education years bind to start_year/end_year (form fields), not computed year_range.
	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const showS = edu.start_year || em;
		const showE = edu.end_year || em;
		if (!showS && !showE) return '';
		const s = showS ? `<span ${_editable(`education.${i}.start_year`)}>${edu.start_year || 'Start'}</span>` : '';
		const e = showE ? `<span ${_editable(`education.${i}.end_year`)}>${edu.end_year || 'End'}</span>` : '';
		return `${s}${showS && showE ? '–' : ''}${e}`;
	};

	// Each list field gets its own _listEditable region (never blended), rendered
	// only when it has items — no labels, no placeholder chips.
	const tagRegion = (path: string, arr: string[], cls: string) =>
		arr.length
			? `<div class="proj-tags" ${_listEditable(path)}>${arr.map(t => `<span class="ptag ${cls}">${t}</span>`).join('')}</div>`
			: '';

	const nameParts = v.name.split(/\s+/);
	const firstName = nameParts.slice(0, -1).join(' ') || v.name;
	const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
	const heroName = lastName
		? `${firstName}<br><em>${lastName}</em>`
		: `<em>${firstName}</em>`;

	const NAV_LABELS: Record<string, string> = {
		about: 'About', education: 'Education', skills: 'Skills', projects: 'Projects',
		experience: 'Experience', certifications: 'Certifications', achievements: 'Achievements',
		contact: 'Contact',
	};
	const navAnchors: string[] = [];
	if (v.bio) navAnchors.push('about');
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (['education', 'skills', 'projects', 'experience', 'certifications', 'achievements'].includes(key)) {
			const dk = key === 'skills' ? 'skill_groups' : key;
			const d = (v as unknown as Record<string, unknown>)[dk];
			if (d && Array.isArray(d) && d.length > 0) navAnchors.push(key);
		}
	}
	if (v.email || v.phone || v.location) navAnchors.push('contact');
	const navItems = navAnchors.map(a => `<li><a href="#${a}">${NAV_LABELS[a] ?? a}</a></li>`).join('');

	const photo = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="photo-placeholder"><div class="photo-placeholder-icon">${inits}</div><div class="photo-placeholder-txt">${(v.headline || 'Engineer').slice(0, 24)}</div></div>`;

	const heroStats = [
		years > 0 ? `<div class="hstat"><div class="sv"><span ${ted('years_experience')}>${years}</span><sup>+</sup></div><div class="sl">Years Experience</div></div>` : '',
		projCount > 0 ? `<div class="hstat"><div class="sv"><span ${ted('projects_count')}>${projCount}</span><sup>+</sup></div><div class="sl">Projects Delivered</div></div>` : '',
		certCount > 0 ? `<div class="hstat"><div class="sv"><span ${ted('certifications_count')}>${certCount}</span></div><div class="sl">Certifications</div></div>` : '',
		totalSkills > 0 ? `<div class="hstat"><div class="sv">${totalSkills}</div><div class="sl">Core Skills</div></div>` : '',
	].filter(Boolean).join('');

	// ABOUT
	const specRows = [
		v.headline ? `<div class="arow"><span class="ak">Specialization</span><span class="av" ${_editable('portfolio.headline')}>${v.headline}</span></div>` : '',
		v.location ? `<div class="arow"><span class="ak">Location</span><span class="av" ${_editable('profile.location')}>${v.location}</span></div>` : '',
		years > 0 ? `<div class="arow"><span class="ak">Experience</span><span class="av"><span ${ted('years_experience')}>${years}</span>+ Years</span></div>` : '',
		v.email ? `<div class="arow"><span class="ak">Email</span><span class="av" ${_editable('profile.email')}>${v.email}</span></div>` : '',
		`<div class="arow"><span class="ak">Availability</span><span class="av">Open to Opportunities</span></div>`,
	].filter(Boolean).join('');
	const aboutHtml = v.bio
		? `<section id="about">
  <span class="lbl">About</span>
  <h2 class="stitle">Engineering ideas<br>into reality</h2>
  <div class="about-grid reveal">
    <div class="atext"><p ${_editable('portfolio.bio', true)}>${v.bio}</p></div>
    <div class="aspec"><div class="aspec-hdr">Engineer Specification Sheet</div>${specRows}</div>
  </div>
</section>
<div class="divider"></div>` : '';

	// SKILLS — skill list per group + a software/tools block
	const skillBlocks = (v.skill_groups ?? []).map((g, gi) => `<div class="sblock" data-item-wrap>
  <button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${gi}">&#x2715;</button>
  <div class="sicon">${SKILL_ICONS[gi % SKILL_ICONS.length]}</div>
  <div class="scat" ${_editable(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
  <div class="stags" ${_listEditable(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="stag">${s}</span>`).join('')}</div>
</div>`).join('\n');
	const toolsBlock = (v.software_proficiency?.length || em)
		? `<div class="sblock"><div class="sicon">${SKILL_ICONS[1]}</div><div class="scat">Software &amp; Tools</div><div class="stags" ${_listEditable('software_proficiency')}>${(v.software_proficiency ?? []).length
			? v.software_proficiency.map(s => `<span class="stag">${s}</span>`).join('')
			: `<span class="stag" style="opacity:.6">+ Add</span>`}</div></div>`
		: '';
	const skillsHtml = (!hidden.has('skills') && v.skill_groups?.length) || toolsBlock
		? `<section id="skills">
  <span class="lbl">Skills</span>
  <h2 class="stitle">Core engineering<br>competencies</h2>
  <div class="skills-grid reveal">${skillBlocks}${toolsBlock}</div>
  <button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
</section>
<div class="divider"></div>` : '';

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section id="projects">
  <span class="lbl">Projects</span>
  <h2 class="stitle">Selected<br>engineering work</h2>
  <div class="projects-grid reveal">
${v.projects.map((p, i) => {
		const img = p.images?.[0];
		const links = [
			p.github_repo ? `<a href="${p.github_repo}" class="plink" target="_blank" rel="noopener noreferrer">Repository</a>` : '',
			p.project_url ? `<a href="${p.project_url}" class="plink" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '',
		].filter(Boolean).join('');
		return `<div class="proj-card" data-item-wrap>
  <button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
  <div class="proj-img-wrap" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}>${img ? `<img src="${img}" alt="${p.title}">` : `<div class="proj-img-placeholder">${inits}</div>`}</div>
  <div class="proj-body">
    ${p.project_category ? `<div class="proj-cat" ${_editable(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
    <div class="proj-title" ${_editable(`projects.${i}.title`)}>${p.title}</div>
    ${p.description ? `<p class="proj-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
    ${p.responsibilities?.length ? `<ul class="proj-points" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
    ${p.measurable_outcomes?.length ? `<ul class="proj-points" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul>` : ''}
    ${tagRegion(`projects.${i}.tech_stack`, p.tech_stack ?? [], '')}
    ${tagRegion(`projects.${i}.software_used`, p.software_used ?? [], 'soft')}
    ${links ? `<div>${links}</div>` : ''}
  </div>
</div>`;
	}).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</section>
<div class="divider"></div>` : '';

	// EXPERIENCE timeline
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience">
  <span class="lbl">Experience</span>
  <h2 class="stitle">Professional<br>record</h2>
  <div class="exp-tl reveal">
${v.experience.map((exp, i) => `<div class="eitem" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
    <div class="emeta">${datePeriod(i, exp)}${exp.location ? `<span class="eloc" ${_editable(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>
    <div class="erole" ${_editable(`experience.${i}.role`)}>${exp.role}</div>
    ${exp.company ? `<div class="eco" ${_editable(`experience.${i}.company`)}>${exp.company}</div>` : ''}
    ${exp.description ? `<p class="edesc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
    ${exp.key_points?.length ? `<ul class="epoints" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</section>
<div class="divider"></div>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section id="education">
  <span class="lbl">Education</span>
  <h2 class="stitle">Academic<br>foundation</h2>
  <div class="edu-list reveal">
${v.education.map((edu, i) => `<div class="ecard" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
    <div class="eyear">${eduYears(i, edu) || '—'}</div>
    <div>
      <div class="edeg">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
      ${(edu.institution || edu.location) ? `<div class="eschl"><span ${_editable(`education.${i}.institution`)}>${edu.institution || ''}</span>${(edu.location) ? ` — <span ${_editable(`education.${i}.location`)}>${edu.location || ''}</span>` : ''}</div>` : ''}
    </div>
    ${edu.grade_or_score ? `<div class="ebadge" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</section>
<div class="divider"></div>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section id="certifications">
  <span class="lbl">Credentials</span>
  <h2 class="stitle">Certifications</h2>
  <div class="gen-grid reveal">
${v.certifications.map((c, i) => `<div class="gen-card" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
    ${c.year ? `<div class="gen-year" ${_editable(`certifications.${i}.year`)}>${c.year}</div>` : ''}
    <div class="gen-title" ${_editable(`certifications.${i}.name`)}>${c.name}</div>
    ${c.issuer ? `<div class="gen-meta" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
    ${c.url ? `<a href="${c.url}" class="plink" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</section>
<div class="divider"></div>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section id="achievements">
  <span class="lbl">Recognition</span>
  <h2 class="stitle">Achievements</h2>
  <div class="gen-grid reveal">
${v.achievements.map((a, i) => `<div class="gen-card" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
    ${a.year ? `<div class="gen-year" ${_editable(`achievements.${i}.year`)}>${a.year}</div>` : ''}
    <div class="gen-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
    ${a.description ? `<div class="gen-meta" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</section>
<div class="divider"></div>` : '';

	// AWARDS / DESIGN / CUSTOM
	const awardsHtml = !hidden.has('awards') && v.awards?.length
		? `<section id="awards"><span class="lbl">Honours</span><h2 class="stitle">Awards</h2><div class="gen-grid reveal">
${v.awards.map((a, i) => `<div class="gen-card" data-item-wrap><button class="del-btn ce-del-btn" data-del-section="awards" data-del-index="${i}">&#x2715;</button>${a.year ? `<div class="gen-year" ${_editable(`awards.${i}.year`)}>${a.year}</div>` : ''}<div class="gen-title" ${_editable(`awards.${i}.title`)}>${a.title}</div>${a.awarding_body ? `<div class="gen-meta" ${_editable(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}</div>`).join('\n')}
</div></section>
<div class="divider"></div>` : '';

	const designHtml = !hidden.has('design_philosophy') && v.design_philosophy
		? `<section id="design_philosophy"><span class="lbl">Philosophy</span><h2 class="stitle">Engineering<br>philosophy</h2><p class="dp-text reveal" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p></section>
<div class="divider"></div>` : '';

	const customSectionsHtml = !hidden.has('custom_sections') && (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length) return '';
			const cardItems = cs.items.map((item, i) => `<div class="gen-card" data-item-wrap data-cs-idx="${csIdx}">
  <button class="del-btn ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>
  ${item.subtitle ? `<div class="gen-year" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
  ${item.label ? `<div class="gen-title" ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</div>` : ''}
  ${item.value ? `<div class="gen-meta" ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</div>` : ''}
  ${item.tags?.length ? `<div class="proj-tags" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>` : ''}
  ${item.url ? `<a href="${item.url}" class="plink" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			const tlItems = cs.items.map((item, i) => `<div class="eitem" data-item-wrap data-cs-idx="${csIdx}">
  <button class="del-btn ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>
  ${item.subtitle ? `<div class="emeta"><span class="eloc" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</span></div>` : ''}
  ${item.label ? `<div class="erole" ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</div>` : ''}
  ${item.value ? `<p class="edesc" ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</p>` : ''}
  ${item.tags?.length ? `<div class="proj-tags" style="margin-top:8px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>` : ''}
  ${item.url ? `<a href="${item.url}" class="plink" style="margin-top:6px;display:inline-block" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			const listItems = cs.items.map((item, i) => `<div class="ecard" data-item-wrap data-cs-idx="${csIdx}">
  <button class="del-btn ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>
  <div class="eyear">${item.subtitle ? `<span ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</span>` : '&mdash;'}</div>
  <div>
  ${item.label ? `<div class="edeg" ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</div>` : ''}
  ${item.value ? `<div class="eschl" ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</div>` : ''}
  ${item.tags?.length ? `<div class="proj-tags" style="margin-top:8px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>` : ''}
  ${item.url ? `<a href="${item.url}" class="plink" style="margin-top:6px;display:inline-block" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
  </div>
</div>`).join('\n');
			const grid = cs.display_type === 'timeline'
				? `<div class="exp-tl reveal">${tlItems}</div>`
				: cs.display_type === 'list'
				? `<div class="edu-list reveal">${listItems}</div>`
				: `<div class="gen-grid reveal">${cardItems}</div>`;
			return `<section id="${cs.section_id}"><span class="lbl">${cs.title}</span><h2 class="stitle">${cs.title}</h2>${grid}
<button class="add-btn ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button></section>
<div class="divider"></div>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		skills: skillsHtml, projects: projectsHtml, experience: expHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		awards: awardsHtml, design_philosophy: designHtml, custom_sections: customSectionsHtml,
	};
	const orderedSections = order
		.filter(k => !hidden.has(k) && k in sectionMap)
		.map(k => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	// CONTACT
	const chans = [
		v.email ? `<a class="cchan" href="mailto:${v.email}"><div class="ch-icon">@</div><div><div class="ch-lbl">Email</div><div class="ch-val" ${_editable('profile.email')}>${v.email}</div></div><span class="ch-arr">&#8594;</span></a>` : '',
		v.phone ? `<a class="cchan" href="tel:${v.phone}"><div class="ch-icon">&#9742;</div><div><div class="ch-lbl">Phone</div><div class="ch-val" ${_editable('profile.phone')}>${v.phone}</div></div><span class="ch-arr">&#8594;</span></a>` : '',
		v.location ? `<div class="cchan"><div class="ch-icon">&#9678;</div><div><div class="ch-lbl">Location</div><div class="ch-val" ${_editable('profile.location')}>${v.location}</div></div></div>` : '',
		v.linkedin_url ? `<a class="cchan" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer"><div class="ch-icon">in</div><div><div class="ch-lbl">LinkedIn</div><div class="ch-val">Connect</div></div><span class="ch-arr">&#8594;</span></a>` : '',
		v.portfolio_url ? `<a class="cchan" href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer"><div class="ch-icon">&#127760;</div><div><div class="ch-lbl">Website</div><div class="ch-val">Visit</div></div><span class="ch-arr">&#8594;</span></a>` : '',
	].filter(Boolean).join('');
	const contactHtml = chans
		? `<section id="contact">
  <span class="lbl">Contact</span>
  <h2 class="stitle">Let's build<br>something precise</h2>
  <div class="cgrid reveal">
    <div>
      <p class="cintro">Open to senior engineering roles, consulting projects, and technical collaborations. If you have a complex mechanical problem that needs solving, I'd like to hear about it.</p>
      <div class="cchans">${chans}</div>
    </div>
    <div class="cside"><div class="cside-mark">${inits}</div><div class="cside-txt">Available for Opportunities</div></div>
  </div>
</section>` : '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Mechanical Engineer</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
${BG_SVG}
<nav>
  <a class="nav-logo" href="#hero">${firstName} <span>${lastName}</span></a>
  <ul class="nav-links">${navItems}</ul>
</nav>

<section id="hero">
  <div class="hero-inner">
    <div class="hero-grid">
      <div>
        <div class="hero-badge"><div class="badge-dot"></div><span class="badge-txt">${v.location ? `Available · ${v.location}` : 'Available for Senior Roles'}</span></div>
        <h1 class="hero-name" ${_editable('profile.full_name')}>${heroName}</h1>
        ${v.headline ? `<p class="hero-role" ${_editable('portfolio.headline')}>${v.headline}</p>` : ''}
        ${v.bio ? `<p class="hero-bio" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
        <div class="ctas">
          <a class="btn-p" href="#contact">Get in Touch &#8594;</a>
          <a class="btn-g" href="#projects">View Projects</a>
        </div>
      </div>
      <div class="hero-photo-wrap">
        <div class="photo-frame" ${_imgUpload('profile.profile_image', v.edit_mode)}>${photo}</div>
        <div class="photo-decorline"></div>
      </div>
    </div>
    ${heroStats ? `<div class="hero-stats">${heroStats}</div>` : ''}
  </div>
</section>

<div class="divider"></div>
${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
  <span class="fcopy">&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</span>
  <span class="fright">${v.headline || 'Mechanical Engineer'}${v.location ? ` · <span>${v.location}</span>` : ''}</span>
</footer>
${PRECISION_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
