/**
 * Template: Atelier (Designer)
 * Warm monochrome editorial — cream paper (#f8f6f2) + ink, no chromatic accent.
 * Cormorant Garamond serif · Space Mono labels · Outfit body. Film-noise overlay,
 * custom cursor (published-only, Z13), big index numerals, split hero, hover-invert
 * experience rows, dark skills band, award marquee, scroll reveals.
 * Ported from "Product Designer-2.html", mapped to our designer data model
 * (renders every designer section; skill % bars → skill lists per Z16).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/(19|20)\d{2}/);
		if (m) { const y = parseInt(m[0], 10); if (y < earliest) earliest = y; }
	}
	if (!isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}

function css(em: boolean): string {
	return `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --ink:#0a0a0a;--ink-80:#1f1f1f;--ink-60:#404040;--ink-40:#666;--ink-20:#999;--ink-10:#bbb;
  --paper:#f8f6f2;--paper-2:#eeece8;--white:#fff;--rule:rgba(10,10,10,0.12);
  --serif:'Cormorant Garamond',Georgia,serif;--mono:'Space Mono',monospace;--sans:'Outfit',sans-serif;
}
html{scroll-behavior:smooth}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-weight:300;overflow-x:hidden${em ? '' : ';cursor:none'}}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
${em ? '' : `#cursor{position:fixed;width:8px;height:8px;background:var(--ink);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .2s,height .2s;mix-blend-mode:multiply}
#cursor-ring{position:fixed;width:36px;height:36px;border:1px solid var(--ink-40);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .12s cubic-bezier(.25,.46,.45,.94),width .2s,height .2s}
@media(hover:none){#cursor,#cursor-ring{display:none}}`}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");opacity:.025;pointer-events:none;z-index:9990}

nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1.5rem 4rem;mix-blend-mode:multiply}
.nav-logo{font-family:var(--serif);font-size:1.1rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink)}
.nav-links{display:flex;gap:2.5rem;list-style:none}
.nav-links a{font-family:var(--mono);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-60);transition:color .2s}
.nav-links a:hover{color:var(--ink)}
@media(max-width:900px){nav{padding:1.2rem 2rem}.nav-links{display:none}}

section{position:relative}
.section-label{font-family:var(--mono);font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--ink-40)}
.reveal{opacity:0;transform:translateY(32px);transition:opacity .8s cubic-bezier(.25,.46,.45,.94),transform .8s cubic-bezier(.25,.46,.45,.94)}
.reveal.visible{opacity:1;transform:translateY(0)}
.section-number{font-family:var(--serif);font-size:7rem;font-weight:700;color:var(--rule);line-height:1;position:absolute;right:4rem;top:4rem;pointer-events:none;user-select:none}
.d-title{font-family:var(--serif);font-size:clamp(3rem,5vw,5rem);font-weight:300;line-height:1}
.d-title em{font-style:italic}
.d-head{margin-bottom:5rem}

/* HERO */
#hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--rule)}
.hero-left{padding:12rem 4rem 6rem;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid var(--rule)}
.hero-eyebrow{display:flex;align-items:center;gap:1rem;margin-bottom:3rem}
.hero-eyebrow .dot{width:6px;height:6px;border-radius:50%;background:var(--ink)}
.hero-name{font-family:var(--serif);font-size:clamp(4rem,8vw,8rem);font-weight:300;line-height:.9;letter-spacing:-.02em;color:var(--ink)}
.hero-name em{font-style:italic;color:var(--ink-60)}
.hero-footer{display:flex;align-items:flex-end;justify-content:space-between}
.hero-role{font-family:var(--mono);font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-40);line-height:2}
.hero-scroll{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-20);writing-mode:vertical-rl;transform:rotate(180deg);animation:bob 2s ease-in-out infinite}
@keyframes bob{0%,100%{transform:rotate(180deg) translateY(0)}50%{transform:rotate(180deg) translateY(8px)}}
.hero-right{padding:12rem 4rem 6rem;display:flex;flex-direction:column;justify-content:flex-end}
.hero-bio{font-family:var(--serif);font-size:1.5rem;font-weight:300;line-height:1.6;color:var(--ink-80);max-width:420px;margin-bottom:3rem}
.hero-stats{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
.stat-num{font-family:var(--serif);font-size:3rem;font-weight:600;line-height:1;color:var(--ink)}
.stat-label{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-40);margin-top:.4rem}
.availability{margin-top:3rem;display:inline-flex;align-items:center;gap:.75rem;font-family:var(--mono);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-60);border:1px solid var(--rule);padding:.75rem 1.25rem;width:fit-content}
.avail-dot{width:6px;height:6px;border-radius:50%;background:#3a3a3a;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@media(max-width:900px){#hero{grid-template-columns:1fr}.hero-left{padding:8rem 2rem 3rem;border-right:none;border-bottom:1px solid var(--rule)}.hero-right{padding:3rem 2rem 5rem}}

/* ABOUT */
#about{padding:8rem 4rem;display:grid;grid-template-columns:1fr 2fr;gap:6rem;border-bottom:1px solid var(--rule)}
.about-title{font-family:var(--serif);font-size:clamp(3rem,5vw,5rem);font-weight:300;line-height:1;margin:1.5rem 0 3rem}
.about-title em{font-style:italic}
.about-body{font-family:var(--serif);font-size:1.35rem;font-weight:300;line-height:1.7;color:var(--ink-80);margin-bottom:2rem}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:3rem}
.about-card{background:var(--white);border:1px solid var(--rule);padding:1.5rem;transition:background .3s}
.about-card:hover{background:var(--ink)}
.about-card:hover .ac-title,.about-card:hover .ac-body{color:var(--paper)}
.ac-title{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-40);margin-bottom:.75rem;transition:color .3s}
.ac-body{font-family:var(--serif);font-size:1rem;font-weight:400;line-height:1.5;color:var(--ink);transition:color .3s}
@media(max-width:900px){#about{grid-template-columns:1fr;padding:5rem 2rem;gap:2rem}.about-grid{grid-template-columns:1fr}}

/* PROJECTS */
.d-sec{padding:8rem 4rem;border-bottom:1px solid var(--rule);position:relative}
.work-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem}
.work-item{display:flex;flex-direction:column;gap:1rem;position:relative}
.work-item:nth-child(even){margin-top:3rem}
.work-thumb{position:relative;aspect-ratio:4/3;background:var(--paper-2);overflow:hidden;border:1px solid var(--rule)}
.work-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.work-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-20)}
.work-title{font-family:var(--serif);font-size:1.8rem;font-weight:600;line-height:1.1}
.work-cat{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-40)}
.work-desc{font-size:.9rem;font-weight:300;line-height:1.7;color:var(--ink-60)}
.proj-pts{list-style:none;margin-top:.4rem;display:flex;flex-direction:column;gap:.35rem}
.proj-pts li{font-size:.82rem;color:var(--ink-60);line-height:1.55;padding-left:.9rem;position:relative}
.proj-pts li::before{content:'—';position:absolute;left:0;color:var(--ink-40)}
.work-tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}
.work-tag{font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-40);border:1px solid var(--rule);padding:.3rem .75rem}
.work-link{font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink);border-bottom:1px solid var(--ink);width:fit-content;padding-bottom:2px}
@media(max-width:900px){.work-grid{grid-template-columns:1fr}.work-item:nth-child(even){margin-top:0}}

