/**
 * Template: Cosmos
 * Space-themed dark portfolio. Deep space (#020510) background, cyan (#00f5ff),
 * purple (#8b5cf6), pink (#f472b6) accents. Fonts: Orbitron, Exo 2, Space Mono.
 * Features: animated canvas stars, nebula blobs, custom cyan cursor, scroll progress bar,
 *   orbital hero animation, active nav, reveal animations, animated skill bars,
 *   scrolling tech marquee, back-to-top button.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;1,300&family=Space+Mono:wght@400;700&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function yearsExperience(experience: NormalizedData['experience']): number {
	if (!experience?.length) return 0;
	let earliest = new Date().getFullYear();
	for (const exp of experience) {
		const m = (exp.duration || '').match(/\\b(19|20)\\d{2}\\b/);
		if (m) { const y = parseInt(m[0]); if (y < earliest) earliest = y; }
	}
	return Math.max(1, new Date().getFullYear() - earliest);
}

function projThumbGradient(p: NormalizedData['projects'][number]): string {
	const s = [...(p.tech_stack ?? []), ...(p.software_used ?? []), p.project_category ?? ''].join(' ').toLowerCase();
	if (s.match(/react|next|vue|svelte|angular/)) return 'linear-gradient(135deg,rgba(0,245,255,.15),rgba(139,92,246,.15))';
	if (s.match(/python|ai|ml|data/)) return 'linear-gradient(135deg,rgba(244,114,182,.15),rgba(139,92,246,.15))';
	if (s.match(/node|express|api|backend/)) return 'linear-gradient(135deg,rgba(251,191,36,.15),rgba(0,245,255,.1))';
	if (s.match(/design|figma|ui|ux/)) return 'linear-gradient(135deg,rgba(244,114,182,.18),rgba(0,245,255,.1))';
	return 'linear-gradient(135deg,rgba(0,245,255,.1),rgba(139,92,246,.12))';
}

const COSMOS_SCRIPT = `<script>
(function(){
  // ── STARS CANVAS ──
  var canvas=document.getElementById('cs-stars');
  if(canvas){
    var ctx=canvas.getContext('2d'),stars=[];
    function resizeC(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
    function mkStars(){
      stars=[];
      var n=Math.floor(canvas.width*canvas.height/4000);
      for(var i=0;i<n;i++)stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.5+.2,a:Math.random(),sp:Math.random()*.003+.001,off:Math.random()*Math.PI*2});
    }
    function draw(t){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(var s of stars){
        var al=s.a*(.5+.5*Math.sin(t*s.sp+s.off));
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,'+al+')';ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    resizeC();mkStars();requestAnimationFrame(draw);
    window.addEventListener('resize',function(){resizeC();mkStars();});
  }
  // ── CURSOR ──
  var cur=document.getElementById('cs-cur'),ring=document.getElementById('cs-ring');
  if(cur&&ring){
    document.body.style.cursor='none';
    var mx=-200,my=-200,rx=-200,ry=-200;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
    (function animC(){
      cur.style.left=mx+'px';cur.style.top=my+'px';
      rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
      ring.style.left=rx+'px';ring.style.top=ry+'px';
      requestAnimationFrame(animC);
    })();
    document.querySelectorAll('a,button,.project-card,.exp-card,.tl-content').forEach(function(el){
      el.addEventListener('mouseenter',function(){ring.style.transform='translate(-50%,-50%) scale(1.8)';cur.style.transform='translate(-50%,-50%) scale(.5)';});
      el.addEventListener('mouseleave',function(){ring.style.transform='translate(-50%,-50%) scale(1)';cur.style.transform='translate(-50%,-50%) scale(1)';});
    });
  }
  // ── SCROLL PROGRESS + BACK TOP ──
  var sp=document.getElementById('cs-sp'),bt=document.getElementById('cs-bt');
  window.addEventListener('scroll',function(){
    var s=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
    if(sp)sp.style.width=(h>0?s/h*100:0)+'%';
    if(bt)bt.classList.toggle('show',s>400);
    // active nav
    var cur2='';
    document.querySelectorAll('section[id]').forEach(function(sec){if(s>=sec.offsetTop-130)cur2=sec.id;});
    document.querySelectorAll('.nav-links a').forEach(function(a){a.style.color=a.getAttribute('href')==='#'+cur2?'var(--cyan)':'';});
  });
  // ── INTERSECTION OBSERVERS ──
  if('IntersectionObserver'in window){
    // reveal
    var ro=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);}});},{threshold:.12});
    document.querySelectorAll('.reveal,.tl-item,.exp-card,.project-card,.ach-stat-card,.award-item').forEach(function(el){ro.observe(el);});
    // skill bars
    var so=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.querySelectorAll('.skill-fill[data-width]').forEach(function(b){b.style.width=b.getAttribute('data-width')+'%';});so.unobserve(e.target);}
      });
    },{threshold:.3});
    document.querySelectorAll('#skills').forEach(function(el){so.observe(el);});
  }
  // ── STAGGER DELAYS ──
  document.querySelectorAll('.exp-card').forEach(function(el,i){el.style.transitionDelay=(i*.1)+'s';});
  document.querySelectorAll('.project-card').forEach(function(el,i){el.style.transitionDelay=(i*.08)+'s';});
  document.querySelectorAll('.ach-stat-card').forEach(function(el,i){el.style.transitionDelay=(i*.1)+'s';});
  document.querySelectorAll('.award-item').forEach(function(el,i){el.style.transitionDelay=(i*.08)+'s';});
  document.querySelectorAll('.tl-item').forEach(function(el,i){el.style.transitionDelay=(i*.15)+'s';});
  // ── HAMBURGER ──
  var hb=document.getElementById('cs-hb'),nl=document.getElementById('cs-nl');
  if(hb&&nl)hb.addEventListener('click',function(){nl.classList.toggle('open');hb.classList.toggle('open');});
})();
<\/script>`;

function css(): string {
	return `
/* Cosmos Template — deep space #020510, cyan #00f5ff, purple #8b5cf6 */
:root{
  --bg:#020510;--bg2:#060d1f;--cyan:#00f5ff;--purple:#8b5cf6;--pink:#f472b6;
  --gold:#fbbf24;--text:#e2e8f0;--muted:#64748b;--card:rgba(255,255,255,.03);
  --border:rgba(0,245,255,.12);--glow-c:0 0 20px rgba(0,245,255,.35);--glow-p:0 0 20px rgba(139,92,246,.35);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'Exo 2',sans-serif;font-weight:300;background:var(--bg);color:var(--text);overflow-x:hidden;line-height:1.6}
