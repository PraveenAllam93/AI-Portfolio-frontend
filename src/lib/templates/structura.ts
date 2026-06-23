/**
 * Template: Structura
 * Civil-engineering theme — clean, professional, light.
 * Palette: navy #2c3e50, blue #3498db, accent #2980b9, light-gray #f5f7fa.
 * Features: fixed nav with scroll shadow, hero with profile photo, fade-up
 * reveal on scroll, project cards with type badges, two-column skills
 * (technical + software), dark certifications band, mobile menu.
 * Fonts: Montserrat · Open Sans.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap';

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
  --primary-blue:#2c3e50;--secondary-blue:#3498db;--accent-blue:#2980b9;
  --light-gray:#f5f7fa;--medium-gray:#ecf0f1;--dark-gray:#7f8c8d;
  --text-dark:#2c3e50;--text-light:#ffffff;--border-color:#dcdde1;
  --shadow:0 4px 12px rgba(0,0,0,0.08);--shadow-lg:0 16px 40px rgba(0,0,0,0.14);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Open Sans',sans-serif;color:var(--text-dark);line-height:1.6;background:#fff}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
ul{list-style:none}
h1,h2,h3,h4{font-family:'Montserrat',sans-serif;font-weight:600;margin-bottom:1rem}
h1{font-size:2.5rem;color:var(--primary-blue)}
h2{font-size:2rem;color:var(--primary-blue);position:relative;padding-bottom:.5rem}
h2::after{content:'';position:absolute;bottom:0;left:0;width:60px;height:4px;background:var(--secondary-blue)}
h3{font-size:1.5rem;color:var(--accent-blue)}
.container{width:90%;max-width:1200px;margin:0 auto;padding:0 20px}
section{padding:5rem 0;position:relative;z-index:1}
.section-light{background:var(--light-gray)}
.section-dark{background:var(--primary-blue);color:var(--text-light)}
.section-dark h2{color:var(--text-light)}

/* NAV */
header.site-header{background:var(--primary-blue);position:fixed;width:100%;top:0;z-index:1000;box-shadow:var(--shadow);transition:box-shadow .3s}
header.site-header.scrolled{box-shadow:0 4px 18px rgba(0,0,0,0.22)}
.nav-container{display:flex;justify-content:space-between;align-items:center;padding:1rem 0}
.logo{font-family:'Montserrat',sans-serif;font-size:1.6rem;font-weight:700;color:var(--text-light)}
.logo span{color:var(--secondary-blue)}
nav ul{display:flex}
nav ul li{margin-left:2rem}
nav ul li a{color:var(--text-light);font-weight:500;transition:color .3s}
nav ul li a:hover{color:var(--secondary-blue)}
.mobile-menu-btn{display:none;background:none;border:none;color:var(--text-light);font-size:1.5rem;cursor:pointer;line-height:1}

