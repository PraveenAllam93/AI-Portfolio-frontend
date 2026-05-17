/**
 * Template: Circuit
 * Dark-tech theme (navy #0a0d14, cyan #00d4ff) with dark/light toggle.
 * Features: scroll progress bar, active-nav tracking, dark/light theme toggle,
 * circuit SVG background, hexagon avatar with floating stat bubbles,
 * fade-in on scroll, animated project banners, hamburger mobile menu.
 * Fonts: Rajdhani · DM Sans · JetBrains Mono.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap';

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

type Project = NormalizedData['projects'] extends (infer T)[] ? T : never;

function bannerGradient(p: Project): string {
	const stack = [...(p.tech_stack ?? []), ...(p.software_used ?? [])].join(' ').toLowerCase();
	const cat = (p.project_category ?? '').toLowerCase();
	if (stack.includes('react') || stack.includes('vue') || stack.includes('svelte') || stack.includes('angular'))
		return 'linear-gradient(135deg,#0a1628,#0d2040)';
	if (stack.includes('python') || cat.includes('ai') || cat.includes('ml') || stack.includes('machine'))
		return 'linear-gradient(135deg,#1a0a20,#200a2a)';
	if (stack.includes('java') || stack.includes('spring') || stack.includes('kotlin'))
		return 'linear-gradient(135deg,#0a1820,#0a2030)';
	if (cat.includes('mobile') || stack.includes('swift') || stack.includes('flutter'))
		return 'linear-gradient(135deg,#1a1500,#201800)';
	if (cat.includes('iot') || cat.includes('embedded') || cat.includes('hardware'))
		return 'linear-gradient(135deg,#0f1a10,#0a2015)';
	if (cat.includes('automation') || cat.includes('scada') || cat.includes('plc'))
		return 'linear-gradient(135deg,#0a1820,#091c24)';
	return 'linear-gradient(135deg,#0d0a14,#150a1a)';
}

function css(): string {
	return `
:root{
  --bg:#0a0d14;--bg2:#0f1320;--bg3:#141926;--surface:#161c2d;
  --border:#1e2740;--accent:#00d4ff;--accent2:#0088cc;
  --text:#e8eaf0;--text2:#8899bb;--text3:#4a5568;--white:#fff;
  --green:#00e5a0;--nav-h:68px;--radius:8px;
  --glow:0 0 20px rgba(0,212,255,.25);--glow2:0 0 40px rgba(0,212,255,.12);
  --trans:0.3s cubic-bezier(0.4,0,0.2,1);
}
[data-theme="light"]{
  --bg:#f0f4f8;--bg2:#e8eef5;--bg3:#dde5ef;--surface:#fff;
  --border:#c8d6e8;--text:#1a2333;--text2:#4a5568;--text3:#8899aa;
  --glow:0 0 20px rgba(0,136,204,.2);--glow2:0 0 40px rgba(0,136,204,.08);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;line-height:1.6}
a{text-decoration:none;color:inherit}img{max-width:100%;display:block}ul{list-style:none}

/* SCROLL PROGRESS */
#scroll-progress{position:fixed;top:0;left:0;z-index:9999;height:3px;width:0%;background:linear-gradient(90deg,var(--accent2),var(--accent),var(--green));transition:width .1s linear;box-shadow:0 0 10px var(--accent)}

/* CIRCUIT BACKGROUND */
.circuit-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:.04}
[data-theme="light"] .circuit-bg{opacity:.07}
.circuit-bg svg{width:100%;height:100%}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:var(--nav-h);display:flex;align-items:center;padding:0 clamp(1.5rem,5vw,4rem);transition:background var(--trans),box-shadow var(--trans)}
nav.scrolled{background:rgba(10,13,20,.92);backdrop-filter:blur(16px);box-shadow:0 1px 0 var(--border)}
[data-theme="light"] nav.scrolled{background:rgba(240,244,248,.92)}
.nav-logo{font-family:'Rajdhani',sans-serif;font-size:1.5rem;font-weight:700;letter-spacing:.02em;color:var(--white);flex-shrink:0}
[data-theme="light"] .nav-logo{color:var(--text)}
.nav-logo span{color:var(--accent)}
.nav-links{display:flex;align-items:center;gap:2rem;margin-left:auto}
.nav-links a{font-size:.875rem;font-weight:500;color:var(--text2);letter-spacing:.03em;position:relative;transition:color var(--trans)}
.nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform var(--trans)}
.nav-links a:hover,.nav-links a.active{color:var(--accent)}
.nav-links a:hover::after,.nav-links a.active::after{transform:scaleX(1)}
.nav-actions{display:flex;align-items:center;gap:1rem;margin-left:2rem}
#theme-toggle{background:var(--surface);border:1px solid var(--border);color:var(--text2);cursor:pointer;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:1rem;transition:all var(--trans);flex-shrink:0}
#theme-toggle:hover{border-color:var(--accent);color:var(--accent);box-shadow:var(--glow)}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;background:none;border:none}
.hamburger span{display:block;width:24px;height:2px;background:var(--text2);border-radius:2px;transition:all var(--trans)}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mobile-menu{display:none;position:fixed;top:var(--nav-h);left:0;right:0;background:rgba(10,13,20,.97);backdrop-filter:blur(20px);padding:2rem;z-index:999;flex-direction:column;gap:1.5rem;border-bottom:1px solid var(--border)}
[data-theme="light"] .mobile-menu{background:rgba(240,244,248,.97)}
.mobile-menu.open{display:flex}
.mobile-menu a{font-size:1.1rem;color:var(--text2);padding:.5rem 0;border-bottom:1px solid var(--border)}
.mobile-menu a:hover{color:var(--accent)}

/* SECTIONS COMMON */
section{position:relative;z-index:1;padding:clamp(5rem,10vw,8rem) clamp(1.5rem,8vw,6rem)}
.section-header{margin-bottom:clamp(2.5rem,5vw,4rem)}
.section-tag{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--accent);letter-spacing:.2em;text-transform:uppercase;display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem}
.section-tag::before{content:'';display:block;width:32px;height:1px;background:var(--accent)}
.section-title{font-family:'Rajdhani',sans-serif;font-size:clamp(2rem,4vw,3rem);font-weight:700;letter-spacing:-.01em;line-height:1.1;color:var(--white)}
[data-theme="light"] .section-title{color:var(--text)}
.section-sub{color:var(--text2);max-width:560px;font-size:1.05rem;margin-top:.5rem}

