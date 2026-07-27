/**
 * Template: Campaign (Marketing)
 * Faithful port of marketing-portfolio.html.
 * Rose/plum/amber editorial palette. Playfair Display + Lora + EB Garamond.
 * Features: floating stat pills around hero photo, lagging-ring cursor (publish-only),
 * fixed side-nav dots tracking scroll, animated skill bars, campaign impact cards,
 * cert ribbon corners, and scroll-reveal throughout.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Lora:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = exp.duration.match(/^(\d{4})/);
		if (m) { const y = parseInt(m[1], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}

/** Best-effort auto value for ROAS — scans campaign metrics for "N.Nx" / "N×". */
function deriveRoas(campaigns: NormalizedData['campaigns']): number {
	for (const c of campaigns ?? []) {
		for (const m of c.performance_metrics ?? []) {
			const mt = m.match(/(\d+(?:\.\d+)?)\s*[x×]/i);
			if (mt) return Math.round(parseFloat(mt[1]));
		}
	}
	return 0;
}

function css(): string {
	return `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
:root{
  --rose:#c4536a;--plum:#7b3f6e;--amber:#d4874a;--teal:#2a7d7d;--sage:#5a8c75;
  --cream:#fdf8f3;--ivory:#f5ede0;--charcoal:#1a1218;--warm-white:#fffcf8;
  --muted:#8a7065;--border:rgba(196,83,106,0.18);
  --g-hero:linear-gradient(135deg,#1a0d1a 0%,#3b1530 30%,#6b2545 60%,#c4536a 100%);
  --g-about:linear-gradient(160deg,#fdf8f3 0%,#f5e8d8 50%,#eddccc 100%);
  --g-exp:linear-gradient(145deg,#0d1f1f 0%,#1a3a3a 40%,#2a7d7d 100%);
  --g-edu:linear-gradient(150deg,#fdf6ee 0%,#f0e4d4 40%,#e8d5be 100%);
  --g-skills:linear-gradient(140deg,#1a0f24 0%,#3d1f5c 50%,#7b3f6e 100%);
  --g-impact:linear-gradient(145deg,#0f1a15 0%,#1e3d2d 45%,#2d6b4a 100%);
  --g-contact:linear-gradient(135deg,#1a0a10 0%,#4a1a30 35%,#c4536a 70%,#d4874a 100%);
  --font-display:'Playfair Display',serif;
  --font-body:'Lora',serif;
  --font-accent:'EB Garamond',serif;
}
body{background:var(--cream);color:var(--charcoal);font-family:var(--font-body);font-weight:300;overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--rose);color:#fff}

/* ── Cursor ── */
#mk-cur{width:10px;height:10px;background:var(--rose);border-radius:50%;
  position:fixed;top:0;left:0;pointer-events:none;z-index:9999;
  transform:translate(-50%,-50%);transition:width .3s,height .3s,background .3s}
#mk-ring{width:36px;height:36px;border:1.5px solid var(--rose);border-radius:50%;
  position:fixed;top:0;left:0;pointer-events:none;z-index:9998;
  transform:translate(-50%,-50%);opacity:.45;
  transition:opacity .3s,transform .3s}
@media(hover:none){#mk-cur,#mk-ring{display:none}}

/* ── Side Nav Dots ── */
#mk-side-nav{position:fixed;right:32px;top:50%;transform:translateY(-50%);
  display:flex;flex-direction:column;gap:12px;z-index:200}
.mk-dot{width:8px;height:8px;border-radius:50%;
  background:rgba(196,83,106,.3);border:1.5px solid rgba(196,83,106,.5);
  cursor:pointer;transition:all .4s;position:relative;padding:0}
.mk-dot.active{background:var(--rose);transform:scale(1.4)}
.mk-dot::after{content:attr(data-label);position:absolute;right:20px;top:50%;
  transform:translateY(-50%);font-family:var(--font-body);font-size:.6rem;
  letter-spacing:.12em;color:var(--rose);white-space:nowrap;
  opacity:0;transition:opacity .3s;pointer-events:none}
.mk-dot:hover::after{opacity:1}

/* ── Floating orbs ── */
.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.35;
  pointer-events:none;animation:drift 8s ease-in-out infinite alternate}
@keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(30px,20px) scale(1.12)}}

/* ── Nav ── */
.mk-nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;
  align-items:center;justify-content:space-between;padding:22px 60px;
  background:rgba(26,18,24,.88);backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(196,83,106,.2)}
.mk-nav-logo{font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:#fff}
.mk-nav-links{display:flex;gap:36px;list-style:none}
.mk-nav-links a{font-family:var(--font-body);font-size:.8rem;letter-spacing:.1em;
  text-transform:uppercase;color:rgba(255,255,255,.55);transition:color .2s}
.mk-nav-links a:hover{color:rgba(255,215,180,.9)}
@media(max-width:900px){.mk-nav{padding:18px 24px}.mk-nav-links{display:none}}

/* ── Hero ── */
#s-hero{min-height:100vh;background:var(--g-hero);
  display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden}
.hero-orb1{width:500px;height:500px;background:#c4536a;top:-80px;right:100px;animation-duration:10s}
.hero-orb2{width:360px;height:360px;background:#7b3f6e;bottom:0;right:200px;animation-duration:7s;animation-delay:-3s}
.hero-orb3{width:260px;height:260px;background:#d4874a;bottom:100px;left:0;animation-duration:9s;animation-delay:-5s}
.hero-left{display:flex;flex-direction:column;justify-content:center;
  padding:140px 60px 80px;position:relative;z-index:2}
.hero-eyebrow{font-family:var(--font-body);font-size:.72rem;letter-spacing:.35em;
  text-transform:uppercase;color:rgba(255,255,255,.55);
  display:flex;align-items:center;gap:14px;margin-bottom:28px;
  opacity:0;animation:riseUp .9s .2s forwards}
.hero-eyebrow::before{content:'';width:40px;height:1px;background:rgba(212,135,74,.7)}
.hero-name{font-family:var(--font-display);font-size:clamp(3.8rem,6.5vw,7rem);
  font-weight:400;line-height:.9;color:#fff;
  opacity:0;animation:riseUp .9s .4s forwards}
.hero-name .italic{font-style:italic;color:rgba(255,215,180,.9)}
.hero-divider{width:60px;height:1px;background:linear-gradient(90deg,var(--amber),transparent);
  margin:32px 0;opacity:0;animation:widen 1s .7s forwards;transform-origin:left}
@keyframes widen{from{opacity:0;width:0}to{opacity:1;width:60px}}
.hero-tagline{font-family:var(--font-body);font-style:italic;font-size:1.15rem;
  color:rgba(255,255,255,.65);line-height:1.75;max-width:380px;
  opacity:0;animation:riseUp .9s .6s forwards}
.hero-ctas{display:flex;gap:16px;margin-top:48px;flex-wrap:wrap;
  opacity:0;animation:riseUp .9s .9s forwards}
.btn-rose{padding:14px 38px;background:linear-gradient(135deg,var(--rose),var(--amber));
  color:#fff;font-family:var(--font-body);font-size:.8rem;letter-spacing:.12em;
  border:none;transition:opacity .3s,transform .25s;display:inline-block}
.btn-rose:hover{opacity:.88;transform:translateY(-3px)}
.btn-outline{padding:14px 38px;border:1px solid rgba(255,255,255,.3);
  color:rgba(255,255,255,.7);font-family:var(--font-body);font-size:.8rem;
  letter-spacing:.12em;transition:border-color .3s,color .3s;display:inline-block}
.btn-outline:hover{border-color:rgba(255,255,255,.7);color:#fff}
.hero-right{display:flex;align-items:center;justify-content:center;
  position:relative;z-index:2;padding:80px 60px}
.hero-card-wrap{position:relative;opacity:0;animation:floatIn 1.1s .5s forwards}
@keyframes floatIn{from{opacity:0;transform:translateY(40px) rotate(2deg)}to{opacity:1;transform:none}}
.hero-photo-card{width:300px;height:400px;background:rgba(255,255,255,.08);
  backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.18);
  position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-photo-card::before{content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 60%,rgba(123,63,110,.6));
  z-index:1;pointer-events:none}
.hero-photo-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2}
.photo-placeholder{display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:10px;z-index:3;position:relative}
.photo-placeholder-ring{width:56px;height:56px;border-radius:50%;
  border:1px solid rgba(255,255,255,.35);display:flex;align-items:center;
  justify-content:center;background:rgba(255,255,255,.08)}
.photo-placeholder-ring svg{stroke:rgba(255,255,255,.7);width:22px;height:22px}
.photo-placeholder-txt{font-family:var(--font-body);font-size:.62rem;
  letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.5)}
/* floating stat pills */
.stat-pill{position:absolute;background:rgba(255,255,255,.1);
  backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.2);
  padding:12px 20px;z-index:4}
.stat-pill.p1{top:-20px;right:-50px}
.stat-pill.p2{bottom:40px;left:-60px}
.stat-pill.p3{bottom:-30px;right:-30px}
.stat-val{font-family:var(--font-display);font-size:1.6rem;color:#fff;line-height:1}
.stat-lbl{font-family:var(--font-body);font-size:.55rem;letter-spacing:.18em;
  text-transform:uppercase;color:rgba(255,255,255,.5);margin-top:2px}
/* scroll hint */
.scroll-hint{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;z-index:5;
  opacity:0;animation:riseUp .8s 1.3s forwards}
.scroll-line{width:1px;height:50px;background:linear-gradient(180deg,rgba(255,255,255,.5),transparent);
  animation:drip 1.8s ease-in-out infinite}
@keyframes drip{0%,100%{height:50px;opacity:.5}50%{height:70px;opacity:1}}
.scroll-txt{font-family:var(--font-body);font-size:.55rem;letter-spacing:.25em;
  text-transform:uppercase;color:rgba(255,255,255,.35)}
@media(max-width:900px){#s-hero{grid-template-columns:1fr}.hero-right{display:none}
  .hero-left{padding:120px 24px 80px}}

/* ── About ── */
#s-about{min-height:100vh;background:var(--g-about);
  display:grid;grid-template-columns:1fr 1.2fr;align-items:center;
  position:relative;overflow:hidden}
.about-orb1{width:420px;height:420px;background:#d4874a;opacity:.12;top:-100px;left:-100px}
.about-orb2{width:320px;height:320px;background:#c4536a;opacity:.08;bottom:0;right:-80px}
.about-decor{display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:80px 40px 80px 60px;position:relative;z-index:2}
.about-monogram{font-family:var(--font-display);font-style:italic;
  font-size:clamp(8rem,14vw,14rem);color:transparent;
  -webkit-text-stroke:1px rgba(196,83,106,.25);line-height:1;user-select:none;
  animation:floatBob 6s ease-in-out infinite}
@keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
.about-quote-txt{font-family:var(--font-accent);font-style:italic;font-size:1.2rem;
  color:var(--muted);text-align:center;line-height:1.6;max-width:260px;margin-top:-20px}
.about-quote-txt::before{content:'\\201C';font-size:3rem;color:var(--rose);opacity:.4;
  line-height:0;vertical-align:-.6em;margin-right:4px}
.about-content{padding:80px 60px 80px 40px;position:relative;z-index:2}
.sec-tag{font-family:var(--font-body);font-size:.65rem;letter-spacing:.3em;
  text-transform:uppercase;color:var(--rose);display:flex;align-items:center;
  gap:12px;margin-bottom:20px}
.sec-tag::before{content:'';width:28px;height:1px;background:var(--rose)}
.sec-heading{font-family:var(--font-display);font-size:clamp(2.4rem,3.5vw,3.5rem);
  font-weight:400;line-height:1.05;color:var(--charcoal);margin-bottom:32px}
.sec-heading em{font-style:italic;color:var(--rose)}
.about-text{font-size:.95rem;line-height:1.95;color:var(--muted)}
.about-text p+p{margin-top:16px}
.about-text strong{color:var(--charcoal);font-weight:500}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;
  margin-top:40px;border:1px solid var(--border)}
.ag-cell{padding:18px 20px;border-bottom:1px solid var(--border);
  border-right:1px solid var(--border)}
.ag-cell:nth-child(even){border-right:none}
.ag-cell:nth-last-child(-n+2){border-bottom:none}
.ag-label{font-family:var(--font-body);font-size:.58rem;letter-spacing:.22em;
  text-transform:uppercase;color:var(--rose);margin-bottom:4px}
.ag-val{font-family:var(--font-display);font-size:.95rem;color:var(--charcoal)}
@media(max-width:900px){#s-about{grid-template-columns:1fr}.about-decor{display:none}
  .about-content{padding:80px 24px}}

/* ── Experience ── */
#s-exp{min-height:100vh;background:var(--g-exp);padding:100px 60px;
  position:relative;overflow:hidden}
.exp-orb1{width:500px;height:500px;background:#2a7d7d;top:-80px;right:-80px}
.exp-orb2{width:300px;height:300px;background:#1a3a3a;bottom:0;left:-60px}
.sec-tag-light{color:rgba(255,255,255,.5)}
.sec-tag-light::before{background:rgba(255,255,255,.4)}
.sec-heading-light{color:#fff}
.sec-heading-light em{color:rgba(180,230,220,.8)}
.timeline{position:relative;margin-top:60px;padding-left:40px}
.timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;
  width:1px;background:linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,.05))}
.tl-item{position:relative;padding:40px 0 40px 50px;
  border-bottom:1px solid rgba(255,255,255,.07);
  display:grid;grid-template-columns:160px 1fr;gap:40px;align-items:start;
  transition:background .3s}
.tl-item:last-child{border-bottom:none}
.tl-item:hover{background:rgba(255,255,255,.03)}
.tl-dot{position:absolute;left:-5px;top:44px;width:10px;height:10px;
  border-radius:50%;background:var(--rose);border:2px solid #fff;
  box-shadow:0 0 0 4px rgba(196,83,106,.25);transition:transform .3s}
.tl-item:hover .tl-dot{transform:scale(1.4)}
.tl-period{font-family:var(--font-body);font-size:.7rem;letter-spacing:.1em;
  color:rgba(255,255,255,.4);padding-top:8px;line-height:1.7}
.tl-company{font-family:var(--font-body);font-size:.65rem;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(180,230,220,.7);margin-bottom:6px}
.tl-title{font-family:var(--font-display);font-size:1.5rem;color:#fff;
  margin-bottom:12px;line-height:1.15}
.tl-desc{font-size:.88rem;color:rgba(255,255,255,.5);line-height:1.75;
  max-width:540px;margin-bottom:16px}
.tl-chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:4px 12px;border:1px solid rgba(255,255,255,.15);
  font-family:var(--font-body);font-size:.6rem;letter-spacing:.1em;
  color:rgba(255,255,255,.5);transition:border-color .3s,color .3s}
.tl-item:hover .chip{border-color:rgba(180,230,220,.4);color:rgba(180,230,220,.9)}
@media(max-width:900px){#s-exp{padding:80px 24px}.tl-item{grid-template-columns:1fr;gap:8px}}

/* ── Education ── */
#s-edu{min-height:100vh;background:var(--g-edu);padding:100px 60px;
  position:relative;overflow:hidden}
.edu-orb1{width:400px;height:400px;background:#d4874a;opacity:.1;top:-60px;right:-60px}
.edu-orb2{width:350px;height:350px;background:#c4536a;opacity:.07;bottom:-80px;left:10%}
.sec-tag-dark{font-family:var(--font-body);font-size:.65rem;letter-spacing:.3em;
  text-transform:uppercase;color:var(--rose);display:flex;align-items:center;
  gap:12px;margin-bottom:20px}
.sec-tag-dark::before{content:'';width:28px;height:1px;background:var(--rose)}
.sec-heading-dark{font-family:var(--font-display);font-size:clamp(2.4rem,3.5vw,3.5rem);
  font-weight:400;line-height:1.05;color:var(--charcoal);margin-bottom:60px}
.sec-heading-dark em{font-style:italic;color:var(--rose)}
.edu-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.edu-card{background:rgba(255,255,255,.55);backdrop-filter:blur(20px);
  border:1px solid rgba(196,83,106,.15);padding:40px;
  position:relative;overflow:hidden;transition:transform .4s,border-color .4s,box-shadow .4s}
.edu-card:hover{transform:translateY(-6px);border-color:rgba(196,83,106,.45);
  box-shadow:0 24px 60px rgba(196,83,106,.12)}
.edu-card-accent{position:absolute;top:0;left:0;width:100%;height:3px;
  background:linear-gradient(90deg,var(--rose),var(--amber));
  transform:scaleX(0);transform-origin:left;transition:transform .5s ease}
.edu-card:hover .edu-card-accent{transform:scaleX(1)}
.edu-year{font-family:var(--font-body);font-size:.62rem;letter-spacing:.22em;
  text-transform:uppercase;color:var(--rose);margin-bottom:20px}
.edu-degree{font-family:var(--font-display);font-size:1.35rem;color:var(--charcoal);
  line-height:1.2;margin-bottom:6px}
.edu-school{font-family:var(--font-body);font-size:.75rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--muted);margin-bottom:16px}
.edu-badge-pill{display:inline-block;margin-top:12px;padding:5px 14px;
  background:linear-gradient(135deg,var(--rose),var(--plum));color:#fff;
  font-family:var(--font-body);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase}
@media(max-width:900px){#s-edu{padding:80px 24px}.edu-cards{grid-template-columns:1fr}}

/* ── Skills ── */
#s-skills{min-height:100vh;background:var(--g-skills);padding:100px 60px;
  position:relative;overflow:hidden}
.skills-orb1{width:550px;height:550px;background:#7b3f6e;top:-100px;right:-100px}
.skills-orb2{width:350px;height:350px;background:#c4536a;bottom:0;left:-60px;animation-duration:11s}
.skills-groups{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
  gap:48px;margin-top:60px}
.skill-cluster{}
.sk-group-label{font-family:var(--font-body);font-size:.62rem;letter-spacing:.25em;
  text-transform:uppercase;color:rgba(212,135,74,.9);margin-bottom:22px;
  padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.12)}
.soft-wrap{display:flex;flex-wrap:wrap;gap:10px}
.soft-tag{padding:9px 18px;background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.13);font-family:var(--font-body);font-size:.8rem;
  color:rgba(255,255,255,.7);transition:all .35s}
.soft-tag:hover{background:rgba(196,83,106,.2);border-color:rgba(196,83,106,.5);
  color:rgba(255,200,190,.9);transform:translateY(-2px)}
@media(max-width:900px){#s-skills{padding:80px 24px}.skills-groups{grid-template-columns:1fr;gap:36px}}

/* ── Impact / Campaigns ── */
#s-impact{min-height:100vh;background:var(--g-impact);padding:100px 60px;
  position:relative;overflow:hidden}
.imp-orb1{width:500px;height:500px;background:#2d6b4a;top:-80px;right:-80px}
.imp-orb2{width:320px;height:320px;background:#1e3d2d;bottom:0;left:-40px;animation-duration:12s}
.impact-stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;
  margin-top:60px;margin-bottom:48px}
.imp-stat{padding:48px 36px;background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.1);text-align:center;transition:background .35s}
.imp-stat:hover{background:rgba(255,255,255,.09)}
.imp-num{font-family:var(--font-display);font-size:3.2rem;font-weight:400;
  color:#fff;line-height:1;margin-bottom:8px;font-style:italic;
  color:rgba(180,230,180,.8)}
.imp-lbl{font-family:var(--font-body);font-size:.6rem;letter-spacing:.22em;
  text-transform:uppercase;color:rgba(255,255,255,.4)}
.camp-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.camp-card{border:1px solid rgba(255,255,255,.08);padding:32px;
  position:relative;overflow:hidden;transition:border-color .35s,background .35s}
.camp-card:hover{border-color:rgba(180,230,180,.3);background:rgba(255,255,255,.04)}
.camp-stripe{position:absolute;top:0;left:0;width:3px;height:100%;
  background:linear-gradient(180deg,var(--rose),var(--amber))}
.camp-type{font-family:var(--font-body);font-size:.6rem;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(180,230,180,.6);margin-bottom:10px}
.camp-title{font-family:var(--font-display);font-size:1.2rem;color:#fff;
  margin-bottom:10px;line-height:1.2}
.camp-res{font-size:.83rem;color:rgba(255,255,255,.45);line-height:1.7}
.camp-budget{font-family:var(--font-body);font-size:.65rem;letter-spacing:.1em;
  color:rgba(212,135,74,.7);margin-bottom:8px}
.camp-metrics{display:flex;flex-direction:column;gap:4px;margin-top:8px}
.camp-metric{font-size:.8rem;color:rgba(255,255,255,.45);line-height:1.5}
.camp-metric::before{content:'✓ ';color:rgba(180,230,180,.6)}
@media(max-width:900px){#s-impact{padding:80px 24px}
  .impact-stat-row,.camp-grid{grid-template-columns:1fr}}

/* ── Certifications ── */
#s-certs{min-height:60vh;background:var(--g-about);padding:100px 60px;
  position:relative;overflow:hidden}
.certs-orb1{width:400px;height:400px;background:#c4536a;opacity:.07;top:-80px;right:0}
.certs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:60px}
.cert-card{background:rgba(255,255,255,.5);backdrop-filter:blur(10px);
  border:1px solid var(--border);padding:28px 28px 24px;
  position:relative;overflow:hidden;
  transition:transform .35s,box-shadow .35s,border-color .35s}
.cert-card:hover{transform:translateY(-5px);
  box-shadow:0 18px 48px rgba(196,83,106,.1);border-color:rgba(196,83,106,.4)}
.cert-ribbon{position:absolute;top:0;right:0;width:0;height:0;
  border-style:solid;border-width:0 40px 40px 0;
  border-color:transparent var(--rose) transparent transparent}
.cert-year-badge{position:absolute;top:4px;right:4px;
  font-family:var(--font-body);font-size:.48rem;letter-spacing:.1em;color:#fff}
.cert-issuer{font-family:var(--font-body);font-size:.58rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--rose);margin-bottom:10px}
.cert-name{font-family:var(--font-display);font-size:1.05rem;color:var(--charcoal);
  line-height:1.25}
.cert-year-text{font-family:var(--font-body);font-size:.62rem;color:var(--muted);margin-top:12px}
@media(max-width:900px){#s-certs{padding:80px 24px}.certs-grid{grid-template-columns:repeat(2,1fr)}}

/* ── Achievements ── */
#s-ach{background:var(--g-edu);padding:100px 60px;position:relative;overflow:hidden}
.ach-list-mk{display:flex;flex-direction:column}
.ach-row-mk{padding:20px 0;border-bottom:1px solid var(--border);
  display:flex;align-items:baseline;gap:24px;position:relative}
.ach-row-mk:first-child{border-top:1px solid var(--border)}
.ach-title-mk{font-family:var(--font-display);font-size:1rem;
  font-weight:700;color:var(--charcoal);flex:1}
.ach-desc-mk{font-size:.85rem;color:var(--muted);line-height:1.6;margin-top:4px}
.ach-year-mk{font-size:.8rem;color:var(--rose);flex-shrink:0}
@media(max-width:900px){#s-ach{padding:80px 24px}}

/* ── Custom sections ── */
.cs-mk-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:20px;margin-top:40px}
.cs-mk-card{background:rgba(255,255,255,.06);border:1px solid rgba(196,83,106,.15);
  padding:24px;position:relative;transition:border-color .25s}
.cs-mk-card:hover{border-color:rgba(196,83,106,.35)}
.cs-mk-card h3{font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:8px}
.cs-mk-card p{font-size:.85rem;color:var(--muted);line-height:1.6}
.cs-mk-list{display:flex;flex-direction:column;gap:0;margin-top:32px}
.cs-mk-row{display:flex;align-items:baseline;gap:20px;padding:16px 0;
  border-bottom:1px solid rgba(196,83,106,.12);position:relative}
.cs-mk-row:first-child{border-top:1px solid rgba(196,83,106,.12)}
.cs-mk-tl{display:flex;flex-direction:column;gap:0;margin-top:32px}
.cs-mk-tl-row{display:grid;grid-template-columns:130px 1fr;gap:20px;
  padding:20px 0;border-bottom:1px solid rgba(196,83,106,.12);position:relative}
.cs-mk-tl-row:first-child{border-top:1px solid rgba(196,83,106,.12)}
.cs-mk-tl-sub{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--rose)}

/* ── Contact ── */
#s-contact{min-height:100vh;background:var(--g-contact);display:flex;
  flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:80px 60px;position:relative;overflow:hidden}
.ct-orb1{width:600px;height:600px;background:#c4536a;top:-100px;left:50%;transform:translateX(-50%)}
.ct-orb2{width:400px;height:400px;background:#d4874a;bottom:-80px;right:-80px;animation-duration:9s}
.ct-orb3{width:300px;height:300px;background:#7b3f6e;bottom:0;left:-60px;animation-duration:7s;animation-delay:-4s}
.ct-tag{color:rgba(255,255,255,.45)}
.ct-tag::before{background:rgba(255,255,255,.3)}
.ct-headline{font-family:var(--font-display);font-size:clamp(3rem,6vw,6.5rem);
  font-weight:400;color:#fff;line-height:.95;margin-top:16px;margin-bottom:20px;
  position:relative;z-index:2}
.ct-headline em{font-style:italic;color:rgba(255,210,170,.85);display:block}
.ct-sub{font-family:var(--font-body);font-style:italic;font-size:1.05rem;
  color:rgba(255,255,255,.55);margin-bottom:52px;position:relative;z-index:2}
.ct-links{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
  position:relative;z-index:2}
.ct-link{display:flex;align-items:center;gap:10px;padding:14px 32px;
  background:rgba(255,255,255,.1);backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);
  font-family:var(--font-body);font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;
  transition:background .35s,border-color .35s,color .35s}
.ct-link:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.5);color:#fff}
@media(max-width:900px){#s-contact{padding:60px 24px}}

/* ── Footer ── */
.mk-footer{background:var(--charcoal);padding:24px 60px;
  display:flex;align-items:center;justify-content:space-between}
.mk-footer-brand{font-family:var(--font-display);font-style:italic;
  color:rgba(196,83,106,.6);font-size:.85rem}
.mk-footer-copy{font-family:var(--font-body);font-size:.6rem;
  letter-spacing:.15em;color:rgba(255,255,255,.3)}

/* ── Reveal animations ── */
.reveal{opacity:0;transform:translateY(36px);transition:opacity .9s ease,transform .9s ease}
.reveal.in{opacity:1;transform:none}
.reveal.d1{transition-delay:.1s}
.reveal.d2{transition-delay:.2s}
.reveal.d3{transition-delay:.3s}
.reveal.d4{transition-delay:.4s}
@keyframes riseUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}

/* ── Editing overlay ── */
[contenteditable]:hover{outline:2px dashed rgba(99,102,241,.45);border-radius:3px}
[contenteditable]:focus{outline:2px solid rgba(99,102,241,.85);border-radius:3px}
`;
}

