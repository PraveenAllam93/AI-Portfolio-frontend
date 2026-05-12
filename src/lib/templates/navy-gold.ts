/**
 * Template: Navy Gold
 * Elegant navy/gold professional theme. Navy (#0c1f3f) background, gold (#c8a96e) accent.
 * Fonts: Cormorant Garamond (headings/hero), DM Sans (body), DM Mono (mono).
 * Features: custom gold cursor, scroll progress bar, compact nav on scroll,
 *   active nav highlighting, reveal slide-in animations, animated skill bars.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT, makePublishHelpers } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function yearsExperience(experience: NormalizedData['experience']): number {
	if (!experience?.length) return 0;
	let earliest = new Date().getFullYear();
	for (const exp of experience) {
		const m = (exp.duration || '').match(/\b(19|20)\d{2}\b/);
		if (m) { const y = parseInt(m[0]); if (y < earliest) earliest = y; }
	}
	return Math.max(1, new Date().getFullYear() - earliest);
}

const NAVY_GOLD_SCRIPT = `<script>
(function(){
  // Custom gold cursor
  var cur=document.getElementById('ng-cur'),ring=document.getElementById('ng-ring');
  if(cur&&ring){
    document.body.style.cursor='none';
    var mx=-200,my=-200,rx=-200,ry=-200;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
    (function animCur(){
      cur.style.left=mx+'px';cur.style.top=my+'px';
      rx+=(mx-rx)*.15;ry+=(my-ry)*.15;
      ring.style.left=rx+'px';ring.style.top=ry+'px';
      requestAnimationFrame(animCur);
    })();
    document.querySelectorAll('a,button,[role=button]').forEach(function(el){
      el.addEventListener('mouseenter',function(){cur.style.transform='translate(-50%,-50%) scale(2.5)';ring.style.transform='translate(-50%,-50%) scale(1.6)';});
      el.addEventListener('mouseleave',function(){cur.style.transform='translate(-50%,-50%) scale(1)';ring.style.transform='translate(-50%,-50%) scale(1)';});
    });
  }
  // Scroll progress + nav compact
  var sp=document.getElementById('ng-sp'),nav=document.querySelector('nav');
  window.addEventListener('scroll',function(){
    var s=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
    if(sp)sp.style.width=(h>0?s/h*100:0)+'%';
    if(nav)nav.classList.toggle('scrolled',s>60);
  });
  // Active nav via IntersectionObserver
  var secs=document.querySelectorAll('section[id]'),navAs=document.querySelectorAll('.nav-links a[href^="#"]');
  if('IntersectionObserver'in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          navAs.forEach(function(a){a.classList.remove('active');});
          var a=document.querySelector('.nav-links a[href="#'+e.target.id+'"]');
          if(a)a.classList.add('active');
        }
      });
    },{threshold:0.35});
    secs.forEach(function(s){io.observe(s);});
    // Reveal slide-in animations
    var ro=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);}
      });
    },{threshold:0.12});
    document.querySelectorAll('.reveal,.reveal-up').forEach(function(el){ro.observe(el);});
    // Skill bar animation
    var so=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.querySelectorAll('.skill-fill[data-width]').forEach(function(b){b.style.width=b.getAttribute('data-width')+'%';});
          so.unobserve(e.target);
        }
      });
    },{threshold:0.2});
    document.querySelectorAll('.skill-group-card').forEach(function(el){so.observe(el);});
  }
  // Stagger delays
  document.querySelectorAll('.tl-item').forEach(function(el,i){el.style.transitionDelay=(i*.12)+'s';});
  document.querySelectorAll('.proj-card').forEach(function(el,i){el.style.transitionDelay=(i*.08)+'s';});
  document.querySelectorAll('.edu-card').forEach(function(el,i){el.style.transitionDelay=(i*.1)+'s';});
  // Hamburger
  var hb=document.getElementById('ng-hb'),mm=document.getElementById('ng-mm');
  if(hb&&mm)hb.addEventListener('click',function(){mm.classList.toggle('open');hb.classList.toggle('open');});
})();
<\/script>`;

function css(): string {
	return `
/* Navy Gold Template — navy #0c1f3f, gold #c8a96e */
:root{
  --navy:#0c1f3f;--navy-mid:#162d55;--gold:#c8a96e;--gold-light:#e2c99a;
  --cream:#f7f3ec;--white:#fff;--gray:#6b7280;--text:#1a1a2e;--text2:#4a5568;
  --border:rgba(200,169,110,.25);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--text);overflow-x:hidden;line-height:1.6}
