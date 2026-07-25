/**
 * Template: Apex
 * Marketing theme — premium light "growth SaaS" portfolio. Ambient gradient +
 * noise background, blue (#2563EB) / emerald / amber accents, Playfair Display
 * headings + Inter body. Signature: hero metric cards, floating badges, about
 * timeline, dark KPI result cards, expertise icon cards, two-column case-study
 * cards, contact split, scroll reveals.
 * Ported from growth_marketing_portfolio.html, mapped to our marketing data
 * model (case studies→campaigns, expertise→skills; drops the dead framework/
 * dashboard/testimonials + counters; no foreign projects section).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap';

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
const EXP_ICONS = ['🎯', '📈', '🔍', '📊', '💰', '⚡', '✉️', '🤖', '💎', '🚀'];

function css(): string {
	return `
:root{
  --c-ink:#0F172A;--c-slate:#334155;--c-muted:#64748B;--c-accent:#2563EB;--c-accent-l:#DBEAFE;
  --c-success:#10B981;--c-warn:#F59E0B;--c-bg:#FFFFFF;--c-section:#F8FAFC;
  --c-card:rgba(255,255,255,0.92);--c-border:rgba(15,23,42,0.08);--c-glass:rgba(255,255,255,0.72);
  --font-display:'Playfair Display',Georgia,serif;--font-body:'Inter',system-ui,sans-serif;
  --h2-size:clamp(36px,3.5vw,56px);--body-size:clamp(15px,1.1vw,17px);
  --radius-s:8px;--radius-m:16px;--radius-l:28px;--radius-xl:40px;
  --shadow-card:0 2px 16px rgba(15,23,42,0.06),0 8px 48px rgba(15,23,42,0.04);
  --shadow-hover:0 8px 40px rgba(15,23,42,0.12),0 2px 8px rgba(15,23,42,0.06);
  --shadow-float:0 24px 80px rgba(15,23,42,0.14);
  --max-w:1360px;--ease:cubic-bezier(0.22,1,0.36,1);--dur:0.65s;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font-body);color:var(--c-ink);background:var(--c-bg);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 10% -10%,rgba(37,99,235,0.07) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 90% 10%,rgba(16,185,129,0.05) 0%,transparent 50%),radial-gradient(ellipse 70% 60% at 50% 100%,rgba(37,99,235,0.05) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at 85% 60%,rgba(245,158,11,0.04) 0%,transparent 50%);pointer-events:none;z-index:0}
section,.section-alt,footer,nav{position:relative;z-index:1}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:20px clamp(24px,4vw,80px);display:flex;align-items:center;justify-content:space-between;transition:background .4s,backdrop-filter .4s,box-shadow .4s}
nav.scrolled{background:var(--c-glass);backdrop-filter:blur(20px);box-shadow:0 1px 0 var(--c-border),0 4px 24px rgba(15,23,42,0.06)}
.nav-logo{font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--c-ink);letter-spacing:-.3px}
.nav-links{display:flex;align-items:center;gap:36px;list-style:none}
.nav-links a{font-size:13px;font-weight:500;color:var(--c-slate);transition:color .2s}
.nav-links a:hover{color:var(--c-accent)}
.nav-cta{background:var(--c-ink);color:#fff!important;padding:10px 22px;border-radius:100px;font-size:13px;font-weight:500;transition:background .2s,transform .2s}
.nav-cta:hover{background:var(--c-accent)!important;transform:translateY(-1px)}

/* HERO */
.hero{min-height:100svh;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:100px clamp(24px,5vw,100px) 0;max-width:var(--max-w);margin:0 auto;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(37,99,235,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.035) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(ellipse 80% 80% at 60% 50%,black 30%,transparent 80%);-webkit-mask-image:radial-gradient(ellipse 80% 80% at 60% 50%,black 30%,transparent 80%);pointer-events:none}
.hero-left{position:relative;z-index:2;padding-right:clamp(20px,3vw,60px)}
.hero-eyebrow{display:inline-flex;align-items:center;gap:10px;padding:7px 16px;background:var(--c-accent-l);border-radius:100px;font-size:12px;font-weight:600;color:var(--c-accent);letter-spacing:.08em;text-transform:uppercase;margin-bottom:28px}
.hero-eyebrow .dot{width:6px;height:6px;background:var(--c-accent);border-radius:50%;animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
.hero h1{font-family:var(--font-display);font-size:clamp(52px,5.5vw,80px);font-weight:800;line-height:1.08;letter-spacing:-.03em;color:var(--c-ink);margin-bottom:28px}
.hero h1 em{font-style:italic;color:var(--c-accent)}
.hero-sub{font-size:clamp(16px,1.2vw,19px);line-height:1.65;color:var(--c-slate);max-width:520px;margin-bottom:44px}
.hero-actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;padding:15px 32px;background:var(--c-ink);color:#fff;border-radius:100px;font-size:14px;font-weight:600;transition:background .2s,transform .2s,box-shadow .2s;border:none}
.btn-primary:hover{background:var(--c-accent);transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,0.35)}
.btn-secondary{display:inline-flex;align-items:center;gap:8px;padding:15px 32px;background:transparent;color:var(--c-ink);border-radius:100px;font-size:14px;font-weight:600;border:1.5px solid var(--c-border);transition:border-color .2s,background .2s,transform .2s;cursor:pointer}
.btn-secondary:hover{border-color:var(--c-accent);color:var(--c-accent);transform:translateY(-2px);background:var(--c-accent-l)}
.hero-metrics{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:56px}
.hero-metric-card{background:var(--c-card);border:1px solid var(--c-border);border-radius:var(--radius-m);padding:20px 22px;box-shadow:var(--shadow-card);transition:transform .3s var(--ease),box-shadow .3s;position:relative;overflow:hidden}
.hero-metric-card::after{content:'';position:absolute;bottom:0;left:0;height:3px;width:100%;background:linear-gradient(90deg,var(--c-accent),var(--c-success));opacity:0;transition:opacity .3s}
.hero-metric-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-hover)}
.hero-metric-card:hover::after{opacity:1}
.metric-label{font-size:11px;font-weight:600;color:var(--c-muted);letter-spacing:.07em;text-transform:uppercase;margin-bottom:8px}
.metric-value{font-family:var(--font-display);font-size:28px;font-weight:700;color:var(--c-ink);line-height:1;margin-bottom:4px}
.metric-change{font-size:12px;font-weight:600;color:var(--c-success)}
.hero-right{position:relative;z-index:2;display:flex;align-items:center;justify-content:center}
.hero-portrait-frame{position:relative;width:clamp(320px,38vw,520px);aspect-ratio:3/4;border-radius:var(--radius-xl);overflow:hidden;background:linear-gradient(145deg,#e0e7f0 0%,#c8d5e8 40%,#b5c5da 100%)}
.hero-portrait-frame img{width:100%;height:100%;object-fit:cover}
.portrait-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:6rem;color:rgba(15,23,42,0.18)}
.portrait-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(15,23,42,0.6) 100%)}
.portrait-badge{position:absolute;bottom:28px;left:28px;right:28px;background:var(--c-glass);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.5);border-radius:var(--radius-m);padding:18px 20px;z-index:2}
.portrait-badge-name{font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--c-ink);margin-bottom:3px}
.portrait-badge-title{font-size:12px;color:var(--c-slate);font-weight:500}
.hero-badge{position:absolute;top:20px;right:-20px;background:var(--c-ink);border-radius:var(--radius-m);padding:14px 18px;text-align:center;box-shadow:var(--shadow-float);animation:floatY 4s ease-in-out infinite;z-index:3}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.hero-badge-num{font-family:var(--font-display);font-size:26px;font-weight:800;color:#fff;display:block}
.hero-badge-label{font-size:10px;font-weight:600;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:.08em}

/* SECTION */
section{padding:120px clamp(24px,5vw,100px);max-width:var(--max-w);margin:0 auto}
.section-alt{background:linear-gradient(135deg,#F0F5FF 0%,#F8FAFC 40%,#F0FDF8 100%);max-width:100%}
.section-alt>.section-inner{max-width:var(--max-w);margin:0 auto;padding:120px clamp(24px,5vw,100px)}
.section-eyebrow{font-size:11px;font-weight:700;color:var(--c-accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px}
.section-eyebrow::before{content:'';width:28px;height:2px;background:var(--c-accent);display:block}
.section-heading{font-family:var(--font-display);font-size:var(--h2-size);font-weight:800;line-height:1.1;letter-spacing:-.025em;color:var(--c-ink)}
.section-sub{font-size:clamp(16px,1.1vw,18px);color:var(--c-slate);line-height:1.65;margin-top:16px;max-width:600px}
.reveal{opacity:0;transform:translateY(30px);transition:opacity var(--dur) var(--ease),transform var(--dur) var(--ease)}
.reveal.visible{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}.reveal-delay-4{transition-delay:.4s}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,5vw,100px);align-items:start;margin-top:64px}
.about-copy p{font-size:var(--body-size);line-height:1.8;color:var(--c-slate);margin-bottom:20px}
.about-copy p strong{color:var(--c-ink);font-weight:600}
.about-quote{font-family:var(--font-display);font-style:italic;font-size:20px;line-height:1.5;color:var(--c-ink);border-left:3px solid var(--c-accent);padding-left:20px;margin-top:8px}
.about-stats{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px}
.about-stat{padding:22px 20px;border:1px solid var(--c-border);border-radius:var(--radius-m);background:var(--c-card);transition:transform .3s var(--ease),box-shadow .3s}
.about-stat:hover{transform:translateY(-3px);box-shadow:var(--shadow-hover)}
.about-stat-num{font-family:var(--font-display);font-size:32px;font-weight:800;color:var(--c-accent);line-height:1;margin-bottom:6px}
.about-stat-label{font-size:12px;font-weight:500;color:var(--c-muted)}

/* TIMELINE (experience) */
.about-timeline{margin-top:56px}
.timeline-item{display:flex;gap:20px;margin-bottom:36px;position:relative}
.timeline-marker{flex-shrink:0;width:40px;display:flex;flex-direction:column;align-items:center}
.timeline-dot{width:14px;height:14px;background:var(--c-accent);border-radius:50%;border:3px solid var(--c-bg);box-shadow:0 0 0 2px var(--c-accent);flex-shrink:0;margin-top:4px}
.timeline-line{width:2px;flex:1;background:linear-gradient(180deg,var(--c-accent),rgba(37,99,235,0.1));margin-top:4px}
.timeline-content{flex:1}
.timeline-year{font-size:11px;font-weight:700;color:var(--c-accent);letter-spacing:.07em;text-transform:uppercase;margin-bottom:5px}
.timeline-title{font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--c-ink);margin-bottom:4px}
.timeline-company{font-size:13px;color:var(--c-muted);font-weight:500;margin-bottom:8px}
.timeline-desc{font-size:14px;color:var(--c-slate);line-height:1.65}
.timeline-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.timeline-metrics{display:flex;flex-direction:column;gap:6px;margin-top:12px}
.timeline-metric{font-size:13.5px;color:var(--c-slate);line-height:1.55;padding-left:18px;position:relative}
.timeline-metric::before{content:'';position:absolute;left:0;top:9px;width:10px;height:2px;background:var(--c-accent)}
.tchip{padding:4px 12px;background:var(--c-accent-l);color:var(--c-accent);border-radius:100px;font-size:11px;font-weight:600}

/* KPI (achievements) */
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px;margin-top:64px}
.kpi-card{background:var(--c-ink);border-radius:var(--radius-l);padding:clamp(32px,3vw,44px) clamp(24px,2.5vw,36px);position:relative;overflow:hidden;transition:transform .35s var(--ease),box-shadow .35s}
.kpi-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-float)}
.kpi-card::before{content:'';position:absolute;top:-60px;right:-60px;width:180px;height:180px;border-radius:50%;background:rgba(37,99,235,0.12);pointer-events:none}
.kpi-card:nth-child(2)::before{background:rgba(16,185,129,0.12)}
.kpi-card:nth-child(3)::before{background:rgba(245,158,11,0.12)}
.kpi-card:nth-child(4n)::before{background:rgba(139,92,246,0.12)}
.kpi-year{font-family:var(--font-display);font-size:clamp(32px,3vw,44px);font-weight:800;line-height:1;color:var(--c-accent);margin-bottom:12px}
.kpi-title{font-family:var(--font-display);font-size:20px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:10px;position:relative;z-index:1}
.kpi-label{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.5;position:relative;z-index:1}