function customSectionsHtml(v: NormalizedData, em: boolean): string {
	const hidden = v.hidden_sections;
	if (hidden.has('custom_sections') && !em) return '';
	if (!v.custom_sections?.length && !em) return '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number) =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string) =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
	const bgOptions = ['background:var(--g-about)', 'background:var(--g-edu)', 'background:var(--g-impact)'];

	return (v.custom_sections ?? []).map((cs, csIdx) => {
		if (!cs.items?.length && !em) return '';
		const bg = bgOptions[csIdx % bgOptions.length];
		let inner = '';
		if (cs.display_type === 'cards') {
			inner = `<div class="cs-mk-cards">
${(cs.items ?? []).map((item, i) => `<div class="cs-mk-card"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
${item.label ? `<h3 ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</h3>` : ''}
${item.subtitle ? `<p class="cert-issuer" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</p>` : ''}
${item.value ? `<p ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</p>` : ''}
${item.tags?.length ? `<div class="tl-chips" style="margin-top:10px" ${em ? _listEditable(`custom_sections.${csIdx}.items.${i}.tags`) : ''}>${item.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
</div>`).join('\n')}
</div>${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
		} else if (cs.display_type === 'timeline') {
			inner = `<div class="cs-mk-tl">
${(cs.items ?? []).map((item, i) => `<div class="cs-mk-tl-row"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
<div>${item.subtitle ? `<div class="cs-mk-tl-sub" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</div>` : ''}</div>
<div>
${item.label ? `<div style="font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--charcoal)" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</div>` : ''}
${item.value ? `<div style="font-size:.85rem;color:var(--muted);line-height:1.6;margin-top:4px" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</div>` : ''}
</div>
</div>`).join('\n')}
</div>${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
		} else {
			inner = `<div class="cs-mk-list">
${(cs.items ?? []).map((item, i) => `<div class="cs-mk-row"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
<div style="flex:1">
${item.label ? `<div style="font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--charcoal)" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</div>` : ''}
${item.value ? `<div style="font-size:.85rem;color:var(--muted);line-height:1.6;margin-top:4px" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</div>` : ''}
</div>
${item.subtitle ? `<div style="font-size:.8rem;color:var(--rose);flex-shrink:0" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</div>` : ''}
</div>`).join('\n')}
</div>${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
		}
		return `<section id="${cs.section_id}" style="${bg};padding:100px 60px;position:relative;overflow:hidden">
<div style="max-width:1100px;margin:0 auto">
<div class="sec-tag-dark reveal" ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</div>
<h2 class="sec-heading-dark reveal d1" ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</h2>
${inner}
</div>
</section>`;
	}).filter(Boolean).join('\n');
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const hidden = v.hidden_sections;
	const order = v.section_order ?? DEFAULT_SECTION_ORDER;
	const ed = (path: string, multi = false): string => em ? _editable(path, multi) : '';
	const le = (path: string): string => em ? _listEditable(path) : '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	// Editable stat overrides (Portfolio Fields panel) with auto-computed defaults.
	const yearsExp = v.template_overrides?.years_experience ?? yearsFromExperience(v.experience);
	const campaignsCount = v.template_overrides?.campaigns_count ?? (v.campaigns?.length ?? 0);
	const avgRoas = v.template_overrides?.avg_roas ?? deriveRoas(v.campaigns);
	const initials = v.name.split(' ').map((p: string) => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'MK';
	// Reusable editable stat number span (maps to template_overrides, which the right pane edits).
	const statNum = (key: string, val: number): string => `<span ${ed(`template_overrides.${key}`)}>${val}</span>`;
	// Per-stat visibility: hidden when 0/absent, or when the user toggled it off.
	const showYears = statShown(v, 'years_experience', yearsExp);
	const showCampaigns = statShown(v, 'campaigns_count', campaignsCount);
	const showRoas = statShown(v, 'avg_roas', avgRoas);

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = !hidden.has('experience') && (v.experience.length || em)
		? `<section id="s-exp">
<div class="orb exp-orb1"></div>
<div class="orb exp-orb2"></div>
<div class="sec-tag sec-tag-light reveal">Work History</div>
<h2 class="sec-heading sec-heading-light reveal d1">Career <em>Journey</em></h2>
<div class="timeline">
${v.experience.map((exp, i) => {
	return `<div class="tl-item reveal"${iw}>
${delBtn('experience', i)}
<div class="tl-dot"></div>
<div class="tl-period">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : ''}${(exp.start_date && exp.end_date) ? ' — ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : ''}</div>
<div>
${exp.company ? `<div class="tl-company" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
<div class="tl-title" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
${exp.description ? `<div class="tl-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.channels_managed?.length ? `<div class="tl-chips" ${le(`experience.${i}.channels_managed`)}>${exp.channels_managed.map(c => `<span class="chip">${c}</span>`).join('')}</div>` : ''}
${exp.key_points?.length ? `<div class="camp-metrics" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(kp => `<div class="camp-metric">${kp}</div>`).join('')}</div>` : ''}
</div>
</div>`;
}).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>`
		: '';

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = !hidden.has('education') && (v.education.length || em)
		? `<section id="s-edu">
<div class="orb edu-orb1"></div>
<div class="orb edu-orb2"></div>
<div class="sec-tag-dark reveal">Education</div>
<h2 class="sec-heading-dark reveal d1">Academic <em>Background</em></h2>
<div class="edu-cards">
${v.education.map((edu, i) => `<div class="edu-card reveal"${iw}>
${delBtn('education', i)}
<div class="edu-card-accent"></div>
<div class="edu-year">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : ''}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : ''}</div>
<div class="edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
<div class="edu-school" ${ed(`education.${i}.institution`)}>${edu.institution}</div>
${edu.grade_or_score ? `<span class="edu-badge-pill" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>`
		: '';

	// ── SKILLS (grouped tag clusters — no bars) ───────────────────────────────
	const skillsHtml = !hidden.has('skills') && (v.skill_groups.length || em)
		? `<section id="s-skills">
<div class="orb skills-orb1"></div>
<div class="orb skills-orb2"></div>
<div class="sec-tag sec-tag-light reveal">Capabilities</div>
<h2 class="sec-heading sec-heading-light reveal d1">Skills &amp; <em>Expertise</em></h2>
<div class="skills-groups">
${v.skill_groups.map((g, gi) => `<div class="skill-cluster reveal${gi > 0 ? ` d${Math.min(gi, 3)}` : ''}">
<div class="sk-group-label" ${ed(`skills.${gi}.category`)}>${g.category}</div>
<div class="soft-wrap" ${le(`skills.${gi}.skills`)}>
${g.skills.map(s => `<span class="soft-tag">${s}</span>`).join('')}
</div>
</div>`).join('\n')}
</div>
</section>`
		: '';

	// ── CAMPAIGNS / IMPACT ────────────────────────────────────────────────────
	const campaignsHtml = !hidden.has('campaigns') && (v.campaigns?.length || v.achievements.length || em)
		? `<section id="s-impact">
<div class="orb imp-orb1"></div>
<div class="orb imp-orb2"></div>
<div class="sec-tag sec-tag-light reveal">Measurable Results</div>
<h2 class="sec-heading sec-heading-light reveal d1">Campaign <em>Impact</em></h2>
${(() => {
	const cells = [
		showYears ? `<div class="imp-stat reveal">
<div class="imp-num">${statNum('years_experience', yearsExp)}+</div>
<div class="imp-lbl">Years Experience</div>
</div>` : '',
		showCampaigns ? `<div class="imp-stat reveal d1">
<div class="imp-num">${statNum('campaigns_count', campaignsCount)}+</div>
<div class="imp-lbl">Campaigns Run</div>
</div>` : '',
		showRoas ? `<div class="imp-stat reveal d2">
<div class="imp-num">${statNum('avg_roas', avgRoas)}&times;</div>
<div class="imp-lbl">Average ROAS</div>
</div>` : '',
	].filter(Boolean);
	return cells.length ? `<div class="impact-stat-row" style="grid-template-columns:repeat(${cells.length},1fr)">${cells.join('\n')}</div>` : '';
})()}
${v.campaigns?.length ? `<div class="camp-grid">
${(v.campaigns ?? []).map((c, i) => `<div class="camp-card reveal${i > 1 ? ` d${i - 1}` : ''}"${iw}>
${delBtn('campaigns', i)}
<div class="camp-stripe"></div>
${c.campaign_type ? `<div class="camp-type" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}
<div class="camp-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || (em ? 'Campaign' : '')}</div>
${c.budget ? `<div class="camp-budget">Budget: <span ${ed(`campaigns.${i}.budget`)}>${c.budget}</span></div>` : ''}
${c.channels_used?.length ? `<div class="tl-chips" style="margin-bottom:8px" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.map(ch => `<span class="chip">${ch}</span>`).join('')}</div>` : ''}
${c.performance_metrics?.length ? `<div class="camp-metrics" ${le(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map(m => `<div class="camp-metric">${m}</div>`).join('')}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('campaigns', 'Campaign')}` : ''}
</section>`
		: '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certificationsHtml = !hidden.has('certifications') && (v.certifications.length || em)
		? `<section id="s-certs">
<div class="orb certs-orb1"></div>
<div class="sec-tag-dark reveal">Credentials</div>
<h2 class="sec-heading-dark reveal d1">Certifications &amp; <em>Awards</em></h2>
<div class="certs-grid">
${v.certifications.map((c, i) => `<div class="cert-card reveal${i > 0 ? ` d${Math.min(i, 4)}` : ''}"${iw}>
${delBtn('certifications', i)}
<div class="cert-ribbon"></div>
<div class="cert-year-badge">${c.year ? c.year.toString().slice(-2) : ''}</div>
<div class="cert-issuer" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>
<div class="cert-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${(c.year || em) ? `<div class="cert-year-text">Certified <span ${ed(`certifications.${i}.year`)}>${c.year}</span></div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>`
		: '';

	// ── ACHIEVEMENTS ─────────────────────────────────────────────────────────
	const achievementsHtml = !hidden.has('achievements') && (v.achievements.length || em)
		? `<section id="s-ach">
<div class="sec-tag-dark reveal">Milestones</div>
<h2 class="sec-heading-dark reveal d1">Key <em>Achievements</em></h2>
<div class="ach-list-mk" style="margin-top:48px">
${v.achievements.map((a, i) => `<div class="ach-row-mk"${iw}>
${delBtn('achievements', i)}
<div style="flex:1">
<div class="ach-title-mk" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="ach-desc-mk" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>
${a.year ? `<div class="ach-year-mk" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>`
		: '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customSections = customSectionsHtml(v, em);

	// ── SECTION ORDER ─────────────────────────────────────────────────────────
	const sectionRenderers: Record<string, string> = {
		experience: experienceHtml,
		campaigns: campaignsHtml,
		skills: skillsHtml,
		education: educationHtml,
		certifications: certificationsHtml,
		achievements: achievementsHtml,
		custom_sections: customSections,
	};

	const orderedSections = order
		.filter(key => !hidden.has(key) && key in sectionRenderers)
		.map(key => sectionRenderers[key])
		.filter(Boolean)
		.join('\n');

	// ── SIDE NAV: build dynamically from rendered sections ────────────────────
	const navSections: Array<{id: string; label: string}> = [
		{ id: 's-hero', label: 'Home' },
		{ id: 's-about', label: 'About' },
	];
	if (!hidden.has('experience') && v.experience.length) navSections.push({ id: 's-exp', label: 'Experience' });
	if (!hidden.has('campaigns') && (v.campaigns?.length || v.achievements.length)) navSections.push({ id: 's-impact', label: 'Impact' });
	if (!hidden.has('education') && v.education.length) navSections.push({ id: 's-edu', label: 'Education' });
	if (!hidden.has('skills') && v.skill_groups.length) navSections.push({ id: 's-skills', label: 'Skills' });
	if (!hidden.has('certifications') && v.certifications.length) navSections.push({ id: 's-certs', label: 'Certs' });
	if (!hidden.has('achievements') && v.achievements.length) navSections.push({ id: 's-ach', label: 'Wins' });
	navSections.push({ id: 's-contact', label: 'Contact' });

	const sideNavHtml = `<nav id="mk-side-nav">
${navSections.map((s, i) => `<button class="mk-dot${i === 0 ? ' active' : ''}" data-target="${s.id}" data-label="${s.label}"></button>`).join('\n')}
</nav>`;

	// ── CURSOR + JS (runs in both edit preview and published portfolio) ───────
	// Custom cursor + side-nav dots + scroll-reveal are shown in the editor too.
	// EDITOR_JS forces cursor:text on contenteditable so inline editing still works.
	const cursorCss = 'body{cursor:none}';
	// Fallback: ensure reveal elements are visible even before the IO fires on first paint.
	const editRevealCss = '.reveal{opacity:1;transform:none}';
	const cursorHtml = `<div id="mk-cur"></div><div id="mk-ring"></div>`;
	const interactiveJs = `<script>
(function(){
  // Cursor: dot instant, ring lags with lerp
  var cur=document.getElementById('mk-cur'),ring=document.getElementById('mk-ring');
  if(!cur)return;
  var mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
  if(window.__mkRAF)cancelAnimationFrame(window.__mkRAF);
  (function tick(){
    cur.style.left=mx+'px';cur.style.top=my+'px';
    rx+=(mx-rx)*.13;ry+=(my-ry)*.13;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    window.__mkRAF=requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.cert-card,.tl-item,.edu-card,.soft-tag,.camp-card').forEach(function(el){
    el.addEventListener('mouseenter',function(){cur.style.width='18px';cur.style.height='18px';ring.style.opacity='.8';ring.style.transform='translate(-50%,-50%) scale(1.4)';});
    el.addEventListener('mouseleave',function(){cur.style.width='10px';cur.style.height='10px';ring.style.opacity='.45';ring.style.transform='translate(-50%,-50%) scale(1)';});
  });
})();
(function(){
  // Side nav dots — highlight active section on scroll
  var dots=document.querySelectorAll('.mk-dot');
  dots.forEach(function(btn){
    btn.addEventListener('click',function(){
      var t=document.getElementById(btn.dataset.target);
      if(t) t.scrollIntoView({behavior:'smooth'});
    });
  });
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var id=e.target.id;
        dots.forEach(function(d){d.classList.toggle('active',d.dataset.target===id);});
      }
    });
  },{threshold:.4});
  dots.forEach(function(d){var el=document.getElementById(d.dataset.target);if(el)io.observe(el);});
})();
(function(){
  // Scroll-reveal
  var ro=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); }
    });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ro.observe(el);});
})();
</script>`;

	// ── CONTACT LINKS ─────────────────────────────────────────────────────────
	const socialItems = [
		v.email ? `<a href="mailto:${v.email}" class="ct-link">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
