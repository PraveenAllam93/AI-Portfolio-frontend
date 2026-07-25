/**
 * Template: Bloom
 * Marketing theme — soft-luxury light portfolio. Blush / sage / cream / gold
 * palette, floating organic blobs, glassmorphic cards, Playfair Display + Inter.
 * Signature: pill eyebrow, hero visual card with avatar + floating stat chips,
 * dark charcoal impact band, glass expertise cards, campaign case cards,
 * about pillars, scroll reveals, nav-scroll border.
 * Ported from growth-marketing-portfolio.2.html, mapped to our marketing data
 * model (cases→campaigns, expertise→skills; drops the Chart.js/Swiper dashboards,
 * funnel, testimonials; no foreign projects section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap';

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
const EXP_ICONS = ['🎯', '📈', '🌿', '📊', '💬', '✨', '📧', '🔍', '💎', '🚀'];

function css(): string {
	return `
:root{
  --blush:#F4DCD7;--blush-deep:#ECC5BC;--sage:#9BB6B1;--sage-dark:#6E9993;--sage-lite:#D6E8E6;
  --charcoal:#4D4A5D;--charcoal-deep:#3A3748;--cream:#FAF4F1;--cream-deep:#F2E9E4;--white:#FFFFFF;
  --ink:#2C2A38;--muted:#8A8699;--border:#E8DED9;--border-sage:#C2D8D5;--gold:#C9956A;--gold-lite:#F5E6D8;
  --font-display:'Playfair Display',Georgia,serif;--font-body:'Inter',system-ui,sans-serif;
  --r-sm:8px;--r-md:16px;--r-lg:24px;--r-xl:32px;--r-2xl:48px;
  --shadow-card:0 2px 24px rgba(77,74,93,0.06),0 1px 4px rgba(77,74,93,0.04);
  --shadow-lift:0 12px 48px rgba(77,74,93,0.10),0 3px 10px rgba(77,74,93,0.06);
  --shadow-sage:0 8px 32px rgba(155,182,177,0.28);
  --shadow-glass:0 8px 32px rgba(77,74,93,0.08),inset 0 1px 0 rgba(255,255,255,0.6);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--blush);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
ul{list-style:none}
.blob-bg{position:fixed;pointer-events:none;z-index:0;inset:0;overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:.5}
.blob-1{top:-10%;left:-8%;width:46vw;height:46vw;background:var(--blush-deep);animation:blobFloat1 18s ease-in-out infinite}
.blob-2{top:30%;right:-12%;width:40vw;height:40vw;background:var(--sage-lite);opacity:.45;animation:blobFloat2 22s ease-in-out infinite}
.blob-3{bottom:-5%;left:20%;width:42vw;height:42vw;background:var(--gold-lite);opacity:.35;animation:blobFloat3 26s ease-in-out infinite}
@keyframes blobFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(2%,3%) scale(1.05)}}
@keyframes blobFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-2%,-2%) scale(1.06)}}
@keyframes blobFloat3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(1%,-2%) scale(1.04)}}
nav,section,footer{position:relative;z-index:1}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:0 clamp(1.5rem,5vw,5rem);height:72px;display:flex;align-items:center;justify-content:space-between;background:rgba(250,244,241,0.80);backdrop-filter:blur(24px) saturate(160%);border-bottom:1px solid transparent;transition:border-color .3s,box-shadow .3s}
nav.scrolled{border-color:var(--border);box-shadow:0 2px 24px rgba(77,74,93,0.07)}
.nav-logo{font-family:var(--font-display);font-size:1.25rem;font-weight:700;letter-spacing:-.02em;color:var(--charcoal)}
.nav-logo span{color:var(--sage-dark)}
.nav-links{display:flex;gap:2rem;align-items:center}
.nav-links a{font-size:.8rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--charcoal)}
.nav-cta{background:var(--charcoal)!important;color:var(--white)!important;padding:.5rem 1.25rem;border-radius:6px;font-weight:600!important;transition:background .2s,transform .2s}
.nav-cta:hover{background:var(--sage-dark)!important;transform:translateY(-1px)}

/* SECTION */
.section{padding:clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,5rem)}
.section-label{font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--sage-dark);margin-bottom:.875rem}
.section-title{font-family:var(--font-display);font-size:clamp(2rem,4vw,3.25rem);font-weight:700;line-height:1.15;letter-spacing:-.02em;color:var(--charcoal);margin-bottom:1.25rem}
.section-title em{font-style:italic;color:var(--sage-dark)}
.section-sub{font-size:1rem;color:var(--muted);max-width:560px;line-height:1.75}
.max-w{max-width:1400px;margin:0 auto}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .75s ease,transform .75s ease}
.reveal.visible{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}.reveal-delay-4{transition-delay:.4s}
.glass{background:rgba(255,255,255,0.62);backdrop-filter:blur(16px) saturate(140%);border:1px solid rgba(255,255,255,0.8);box-shadow:var(--shadow-glass)}

