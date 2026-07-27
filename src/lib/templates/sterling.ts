/**
 * Template: Sterling
 * Finance theme — premium, glassmorphic executive design with a deep navy,
 * gold and emerald palette, a live/dark theme toggle, floating hero orbs, a
 * rotating photo ring, a market ticker, glass cards and a gradient timeline.
 * Palette: navy #071A2F, secondary #0F2F52, gold #D4AF37, emerald #00C48C.
 * Fonts: Poppins (display) · Inter (body).
 * Signature: theme toggle, orb float, ring rotate, ticker scroll, fade-in reveals.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap';

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
:root{
  --primary:#071A2F;--secondary:#0F2F52;--gold:#D4AF37;--gold-light:#F0D060;--emerald:#00C48C;
  --bg:#F7F9FC;--bg2:#EEF2F7;--card-bg:rgba(255,255,255,0.78);--text:#111827;--text2:#6B7280;
  --border:rgba(7,26,47,0.10);--shadow:0 8px 40px rgba(7,26,47,0.10);--shadow-lg:0 24px 64px rgba(7,26,47,0.15);
  --radius:20px;--radius-sm:12px;--tr:.35s cubic-bezier(.4,0,.2,1);
  --fd:'Poppins',sans-serif;--fb:'Inter',sans-serif;
}
[data-theme="dark"]{
  --bg:#050E1A;--bg2:#071A2F;--card-bg:rgba(15,47,82,0.72);--text:#F1F5F9;--text2:#94A3B8;
  --border:rgba(255,255,255,0.10);--shadow:0 8px 40px rgba(0,0,0,0.4);--shadow-lg:0 24px 64px rgba(0,0,0,0.5);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:clamp(14px,1.1vw,17px)}
body{font-family:var(--fb);background:var(--bg);color:var(--text);transition:background var(--tr),color var(--tr);overflow-x:hidden}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}
ul{list-style:none}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--gold);border-radius:99px}

/* TICKER */
.ticker-wrap{background:var(--primary);overflow:hidden;padding:8px 0;position:relative;z-index:100}
.ticker-track{display:flex;animation:tickerMove 32s linear infinite;white-space:nowrap;width:max-content}
.ticker-item{display:inline-flex;align-items:center;gap:6px;padding:0 28px;font-size:.78rem;font-weight:600;color:rgba(255,255,255,.85);letter-spacing:.5px;border-right:1px solid rgba(255,255,255,.12)}
.ticker-item .sym{color:var(--gold);font-weight:700}
@keyframes tickerMove{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.ticker-track{animation:none}.hero-orb{animation:none}.hero-photo-ring{animation:none}}

/* NAV */
nav{position:sticky;top:0;z-index:500;padding:0 5%;height:68px;display:flex;align-items:center;justify-content:space-between;background:var(--card-bg);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);transition:background var(--tr),box-shadow var(--tr)}
nav.scrolled{box-shadow:0 4px 32px rgba(7,26,47,.10)}
.nav-logo{font-family:var(--fd);font-weight:900;font-size:1.25rem;color:var(--text);letter-spacing:-.5px}
.nav-logo span{color:var(--gold)}
.nav-links{display:flex;gap:2rem;align-items:center}
.nav-links a{font-size:.82rem;font-weight:500;color:var(--text2);transition:color var(--tr);position:relative}
.nav-links a::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:2px;background:var(--gold);border-radius:99px;transition:width var(--tr)}
.nav-links a:hover{color:var(--text)}.nav-links a:hover::after{width:100%}
.nav-actions{display:flex;gap:10px;align-items:center}
.theme-btn{width:40px;height:40px;border-radius:50%;border:1.5px solid var(--border);background:var(--card-bg);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--tr);font-size:1.1rem;color:var(--text)}
.theme-btn:hover{border-color:var(--gold);transform:scale(1.08)}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:99px;font-family:var(--fb);font-size:.85rem;font-weight:600;letter-spacing:.3px;cursor:pointer;transition:all var(--tr);border:none}
.btn-gold{background:linear-gradient(135deg,var(--gold),#B8960C);color:var(--primary);box-shadow:0 4px 20px rgba(212,175,55,.35)}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(212,175,55,.5)}
.btn-outline{background:transparent;color:var(--text);border:1.5px solid var(--border)}
.btn-outline:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px)}

