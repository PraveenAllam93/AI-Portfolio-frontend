/**
 * Template: Verdant
 * Accountant theme — warm cream canvas lit by a fixed radial mesh and drifting
 * emerald/gold orbs, with deep-emerald bands for the timeline and footer.
 * Fraunces serif headings over IBM Plex Sans, IBM Plex Mono for figures and
 * section codes (§ 01…), a gilded hero photo panel with a watermark, ledger
 * line-item rows for skills, and glass side cards.
 * Palette: cream #F6F2E8, paper #FBF9F3, ink #16261F, emerald #1F4B3F,
 * emerald-dark #0F2E25, gold #B4823F, gold-light #E4C89A, slate #6C7268.
 * Fonts: Fraunces (display serif) · IBM Plex Sans (body) · IBM Plex Mono (figures).
 * Signature: drifting blurred orbs, fixed mesh gradient, scroll reveals,
 * sticky blur nav that darkens on scroll, ledger-row hover wash, card lifts.
 *
 * Ported from templates_add/accountant-3.html. The source's skills side-card
 * used hardcoded percentage bars — converted to editable tag chips (Z16), since
 * our model carries no proficiency value. Education is split into its own
 * <section> (Z14) while keeping the continuous dark band.
 */

import type { NormalizedData } from './base';
import {
	DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _rangeEditable,
	_imgUpload, EDITOR_SCRIPT, statShown
} from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';

const PHOTO_SVG =
	'<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.7"/><path d="M21 16l-5-5-5 5-3-3-5 5"/></svg>';

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
:root{
  --cream:#F6F2E8;
  --paper:#FBF9F3;
  --ink:#16261F;
  --emerald:#1F4B3F;
  --emerald-dark:#0F2E25;
  --gold:#B4823F;
  --gold-light:#E4C89A;
  --slate:#6C7268;
  --line: rgba(22,38,31,0.14);
  --white:#FFFFFF;
  --radius: 4px;
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  margin:0; color:var(--ink); font-family:'IBM Plex Sans', sans-serif;
  line-height:1.6; background:var(--cream); position:relative; overflow-x:hidden;
}
.mesh-bg{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(680px circle at 12% 8%, rgba(180,130,63,0.16), transparent 60%),
    radial-gradient(760px circle at 88% 4%, rgba(31,75,63,0.20), transparent 55%),
    radial-gradient(640px circle at 50% 55%, rgba(180,130,63,0.10), transparent 60%),
    radial-gradient(820px circle at 90% 92%, rgba(31,75,63,0.14), transparent 55%);
}
.orb{
  position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;z-index:0;
  animation:drift 22s ease-in-out infinite alternate;
}
.orb-emerald{background:radial-gradient(circle, rgba(31,75,63,0.5), transparent 70%);}
.orb-gold{background:radial-gradient(circle, rgba(180,130,63,0.45), transparent 70%);}
@keyframes drift{
  0%{transform:translate(0,0) scale(1);}
  100%{transform:translate(26px,-30px) scale(1.08);}
}
@media (prefers-reduced-motion: reduce){
  .orb{animation:none;}
  .reveal{opacity:1;transform:none;transition:none;}
}
section, header, .cta-band, footer{position:relative;}
section, .cta-band{overflow:hidden;}
section > .wrap, header .wrap, .cta-band .wrap{position:relative;z-index:1;}

.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1);}
.reveal.in-view{opacity:1;transform:translateY(0);}
h1,h2,h3,.display{font-family:'Fraunces', serif;color:var(--ink);margin:0;letter-spacing:-0.01em;}
.mono{font-family:'IBM Plex Mono', monospace;}
a{color:inherit;text-decoration:none;}
ul{list-style:none;margin:0;padding:0;}
.wrap{max-width:1160px;margin:0 auto;padding:0 40px;}
img{display:block;max-width:100%;}

/* ---------- NAV ---------- */
header{
  position:sticky;top:0;z-index:50;
  background:rgba(15,46,37,0.72);
  backdrop-filter:blur(14px) saturate(160%);
  -webkit-backdrop-filter:blur(14px) saturate(160%);
  border-bottom:1px solid rgba(255,255,255,0.08);
  transition:box-shadow .3s, background .3s;
}
header.scrolled{background:rgba(15,46,37,0.92);box-shadow:0 8px 30px -12px rgba(0,0,0,0.35);}
.nav{display:flex;align-items:center;justify-content:space-between;height:78px;gap:20px;}
.brand{display:flex;align-items:center;gap:12px;min-width:0;}
.brand-mark{width:34px;height:34px;position:relative;flex:none;}
.brand-mark span{position:absolute;display:block;border-radius:2px;}
.brand-mark .a{width:16px;height:34px;background:var(--gold);left:0;top:0;}
.brand-mark .b{width:16px;height:22px;background:var(--white);left:18px;top:12px;}
.brand-name{color:var(--white);font-family:'Fraunces',serif;font-size:19px;font-weight:600;}
.brand-sub{color:var(--gold-light);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;margin-top:1px;}
nav ul{display:flex;gap:34px;}
nav ul li a{color:rgba(255,255,255,0.72);font-size:14.5px;transition:color .15s;}
nav ul li a:hover{color:var(--white);}
.nav-cta{background:var(--gold);color:var(--emerald-dark);font-size:14px;font-weight:500;padding:11px 22px;border-radius:8px;border:1px solid var(--gold);white-space:nowrap;}
.nav-cta:hover{background:transparent;color:var(--gold);}
@media(max-width:880px){nav ul{display:none;}}

