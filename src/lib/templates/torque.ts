/**
 * Template: Torque
 * Mechanical-engineering theme — warm ivory canvas with an industrial navy &
 * gold system, condensed display type, blueprint grid hero, framed photo with
 * gold offset border, eyebrow-numbered section headers, and a navy achievements
 * band.
 * Palette: ivory #F2EFE9, navy #1A3A5C, steel #2E6DA4, gold #B8963E, ink #1C1C1C.
 * Fonts: Barlow Condensed (display) · DM Sans (body) · Barlow (light).
 * Signature animations: scroll reveals with stagger delays, nav scroll shadow,
 * card hover lifts, bouncing scroll cue.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Barlow:wght@300;400;500&display=swap';

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
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F2EFE9;--bg2:#E8E4DC;--surface:#FFFFFF;
  --ink:#1C1C1C;--ink-2:#4A4A4A;--ink-3:#888;
  --accent:#1A3A5C;--accent-2:#2E6DA4;--accent-light:#D6E8F5;
  --rule:#D0C8BC;--gold:#B8963E;
  --fd:'Barlow Condensed',sans-serif;--fb:'DM Sans',sans-serif;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--fb);font-size:16px;line-height:1.65;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
ul{list-style:none}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--accent);border-radius:3px}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 4%;height:64px;background:rgba(242,239,233,0.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--rule);transition:box-shadow .3s}
nav.scrolled{box-shadow:0 4px 24px rgba(0,0,0,0.07)}
.nav-logo{font-family:var(--fd);font-weight:700;font-size:1.25rem;letter-spacing:.08em;color:var(--accent)}
.nav-logo span{color:var(--gold)}
.nav-links{display:flex;gap:2.2rem}
.nav-links a{font-family:var(--fd);font-weight:500;font-size:.9rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-2);position:relative;padding-bottom:2px;transition:color .2s}
.nav-links a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--accent);transition:width .3s cubic-bezier(.4,0,.2,1)}
.nav-links a:hover{color:var(--accent)}.nav-links a:hover::after{width:100%}
.nav-cta{font-family:var(--fd);font-weight:600;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;padding:8px 20px;border:1.5px solid var(--accent);color:var(--accent);transition:all .25s}
.nav-cta:hover{background:var(--accent);color:#fff}

/* HERO */
#hero{min-height:100vh;padding-top:64px;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden}
.hero-left{padding:8% 6% 6% 8%;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2}
.hero-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:1.5rem}
.hero-eyebrow-line{width:40px;height:1px;background:var(--gold)}
.hero-eyebrow-text{font-family:var(--fd);font-weight:500;font-size:.85rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
.hero-name{font-family:var(--fd);font-weight:800;font-size:clamp(3.5rem,7vw,6rem);line-height:.95;letter-spacing:-.01em;color:var(--ink);margin-bottom:1rem}
.hero-name .last{color:var(--accent)}
.hero-title{font-family:var(--fd);font-weight:300;font-size:clamp(1.4rem,2.5vw,1.8rem);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2);margin-bottom:2rem;border-left:3px solid var(--gold);padding-left:14px}
.hero-intro{font-size:1.05rem;color:var(--ink-2);max-width:440px;line-height:1.75;margin-bottom:2.5rem;font-weight:300}
.hero-actions{display:flex;gap:1rem;flex-wrap:wrap}
.btn-primary{font-family:var(--fd);font-weight:700;font-size:.9rem;letter-spacing:.14em;text-transform:uppercase;padding:14px 32px;background:var(--accent);color:#fff;transition:all .25s}
.btn-primary:hover{background:var(--accent-2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,58,92,.25)}
.btn-outline{font-family:var(--fd);font-weight:600;font-size:.9rem;letter-spacing:.14em;text-transform:uppercase;padding:14px 32px;border:1.5px solid var(--ink);color:var(--ink);transition:all .25s}
.btn-outline:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-2px)}
.hero-stats{margin-top:3rem;display:flex;gap:2.5rem;padding-top:2rem;border-top:1px solid var(--rule);flex-wrap:wrap}
.stat-num{font-family:var(--fd);font-weight:800;font-size:2.4rem;color:var(--accent);display:block;line-height:1}
.stat-label{font-size:.8rem;color:var(--ink-3);text-transform:uppercase;letter-spacing:.1em;font-family:var(--fd);font-weight:500}
.hero-right{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.hero-bg-grid{position:absolute;inset:0;background-image:linear-gradient(var(--rule) 1px,transparent 1px),linear-gradient(90deg,var(--rule) 1px,transparent 1px);background-size:40px 40px;opacity:.5}
.hero-bg-block{position:absolute;right:0;top:0;bottom:0;width:85%;background:var(--accent);clip-path:polygon(8% 0,100% 0,100% 100%,0 100%);opacity:.08}
.photo-frame{position:relative;z-index:2;width:360px;height:460px}
.photo-frame::before{content:'';position:absolute;top:-16px;left:-16px;right:16px;bottom:-16px;border:2px solid var(--gold);z-index:-1}
.photo-frame::after{content:'';position:absolute;top:16px;left:16px;right:-16px;bottom:-16px;background:var(--accent);opacity:.12;z-index:-1}
.photo-frame img{width:100%;height:100%;object-fit:cover}
.photo-placeholder{width:100%;height:100%;background:linear-gradient(145deg,#C8D8E8 0%,#8AAAC4 50%,var(--accent) 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;gap:1rem}
.photo-placeholder .pp-mark{font-family:var(--fd);font-weight:800;font-size:4rem;opacity:.85}
.photo-placeholder p{font-family:var(--fd);font-size:.9rem;letter-spacing:.1em;opacity:.6}
.photo-badge{position:absolute;bottom:-20px;right:-30px;background:var(--gold);color:#fff;font-family:var(--fd);font-weight:700;font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;padding:12px 20px;z-index:3}
.hero-scroll{position:absolute;bottom:2.5rem;left:8%;display:flex;align-items:center;gap:10px;font-family:var(--fd);font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-3);animation:bounce 2s infinite;z-index:2}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}

/* SECTION SHARED */
section{padding:100px 8%}
.section-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:1rem}
.eyebrow-num{font-family:var(--fd);font-size:.8rem;letter-spacing:.2em;color:var(--gold);font-weight:600}
.eyebrow-line{flex:none;width:40px;height:1px;background:var(--rule)}
.eyebrow-label{font-family:var(--fd);font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);font-weight:500}
.section-title{font-family:var(--fd);font-weight:800;font-size:clamp(2.4rem,4vw,3.6rem);line-height:1;letter-spacing:-.01em;margin-bottom:1rem}
.section-title em{font-style:normal;color:var(--accent)}
.section-sub{font-size:1rem;color:var(--ink-2);max-width:580px;font-weight:300;line-height:1.7}
.section-header{margin-bottom:4rem}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-d1{transition-delay:.1s}.reveal-d2{transition-delay:.2s}.reveal-d3{transition-delay:.3s}

