/**
 * Template: Haven
 * HR theme — calm, people-first portfolio on a warm off-white canvas with sage,
 * slate and muted-gold accents. Cormorant Garamond serif headings over DM Sans,
 * an arch-shaped hero portrait with a floating credential badge, a centred
 * alternating career timeline, a deep-slate tools band, a gilded education
 * timeline and a horizontal certification timeline.
 * Palette: white #fafaf8, offwhite #f2f0eb, stone #e8e4dc, mist #c9d4d0,
 * sage #7a9e8e, sage-dk #4e7a6a, slate #3c4f5c, ink #1e2b33, gold #b89b6a.
 * Fonts: Cormorant Garamond (display serif) · DM Sans (body).
 * Signature: staggered scroll reveals, shrink/blur nav on scroll, card hover
 * lifts, translateX card nudges, gradient case-study headers, mobile drawer nav.
 *
 * Ported from templates_add/HR.html. The source's percentage skill bars are
 * rendered as editable tag chips (Z16) — our model has no proficiency value.
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap';

const SERVICE_ICONS = ['🔍', '🤝', '📊', '📚', '📋', '💡', '🌱', '⚖️'];
const STRENGTH_ICONS = ['🤝', '🎯', '⚖️', '🌱'];
const EDU_ICONS = ['🎓', '📘', '📗', '📙'];
const CERT_ICONS = ['🎓', '📜', '🔧', '🏅'];

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

function css(): string {
	return `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --white:   #fafaf8;
  --offwhite:#f2f0eb;
  --stone:   #e8e4dc;
  --mist:    #c9d4d0;
  --sage:    #7a9e8e;
  --sage-dk: #4e7a6a;
  --slate:   #3c4f5c;
  --ink:     #1e2b33;
  --gold:    #b89b6a;
  --text:    #2a3540;
  --text-lt: #6b7f8a;
  --radius:  6px;
  --section: 110px;
  font-size: 16px;
}
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--white);
  color: var(--text);
  line-height: 1.7;
  overflow-x: hidden;
}
h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; font-weight: 600; line-height: 1.15; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
ul { list-style: none; }

.wrap { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
.label {
  font-size: .7rem; font-weight: 500; letter-spacing: .18em;
  text-transform: uppercase; color: var(--sage); display: block; margin-bottom: 14px;
}
.tag {
  display: inline-block; font-size: .72rem; font-weight: 500; letter-spacing: .1em;
  text-transform: uppercase; padding: 5px 14px; border-radius: 40px;
  background: var(--offwhite); color: var(--text-lt); border: 1px solid var(--stone);
}
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 30px; border-radius: var(--radius);
  font-family: 'DM Sans', sans-serif; font-size: .85rem; font-weight: 500;
  letter-spacing: .04em; cursor: pointer; transition: all .25s;
}
.btn-primary { background: var(--slate); color: #fff; }
.btn-primary:hover { background: var(--ink); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(30,43,51,.18); }
.btn-outline { background: transparent; color: var(--slate); border: 1.5px solid var(--slate); }
.btn-outline:hover { background: var(--slate); color: #fff; transform: translateY(-2px); }

.reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: none; }

/* Nav */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 0; transition: background .3s, box-shadow .3s; }
nav.scrolled { background: rgba(250,250,248,.95); backdrop-filter: blur(12px); box-shadow: 0 1px 0 var(--stone); }
nav .wrap { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.nav-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.45rem; font-weight: 600; color: var(--ink); letter-spacing: .02em; }
.nav-logo span { color: var(--sage); }
.nav-links { display: flex; gap: 36px; }
.nav-links a { font-size: .82rem; font-weight: 500; letter-spacing: .05em; color: var(--text-lt); transition: color .2s; }
.nav-links a:hover { color: var(--ink); }
.nav-cta { font-size: .8rem; font-weight: 500; padding: 10px 22px; border-radius: var(--radius); background: var(--sage); color: #fff; transition: background .2s, transform .2s; white-space: nowrap; }
.nav-cta:hover { background: var(--sage-dk); transform: translateY(-1px); }
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; }
.hamburger span { width: 24px; height: 2px; background: var(--ink); transition: .3s; display: block; }