/* FADE IN */
.fade-in{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.fade-in.visible{opacity:1;transform:none}
.fade-in.delay-1{transition-delay:.15s}
.fade-in.delay-2{transition-delay:.3s}
.fade-in.delay-3{transition-delay:.45s}
.fade-in.delay-4{transition-delay:.6s}

/* HERO */
#hero{min-height:100vh;display:flex;align-items:center;padding-top:calc(var(--nav-h) + 2rem);padding-bottom:4rem;padding-left:clamp(1.5rem,8vw,6rem);padding-right:clamp(1.5rem,8vw,6rem);overflow:hidden;background:radial-gradient(ellipse 80% 60% at 60% 50%,rgba(0,136,204,.08) 0%,transparent 70%)}
.hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;width:100%;max-width:1280px;margin:0 auto}
.hero-label{font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--accent);letter-spacing:.2em;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem}
.hero-blink{animation:blink 1.2s step-end infinite;font-size:.65rem}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.hero-name{font-family:'Rajdhani',sans-serif;font-size:clamp(3rem,6vw,5.5rem);font-weight:700;line-height:1;letter-spacing:-.02em;color:var(--white);margin-bottom:.5rem}
[data-theme="light"] .hero-name{color:var(--text)}
.hero-title{font-family:'Rajdhani',sans-serif;font-size:clamp(1.25rem,2.5vw,1.75rem);font-weight:500;color:var(--text2);margin-bottom:.75rem}
.hero-title .highlight{color:var(--accent);font-weight:600}
.hero-desc{color:var(--text2);max-width:480px;margin-bottom:2.5rem;font-size:1rem;line-height:1.7}
.hero-btns{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2rem}
.btn-primary{font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:.08em;font-size:.9rem;padding:.85rem 2rem;background:linear-gradient(135deg,var(--accent2),var(--accent));color:var(--bg);border:none;border-radius:4px;cursor:pointer;transition:all var(--trans);box-shadow:0 4px 20px rgba(0,212,255,.3);display:inline-flex;align-items:center;gap:.5rem}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,212,255,.45)}
.btn-outline{font-family:'Rajdhani',sans-serif;font-weight:600;letter-spacing:.08em;font-size:.9rem;padding:.85rem 2rem;background:transparent;color:var(--text);border:1px solid var(--border);border-radius:4px;cursor:pointer;transition:all var(--trans);display:inline-flex;align-items:center}
.btn-outline:hover{border-color:var(--accent);color:var(--accent);box-shadow:var(--glow);transform:translateY(-2px)}
.hero-socials{display:flex;gap:.75rem}
.hero-social{width:40px;height:40px;border-radius:50%;border:1px solid var(--border);display:grid;place-items:center;color:var(--text3);font-size:.85rem;font-family:'JetBrains Mono',monospace;font-weight:700;transition:all var(--trans)}
.hero-social:hover{border-color:var(--accent);color:var(--accent);box-shadow:var(--glow);transform:translateY(-3px)}

/* HERO VISUAL — HEXAGON */
.hero-visual{display:flex;justify-content:center;align-items:center;position:relative}
.hexagon-wrapper{position:relative;width:clamp(260px,34vw,400px);aspect-ratio:1}
.hex-frame{position:absolute;inset:0;background:linear-gradient(135deg,var(--accent2),var(--accent),var(--green));clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);animation:hexPulse 3s ease-in-out infinite;opacity:.6}
@keyframes hexPulse{0%,100%{opacity:.6;filter:hue-rotate(0deg)}50%{opacity:.85;filter:hue-rotate(20deg)}}
.hex-bg{position:absolute;inset:4px;background:var(--bg3);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)}
.hex-inner{position:absolute;inset:10px;background:linear-gradient(160deg,var(--surface),var(--bg3));clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;overflow:hidden}
.hex-inner img{width:85%;height:85%;object-fit:cover}
.hex-initials{font-family:'Rajdhani',sans-serif;font-size:clamp(3rem,8vw,5rem);font-weight:700;color:var(--accent);opacity:.7}