/* ABOUT */
#about{background:var(--surface)}
.about-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:6rem;align-items:center}
.about-text p{font-size:1.05rem;color:var(--ink-2);line-height:1.8;margin-bottom:1.2rem;font-weight:300}
.about-text p strong{color:var(--ink);font-weight:500}
.about-highlights{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-top:2.5rem}
.highlight-item{padding:1.2rem;background:var(--bg);border-left:3px solid var(--accent)}
.highlight-item h4{font-family:var(--fd);font-weight:700;font-size:1rem;letter-spacing:.04em;margin-bottom:.3rem}
.highlight-item p{font-size:.88rem;color:var(--ink-3);margin:0}
.about-visual{position:relative;padding:2rem}
.about-visual-card{background:var(--accent);color:#fff;padding:3rem;position:relative;overflow:hidden}
.about-visual-card::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border:40px solid rgba(255,255,255,.06);border-radius:50%}
.about-visual-card::after{content:'';position:absolute;bottom:-60px;left:-20px;width:200px;height:200px;border:50px solid rgba(255,255,255,.04);border-radius:50%}
.about-visual-card h3{font-family:var(--fd);font-weight:700;font-size:1.5rem;letter-spacing:.04em;margin-bottom:1.5rem;position:relative;z-index:1}
.about-list{position:relative;z-index:1}
.about-list li{padding:.7rem 0;border-bottom:1px solid rgba(255,255,255,.12);display:flex;align-items:center;gap:10px;font-size:.95rem;opacity:.9}
.about-list li .dot{width:6px;height:6px;border-radius:50%;background:var(--gold);flex:none}
.about-visual-corner{position:absolute;bottom:0;right:2rem;font-family:var(--fd);font-weight:800;font-size:7rem;color:var(--bg);opacity:.06;line-height:1;user-select:none}