/* EXPERIENCE */
.exp-item{display:grid;grid-template-columns:180px 1fr 160px;gap:3rem;padding:2.5rem 0;border-top:1px solid var(--rule);position:relative}
.exp-item:last-of-type{border-bottom:1px solid var(--rule)}
.exp-item::before{content:'';position:absolute;left:-4rem;right:-4rem;top:0;bottom:0;background:var(--ink);opacity:0;transition:opacity .3s;z-index:-1}
.exp-item:hover::before{opacity:1}
.exp-item:hover .exp-period,.exp-item:hover .exp-company,.exp-item:hover .exp-role,.exp-item:hover .exp-desc,.exp-item:hover .exp-tag,.exp-item:hover .exp-location,.exp-item:hover .exp-kp{color:var(--paper)}
.exp-item:hover .exp-tag{border-color:rgba(248,246,242,.2)}
.exp-period{font-family:var(--mono);font-size:.65rem;letter-spacing:.15em;color:var(--ink-40);padding-top:.2rem;transition:color .3s}
.exp-company{font-family:var(--serif);font-size:1.5rem;font-weight:600;color:var(--ink);margin-bottom:.4rem;transition:color .3s}
.exp-role{font-family:var(--mono);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-40);margin-bottom:1rem;transition:color .3s}
.exp-desc{font-size:.9rem;font-weight:300;line-height:1.7;color:var(--ink-60);transition:color .3s}
.exp-kps{margin-top:.75rem;padding-left:1rem;list-style:none}
.exp-kp{font-size:.85rem;font-weight:300;line-height:1.6;color:var(--ink-60);position:relative;transition:color .3s}
.exp-kp::before{content:'—';position:absolute;left:-1rem;color:var(--ink-40)}
.exp-tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.exp-tag{font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-40);border:1px solid var(--rule);padding:.3rem .75rem;transition:color .3s,border-color .3s}
.exp-right{text-align:right}
.exp-location{font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-40);transition:color .3s}
@media(max-width:900px){.exp-item{grid-template-columns:1fr;gap:1rem}.exp-right{text-align:left}.exp-item::before{left:-2rem;right:-2rem}}

