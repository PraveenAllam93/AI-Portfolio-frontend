/**
 * Template: Glitch
 * Neo-brutalist software-engineer theme — near-black (#0d0d0f) canvas with a
 * neon-green/pink/yellow palette, Black Han Sans display type + Space Mono labels.
 * Features: animated top color bar, noise overlay, custom cursor (published mode only),
 * fixed glass nav, full-bleed hero with grid + glow + giant stacked name,
 * numbered "00X / Label" section tags, brutalist bordered cards, scroll-reveal,
 * animated status blink. Fonts: Black Han Sans · Space Mono · DM Sans.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap';

function initials(name: string): string {
	const parts = name.trim().split(/\s+/);
	return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[1]?.[0] ?? '' : '')).toUpperCase() || '??';
}

/** First word as line 1, the remainder as line 2 (for the stacked hero logo only). */
function logoText(name: string): string {
	const parts = name.trim().split(/\s+/);
	return (parts[0] ?? 'PORT').toUpperCase();
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

function css(editMode: boolean): string {
	return `
:root{
  --bg:#0d0d0f;--bg2:#111116;--bg3:#16161e;
  --accent:#00ff94;--accent2:#ff3cac;--accent3:#ffd60a;--accent4:#7b5ea7;
  --text:#e8e8f0;--muted:#6b6b80;--card:#16161e;
  --border:rgba(255,255,255,0.07);--nav-h:64px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;overflow-x:hidden;line-height:1.6${editMode ? '' : ';cursor:none'}}
a{text-decoration:none;color:inherit}img{max-width:100%;display:block}ul{list-style:none}

/* CUSTOM CURSOR (published only) */
.cursor{width:12px;height:12px;background:var(--accent);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .1s ease,background .2s;mix-blend-mode:difference}
.cursor-ring{width:36px;height:36px;border:1.5px solid var(--accent);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .15s ease,width .2s,height .2s,opacity .2s;opacity:.5}

/* NOISE OVERLAY */
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");pointer-events:none;z-index:9997;opacity:.4}

/* TOP COLOR BAR */
.color-bar{position:fixed;top:0;left:0;right:0;height:3px;z-index:1100;background:linear-gradient(90deg,var(--accent2) 0%,var(--accent3) 40%,var(--accent) 80%,var(--accent4) 100%)}

/* NAV */
nav{position:fixed;top:3px;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:18px clamp(20px,5vw,48px);border-bottom:1px solid var(--border);backdrop-filter:blur(20px);background:rgba(13,13,15,0.85);height:var(--nav-h)}
.nav-logo{font-family:'Black Han Sans',sans-serif;font-size:1.1rem;letter-spacing:.08em;color:var(--text)}
.nav-logo span{color:var(--accent)}
.nav-links{display:flex;gap:32px;list-style:none}
.nav-links a{font-family:'Space Mono',monospace;font-size:.72rem;letter-spacing:.12em;color:var(--muted);text-transform:uppercase;transition:color .2s}
.nav-links a:hover,.nav-links a.active{color:var(--accent)}
.nav-badge{font-family:'Space Mono',monospace;font-size:.65rem;padding:6px 14px;border:1px solid var(--accent);color:var(--accent);letter-spacing:.1em;text-transform:uppercase;display:flex;align-items:center;gap:8px}
.nav-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent);animation:blink 1.5s infinite}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;background:none;border:none}
.hamburger span{display:block;width:24px;height:2px;background:var(--muted);transition:all .3s}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mobile-menu{display:none;position:fixed;top:calc(var(--nav-h) + 3px);left:0;right:0;background:rgba(13,13,15,0.97);backdrop-filter:blur(20px);padding:2rem;z-index:999;flex-direction:column;gap:1.25rem;border-bottom:1px solid var(--border)}
.mobile-menu.open{display:flex}
.mobile-menu a{font-family:'Space Mono',monospace;font-size:.85rem;letter-spacing:.12em;color:var(--muted);text-transform:uppercase;padding:.4rem 0;border-bottom:1px solid var(--border)}
.mobile-menu a:hover{color:var(--accent)}

@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

/* HERO */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px clamp(20px,5vw,48px) 60px;position:relative;overflow:hidden}
.hero-bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,148,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,148,.04) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%);mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%)}
.hero-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(0,255,148,.08) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-60%);pointer-events:none}
.hero-inner{position:relative;display:flex;flex-direction:column;align-items:center;z-index:2;width:100%}
.hero-avatar{width:96px;height:96px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);margin-bottom:28px;box-shadow:0 0 30px rgba(0,255,148,.25)}
.hero-avatar-zone{position:relative;width:96px;height:96px;border-radius:50%;margin-bottom:28px;border:2px solid var(--accent);box-shadow:0 0 30px rgba(0,255,148,.25);overflow:hidden;display:inline-flex}
.hero-avatar-zone .hero-avatar{width:100%;height:100%;margin:0;border:none;box-shadow:none;display:block}
.hero-tag{font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.2em;color:var(--accent);text-transform:uppercase;margin-bottom:24px;display:flex;align-items:center;gap:10px}
.hero-tag::before,.hero-tag::after{content:'';display:block;width:30px;height:1px;background:var(--accent)}
.hero-name{font-family:'Black Han Sans',sans-serif;font-size:clamp(56px,12vw,160px);line-height:.9;text-align:center;letter-spacing:-.02em;position:relative;color:var(--text);animation:heroReveal .8s cubic-bezier(0.16,1,0.3,1) both}
.hero-name::after{content:'';position:absolute;bottom:6px;left:8%;right:8%;height:10px;background:var(--accent3);z-index:-1;opacity:.28}
.hero-sub{font-family:'Black Han Sans',sans-serif;font-size:clamp(18px,3.5vw,40px);letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-top:16px;text-align:center;animation:heroReveal .8s .15s cubic-bezier(0.16,1,0.3,1) both}
@keyframes heroReveal{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
.hero-meta{margin-top:40px;display:flex;gap:32px;align-items:center;flex-wrap:wrap;justify-content:center;animation:heroReveal .8s .25s both}
.hero-meta-item{font-family:'Space Mono',monospace;font-size:.7rem;color:var(--muted);display:flex;align-items:center;gap:8px}
.hero-meta-item .dot{width:6px;height:6px;border-radius:50%;display:inline-block}
.hero-socials{margin-top:32px;display:flex;gap:14px;animation:heroReveal .8s .35s both}
.hero-social{width:40px;height:40px;border:1px solid var(--border);display:grid;place-items:center;font-family:'Space Mono',monospace;font-size:.7rem;font-weight:700;color:var(--muted);text-transform:lowercase;transition:all .2s}
.hero-social:hover{border-color:var(--accent);color:var(--accent)}
.hero-scroll{margin-top:54px;display:flex;flex-direction:column;align-items:center;gap:8px;animation:heroReveal .8s .45s both}
.scroll-line{width:1px;height:50px;background:linear-gradient(to bottom,var(--accent),transparent);animation:scrollPulse 2s infinite}
@keyframes scrollPulse{0%,100%{opacity:.4;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.2)}}
.scroll-label{font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.2em;color:var(--muted);text-transform:uppercase}

/* SECTION COMMONS */
section{padding:clamp(70px,10vw,100px) clamp(20px,8vw,48px);position:relative;z-index:1}
.wrap{max-width:1100px;margin:0 auto}
.section-label{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.25em;color:var(--accent);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:12px}
.section-label::after{content:'';flex:1;max-width:60px;height:1px;background:var(--accent);opacity:.5}
.section-title{font-family:'Black Han Sans',sans-serif;font-size:clamp(34px,5vw,64px);line-height:1;letter-spacing:-.01em;margin-bottom:56px}

/* REVEAL */
.reveal{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:none}
.reveal.d1{transition-delay:.1s}.reveal.d2{transition-delay:.2s}.reveal.d3{transition-delay:.3s}

/* ABOUT */
#about{background:var(--bg2);border-top:1px solid var(--border)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.bio-text{font-size:1rem;line-height:1.8;color:var(--text);font-weight:300}
.about-stats{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.stat-card{border:1px solid var(--border);padding:28px 24px;background:var(--card);position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.stat-card:nth-child(1)::before{background:var(--accent)}
.stat-card:nth-child(2)::before{background:var(--accent2)}
.stat-card:nth-child(3)::before{background:var(--accent3)}
.stat-card:nth-child(4)::before{background:var(--accent4)}
.stat-num{font-family:'Black Han Sans',sans-serif;font-size:2.6rem;line-height:1;margin-bottom:6px}
.stat-card:nth-child(1) .stat-num{color:var(--accent)}
.stat-card:nth-child(2) .stat-num{color:var(--accent2)}
.stat-card:nth-child(3) .stat-num{color:var(--accent3)}
.stat-card:nth-child(4) .stat-num{color:var(--accent4)}
.stat-label{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.15em;color:var(--muted);text-transform:uppercase}

/* EXPERIENCE */
#experience{background:var(--bg)}
.exp-list{display:flex;flex-direction:column;gap:2px}
.exp-card{background:var(--card);border:1px solid var(--border);padding:32px 32px;transition:border-color .2s;position:relative}
.exp-card:hover{border-color:var(--accent)}
.exp-head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:baseline;margin-bottom:6px}
.exp-role{font-family:'Black Han Sans',sans-serif;font-size:1.4rem;letter-spacing:-.01em;color:var(--text)}
.exp-period{font-family:'Space Mono',monospace;font-size:.7rem;color:var(--accent);white-space:nowrap;letter-spacing:.08em}
.exp-company{font-family:'Space Mono',monospace;font-size:.78rem;color:var(--accent3);letter-spacing:.06em;margin-bottom:16px}
.exp-desc{font-size:.92rem;line-height:1.75;color:var(--muted);font-weight:300;margin-bottom:18px}
.exp-points{list-style:none}
.exp-points li{font-size:.86rem;line-height:1.65;color:var(--muted);font-weight:300;padding:4px 0 4px 18px;position:relative}
.exp-points li::before{content:'\\2192';position:absolute;left:0;color:var(--accent);font-family:'Space Mono',monospace;font-size:.78rem}

/* SKILLS */
#skills{background:var(--bg2);border-top:1px solid var(--border)}
.skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.skill-group{background:var(--card);padding:32px 28px;border:1px solid var(--border);transition:border-color .2s,transform .2s}
.skill-group:hover{border-color:var(--accent);transform:translateY(-3px)}
.skill-group-name{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent2);margin-bottom:20px}
.skill-tags{display:flex;flex-wrap:wrap;gap:8px}
.skill-tag{font-family:'Space Mono',monospace;font-size:.7rem;padding:5px 12px;border:1px solid var(--border);color:var(--muted);letter-spacing:.05em;transition:all .2s}
.skill-group:hover .skill-tag{border-color:rgba(0,255,148,.2);color:var(--text)}

/* PROJECTS */
#projects{background:var(--bg);border-top:1px solid var(--border)}
.project-card{display:grid;grid-template-columns:1fr 2fr;border:1px solid var(--border);margin-bottom:2px;overflow:hidden;transition:border-color .3s;background:var(--card);position:relative}
.project-card:hover{border-color:var(--accent)}
.project-left{background:var(--bg);padding:40px 32px;border-right:1px solid var(--border);display:flex;flex-direction:column;justify-content:space-between;gap:24px;min-height:240px}
.project-left-top{display:flex;flex-direction:column;gap:14px}
.project-shots{position:relative;width:100%;aspect-ratio:4/3;border:1px solid var(--border);overflow:hidden;margin-top:4px;background:var(--bg)}
.project-shots img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity .7s ease}
.project-shots img.active{opacity:1}
.shot-dots{position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:center;gap:6px;z-index:2}
.shot-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35)}
.shot-dot.active{background:var(--accent)}
.project-num{font-family:'Black Han Sans',sans-serif;font-size:3.5rem;line-height:1;color:var(--border)}
.project-cat{font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.12em;color:var(--accent3);text-transform:uppercase}
.project-stack{display:flex;flex-wrap:wrap;gap:6px}
.stack-pill{font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.1em;padding:3px 10px;background:rgba(0,255,148,.08);color:var(--accent);text-transform:uppercase}
.project-right{padding:40px}
.project-title{font-family:'Black Han Sans',sans-serif;font-size:clamp(20px,2.5vw,30px);line-height:1.1;letter-spacing:-.01em;margin-bottom:16px;color:var(--text)}
.project-desc{font-size:.9rem;line-height:1.75;color:var(--muted);margin-bottom:20px;font-weight:300}
.project-block-label{font-family:'Space Mono',monospace;font-size:.58rem;letter-spacing:.18em;color:var(--accent2);text-transform:uppercase;margin:0 0 8px}
.project-list{list-style:none;margin-bottom:20px}
.project-list li{font-size:.85rem;line-height:1.6;color:var(--muted);font-weight:300;padding:4px 0 4px 16px;position:relative}
.project-list li::before{content:'\\2192';position:absolute;left:0;color:var(--accent);font-family:'Space Mono',monospace;font-size:.75rem}
.project-list.outcomes li::before{content:'\\2713';color:var(--accent3)}
.project-tools{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
.project-tool{font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.08em;padding:3px 10px;border:1px solid var(--border);color:var(--muted)}
.project-links{display:flex;gap:14px;flex-wrap:wrap}
.project-link{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;padding:10px 20px;transition:all .2s}
.project-link.primary{background:var(--accent);color:var(--bg)}
.project-link.primary:hover{background:var(--accent3)}
.project-link.secondary{border:1px solid var(--border);color:var(--muted)}
.project-link.secondary:hover{border-color:var(--accent);color:var(--accent)}

/* ACHIEVEMENTS / AWARDS */
#achievements{background:var(--bg2);border-top:1px solid var(--border)}
#awards{background:var(--bg);border-top:1px solid var(--border)}
.ach-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.ach-card{background:var(--card);border:1px solid var(--border);padding:32px 28px 64px;transition:all .2s;position:relative;overflow:hidden}
.ach-card:hover{border-color:var(--accent2);transform:translateY(-4px)}
.ach-year{font-family:'Black Han Sans',sans-serif;font-size:2.2rem;line-height:1;color:var(--border);position:absolute;right:20px;bottom:14px;pointer-events:none;z-index:0}
.ach-title{font-family:'DM Sans',sans-serif;font-weight:500;font-size:1rem;margin-bottom:10px;line-height:1.4;position:relative;z-index:1}
.ach-desc{font-size:.82rem;line-height:1.65;color:var(--muted);font-weight:300;position:relative;z-index:1}

/* EDUCATION & CERTS */
#education{background:var(--bg);border-top:1px solid var(--border)}
#certifications{background:var(--bg2);border-top:1px solid var(--border)}
.edu-list{display:flex;flex-direction:column;gap:16px;max-width:820px}
.edu-item{border-left:2px solid var(--accent);padding:20px 24px;background:var(--card)}
.edu-degree{font-weight:500;font-size:1rem;margin-bottom:4px}
.edu-field{font-size:.84rem;color:var(--muted);margin-bottom:6px}
.edu-inst{font-family:'Space Mono',monospace;font-size:.66rem;color:var(--accent3);letter-spacing:.08em}
.edu-grade{font-size:.8rem;color:var(--muted);margin-top:6px}
.cert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.cert-item{border-left:2px solid var(--accent2);padding:20px 24px;background:var(--card);display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.cert-name{font-weight:500;font-size:.95rem;margin-bottom:4px}
.cert-issuer{font-size:.82rem;color:var(--muted)}
.cert-year{font-family:'Black Han Sans',sans-serif;font-size:1.4rem;color:var(--accent2);white-space:nowrap}

/* CAMPAIGNS / FINANCE / INVEST */
#campaigns{background:var(--bg);border-top:1px solid var(--border)}
#financial_modeling{background:var(--bg2);border-top:1px solid var(--border)}
#investment_portfolios{background:var(--bg);border-top:1px solid var(--border)}
.gcard-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2px}
.gcard{background:var(--card);border:1px solid var(--border);padding:28px 26px;transition:border-color .2s;position:relative}
.gcard:hover{border-color:var(--accent)}
.gcard-title{font-family:'Black Han Sans',sans-serif;font-size:1.1rem;letter-spacing:-.01em;color:var(--text);margin-bottom:8px}
.gcard-meta{font-size:.84rem;color:var(--muted);font-weight:300;line-height:1.6;margin-bottom:4px}
.gcard-ret{font-size:.84rem;color:var(--accent)}
.gcard-metric{font-size:.82rem;color:var(--muted);padding:3px 0 3px 16px;position:relative}
.gcard-metric::before{content:'\\2192';position:absolute;left:0;color:var(--accent);font-family:'Space Mono',monospace;font-size:.72rem}

/* DESIGN PHILOSOPHY / SOFTWARE PROFICIENCY */
#design_philosophy{background:var(--bg);border-top:1px solid var(--border)}
.dp-text{font-size:1.05rem;line-height:1.85;color:var(--muted);font-weight:300;max-width:760px}
#software_proficiency{background:var(--bg2);border-top:1px solid var(--border)}
.sp-tags{display:flex;flex-wrap:wrap;gap:8px}
.sp-tag{font-family:'Space Mono',monospace;font-size:.7rem;padding:5px 12px;border:1px solid var(--border);color:var(--muted);letter-spacing:.05em}

/* CUSTOM SECTIONS */
.cs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2px}

/* CONTACT */
#contact{background:var(--bg);border-top:1px solid var(--border);text-align:center;padding:clamp(90px,12vw,120px) clamp(20px,8vw,48px)}
.contact-big{font-family:'Black Han Sans',sans-serif;font-size:clamp(36px,7vw,90px);line-height:1;letter-spacing:-.02em;margin-bottom:42px}
.contact-big .hl{color:var(--accent)}
.contact-info{display:flex;flex-direction:column;gap:10px;align-items:center;margin-bottom:42px}
.contact-line{font-family:'Space Mono',monospace;font-size:.8rem;color:var(--muted);letter-spacing:.06em}
.contact-line span{color:var(--accent)}
.contact-links{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-bottom:48px}
.contact-btn{font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;padding:14px 32px;transition:all .2s}
.contact-btn.primary{background:var(--accent);color:var(--bg)}
.contact-btn.primary:hover{background:var(--accent3)}
.contact-btn.outline{border:1px solid var(--muted);color:var(--muted)}
.contact-btn.outline:hover{border-color:var(--accent);color:var(--accent)}
.social-row{display:flex;justify-content:center;gap:28px;flex-wrap:wrap}
.social-link{font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);transition:color .2s}
.social-link:hover{color:var(--accent)}

/* ADD / DELETE (edit mode) */
.add-btn{display:block;margin-top:14px;padding:9px 16px;border:2px dashed rgba(0,255,148,.3);background:rgba(0,255,148,.04);color:var(--accent);font-family:'Space Mono',monospace;font-size:.78rem;letter-spacing:.08em;cursor:pointer;width:100%;text-align:center;text-transform:uppercase}
.add-btn:hover{background:rgba(0,255,148,.08);border-color:var(--accent)}
.del-btn{display:none;position:absolute;top:8px;right:8px;width:22px;height:22px;border-radius:50%;border:none;background:rgba(255,60,172,.18);color:var(--accent2);font-size:13px;line-height:22px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}

/* FOOTER */
footer{background:var(--bg2);border-top:1px solid var(--border);padding:24px clamp(20px,8vw,48px);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;position:relative;z-index:1}
.footer-name{font-family:'Black Han Sans',sans-serif;font-size:.9rem;letter-spacing:.05em;color:var(--muted)}
.footer-status{display:flex;align-items:center;gap:8px;font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.1em;color:var(--accent);text-transform:uppercase}
.footer-status::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent);animation:blink 1.5s infinite}
.footer-copy{font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.1em;color:var(--muted);text-transform:uppercase}

/* RESPONSIVE */
@media(max-width:900px){
  .about-grid{grid-template-columns:1fr;gap:40px}
  .skills-grid{grid-template-columns:repeat(2,1fr)}
  .ach-grid{grid-template-columns:repeat(2,1fr)}
  .project-card{grid-template-columns:1fr}
  .project-left{min-height:auto;border-right:none;border-bottom:1px solid var(--border)}
}
@media(max-width:768px){
  .nav-links,.nav-badge{display:none}
  .hamburger{display:flex}
}
@media(max-width:520px){
  .skills-grid,.ach-grid{grid-template-columns:1fr}
  .about-stats{grid-template-columns:1fr 1fr}
  .cert-item{flex-direction:column}
}
`;
}

const GLITCH_SCRIPT = `<script>
(function(){
  // Custom cursor (only present in published mode)
  var cursor=document.getElementById('cursor');
  var ring=document.getElementById('cursorRing');
  if(cursor&&ring){
    document.addEventListener('mousemove',function(e){
      cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';
      setTimeout(function(){ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';},80);
    });
    document.querySelectorAll('a,button').forEach(function(el){
      el.addEventListener('mouseenter',function(){ring.style.width='56px';ring.style.height='56px';ring.style.opacity='1';});
      el.addEventListener('mouseleave',function(){ring.style.width='36px';ring.style.height='36px';ring.style.opacity='0.5';});
    });
  }
  // Nav glass shadow + active link
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
    },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){so.observe(s)});
  }
  // Hamburger
  var ham=document.getElementById('hamburger');
  var mob=document.getElementById('mobileMenu');
  if(ham&&mob){
    ham.addEventListener('click',function(){ham.classList.toggle('open');mob.classList.toggle('open');});
    mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ham.classList.remove('open');mob.classList.remove('open');});});
  }
  // Scroll reveal
  var fades=document.querySelectorAll('.reveal');
  if(fades.length){
    var fo=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');fo.unobserve(e.target);}});
    },{threshold:0.12});
    fades.forEach(function(el){fo.observe(el);});
  }
  // Project image slideshow — crossfade through all images, looping
  document.querySelectorAll('.project-shots').forEach(function(box){
    var imgs=box.querySelectorAll('.project-shot');
    if(imgs.length<2)return;
    var dots=box.querySelectorAll('.shot-dot');
    var idx=0;
    setInterval(function(){
      imgs[idx].classList.remove('active');
      if(dots[idx])dots[idx].classList.remove('active');
      idx=(idx+1)%imgs.length;
      imgs[idx].classList.add('active');
      if(dots[idx])dots[idx].classList.add('active');
    },3000);
  });
})();
<\/script>`;

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const inits = initials(v.name);
	const logo = logoText(v.name);

	// Stat overrides (manual override wins, else auto-computed)
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const achCount = v.template_overrides?.achievements_count ?? (v.achievements?.length ?? 0);
	const ted = (key: string) => (v.edit_mode ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	// ── Section number counter (for "00X / Label" tags) ──
	let secNum = 0;
	const num = () => String(++secNum).padStart(3, '0');

	// ── Nav anchors ──
	const NAV_LABELS: Record<string, string> = {
		about: 'About', experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certs', achievements: 'Awards',
		awards: 'Honours', campaigns: 'Campaigns', financial_modeling: 'Finance',
		investment_portfolios: 'Investments', design_philosophy: 'Philosophy',
		software_proficiency: 'Tools', contact: 'Contact',
	};
	const navAnchors: string[] = [];
	if (v.bio || v.skill_groups?.length) navAnchors.push('about');
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (key === 'custom_sections') {
			for (const cs of v.custom_sections ?? []) {
				if (cs.items?.length) navAnchors.push(cs.section_id);
			}
			continue;
		}
		const dk = key === 'skills' ? 'skill_groups' : key;
		const d = (v as unknown as Record<string, unknown>)[dk];
		if (d && (Array.isArray(d) ? d.length > 0 : Boolean(d))) navAnchors.push(key);
	}
	if (v.email || v.phone || v.location) navAnchors.push('contact');

	const navItems = navAnchors.map((a) => `<li><a href="#${a}">${NAV_LABELS[a] ?? a}</a></li>`).join('');
	const mobileItems = navAnchors.map((a) => `<a href="#${a}">${NAV_LABELS[a] ?? a}</a>`).join('');

	// ── Hero socials ──
	const socials = [
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" class="hero-social">gh</a>` : '',
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" class="hero-social">in</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" class="hero-social">x</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" class="hero-social">www</a>` : '',
	].filter(Boolean).join('');

	const heroMeta = [
		v.location ? `<div class="hero-meta-item"><span class="dot" style="background:var(--accent)"></span><span ${_editable('profile.location')}>${v.location}</span></div>` : '',
		statShown(v, 'years_experience', years) ? `<div class="hero-meta-item"><span class="dot" style="background:var(--accent3)"></span><span ${ted('years_experience')}>${years}</span>+ Years Experience</div>` : '',
		v.email ? `<div class="hero-meta-item"><span class="dot" style="background:var(--accent4)"></span><span ${_editable('profile.email')}>${v.email}</span></div>` : '',
	].filter(Boolean).join('');

	const avatarImg = v.profile_image ? `<img class="hero-avatar" src="${v.profile_image}" alt="${v.name}">` : '';
	const avatarHtml = v.edit_mode
		? `<div class="hero-avatar-zone" ${_imgUpload('profile.profile_image', v.edit_mode)}>${avatarImg}</div>`
		: avatarImg;

	// ── ABOUT ──
	const aboutHtml = v.bio || v.skill_groups?.length
		? (() => {
			const statsHtml = [
				statShown(v, 'years_experience', years) ? `<div class="stat-card reveal">
  <div class="stat-num"><span ${ted('years_experience')}>${years}</span>+</div>
  <div class="stat-label">Years Building</div>
</div>` : '',
				statShown(v, 'projects_count', projCount) ? `<div class="stat-card reveal d1">
  <div class="stat-num"><span ${ted('projects_count')}>${projCount}</span>+</div>
  <div class="stat-label">Projects Shipped</div>
</div>` : '',
				statShown(v, 'certifications_count', certCount) ? `<div class="stat-card reveal d2">
  <div class="stat-num"><span ${ted('certifications_count')}>${certCount}</span></div>
  <div class="stat-label">Certifications</div>
</div>` : '',
				statShown(v, 'achievements_count', achCount) ? `<div class="stat-card reveal d3">
  <div class="stat-num"><span ${ted('achievements_count')}>${achCount}</span></div>
  <div class="stat-label">Achievements</div>
</div>` : '',
			].filter(Boolean).join('');
			return `<section id="about"><div class="wrap"><div class="about-grid">
<div class="reveal">
  <div class="section-label">${num()} / About</div>
  <h2 class="section-title">WHO IS<br>${inits}?</h2>
  ${v.bio ? `<p class="bio-text" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
</div>
${statsHtml ? `<div class="about-stats">${statsHtml}</div>` : ''}
</div></div></section>`;
		})()
		: '';

	// ── EXPERIENCE ──
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience"><div class="wrap">
<div class="section-label reveal">${num()} / Career</div>
<h2 class="section-title reveal">WORK<br>HISTORY</h2>
<div class="exp-list">
${v.experience.map((exp, i) => `<div class="exp-card reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
<div class="exp-head">
  <span class="exp-role" ${_editable(`experience.${i}.role`)}>${exp.role}</span>
  ${_rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, v.edit_mode) ? `<span class="exp-period">${_rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, v.edit_mode)}</span>` : ''}
</div>
${(exp.company || exp.location) ? `<div class="exp-company"><span ${_editable(`experience.${i}.company`)}>${exp.company || ''}</span>${(exp.location) ? ` // <span ${_editable(`experience.${i}.location`)}>${exp.location || ''}</span>` : ''}</div>` : ''}
${exp.description ? `<p class="exp-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="exp-points" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</div></section>` : '';

	// ── SKILLS ──
	const skillsHtml = !hidden.has('skills') && v.skill_groups?.length
		? `<section id="skills"><div class="wrap">
<div class="section-label reveal">${num()} / Skills</div>
<h2 class="section-title reveal">TECH<br>STACK</h2>
<div class="skills-grid">
${v.skill_groups.map((g, i) => `<div class="skill-group reveal${i % 3 ? ' d' + (i % 3) : ''}" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${i}">&#x2715;</button>
<div class="skill-group-name" ${_editable(`skills.${i}.category`)}>${g.category}</div>
<div class="skill-tags" ${_listEditable(`skills.${i}.skills`)}>${g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
</div></section>` : '';

	// ── PROJECTS ──
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section id="projects"><div class="wrap">
<div class="section-label reveal">${num()} / Work</div>
<h2 class="section-title reveal">FEATURED<br>PROJECTS</h2>
${v.projects.map((p, i) => {
		const stack = p.tech_stack ?? [];
		const stackPills = stack.length
			? `<div class="project-stack" ${_listEditable(`projects.${i}.tech_stack`)}>${stack.map((t) => `<span class="stack-pill">${t}</span>`).join('')}</div>`
			: '';
		const resp = p.responsibilities?.length
			? `<p class="project-block-label">Responsibilities</p><ul class="project-list" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>`
			: '';
		const outcomes = p.measurable_outcomes?.length
			? `<p class="project-block-label">Outcomes</p><ul class="project-list outcomes" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map((o) => `<li>${o}</li>`).join('')}</ul>`
			: '';
		const tools = p.software_used?.length
			? `<div class="project-tools" ${_listEditable(`projects.${i}.software_used`)}>${p.software_used.map((t) => `<span class="project-tool">${t}</span>`).join('')}</div>`
			: '';
		const links = [
			p.project_url ? `<a href="${p.project_url}" class="project-link primary" target="_blank" rel="noopener noreferrer">Live Demo</a>` : '',
			p.github_repo ? `<a href="${p.github_repo}" class="project-link secondary" target="_blank" rel="noopener noreferrer">GitHub Repo</a>` : '',
		].filter(Boolean).join('');
		const gallery = p.images?.length
			? `<div class="project-shots" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}>${p.images.map((im, k) => `<img class="project-shot${k === 0 ? ' active' : ''}" src="${im}" alt="${p.title}" loading="lazy">`).join('')}${p.images.length > 1 ? `<div class="shot-dots">${p.images.map((_, k) => `<span class="shot-dot${k === 0 ? ' active' : ''}"></span>`).join('')}</div>` : ''}</div>`
			: (v.edit_mode ? `<div class="project-shots" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}></div>` : '');
		return `<div class="project-card reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
<div class="project-left">
  <div class="project-left-top">
    <div class="project-num">${String(i + 1).padStart(2, '0')}</div>
    ${p.project_category ? `<div class="project-cat" ${_editable(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
    ${gallery}
  </div>
  ${stackPills}
</div>
<div class="project-right">
  <div class="project-title" ${_editable(`projects.${i}.title`)}>${p.title}</div>
  ${p.description ? `<p class="project-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
  ${resp}
  ${outcomes}
  ${tools}
  ${links ? `<div class="project-links">${links}</div>` : ''}
</div>
</div>`;
	}).join('\n')}
<button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</div></section>` : '';

	// ── EDUCATION ──
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section id="education"><div class="wrap">
<div class="section-label reveal">${num()} / Background</div>
<h2 class="section-title reveal">EDUCATION</h2>
<div class="edu-list">
${v.education.map((edu, i) => `<div class="edu-item reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
<div class="edu-degree" ${_editable(`education.${i}.degree`)}>${edu.degree || 'Degree'}</div>
${edu.field_of_study ? `<div class="edu-field" ${_editable(`education.${i}.field_of_study`)}>${edu.field_of_study}</div>` : ''}
${(edu.institution || edu.start_year || edu.end_year || v.edit_mode) ? `<div class="edu-inst"><span ${_editable(`education.${i}.institution`)}>${edu.institution || ''}</span>${_rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, v.edit_mode, '–') ? ` · ${_rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, v.edit_mode, '–')}` : ''}</div>` : ''}
${edu.grade_or_score ? `<div class="edu-grade" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</div></section>` : '';

	// ── CERTIFICATIONS ──
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section id="certifications"><div class="wrap">
<div class="section-label reveal">${num()} / Credentials</div>
<h2 class="section-title reveal">CERTS</h2>
<div class="cert-grid">
${v.certifications.map((c, i) => `<div class="cert-item reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
<div>
  <div class="cert-name" ${_editable(`certifications.${i}.name`)}>${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name}</div>
  ${c.issuer ? `<div class="cert-issuer" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
</div>
${c.year ? `<div class="cert-year" ${_editable(`certifications.${i}.year`)}>${c.year}</div>` : ''}
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</div></section>` : '';

	// ── ACHIEVEMENTS ──
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section id="achievements"><div class="wrap">
<div class="section-label reveal">${num()} / Recognition</div>
<h2 class="section-title reveal">AWARDS &<br>HIGHLIGHTS</h2>
<div class="ach-grid">
${v.achievements.map((a, i) => `<div class="ach-card reveal${i % 3 ? ' d' + (i % 3) : ''}" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
${a.year ? `<div class="ach-year" ${_editable(`achievements.${i}.year`)}>${a.year}</div>` : ''}
<div class="ach-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="ach-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
<button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</div></section>` : '';

	// ── AWARDS ──
	const awardsHtml = !hidden.has('awards') && v.awards?.length
		? `<section id="awards"><div class="wrap">
<div class="section-label reveal">${num()} / Honours</div>
<h2 class="section-title reveal">AWARDS</h2>
<div class="ach-grid">
${v.awards.map((a, i) => `<div class="ach-card reveal${i % 3 ? ' d' + (i % 3) : ''}" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="awards" data-del-index="${i}">&#x2715;</button>
${a.year ? `<div class="ach-year" ${_editable(`awards.${i}.year`)}>${a.year}</div>` : ''}
<div class="ach-title" ${_editable(`awards.${i}.title`)}>${a.title}</div>
${a.awarding_body ? `<div class="ach-desc" ${_editable(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}
</div>`).join('\n')}
</div>
</div></section>` : '';

	// ── CAMPAIGNS ──
	const campaignsHtml = !hidden.has('campaigns') && v.campaigns?.length
		? `<section id="campaigns"><div class="wrap">
<div class="section-label reveal">${num()} / Marketing</div>
<h2 class="section-title reveal">CAMPAIGNS</h2>
<div class="gcard-grid">
${v.campaigns.map((c, i) => {
		const metrics = c.performance_metrics?.length
			? `<div ${_listEditable(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map((m) => `<div class="gcard-metric">${m}</div>`).join('')}</div>`
			: '';
		return `<div class="gcard reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="campaigns" data-del-index="${i}">&#x2715;</button>
<div class="gcard-title" ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</div>
${c.campaign_type ? `<div class="gcard-meta" ${_editable(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}
${metrics}
</div>`;
	}).join('\n')}
</div>
</div></section>` : '';

	// ── FINANCIAL MODELING ──
	const finHtml = !hidden.has('financial_modeling') && v.financial_modeling?.length
		? `<section id="financial_modeling"><div class="wrap">
<div class="section-label reveal">${num()} / Finance</div>
<h2 class="section-title reveal">FINANCIAL<br>MODELING</h2>
<div class="gcard-grid">
${v.financial_modeling.map((f, i) => {
		const tools = f.tools_used?.length
			? `<div class="project-tools" ${_listEditable(`financial_modeling.${i}.tools_used`)}>${f.tools_used.map((t) => `<span class="project-tool">${t}</span>`).join('')}</div>`
			: '';
		return `<div class="gcard reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">&#x2715;</button>
<div class="gcard-title" ${_editable(`financial_modeling.${i}.model_type`)}>${f.model_type}</div>
${f.outcome ? `<div class="gcard-meta" ${_editable(`financial_modeling.${i}.outcome`)}>${f.outcome}</div>` : ''}
${tools}
</div>`;
	}).join('\n')}
</div>
</div></section>` : '';

	// ── INVESTMENT PORTFOLIOS ──
	const invHtml = !hidden.has('investment_portfolios') && v.investment_portfolios?.length
		? `<section id="investment_portfolios"><div class="wrap">
<div class="section-label reveal">${num()} / Finance</div>
<h2 class="section-title reveal">INVESTMENT<br>PORTFOLIO</h2>
<div class="gcard-grid">
${v.investment_portfolios.map((p, i) => `<div class="gcard reveal" data-item-wrap>
<button class="del-btn ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">&#x2715;</button>
<div class="gcard-title" ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${p.portfolio_type}</div>
${p.assets_under_management ? `<div class="gcard-meta" ${_editable(`investment_portfolios.${i}.assets_under_management`)}>AUM: ${p.assets_under_management}</div>` : ''}
${p.performance_return ? `<div class="gcard-ret" ${_editable(`investment_portfolios.${i}.performance_return`)}>Return: ${p.performance_return}</div>` : ''}
</div>`).join('\n')}
</div>
</div></section>` : '';

	// ── DESIGN PHILOSOPHY ──
	const designHtml = !hidden.has('design_philosophy') && v.design_philosophy
		? `<section id="design_philosophy"><div class="wrap">
<div class="section-label reveal">${num()} / Approach</div>
<h2 class="section-title reveal">PHILOSOPHY</h2>
<p class="dp-text reveal" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p>
</div></section>` : '';

	// ── SOFTWARE PROFICIENCY ──
	const softwareHtml = !hidden.has('software_proficiency') && v.software_proficiency?.length
		? `<section id="software_proficiency"><div class="wrap">
<div class="section-label reveal">${num()} / Tools</div>
<h2 class="section-title reveal">SOFTWARE</h2>
<div class="sp-tags reveal">${v.software_proficiency.map((s) => `<span class="sp-tag">${s}</span>`).join('')}</div>
</div></section>` : '';

	// ── CUSTOM SECTIONS ──
	const customSectionsHtml = !hidden.has('custom_sections') && (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length) return '';
			const items = cs.items.map((item, i) => `<div class="gcard reveal" data-item-wrap data-cs-idx="${csIdx}">
<button class="del-btn ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>
${item.label ? `<div class="gcard-title" ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.subtitle ? `<div class="gcard-meta" style="color:var(--accent3)" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.value ? `<div class="gcard-meta" ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="project-tools" style="margin-top:10px" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map((t) => `<span class="project-tool">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="social-link" style="margin-top:10px;display:inline-block" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}"><div class="wrap">
<div class="section-label reveal">${num()} / Custom</div>
<h2 class="section-title reveal" ${v.edit_mode ? _editable(`custom_sections.${csIdx}.title`) : ''}>${cs.title}</h2>
<div class="${cs.display_type === 'list' ? 'edu-list' : 'gcard-grid'}">${items}</div>
<button class="add-btn ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>
</div></section>`;
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
		.filter((k) => !hidden.has(k) && k in sectionMap)
		.map((k) => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	// ── CONTACT ──
	const contactSocials = [
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" class="social-link">GitHub</a>` : '',
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" class="social-link">LinkedIn</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" class="social-link">Twitter / X</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" class="social-link">Website</a>` : '',
	].filter(Boolean).join('');

	const contactHtml = v.email || v.phone || v.location
		? `<section id="contact">
<div class="section-label reveal" style="justify-content:center">${num()} / Contact</div>
<div class="contact-big reveal">LET'S<br>BUILD <span class="hl">TOGETHER</span></div>
<div class="contact-info reveal">
  ${v.email ? `<div class="contact-line">Email: <span ${_editable('profile.email')}>${v.email}</span></div>` : ''}
  ${v.phone ? `<div class="contact-line">Phone: <span ${_editable('profile.phone')}>${v.phone}</span></div>` : ''}
  ${v.location ? `<div class="contact-line">Location: <span ${_editable('profile.location')}>${v.location}</span></div>` : ''}
</div>
<div class="contact-links reveal">
  ${v.email ? `<a href="mailto:${v.email}" class="contact-btn primary">Send Email</a>` : ''}
  ${v.portfolio_url ? `<a href="${v.portfolio_url}" class="contact-btn outline" target="_blank" rel="noopener noreferrer">View Website</a>` : ''}
</div>
${contactSocials ? `<div class="social-row reveal">${contactSocials}</div>` : ''}
</section>` : '';

	// ── Cursor markup (published mode only — keeps inline editing usable) ──
	const cursorHtml = v.edit_mode ? '' : `<div class="cursor" id="cursor"></div><div class="cursor-ring" id="cursorRing"></div>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css(v.edit_mode)}</style>
</head>
<body>
<div class="color-bar"></div>
${cursorHtml}
<nav id="navbar">
  <a href="#hero" class="nav-logo">${logo}<span>.DEV</span></a>
  <ul class="nav-links">${navItems}</ul>
  <div class="nav-badge">Open to Work</div>
  <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
</nav>
<div class="mobile-menu" id="mobileMenu">${mobileItems}</div>

<section class="hero" id="hero">
  <div class="hero-bg-grid"></div>
  <div class="hero-glow"></div>
  <div class="hero-inner">
    ${avatarHtml}
    ${v.profile_headline ? `<div class="hero-tag" ${_editable('profile.headline')}>${v.profile_headline}</div>` : ''}
    <h1 class="hero-name" ${_editable('profile.full_name')}>${v.name}</h1>
    ${v.headline ? `<p class="hero-sub" ${_editable('portfolio.headline')}>${v.headline}</p>` : ''}
    ${heroMeta ? `<div class="hero-meta">${heroMeta}</div>` : ''}
    ${socials ? `<div class="hero-socials">${socials}</div>` : ''}
    <div class="hero-scroll"><div class="scroll-line"></div><span class="scroll-label">Scroll</span></div>
  </div>
</section>
${aboutHtml}
${orderedSections}
${contactHtml}
<footer>
  <div class="footer-name">${v.name.toUpperCase()}</div>
  <div class="footer-status">Available for work</div>
  <div class="footer-copy">&#169; ${new Date().getFullYear()} — All rights reserved</div>
</footer>
${GLITCH_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