/* Hero */
#hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; background: linear-gradient(135deg,#f5f3ee 0%,#eaede8 50%,#dfe7e3 100%); }
.hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    radial-gradient(ellipse 60% 70% at 75% 50%, rgba(122,158,142,.13) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 20% 80%, rgba(184,155,106,.08) 0%, transparent 60%);
}
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 80px; position: relative; z-index: 1; padding: var(--section) 0; }
.hero-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.hero-eyebrow::before { content: ''; width: 36px; height: 1.5px; background: var(--sage); flex: none; }
.hero-eyebrow span { font-size: .75rem; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: var(--sage); }
.hero-title { font-size: clamp(2.6rem,5vw,4.2rem); color: var(--ink); margin-bottom: 22px; line-height: 1.1; }
.hero-title em { font-style: italic; color: var(--sage-dk); }
.hero-sub { font-size: 1.05rem; color: var(--text-lt); max-width: 460px; margin-bottom: 38px; line-height: 1.75; }
.hero-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 38px; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }
.hero-image-wrap {
  position: relative; border-radius: 200px 200px 60% 60% / 200px 200px 80px 80px;
  overflow: hidden; aspect-ratio: 3/4; max-height: 620px;
  box-shadow: 0 40px 80px rgba(30,43,51,.15); background: var(--offwhite);
}
.hero-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
.hero-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 4rem; color: var(--sage); background: linear-gradient(160deg,var(--offwhite),var(--mist)); }
.hero-badge {
  position: absolute; bottom: 32px; left: -24px; background: var(--white); border-radius: 14px;
  padding: 16px 22px; box-shadow: 0 12px 40px rgba(30,43,51,.12);
  display: flex; align-items: center; gap: 14px; max-width: 82%;
}
.hero-badge-icon { width: 44px; height: 44px; border-radius: 50%; background: var(--sage); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex: none; }
.hero-badge-text strong { display: block; font-size: .9rem; font-weight: 600; color: var(--ink); }
.hero-badge-text span { font-size: .76rem; color: var(--text-lt); }
.hero-stat-row { display: flex; gap: 40px; margin-top: 44px; padding-top: 32px; border-top: 1px solid var(--stone); flex-wrap: wrap; }
.hero-stat strong { display: block; font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: var(--ink); line-height: 1; }
.hero-stat span { font-size: .78rem; color: var(--text-lt); letter-spacing: .04em; }

/* Section heads */
.section-head { text-align: center; max-width: 580px; margin: 0 auto 72px; }
.section-head h2 { font-size: clamp(2rem,4vw,3rem); color: var(--ink); margin-bottom: 16px; }
.section-head p { color: var(--text-lt); font-size: .98rem; }

/* About */
#about { padding: var(--section) 0; }
.about-grid { display: grid; grid-template-columns: 400px 1fr; gap: 80px; align-items: center; }
.about-photo { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 4/5; box-shadow: 0 24px 64px rgba(30,43,51,.12); background: var(--offwhite); }
.about-photo img { width: 100%; height: 100%; object-fit: cover; }
.about-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 3rem; color: var(--sage); background: linear-gradient(160deg,var(--offwhite),var(--mist)); }
.about-photo-accent { position: absolute; bottom: -1px; left: -1px; right: -1px; padding: 28px; background: linear-gradient(to top, rgba(30,43,51,.75) 0%, transparent 100%); color: #fff; }
.about-photo-accent strong { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; display: block; }
.about-photo-accent span { font-size: .78rem; opacity: .8; }
.about-content h2 { font-size: clamp(1.8rem,3vw,2.6rem); color: var(--ink); margin-bottom: 20px; }
.about-content p { color: var(--text-lt); margin-bottom: 16px; font-size: .97rem; }
.about-strengths { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 32px; }
.strength-item { display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: var(--offwhite); border-radius: var(--radius); border-left: 3px solid var(--sage); }
.strength-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
.strength-item strong { display: block; font-size: .88rem; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
.strength-item span { font-size: .78rem; color: var(--text-lt); }

/* Services (skill groups) */
#skills { padding: var(--section) 0; background: var(--offwhite); }
.services-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
.service-card { background: var(--white); border-radius: 16px; padding: 36px 30px; border: 1px solid var(--stone); transition: all .3s; position: relative; overflow: hidden; }
.service-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(122,158,142,.04), transparent); opacity: 0; transition: opacity .3s; pointer-events: none; }
.service-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(30,43,51,.1); border-color: var(--mist); }
.service-card:hover::after { opacity: 1; }
.service-icon { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg,var(--sage),var(--sage-dk)); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 22px; }
.service-card h3 { font-size: 1.25rem; color: var(--ink); margin-bottom: 14px; }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 6px 14px; border-radius: 40px; border: 1px solid var(--stone); background: var(--offwhite); font-size: .76rem; color: var(--text-lt); }