/* SECTION COMMON */
section{padding:clamp(64px,8vw,110px) 5%}
.section-tag{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.section-tag::before{content:'';display:block;width:28px;height:2px;background:var(--gold);border-radius:99px}
.section-title{font-family:var(--fd);font-weight:800;font-size:clamp(2rem,3.5vw,3rem);line-height:1.15;color:var(--text);margin-bottom:16px}
.section-sub{font-size:1rem;color:var(--text2);max-width:520px;line-height:1.7}
.section-header{margin-bottom:clamp(36px,5vw,60px)}
.center{text-align:center}.center .section-tag{justify-content:center}.center .section-sub{margin-left:auto;margin-right:auto}
.glass{background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid var(--border);box-shadow:var(--shadow);border-radius:var(--radius)}
.bg2{background:var(--bg2)}
.fade-in{opacity:0;transform:translateY(30px);transition:opacity .65s ease,transform .65s ease}
.fade-in.visible{opacity:1;transform:none}

/* HERO */
.hero{min-height:100svh;display:grid;grid-template-columns:1fr 1fr;gap:5%;align-items:center;padding:clamp(48px,8vw,90px) 5%;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0;pointer-events:none}
.hero-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.22;animation:orbFloat 8s ease-in-out infinite}
.hero-orb-1{width:500px;height:500px;background:var(--gold);top:-120px;right:-60px}
.hero-orb-2{width:380px;height:380px;background:var(--emerald);bottom:-80px;right:200px;animation-delay:3s}
.hero-orb-3{width:300px;height:300px;background:var(--secondary);top:40%;left:-100px;animation-delay:5s}
@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.06)}}
.hero-content{position:relative;z-index:2}
.hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:.75rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:20px}
.hero-eyebrow-dot{width:6px;height:6px;background:var(--gold);border-radius:50%;animation:pulse 2s ease infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
.hero-name{font-family:var(--fd);font-weight:900;font-size:clamp(2.6rem,5.5vw,5.2rem);line-height:1.05;color:var(--text);letter-spacing:-2px;margin-bottom:16px}
.hero-name .gold{color:var(--gold)}
.hero-title{font-family:var(--fd);font-weight:600;font-size:clamp(1rem,2vw,1.5rem);color:var(--text2);margin-bottom:20px;letter-spacing:-.3px}
.hero-bio{font-size:.95rem;color:var(--text2);line-height:1.8;max-width:480px;margin-bottom:32px}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:48px}
.hero-stats{display:flex;gap:36px;flex-wrap:wrap}
.hero-stat-num{font-family:var(--fd);font-weight:800;font-size:clamp(1.6rem,2.5vw,2.2rem);color:var(--text);letter-spacing:-1px}
.hero-stat-num span{color:var(--gold)}
.hero-stat-label{font-size:.75rem;color:var(--text2);font-weight:500;letter-spacing:.3px}
.hero-right{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:20px}
.hero-photo-wrap{position:relative;width:clamp(220px,32vw,360px);aspect-ratio:1}
.hero-photo-ring{position:absolute;inset:-12px;border-radius:50%;background:conic-gradient(from 0deg,var(--gold),var(--emerald),var(--gold));animation:ringRotate 6s linear infinite;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px))}
@keyframes ringRotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.hero-photo-inner{width:100%;height:100%;border-radius:50%;background:linear-gradient(145deg,var(--secondary),var(--primary));overflow:hidden;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:900;font-size:clamp(3rem,6vw,5rem);color:var(--gold);letter-spacing:-2px}
.hero-photo-inner img{width:100%;height:100%;object-fit:cover;border-radius:50%}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(40px,6vw,80px);align-items:center}
.about-img-wrap{position:relative}
.about-img-box{width:100%;aspect-ratio:4/5;border-radius:24px;background:linear-gradient(145deg,var(--secondary),var(--primary));overflow:hidden;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:5rem;font-weight:900;color:var(--gold)}
.about-img-box img{width:100%;height:100%;object-fit:cover}
.about-badge{position:absolute;bottom:-20px;right:-20px;padding:18px 22px;border-radius:var(--radius-sm)}
.about-badge-num{font-family:var(--fd);font-weight:900;font-size:2.2rem;color:var(--gold);line-height:1}
.about-badge-label{font-size:.72rem;color:var(--text2);font-weight:500}
.about-bio{font-size:.95rem;color:var(--text2);line-height:1.8;margin-bottom:20px}
.about-quote{border-left:3px solid var(--gold);padding-left:20px;font-style:italic;font-size:.95rem;color:var(--text2);line-height:1.7;margin-top:24px}