/* HERO */
#hero{min-height:100vh;padding-top:72px;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:clamp(2rem,5vw,6rem);padding-left:clamp(1.5rem,6vw,6rem);padding-right:clamp(1.5rem,6vw,6rem);position:relative;overflow:hidden}
.hero-eyebrow{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--sage-dark);margin-bottom:1.25rem;padding:.35rem .875rem;background:rgba(155,182,177,0.18);border:1px solid var(--border-sage);border-radius:100px;width:fit-content}
.hero-eyebrow::before{content:'';width:5px;height:5px;background:var(--sage);border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.5}}
.hero-headline{font-family:var(--font-display);font-size:clamp(2.6rem,5.5vw,5rem);font-weight:700;line-height:1.06;letter-spacing:-.03em;color:var(--charcoal);margin-bottom:1.5rem}
.hero-headline em{font-style:italic;color:var(--sage-dark)}
.hero-bio{font-size:1.0625rem;color:var(--muted);line-height:1.75;max-width:480px;margin-bottom:2.5rem}
.hero-ctas{display:flex;flex-wrap:wrap;gap:.875rem;margin-bottom:3.5rem}
.btn-primary{display:inline-flex;align-items:center;gap:.5rem;background:var(--charcoal);color:var(--white);font-size:.875rem;font-weight:600;padding:.85rem 1.75rem;border-radius:var(--r-sm);border:none;cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s}
.btn-primary:hover{background:var(--sage-dark);transform:translateY(-2px);box-shadow:var(--shadow-sage)}
.btn-secondary{display:inline-flex;align-items:center;gap:.5rem;background:transparent;color:var(--charcoal);font-size:.875rem;font-weight:600;padding:.85rem 1.75rem;border-radius:var(--r-sm);border:1.5px solid var(--border);cursor:pointer;transition:border-color .2s,background .2s,transform .2s}
.btn-secondary:hover{border-color:var(--sage);background:rgba(155,182,177,0.12);transform:translateY(-2px)}
.hero-stats{display:flex;gap:clamp(1.5rem,3vw,3rem)}
.hero-stat-val{font-family:var(--font-display);font-size:clamp(1.6rem,3vw,2.25rem);font-weight:700;color:var(--charcoal);letter-spacing:-.02em}
.hero-stat-val span{color:var(--sage-dark)}
.hero-stat-label{font-size:.75rem;color:var(--muted);font-weight:500;margin-top:.1rem}
.hero-visual{position:relative;display:flex;align-items:center;justify-content:center}
.hero-card-main{border-radius:var(--r-xl);padding:2rem;width:100%;max-width:460px;position:relative;background:rgba(255,255,255,0.62);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.8);box-shadow:var(--shadow-glass)}
.hero-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;gap:1rem}
.hero-avatar-wrap{position:relative;width:100%;aspect-ratio:1.2;border-radius:var(--r-lg);overflow:hidden;background:linear-gradient(135deg,var(--blush) 0%,var(--sage-lite) 100%);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem}
.hero-avatar-wrap img{width:100%;height:100%;object-fit:cover}
.hero-avatar{width:96px;height:96px;background:linear-gradient(135deg,var(--sage) 0%,var(--gold) 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:2rem;font-weight:700;color:var(--white)}
.hero-mini-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:.75rem}
.hero-mini-kpi{background:rgba(244,220,215,0.4);border-radius:var(--r-sm);padding:.75rem;text-align:center;border:1px solid var(--border)}
.hero-mini-kpi-val{font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--charcoal)}
.hero-mini-kpi-label{font-size:.66rem;color:var(--muted);margin-top:.1rem}
.float-chip{position:absolute;border-radius:var(--r-md);padding:.875rem 1.1rem;display:flex;align-items:center;gap:.6rem;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.9);box-shadow:var(--shadow-glass);animation:floatY 4s ease-in-out infinite}
.float-chip.chip-b{animation-delay:-2s}
.chip-icon{font-size:1.3rem}
.chip-val{font-size:.875rem;font-weight:700;color:var(--charcoal)}
.chip-sub{font-size:.68rem;color:var(--muted)}
.float-chip.chip-a{top:-1.5rem;right:-1.5rem}
.float-chip.chip-b{bottom:-1rem;left:-1.5rem}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