a{text-decoration:none;color:var(--cyan)}img{max-width:100%;display:block}ul{list-style:none}

/* Cursor */
#cs-cur{position:fixed;width:12px;height:12px;background:var(--cyan);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:transform .1s}
#cs-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(0,245,255,.5);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:transform .12s}

/* Canvas stars */
#cs-stars{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}

/* Nebula blobs */
.nebula{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0}
.n1{width:600px;height:600px;background:rgba(139,92,246,.07);top:-100px;left:-100px}
.n2{width:500px;height:500px;background:rgba(0,245,255,.05);bottom:10%;right:-100px}
.n3{width:400px;height:400px;background:rgba(244,114,182,.06);top:40%;left:30%}

/* Scroll progress */
#cs-sp{position:fixed;top:0;left:0;height:2px;width:0;background:linear-gradient(90deg,var(--cyan),var(--purple),var(--pink));z-index:9997;box-shadow:0 0 10px rgba(0,245,255,.5);transition:width .1s}

/* Back to top */
#cs-bt{position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;border:1px solid var(--border);background:rgba(2,5,16,.8);display:flex;align-items:center;justify-content:center;color:var(--cyan);cursor:pointer;z-index:900;font-size:1.2rem;transition:all .3s;opacity:0;pointer-events:none;backdrop-filter:blur(10px);text-decoration:none}
#cs-bt.show{opacity:1;pointer-events:all}
#cs-bt:hover{border-color:var(--cyan);box-shadow:var(--glow-c)}

/* Nav */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:18px 5%;background:rgba(2,5,16,.7);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);transition:all .3s}
.nav-logo{font-family:'Orbitron',sans-serif;font-weight:700;font-size:1.2rem;color:var(--cyan);text-decoration:none;letter-spacing:.1em;text-shadow:var(--glow-c)}
.nav-logo span{color:var(--purple)}
.nav-links{display:flex;gap:2rem;list-style:none}
.nav-links a{color:var(--muted);text-decoration:none;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;font-family:'Space Mono',monospace;transition:color .3s;position:relative}
.nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:var(--cyan);transform:scaleX(0);transition:transform .3s}
.nav-links a:hover{color:var(--cyan)}
.nav-links a:hover::after{transform:scaleX(1)}
.nav-cta{padding:8px 20px;border:1px solid var(--cyan);color:var(--cyan);text-decoration:none;font-family:'Space Mono',monospace;font-size:.75rem;letter-spacing:.1em;transition:all .3s}
.nav-cta:hover{background:var(--cyan);color:var(--bg);box-shadow:var(--glow-c)}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer}
.hamburger span{width:24px;height:2px;background:var(--cyan);transition:all .3s}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

/* Sections */
section{position:relative;z-index:1}
.section-wrap{padding:100px 5%;max-width:1400px;margin:0 auto}
.sw-inner{max-width:1200px;margin:0 auto}
.section-label{display:inline-flex;align-items:center;gap:10px;font-family:'Space Mono',monospace;font-size:.75rem;color:var(--cyan);letter-spacing:.2em;text-transform:uppercase;margin-bottom:1rem}
.section-label::before,.section-label::after{content:'';display:block;width:30px;height:1px;background:var(--cyan)}
.section-title{font-family:'Orbitron',sans-serif;font-size:clamp(2rem,4vw,3rem);font-weight:700;line-height:1.1;margin-bottom:1rem}
.section-title span{background:linear-gradient(90deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.section-desc{color:var(--muted);max-width:600px;line-height:1.7;margin-bottom:3rem}

/* Hero */
#hero{min-height:100vh;display:flex;align-items:center;padding:120px 5% 80px;overflow:hidden}
.hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;width:100%;max-width:1200px;margin:0 auto}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border:1px solid var(--border);background:rgba(0,245,255,.05);font-family:'Space Mono',monospace;font-size:.7rem;color:var(--cyan);letter-spacing:.15em;text-transform:uppercase;margin-bottom:1.5rem;animation:fadeDown .8s ease both}
.hero-badge::before{content:'\\25C6';font-size:.6rem}
.hero-name{font-family:'Orbitron',sans-serif;font-size:clamp(2.2rem,5vw,4rem);font-weight:900;line-height:1.05;letter-spacing:-.01em;animation:fadeUp .9s .1s ease both}
.hero-name .line1{display:block;color:var(--text)}
.hero-name .line2{display:block;background:linear-gradient(90deg,var(--cyan),var(--purple),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:.85em}
.hero-sub{margin-top:1.5rem;font-size:1rem;color:var(--muted);line-height:1.7;max-width:500px;animation:fadeUp .9s .2s ease both}
.hero-btns{margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;animation:fadeUp .9s .3s ease both}
.btn-primary{padding:14px 32px;background:linear-gradient(135deg,var(--cyan),var(--purple));color:var(--bg);font-family:'Space Mono',monospace;font-size:.8rem;font-weight:700;letter-spacing:.08em;border:none;cursor:pointer;text-decoration:none;transition:all .3s;position:relative;overflow:hidden}
.btn-primary::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.2);transform:translateX(-100%);transition:transform .3s}
.btn-primary:hover::after{transform:translateX(0)}
.btn-primary:hover{box-shadow:0 0 40px rgba(0,245,255,.4);transform:translateY(-2px);color:var(--bg)}
.btn-outline{padding:14px 32px;border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:.8rem;letter-spacing:.08em;background:transparent;cursor:pointer;text-decoration:none;transition:all .3s}
.btn-outline:hover{border-color:var(--purple);color:var(--purple);box-shadow:var(--glow-p)}