a{text-decoration:none;color:inherit}img{max-width:100%;display:block}ul{list-style:none}

/* Custom cursor */
#ng-cur{position:fixed;width:10px;height:10px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .15s}
#ng-ring{position:fixed;width:32px;height:32px;border:1.5px solid rgba(200,169,110,.5);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .15s}

/* Scroll progress */
#ng-sp{position:fixed;top:0;left:0;height:2px;width:0;background:linear-gradient(90deg,var(--gold),var(--gold-light));z-index:10000;transition:width .1s}

nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(12,31,63,.97);backdrop-filter:blur(12px);border-bottom:1px solid rgba(200,169,110,.12);transition:padding .3s,box-shadow .3s}
nav.scrolled{box-shadow:0 4px 30px rgba(0,0,0,.4)}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,5vw,4rem);height:70px;transition:height .3s}
nav.scrolled .nav-inner{height:58px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;color:var(--gold-light);letter-spacing:.04em}
.nav-links{display:flex;gap:2rem}
.nav-links a{font-size:.75rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6);transition:color .25s;position:relative;padding-bottom:4px}
.nav-links a::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--gold);transform:scaleX(0);transition:transform .25s}
.nav-links a:hover,.nav-links a.active{color:var(--gold-light)}
.nav-links a:hover::after,.nav-links a.active::after{transform:scaleX(1)}
.nav-cta{font-size:.7rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--navy);background:var(--gold);padding:8px 18px;border-radius:2px;transition:background .25s}
.nav-cta:hover{background:var(--gold-light)}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px}
.hamburger span{display:block;width:22px;height:2px;background:var(--gold-light);transition:all .3s;border-radius:1px}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
#ng-mm{display:none;position:fixed;top:70px;left:0;right:0;background:rgba(12,31,63,.98);backdrop-filter:blur(16px);border-bottom:1px solid rgba(200,169,110,.12);z-index:999;padding:1.5rem clamp(1.5rem,5vw,4rem)}
#ng-mm.open{display:block}
#ng-mm a{display:block;padding:.75rem 0;font-size:.8rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);border-bottom:1px solid rgba(255,255,255,.05);transition:color .2s}
#ng-mm a:hover{color:var(--gold-light)}

#hero{min-height:100vh;background:var(--navy);display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;padding-top:70px}
.hero-bg-pattern{position:absolute;inset:0;background-image:radial-gradient(circle at 75% 50%,rgba(200,169,110,.08) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(22,45,85,.6) 0%,transparent 40%);pointer-events:none}
.hero-grid-lines{position:absolute;inset:0;background-image:linear-gradient(rgba(200,169,110,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,.04) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:80px 60px 80px 80px;position:relative;z-index:2;animation:fadeUp .9s ease both}
.hero-tag{display:inline-flex;align-items:center;gap:10px;font-size:.7rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:28px}
.hero-tag::before{content:'';display:block;width:32px;height:1px;background:var(--gold)}
.hero-name{font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,6vw,5rem);font-weight:300;line-height:1.05;color:var(--white);margin-bottom:10px}
.hero-title-sub{font-size:.8rem;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:30px}
.hero-desc{font-size:.95rem;font-weight:300;line-height:1.85;color:rgba(255,255,255,.65);max-width:440px;margin-bottom:36px}
.hero-links{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:36px}
.hero-link{display:inline-flex;align-items:center;font-size:.75rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--navy);background:var(--gold);padding:10px 22px;border-radius:2px;transition:background .25s}
.hero-link:hover{background:var(--gold-light)}
.hero-stats{display:flex;gap:32px;flex-wrap:wrap}
.hero-stat{display:flex;flex-direction:column;gap:3px}
.hero-stat-num{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;color:var(--gold);line-height:1}
.hero-stat-lbl{font-size:.65rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.4)}
.hero-right{display:flex;align-items:center;justify-content:center;padding:80px 80px 80px 40px;position:relative;z-index:2;animation:fadeIn 1.2s ease both}
.hero-photo-frame{position:relative;width:320px;height:400px}
.hero-photo-frame::before{content:'';position:absolute;top:-14px;right:-14px;width:100%;height:100%;border:1.5px solid var(--gold);border-radius:3px;opacity:.4;z-index:0}
.hero-photo-frame::after{content:'';position:absolute;bottom:-14px;left:-14px;width:100%;height:100%;border:1.5px solid var(--gold);border-radius:3px;opacity:.2;z-index:0}
.hero-photo-inner{position:relative;z-index:1;width:100%;height:100%;background:linear-gradient(145deg,var(--navy-mid) 0%,#0a1829 100%);border-radius:3px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-photo-img{width:100%;height:100%;object-fit:cover}
.hero-initials{font-family:'Cormorant Garamond',serif;font-size:6rem;font-weight:300;color:rgba(200,169,110,.3);letter-spacing:-.02em;user-select:none}
.hero-badge{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--navy);font-size:.65rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:8px 20px;border-radius:2px;white-space:nowrap;z-index:2}

section{padding:90px 0}
.container{max-width:1200px;margin:0 auto;padding:0 clamp(1.5rem,5vw,4rem)}
.section-header{margin-bottom:48px}
.section-label{font-size:.7rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:12px;margin-bottom:12px}
.section-label::before{content:'';display:block;width:24px;height:1px;background:var(--gold)}
.section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:300;line-height:1.1;color:var(--navy)}
.section-title em{font-style:italic;color:var(--gold)}

