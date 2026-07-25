/**
 * Template: Canopy
 * Marketing theme — organic dark "social media lead" portfolio. Forest-green /
 * teal / gold / cream palette, split dark hero with floating social-post stat
 * cards, mono keyword ticker, dark metrics band, sage service cards, Playfair
 * Display + DM Sans + DM Mono. Signature: split hero, floating post cards,
 * ticker, gold badge, scroll reveals, nav-scroll.
 * Ported from "Social Media Marketing Lead.html", mapped to our marketing data
 * model (services→skills, work→campaigns). No foreign projects section.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';

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
const SVC_ICONS = ['◐', '✦', '❖', '◈', '✧', '⬡', '❋', '◆'];

function css(): string {
	return `
:root{
  --forest:#0F1F1C;--teal-deep:#1A2F2B;--teal-mid:#2A5C52;--teal-bright:#3D8C7A;
  --sage-pale:#E8F4F2;--cream:#F5F0E8;--gold:#D4A853;--gold-light:#E8C47A;--white:#FFFFFF;
  --text-dark:#0F1F1C;--text-mid:#4A6B63;--text-light:rgba(245,240,232,0.7);
  --font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--font-mono:'DM Mono',monospace;
  --max-w:1600px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--cream);color:var(--text-dark);overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.container{width:min(var(--max-w),100%);padding-inline:clamp(1.5rem,5vw,5rem);margin-inline:auto}
.tag{font-family:var(--font-mono);font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--teal-mid);display:flex;align-items:center;gap:.6rem}
.tag::before{content:'';display:block;width:2rem;height:1px;background:var(--teal-mid)}
.tag--light{color:var(--teal-bright)}.tag--light::before{background:var(--teal-bright)}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .75s ease,transform .75s ease}
.reveal.visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{transition:none}.post-card,.ticker__track,.scroll-line{animation:none}}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.4rem 0;transition:background .4s ease,box-shadow .4s ease}
.nav.scrolled{background:rgba(15,31,28,0.95);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgba(61,140,122,0.15)}
.nav__inner{display:flex;align-items:center;justify-content:space-between}
.nav__logo{font-family:var(--font-mono);font-size:.75rem;letter-spacing:.12em;color:var(--cream);display:flex;flex-direction:column;line-height:1.3}
.nav__logo span{color:var(--teal-bright)}
.nav__links{display:flex;gap:2.5rem;list-style:none}
.nav__links a{font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-light);transition:color .25s}
.nav__links a:hover{color:var(--cream)}
.nav__cta{font-family:var(--font-mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;padding:.65rem 1.5rem;border:1px solid var(--teal-bright);color:var(--teal-bright);transition:background .25s,color .25s}
.nav__cta:hover{background:var(--teal-mid);color:var(--cream)}
@media(max-width:900px){.nav__links{display:none}}

/* HERO */
.hero{min-height:100vh;display:grid;grid-template-columns:42% 1fr;background:var(--forest);position:relative;overflow:hidden}
.hero__left{background:var(--teal-deep);display:flex;flex-direction:column;justify-content:flex-end;padding:8rem 4rem 4rem;position:relative;z-index:2}
.hero__eyebrow{font-family:var(--font-mono);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:2rem}
.hero__name{font-family:var(--font-display);font-weight:700;font-size:clamp(3.5rem,5.5vw,7rem);line-height:.95;color:var(--cream);margin-bottom:1.5rem}
.hero__name em{font-style:italic;color:var(--teal-bright)}
.hero__title{font-size:.9rem;letter-spacing:.06em;color:var(--text-light);line-height:1.7;margin-bottom:2.5rem;max-width:30ch}
.hero__avatar{width:200px;height:240px;background:linear-gradient(160deg,var(--teal-mid),var(--teal-deep));display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:4rem;color:var(--cream);letter-spacing:-.02em;position:relative;overflow:hidden}
.hero__avatar img{width:100%;height:100%;object-fit:cover;object-position:top center}
.hero__avatar::after{content:'';position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(to top,var(--teal-deep),transparent)}
.hero__right{display:flex;flex-direction:column;justify-content:center;padding:10rem 5rem 5rem;position:relative}
.social-feed{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.post-card{position:absolute;background:rgba(42,92,82,0.12);border:1px solid rgba(61,140,122,0.2);backdrop-filter:blur(4px);padding:1.2rem 1.4rem;border-radius:2px;width:200px;animation:float 8s ease-in-out infinite}
.post-card__platform{font-family:var(--font-mono);font-size:.55rem;letter-spacing:.18em;text-transform:uppercase;color:var(--teal-bright);margin-bottom:.5rem}
.post-card__stat{font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--cream);line-height:1}
.post-card__label{font-size:.65rem;color:var(--text-light);margin-top:.25rem;letter-spacing:.05em}
.post-card--1{top:16%;left:6%;animation-delay:0s}.post-card--2{top:12%;right:10%;animation-delay:-2.5s}.post-card--3{bottom:16%;left:8%;animation-delay:-5s}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-10px) rotate(.5deg)}66%{transform:translateY(6px) rotate(-.5deg)}}
.hero__headline{font-family:var(--font-display);font-size:clamp(2rem,3.5vw,4.2rem);font-weight:400;color:var(--cream);line-height:1.15;margin-bottom:2rem;position:relative;z-index:2}
.hero__headline em{font-style:italic;color:var(--gold-light)}
.hero__desc{font-size:1rem;line-height:1.8;color:var(--text-light);max-width:44ch;margin-bottom:3rem;position:relative;z-index:2}
.hero__actions{display:flex;gap:1.2rem;align-items:center;position:relative;z-index:2;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:.75rem;background:var(--gold);color:var(--forest);font-family:var(--font-mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;padding:1rem 2rem;transition:background .25s,transform .25s}
.btn-primary:hover{background:var(--gold-light);transform:translateY(-2px)}
.btn-secondary{font-family:var(--font-mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-light);display:flex;align-items:center;gap:.5rem;transition:color .25s}
.btn-secondary:hover{color:var(--cream)}
@media(max-width:900px){.hero{grid-template-columns:1fr}.hero__left{padding:7rem 2rem 3rem}.hero__right{padding:4rem 2rem}.social-feed{display:none}}

/* TICKER */
.ticker{background:var(--teal-mid);padding:.85rem 0;overflow:hidden;position:relative;z-index:5}
.ticker__track{display:flex;animation:ticker 25s linear infinite;white-space:nowrap;width:max-content}
.ticker__item{flex-shrink:0;padding:0 3rem;font-family:var(--font-mono);font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,240,232,0.9);display:flex;align-items:center;gap:1rem}
.ticker__item::before{content:'◆';font-size:.4rem;color:var(--gold)}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* METRICS */
.metrics{background:var(--forest);padding:clamp(4rem,8vw,7rem) 0}
.metrics__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0}
.metric-item{padding:2.5rem 3rem;border-right:1px solid rgba(61,140,122,0.15);position:relative}
.metric-item:last-child{border-right:none}
.metric-item__platform{font-family:var(--font-mono);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--teal-bright);margin-bottom:1rem}
.metric-item__num{font-family:var(--font-display);font-size:clamp(3rem,5vw,5rem);font-weight:700;color:var(--cream);line-height:1;margin-bottom:.5rem}
.metric-item__num .accent{color:var(--gold)}
.metric-item__label{font-size:.8rem;color:var(--text-light);letter-spacing:.06em;line-height:1.5}