/* EXPERTISE / SKILLS */
.expertise-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
.expertise-card{padding:28px 22px;border-radius:var(--radius);display:flex;flex-direction:column;gap:14px;transition:transform var(--tr),box-shadow var(--tr);position:relative}
.expertise-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.expertise-icon{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:var(--gold)}
.expertise-card:nth-child(3n+2) .expertise-icon{background:linear-gradient(135deg,var(--gold),#B8960C);color:var(--primary)}
.expertise-card:nth-child(3n+3) .expertise-icon{background:linear-gradient(135deg,var(--emerald),#009970);color:#fff}
.expertise-name{font-family:var(--fd);font-weight:700;font-size:.95rem;color:var(--text);line-height:1.3}
.expertise-tags{display:flex;flex-wrap:wrap;gap:6px}
.expertise-tag{padding:3px 10px;border-radius:99px;background:rgba(212,175,55,.12);color:var(--gold);font-size:.7rem;font-weight:600}

/* TIMELINE */
.timeline{position:relative}
.timeline-line{position:absolute;left:20px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--gold),var(--emerald));border-radius:99px}
.timeline-items{padding-left:60px}
.timeline-item{position:relative;padding:0 0 48px 0}
.timeline-item:last-child{padding-bottom:0}
.timeline-dot{position:absolute;left:-47px;top:6px;width:14px;height:14px;border-radius:50%;background:var(--gold);border:3px solid var(--bg);box-shadow:0 0 0 3px var(--gold)}
.timeline-card{padding:28px 30px;border-radius:var(--radius);transition:transform var(--tr)}
.timeline-card:hover{transform:translateX(6px)}
.timeline-header{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px}
.timeline-company{display:flex;align-items:center;gap:14px}
.timeline-logo{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:var(--fd);font-weight:900;font-size:.9rem;letter-spacing:-.5px;flex-shrink:0}
.timeline-role{font-family:var(--fd);font-weight:700;font-size:1.05rem;color:var(--text)}
.timeline-company-name{font-size:.82rem;color:var(--text2);font-weight:500}
.timeline-period{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:99px;background:rgba(212,175,55,.12);color:var(--gold);font-size:.75rem;font-weight:600}
.timeline-desc{font-size:.85rem;color:var(--text2);line-height:1.7;margin-bottom:14px}
.timeline-resp{margin-bottom:16px}
.timeline-resp li{font-size:.85rem;color:var(--text2);line-height:1.7;padding-left:18px;position:relative}
.timeline-resp li::before{content:'\\2192';position:absolute;left:0;color:var(--gold);font-size:.7rem}

/* EDUCATION */
.education-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px}
.edu-card{padding:30px;border-radius:var(--radius);border-top:3px solid var(--gold);transition:transform var(--tr)}
.edu-card:hover{transform:translateY(-6px)}
.edu-degree{font-family:var(--fd);font-weight:700;font-size:1.05rem;color:var(--text);margin-bottom:6px}
.edu-university{font-size:.85rem;color:var(--gold);font-weight:600;margin-bottom:4px}
.edu-year{font-size:.78rem;color:var(--text2)}
.edu-gpa{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:99px;background:rgba(212,175,55,.12);color:var(--gold);font-size:.72rem;font-weight:700;margin-top:12px}

/* CERTIFICATIONS */
.cert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px}
.cert-card{padding:26px 20px;border-radius:var(--radius);text-align:center;transition:transform var(--tr),box-shadow var(--tr)}
.cert-card:hover{transform:translateY(-6px);box-shadow:0 0 0 2px var(--gold),var(--shadow-lg)}
.cert-icon{width:58px;height:58px;border-radius:18px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 14px;color:var(--gold)}
.cert-name{font-family:var(--fd);font-weight:700;font-size:.92rem;color:var(--text);margin-bottom:4px}
.cert-issuer{font-size:.72rem;color:var(--text2)}
.cert-year{display:inline-flex;margin-top:10px;padding:3px 10px;border-radius:99px;background:rgba(212,175,55,.12);color:var(--gold);font-size:.68rem;font-weight:700}
.cert-link{display:inline-block;margin-top:8px;font-size:.72rem;color:var(--gold);border-bottom:1px solid var(--gold)}