/* Reveal animations */
.reveal{opacity:0;transform:translateX(-24px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:translateX(0)}
.reveal-up{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
.reveal-up.visible{opacity:1;transform:translateY(0)}

#about{background:var(--white)}
.about-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:start}
.about-main-top{display:flex;align-items:center;gap:16px;margin-bottom:20px}
.status-badge{display:inline-flex;align-items:center;gap:8px;font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#166534;background:#dcfce7;border:1px solid #86efac;padding:5px 14px;border-radius:20px}
.status-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
.about-bio{font-size:1rem;font-weight:300;line-height:1.9;color:var(--text2)}
.about-highlights{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px}
.highlight-item{background:var(--cream);border:1px solid rgba(12,31,63,.08);border-radius:4px;padding:16px;border-left:3px solid var(--gold)}
.highlight-label{font-size:.65rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:4px}
.highlight-val{font-size:.875rem;color:var(--text2);font-weight:400}
.contact-card{background:var(--navy);padding:36px;border-radius:4px}
.contact-card-title{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:400;color:var(--gold-light);margin-bottom:24px}
.ci{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.ci:last-child{border-bottom:none}
.ci-ico{width:30px;height:30px;background:rgba(200,169,110,.12);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:.8rem;color:var(--gold-light);flex-shrink:0}
.ci-lbl{font-size:.625rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:2px}
.ci-val{font-size:.8rem;color:rgba(255,255,255,.8)}
.ci-val a{color:var(--gold-light)}

#experience{background:var(--cream)}
.timeline{position:relative;padding-left:32px}
.timeline::before{content:'';position:absolute;left:0;top:8px;bottom:8px;width:1px;background:linear-gradient(to bottom,var(--gold),rgba(200,169,110,.1))}
.tl-item{position:relative;margin-bottom:52px}
.tl-item::before{content:'';position:absolute;left:-38px;top:6px;width:12px;height:12px;border-radius:50%;background:var(--gold);border:3px solid var(--cream);box-shadow:0 0 0 1px var(--gold)}
.tl-header{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px}
.tl-role{font-size:1.1rem;font-weight:600;color:var(--navy)}
.tl-period{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--gold);background:rgba(200,169,110,.1);border:1px solid var(--border);padding:3px 10px;border-radius:2px;white-space:nowrap}
.tl-company{font-size:.8rem;font-weight:500;color:var(--gold);letter-spacing:.05em;margin-bottom:4px}
.tl-location{font-size:.75rem;color:var(--gray);margin-bottom:16px}
.tl-desc{font-size:.875rem;font-weight:300;line-height:1.75;color:var(--text2);margin-bottom:10px}
.tl-points{list-style:none}
.tl-points li{font-size:.875rem;font-weight:300;line-height:1.75;color:var(--text2);padding:5px 0 5px 20px;position:relative}
.tl-points li::before{content:'\\2192';position:absolute;left:0;color:var(--gold);font-size:.75rem}
.add-btn{display:block;margin-top:14px;padding:9px 16px;border:2px dashed var(--border);border-radius:2px;background:rgba(200,169,110,.04);color:var(--gold);font-size:.85rem;cursor:pointer;width:100%;text-align:center;font-weight:600}
.add-btn:hover{background:rgba(200,169,110,.08)}

#skills{background:var(--white)}
.skills-layout{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:32px}
.skill-group-card{margin-bottom:4px}
.skill-cat{font-size:.8rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--navy);border-bottom:1px solid rgba(12,31,63,.1);padding-bottom:12px;margin-bottom:18px}
.skill-bar-item{margin-bottom:14px}
.skill-bar-label{font-size:.85rem;font-weight:400;color:var(--text2);margin-bottom:6px}
.skill-track{height:4px;background:rgba(12,31,63,.08);border-radius:2px;overflow:hidden}
.skill-fill{height:100%;width:0;background:linear-gradient(90deg,var(--gold),var(--gold-light));border-radius:2px;transition:width 1.2s ease}

#projects{background:var(--cream)}
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}
.proj-card{background:var(--white);border:1px solid rgba(12,31,63,.08);border-radius:4px;overflow:hidden;position:relative;transition:border-color .3s,transform .3s,box-shadow .3s}
.proj-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 12px 40px rgba(12,31,63,.12)}
.proj-banner{height:140px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.proj-banner-bg{position:absolute;inset:0;z-index:1}
.proj-banner-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.proj-banner-img+.proj-banner-bg{background:linear-gradient(to bottom,transparent 40%,rgba(12,31,63,.6));opacity:1}
.proj-banner-initials{position:relative;z-index:2;font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;color:rgba(255,255,255,.6);user-select:none}
.proj-body{padding:20px 22px}
.proj-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
.proj-title{font-size:1.05rem;font-weight:600;color:var(--navy)}
.proj-link{font-size:.7rem;font-weight:500;color:var(--gold);white-space:nowrap}
.proj-desc{font-size:.875rem;font-weight:300;line-height:1.75;color:var(--text2);margin-bottom:12px}
.proj-tags{display:flex;flex-wrap:wrap;gap:6px}
.proj-tag{font-size:.625rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);background:rgba(200,169,110,.1);border:1px solid var(--border);padding:3px 10px;border-radius:2px}

