/**
 * Template: Quill
 * HR theme — editorial "printed dossier" layout on cream stock with blush
 * panels and ink bands. Cormorant display, EB Garamond justified body copy and
 * Jost micro-labels, a blush hero rail with crosshair marks, a ribbon blob
 * behind the portrait, an oval double-ruled secondary frame with diamond
 * accents, a sticky table-of-contents pill strip, and bracket-ruled callouts.
 * Palette: cream #faf6f0, white, blush #e7d3c1, blush-deep #d7b998,
 * blush-pale #f1e5d8, ink #211c1a, ink-soft #56504b, ink-faint #918a83.
 * Fonts: Cormorant (display) · EB Garamond (body serif) · Jost (labels).
 * Signature: alternating cream/white/blush/ink section bands, scroll reveals
 * with stagger, TOC pills, hover-inverting buttons, bracket-box corner diamonds.
 *
 * Ported from templates_add/hr-portfolio-04.html. The source's eight themed
 * people-work sections (recruitment / initiatives / engagement / learning /
 * performance / policies / payroll / analytics) all map to one data model
 * section — they are rendered as a single `hr_programs` list (Z15) rather than
 * eight invented sections. Skill and tool percentage bars became pills (Z16).
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500;600&display=swap';

function initials(name: string): string {
	const p = name.trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1]?.[0] ?? '' : '')).toUpperCase() || '••';
}

function css(): string {
	return `
:root {
  --cream: #faf6f0;
  --white: #ffffff;
  --blush: #e7d3c1;
  --blush-deep: #d7b998;
  --blush-pale: #f1e5d8;
  --ink: #211c1a;
  --ink-soft: #56504b;
  --ink-faint: #918a83;
  --line: rgba(33,28,26,0.55);
  --line-soft: rgba(33,28,26,0.15);
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: 'EB Garamond', serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }
.container { max-width: 1140px; margin: 0 auto; padding: 0 60px; }
em { font-style: italic; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
img { display: block; max-width: 100%; }

.eyebrow {
  font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500;
  letter-spacing: .28em; text-transform: uppercase; color: var(--ink-soft);
  display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
}
.eyebrow::before { content: ''; width: 30px; height: 1px; background: var(--ink); flex: none; }
.ed-title { font-family: 'Cormorant', serif; font-weight: 300; font-size: clamp(34px,4vw,50px); line-height: 1.08; color: var(--ink); margin-bottom: 40px; }
.ed-title em { color: var(--ink); font-weight: 400; }

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between; padding: 22px 60px;
  background: rgba(250,246,240,0.9); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line-soft);
}
.nav-logo { font-family: 'Cormorant', serif; font-style: italic; font-size: 22px; color: var(--ink); }
.nav-links { display: flex; align-items: center; gap: 32px; }
.nav-links a { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-soft); transition: color .25s; }
.nav-links a:hover { color: var(--ink); }
.nav-cta { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--cream) !important; background: var(--ink); padding: 11px 22px; transition: background .25s; white-space: nowrap; }
.nav-cta:hover { background: var(--ink-soft); }

/* TOC */
.toc-strip { background: var(--white); border-bottom: 1px solid var(--line-soft); padding: 14px 0; position: sticky; top: 72px; z-index: 90; }
.toc-scroll { max-width: 1140px; margin: 0 auto; padding: 0 60px; display: flex; gap: 8px; overflow-x: auto; }
.toc-pill {
  flex-shrink: 0; font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500;
  letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft);
  border: 1px solid var(--line-soft); padding: 7px 14px; border-radius: 20px; white-space: nowrap; transition: all .25s;
}
.toc-pill:hover { border-color: var(--ink); color: var(--ink); background: var(--blush-pale); }

.crosshair { position: absolute; font-size: 20px; font-weight: 300; color: var(--ink); line-height: 1; font-family: 'EB Garamond', serif; opacity: .75; pointer-events: none; user-select: none; }
.diamond { position: absolute; color: var(--ink); font-size: 12px; opacity: .8; pointer-events: none; user-select: none; }