/* Experience timeline */
#experience { padding: var(--section) 0; }
.timeline { position: relative; max-width: 820px; margin: 0 auto; }
.timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--stone); transform: translateX(-50%); }
.tl-item { display: grid; grid-template-columns: 1fr 60px 1fr; gap: 0 20px; margin-bottom: 60px; align-items: start; }
.tl-content { background: var(--white); border: 1px solid var(--stone); border-radius: 14px; padding: 28px 26px; position: relative; }
.tl-content.right { grid-column: 3; }
.tl-content.left { grid-column: 1; text-align: right; }
.tl-dot { grid-column: 2; display: flex; justify-content: center; align-items: center; padding-top: 22px; }
.tl-dot-inner { width: 14px; height: 14px; border-radius: 50%; background: var(--sage); border: 3px solid var(--white); box-shadow: 0 0 0 3px var(--sage); }
.tl-year { font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--sage); margin-bottom: 6px; }
.tl-content h3 { font-size: 1.15rem; color: var(--ink); margin-bottom: 4px; }
.tl-company { font-size: .83rem; color: var(--text-lt); margin-bottom: 12px; }
.tl-content p { font-size: .84rem; color: var(--text-lt); line-height: 1.7; }
.tl-points { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
.tl-points li { display: inline-flex; align-items: center; gap: 6px; background: var(--offwhite); border-radius: 40px; padding: 5px 14px; font-size: .76rem; font-weight: 500; color: var(--sage-dk); }
.tl-content.left .tl-points { align-items: flex-end; }
.tl-content.right .tl-points { align-items: flex-start; }
.shots { position: relative; width: 100%; aspect-ratio: 16/10; overflow: hidden; border-radius: 10px; margin-top: 14px; background: var(--offwhite); }
.shots img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .7s; }
.shots img.active { opacity: 1; }
.shots-dots { position: absolute; bottom: 8px; left: 0; right: 0; display: flex; gap: 5px; justify-content: center; z-index: 2; }
.shots-dots i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.6); }
.shots-dots i.on { background: var(--sage); }

/* Dark chip bands (software / compliance) */
.band-dark { padding: var(--section) 0; background: var(--slate); }
.band-dark .label { color: var(--mist); }
.band-dark .section-head h2 { color: var(--white); }
.band-dark .section-head p { color: var(--mist); }
.tools-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 900px; margin: 0 auto; }
.tool-chip { padding: 8px 16px; border-radius: 40px; border: 1px solid rgba(255,255,255,.15); font-size: .78rem; color: rgba(255,255,255,.75); background: rgba(255,255,255,.05); transition: all .2s; }
.tool-chip:hover { background: rgba(255,255,255,.12); color: #fff; }
.band-light { padding: var(--section) 0; }
.band-light .tool-chip { border-color: var(--stone); background: var(--offwhite); color: var(--text-lt); }
.band-light .tool-chip:hover { border-color: var(--sage); color: var(--sage-dk); }

/* Education */
#education { padding: var(--section) 0; background: var(--offwhite); }
.edu-timeline { position: relative; max-width: 680px; margin: 0 auto; padding-left: 44px; }
.edu-timeline::before { content: ''; position: absolute; left: 9px; top: 6px; bottom: 6px; width: 2px; background: var(--stone); }
.edu-item { position: relative; padding-bottom: 44px; }
.edu-item:last-child { padding-bottom: 0; }
.edu-dot { position: absolute; left: -44px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--white); border: 3px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: .7rem; }
.edu-card { background: var(--white); border: 1px solid var(--stone); border-radius: 14px; padding: 24px 26px; transition: all .3s; position: relative; }
.edu-card:hover { transform: translateX(4px); box-shadow: 0 16px 48px rgba(30,43,51,.08); border-color: var(--mist); }
.edu-year { font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
.edu-card h3 { font-size: 1.1rem; color: var(--ink); margin-bottom: 4px; }
.edu-org { font-size: .83rem; color: var(--text-lt); }
.edu-link { font-size: .75rem; color: var(--sage-dk); display: inline-block; margin-top: 8px; }
.edu-link:hover { text-decoration: underline; }

/* Certifications */
#certifications { padding: var(--section) 0; }
.cert-timeline { position: relative; display: flex; gap: 24px; max-width: 1080px; margin: 0 auto; padding-top: 10px; flex-wrap: wrap; }
.cert-timeline::before { content: ''; position: absolute; left: 0; right: 0; top: 28px; height: 2px; background: var(--stone); }
.cert-tl-item { flex: 1 1 240px; text-align: center; position: relative; }
.cert-tl-dot { position: relative; z-index: 2; width: 16px; height: 16px; margin: 0 auto 22px; border-radius: 50%; background: var(--sage); border: 3px solid var(--white); box-shadow: 0 0 0 2px var(--sage); }
.cert-card { border: 1px solid var(--stone); border-radius: 14px; padding: 26px 20px; transition: all .3s; background: var(--white); position: relative; }
.cert-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(30,43,51,.08); border-color: var(--mist); }
.cert-badge { width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; background: var(--offwhite); }
.cert-card strong { display: block; font-size: .92rem; color: var(--ink); margin-bottom: 6px; }
.cert-card span { font-size: .77rem; color: var(--text-lt); display: block; }
.cert-year { display: block; margin-top: 10px; font-size: .7rem; font-weight: 600; letter-spacing: .08em; color: var(--sage); text-transform: uppercase; }