#education{background:var(--navy)}
#education .section-title{color:var(--white)}
#education .section-label{color:var(--gold)}
#education .section-label::before{background:var(--gold)}
.edu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.edu-card{background:var(--navy-mid);border:1px solid rgba(200,169,110,.15);border-radius:4px;padding:26px;position:relative;overflow:hidden;transition:border-color .3s}
.edu-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;height:0;background:var(--gold);transition:height .4s ease}
.edu-card:hover::before{height:100%}
.edu-card:hover{border-color:rgba(200,169,110,.4)}
.edu-period{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--gold);margin-bottom:10px}
.edu-degree{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:400;color:var(--white);margin-bottom:6px}
.edu-school{font-size:.875rem;font-weight:500;color:var(--gold-light);margin-bottom:2px}
.edu-grade{font-size:.8rem;color:rgba(255,255,255,.5);margin-top:4px}

#certifications{background:var(--white)}
.cert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.cert-card{display:flex;align-items:flex-start;gap:12px;background:var(--cream);border:1px solid rgba(12,31,63,.08);border-radius:4px;padding:18px;position:relative;transition:border-color .3s,transform .3s}
.cert-card:hover{border-color:var(--gold);transform:translateY(-2px)}
.cert-ico{width:30px;height:30px;flex-shrink:0;background:var(--navy);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:.9rem;color:var(--gold)}
.cert-name{font-size:.9rem;font-weight:600;color:var(--navy);margin-bottom:4px}
.cert-issuer{font-size:.8rem;color:var(--gold);margin-bottom:2px}
.cert-year{font-size:.75rem;color:var(--gray)}