/* HERO */
.hero{padding:11rem 0 5rem;background:linear-gradient(135deg,rgba(44,62,80,.93),rgba(41,128,185,.86)),url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;background-color:var(--primary-blue);position:relative;color:var(--text-light);text-align:center;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.hero-content{max-width:820px;margin:0 auto;position:relative;z-index:1}
.profile-container{display:flex;flex-direction:column;align-items:center;margin-bottom:1.5rem}
.profile-photo{width:190px;height:190px;border-radius:50%;object-fit:cover;border:5px solid var(--secondary-blue);margin-bottom:1.5rem;box-shadow:var(--shadow)}
.profile-fallback{width:190px;height:190px;border-radius:50%;border:5px solid var(--secondary-blue);margin-bottom:1.5rem;display:grid;place-items:center;background:rgba(255,255,255,.08);font-family:'Montserrat',sans-serif;font-size:3.4rem;font-weight:700;color:var(--text-light);box-shadow:var(--shadow)}
.profile-photo-zone{position:relative;display:inline-block;border-radius:50%;margin-bottom:1.5rem;line-height:0}
.profile-photo-zone .profile-photo,.profile-photo-zone .profile-fallback{margin-bottom:0}
.hero h1{color:var(--text-light);font-size:3rem;margin-bottom:.5rem}
.designation{font-size:1.5rem;color:#aed6f1;margin-bottom:1rem;font-weight:500}
.experience-line{font-size:1.15rem;margin-bottom:1.5rem;color:var(--medium-gray)}
.hero-summary{font-size:1.1rem;color:#eaf2f8;max-width:680px;margin:0 auto}
.hero-socials{display:flex;gap:.8rem;justify-content:center;margin-top:2rem}
.hero-socials a{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.35);display:grid;place-items:center;color:var(--text-light);font-weight:700;font-size:.85rem;transition:all .3s}
.hero-socials a:hover{background:var(--secondary-blue);border-color:var(--secondary-blue);transform:translateY(-3px)}

/* SUMMARY / ABOUT */
.summary-content{display:grid;grid-template-columns:3fr 2fr;align-items:stretch;gap:3rem}
.summary-text p{margin-bottom:1.4rem;font-size:1.08rem}
.summary-image{position:relative;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-lg);border:1px solid var(--border-color);min-height:360px}
.summary-image img{width:100%;height:100%;min-height:360px;object-fit:cover;display:block;transition:transform .5s}
.summary-image:hover img{transform:scale(1.04)}
.summary-image .ph{width:100%;height:100%;min-height:360px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8rem;text-align:center;padding:2rem;background:linear-gradient(135deg,var(--medium-gray),var(--light-gray));color:var(--dark-gray)}
.summary-image .ph .ph-ic{width:64px;height:64px;border-radius:50%;background:#fff;display:grid;place-items:center;color:var(--secondary-blue);box-shadow:var(--shadow)}
.summary-image .ph .ph-tx{font-size:.85rem;font-weight:600;color:var(--primary-blue)}
.summary-image .ph .ph-sub{font-size:.78rem;color:var(--dark-gray);max-width:220px}
.summary-image .badge{position:absolute;bottom:1rem;left:1rem;background:rgba(44,62,80,.85);color:#fff;padding:.5rem .9rem;border-radius:8px;font-size:.8rem;font-weight:600;backdrop-filter:blur(4px)}

/* EXPERIENCE */
.exp-grid{display:flex;flex-direction:column;gap:1.5rem;margin-top:2rem}
.exp-card{background:#fff;border:1px solid var(--border-color);border-left:4px solid var(--secondary-blue);border-radius:8px;box-shadow:var(--shadow);padding:1.8rem;position:relative;transition:transform .3s,box-shadow .3s}
.exp-card:hover{transform:translateX(4px);box-shadow:var(--shadow-lg)}
.exp-head{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;margin-bottom:.3rem}
.exp-role{font-family:'Montserrat',sans-serif;font-size:1.25rem;font-weight:600;color:var(--primary-blue)}
.exp-period{font-size:.85rem;font-weight:600;color:var(--accent-blue);white-space:nowrap}
.exp-company{color:var(--secondary-blue);font-weight:600;margin-bottom:.9rem}
.exp-desc{color:#566573;margin-bottom:.9rem}
.exp-points{display:flex;flex-direction:column;gap:.5rem}
.exp-points li{position:relative;padding-left:1.4rem;color:#566573}
.exp-points li::before{content:'';position:absolute;left:0;top:.55em;width:8px;height:8px;background:var(--secondary-blue);border-radius:2px;transform:rotate(45deg)}

/* PROJECTS */
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:2rem;margin-top:2rem}
.project-card{background:#fff;border:1px solid var(--border-color);border-radius:10px;overflow:hidden;box-shadow:var(--shadow);transition:transform .3s,box-shadow .3s;display:flex;flex-direction:column;position:relative}
.project-card:hover{transform:translateY(-8px);box-shadow:var(--shadow-lg)}
.project-banner{height:120px;background:linear-gradient(135deg,var(--accent-blue),var(--secondary-blue));position:relative;display:flex;align-items:flex-end;overflow:hidden}
.project-banner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.project-banner::after{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:24px 24px}
.project-content{padding:1.5rem;flex:1;display:flex;flex-direction:column}
.project-type{align-self:flex-start;background:var(--medium-gray);color:var(--primary-blue);padding:.3rem .85rem;border-radius:20px;font-size:.78rem;font-weight:600;margin-bottom:.9rem}
.project-title{font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:600;color:var(--primary-blue);margin-bottom:.6rem}
.project-desc{color:#566573;margin-bottom:.9rem;font-size:.95rem}
.project-sub{font-weight:600;color:var(--primary-blue);font-size:.85rem;margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.04em}
.project-list{display:flex;flex-direction:column;gap:.4rem;margin-bottom:.9rem}
.project-list li{position:relative;padding-left:1.3rem;color:#566573;font-size:.9rem}
.project-list li::before{content:'';position:absolute;left:0;top:.5em;width:7px;height:7px;border:2px solid var(--secondary-blue);border-radius:50%}
.project-outcomes{margin-top:auto;padding-top:.9rem;border-top:1px solid var(--border-color);display:flex;flex-wrap:wrap;gap:.5rem}
.outcome-chip{background:var(--light-gray);color:var(--accent-blue);font-weight:600;font-size:.78rem;padding:.3rem .7rem;border-radius:6px;border:1px solid var(--border-color)}
.project-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem;margin-bottom:.4rem}
.ptag{background:rgba(52,152,219,.1);color:var(--accent-blue);font-size:.75rem;font-weight:600;padding:.25rem .6rem;border-radius:4px}
.ptag.soft{background:rgba(41,128,185,.12);color:var(--primary-blue)}
.ptag.ghost{background:transparent;border:1px dashed var(--secondary-blue);color:var(--accent-blue);opacity:.7}
.project-links{display:flex;gap:1rem;margin-top:.9rem}
.project-links a{color:var(--secondary-blue);font-weight:600;font-size:.85rem}
.project-links a:hover{text-decoration:underline}

/* SKILLS */
.skills-container{display:grid;grid-template-columns:1fr 1fr;gap:3rem;margin-top:2rem}
.skill-block h3{margin-bottom:1.3rem}
.skill-cat{margin-bottom:1.4rem}
.skill-cat-name{font-family:'Montserrat',sans-serif;font-weight:600;color:var(--primary-blue);margin-bottom:.7rem;font-size:1rem}
.skill-list{display:flex;flex-direction:column;gap:.7rem}
.skill-list li{display:flex;align-items:center;gap:1rem;padding:.8rem 1rem;background:#fff;border:1px solid var(--border-color);border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,.04);transition:transform .2s,border-color .2s}
.skill-list li:hover{transform:translateX(4px);border-color:var(--secondary-blue)}
.skill-list li .ic{color:var(--secondary-blue);flex-shrink:0;display:grid;place-items:center}
.tools-list{display:flex;flex-wrap:wrap;gap:.7rem}
.tool-pill{display:flex;align-items:center;gap:.55rem;padding:.6rem 1rem;background:#fff;border:1px solid var(--border-color);border-radius:8px;font-weight:600;color:var(--primary-blue);font-size:.92rem;box-shadow:0 2px 5px rgba(0,0,0,.04);transition:transform .2s,border-color .2s}
.tool-pill:hover{transform:translateY(-2px);border-color:var(--secondary-blue)}
.tool-pill .ic{color:var(--secondary-blue)}

/* CERTIFICATIONS */
.certifications-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem;margin-top:2rem}
.cert-item{display:flex;align-items:flex-start;gap:1rem;padding:1.2rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:10px;transition:background .3s}
.cert-item:hover{background:rgba(255,255,255,.12)}
.cert-item .ic{color:var(--secondary-blue);flex-shrink:0;margin-top:2px}
.cert-name{font-weight:600;color:var(--text-light);margin-bottom:.2rem}
.cert-meta{font-size:.82rem;color:#aed6f1}

/* ACHIEVEMENTS */
.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem;margin-top:2rem}
.ach-card{background:#fff;border:1px solid var(--border-color);border-top:4px solid var(--secondary-blue);border-radius:8px;box-shadow:var(--shadow);padding:1.4rem;position:relative}
.ach-year{font-size:.78rem;font-weight:700;color:var(--accent-blue)}
.ach-title{font-family:'Montserrat',sans-serif;font-weight:600;color:var(--primary-blue);margin:.3rem 0 .4rem}
.ach-desc{color:#566573;font-size:.92rem}

/* GENERIC SECTION CARD GRID (campaigns/finance/custom) */
.gen-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem;margin-top:2rem}
.gen-card{background:#fff;border:1px solid var(--border-color);border-radius:8px;box-shadow:var(--shadow);padding:1.4rem;position:relative}
.gen-title{font-family:'Montserrat',sans-serif;font-weight:600;color:var(--primary-blue);margin-bottom:.4rem}
.gen-meta{color:#566573;font-size:.92rem;margin-bottom:.3rem}
.dp-text{font-size:1.08rem;color:#566573;max-width:760px;line-height:1.9;margin-top:1.5rem}

/* CONTACT */
.contact-container{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:2rem;margin-top:2rem}
.contact-info{background:#fff;color:var(--text-dark);padding:2rem;border-radius:10px;box-shadow:var(--shadow)}
.contact-info h3{margin-bottom:1.3rem}
.contact-info p{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.contact-info .ic{color:var(--secondary-blue);flex-shrink:0;display:grid;place-items:center}

/* FOOTER */
footer{background:#1a252f;color:var(--text-light);text-align:center;padding:2.5rem 0}
.footer-content{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.copyright{margin-top:1rem;width:100%;color:var(--dark-gray);font-size:.9rem}

/* EDIT CONTROLS */
.add-btn{display:block;margin-top:1.4rem;padding:.7rem 1rem;border:2px dashed var(--secondary-blue);border-radius:8px;background:rgba(52,152,219,.06);color:var(--accent-blue);font-size:.85rem;font-weight:600;cursor:pointer;width:100%;text-align:center}
.add-btn:hover{background:rgba(52,152,219,.12)}
[data-item-wrap]{position:relative}
.del-btn{display:none;position:absolute;top:10px;right:10px;width:24px;height:24px;border-radius:50%;border:none;background:#fee2e2;color:#ef4444;font-size:13px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .del-btn{display:block}
.section-dark .del-btn{background:rgba(255,255,255,.2);color:#fff}

/* REVEAL */
.fade-up{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}
.fade-up.visible{opacity:1;transform:none}

/* RESPONSIVE */
@media(max-width:992px){.summary-content{grid-template-columns:1fr}.skills-container{grid-template-columns:1fr}}
@media(max-width:768px){
  h1{font-size:2rem}h2{font-size:1.7rem}.hero h1{font-size:2.2rem}.designation{font-size:1.2rem}
  .hero{padding:9rem 0 3.5rem}
  .mobile-menu-btn{display:block}
  nav ul{position:fixed;top:64px;left:-100%;flex-direction:column;background:var(--primary-blue);width:100%;text-align:center;transition:.3s;box-shadow:0 10px 27px rgba(0,0,0,.1);padding:1rem 0}
  nav ul.active{left:0}
  nav ul li{margin:1.4rem 0}
  .footer-content{flex-direction:column;text-align:center}
}
@media(prefers-reduced-motion:reduce){.fade-up{transition:none}}
`;
}

const STRUCTURA_SCRIPT = `<script>
(function(){
  var header=document.getElementById('siteHeader');
  window.addEventListener('scroll',function(){
    if(header)header.classList.toggle('scrolled',window.scrollY>40);
  },{passive:true});
  var btn=document.getElementById('mobileMenuBtn');
  var menu=document.getElementById('navMenu');
  if(btn&&menu){
    btn.addEventListener('click',function(){menu.classList.toggle('active');});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('active');});});
  }
  var fades=document.querySelectorAll('.fade-up');
  if(fades.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
    },{threshold:0.12});
    fades.forEach(function(el){io.observe(el);});
  }
})();
<\/script>`;

// Inline SVG icon helpers (no external icon font dependency)
const IC = {
	pin: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
	mail: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
	phone: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.41 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/></svg>',
	cert: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>',
	tool: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
	skill: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
	camera: '<svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
};

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const inits = initials(v.name);
	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const ted = (key: string) => (v.edit_mode ? `contenteditable="true" data-path="template_overrides.${key}"` : '');
	const em = v.edit_mode;

	// Dates are bound to start_date/end_date separately so inline edits round-trip
	// with the right-side form (which stores those, not the computed `duration`).
	const datePeriod = (i: number, exp: NormalizedData['experience'][number]) => {
		const showStart = exp.start_date || em;
		const showEnd = exp.end_date || em;
		if (!showStart && !showEnd) return '';
		const s = showStart ? `<span ${_editable(`experience.${i}.start_date`)}>${exp.start_date || 'Start'}</span>` : '';
		const e = showEnd ? `<span ${_editable(`experience.${i}.end_date`)}>${exp.end_date || 'End'}</span>` : '';
		return `<span class="exp-period">${s}${showStart && showEnd ? ' – ' : ''}${e}</span>`;
	};

	// Education years bind to start_year/end_year (the form fields), NOT the
	// computed year_range — same round-trip rule as experience dates.
	const eduYears = (i: number, edu: NormalizedData['education'][number]) => {
		const showS = edu.start_year || em;
		const showE = edu.end_year || em;
		if (!showS && !showE) return '';
		const s = showS ? `<span ${_editable(`education.${i}.start_year`)}>${edu.start_year || 'Start'}</span>` : '';
		const e = showE ? `<span ${_editable(`education.${i}.end_year`)}>${edu.end_year || 'End'}</span>` : '';
		return `${s}${showS && showE ? '–' : ''}${e}`;
	};

	// Each list field gets its OWN _listEditable region (never blended) so the
	// preview list editor edits exactly the array the user clicked. Rendered only
	// when it has items — no labels, no placeholder chips.
	const tagRegion = (path: string, arr: string[], cls: string) =>
		arr.length
			? `<div class="project-tags" ${_listEditable(path)}>${arr.map(t => `<span class="ptag ${cls}">${t}</span>`).join('')}</div>`
			: '';

	const NAV_LABELS: Record<string, string> = {
		about: 'About', experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements',
		contact: 'Contact',
	};
	const navAnchors: string[] = [];
	if (v.bio) navAnchors.push('about');
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

	const avatarInner = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}" class="profile-photo">`
		: `<div class="profile-fallback">${inits}</div>`;
	const avatar = v.edit_mode
		? `<div class="profile-photo-zone" ${_imgUpload('profile.profile_image', v.edit_mode)}>${avatarInner}</div>`
		: avatarInner;

	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" title="LinkedIn">in</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" title="GitHub">gh</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" title="Website">&#127760;</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" title="Twitter">&#x1D54F;</a>` : '',
	].filter(Boolean).join('');

	// ABOUT — text on the left + a SEPARATE uploadable image on the right.
	// This is its own image (NOT the hero profile photo); it is uploaded from the
	// "Portfolio Fields" tab and stored as profile.summary_image.
	const summaryImage = v.summary_image
		? `<div class="summary-image" ${_imgUpload('profile.summary_image', v.edit_mode, 'Upload image')}><img src="${v.summary_image}" alt="${v.name} — summary">${v.headline ? `<span class="badge">${v.headline}</span>` : ''}</div>`
		: `<div class="summary-image" ${_imgUpload('profile.summary_image', v.edit_mode, 'Upload image')}><div class="ph"><div class="ph-ic">${IC.camera}</div><div class="ph-tx">Add a summary image</div><div class="ph-sub">Upload a section image from the <strong>Portfolio Fields</strong> tab — it appears here.</div></div></div>`;
	const aboutHtml = v.bio || v.summary_image || em
		? `<section id="about" class="section-light">
<div class="container fade-up">
  <h2>Professional Summary</h2>
  <div class="summary-content">
    <div class="summary-text">${v.bio ? `<p ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}</div>
    ${summaryImage}
  </div>
</div>
</section>` : '';

	// EXPERIENCE
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience">
<div class="container fade-up">
  <h2>Professional Experience</h2>
  <div class="exp-grid">
${v.experience.map((exp, i) => `<div class="exp-card" data-item-wrap>
  <button class="del-btn ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
  <div class="exp-head">
    <span class="exp-role" ${_editable(`experience.${i}.role`)}>${exp.role}</span>
    ${datePeriod(i, exp)}
  </div>
  ${(exp.company || exp.location) ? `<div class="exp-company"><span ${_editable(`experience.${i}.company`)}>${exp.company || ''}</span>${(exp.location) ? ` &middot; <span ${_editable(`experience.${i}.location`)}>${exp.location || ''}</span>` : ''}</div>` : ''}
  ${exp.description ? `<p class="exp-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
  ${exp.key_points?.length ? `<ul class="exp-points" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="experience">+ Add Experience</button>
</div>
</section>` : '';

	// PROJECTS
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section id="projects" class="section-light">
<div class="container fade-up">
  <h2>Key Projects</h2>
  <div class="projects-grid">
${v.projects.map((p, i) => {
		const img = p.images?.[0];
		const links = [
			p.github_repo ? `<a href="${p.github_repo}" target="_blank" rel="noopener noreferrer">Repository</a>` : '',
			p.project_url ? `<a href="${p.project_url}" target="_blank" rel="noopener noreferrer">View Project</a>` : '',
		].filter(Boolean).join('');
		return `<div class="project-card" data-item-wrap>
  <button class="del-btn ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
  <div class="project-banner" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}>${img ? `<img src="${img}" alt="${p.title}">` : ''}</div>
  <div class="project-content">
    ${p.project_category ? `<span class="project-type" ${_editable(`projects.${i}.project_category`)}>${p.project_category}</span>` : ''}
    <div class="project-title" ${_editable(`projects.${i}.title`)}>${p.title}</div>
    ${p.description ? `<p class="project-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
    ${p.responsibilities?.length ? `<div class="project-sub">Responsibilities</div><ul class="project-list" ${_listEditable(`projects.${i}.responsibilities`)}>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
    ${tagRegion(`projects.${i}.tech_stack`, p.tech_stack ?? [], '')}
    ${tagRegion(`projects.${i}.software_used`, p.software_used ?? [], 'soft')}
    ${p.measurable_outcomes?.length ? `<div class="project-outcomes" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map(o => `<span class="outcome-chip">&#10003; ${o}</span>`).join('')}</div>` : ''}
    ${links ? `<div class="project-links">${links}</div>` : ''}
  </div>
</div>`;
	}).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="projects">+ Add Project</button>
</div>
</section>` : '';

	// SKILLS (technical groups + software/tools)
	const skillsHtml = (!hidden.has('skills') && v.skill_groups?.length) || v.software_proficiency?.length
		? `<section id="skills">
<div class="container fade-up">
  <h2>Technical Skills &amp; Tools</h2>
  <div class="skills-container">
    <div class="skill-block">
      <h3>Technical Skills</h3>
${(v.skill_groups ?? []).map((g, i) => `<div class="skill-cat" data-item-wrap>
        <button class="del-btn ce-del-btn" data-del-section="skills" data-del-index="${i}">&#x2715;</button>
        <div class="skill-cat-name" ${_editable(`skills.${i}.category`)}>${g.category || 'Skills'}</div>
        <ul class="skill-list" ${_listEditable(`skills.${i}.skills`)}>${g.skills.map(s => `<li><span class="ic">${IC.skill}</span>${s}</li>`).join('')}</ul>
      </div>`).join('\n')}
      <button class="add-btn ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
    </div>
    <div class="skill-block">
      <h3>Software &amp; Tools</h3>
      ${(v.software_proficiency?.length || em)
			? `<div class="tools-list" ${_listEditable('software_proficiency')}>${(v.software_proficiency ?? []).length
				? v.software_proficiency.map(s => `<span class="tool-pill"><span class="ic">${IC.tool}</span>${s}</span>`).join('')
				: `<span class="tool-pill" style="opacity:.6"><span class="ic">${IC.tool}</span>Add tools</span>`}</div>`
			: ''}
    </div>
  </div>
</div>
</section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section id="education" class="section-light">
<div class="container fade-up">
  <h2>Education</h2>
  <div class="ach-grid">
${v.education.map((edu, i) => `<div class="ach-card" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
    ${(edu.start_year || edu.end_year || em) ? `<span class="ach-year">${eduYears(i, edu)}</span>` : ''}
    <div class="ach-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
    ${(edu.institution || edu.location) ? `<div class="ach-desc"><span ${_editable(`education.${i}.institution`)}>${edu.institution || ''}</span>${(edu.location) ? `, <span ${_editable(`education.${i}.location`)}>${edu.location || ''}</span>` : ''}</div>` : ''}
    ${edu.grade_or_score ? `<div class="ach-desc" style="margin-top:.3rem" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="education">+ Add Education</button>
</div>
</section>` : '';

	// CERTIFICATIONS (dark band)
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section id="certifications" class="section-dark">
<div class="container fade-up">
  <h2>Certifications &amp; Licenses</h2>
  <div class="certifications-list">
${v.certifications.map((c, i) => `<div class="cert-item" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
    <div class="ic">${IC.cert}</div>
    <div>
      <div class="cert-name" ${_editable(`certifications.${i}.name`)}>${c.name}</div>
      ${(c.issuer || c.year) ? `<div class="cert-meta">${c.issuer ? `<span ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</span>` : ''}${c.issuer && c.year ? ' &middot; ' : ''}${c.year ? `<span ${_editable(`certifications.${i}.year`)}>${c.year}</span>` : ''}</div>` : ''}
      ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer" style="color:#aed6f1;font-size:.8rem;font-weight:600;display:inline-block;margin-top:.3rem">View credential &#8599;</a>` : ''}
    </div>
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</div>
</section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section id="achievements">
<div class="container fade-up">
  <h2>Achievements</h2>
  <div class="ach-grid">
${v.achievements.map((a, i) => `<div class="ach-card" data-item-wrap>
    <button class="del-btn ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
    ${a.year ? `<span class="ach-year" ${_editable(`achievements.${i}.year`)}>${a.year}</span>` : ''}
    <div class="ach-title" ${_editable(`achievements.${i}.title`)}>${a.title}</div>
    ${a.description ? `<div class="ach-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
  </div>`).join('\n')}
  </div>
  <button class="add-btn ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</div>
</section>` : '';

	// Optional extra sections (awards/campaigns/finance/design/custom) — generic cards
	const awardsHtml = !hidden.has('awards') && v.awards?.length
		? `<section id="awards" class="section-light"><div class="container fade-up"><h2>Awards</h2><div class="gen-grid">
${v.awards.map((a, i) => `<div class="gen-card" data-item-wrap><button class="del-btn ce-del-btn" data-del-section="awards" data-del-index="${i}">&#x2715;</button>${a.year ? `<span class="ach-year" ${_editable(`awards.${i}.year`)}>${a.year}</span>` : ''}<div class="gen-title" ${_editable(`awards.${i}.title`)}>${a.title}</div>${a.awarding_body ? `<div class="gen-meta" ${_editable(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>` : ''}</div>`).join('\n')}
</div></div></section>` : '';

	const designHtml = !hidden.has('design_philosophy') && v.design_philosophy
		? `<section id="design_philosophy"><div class="container fade-up"><h2>Design Philosophy</h2><p class="dp-text" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p></div></section>` : '';

	const customSectionsHtml = !hidden.has('custom_sections') && (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length) return '';
			const items = cs.items.map((item, i) => `<div class="gen-card" data-item-wrap data-cs-idx="${csIdx}">
  <button class="del-btn ce-del-btn" data-del-section="custom_sections.${csIdx}" data-del-index="${i}">&#x2715;</button>
  ${item.label ? `<div class="gen-title" ${_editable(`custom_sections.${csIdx}.items.${i}.label`)}>${item.label}</div>` : ''}
  ${item.subtitle ? `<div class="gen-meta" ${_editable(`custom_sections.${csIdx}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
  ${item.value ? `<div class="gen-meta" ${_editable(`custom_sections.${csIdx}.items.${i}.value`, true)}>${item.value}</div>` : ''}
  ${item.tags?.length ? `<div class="project-tags" ${_listEditable(`custom_sections.${csIdx}.items.${i}.tags`)}>${item.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>` : ''}
  ${item.url ? `<div class="project-links"><a href="${item.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a></div>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}" class="section-light"><div class="container fade-up"><h2>${cs.title}</h2><div class="gen-grid"${cs.display_type === 'list' ? ' style="grid-template-columns:1fr"' : ''}>${items}</div>
<button class="add-btn ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button></div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		experience: expHtml, projects: projectsHtml, skills: skillsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		awards: awardsHtml, design_philosophy: designHtml, custom_sections: customSectionsHtml,
	};
	const orderedSections = order
		.filter(k => !hidden.has(k) && k in sectionMap)
		.map(k => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	// CONTACT
	const contactHtml = v.email || v.phone || v.location
		? `<section id="contact" class="section-light">
<div class="container fade-up">
  <h2>Contact Details</h2>
  <div class="contact-container">
    <div class="contact-info">
      <h3>Get In Touch</h3>
      ${v.email ? `<p><span class="ic">${IC.mail}</span><span ${_editable('profile.email')}>${v.email}</span></p>` : ''}
      ${v.phone ? `<p><span class="ic">${IC.phone}</span><span ${_editable('profile.phone')}>${v.phone}</span></p>` : ''}
      ${v.location ? `<p><span class="ic">${IC.pin}</span><span ${_editable('profile.location')}>${v.location}</span></p>` : ''}
    </div>
    ${socials ? `<div class="contact-info"><h3>Connect</h3><div class="hero-socials" style="justify-content:flex-start;margin-top:0">${socials}</div></div>` : ''}
  </div>
</div>
</section>` : '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Portfolio</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<header class="site-header" id="siteHeader">
  <div class="container nav-container">
    <a href="#home" class="logo">${(v.name.split(/\s+/)[0] || 'Portfolio')}<span>.</span></a>
    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">&#9776;</button>
    <nav><ul id="navMenu">${navItems}</ul></nav>
  </div>
</header>

<section id="home" class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="profile-container">
        ${avatar}
        <h1 ${_editable('profile.full_name')}>${v.name}</h1>
        ${v.headline ? `<div class="designation" ${_editable('portfolio.headline')}>${v.headline}</div>` : ''}
        ${years > 0 ? `<div class="experience-line"><span ${ted('years_experience')}>${years}</span>+ Years of Professional Experience</div>` : ''}
      </div>
      ${socials ? `<div class="hero-socials">${socials}</div>` : ''}
    </div>
  </div>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
  <div class="container">
    <div class="footer-content">
      <div class="logo">${(v.name.split(/\s+/)[0] || 'Portfolio')}<span>.</span></div>
      <p>${v.headline || 'Civil Engineering Portfolio'}</p>
      <div class="copyright">&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</div>
    </div>
  </div>
</footer>
${STRUCTURA_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