/* ---------- HERO ---------- */
.hero{padding:76px 0 60px;}
.hero-grid{display:grid;grid-template-columns:1.05fr 0.95fr;gap:64px;align-items:center;}
.eyebrow{
  display:inline-block;background:var(--white);border:1px solid var(--line);
  padding:8px 16px;font-size:13px;color:var(--emerald);font-weight:500;
  border-radius:24px;margin-bottom:22px;
}
.eyebrow .mono{color:var(--gold);margin-right:6px;}
.hero h1{font-size:52px;font-weight:600;line-height:1.05;}
.hero h1 em{font-style:normal;color:var(--emerald);border-bottom:3px solid var(--gold);}
.hero p.lead{color:var(--slate);font-size:16.5px;max-width:480px;margin:22px 0 30px;}
.hero-actions{display:flex;gap:14px;margin-bottom:44px;flex-wrap:wrap;}
.btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;font-size:14.5px;font-weight:500;border-radius:8px;border:1px solid transparent;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;}
.btn-primary{background:var(--emerald);color:var(--white);}
.btn-primary:hover{background:var(--emerald-dark);}
.btn-ghost{background:transparent;color:var(--ink);border-color:var(--line);}
.btn-ghost:hover{border-color:var(--ink);}

.stat-row{display:flex;gap:0;border-top:1px solid var(--line);padding-top:26px;flex-wrap:wrap;}
.stat{flex:1;padding-right:24px;min-width:120px;}
.stat .num{font-family:'IBM Plex Mono',monospace;font-size:28px;font-weight:500;color:var(--emerald);}
.stat .lbl{font-size:12.5px;color:var(--slate);margin-top:4px;}