/* Hero visual — orbit */
.hero-visual{display:flex;justify-content:center;align-items:center;position:relative;flex-direction:column;gap:2rem;animation:fadeIn 1.2s .4s ease both}
.orbit-container{position:relative;width:340px;height:340px}
.planet-core{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:120px;height:120px;background:radial-gradient(circle at 35% 35%,var(--cyan),var(--purple) 60%,var(--bg) 100%);border-radius:50%;box-shadow:0 0 60px rgba(0,245,255,.4),0 0 120px rgba(139,92,246,.2);animation:float 6s ease-in-out infinite;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-size:1.8rem;font-weight:900;color:rgba(2,5,16,.8)}
.planet-ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotateX(70deg);width:190px;height:190px;border:2px solid rgba(0,245,255,.3);border-radius:50%}
.orbit-1,.orbit-2,.orbit-3{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:1px dashed rgba(255,255,255,.06);border-radius:50%}
.orbit-1{width:200px;height:200px;animation:orbitSpin 10s linear infinite}
.orbit-2{width:270px;height:270px;animation:orbitSpin 16s linear infinite reverse}
.orbit-3{width:335px;height:335px;animation:orbitSpin 24s linear infinite}
.dot{position:absolute;border-radius:50%;top:-4px;left:50%;transform:translateX(-50%)}
.orbit-1 .dot{width:8px;height:8px;background:var(--cyan);box-shadow:var(--glow-c)}
.orbit-2 .dot{width:10px;height:10px;background:var(--pink);box-shadow:0 0 15px rgba(244,114,182,.6)}
.orbit-3 .dot{width:6px;height:6px;background:var(--gold);box-shadow:0 0 15px rgba(251,191,36,.6)}
.stat-chips{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.stat-chip{padding:8px 16px;background:rgba(255,255,255,.04);border:1px solid var(--border);backdrop-filter:blur(10px);font-family:'Space Mono',monospace;font-size:.7rem;text-align:center;white-space:nowrap}
.stat-chip strong{display:block;color:var(--cyan);font-size:1.1rem}

/* About */
#about{background:linear-gradient(180deg,transparent,rgba(139,92,246,.03) 50%,transparent)}
.about-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:5rem;align-items:center}
.about-img-frame{width:100%;aspect-ratio:1;max-width:320px;background:linear-gradient(135deg,rgba(0,245,255,.1),rgba(139,92,246,.1));border:1px solid var(--border);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.about-img-frame::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(0,245,255,.03) 30px,rgba(0,245,255,.03) 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(0,245,255,.03) 30px,rgba(0,245,255,.03) 31px)}
.about-corner{position:absolute;width:20px;height:20px;border-color:var(--cyan);border-style:solid}
.about-corner.tl{top:-1px;left:-1px;border-width:2px 0 0 2px}
.about-corner.tr{top:-1px;right:-1px;border-width:2px 2px 0 0}
.about-corner.bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px}
.about-corner.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
.about-avatar{width:120px;height:120px;background:radial-gradient(circle at 40% 35%,var(--cyan),var(--purple));border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-size:2.5rem;font-weight:700;color:var(--bg);box-shadow:0 0 60px rgba(0,245,255,.3)}
.about-text h3{font-family:'Orbitron',sans-serif;font-size:.95rem;color:var(--cyan);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.5rem}
.about-text p{color:var(--muted);line-height:1.8;margin-bottom:1.2rem;font-size:.95rem}
.about-tags{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.5rem}
.about-tag{padding:5px 14px;border:1px solid var(--border);font-family:'Space Mono',monospace;font-size:.7rem;color:var(--muted);letter-spacing:.05em;transition:all .3s}
.about-tag:hover{border-color:var(--cyan);color:var(--cyan)}