/* EXPERTISE (skills) */
.expertise-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin-top:56px}
.exp-card{background:var(--c-card);border:1px solid var(--c-border);border-radius:var(--radius-m);padding:32px 28px;position:relative;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s,border-color .3s}
.exp-card:hover{transform:translateY(-5px);box-shadow:var(--shadow-hover);border-color:rgba(37,99,235,0.25)}
.exp-icon{width:48px;height:48px;background:var(--c-accent-l);border-radius:var(--radius-s);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px}
.exp-title{font-size:16px;font-weight:700;color:var(--c-ink);margin-bottom:12px}
.exp-chips{display:flex;flex-wrap:wrap;gap:7px}
.echip{padding:5px 12px;background:var(--c-section);border:1px solid var(--c-border);color:var(--c-slate);border-radius:100px;font-size:12px;font-weight:500}

/* CASE STUDIES (campaigns) */
.case-studies{display:flex;flex-direction:column;gap:40px;margin-top:64px}
.case-card{background:var(--c-card);border:1px solid var(--c-border);border-radius:var(--radius-l);padding:clamp(32px,3vw,56px);display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,4vw,80px);box-shadow:var(--shadow-card);transition:box-shadow .35s}
.case-card:hover{box-shadow:var(--shadow-hover)}
.case-tag{display:inline-flex;padding:5px 14px;background:var(--c-accent-l);color:var(--c-accent);border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:20px}
.case-title{font-family:var(--font-display);font-size:clamp(22px,2vw,30px);font-weight:800;color:var(--c-ink);line-height:1.2;margin-bottom:16px}
.case-budget{font-size:13px;font-weight:600;color:var(--c-accent);margin-bottom:16px}
.case-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.case-results{display:flex;flex-direction:column;gap:12px}
.result-metric{display:flex;align-items:flex-start;gap:16px;padding:16px 18px;background:var(--c-section);border-radius:var(--radius-m);border:1px solid var(--c-border)}
.result-dot{width:8px;height:8px;border-radius:50%;background:var(--c-success);flex-shrink:0;margin-top:6px}
.result-metric-label{font-size:14px;font-weight:500;color:var(--c-ink);line-height:1.5}