#achievements{background:var(--cream)}
.ach-list{display:flex;flex-direction:column;gap:18px}
.ach-item{display:flex;align-items:flex-start;gap:16px;position:relative}
.ach-dot{width:10px;height:10px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:5px}
.ach-title{font-size:1rem;font-weight:600;color:var(--navy);margin-bottom:4px}
.ach-desc{font-size:.875rem;font-weight:300;color:var(--text2);line-height:1.75}

#awards{background:var(--white)}
.award-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.award-card{background:var(--cream);border:1px solid rgba(12,31,63,.08);border-left:3px solid var(--gold);border-radius:0 4px 4px 0;padding:18px;position:relative;transition:transform .3s,box-shadow .3s}
.award-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(12,31,63,.1)}
.award-year{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--gold);margin-bottom:6px}
.award-name{font-size:.9rem;font-weight:600;color:var(--navy);margin-bottom:4px}
.award-org{font-size:.8rem;color:var(--text2)}

#campaigns,.camp-section,#financial_modeling,#investment_portfolios{background:var(--cream)}
.camp-grid,.fin-grid,.inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.camp-card,.fin-card,.inv-card{background:var(--white);border:1px solid rgba(12,31,63,.08);border-radius:4px;padding:22px;position:relative}
.camp-name,.fin-type,.inv-type{font-size:.95rem;font-weight:600;color:var(--navy);margin-bottom:8px}
.camp-meta,.fin-meta,.inv-meta{font-size:.8rem;color:var(--text2)}

#contact{background:var(--navy)}
#contact .section-title{color:var(--white)}
#contact .section-label{color:var(--gold)}
#contact .section-label::before{background:var(--gold)}
.contact-row{display:flex;flex-wrap:wrap;gap:28px}
.ct-item{display:flex;flex-direction:column;gap:4px}
.ct-label{font-size:.625rem;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.35)}
.ct-val{font-size:.95rem;color:rgba(255,255,255,.8)}

footer{background:var(--navy);border-top:1px solid rgba(200,169,110,.1);padding:24px 0}
.footer-inner{max-width:1200px;margin:0 auto;padding:0 clamp(1.5rem,5vw,4rem)}
.footer-copy{font-size:.75rem;color:rgba(255,255,255,.3);letter-spacing:.05em}

/* inline editing helpers */
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;border:none;background:rgba(239,68,68,.15);color:#ef4444;font-size:13px;line-height:22px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{box-shadow:0 0 0 6px rgba(34,197,94,0)}}