/* STAT BUBBLES */
.stat-bubble{position:absolute;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;display:flex;align-items:center;gap:.65rem;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:floatBubble 3s ease-in-out infinite}
.stat-bubble:nth-of-type(1){top:8%;left:-5%;animation-delay:0s}
.stat-bubble:nth-of-type(2){bottom:12%;right:-8%;animation-delay:1.5s}
@keyframes floatBubble{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.stat-num{font-family:'Rajdhani',sans-serif;font-size:1.5rem;font-weight:700;color:var(--accent);line-height:1}
.stat-label{font-size:.7rem;color:var(--text2);line-height:1.3}

/* ABOUT */
#about{background:var(--bg2)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start}
.about-text p{color:var(--text2);line-height:1.8;margin-bottom:1.25rem}
.about-highlights{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:2rem}
.highlight-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;display:flex;gap:1rem;align-items:flex-start;transition:all var(--trans)}
.highlight-item:hover{border-color:var(--accent);box-shadow:var(--glow2);transform:translateY(-2px)}
.hi-icon{font-size:1.1rem;color:var(--accent);flex-shrink:0;margin-top:2px}
.hi-title{font-family:'Rajdhani',sans-serif;font-weight:600;font-size:.95rem;color:var(--white);margin-bottom:.2rem}
[data-theme="light"] .hi-title{color:var(--text)}
.hi-desc{font-size:.8rem;color:var(--text2);line-height:1.5}
.about-stats{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.astat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:2rem 1.5rem;text-align:center;transition:all var(--trans)}
.astat:hover{border-color:var(--accent);box-shadow:var(--glow2)}
.astat-num{font-family:'Rajdhani',sans-serif;font-size:3rem;font-weight:700;line-height:1;background:linear-gradient(135deg,var(--accent2),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.astat-label{font-size:.82rem;color:var(--text2);margin-top:.5rem}
.astat-note{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--text3);margin-top:.25rem}

/* EXPERIENCE */
#experience{background:var(--bg)}
.exp-timeline{position:relative;padding-left:2rem}
.exp-timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:linear-gradient(180deg,var(--accent),transparent)}
.exp-item{position:relative;padding-bottom:3rem}
.exp-item:last-of-type{padding-bottom:0}
.exp-dot{position:absolute;left:-2.4rem;top:4px;width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px var(--accent);border:2px solid var(--bg)}
.exp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;transition:all var(--trans)}
.exp-card:hover{border-color:rgba(0,212,255,.3);box-shadow:var(--glow2)}
.exp-header{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;margin-bottom:.35rem}
.exp-title{font-family:'Rajdhani',sans-serif;font-size:1.25rem;font-weight:700;color:var(--white)}
[data-theme="light"] .exp-title{color:var(--text)}
.exp-period{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--accent);white-space:nowrap}
.exp-company{font-size:.9rem;color:var(--accent);margin-bottom:1rem}
.exp-desc{color:var(--text2);font-size:.88rem;line-height:1.7;margin-bottom:.75rem}
.exp-points{display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.25rem}
.exp-point{display:flex;gap:.75rem;align-items:flex-start;font-size:.875rem;color:var(--text2);line-height:1.6}
.exp-point::before{content:'\\25B8';color:var(--accent);flex-shrink:0;margin-top:2px}
.exp-tools{display:flex;gap:.5rem;flex-wrap:wrap}
.exp-tool{font-family:'JetBrains Mono',monospace;font-size:.7rem;padding:.2rem .65rem;border-radius:3px;background:rgba(0,212,255,.06);color:var(--accent);border:1px solid rgba(0,212,255,.15)}
.add-btn{display:block;margin-top:14px;padding:9px 16px;border:2px dashed rgba(0,212,255,.3);border-radius:var(--radius);background:rgba(0,212,255,.04);color:var(--accent);font-size:.85rem;cursor:pointer;width:100%;text-align:center;font-weight:600}
.add-btn:hover{background:rgba(0,212,255,.08);border-color:var(--accent)}
.del-btn{display:none;position:absolute;top:4px;right:0;width:22px;height:22px;border-radius:50%;border:none;background:rgba(239,68,68,.15);color:#ef4444;font-size:13px;line-height:22px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

/* SKILLS */
#skills{background:var(--bg2)}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:2rem}
.skill-cat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;transition:all var(--trans);position:relative}
.skill-cat-card:hover{border-color:rgba(0,212,255,.25);box-shadow:var(--glow2)}
.skill-cat-header{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--border)}
.skill-cat-icon{width:44px;height:44px;border-radius:var(--radius);background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);display:grid;place-items:center;font-size:1.1rem;color:var(--accent);flex-shrink:0}
.skill-cat-name{font-family:'Rajdhani',sans-serif;font-size:1.1rem;font-weight:700;color:var(--white)}
[data-theme="light"] .skill-cat-name{color:var(--text)}
.skill-tags{display:flex;flex-wrap:wrap;gap:.5rem}
.skill-tag{font-family:'JetBrains Mono',monospace;font-size:.75rem;padding:.3rem .75rem;border-radius:4px;background:rgba(0,212,255,.06);color:var(--text2);border:1px solid rgba(0,212,255,.15);transition:all var(--trans)}
.skill-tag:hover{background:rgba(0,212,255,.12);color:var(--accent)}

/* PROJECTS */
#projects{background:var(--bg)}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1.5rem}
.project-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all var(--trans);display:flex;flex-direction:column;position:relative}
.project-card:hover{border-color:rgba(0,212,255,.3);box-shadow:0 16px 48px rgba(0,0,0,.4),var(--glow2);transform:translateY(-4px)}
.project-banner{height:140px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.project-banner-bg{position:absolute;inset:0;opacity:.5;background:linear-gradient(135deg,rgba(0,212,255,.15),transparent);z-index:1}
.project-banner-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.project-banner-img+.project-banner-bg{background:linear-gradient(to bottom,transparent 40%,rgba(10,13,20,.7));opacity:1}
.project-banner-icon{font-size:3.5rem;color:var(--accent);opacity:.12;position:relative;z-index:2;font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:-.05em}
.project-banner-label{position:absolute;top:1rem;right:1rem;font-family:'JetBrains Mono',monospace;font-size:.65rem;padding:.2rem .6rem;border-radius:3px;background:rgba(0,212,255,.12);color:var(--accent);border:1px solid rgba(0,212,255,.25);z-index:3}
.project-body{padding:1.5rem;flex:1;display:flex;flex-direction:column}
.project-title{font-family:'Rajdhani',sans-serif;font-size:1.15rem;font-weight:700;color:var(--white);margin-bottom:.5rem}
[data-theme="light"] .project-title{color:var(--text)}
.project-desc{font-size:.85rem;color:var(--text2);line-height:1.7;margin-bottom:.5rem}
.project-outcomes{margin-bottom:1rem}
.project-outcome{display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:var(--green);margin-bottom:.25rem;font-weight:500}
.project-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem}
.project-tags{display:flex;gap:.4rem;flex-wrap:wrap}
.ptag{font-family:'JetBrains Mono',monospace;font-size:.65rem;padding:.2rem .6rem;border-radius:3px;background:var(--bg3);color:var(--text3);border:1px solid var(--border)}
.project-links{display:flex;gap:.5rem}
.plink{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--accent);font-weight:600;transition:opacity var(--trans)}
.plink:hover{opacity:.7}