/* HERO */
#hero { position: relative; display: grid; grid-template-columns: 90px 1fr; min-height: 100vh; padding-top: 72px; }
.hero-rail { background: var(--blush); position: relative; }
.hero-rail .crosshair { top: 90px; left: 34px; }
.hero-main { position: relative; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 60px 60px 60px 70px; gap: 20px; }
.hero-copy { position: relative; z-index: 3; }
.hero-name { font-family: 'Cormorant', serif; font-weight: 300; font-size: clamp(46px,5.6vw,68px); line-height: 1.06; color: var(--ink); margin-bottom: 18px; }
.hero-role { font-family: 'EB Garamond', serif; font-style: italic; font-size: 19px; color: var(--ink-soft); margin-bottom: 22px; }
.hero-tag { display: inline-block; font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; background: var(--blush-deep); color: var(--ink); padding: 11px 22px; margin-bottom: 34px; }
.hero-desc { font-size: 16px; line-height: 1.85; color: var(--ink-soft); max-width: 400px; margin-bottom: 34px; }
.hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.btn-solid, .btn-line { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; padding: 13px 26px; display: inline-block; transition: all .25s; cursor: pointer; }
.btn-solid { background: var(--ink); color: var(--cream); border: 1px solid var(--ink); }
.btn-solid:hover { background: var(--ink-soft); }
.btn-line { border: 1px solid var(--ink); color: var(--ink); background: transparent; }
.btn-line:hover { background: var(--ink); color: var(--cream); }
.hero-visual { position: relative; height: 100%; display: flex; align-items: center; justify-content: center; }
.ribbon-shape { position: absolute; width: 320px; height: 380px; background: linear-gradient(155deg,#ece7de 0%,#ddd6c9 100%); border-radius: 50% 50% 45% 55% / 55% 45% 55% 45%; transform: rotate(18deg); right: 10%; top: 8%; z-index: 0; opacity: .9; }
.hero-photo-main { position: relative; z-index: 2; width: 240px; height: 340px; border-radius: 4px; overflow: hidden; box-shadow: 0 30px 60px rgba(33,28,26,0.18); background: var(--blush-pale); display: flex; align-items: center; justify-content: center; }
.hero-photo-main img { width: 100%; height: 100%; object-fit: cover; }
.placeholder-initials { font-family: 'Cormorant', serif; font-size: 64px; font-weight: 300; color: var(--blush-deep); }

/* OVAL FRAME */
.oval-wrap { position: relative; width: 230px; height: 320px; margin: 0 auto; }
.oval-frame { position: absolute; inset: 0; border: 1px solid var(--ink); border-radius: 50%; overflow: hidden; background: var(--blush-pale); display: flex; align-items: center; justify-content: center; }
.oval-frame::after { content: ''; position: absolute; inset: 10px; border: 1px solid var(--line-soft); border-radius: 50%; pointer-events: none; z-index: 3; }
.oval-frame img { width: 100%; height: 100%; object-fit: cover; }
.oval-frame .placeholder-initials { font-size: 46px; }
.oval-wrap .diamond.d1 { top: 46%; left: -14px; }
.oval-wrap .diamond.d2 { bottom: 6%; right: -10px; }

/* SECTION SHELLS */
section { padding: 100px 0; position: relative; }
.bg-cream { background: var(--cream); }
.bg-white { background: var(--white); }
.bg-blush { background: var(--blush-pale); }
.bg-ink { background: var(--ink); color: var(--cream); }
.bg-ink .eyebrow { color: var(--blush-deep); }
.bg-ink .eyebrow::before { background: var(--blush-deep); }
.bg-ink .ed-title { color: var(--cream); }
.bg-ink .ed-title em { color: var(--blush-deep); }

.bracket-box { position: relative; border-left: 1px solid var(--ink); border-top: 1px solid var(--ink); padding: 30px 0 30px 30px; }
.bracket-box::before, .bracket-box::after { content: '\\25C6'; position: absolute; font-size: 9px; color: var(--ink); }
.bracket-box::before { top: -5px; left: -5px; }
.bracket-box::after { bottom: -5px; left: calc(100% - 5px); }
.two-col { display: grid; grid-template-columns: 1.15fr .85fr; gap: 70px; align-items: start; }
.justify-text { text-align: justify; font-size: 15px; line-height: 1.9; color: var(--ink-soft); }
.justify-text p + p { margin-top: 16px; }
.micro-label { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 12px; }

/* CONTACT LIST */
.contact-list { margin-top: 30px; }
.contact-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--line-soft); font-family: 'Jost', sans-serif; font-size: 12px; }
.contact-row:last-child { border-bottom: none; }
.contact-row .cl { letter-spacing: .1em; text-transform: uppercase; color: var(--ink-faint); }
.contact-row .cv { font-family: 'EB Garamond', serif; font-size: 15px; color: var(--ink); text-align: right; }
.status-pill { display: inline-flex; align-items: center; gap: 8px; font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--ink); border: 1px solid var(--ink); padding: 8px 16px; margin-top: 24px; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }

