/**
 * Template: Blueprint
 * Civil-engineering theme — navy & engineering-gold with a blueprint grid overlay.
 * Palette: navy #0d1f3c, steel #2a5298, sky #6496d2, brass accent #c9973a, chalk #eef3f9.
 * Features: fixed blueprint grid background, hero with engineer "ID card" panel,
 * animated stat counters, fade-up reveals, project cards with coloured banners +
 * outcome chips, animated skill-proficiency bars, tool cards, certification seals,
 * dark contact band.
 * Fonts: Barlow Condensed · Barlow · Lora.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Barlow:wght@300;400;500;600&display=swap';

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

const BANNERS = ['residential', 'commercial', 'infra'];

// Default contact call-to-action (kept in sync with DEFAULT_CONTACT_TAGLINE in index.ts).
const DEFAULT_TAGLINE = 'Open to consulting engagements, full-time roles, and project-based collaborations across residential, commercial, and infrastructure sectors.';

function css(): string {
	return `
:root{
  --navy:#0d1f3c;--navy-mid:#163563;--steel:#2a5298;--steel-lt:#4475c2;--sky:#6496d2;
  --mist:#c8d8ee;--chalk:#eef3f9;--warm-gray:#8a9ab0;--mid-gray:#4a5568;
  --off-white:#f7f9fc;--white:#fff;--accent:#c9973a;
  --rule:rgba(42,82,152,.15);
  --shadow-sm:0 2px 8px rgba(13,31,60,.08);--shadow-md:0 6px 28px rgba(13,31,60,.12);--shadow-lg:0 16px 56px rgba(13,31,60,.18);
  --r:4px;--r-lg:10px;
  --ff-head:'Barlow Condensed',sans-serif;--ff-body:'Barlow',sans-serif;--ff-serif:'Lora',serif;
  --transition:.3s cubic-bezier(.4,0,.2,1);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:var(--ff-body);background:var(--off-white);color:var(--navy);line-height:1.65;overflow-x:hidden}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
ul{list-style:none}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(var(--rule) 1px,transparent 1px),linear-gradient(90deg,var(--rule) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.container{max-width:1120px;margin:0 auto;padding:0 2rem;position:relative;z-index:1}
.section{padding:96px 0;position:relative;z-index:1}
.section--alt{background:var(--chalk)}
.section-label{display:flex;align-items:center;gap:.75rem;font-family:var(--ff-head);font-size:.8rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--steel);margin-bottom:1rem}
.section-label::before{content:'';width:32px;height:2px;background:var(--accent);flex-shrink:0}
.section-title{font-family:var(--ff-head);font-size:clamp(2rem,4vw,2.75rem);font-weight:700;line-height:1.1;color:var(--navy);margin-bottom:3rem}

/* NAV */
.nav{position:sticky;top:0;z-index:100;background:rgba(13,31,60,.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:60px}
.nav-logo{font-family:var(--ff-head);font-size:1.15rem;font-weight:700;letter-spacing:.06em;color:var(--white)}
.nav-logo span{color:var(--accent)}
.nav-links{display:flex;gap:2rem}
.nav-links a{font-family:var(--ff-head);font-size:.85rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--mist);transition:color var(--transition)}
.nav-links a:hover{color:var(--white)}