/* CARD GRID (education/certs/custom) */
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:56px}
.mkcard{background:var(--c-card);border:1px solid var(--c-border);border-radius:var(--radius-m);padding:32px 28px;transition:transform .3s var(--ease),box-shadow .3s,border-color .3s;position:relative}
.mkcard:hover{transform:translateY(-5px);box-shadow:var(--shadow-hover);border-color:rgba(37,99,235,0.25)}
.mkcard-year{font-size:11px;font-weight:700;color:var(--c-accent);letter-spacing:.07em;text-transform:uppercase;margin-bottom:10px}
.mkcard-title{font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--c-ink);line-height:1.25;margin-bottom:6px}
.mkcard-meta{font-size:14px;color:var(--c-slate);line-height:1.6}
.mkcard-badge{display:inline-flex;margin-top:12px;padding:4px 12px;background:var(--c-accent-l);color:var(--c-accent);border-radius:100px;font-size:12px;font-weight:600}
.mkcard-link{display:inline-flex;margin-top:12px;font-size:13px;font-weight:600;color:var(--c-accent)}
.mkcard-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}

/* CONTACT */
.contact-split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,100px);margin-top:64px;align-items:start}
.contact-cta-heading{font-family:var(--font-display);font-size:clamp(32px,3vw,48px);font-weight:800;color:var(--c-ink);line-height:1.15;margin-bottom:20px;letter-spacing:-.025em}
.contact-cta-sub{font-size:var(--body-size);color:var(--c-slate);line-height:1.7;margin-bottom:40px}
.contact-links{display:flex;flex-direction:column;gap:16px}
.contact-link{display:flex;align-items:center;gap:16px;padding:18px 20px;border:1px solid var(--c-border);border-radius:var(--radius-m);background:var(--c-card);transition:transform .25s var(--ease),box-shadow .25s,border-color .25s}
.contact-link:hover{transform:translateX(4px);box-shadow:var(--shadow-card);border-color:rgba(37,99,235,0.25)}
.contact-link-icon{width:42px;height:42px;background:var(--c-accent-l);border-radius:var(--radius-s);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.contact-link-label{font-size:12px;font-weight:600;color:var(--c-muted);text-transform:uppercase;letter-spacing:.06em}
.contact-link-val{font-size:14px;font-weight:600;color:var(--c-ink);margin-top:2px}

/* FOOTER */
footer{background:var(--c-ink);padding:56px clamp(24px,5vw,100px) 36px}
.footer-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px}
.footer-logo{font-family:var(--font-display);font-size:20px;font-weight:700;color:#fff}
.footer-copy{font-size:13px;color:rgba(255,255,255,0.4)}

/* EDIT CONTROLS */
.ce-add-btn{display:block;margin-top:28px;padding:13px 20px;border:1.5px dashed var(--c-border);border-radius:100px;background:var(--c-card);color:var(--c-accent);font-family:var(--font-body);font-size:13px;font-weight:600;cursor:pointer;width:100%;text-align:center}
.ce-add-btn:hover{border-color:var(--c-accent)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:14px;right:14px;width:24px;height:24px;border-radius:50%;border:none;background:var(--c-ink);color:#fff;font-size:12px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
.kpi-card .ce-del-btn{background:rgba(255,255,255,.25)}
[data-item-wrap]:hover .ce-del-btn{display:block}

@media(max-width:900px){
  .hero{grid-template-columns:1fr;text-align:center}.hero-left{padding-right:0}.hero-sub{margin:0 auto 44px}.hero-actions{justify-content:center}.hero-eyebrow{margin-left:auto;margin-right:auto}
  .hero-right{display:none}.about-grid,.case-card,.contact-split{grid-template-columns:1fr}
  .nav-links a:not(.nav-cta){display:none}
}
@media(max-width:600px){.hero-metrics,.about-stats{grid-template-columns:1fr}}
`;
}

const APEX_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>30);});}
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

	// HERO metric cards
	const metricCards = [
		showYears ? `<div class="hero-metric-card reveal reveal-delay-1"><div class="metric-label">Experience</div><div class="metric-value">${statNum('years_experience', yearsExp)}+ yrs</div><div class="metric-change">↑ Proven track record</div></div>` : '',
		showCampaigns ? `<div class="hero-metric-card reveal reveal-delay-2"><div class="metric-label">Campaigns</div><div class="metric-value">${statNum('campaigns_count', campaignsCount)}+</div><div class="metric-change">↑ Delivered end-to-end</div></div>` : '',
		showRoas ? `<div class="hero-metric-card reveal reveal-delay-3"><div class="metric-label">Avg. ROAS</div><div class="metric-value">${statNum('avg_roas', avgRoas)}×</div><div class="metric-change">↑ Across paid channels</div></div>` : '',
		rolesCount > 0 ? `<div class="hero-metric-card reveal reveal-delay-4"><div class="metric-label">Roles</div><div class="metric-value">${rolesCount}</div><div class="metric-change">↑ Brands &amp; teams led</div></div>` : '',
	].filter(Boolean).join('');

	// ABOUT
	const aboutStats = [
		showYears ? `<div class="about-stat reveal reveal-delay-1"><div class="about-stat-num">${statNum('years_experience', yearsExp)}+</div><div class="about-stat-label">Years of Experience</div></div>` : '',
		showCampaigns ? `<div class="about-stat reveal reveal-delay-2"><div class="about-stat-num">${statNum('campaigns_count', campaignsCount)}+</div><div class="about-stat-label">Campaigns Launched</div></div>` : '',
		showRoas ? `<div class="about-stat reveal reveal-delay-3"><div class="about-stat-num">${statNum('avg_roas', avgRoas)}×</div><div class="about-stat-label">Average ROAS</div></div>` : '',
		rolesCount > 0 ? `<div class="about-stat reveal reveal-delay-4"><div class="about-stat-num">${rolesCount}</div><div class="about-stat-label">Roles &amp; Engagements</div></div>` : '',
	].filter(Boolean).join('');
	const aboutHtml = (v.bio || v.uniqueValue)
		? `<div class="section-alt"><div class="section-inner" id="about">
<div class="section-eyebrow reveal">About</div>
<h2 class="section-heading reveal">The strategy<br>behind the growth</h2>
<div class="about-grid">
<div class="about-copy reveal">
${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${v.uniqueValue ? `<p class="about-quote" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${aboutStats ? `<div class="about-stats">${aboutStats}</div>` : ''}
</div>
<div class="reveal reveal-delay-2">${allExpertise(v, em, ed, le)}</div>
</div>
</div></div>` : '';

	// EXPERIENCE (timeline) — own section
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience">
<div class="section-eyebrow reveal">Experience</div>
<h2 class="section-heading reveal">Career trajectory</h2>
<div class="about-timeline" style="margin-top:56px">
${v.experience.map((exp, i) => `<div class="timeline-item reveal"${iw}>
${delBtn('experience', i)}
<div class="timeline-marker"><div class="timeline-dot"></div>${i < v.experience.length - 1 ? '<div class="timeline-line"></div>' : ''}</div>
<div class="timeline-content">
<div class="timeline-year">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : (em ? `<span ${ed(`experience.${i}.start_date`)}>Start</span>` : '')}${(exp.start_date && exp.end_date) ? ' – ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : (em ? `<span ${ed(`experience.${i}.end_date`)}>End</span>` : '')}</div>
<div class="timeline-title" ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}</div>
${exp.company ? `<div class="timeline-company"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="timeline-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.channels_managed?.length ? `<div class="timeline-chips" ${le(`experience.${i}.channels_managed`)}>${exp.channels_managed.map(c => `<span class="tchip">${c}</span>`).join('')}</div>` : ''}
${exp.key_points?.length ? `<div class="timeline-metrics" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<div class="timeline-metric">${k}</div>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>` : '';

	// SKILLS (expertise cards) — own section
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<div class="section-alt"><div class="section-inner" id="skills">
<div class="section-eyebrow reveal">Expertise</div>
<h2 class="section-heading reveal">A full-funnel<br>growth toolkit</h2>
<div class="expertise-grid">
${v.skill_groups.map((g, gi) => `<div class="exp-card reveal"${iw}>
${delBtn('skills', gi)}
<div class="exp-icon">${EXP_ICONS[gi % EXP_ICONS.length]}</div>
<div class="exp-title" ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
<div class="exp-chips" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="echip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></div>` : '';

	// CAMPAIGNS (case studies)
	const campaignsHtml = !hidden.has('campaigns') && (v.campaigns?.length || em)
		? `<section id="campaigns">
<div class="section-eyebrow reveal">Case Studies</div>
<h2 class="section-heading reveal">Growth stories<br>worth telling</h2>
<div class="case-studies">
${(v.campaigns ?? []).map((c, i) => `<div class="case-card reveal"${iw}>
${delBtn('campaigns', i)}
<div>
${c.campaign_type ? `<div class="case-tag" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : '<div class="case-tag">Campaign</div>'}
<div class="case-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || 'Campaign'}</div>
${c.budget ? `<div class="case-budget">Budget: <span ${ed(`campaigns.${i}.budget`)}>${c.budget}</span></div>` : ''}
${c.channels_used?.length ? `<div class="case-chips" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.map(ch => `<span class="tchip">${ch}</span>`).join('')}</div>` : ''}
</div>
<div class="case-results"${c.performance_metrics?.length ? ` ${le(`campaigns.${i}.performance_metrics`)}` : ''}>
${(c.performance_metrics ?? []).map(m => `<div class="result-metric"><div class="result-dot"></div><div class="result-metric-label">${m}</div></div>`).join('')}
</div>
</div>`).join('\n')}
</div>
${addBtn('campaigns', 'Campaign')}
</section>` : '';

	// ACHIEVEMENTS (KPI dark cards)
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements">
<div class="section-eyebrow reveal">Results</div>
<h2 class="section-heading reveal">Milestones that<br>define the work</h2>
<div class="kpi-grid">
${v.achievements.map((a, i) => `<div class="kpi-card reveal"${iw}>
${delBtn('achievements', i)}
${a.year ? `<div class="kpi-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
<div class="kpi-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="kpi-label" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<div class="section-alt"><div class="section-inner" id="education">
<div class="section-eyebrow reveal">Education</div>
<h2 class="section-heading reveal">Academic foundation</h2>
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
</div></div>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications">
<div class="section-eyebrow reveal">Credentials</div>
<h2 class="section-heading reveal">Certifications</h2>
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
</section>` : '';

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
			return `<section id="${cs.section_id}">
<div class="section-eyebrow reveal">${cs.title}</div>
<h2 class="section-heading reveal">${cs.title}</h2>
<div class="card-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</section>`;
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
		v.phone ? `<a class="contact-link" href="tel:${v.phone}"><div class="contact-link-icon">📱</div><div><div class="contact-link-label">Phone</div><div class="contact-link-val" ${ed('profile.phone')}>${v.phone}</div></div></a>` : '',
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
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<nav>
<div class="nav-logo" ${ed('profile.full_name')}>${v.name}</div>
<ul class="nav-links">
<li><a href="#about">About</a></li>
<li><a href="#experience">Experience</a></li>
<li><a href="#campaigns">Case Studies</a></li>
<li><a href="#skills">Expertise</a></li>
${v.email ? `<li><a href="mailto:${v.email}" class="nav-cta">Let's Talk</a></li>` : ''}
</ul>
</nav>

<section class="hero" id="hero">
<div class="hero-left reveal">
<div class="hero-eyebrow"><span class="dot"></span> ${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Growth Marketing'}</div>
<h1 ${ed('profile.full_name')}>${heroName}</h1>
${v.headline ? `<p class="hero-sub" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
${v.bio ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>${v.bio.slice(0, 220)}${v.bio.length > 220 ? '…' : ''}</p>` : ''}
<div class="hero-actions">
<a href="#campaigns" class="btn-primary">View Case Studies &#8595;</a>
<a href="#contact" class="btn-secondary">Start a Conversation</a>
</div>
${metricCards ? `<div class="hero-metrics">${metricCards}</div>` : ''}
</div>
<div class="hero-right reveal reveal-delay-2">
<div class="hero-portrait-frame" ${_imgUpload('profile.profile_image', em)}>
${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="portrait-mark">${initials}</div>`}
<div class="portrait-overlay"></div>
<div class="portrait-badge"><div class="portrait-badge-name" ${ed('profile.full_name')}>${v.name}</div><div class="portrait-badge-title">${v.headline || 'Marketing'}${v.location ? ` · ${v.location}` : ''}</div></div>
</div>
${showRoas ? `<div class="hero-badge"><span class="hero-badge-num">${statNum('avg_roas', avgRoas)}×</span><span class="hero-badge-label">Avg.<br>ROAS</span></div>` : ''}
</div>
</section>

${aboutHtml}
${orderedSections}

<section id="contact">
<div class="section-eyebrow reveal">Contact</div>
<h2 class="section-heading reveal">Let's build<br>something great</h2>
<div class="contact-split">
<div class="reveal">
<div class="contact-cta-heading">Ready to grow?</div>
<p class="contact-cta-sub">Open to marketing &amp; growth leadership roles, consulting engagements, and creative collaborations. I typically respond within one business day.</p>
</div>
<div class="contact-links reveal reveal-delay-1">${contactLinks}</div>
</div>
</section>

<footer><div class="footer-inner">
<div class="footer-logo" ${ed('profile.full_name')}>${v.name}</div>
<div class="footer-copy">&copy; ${new Date().getFullYear()} · ${v.headline || 'Marketing Portfolio'}${v.location ? ` · ${v.location}` : ''}</div>
</div></footer>

${APEX_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}

// Expertise column shown inside the About grid (compact skill-group cards).
function allExpertise(v: NormalizedData, em: boolean, ed: (p: string, m?: boolean) => string, le: (p: string) => string): string {
	if (!v.skill_groups?.length) return '';
	return `<div style="display:flex;flex-direction:column;gap:14px">
${v.skill_groups.slice(0, 4).map((g, gi) => `<div class="exp-card">
<div class="exp-title">${g.category || 'Skills'}</div>
<div class="exp-chips">${g.skills.slice(0, 8).map(s => `<span class="echip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>`;
}
