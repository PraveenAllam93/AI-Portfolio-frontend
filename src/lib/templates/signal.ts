/**
 * Template: Signal
 * Marketing theme — editorial dual-theme (light/dark toggle) portfolio.
 * Warm paper / near-black canvas, coral (#FF4B3A) + electric-blue accents,
 * Fraunces display serif, Inter body, JetBrains Mono labels. Signature: framed
 * hero photo with offset border + accent square + social rail, running keyword
 * marquee, mono section numbers, chip-grid skills, editorial experience rows,
 * campaign cards, achievement rows, scroll reveals, theme toggle.
 * Ported from "Growth & Brand Marketing Lead.html", mapped to our marketing
 * data model. No foreign projects section.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap';

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

function css(): string {
	return `
:root{
  --bg:#E4E3DF;--bg-soft:#DAD9D4;--ink:#16151A;--ink-soft:#57544D;--line:rgba(22,21,26,0.13);
  --card:#FFFFFF;--coral:#FF4B3A;--coral-soft:#FFD9D2;--blue:#2A4BFF;--blue-soft:#DCE3FF;
  --shadow:0 20px 60px -25px rgba(22,21,26,0.35);--maxw:1240px;
}
html[data-theme="dark"]{
  --bg:#111014;--bg-soft:#1A1920;--ink:#F3F1EA;--ink-soft:#A6A29B;--line:rgba(243,241,234,0.14);
  --card:#18171D;--coral-soft:#3A211E;--blue-soft:#1B2340;--shadow:0 20px 60px -25px rgba(0,0,0,0.6);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased;transition:background .4s ease,color .4s ease;overflow-x:hidden}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 48px}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
::selection{background:var(--coral);color:#fff}

/* NAV */
header.nav{position:sticky;top:0;z-index:80;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:88px}
.brand{display:flex;align-items:center;gap:12px}
.brand-mark{width:38px;height:38px;border-radius:50%;background:var(--ink);color:var(--bg);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:600;font-size:16px}
.brand-name{font-weight:600;font-size:15px}
.nav-links{display:flex;align-items:center;gap:38px;list-style:none}
.nav-links a{font-size:14px;color:var(--ink-soft);position:relative;padding-bottom:4px;transition:color .2s}
.nav-links a:hover{color:var(--ink)}
.nav-right{display:flex;align-items:center;gap:18px}
.btn-contact{background:var(--ink);color:var(--bg);padding:12px 22px;font-size:13.5px;font-weight:600;border-radius:2px}
.theme-toggle{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);background:none;cursor:pointer;color:var(--ink);font-size:16px}
@media(max-width:900px){.nav-links,.btn-contact{display:none}}

/* HERO */
.hero{padding:96px 0 60px;position:relative}
.hero-grid{display:grid;grid-template-columns:1.05fr 0.95fr;gap:40px;align-items:center}
.eyebrow-row{display:flex;align-items:center;gap:14px;margin-bottom:26px}
.eyebrow-dash{width:34px;height:2px;background:var(--ink)}
.eyebrow-tag{font-size:12.5px;text-transform:uppercase;letter-spacing:.14em;color:var(--ink-soft)}
.hero-name{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(48px,6.2vw,88px);line-height:.98;letter-spacing:-.02em;margin-bottom:28px}
.hero-role-line{font-size:19px;line-height:1.65;color:var(--ink-soft);max-width:480px;margin-bottom:14px}
.headline-pill{background:var(--coral-soft);color:var(--ink);padding:2px 8px;border-radius:3px;font-weight:700}
.hero-summary{font-size:15.5px;line-height:1.75;color:var(--ink-soft);max-width:460px;margin-bottom:38px}
.hero-meta{display:flex;flex-wrap:wrap;gap:10px 28px;margin-bottom:40px;font-size:13.5px;color:var(--ink-soft)}
.hero-meta span{display:flex;align-items:center;gap:7px}
.hero-meta .ic{color:var(--coral);font-weight:700}
.scroll-row{display:flex;align-items:center;gap:26px}
.scroll-btn{width:52px;height:52px;border-radius:50%;background:var(--ink);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:18px;animation:bob 1.8s ease-in-out infinite}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
.scroll-label{font-size:13px;color:var(--ink-soft)}
.hero-photo-col{position:relative;display:flex;justify-content:center}
.photo-frame-outer{position:relative;width:min(100%,420px)}
.photo-frame-border{position:absolute;inset:22px -26px -26px 26px;border:2px solid var(--ink);z-index:0}
.photo-frame{position:relative;z-index:2;aspect-ratio:4/5;overflow:hidden;box-shadow:var(--shadow);border-radius:2px;background:linear-gradient(145deg,var(--bg-soft),var(--line))}
.photo-frame img{width:100%;height:100%;object-fit:cover;object-position:center}
.photo-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:600;font-size:5rem;color:var(--ink-soft);opacity:.4}
.accent-square{position:absolute;left:-16px;bottom:64px;z-index:3;width:30px;height:30px;background:var(--coral);transform:rotate(18deg);box-shadow:var(--shadow)}
.social-rail{position:absolute;right:-64px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;z-index:4}
.social-rail a{width:38px;height:38px;border-radius:6px;background:var(--ink);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;transition:background .2s}
.social-rail a:hover{background:var(--coral)}
@media(max-width:1150px){.social-rail{position:static;flex-direction:row;justify-content:center;margin-top:26px;transform:none}}
@media(max-width:900px){.hero-grid{grid-template-columns:1fr}.hero-photo-col{order:-1;margin-bottom:20px}.photo-frame-outer{width:min(100%,320px)}}