/* PROJECTS (financial_modeling) */
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px}
.project-card{border-radius:var(--radius);overflow:hidden;transition:transform var(--tr),box-shadow var(--tr);display:flex;flex-direction:column}
.project-card:hover{transform:translateY(-8px);box-shadow:var(--shadow-lg)}
.project-thumb{height:160px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:900;font-size:2.4rem;color:rgba(212,175,55,.6);position:relative;overflow:hidden}
.project-thumb-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,26,47,.7),transparent)}
.project-body{padding:24px;display:flex;flex-direction:column;flex:1}
.project-title{font-family:var(--fd);font-weight:700;font-size:1.05rem;color:var(--text);margin-bottom:12px}
.project-impact{padding:12px 16px;border-radius:var(--radius-sm);background:rgba(0,196,140,.08);margin-bottom:16px}
.project-impact-label{font-size:.68rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--emerald);margin-bottom:3px}
.project-impact-val{font-size:.85rem;font-weight:500;color:var(--text);line-height:1.6}
.project-tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto}
.project-tag{padding:3px 10px;border-radius:99px;background:rgba(212,175,55,.1);color:var(--gold);font-size:.68rem;font-weight:700}

/* INVESTMENT PORTFOLIOS */
.inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px}
.inv-card{padding:28px;border-radius:var(--radius);border-top:3px solid var(--emerald);transition:transform var(--tr)}
.inv-card:hover{transform:translateY(-6px)}
.inv-type{font-family:var(--fd);font-weight:700;font-size:1.05rem;color:var(--text);margin-bottom:16px}
.inv-row{display:flex;justify-content:space-between;gap:1rem;padding:10px 0;border-bottom:1px solid var(--border);font-size:.82rem}
.inv-row:last-child{border-bottom:none}
.inv-row .k{color:var(--text2);font-weight:600}
.inv-row .val{font-family:var(--fd);font-weight:700;color:var(--text);text-align:right}
.inv-row .val.pos{color:var(--emerald)}

/* STATS (achievements) */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px}
.stat-card{padding:32px 24px;border-radius:var(--radius);border-top:3px solid transparent;transition:transform var(--tr)}
.stat-card:nth-child(odd){border-top-color:var(--gold)}
.stat-card:nth-child(even){border-top-color:var(--emerald)}
.stat-card:hover{transform:translateY(-6px)}
.stat-year{font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
.stat-title{font-family:var(--fd);font-weight:700;font-size:1rem;color:var(--text);margin-bottom:8px}
.stat-desc{font-size:.82rem;color:var(--text2);line-height:1.6}
.stat-link{display:inline-block;margin-top:8px;font-size:.72rem;color:var(--gold);border-bottom:1px solid var(--gold)}

/* CONTACT */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,72px);align-items:center}
.contact-rows{margin-top:24px}
.contact-row{display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid var(--border)}
.contact-icon{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:1.1rem;flex-shrink:0}
.contact-label{font-size:.7rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--text2)}
.contact-val{font-size:.92rem;font-weight:500;color:var(--text)}
.contact-socials{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap}
.contact-social{padding:12px 20px;border-radius:99px;border:1.5px solid var(--border);font-size:.82rem;font-weight:600;color:var(--text);transition:all var(--tr)}
.contact-social:hover{border-color:var(--gold);color:var(--gold)}
.contact-cta{padding:clamp(36px,5vw,56px);border-radius:var(--radius);text-align:center}
.contact-cta-mark{font-family:var(--fd);font-weight:900;font-size:4rem;color:var(--gold);line-height:1}
.contact-cta-txt{font-size:.85rem;color:var(--text2);margin-top:14px;letter-spacing:.5px}