/* Experience */
#experience{}
.exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.exp-card{padding:2rem;background:var(--card);border:1px solid var(--border);position:relative;overflow:hidden;opacity:0;transform:translateY(30px);transition:opacity .5s ease,transform .5s ease,border-color .3s,box-shadow .3s}
.exp-card.visible{opacity:1;transform:translateY(0)}
.exp-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:linear-gradient(180deg,var(--cyan),var(--purple));transition:height .4s ease}
.exp-card:hover::before{height:100%}
.exp-card:hover{border-color:rgba(0,245,255,.25);box-shadow:var(--glow-c)}
.exp-icon{width:44px;height:44px;margin-bottom:1rem;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;color:var(--cyan)}
.exp-role{font-family:'Orbitron',sans-serif;font-size:.9rem;font-weight:600;margin-bottom:.3rem}
.exp-company{color:var(--cyan);font-size:.85rem;margin-bottom:.2rem}
.exp-period{color:var(--muted);font-family:'Space Mono',monospace;font-size:.7rem;margin-bottom:1rem}
.exp-bullets{list-style:none}
.exp-bullets li{color:var(--muted);font-size:.85rem;line-height:1.7;padding-left:1rem;position:relative;margin-bottom:.3rem}
.exp-bullets li::before{content:'\\25B8';position:absolute;left:0;color:var(--cyan)}
.add-btn{display:block;margin-top:14px;padding:9px 16px;border:2px dashed var(--border);background:rgba(0,245,255,.03);color:var(--cyan);font-family:'Space Mono',monospace;font-size:.8rem;cursor:pointer;width:100%;text-align:center;transition:background .2s}
.add-btn:hover{background:rgba(0,245,255,.06)}

/* Education timeline */
#education{}
.tl{position:relative;max-width:800px}
.tl::before{content:'';position:absolute;left:22px;top:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent,var(--border),transparent)}
.tl-item{display:flex;gap:2rem;margin-bottom:3rem;position:relative;opacity:0;transform:translateX(-30px);transition:all .6s ease}
.tl-item.visible{opacity:1;transform:translateX(0)}
.tl-dot{flex-shrink:0;width:44px;height:44px;border:2px solid var(--cyan);border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--bg);color:var(--cyan);font-size:1rem;position:relative;z-index:1;box-shadow:var(--glow-c)}
.tl-content{flex:1;padding:1.5rem;background:var(--card);border:1px solid var(--border);transition:all .3s}
.tl-content:hover{border-color:rgba(0,245,255,.3);box-shadow:var(--glow-c)}
.tl-meta{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem;flex-wrap:wrap;gap:.5rem}
.tl-title{font-family:'Orbitron',sans-serif;font-size:.95rem;font-weight:600}
.tl-date{font-family:'Space Mono',monospace;font-size:.7rem;color:var(--cyan);padding:3px 10px;border:1px solid var(--border)}
.tl-place{color:var(--purple);font-size:.85rem;margin-bottom:.5rem}
.tl-desc{color:var(--muted);font-size:.85rem;line-height:1.7}

/* Projects */
#projects{background:linear-gradient(180deg,transparent,rgba(0,245,255,.02) 50%,transparent)}
.proj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.project-card{background:var(--card);border:1px solid var(--border);overflow:hidden;position:relative;opacity:0;transform:translateY(40px);transition:opacity .6s ease,transform .6s ease,border-color .3s,box-shadow .3s}
.project-card.visible{opacity:1;transform:translateY(0)}
.project-card:hover{border-color:rgba(0,245,255,.3);box-shadow:0 20px 60px rgba(0,0,0,.4);transform:translateY(-6px)}
.proj-thumb{height:160px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.proj-thumb-bg{position:absolute;inset:0;z-index:1}
.proj-thumb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.proj-thumb-img+.proj-thumb-bg{background:linear-gradient(to bottom,transparent 40%,rgba(2,5,16,.65));opacity:1}
.proj-thumb-icon{font-size:2.5rem;position:relative;z-index:2;font-family:'Orbitron',sans-serif;font-weight:900;color:rgba(255,255,255,.5)}
.proj-body{padding:1.25rem}
.proj-category{font-family:'Space Mono',monospace;font-size:.65rem;color:var(--purple);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.4rem}
.proj-name{font-family:'Orbitron',sans-serif;font-size:.9rem;font-weight:600;margin-bottom:.4rem}
.proj-desc{color:var(--muted);font-size:.82rem;line-height:1.6;margin-bottom:.5rem}
.proj-stack{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}
.stack-pill{padding:3px 10px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);font-size:.65rem;font-family:'Space Mono',monospace;color:var(--purple)}
.proj-links{display:flex;gap:.8rem}
.proj-link{font-family:'Space Mono',monospace;font-size:.7rem;color:var(--cyan);text-decoration:none;letter-spacing:.05em;display:flex;align-items:center;gap:4px;transition:all .3s}
.proj-link:hover{text-shadow:var(--glow-c)}