/* SECTIONS */
.section{padding:96px 0;border-top:1px solid var(--line)}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:52px}
.section-kicker{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.section-num{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--coral)}
.section-title{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(30px,3.4vw,44px);letter-spacing:-.01em}
.section-desc{font-size:14.5px;color:var(--ink-soft);max-width:360px;text-align:right}
@media(max-width:700px){.section-head{flex-direction:column;align-items:flex-start}.section-desc{text-align:left}}
.add-btn{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--ink);border:1px dashed var(--line);padding:10px 16px;border-radius:2px;margin-top:28px;background:none;cursor:pointer;width:100%;justify-content:center}
.add-btn:hover{border-color:var(--coral);color:var(--coral)}
[data-item-wrap]{position:relative}
.card-delete{display:none;position:absolute;top:14px;right:14px;width:26px;height:26px;border-radius:50%;align-items:center;justify-content:center;background:var(--bg-soft);z-index:6;border:none;color:var(--ink-soft);cursor:pointer;font-size:12px}
[data-item-wrap]:hover .card-delete{display:flex}
.card-delete:hover{background:var(--coral);color:#fff}

/* MARQUEE */
.marquee-band{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:22px 0;background:var(--bg-soft)}
.marquee-track{display:flex;width:max-content;animation:scrollx 32s linear infinite}
.marquee-track span{font-family:'JetBrains Mono',monospace;font-size:14px;padding:0 26px;white-space:nowrap;color:var(--ink-soft);border-right:1px solid var(--line);display:flex;align-items:center;gap:10px}
.marquee-track span i{width:6px;height:6px;background:var(--coral);border-radius:50%;font-style:normal}
@keyframes scrollx{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.marquee-track{animation:none}.scroll-btn{animation:none}.reveal{transition:none}}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:0.9fr 1.1fr;gap:60px}
.about-lead{font-family:'Fraunces',serif;font-weight:500;font-style:italic;font-size:clamp(22px,2.4vw,30px);line-height:1.4;color:var(--ink)}
.about-body{font-size:16px;color:var(--ink-soft);line-height:1.75;max-width:560px;margin-bottom:14px}
.about-stats{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:14px}
.about-stat b{font-family:'JetBrains Mono',monospace;font-size:34px;color:var(--coral);display:block}
.about-stat span{font-size:13px;color:var(--ink-soft)}

/* SKILLS */
.skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.skill-cat{background:var(--bg);padding:34px;position:relative}
.skill-cat-title{font-family:'JetBrains Mono',monospace;font-size:12.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--coral);margin-bottom:18px}
.chip-row{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:var(--bg-soft);padding:7px 13px;font-size:13.5px;border-radius:2px;border:1px solid var(--line)}
@media(max-width:900px){.skills-grid{grid-template-columns:1fr}}

