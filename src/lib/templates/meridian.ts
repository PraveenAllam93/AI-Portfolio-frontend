/**
 * Template: Meridian
 * Accountant theme — light, trustworthy corporate portfolio on an off-white
 * canvas with a deep navy / muted gold palette. Playfair Display serif headings
 * over Inter body copy, a two-column hero with a framed profile card, bordered
 * cards that lift and turn gold on hover, a seamless 1px-gutter credential grid,
 * and a navy footer.
 * Palette: navy #0a2540, gold #c6a15b, gold-light #e8d5b5, slate #4a5b6e,
 * light-bg #f8fafc, border #e9ecef.
 * Fonts: Playfair Display (display serif) · Inter (body).
 * Signature: scroll reveals, shrink-on-scroll nav, card hover lifts, gold
 * cursor-follow dot (published mode only), mobile drawer nav.
 *
 * Ported from templates_add/Accountent-1.html. Font Awesome glyphs are
 * reproduced as inline SVG so a published portfolio has no third-party CDN
 * dependency; the contact form and the hardcoded "Languages" block are replaced
 * by data-backed sections (see Z15 — no dead controls).
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap';

/** Inline replacements for the source design's Font Awesome line icons. */
const ICON: Record<string, string> = {
	chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>',
	calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/></svg>',
	building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/></svg>',
	pie: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15.5A9 9 0 118.5 3v9h12.5z"/></svg>',
	invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
	shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
	globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z"/></svg>',
	certificate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-2.5L17 22l-1.5-8"/></svg>',
	cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-5.5"/></svg>',
	trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M17 5h3v2a4 4 0 01-4 4M7 5H4v2a4 4 0 004 4"/></svg>',
	laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>',
	scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 21h10M3 8l4-4 4 4M3 8a4 4 0 008 0M13 8l4-4 4 4M13 8a4 4 0 008 0"/></svg>',
	briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>',
	mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>',
	phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>',
	pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>',
	linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4z"/></svg>',
	link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7L12.2 19"/></svg>',
	x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L5.9 22H2.8l7.5-8.6L2.4 2h6.6l4.5 6.7zM17.8 20.2h1.7L7.3 3.7H5.5z"/></svg>',
	github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>'
};

const SKILL_ICONS = ['invoice', 'calculator', 'chart', 'scale', 'shield', 'pie', 'briefcase', 'laptop'];
const EXP_ICONS = ['chart', 'calculator', 'building', 'pie'];

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
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --navy: #0a2540;
  --gold: #c6a15b;
  --gold-light: #e8d5b5;
  --slate: #4a5b6e;
  --light-bg: #f8fafc;
  --white: #ffffff;
  --border-light: #e9ecef;
  --shadow-sm: 0 8px 20px rgba(0,0,0,.03), 0 2px 6px rgba(0,0,0,.02);
  --shadow-md: 0 20px 35px -10px rgba(0,0,0,.05);
  --transition: all .3s cubic-bezier(.2,.9,.4,1.1);
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #fefefe;
  color: #1a2a3a;
  line-height: 1.5;
  scroll-behavior: smooth;
}
html { scroll-behavior: smooth; }
img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
ul { list-style: none; }

.container { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
section { padding: 90px 0; border-bottom: 1px solid var(--border-light); }

h2 {
  font-size: 2.5rem; font-weight: 600; letter-spacing: -.02em;
  margin-bottom: 1.5rem; color: var(--navy); font-family: 'Playfair Display', serif;
}
h2 em { color: var(--gold); font-style: normal; }

.section-label {
  font-family: 'Inter', sans-serif; font-size: .7rem; letter-spacing: .2em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 12px; font-weight: 500;
}

/* Buttons */
.btn-primary {
  display: inline-block; background: var(--navy); color: #fff; padding: 14px 32px;
  font-weight: 500; font-size: .85rem; letter-spacing: .03em;
  transition: var(--transition); border: none; cursor: pointer; border-radius: 2px;
}
.btn-primary:hover { background: var(--gold); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(198,161,91,.2); }
.btn-outline {
  background: transparent; border: 1px solid var(--navy); color: var(--navy);
  padding: 12px 28px; font-weight: 500; font-size: .8rem;
  transition: var(--transition); display: inline-block;
}
.btn-outline:hover { background: var(--navy); color: #fff; }

/* Navigation */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 60px; background: rgba(255,255,255,.96); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(10,37,64,.08); transition: var(--transition);
}
nav.scrolled { padding: 12px 60px; box-shadow: 0 2px 12px rgba(0,0,0,.02); }
.logo {
  font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 600;
  color: var(--navy); letter-spacing: -.3px;
}
.logo span { color: var(--gold); }
.nav-links { display: flex; gap: 36px; }
.nav-links a {
  font-size: .75rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  color: var(--slate); transition: color .3s;
}
.nav-links a:hover { color: var(--gold); }
.nav-cta {
  font-size: .75rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  background: var(--navy); color: #fff; padding: 10px 24px;
  transition: var(--transition); border-radius: 2px;
}
.nav-cta:hover { background: var(--gold); }
.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; }
.hamburger span { width: 24px; height: 2px; background: var(--navy); transition: .3s; }
.mobile-nav {
  display: none; position: fixed; inset: 0; z-index: 999; background: #fff;
  flex-direction: column; align-items: center; justify-content: center; gap: 32px;
}
.mobile-nav.open { display: flex; }
.mobile-nav a { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--navy); }
.mobile-nav-close {
  position: absolute; top: 24px; right: 24px; background: none; border: none;
  font-size: 1.5rem; cursor: pointer; color: var(--navy);
}