/* GALLERY */
.gallery-grid { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 16px; }
.gallery-item { position: relative; width: 250px; height: 250px; border: 1px solid var(--line-soft); overflow: hidden; }
.gallery-item img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .7s; }
.gallery-item img.active { opacity: 1; }
.gallery-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-faint); background: var(--blush-pale); text-align: center; padding: 12px; }
.shots-dots { position: absolute; bottom: 8px; left: 0; right: 0; display: flex; gap: 5px; justify-content: center; z-index: 2; }
.shots-dots i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.7); }
.shots-dots i.on { background: var(--blush-deep); }

/* ENTRY LIST */
.entry { padding: 40px 0; border-top: 1px solid var(--line-soft); position: relative; }
.entry:first-child { border-top: none; padding-top: 0; }
.entry-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 6px; }
.entry-title { font-family: 'Cormorant', serif; font-style: italic; font-weight: 500; font-size: 26px; color: var(--ink); }
.bg-ink .entry-title { color: var(--cream); }
.entry-period { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .08em; color: var(--ink-faint); white-space: nowrap; }
.entry-meta { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 16px; }
.bg-ink .entry-meta { color: rgba(250,246,240,0.55); }
.entry-rows { margin: 12px 0; }
.entry-row { display: flex; justify-content: space-between; gap: 16px; font-size: 14px; padding: 7px 0; border-bottom: 1px solid var(--line-soft); }
.bg-ink .entry-row { border-bottom-color: rgba(250,246,240,0.1); }
.entry-row:last-child { border-bottom: none; }
.entry-row .rl { color: var(--ink-faint); font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
.entry-row .rv { color: var(--ink); font-weight: 500; text-align: right; }
.bg-ink .entry-row .rv { color: var(--cream); }
.entry-text { font-size: 15px; line-height: 1.85; color: var(--ink-soft); text-align: justify; margin: 10px 0; }
.bg-ink .entry-text { color: rgba(250,246,240,0.7); }
.entry-list { margin: 10px 0; display: flex; flex-direction: column; gap: 8px; }
.entry-list li { font-size: 14.5px; line-height: 1.8; color: var(--ink-soft); padding-left: 18px; position: relative; }
.entry-list li::before { content: '\\25C6'; position: absolute; left: 0; top: 0; font-size: 8px; color: var(--blush-deep); }
.bg-ink .entry-list li { color: rgba(250,246,240,0.7); }
.entry-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.entry-tag { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink); border: 1px solid var(--line-soft); padding: 6px 12px; }
.bg-ink .entry-tag { color: var(--cream); border-color: rgba(250,246,240,0.2); }

/* CARD GRID */
.card-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 30px; }
.ed-card { padding: 36px; background: var(--white); border: 1px solid var(--line-soft); position: relative; }
.bg-white .ed-card { background: var(--cream); }
.bg-ink .ed-card { background: rgba(250,246,240,0.04); border-color: rgba(250,246,240,0.15); }
.ed-card-title { font-family: 'Cormorant', serif; font-weight: 500; font-style: italic; font-size: 23px; color: var(--ink); margin-bottom: 6px; }
.bg-ink .ed-card-title { color: var(--cream); }
.ed-card-sub { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 16px; }
.ed-card-meta { font-size: 13px; color: var(--ink-soft); margin-bottom: 4px; line-height: 1.7; }
.bg-ink .ed-card-meta { color: rgba(250,246,240,0.6); }
.ed-card-badge { display: inline-block; margin-top: 14px; font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; border: 1px solid var(--ink); padding: 7px 14px; }
.bg-ink .ed-card-badge { border-color: rgba(250,246,240,0.4); color: var(--cream); }