.photo-panel{
  position:relative;aspect-ratio:4/5;border-radius:20px;overflow:hidden;
  box-shadow: 0 30px 60px -20px rgba(15,46,37,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset;
  background:
    radial-gradient(120% 90% at 15% 10%, rgba(228,200,154,0.28), transparent 55%),
    radial-gradient(100% 80% at 90% 100%, rgba(228,200,154,0.14), transparent 60%),
    linear-gradient(160deg, var(--emerald) 0%, var(--emerald-dark) 100%);
}
.photo-panel::before{
  content:"";position:absolute;inset:0;border-radius:20px;padding:1px;pointer-events:none;z-index:2;
  background:linear-gradient(160deg, rgba(228,200,154,0.55), transparent 40%, transparent 70%, rgba(228,200,154,0.25));
  -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;
}
.photo-watermark{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;
  font-family:'Fraunces',serif;font-weight:700;color:rgba(255,255,255,0.06);
  font-size:58px;line-height:0.95;text-align:center;letter-spacing:-0.01em;text-transform:uppercase;
  pointer-events:none;
}
.photo-slot{position:absolute;inset:0;}
.photo-slot img{width:100%;height:100%;object-fit:cover;}
.photo-empty{
  position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
  color:rgba(255,255,255,0.55);
}
.photo-empty svg{opacity:0.6;}
.photo-tag{
  position:absolute;top:18px;left:18px;background:var(--gold);color:var(--emerald-dark);
  font-family:'IBM Plex Mono',monospace;font-size:11.5px;padding:6px 11px;border-radius:6px;letter-spacing:0.04em;z-index:3;
}

section{padding:70px 0;}
.section-head{display:flex;align-items:baseline;gap:16px;margin-bottom:42px;}
.section-head .code{font-family:'IBM Plex Mono',monospace;color:var(--gold);font-size:14px;flex:none;}
.section-head h2{font-size:32px;font-weight:600;}
.section-head p{color:var(--slate);font-size:14.5px;margin:6px 0 0;}
.divider{border:none;border-top:1px solid var(--line);}

/* ---------- ABOUT ---------- */
.about{background:var(--paper);}
.about-grid{display:grid;grid-template-columns:280px 1fr;gap:56px;align-items:start;}
.about-photo{position:relative;aspect-ratio:1/1;border-radius:14px;overflow:hidden;background:var(--emerald-dark);}
.about-photo img{width:100%;height:100%;object-fit:cover;}
.about-body p{color:var(--slate);font-size:15px;margin:0 0 16px;max-width:600px;}
.badges{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px;}
.badge{
  border:1px solid var(--line);background:var(--white);padding:8px 14px;font-size:13px;
  border-radius:20px;color:var(--emerald-dark);font-family:'IBM Plex Mono',monospace;
  transition:transform .2s, box-shadow .2s, border-color .2s;
}
.badge:hover{transform:translateY(-2px);border-color:var(--gold);box-shadow:0 10px 20px -12px rgba(180,130,63,0.4);}

/* ---------- LEDGER ROWS (skills) ---------- */
.ledger{border-top:1px solid var(--line);}
.ledger-row{
  display:grid;grid-template-columns:64px 1fr 260px;gap:24px;padding:26px 22px;margin:0 -22px;
  border-bottom:1px solid var(--line);align-items:start;transition:background .15s;border-radius:2px;position:relative;
}
.ledger-row:hover{background:rgba(180,130,63,0.06);}
.ledger-row .code{font-family:'IBM Plex Mono',monospace;color:var(--gold);font-size:15px;padding-top:2px;}
.ledger-row h3{font-size:19px;font-weight:600;margin-bottom:10px;}
.ledger-row .tag{color:var(--slate);font-family:'IBM Plex Mono',monospace;font-size:12.5px;text-align:right;padding-top:4px;}
.chip-row{display:flex;flex-wrap:wrap;gap:8px;}
.chip{
  font-size:12.5px;font-family:'IBM Plex Mono',monospace;color:var(--slate);
  border:1px solid var(--line);background:var(--white);padding:5px 11px;border-radius:20px;
}
.chip-panel{border:1px solid var(--line);background:var(--paper);border-radius:14px;padding:28px;}

/* ---------- CASE STUDIES (engagements) ---------- */
.proj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;}
.proj-card{background:var(--white);border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:transform .25s ease, box-shadow .25s ease;position:relative;}
.proj-card:hover{transform:translateY(-6px);box-shadow:0 24px 40px -20px rgba(15,46,37,0.28);}
.proj-media{position:relative;aspect-ratio:16/10;background:var(--emerald-dark);overflow:hidden;}
.proj-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s;}
.proj-media img.active{opacity:1;}
.proj-empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:rgba(255,255,255,0.5);}
.shots-dots{position:absolute;bottom:10px;left:0;right:0;display:flex;gap:5px;justify-content:center;z-index:2;}
.shots-dots i{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.6);}
.shots-dots i.on{background:var(--gold);}
.proj-body{padding:22px 24px 26px;}
.proj-meta{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;gap:12px;}
.proj-figure{font-family:'IBM Plex Mono',monospace;color:var(--emerald);font-size:20px;font-weight:500;}
.proj-date{font-family:'IBM Plex Mono',monospace;color:var(--slate);font-size:12.5px;}
.proj-body h3{font-size:18px;font-weight:600;margin-bottom:8px;}
.proj-body p{color:var(--slate);font-size:13.8px;margin:0;}
.proj-kicker{font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:6px;}
.proj-list{margin-top:14px;display:flex;flex-direction:column;gap:6px;}
.proj-list li{font-size:13.5px;color:var(--slate);line-height:1.55;padding-left:15px;position:relative;}
.proj-list li::before{content:"";position:absolute;left:0;top:.55em;width:5px;height:5px;border-radius:50%;background:var(--gold);}
.proj-mini{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-top:16px;}
.proj-tags{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
.proj-tags span{font-size:11.5px;font-family:'IBM Plex Mono',monospace;color:var(--slate);border:1px solid var(--line);padding:4px 8px;border-radius:2px;}

/* ---------- DARK BANDS (experience / skills side / education) ---------- */
.exp{background:var(--emerald-dark);color:var(--white);}
.exp .section-head h2, .exp .code{color:var(--white);}
.exp .section-head p{color:rgba(255,255,255,0.55);}
.exp-band-mid{padding-top:0;}
.exp .chip{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.16);color:rgba(255,255,255,0.82);}
.exp .badge{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.16);color:var(--gold-light);}
.exp .badge:hover{border-color:var(--gold);}