/* FOOTER */
footer{background:var(--primary);color:rgba(255,255,255,.6);padding:40px 5%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-logo{font-family:var(--fd);font-weight:900;font-size:1.15rem;color:#fff}
.footer-logo span{color:var(--gold)}
footer p{font-size:.82rem}

/* EDIT CONTROLS */
.add-btn{display:block;margin-top:28px;padding:13px 20px;border:1px dashed var(--border);background:var(--card-bg);color:var(--gold);font-family:var(--fb);font-size:.8rem;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;width:100%;text-align:center;border-radius:99px}
.add-btn:hover{border-color:var(--gold)}
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;border:none;background:rgba(212,175,55,.9);color:var(--primary);font-size:12px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

@media (max-width:900px){
  .hero{grid-template-columns:1fr;text-align:center}
  .hero-right{order:-1}
  .hero-eyebrow,.hero-stats,.hero-btns{justify-content:center}
  .hero-bio{margin-left:auto;margin-right:auto}
  .about-grid,.contact-grid{grid-template-columns:1fr}
  .nav-links{display:none}
}
`;
}

const STERLING_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>20);});}
  var toggle=document.getElementById('themeToggle');
  if(toggle){toggle.addEventListener('click',function(){
    var root=document.documentElement;
    var dark=root.getAttribute('data-theme')==='dark';
    root.setAttribute('data-theme',dark?'light':'dark');
    toggle.textContent=dark?'\\uD83C\\uDF19':'\\u2600\\uFE0F';
  });}
  var fades=document.querySelectorAll('.fade-in');
  if(fades.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:.12});
    fades.forEach(function(f){io.observe(f);});
  }
})();
<\/script>`;

const EXPERTISE_ICONS = ['📊', '💹', '🏦', '📈', '💼', '🧮', '🛡️', '📋'];

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const em = v.edit_mode;
	const inits = initials(v.name);
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const modelsCount = v.template_overrides?.models_count ?? (v.financial_modeling?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	const nameParts = v.name.split(/\s+/);
	const firstName = nameParts.slice(0, -1).join(' ') || v.name;
	const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
	const heroName = lastName ? `${firstName} <span class="gold">${lastName}</span>` : `<span class="gold">${firstName}</span>`;
	const compLogo = (name: string) => {
		const p = (name || '').trim().split(/\s+/);
		return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase() || '•';
	};

	const datePeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const showStart = exp.start_date;
		const showEnd = exp.end_date;
		if (!showStart && !showEnd) return '';
		const s = showStart ? `<span ${_editable(`experience.${i}.start_date`)}>${exp.start_date}</span>` : '';
		const e = showEnd ? `<span ${_editable(`experience.${i}.end_date`)}>${exp.end_date}</span>` : '';
		return `<span class="timeline-period">${s}${showStart && showEnd ? ' – ' : ''}${e}</span>`;
	};
	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const showS = edu.start_year;
		const showE = edu.end_year;
		if (!showS && !showE) return '';
		const s = showS ? `<span ${_editable(`education.${i}.start_year`)}>${edu.start_year}</span>` : '';
		const e = showE ? `<span ${_editable(`education.${i}.end_year`)}>${edu.end_year}</span>` : '';
		return `${s}${showS && showE ? ' – ' : ''}${e}`;
	};

	const NAV_LABELS: Record<string, string> = {
		about: 'About', skills: 'Expertise', experience: 'Experience', financial_modeling: 'Work',
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
	const navItems = navAnchors.map(a => `<a href="#${a}">${NAV_LABELS[a] ?? a}</a>`).join('');

	// Ticker from skill categories, fallback finance set.
	const tItems = ((v.skill_groups ?? []).map(g => g.category).filter(Boolean).length
		? (v.skill_groups ?? []).map(g => g.category).filter(Boolean)
		: ['S&P 500', 'NASDAQ', 'FTSE 100', 'Corporate Finance', 'M&A Advisory', 'Risk Management']);
	const ticker = tItems.concat(tItems).map(t => `<span class="ticker-item"><span class="sym">◆</span> ${t}</span>`).join('');

	const photoInner = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: inits;

	const heroStats = [
		statShown(v, 'years_experience', years) ? `<div><div class="hero-stat-num"><span ${ted('years_experience')}>${years}</span><span>+</span></div><div class="hero-stat-label">Years Experience</div></div>` : '',
		statShown(v, 'models_count', modelsCount) ? `<div><div class="hero-stat-num"><span ${ted('models_count')}>${modelsCount}</span><span>+</span></div><div class="hero-stat-label">Models Built</div></div>` : '',
		statShown(v, 'certifications_count', certCount) ? `<div><div class="hero-stat-num"><span ${ted('certifications_count')}>${certCount}</span></div><div class="hero-stat-label">Certifications</div></div>` : '',
	].filter(Boolean).join('');

	// ABOUT
	const aboutHtml = v.bio
		? `<section id="about">
  <div class="about-grid">
    <div class="about-img-wrap fade-in">
      <div class="about-img-box" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : inits}</div>
      ${statShown(v, 'years_experience', years) ? `<div class="about-badge glass"><div class="about-badge-num"><span ${ted('years_experience')}>${years}</span>+</div><div class="about-badge-label">Years in Finance</div></div>` : ''}
    </div>
    <div class="about-content fade-in">
      <div class="section-tag">About Me</div>
      <h2 class="section-title">${v.headline ? `<span ${_editable('portfolio.headline')}>${v.headline}</span>` : 'A Finance Leader Who Drives Real Results'}</h2>
      <p class="about-bio" ${_editable('portfolio.bio', true)}>${v.bio}</p>
      ${v.uniqueValue ? `<p class="about-quote" ${_editable('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
    </div>
  </div>
</section>` : '';

	// SKILLS / EXPERTISE
	const skillsHtml = v.skill_groups?.length
		? `<section id="skills" class="bg2">
  <div class="section-header center">
    <div class="section-tag">Core Expertise</div>
    <h2 class="section-title">Where Strategy Meets Financial Mastery</h2>
  </div>
  <div class="expertise-grid">
${v.skill_groups.map((g, gi) => `<div class="expertise-card glass fade-in" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${gi}">&#x2715;</button>
    <div class="expertise-icon">${EXPERTISE_ICONS[gi % EXPERTISE_ICONS.length]}</div>
    <div class="expertise-name" ${_editable(`skills.${gi}.category`)}>${g.category}</div>
    <div class="expertise-tags" ${_listEditable(`skills.${gi}.skills`)}>${(g.skills ?? []).map(s => `<span class="expertise-tag">${s}</span>`).join('')}</div>
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="skills">+ Add Expertise Area</button>
</section>` : '';

	// EXPERIENCE
	const expHtml = v.experience?.length
		? `<section id="experience">
  <div class="section-header">
    <div class="section-tag">Professional Experience</div>
    <h2 class="section-title">Career Trajectory</h2>
  </div>
  <div class="timeline">
    <div class="timeline-line"></div>
    <div class="timeline-items">
${v.experience.map((exp, i) => `<div class="timeline-item fade-in" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
      <div class="timeline-dot"></div>
      <div class="timeline-card glass">
        <div class="timeline-header">
          <div class="timeline-company">
            <div class="timeline-logo">${compLogo(exp.company || exp.role)}</div>
            <div><div class="timeline-role" ${_editable(`experience.${i}.role`)}>${exp.role}</div>${exp.company ? `<div class="timeline-company-name"><span ${_editable(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${_editable(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}</div>
          </div>
          ${datePeriod(i, exp)}
        </div>
        ${exp.description ? `<p class="timeline-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
        ${exp.key_points?.length ? `<ul class="timeline-resp" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('\n')}
    </div>
  </div>
  <button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</section>` : '';

	// FINANCIAL MODELING (project-style glass cards)
	const finHtml = v.financial_modeling?.length
		? `<section id="financial_modeling" class="bg2">
  <div class="section-header">
    <div class="section-tag">Financial Modeling</div>
    <h2 class="section-title">High-Impact Engagements</h2>
  </div>
  <div class="projects-grid">
${v.financial_modeling.map((f, i) => `<div class="project-card glass fade-in" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">&#x2715;</button>
    <div class="project-thumb">${(f.model_type || '?').slice(0, 2).toUpperCase()}<div class="project-thumb-overlay"></div></div>
    <div class="project-body">
      <div class="project-title" ${_editable(`financial_modeling.${i}.model_type`)}>${f.model_type}</div>
      ${f.outcome ? `<div class="project-impact"><div class="project-impact-label">Outcome</div><div class="project-impact-val" ${_editable(`financial_modeling.${i}.outcome`, true)}>${f.outcome}</div></div>` : ''}
      ${f.tools_used?.length ? `<div class="project-tags" ${_listEditable(`financial_modeling.${i}.tools_used`)}>${f.tools_used.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
    </div>
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="financial_modeling">+ Add Financial Model</button>
</section>` : '';

	// INVESTMENT PORTFOLIOS
	const invHtml = v.investment_portfolios?.length
		? `<section id="investment_portfolios">
  <div class="section-header">
    <div class="section-tag">Investment Portfolios</div>
    <h2 class="section-title">Assets Under Management</h2>
  </div>
  <div class="inv-grid">
${v.investment_portfolios.map((p, i) => `<div class="inv-card glass fade-in" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">&#x2715;</button>
    <div class="inv-type" ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${p.portfolio_type}</div>
    ${p.assets_under_management ? `<div class="inv-row"><span class="k">AUM</span><span class="val" ${_editable(`investment_portfolios.${i}.assets_under_management`)}>${p.assets_under_management}</span></div>` : ''}
    ${p.performance_return ? `<div class="inv-row"><span class="k">Return</span><span class="val pos" ${_editable(`investment_portfolios.${i}.performance_return`)}>${p.performance_return}</span></div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="investment_portfolios">+ Add Portfolio</button>
</section>` : '';

	// EDUCATION
	const educationHtml = v.education?.length
		? `<section id="education" class="bg2">
  <div class="section-header">
    <div class="section-tag">Education</div>
    <h2 class="section-title">Academic Foundation</h2>
  </div>
  <div class="education-grid">
${v.education.map((edu, i) => `<div class="edu-card glass fade-in" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
    <div class="edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
    ${edu.institution ? `<div class="edu-university" ${_editable(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
    ${eduYears(i, edu) ? `<div class="edu-year">${eduYears(i, edu)}${edu.location ? ` · <span ${_editable(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : (edu.location ? `<div class="edu-year"><span ${_editable(`education.${i}.location`)}>${edu.location}</span></div>` : '')}
    ${edu.grade_or_score ? `<div class="edu-gpa">&#9733; <span ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span></div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</section>` : '';

	// CERTIFICATIONS
	const certsHtml = v.certifications?.length
		? `<section id="certifications">
  <div class="section-header center">
    <div class="section-tag">Certifications</div>
    <h2 class="section-title">Professional Credentials</h2>
  </div>
  <div class="cert-grid">
${v.certifications.map((c, i) => `<div class="cert-card glass fade-in" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
    <div class="cert-icon">&#10022;</div>
    <div class="cert-name" ${_editable(`certifications.${i}.name`)}>${c.name}</div>
    ${c.issuer ? `<div class="cert-issuer" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
    ${c.year ? `<div class="cert-year" ${_editable(`certifications.${i}.year`)}>${c.year}</div>` : ''}
    ${c.url ? `<a href="${c.url}" class="cert-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</section>` : '';

	// ACHIEVEMENTS (stat cards)
	const achHtml = v.achievements?.length
		? `<section id="achievements" class="bg2">
  <div class="section-header center">
    <div class="section-tag">Achievements</div>
    <h2 class="section-title">Numbers That Define the Career</h2>
  </div>
  <div class="stats-grid">
${v.achievements.map((a, i) => `<div class="stat-card glass fade-in" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
    ${a.year ? `<div class="stat-year" ${_editable(`achievements.${i}.year`)}>${a.year}</div>` : ''}
    <div class="stat-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
    ${a.description ? `<div class="stat-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
    ${a.url ? `<a href="${a.url}" class="stat-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length) return '';
			const cards = cs.items.map((item, i) => `<div class="stat-card glass fade-in" data-item-wrap data-cs-idx="${ci}">
    <button class="del-btn ce-del-btn" data-del-section="custom_sections.${ci}" data-del-index="${i}">&#x2715;</button>
    ${item.subtitle ? `<div class="stat-year" ${_editable(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
    ${item.label ? `<div class="stat-title" ${_editable(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
    ${item.value ? `<div class="stat-desc" ${_editable(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
    ${item.tags?.length ? `<div class="project-tags" style="margin-top:12px" ${_listEditable(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
    ${item.url ? `<a href="${item.url}" class="stat-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
  </div>`).join('\n');
			return `<section id="${cs.section_id}">
  <div class="section-header center">
    <div class="section-tag" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</div>
    <h2 class="section-title" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</h2>
  </div>
  <div class="stats-grid">${cards}</div>
  <button class="add-btn ce-add-btn" data-add-section="custom_sections.${ci}.items">+ Add Item</button>
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

	// CONTACT
	const contactRows = [
		v.email ? `<div class="contact-row"><div class="contact-icon">@</div><div><div class="contact-label">Email</div><div class="contact-val" ${_editable('profile.email')}>${v.email}</div></div></div>` : '',
		v.phone ? `<div class="contact-row"><div class="contact-icon">&#9742;</div><div><div class="contact-label">Phone</div><div class="contact-val" ${_editable('profile.phone')}>${v.phone}</div></div></div>` : '',
		v.location ? `<div class="contact-row"><div class="contact-icon">&#9678;</div><div><div class="contact-label">Location</div><div class="contact-val" ${_editable('profile.location')}>${v.location}</div></div></div>` : '',
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a class="contact-social" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">in · LinkedIn</a>` : '',
		v.portfolio_url ? `<a class="contact-social" href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">&#127760; · Website</a>` : '',
		v.twitter_url ? `<a class="contact-social" href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">𝕏 · Twitter</a>` : '',
	].filter(Boolean).join('');
	const contactHtml = (contactRows || socials)
		? `<section id="contact">
  <div class="contact-grid">
    <div class="fade-in">
      <div class="section-tag">Get in Touch</div>
      <h2 class="section-title">Let's Build Something Exceptional</h2>
      <p class="section-sub">Open to executive roles, board advisory, and high-impact consulting engagements. I respond within one business day.</p>
      <div class="contact-rows">${contactRows}</div>
      ${socials ? `<div class="contact-socials">${socials}</div>` : ''}
    </div>
    <div class="contact-cta glass fade-in"><div class="contact-cta-mark">${inits}</div><div class="contact-cta-txt">Available for Engagements</div></div>
  </div>
</section>` : '';

	return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Finance Executive</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div class="ticker-wrap"><div class="ticker-track">${ticker}</div></div>
<nav>
  <a class="nav-logo" href="#hero">${firstName}<span>.</span></a>
  <div class="nav-links">${navItems}</div>
  <div class="nav-actions"><button class="theme-btn" id="themeToggle" aria-label="Toggle theme">&#127769;</button><a href="#contact" class="btn btn-gold">Contact</a></div>
</nav>

<section id="hero" class="hero">
  <div class="hero-bg">
    <div class="hero-orb hero-orb-1"></div><div class="hero-orb hero-orb-2"></div><div class="hero-orb hero-orb-3"></div>
  </div>
  <div class="hero-content">
    <div class="hero-eyebrow"><span class="hero-eyebrow-dot"></span> ${v.profile_headline ? `<span ${_editable('profile.headline')}>${v.profile_headline}</span>` : 'Senior Finance Executive'}</div>
    <h1 class="hero-name" ${_editable('profile.full_name')}>${heroName}</h1>
    ${v.headline ? `<div class="hero-title" ${_editable('portfolio.headline')}>${v.headline}</div>` : ''}
    ${v.bio ? `<p class="hero-bio" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
    <div class="hero-btns">
      <a href="#financial_modeling" class="btn btn-gold">View Work</a>
      <a href="#contact" class="btn btn-outline">Get in Touch</a>
    </div>
    ${heroStats ? `<div class="hero-stats">${heroStats}</div>` : ''}
  </div>
  <div class="hero-right">
    <div class="hero-photo-wrap" ${_imgUpload('profile.profile_image', em)}>
      <div class="hero-photo-ring"></div>
      <div class="hero-photo-inner">${photoInner}</div>
    </div>
  </div>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
  <a href="#hero" class="footer-logo">${v.name}<span>.</span></a>
  <p>&copy; ${new Date().getFullYear()} ${v.name} · ${v.headline || 'Finance Executive'}${v.location ? ` · ${v.location}` : ''}</p>
</footer>
${STERLING_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