/* Hero */
.hero { padding: 140px 0 80px; background: linear-gradient(135deg,#fefefe 0%,#f8fafc 100%); border-bottom: 1px solid var(--border-light); }
.hero-wrapper {
  display: grid; grid-template-columns: 1fr .8fr; gap: 60px; align-items: center;
  max-width: 1280px; margin: 0 auto; padding: 0 32px;
}
.hero-content { max-width: 580px; }
.hero-badge {
  font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--gold);
  font-weight: 500; margin-bottom: 16px; display: inline-block;
}
.hero-name {
  font-size: clamp(2.5rem,5vw,4rem); font-weight: 700; color: var(--navy);
  line-height: 1.2; margin-bottom: 16px; font-family: 'Playfair Display', serif;
}
.hero-name .glow { color: var(--gold); }
.hero-title { font-size: 1rem; color: var(--slate); margin-bottom: 24px; font-weight: 400; }
.hero-desc { font-size: 1rem; line-height: 1.6; color: #4a5b6e; margin-bottom: 32px; }
.hero-stats { display: flex; gap: 40px; margin-top: 40px; flex-wrap: wrap; }
.stat-item .stat-number {
  font-size: 1.8rem; font-weight: 700; color: var(--gold); font-family: 'Playfair Display', serif;
}
.stat-item .stat-label { font-size: .7rem; text-transform: uppercase; letter-spacing: .05em; color: var(--slate); }

.hero-image { display: flex; justify-content: center; }
.profile-card {
  background: #fff; border-radius: 16px; padding: 16px; box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light); transition: var(--transition); max-width: 300px; width: 100%;
}
.profile-card:hover { transform: translateY(-6px); box-shadow: 0 25px 35px -12px rgba(0,0,0,.1); }
.profile-shots { position: relative; width: 100%; aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; background: var(--light-bg); }
.profile-shots img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.profile-mark {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 3.4rem; color: var(--gold-light);
  background: linear-gradient(160deg,#0a2540 0%,#14395c 100%);
}
.profile-badge {
  text-align: center; margin-top: 14px; font-size: .7rem; font-weight: 500; color: var(--gold);
  letter-spacing: .05em; border-top: 1px solid var(--border-light); padding-top: 12px;
}

/* About */
.about-grid { display: grid; grid-template-columns: .8fr 1fr; gap: 60px; align-items: center; }
.about-image { display: flex; justify-content: center; }
.about-img-card {
  max-width: 320px; width: 100%; border-radius: 20px; overflow: hidden;
  box-shadow: var(--shadow-md); border: 1px solid var(--border-light); transition: var(--transition);
}
.about-img-card:hover { transform: scale(1.02); }
.about-shots { position: relative; width: 100%; aspect-ratio: 1/1; background: var(--light-bg); }
.about-shots img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.about-ph {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  color: var(--gold); background: linear-gradient(160deg,#f8fafc 0%,#e8d5b5 140%); font-size: .75rem;
  letter-spacing: .16em; text-transform: uppercase; text-align: center; padding: 20px;
}
.about-text p { color: var(--slate); margin-bottom: 20px; line-height: 1.7; }
.signature { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1rem; color: var(--gold); margin-top: 24px; }
.expertise-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.expertise-tags li {
  font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: var(--navy);
  background: var(--light-bg); border: 1px solid var(--border-light); padding: 7px 14px; border-radius: 40px;
  transition: var(--transition);
}
.expertise-tags li:hover { border-color: var(--gold); color: var(--gold); }

/* Experience */
.exp-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(320px,1fr)); gap: 28px; margin-top: 20px; }
.exp-card {
  background: #fff; padding: 28px; border: 1px solid var(--border-light);
  transition: var(--transition); border-radius: 12px; position: relative;
}
.exp-card:hover { transform: translateY(-5px); border-color: var(--gold); box-shadow: var(--shadow-md); }
.exp-icon { color: var(--gold); margin-bottom: 20px; }
.exp-icon svg { width: 30px; height: 30px; }
.exp-role { font-size: 1.2rem; font-weight: 600; margin-bottom: 6px; color: var(--navy); }
.exp-company { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--gold); margin-bottom: 16px; }
.exp-desc { font-size: .85rem; color: var(--slate); line-height: 1.6; }
.exp-points { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
.exp-points li { font-size: .82rem; color: var(--slate); line-height: 1.6; padding-left: 16px; position: relative; }
.exp-points li::before { content: ''; position: absolute; left: 0; top: .55em; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
.shots { position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; border-radius: 8px; margin-top: 18px; background: var(--light-bg); }
.shots img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .7s; }
.shots img.active { opacity: 1; }
.shots-dots { position: absolute; bottom: 8px; left: 0; right: 0; display: flex; gap: 5px; justify-content: center; z-index: 2; }
.shots-dots i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.55); }
.shots-dots i.on { background: var(--gold); }

