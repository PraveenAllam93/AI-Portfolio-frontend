/**
 * Template: Vantage
 * Marketing theme — premium dark editorial "brand director" portfolio.
 * Deep navy (#0B0F19) canvas with gold (#D4AF37) + electric-blue accents,
 * gradient-mesh hero, Playfair Display display serif, Inter body, Syne labels.
 * Light/dark theme toggle. Signature: gold gradient buttons, hero KPI row,
 * glass cards with gold underline sweeps, alternating experience timeline,
 * achievement stat cards, campaign cards with gradient covers, custom cursor
 * (published-only), scroll reveals.
 * Ported from brand_marketing_portfolio.html, mapped to our marketing data
 * model. No foreign projects/awards sections; dead analytics/testimonials dropped.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}
function deriveRoas(campaigns: NormalizedData['campaigns']): number {
	for (const c of campaigns ?? []) for (const m of c.performance_metrics ?? []) {
		const mt = m.match(/(\d+(?:\.\d+)?)\s*[x×]/i);
		if (mt) return Math.round(parseFloat(mt[1]));
	}
	return 0;
}
const CARD_ICONS = ['✦', '◆', '❖', '✧', '◈', '⬡', '✤', '❋'];

function css(em: boolean): string {
	return `
:root{
  --black:#0B0F19;--navy:#111827;--navy-light:#1C2537;--gold:#D4AF37;--gold-light:#E8C84A;
  --gold-dim:rgba(212,175,55,0.15);--blue:#3B82F6;--white:#FFFFFF;
  --bg:#0B0F19;--surface:#111827;--surface-2:#1C2537;--text:#FFFFFF;--text-muted:#9CA3AF;
  --border:rgba(255,255,255,0.07);--border-gold:rgba(212,175,55,0.3);
  --radius:16px;--radius-lg:24px;--shadow-gold:0 0 40px rgba(212,175,55,0.15);--shadow-card:0 20px 60px rgba(0,0,0,0.5);
  --transition:all 0.4s cubic-bezier(0.23,1,0.32,1);--transition-fast:all 0.25s cubic-bezier(0.23,1,0.32,1);
  --font-display:'Playfair Display',Georgia,serif;--font-body:'Inter',system-ui,sans-serif;--font-label:'Syne',sans-serif;
}
[data-theme="light"]{--bg:#F8F9FC;--surface:#FFFFFF;--surface-2:#F1F3F9;--text:#0B0F19;--text-muted:#6B7280;--border:rgba(0,0,0,0.07);--shadow-card:0 20px 60px rgba(0,0,0,0.1)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);overflow-x:hidden;transition:background .4s ease,color .4s ease${em ? '' : ';cursor:none'}}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
ul{list-style:none}
${em ? '' : `
#cursor{position:fixed;width:12px;height:12px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .1s ease,width .3s ease,height .3s ease;mix-blend-mode:difference}
#cursor-ring{position:fixed;width:40px;height:40px;border:1.5px solid rgba(212,175,55,0.5);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .15s ease,width .3s ease,height .3s ease}
@media(hover:none){#cursor,#cursor-ring{display:none}}
`}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:0 48px;height:72px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(20px) saturate(180%);background:rgba(11,15,25,0.6);border-bottom:1px solid var(--border);transition:var(--transition)}
[data-theme="light"] nav{background:rgba(248,249,252,0.7)}
.nav-logo{font-family:var(--font-display);font-size:1.35rem;font-weight:700;letter-spacing:-.02em;color:var(--text)}
.nav-logo span{color:var(--gold)}
.nav-links{display:flex;gap:36px;align-items:center}
.nav-links a{font-family:var(--font-label);font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);transition:var(--transition-fast);position:relative}
.nav-links a:hover{color:var(--text)}
.nav-actions{display:flex;align-items:center;gap:16px}
.theme-toggle{width:44px;height:24px;background:var(--surface-2);border-radius:12px;position:relative;cursor:pointer;border:1px solid var(--border)}
.theme-toggle::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;background:var(--gold);border-radius:50%;transition:transform .3s ease}
[data-theme="light"] .theme-toggle::after{transform:translateX(20px)}
.btn-hire{font-family:var(--font-label);font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:10px 24px;border-radius:100px;background:linear-gradient(135deg,var(--gold),#B8941E);color:var(--black);border:none;cursor:pointer;transition:var(--transition-fast);box-shadow:0 4px 20px rgba(212,175,55,0.3)}
.btn-hire:hover{transform:translateY(-2px)}

/* HERO */
#hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding:120px 48px 80px}
.hero-bg{position:absolute;inset:0;z-index:0;overflow:hidden}
.hero-bg::before{content:'';position:absolute;top:-30%;left:-20%;width:70%;height:70%;background:radial-gradient(ellipse,rgba(212,175,55,0.08) 0%,transparent 70%);animation:bgFloat1 12s ease-in-out infinite}
.hero-bg::after{content:'';position:absolute;bottom:-20%;right:-10%;width:60%;height:60%;background:radial-gradient(ellipse,rgba(59,130,246,0.07) 0%,transparent 70%);animation:bgFloat2 15s ease-in-out infinite}
@keyframes bgFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(4%,6%) scale(1.08)}}
@keyframes bgFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-3%,-4%) scale(1.06)}}
.hero-gridlines{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:80px 80px;z-index:0}
.hero-inner{position:relative;z-index:1;max-width:1400px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 460px;gap:80px;align-items:center}
.hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:32px}
.eyebrow-pill{font-family:var(--font-label);font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);background:var(--gold-dim);border:1px solid var(--border-gold);padding:6px 14px;border-radius:100px}
.eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
.hero-title{font-family:var(--font-display);font-size:clamp(3rem,5.5vw,6rem);font-weight:800;line-height:1;letter-spacing:-.03em;margin-bottom:24px}
.hero-title .gold{color:var(--gold);font-style:italic}
.hero-subtitle{font-size:1.05rem;line-height:1.75;color:var(--text-muted);max-width:520px;margin-bottom:40px}
.hero-actions{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:64px}
.btn-primary{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-label);font-size:.82rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:16px 32px;border-radius:100px;background:linear-gradient(135deg,var(--gold),#B8941E);color:var(--black);border:none;cursor:pointer;transition:var(--transition-fast);box-shadow:0 4px 24px rgba(212,175,55,0.35)}
.btn-primary:hover{transform:translateY(-3px)}
.btn-secondary{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-label);font-size:.82rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:15px 32px;border-radius:100px;background:transparent;color:var(--text);border:1px solid var(--border);cursor:pointer;transition:var(--transition-fast)}
.btn-secondary:hover{background:var(--surface-2);transform:translateY(-2px)}
.hero-kpis{display:flex;gap:40px;flex-wrap:wrap}
.kpi-number{font-family:var(--font-display);font-size:2rem;font-weight:700;color:var(--text);line-height:1;margin-bottom:4px}
.kpi-number span{color:var(--gold)}
.kpi-label{font-family:var(--font-label);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)}
.kpi-divider{width:1px;background:var(--border);align-self:stretch}
.hero-portrait-wrap{position:relative}
.portrait-frame{position:relative;width:100%;aspect-ratio:4/5;border-radius:20px;overflow:hidden;background:linear-gradient(145deg,var(--surface-2),var(--navy-light))}
.portrait-frame img{width:100%;height:100%;object-fit:cover}
.portrait-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:6rem;color:var(--gold);opacity:.25}
.portrait-border{position:absolute;inset:-1px;border-radius:20px;border:1px solid var(--border-gold);pointer-events:none}