/* HERO */
.hero{position:relative;background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 55%,var(--steel) 100%);padding:120px 0 100px;overflow:hidden}
.hero::after{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(-45deg,transparent,transparent 48px,rgba(255,255,255,.025) 48px,rgba(255,255,255,.025) 49px);pointer-events:none}
.hero-grid{display:grid;grid-template-columns:1fr 340px;gap:4rem;align-items:center}
.hero-eyebrow{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--ff-head);font-size:.8rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);background:rgba(201,151,58,.12);border:1px solid rgba(201,151,58,.3);padding:.35rem .9rem;border-radius:2px;margin-bottom:1.5rem}
.hero-eyebrow .dot{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 0 rgba(201,151,58,.6);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(201,151,58,.55)}70%{box-shadow:0 0 0 8px rgba(201,151,58,0)}100%{box-shadow:0 0 0 0 rgba(201,151,58,0)}}
.hero-name{font-family:var(--ff-head);font-size:clamp(3rem,7vw,5.5rem);font-weight:800;line-height:.98;color:var(--white);letter-spacing:-.01em;margin-bottom:1rem}
.hero-designation{font-family:var(--ff-head);font-size:clamp(1.1rem,2.5vw,1.45rem);font-weight:500;color:var(--mist);letter-spacing:.04em;margin-bottom:1.5rem}
.hero-designation span{color:var(--accent);font-weight:600}
.hero-bio{color:var(--mist);font-size:.95rem;max-width:520px;line-height:1.8}
.hero-stats{display:flex;gap:2.5rem;margin-top:2.5rem;flex-wrap:wrap}
.stat-item{display:flex;flex-direction:column}
.stat-num{font-family:var(--ff-head);font-size:2.5rem;font-weight:800;color:var(--white);line-height:1}
.stat-num span{color:var(--accent)}
.stat-label{font-size:.75rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--warm-gray);margin-top:.3rem}
.cta-row{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--ff-head);font-size:.9rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:.8rem 1.8rem;border-radius:var(--r);transition:var(--transition);cursor:pointer}
.btn-primary{background:var(--accent);color:var(--white);border:none}
.btn-primary:hover{background:#b8862f;transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,151,58,.4)}
.btn-outline{background:transparent;color:var(--mist);border:1px solid rgba(255,255,255,.25)}
.btn-outline:hover{border-color:var(--white);color:var(--white)}
/* ID card */
.hero-card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:var(--r-lg);padding:2rem;display:flex;flex-direction:column;gap:1.25rem}
.hero-avatar{width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,var(--steel-lt),var(--navy-mid));border:3px solid rgba(255,255,255,.18);display:grid;place-items:center;font-family:var(--ff-head);font-size:2rem;font-weight:700;color:var(--white);overflow:hidden}
.hero-avatar img{width:100%;height:100%;object-fit:cover}
.hero-card-name{font-family:var(--ff-head);font-size:1.3rem;font-weight:700;color:var(--white);letter-spacing:.03em}
.hero-card-sub{font-size:.8rem;color:var(--warm-gray);letter-spacing:.08em;text-transform:uppercase;font-weight:500}
.card-divider{height:1px;background:rgba(255,255,255,.1)}
.card-detail{display:flex;align-items:flex-start;gap:.75rem;font-size:.85rem;color:var(--mist)}
.card-detail svg{flex-shrink:0;margin-top:2px;color:var(--sky)}

/* SUMMARY */
.summary-grid{display:grid;grid-template-columns:3fr 2fr;gap:5rem;align-items:start}
.summary-body{font-family:var(--ff-serif);font-size:1.08rem;color:var(--mid-gray);line-height:1.9}
.summary-body strong{color:var(--navy);font-weight:600}
.expertise-list{display:flex;flex-direction:column;gap:.75rem}
.expertise-item{display:flex;align-items:center;gap:1rem;background:var(--white);border:1px solid var(--rule);border-left:3px solid var(--steel);padding:.85rem 1.1rem;border-radius:0 var(--r) var(--r) 0;font-family:var(--ff-head);font-size:.95rem;font-weight:500;color:var(--navy-mid);box-shadow:var(--shadow-sm);transition:var(--transition)}
.expertise-item:hover{border-left-color:var(--accent);transform:translateX(4px)}
.expertise-item svg{color:var(--steel);flex-shrink:0}