/* Skills */
#skills{background:linear-gradient(180deg,transparent,rgba(139,92,246,.03) 50%,transparent)}
.skills-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:3rem}
.skill-cat-title{font-family:'Orbitron',sans-serif;font-size:.85rem;color:var(--cyan);letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem;padding-bottom:.5rem;border-bottom:1px solid var(--border)}
.skill-item{margin-bottom:1.2rem}
.skill-header{display:flex;justify-content:space-between;margin-bottom:.4rem}
.skill-name{font-size:.9rem;letter-spacing:.02em}
.skill-pct{font-family:'Space Mono',monospace;font-size:.75rem;color:var(--cyan)}
.skill-bar{height:4px;background:rgba(255,255,255,.06);position:relative;overflow:hidden}
.skill-fill{position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));width:0;transition:width 1.2s ease;box-shadow:0 0 10px rgba(0,245,255,.5)}
/* Tech marquee */
.tech-wrap{margin-top:3rem}
.tech-scroll-title{font-family:'Orbitron',sans-serif;font-size:.85rem;color:var(--cyan);letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.2rem}
.tech-scroll{overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,black 10%,black 90%,transparent)}
.tech-track{display:flex;gap:1rem;animation:scrollLeft 30s linear infinite;width:max-content}
.tech-track:hover{animation-play-state:paused}
.tech-chip{flex-shrink:0;padding:10px 18px;background:var(--card);border:1px solid var(--border);font-family:'Space Mono',monospace;font-size:.75rem;color:var(--muted);white-space:nowrap;transition:all .3s}
.tech-chip:hover{border-color:var(--cyan);color:var(--cyan)}

/* Achievements */
#achievements{}
.ach-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-bottom:3rem}
.ach-stat-card{padding:2rem;background:var(--card);border:1px solid var(--border);text-align:center;opacity:0;transform:scale(.9);transition:opacity .5s ease,transform .5s ease,border-color .3s}
.ach-stat-card.visible{opacity:1;transform:scale(1)}
.ach-stat-card:hover{border-color:rgba(0,245,255,.3)}
.ach-num{font-family:'Orbitron',sans-serif;font-size:2.2rem;font-weight:900;background:linear-gradient(135deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ach-label{color:var(--muted);font-size:.8rem;margin-top:.3rem;letter-spacing:.05em}
.awards-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.award-item{display:flex;gap:1rem;padding:1.2rem;background:var(--card);border:1px solid var(--border);align-items:flex-start;transition:all .3s;opacity:0;transform:translateX(-20px);transition:opacity .5s ease,transform .5s ease,border-color .3s}
.award-item.visible{opacity:1;transform:translateX(0)}
.award-item:hover{border-color:rgba(251,191,36,.3)}
.award-icon{font-size:1.4rem;flex-shrink:0}
.award-name{font-family:'Orbitron',sans-serif;font-size:.82rem;margin-bottom:.2rem}
.award-org{color:var(--gold);font-size:.78rem;margin-bottom:.2rem}
.award-year{color:var(--muted);font-family:'Space Mono',monospace;font-size:.7rem}

/* Certifications */
#certifications{}
.cert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
.cert-card{display:flex;align-items:flex-start;gap:12px;background:var(--card);border:1px solid var(--border);padding:1.2rem;transition:all .3s}
.cert-card:hover{border-color:var(--cyan)}
.cert-ico{width:36px;height:36px;flex-shrink:0;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);display:flex;align-items:center;justify-content:center;font-size:.9rem;color:var(--cyan)}
.cert-name{font-size:.88rem;font-weight:600;color:var(--text);margin-bottom:4px}
.cert-issuer{font-size:.78rem;color:var(--cyan);margin-bottom:2px}
.cert-year{font-size:.72rem;color:var(--muted);font-family:'Space Mono',monospace}

/* Contact */
#contact{}
.contact-wrap{display:grid;grid-template-columns:1fr 1.5fr;gap:4rem}
.contact-info-title{font-family:'Orbitron',sans-serif;font-size:.95rem;color:var(--cyan);margin-bottom:1rem}
.contact-info p{color:var(--muted);line-height:1.7;margin-bottom:2rem;font-size:.88rem}
.contact-detail{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding:.8rem;background:var(--card);border:1px solid var(--border);transition:all .3s}
.contact-detail:hover{border-color:var(--cyan)}
.contact-detail-icon{font-size:1rem;color:var(--cyan);flex-shrink:0}
.contact-detail-text{font-family:'Space Mono',monospace;font-size:.78rem;color:var(--muted)}
.contact-links-row{display:flex;gap:.8rem;margin-top:1.5rem}
.social-link{width:40px;height:40px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:1rem;transition:all .3s}
.social-link:hover{border-color:var(--cyan);color:var(--cyan);box-shadow:var(--glow-c)}
.contact-info-cards{display:flex;flex-direction:column;gap:1rem}
.contact-card-item{padding:1.5rem;background:var(--card);border:1px solid var(--border)}
.contact-card-label{font-family:'Space Mono',monospace;font-size:.65rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:.4rem}
.contact-card-val{font-size:.9rem;color:var(--text)}

/* Footer */
footer{padding:2rem 5%;text-align:center;border-top:1px solid var(--border);color:var(--muted);font-family:'Space Mono',monospace;font-size:.72rem;letter-spacing:.08em;position:relative;z-index:1}
footer span{color:var(--cyan)}

/* Inline editing */
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;border:none;background:rgba(239,68,68,.15);color:#ef4444;font-size:13px;line-height:22px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

/* Keyframes */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-14px)}}
@keyframes orbitSpin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes scrollLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* Responsive */
@media(max-width:1024px){.proj-grid{grid-template-columns:repeat(2,1fr)}.ach-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.hero-inner{grid-template-columns:1fr;text-align:center}.hero-visual{display:none}.about-grid{grid-template-columns:1fr}.exp-grid{grid-template-columns:1fr}.proj-grid{grid-template-columns:1fr}.ach-grid{grid-template-columns:repeat(2,1fr)}.awards-grid{grid-template-columns:1fr}.skills-grid{grid-template-columns:1fr}.contact-wrap{grid-template-columns:1fr}.nav-links{display:none!important}.hamburger{display:flex}}
@media(max-width:768px){.nav-links.open{display:flex!important;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:rgba(6,13,31,.98);padding:1.5rem;border-bottom:1px solid var(--border)}}
`;
}

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const NAV_LABELS: Record<string, string> = {
		experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements',
		awards: 'Awards', campaigns: 'Campaigns', financial_modeling: 'Finance',
		investment_portfolios: 'Investments',
	};

	const navAnchors: [string, string][] = [];
	if (v.bio || v.location || v.email || v.phone) navAnchors.push(['about', 'About']);
	for (const key of order) {
		if (!hidden.has(key) && key in NAV_LABELS) {
			const dk = key === 'skills' ? 'skill_groups' : key;
			const d = (v as Record<string, unknown>)[dk];
			if (d && (Array.isArray(d) ? d.length > 0 : Boolean(d))) navAnchors.push([key, NAV_LABELS[key]]);
		}
	}
	const navItems = navAnchors.map(([a, l]) => `<li><a href="#${a}">${l}</a></li>`).join('');

	const inits = initials(v.name);
	const nameParts = v.name.split(' ');
	const lastName = nameParts.slice(1).join(' ') || nameParts[0];
	const firstName = nameParts[0];

	// Hero stats
	const yrs = yearsExperience(v.experience);
	const projCount = v.projects?.length ?? 0;
	const certCount = v.certifications?.length ?? 0;
	const statChips = [
		yrs > 0 ? `<div class="stat-chip"><strong>${yrs}+</strong>Years Exp</div>` : '',
		projCount > 0 ? `<div class="stat-chip"><strong>${projCount}+</strong>Projects</div>` : '',
		certCount > 0 ? `<div class="stat-chip"><strong>${certCount}</strong>Certs</div>` : '',
	].filter(Boolean).join('');

	// About tags — all unique skills flattened
	const allSkills = [...new Set(v.skill_groups?.flatMap((g) => g.skills) ?? [])].slice(0, 10);
	const aboutTagsHtml = allSkills.length
		? `<div class="about-tags">${allSkills.map((s) => `<span class="about-tag">${s}</span>`).join('')}</div>` : '';

	// About section
	const aboutHtml = v.bio || v.email || v.phone || v.location
		? `<section id="about">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">About Me</div>