/* SECTION SHARED */
section{position:relative;padding:120px 48px;max-width:1400px;margin:0 auto}
.section-eyebrow{font-family:var(--font-label);font-size:.7rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:12px}
.section-eyebrow::before{content:'';width:32px;height:1px;background:var(--gold)}
.section-title{font-family:var(--font-display);font-size:clamp(2rem,4vw,3.5rem);font-weight:700;line-height:1.1;letter-spacing:-.02em;color:var(--text);margin-bottom:20px}
.section-sub{font-size:1rem;line-height:1.75;color:var(--text-muted);max-width:560px}
.reveal{opacity:0;transform:translateY(50px);transition:opacity .8s cubic-bezier(0.23,1,0.32,1),transform .8s cubic-bezier(0.23,1,0.32,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}

/* surface backgrounds */
.bg-surface{background:var(--surface)}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.about-visual{position:relative}
.about-img-wrap{border-radius:20px;overflow:hidden;aspect-ratio:4/5;background:linear-gradient(145deg,var(--navy-light),var(--surface-2));position:relative;display:flex;align-items:center;justify-content:center}
.about-img-wrap img{width:100%;height:100%;object-fit:cover}
.about-img-mark{font-family:var(--font-display);font-weight:800;font-size:5rem;color:var(--gold);opacity:.2}
.about-stat-card{position:absolute;bottom:-24px;right:-24px;background:var(--black);border:1px solid var(--border-gold);border-radius:16px;padding:20px 24px;box-shadow:var(--shadow-gold)}
[data-theme="light"] .about-stat-card{background:var(--white)}
.about-stat-number{font-family:var(--font-display);font-size:2.5rem;font-weight:800;color:var(--gold);line-height:1;margin-bottom:4px}
.about-stat-label{font-size:.78rem;color:var(--text-muted);font-weight:500}
.about-lead{font-family:var(--font-display);font-size:1.4rem;font-weight:500;font-style:italic;line-height:1.5;color:var(--text);margin-bottom:28px}
.about-body{font-size:.97rem;line-height:1.8;color:var(--text-muted);margin-bottom:40px}
.about-highlights{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.highlight-item{display:flex;align-items:flex-start;gap:12px;padding:16px;background:var(--surface-2);border-radius:12px;border:1px solid var(--border)}
.highlight-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);margin-top:5px;flex-shrink:0}
.highlight-text strong{display:block;font-size:.85rem;font-weight:600;color:var(--text);margin-bottom:2px}
.highlight-text small{font-size:.75rem;color:var(--text-muted)}