/* SKILLS */
#skills{background:var(--bg)}
.skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
.skill-category{background:var(--surface);padding:2rem;border-top:3px solid var(--accent);transition:transform .3s,box-shadow .3s;position:relative}
.skill-category:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.08)}
.skill-cat-icon{width:44px;height:44px;background:var(--accent-light);display:flex;align-items:center;justify-content:center;margin-bottom:1.2rem;font-size:1.2rem}
.skill-cat-title{font-family:var(--fd);font-weight:700;font-size:1.1rem;letter-spacing:.06em;margin-bottom:1.5rem;text-transform:uppercase}
.skill-tag-wrap{display:flex;flex-wrap:wrap;gap:.5rem}
.skill-tag{font-family:var(--fd);font-size:.82rem;letter-spacing:.06em;padding:5px 12px;background:var(--bg);color:var(--ink-2);border:1px solid var(--rule);transition:all .2s}
.skill-tag:hover{background:var(--accent);color:#fff;border-color:var(--accent)}

/* EXPERIENCE */
#experience{background:var(--surface)}
.timeline{position:relative;padding-left:40px}
.timeline::before{content:'';position:absolute;left:11px;top:0;bottom:0;width:1px;background:var(--rule)}
.timeline-item{position:relative;margin-bottom:3.5rem}
.timeline-item:last-child{margin-bottom:0}
.timeline-dot{position:absolute;left:-40px;top:6px;width:22px;height:22px;border-radius:50%;background:var(--surface);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center}
.timeline-dot-inner{width:8px;height:8px;border-radius:50%;background:var(--accent)}
.timeline-item:first-child .timeline-dot-inner{background:var(--gold)}
.timeline-item:first-child .timeline-dot{border-color:var(--gold)}
.timeline-meta{display:flex;gap:1rem;align-items:center;margin-bottom:.6rem;flex-wrap:wrap}
.timeline-date{font-family:var(--fd);font-size:.82rem;letter-spacing:.12em;color:var(--accent);font-weight:600;text-transform:uppercase}
.timeline-dot-sep{width:4px;height:4px;background:var(--rule);border-radius:50%}
.timeline-company{font-family:var(--fd);font-size:.82rem;letter-spacing:.12em;color:var(--gold);font-weight:600;text-transform:uppercase}
.timeline-role{font-family:var(--fd);font-weight:700;font-size:1.3rem;letter-spacing:.02em;margin-bottom:.5rem}
.timeline-location{font-size:.85rem;color:var(--ink-3);margin-bottom:1rem}
.timeline-desc{font-size:.95rem;color:var(--ink-2);line-height:1.7;font-weight:300;margin-bottom:1rem}
.timeline-points{margin-bottom:1rem}
.timeline-points li{font-size:.9rem;color:var(--ink-2);line-height:1.7;padding-left:16px;position:relative;font-weight:300}
.timeline-points li::before{content:'\\2014';position:absolute;left:0;color:var(--gold)}
.timeline-tags{display:flex;flex-wrap:wrap;gap:.5rem}
.timeline-tag{font-family:var(--fd);font-size:.78rem;letter-spacing:.06em;padding:3px 10px;background:var(--accent-light);color:var(--accent)}

/* PROJECTS */
#projects{background:var(--bg)}
.projects-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
.project-card{background:var(--surface);overflow:hidden;transition:all .35s;display:flex;flex-direction:column}
.project-card:hover{transform:translateY(-8px);box-shadow:0 20px 50px rgba(0,0,0,.1)}
.project-img{height:200px;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--accent) 0%,var(--accent-2) 100%)}
.project-img img{width:100%;height:100%;object-fit:cover}
.project-img-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:20px 20px}
.project-img-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:800;font-size:3rem;color:rgba(255,255,255,.25)}
.project-cat{position:absolute;top:1rem;left:1rem;font-family:var(--fd);font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;background:rgba(0,0,0,.4);color:rgba(255,255,255,.9);padding:4px 10px;z-index:2}
.project-body{padding:1.6rem;display:flex;flex-direction:column;flex:1}
.project-title{font-family:var(--fd);font-weight:700;font-size:1.15rem;letter-spacing:.02em;margin-bottom:.6rem}
.project-desc{font-size:.88rem;color:var(--ink-2);line-height:1.65;font-weight:300;margin-bottom:1rem}
.project-points{margin-bottom:1rem}
.project-points li{font-size:.85rem;color:var(--ink-2);line-height:1.55;padding-left:14px;position:relative;font-weight:300}
.project-points li::before{content:'\\2014';position:absolute;left:0;color:var(--gold)}
.project-stack{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:auto}
.project-tech{font-family:var(--fd);font-size:.78rem;letter-spacing:.06em;padding:3px 9px;background:var(--bg);color:var(--ink-3);border:1px solid var(--rule)}
.project-tech.soft{background:var(--accent-light);color:var(--accent);border-color:transparent}
.project-links{display:flex;gap:1rem;margin-top:1rem}
.plink{font-family:var(--fd);font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--gold);padding-bottom:2px}
.plink:hover{color:var(--gold)}