/* SKILLS (dark) */
.skills-sec{padding:8rem 4rem;border-bottom:1px solid var(--rule);background:var(--ink)}
.skills-sec .d-title,.skills-sec .section-label{color:var(--paper)}
.skills-sec .section-label{color:var(--ink-20)}
.skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:4rem}
.skill-category{border-right:1px solid rgba(248,246,242,.1);padding:0 3rem}
.skill-category:first-child{padding-left:0}
.skill-category:last-child{border-right:none;padding-right:0}
.skill-cat-title{font-family:var(--mono);font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--ink-20);margin-bottom:2rem}
.skill-list{list-style:none}
.skill-list li{font-family:var(--serif);font-size:1.35rem;color:var(--paper);padding:.7rem 0;border-bottom:1px solid rgba(248,246,242,.12);transition:color .25s,padding-left .25s}
.skill-list li:hover{padding-left:.5rem}
@media(max-width:900px){.skills-grid{grid-template-columns:1fr}.skill-category{border-right:none;border-bottom:1px solid rgba(248,246,242,.1);padding:2rem 0}}

/* EDUCATION grid */
.edu-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:4rem}
.edu-item{padding:3rem;border:1px solid var(--rule);margin:-1px 0 0 -1px;position:relative;overflow:hidden}
.edu-item::before{content:'';position:absolute;top:0;left:0;width:0;height:3px;background:var(--ink);transition:width .4s cubic-bezier(.25,.46,.45,.94)}
.edu-item:hover::before{width:100%}
.edu-year{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-40);margin-bottom:1.5rem;display:block}
.edu-degree{font-family:var(--serif);font-size:1.5rem;font-weight:600;line-height:1.2;color:var(--ink);margin-bottom:.5rem}
.edu-school{font-family:var(--serif);font-size:1rem;font-style:italic;color:var(--ink-60);margin-bottom:1rem}
.edu-badge{display:inline-block;font-family:var(--mono);font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-40);border:1px solid var(--rule);padding:.3rem .75rem;margin-top:1rem}
@media(max-width:900px){.edu-grid{grid-template-columns:1fr}}

/* CARDS (certs/achievements) */
.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-top:4rem}
.d-card{background:var(--white);border:1px solid var(--rule);padding:2.5rem;position:relative;overflow:hidden;transition:box-shadow .3s,transform .3s}
.d-card:hover{box-shadow:6px 6px 0 var(--ink);transform:translate(-3px,-3px)}
.card-idx{font-family:var(--serif);font-size:3rem;font-weight:700;color:var(--rule);line-height:1;margin-bottom:1.5rem}
.card-name{font-family:var(--serif);font-size:1.2rem;font-weight:600;color:var(--ink);margin-bottom:.5rem}
.card-org{font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-40);margin-bottom:1rem}
.card-desc{font-size:.85rem;font-weight:300;line-height:1.7;color:var(--ink-60)}
.card-year{position:absolute;bottom:2rem;right:2rem;font-family:var(--serif);font-size:2rem;font-weight:700;color:var(--rule)}
.card-link{display:inline-block;margin-top:1rem;font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink);border-bottom:1px solid var(--ink)}
@media(max-width:900px){.card-grid{grid-template-columns:1fr}}