/* PROJECTS */
.projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.75rem}
.project-card{background:var(--white);border:1px solid rgba(42,82,152,.1);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm);transition:var(--transition);display:flex;flex-direction:column;position:relative}
.project-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-4px)}
.project-banner{height:6px}
.project-banner.residential{background:linear-gradient(90deg,#4475c2,#6496d2)}
.project-banner.commercial{background:linear-gradient(90deg,#c9973a,#e8b860)}
.project-banner.infra{background:linear-gradient(90deg,#2d7d4e,#4caf7d)}
.project-img{height:150px;overflow:hidden;background:var(--chalk)}
.project-img img{width:100%;height:100%;object-fit:cover}
.project-body{padding:1.75rem;flex:1;display:flex;flex-direction:column}
.project-badge{display:inline-flex;align-self:flex-start;align-items:center;gap:.4rem;font-family:var(--ff-head);font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.25rem .75rem;border-radius:2px;margin-bottom:1rem;background:rgba(68,117,194,.1);color:var(--steel)}
.project-title{font-family:var(--ff-head);font-size:1.25rem;font-weight:700;color:var(--navy);margin-bottom:.75rem;line-height:1.2}
.project-desc{font-size:.9rem;color:var(--mid-gray);line-height:1.6;margin-bottom:1rem}
.project-section-head{font-family:var(--ff-head);font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--warm-gray);margin-bottom:.5rem;margin-top:.5rem}
.project-list{display:flex;flex-direction:column;gap:.4rem}
.project-list li{display:flex;gap:.6rem;align-items:flex-start;font-size:.875rem;color:var(--mid-gray);line-height:1.5}
.project-list li::before{content:'\\203A';color:var(--steel);font-weight:700;flex-shrink:0;font-size:1rem;line-height:1.2}
.project-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem}
.ptag{font-family:var(--ff-head);font-size:.72rem;font-weight:600;letter-spacing:.05em;padding:.25rem .7rem;border-radius:2px;background:var(--chalk);border:1px solid var(--mist);color:var(--navy-mid)}
.ptag.soft{background:rgba(201,151,58,.1);border-color:rgba(201,151,58,.3);color:#9e7120}
.ptag.ghost{background:transparent;border:1px dashed var(--steel);color:var(--steel);opacity:.75}
.project-outcomes{margin-top:1.25rem;padding-top:1.25rem;border-top:1px dashed rgba(42,82,152,.15);display:flex;flex-wrap:wrap;gap:.5rem}
.outcome-chip{display:flex;align-items:center;gap:.35rem;background:var(--chalk);border:1px solid var(--mist);padding:.3rem .7rem;border-radius:2px;font-size:.75rem;font-weight:600;color:var(--navy-mid);font-family:var(--ff-head);letter-spacing:.04em}
.outcome-chip svg{color:var(--steel)}
.plink{display:inline-flex;align-items:center;gap:.35rem;margin-top:1rem;margin-right:1rem;font-family:var(--ff-head);font-size:.8rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--steel)}
.plink:hover{color:var(--accent)}

/* SKILLS */
.skills-layout{display:grid;grid-template-columns:1fr 1fr;gap:4rem}
.skill-group{display:flex;flex-direction:column;gap:2rem;position:relative}
.skill-group-block{position:relative}
.skill-cat-title{font-family:var(--ff-head);font-size:1rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--steel);margin-bottom:1rem}
.skill-chips{display:flex;flex-wrap:wrap;gap:.6rem}
.skill-chip{display:inline-flex;align-items:center;gap:.45rem;font-family:var(--ff-head);font-size:.92rem;font-weight:600;color:var(--navy-mid);background:var(--white);border:1px solid var(--rule);border-left:3px solid var(--steel);padding:.5rem .85rem;border-radius:0 var(--r) var(--r) 0;box-shadow:var(--shadow-sm);transition:var(--transition)}
.skill-chip:hover{border-left-color:var(--accent);transform:translateX(3px)}
.skill-chip svg{color:var(--steel);flex-shrink:0}

/* TOOLS */
.tools-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1.25rem}
.tool-card{background:var(--white);border:1px solid rgba(42,82,152,.1);border-radius:var(--r-lg);padding:1.5rem 1rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.75rem;box-shadow:var(--shadow-sm);transition:var(--transition)}
.tool-card:hover{border-color:var(--steel);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.tool-icon{width:52px;height:52px;background:linear-gradient(135deg,var(--chalk),var(--mist));border-radius:var(--r);display:grid;place-items:center;color:var(--steel-lt)}
.tool-name{font-family:var(--ff-head);font-size:.95rem;font-weight:700;color:var(--navy)}

/* CERTS */
.certs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
.cert-card{display:flex;gap:1.25rem;align-items:flex-start;background:var(--white);border:1px solid rgba(42,82,152,.1);border-radius:var(--r-lg);padding:1.5rem;box-shadow:var(--shadow-sm);transition:var(--transition);position:relative}
.cert-card:hover{border-color:var(--accent);box-shadow:var(--shadow-md)}
.cert-seal{width:48px;height:48px;flex-shrink:0;background:linear-gradient(135deg,var(--accent),#e8b860);border-radius:var(--r);display:grid;place-items:center;color:var(--white);font-family:var(--ff-head);font-weight:800;font-size:.85rem}
.cert-title{font-family:var(--ff-head);font-size:1rem;font-weight:700;color:var(--navy);line-height:1.3;margin-bottom:.35rem}
.cert-issuer{font-size:.8rem;color:var(--warm-gray);font-weight:500;margin-bottom:.5rem}
.cert-meta{display:flex;gap:.75rem;flex-wrap:wrap}
.cert-tag{font-family:var(--ff-head);font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;background:var(--chalk);border:1px solid var(--mist);padding:.2rem .6rem;border-radius:2px;color:var(--navy-mid)}

/* ACHIEVEMENTS / EDUCATION / GENERIC */
.gen-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
.gen-card{background:var(--white);border:1px solid rgba(42,82,152,.1);border-left:3px solid var(--steel);border-radius:0 var(--r-lg) var(--r-lg) 0;padding:1.5rem;box-shadow:var(--shadow-sm);transition:var(--transition);position:relative}
.gen-card:hover{border-left-color:var(--accent);box-shadow:var(--shadow-md)}
.gen-year{font-family:var(--ff-head);font-size:.78rem;font-weight:700;color:var(--accent);letter-spacing:.08em}
.gen-title{font-family:var(--ff-head);font-size:1.1rem;font-weight:700;color:var(--navy);margin:.3rem 0 .35rem;line-height:1.25}
.gen-meta{font-size:.85rem;color:var(--mid-gray)}
.dp-text{font-family:var(--ff-serif);font-size:1.08rem;color:var(--mid-gray);line-height:1.9;max-width:760px}

/* CONTACT */
.contact-section{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 60%,#1e4a8c 100%);position:relative;overflow:hidden}
.contact-section::after{content:'';position:absolute;bottom:-60px;right:-60px;width:300px;height:300px;border-radius:50%;background:rgba(100,150,210,.08);pointer-events:none}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.contact-text .section-label{color:var(--sky)}
.contact-text .section-title{color:var(--white)}
.contact-tagline{font-family:var(--ff-serif);font-size:1.05rem;color:var(--mist);line-height:1.8;margin-top:-.5rem;margin-bottom:2rem}
.contact-cards{display:flex;flex-direction:column;gap:1rem}
.contact-item{display:flex;align-items:center;gap:1.1rem;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:var(--r-lg);padding:1.1rem 1.4rem;transition:var(--transition)}
.contact-item:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.2)}
.contact-icon{width:42px;height:42px;flex-shrink:0;background:rgba(100,150,210,.2);border-radius:var(--r);display:grid;place-items:center;color:var(--sky)}
.contact-label{font-family:var(--ff-head);font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--warm-gray);margin-bottom:.2rem}
.contact-value{font-size:.95rem;font-weight:500;color:var(--white)}

/* FOOTER */
.footer{background:#070e1c;padding:1.75rem 0;text-align:center;font-size:.8rem;color:var(--warm-gray);font-family:var(--ff-head);letter-spacing:.06em;position:relative;z-index:1}
.footer span{color:var(--accent)}
.section-divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--mist) 20%,var(--mist) 80%,transparent)}

/* EDIT CONTROLS */
.add-btn{display:block;margin-top:1.5rem;padding:.7rem 1rem;border:2px dashed var(--steel);border-radius:var(--r);background:rgba(42,82,152,.05);color:var(--steel);font-family:var(--ff-head);font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;width:100%;text-align:center}
.add-btn:hover{background:rgba(42,82,152,.1)}
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:10px;right:10px;width:24px;height:24px;border-radius:50%;border:none;background:#fee2e2;color:#ef4444;font-size:13px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

/* REVEAL */
.fade-up{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.fade-up.visible{opacity:1;transform:translateY(0)}
.delay-1{transition-delay:.1s}.delay-2{transition-delay:.2s}.delay-3{transition-delay:.3s}

@media(max-width:900px){
  .hero-grid,.summary-grid,.skills-layout,.contact-grid{grid-template-columns:1fr;gap:2.5rem}
  .hero-card{display:none}.nav-links{display:none}.section{padding:64px 0}
}
@media(max-width:600px){.hero-stats{gap:1.5rem}.projects-grid,.tools-grid,.certs-grid{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.fade-up,.skill-fill{transition:none}}
`;
}

const BLUEPRINT_SCRIPT = `<script>
(function(){
  var fades=document.querySelectorAll('.fade-up');
  if(fades.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:0.12});
    fades.forEach(function(el){io.observe(el);});
  }
})();
<\/script>`;

const IC = {
	pin: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
	building: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
	mail: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
	phone: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.41 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/></svg>',
	link: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
	check: '<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
	cube: '<svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
	gem: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
};

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const inits = initials(v.name);
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const ted = (key: string) => (v.edit_mode ? `contenteditable="true" data-path="template_overrides.${key}"` : '');
	const em = v.edit_mode;

	// Each list field gets its own _listEditable region (never blended), rendered
	// only when it has items — no labels, no placeholder chips.
	const tagRegion = (path: string, arr: string[], cls: string) =>
		arr.length
			? `<div class="project-tags" ${_listEditable(path)}>${arr.map(t => `<span class="ptag ${cls}">${t}</span>`).join('')}</div>`
			: '';

	// Education years bind to start_year/end_year (form fields), not computed year_range.
	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const showS = edu.start_year || em;
		const showE = edu.end_year || em;
		if (!showS && !showE) return '';
		const s = showS ? `<span ${_editable(`education.${i}.start_year`)}>${edu.start_year || 'Start'}</span>` : '';
		const e = showE ? `<span ${_editable(`education.${i}.end_year`)}>${edu.end_year || 'End'}</span>` : '';
		return `${s}${showS && showE ? '–' : ''}${e}`;
	};

	const NAV_LABELS: Record<string, string> = {
		about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', education: 'Education',
		certifications: 'Certifications', achievements: 'Achievements', contact: 'Contact',
	};
	const navAnchors: string[] = [];
	if (v.bio || v.skill_groups?.length) navAnchors.push('about');
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (['experience', 'projects', 'skills', 'education', 'certifications', 'achievements'].includes(key)) {
			const dk = key === 'skills' ? 'skill_groups' : key;
			const d = (v as unknown as Record<string, unknown>)[dk];
			if (d && Array.isArray(d) && d.length > 0) navAnchors.push(key);
		}
	}
	if (v.email || v.phone || v.location) navAnchors.push('contact');
	const navItems = navAnchors.map(a => `<li><a href="#${a}">${NAV_LABELS[a] ?? a}</a></li>`).join('');

	const firstCompany = v.experience?.[0]?.company ?? '';
	const avatar = v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : inits;

	const stats = [
		years > 0 ? `<div class="stat-item"><span class="stat-num"><span ${ted('years_experience')}>${years}</span>+</span><span class="stat-label">Years Experience</span></div>` : '',
		projCount > 0 ? `<div class="stat-item"><span class="stat-num"><span ${ted('projects_count')}>${projCount}</span></span><span class="stat-label">Projects Delivered</span></div>` : '',
		certCount > 0 ? `<div class="stat-item"><span class="stat-num"><span ${ted('certifications_count')}>${certCount}</span></span><span class="stat-label">Certifications</span></div>` : '',
	].filter(Boolean).join('');

	// SUMMARY (about) — bio + Core Expertise.
	// Core Expertise is its own editable list (profile.core_expertise, managed in the
	// Portfolio Fields tab); falls back to skill-group categories when the user hasn't set it.
	const expertiseItems = v.core_expertise.length
		? v.core_expertise
		: (v.skill_groups ?? []).map(g => g.category || 'Expertise').filter(Boolean);
	const expertiseList = expertiseItems.length
		? expertiseItems.map(e => `<li class="expertise-item">${IC.gem}${e}</li>`).join('')
		: (em ? `<li class="expertise-item" style="opacity:.6">${IC.gem}Add core expertise</li>` : '');
	const aboutHtml = v.bio || expertiseItems.length || em
		? `<section class="section" id="about">
<div class="container">
  <div class="summary-grid">
    <div class="fade-up">
      <div class="section-label">Professional Summary</div>
      <h2 class="section-title">Engineering Built<br>on Precision</h2>
      ${v.bio ? `<div class="summary-body"><p ${_editable('portfolio.bio', true)}>${v.bio}</p></div>` : ''}
    </div>
    ${(expertiseItems.length || em) ? `<div class="fade-up delay-2"><div class="section-label" style="margin-top:.5rem">Core Expertise</div><ul class="expertise-list" ${_listEditable('core_expertise')}>${expertiseList}</ul></div>` : ''}
  </div>
</div>
</section>
<div class="container"><div class="section-divider"></div></div>` : '';

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section class="section section--alt" id="projects">
<div class="container">
  <div class="section-label fade-up">Selected Projects</div>
  <h2 class="section-title fade-up delay-1">Delivered Works</h2>
  <div class="projects-grid">
${v.projects.map((p, i) => {
		const banner = BANNERS[i % BANNERS.length];
		const img = p.images?.[0];
		const links = [
			p.github_repo ? `<a href="${p.github_repo}" class="plink" target="_blank" rel="noopener noreferrer">Repository</a>` : '',
			p.project_url ? `<a href="${p.project_url}" class="plink" target="_blank" rel="noopener noreferrer">View Project</a>` : '',
		].filter(Boolean).join('');
		return `<article class="project-card fade-up${i % 3 ? ' delay-' + (i % 3) : ''}" data-item-wrap>
  <button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
  <div class="project-banner ${banner}"></div>
  ${img ? `<div class="project-img" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}><img src="${img}" alt="${p.title}"></div>` : (v.edit_mode ? `<div class="project-img" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}></div>` : '')}
  <div class="project-body">
    ${p.project_category ? `<span class="project-badge" ${_editable(`projects.${i}.project_category`)}>${p.project_category}</span>` : ''}
    <div class="project-title" ${_editable(`projects.${i}.title`)}>${p.title}</div>
    ${p.description ? `<p class="project-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
    ${p.responsibilities?.length ? `<div class="project-section-head">Responsibilities</div><ul class="project-list" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
    ${tagRegion(`projects.${i}.tech_stack`, p.tech_stack ?? [], '')}
    ${tagRegion(`projects.${i}.software_used`, p.software_used ?? [], 'soft')}
    ${p.measurable_outcomes?.length ? `<div class="project-outcomes" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<div class="outcome-chip">${IC.check} ${o}</div>`).join('')}</div>` : ''}
    ${links ? `<div>${links}</div>` : ''}
  </div>
</article>`;
	}).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</div>