<h2 class="section-title">The Developer<br/><span>Behind the Code</span></h2>
<div class="about-grid">
<div>
<div class="about-img-frame">
<div class="about-corner tl"></div><div class="about-corner tr"></div>
<div class="about-corner bl"></div><div class="about-corner br"></div>
<div class="about-avatar">${inits}</div>
</div>
</div>
<div class="about-text">
${v.bio ? `<p ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
${v.location ? `<p>&#128205; ${v.location}</p>` : ''}
${aboutTagsHtml}
</div>
</div>
</div></div>
</section>` : '';

	// Experience — grid cards
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Experience</div>
<h2 class="section-title">Professional <span>Orbit</span></h2>
<div class="exp-grid">
${v.experience.map((exp, i) => {
	const roleInitial = (exp.role[0] ?? 'E').toUpperCase();
	return `<div class="exp-card" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
<div class="exp-icon">${roleInitial}</div>
<div class="exp-role" ${_editable(`experience.${i}.role`)}>${exp.role}</div>
${exp.company ? `<div class="exp-company" ${_editable(`experience.${i}.company`)}>${exp.company}</div>` : ''}
${exp.duration ? `<div class="exp-period" ${_editable(`experience.${i}.duration`)}>${exp.duration}</div>` : ''}
${exp.description ? `<ul class="exp-bullets"><li ${_editable(`experience.${i}.description`, true)}>${exp.description}</li></ul>` : ''}
${exp.key_points?.length ? `<ul class="exp-bullets" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>`;
}).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</div></div>
</section>` : '';

	// Education — timeline
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section id="education">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Education</div>
<h2 class="section-title">Academic <span>Trajectory</span></h2>
<div class="tl">
${v.education.map((edu, i) => `<div class="tl-item" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
<div class="tl-dot">&#127891;</div>
<div class="tl-content">
<div class="tl-meta">
<span class="tl-title" ${_editable(`education.${i}.degree`)}>${[edu.degree, edu.field_of_study].filter(Boolean).join(' in ')}</span>
${edu.year_range ? `<span class="tl-date" ${_editable(`education.${i}.year_range`)}>${edu.year_range}</span>` : ''}
</div>
${edu.institution ? `<div class="tl-place" ${_editable(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
${edu.grade_or_score ? `<div class="tl-desc" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</div></div>
</section>` : '';

	// Projects
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section id="projects">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Projects</div>
<h2 class="section-title">Mission <span>Launches</span></h2>
<div class="proj-grid">
${v.projects.map((p, i) => {
	const techs = (p.tech_stack?.length ? p.tech_stack : p.software_used ?? []);
	const url = p.project_url || p.github_repo;
	const bg = projThumbGradient(p);
	const iconInitial = (p.title[0] ?? 'P').toUpperCase();
	const thumbImg = p.images?.[0];
	const respHtml = p.responsibilities?.length
		? `<ul class="exp-bullets" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.slice(0, 3).map(r => `<li>${r}</li>`).join('')}</ul>`
		: '';
	return `<div class="project-card" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