/* EDUCATION */
#education{background:var(--surface)}
.edu-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
.edu-card{background:var(--bg);padding:2.2rem;border-bottom:3px solid transparent;transition:all .3s;position:relative;overflow:hidden}
.edu-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent)}
.edu-card:hover{border-bottom-color:var(--gold);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.07)}
.edu-year{font-family:var(--fd);font-size:.82rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:.5rem}
.edu-degree{font-family:var(--fd);font-weight:700;font-size:1.2rem;letter-spacing:.02em;margin-bottom:.4rem}
.edu-school{font-size:.95rem;color:var(--accent);font-weight:500;margin-bottom:.5rem}
.edu-detail{font-size:.88rem;color:var(--ink-3)}

/* NAVY BAND (achievements/certifications/custom) */
.band{background:var(--accent);color:#fff}
.band .section-title em{color:var(--gold)}
.band .section-sub{color:rgba(255,255,255,.65)}
.band .eyebrow-label{color:rgba(255,255,255,.45)}
.band .eyebrow-line{background:rgba(255,255,255,.2)}
.band-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem}
.band-card{padding:2rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);transition:all .3s;position:relative}
.band-card:hover{background:rgba(255,255,255,.1);transform:translateY(-4px)}
.band-icon{width:48px;height:48px;margin-bottom:1.2rem;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);font-size:1.3rem;color:var(--gold)}
.band-year{font-family:var(--fd);font-size:.8rem;letter-spacing:.16em;color:var(--gold);font-weight:600;text-transform:uppercase;margin-bottom:.5rem}
.band-title{font-family:var(--fd);font-weight:700;font-size:1.05rem;margin-bottom:.6rem;letter-spacing:.02em}
.band-desc{font-size:.88rem;opacity:.7;line-height:1.6;font-weight:300}
.band-meta{font-size:.85rem;opacity:.7}
.band-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.8rem}
.band-tag{font-family:var(--fd);font-size:.72rem;letter-spacing:.06em;padding:3px 10px;background:rgba(212,175,55,.14);color:var(--gold)}
.band-link{display:inline-block;margin-top:.8rem;font-family:var(--fd);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);border-bottom:1px solid rgba(212,175,55,.5);padding-bottom:2px}

/* CONTACT */
#contact{background:var(--surface)}
.contact-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:6rem}
.contact-info-item{display:flex;align-items:flex-start;gap:1.2rem;margin-bottom:2rem}
.contact-icon{width:44px;height:44px;flex:none;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:1.1rem}
.contact-info-label{font-family:var(--fd);font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:600;margin-bottom:.2rem}
.contact-info-val{font-size:.95rem;color:var(--ink)}
.social-links{display:flex;gap:.8rem;margin-top:1rem;flex-wrap:wrap}
.social-link{display:flex;align-items:center;gap:8px;padding:10px 18px;border:1px solid var(--rule);font-family:var(--fd);font-size:.85rem;letter-spacing:.08em;color:var(--ink-2);transition:all .25s}
.social-link:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.contact-side{background:var(--accent);color:#fff;padding:3rem;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden}
.contact-side::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:30px 30px;opacity:.5}
.contact-side-mark{font-family:var(--fd);font-weight:800;font-size:4.5rem;color:var(--gold);position:relative;z-index:1;line-height:1}
.contact-side-txt{font-family:var(--fd);font-size:.85rem;letter-spacing:.16em;text-transform:uppercase;margin-top:1rem;opacity:.85;position:relative;z-index:1}