</section>
<div class="container"><div class="section-divider"></div></div>` : '';

	// SKILLS — animated proficiency bars per group + software tool cards
	const skillsHtml = (!hidden.has('skills') && v.skill_groups?.length) || v.software_proficiency?.length
		? `<section class="section" id="skills">
<div class="container">
  <div class="section-label fade-up">Technical Proficiency</div>
  <h2 class="section-title fade-up delay-1">Skills &amp; Tools</h2>
  <div class="skills-layout">
    <div class="skill-group fade-up delay-1">
${(v.skill_groups ?? []).map((g, gi) => `<div class="skill-group-block" data-item-wrap>
      <button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${gi}">&#x2715;</button>
      <div class="skill-cat-title" ${_editable(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
      <div class="skill-chips" ${_listEditable(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="skill-chip">${IC.gem}${s}</span>`).join('')}</div>
    </div>`).join('\n')}
      <button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
    </div>
    <div class="fade-up delay-2">
      <div class="section-label" style="margin-bottom:1.5rem">Software &amp; Tools</div>
      ${(v.software_proficiency?.length || em)
			? `<div class="tools-grid" ${_listEditable('software_proficiency')}>${(v.software_proficiency ?? []).length
				? v.software_proficiency.map(s => `<div class="tool-card"><div class="tool-icon">${IC.cube}</div><div class="tool-name">${s}</div></div>`).join('')
				: `<div class="tool-card" style="opacity:.6"><div class="tool-icon">${IC.cube}</div><div class="tool-name">+ Add</div></div>`}</div>`
			: ''}
    </div>
  </div>
</div>
</section>
<div class="container"><div class="section-divider"></div></div>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section class="section section--alt" id="certifications">
<div class="container">
  <div class="section-label fade-up">Credentials</div>
  <h2 class="section-title fade-up delay-1">Certifications &amp; Licenses</h2>
  <div class="certs-grid">
${v.certifications.map((c, i) => `<div class="cert-card fade-up" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
    <div class="cert-seal">${initials(c.name)}</div>
    <div>
      <div class="cert-title" ${_editable(`certifications.${i}.name`)}>${c.name}</div>
      ${c.issuer ? `<div class="cert-issuer" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
      ${c.year ? `<div class="cert-meta"><span class="cert-tag" ${_editable(`certifications.${i}.year`)}>${c.year}</span></div>` : ''}
      ${c.url ? `<a href="${c.url}" class="plink" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
    </div>
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</div>
</section>
<div class="container"><div class="section-divider"></div></div>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section class="section" id="education">
<div class="container">
  <div class="section-label fade-up">Academic Background</div>
  <h2 class="section-title fade-up delay-1">Education</h2>
  <div class="gen-grid">
${v.education.map((edu, i) => `<div class="gen-card fade-up" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
    ${(edu.start_year || edu.end_year || em) ? `<div class="gen-year">${eduYears(i, edu)}</div>` : ''}
    <div class="gen-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
    ${(edu.institution || edu.location) ? `<div class="gen-meta"><span ${_editable(`education.${i}.institution`)}>${edu.institution || ''}</span>${(edu.location) ? `, <span ${_editable(`education.${i}.location`)}>${edu.location || ''}</span>` : ''}</div>` : ''}
    ${edu.grade_or_score ? `<div class="gen-meta" style="margin-top:.3rem" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</div>
</section>
<div class="container"><div class="section-divider"></div></div>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section class="section" id="achievements">
<div class="container">
  <div class="section-label fade-up">Recognition</div>
  <h2 class="section-title fade-up delay-1">Achievements</h2>
  <div class="gen-grid">
${v.achievements.map((a, i) => `<div class="gen-card fade-up" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
    ${a.year ? `<div class="gen-year" ${_editable(`achievements.${i}.year`)}>${a.year}</div>` : ''}
    <div class="gen-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
    ${a.description ? `<div class="gen-meta" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</div>
</section>
<div class="container"><div class="section-divider"></div></div>` : '';

	// AWARDS / DESIGN / CUSTOM
	const awardsHtml = !hidden.has('awards') && v.awards?.length
		? `<section class="section" id="awards"><div class="container"><div class="section-label fade-up">Honours</div><h2 class="section-title fade-up delay-1">Awards</h2><div class="gen-grid">
${v.awards.map((a, i) => `<div class="gen-card fade-up" data-item-wrap><button class="del-btn ce-del-btn" data-del-section="awards" data-del-index="${i}">&#x2715;</button>${a.year ? `<div class="gen-year" ${_editable(`awards.${i}.year`)}>${a.year}</div>` : ''}<div class="gen-title" ${_editable(`awards.${i}.title`)}>${a.title}</div>${a.awarding_body ? `<div class="gen-meta" ${_editable(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}</div>`).join('\n')}
</div></div></section>` : '';

	const designHtml = !hidden.has('design_philosophy') && v.design_philosophy
		? `<section class="section" id="design_philosophy"><div class="container"><div class="section-label fade-up">Philosophy</div><h2 class="section-title fade-up delay-1">Engineering Philosophy</h2><p class="dp-text fade-up" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p></div></section>` : '';

	const customSectionsHtml = !hidden.has('custom_sections') && (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length) return '';
			const items = cs.items.map((item, i) => `<div class="gen-card fade-up" data-item-wrap data-cs-idx="${csIdx}">
  <button class="del-btn ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>
  ${item.subtitle ? `<div class="gen-year" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
  ${item.label ? `<div class="gen-title" ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</div>` : ''}
  ${item.value ? `<div class="gen-meta" ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</div>` : ''}
  ${item.tags?.length ? `<div class="project-tags" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>` : ''}
  ${item.url ? `<a href="${item.url}" class="plink" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section class="section section--alt" id="${cs.section_id}"><div class="container"><div class="section-label fade-up">${cs.title}</div><h2 class="section-title fade-up delay-1">${cs.title}</h2><div class="gen-grid"${cs.display_type === 'list' ? ' style="grid-template-columns:1fr"' : ''}>${items}</div>
<button class="add-btn ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button></div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	// EXPERIENCE — career timeline (mirrors the gen-card grid used by education).
	const experienceHtml = !hidden.has('experience') && v.experience?.length
		? `<section class="section" id="experience">
<div class="container">
  <div class="section-label fade-up">Career</div>
  <h2 class="section-title fade-up delay-1">Professional Experience</h2>
  <div class="gen-grid">
${v.experience.map((exp, i) => `<div class="gen-card fade-up" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
    ${(exp.start_date || exp.end_date || em) ? `<div class="gen-year">${_rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em)}</div>` : ''}
    <div class="gen-title" ${_editable(`experience.${i}.role`)}>${exp.role || ''}</div>
    ${(exp.company || exp.location) ? `<div class="gen-meta"><span ${_editable(`experience.${i}.company`)}>${exp.company || ''}</span>${(exp.location) ? `, <span ${_editable(`experience.${i}.location`)}>${exp.location || ''}</span>` : ''}</div>` : ''}
    ${exp.description ? `<div class="gen-meta" style="margin-top:.5rem" ${_editable(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
    ${exp.key_points?.length ? `<ul class="project-list" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</div>
</section>
<div class="container"><div class="section-divider"></div></div>` : '';

	const sectionMap: Record<string, string> = {
		experience: experienceHtml,
		projects: projectsHtml, skills: skillsHtml, certifications: certsHtml,
		education: educationHtml, achievements: achievementsHtml, awards: awardsHtml,
		design_philosophy: designHtml, custom_sections: customSectionsHtml,
	};
	const orderedSections = order
		.filter(k => !hidden.has(k) && k in sectionMap)
		.map(k => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	// CONTACT
	const contactCards = [
		v.email ? `<div class="contact-item"><div class="contact-icon">${IC.mail}</div><div><div class="contact-label">Email</div><div class="contact-value" ${_editable('profile.email')}>${v.email}</div></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-icon">${IC.phone}</div><div><div class="contact-label">Phone</div><div class="contact-value" ${_editable('profile.phone')}>${v.phone}</div></div></div>` : '',
		v.location ? `<div class="contact-item"><div class="contact-icon">${IC.pin}</div><div><div class="contact-label">Location</div><div class="contact-value" ${_editable('profile.location')}>${v.location}</div></div></div>` : '',
		v.linkedin_url ? `<a href="${v.linkedin_url}" class="contact-item" target="_blank" rel="noopener noreferrer"><div class="contact-icon">${IC.link}</div><div><div class="contact-label">LinkedIn</div><div class="contact-value">Connect</div></div></a>` : '',
	].filter(Boolean).join('');
	const contactHtml = contactCards
		? `<section class="section contact-section" id="contact">
<div class="container">
  <div class="contact-grid">
    <div class="contact-text fade-up">
      <div class="section-label">Get In Touch</div>
      <h2 class="section-title">Let's Build<br>Something Together</h2>
      <p class="contact-tagline" ${_editable('profile.contact_tagline', true)}>${v.contact_tagline || DEFAULT_TAGLINE}</p>
      ${v.email ? `<a href="mailto:${v.email}" class="btn btn-primary">${IC.mail} Send an Email</a>` : ''}
    </div>
    <div class="contact-cards fade-up delay-2">${contactCards}</div>
  </div>
</div>
</section>` : '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Civil Engineer</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<nav class="nav">
  <div class="container nav-inner">
    <div class="nav-logo">${inits.split('').join('<span>.</span>')}</div>
    <ul class="nav-links">${navItems}</ul>
  </div>
</nav>

<header class="hero">
  <div class="container">
    <div class="hero-grid">
      <div>
        <div class="hero-eyebrow"><span class="dot"></span> Available for Projects</div>
        <h1 class="hero-name" ${_editable('profile.full_name')}>${v.name}</h1>
        ${v.headline ? `<p class="hero-designation" ${_editable('portfolio.headline')}>${v.headline}</p>` : ''}
        ${v.bio ? `<p class="hero-bio" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${stats ? `<div class="hero-stats">${stats}</div>` : ''}
        <div class="cta-row">
          <a href="#contact" class="btn btn-primary">${IC.mail} Get In Touch</a>
          <a href="#projects" class="btn btn-outline">View Projects</a>
        </div>
      </div>
      <div class="hero-card">
        <div class="hero-avatar" ${_imgUpload('profile.profile_image', v.edit_mode)}>${avatar}</div>
        <div>
          <div class="hero-card-name">${v.name}</div>
          ${v.headline ? `<div class="hero-card-sub">${v.headline}</div>` : ''}
        </div>
        <div class="card-divider"></div>
        ${v.location ? `<div class="card-detail">${IC.pin}<span>${v.location}</span></div>` : ''}
        ${firstCompany ? `<div class="card-detail">${IC.building}<span>${firstCompany}</span></div>` : ''}
        ${v.email ? `<div class="card-detail">${IC.mail}<span>${v.email}</span></div>` : ''}
        ${v.phone ? `<div class="card-detail">${IC.phone}<span>${v.phone}</span></div>` : ''}
      </div>
    </div>
  </div>
</header>
<div class="container"><div class="section-divider"></div></div>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer class="footer">
  <div class="container">${v.name} · ${v.headline || 'Civil Engineer'} · <span>&copy; ${new Date().getFullYear()}</span></div>
</footer>
${BLUEPRINT_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