/* IMPACT (dark charcoal band) */
.impact{background:var(--charcoal-deep)}
.impact .section-label{color:var(--sage)}
.impact .section-title{color:var(--cream)}
.impact .section-sub{color:rgba(250,244,241,0.5)}
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;margin-top:3rem}
.kpi-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:var(--r-lg);padding:1.75rem;transition:background .3s,transform .3s;position:relative;overflow:hidden}
.kpi-card::before{content:'';position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,var(--sage),var(--gold));transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
.kpi-card:hover::before{transform:scaleX(1)}
.kpi-card:hover{background:rgba(255,255,255,0.09);transform:translateY(-3px)}
.kpi-icon{width:42px;height:42px;border-radius:var(--r-sm);background:rgba(155,182,177,0.15);display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:1rem}
.kpi-label{font-size:.75rem;font-weight:500;color:rgba(250,244,241,0.45);margin-bottom:.5rem}
.kpi-value{font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;color:var(--cream);letter-spacing:-.02em}

/* ABOUT */
#about{background:var(--cream)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,6vw,7rem);align-items:center}
.about-visual{position:relative}
.about-photo-wrap{border-radius:var(--r-2xl);overflow:hidden;background:linear-gradient(135deg,var(--blush) 0%,var(--sage-lite) 100%);aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;position:relative}
.about-photo-wrap img{width:100%;height:100%;object-fit:cover}
.about-photo-inner{width:70%;aspect-ratio:1;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:clamp(3rem,7vw,6rem);font-weight:700;color:var(--white)}
.about-tag{position:absolute;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.9);border-radius:var(--r-md);box-shadow:var(--shadow-glass);padding:1rem 1.25rem;display:flex;align-items:center;gap:.75rem}
.about-tag.t1{bottom:2rem;right:-1.5rem}
.about-tag.t2{top:2rem;left:-1.5rem}
.tag-icon{font-size:1.5rem}
.tag-val{font-weight:700;font-size:1rem;color:var(--charcoal)}
.tag-label{font-size:.7rem;color:var(--muted);margin-top:.1rem}
.about-bio{font-size:1.0625rem;color:var(--muted);line-height:1.8;margin-bottom:1.75rem}
.about-quote{font-family:var(--font-display);font-style:italic;font-size:1.2rem;line-height:1.5;color:var(--charcoal);border-left:2px solid var(--sage);padding-left:1.25rem;margin-bottom:1.75rem}
.about-pillars{display:grid;grid-template-columns:1fr 1fr;gap:.875rem;margin-top:2rem}
.pillar{padding:1.25rem;background:rgba(244,220,215,0.35);border-radius:var(--r-md);border-left:2px solid var(--sage)}
.pillar-title{font-size:.85rem;font-weight:700;color:var(--charcoal);margin-bottom:.25rem}
.pillar-text{font-size:.8rem;color:var(--muted);line-height:1.5}