/* FOOTER */
footer{background:var(--ink);color:rgba(255,255,255,.4);padding:2.5rem 8%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.footer-logo{font-family:var(--fd);font-weight:700;font-size:1.1rem;letter-spacing:.08em;color:#fff}
.footer-logo span{color:var(--gold)}
footer p{font-size:.85rem}

/* EDIT CONTROLS */
.add-btn{display:block;margin-top:2rem;padding:12px 18px;border:1px dashed var(--rule);background:var(--bg);color:var(--accent);font-family:var(--fd);font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;width:100%;text-align:center}
.add-btn:hover{border-color:var(--accent)}
.band .add-btn{background:rgba(255,255,255,.06);color:var(--gold);border-color:rgba(255,255,255,.2)}
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;border:none;background:rgba(26,26,28,.8);color:#fff;font-size:12px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

@media(max-width:1100px){
  #hero{grid-template-columns:1fr;min-height:auto;padding-bottom:60px}
  .hero-right{display:none}.hero-left{padding:120px 8% 4rem}
  .skills-grid{grid-template-columns:1fr 1fr}.projects-grid{grid-template-columns:1fr 1fr}
  .about-grid,.contact-grid{grid-template-columns:1fr;gap:3rem}.edu-grid{grid-template-columns:1fr}
}
@media(max-width:768px){
  .nav-links,.nav-cta{display:none}
  section{padding:70px 6%}
  .skills-grid,.projects-grid{grid-template-columns:1fr}
  .hero-stats{gap:1.5rem}
}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}.hero-scroll{animation:none}}
`;
}

const TORQUE_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);});}
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:.12});
    reveals.forEach(function(r){io.observe(r);});
  }
})();
<\/script>`;

const SKILL_ICONS = ['⚙️', '🔬', '🏭', '🌡️', '📐', '📋'];

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const em = v.edit_mode;
	const inits = initials(v.name);
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	const nameParts = v.name.split(/\s+/);
	const firstName = nameParts.slice(0, -1).join(' ') || v.name;
	const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
	const heroName = lastName ? `${firstName}<br><span class="last">${lastName}</span>` : `<span class="last">${firstName}</span>`;
	const logoMark = lastName ? `${firstName[0] ?? ''}${lastName[0] ?? ''}` : (firstName.slice(0, 2) || 'ME');

	// Experience date range bound to real start/end fields (never computed duration).
	const datePeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const showStart = exp.start_date;
		const showEnd = exp.end_date;
		if (!showStart && !showEnd) return '';
		const s = showStart ? `<span ${_editable(`experience.${i}.start_date`)}>${exp.start_date}</span>` : '';
		const e = showEnd ? `<span ${_editable(`experience.${i}.end_date`)}>${exp.end_date}</span>` : '';
		return `<span class="timeline-date">${s}${showStart && showEnd ? ' – ' : ''}${e}</span>`;
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
		about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects',
		education: 'Education', certifications: 'Certifications', achievements: 'Awards', contact: 'Contact',
	};
	const navAnchors: string[] = [];
	if (v.bio) navAnchors.push('about');
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (['skills', 'experience', 'projects', 'education', 'certifications', 'achievements'].includes(key)) {
			const dk = key === 'skills' ? 'skill_groups' : key;
			const d = (v as unknown as Record<string, unknown>)[dk];
			if (Array.isArray(d) && d.length > 0) navAnchors.push(key);
		}
	}
	if (v.email || v.phone || v.location) navAnchors.push('contact');
	const navItems = navAnchors.map(a => `<li><a href="#${a}">${NAV_LABELS[a] ?? a}</a></li>`).join('');

	const photo = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="photo-placeholder"><div class="pp-mark">${inits}</div><p>${(v.headline || 'Engineer').slice(0, 24)}</p></div>`;

	const heroStats = [
		statShown(v, 'years_experience', years) ? `<div><span class="stat-num"><span ${ted('years_experience')}>${years}</span>+</span><span class="stat-label">Years Exp.</span></div>` : '',
		statShown(v, 'projects_count', projCount) ? `<div><span class="stat-num"><span ${ted('projects_count')}>${projCount}</span>+</span><span class="stat-label">Projects Done</span></div>` : '',
		statShown(v, 'certifications_count', certCount) ? `<div><span class="stat-num"><span ${ted('certifications_count')}>${certCount}</span>+</span><span class="stat-label">Certifications</span></div>` : '',
	].filter(Boolean).join('');

	// ABOUT — highlights derived from skill groups (decorative teaser), core-expertise card from categories.
	const highlights = (v.skill_groups ?? []).slice(0, 4).map(g =>
		`<div class="highlight-item"><h4>${g.category}</h4><p>${(g.skills ?? []).slice(0, 3).join(' · ')}</p></div>`
	).join('');
	const expertiseList = (v.core_expertise?.length ? v.core_expertise : (v.skill_groups ?? []).map(g => g.category).filter(Boolean));
	const coreCard = expertiseList.length
		? `<div class="about-visual reveal reveal-d1"><div class="about-visual-card"><h3>Core Expertise</h3><ul class="about-list">${expertiseList.slice(0, 8).map(x => `<li><span class="dot"></span> ${x}</li>`).join('')}</ul><div class="about-visual-corner">${inits}</div></div></div>`
		: '';
	const aboutHtml = v.bio
		? `<section id="about">
  <div class="about-grid">
    <div>
      <div class="section-eyebrow reveal"><span class="eyebrow-num">01</span><div class="eyebrow-line"></div><span class="eyebrow-label">About Me</span></div>
      <h2 class="section-title reveal reveal-d1">Engineering <em>Precision</em><br>Built for Impact</h2>
      <div class="about-text reveal reveal-d2"><p ${_editable('portfolio.bio', true)}>${v.bio}</p></div>
      ${highlights ? `<div class="about-highlights reveal reveal-d3">${highlights}</div>` : ''}
    </div>
    ${coreCard}
  </div>