/* EXPERIENCE */
.exp-card{border-top:1px solid var(--line);padding:44px 0;display:grid;grid-template-columns:200px 1fr;gap:36px;position:relative}
.exp-card:last-of-type{border-bottom:1px solid var(--line)}
.exp-duration{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--ink-soft)}
.exp-current{display:inline-block;margin-top:10px;background:var(--blue-soft);color:var(--blue);font-size:11px;font-weight:700;padding:4px 9px;border-radius:2px;letter-spacing:.03em}
.exp-title{font-family:'Fraunces',serif;font-weight:600;font-size:23px}
.exp-company{font-size:14.5px;color:var(--coral);font-weight:600;margin-top:4px}
.exp-location{font-size:13px;color:var(--ink-soft);margin-top:2px}
.exp-summary{font-size:14.5px;color:var(--ink-soft);line-height:1.7;margin:14px 0;max-width:640px}
.exp-sub{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft);margin:18px 0 8px}
.exp-list{list-style:none;display:flex;flex-direction:column;gap:7px}
.exp-list li{font-size:14px;padding-left:18px;position:relative;line-height:1.55;color:var(--ink-soft)}
.exp-list li::before{content:'';position:absolute;left:0;top:9px;width:6px;height:6px;background:var(--coral);border-radius:50%}
.exp-tags-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.exp-tags-row .chip{font-size:12px;padding:5px 10px}
@media(max-width:750px){.exp-card{grid-template-columns:1fr}}

/* CAMPAIGNS */
.camp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px}
.camp-card{background:var(--card);border:1px solid var(--line);border-radius:2px;overflow:hidden;position:relative;box-shadow:var(--shadow)}
.camp-strip{height:6px;background:linear-gradient(90deg,var(--coral),var(--blue))}
.camp-body{padding:28px}
.camp-type{font-family:'JetBrains Mono',monospace;font-size:11.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--blue);margin-bottom:8px}
.camp-name{font-family:'Fraunces',serif;font-weight:600;font-size:21px;margin-bottom:10px}
.camp-budget{font-size:13px;color:var(--ink-soft);margin-bottom:16px}
.camp-budget b{color:var(--ink);font-family:'JetBrains Mono',monospace}
.camp-metrics{display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--line);padding-top:16px;margin-top:6px}
.camp-metric{font-size:14px;color:var(--ink-soft);line-height:1.5;padding-left:18px;position:relative}
.camp-metric::before{content:'';position:absolute;left:0;top:8px;width:8px;height:2px;background:var(--coral)}
.camp-channels{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}
.camp-channels .chip{font-size:11.5px;padding:5px 10px}
@media(max-width:850px){.camp-grid{grid-template-columns:1fr}}

/* ACHIEVEMENTS */
.ach-list{display:flex;flex-direction:column}
.ach-row{display:grid;grid-template-columns:90px 1fr auto;gap:24px;align-items:baseline;padding:26px 0;border-top:1px solid var(--line);position:relative}
.ach-list .ach-row:last-of-type{border-bottom:1px solid var(--line)}
.ach-year{font-family:'JetBrains Mono',monospace;color:var(--coral);font-size:15px}
.ach-title{font-family:'Fraunces',serif;font-weight:600;font-size:19px;margin-bottom:6px}
.ach-desc{font-size:14px;color:var(--ink-soft);max-width:560px;line-height:1.6}
.ach-link{font-size:13px;color:var(--blue);white-space:nowrap;text-decoration:underline;text-underline-offset:3px}
@media(max-width:650px){.ach-row{grid-template-columns:1fr;gap:6px}}

/* EDU / CERT / CUSTOM cards */
.mini-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.mini-card{border:1px solid var(--line);padding:22px 24px;position:relative;background:var(--card)}
.mini-card .deg{font-weight:700;font-size:15.5px;margin-bottom:4px}
.mini-card .inst{font-size:13.5px;color:var(--coral);margin-bottom:4px}
.mini-card .meta{font-size:12.5px;color:var(--ink-soft)}
.mini-card .grade{position:absolute;top:22px;right:24px;font-family:'JetBrains Mono',monospace;font-size:12.5px;background:var(--bg-soft);padding:4px 9px;border-radius:2px}
.mini-card .desc{font-size:13.5px;color:var(--ink-soft);line-height:1.6;margin-top:8px}
.mini-card .ci-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.mini-card a.ver-link{font-size:12px;color:var(--blue);text-decoration:underline;text-underline-offset:3px;display:inline-block;margin-top:8px}