.timeline{position:relative;padding-left:28px;}
.timeline::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:1px;background:rgba(255,255,255,0.16);}
.tl-item{position:relative;padding-bottom:36px;}
.tl-item:last-child{padding-bottom:0;}
.tl-item::before{
  content:"";position:absolute;left:-28px;top:5px;width:11px;height:11px;border-radius:50%;
  background:var(--emerald-dark);border:2px solid var(--gold);
}
.tl-head{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:6px;}
.tl-role{font-family:'Fraunces',serif;font-size:19px;font-weight:600;color:var(--white);}
.tl-date{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--gold-light);white-space:nowrap;}
.tl-org{font-size:13.5px;color:var(--gold-light);margin-bottom:10px;}
.tl-desc{font-size:14px;color:rgba(255,255,255,0.62);margin-bottom:8px;}
.tl-item ul{padding-left:18px;color:rgba(255,255,255,0.68);font-size:14px;list-style:disc;}
.tl-item li{margin-bottom:5px;}
.tl-shots{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:10px;margin-top:14px;background:rgba(255,255,255,0.06);}
.tl-shots img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s;}
.tl-shots img.active{opacity:1;}

.side-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;}
.side-card{background:rgba(255,255,255,0.06);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:24px 24px 26px;position:relative;}
.side-card h3{font-family:'IBM Plex Mono',monospace;font-size:12.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-light);font-weight:500;margin-bottom:18px;}
.edu-item{padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.1);position:relative;}
.edu-item:last-child{border-bottom:none;padding-bottom:0;}
.edu-item .deg{font-size:14.5px;font-weight:500;color:var(--white);margin-bottom:3px;}
.edu-item .sch{font-size:12.5px;color:rgba(255,255,255,0.6);}
.edu-item .yr{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--gold-light);margin-top:4px;}
.edu-item .lnk{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--gold);margin-top:6px;display:inline-block;}
.edu-item .lnk:hover{text-decoration:underline;}

/* ---------- CUSTOM SECTIONS ---------- */
.cs-timeline{position:relative;padding-left:28px;}
.cs-timeline::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:1px;background:var(--line);}
.cs-tl-item{position:relative;padding-bottom:30px;}
.cs-tl-item:last-child{padding-bottom:0;}
.cs-tl-item::before{content:"";position:absolute;left:-28px;top:5px;width:11px;height:11px;border-radius:50%;background:var(--cream);border:2px solid var(--gold);}
.cs-list{display:flex;flex-direction:column;gap:12px;}
.cs-item{background:var(--white);border:1px solid var(--line);border-radius:12px;padding:18px 22px;position:relative;transition:border-color .2s, transform .2s;}
.cs-item:hover{border-color:var(--gold);transform:translateY(-2px);}
.cs-sub{font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);}
.cs-label{font-family:'Fraunces',serif;font-size:17px;font-weight:600;margin:5px 0 6px;}
.cs-value{color:var(--slate);font-size:14px;}
.cs-link{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--gold);margin-top:8px;display:inline-block;}

/* ---------- CONTACT / FOOTER ---------- */
.cta-band{background:var(--gold);}
.cta-inner{display:flex;align-items:center;justify-content:space-between;padding:52px 0 36px;gap:24px;flex-wrap:wrap;}
.cta-inner h2{font-size:28px;color:var(--emerald-dark);}
.cta-inner p{color:rgba(15,46,37,0.75);margin-top:8px;font-size:14.5px;}
.cta-inner .btn-primary{background:var(--emerald-dark);}
.contact-info{
  display:grid;grid-template-columns:repeat(4,1fr);gap:0;
  border-top:1px solid rgba(15,46,37,0.18);padding:26px 0 40px;
}
.contact-item{padding-right:24px;border-right:1px solid rgba(15,46,37,0.18);}
.contact-item:last-child{border-right:none;}
.contact-lbl{
  display:block;font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:0.1em;
  text-transform:uppercase;color:rgba(15,46,37,0.6);margin-bottom:8px;
}
.contact-val{display:block;font-size:15px;font-weight:500;color:var(--emerald-dark);word-break:break-word;}
a.contact-val:hover{text-decoration:underline;}