/* AWARDS list */
.awards-list{margin-top:4rem}
.award-row{display:grid;grid-template-columns:1fr auto auto;gap:2rem;align-items:baseline;padding:1.75rem 0;border-top:1px solid var(--rule)}
.award-row:last-of-type{border-bottom:1px solid var(--rule)}
.award-title{font-family:var(--serif);font-size:1.4rem}
.award-body{font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-40)}
.award-year{font-family:var(--mono);font-size:.65rem;color:var(--ink-40)}
@media(max-width:900px){.award-row{grid-template-columns:1fr;gap:.4rem}}

/* PHILOSOPHY */
.philo{margin-top:4rem;font-family:var(--serif);font-style:italic;font-size:clamp(1.6rem,2.6vw,2.4rem);line-height:1.4;color:var(--ink-80);max-width:56ch}

/* SOFTWARE PROFICIENCY */
.tools{margin-top:4rem;display:flex;flex-wrap:wrap;gap:.75rem}
.tool-tag{font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60);border:1px solid var(--rule);padding:.6rem 1.1rem;transition:background .25s,color .25s}
.tool-tag:hover{background:var(--ink);color:var(--paper)}

/* CUSTOM SECTIONS reuse cards */
.cs-tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem}

/* CONTACT */
#contact{padding:8rem 4rem;display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--rule)}
.contact-left{padding-right:6rem;border-right:1px solid var(--rule)}
.contact-title{font-family:var(--serif);font-size:clamp(3.5rem,6vw,7rem);font-weight:300;line-height:.95;margin:1.5rem 0 3rem}
.contact-title em{font-style:italic}
.contact-body{font-family:var(--serif);font-size:1.2rem;font-weight:300;line-height:1.7;color:var(--ink-60);margin-bottom:3rem}
.contact-cta{display:inline-flex;align-items:center;gap:1rem;font-family:var(--mono);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--paper);background:var(--ink);padding:1.2rem 2.5rem;transition:background .3s}
.contact-cta:hover{background:var(--ink-60)}
.contact-right{padding-left:6rem;display:flex;flex-direction:column;justify-content:center}
.ci-list{list-style:none}
.ci-list li{display:flex;align-items:flex-start;gap:2rem;padding:1.75rem 0;border-bottom:1px solid var(--rule)}
.ci-label{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-40);min-width:80px;padding-top:.1rem}
.ci-value{font-family:var(--serif);font-size:1.1rem;font-weight:400;color:var(--ink)}
.social-links{display:flex;gap:1rem;margin-top:3rem;flex-wrap:wrap}
.social-link{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-40);border:1px solid var(--rule);padding:.6rem 1.2rem;transition:background .2s,color .2s,border-color .2s}
.social-link:hover{background:var(--ink);color:var(--paper);border-color:var(--ink)}
@media(max-width:900px){#contact{grid-template-columns:1fr;padding:5rem 2rem}.contact-left{padding-right:0;border-right:none;border-bottom:1px solid var(--rule);padding-bottom:4rem;margin-bottom:4rem}.contact-right{padding-left:0}}

footer{padding:2rem 4rem;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--rule)}
.footer-copy{font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;color:var(--ink-40)}
.footer-mark{font-family:var(--serif);font-size:1rem;font-style:italic;color:var(--ink-20)}