/* EXPERTISE (skills) */
#skills{background:var(--blush)}
.expertise-header{text-align:center;margin-bottom:3rem}
.expertise-header .section-sub{margin:0 auto}
.expertise-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}
.expertise-card{background:rgba(255,255,255,0.6);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.8);border-radius:var(--r-lg);padding:1.75rem;box-shadow:var(--shadow-card);transition:box-shadow .3s,transform .3s,border-color .3s}
.expertise-card:hover{box-shadow:var(--shadow-lift);transform:translateY(-4px);border-color:var(--border-sage)}
.exp-icon{width:48px;height:48px;border-radius:var(--r-sm);background:rgba(155,182,177,0.18);display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:1rem}
.exp-title{font-size:.95rem;font-weight:700;color:var(--charcoal);margin-bottom:.75rem}
.exp-chips{display:flex;flex-wrap:wrap;gap:.4rem}
.echip{padding:.3rem .7rem;background:rgba(155,182,177,0.15);border:1px solid var(--border-sage);color:var(--sage-dark);border-radius:100px;font-size:.72rem;font-weight:500}

/* TIMELINE (experience) */
#experience{background:var(--cream)}
.tl{position:relative;margin-top:3rem;padding-left:2rem;border-left:1.5px solid var(--border-sage)}
.tl-item{position:relative;padding-bottom:2.5rem}
.tl-item:last-child{padding-bottom:0}
.tl-item::before{content:'';position:absolute;left:calc(-2rem - 6px);top:5px;width:11px;height:11px;border-radius:50%;background:var(--sage-dark);border:2px solid var(--cream)}
.tl-year{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--sage-dark);margin-bottom:.4rem}
.tl-title{font-family:var(--font-display);font-size:1.35rem;font-weight:700;color:var(--charcoal);margin-bottom:.25rem}
.tl-company{font-size:.85rem;color:var(--muted);font-weight:500;margin-bottom:.75rem}
.tl-desc{font-size:.9rem;color:var(--muted);line-height:1.7;max-width:620px;margin-bottom:.75rem}
.tl-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.6rem}
.tl-metrics{display:flex;flex-direction:column;gap:.35rem}
.tl-metric{font-size:.85rem;color:var(--muted);line-height:1.55;padding-left:1.1rem;position:relative}
.tl-metric::before{content:'';position:absolute;left:0;top:.6rem;width:.6rem;height:1.5px;background:var(--sage-dark)}

/* CASE CARDS (campaigns) */
#campaigns{background:var(--blush)}
.cases-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:1.5rem;margin-top:3rem}
.case-card{background:rgba(255,255,255,0.70);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.85);border-radius:var(--r-xl);overflow:hidden;box-shadow:var(--shadow-card);transition:box-shadow .3s,transform .3s}
.case-card:hover{box-shadow:var(--shadow-lift);transform:translateY(-4px)}
.case-header{padding:1.75rem 1.75rem 0;display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}
.case-industry{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sage-dark);background:rgba(155,182,177,0.18);border:1px solid var(--border-sage);padding:.2rem .6rem;border-radius:100px}
.case-budget{font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--charcoal);white-space:nowrap}
.case-body{padding:1.25rem 1.75rem 1.75rem}
.case-title{font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:var(--charcoal);margin-bottom:.75rem}
.case-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.1rem}
.case-results{display:grid;grid-template-columns:1fr 1fr;gap:.625rem}
.result-item{background:rgba(244,220,215,0.4);border-radius:var(--r-sm);padding:.625rem .75rem;border:1px solid var(--border)}
.result-label{font-size:.8rem;color:var(--sage-dark);font-weight:600;line-height:1.4}

/* CARD GRID (education/certs/achievements/custom) */
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;margin-top:3rem}
.mkcard{background:rgba(255,255,255,0.62);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.8);border-radius:var(--r-lg);padding:1.75rem;box-shadow:var(--shadow-card);transition:box-shadow .3s,transform .3s,border-color .3s;position:relative}
.mkcard:hover{box-shadow:var(--shadow-lift);transform:translateY(-4px);border-color:var(--border-sage)}
.mkcard-year{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--sage-dark);margin-bottom:.6rem}
.mkcard-title{font-family:var(--font-display);font-size:1.15rem;font-weight:700;color:var(--charcoal);line-height:1.25;margin-bottom:.35rem}
.mkcard-meta{font-size:.88rem;color:var(--muted);line-height:1.6}
.mkcard-badge{display:inline-flex;margin-top:.75rem;padding:.25rem .7rem;background:linear-gradient(135deg,var(--sage),var(--gold));color:var(--white);border-radius:100px;font-size:.68rem;font-weight:600;letter-spacing:.05em}
.mkcard-link{display:inline-flex;margin-top:.75rem;font-size:.8rem;font-weight:600;color:var(--sage-dark)}
.mkcard-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}