/* SECTION SHARED */
.section{padding:clamp(5rem,10vw,9rem) 0}
.section--sage{background:var(--sage-pale)}
.section--white{background:var(--white)}
.section--forest{background:var(--forest)}
.section-header{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:end;margin-bottom:clamp(3rem,6vw,5rem)}
.section-title{font-family:var(--font-display);font-size:clamp(2.2rem,4vw,4rem);font-weight:600;line-height:1.1;color:var(--text-dark)}
.section-title em{font-style:italic;color:var(--teal-mid)}
.section--forest .section-title{color:var(--cream)}
.section--forest .section-title em{color:var(--gold-light)}
.section-desc{font-size:.95rem;line-height:1.8;color:var(--text-mid);max-width:45ch;align-self:end}
@media(max-width:800px){.section-header{grid-template-columns:1fr}}

/* SERVICES (skills) */
.services__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5px;background:rgba(42,92,82,0.12)}
.service-card{background:var(--sage-pale);padding:3rem;transition:background .3s;position:relative;overflow:hidden}
.service-card::before{content:'';position:absolute;bottom:0;left:0;width:100%;height:3px;background:var(--teal-mid);transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
.service-card:hover{background:var(--white)}.service-card:hover::before{transform:scaleX(1)}
.service-card__num{font-family:var(--font-mono);font-size:.6rem;letter-spacing:.2em;color:var(--teal-bright);margin-bottom:1.5rem;display:flex;align-items:center;gap:.75rem}
.service-card__num::after{content:'';flex:1;height:1px;background:rgba(42,92,82,0.2)}
.service-card__icon{font-size:2rem;margin-bottom:1.25rem;display:block;color:var(--teal-mid)}
.service-card__title{font-family:var(--font-display);font-size:1.4rem;font-weight:600;color:var(--text-dark);margin-bottom:1.25rem;line-height:1.2}
.service-card__tags{display:flex;flex-wrap:wrap;gap:.4rem}
.service-tag{font-family:var(--font-mono);font-size:.6rem;letter-spacing:.1em;padding:.35rem .75rem;border:1px solid rgba(42,92,82,0.25);color:var(--teal-mid);text-transform:uppercase}

/* WORK (campaigns) */
.work__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:1.5rem}
.work-card{background:var(--teal-deep);border:1px solid rgba(61,140,122,0.2);padding:2.5rem;position:relative;transition:transform .3s,border-color .3s}
.work-card:hover{transform:translateY(-4px);border-color:var(--teal-bright)}
.work-card__type{font-family:var(--font-mono);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
.work-card__name{font-family:var(--font-display);font-size:1.5rem;font-weight:600;color:var(--cream);line-height:1.2;margin-bottom:1rem}
.work-card__budget{font-family:var(--font-mono);font-size:.72rem;color:var(--text-light);margin-bottom:1.25rem}
.work-card__metrics{display:flex;flex-direction:column;gap:.6rem;border-top:1px solid rgba(61,140,122,0.15);padding-top:1.25rem}
.work-card__metric{font-size:.88rem;color:var(--text-light);line-height:1.5;padding-left:1.1rem;position:relative}
.work-card__metric::before{content:'';position:absolute;left:0;top:.55rem;width:.6rem;height:2px;background:var(--gold)}
.work-card__channels{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1.25rem}
.work-card__channels .service-tag{color:var(--teal-bright);border-color:rgba(61,140,122,0.3)}

/* TIMELINE (experience) */
.tl{position:relative;padding-left:2rem;border-left:1px solid rgba(42,92,82,0.25)}
.tl-item{position:relative;padding-bottom:2.5rem}
.tl-item:last-child{padding-bottom:0}
.tl-item::before{content:'';position:absolute;left:calc(-2rem - 5px);top:5px;width:11px;height:11px;border-radius:50%;background:var(--gold);border:2px solid var(--sage-pale)}
.tl-year{font-family:var(--font-mono);font-size:.66rem;letter-spacing:.15em;text-transform:uppercase;color:var(--teal-bright);margin-bottom:.4rem}
.tl-title{font-family:var(--font-display);font-size:1.4rem;font-weight:600;color:var(--text-dark);margin-bottom:.25rem}
.tl-company{font-size:.88rem;color:var(--teal-mid);font-weight:500;margin-bottom:.75rem}
.tl-desc{font-size:.92rem;color:var(--text-mid);line-height:1.75;max-width:640px;margin-bottom:.75rem}
.tl-metrics{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.6rem}
.tl-metric{font-size:.88rem;color:var(--text-mid);line-height:1.55;padding-left:1.1rem;position:relative}
.tl-metric::before{content:'';position:absolute;left:0;top:.6rem;width:.6rem;height:1.5px;background:var(--gold)}
.tl-chips{display:flex;flex-wrap:wrap;gap:.4rem}

/* MINI CARDS (education/certs/achievements/custom) */
.mini-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5px;background:rgba(42,92,82,0.12)}
.mini-card{background:var(--sage-pale);padding:2.5rem;position:relative;transition:background .3s}
.mini-card:hover{background:var(--white)}
.mini-year{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;color:var(--teal-bright);margin-bottom:.75rem}
.mini-title{font-family:var(--font-display);font-size:1.25rem;font-weight:600;color:var(--text-dark);line-height:1.25;margin-bottom:.4rem}
.mini-meta{font-size:.88rem;color:var(--text-mid);line-height:1.6}
.mini-badge{display:inline-flex;margin-top:.75rem;padding:.35rem .8rem;background:var(--gold);color:var(--forest);font-family:var(--font-mono);font-size:.6rem;letter-spacing:.1em;text-transform:uppercase}
.mini-link{display:inline-block;margin-top:.75rem;font-family:var(--font-mono);font-size:.66rem;color:var(--teal-mid);text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid var(--teal-mid)}
.mini-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}