/* EXPERTISE / SKILLS */
.expertise-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:60px}
.expertise-card{padding:32px 28px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);position:relative;overflow:hidden;transition:var(--transition)}
.expertise-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--blue));transform:scaleX(0);transition:transform .4s ease;transform-origin:left}
.expertise-card:hover{transform:translateY(-6px);border-color:var(--border-gold);box-shadow:var(--shadow-card)}
.expertise-card:hover::after{transform:scaleX(1)}
.card-icon{width:52px;height:52px;border-radius:14px;background:var(--gold-dim);display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:var(--gold);margin-bottom:20px;transition:var(--transition-fast)}
.expertise-card:hover .card-icon{background:rgba(212,175,55,0.25);transform:scale(1.1)}
.card-title{font-size:1rem;font-weight:600;color:var(--text);margin-bottom:14px;line-height:1.3}
.card-chips{display:flex;flex-wrap:wrap;gap:8px}
.gchip{padding:5px 12px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-muted);border-radius:100px;font-size:.74rem;font-weight:500}

/* CAMPAIGNS */
.campaigns-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:60px}
.campaign-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;transition:var(--transition);position:relative}
.campaign-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-card);border-color:rgba(255,255,255,0.15)}
.campaign-visual{height:160px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:2.4rem;color:rgba(255,255,255,0.5)}
.cp0{background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)}
.cp1{background:linear-gradient(135deg,#1a0a0a,#2d1515,#4a1818)}
.cp2{background:linear-gradient(135deg,#0a1a0f,#0d2b15,#1a4a25)}
.cp3{background:linear-gradient(135deg,#0a0a1a,#12122d,#1a1a45)}
.campaign-badge{position:absolute;top:16px;left:16px;font-family:var(--font-label);font-size:.65rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:100px;backdrop-filter:blur(20px);background:rgba(212,175,55,0.2);border:1px solid rgba(212,175,55,0.4);color:var(--gold)}
.campaign-content{padding:28px}
.campaign-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.campaign-client{font-family:var(--font-label);font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}
.campaign-name{font-family:var(--font-display);font-size:1.3rem;font-weight:700;color:var(--text);margin-bottom:16px;line-height:1.3}
.campaign-metrics{display:flex;flex-direction:column;gap:8px}
.campaign-metric{font-size:.85rem;color:var(--text-muted);line-height:1.5;padding-left:18px;position:relative}
.campaign-metric::before{content:'';position:absolute;left:0;top:8px;width:8px;height:2px;background:var(--gold)}
.campaign-channels{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px}

/* TIMELINE (experience) */
.timeline-container{position:relative;margin-top:60px}
.timeline-line{position:absolute;left:24px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,var(--border-gold),var(--border-gold),transparent)}
.timeline-items{position:relative;display:flex;flex-direction:column;gap:40px}
.timeline-item{position:relative;padding-left:72px}
.t-dot{position:absolute;left:0;top:4px;width:48px;height:48px;border-radius:50%;background:var(--surface);border:2px solid var(--border-gold);display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--gold);box-shadow:0 0 20px rgba(212,175,55,0.2)}
.t-content{padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:var(--transition)}
.timeline-item:hover .t-content{border-color:var(--border-gold);box-shadow:var(--shadow-card)}
.t-step{font-family:var(--font-label);font-size:.65rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
.t-title{font-size:1.15rem;font-weight:700;color:var(--text);margin-bottom:4px}
.t-company{font-size:.85rem;color:var(--gold);font-weight:600;margin-bottom:10px}
.t-desc{font-size:.87rem;color:var(--text-muted);line-height:1.7;margin-bottom:10px}
.t-metrics{display:flex;flex-direction:column;gap:5px;margin-bottom:8px}
.t-metric{font-size:.83rem;color:var(--text-muted);line-height:1.5;padding-left:16px;position:relative}
.t-metric::before{content:'';position:absolute;left:0;top:8px;width:7px;height:7px;border-radius:50%;background:var(--gold)}
.t-chips{display:flex;flex-wrap:wrap;gap:6px}

/* ACHIEVEMENTS */
.achievements-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-top:60px}
.achievement-card{padding:40px 36px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);position:relative;overflow:hidden;transition:var(--transition)}
[data-theme="light"] .achievement-card{background:var(--surface)}
.achievement-card:hover{border-color:var(--border-gold);transform:translateY(-4px);box-shadow:var(--shadow-gold)}
.achievement-icon{font-size:1.8rem;color:var(--gold);margin-bottom:20px}
.achievement-year{font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--gold);line-height:1;margin-bottom:12px}
.achievement-label{font-size:1.05rem;font-weight:600;color:var(--text);margin-bottom:8px;font-family:var(--font-display)}
.achievement-sub{font-size:.85rem;color:var(--text-muted);line-height:1.6}
.achievement-link{display:inline-block;margin-top:12px;font-size:.78rem;color:var(--gold);border-bottom:1px solid var(--border-gold)}

/* MINI CARDS (education/certs/custom) */
.mini-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:60px}
.mini-card{padding:28px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:var(--transition);position:relative}
.mini-card:hover{transform:translateY(-4px);border-color:var(--border-gold);box-shadow:var(--shadow-card)}
.mini-year{font-family:var(--font-label);font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
.mini-title{font-family:var(--font-display);font-size:1.15rem;font-weight:700;color:var(--text);line-height:1.3;margin-bottom:6px}
.mini-meta{font-size:.85rem;color:var(--text-muted);line-height:1.6}
.mini-badge{display:inline-flex;margin-top:12px;padding:4px 12px;background:var(--gold-dim);border:1px solid var(--border-gold);color:var(--gold);border-radius:100px;font-size:.72rem;font-weight:600}
.mini-link{display:inline-block;margin-top:12px;font-size:.78rem;color:var(--gold);border-bottom:1px solid var(--border-gold)}
.mini-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}

/* CONTACT */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:60px;align-items:start}
.contact-items{display:flex;flex-direction:column;gap:16px}
.contact-item{display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:var(--transition)}
.contact-item:hover{border-color:var(--border-gold);transform:translateX(4px)}
.contact-icon{width:44px;height:44px;border-radius:12px;background:var(--gold-dim);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:1.1rem;flex-shrink:0}
.contact-label{font-family:var(--font-label);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)}
.contact-value{font-size:.95rem;color:var(--text);font-weight:500;margin-top:2px}
.contact-cta{background:linear-gradient(145deg,var(--surface),var(--surface-2));border:1px solid var(--border-gold);border-radius:var(--radius-lg);padding:48px;text-align:center}
.contact-cta-mark{font-family:var(--font-display);font-size:4rem;font-weight:800;color:var(--gold);line-height:1;margin-bottom:12px}
.contact-cta-txt{font-family:var(--font-label);font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)}