/* EDUCATION */
#education{background:var(--bg2)}
.edu-list{display:flex;flex-direction:column;gap:1.5rem;max-width:800px}
.edu-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;display:grid;grid-template-columns:60px 1fr;gap:1.5rem;transition:all var(--trans);position:relative;overflow:hidden}
.edu-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--accent2),var(--accent));opacity:0;transition:opacity var(--trans)}
.edu-card:hover{box-shadow:var(--glow2);transform:translateX(4px)}
.edu-card:hover::before{opacity:1}
.edu-icon{width:60px;height:60px;border-radius:var(--radius);background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);display:grid;place-items:center;font-family:'Rajdhani',sans-serif;font-size:1.4rem;font-weight:700;color:var(--accent);flex-shrink:0}
.edu-meta{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:.5rem;align-items:center}
.edu-degree{font-family:'Rajdhani',sans-serif;font-size:1.2rem;font-weight:700;color:var(--white);flex:1}
[data-theme="light"] .edu-degree{color:var(--text)}
.edu-year{font-family:'JetBrains Mono',monospace;font-size:.75rem;padding:.25rem .75rem;border-radius:20px;background:rgba(0,212,255,.08);color:var(--accent);border:1px solid rgba(0,212,255,.2)}
.edu-inst{font-size:.9rem;color:var(--accent);margin-bottom:.3rem}
.edu-grade{font-size:.85rem;color:var(--text2)}
.edu-tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem}
.edu-tag{font-size:.7rem;padding:.2rem .65rem;border-radius:20px;background:var(--bg3);color:var(--text2);border:1px solid var(--border)}

/* CERTIFICATIONS */
#certifications{background:var(--bg)}
.cert-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}
.cert-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;display:flex;gap:1rem;align-items:flex-start;transition:all var(--trans);position:relative}
.cert-card:hover{border-color:rgba(0,212,255,.3);box-shadow:var(--glow2);transform:translateY(-2px)}
.cert-icon{width:48px;height:48px;border-radius:var(--radius);flex-shrink:0;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);display:grid;place-items:center;font-size:1.2rem;color:var(--accent)}
.cert-name{font-family:'Rajdhani',sans-serif;font-size:1rem;font-weight:700;color:var(--white);margin-bottom:.3rem}
[data-theme="light"] .cert-name{color:var(--text)}
.cert-org{font-size:.8rem;color:var(--accent);margin-bottom:.25rem}
.cert-year{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--text3)}

/* ACHIEVEMENTS & AWARDS */
#achievements,#awards{background:var(--bg2)}
.ach-grid,.award-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}
.ach-card,.award-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;transition:all var(--trans);position:relative}
.ach-card:hover,.award-card:hover{border-color:rgba(0,212,255,.3);box-shadow:var(--glow2)}
.ach-title,.award-title{font-family:'Rajdhani',sans-serif;font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:.35rem}
[data-theme="light"] .ach-title,[data-theme="light"] .award-title{color:var(--text)}
.ach-desc,.award-body{font-size:.83rem;color:var(--text2);line-height:1.6}
.ach-year,.award-year{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--accent);display:block;margin-top:.5rem}

/* CAMPAIGNS / FINANCIAL / INVESTMENTS */
#campaigns{background:var(--bg)}
#financial_modeling{background:var(--bg2)}
#investment_portfolios{background:var(--bg)}
.camp-grid,.fin-grid,.inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem}
.camp-card,.fin-card,.inv-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;transition:border-color var(--trans);position:relative}
.camp-card:hover,.fin-card:hover,.inv-card:hover{border-color:rgba(0,212,255,.3)}
.camp-name,.fin-type,.inv-type{font-family:'Rajdhani',sans-serif;font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:.5rem}
[data-theme="light"] .camp-name,[data-theme="light"] .fin-type,[data-theme="light"] .inv-type{color:var(--text)}
.camp-meta,.fin-outcome,.inv-meta{font-size:.82rem;color:var(--text2);line-height:1.6;margin-bottom:.25rem}
.inv-ret{font-size:.82rem;color:var(--green)}
.camp-metric{font-size:.82rem;color:var(--green);margin-bottom:.2rem;padding-left:.75rem;position:relative}
.camp-metric::before{content:'\\25B8';position:absolute;left:0;color:var(--accent);font-size:.65rem}

/* DESIGN PHILOSOPHY / SOFTWARE PROFICIENCY */
#design_philosophy{background:var(--bg)}
.dp-text{font-size:1.05rem;color:var(--text2);line-height:1.85;max-width:760px}
#software_proficiency{background:var(--bg2)}
.sp-tags{display:flex;flex-wrap:wrap;gap:.6rem}
.sp-tag{font-family:'JetBrains Mono',monospace;font-size:.75rem;padding:.35rem .85rem;border-radius:4px;background:rgba(0,212,255,.08);color:var(--text2);border:1px solid rgba(0,212,255,.18)}

/* CONTACT */
#contact{background:var(--bg2)}
.contact-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:4rem;align-items:start}
.contact-info{display:flex;flex-direction:column;gap:1.5rem}
.contact-item{display:flex;gap:1rem;align-items:flex-start}
.ci-icon{width:44px;height:44px;border-radius:var(--radius);flex-shrink:0;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);display:grid;place-items:center;font-size:1.1rem;color:var(--accent)}
.ci-label{font-size:.75rem;color:var(--text3);margin-bottom:.2rem;text-transform:uppercase;letter-spacing:.08em}
.ci-value{font-size:.95rem;color:var(--text)}
.contact-socials{display:flex;gap:.75rem;margin-top:1rem}
.csoc{width:42px;height:42px;border-radius:var(--radius);border:1px solid var(--border);display:grid;place-items:center;color:var(--text3);font-size:.85rem;font-family:'JetBrains Mono',monospace;font-weight:700;transition:all var(--trans)}
.csoc:hover{border-color:var(--accent);color:var(--accent);box-shadow:var(--glow)}

/* FOOTER */
footer{background:var(--bg);border-top:1px solid var(--border);padding:2.5rem clamp(1.5rem,8vw,6rem);display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap;position:relative;z-index:1}
.footer-logo{font-family:'Rajdhani',sans-serif;font-size:1.25rem;font-weight:700;color:var(--white)}
[data-theme="light"] .footer-logo{color:var(--text)}
.footer-logo span{color:var(--accent)}
.footer-copy{font-size:.8rem;color:var(--text3)}
.footer-socials{display:flex;gap:.75rem}
.fsoc{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);display:grid;place-items:center;color:var(--text3);font-family:'JetBrains Mono',monospace;font-size:.85rem;font-weight:700;transition:all var(--trans)}
.fsoc:hover{border-color:var(--accent);color:var(--accent)}