/* CONTACT */
#contact{background:var(--charcoal-deep)}
#contact .section-label{color:var(--sage)}
#contact .section-title{color:var(--cream)}
.contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,6vw,6rem);align-items:center;margin-top:3rem}
.contact-sub{font-size:1.0625rem;color:rgba(250,244,241,0.55);line-height:1.75;margin-bottom:2rem}
.contact-links{display:flex;flex-direction:column;gap:1rem}
.contact-link{display:flex;align-items:center;gap:1rem;padding:1.1rem 1.25rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:var(--r-md);transition:background .25s,transform .25s}
.contact-link:hover{background:rgba(255,255,255,0.09);transform:translateX(4px)}
.contact-link-icon{width:42px;height:42px;background:rgba(155,182,177,0.18);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.contact-link-label{font-size:.7rem;font-weight:600;color:rgba(250,244,241,0.45);text-transform:uppercase;letter-spacing:.06em}
.contact-link-val{font-size:.95rem;font-weight:600;color:var(--cream);margin-top:.1rem}
.contact-card{background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);border-radius:var(--r-xl);padding:2.5rem;text-align:center;color:var(--white)}
.contact-card-mark{font-family:var(--font-display);font-size:4rem;font-weight:700;line-height:1;margin-bottom:.75rem}
.contact-card-txt{font-size:.9rem;opacity:.9}