@media(max-width:900px){#hero{grid-template-columns:1fr;padding-top:70px}.hero-right{display:none}.hero-left{padding:60px 40px 60px}.about-grid{grid-template-columns:1fr;gap:40px}.nav-links{display:none}.hamburger{display:flex}}
@media(max-width:600px){.hero-left{padding:40px 24px 48px}section{padding:60px 0}.timeline{padding-left:20px}.tl-item::before{left:-26px}}
`;
}

function projBannerGradient(p: NormalizedData['projects'][number]): string {
	const stack = [...(p.tech_stack ?? []), ...(p.software_used ?? []), p.project_category ?? ''].join(' ').toLowerCase();
	if (stack.match(/react|next|vue|svelte|angular/)) return 'linear-gradient(135deg,rgba(12,31,63,.8),rgba(200,169,110,.2))';
	if (stack.match(/python|ai|ml|data|django/)) return 'linear-gradient(135deg,rgba(22,45,85,.9),rgba(200,169,110,.3))';
	if (stack.match(/node|express|api|backend/)) return 'linear-gradient(135deg,rgba(10,24,41,.9),rgba(200,169,110,.25))';
	return 'linear-gradient(135deg,rgba(12,31,63,.85),rgba(200,169,110,.15))';
}

export function html(v: NormalizedData, publishMode = false): string {
	// eslint-disable-next-line no-shadow
	const { editable: _editable, listEditable: _listEditable, editorScript: EDITOR_SCRIPT, cspMeta, publishStyles } = makePublishHelpers(publishMode);
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const NAV_LABELS: Record<string, string> = {
		experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements',
		awards: 'Awards', campaigns: 'Campaigns', financial_modeling: 'Financial',
		investment_portfolios: 'Investments',
	};
	const navAnchors: [string, string][] = [];
	for (const key of order) {
		if (!hidden.has(key) && key in NAV_LABELS) {
			const dk = key === 'skills' ? 'skill_groups' : key;
			const d = (v as Record<string, unknown>)[dk];
			if (d && (Array.isArray(d) ? d.length > 0 : Boolean(d))) navAnchors.push([key, NAV_LABELS[key]]);
		}
	}
	const navItems = navAnchors.map(([a, l]) => `<li><a href="#${a}">${l}</a></li>`).join('');
	const mobileNavItems = navAnchors.map(([a, l]) => `<a href="#${a}" onclick="document.getElementById('ng-mm').classList.remove('open');document.getElementById('ng-hb').classList.remove('open')">${l}</a>`).join('');

	const inits = initials(v.name);
	const avatarHtml = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}" class="hero-photo-img">`
		: `<div class="hero-initials">${inits}</div>`;

	const socialLinks = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" class="hero-link">LinkedIn</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" class="hero-link">GitHub</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" class="hero-link">Portfolio</a>` : '',
	].filter(Boolean).join('');

	// Hero stats
	const yrs = yearsExperience(v.experience);
	const projCount = v.projects?.length ?? 0;
	const certCount = v.certifications?.length ?? 0;
	const heroStats = (yrs > 0 || projCount > 0 || certCount > 0)
		? `<div class="hero-stats">
${yrs > 0 ? `<div class="hero-stat"><span class="hero-stat-num">${yrs}+</span><span class="hero-stat-lbl">Years Exp</span></div>` : ''}
${projCount > 0 ? `<div class="hero-stat"><span class="hero-stat-num">${projCount}+</span><span class="hero-stat-lbl">Projects</span></div>` : ''}
${certCount > 0 ? `<div class="hero-stat"><span class="hero-stat-num">${certCount}</span><span class="hero-stat-lbl">Certifications</span></div>` : ''}
</div>` : '';

	// Experience
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience">
<div class="container">
<div class="section-header reveal"><div class="section-label">Experience</div><h2 class="section-title">Professional <em>Journey</em></h2></div>
<div class="timeline">
${v.experience.map((exp, i) => `<div class="tl-item reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
<div class="tl-header">
<span class="tl-role" ${_editable(`experience.${i}.role`)}>${exp.role}</span>
${exp.duration ? `<span class="tl-period" ${_editable(`experience.${i}.duration`)}>${exp.duration}</span>` : ''}
</div>
${exp.company ? `<div class="tl-company" ${_editable(`experience.${i}.company`)}>${exp.company}</div>` : ''}
${exp.location ? `<div class="tl-location">${exp.location}</div>` : ''}
${exp.description ? `<p class="tl-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="tl-points" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</div>
</section>` : '';

	// Skills — render as animated bars
	const skillsHtml = !hidden.has('skills') && v.skill_groups?.length
		? `<section id="skills">
<div class="container">
<div class="section-header reveal"><div class="section-label">Skills</div><h2 class="section-title">Core <em>Competencies</em></h2></div>
<div class="skills-layout">
${v.skill_groups.map((g, i) => {
	const pcts = [90, 85, 80, 75, 72, 68, 65, 62].slice(0, g.skills.length);
	const bars = g.skills.map((s, si) => `<div class="skill-bar-item"><div class="skill-bar-label">${s}</div><div class="skill-track"><div class="skill-fill" data-width="${pcts[si] ?? 60}" style="width:0"></div></div></div>`).join('');
	return `<div class="skill-group-card reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${i}">&#x2715;</button>
<div class="skill-cat" ${_editable(`skills.${i}.category`)}>${g.category}</div>
${bars}
</div>`;
}).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
</div>
</section>` : '';

	// Projects — with banner
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section id="projects">
<div class="container">
<div class="section-header reveal"><div class="section-label">Projects</div><h2 class="section-title">Selected <em>Work</em></h2></div>
<div class="proj-grid">
${v.projects.map((p, i) => {
	const techs = (p.tech_stack?.length ? p.tech_stack : p.software_used ?? []).map((t) => `<span class="proj-tag">${t}</span>`).join('');
	const url = p.project_url || p.github_repo;
	const bannerInitials = (p.title[0] ?? '').toUpperCase();
	const bg = projBannerGradient(p);
	const bannerImg = p.images?.[0];
	const respHtml = p.responsibilities?.length
		? `<ul class="tl-points" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.slice(0, 3).map(r => `<li>${r}</li>`).join('')}</ul>`
		: '';
	return `<div class="proj-card reveal-up" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
<div class="proj-banner"${bannerImg ? '' : ` style="background:${bg}"`}>
${bannerImg ? `<img class="proj-banner-img" src="${bannerImg}" alt="${p.title}">` : ''}
<div class="proj-banner-bg"${bannerImg ? '' : ` style="background:${bg}"`}></div>
${bannerImg ? '' : `<div class="proj-banner-initials">${bannerInitials}</div>`}
</div>
<div class="proj-body">
<div class="proj-header">
<span class="proj-title" ${_editable(`projects.${i}.title`)}>${p.title}</span>
${url ? `<a href="${url}" class="proj-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>
${p.description ? `<p class="proj-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${respHtml}
${techs ? `<div class="proj-tags" ${_listEditable(`projects.${i}.tech_stack`)}>${techs}</div>` : ''}
</div>
</div>`;
}).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</div>
</section>` : '';

	// Education
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section id="education">
<div class="container">
<div class="section-header reveal"><div class="section-label">Education</div><h2 class="section-title">Academic <em>Background</em></h2></div>
<div class="edu-grid">
${v.education.map((edu, i) => `<div class="edu-card reveal-up" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
<div class="edu-period" ${_editable(`education.${i}.year_range`)}>${edu.year_range}</div>
<div class="edu-degree" ${_editable(`education.${i}.degree`)}>${[edu.degree, edu.field_of_study].filter(Boolean).join(' in ')}</div>
${edu.institution ? `<div class="edu-school" ${_editable(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
${edu.grade_or_score ? `<div class="edu-grade" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</div>
</section>` : '';

	// Certifications
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section id="certifications">
<div class="container">
<div class="section-header reveal"><div class="section-label">Certifications</div><h2 class="section-title">Professional <em>Credentials</em></h2></div>
<div class="cert-grid">
${v.certifications.map((c, i) => `<div class="cert-card reveal-up" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
<div class="cert-ico">&#10003;</div>
<div>
<div class="cert-name">${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name}</div>
${c.issuer ? `<div class="cert-issuer" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.year ? `<div class="cert-year" ${_editable(`certifications.${i}.year`)}>${c.year}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</div>
</section>` : '';

	// Achievements
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section id="achievements">
<div class="container">
<div class="section-header reveal"><div class="section-label">Achievements</div><h2 class="section-title">Notable <em>Accomplishments</em></h2></div>
<div class="ach-list">
${v.achievements.map((a, i) => `<div class="ach-item reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
<div class="ach-dot"></div>
<div>
<div class="ach-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="ach-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</div>
</section>` : '';

	// Awards
	const awardsHtml = !hidden.has('awards') && v.awards?.length
		? `<section id="awards">
<div class="container">
<div class="section-header reveal"><div class="section-label">Awards</div><h2 class="section-title">Honors &amp; <em>Recognition</em></h2></div>
<div class="award-grid">
${v.awards.map((a, i) => `<div class="award-card reveal-up" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="awards" data-del-index="${i}">&#x2715;</button>
${a.year ? `<div class="award-year" ${_editable(`awards.${i}.year`)}>${a.year}</div>` : ''}
<div class="award-name" ${_editable(`awards.${i}.title`)}>${a.title}</div>
${a.awarding_body ? `<div class="award-org" ${_editable(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}
</div>`).join('\n')}
</div>
</div>
</section>` : '';

	// Campaigns
	const campaignsHtml = !hidden.has('campaigns') && v.campaigns?.length
		? `<section id="campaigns">
<div class="container">
<div class="section-header reveal"><div class="section-label">Campaigns</div><h2 class="section-title">Marketing <em>Campaigns</em></h2></div>
<div class="camp-grid">
${v.campaigns.map((c, i) => `<div class="camp-card reveal-up" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="campaigns" data-del-index="${i}">&#x2715;</button>
<div class="camp-name" ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</div>
${c.campaign_type ? `<div class="camp-meta" ${_editable(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}
</div>`).join('\n')}
</div>
</div>
</section>` : '';

	// Financial
	const finHtml = !hidden.has('financial_modeling') && v.financial_modeling?.length
		? `<section id="financial_modeling">
<div class="container">
<div class="section-header reveal"><div class="section-label">Finance</div><h2 class="section-title">Financial <em>Expertise</em></h2></div>
<div class="fin-grid">
${v.financial_modeling.map((f, i) => `<div class="fin-card reveal-up" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">&#x2715;</button>
<div class="fin-type" ${_editable(`financial_modeling.${i}.model_type`)}>${f.model_type}</div>
${f.outcome ? `<div class="fin-meta" ${_editable(`financial_modeling.${i}.outcome`)}>${f.outcome}</div>` : ''}
</div>`).join('\n')}
</div>
</div>
</section>` : '';

	// Investment
	const invHtml = !hidden.has('investment_portfolios') && v.investment_portfolios?.length
		? `<section id="investment_portfolios">
<div class="container">
<div class="section-header reveal"><div class="section-label">Investments</div><h2 class="section-title">Investment <em>Portfolio</em></h2></div>
<div class="inv-grid">
${v.investment_portfolios.map((p, i) => `<div class="inv-card reveal-up" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">&#x2715;</button>
<div class="inv-type" ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${p.portfolio_type}</div>
${p.assets_under_management ? `<div class="inv-meta" ${_editable(`investment_portfolios.${i}.assets_under_management`)}>${p.assets_under_management}</div>` : ''}
</div>`).join('\n')}
</div>
</div>
</section>` : '';

	// Contact
	const contactHtml = v.email || v.phone || v.location
		? `<section id="contact">
<div class="container">
<div class="section-header reveal"><div class="section-label">Contact</div><h2 class="section-title">Get In <em>Touch</em></h2></div>
<div class="contact-row">
${v.email ? `<div class="ct-item"><div class="ct-label">Email</div><div class="ct-val" ${_editable('profile.email')}>${v.email}</div></div>` : ''}
${v.phone ? `<div class="ct-item"><div class="ct-label">Phone</div><div class="ct-val" ${_editable('profile.phone')}>${v.phone}</div></div>` : ''}
${v.location ? `<div class="ct-item"><div class="ct-label">Location</div><div class="ct-val" ${_editable('profile.location')}>${v.location}</div></div>` : ''}
</div>
</div>
</section>` : '';

	const sectionMap: Record<string, string> = {
		experience: expHtml, skills: skillsHtml, projects: projectsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		awards: awardsHtml, campaigns: campaignsHtml, financial_modeling: finHtml,
		investment_portfolios: invHtml,
	};

	const orderedSections = order
		.filter((k) => !hidden.has(k) && k in sectionMap)
		.map((k) => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	return `<!DOCTYPE html>
<html lang="en">
<head>
${cspMeta}
${publishStyles}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} - Portfolio</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div id="ng-cur"></div>
<div id="ng-ring"></div>
<div id="ng-sp"></div>
<nav>
<div class="nav-inner">
<div class="nav-logo">${v.name}</div>
<ul class="nav-links">${navItems}</ul>
${v.email ? `<a href="mailto:${v.email}" class="nav-cta">Hire Me</a>` : ''}
<div class="hamburger" id="ng-hb"><span></span><span></span><span></span></div>
</div>
</nav>
<div id="ng-mm">${mobileNavItems}</div>
<section id="hero">
<div class="hero-bg-pattern"></div>
<div class="hero-grid-lines"></div>
<div class="hero-left">
<p class="hero-tag">Portfolio</p>
<h1 class="hero-name" ${_editable('profile.name')}>${v.name}</h1>
${v.headline ? `<p class="hero-title-sub" ${_editable('portfolio.headline')}>${v.headline}</p>` : ''}
${v.bio ? `<p class="hero-desc" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
${socialLinks ? `<div class="hero-links">${socialLinks}</div>` : ''}
${heroStats}
</div>
<div class="hero-right">
<div class="hero-photo-frame">
<div class="hero-photo-inner">${avatarHtml}</div>
${v.headline ? `<div class="hero-badge">${v.headline}</div>` : ''}
</div>
</div>
</section>
${orderedSections}
${contactHtml}
<footer><div class="footer-inner"><p class="footer-copy">&#169; ${v.name}. All rights reserved.</p></div></footer>
${NAVY_GOLD_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
