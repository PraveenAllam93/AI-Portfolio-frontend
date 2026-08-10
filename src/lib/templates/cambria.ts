/**
 * Template: Cambria
 * Accountant theme — luxury editorial practice site on a warm cream canvas with
 * ink-black bands and an antique-gold accent. Cormorant Garamond italics over
 * Jost body copy, a full-height split hero with a clipped dark portrait panel
 * and a slowly rotating seal, numbered hairline-gutter service cards, an
 * inverted ink timeline, and corner-clipped case cards.
 * Palette: ink #0e0d0b, cream #f7f3ec, parchment #ede8de, gold #b8935a,
 * gold-light #d4a96a, gold-pale #f0e0c8, slate #3a3530, mist #9c9690.
 * Fonts: Cormorant Garamond (display serif) · Jost (body).
 * Signature: gold cursor dot + ring with hover scaling (published mode only),
 * spinning hero seal, staggered scroll reveals, underline-grow nav links,
 * wipe-fill primary button, card lifts.
 *
 * Ported from templates_add/accounting-2.html. The testimonials block and the
 * contact form had no backing fields, so they are replaced by data-backed
 * sections and a contact card (Z15 — no dead controls).
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap';

const SERVICE_ICONS = ['📊', '📋', '🏢', '🔍', '💼', '📈', '🧾', '⚖️'];

function initials(name: string): string {
	const p = name.trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1]?.[0] ?? '' : '')).toUpperCase() || '••';
}

function yearsExperience(experience: NormalizedData['experience']): number {
	if (!experience?.length) return 0;
	let earliest = new Date().getFullYear();
	for (const exp of experience) {
		const m = (exp.duration ?? '').match(/\b(19|20)\d{2}\b/);
		if (m) {
			const y = parseInt(m[0], 10);
			if (y < earliest) earliest = y;
		}
	}
	return Math.max(0, new Date().getFullYear() - earliest);
}

function css(v: NormalizedData): string {
	const em = v.edit_mode;
	return `
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --ink: #0e0d0b;
  --cream: #f7f3ec;
  --parchment: #ede8de;
  --gold: #b8935a;
  --gold-light: #d4a96a;
  --gold-pale: #f0e0c8;
  --slate: #3a3530;
  --mist: #9c9690;
  --white: #fefefe;
}

html { scroll-behavior: smooth; }
body { font-family: 'Jost', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

${em ? '' : `
/* Cursor — published mode only, so inline editing stays usable (Z13) */
* { cursor: none !important; }
#cursor {
  position: fixed; width: 10px; height: 10px; background: var(--gold); border-radius: 50%;
  pointer-events: none; z-index: 9999; transform: translate(-50%,-50%);
  transition: transform .15s ease, background .2s; top: -40px; left: -40px;
}
#cursor-ring {
  position: fixed; width: 34px; height: 34px; border: 1.5px solid var(--gold); border-radius: 50%;
  pointer-events: none; z-index: 9998; transform: translate(-50%,-50%);
  transition: all .35s cubic-bezier(.25,.46,.45,.94); opacity: .6; top: -40px; left: -40px;
}`}

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.4rem 4rem; background: rgba(247,243,236,.92); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(184,147,90,.18); transition: all .4s;
}
.nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 600; color: var(--ink); letter-spacing: .04em; }
.nav-logo span { color: var(--gold); }
.nav-links { display: flex; gap: 2.4rem; }
.nav-links a {
  font-size: .78rem; font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
  color: var(--slate); position: relative; padding-bottom: 3px; transition: color .25s;
}
.nav-links a::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: var(--gold); transition: width .3s ease; }
.nav-links a:hover { color: var(--gold); }
.nav-links a:hover::after { width: 100%; }
.nav-cta {
  font-size: .75rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
  color: var(--gold); border: 1.5px solid var(--gold); padding: .55rem 1.4rem; transition: all .3s;
}
.nav-cta:hover { background: var(--gold); color: var(--white); }

/* HERO */
.hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; position: relative; overflow: hidden; }
.hero-left { display: flex; flex-direction: column; justify-content: center; padding: 8rem 4rem 4rem 6rem; position: relative; z-index: 2; }
.hero-eyebrow {
  font-size: .72rem; font-weight: 500; letter-spacing: .28em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 1.4rem; display: flex; align-items: center; gap: .8rem;
}
.hero-eyebrow::before { content: ''; display: block; width: 36px; height: 1px; background: var(--gold); flex: none; }
.hero-title {
  font-family: 'Cormorant Garamond', serif; font-size: clamp(3.2rem,5.5vw,5.2rem);
  font-weight: 300; line-height: 1.1; color: var(--ink); margin-bottom: 1rem;
}
.hero-title em { font-style: italic; color: var(--gold); }
.hero-subtitle { font-size: 1rem; font-weight: 300; color: var(--mist); line-height: 1.75; max-width: 400px; margin-bottom: 2.8rem; }
.hero-actions { display: flex; gap: 1.2rem; align-items: center; flex-wrap: wrap; }
.btn-primary {
  font-size: .78rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
  background: var(--gold); color: var(--white); padding: .9rem 2.2rem;
  transition: all .3s; position: relative; overflow: hidden; border: none; font-family: 'Jost', sans-serif;
}
.btn-primary::after { content: ''; position: absolute; inset: 0; background: var(--gold-light); transform: translateX(-101%); transition: transform .3s ease; }
.btn-primary:hover::after { transform: translateX(0); }
.btn-primary span { position: relative; z-index: 1; }
.btn-ghost {
  font-size: .78rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
  color: var(--slate); display: flex; align-items: center; gap: .6rem; transition: color .3s;
}
.btn-ghost:hover { color: var(--gold); }
.btn-ghost svg { transition: transform .3s; }
.btn-ghost:hover svg { transform: translateX(4px); }
.hero-stats { display: flex; gap: 2.5rem; margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--parchment); flex-wrap: wrap; }
.stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 600; color: var(--gold); line-height: 1; }
.stat-label { font-size: .72rem; font-weight: 400; letter-spacing: .1em; color: var(--mist); margin-top: .3rem; text-transform: uppercase; }

.hero-right { position: relative; overflow: hidden; }
.hero-img-wrap { position: absolute; inset: 0; clip-path: polygon(8% 0, 100% 0, 100% 100%, 0% 100%); }
.hero-img-bg { position: absolute; inset: 0; background: linear-gradient(135deg,#2c2820 0%,#1a1710 60%,#0e0d0b 100%); }
.hero-pattern {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(184,147,90,.04) 30px, rgba(184,147,90,.04) 31px),
    repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(184,147,90,.04) 30px, rgba(184,147,90,.04) 31px);
}
.hero-portrait-frame { position: absolute; bottom: 0; right: 0; left: 8%; height: 88%; display: flex; align-items: flex-end; justify-content: center; }
.portrait-slot {
  position: relative; width: 75%; aspect-ratio: 3/4; overflow: hidden;
  background: linear-gradient(180deg, rgba(184,147,90,.15) 0%, rgba(184,147,90,.35) 100%);
  border: 1px solid rgba(184,147,90,.3);
}
.portrait-slot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.portrait-placeholder {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 1rem; color: rgba(184,147,90,.5);
}
.portrait-icon { font-family: 'Cormorant Garamond', serif; font-size: 4rem; opacity: .55; }
.portrait-text { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; }
.hero-badge {
  position: absolute; top: 3rem; right: 3rem; width: 90px; height: 90px;
  border: 1.5px solid rgba(184,147,90,.5); border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: spin-badge 20s linear infinite; color: rgba(184,147,90,.7);
  font-size: .55rem; letter-spacing: .15em; text-align: center; text-transform: uppercase; line-height: 1.5; z-index: 3;
}
@keyframes spin-badge { to { transform: rotate(360deg); } }

/* SECTION SHARED */
section { padding: 6rem 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }
.section-label {
  font-size: .7rem; font-weight: 500; letter-spacing: .3em; text-transform: uppercase;
  color: var(--gold); margin-bottom: .8rem; display: flex; align-items: center; gap: .8rem;
}
.section-label::before { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); flex: none; }
.section-title {
  font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem,3.5vw,3rem);
  font-weight: 300; color: var(--ink); line-height: 1.2; margin-bottom: 1.2rem;
}
.section-title em { font-style: italic; color: var(--gold); }
.gold-line { width: 60px; height: 2px; background: var(--gold); margin: 1.5rem 0; }
.bg-white { background: var(--white); }
.bg-parchment { background: var(--parchment); }
.bg-ink { background: var(--ink); }
.bg-ink .section-title { color: var(--cream); }
.bg-ink .section-label { color: var(--gold-light); }
.bg-ink .section-label::before { background: var(--gold-light); }

/* ABOUT */
.about-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 6rem; align-items: center; }
.about-visual { position: relative; }
.about-img-box {
  position: relative; aspect-ratio: 3/4; max-height: 480px; overflow: hidden;
  background: linear-gradient(160deg, var(--parchment) 0%, var(--gold-pale) 100%);
  border: 1px solid rgba(184,147,90,.2);
  display: flex; align-items: center; justify-content: center; color: var(--gold);
}
.about-img-box img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.about-ph { font-family: 'Cormorant Garamond', serif; font-size: 3.4rem; opacity: .45; }
.about-accent { position: absolute; bottom: -1.5rem; right: -1.5rem; width: 120px; height: 120px; border: 2px solid var(--gold-pale); z-index: -1; }
.about-accent-2 { position: absolute; top: -1.5rem; left: -1.5rem; width: 80px; height: 80px; background: var(--gold-pale); z-index: -1; }
.about-text p { font-size: .95rem; font-weight: 300; color: var(--slate); line-height: 1.85; margin-bottom: 1.2rem; }
.credentials { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.8rem; }
.credential-tag {
  font-size: .7rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase;
  background: var(--parchment); border: 1px solid rgba(184,147,90,.3); color: var(--slate); padding: .45rem 1rem;
  transition: border-color .3s, color .3s;
}
.credential-tag:hover { border-color: var(--gold); color: var(--gold); }

/* SERVICES (skill groups) */
.services-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 4rem; align-items: end; }
.services-desc { font-size: .95rem; font-weight: 300; color: var(--mist); line-height: 1.85; }
.services-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5px; background: rgba(184,147,90,.15); }
.service-card { background: var(--cream); padding: 2.5rem 2rem; transition: all .4s; position: relative; overflow: hidden; }
.service-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform .4s ease; }
.service-card:hover::before { transform: scaleX(1); }
.service-card:hover { background: var(--white); }
.service-icon { font-size: 2rem; margin-bottom: 1.2rem; display: block; }
.service-num { position: absolute; top: 1.5rem; right: 1.8rem; font-family: 'Cormorant Garamond', serif; font-size: 3.5rem; font-weight: 300; color: rgba(184,147,90,.1); line-height: 1; }
.service-name { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 400; color: var(--ink); margin-bottom: .9rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: .5rem; }
.chip {
  font-size: .72rem; font-weight: 400; letter-spacing: .06em; color: var(--slate);
  background: var(--parchment); border: 1px solid rgba(184,147,90,.22); padding: .35rem .8rem;
}
.bg-ink .chip { background: rgba(255,255,255,.05); border-color: rgba(184,147,90,.3); color: rgba(247,243,236,.75); }

/* Flat chip panels */
.chip-panel { border: 1px solid rgba(184,147,90,.25); padding: 2.5rem 2rem; background: var(--white); }
.chip-panel .chip { font-size: .78rem; padding: .5rem 1.1rem; }

/* EXPERIENCE (ink) */
.exp-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 5rem; margin-top: 3rem; }
.exp-side-text { font-size: .9rem; font-weight: 300; color: rgba(247,243,236,.5); line-height: 1.85; }
.timeline { position: relative; }
.timeline::before { content: ''; position: absolute; left: 0; top: .5rem; bottom: .5rem; width: 1px; background: rgba(184,147,90,.25); }
.timeline-item { padding-left: 2.5rem; margin-bottom: 2.8rem; position: relative; }
.timeline-item:last-child { margin-bottom: 0; }
.timeline-item::before { content: ''; position: absolute; left: -4px; top: .5rem; width: 9px; height: 9px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 0 3px rgba(184,147,90,.2); }
.timeline-period { font-size: .7rem; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); margin-bottom: .5rem; }
.timeline-role { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; color: var(--cream); margin-bottom: .3rem; }
.timeline-company { font-size: .85rem; color: rgba(247,243,236,.5); margin-bottom: .8rem; font-weight: 300; }
.timeline-desc { font-size: .85rem; font-weight: 300; color: rgba(247,243,236,.6); line-height: 1.7; }
.timeline-points { margin-top: .9rem; display: flex; flex-direction: column; gap: .5rem; }
.timeline-points li { font-size: .84rem; font-weight: 300; color: rgba(247,243,236,.62); line-height: 1.65; padding-left: 1rem; position: relative; }
.timeline-points li::before { content: ''; position: absolute; left: 0; top: .62em; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }

/* CASE CARDS (engagements) */
.cases-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 2rem; margin-top: 3rem; }
.case-card { background: var(--white); padding: 2.5rem; position: relative; overflow: hidden; transition: transform .35s ease, box-shadow .35s ease; }
.case-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(14,13,11,.08); }
.case-tag { font-size: .65rem; font-weight: 500; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
.case-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--ink); margin-bottom: .8rem; line-height: 1.3; }
.case-desc { font-size: .87rem; font-weight: 300; color: var(--mist); line-height: 1.75; margin-bottom: 1.2rem; }
.case-meta { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1.2rem; }
.case-meta-row { display: flex; justify-content: space-between; gap: 1rem; font-size: .78rem; border-bottom: 1px dashed var(--parchment); padding-bottom: .4rem; }
.case-meta-row .k { color: var(--mist); letter-spacing: .1em; text-transform: uppercase; font-size: .65rem; }
.case-meta-row .val { color: var(--slate); font-weight: 500; text-align: right; }
.case-points { display: flex; flex-direction: column; gap: .45rem; margin-bottom: 1.2rem; }
.case-points li { font-size: .82rem; font-weight: 300; color: var(--slate); line-height: 1.6; padding-left: 1rem; position: relative; }
.case-points li::before { content: ''; position: absolute; left: 0; top: .6em; width: 4px; height: 4px; background: var(--gold); }
.case-mini { font-size: .6rem; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); margin-bottom: .5rem; font-weight: 500; }
.case-result { display: flex; gap: 1.5rem; padding-top: 1.2rem; border-top: 1px solid var(--parchment); flex-wrap: wrap; }
.case-metric { text-align: left; max-width: 190px; }
.case-metric-num { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; color: var(--gold); font-weight: 600; line-height: 1.35; }
.case-corner { position: absolute; bottom: 0; right: 0; width: 80px; height: 80px; background: var(--parchment); clip-path: polygon(100% 0, 100% 100%, 0 100%); pointer-events: none; }
.case-shots { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; margin-bottom: 1.4rem; background: var(--parchment); }
.case-shots img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .7s; }
.case-shots img.active { opacity: 1; }
.shots-dots { position: absolute; bottom: 10px; left: 0; right: 0; display: flex; gap: 5px; justify-content: center; z-index: 2; }
.shots-dots i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.6); }
.shots-dots i.on { background: var(--gold); }

/* CREDENTIAL CARDS (education / certifications / achievements) */
.cred-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 3rem; }
.cred-card { padding: 2.2rem; border: 1px solid var(--parchment); position: relative; transition: border-color .3s, transform .3s; background: var(--white); }
.cred-card:hover { border-color: rgba(184,147,90,.4); transform: translateY(-4px); }
.bg-parchment .cred-card { background: var(--white); }
.cred-year { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--gold); line-height: 1; margin-bottom: .6rem; }
.cred-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--ink); margin-bottom: .35rem; line-height: 1.3; }
.cred-org { font-size: .8rem; font-weight: 300; color: var(--mist); line-height: 1.7; }
.cred-link { font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--gold); display: inline-block; margin-top: .8rem; }
.cred-link:hover { text-decoration: underline; }

/* CUSTOM SECTIONS */
.cs-timeline { position: relative; margin-top: 3rem; padding-left: 2.5rem; border-left: 1px solid rgba(184,147,90,.25); display: flex; flex-direction: column; gap: 2.4rem; }
.cs-tl-item { position: relative; }
.cs-tl-item::before { content: ''; position: absolute; left: -2.9rem; top: .45rem; width: 9px; height: 9px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 0 3px rgba(184,147,90,.2); }
.cs-list { margin-top: 3rem; display: flex; flex-direction: column; gap: 1rem; }
.cs-list-item { background: var(--white); border: 1px solid var(--parchment); padding: 1.4rem 1.8rem; transition: border-color .3s; position: relative; }
.cs-list-item:hover { border-color: rgba(184,147,90,.4); }

/* CONTACT (ink) */
.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; margin-top: 3rem; align-items: start; }
.contact-info-text { font-size: .9rem; font-weight: 300; color: rgba(247,243,236,.5); line-height: 1.85; margin-bottom: 2rem; }
.contact-details { display: flex; flex-direction: column; gap: 1.2rem; }
.contact-item { display: flex; align-items: center; gap: 1rem; }
.contact-item-icon { width: 38px; height: 38px; border: 1px solid rgba(184,147,90,.3); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: .9rem; flex-shrink: 0; }
.contact-item-label { font-size: .65rem; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: rgba(247,243,236,.35); margin-bottom: .2rem; }
.contact-item-value { font-size: .87rem; color: rgba(247,243,236,.75); }
.contact-panel { border: 1px solid rgba(184,147,90,.25); padding: 2.8rem; display: flex; flex-direction: column; gap: 1.2rem; background: rgba(255,255,255,.03); }
.contact-panel h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; color: var(--cream); }
.contact-panel p { font-size: .88rem; font-weight: 300; color: rgba(247,243,236,.5); line-height: 1.8; }
.contact-socials { display: flex; gap: .8rem; margin-top: .4rem; flex-wrap: wrap; }
.contact-socials a {
  font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; color: var(--gold);
  border: 1px solid rgba(184,147,90,.35); padding: .5rem 1.1rem; transition: all .3s;
}
.contact-socials a:hover { background: var(--gold); color: var(--white); }

/* FOOTER */
footer { background: #080807; padding: 2.5rem 4rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(184,147,90,.12); flex-wrap: wrap; gap: 1rem; }
.footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: rgba(247,243,236,.5); }
.footer-logo span { color: var(--gold); }
.footer-copy { font-size: .72rem; color: rgba(247,243,236,.25); letter-spacing: .06em; }
.footer-links { display: flex; gap: 1.8rem; flex-wrap: wrap; }
.footer-links a { font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; color: rgba(247,243,236,.3); transition: color .25s; }
.footer-links a:hover { color: var(--gold); }

/* SCROLL REVEAL */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

[data-item-wrap] { position: relative; }
.ce-add-btn { margin-top: 2rem; }

@media (max-width: 1024px) {
  .container { padding: 0 2.5rem; }
  .hero-left { padding: 7rem 2.5rem 3rem; }
  .services-grid { grid-template-columns: repeat(2,1fr); }
  .cred-grid { grid-template-columns: repeat(2,1fr); }
  nav { padding: 1.2rem 2.5rem; }
  footer { padding: 2.5rem; }
}

@media (max-width: 768px) {
  #cursor, #cursor-ring { display: none; }
  * { cursor: auto !important; }
  nav { padding: 1rem 1.5rem; flex-wrap: wrap; gap: .5rem; }
  .nav-links { display: none; }
  .nav-cta { padding: .45rem 1rem; font-size: .7rem; }
  .hero { display: flex; flex-direction: column; min-height: auto; }
  .hero-right { display: none; }
  .hero-left { padding: 6.5rem 1.5rem 3rem; text-align: left; }
  .hero-title { font-size: 2.6rem; }
  .hero-subtitle { font-size: .9rem; max-width: 100%; }
  .hero-actions { flex-direction: column; align-items: flex-start; gap: .9rem; }
  .btn-primary { width: 100%; text-align: center; padding: 1rem; }
  .hero-stats { gap: 1.5rem; flex-wrap: wrap; margin-top: 2.5rem; padding-top: 1.5rem; }
  .stat-num { font-size: 2rem; }
  section { padding: 4rem 0; }
  .container { padding: 0 1.5rem; }
  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
  .about-img-box { max-height: 280px; }
  .about-accent, .about-accent-2 { display: none; }
  .section-title { font-size: 2rem; }
  .services-intro { grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
  .services-grid { grid-template-columns: 1fr; gap: 0; }
  .service-card { padding: 2rem 1.5rem; }
  .exp-grid { grid-template-columns: 1fr; gap: 2rem; }
  .timeline-role { font-size: 1.1rem; }
  .cases-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .case-result { flex-wrap: wrap; gap: 1rem; }
  .cred-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
  .footer-links { justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; }
  .hero-badge { animation: none; }
}
`;
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const ed = (path: string, multi = false): string => (em ? _editable(path, multi) : '');
	const le = (path: string): string => (em ? _listEditable(path) : '');
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const inits = initials(v.name);

	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const clients = v.template_overrides?.clients_count ?? (v.engagements?.length ?? 0);
	const certCount = v.template_overrides?.certifications_count ?? (v.certifications?.length ?? 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

	const nameParts = v.name.split(/\s+/);
	const firstName = nameParts.slice(0, -1).join(' ') || v.name;
	const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

	const shots = (images: string[], path: string, cls: string, label: string): string => {
		if (!images.length && !em) return '';
		const imgs = images.map((src, k) => `<img src="${src}" alt="" class="${k === 0 ? 'active' : ''}">`).join('');
		const dots = images.length > 1
			? `<div class="shots-dots">${images.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>`
			: '';
		return `<div class="${cls}" ${_imgUpload(path, em, label)}>${imgs}${dots}</div>`;
	};

	// ── HERO ──────────────────────────────────────────────────────────────────
	const heroStats = [
		statShown(v, 'years_experience', years)
			? `<div><div class="stat-num"><span ${ted('years_experience')}>${years}</span>+</div><div class="stat-label">Years Experience</div></div>` : '',
		statShown(v, 'clients_count', clients)
			? `<div><div class="stat-num"><span ${ted('clients_count')}>${clients}</span>+</div><div class="stat-label">Clients Served</div></div>` : '',
		statShown(v, 'certifications_count', certCount)
			? `<div><div class="stat-num"><span ${ted('certifications_count')}>${certCount}</span></div><div class="stat-label">Credentials</div></div>` : ''
	].filter(Boolean).join('');

	const heroPortrait = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="portrait-placeholder"><div class="portrait-icon">${inits}</div><div class="portrait-text">${em ? 'Add your photo' : v.profile_headline || 'Accountant'}</div></div>`;

	// ── ABOUT ─────────────────────────────────────────────────────────────────
	const aboutVisual = v.summary_image
		? `<img src="${v.summary_image}" alt="${v.name}">`
		: `<div class="about-ph">${inits}</div>`;
	const credentialTags = v.core_expertise.length
		? `<div class="credentials" ${le('core_expertise')}>${v.core_expertise.map((t) => `<span class="credential-tag">${t}</span>`).join('')}</div>`
		: em
			? `<div class="credentials" ${le('core_expertise')}><span class="credential-tag">Add core expertise</span></div>`
			: '';
	const aboutHtml = (v.bio || v.uniqueValue || v.summary_image || em)
		? `<section id="about" class="bg-white">
  <div class="container">
    <div class="about-grid">
      <div class="about-visual reveal">
        <div class="about-accent-2"></div>
        <div class="about-img-box" ${_imgUpload('profile.summary_image', em, 'Upload image')}>${aboutVisual}</div>
        <div class="about-accent"></div>
      </div>
      <div class="about-text reveal">
        <p class="section-label">About Me</p>
        <h2 class="section-title">Numbers Are My<br><em>Native Language</em></h2>
        <div class="gold-line"></div>
        ${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
        ${credentialTags}
      </div>
    </div>
  </div>
</section>` : '';

	// ── SKILLS (services grid) ────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<section id="skills">
  <div class="container">
    <div class="services-intro">
      <div class="reveal">
        <p class="section-label">What I Offer</p>
        <h2 class="section-title">Comprehensive<br><em>Financial Services</em></h2>
      </div>
      <p class="services-desc reveal">Every discipline below is delivered with the precision and discretion your finances deserve — no cookie-cutter solutions, only strategies built around your specific goals.</p>
    </div>
    <div class="services-grid">
${v.skill_groups.map((g, gi) => `      <div class="service-card reveal"${iw}>
        ${delBtn('skills', gi)}
        <span class="service-num">${String(gi + 1).padStart(2, '0')}</span>
        <span class="service-icon">${SERVICE_ICONS[gi % SERVICE_ICONS.length]}</span>
        <h3 class="service-name" ${ed(`skills.${gi}.category`)}>${g.category}</h3>
        <div class="chip-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
      </div>`).join('\n')}
    </div>
    ${addBtn('skills', 'Skill Group')}
  </div>
</section>` : '';

	// ── EXPERIENCE (ink band) ─────────────────────────────────────────────────
	const experienceHtml = (v.experience?.length || em)
		? `<section id="experience" class="bg-ink">
  <div class="container">
    <p class="section-label">Career Journey</p>
    <h2 class="section-title">A Track Record of<br><em>Excellence</em></h2>
    <div class="exp-grid">
      <div>
        <p class="exp-side-text reveal">A career spanning public accounting, corporate finance, and independent advisory — a breadth of perspective brought to every engagement.</p>
      </div>
      <div class="timeline">
${v.experience.map((exp, i) => {
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
			return `        <div class="timeline-item reveal"${iw}>
          ${delBtn('experience', i)}
          ${period ? `<div class="timeline-period">${period}</div>` : ''}
          <div class="timeline-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
          ${exp.company ? `<div class="timeline-company"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? `, <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
          ${exp.description ? `<div class="timeline-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
          ${exp.key_points?.length ? `<ul class="timeline-points" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
          ${shots(exp.images ?? [], `experience.${i}.images`, 'case-shots', 'Upload image')}
        </div>`;
		}).join('\n')}
      </div>
    </div>
    ${addBtn('experience', 'Experience')}
  </div>
</section>` : '';

	// ── ENGAGEMENTS (case cards) ──────────────────────────────────────────────
	const engagementsHtml = (v.engagements?.length || em)
		? `<section id="engagements" class="bg-parchment">
  <div class="container">
    <p class="section-label">Client Outcomes</p>
    <h2 class="section-title">Real Results,<br><em>Real Impact</em></h2>
    <div class="cases-grid">
${v.engagements.map((en, i) => {
			const period = _rangeEditable(`engagements.${i}.start_date`, en.start_date, `engagements.${i}.end_date`, en.end_date, em, ' — ');
			const meta = [
				en.industry ? `<div class="case-meta-row"><span class="k">Industry</span><span class="val" ${ed(`engagements.${i}.industry`)}>${en.industry}</span></div>` : '',
				period ? `<div class="case-meta-row"><span class="k">Period</span><span class="val">${period}</span></div>` : '',
				en.engagement_value ? `<div class="case-meta-row"><span class="k">Scale</span><span class="val" ${ed(`engagements.${i}.engagement_value`)}>${en.engagement_value}</span></div>` : ''
			].filter(Boolean).join('');
			return `      <div class="case-card reveal"${iw}>
        ${delBtn('engagements', i)}
        ${shots(en.images ?? [], `engagements.${i}.images`, 'case-shots', 'Upload image')}
        ${en.engagement_type ? `<div class="case-tag" ${ed(`engagements.${i}.engagement_type`)}>${en.engagement_type}</div>` : ''}
        <h3 class="case-title" ${ed(`engagements.${i}.client_name`)}>${en.client_name || (em ? 'Client' : '')}</h3>
        ${en.description ? `<p class="case-desc" ${ed(`engagements.${i}.description`, true)}>${en.description}</p>` : ''}
        ${meta ? `<div class="case-meta">${meta}</div>` : ''}
        ${en.responsibilities?.length ? `<div class="case-mini">Responsibilities</div><ul class="case-points" ${le(`engagements.${i}.responsibilities`)}>${en.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
        ${en.deliverables?.length ? `<div class="case-mini">Deliverables</div><ul class="case-points" ${le(`engagements.${i}.deliverables`)}>${en.deliverables.map((d) => `<li>${d}</li>`).join('')}</ul>` : ''}
        ${en.standards_applied?.length ? `<div class="case-mini">Standards</div><div class="chip-row" style="margin-bottom:1.2rem" ${le(`engagements.${i}.standards_applied`)}>${en.standards_applied.map((s) => `<span class="chip">${s}</span>`).join('')}</div>` : ''}
        ${en.tools_used?.length ? `<div class="case-mini">Tools</div><div class="chip-row" style="margin-bottom:1.2rem" ${le(`engagements.${i}.tools_used`)}>${en.tools_used.map((t) => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
        ${en.measurable_outcomes?.length ? `<div class="case-result" ${le(`engagements.${i}.measurable_outcomes`)}>${en.measurable_outcomes.map((o) => `<div class="case-metric"><div class="case-metric-num">${o}</div></div>`).join('')}</div>` : ''}
        <div class="case-corner"></div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('engagements', 'Engagement')}
  </div>
</section>` : '';

	// ── SOFTWARE / COMPLIANCE ─────────────────────────────────────────────────
	const softwareHtml = v.software_proficiency?.length
		? `<section id="software_proficiency" class="bg-white">
  <div class="container">
    <p class="section-label reveal">Systems</p>
    <h2 class="section-title reveal">Software &amp; <em>Platforms</em></h2>
    <div class="chip-panel reveal">
      <div class="chip-row" ${le('software_proficiency')}>${v.software_proficiency.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>` : '';

	const complianceHtml = v.compliance_expertise?.length
		? `<section id="compliance_expertise">
  <div class="container">
    <p class="section-label reveal">Regulatory</p>
    <h2 class="section-title reveal">Standards &amp; <em>Compliance</em></h2>
    <div class="chip-panel reveal">
      <div class="chip-row" ${le('compliance_expertise')}>${v.compliance_expertise.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>` : '';

	// ── EDUCATION / CERTIFICATIONS / ACHIEVEMENTS ─────────────────────────────
	const educationHtml = (v.education?.length || em)
		? `<section id="education" class="bg-white">
  <div class="container">
    <p class="section-label reveal">Academic</p>
    <h2 class="section-title reveal">Education &amp; <em>Training</em></h2>
    <div class="cred-grid">
${v.education.map((edu, i) => {
			const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `      <div class="cred-card reveal"${iw}>
        ${delBtn('education', i)}
        ${yr ? `<div class="cred-year">${yr}</div>` : ''}
        <div class="cred-name">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
        <div class="cred-org">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}${edu.grade_or_score ? `<br><span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}</div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('education', 'Education')}
  </div>
</section>` : '';

	const certsHtml = (v.certifications?.length || em)
		? `<section id="certifications" class="bg-parchment">
  <div class="container">
    <p class="section-label reveal">Credentials</p>
    <h2 class="section-title reveal">Certifications &amp; <em>Licenses</em></h2>
    <div class="cred-grid">
${v.certifications.map((c, i) => `      <div class="cred-card reveal"${iw}>
        ${delBtn('certifications', i)}
        ${c.year ? `<div class="cred-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
        <div class="cred-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
        ${c.issuer ? `<div class="cred-org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
        ${c.url ? `<a class="cred-link" href="${c.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('certifications', 'Certification')}
  </div>
</section>` : '';

	const achievementsHtml = (v.achievements?.length || em)
		? `<section id="achievements" class="bg-white">
  <div class="container">
    <p class="section-label reveal">Recognition</p>
    <h2 class="section-title reveal">Milestones That<br><em>Define the Work</em></h2>
    <div class="cred-grid">
${v.achievements.map((a, i) => `      <div class="cred-card reveal"${iw}>
        ${delBtn('achievements', i)}
        ${a.year ? `<div class="cred-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <div class="cred-name" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.description ? `<div class="cred-org" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
        ${a.url ? `<a class="cred-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('achievements', 'Achievement')}
  </div>
</section>` : '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customHtml = (v.custom_sections ?? []).map((cs, ci) => {
		if (!cs.items?.length && !em) return '';
		const items = cs.items ?? [];
		const sub = (i: number, t: string) => t ? `<div class="case-tag" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${t}</div>` : '';
		const label = (i: number, t: string) => t ? `<div class="cred-name" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${t}</div>` : '';
		const value = (i: number, t: string) => t ? `<div class="cred-org" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${t}</div>` : '';
		const tags = (i: number, t: string[]) => t?.length
			? `<div class="chip-row" style="margin-top:1rem" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span class="chip">${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="cred-link" href="${u}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '';

		let body: string;
		if (cs.display_type === 'timeline') {
			body = `<div class="cs-timeline">${items.map((it, i) => `<div class="cs-tl-item"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else if (cs.display_type === 'list') {
			body = `<div class="cs-list">${items.map((it, i) => `<div class="cs-list-item"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else {
			body = `<div class="cred-grid">${items.map((it, i) => `<div class="cred-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		}
		return `<section id="${cs.section_id}" class="bg-parchment">
  <div class="container">
    <p class="section-label reveal">More</p>
    <h2 class="section-title reveal" ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2>
    <div class="reveal">${body}</div>
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>
</section>`;
	}).filter(Boolean).join('\n');

	const sectionMap: Record<string, string> = {
		experience: experienceHtml,
		engagements: engagementsHtml,
		skills: skillsHtml,
		software_proficiency: softwareHtml,
		compliance_expertise: complianceHtml,
		education: educationHtml,
		certifications: certsHtml,
		achievements: achievementsHtml,
		custom_sections: customHtml
	};
	const orderedSections = order
		.filter((k) => !hidden.has(k) && k in sectionMap)
		.map((k) => sectionMap[k])
		.filter(Boolean)
		.join('\n');

	const NAV_LABELS: Record<string, string> = {
		about: 'About', skills: 'Services', experience: 'Experience', engagements: 'Case Studies',
		software_proficiency: 'Systems', compliance_expertise: 'Compliance',
		education: 'Education', certifications: 'Credentials', achievements: 'Recognition'
	};
	const navKeys: string[] = [];
	if (v.bio || v.uniqueValue) navKeys.push('about');
	for (const key of order) {
		if (hidden.has(key) || !(key in sectionMap) || !sectionMap[key]) continue;
		if (key === 'custom_sections') continue;
		navKeys.push(key);
	}
	const navItems = navKeys.slice(0, 6).map((k) => `<li><a href="#${k}">${NAV_LABELS[k] ?? k}</a></li>`).join('');
	const workAnchor = navKeys.includes('engagements') ? 'engagements' : navKeys.includes('experience') ? 'experience' : 'contact';
	const servicesAnchor = navKeys.includes('skills') ? 'skills' : workAnchor;

	// ── CONTACT ───────────────────────────────────────────────────────────────
	const contactRows = [
		v.email ? `<div class="contact-item"><div class="contact-item-icon">&#9993;</div><div><div class="contact-item-label">Email</div><div class="contact-item-value" ${ed('profile.email')}>${v.email}</div></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-item-icon">&#9742;</div><div><div class="contact-item-label">Phone</div><div class="contact-item-value" ${ed('profile.phone')}>${v.phone}</div></div></div>` : '',
		v.location ? `<div class="contact-item"><div class="contact-item-icon">&#9906;</div><div><div class="contact-item-label">Office</div><div class="contact-item-value" ${ed('profile.location')}>${v.location}</div></div></div>` : ''
	].filter(Boolean).join('');
	const socials = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Website</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">X</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''
	].filter(Boolean).join('');
	const contactHtml = (contactRows || socials)
		? `<section id="contact" class="bg-ink">
  <div class="container">
    <p class="section-label">Let's Connect</p>
    <h2 class="section-title">Start a<br><em>Conversation</em></h2>
    <div class="contact-grid">
      <div class="reveal">
        <p class="contact-info-text" ${ed('profile.contact_tagline', true)}>${v.contact_tagline || 'Whether you need a one-time consultation or an ongoing advisory partnership, I&#39;m here to help you make sense of your finances — and make them work harder for you.'}</p>
        <div class="contact-details">${contactRows}</div>
      </div>
      <div class="contact-panel reveal">
        <h3>Let&#39;s balance the books.</h3>
        <p>Send over the scope of what you need — statutory work, a clean-up project, or ongoing advisory — and I&#39;ll reply with a clear plan and timeline within one business day.</p>
        ${v.email ? `<a class="btn-primary" style="align-self:flex-start" href="mailto:${v.email}"><span>Send Message &rarr;</span></a>` : ''}
        ${socials ? `<div class="contact-socials">${socials}</div>` : ''}
      </div>
    </div>
  </div>
</section>` : '';

	const footerLinks = navKeys.slice(0, 4).map((k) => `<li><a href="#${k}">${NAV_LABELS[k] ?? k}</a></li>`).join('');

	const RUNTIME = `<script>
(function(){
  ${em ? '' : `
  var cursor=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
  if(cursor&&ring&&window.matchMedia('(hover:hover)').matches){
    document.addEventListener('mousemove',function(e){
      cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';
      ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';
    });
    document.querySelectorAll('a, button, .service-card, .case-card, .cred-card').forEach(function(el){
      el.addEventListener('mouseenter',function(){
        cursor.style.transform='translate(-50%,-50%) scale(2)';
        ring.style.transform='translate(-50%,-50%) scale(1.4)';
        ring.style.borderColor='#d4a96a';
      });
      el.addEventListener('mouseleave',function(){
        cursor.style.transform='translate(-50%,-50%) scale(1)';
        ring.style.transform='translate(-50%,-50%) scale(1)';
        ring.style.borderColor='#b8935a';
      });
    });
  }`}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry,i){
      if(entry.isIntersecting){
        var t=entry.target;
        setTimeout(function(){t.classList.add('visible');},i*80);
        io.unobserve(t);
      }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  var navbar=document.getElementById('navbar');
  if(navbar){
    window.addEventListener('scroll',function(){
      navbar.style.boxShadow=window.scrollY>40?'0 4px 30px rgba(14,13,11,.08)':'none';
    },{passive:true});
  }

  document.querySelectorAll('.case-shots').forEach(function(box){
    var imgs=box.querySelectorAll('img');
    if(imgs.length<2)return;
    var dots=box.querySelectorAll('.shots-dots i'),i=0;
    setInterval(function(){
      imgs[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('on');
      i=(i+1)%imgs.length;
      imgs[i].classList.add('active'); if(dots[i])dots[i].classList.add('on');
    },3200);
  });
})();
<\/script>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} | ${v.profile_headline || 'CPA &amp; Financial Advisor'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css(v)}</style>
</head>
<body>
${em ? '' : '<div id="cursor"></div><div id="cursor-ring"></div>'}

<nav id="navbar">
  <div class="nav-logo" ${ed('profile.full_name')}>${firstName}${lastName ? ` <span>${lastName}</span>` : ''}</div>
  <ul class="nav-links">${navItems}</ul>
  <a href="#contact" class="nav-cta">Get in Touch</a>
</nav>

<section class="hero">
  <div class="hero-left">
    ${v.profile_headline ? `<p class="hero-eyebrow" ${ed('profile.headline')}>${v.profile_headline}</p>` : ''}
    <h1 class="hero-title" ${ed('portfolio.headline')}>${v.headline || v.name}</h1>
    ${v.bio ? `<p class="hero-subtitle" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
    <div class="hero-actions">
      <a href="#${servicesAnchor}" class="btn-primary"><span>Explore Services</span></a>
      <a href="#${workAnchor}" class="btn-ghost">View Case Studies
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
    ${heroStats ? `<div class="hero-stats">${heroStats}</div>` : ''}
  </div>
  <div class="hero-right">
    <div class="hero-img-wrap">
      <div class="hero-img-bg"></div>
      <div class="hero-pattern"></div>
      <div class="hero-portrait-frame">
        <div class="portrait-slot" ${_imgUpload('profile.profile_image', em)}>${heroPortrait}</div>
      </div>
    </div>
    <div class="hero-badge">${(v.profile_headline || 'Certified').split(/\s+/)[0]}<br>Certified<br>&#9733;</div>
  </div>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
  <div class="footer-logo">${firstName}${lastName ? ` <span>${lastName}</span>` : ''}</div>
  <p class="footer-copy">&copy; ${new Date().getFullYear()} ${v.name}${v.profile_headline ? ` — ${v.profile_headline}` : ''}. All rights reserved.</p>
  <ul class="footer-links">${footerLinks}</ul>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