<div class="proj-thumb">
${thumbImg ? `<img class="proj-thumb-img" src="${thumbImg}" alt="${p.title}">` : ''}
<div class="proj-thumb-bg" style="background:${bg}"></div>
${thumbImg ? '' : `<div class="proj-thumb-icon">${iconInitial}</div>`}
</div>
<div class="proj-body">
${p.project_category ? `<div class="proj-category">${p.project_category}</div>` : ''}
<div class="proj-name" ${_editable(`projects.${i}.title`)}>${p.title}</div>
${p.description ? `<div class="proj-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</div>` : ''}
${respHtml}
${techs.length ? `<div class="proj-stack" ${_listEditable(`projects.${i}.tech_stack`)}>${techs.map((t) => `<span class="stack-pill">${t}</span>`).join('')}</div>` : ''}
${url ? `<div class="proj-links"><a href="${url}" class="proj-link" target="_blank" rel="noopener noreferrer">&#8599; Live</a></div>` : ''}
</div>
</div>`;
}).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</div></div>
</section>` : '';

	// Skills — bars + tech marquee
	const allTechs = [...new Set(v.skill_groups?.flatMap((g) => g.skills) ?? [])];
	const techChipsHtml = allTechs.length
		? `<div class="tech-wrap">
<div class="tech-scroll-title">Tech Stack</div>
<div class="tech-scroll">
<div class="tech-track">${[...allTechs, ...allTechs].map((t) => `<div class="tech-chip">${t}</div>`).join('')}</div>
</div>
</div>` : '';

	const skillsHtml = !hidden.has('skills') && v.skill_groups?.length
		? `<section id="skills">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Skills</div>
<h2 class="section-title">Technical <span>Arsenal</span></h2>
<div class="skills-grid">
${v.skill_groups.map((g, i) => {
	const pcts = [95, 90, 88, 85, 82, 78, 75, 72].slice(0, g.skills.length);
	return `<div data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${i}">&#x2715;</button>