/* EDIT CONTROLS */
.ce-add-btn{display:block;margin-top:2rem;padding:.9rem 1.4rem;border:1px dashed var(--rule);background:var(--white);color:var(--ink);font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;width:100%;text-align:center}
.ce-add-btn:hover{border-color:var(--ink)}
.skills-sec .ce-add-btn{background:transparent;color:var(--paper);border-color:rgba(248,246,242,.2)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:.75rem;right:.75rem;width:24px;height:24px;border-radius:50%;border:none;background:var(--ink);color:var(--paper);font-size:12px;line-height:24px;text-align:center;cursor:pointer;z-index:20;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}}
`;
}

const ATELIER_SCRIPT = (em: boolean) => `<script>
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(r){io.observe(r);});
  var nav=document.querySelector('nav');
  if(nav){window.addEventListener('scroll',function(){var s=window.scrollY>60;nav.style.backdropFilter=s?'blur(12px)':'none';nav.style.background=s?'rgba(248,246,242,.85)':'transparent';});}
  ${em ? '' : `var cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
  if(cur){var mx=0,my=0,rx=0,ry=0;document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function a(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(a);})();
  document.querySelectorAll('a,button,.exp-item,.d-card,.about-card,.edu-item,.work-item').forEach(function(el){el.addEventListener('mouseenter',function(){cur.style.width='14px';cur.style.height='14px';ring.style.width='56px';ring.style.height='56px';});el.addEventListener('mouseleave',function(){cur.style.width='8px';cur.style.height='8px';ring.style.width='36px';ring.style.height='36px';});});}`}
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
	const projCount = v.template_overrides?.projects_count ?? (v.projects?.length ?? 0);
	const awardsCount = v.awards?.length ?? 0;
	const certCount = v.certifications?.length ?? 0;
	const nameParts = v.name.split(/\s+/);
	const heroName = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')}<br><em>${nameParts[nameParts.length - 1]}</em>`
		: `<em>${v.name}</em>`;

	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const s = edu.start_year, e = edu.end_year;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : '';
		const b = e ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : '';
		return `${a}${s && e ? ' — ' : ''}${b}`;
	};
	const expPeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const s = exp.start_date, e = exp.end_date;
		if (!s && !e) return '';
		const a = s ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : '';
		const b = e ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : '';
		return `${a}${s && e ? ' — ' : ''}${b}`;
	};

	// HERO stats
	const statCells = [
		statShown(v, 'years_experience', yearsExp) ? `<div><div class="stat-num" ${ed('template_overrides.years_experience')}>${yearsExp}</div><div class="stat-label">Years Active</div></div>` : '',
		statShown(v, 'projects_count', projCount) ? `<div><div class="stat-num" ${ed('template_overrides.projects_count')}>${projCount}</div><div class="stat-label">Projects Shipped</div></div>` : '',
		awardsCount > 0 ? `<div><div class="stat-num">${awardsCount}</div><div class="stat-label">Awards</div></div>` : '',
		certCount > 0 ? `<div><div class="stat-num">${certCount}</div><div class="stat-label">Certifications</div></div>` : '',
	].filter(Boolean).join('');

	// ABOUT cards derived from skill groups (decorative)
	const aboutCards = (v.skill_groups ?? []).slice(0, 4).map(g => `<div class="about-card"><div class="ac-title">${g.category || 'Craft'}</div><div class="ac-body">${g.skills.slice(0, 3).join(', ')}</div></div>`).join('');

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects" class="d-sec">
<div class="d-head reveal"><span class="section-label">Selected Work</span><h2 class="d-title">Recent <em>projects</em></h2></div>
<div class="work-grid">
${v.projects.map((p, i) => `<div class="work-item reveal"${iw}>
${delBtn('projects', i)}
<div class="work-thumb" ${_imgUpload(`projects.${i}.images`, em, 'Upload image')}>${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}">` : `<div class="work-ph">[ project ${String(i + 1).padStart(2, '0')} ]</div>`}</div>
${p.project_category ? `<div class="work-cat" ${ed(`projects.${i}.project_category`)}>${p.project_category}</div>` : ''}
<div class="work-title" ${ed(`projects.${i}.title`)}>${p.title || (em ? 'Project' : '')}</div>
${p.description ? `<p class="work-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${p.responsibilities?.length ? `<ul class="proj-pts" ${le(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
${p.measurable_outcomes?.length ? `<ul class="proj-pts" ${le(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<li>${o}</li>`).join('')}</ul>` : ''}
${p.tech_stack?.length ? `<div class="work-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.map(t => `<span class="work-tag">${t}</span>`).join('')}</div>` : ''}
${p.software_used?.length ? `<div class="work-tags" ${le(`projects.${i}.software_used`)}>${p.software_used.map(t => `<span class="work-tag">${t}</span>`).join('')}</div>` : ''}
${p.project_url ? `<a href="${p.project_url}" class="work-link" target="_blank" rel="noopener noreferrer">View project &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>` : '';

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience" class="d-sec">
<span class="section-number">02</span>
<div class="d-head reveal"><span class="section-label">Experience</span><h2 class="d-title">Work <em>history</em></h2></div>
${v.experience.map((exp, i) => `<div class="exp-item reveal"${iw}>
${delBtn('experience', i)}
<div class="exp-period">${expPeriod(i, exp)}</div>
<div>
${exp.company ? `<div class="exp-company" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
<div class="exp-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
${exp.description ? `<div class="exp-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<ul class="exp-kps" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li class="exp-kp">${k}</li>`).join('')}</ul>` : ''}
</div>
<div class="exp-right">${exp.location ? `<div class="exp-location" ${ed(`experience.${i}.location`)}>${exp.location}</div>` : ''}</div>
</div>`).join('\n')}
${addBtn('experience', 'Experience')}
</section>` : '';

	// SKILLS (dark, lists)
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills" class="skills-sec">
<div class="d-head reveal"><span class="section-label">Skills</span><h2 class="d-title">Craft &amp; <em>capabilities</em></h2></div>
<div class="skills-grid">
${v.skill_groups.map((g, gi) => `<div class="skill-category reveal"${iw}>
${delBtn('skills', gi)}
<div class="skill-cat-title" ${ed(`skills.${gi}.category`)}>${g.category}</div>
<ul class="skill-list" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<li>${s}</li>`).join('')}</ul>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>` : '';

	// DESIGN PHILOSOPHY
	const philoHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design_philosophy" class="d-sec">
<div class="d-head reveal"><span class="section-label">Philosophy</span><h2 class="d-title">The <em>why</em> behind the work</h2></div>
<p class="philo reveal" ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</section>` : '';

	// SOFTWARE PROFICIENCY
	const softwareHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software_proficiency" class="d-sec">
<div class="d-head reveal"><span class="section-label">Toolkit</span><h2 class="d-title">Software, <em>mastered</em></h2></div>
<div class="tools reveal" ${le('software_proficiency')}>${(v.software_proficiency ?? []).map(t => `<span class="tool-tag">${t}</span>`).join('') || `<span class="tool-tag" style="opacity:.5">+ Add</span>`}</div>
</section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education" class="d-sec">
<span class="section-number">04</span>
<div class="d-head reveal"><span class="section-label">Education</span><h2 class="d-title">Academic <em>background</em></h2></div>
<div class="edu-grid">
${v.education.map((edu, i) => `<div class="edu-item reveal"${iw}>
${delBtn('education', i)}
${eduYears(i, edu) ? `<span class="edu-year">${eduYears(i, edu)}</span>` : ''}
<div class="edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' in ')}</div>
${edu.institution ? `<div class="edu-school"><span ${ed(`education.${i}.institution`)}>${edu.institution}</span>${edu.location ? `, <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<div class="edu-badge" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications" class="d-sec">
<div class="d-head reveal"><span class="section-label">Credentials</span><h2 class="d-title">Formally <em>recognized</em></h2></div>
<div class="card-grid">
${v.certifications.map((c, i) => `<div class="d-card"${iw}>
${delBtn('certifications', i)}
<div class="card-idx">${String(i + 1).padStart(2, '0')}</div>
<div class="card-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="card-org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.year ? `<div class="card-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
${c.url ? `<a href="${c.url}" class="card-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>` : '';

	// ACHIEVEMENTS
	const achMarquee = (v.achievements ?? []).map(a => a.title).filter(Boolean);
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements" class="d-sec" style="background:var(--paper-2)">
<span class="section-number">05</span>
<div class="d-head reveal"><span class="section-label">Achievements</span><h2 class="d-title">Moments that <em>mattered</em></h2></div>
${achMarquee.length >= 3 ? `<div style="overflow:hidden;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:1.5rem 0;margin-bottom:3rem"><div style="display:flex;gap:3rem;white-space:nowrap;width:max-content;animation:marquee 22s linear infinite">${achMarquee.concat(achMarquee).map(t => `<span style="font-family:var(--serif);font-style:italic;font-size:1rem;color:var(--ink-40)">${t} &#10022;</span>`).join('')}</div></div>` : ''}
<div class="card-grid">
${v.achievements.map((a, i) => `<div class="d-card"${iw}>
${delBtn('achievements', i)}
<div class="card-idx">${String(i + 1).padStart(2, '0')}</div>
<div class="card-name" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="card-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
${a.year ? `<div class="card-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>` : '';

	// AWARDS
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards" class="d-sec">
<div class="d-head reveal"><span class="section-label">Recognition</span><h2 class="d-title">Awards &amp; <em>honours</em></h2></div>
<div class="awards-list">
${(v.awards ?? []).map((a, i) => `<div class="award-row"${iw}>
${delBtn('awards', i)}
<div class="award-title" ${ed(`awards.${i}.title`)}>${a.title}</div>
<div class="award-body" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body || ''}</div>
<div class="award-year" ${ed(`awards.${i}.year`)}>${a.year || ''}</div>
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="d-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<div class="card-org" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.label ? `<div class="card-name" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="card-desc" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="cs-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="work-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="card-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}" class="d-sec">
<div class="d-head reveal"><span class="section-label" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</span><h2 class="d-title" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</h2></div>
<div class="card-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		experience: experienceHtml, projects: projectsHtml, skills: skillsHtml,
		design_philosophy: philoHtml, software_proficiency: softwareHtml, awards: awardsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// CONTACT
	const ciList = [
		v.email ? `<li><span class="ci-label">Email</span><div class="ci-value"><a href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a></div></li>` : '',
		v.phone ? `<li><span class="ci-label">Phone</span><div class="ci-value" ${ed('profile.phone')}>${v.phone}</div></li>` : '',
		v.location ? `<li><span class="ci-label">Location</span><div class="ci-value" ${ed('profile.location')}>${v.location}</div></li>` : '',
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" class="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" class="social-link" target="_blank" rel="noopener noreferrer">Portfolio</a>` : '',
		v.github_url ? `<a href="${v.github_url}" class="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" class="social-link" target="_blank" rel="noopener noreferrer">Twitter / X</a>` : '',
	].filter(Boolean).join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Designer Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css(em)}</style>
</head>
<body>
${em ? '' : '<div id="cursor"></div><div id="cursor-ring"></div>'}
<nav>
<div class="nav-logo" ${ed('profile.full_name')}>${v.name}</div>
<ul class="nav-links">
<li><a href="#about">About</a></li>
<li><a href="#projects">Work</a></li>
<li><a href="#experience">Experience</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
</nav>

<section id="hero">
<div class="hero-left">
<div>
<div class="hero-eyebrow"><div class="dot"></div><span class="section-label">Portfolio — ${new Date().getFullYear()}</span></div>
<h1 class="hero-name" ${ed('profile.full_name')}>${heroName}</h1>
</div>
<div class="hero-footer">
<div class="hero-role">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : (v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : '')}${v.location ? `<br>Based in ${v.location}` : ''}</div>
<div class="hero-scroll">Scroll to explore</div>
</div>
</div>
<div class="hero-right reveal">
${v.bio ? `<p class="hero-bio" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${statCells ? `<div class="hero-stats">${statCells}</div>` : ''}
<div class="availability"><div class="avail-dot"></div>Available for new work</div>
</div>
</section>

<section id="about">
<div class="about-left reveal">
<span class="section-label">01 — About</span>
<h2 class="about-title">The<br><em>story</em><br>so far</h2>
</div>
<div class="about-right reveal">
${v.uniqueValue ? `<p class="about-body" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${v.bio && !v.uniqueValue ? `<p class="about-body" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${aboutCards ? `<div class="about-grid">${aboutCards}</div>` : ''}
</div>
</section>

${orderedSections}

<section id="contact">
<div class="contact-left reveal">
<span class="section-label">Contact</span>
<h2 class="contact-title">Let's work<br><em>together</em></h2>
<p class="contact-body">Whether you have a brand to build, a product to shape, or simply want to talk about design — I'd love to hear from you.</p>
${v.email ? `<a href="mailto:${v.email}" class="contact-cta">Send a message →</a>` : ''}
</div>
<div class="contact-right reveal">
<ul class="ci-list">${ciList}</ul>
${socials ? `<div class="social-links">${socials}</div>` : ''}
</div>
</section>

<footer>
<span class="footer-copy">&copy; ${new Date().getFullYear()} ${v.name} — All rights reserved</span>
<span class="footer-mark">Designed with intention.</span>
</footer>
${ATELIER_SCRIPT(em)}
${EDITOR_SCRIPT}
</body>
</html>`;
}