/* Case cards (hr_programs / achievements / custom) */
.cases-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 28px; }
.case-card { border-radius: 18px; overflow: hidden; border: 1px solid var(--stone); transition: all .3s; display: flex; flex-direction: column; background: var(--white); position: relative; }
.case-card:hover { transform: translateY(-5px); box-shadow: 0 24px 64px rgba(30,43,51,.1); }
.case-header { padding: 36px 32px 28px; background: linear-gradient(135deg,var(--slate),var(--ink)); color: #fff; }
.case-header .tag { background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); border-color: transparent; }
.case-header h3 { font-size: 1.4rem; margin-top: 14px; margin-bottom: 8px; }
.case-header p { font-size: .85rem; opacity: .8; }
.case-body { padding: 28px 32px; flex: 1; }
.case-metrics { display: flex; gap: 24px; margin-bottom: 20px; flex-wrap: wrap; }
.case-metric { text-align: left; max-width: 200px; }
.case-metric strong { display: block; font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--sage-dk); line-height: 1.35; }
.case-body p { font-size: .86rem; color: var(--text-lt); line-height: 1.7; }
.case-mini { font-size: .66rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--sage); margin: 16px 0 8px; }
.case-list { display: flex; flex-direction: column; gap: 7px; }
.case-list li { font-size: .84rem; color: var(--text-lt); line-height: 1.6; padding-left: 16px; position: relative; }
.case-list li::before { content: ''; position: absolute; left: 0; top: .6em; width: 5px; height: 5px; border-radius: 50%; background: var(--sage); }
.case-scope { display: inline-block; margin-top: 8px; background: var(--offwhite); border-radius: 40px; padding: 5px 14px; font-size: .76rem; color: var(--sage-dk); }
.case-link { font-size: .78rem; color: var(--sage-dk); display: inline-block; margin-top: 12px; }
.case-link:hover { text-decoration: underline; }

/* Custom-section list layout */
.cs-list { display: flex; flex-direction: column; gap: 14px; max-width: 820px; margin: 0 auto; }
.cs-list-item { background: var(--white); border: 1px solid var(--stone); border-radius: 14px; padding: 22px 26px; transition: all .3s; position: relative; }
.cs-list-item:hover { transform: translateX(4px); border-color: var(--mist); box-shadow: 0 16px 48px rgba(30,43,51,.08); }
.cs-sub { font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--sage); margin-bottom: 6px; }
.cs-label { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; color: var(--ink); margin-bottom: 4px; }
.cs-value { font-size: .85rem; color: var(--text-lt); line-height: 1.7; }

/* Contact */
#contact { padding: var(--section) 0; background: var(--offwhite); }
.contact-wrap { display: grid; grid-template-columns: 1fr; max-width: 620px; margin: 0 auto; align-items: start; }
.contact-info h2 { font-size: clamp(1.8rem,3vw,2.6rem); color: var(--ink); margin-bottom: 16px; }
.contact-info p { color: var(--text-lt); margin-bottom: 36px; }
.contact-links { display: flex; flex-direction: column; gap: 16px; }
.contact-link { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--white); border-radius: var(--radius); border: 1px solid var(--stone); transition: all .2s; }
.contact-link:hover { border-color: var(--sage); transform: translateX(4px); }
.contact-link-icon { width: 38px; height: 38px; border-radius: 50%; background: var(--offwhite); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.contact-link strong { display: block; font-size: .88rem; color: var(--ink); }
.contact-link span { font-size: .78rem; color: var(--text-lt); }

/* Footer */
footer { background: var(--ink); color: rgba(255,255,255,.6); padding: 48px 0; }
.footer-inner { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
.footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: #fff; }
.footer-logo span { color: var(--sage); }
.footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
.footer-links a { font-size: .78rem; letter-spacing: .04em; transition: color .2s; }
.footer-links a:hover { color: #fff; }
.footer-copy { font-size: .76rem; }
.footer-socials { display: flex; gap: 12px; }
.social-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; font-size: .9rem; transition: all .2s; }
.social-btn:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.3); }

[data-item-wrap] { position: relative; }
.ce-add-btn { margin-top: 32px; }