/* ABOUT */
.about__inner{display:grid;grid-template-columns:1fr 1.2fr;gap:6rem;align-items:center}
.about__visual{position:relative}
.about__img-frame{width:100%;aspect-ratio:3/4;background:linear-gradient(160deg,var(--teal-mid) 0%,var(--teal-deep) 100%);position:relative;overflow:hidden}
.about__img-frame img{width:100%;height:100%;object-fit:cover}
.about__initials{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:8rem;font-weight:700;color:rgba(245,240,232,0.18);letter-spacing:-.05em}
.about__badge{position:absolute;bottom:-1.5rem;right:-1.5rem;width:120px;height:120px;background:var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2}
.about__badge-num{font-family:var(--font-display);font-size:2.5rem;font-weight:700;color:var(--forest);line-height:1}
.about__badge-label{font-family:var(--font-mono);font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--forest);text-align:center;margin-top:.25rem}
.about__content h2{font-family:var(--font-display);font-size:clamp(2rem,3.5vw,3.5rem);font-weight:600;color:var(--text-dark);line-height:1.15;margin:1.5rem 0}
.about__content h2 em{font-style:italic;color:var(--teal-mid)}
.about__content p{font-size:.95rem;line-height:1.85;color:var(--text-mid);margin-bottom:1.5rem}
.about__lead{font-family:var(--font-display);font-style:italic;font-size:1.3rem;line-height:1.5;color:var(--text-dark)}
.about__skills{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:2rem}
.skill-chip{font-family:var(--font-mono);font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;padding:.5rem 1rem;background:var(--white);border:1px solid rgba(42,92,82,0.2);color:var(--teal-mid)}
@media(max-width:900px){.about__inner{grid-template-columns:1fr;gap:3rem}}