<div class="skill-cat-title" ${_editable(`skills.${i}.category`)}>${g.category}</div>
${g.skills.map((s, si) => `<div class="skill-item">
<div class="skill-header"><span class="skill-name">${s}</span><span class="skill-pct">${pcts[si] ?? 65}%</span></div>
<div class="skill-bar"><div class="skill-fill" data-width="${pcts[si] ?? 65}" style="width:0"></div></div>
</div>`).join('')}
</div>`;
}).join('\n')}
</div>
${techChipsHtml}
<button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
</div></div>
</section>` : '';

	// Achievements — stat cards + awards list
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section id="achievements">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Achievements</div>
<h2 class="section-title">Mission <span>Milestones</span></h2>
${yrs > 0 || projCount > 0 || certCount > 0 ? `<div class="ach-grid">
${yrs > 0 ? `<div class="ach-stat-card"><div class="ach-num">${yrs}+</div><div class="ach-label">Years Experience</div></div>` : ''}
${projCount > 0 ? `<div class="ach-stat-card"><div class="ach-num">${projCount}+</div><div class="ach-label">Projects Shipped</div></div>` : ''}
${certCount > 0 ? `<div class="ach-stat-card"><div class="ach-num">${certCount}</div><div class="ach-label">Certifications</div></div>` : ''}
<div class="ach-stat-card"><div class="ach-num">${v.achievements.length}</div><div class="ach-label">Achievements</div></div>
</div>` : ''}
<div class="awards-grid">
${v.achievements.map((a, i) => `<div class="award-item" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
<div class="award-icon">&#11088;</div>
<div>
<div class="award-name" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="tl-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</div></div>
</section>` : '';

	// Awards
	const awardsHtml = !hidden.has('awards') && v.awards?.length
		? `<section id="awards">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Awards</div>
<h2 class="section-title">Honors &amp; <span>Recognition</span></h2>
<div class="awards-grid">
${v.awards.map((a, i) => `<div class="award-item" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="awards" data-del-index="${i}">&#x2715;</button>
<div class="award-icon">&#127942;</div>
<div>
<div class="award-name" ${_editable(`awards.${i}.title`)}>${a.title}</div>
${a.awarding_body ? `<div class="award-org" ${_editable(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}
${a.year ? `<div class="award-year" ${_editable(`awards.${i}.year`)}>${a.year}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="awards">+ Add Award</button>
</div></div>
</section>` : '';

	// Certifications
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section id="certifications">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Certifications</div>
<h2 class="section-title">Professional <span>Credentials</span></h2>
<div class="cert-grid">
${v.certifications.map((c, i) => `<div class="cert-card" data-item-wrap>
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
</div></div>
</section>` : '';

	// Campaigns
	const campaignsHtml = !hidden.has('campaigns') && v.campaigns?.length
		? `<section id="campaigns">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Campaigns</div>
<h2 class="section-title">Marketing <span>Campaigns</span></h2>
<div class="cert-grid">
${v.campaigns.map((c, i) => `<div class="cert-card" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="campaigns" data-del-index="${i}">&#x2715;</button>
<div class="cert-ico">&#128200;</div>
<div>
<div class="cert-name" ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</div>
${c.campaign_type ? `<div class="cert-issuer" ${_editable(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
</div></div>
</section>` : '';

	// Financial
	const finHtml = !hidden.has('financial_modeling') && v.financial_modeling?.length
		? `<section id="financial_modeling">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Finance</div>
<h2 class="section-title">Financial <span>Expertise</span></h2>
<div class="cert-grid">
${v.financial_modeling.map((f, i) => `<div class="cert-card" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">&#x2715;</button>
<div class="cert-ico">&#128200;</div>
<div>
<div class="cert-name" ${_editable(`financial_modeling.${i}.model_type`)}>${f.model_type}</div>
${f.outcome ? `<div class="cert-issuer" ${_editable(`financial_modeling.${i}.outcome`)}>${f.outcome}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
</div></div>
</section>` : '';

	// Investment
	const invHtml = !hidden.has('investment_portfolios') && v.investment_portfolios?.length
		? `<section id="investment_portfolios">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Investments</div>
<h2 class="section-title">Investment <span>Portfolio</span></h2>
<div class="cert-grid">
${v.investment_portfolios.map((p, i) => `<div class="cert-card" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">&#x2715;</button>
<div class="cert-ico">&#128181;</div>
<div>
<div class="cert-name" ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${p.portfolio_type}</div>
${p.assets_under_management ? `<div class="cert-issuer" ${_editable(`investment_portfolios.${i}.assets_under_management`)}>${p.assets_under_management}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
</div></div>
</section>` : '';

	// Contact
	const contactHtml = v.email || v.phone || v.location
		? `<section id="contact">
<div class="section-wrap"><div class="sw-inner">
<div class="section-label">Contact</div>
<h2 class="section-title">Open <span>For Mission</span></h2>
<div class="contact-wrap">
<div class="contact-info">
<div class="contact-info-title">Get In Touch</div>
<p>Open to new opportunities, collaborations, and interesting conversations about technology.</p>
${v.email ? `<div class="contact-detail"><span class="contact-detail-icon">&#128231;</span><span class="contact-detail-text" ${_editable('profile.email')}>${v.email}</span></div>` : ''}
${v.phone ? `<div class="contact-detail"><span class="contact-detail-icon">&#128222;</span><span class="contact-detail-text" ${_editable('profile.phone')}>${v.phone}</span></div>` : ''}
${v.location ? `<div class="contact-detail"><span class="contact-detail-icon">&#128205;</span><span class="contact-detail-text" ${_editable('profile.location')}>${v.location}</span></div>` : ''}
<div class="contact-links-row">
${v.linkedin_url ? `<a href="${v.linkedin_url}" class="social-link" target="_blank" rel="noopener noreferrer">in</a>` : ''}
${v.github_url ? `<a href="${v.github_url}" class="social-link" target="_blank" rel="noopener noreferrer">&#60;/&#62;</a>` : ''}
</div>
</div>
<div class="contact-info-cards">
${v.email ? `<div class="contact-card-item"><div class="contact-card-label">Email</div><div class="contact-card-val">${v.email}</div></div>` : ''}
${v.location ? `<div class="contact-card-item"><div class="contact-card-label">Location</div><div class="contact-card-val">${v.location}</div></div>` : ''}
${v.headline ? `<div class="contact-card-item"><div class="contact-card-label">Role</div><div class="contact-card-val">${v.headline}</div></div>` : ''}
</div>
</div>
</div></div>
</section>` : '';

	const sectionMap: Record<string, string> = {
		experience: expHtml, skills: skillsHtml, projects: projectsHtml,
		education: educationHtml, certifications: certsHtml,
		achievements: achievementsHtml, awards: awardsHtml,
		campaigns: campaignsHtml, financial_modeling: finHtml,
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
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} | Portfolio</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<canvas id="cs-stars"></canvas>
<div class="nebula n1"></div>
<div class="nebula n2"></div>
<div class="nebula n3"></div>
<div id="cs-cur"></div>
<div id="cs-ring"></div>
<div id="cs-sp"></div>
<a id="cs-bt" onclick="scrollTo({top:0,behavior:'smooth'})">&#8593;</a>
<nav>
<a href="#hero" class="nav-logo">${firstName}<span>.</span>${lastName}</a>
<ul class="nav-links" id="cs-nl">${navItems}</ul>
${v.email ? `<a href="mailto:${v.email}" class="nav-cta">Hire Me</a>` : ''}
<div class="hamburger" id="cs-hb"><span></span><span></span><span></span></div>
</nav>
<section id="hero">
<div class="hero-inner">
<div>
<div class="hero-badge">${v.headline || 'Software Engineer'}</div>
<h1 class="hero-name">
<span class="line1">${firstName}</span>
<span class="line2">${lastName || firstName}</span>
</h1>
${v.bio ? `<p class="hero-sub" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="hero-btns">
${v.projects?.length ? `<a href="#projects" class="btn-primary">View Projects &#8599;</a>` : ''}
${v.email ? `<a href="mailto:${v.email}" class="btn-outline">Let&apos;s Talk</a>` : ''}
</div>
</div>
<div class="hero-visual">
<div class="orbit-container">
<div class="orbit-1"><div class="dot"></div></div>
<div class="orbit-2"><div class="dot"></div></div>
<div class="orbit-3"><div class="dot"></div></div>
<div class="planet-core">${inits}</div>
<div class="planet-ring"></div>
</div>
${statChips ? `<div class="stat-chips">${statChips}</div>` : ''}
</div>
</div>
</section>
${aboutHtml}
${orderedSections}
${contactHtml}
<footer>
<p>&#169; <span>${v.name}</span> ${new Date().getFullYear()} &middot; All rights reserved</p>
</footer>
${COSMOS_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