</section>` : '';

	// SKILLS — one tag card per skill group, plus a folded software/tools card.
	const skillCards = (v.skill_groups ?? []).map((g, gi) => `<div class="skill-category reveal ${gi % 3 === 1 ? 'reveal-d1' : gi % 3 === 2 ? 'reveal-d2' : ''}" data-item-wrap>
  <button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${gi}">&#x2715;</button>
  <div class="skill-cat-icon">${SKILL_ICONS[gi % SKILL_ICONS.length]}</div>
  <div class="skill-cat-title" ${_editable(`skills.${gi}.category`)}>${g.category}</div>
  <div class="skill-tag-wrap" ${_listEditable(`skills.${gi}.skills`)}>${(g.skills ?? []).map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>`).join('\n');
	const toolsCard = (v.software_proficiency?.length || em)
		? `<div class="skill-category reveal"><div class="skill-cat-icon">${SKILL_ICONS[0]}</div><div class="skill-cat-title">Software &amp; Tools</div><div class="skill-tag-wrap" ${_listEditable('software_proficiency')}>${(v.software_proficiency ?? []).length ? v.software_proficiency.map(s => `<span class="skill-tag">${s}</span>`).join('') : `<span class="skill-tag" style="opacity:.6">+ Add</span>`}</div></div>`
		: '';
	const skillsHtml = (v.skill_groups?.length || toolsCard)
		? `<section id="skills">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">02</span><div class="eyebrow-line"></div><span class="eyebrow-label">Technical Proficiency</span></div>
    <h2 class="section-title reveal reveal-d1">Skills &amp; <em>Toolset</em></h2>
  </div>
  <div class="skills-grid">${skillCards}${toolsCard}</div>
  <button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
</section>` : '';

	// EXPERIENCE timeline
	const expHtml = v.experience?.length
		? `<section id="experience">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">03</span><div class="eyebrow-line"></div><span class="eyebrow-label">Work History</span></div>
    <h2 class="section-title reveal reveal-d1">Professional <em>Experience</em></h2>
  </div>
  <div class="timeline">
${v.experience.map((exp, i) => `<div class="timeline-item reveal" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
    <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
    <div class="timeline-meta">${datePeriod(i, exp)}${exp.company ? `<div class="timeline-dot-sep"></div><span class="timeline-company" ${_editable(`experience.${i}.company`)}>${exp.company}</span>` : ''}</div>
    <div class="timeline-role" ${_editable(`experience.${i}.role`)}>${exp.role}</div>
    ${exp.location ? `<div class="timeline-location" ${_editable(`experience.${i}.location`)}>${exp.location}</div>` : ''}
    ${exp.description ? `<p class="timeline-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
    ${exp.key_points?.length ? `<ul class="timeline-points" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</section>` : '';

	// PROJECTS
	const projectsHtml = v.projects?.length
		? `<section id="projects">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">04</span><div class="eyebrow-line"></div><span class="eyebrow-label">Portfolio</span></div>
    <h2 class="section-title reveal reveal-d1">Featured <em>Projects</em></h2>
  </div>
  <div class="projects-grid">
${v.projects.map((p, i) => {
			const img = p.images?.[0];
			const links = [
				p.github_repo ? `<a href="${p.github_repo}" class="plink" target="_blank" rel="noopener noreferrer">Repository</a>` : '',
				p.project_url ? `<a href="${p.project_url}" class="plink" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '',
			].filter(Boolean).join('');
			return `<div class="project-card reveal ${i % 3 === 1 ? 'reveal-d1' : i % 3 === 2 ? 'reveal-d2' : ''}" data-item-wrap>
  <button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
  <div class="project-img" ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>${img ? `<img src="${img}" alt="${p.title}">` : `<div class="project-img-grid"></div><div class="project-img-mark">${inits}</div>`}${p.project_category ? `<span class="project-cat" ${_editable(`projects.${i}.project_category`)}>${p.project_category}</span>` : ''}</div>
  <div class="project-body">
    <div class="project-title" ${_editable(`projects.${i}.title`)}>${p.title}</div>
    ${p.description ? `<p class="project-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
    ${p.responsibilities?.length ? `<ul class="project-points" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
    ${p.measurable_outcomes?.length ? `<ul class="project-points" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul>` : ''}
    ${(p.tech_stack?.length) ? `<div class="project-stack" ${_listEditable(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="project-tech">${t}</span>`).join('')}</div>` : ''}
    ${(p.software_used?.length) ? `<div class="project-stack" ${_listEditable(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="project-tech soft">${t}</span>`).join('')}</div>` : ''}
    ${links ? `<div class="project-links">${links}</div>` : ''}
  </div>
</div>`;
		}).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</section>` : '';

	// EDUCATION
	const educationHtml = v.education?.length
		? `<section id="education">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">05</span><div class="eyebrow-line"></div><span class="eyebrow-label">Academic Background</span></div>
    <h2 class="section-title reveal reveal-d1">Education &amp; <em>Training</em></h2>
  </div>
  <div class="edu-grid">
${v.education.map((edu, i) => `<div class="edu-card reveal ${i % 2 === 1 ? 'reveal-d1' : ''}" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
    ${eduYears(i, edu) ? `<div class="edu-year">${eduYears(i, edu)}</div>` : ''}
    <div class="edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
    ${edu.institution ? `<div class="edu-school" ${_editable(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
    ${(edu.location || edu.grade_or_score) ? `<div class="edu-detail">${edu.location ? `<span ${_editable(`education.${i}.location`)}>${edu.location}</span>` : ''}${edu.location && edu.grade_or_score ? ' · ' : ''}${edu.grade_or_score ? `<span ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}</div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</section>` : '';

	// CERTIFICATIONS (navy band)
	const certsHtml = v.certifications?.length
		? `<section id="certifications" class="band">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">06</span><div class="eyebrow-line"></div><span class="eyebrow-label">Credentials</span></div>
    <h2 class="section-title reveal reveal-d1"><em>Certifications</em></h2>
  </div>
  <div class="band-grid">
${v.certifications.map((c, i) => `<div class="band-card reveal" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
    <div class="band-icon">&#10022;</div>
    ${c.year ? `<div class="band-year" ${_editable(`certifications.${i}.year`)}>${c.year}</div>` : ''}
    <div class="band-title" ${_editable(`certifications.${i}.name`)}>${c.name}</div>
    ${c.issuer ? `<div class="band-meta" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
    ${c.url ? `<a href="${c.url}" class="band-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</section>` : '';

	// ACHIEVEMENTS (navy band)
	const achievementsHtml = v.achievements?.length
		? `<section id="achievements" class="band">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">07</span><div class="eyebrow-line"></div><span class="eyebrow-label">Recognitions</span></div>
    <h2 class="section-title reveal reveal-d1">Awards &amp; <em>Achievements</em></h2>
  </div>
  <div class="band-grid">
${v.achievements.map((a, i) => `<div class="band-card reveal" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
    <div class="band-icon">&#9733;</div>
    ${a.year ? `<div class="band-year" ${_editable(`achievements.${i}.year`)}>${a.year}</div>` : ''}
    <div class="band-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
    ${a.description ? `<div class="band-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
    ${a.url ? `<a href="${a.url}" class="band-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</section>` : '';

	// CUSTOM SECTIONS (navy band, cards/list/timeline)
	const customSectionsHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length) return '';
			const cards = cs.items.map((item, i) => `<div class="band-card reveal" data-item-wrap data-cs-idx="${ci}">
  <button class="del-btn ce-del-btn" data-del-section="custom_sections.${ci}" data-del-index="${i}">&#x2715;</button>
  ${item.subtitle ? `<div class="band-year" ${_editable(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
  ${item.label ? `<div class="band-title" ${_editable(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
  ${item.value ? `<div class="band-desc" ${_editable(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
  ${item.tags?.length ? `<div class="band-tags" ${_listEditable(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="band-tag">${t}</span>`).join('')}</div>` : ''}
  ${item.url ? `<a href="${item.url}" class="band-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}" class="band">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">&#9679;</span><div class="eyebrow-line"></div><span class="eyebrow-label" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</span></div>
    <h2 class="section-title reveal reveal-d1" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</h2>
  </div>
  <div class="band-grid">${cards}</div>
  <button class="add-btn ce-add-btn" data-add-section="custom_sections.${ci}.items">+ Add Item</button>
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		skills: skillsHtml, experience: expHtml, projects: projectsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		custom_sections: customSectionsHtml,
	};
	const orderedSections = order
		.filter(k => !hidden.has(k) && k in sectionMap)
		.map(k => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	// CONTACT
	const contactItems = [
		v.email ? `<div class="contact-info-item"><div class="contact-icon">@</div><div><div class="contact-info-label">Email</div><div class="contact-info-val" ${_editable('profile.email')}>${v.email}</div></div></div>` : '',
		v.phone ? `<div class="contact-info-item"><div class="contact-icon">&#9742;</div><div><div class="contact-info-label">Phone</div><div class="contact-info-val" ${_editable('profile.phone')}>${v.phone}</div></div></div>` : '',
		v.location ? `<div class="contact-info-item"><div class="contact-icon">&#9678;</div><div><div class="contact-info-label">Location</div><div class="contact-info-val" ${_editable('profile.location')}>${v.location}</div></div></div>` : '',
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a class="social-link" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">in · LinkedIn</a>` : '',
		v.github_url ? `<a class="social-link" href="${v.github_url}" target="_blank" rel="noopener noreferrer">gh · GitHub</a>` : '',
		v.portfolio_url ? `<a class="social-link" href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">&#127760; · Website</a>` : '',
	].filter(Boolean).join('');
	const contactHtml = (contactItems || socials)
		? `<section id="contact">
  <div class="section-header">
    <div class="section-eyebrow reveal"><span class="eyebrow-num">08</span><div class="eyebrow-line"></div><span class="eyebrow-label">Get in Touch</span></div>
    <h2 class="section-title reveal reveal-d1">Let's <em>Collaborate</em></h2>
    <p class="section-sub reveal reveal-d2">Open to new engineering roles, consulting engagements, and collaborative research opportunities.</p>
  </div>
  <div class="contact-grid">
    <div class="reveal">${contactItems}${socials ? `<div class="social-links">${socials}</div>` : ''}</div>
    <div class="contact-side reveal reveal-d1"><div class="contact-side-mark">${inits}</div><div class="contact-side-txt">Available for Work</div></div>
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
<nav>
  <a class="nav-logo" href="#hero">${logoMark}<span>.</span></a>
  <ul class="nav-links">${navItems}</ul>
  <a href="#contact" class="nav-cta">Hire Me</a>
</nav>

<section id="hero">
  <div class="hero-left">
    <div class="hero-eyebrow reveal"><div class="hero-eyebrow-line"></div><span class="hero-eyebrow-text">${v.profile_headline ? `<span ${_editable('profile.headline')}>${v.profile_headline}</span>` : 'Mechanical Engineer'}${v.location ? ` · ${v.location}` : ''}</span></div>
    <h1 class="hero-name reveal reveal-d1" ${_editable('profile.full_name')}>${heroName}</h1>
    ${v.headline ? `<div class="hero-title reveal reveal-d2" ${_editable('portfolio.headline')}>${v.headline}</div>` : ''}
    ${v.bio ? `<p class="hero-intro reveal reveal-d3" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
    <div class="hero-actions reveal reveal-d3">
      <a href="#projects" class="btn-primary">View Projects</a>
      <a href="#contact" class="btn-outline">Get in Touch</a>
    </div>
    ${heroStats ? `<div class="hero-stats reveal reveal-d3">${heroStats}</div>` : ''}
  </div>
  <div class="hero-right">
    <div class="hero-bg-grid"></div>
    <div class="hero-bg-block"></div>
    <div class="photo-frame" ${_imgUpload('profile.profile_image', em)}>${photo}<div class="photo-badge">Available for Work</div></div>
  </div>
  <a href="#about" class="hero-scroll"><span>&#8595;</span> Scroll Down</a>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
  <a href="#hero" class="footer-logo">${firstName.toUpperCase()}<span>.</span>${lastName.toUpperCase()}</a>
  <p>&copy; ${new Date().getFullYear()} ${v.name} · ${v.headline || 'Mechanical Engineer'}${v.location ? ` · ${v.location}` : ''}</p>
</footer>
${TORQUE_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