/* CONTACT */
.contact-section{background:var(--ink);color:var(--bg);border-top:none}
html[data-theme="dark"] .contact-section{background:var(--bg-soft)}
.contact-section .section-title,.contact-section .eyebrow-tag,.contact-section .section-desc{color:var(--bg)}
html[data-theme="dark"] .contact-section .section-title{color:var(--ink)}
.contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:rgba(246,243,236,.16);margin-top:10px}
.contact-card{background:var(--ink);padding:34px}
html[data-theme="dark"] .contact-card{background:var(--bg-soft)}
.contact-card .cc-ic{font-size:20px;color:var(--coral);margin-bottom:16px}
.contact-card .label{font-size:11.5px;text-transform:uppercase;letter-spacing:.1em;color:rgba(246,243,236,.55);margin-bottom:8px}
html[data-theme="dark"] .contact-card .label{color:var(--ink-soft)}
.contact-card .value{font-size:15px;font-family:'JetBrains Mono',monospace;color:var(--bg);word-break:break-word}
html[data-theme="dark"] .contact-card .value{color:var(--ink)}
.contact-social{display:flex;gap:14px;margin-top:44px}
.contact-social a{padding:12px 20px;border-radius:2px;border:1px solid rgba(246,243,236,.3);font-size:13px;color:var(--bg);transition:background .2s}
html[data-theme="dark"] .contact-social a{color:var(--ink);border-color:var(--line)}
.contact-social a:hover{background:var(--coral);border-color:var(--coral);color:#fff}

/* FOOTER */
footer{padding:34px 0;border-top:1px solid var(--line)}
.footer-inner{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;color:var(--ink-soft);flex-wrap:wrap;gap:10px}
.footer-inner .fl{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:var(--ink)}
`;
}

const SIGNAL_SCRIPT = `<script>
(function(){
  var toggle=document.getElementById('themeToggle');
  if(toggle){toggle.addEventListener('click',function(){
    var root=document.documentElement;
    var dark=root.getAttribute('data-theme')==='dark';
    root.setAttribute('data-theme',dark?'light':'dark');
    toggle.textContent=dark?'\\u263D':'\\u2600';
  });}
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
	const delBtn = (sec: string, i: number): string => em ? `<button class="card-delete" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string => em ? `<button class="add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const yearsExp = v.template_overrides?.years_experience ?? yearsFromExperience(v.experience);
	const campaignsCount = v.template_overrides?.campaigns_count ?? (v.campaigns?.length ?? 0);
	const avgRoas = v.template_overrides?.avg_roas ?? deriveRoas(v.campaigns);
	const rolesCount = v.experience?.length ?? 0;
	const statNum = (key: string, val: number): string => `<span ${ed(`template_overrides.${key}`)}>${val}</span>`;
	const showYears = statShown(v, 'years_experience', yearsExp);
	const showCampaigns = statShown(v, 'campaigns_count', campaignsCount);
	const showRoas = statShown(v, 'avg_roas', avgRoas);
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'MK';

	let num = 0;
	const nn = () => String(++num).padStart(2, '0');

	// MARQUEE from skills
	const allSkills = (v.skill_groups ?? []).flatMap(g => g.skills).filter(Boolean);
	const marqueeItems = allSkills.length >= 4 ? allSkills : ['Paid Social', 'SEO', 'Lifecycle', 'Content', 'Brand', 'Performance', 'ABM', 'Growth'];
	const marquee = `<div class="marquee-band"><div class="marquee-track">${marqueeItems.concat(marqueeItems).map(s => `<span><i></i>${s}</span>`).join('')}</div></div>`;

	// ABOUT
	const aboutStats = [
		showYears ? `<div class="about-stat"><b>${statNum('years_experience', yearsExp)}+</b><span>Years Experience</span></div>` : '',
		showRoas ? `<div class="about-stat"><b>${statNum('avg_roas', avgRoas)}×</b><span>Avg. campaign ROAS</span></div>` : '',
		showCampaigns ? `<div class="about-stat"><b>${statNum('campaigns_count', campaignsCount)}+</b><span>Campaigns shipped</span></div>` : '',
		rolesCount > 0 ? `<div class="about-stat"><b>${rolesCount}</b><span>Roles &amp; engagements</span></div>` : '',
	].filter(Boolean).join('');
	const aboutHtml = (v.bio || v.uniqueValue)
		? `<section class="section" id="about"><div class="wrap about-grid">
<div class="reveal">
<div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">About</span></div>
${v.uniqueValue ? `<p class="about-lead" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : (v.bio ? `<p class="about-lead" ${ed('portfolio.bio', true)}>${v.bio}</p>` : '')}
</div>
<div class="reveal">
${v.bio && v.uniqueValue ? `<p class="about-body" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${aboutStats ? `<div class="about-stats">${aboutStats}</div>` : ''}
</div>
</div></section>` : '';

	// SKILLS
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section class="section" id="skills"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">Skills</span></div><h2 class="section-title">Where I add the most leverage</h2></div><p class="section-desc">Capabilities across brand, performance, and lifecycle.</p></div>
<div class="skills-grid">
${v.skill_groups.map((g, gi) => `<div class="skill-cat"${iw}>
${delBtn('skills', gi)}
<div class="skill-cat-title" ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
<div class="chip-row" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="chip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>` : '';

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section class="section" id="experience"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">Experience</span></div><h2 class="section-title">Roles &amp; results</h2></div></div>
${v.experience.map((exp, i) => `<div class="exp-card reveal"${iw}>
${delBtn('experience', i)}
<div>
<div class="exp-duration">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : (em ? `<span ${ed(`experience.${i}.start_date`)}>Start</span>` : '')}${(exp.start_date && exp.end_date) ? ' — ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : (em ? `<span ${ed(`experience.${i}.end_date`)}>End</span>` : '')}</div>
${exp.is_current ? `<span class="exp-current">Current</span>` : ''}
</div>
<div>
<div class="exp-title" ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}</div>
${exp.company ? `<div class="exp-company" ${ed(`experience.${i}.company`)}>${exp.company}</div>` : ''}
${exp.location ? `<div class="exp-location" ${ed(`experience.${i}.location`)}>${exp.location}</div>` : ''}
${exp.description ? `<div class="exp-summary" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<div class="exp-sub">Highlights</div><ul class="exp-list" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
${exp.channels_managed?.length ? `<div class="exp-tags-row" ${le(`experience.${i}.channels_managed`)}>${exp.channels_managed.map(c => `<span class="chip">${c}</span>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
${addBtn('experience', 'Experience')}
</div></section>` : '';

	// CAMPAIGNS
	const campaignsHtml = !hidden.has('campaigns') && (v.campaigns?.length || em)
		? `<section class="section" id="campaigns"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">Campaigns</span></div><h2 class="section-title">Selected campaigns</h2></div></div>
<div class="camp-grid">
${(v.campaigns ?? []).map((c, i) => `<div class="camp-card reveal"${iw}>
${delBtn('campaigns', i)}
<div class="camp-strip"></div>
<div class="camp-body">
${c.campaign_type ? `<div class="camp-type" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}
<div class="camp-name" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || 'Campaign'}</div>
${c.budget ? `<div class="camp-budget">Budget: <b ${ed(`campaigns.${i}.budget`)}>${c.budget}</b></div>` : ''}
${c.performance_metrics?.length ? `<div class="camp-metrics" ${le(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map(m => `<div class="camp-metric">${m}</div>`).join('')}</div>` : ''}
${c.channels_used?.length ? `<div class="camp-channels" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.map(ch => `<span class="chip">${ch}</span>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('campaigns', 'Campaign')}
</div></section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section class="section" id="achievements"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">Achievements</span></div><h2 class="section-title">Milestones &amp; recognition</h2></div></div>
<div class="ach-list">
${v.achievements.map((a, i) => `<div class="ach-row"${iw}>
${delBtn('achievements', i)}
<div class="ach-year">${a.year ? `<span ${ed(`achievements.${i}.year`)}>${a.year}</span>` : (em ? `<span ${ed(`achievements.${i}.year`)}>Year</span>` : '')}</div>
<div><div class="ach-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>${a.description ? `<div class="ach-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}</div>
${a.url ? `<a href="${a.url}" class="ach-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '<span></span>'}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section class="section" id="education"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">Education</span></div><h2 class="section-title">Education</h2></div></div>
<div class="mini-grid">
${v.education.map((edu, i) => `<div class="mini-card"${iw}>
${delBtn('education', i)}
<div class="deg">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
${edu.institution ? `<div class="inst" ${ed(`education.${i}.institution`)}>${edu.institution}</div>` : ''}
<div class="meta">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : ''}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : ''}${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>
${edu.grade_or_score ? `<div class="grade" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section class="section" id="certifications"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">Certifications</span></div><h2 class="section-title">Certifications</h2></div></div>
<div class="mini-grid">
${v.certifications.map((c, i) => `<div class="mini-card"${iw}>
${delBtn('certifications', i)}
<div class="deg" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="inst" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.year ? `<div class="meta"><span ${ed(`certifications.${i}.year`)}>${c.year}</span></div>` : ''}
${c.url ? `<a href="${c.url}" class="ver-link" target="_blank" rel="noopener noreferrer">Verify &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="mini-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<div class="inst" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.label ? `<div class="deg" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="desc" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="ci-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="ver-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section class="section" id="${cs.section_id}"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">${cs.title}</span></div><h2 class="section-title">${cs.title}</h2></div></div>
<div class="mini-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		skills: skillsHtml, experience: experienceHtml, campaigns: campaignsHtml,
		achievements: achievementsHtml, education: educationHtml, certifications: certsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// CONTACT
	const contactCards = [
		v.email ? `<div class="contact-card"><div class="cc-ic">✉</div><div class="label">Email</div><div class="value" ${ed('profile.email')}>${v.email}</div></div>` : '',
		v.phone ? `<div class="contact-card"><div class="cc-ic">☎</div><div class="label">Phone</div><div class="value" ${ed('profile.phone')}>${v.phone}</div></div>` : '',
		v.location ? `<div class="contact-card"><div class="cc-ic">◈</div><div class="label">Location</div><div class="value" ${ed('profile.location')}>${v.location}</div></div>` : '',
	].filter(Boolean).join('');
	const contactSocial = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn &#8599;</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Website &#8599;</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Twitter &#8599;</a>` : '',
	].filter(Boolean).join('');
	const contactHtml = (contactCards || contactSocial)
		? `<section class="section contact-section" id="contact"><div class="wrap">
<div class="section-head reveal"><div><div class="section-kicker"><span class="section-num">${nn()}</span><span class="eyebrow-tag">Contact</span></div><h2 class="section-title">Let's build something that compounds</h2></div><p class="section-desc">Open to leadership roles &amp; consulting engagements.</p></div>
${contactCards ? `<div class="contact-grid">${contactCards}</div>` : ''}
${contactSocial ? `<div class="contact-social">${contactSocial}</div>` : ''}
</div></section>` : '';

	// HERO
	const socialRail = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">in</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">↗</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">𝕏</a>` : '',
	].filter(Boolean).join('');
	const heroMeta = [
		v.email ? `<span><span class="ic">✉</span> <span ${ed('profile.email')}>${v.email}</span></span>` : '',
		v.phone ? `<span><span class="ic">☎</span> <span ${ed('profile.phone')}>${v.phone}</span></span>` : '',
		v.location ? `<span><span class="ic">◈</span> <span ${ed('profile.location')}>${v.location}</span></span>` : '',
	].filter(Boolean).join('');

	return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Marketing Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<header class="nav"><div class="wrap nav-inner">
<div class="brand"><div class="brand-mark">${initials.slice(0, 1)}</div><span class="brand-name" ${ed('profile.full_name')}>${v.name}</span></div>
<ul class="nav-links">
<li><a href="#home">Home</a></li>
<li><a href="#experience">Experience</a></li>
<li><a href="#campaigns">Campaigns</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
<div class="nav-right">
<button class="theme-toggle" id="themeToggle" title="Toggle theme">&#9789;</button>
${v.email ? `<a href="mailto:${v.email}" class="btn-contact">Contact Me</a>` : ''}
</div>
</div></header>

<main>
<section class="hero" id="home"><div class="wrap hero-grid">
<div class="hero-copy">
<div class="eyebrow-row reveal"><span class="eyebrow-dash"></span><span class="eyebrow-tag">Marketing Portfolio</span></div>
<h1 class="hero-name reveal" ${ed('profile.full_name')}>${v.name}</h1>
<p class="hero-role-line reveal">${v.profile_headline ? `<span class="headline-pill" ${ed('profile.headline')}>${v.profile_headline}</span>` : '<span class="headline-pill">Marketing Lead</span>'}${v.headline ? ` <span ${ed('portfolio.headline')}>${v.headline}</span>` : ''}</p>
${v.bio ? `<p class="hero-summary reveal" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${heroMeta ? `<div class="hero-meta reveal">${heroMeta}</div>` : ''}
<div class="scroll-row reveal"><a href="#about" class="scroll-btn">&#8595;</a><span class="scroll-label">Scroll Down</span></div>
</div>
<div class="hero-photo-col reveal">
<div class="photo-frame-outer">
<div class="photo-frame-border"></div>
<div class="accent-square"></div>
<div class="photo-frame" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="photo-mark">${initials}</div>`}</div>
${socialRail ? `<div class="social-rail">${socialRail}</div>` : ''}
</div>
</div>
</div></section>

${marquee}
${aboutHtml}
${orderedSections}
${contactHtml}

<footer><div class="wrap footer-inner">
<span class="fl" ${ed('profile.full_name')}>${v.name}</span>
<span>&copy; ${new Date().getFullYear()} · ${v.profile_headline || 'Marketing Portfolio'}</span>
</div></footer>
</main>

${SIGNAL_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