/* FOOTER */
footer{background:var(--charcoal-deep);padding:2rem clamp(1.5rem,5vw,5rem);border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.footer-logo{font-family:var(--font-display);font-size:1.15rem;font-weight:700;color:var(--cream)}
.footer-logo span{color:var(--sage)}
.footer-copy{font-size:.75rem;color:rgba(250,244,241,0.4)}

/* EDIT CONTROLS */
.ce-add-btn{display:block;margin-top:2rem;padding:.85rem 1.25rem;border:1.5px dashed var(--border-sage);border-radius:var(--r-sm);background:rgba(255,255,255,0.5);color:var(--sage-dark);font-family:var(--font-body);font-size:.8rem;font-weight:600;cursor:pointer;width:100%;text-align:center}
.ce-add-btn:hover{border-color:var(--sage-dark)}
.impact .ce-add-btn,#contact .ce-add-btn{background:rgba(255,255,255,0.06);color:var(--sage);border-color:rgba(255,255,255,0.2)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:1rem;right:1rem;width:24px;height:24px;border-radius:50%;border:none;background:var(--charcoal);color:#fff;font-size:12px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
.kpi-card .ce-del-btn,.contact-link .ce-del-btn{background:rgba(255,255,255,.25)}
[data-item-wrap]:hover .ce-del-btn{display:block}

@media(max-width:900px){
  #hero{grid-template-columns:1fr;text-align:center}.hero-eyebrow,.hero-stats,.hero-ctas{justify-content:center}.hero-eyebrow{margin-left:auto;margin-right:auto}.hero-bio{margin-left:auto;margin-right:auto}
  .hero-visual{display:none}.about-grid,.contact-wrap{grid-template-columns:1fr}
  .nav-links a:not(.nav-cta){display:none}
}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}.blob,.float-chip{animation:none}}
`;
}

const BLOOM_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>20);});}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
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
		? `${nameParts.slice(0, -1).join(' ')} <em>${nameParts[nameParts.length - 1]}</em>`
		: `<em>${v.name}</em>`;

	// HERO stats + visual card
	const heroStats = [
		showYears ? `<div><div class="hero-stat-val">${statNum('years_experience', yearsExp)}<span>+</span></div><div class="hero-stat-label">Years Experience</div></div>` : '',
		showCampaigns ? `<div><div class="hero-stat-val">${statNum('campaigns_count', campaignsCount)}<span>+</span></div><div class="hero-stat-label">Campaigns</div></div>` : '',
		showRoas ? `<div><div class="hero-stat-val">${statNum('avg_roas', avgRoas)}<span>×</span></div><div class="hero-stat-label">Avg. ROAS</div></div>` : '',
	].filter(Boolean).join('');
	const miniKpis = [
		showYears ? `<div class="hero-mini-kpi"><div class="hero-mini-kpi-val">${yearsExp}+</div><div class="hero-mini-kpi-label">Years</div></div>` : '',
		showCampaigns ? `<div class="hero-mini-kpi"><div class="hero-mini-kpi-val">${campaignsCount}+</div><div class="hero-mini-kpi-label">Campaigns</div></div>` : '',
		showRoas ? `<div class="hero-mini-kpi"><div class="hero-mini-kpi-val">${avgRoas}×</div><div class="hero-mini-kpi-label">ROAS</div></div>` : '',
	].filter(Boolean).join('');

	// IMPACT band
	const impactCards = [
		showYears ? `<div class="kpi-card reveal"><div class="kpi-icon">⏳</div><div class="kpi-label">Years of Experience</div><div class="kpi-value">${statNum('years_experience', yearsExp)}+</div></div>` : '',
		showCampaigns ? `<div class="kpi-card reveal reveal-delay-1"><div class="kpi-icon">🚀</div><div class="kpi-label">Campaigns Delivered</div><div class="kpi-value">${statNum('campaigns_count', campaignsCount)}+</div></div>` : '',
		showRoas ? `<div class="kpi-card reveal reveal-delay-2"><div class="kpi-icon">📈</div><div class="kpi-label">Average ROAS</div><div class="kpi-value">${statNum('avg_roas', avgRoas)}×</div></div>` : '',
		rolesCount > 0 ? `<div class="kpi-card reveal reveal-delay-3"><div class="kpi-icon">🏆</div><div class="kpi-label">Roles &amp; Engagements</div><div class="kpi-value">${rolesCount}</div></div>` : '',
	].filter(Boolean).join('');
	const impactHtml = impactCards
		? `<section class="section impact"><div class="max-w"><div style="text-align:center;margin-bottom:1rem"><div class="section-label reveal">By the Numbers</div><h2 class="section-title reveal">Measurable <em>impact</em></h2></div><div class="kpi-grid">${impactCards}</div></div></section>` : '';

	// ABOUT
	const pillars = (v.skill_groups ?? []).slice(0, 4).map(g => `<div class="pillar"><div class="pillar-title">${g.category || 'Expertise'}</div><div class="pillar-text">${g.skills.slice(0, 3).join(' · ')}</div></div>`).join('');
	const aboutHtml = (v.bio || v.uniqueValue)
		? `<section class="section" id="about"><div class="max-w about-grid">