/* Skills */
.skills-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 28px; }
.skill-card {
  background: #fff; padding: 32px 24px; text-align: center; border: 1px solid var(--border-light);
  border-radius: 12px; transition: var(--transition); position: relative;
}
.skill-card:hover { border-color: var(--gold); transform: translateY(-4px); }
.skill-icon { color: var(--gold); margin-bottom: 18px; display: flex; justify-content: center; }
.skill-icon svg { width: 34px; height: 34px; }
.skill-card h4 { font-size: 1.1rem; font-weight: 600; margin-bottom: 14px; color: var(--navy); }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.chip {
  font-size: .72rem; color: var(--slate); background: var(--light-bg);
  border: 1px solid var(--border-light); padding: 6px 12px; border-radius: 40px;
}

/* Flat chip panels (software / compliance) */
.panel {
  background: var(--light-bg); border-radius: 20px; padding: 40px 32px;
  border: 1px solid var(--border-light);
}
.panel .chip-row { justify-content: center; gap: 10px; }
.panel .chip { background: #fff; font-size: .8rem; padding: 9px 18px; }
.panel .chip:hover { border-color: var(--gold); color: var(--gold); }

/* Engagements */
.projects-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
.project-card {
  background: #fff; border-radius: 12px; overflow: hidden;
  border: 1px solid var(--border-light); transition: var(--transition);
}
.project-card:hover { transform: translateY(-6px); border-color: var(--gold); }
.project-card .shots { border-radius: 0; margin-top: 0; }
.project-info { padding: 24px; }
.project-cat { font-size: .65rem; text-transform: uppercase; letter-spacing: .1em; color: var(--gold); font-weight: 600; }
.project-title { font-size: 1.1rem; font-weight: 600; margin: 8px 0; color: var(--navy); }
.project-desc { font-size: .8rem; color: var(--slate); line-height: 1.65; }
.eng-rows { margin: 14px 0 0; display: flex; flex-direction: column; gap: 7px; }
.eng-row { display: flex; justify-content: space-between; gap: 12px; font-size: .74rem; border-bottom: 1px dashed var(--border-light); padding-bottom: 6px; }
.eng-row .k { color: var(--slate); text-transform: uppercase; letter-spacing: .07em; font-size: .65rem; }
.eng-row .val { color: var(--navy); font-weight: 600; text-align: right; }
.eng-list { margin-top: 14px; display: flex; flex-direction: column; gap: 7px; }
.eng-list li { font-size: .78rem; color: var(--slate); line-height: 1.55; padding-left: 15px; position: relative; }
.eng-list li::before { content: ''; position: absolute; left: 0; top: .5em; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
.eng-list.out li::before { border-radius: 1px; background: var(--navy); }
.mini-label { font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); margin-top: 16px; font-weight: 600; }

/* Credential grid (education / certifications / achievements) */
.cert-grid {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 1px;
  background: var(--border-light); border-radius: 16px; overflow: hidden; margin-top: 20px;
}
.cert-card { background: #fff; padding: 28px 18px; text-align: center; transition: var(--transition); position: relative; }
.cert-card:hover { background: #fefaf5; }
.cert-icon { color: var(--gold); margin-bottom: 12px; display: flex; justify-content: center; }
.cert-icon svg { width: 26px; height: 26px; }
.cert-year { font-size: .7rem; font-weight: 600; color: var(--gold); letter-spacing: .05em; }
.cert-name { font-weight: 600; margin: 8px 0 4px; color: var(--navy); font-size: .95rem; }
.cert-org { font-size: .7rem; color: var(--slate); line-height: 1.5; }
.cert-link { font-size: .68rem; color: var(--gold); display: inline-block; margin-top: 8px; }
.cert-link:hover { text-decoration: underline; }

/* Custom sections */
.cs-timeline { border-left: 1px solid var(--border-light); padding-left: 26px; display: flex; flex-direction: column; gap: 26px; margin-top: 20px; }
.cs-tl-item { position: relative; }
.cs-tl-item::before { content: ''; position: absolute; left: -31px; top: 6px; width: 9px; height: 9px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 0 3px rgba(198,161,91,.18); }
.cs-list { margin-top: 20px; display: flex; flex-direction: column; gap: 14px; }
.cs-list-item { background: #fff; border: 1px solid var(--border-light); border-radius: 10px; padding: 18px 22px; transition: var(--transition); position: relative; }
.cs-list-item:hover { border-color: var(--gold); }
.cs-sub { font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; color: var(--gold); font-weight: 600; }
.cs-label { font-size: 1.02rem; font-weight: 600; color: var(--navy); margin: 6px 0; }
.cs-value { font-size: .84rem; color: var(--slate); line-height: 1.65; }

/* Contact */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.contact-info p { color: var(--slate); margin-bottom: 28px; }
.contact-details { display: flex; flex-direction: column; gap: 20px; margin: 28px 0; }
.contact-item { display: flex; align-items: center; gap: 16px; text-align: left; }
.contact-icon {
  width: 44px; height: 44px; border: 1px solid var(--gold); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: var(--gold); flex: none;
}
.contact-icon svg { width: 18px; height: 18px; }
.contact-k { font-size: .62rem; letter-spacing: .16em; text-transform: uppercase; color: var(--slate); }
.contact-v { font-size: .9rem; font-weight: 600; color: var(--navy); }
.contact-card {
  background: var(--light-bg); border: 1px solid var(--border-light); border-radius: 16px;
  padding: 40px 32px; display: flex; flex-direction: column; justify-content: center; gap: 18px;
}
.contact-card h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--navy); font-weight: 600; }
.contact-card p { font-size: .88rem; color: var(--slate); line-height: 1.7; }
.contact-socials { display: flex; gap: 12px; margin-top: 6px; }
.contact-socials a {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-light);
  background: #fff; display: flex; align-items: center; justify-content: center;
  color: var(--navy); transition: var(--transition);
}
.contact-socials a svg { width: 16px; height: 16px; }
.contact-socials a:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

/* Footer */
footer {
  background: var(--navy); padding: 48px 60px; display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 24px;
}
.footer-logo { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--gold); }
.footer-links { display: flex; gap: 32px; flex-wrap: wrap; }
.footer-links a { color: rgba(255,255,255,.7); font-size: .7rem; transition: color .3s; }
.footer-links a:hover { color: var(--gold); }
.social-links { display: flex; gap: 20px; }
.social-links a { color: rgba(255,255,255,.7); font-size: 1rem; transition: color .3s; }
.social-links a svg { width: 16px; height: 16px; }
.social-links a:hover { color: var(--gold); }
.copyright { width: 100%; text-align: center; margin-top: 28px; font-size: .65rem; color: rgba(255,255,255,.5); }