/* SKILLS + PILLS */
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.skill-cat-title { font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--ink); border-bottom: 1px solid var(--ink); padding-bottom: 14px; margin-bottom: 26px; }
.bg-ink .skill-cat-title { color: var(--cream); border-bottom-color: rgba(250,246,240,0.4); }
.pill-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.soft-pill { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .06em; padding: 10px 16px; border: 1px solid var(--line-soft); color: var(--ink-soft); }
.bg-ink .soft-pill { color: rgba(250,246,240,0.75); border-color: rgba(250,246,240,0.2); }
.skill-block { position: relative; margin-bottom: 40px; }

/* TOOLS */
.tools-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.tool-card { padding: 22px; border: 1px solid var(--line-soft); background: var(--white); transition: border-color .25s, transform .25s; }
.bg-white .tool-card { background: var(--cream); }
.tool-card:hover { border-color: var(--ink); transform: translateY(-3px); }
.tool-name { font-size: 14px; font-weight: 500; color: var(--ink); }
.tool-rule { height: 2px; background: var(--blush-deep); margin-top: 10px; width: 34px; }

/* FOOTER */
footer { background: var(--ink); color: var(--cream); padding: 70px 0; text-align: center; }
.footer-name { font-family: 'Cormorant', serif; font-weight: 300; font-size: 34px; margin-bottom: 10px; }
.footer-sub { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: rgba(250,246,240,0.4); margin-bottom: 36px; }
.footer-contact { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-bottom: 36px; }
.footer-contact a, .footer-contact span { font-family: 'Jost', sans-serif; font-size: 12px; color: rgba(250,246,240,0.7); }
.footer-contact a:hover { color: var(--blush-deep); }
.footer-copy { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: .08em; color: rgba(250,246,240,0.3); }