/* CONTACT */
.contact__inner{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start}
.contact__lead{font-family:var(--font-display);font-size:clamp(1.6rem,2.4vw,2.4rem);color:var(--cream);line-height:1.3;margin-bottom:2rem}
.contact__lead em{font-style:italic;color:var(--gold-light)}
.contact__items{display:flex;flex-direction:column;gap:1rem}
.contact__item{display:flex;align-items:center;gap:1rem;padding:1.25rem 1.5rem;border:1px solid rgba(61,140,122,0.2);transition:border-color .25s,transform .25s}
.contact__item:hover{border-color:var(--teal-bright);transform:translateX(4px)}
.contact__ic{width:40px;height:40px;border:1px solid var(--teal-bright);color:var(--teal-bright);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.contact__label{font-family:var(--font-mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--teal-bright)}
.contact__value{font-size:.95rem;color:var(--cream);margin-top:.2rem}
@media(max-width:800px){.contact__inner{grid-template-columns:1fr;gap:2.5rem}}

/* FOOTER */
.footer{background:var(--forest);padding:3rem 0;border-top:1px solid rgba(61,140,122,0.15)}
.footer__inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.footer__brand-name{font-family:var(--font-display);font-size:1.4rem;color:var(--cream)}
.footer__copy{font-family:var(--font-mono);font-size:.66rem;letter-spacing:.1em;color:var(--text-light)}

/* EDIT CONTROLS */
.ce-add-btn{display:block;margin-top:2rem;padding:1rem 1.5rem;border:1px dashed var(--teal-mid);background:none;color:var(--teal-mid);font-family:var(--font-mono);font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;width:100%;text-align:center}
.ce-add-btn:hover{background:var(--teal-mid);color:var(--cream)}
.section--forest .ce-add-btn,.work__grid + .ce-add-btn{color:var(--teal-bright);border-color:var(--teal-bright)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:1rem;right:1rem;width:26px;height:26px;border-radius:50%;border:none;background:var(--gold);color:var(--forest);font-size:12px;line-height:26px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}
`;
}

const CANOPY_SCRIPT = `<script>
(function(){
  var nav=document.querySelector('.nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);});}
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
	const delBtn = (sec: string, i: number): string => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const yearsExp = v.template_overrides?.years_experience ?? yearsFromExperience(v.experience);
	const campaignsCount = v.template_overrides?.campaigns_count ?? (v.campaigns?.length ?? 0);
	const avgRoas = v.template_overrides?.avg_roas ?? deriveRoas(v.campaigns);
	const rolesCount = v.experience?.length ?? 0;
	const statNum = (key: string, val: number): string => `<span ${ed(`template_overrides.${key}`)}>${val}</span>`;
	const showYears = statShown(v, 'years_experience', yearsExp);
	const showCampaigns = statShown(v, 'campaigns_count', campaignsCount);
	const showRoas = statShown(v, 'avg_roas', avgRoas);
	const initials = v.name.split(' ').map(p => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'MK';

	const nameParts = v.name.split(/\s+/);
	const heroName = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')}<br><em>${nameParts[nameParts.length - 1]}</em>`
		: `<em>${v.name}</em>`;

	// TICKER from skills
	const allSkills = (v.skill_groups ?? []).flatMap(g => g.skills).filter(Boolean);
	const tickerItems = allSkills.length >= 4 ? allSkills : ['Social Strategy', 'Content', 'Paid Social', 'Community', 'Influencer', 'Analytics', 'Brand', 'Growth'];
	const ticker = `<div class="ticker"><div class="ticker__track">${tickerItems.concat(tickerItems).map(s => `<span class="ticker__item">${s}</span>`).join('')}</div></div>`;

	// METRICS band
	const metricItems = [
		showYears ? `<div class="metric-item"><div class="metric-item__platform">Experience</div><div class="metric-item__num"><span class="accent">${statNum('years_experience', yearsExp)}+</span></div><div class="metric-item__label">Years in marketing</div></div>` : '',
		showCampaigns ? `<div class="metric-item"><div class="metric-item__platform">Delivery</div><div class="metric-item__num">${statNum('campaigns_count', campaignsCount)}+</div><div class="metric-item__label">Campaigns launched</div></div>` : '',
		showRoas ? `<div class="metric-item"><div class="metric-item__platform">Performance</div><div class="metric-item__num"><span class="accent">${statNum('avg_roas', avgRoas)}×</span></div><div class="metric-item__label">Average ROAS</div></div>` : '',
		rolesCount > 0 ? `<div class="metric-item"><div class="metric-item__platform">Track record</div><div class="metric-item__num">${rolesCount}</div><div class="metric-item__label">Roles &amp; engagements</div></div>` : '',
	].filter(Boolean).join('');
	const metricsHtml = metricItems ? `<section class="metrics"><div class="container"><div class="metrics__grid">${metricItems}</div></div></section>` : '';

	// SKILLS (services)
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section class="section section--sage" id="skills"><div class="container">
<div class="section-header reveal"><div><div class="tag" style="margin-bottom:1.5rem">Expertise</div><h2 class="section-title">What I <em>do</em></h2></div><p class="section-desc">Full-funnel social &amp; content marketing — strategy, creative, and performance.</p></div>
<div class="services__grid">
${v.skill_groups.map((g, gi) => `<div class="service-card reveal"${iw}>
${delBtn('skills', gi)}
<div class="service-card__num">${String(gi + 1).padStart(2, '0')}</div>
<span class="service-card__icon">${SVC_ICONS[gi % SVC_ICONS.length]}</span>
<div class="service-card__title" ${ed(`skills.${gi}.category`)}>${g.category || 'Skills'}</div>
<div class="service-card__tags" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="service-tag">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>` : '';

	// CAMPAIGNS (work, dark)
	const campaignsHtml = !hidden.has('campaigns') && (v.campaigns?.length || em)
		? `<section class="section section--forest" id="campaigns"><div class="container">
<div class="section-header reveal"><div><div class="tag tag--light" style="margin-bottom:1.5rem">Selected Work</div><h2 class="section-title">Campaigns that <em>moved</em> the numbers</h2></div></div>
<div class="work__grid">
${(v.campaigns ?? []).map((c, i) => `<div class="work-card reveal"${iw}>
${delBtn('campaigns', i)}
${c.campaign_type ? `<div class="work-card__type" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div>` : ''}
<div class="work-card__name" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || 'Campaign'}</div>
${c.budget ? `<div class="work-card__budget">Budget: <span ${ed(`campaigns.${i}.budget`)}>${c.budget}</span></div>` : ''}
${c.performance_metrics?.length ? `<div class="work-card__metrics" ${le(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map(m => `<div class="work-card__metric">${m}</div>`).join('')}</div>` : ''}
${c.channels_used?.length ? `<div class="work-card__channels" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.map(ch => `<span class="service-tag">${ch}</span>`).join('')}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('campaigns', 'Campaign')}
</div></section>` : '';

	// EXPERIENCE (timeline)
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section class="section section--sage" id="experience"><div class="container">
<div class="section-header reveal"><div><div class="tag" style="margin-bottom:1.5rem">Journey</div><h2 class="section-title">Where I've <em>worked</em></h2></div></div>
<div class="tl">
${v.experience.map((exp, i) => `<div class="tl-item reveal"${iw}>
${delBtn('experience', i)}
<div class="tl-year">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : (em ? `<span ${ed(`experience.${i}.start_date`)}>Start</span>` : '')}${(exp.start_date && exp.end_date) ? ' — ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : (em ? `<span ${ed(`experience.${i}.end_date`)}>End</span>` : '')}</div>
<div class="tl-title" ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}</div>
${exp.company ? `<div class="tl-company"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="tl-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.key_points?.length ? `<div class="tl-metrics" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<div class="tl-metric">${k}</div>`).join('')}</div>` : ''}
${exp.channels_managed?.length ? `<div class="tl-chips" ${le(`experience.${i}.channels_managed`)}>${exp.channels_managed.map(c => `<span class="service-tag">${c}</span>`).join('')}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section class="section section--white" id="education"><div class="container">
<div class="section-header reveal"><div><div class="tag" style="margin-bottom:1.5rem">Education</div><h2 class="section-title">Academic <em>background</em></h2></div></div>
<div class="mini-grid">
${v.education.map((edu, i) => `<div class="mini-card"${iw}>
${delBtn('education', i)}
<div class="mini-year">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : (em ? `<span ${ed(`education.${i}.start_year`)}>Start</span>` : '')}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : (em ? `<span ${ed(`education.${i}.end_year`)}>End</span>` : '')}</div>
<div class="mini-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</div>
${edu.institution ? `<div class="mini-meta"><span ${ed(`education.${i}.institution`)}>${edu.institution}</span>${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<span class="mini-badge" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section class="section section--sage" id="certifications"><div class="container">
<div class="section-header reveal"><div><div class="tag" style="margin-bottom:1.5rem">Credentials</div><h2 class="section-title"><em>Certifications</em></h2></div></div>
<div class="mini-grid">
${v.certifications.map((c, i) => `<div class="mini-card"${iw}>
${delBtn('certifications', i)}
${c.year ? `<div class="mini-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
<div class="mini-title" ${ed(`certifications.${i}.name`)}>${c.name}</div>
${c.issuer ? `<div class="mini-meta" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.url ? `<a href="${c.url}" class="mini-link" target="_blank" rel="noopener noreferrer">Verify &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section class="section section--white" id="achievements"><div class="container">
<div class="section-header reveal"><div><div class="tag" style="margin-bottom:1.5rem">Recognition</div><h2 class="section-title">Wins &amp; <em>milestones</em></h2></div></div>
<div class="mini-grid">
${v.achievements.map((a, i) => `<div class="mini-card"${iw}>
${delBtn('achievements', i)}
${a.year ? `<div class="mini-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
<div class="mini-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="mini-meta" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			const cards = (cs.items ?? []).map((item, i) => `<div class="mini-card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<div class="mini-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
${item.label ? `<div class="mini-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}
${item.value ? `<div class="mini-meta" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="mini-chips" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="service-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="mini-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section class="section section--sage" id="${cs.section_id}"><div class="container">
<div class="section-header reveal"><div><div class="tag" style="margin-bottom:1.5rem">${cs.title}</div><h2 class="section-title">${cs.title}</h2></div></div>
<div class="mini-grid">${cards}</div>
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		skills: skillsHtml, campaigns: campaignsHtml, experience: experienceHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// ABOUT
	const aboutSkills = (v.skill_groups ?? []).flatMap(g => g.skills).slice(0, 8);
	const aboutHtml = (v.bio || v.uniqueValue)
		? `<section class="section about section--sage" id="about"><div class="container about__inner">
<div class="about__visual reveal">
<div class="about__img-frame" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="about__initials">${initials}</div>`}</div>
${showYears ? `<div class="about__badge"><div class="about__badge-num">${statNum('years_experience', yearsExp)}+</div><div class="about__badge-label">Years</div></div>` : ''}
</div>
<div class="about__content reveal">
<div class="tag">About</div>
<h2>The person <em>behind the feed</em></h2>
${v.uniqueValue ? `<p class="about__lead" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
${aboutSkills.length ? `<div class="about__skills">${aboutSkills.map(s => `<span class="skill-chip">${s}</span>`).join('')}</div>` : ''}
</div>
</div></section>` : '';

	// CONTACT
	const contactItems = [
		v.email ? `<a class="contact__item" href="mailto:${v.email}"><div class="contact__ic">✉</div><div><div class="contact__label">Email</div><div class="contact__value" ${ed('profile.email')}>${v.email}</div></div></a>` : '',
		v.phone ? `<a class="contact__item" href="tel:${v.phone}"><div class="contact__ic">☎</div><div><div class="contact__label">Phone</div><div class="contact__value" ${ed('profile.phone')}>${v.phone}</div></div></a>` : '',
		v.location ? `<div class="contact__item"><div class="contact__ic">◈</div><div><div class="contact__label">Location</div><div class="contact__value" ${ed('profile.location')}>${v.location}</div></div></div>` : '',
		v.linkedin_url ? `<a class="contact__item" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer"><div class="contact__ic">in</div><div><div class="contact__label">LinkedIn</div><div class="contact__value">Connect</div></div></a>` : '',
	].filter(Boolean).join('');
	const contactHtml = contactItems
		? `<section class="section section--forest" id="contact"><div class="container contact__inner">
<div class="reveal">
<div class="tag tag--light">Contact</div>
<div class="contact__lead" style="margin-top:1.5rem">Let's make something <em>worth sharing</em>.</div>
<p style="color:var(--text-light);line-height:1.8;max-width:40ch">Open to social &amp; content marketing leadership roles and consulting engagements.</p>
</div>
<div class="contact__items reveal">${contactItems}</div>
</div></section>` : '';

	// Floating social post cards (decorative, from computed stats)
	const postCards = [
		showCampaigns ? `<div class="post-card post-card--1"><div class="post-card__platform">Reach</div><div class="post-card__stat">${campaignsCount}+</div><div class="post-card__label">Campaigns</div></div>` : '',
		showRoas ? `<div class="post-card post-card--2"><div class="post-card__platform">Efficiency</div><div class="post-card__stat">${avgRoas}×</div><div class="post-card__label">Avg. ROAS</div></div>` : '',
		showYears ? `<div class="post-card post-card--3"><div class="post-card__platform">Experience</div><div class="post-card__stat">${yearsExp}+</div><div class="post-card__label">Years</div></div>` : '',
	].filter(Boolean).join('');

	return `<!DOCTYPE html>
<html lang="en">
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
<nav class="nav"><div class="container nav__inner">
<div class="nav__logo"><span ${ed('profile.full_name')}>${v.name}</span><span>${v.profile_headline || 'Marketing'}</span></div>
<ul class="nav__links">
<li><a href="#skills">Expertise</a></li>
<li><a href="#campaigns">Work</a></li>
<li><a href="#experience">Journey</a></li>
<li><a href="#about">About</a></li>
</ul>
${v.email ? `<a href="mailto:${v.email}" class="nav__cta">Contact</a>` : ''}
</div></nav>

<section class="hero">
<div class="hero__left">
<div class="hero__eyebrow">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Marketing Portfolio'}</div>
<h1 class="hero__name" ${ed('profile.full_name')}>${heroName}</h1>
${v.bio ? `<p class="hero__title" ${ed('portfolio.bio', true)}>${v.bio.slice(0, 120)}${v.bio.length > 120 ? '…' : ''}</p>` : ''}
<div class="hero__avatar" ${_imgUpload('profile.profile_image', em)}>${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : initials}</div>
</div>
<div class="hero__right">
<div class="social-feed">${postCards}</div>
<h2 class="hero__headline">${v.headline ? `<span ${ed('portfolio.headline')}>${v.headline}</span>` : 'Turning <em>audiences</em> into communities'}</h2>
${v.bio ? `<p class="hero__desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="hero__actions">
<a href="#campaigns" class="btn-primary">View Work</a>
<a href="#contact" class="btn-secondary">Get in touch</a>
</div>
</div>
</section>

${ticker}
${metricsHtml}
${aboutHtml}
${orderedSections}
${contactHtml}

<footer class="footer"><div class="container footer__inner">
<div class="footer__brand-name" ${ed('profile.full_name')}>${v.name}</div>
<div class="footer__copy">&copy; ${new Date().getFullYear()} · ${v.profile_headline || v.headline || 'Marketing Portfolio'}${v.location ? ` · ${v.location}` : ''}</div>
</div></footer>

${CANOPY_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