<span ${ed('profile.email')}>${v.email}</span></a>` : '',
		v.linkedin_url ? `<a href="${v.linkedin_url}" class="ct-link" target="_blank" rel="noopener noreferrer">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
LinkedIn</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" class="ct-link" target="_blank" rel="noopener noreferrer">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 3c-2.5 0-4.5 2-4.5 4.5v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
Twitter / X</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" class="ct-link" target="_blank" rel="noopener noreferrer">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
Portfolio</a>` : '',
	].filter(Boolean);

	// About grid cells
	// Only real, editable profile fields — every cell maps to a savable path.
	const aboutGridItems = [
		(v.location) ? `<div class="ag-cell"><div class="ag-label">Location</div><div class="ag-val" ${ed('profile.location')}>${v.location || ''}</div></div>` : '',
		(v.email) ? `<div class="ag-cell"><div class="ag-label">Email</div><div class="ag-val" ${ed('profile.email')}>${v.email || ''}</div></div>` : '',
		(v.phone) ? `<div class="ag-cell"><div class="ag-label">Phone</div><div class="ag-val" ${ed('profile.phone')}>${v.phone || ''}</div></div>` : '',
		showYears ? `<div class="ag-cell"><div class="ag-label">Experience</div><div class="ag-val"><span ${ed('template_overrides.years_experience')}>${yearsExp}</span>+ Years</div></div>` : '',
	].filter(Boolean);

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Marketing Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}${cursorCss}${editRevealCss}</style>
${em ? EDITOR_SCRIPT : ''}
</head>
<body>
${cursorHtml}

${sideNavHtml}

<!-- NAV -->
<nav class="mk-nav">
<div style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:#fff" ${ed('profile.full_name')}>${v.name}</div>
<ul class="mk-nav-links">
<li><a href="#s-exp">Experience</a></li>
<li><a href="#s-impact">Impact</a></li>
<li><a href="#s-contact">Contact</a></li>
</ul>
</nav>

<!-- HERO -->
<section id="s-hero">
<div class="orb hero-orb1"></div>
<div class="orb hero-orb2"></div>
<div class="orb hero-orb3"></div>
<div class="hero-left">
${v.location ? `<div class="hero-eyebrow" ${ed('profile.location')}>${v.location}</div>` : ''}
<!-- The editable must wrap the WHOLE name. Binding only the first word made the
     rest uneditable AND saved "Kunal" over "Kunal Rao Yadla" on the first edit.
     <br> reads back as a space in getValue(), so the full name round-trips. -->
<h1 class="hero-name" ${ed('profile.full_name')}>${v.name.split(' ').map((w, wi) => wi === 0 ? w : `<span class="italic">${w}</span>`).join('<br>')}</h1>
<div class="hero-divider"></div>
${v.headline ? `<p class="hero-tagline" ${ed('portfolio.headline')}>${v.headline}</p>` : (em ? `<p class="hero-tagline" ${ed('portfolio.headline')}>Add a professional headline.</p>` : '')}
<div class="hero-ctas">
<a href="#s-contact" class="btn-rose">Let&#8217;s Collaborate</a>
<a href="#s-exp" class="btn-outline">View Work</a>
</div>
</div>
<div class="hero-right">
<div class="hero-card-wrap">
<div class="hero-photo-card" ${_imgUpload('profile.profile_image', v.edit_mode)}>
${v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="photo-placeholder">
<div class="photo-placeholder-ring">
<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="10" r="3"/><path d="M3 9a2 2 0 012-2h1l2-3h4l2 3h1a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
</div>
<span class="photo-placeholder-txt">Profile Photo</span>
</div>`}
</div>
${showYears ? `<div class="stat-pill p1">
<div class="stat-val">${statNum('years_experience', yearsExp)}+</div>
<div class="stat-lbl">Yrs Experience</div>
</div>` : ''}
${showRoas ? `<div class="stat-pill p2">
<div class="stat-val">${statNum('avg_roas', avgRoas)}&times;</div>
<div class="stat-lbl">Avg. ROAS</div>
</div>` : ''}
${showCampaigns ? `<div class="stat-pill p3">
<div class="stat-val">${statNum('campaigns_count', campaignsCount)}+</div>
<div class="stat-lbl">Campaigns</div>
</div>` : ''}
</div>
</div>
<div class="scroll-hint">
<div class="scroll-line"></div>
<span class="scroll-txt">Scroll</span>
</div>
</section>