<div class="about-visual reveal">
<div class="about-photo-wrap" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="about-photo-inner">${initials}</div>`}</div>
${showRoas ? `<div class="about-tag t1"><div class="tag-icon">📈</div><div><div class="tag-val">${statNum('avg_roas', avgRoas)}×</div><div class="tag-label">Avg. ROAS</div></div></div>` : ''}
${showYears ? `<div class="about-tag t2"><div class="tag-icon">⭐</div><div><div class="tag-val">${statNum('years_experience', yearsExp)}+ yrs</div><div class="tag-label">Experience</div></div></div>` : ''}
</div>
<div class="reveal reveal-delay-1">
<div class="section-label">About</div>
<h2 class="section-title">The strategy<br><em>behind the story</em></h2>
${v.bio ? `<p class="about-bio" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${v.uniqueValue ? `<p class="about-quote" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${pillars ? `<div class="about-pillars">${pillars}</div>` : ''}
</div>
</div></section>` : '';

	// SKILLS (expertise cards)
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section class="section" id="skills"><div class="max-w">
<div class="expertise-header"><div class="section-label reveal">Expertise</div><h2 class="section-title reveal">Skills &amp; <em>capabilities</em></h2></div>
<div class="expertise-grid">
${v.skill_groups.map((g, gi) => `<div class="expertise-card reveal"${iw}>
${delBtn('skills', gi)}
<div class="exp-icon">${EXP_ICONS[gi % EXP_ICONS.length]}</div>
<div class="exp-title" ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
<div class="exp-chips" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="echip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>` : '';

	// EXPERIENCE (timeline)
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section class="section" id="experience"><div class="max-w">
<div class="section-label reveal">Experience</div>
<h2 class="section-title reveal">Career <em>journey</em></h2>
<div class="tl">
${v.experience.map((exp, i) => `<div class="tl-item reveal"${iw}>
${delBtn('experience', i)}
<div class="tl-year">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : (em ? `<span ${ed(`experience.${i}.start_date`)}>Start</span>` : '')}${(exp.start_date && exp.end_date) ? ' – ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : (em ? `<span ${ed(`experience.${i}.end_date`)}>End</span>` : '')}</div>
<div class="tl-title" ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}</div>
${exp.company ? `<div class="tl-company"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="tl-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.channels_managed?.length ? `<div class="tl-chips" ${le(`experience.${i}.channels_managed`)}>${exp.channels_managed.map(c => `<span class="echip">${c}</span>`).join('')}</div>` : ''}
${exp.key_points?.length ? `<div class="tl-metrics" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<div class="tl-metric">${k}</div>`).join('')}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>` : '';

	// CAMPAIGNS (case cards)
	const campaignsHtml = !hidden.has('campaigns') && (v.campaigns?.length || em)
		? `<section class="section" id="campaigns"><div class="max-w">
<div class="section-label reveal">Selected Work</div>
<h2 class="section-title reveal">Campaign <em>case studies</em></h2>
<div class="cases-grid">
${(v.campaigns ?? []).map((c, i) => `<div class="case-card reveal"${iw}>
${delBtn('campaigns', i)}
<div class="case-header">
${c.campaign_type ? `<span class="case-industry" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</span>` : '<span class="case-industry">Campaign</span>'}
${c.budget ? `<div class="case-budget" ${ed(`campaigns.${i}.budget`)}>${c.budget}</div>` : ''}
</div>
<div class="case-body">
<div class="case-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || 'Campaign'}</div>
${c.channels_used?.length ? `<div class="case-chips" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.map(ch => `<span class="echip">${ch}</span>`).join('')}</div>` : ''}
${c.performance_metrics?.length ? `<div class="case-results" ${le(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map(m => `<div class="result-item"><div class="result-label">${m}</div></div>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('campaigns', 'Campaign')}
</div></section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section class="section" id="education" style="background:var(--cream)"><div class="max-w">
<div class="section-label reveal">Education</div>
<h2 class="section-title reveal">Academic <em>background</em></h2>
<div class="card-grid">
${v.education.map((edu, i) => `<div class="mkcard reveal"${iw}>
${delBtn('education', i)}
<div class="mkcard-year">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : (em ? `<span ${ed(`education.${i}.start_year`)}>Start</span>` : '')}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : (em ? `<span ${ed(`education.${i}.end_year`)}>End</span>` : '')}</div>
<div class="mkcard-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
${edu.institution ? `<div class="mkcard-meta"><span ${ed(`education.${i}.institution`)}>${edu.institution}</span>${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<span class="mkcard-badge" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section class="section" id="certifications"><div class="max-w">
<div class="section-label reveal">Credentials</div>
<h2 class="section-title reveal">Certifications</h2>
<div class="card-grid">
${v.certifications.map((c, i) => `<div class="mkcard reveal"${iw}>
${delBtn('certifications', i)}
${c.year ? `<div class="mkcard-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
<div class="mkcard-title" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="mkcard-meta" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.url ? `<a href="${c.url}" class="mkcard-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section class="section" id="achievements" style="background:var(--cream)"><div class="max-w">
<div class="section-label reveal">Recognition</div>
<h2 class="section-title reveal">Key <em>achievements</em></h2>
<div class="card-grid">
${v.achievements.map((a, i) => `<div class="mkcard reveal"${iw}>
${delBtn('achievements', i)}
${a.year ? `<div class="mkcard-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
<div class="mkcard-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="mkcard-meta" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="mkcard"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<div class="mkcard-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.label ? `<div class="mkcard-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="mkcard-meta" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="mkcard-chips" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="echip">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="mkcard-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section class="section" id="${cs.section_id}"><div class="max-w">
<div class="section-label reveal">${cs.title}</div>
<h2 class="section-title reveal">${cs.title}</h2>
<div class="card-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		experience: experienceHtml, campaigns: campaignsHtml, skills: skillsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// CONTACT
	const contactLinks = [
		v.email ? `<a class="contact-link" href="mailto:${v.email}"><div class="contact-link-icon">✉️</div><div><div class="contact-link-label">Email</div><div class="contact-link-val" ${ed('profile.email')}>${v.email}</div></div></a>` : '',
		v.phone ? `<a class="contact-link" href="tel:${v.phone}"><div class="contact-link-icon">📞</div><div><div class="contact-link-label">Phone</div><div class="contact-link-val" ${ed('profile.phone')}>${v.phone}</div></div></a>` : '',
		v.linkedin_url ? `<a class="contact-link" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer"><div class="contact-link-icon">in</div><div><div class="contact-link-label">LinkedIn</div><div class="contact-link-val">Connect</div></div></a>` : '',
		v.location ? `<div class="contact-link"><div class="contact-link-icon">📍</div><div><div class="contact-link-label">Location</div><div class="contact-link-val" ${ed('profile.location')}>${v.location}</div></div></div>` : '',
	].filter(Boolean).join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Marketing Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div class="blob-bg"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div></div>

<nav>
<div class="nav-logo" ${ed('profile.full_name')}>${v.name.split(' ')[0]}<span>.</span></div>
<div class="nav-links">
<a href="#about">About</a>
<a href="#skills">Skills</a>
<a href="#campaigns">Work</a>
<a href="#experience">Experience</a>
${v.email ? `<a href="mailto:${v.email}" class="nav-cta">Let's Talk</a>` : ''}
</div>
</nav>

<section id="hero">
<div class="reveal">
<div class="hero-eyebrow">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Growth Marketing'}${v.location ? ` · ${v.location}` : ''}</div>
<h1 class="hero-headline" ${ed('profile.full_name')}>${heroName}</h1>
${v.headline ? `<p class="hero-bio" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
${v.bio ? `<p class="hero-bio" ${ed('portfolio.bio', true)}>${v.bio.slice(0, 200)}${v.bio.length > 200 ? '…' : ''}</p>` : ''}
<div class="hero-ctas">
<a href="#campaigns" class="btn-primary">View Work</a>
<a href="#contact" class="btn-secondary">Get in Touch</a>
</div>
${heroStats ? `<div class="hero-stats">${heroStats}</div>` : ''}
</div>
<div class="hero-visual reveal reveal-delay-2">
<div class="hero-card-main">
<div class="hero-avatar-wrap" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="hero-avatar">${initials}</div>`}</div>
${miniKpis ? `<div class="hero-mini-kpis">${miniKpis}</div>` : ''}
${showCampaigns ? `<div class="float-chip chip-a"><span class="chip-icon">🚀</span><div><div class="chip-val">${campaignsCount}+</div><div class="chip-sub">Campaigns</div></div></div>` : ''}
${showRoas ? `<div class="float-chip chip-b"><span class="chip-icon">📈</span><div><div class="chip-val">${avgRoas}×</div><div class="chip-sub">Avg. ROAS</div></div></div>` : ''}
</div>
</div>
</section>

${impactHtml}
${aboutHtml}
${orderedSections}

<section class="section" id="contact"><div class="max-w">
<div class="section-label reveal">Contact</div>
<h2 class="section-title reveal">Let's grow <em>together</em></h2>
<div class="contact-wrap">
<div class="reveal">
<p class="contact-sub">Open to marketing &amp; growth leadership roles, consulting engagements, and creative collaborations. I typically respond within one business day.</p>
<div class="contact-links">${contactLinks}</div>
</div>
<div class="contact-card reveal reveal-delay-1"><div class="contact-card-mark">${initials}</div><div class="contact-card-txt">Available for new opportunities</div></div>
</div>
</div></section>

<footer>
<div class="footer-logo" ${ed('profile.full_name')}>${v.name}<span>.</span></div>
<div class="footer-copy">&copy; ${new Date().getFullYear()} · ${v.headline || 'Marketing Portfolio'}${v.location ? ` · ${v.location}` : ''}</div>
</footer>

${BLOOM_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