@media (max-width: 1020px) {
  .about-grid { grid-template-columns: 1fr; gap: 48px; }
  .about-photo { max-width: 360px; }
  .services-grid { grid-template-columns: repeat(2,1fr); }
  .cert-timeline::before { display: none; }
  .cases-grid { grid-template-columns: 1fr; }
  .contact-wrap { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  :root { --section: 72px; }
  .hero-grid { grid-template-columns: 1fr; gap: 48px; text-align: center; }
  .hero-image-wrap { max-height: 440px; margin: 0 auto; }
  .hero-badge { left: 0; }
  .hero-stat-row { justify-content: center; }
  .hero-chips, .hero-actions { justify-content: center; }
  .hero-eyebrow { justify-content: center; }
  .tl-item { grid-template-columns: 1fr; }
  .timeline::before { left: 20px; }
  .tl-content.left, .tl-content.right { grid-column: 1; text-align: left; }
  .tl-content.left .tl-points { align-items: flex-start; }
  .tl-dot { display: none; }
  .services-grid { grid-template-columns: 1fr; }
  .cert-timeline { flex-direction: column; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .about-strengths { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; }
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
		em ? `<button class="ce-add-btn btn btn-outline" data-add-section="${sec}">+ Add ${label}</button>` : '';

	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();
	const inits = initials(v.name);

	const years = v.template_overrides?.years_experience ?? yearsExperience(v.experience);
	const programmes = v.template_overrides?.campaigns_count ?? (v.hr_programs?.length ?? 0);
	const orgs = v.template_overrides?.roles_count ?? (v.experience?.length ?? 0);
	const ted = (key: string) => (em ? `contenteditable="true" data-path="template_overrides.${key}"` : '');

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
			? `<div class="hero-stat"><strong><span ${ted('years_experience')}>${years}</span>+</strong><span>Years in HR</span></div>` : '',
		statShown(v, 'campaigns_count', programmes)
			? `<div class="hero-stat"><strong><span ${ted('campaigns_count')}>${programmes}</span>+</strong><span>Programmes Led</span></div>` : '',
		statShown(v, 'roles_count', orgs)
			? `<div class="hero-stat"><strong><span ${ted('roles_count')}>${orgs}</span></strong><span>Organisations</span></div>` : ''
	].filter(Boolean).join('');

	const heroChips = v.core_expertise.length
		? `<div class="hero-chips" ${le('core_expertise')}>${v.core_expertise.map((t) => `<span class="tag">${t}</span>`).join('')}</div>`
		: em ? `<div class="hero-chips" ${le('core_expertise')}><span class="tag">Add core expertise</span></div>` : '';

	const heroPortrait = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="hero-ph">${inits}</div>`;
	// Decorative credential badge — first certification. No binding, so a slice
	// is correct here (Z1 exception); certifications has its own section.
	const topCert = v.certifications[0];

	// ── ABOUT ─────────────────────────────────────────────────────────────────
	const aboutVisual = v.summary_image
		? `<img src="${v.summary_image}" alt="${v.name}">`
		: `<div class="about-ph">${inits}</div>`;
	// Decorative "strengths" teaser derived from the skill groups (no binding).
	const strengths = v.skill_groups.slice(0, 4).map((g, i) =>
		`<div class="strength-item"><span class="strength-icon">${STRENGTH_ICONS[i % STRENGTH_ICONS.length]}</span><div><strong>${g.category}</strong><span>${g.skills.slice(0, 3).join(' · ')}</span></div></div>`
	).join('');
	const aboutHtml = (v.bio || v.uniqueValue || v.summary_image || em)
		? `<section id="about">
  <div class="wrap">
    <div class="about-grid reveal">
      <div class="about-photo" ${_imgUpload('profile.summary_image', em, 'Upload image')}>
        ${aboutVisual}
        <div class="about-photo-accent">
          <strong ${ed('profile.full_name')}>${v.name}</strong>
          <span>${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'HR Professional'}${v.location ? ` · <span ${ed('profile.location')}>${v.location}</span>` : ''}</span>
        </div>
      </div>
      <div class="about-content">
        <span class="label">About Me</span>
        <h2>A Strategic HR Leader Who Believes in the Power of People</h2>
        ${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
        ${strengths ? `<div class="about-strengths">${strengths}</div>` : ''}
      </div>
    </div>
  </div>
</section>` : '';

	// ── SKILLS (service cards) ────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<section id="skills">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">What I Do</span>
      <h2>Core HR Services</h2>
      <p>End-to-end human resources expertise — from attracting great people to building the structures that help them excel.</p>
    </div>
    <div class="services-grid">
${v.skill_groups.map((g, gi) => `      <div class="service-card reveal"${iw}>
        ${delBtn('skills', gi)}
        <div class="service-icon">${SERVICE_ICONS[gi % SERVICE_ICONS.length]}</div>
        <h3 ${ed(`skills.${gi}.category`)}>${g.category}</h3>
        <div class="chip-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
      </div>`).join('\n')}
    </div>
    ${addBtn('skills', 'Skill Group')}
  </div>
</section>` : '';

	// ── EXPERIENCE (alternating timeline) ─────────────────────────────────────
	const experienceHtml = (v.experience?.length || em)
		? `<section id="experience">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">Career Journey</span>
      <h2>Experience &amp; Impact</h2>
      <p>A track record of meaningful HR transformation across diverse sectors and scales.</p>
    </div>
    <div class="timeline">
${v.experience.map((exp, i) => {
			const side = i % 2 === 0 ? 'left' : 'right';
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
			const card = `<div class="tl-content ${side}"${iw}>
          ${delBtn('experience', i)}
          ${period ? `<div class="tl-year">${period}</div>` : ''}
          <h3 ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</h3>
          ${exp.company ? `<div class="tl-company"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
          ${exp.description ? `<p ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
          ${exp.key_points?.length ? `<ul class="tl-points" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
          ${shots(exp.images ?? [], `experience.${i}.images`, 'Upload image')}
        </div>`;
			return `      <div class="tl-item reveal">
        ${side === 'left' ? card : '<div></div>'}
        <div class="tl-dot"><div class="tl-dot-inner"></div></div>
        ${side === 'right' ? card : '<div></div>'}
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('experience', 'Experience')}
  </div>
</section>` : '';

	// ── HR PROGRAMS (case cards) ──────────────────────────────────────────────
	const programsHtml = (v.hr_programs?.length || em)
		? `<section id="hr_programs">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">Impact Stories</span>
      <h2>People Programmes</h2>
      <p>Real challenges. Measurable outcomes. Human solutions.</p>
    </div>
    <div class="cases-grid">
${v.hr_programs.map((p, i) => {
			const period = _rangeEditable(`hr_programs.${i}.start_date`, p.start_date, `hr_programs.${i}.end_date`, p.end_date, em, ' — ');
			return `      <div class="case-card reveal"${iw}>
        ${delBtn('hr_programs', i)}
        <div class="case-header">
          ${p.program_type ? `<span class="tag" ${ed(`hr_programs.${i}.program_type`)}>${p.program_type}</span>` : ''}
          <h3 ${ed(`hr_programs.${i}.program_name`)}>${p.program_name || (em ? 'Programme' : '')}</h3>
          ${p.organization ? `<p><span ${ed(`hr_programs.${i}.organization`)}>${p.organization}</span>${period ? ` · ${period}` : ''}</p>` : period ? `<p>${period}</p>` : ''}
        </div>
        <div class="case-body">
          ${p.measurable_outcomes?.length ? `<div class="case-metrics" ${le(`hr_programs.${i}.measurable_outcomes`)}>${p.measurable_outcomes.map((m) => `<div class="case-metric"><strong>${m}</strong></div>`).join('')}</div>` : ''}
          ${p.description ? `<p ${ed(`hr_programs.${i}.description`, true)}>${p.description}</p>` : ''}
          ${p.scope ? `<div class="case-scope" ${ed(`hr_programs.${i}.scope`)}>${p.scope}</div>` : ''}
          ${p.activities?.length ? `<div class="case-mini">What I did</div><ul class="case-list" ${le(`hr_programs.${i}.activities`)}>${p.activities.map((a) => `<li>${a}</li>`).join('')}</ul>` : ''}
          ${p.tools_used?.length ? `<div class="case-mini">Tools</div><div class="chip-row" ${le(`hr_programs.${i}.tools_used`)}>${p.tools_used.map((t) => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
          ${shots(p.images ?? [], `hr_programs.${i}.images`, 'Upload image')}
        </div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('hr_programs', 'Program')}
  </div>
</section>` : '';

	// ── SOFTWARE PROFICIENCY (dark band) ──────────────────────────────────────
	const softwareHtml = v.software_proficiency?.length
		? `<section id="software_proficiency" class="band-dark">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">Technology</span>
      <h2>HRIS &amp; Tools</h2>
      <p>The systems I run people operations on.</p>
    </div>
    <div class="tools-grid reveal" ${le('software_proficiency')}>${v.software_proficiency.map((s) => `<span class="tool-chip">${s}</span>`).join('')}</div>
  </div>
</section>` : '';

	// ── COMPLIANCE EXPERTISE ──────────────────────────────────────────────────
	const complianceHtml = v.compliance_expertise?.length
		? `<section id="compliance_expertise" class="band-light">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">Governance</span>
      <h2>Employment Law &amp; Compliance</h2>
      <p>The statutory frameworks every policy and process is built against.</p>
    </div>
    <div class="tools-grid reveal" ${le('compliance_expertise')}>${v.compliance_expertise.map((s) => `<span class="tool-chip">${s}</span>`).join('')}</div>
  </div>
</section>` : '';

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = (v.education?.length || em)
		? `<section id="education">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">Academic Background</span>
      <h2>Education</h2>
      <p>The foundation that shaped a career built on strategic, people-first thinking.</p>
    </div>
    <div class="edu-timeline">
${v.education.map((edu, i) => {
			const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `      <div class="edu-item reveal">
        <div class="edu-dot">${EDU_ICONS[i % EDU_ICONS.length]}</div>
        <div class="edu-card"${iw}>
          ${delBtn('education', i)}
          ${yr ? `<div class="edu-year">${yr}</div>` : ''}
          <h3>${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</h3>
          <div class="edu-org">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}${edu.grade_or_score ? ` — <span ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span>` : ''}</div>
        </div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('education', 'Education')}
  </div>
</section>` : '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certsHtml = (v.certifications?.length || em)
		? `<section id="certifications">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">Credentials</span>
      <h2>Certifications</h2>
      <p>Continuous professional development underpins everything I do.</p>
    </div>
    <div class="cert-timeline">
${v.certifications.map((c, i) => `      <div class="cert-tl-item reveal">
        <div class="cert-tl-dot"></div>
        <div class="cert-card"${iw}>
          ${delBtn('certifications', i)}
          <div class="cert-badge">${CERT_ICONS[i % CERT_ICONS.length]}</div>
          <strong ${ed(`certifications.${i}.name`)}>${c.name}</strong>
          ${c.issuer ? `<span ${ed(`certifications.${i}.issuer`)}>${c.issuer}</span>` : ''}
          ${c.year ? `<span class="cert-year" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
          ${c.url ? `<a class="edu-link" href="${c.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
        </div>
      </div>`).join('\n')}
    </div>
    ${addBtn('certifications', 'Certification')}
  </div>
</section>` : '';

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = (v.achievements?.length || em)
		? `<section id="achievements" style="background:var(--offwhite);padding:var(--section) 0">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">Recognition</span>
      <h2>Key Achievements</h2>
      <p>Milestones that mattered more than the plaque.</p>
    </div>
    <div class="cs-list">
${v.achievements.map((a, i) => `      <div class="cs-list-item reveal"${iw}>
        ${delBtn('achievements', i)}
        ${a.year ? `<div class="cs-sub" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <div class="cs-label" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.description ? `<div class="cs-value" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
        ${a.url ? `<a class="edu-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
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
			? `<div class="chip-row" style="margin-top:12px" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span class="chip">${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="edu-link" href="${u}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '';

		let body: string;
		if (cs.display_type === 'timeline') {
			body = `<div class="edu-timeline">${items.map((it, i) => `<div class="edu-item"><div class="edu-dot">${EDU_ICONS[i % EDU_ICONS.length]}</div><div class="edu-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div></div>`).join('')}</div>`;
		} else if (cs.display_type === 'list') {
			body = `<div class="cs-list">${items.map((it, i) => `<div class="cs-list-item"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else {
			body = `<div class="services-grid">${items.map((it, i) => `<div class="service-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		}
		return `<section id="${cs.section_id}" style="padding:var(--section) 0">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="label">More</span>
      <h2 ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2>
    </div>
    <div class="reveal">${body}</div>
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>
</section>`;
	}).filter(Boolean).join('\n');

	const sectionMap: Record<string, string> = {
		experience: experienceHtml,
		hr_programs: programsHtml,
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
		about: 'About', skills: 'Services', experience: 'Experience', hr_programs: 'Programmes',
		software_proficiency: 'Tools', compliance_expertise: 'Compliance',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements'
	};
	const navKeys: string[] = [];
	if (v.bio || v.uniqueValue) navKeys.push('about');
	for (const key of order) {
		if (hidden.has(key) || !(key in sectionMap) || !sectionMap[key]) continue;
		if (key === 'custom_sections') continue;
		navKeys.push(key);
	}
	const navItems = navKeys.slice(0, 5).map((k) => `<li><a href="#${k}">${NAV_LABELS[k] ?? k}</a></li>`).join('');
	const expAnchor = navKeys.includes('experience') ? 'experience' : navKeys[0] ?? 'contact';

	// ── CONTACT ───────────────────────────────────────────────────────────────
	const contactLinks = [
		v.email ? `<a class="contact-link" href="mailto:${v.email}"><div class="contact-link-icon">&#9993;</div><div><strong>Email</strong><span ${ed('profile.email')}>${v.email}</span></div></a>` : '',
		v.linkedin_url ? `<a class="contact-link" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer"><div class="contact-link-icon">&#128188;</div><div><strong>LinkedIn</strong><span>Connect &#8599;</span></div></a>` : '',
		v.phone ? `<a class="contact-link" href="tel:${v.phone}"><div class="contact-link-icon">&#128222;</div><div><strong>Phone</strong><span ${ed('profile.phone')}>${v.phone}</span></div></a>` : '',
		v.location ? `<div class="contact-link"><div class="contact-link-icon">&#128205;</div><div><strong>Location</strong><span ${ed('profile.location')}>${v.location}</span></div></div>` : ''
	].filter(Boolean).join('');
	const contactHtml = contactLinks
		? `<section id="contact">
  <div class="wrap">
    <div class="contact-wrap">
      <div class="contact-info reveal">
        <span class="label">Get in Touch</span>
        <h2>Let's Start a Conversation</h2>
        <p ${ed('profile.contact_tagline', true)}>${v.contact_tagline || "Whether you're looking for an HR leader, a strategic advisor, or a speaking engagement, I'd love to hear from you."}</p>
        <div class="contact-links">${contactLinks}</div>
      </div>
    </div>
  </div>
</section>` : '';

	const footerLinks = navKeys.slice(0, 4).map((k) => `<a href="#${k}">${NAV_LABELS[k] ?? k}</a>`).join('');
	const socials = [
		v.linkedin_url ? `<a class="social-btn" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" title="LinkedIn">in</a>` : '',
		v.twitter_url ? `<a class="social-btn" href="${v.twitter_url}" target="_blank" rel="noopener noreferrer" title="X">&#120143;</a>` : '',
		v.email ? `<a class="social-btn" href="mailto:${v.email}" title="Email">@</a>` : ''
	].filter(Boolean).join('');

	const nameParts = v.name.split(/\s+/);
	const logoFirst = nameParts.slice(0, -1).join(' ') || v.name;
	const logoLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

	const RUNTIME = `<script>
(function(){
  var nav=document.getElementById('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);},{passive:true});}

  document.querySelectorAll('.services-grid, .edu-timeline, .cert-timeline, .cases-grid, .cs-list').forEach(function(grid){
    grid.querySelectorAll('.reveal').forEach(function(child,i){ child.style.transitionDelay=(i*80)+'ms'; });
  });

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ var t=e.target; setTimeout(function(){t.classList.add('visible');},80); io.unobserve(t); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

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

  var hb=document.querySelector('.hamburger');
  if(hb){
    hb.addEventListener('click',function(){
      var links=document.querySelector('.nav-links');
      if(!links)return;
      if(links.style.display==='flex'){links.style.display='';}
      else{
        links.style.display='flex';links.style.flexDirection='column';links.style.position='absolute';
        links.style.top='72px';links.style.left='0';links.style.right='0';
        links.style.background='var(--white)';links.style.padding='24px 28px';
        links.style.borderBottom='1px solid var(--stone)';links.style.gap='20px';
      }
    });
  }
})();
<\/script>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — ${v.profile_headline || 'HR Leader'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>

<nav id="nav">
  <div class="wrap">
    <a href="#hero" class="nav-logo">${logoFirst}<span>.</span>${logoLast}</a>
    <ul class="nav-links">${navItems}</ul>
    <a href="#contact" class="btn nav-cta">Let's Talk</a>
    <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav>

<section id="hero">
  <div class="hero-bg"></div>
  <div class="wrap">
    <div class="hero-grid">
      <div class="hero-copy">
        ${v.profile_headline ? `<div class="hero-eyebrow"><span ${ed('profile.headline')}>${v.profile_headline}</span></div>` : ''}
        <h1 class="hero-title" ${ed('portfolio.headline')}>${v.headline || v.name}</h1>
        ${v.bio ? `<p class="hero-sub" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
        ${heroChips}
        <div class="hero-actions">
          <a href="#${expAnchor}" class="btn btn-primary">View Experience &rarr;</a>
          <a href="#contact" class="btn btn-outline">Contact Me</a>
        </div>
        ${heroStats ? `<div class="hero-stat-row">${heroStats}</div>` : ''}
      </div>
      <div style="position:relative;">
        <div class="hero-image-wrap" ${_imgUpload('profile.profile_image', em)}>${heroPortrait}</div>
        ${topCert ? `<div class="hero-badge">
          <div class="hero-badge-icon">&#127942;</div>
          <div class="hero-badge-text">
            <strong>${topCert.name}</strong>
            <span>${topCert.issuer || 'Certified Professional'}</span>
          </div>
        </div>` : ''}
      </div>
    </div>
  </div>
</section>

${aboutHtml}
${orderedSections}
${contactHtml}

<footer>
  <div class="wrap">
    <div class="footer-inner">
      <span class="footer-logo">${logoFirst}<span>.</span>${logoLast}</span>
      <div class="footer-links">${footerLinks}</div>
      ${socials ? `<div class="footer-socials">${socials}</div>` : ''}
      <span class="footer-copy">&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</span>
    </div>
  </div>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