/* FOOTER */
footer{border-top:1px solid var(--border);padding:40px 48px;max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-logo{font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--text)}
.footer-logo span{color:var(--gold)}
.footer-copy{font-size:.8rem;color:var(--text-muted)}

/* EDIT CONTROLS */
.ce-add-btn{display:block;margin-top:32px;padding:14px 24px;border:1px dashed var(--border-gold);border-radius:100px;background:var(--gold-dim);color:var(--gold);font-family:var(--font-label);font-size:.78rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;width:100%;text-align:center}
.ce-add-btn:hover{background:rgba(212,175,55,0.22)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:14px;right:14px;width:26px;height:26px;border-radius:50%;border:none;background:var(--gold);color:var(--black);font-size:12px;line-height:26px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}

@media(max-width:960px){
  #hero{padding:100px 24px 60px}.hero-inner{grid-template-columns:1fr;gap:48px}.hero-portrait-wrap{max-width:360px}
  section{padding:80px 24px}.about-grid,.contact-grid,.campaigns-grid{grid-template-columns:1fr}
  .nav-links{display:none}nav{padding:0 24px}
}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}.hero-bg::before,.hero-bg::after{animation:none}}
`;
}

const VANTAGE_SCRIPT = (em: boolean) => `<script>
(function(){
  var toggle=document.getElementById('themeToggle');
  if(toggle){toggle.addEventListener('click',function(){
    var root=document.documentElement;
    root.setAttribute('data-theme',root.getAttribute('data-theme')==='dark'?'light':'dark');
  });}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  ${em ? '' : `
  var cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
  if(cur){var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
    (function t(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(t);})();
  }`}
})();
<\/script>`;

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const hidden = v.hidden_sections;
	const order = v.section_order ?? DEFAULT_SECTION_ORDER;
	const ed = (path: string, multi = false): string => em ? _editable(path, multi) : '';
	const le = (path: string): string => em ? _listEditable(path) : '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const yearsExp = v.template_overrides?.years_experience ?? yearsFromExperience(v.experience);
	const campaignsCount = v.template_overrides?.campaigns_count ?? (v.campaigns?.length ?? 0);
	const avgRoas = v.template_overrides?.avg_roas ?? deriveRoas(v.campaigns);
	const rolesCount = v.experience?.length ?? 0;
	const statNum = (key: string, val: number): string => `<span ${ed(`template_overrides.${key}`)}>${val}</span>`;
	const showYears = statShown(v, 'years_experience', yearsExp);
	const showCampaigns = statShown(v, 'campaigns_count', campaignsCount);
	const showRoas = statShown(v, 'avg_roas', avgRoas);
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'MK';

	const nameParts = v.name.split(/\s+/);
	const heroName = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')} <span class="gold">${nameParts[nameParts.length - 1]}</span>`
		: `<span class="gold">${v.name}</span>`;

	// HERO KPIs
	const kpis = [
		showYears ? `<div><div class="kpi-number">${statNum('years_experience', yearsExp)}<span>+</span></div><div class="kpi-label">Years Experience</div></div>` : '',
		showCampaigns ? `<div><div class="kpi-number">${statNum('campaigns_count', campaignsCount)}<span>+</span></div><div class="kpi-label">Campaigns</div></div>` : '',
		showRoas ? `<div><div class="kpi-number">${statNum('avg_roas', avgRoas)}<span>×</span></div><div class="kpi-label">Avg. ROAS</div></div>` : '',
	].filter(Boolean);
	const kpiRow = kpis.join('<div class="kpi-divider"></div>');

	// ABOUT
	const highlights = (v.skill_groups ?? []).slice(0, 4).map(g => `<div class="highlight-item"><div class="highlight-dot"></div><div class="highlight-text"><strong>${g.category || 'Expertise'}</strong><small>${g.skills.slice(0, 2).join(' · ')}</small></div></div>`).join('');
	const aboutHtml = (v.bio || v.uniqueValue)
		? `<section id="about" class="bg-surface"><div class="about-grid">
<div class="about-visual reveal">
<div class="about-img-wrap" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="about-img-mark">${initials}</div>`}</div>
${showYears ? `<div class="about-stat-card"><div class="about-stat-number">${statNum('years_experience', yearsExp)}+</div><div class="about-stat-label">Years Experience</div></div>` : ''}
</div>
<div class="about-content reveal reveal-delay-1">
<div class="section-eyebrow">About</div>
<h2 class="section-title">The strategy behind the brand</h2>
${v.uniqueValue ? `<p class="about-lead" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${v.bio ? `<p class="about-body" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${highlights ? `<div class="about-highlights">${highlights}</div>` : ''}
</div>
</div></section>` : '';

	// SKILLS (expertise cards)
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills"><div class="section-eyebrow reveal">Expertise</div><h2 class="section-title reveal">Capabilities &amp; craft</h2>
<div class="expertise-grid">
${v.skill_groups.map((g, gi) => `<div class="expertise-card reveal"${iw}>
${delBtn('skills', gi)}
<div class="card-icon">${CARD_ICONS[gi % CARD_ICONS.length]}</div>
<div class="card-title" ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
<div class="card-chips" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="gchip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>` : '';

	// EXPERIENCE (timeline)
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" class="bg-surface"><div class="section-eyebrow reveal">Experience</div><h2 class="section-title reveal">Career timeline</h2>
<div class="timeline-container"><div class="timeline-line"></div><div class="timeline-items">
${v.experience.map((exp, i) => `<div class="timeline-item reveal"${iw}>
${delBtn('experience', i)}
<div class="t-dot">${CARD_ICONS[i % CARD_ICONS.length]}</div>
<div class="t-content">
<div class="t-step">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : (em ? `<span ${ed(`experience.${i}.start_date`)}>Start</span>` : '')}${(exp.start_date && exp.end_date) ? ' — ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : (em ? `<span ${ed(`experience.${i}.end_date`)}>End</span>` : '')}</div>
<div class="t-title" ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}</div>
${exp.company ? `<div class="t-company"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="t-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<div class="t-metrics" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<div class="t-metric">${k}</div>`).join('')}</div>` : ''}
${exp.channels_managed?.length ? `<div class="t-chips" ${le(`experience.${i}.channels_managed`)}>${exp.channels_managed.map(c => `<span class="gchip">${c}</span>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div></div>
${addBtn('experience', 'Experience')}
</section>` : '';

	// CAMPAIGNS
	const campaignsHtml = !hidden.has('campaigns') && (v.campaigns?.length || em)
		? `<section id="campaigns"><div class="section-eyebrow reveal">Campaigns</div><h2 class="section-title reveal">Signature campaigns</h2>
<div class="campaigns-grid">
${(v.campaigns ?? []).map((c, i) => `<div class="campaign-card reveal"${iw}>
${delBtn('campaigns', i)}
<div class="campaign-visual cp${i % 4}">${(c.campaign_name || '?').slice(0, 2).toUpperCase()}${c.campaign_type ? `<div class="campaign-badge" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}</div>
<div class="campaign-content">
<div class="campaign-meta"><span class="campaign-client">${c.budget ? `Budget <span ${ed(`campaigns.${i}.budget`)}>${c.budget}</span>` : 'Campaign'}</span></div>
<div class="campaign-name" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || 'Campaign'}</div>
${c.performance_metrics?.length ? `<div class="campaign-metrics" ${le(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map(m => `<div class="campaign-metric">${m}</div>`).join('')}</div>` : ''}
${c.channels_used?.length ? `<div class="campaign-channels" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.map(ch => `<span class="gchip">${ch}</span>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('campaigns', 'Campaign')}
</section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="bg-surface"><div class="section-eyebrow reveal">Recognition</div><h2 class="section-title reveal">Awards &amp; achievements</h2>
<div class="achievements-grid">
${v.achievements.map((a, i) => `<div class="achievement-card reveal"${iw}>
${delBtn('achievements', i)}
<div class="achievement-icon">${CARD_ICONS[i % CARD_ICONS.length]}</div>
${a.year ? `<div class="achievement-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
<div class="achievement-label" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="achievement-sub" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
${a.url ? `<a href="${a.url}" class="achievement-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education"><div class="section-eyebrow reveal">Education</div><h2 class="section-title reveal">Academic background</h2>
<div class="mini-grid">
${v.education.map((edu, i) => `<div class="mini-card reveal"${iw}>
${delBtn('education', i)}
<div class="mini-year">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : (em ? `<span ${ed(`education.${i}.start_year`)}>Start</span>` : '')}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : (em ? `<span ${ed(`education.${i}.end_year`)}>End</span>` : '')}</div>
<div class="mini-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
${edu.institution ? `<div class="mini-meta"><span ${ed(`education.${i}.institution`)}>${edu.institution}</span>${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<span class="mini-badge" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" class="bg-surface"><div class="section-eyebrow reveal">Credentials</div><h2 class="section-title reveal">Certifications</h2>
<div class="mini-grid">
${v.certifications.map((c, i) => `<div class="mini-card reveal"${iw}>
${delBtn('certifications', i)}
${c.year ? `<div class="mini-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
<div class="mini-title" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="mini-meta" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.url ? `<a href="${c.url}" class="mini-link" target="_blank" rel="noopener noreferrer">Verify &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="mini-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<div class="mini-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.label ? `<div class="mini-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="mini-meta" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="mini-chips" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="gchip">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="mini-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="section-eyebrow reveal">${cs.title}</div><h2 class="section-title reveal">${cs.title}</h2>
<div class="mini-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		skills: skillsHtml, experience: experienceHtml, campaigns: campaignsHtml,
		achievements: achievementsHtml, education: educationHtml, certifications: certsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// CONTACT
	const contactItems = [
		v.email ? `<a class="contact-item" href="mailto:${v.email}"><div class="contact-icon">✉</div><div><div class="contact-label">Email</div><div class="contact-value" ${ed('profile.email')}>${v.email}</div></div></a>` : '',
		v.phone ? `<a class="contact-item" href="tel:${v.phone}"><div class="contact-icon">☎</div><div><div class="contact-label">Phone</div><div class="contact-value" ${ed('profile.phone')}>${v.phone}</div></div></a>` : '',
		v.location ? `<div class="contact-item"><div class="contact-icon">◈</div><div><div class="contact-label">Location</div><div class="contact-value" ${ed('profile.location')}>${v.location}</div></div></div>` : '',
		v.linkedin_url ? `<a class="contact-item" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer"><div class="contact-icon">in</div><div><div class="contact-label">LinkedIn</div><div class="contact-value">Connect</div></div></a>` : '',
	].filter(Boolean).join('');
	const contactHtml = contactItems
		? `<section id="contact"><div class="section-eyebrow reveal">Contact</div><h2 class="section-title reveal">Let's build a brand worth remembering</h2>
<div class="contact-grid">
<div class="contact-items reveal">${contactItems}</div>
<div class="contact-cta reveal reveal-delay-1"><div class="contact-cta-mark">${initials}</div><div class="contact-cta-txt">Available for engagements</div></div>
</div></section>` : '';

	const cursorMarkup = em ? '' : '<div id="cursor"></div><div id="cursor-ring"></div>';

	return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Marketing Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css(em)}</style>
</head>
<body>
${cursorMarkup}
<nav>
<div class="nav-logo" ${ed('profile.full_name')}>${v.name.split(' ')[0]}<span>.</span></div>
<div class="nav-links">
<a href="#about">About</a>
<a href="#skills">Expertise</a>
<a href="#campaigns">Campaigns</a>
<a href="#experience">Experience</a>
</div>
<div class="nav-actions">
<div class="theme-toggle" id="themeToggle" title="Toggle theme"></div>
${v.email ? `<a href="mailto:${v.email}" class="btn-hire">Hire Me</a>` : ''}
</div>
</nav>

<section id="hero">
<div class="hero-bg"></div>
<div class="hero-gridlines"></div>
<div class="hero-inner">
<div class="hero-copy">
<div class="hero-eyebrow"><span class="eyebrow-dot"></span><span class="eyebrow-pill">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Brand Marketing'}</span></div>
<h1 class="hero-title" ${ed('profile.full_name')}>${heroName}</h1>
${v.headline ? `<p class="hero-subtitle" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
${v.bio && !v.headline ? `<p class="hero-subtitle" ${ed('portfolio.bio', true)}>${v.bio.slice(0, 200)}</p>` : ''}
<div class="hero-actions">
<a href="#campaigns" class="btn-primary">View Work</a>
<a href="#contact" class="btn-secondary">Get in Touch</a>
</div>
${kpiRow ? `<div class="hero-kpis">${kpiRow}</div>` : ''}
</div>
<div class="hero-portrait-wrap">
<div class="portrait-frame" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="portrait-mark">${initials}</div>`}<div class="portrait-border"></div></div>
</div>
</div>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
<div class="footer-logo" ${ed('profile.full_name')}>${v.name}<span>.</span></div>
<div class="footer-copy">&copy; ${new Date().getFullYear()} · ${v.profile_headline || v.headline || 'Marketing Portfolio'}${v.location ? ` · ${v.location}` : ''}</div>
</footer>

${VANTAGE_SCRIPT(em)}
${EDITOR_SCRIPT}
</body>
</html>`;
}