footer{background:var(--emerald-dark);color:rgba(255,255,255,0.6);padding:44px 0 30px;font-size:13.5px;}
.foot-grid{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
.foot-links{display:flex;gap:22px;flex-wrap:wrap;}
.foot-links a:hover{color:var(--white);}

[data-item-wrap]{position:relative;}
.ce-add-btn{margin-top:24px;}

@media(max-width:900px){
  .contact-info{grid-template-columns:1fr 1fr;row-gap:20px;}
  .contact-item{border-right:none;padding-right:0;}
  .hero-grid{grid-template-columns:1fr;}
  .about-grid{grid-template-columns:1fr;}
  .proj-grid{grid-template-columns:1fr;}
  .ledger-row{grid-template-columns:40px 1fr;}
  .ledger-row .tag{display:none;}
  .hero h1{font-size:38px;}
  .wrap{padding:0 22px;}
  .cta-inner{flex-direction:column;text-align:center;align-items:flex-start;}
  .section-head{flex-wrap:wrap;}
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

	// Section code numbers (§ 01, § 02 …) assigned in render order.
	let codeN = 0;
	const code = () => `§ ${String(++codeN).padStart(2, '0')}`;

	const shots = (images: string[], path: string, cls: string, label: string, empty: string): string => {
		if (!images.length && !em) return '';
		const imgs = images.map((src, k) => `<img src="${src}" alt="" class="${k === 0 ? 'active' : ''}">`).join('');
		const dots = images.length > 1
			? `<div class="shots-dots">${images.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>`
			: '';
		const ph = !images.length ? `<div class="proj-empty">${PHOTO_SVG}<span style="font-size:12px;">${empty}</span></div>` : '';
		return `<div class="${cls}" ${_imgUpload(path, em, label)}>${imgs}${ph}${dots}</div>`;
	};

	// ── HERO ──────────────────────────────────────────────────────────────────
	const heroStats = [
		statShown(v, 'clients_count', clients)
			? `<div class="stat"><div class="num mono"><span ${ted('clients_count')}>${clients}</span>+</div><div class="lbl">Engagements delivered</div></div>` : '',
		statShown(v, 'certifications_count', certCount)
			? `<div class="stat"><div class="num mono"><span ${ted('certifications_count')}>${certCount}</span></div><div class="lbl">Credentials held</div></div>` : '',
		statShown(v, 'years_experience', years)
			? `<div class="stat"><div class="num mono"><span ${ted('years_experience')}>${years}</span>+</div><div class="lbl">Years experience</div></div>` : ''
	].filter(Boolean).join('');

	const heroPhoto = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}">`
		: `<div class="photo-empty">${PHOTO_SVG}<span style="font-size:13px;">${em ? 'Add your photo' : inits}</span></div>`;

	const heroCode = code();

	// ── ABOUT ─────────────────────────────────────────────────────────────────
	const aboutPhoto = v.summary_image
		? `<img src="${v.summary_image}" alt="${v.name}">`
		: `<div class="photo-empty">${PHOTO_SVG}</div>`;
	const badges = v.core_expertise.length
		? `<div class="badges" ${le('core_expertise')}>${v.core_expertise.map((t) => `<span class="badge">${t}</span>`).join('')}</div>`
		: em
			? `<div class="badges" ${le('core_expertise')}><span class="badge">Add core expertise</span></div>`
			: '';
	const aboutHtml = (v.bio || v.uniqueValue || v.summary_image || em)
		? `<section class="about" id="about">
  <div class="orb orb-gold" style="width:340px;height:340px;top:-120px;left:-100px;"></div>
  <div class="wrap about-grid">
    <div class="about-photo" ${_imgUpload('profile.summary_image', em, 'Upload image')}>${aboutPhoto}</div>
    <div class="about-body">
      <div class="section-head reveal" style="margin-bottom:20px;">
        <span class="code mono">${code()}</span>
        <h2>About me</h2>
      </div>
      ${v.bio ? `<p class="reveal" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
      ${v.uniqueValue ? `<p class="reveal" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p>` : ''}
      <div class="reveal">${badges}</div>
    </div>
  </div>
</section>` : '';

	// ── EXPERIENCE (dark band) ────────────────────────────────────────────────
	const experienceHtml = (v.experience?.length || em)
		? `<section class="exp" id="experience">
  <div class="orb orb-gold" style="width:380px;height:380px;top:-140px;right:-120px;opacity:0.7;"></div>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div>
        <h2>Experience</h2>
        <p>Where I've worked and what I brought to each desk</p>
      </div>
    </div>
    <div class="timeline reveal">
${v.experience.map((exp, i) => {
			const period = _rangeEditable(`experience.${i}.start_date`, exp.start_date, `experience.${i}.end_date`, exp.end_date, em, ' — ');
			return `      <div class="tl-item"${iw}>
        ${delBtn('experience', i)}
        <div class="tl-head">
          <span class="tl-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</span>
          ${period ? `<span class="tl-date mono">${period}</span>` : ''}
        </div>
        ${exp.company ? `<div class="tl-org"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
        ${exp.description ? `<div class="tl-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
        ${exp.key_points?.length ? `<ul ${le(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
        ${shots(exp.images ?? [], `experience.${i}.images`, 'tl-shots', 'Upload image', 'Add image')}
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('experience', 'Experience')}
  </div>
</section>` : '';

	// ── SKILLS (ledger rows) ──────────────────────────────────────────────────
	const skillsHtml = (v.skill_groups?.length || em)
		? `<section id="skills">
  <div class="orb orb-emerald" style="width:320px;height:320px;bottom:-140px;left:-90px;"></div>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div>
        <h2>Services &amp; skills</h2>
        <p>What I handle, in the order a portfolio actually needs it</p>
      </div>
    </div>
    <div class="ledger reveal">
${v.skill_groups.map((g, gi) => `      <div class="ledger-row"${iw}>
        ${delBtn('skills', gi)}
        <div class="code mono">${1010 + gi * 10}</div>
        <div>
          <h3 ${ed(`skills.${gi}.category`)}>${g.category}</h3>
          <div class="chip-row" ${le(`skills.${gi}.skills`)}>${g.skills.map((s) => `<span class="chip">${s}</span>`).join('')}</div>
        </div>
        <div class="tag">${g.skills.length} ${g.skills.length === 1 ? 'area' : 'areas'}</div>
      </div>`).join('\n')}
    </div>
    ${addBtn('skills', 'Skill Group')}
  </div>
</section>` : '';

	// ── ENGAGEMENTS (case studies) ────────────────────────────────────────────
	const engagementsHtml = (v.engagements?.length || em)
		? `<section class="about" id="engagements">
  <div class="orb orb-gold" style="width:300px;height:300px;top:-100px;right:-80px;"></div>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div>
        <h2>Case studies</h2>
        <p>Selected portfolios, audits and engagements</p>
      </div>
    </div>
    <div class="proj-grid reveal">
${v.engagements.map((en, i) => {
			const period = _rangeEditable(`engagements.${i}.start_date`, en.start_date, `engagements.${i}.end_date`, en.end_date, em, ' — ');
			return `      <div class="proj-card"${iw}>
        ${delBtn('engagements', i)}
        ${shots(en.images ?? [], `engagements.${i}.images`, 'proj-media', 'Upload image', 'Add engagement image')}
        <div class="proj-body">
          <div class="proj-meta">
            ${en.engagement_value ? `<span class="proj-figure mono" ${ed(`engagements.${i}.engagement_value`)}>${en.engagement_value}</span>` : '<span></span>'}
            ${period ? `<span class="proj-date mono">${period}</span>` : ''}
          </div>
          ${en.engagement_type ? `<div class="proj-kicker" ${ed(`engagements.${i}.engagement_type`)}>${en.engagement_type}</div>` : ''}
          <h3 ${ed(`engagements.${i}.client_name`)}>${en.client_name || (em ? 'Client' : '')}</h3>
          ${en.industry ? `<div class="proj-date mono" style="margin-bottom:6px" ${ed(`engagements.${i}.industry`)}>${en.industry}</div>` : ''}
          ${en.description ? `<p ${ed(`engagements.${i}.description`, true)}>${en.description}</p>` : ''}
          ${en.responsibilities?.length ? `<div class="proj-mini">Responsibilities</div><ul class="proj-list" ${le(`engagements.${i}.responsibilities`)}>${en.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
          ${en.deliverables?.length ? `<div class="proj-mini">Deliverables</div><ul class="proj-list" ${le(`engagements.${i}.deliverables`)}>${en.deliverables.map((d) => `<li>${d}</li>`).join('')}</ul>` : ''}
          ${en.measurable_outcomes?.length ? `<div class="proj-mini">Outcomes</div><ul class="proj-list" ${le(`engagements.${i}.measurable_outcomes`)}>${en.measurable_outcomes.map((o) => `<li>${o}</li>`).join('')}</ul>` : ''}
          ${en.standards_applied?.length ? `<div class="proj-tags" ${le(`engagements.${i}.standards_applied`)}>${en.standards_applied.map((s) => `<span>${s}</span>`).join('')}</div>` : ''}
          ${en.tools_used?.length ? `<div class="proj-tags" ${le(`engagements.${i}.tools_used`)}>${en.tools_used.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}
        </div>
      </div>`;
		}).join('\n')}
    </div>
    ${addBtn('engagements', 'Engagement')}
  </div>
</section>` : '';

	// ── SOFTWARE / COMPLIANCE ─────────────────────────────────────────────────
	const softwareHtml = v.software_proficiency?.length
		? `<section id="software_proficiency">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div><h2>Systems &amp; software</h2><p>The stack the books actually live in</p></div>
    </div>
    <div class="chip-panel reveal">
      <div class="chip-row" ${le('software_proficiency')}>${v.software_proficiency.map((s) => `<span class="badge">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>` : '';

	const complianceHtml = v.compliance_expertise?.length
		? `<section class="about" id="compliance_expertise">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div><h2>Standards &amp; compliance</h2><p>The frameworks every number here is reported under</p></div>
    </div>
    <div class="chip-panel reveal" style="background:var(--white)">
      <div class="chip-row" ${le('compliance_expertise')}>${v.compliance_expertise.map((s) => `<span class="badge">${s}</span>`).join('')}</div>
    </div>
  </div>
</section>` : '';

	// ── EDUCATION (dark band, own section per Z14) ────────────────────────────
	const educationHtml = (v.education?.length || em)
		? `<section class="exp" id="education">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div><h2>Education</h2><p>How I trained for it</p></div>
    </div>
    <div class="side-grid reveal">
      <div class="side-card">
        <h3>Academic</h3>
${v.education.map((edu, i) => {
			const yr = _rangeEditable(`education.${i}.start_year`, edu.start_year, `education.${i}.end_year`, edu.end_year, em, '–');
			return `        <div class="edu-item"${iw}>
          ${delBtn('education', i)}
          <div class="deg">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ', ')}</div>
          <div class="sch">${edu.institution ? `<span ${ed(`education.${i}.institution`)}>${edu.institution}</span>` : ''}${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>
          ${yr ? `<div class="yr mono">${yr}</div>` : ''}
          ${edu.grade_or_score ? `<div class="yr mono" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
        </div>`;
		}).join('\n')}
      </div>
    </div>
    ${addBtn('education', 'Education')}
  </div>
</section>` : '';

	// ── CERTIFICATIONS (dark band) ────────────────────────────────────────────
	const certsHtml = (v.certifications?.length || em)
		? `<section class="exp exp-band-mid" id="certifications">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div><h2>Certifications</h2><p>Licences and professional credentials</p></div>
    </div>
    <div class="side-grid reveal">
      <div class="side-card">
        <h3>Credentials</h3>
${v.certifications.map((c, i) => `        <div class="edu-item"${iw}>
          ${delBtn('certifications', i)}
          <div class="deg" ${ed(`certifications.${i}.name`)}>${c.name}</div>
          ${c.issuer ? `<div class="sch" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
          ${c.year ? `<div class="yr mono" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
          ${c.url ? `<a class="lnk" href="${c.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
        </div>`).join('\n')}
      </div>
    </div>
    ${addBtn('certifications', 'Certification')}
  </div>
</section>` : '';

	// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
	const achievementsHtml = (v.achievements?.length || em)
		? `<section id="achievements">
  <div class="orb orb-emerald" style="width:280px;height:280px;top:-90px;right:-70px;opacity:.6;"></div>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div><h2>Achievements</h2><p>Milestones worth the ledger entry</p></div>
    </div>
    <div class="cs-list reveal">
${v.achievements.map((a, i) => `      <div class="cs-item"${iw}>
        ${delBtn('achievements', i)}
        ${a.year ? `<div class="cs-sub" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
        <div class="cs-label" ${ed(`achievements.${i}.title`)}>${a.title}</div>
        ${a.description ? `<div class="cs-value" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
        ${a.url ? `<a class="cs-link" href="${a.url}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
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
			? `<div class="proj-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${t.map((x) => `<span>${x}</span>`).join('')}</div>` : '';
		const link = (u: string) => u ? `<a class="cs-link" href="${u}" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : '';

		let body: string;
		if (cs.display_type === 'timeline') {
			body = `<div class="cs-timeline">${items.map((it, i) => `<div class="cs-tl-item"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else if (cs.display_type === 'list') {
			body = `<div class="cs-list">${items.map((it, i) => `<div class="cs-item"${iw}>${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div>`).join('')}</div>`;
		} else {
			body = `<div class="proj-grid">${items.map((it, i) => `<div class="proj-card"${iw}><div class="proj-body">${delBtn(`custom_sections.${ci}`, i)}${sub(i, it.subtitle)}${label(i, it.label)}${value(i, it.value)}${tags(i, it.tags)}${link(it.url)}</div></div>`).join('')}</div>`;
		}
		return `<section id="${cs.section_id}">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="code mono">${code()}</span>
      <div><h2 ${ed(`custom_sections.${ci}.title`)}>${cs.title}</h2></div>
    </div>
    <div class="reveal">${body}</div>
    ${addBtn(`custom_sections.${ci}.items`, 'Item')}
  </div>
</section>`;
	}).filter(Boolean).join('\n');

	const sectionMap: Record<string, string> = {
		experience: experienceHtml,
		skills: skillsHtml,
		engagements: engagementsHtml,
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
		about: 'About', experience: 'Experience', skills: 'Services', engagements: 'Case studies',
		software_proficiency: 'Systems', compliance_expertise: 'Compliance',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements'
	};
	const navKeys: string[] = ['home'];
	if (v.bio || v.uniqueValue) navKeys.push('about');
	for (const key of order) {
		if (hidden.has(key) || !(key in sectionMap) || !sectionMap[key]) continue;
		if (key === 'custom_sections') continue;
		navKeys.push(key);
	}
	const navItems = navKeys.slice(0, 6)
		.map((k) => `<li><a href="#${k}">${k === 'home' ? 'Home' : NAV_LABELS[k] ?? k}</a></li>`).join('');
	const workAnchor = navKeys.includes('engagements') ? 'engagements' : navKeys.includes('experience') ? 'experience' : 'contact';

	// ── CONTACT ───────────────────────────────────────────────────────────────
	const contactCells = [
		v.email ? `<div class="contact-item"><span class="contact-lbl">Email</span><a href="mailto:${v.email}" class="contact-val" ${ed('profile.email')}>${v.email}</a></div>` : '',
		v.phone ? `<div class="contact-item"><span class="contact-lbl">Phone</span><span class="contact-val" ${ed('profile.phone')}>${v.phone}</span></div>` : '',
		v.location ? `<div class="contact-item"><span class="contact-lbl">Location</span><span class="contact-val" ${ed('profile.location')}>${v.location}</span></div>` : '',
		v.linkedin_url ? `<div class="contact-item"><span class="contact-lbl">LinkedIn</span><a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer" class="contact-val">Connect &#8599;</a></div>`
			: v.portfolio_url ? `<div class="contact-item"><span class="contact-lbl">Website</span><a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer" class="contact-val">Visit &#8599;</a></div>` : ''
	].filter(Boolean).join('');

	const footLinks = [
		v.email ? `<a href="mailto:${v.email}">${v.email}</a>` : '',
		v.linkedin_url ? `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Website</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">X</a>` : ''
	].filter(Boolean).join('');

	const RUNTIME = `<script>
(function(){
  var siteHeader=document.querySelector('header');
  if(siteHeader){
    window.addEventListener('scroll',function(){
      siteHeader.classList.toggle('scrolled', window.scrollY > 12);
    },{passive:true});
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target);}
    });
  },{threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  document.querySelectorAll('.proj-media, .tl-shots').forEach(function(box){
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
<title>${v.name} — ${v.profile_headline || 'Accountant'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div class="mesh-bg"></div>

<header>
  <div class="wrap nav">
    <div class="brand">
      <div class="brand-mark"><span class="a"></span><span class="b"></span></div>
      <div>
        <div class="brand-name" ${ed('profile.full_name')}>${v.name}</div>
        ${v.profile_headline ? `<div class="brand-sub" ${ed('profile.headline')}>${v.profile_headline}</div>` : ''}
      </div>
    </div>
    <nav><ul>${navItems}</ul></nav>
    <a href="#contact" class="nav-cta">Book a consult</a>
  </div>
</header>

<section class="hero" id="home">
  <div class="wrap hero-grid reveal in-view">
    <div>
      <div class="eyebrow"><span class="mono">${heroCode}</span>${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Accountant'}</div>
      <h1 ${ed('portfolio.headline')}>${v.headline || v.name}</h1>
      ${v.bio ? `<p class="lead" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
      <div class="hero-actions">
        ${v.email ? `<a class="btn btn-primary" href="mailto:${v.email}">Hire me</a>` : ''}
        <a class="btn btn-ghost" href="#${workAnchor}">View case studies</a>
      </div>
      ${heroStats ? `<div class="stat-row">${heroStats}</div>` : ''}
    </div>

    <div class="photo-panel">
      <div class="photo-watermark">${v.name.split(/\s+/).join('<br>')}</div>
      <div class="photo-slot" ${_imgUpload('profile.profile_image', em)}>${heroPhoto}</div>
      <span class="photo-tag mono">IMG / 01</span>
    </div>
  </div>
</section>

${aboutHtml}
${orderedSections}

<div class="cta-band" id="contact">
  <div class="wrap">
    <div class="cta-inner">
      <div>
        <h2>Let's balance the books, properly.</h2>
        <p ${ed('profile.contact_tagline', true)}>${v.contact_tagline || 'Available for accounting engagements, statutory reporting, and reconciliation clean-up projects.'}</p>
      </div>
      ${v.email ? `<a href="mailto:${v.email}" class="btn btn-primary">Get in touch</a>` : ''}
    </div>
    ${contactCells ? `<div class="contact-info">${contactCells}</div>` : ''}
  </div>
</div>

<footer>
  <div class="wrap foot-grid">
    <div>&copy; ${new Date().getFullYear()} ${v.name}${v.profile_headline ? ` — ${v.profile_headline}` : ''}</div>
    ${footLinks ? `<div class="foot-links">${footLinks}</div>` : ''}
  </div>
</footer>
${RUNTIME}
${EDITOR_SCRIPT}
</body>
</html>`;
}