/* Reveal animation */
.reveal { opacity: 0; transform: translateY(25px); transition: opacity .7s cubic-bezier(.2,.9,.4,1.1), transform .7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Editor affordances */
.ce-add-btn { margin-top: 22px; }
[data-item-wrap] { position: relative; }

@media (max-width: 1024px) {
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: flex; }
  section { padding: 70px 0; }
  .hero-wrapper, .about-grid, .contact-grid { grid-template-columns: 1fr; text-align: center; gap: 40px; }
  .hero-content, .about-text { text-align: center; margin: 0 auto; }
  .hero-stats { justify-content: center; }
  .expertise-tags { justify-content: center; }
  .projects-grid { grid-template-columns: repeat(2,1fr); }
  .cert-grid { grid-template-columns: repeat(2,1fr); }
  nav { padding: 16px 32px; }
  nav.scrolled { padding: 12px 32px; }
  .contact-item { text-align: left; }
}

@media (max-width: 768px) {
  .container { padding: 0 24px; }
  .hero-wrapper { padding: 0 24px; }
  .projects-grid, .cert-grid, .exp-grid, .skills-grid { grid-template-columns: 1fr; }
  h2 { font-size: 2rem; }
  footer { flex-direction: column; text-align: center; padding: 40px 24px; }
  .footer-links { flex-wrap: wrap; justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; }
}
${em ? '' : '.cursor-glow{width:6px;height:6px;background:var(--gold);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transition:.05s linear;top:-20px;left:-20px}'}
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

	/** Crossfading gallery for an item's images[] (Z12). */
	const shots = (images: string[], path: string, label: string): string => {
		if (!images.length && !em) return '';
		const imgs = images.map((src, k) => `<img src="${src}" alt="" class="${k === 0 ? 'active' : ''}">`).join('');
		const dots = images.length > 1
			? `<div class="shots-dots">${images.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>`
			: '';
		return `<div class="shots" ${_imgUpload(path, em, label)}>${imgs}${dots}</div>`;
	};

	// ── HERO ──────────────────────────────────────────────────────────────────
	const heroStats = [
		statShown(v, 'years_experience', years)
			? `<div class="stat-item"><div class="stat-number"><span ${ted('years_experience')}>${years}</span>+</div><div class="stat-label">Years Experience</div></div>` : '',
		statShown(v, 'clients_count', clients)
			? `<div class="stat-item"><div class="stat-number"><span ${ted('clients_count')}>${clients}</span>+</div><div class="stat-label">Client Engagements</div></div>` : '',
		statShown(v, 'certifications_count', certCount)
			? `<div class="stat-item"><div class="stat-number"><span ${ted('certifications_count')}>${certCount}</span></div><div class="stat-label">Certifications</div></div>` : ''
	].filter(Boolean).join('');

	// Decorative credential strip under the portrait — no binding, so a slice is
	// fine here (Z1 exception); the canonical list is the certifications section.
	const credStrip = v.certifications.slice(0, 3).map((c) => c.name).filter(Boolean).join(' · ');

	const heroPortrait = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="profile-mark">${inits}</div>`;

	// ── ABOUT ─────────────────────────────────────────────────────────────────
	const aboutVisual = v.summary_image
		? `<div class="about-shots" ${_imgUpload('profile.summary_image', em, 'Upload image')}><img src="${v.summary_image}" alt="${v.name}"></div>`
		: em
			? `<div class="about-shots" ${_imgUpload('profile.summary_image', em, 'Upload image')}><div class="about-ph">Add a section image from the Portfolio&nbsp;Fields tab</div></div>`
			: '';
	const expertiseTags = v.core_expertise.length
		? `<ul class="expertise-tags" ${le('core_expertise')}>${v.core_expertise.map((t) => `<li>${t}</li>`).join('')}</ul>`
		: em
			? `<ul class="expertise-tags" ${le('core_expertise')}><li>Add core expertise</li></ul>`
			: '';
	const aboutHtml = (v.bio || v.uniqueValue || aboutVisual)
		? `<section id="about">
  <div class="container">
    <div class="about-grid">
      ${aboutVisual ? `<div class="about-image reveal"><div class="about-img-card">${aboutVisual}</div></div>` : ''}
      <div class="about-text reveal">
        <div class="section-label">// About Me</div>
        <h2>Precision, Integrity &amp; <em>Financial Clarity</em></h2>
        ${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${expertiseTags}
        ${v.uniqueValue ? `<div class="signature" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</div>` : ''}
      </div>
    </div>
  </div>
</section>` : '';

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = (v.experience?.length || em)
		? `<section id="experience">
  <div class="container">
    <div class="section-label reveal">// Professional Journey</div>
    <h2 class="reveal">Financial <em>Experience</em></h2>
    <div class="exp-grid">
${v.experience.map((exp, i) => {
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' – ');
			return `      <div class="exp-card reveal"${iw}>
        ${delBtn('experience', i)}
        <div class="exp-icon">${ICON[EXP_ICONS[i % EXP_ICONS.length]]}</div>
        <div class="exp-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
        <div class="exp-company">${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span>` : ''}${exp.company && period ? ' · ' : ''}${period}${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>
        ${exp.description ? `<div class="exp-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
        ${exp.key_points?.length ? `<ul class="exp-points" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
        ${shots(exp.images ?? [], `experience.${i}.images`, 'Upload image')}
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('experience', 'Experience')}
  </div>
</section>` : '';

	// ── ENGAGEMENTS ───────────────────────────────────────────────────────────
	const engagementsHtml = (v.engagements?.length || em)
		? `<section id="engagements">
  <div class="container">
    <div class="section-label reveal">// Client Success</div>
    <h2 class="reveal">Featured <em>Engagements</em></h2>
    <div class="projects-grid">
${v.engagements.map((en, i) => {
			const period = _rangeEditable(`engagements.${i}.start_date`, en.start_date, `engagements.${i}.end_date`, en.end_date, em, ' – ');
			const rows = [
				en.industry ? `<div class="eng-row"><span class="k">Industry</span><span class="val" ${ed(`engagements.${i}.industry`)}>${en.industry}</span></div>` : '',
				period ? `<div class="eng-row"><span class="k">Period</span><span class="val">${period}</span></div>` : '',
				en.engagement_value ? `<div class="eng-row"><span class="k">Scale</span><span class="val" ${ed(`engagements.${i}.engagement_value`)}>${en.engagement_value}</span></div>` : ''
			].filter(Boolean).join('');
			return `      <div class="project-card reveal"${iw}>
        ${delBtn('engagements', i)}
        ${shots(en.images ?? [], `engagements.${i}.images`, 'Upload image')}
        <div class="project-info">
          ${en.engagement_type ? `<div class="project-cat" ${ed(`engagements.${i}.engagement_type`)}>${en.engagement_type}</div>` : ''}
          <div class="project-title" ${ed(`engagements.${i}.client_name`)}>${en.client_name || (em ? 'Client' : '')}</div>
          ${en.description ? `<div class="project-desc" ${ed(`engagements.${i}.description`, true)}>${en.description}</div>` : ''}
          ${rows ? `<div class="eng-rows">${rows}</div>` : ''}
          ${en.responsibilities?.length ? `<div class="mini-label">Responsibilities</div><ul class="eng-list" ${le(`engagements.${i}.responsibilities`)}>${en.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
          ${en.deliverables?.length ? `<div class="mini-label">Deliverables</div><ul class="eng-list" ${le(`engagements.${i}.deliverables`)}>${en.deliverables.map((d) => `<li>${d}</li>`).join('')}</ul>` : ''}
          ${en.measurable_outcomes?.length ? `<div class="mini-label">Outcomes</div><ul class="eng-list out" ${le(`engagements.${i}.measurable_outcomes`)}>${en.measurable_outcomes.map((o) => `<li>${o}</li>`).join('')}</ul>` : ''}
          ${en.standards_applied?.length ? `<div class="mini-label">Standards</div><div class="chip-row" style="justify-content:flex-start;margin-top:8px" ${le(`engagements.${i}.standards_applied`)}>${en.standards_applied.map((s) => `<span class="chip">${s}</span>`).join('')}</div>` : ''}
          ${en.tools_used?.length ? `<div class="mini-label">Tools</div><div class="chip-row" style="justify-content:flex-start;margin-top:8px" ${le(`engagements.${i}.tools_used`)}>${en.tools_used.map((t) => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
        </div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('engagements', 'Engagement')}
  </div>
</section>` : '';

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<section id="skills">
  <div class="container">
    <div class="section-label reveal">// Core Expertise</div>
    <h2 class="reveal">Accounting &amp; <em>Advisory Skills</em></h2>
    <div class="skills-grid">
${v.skill_groups.map((g, gi) => `      <div class="skill-card reveal"${iw}>
        ${delBtn('skills', gi)}
        <div class="skill-icon">${ICON[SKILL_ICONS[gi % SKILL_ICONS.length]]}</div>
        <h4 ${ed(`skills.${gi}.category`)}>${g.category}</h4>
        <div class="chip-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
      </div>`).join('\n')}
    </div>
    ${addBtn('skills', 'Skill Group')}
  </div>
</section>` : '';

	// ── SOFTWARE PROFICIENCY ──────────────────────────────────────────────────
	const softwareHtml = v.software_proficiency?.length
		? `<section id="software_proficiency">
  <div class="container">
    <div class="section-label reveal">// Systems</div>
    <h2 class="reveal">Accounting <em>Software</em></h2>
    <div class="panel reveal">
      <div class="chip-row" ${le('software_proficiency')}>${v.software_proficiency.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>` : '';

	// ── COMPLIANCE EXPERTISE ──────────────────────────────────────────────────
	const complianceHtml = v.compliance_expertise?.length
		? `<section id="compliance_expertise">
  <div class="container">
    <div class="section-label reveal">// Regulatory</div>
    <h2 class="reveal">Standards &amp; <em>Compliance</em></h2>
    <div class="panel reveal">
      <div class="chip-row" ${le('compliance_expertise')}>${v.compliance_expertise.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>` : '';

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = (v.education?.length || em)
		? `<section id="education">
  <div class="container">
    <div class="section-label reveal">// Academic</div>
    <h2 class="reveal">Education &amp; <em>Training</em></h2>
    <div class="cert-grid">
${v.education.map((edu, i) => {
			const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `      <div class="cert-card reveal"${iw}>
        ${delBtn('education', i)}
        <div class="cert-icon">${ICON.cap}</div>
        ${yr ? `<div class="cert-year">${yr}</div>` : ''}
        <div class="cert-name">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
        <div class="cert-org">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}${edu.grade_or_score ? `<br><span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}</div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('education', 'Education')}
  </div>
</section>` : '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certsHtml = (v.certifications?.length || em)
		? `<section id="certifications">
  <div class="container">
    <div class="section-label reveal">// Credentials</div>
    <h2 class="reveal">Certifications &amp; <em>Licenses</em></h2>
    <div class="cert-grid">
${v.certifications.map((c, i) => `      <div class="cert-card reveal"${iw}>
        ${delBtn('certifications', i)}
        <div class="cert-icon">${ICON.certificate}</div>
        ${c.year ? `<div class="cert-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
        <div class="cert-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
        ${c.issuer ? `<div class="cert-org" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
        ${c.url ? `<a class="cert-link" href="${c.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('certifications', 'Certification')}
  </div>
</section>` : '';

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = (v.achievements?.length || em)
		? `<section id="achievements">
  <div class="container">
    <div class="section-label reveal">// Recognition</div>
    <h2 class="reveal">Key <em>Achievements</em></h2>
    <div class="cert-grid">
${v.achievements.map((a, i) => `      <div class="cert-card reveal"${iw}>
        ${delBtn('achievements', i)}
        <div class="cert-icon">${ICON.trophy}</div>
        ${a.year ? `<div class="cert-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <div class="cert-name" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.description ? `<div class="cert-org" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
        ${a.url ? `<a class="cert-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('achievements', 'Achievement')}
  </div>
</section>` : '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customHtml = (v.custom_sections ?? []).map((cs, ci) => {
		if (!cs.items?.length && !em) return '';
		const items = cs.items ?? [];
		const sub = (i: number, t: string) => t ? `<div class="cs-sub" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${t}</div>` : '';
		const label = (i: number, t: string) => t ? `<div class="cs-label" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${t}</div>` : '';
		const value = (i: number, t: string) => t ? `<div class="cs-value" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${t}</div>` : '';
		const tags = (i: number, t: string[]) => t?.length
			? `<div class="chip-row" style="justify-content:flex-start;margin-top:12px" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span class="chip">${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="cert-link" href="${u}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '';

		let body: string;
		if (cs.display_type === 'timeline') {
			body = `<div class="cs-timeline">${items.map((it, i) => `<div class="cs-tl-item"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else if (cs.display_type === 'list') {
			body = `<div class="cs-list">${items.map((it, i) => `<div class="cs-list-item"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else {
			body = `<div class="cert-grid" style="margin-top:20px">${items.map((it, i) => `<div class="cert-card" style="text-align:left;padding:26px 24px"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		}
		return `<section id="${cs.section_id}">
  <div class="container">
    <div class="section-label reveal">// More</div>
    <h2 class="reveal" ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2>
    <div class="reveal">${body}</div>
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>
</section>`;
	}).filter(Boolean).join('\n');

	// ── ORDERED SECTIONS ──────────────────────────────────────────────────────
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

	// ── NAV ───────────────────────────────────────────────────────────────────
	const NAV_LABELS: Record<string, string> = {
		about: 'About', experience: 'Experience', engagements: 'Engagements', skills: 'Skills',
		software_proficiency: 'Software', compliance_expertise: 'Compliance',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements',
		contact: 'Contact'
	};
	const navKeys: string[] = [];
	if (v.bio || v.uniqueValue) navKeys.push('about');
	for (const key of order) {
		if (hidden.has(key) || !(key in sectionMap) || !sectionMap[key]) continue;
		if (key === 'custom_sections') continue;
		navKeys.push(key);
	}
	navKeys.push('contact');
	const navItems = navKeys.map((k) => `<li><a href="#${k}">${NAV_LABELS[k] ?? k}</a></li>`).join('');
	const mobileItems = navKeys.map((k) => `<a href="#${k}">${NAV_LABELS[k] ?? k}</a>`).join('');

	// ── CONTACT ───────────────────────────────────────────────────────────────
	const contactRows = [
		v.location ? `<div class="contact-item"><div class="contact-icon">${ICON.pin}</div><div><div class="contact-k">Location</div><div class="contact-v" ${ed('profile.location')}>${v.location}</div></div></div>` : '',
		v.email ? `<div class="contact-item"><div class="contact-icon">${ICON.mail}</div><div><div class="contact-k">Email</div><div class="contact-v" ${ed('profile.email')}>${v.email}</div></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-icon">${ICON.phone}</div><div><div class="contact-k">Direct Line</div><div class="contact-v" ${ed('profile.phone')}>${v.phone}</div></div></div>` : ''
	].filter(Boolean).join('');
	const socialLinks = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${ICON.linkedin}</a>` : '',
		v.github_url ? `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${ICON.github}</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" aria-label="X">${ICON.x}</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" aria-label="Website">${ICON.link}</a>` : ''
	].filter(Boolean).join('');
	const contactHtml = (contactRows || socialLinks)
		? `<section id="contact">
  <div class="container">
    <div class="section-label reveal">// Let's Connect</div>
    <h2 class="reveal">Schedule a <em>Consultation</em></h2>
    <div class="contact-grid">
      <div class="contact-info reveal">
        <p ${ed('profile.contact_tagline', true)}>${v.contact_tagline || 'Ready to gain financial clarity? Whether you need tax strategy, audit support, or fractional CFO services — let&#39;s talk.'}</p>
        <div class="contact-details">${contactRows}</div>
      </div>
      <div class="contact-card reveal">
        <h3>Let's talk numbers.</h3>
        <p>I typically reply within one business day. Send over the scope and I&#39;ll come back with a clear plan and timeline.</p>
        ${v.email ? `<a class="btn-primary" style="align-self:flex-start" href="mailto:${v.email}">Request a Call &rarr;</a>` : ''}
        ${socialLinks ? `<div class="contact-socials">${socialLinks}</div>` : ''}
      </div>
    </div>
  </div>
</section>` : '';

	const footerLinks = navKeys.filter((k) => k !== 'contact').slice(0, 5)
		.map((k) => `<a href="#${k}">${NAV_LABELS[k] ?? k}</a>`).join('');

	// ── RUNTIME ───────────────────────────────────────────────────────────────
	const RUNTIME = `<script>
(function(){
  ${em ? '' : `
  var glow=document.querySelector('.cursor-glow');
  if(glow&&window.matchMedia('(hover:hover)').matches){
    var mx=0,my=0;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
    (function loop(){glow.style.left=mx+'px';glow.style.top=my+'px';requestAnimationFrame(loop);})();
  }`}
  var navEl=document.getElementById('mainNav');
  if(navEl){window.addEventListener('scroll',function(){navEl.classList.toggle('scrolled',window.scrollY>50);},{passive:true});}

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  var hb=document.getElementById('hamburger'),mn=document.getElementById('mobileNav'),cb=document.getElementById('mobileNavClose');
  if(hb&&mn){hb.addEventListener('click',function(){mn.classList.add('open');});}
  if(cb&&mn){cb.addEventListener('click',function(){mn.classList.remove('open');});}
  if(mn){mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open');});});}

  document.querySelectorAll('.shots').forEach(function(box){
    var imgs=box.querySelectorAll('img');
    if(imgs.length<2)return;
    var dots=box.querySelectorAll('.shots-dots i'),i=0;
    setInterval(function(){
      imgs[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('on');
      i=(i+1)%imgs.length;
      imgs[i].classList.add('active'); if(dots[i])dots[i].classList.add('on');
    },3200);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(this.getAttribute('href'));
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
    });
  });
})();
<\/script>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${v.name} | ${v.profile_headline || 'Chartered Accountant'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css(v)}</style>
</head>
<body>
${em ? '' : '<div class="cursor-glow"></div>'}

<nav id="mainNav">
  <a href="#" class="logo">${firstName}${lastName ? ` <span>${lastName}</span>` : ''}</a>
  <ul class="nav-links">${navItems}</ul>
  <a href="#contact" class="nav-cta">Schedule a Call</a>
  <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
</nav>
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close">&#10005;</button>
  ${mobileItems}
</div>

<section class="hero">
  <div class="hero-wrapper">
    <div class="hero-content">
      ${v.profile_headline ? `<span class="hero-badge" ${ed('profile.headline')}>${v.profile_headline}</span>` : ''}
      <h1 class="hero-name" ${ed('profile.full_name')}>${firstName}${lastName ? ` <span class="glow">${lastName}</span>` : ''}</h1>
      ${v.headline ? `<div class="hero-title" ${ed('portfolio.headline')}>${v.headline}</div>` : ''}
      ${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
      ${v.email ? `<a href="mailto:${v.email}" class="btn-primary">Let's Talk Numbers &rarr;</a>` : ''}
      ${heroStats ? `<div class="hero-stats">${heroStats}</div>` : ''}
    </div>
    <div class="hero-image">
      <div class="profile-card">
        <div class="profile-shots" ${_imgUpload('profile.profile_image', em)}>${heroPortrait}</div>
        ${credStrip ? `<div class="profile-badge">${credStrip}</div>` : ''}
      </div>
    </div>
  </div>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
  <div class="footer-logo">${v.name}${v.profile_headline ? `, ${v.profile_headline}` : ''}</div>
  <div class="footer-links">${footerLinks}</div>
  ${socialLinks ? `<div class="social-links">${socialLinks}</div>` : ''}
  <div class="copyright">&copy; ${new Date().getFullYear()} ${v.name} — ${v.profile_headline || 'Chartered Accountant'} | Financial Integrity &amp; Precision</div>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