/* REVEAL */
.reveal { opacity: 0; transform: translateY(24px); transition: all .7s cubic-bezier(0.4,0,0.2,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }

[data-item-wrap] { position: relative; }
.ce-add-btn { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; background: var(--ink); color: var(--cream); border: none; padding: 15px 30px; cursor: pointer; margin-top: 34px; }
.bg-ink .ce-add-btn { background: var(--blush-deep); color: var(--ink); }

@media (max-width: 900px) {
  nav { padding: 16px 24px; }
  .nav-links { display: none; }
  .container { padding: 0 24px; }
  .toc-scroll { padding: 0 24px; }
  #hero { grid-template-columns: 0; }
  .hero-rail { display: none; }
  .hero-main { grid-template-columns: 1fr; padding: 100px 24px 60px; }
  .hero-visual { margin-top: 40px; }
  .two-col { grid-template-columns: 1fr; gap: 40px; }
  .skills-grid, .card-grid, .tools-grid { grid-template-columns: 1fr; }
  .gallery-item { width: 100%; height: 220px; }
}
@media (prefers-reduced-motion: reduce) { .reveal { transition: none; opacity: 1; transform: none; } }
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

	const gallery = (images: string[], path: string, label: string): string => {
		if (!images.length && !em) return '';
		const imgs = images.map((src, k) => `<img src="${src}" alt="" class="${k === 0 ? 'active' : ''}">`).join('');
		const dots = images.length > 1
			? `<div class="shots-dots">${images.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>`
			: '';
		const ph = !images.length ? `<div class="gallery-ph">${label}</div>` : '';
		return `<div class="gallery-grid"><div class="gallery-item" ${_imgUpload(path, em, 'Upload image')}>${imgs}${ph}${dots}</div></div>`;
	};

	const nameParts = v.name.split(/\s+/);
	const firstLine = nameParts.slice(0, -1).join(' ') || v.name;
	const lastLine = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
	const logo = nameParts.map((p) => (p[0] ?? '').toUpperCase()).join('.') || '••';

	// ── INTRO ─────────────────────────────────────────────────────────────────
	const contactRows = [
		v.phone ? `<div class="contact-row"><span class="cl">Phone</span><span class="cv" ${ed('profile.phone')}>${v.phone}</span></div>` : '',
		v.email ? `<div class="contact-row"><span class="cl">Email</span><span class="cv" ${ed('profile.email')}>${v.email}</span></div>` : '',
		v.location ? `<div class="contact-row"><span class="cl">Location</span><span class="cv" ${ed('profile.location')}>${v.location}</span></div>` : '',
		v.linkedin_url ? `<div class="contact-row"><span class="cl">LinkedIn</span><a class="cv" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">Connect &#8599;</a></div>` : ''
	].filter(Boolean).join('');

	const introHtml = (v.bio || v.uniqueValue || contactRows || em)
		? `<section id="about" class="bg-white">
  <div class="container">
    <div class="two-col">
      <div class="reveal">
        <div class="eyebrow">Get To Know Me</div>
        <h2 class="ed-title">Introduction</h2>
        <div class="bracket-box">
          <p class="micro-label">About Me</p>
          <div class="justify-text">
            ${v.bio ? `<p ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
            ${v.uniqueValue ? `<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
          </div>
        </div>
        ${contactRows ? `<div class="contact-list">${contactRows}</div>` : ''}
        <div class="status-pill"><span class="status-dot"></span> <span ${ed('profile.contact_tagline')}>${v.contact_tagline || 'Open to Opportunities'}</span></div>
      </div>
      <div class="visual-slot reveal" style="transition-delay:.15s">
        <div class="oval-wrap">
          <div class="diamond d1">&#9670;</div>
          <div class="oval-frame" ${_imgUpload('profile.summary_image', em, 'Upload image')}>
            ${v.summary_image ? `<img src="${v.summary_image}" alt="${v.name}">` : `<div class="placeholder-initials">${inits}</div>`}
          </div>
          <div class="diamond d2">&#9670;</div>
        </div>
      </div>
    </div>
  </div>
</section>` : '';

	// ── EXPERIENCE ────────────────────────────────────────────────────────────
	const experienceHtml = (v.experience?.length || em)
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Work History</div>
      <h2 class="ed-title">Professional <em>Experience</em></h2>
    </div>
${v.experience.map((exp, i) => {
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
			return `    <div class="entry reveal"${iw} style="transition-delay:${i * 0.1}s">
      ${delBtn('experience', i)}
      <div class="entry-head">
        <div class="entry-title" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
        ${period ? `<div class="entry-period">${period}</div>` : ''}
      </div>
      ${exp.company ? `<div class="entry-meta"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}${exp.is_current ? ' · Current Role' : ''}</div>` : ''}
      ${exp.description ? `<p class="entry-text" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
      ${exp.key_points?.length ? `<ul class="entry-list" ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
      ${gallery(exp.images ?? [], `experience.${i}.images`, 'Add workplace photo')}
    </div>`;
		}).join('\n')}
    ${addBtn('experience', 'Experience')}
  </div>` : '';

	// ── HR PROGRAMS ───────────────────────────────────────────────────────────
	const programsHtml = (v.hr_programs?.length || em)
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">People Programs</div>
      <h2 class="ed-title">HR <em>Initiatives</em></h2>
    </div>
${v.hr_programs.map((p, i) => {
			const period = _rangeEditable(`hr_programs.${i}.start_date`, p.start_date, `hr_programs.${i}.end_date`, p.end_date, em, ' — ');
			const rows = [
				p.program_type ? `<div class="entry-row"><span class="rl">Initiative Type</span><span class="rv" ${ed(`hr_programs.${i}.program_type`)}>${p.program_type}</span></div>` : '',
				p.scope ? `<div class="entry-row"><span class="rl">Scope</span><span class="rv" ${ed(`hr_programs.${i}.scope`)}>${p.scope}</span></div>` : '',
				...(p.measurable_outcomes ?? []).map((m) => `<div class="entry-row"><span class="rl">Result</span><span class="rv">${m}</span></div>`)
			].filter(Boolean).join('');
			return `    <div class="entry reveal"${iw} style="transition-delay:${i * 0.1}s">
      ${delBtn('hr_programs', i)}
      <div class="entry-head">
        <div class="entry-title" ${ed(`hr_programs.${i}.program_name`)}>${p.program_name || (em ? 'Programme' : '')}</div>
        ${period ? `<div class="entry-period">${period}</div>` : ''}
      </div>
      ${p.organization ? `<div class="entry-meta" ${ed(`hr_programs.${i}.organization`)}>${p.organization}</div>` : ''}
      ${p.description ? `<p class="entry-text" ${ed(`hr_programs.${i}.description`, true)}>${p.description}</p>` : ''}
      ${p.activities?.length ? `<ul class="entry-list" ${le(`hr_programs.${i}.activities`)}>${p.activities.map((a) => `<li>${a}</li>`).join('')}</ul>` : ''}
      ${rows ? `<div class="entry-rows"${p.measurable_outcomes?.length ? ` ${le(`hr_programs.${i}.measurable_outcomes`)}` : ''}>${rows}</div>` : ''}
      ${p.tools_used?.length ? `<div class="entry-tags" ${le(`hr_programs.${i}.tools_used`)}>${p.tools_used.map((t) => `<span class="entry-tag">${t}</span>`).join('')}</div>` : ''}
      ${gallery(p.images ?? [], `hr_programs.${i}.images`, 'Add initiative image')}
    </div>`;
		}).join('\n')}
    ${addBtn('hr_programs', 'Program')}
  </div>` : '';

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Capabilities</div>
      <h2 class="ed-title">Skills &amp; <em>Expertise</em></h2>
    </div>
    <div class="skills-grid">
${v.skill_groups.map((g, gi) => `      <div class="skill-block reveal"${iw} style="transition-delay:${(gi % 2) * 0.1}s">
        ${delBtn('skills', gi)}
        <div class="skill-cat-title" ${ed(`skills.${gi}.category`)}>${g.category}</div>
        <div class="pill-grid" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<div class="soft-pill">${s}</div>`).join('')}</div>
      </div>`).join('\n')}
    </div>
    ${addBtn('skills', 'Skill Group')}
  </div>` : '';

	// ── SOFTWARE PROFICIENCY ──────────────────────────────────────────────────
	const softwareHtml = v.software_proficiency?.length
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Systems Proficiency</div>
      <h2 class="ed-title">HR Tools &amp; <em>Technologies</em></h2>
    </div>
    <div class="tools-grid reveal" ${le('software_proficiency')}>
${v.software_proficiency.map((s) => `      <div class="tool-card"><div class="tool-name">${s}</div><div class="tool-rule"></div></div>`).join('\n')}
    </div>
  </div>` : '';

	// ── COMPLIANCE EXPERTISE ──────────────────────────────────────────────────
	const complianceHtml = v.compliance_expertise?.length
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Governance</div>
      <h2 class="ed-title">Employment Law &amp; <em>Compliance</em></h2>
    </div>
    <div class="pill-grid reveal" ${le('compliance_expertise')}>${v.compliance_expertise.map((s) => `<div class="soft-pill">${s}</div>`).join('')}</div>
  </div>` : '';

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = (v.achievements?.length || em)
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Recognition</div>
      <h2 class="ed-title">Key <em>Achievements</em></h2>
    </div>
    <div class="card-grid">
${v.achievements.map((a, i) => `      <div class="ed-card reveal"${iw}>
        ${delBtn('achievements', i)}
        <div class="ed-card-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.year ? `<div class="ed-card-sub" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        ${a.description ? `<div class="ed-card-meta" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
        ${a.url ? `<a class="ed-card-badge" href="${a.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('achievements', 'Achievement')}
  </div>` : '';

	// ── EDUCATION ─────────────────────────────────────────────────────────────
	const educationHtml = (v.education?.length || em)
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Academic Background</div>
      <h2 class="ed-title">Education</h2>
    </div>
    <div class="card-grid">
${v.education.map((edu, i) => {
			const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `      <div class="ed-card reveal"${iw}>
        ${delBtn('education', i)}
        <div class="ed-card-title">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
        ${edu.institution ? `<div class="ed-card-sub"><span ${ed(`education.${i}.institution`)}>${edu.institution}</span>${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
        ${yr ? `<div class="ed-card-meta">${yr}</div>` : ''}
        ${edu.grade_or_score ? `<div class="ed-card-badge" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('education', 'Education')}
  </div>` : '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certsHtml = (v.certifications?.length || em)
		? `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Credentials</div>
      <h2 class="ed-title">Certifications</h2>
    </div>
    <div class="card-grid">
${v.certifications.map((c, i) => `      <div class="ed-card reveal"${iw}>
        ${delBtn('certifications', i)}
        <div class="ed-card-title" ${ed(`certifications.${i}.name`)}>${c.name}</div>
        ${c.issuer ? `<div class="ed-card-sub" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
        ${c.year ? `<div class="ed-card-meta" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
        ${c.url ? `<a class="ed-card-badge" href="${c.url}" target="_blank" rel="noopener noreferrer">Verify &#8599;</a>` : ''}
      </div>`).join('\n')}
    </div>
    ${addBtn('certifications', 'Certification')}
  </div>` : '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customBodies = (v.custom_sections ?? []).map((cs, ci) => {
		if (!cs.items?.length && !em) return null;
		const items = cs.items ?? [];
		const tags = (i: number, t: string[]) => t?.length
			? `<div class="entry-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span class="entry-tag">${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="ed-card-badge" href="${u}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '';

		let body: string;
		if (cs.display_type === 'timeline') {
			body = items.map((it, i) => `<div class="entry"${iw}>${delBtn(`custom_sections.${ci}`, i)}
        <div class="entry-head">
          ${it.label ? `<div class="entry-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</div>` : ''}
          ${it.subtitle ? `<div class="entry-period" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</div>` : ''}
        </div>
        ${it.value ? `<p class="entry-text" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</p>` : ''}
        ${tags(i, it.tags)}${link(it.url)}
      </div>`).join('');
		} else if (cs.display_type === 'list') {
			body = `<div class="entry-rows">${items.map((it, i) => `<div class="entry-row"${iw} style="align-items:baseline">${delBtn(`custom_sections.${ci}`, i)}
        <span class="rl" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</span>
        <span class="rv">${it.value ? `<span ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</span>` : ''}${it.subtitle ? ` <span class="cl" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</span>` : ''}</span>
      </div>`).join('')}</div>`;
		} else {
			body = `<div class="card-grid">${items.map((it, i) => `<div class="ed-card"${iw}>${delBtn(`custom_sections.${ci}`, i)}
        ${it.label ? `<div class="ed-card-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${it.label}</div>` : ''}
        ${it.subtitle ? `<div class="ed-card-sub" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${it.subtitle}</div>` : ''}
        ${it.value ? `<div class="ed-card-meta" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${it.value}</div>` : ''}
        ${tags(i, it.tags)}${link(it.url)}
      </div>`).join('')}</div>`;
		}
		return { cs, ci, body };
	}).filter(Boolean) as Array<{ cs: NormalizedData['custom_sections'][number]; ci: number; body: string }>;

	const customHtml = customBodies.map(({ cs, ci, body }) => `<div class="container">
    <div class="reveal">
      <div class="eyebrow">Further Detail</div>
      <h2 class="ed-title" ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2>
    </div>
    <div class="reveal">${body}</div>
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>`).join('\n@@SPLIT@@');

	// ── ORDERED SECTIONS with alternating bands ───────────────────────────────
	const sectionMap: Record<string, { body: string; label: string }> = {
		experience: { body: experienceHtml, label: 'Experience' },
		hr_programs: { body: programsHtml, label: 'Initiatives' },
		skills: { body: skillsHtml, label: 'Skills' },
		software_proficiency: { body: softwareHtml, label: 'Tools' },
		compliance_expertise: { body: complianceHtml, label: 'Compliance' },
		achievements: { body: achievementsHtml, label: 'Achievements' },
		education: { body: educationHtml, label: 'Education' },
		certifications: { body: certsHtml, label: 'Certifications' }
	};
	const BANDS = ['bg-cream', 'bg-white', 'bg-blush', 'bg-ink'];
	let band = 0;
	const nextBand = () => BANDS[band++ % BANDS.length];

	const renderedKeys: Array<{ id: string; label: string }> = [];
	const orderedSections = order
		.filter((k) => !hidden.has(k) && (k === 'custom_sections' ? customBodies.length > 0 : !!sectionMap[k]?.body))
		.map((k) => {
			if (k === 'custom_sections') {
				return customBodies.map(({ cs, ci }, n) => {
					renderedKeys.push({ id: cs.section_id, label: cs.title });
					const bodyParts = customHtml.split('@@SPLIT@@');
					void ci;
					return `<section id="${cs.section_id}" class="${nextBand()}">${bodyParts[n]}</section>`;
				}).join('\n');
			}
			renderedKeys.push({ id: k, label: sectionMap[k].label });
			return `<section id="${k}" class="${nextBand()}">${sectionMap[k].body}</section>`;
		})
		.join('\n');

	// ── NAV + TOC ─────────────────────────────────────────────────────────────
	const tocKeys = [
		...((v.bio || v.uniqueValue || em) ? [{ id: 'about', label: 'Introduction' }] : []),
		...renderedKeys
	];
	const tocPills = tocKeys.map((t) => `<a class="toc-pill" href="#${t.id}">${t.label}</a>`).join('');
	const navItems = tocKeys.slice(0, 5).map((t) => `<a href="#${t.id}">${t.label}</a>`).join('');
	const expAnchor = tocKeys.find((t) => t.id === 'experience')?.id ?? tocKeys[0]?.id ?? 'about';

	const footerContacts = [
		v.email ? `<a href="mailto:${v.email}">${v.email}</a>` : '',
		v.phone ? `<span>${v.phone}</span>` : '',
		v.location ? `<span>${v.location}</span>` : '',
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Website</a>` : ''
	].filter(Boolean).join('');

	const RUNTIME = `<script>
(function(){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  document.querySelectorAll('#hero .reveal').forEach(function(el){ el.classList.add('visible'); });

  document.querySelectorAll('.gallery-item').forEach(function(box){
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
<title>${v.name} — ${v.profile_headline || 'HR Professional'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>

<nav>
  <div class="nav-logo">${logo}</div>
  <div class="nav-links">
    ${navItems}
    ${v.email ? `<a href="mailto:${v.email}" class="nav-cta">Hire Me</a>` : ''}
  </div>
</nav>

<div class="toc-strip"><div class="toc-scroll">${tocPills}</div></div>

<section id="hero">
  <div class="hero-rail"><div class="crosshair">+</div></div>
  <div class="hero-main">
    <div class="hero-copy reveal visible">
      <div class="hero-name" ${ed('profile.full_name')}>${firstLine}${lastLine ? `<br><em>${lastLine}</em>` : ''}</div>
      ${v.headline ? `<div class="hero-role" ${ed('portfolio.headline')}>${v.headline}</div>` : ''}
      ${v.profile_headline ? `<div class="hero-tag" ${ed('profile.headline')}>${v.profile_headline}</div>` : ''}
      ${v.bio ? `<p class="hero-desc" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
      <div class="hero-ctas">
        ${v.email ? `<a href="mailto:${v.email}" class="btn-solid">Get In Touch</a>` : ''}
        <a href="#${expAnchor}" class="btn-line">View Experience</a>
      </div>
    </div>
    <div class="hero-visual reveal visible">
      <div class="ribbon-shape"></div>
      <div class="hero-photo-main" ${_imgUpload('profile.profile_image', em)}>
        ${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : `<div class="placeholder-initials">${inits}</div>`}
      </div>
    </div>
  </div>
</section>

${introHtml}
${orderedSections}

<footer>
  <div class="container">
    <div class="footer-name">${v.name}</div>
    <div class="footer-sub">${v.profile_headline || 'HR Professional'}</div>
    ${footerContacts ? `<div class="footer-contact">${footerContacts}</div>` : ''}
    <div class="footer-copy">&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</div>
  </div>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