<!-- ABOUT -->
<section id="s-about">
<div class="orb about-orb1"></div>
<div class="orb about-orb2"></div>
<div class="about-decor reveal">
<div class="about-monogram">${initials}</div>
${v.uniqueValue ? `<p class="about-quote-txt" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : (em ? `<p class="about-quote-txt" ${ed('portfolio.uniqueValue', true)}>Add your unique value proposition.</p>` : '')}
</div>
<div class="about-content">
<div class="sec-tag reveal">About Me</div>
<h2 class="sec-heading reveal d1">The Strategy <em>Behind the Story</em></h2>
<div class="about-text reveal d2">
${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : (em ? `<p ${ed('portfolio.bio', true)}>Add a short introduction.</p>` : '')}
</div>
${aboutGridItems.length ? `<div class="about-grid reveal d3">${aboutGridItems.join('')}</div>` : ''}
</div>
</section>

<!-- ORDERED SECTIONS -->
${orderedSections}

<!-- CONTACT -->
<section id="s-contact">
<div class="orb ct-orb1"></div>
<div class="orb ct-orb2"></div>
<div class="orb ct-orb3"></div>
<div class="sec-tag ct-tag reveal" style="position:relative;z-index:2;justify-content:center">Get in Touch</div>
<h2 class="ct-headline reveal d1">Let&#8217;s Build<em>Something Great</em></h2>
<!-- Must render the FULL bio: this element is bound to portfolio.bio, and the
     editor saves whatever text it contains. A .slice() here silently truncated
     the stored bio to 120 chars the moment the user touched it. -->
${v.bio ? `<p class="ct-sub reveal d2" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="ct-links reveal d3">
${socialItems.join('\n')}
</div>
</section>

<!-- FOOTER -->
<footer class="mk-footer">
<span class="mk-footer-brand" ${ed('profile.full_name')}>${v.name}</span>
<span class="mk-footer-copy">&copy; ${new Date().getFullYear()} &middot; Marketing Portfolio</span>
</footer>

${interactiveJs}
</body>
</html>`;
}