/* RESPONSIVE */
@media(max-width:1024px){
  .hero-inner{grid-template-columns:1fr;text-align:center}
  .hero-desc,.section-sub{max-width:100%}
  .hero-btns,.hero-socials{justify-content:center}
  .hero-visual{order:-1}
  .stat-bubble:nth-of-type(1){left:2%}
  .stat-bubble:nth-of-type(2){right:2%}
  .about-grid{grid-template-columns:1fr;gap:3rem}
  .contact-grid{grid-template-columns:1fr;gap:3rem}
}
@media(max-width:768px){
  .nav-links,.nav-actions{display:none}
  .hamburger{display:flex}
}
@media(max-width:480px){
  .about-highlights{grid-template-columns:1fr}
  .about-stats{grid-template-columns:1fr 1fr}
  .projects-grid{grid-template-columns:1fr}
  .cert-grid{grid-template-columns:1fr}
  .edu-card{grid-template-columns:1fr}
}
`;
}

const CIRCUIT_SCRIPT = `<script>
(function(){
  // Scroll progress
  var pb=document.getElementById('scroll-progress');
  window.addEventListener('scroll',function(){
    if(!pb)return;
    var pct=(window.scrollY/Math.max(1,document.body.scrollHeight-window.innerHeight))*100;
    pb.style.width=Math.min(100,pct)+'%';
  },{passive:true});

  // Nav glass on scroll
  var nb=document.getElementById('navbar');
  window.addEventListener('scroll',function(){
    if(nb)nb.classList.toggle('scrolled',window.scrollY>30);
  },{passive:true});

  // Active nav link via IntersectionObserver
  var secs=document.querySelectorAll('section[id]');
  var nls=document.querySelectorAll('.nav-links a');
  if(secs.length&&nls.length){
    var so=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          nls.forEach(function(l){l.classList.remove('active')});
          var lnk=document.querySelector('.nav-links a[href="#'+e.target.id+'"]');
          if(lnk)lnk.classList.add('active');
        }
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    secs.forEach(function(s){so.observe(s)});
  }

  // Hamburger
  var ham=document.getElementById('hamburger');
  var mob=document.getElementById('mobileMenu');
  if(ham&&mob){
    ham.addEventListener('click',function(){
      ham.classList.toggle('open');
      mob.classList.toggle('open');
    });
    mob.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        ham.classList.remove('open');
        mob.classList.remove('open');
      });
    });
  }

  // Theme toggle (dark/light)
  var themeBtn=document.getElementById('theme-toggle');
  var htmlEl=document.documentElement;
  var isDark=true;
  if(themeBtn){
    themeBtn.addEventListener('click',function(){
      isDark=!isDark;
      htmlEl.setAttribute('data-theme',isDark?'dark':'light');
      themeBtn.textContent=isDark?'\\u263D':'\\u2600';
    });
  }

  // Fade-in on scroll
  var fades=document.querySelectorAll('.fade-in');
  if(fades.length){
    var fo=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('visible');fo.unobserve(e.target);}
      });
    },{threshold:0.12});
    fades.forEach(function(el){fo.observe(el);});
  }
})();
<\/script>`;

const CIRCUIT_SVG = `<div class="circuit-bg" aria-hidden="true">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
<defs><pattern id="cgrid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00d4ff" stroke-width="0.5"/></pattern></defs>
<rect width="100%" height="100%" fill="url(#cgrid)"/>
<polyline points="0,180 120,180 180,120 400,120 460,60 600,60" fill="none" stroke="#00d4ff" stroke-width="1.2"/>
<circle cx="180" cy="120" r="4" fill="#00d4ff"/>
<circle cx="460" cy="60" r="4" fill="#00d4ff"/>
<polyline points="200,900 200,700 300,600 600,600 700,500 1000,500" fill="none" stroke="#00d4ff" stroke-width="1.2"/>
<circle cx="300" cy="600" r="4" fill="#00d4ff"/>
<circle cx="700" cy="500" r="4" fill="#00d4ff"/>
<polyline points="1440,300 1300,300 1240,240 1000,240 900,180 700,180" fill="none" stroke="#00d4ff" stroke-width="1.2"/>
<circle cx="1240" cy="240" r="4" fill="#00d4ff"/>
<circle cx="900" cy="180" r="4" fill="#00d4ff"/>
<polyline points="1440,700 1200,700 1100,800 800,800" fill="none" stroke="#00d4ff" stroke-width="1.2"/>
<circle cx="1100" cy="800" r="4" fill="#00d4ff"/>
<polyline points="500,0 500,80 560,140 900,140 960,80 1200,80" fill="none" stroke="#00d4ff" stroke-width="1.2"/>
<circle cx="560" cy="140" r="4" fill="#00d4ff"/>
</svg>
</div>`;

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const inits = initials(v.name);
	const years = yearsExperience(v.experience);
	const projCount = v.projects?.length ?? 0;
	const certCount = v.certifications?.length ?? 0;
	const totalSkills = (v.skill_groups ?? []).reduce((acc, g) => acc + g.skills.length, 0);

	// Nav links
	const NAV_LABELS: Record<string, string> = {
		about: 'About', experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements',
		awards: 'Awards', campaigns: 'Campaigns', financial_modeling: 'Finance',
		investment_portfolios: 'Investments', contact: 'Contact',
	};
	const navAnchors: string[] = [];
	if (v.bio || v.location || v.email || v.phone) navAnchors.push('about');
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (key === 'custom_sections') {
			for (const cs of v.custom_sections ?? []) {
				if (cs.items?.length) navAnchors.push(cs.section_id);
			}
			continue;
		}
		if (['experience', 'skills', 'projects', 'education', 'certifications', 'achievements', 'awards', 'campaigns', 'financial_modeling', 'investment_portfolios'].includes(key)) {
			const dk = key === 'skills' ? 'skill_groups' : key;
			const d = (v as unknown as Record<string, unknown>)[dk];
			if (d && (Array.isArray(d) ? d.length > 0 : Boolean(d))) navAnchors.push(key);
		}
	}
	if (v.email || v.phone || v.location) navAnchors.push('contact');

	// Mobile menu anchors
	const mobileItems = navAnchors.map(a => `<a href="#${a}">${NAV_LABELS[a] ?? a}</a>`).join('');
	const navItems = navAnchors.map(a => `<li><a href="#${a}">${NAV_LABELS[a] ?? a}</a></li>`).join('');

	// Avatar
	const avatarHtml = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<span class="hex-initials">${inits}</span>`;

	// Social links
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" class="hero-social">in</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" class="hero-social">gh</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" class="hero-social">&#127760;</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" class="hero-social">&#x1D54F;</a>` : '',
	].filter(Boolean).join('');

	// Stat bubbles
	const bubble1 = years > 0 ? `<div class="stat-bubble fade-in"><div><div class="stat-num">${years}+</div><div class="stat-label">Years<br>Exp.</div></div></div>` : '';
	const bubble2 = projCount > 0 ? `<div class="stat-bubble fade-in delay-1"><div><div class="stat-num">${projCount}+</div><div class="stat-label">Projects<br>Built</div></div></div>` : '';

	// About section
	const aboutHtml = v.bio || v.email || v.phone || v.location
		? (() => {
			const highlights = (v.skill_groups ?? []).slice(0, 4).map(g =>
				`<div class="highlight-item fade-in">
<div class="hi-icon">&#9654;</div>
<div><div class="hi-title">${g.category}</div><div class="hi-desc">${g.skills.slice(0, 4).join(', ')}</div></div>
</div>`
			).join('');

			const statsHtml = `
<div class="astat">
  <div class="astat-num">${years > 0 ? years + '+' : '—'}</div>
  <div class="astat-label">Years Experience</div>
  <div class="astat-note">// industry</div>
</div>
<div class="astat">
  <div class="astat-num">${projCount > 0 ? projCount + '+' : '—'}</div>
  <div class="astat-label">Projects Delivered</div>
  <div class="astat-note">// completed</div>
</div>
<div class="astat">
  <div class="astat-num">${certCount > 0 ? certCount : '—'}</div>
  <div class="astat-label">Certifications</div>
  <div class="astat-note">// certified</div>
</div>
<div class="astat">
  <div class="astat-num">${totalSkills > 0 ? totalSkills + '+' : '—'}</div>
  <div class="astat-label">Skills</div>
  <div class="astat-note">// proficient</div>
</div>`;

			return `<section id="about">
<div class="section-header fade-in">
  <p class="section-tag">Who I Am</p>
  <h2 class="section-title">About Me</h2>
</div>
<div class="about-grid">
  <div class="about-text fade-in">
    ${v.bio ? `<p ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
    ${highlights ? `<div class="about-highlights">${highlights}</div>` : ''}
  </div>
  <div class="about-stats fade-in delay-1">${statsHtml}</div>
</div>
</section>`;
		})()
		: '';

	// Experience
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience">
<div class="section-header fade-in">
  <p class="section-tag">Career Journey</p>
  <h2 class="section-title">Experience</h2>
</div>
<div class="exp-timeline">
${v.experience.map((exp, i) => `<div class="exp-item fade-in${i > 0 ? ' delay-' + Math.min(i, 3) : ''}" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
<div class="exp-dot"></div>
<div class="exp-card">
  <div class="exp-header">
    <span class="exp-title" ${_editable(`experience.${i}.role`)}>${exp.role}</span>
    ${exp.duration ? `<span class="exp-period" ${_editable(`experience.${i}.duration`)}>${exp.duration}</span>` : ''}
  </div>
  ${exp.company ? `<div class="exp-company" ${_editable(`experience.${i}.company`)}>${exp.company}${exp.location ? ` &mdash; ${exp.location}` : ''}</div>` : ''}
  ${exp.description ? `<p class="exp-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
  ${exp.key_points?.length ? `<div class="exp-points" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<div class="exp-point">${k}</div>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</section>` : '';

	// Skills
	const skillsHtml = !hidden.has('skills') && v.skill_groups?.length
		? `<section id="skills">
<div class="section-header fade-in">
  <p class="section-tag">Technical Arsenal</p>
  <h2 class="section-title">Skills</h2>
</div>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-cat-card fade-in${i > 0 ? ' delay-' + Math.min(i, 3) : ''}" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${i}">&#x2715;</button>
<div class="skill-cat-header">
  <div class="skill-cat-icon">&#9654;</div>
  <div class="skill-cat-name" ${_editable(`skills.${i}.category`)}>${g.category}</div>
</div>
<div class="skill-tags" ${_listEditable(`skills.${i}.skills`)}>${g.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
</section>` : '';

	// Projects
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section id="projects">
<div class="section-header fade-in">
  <p class="section-tag">Portfolio</p>
  <h2 class="section-title">Projects</h2>
</div>
<div class="projects-grid">
${v.projects.map((p, i) => {
	const stack = [...(p.tech_stack ?? []), ...(p.software_used ?? [])];
	const tags = stack.map(t => `<span class="ptag">${t}</span>`).join('');
	const links = [
		p.github_repo ? `<a href="${p.github_repo}" class="plink" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
		p.project_url ? `<a href="${p.project_url}" class="plink" target="_blank" rel="noopener noreferrer">Live</a>` : '',
	].filter(Boolean).join('');
	const responsibilities = p.responsibilities?.length
		? `<div class="exp-points" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.slice(0, 3).map(r => `<div class="exp-point">${r}</div>`).join('')}</div>`
		: '';
	const outcomes = p.measurable_outcomes?.length
		? `<div class="project-outcomes">${p.measurable_outcomes.slice(0, 2).map(o => `<div class="project-outcome">&#10003; ${o}</div>`).join('')}</div>`
		: '';
	const catLabel = p.project_category?.toUpperCase() || 'PROJECT';
	const gradient = bannerGradient(p);
	const bannerIcon = stack[0] ? stack[0].toUpperCase().slice(0, 3) : '&lt;/&gt;';
	const bannerImg = p.images?.[0];
	return `<div class="project-card fade-in${i > 0 ? ' delay-' + Math.min(i % 3, 3) : ''}" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
<div class="project-banner"${bannerImg ? '' : ` style="background:${gradient}"`}>
  ${bannerImg ? `<img class="project-banner-img" src="${bannerImg}" alt="${p.title}">` : ''}
  <div class="project-banner-bg"></div>
  ${bannerImg ? '' : `<div class="project-banner-icon">${bannerIcon}</div>`}
  <span class="project-banner-label">${catLabel}</span>
</div>
<div class="project-body">
  <div class="project-title" ${_editable(`projects.${i}.title`)}>${p.title}</div>
  ${p.description ? `<p class="project-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
  ${responsibilities}
  ${outcomes}
  <div class="project-footer">
    ${tags ? `<div class="project-tags" ${_listEditable(`projects.${i}.tech_stack`)}>${tags}</div>` : ''}
    ${links ? `<div class="project-links">${links}</div>` : ''}
  </div>
</div>
</div>`;
}).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</section>` : '';

	// Education
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section id="education">
<div class="section-header fade-in">
  <p class="section-tag">Academic Background</p>
  <h2 class="section-title">Education</h2>
</div>
<div class="edu-list">
${v.education.map((edu, i) => `<div class="edu-card fade-in" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
<div class="edu-icon">${i + 1}</div>
<div>
  <div class="edu-meta">
    <span class="edu-degree" ${_editable(`education.${i}.degree`)}>${[edu.degree, edu.field_of_study].filter(Boolean).join(' — ')}</span>
    ${edu.year_range ? `<span class="edu-year" ${_editable(`education.${i}.year_range`)}>${edu.year_range}</span>` : ''}
  </div>
  ${edu.institution ? `<div class="edu-inst" ${_editable(`education.${i}.institution`)}>${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>` : ''}
  ${edu.grade_or_score ? `<div class="edu-grade" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</section>` : '';

	// Certifications
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section id="certifications">
<div class="section-header fade-in">
  <p class="section-tag">Credentials</p>
  <h2 class="section-title">Certifications</h2>
</div>
<div class="cert-grid">
${v.certifications.map((c, i) => `<div class="cert-card fade-in" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
<div class="cert-icon">&#9670;</div>
<div>
  <div class="cert-name">${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name}</div>
  ${c.issuer ? `<div class="cert-org" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
  ${c.year ? `<div class="cert-year" ${_editable(`certifications.${i}.year`)}>${c.year}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</section>` : '';

	// Achievements
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section id="achievements">
<div class="section-header fade-in">
  <p class="section-tag">Recognition</p>
  <h2 class="section-title">Achievements</h2>
</div>
<div class="ach-grid">
${v.achievements.map((a, i) => `<div class="ach-card fade-in" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
${a.year ? `<span class="ach-year" ${_editable(`achievements.${i}.year`)}>${a.year}</span>` : ''}
<div class="ach-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="ach-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</section>` : '';

	// Awards
	const awardsHtml = !hidden.has('awards') && v.awards?.length
		? `<section id="awards">
<div class="section-header fade-in">
  <p class="section-tag">Honours</p>
  <h2 class="section-title">Awards</h2>
</div>
<div class="award-grid">
${v.awards.map((a, i) => `<div class="award-card fade-in" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="awards" data-del-index="${i}">&#x2715;</button>
${a.year ? `<span class="award-year" ${_editable(`awards.${i}.year`)}>${a.year}</span>` : ''}
<div class="award-title" ${_editable(`awards.${i}.title`)}>${a.title}</div>
${a.awarding_body ? `<div class="award-body" ${_editable(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}
</div>`).join('\n')}
</div>
</section>` : '';

	// Campaigns
	const campaignsHtml = !hidden.has('campaigns') && v.campaigns?.length
		? `<section id="campaigns">
<div class="section-header fade-in">
  <p class="section-tag">Marketing</p>
  <h2 class="section-title">Campaigns</h2>
</div>
<div class="camp-grid">
${v.campaigns.map((c, i) => {
	const metrics = (c.performance_metrics ?? []).map(m => `<div class="camp-metric">${m}</div>`).join('');
	return `<div class="camp-card fade-in" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="campaigns" data-del-index="${i}">&#x2715;</button>
<div class="camp-name" ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</div>
${c.campaign_type ? `<div class="camp-meta" ${_editable(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}
${metrics}
</div>`;
}).join('\n')}
</div>
</section>` : '';

	// Financial modeling
	const finHtml = !hidden.has('financial_modeling') && v.financial_modeling?.length
		? `<section id="financial_modeling">
<div class="section-header fade-in">
  <p class="section-tag">Finance</p>
  <h2 class="section-title">Financial Modeling</h2>
</div>
<div class="fin-grid">
${v.financial_modeling.map((f, i) => {
	const tools = (f.tools_used ?? []).map(t => `<span class="exp-tool">${t}</span>`).join('');
	return `<div class="fin-card fade-in" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">&#x2715;</button>
<div class="fin-type" ${_editable(`financial_modeling.${i}.model_type`)}>${f.model_type}</div>
${f.outcome ? `<div class="fin-outcome" ${_editable(`financial_modeling.${i}.outcome`)}>${f.outcome}</div>` : ''}
${tools ? `<div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.75rem">${tools}</div>` : ''}
</div>`;
}).join('\n')}
</div>
</section>` : '';

	// Investment portfolios
	const invHtml = !hidden.has('investment_portfolios') && v.investment_portfolios?.length
		? `<section id="investment_portfolios">
<div class="section-header fade-in">
  <p class="section-tag">Finance</p>
  <h2 class="section-title">Investment Portfolio</h2>
</div>
<div class="inv-grid">
${v.investment_portfolios.map((p, i) => `<div class="inv-card fade-in" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">&#x2715;</button>
<div class="inv-type" ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${p.portfolio_type}</div>
${p.assets_under_management ? `<div class="inv-meta" ${_editable(`investment_portfolios.${i}.assets_under_management`)}>AUM: ${p.assets_under_management}</div>` : ''}
${p.performance_return ? `<div class="inv-ret">Return: ${p.performance_return}</div>` : ''}
</div>`).join('\n')}
</div>
</section>` : '';

	// Design philosophy
	const designHtml = !hidden.has('design_philosophy') && v.design_philosophy
		? `<section id="design_philosophy">
<div class="section-header fade-in">
  <p class="section-tag">Design</p>
  <h2 class="section-title">Design Philosophy</h2>
</div>
<p class="dp-text fade-in" ${_editable('portfolio.design_philosophy', true)}>${v.design_philosophy}</p>
</section>` : '';

	// Software proficiency
	const softwareHtml = !hidden.has('software_proficiency') && v.software_proficiency?.length
		? `<section id="software_proficiency">
<div class="section-header fade-in">
  <p class="section-tag">Tools</p>
  <h2 class="section-title">Software Proficiency</h2>
</div>
<div class="sp-tags">${v.software_proficiency.map(s => `<span class="sp-tag">${s}</span>`).join('')}</div>
</section>` : '';

	// Contact
	const contactHtml = v.email || v.phone || v.location
		? `<section id="contact">
<div class="section-header fade-in">
  <p class="section-tag">Get In Touch</p>
  <h2 class="section-title">Contact</h2>
</div>
<div class="contact-grid">
  <div class="contact-info fade-in">
    ${v.email ? `<div class="contact-item"><div class="ci-icon">@</div><div><div class="ci-label">Email</div><div class="ci-value" ${_editable('profile.email')}>${v.email}</div></div></div>` : ''}
    ${v.phone ? `<div class="contact-item"><div class="ci-icon">&#9742;</div><div><div class="ci-label">Phone</div><div class="ci-value" ${_editable('profile.phone')}>${v.phone}</div></div></div>` : ''}
    ${v.location ? `<div class="contact-item"><div class="ci-icon">&#9675;</div><div><div class="ci-label">Location</div><div class="ci-value" ${_editable('profile.location')}>${v.location}</div></div></div>` : ''}
    ${socials ? `<div class="contact-socials">${socials.replace(/hero-social/g, 'csoc')}</div>` : ''}
  </div>
  <div class="fade-in delay-1" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:2rem;display:flex;align-items:center;justify-content:center">
    <div style="text-align:center">
      <div style="font-family:'Rajdhani',sans-serif;font-size:3rem;font-weight:700;color:var(--accent);opacity:.15;margin-bottom:1rem">&#9654;</div>
      <p style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--text3);letter-spacing:.15em">OPEN TO OPPORTUNITIES</p>
    </div>
  </div>
</div>
</section>` : '';

	const customSectionsHtml = !hidden.has('custom_sections') && (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length) return '';
			const items = cs.items.map((item, i) => `<div class="card fade-in" data-item-wrap>
<button class="ce-del-btn" data-del-section="custom_sections" data-del-index="${i}">&#x2715;</button>
${item.label ? `<div class="card-title">${item.label}</div>` : ''}
${item.subtitle ? `<div class="card-sub">${item.subtitle}</div>` : ''}
${item.value ? `<p class="card-desc">${item.value}</p>` : ''}
${item.tags?.length ? `<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.6rem">${item.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" style="color:var(--accent);font-size:.85rem;margin-top:.5rem;display:inline-block" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			const grid = cs.display_type === 'cards'
				? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem">${items}</div>`
				: `<div style="display:flex;flex-direction:column;gap:1rem">${items}</div>`;
			return `<section id="${cs.section_id}">
<div class="section-header fade-in">
  <p class="section-tag">${cs.display_type}</p>
  <h2 class="section-title">${cs.title}</h2>
</div>
${grid}
<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		experience: expHtml, skills: skillsHtml, projects: projectsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		awards: awardsHtml, campaigns: campaignsHtml, financial_modeling: finHtml,
		investment_portfolios: invHtml, design_philosophy: designHtml,
		software_proficiency: softwareHtml, custom_sections: customSectionsHtml,
	};

	const orderedSections = order
		.filter(k => !hidden.has(k) && k in sectionMap)
		.map(k => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	// Footer socials
	const footerSocials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" class="fsoc">in</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" class="fsoc">gh</a>` : '',
		v.email ? `<a href="mailto:${v.email}" class="fsoc">@</a>` : '',
	].filter(Boolean).join('');

	return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Portfolio</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div id="scroll-progress"></div>
${CIRCUIT_SVG}
<nav id="navbar">
  <a href="#hero" class="nav-logo">${inits}<span>.</span></a>
  <ul class="nav-links">${navItems}</ul>
  <div class="nav-actions">
    <button id="theme-toggle" aria-label="Toggle theme">&#9790;</button>
  </div>
  <button class="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobileMenu">${mobileItems}</div>
<section id="hero">
<div class="hero-inner">
  <div class="hero-content">
    <p class="hero-label fade-in"><span class="hero-blink">&#9632;</span> Available for opportunities</p>
    <h1 class="hero-name fade-in delay-1" ${_editable('profile.name')}>${v.name}</h1>
    ${v.headline ? `<p class="hero-title fade-in delay-2" ${_editable('portfolio.headline')}>${v.headline}</p>` : ''}
    ${v.bio ? `<p class="hero-desc fade-in delay-2" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
    <div class="hero-btns fade-in delay-3">
      <a href="#contact" class="btn-primary">Hire Me</a>
      <a href="#projects" class="btn-outline">View Projects</a>
    </div>
    ${socials ? `<div class="hero-socials fade-in delay-4">${socials}</div>` : ''}
  </div>
  <div class="hero-visual fade-in delay-2">
    <div class="hexagon-wrapper">
      <div class="hex-frame"></div>
      <div class="hex-bg"></div>
      <div class="hex-inner">${avatarHtml}</div>
      ${bubble1}
      ${bubble2}
    </div>
  </div>
</div>
</section>
${aboutHtml}
${orderedSections}
${contactHtml}
<footer>
  <div class="footer-logo">${inits}<span>.</span></div>
  <p class="footer-copy">&#169; ${v.name}. All rights reserved.</p>
  ${footerSocials ? `<div class="footer-socials">${footerSocials}</div>` : ''}
</footer>
${CIRCUIT_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
