/**
 * Template: Momentum
 * Marketing theme — clean editorial light portfolio. White canvas, ink text,
 * hot-orange accent (#ff4d00), rounded cards. Bricolage Grotesque display +
 * Inter body. Signature: hero stat grid, infinite brand/skill marquee,
 * case-style campaign cards with gradient cover art, experience rows, dark
 * rounded contact band, scroll reveals.
 * Faithful port of marketing-01.html, mapped to our marketing data model
 * (work→campaigns, tool chips→skills; no foreign projects section — `projects`
 * is not a marketing section in SECTION_CATEGORIES).
 *
 * Clicking a work card opens a full case-study view for that campaign. Unlike the
 * source HTML — which built the case page in JS from a hardcoded CASES object —
 * every case view here is SERVER-RENDERED and merely toggled by class, so all of
 * its fields keep normal data-paths (inline-editable) and survive the editor's
 * iframe repaints. Case-study copy lives on new campaign fields: `challenge`,
 * `approach[]`, and `images[]` (the gallery).
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap';

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

const ART = ['art-osn', 'art-croda', 'art-gautam', 'art-crm', 'art-frag'];

function css(): string {
	return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --bg:#fff;--bg-soft:#f6f6f4;--ink:#0e0e0e;--gray:#5b5b57;--gray-lt:#9a9a94;
  --line:#e8e8e4;--accent:#ff4d00;--dark:#111110;
  --ff-d:'Bricolage Grotesque',system-ui,sans-serif;--ff-b:'Inter',system-ui,sans-serif;
  --ease:cubic-bezier(0.2,0.8,0.25,1);
}
body{font-family:var(--ff-b);background:var(--bg);color:var(--ink);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.wrap{max-width:1200px;margin:0 auto;padding:0 28px}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}
button{font-family:inherit}
.rv{opacity:0;transform:translateY(20px);transition:opacity .65s var(--ease),transform .65s var(--ease)}
.rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}*{animation:none!important}}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.nav-in{max-width:1200px;margin:0 auto;padding:0 28px;height:64px;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:var(--ff-d);font-weight:700;font-size:17px;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;color:var(--ink)}
.avail{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:500;color:var(--gray);border:1px solid var(--line);border-radius:100px;padding:5px 13px}
.avail i{width:7px;height:7px;border-radius:50%;background:#1db954;animation:pulse 2s ease infinite;font-style:normal}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.nav-links{display:flex;gap:26px;align-items:center;list-style:none}
.nav-links a{font-size:13.5px;font-weight:500;color:var(--gray);transition:color .2s}
.nav-links a:hover{color:var(--ink)}
.nav-btn{background:var(--ink);color:#fff!important;padding:9px 18px;border-radius:10px}
.nav-btn:hover{background:var(--accent)!important}

/* HERO */
#hero{padding:158px 0 64px}
.kicker{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:22px}
.hero-h{font-family:var(--ff-d);font-size:clamp(42px,7vw,92px);font-weight:700;line-height:.98;letter-spacing:-.035em;max-width:14ch;margin-bottom:28px}
.hero-h .o{color:var(--accent)}
.hero-sub{font-size:18px;color:var(--gray);max-width:56ch;line-height:1.7;margin-bottom:38px}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;border:none;transition:all .25s var(--ease)}
.btn-dark{background:var(--ink);color:#fff}
.btn-dark:hover{background:var(--accent);transform:translateY(-2px)}
.btn-line{border:1.5px solid var(--line);color:var(--ink);background:transparent}
.btn-line:hover{border-color:var(--ink)}
.stats{display:grid;border:1px solid var(--line);border-radius:18px;margin-top:60px;overflow:hidden}
.stat{padding:26px 28px;border-right:1px solid var(--line);background:#fff}
.stat:last-child{border-right:none}
.stat-n{font-family:var(--ff-d);font-size:34px;font-weight:700;letter-spacing:-.02em;line-height:1}
.stat-l{font-size:12.5px;color:var(--gray-lt);margin-top:8px;line-height:1.5}

/* MARQUEE */
#brands{padding:54px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:74px;overflow:hidden}
.brands-label{text-align:center;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gray-lt);margin-bottom:30px}
.marquee{display:flex;overflow:hidden;user-select:none;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.marquee-track{display:flex;flex-shrink:0;gap:58px;padding-right:58px;align-items:center;animation:scroll 32s linear infinite}
@keyframes scroll{to{transform:translateX(-100%)}}
.brand{font-family:var(--ff-d);font-size:21px;font-weight:600;letter-spacing:-.01em;color:#b9b9b2;white-space:nowrap;transition:color .3s}
.brand:hover{color:var(--ink)}

/* SECTIONS */
.sec{padding:96px 0}
.sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:48px}
.sec-h{font-family:var(--ff-d);font-size:clamp(32px,4.4vw,54px);font-weight:700;letter-spacing:-.03em;line-height:1.02}
.sec-sub{font-size:14px;color:var(--gray-lt);max-width:34ch;text-align:right;line-height:1.55}

/* WORK / CAMPAIGNS */
.work-list{display:flex;flex-direction:column;gap:26px}
.case{display:grid;grid-template-columns:1.05fr 1fr;border:1px solid var(--line);border-radius:22px;overflow:hidden;cursor:pointer;background:#fff;transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.case:hover{transform:translateY(-4px);box-shadow:0 30px 70px -30px rgba(14,14,14,.25)}
.case:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.case:nth-child(even){grid-template-columns:1fr 1.05fr}
.case:nth-child(even) .case-cover{order:2}
.case-cover{position:relative;min-height:340px;padding:30px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden}
.case-cover .art{position:absolute;inset:0;transition:transform .7s var(--ease)}
.case:hover .art{transform:scale(1.04)}
.ct{position:relative;z-index:2;font-size:11.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;opacity:.85}
.cs{position:relative;z-index:2}
.cs .n{font-family:var(--ff-d);font-size:clamp(52px,6vw,84px);font-weight:800;letter-spacing:-.035em;line-height:.95;display:block}
.cs .l{font-size:13px;font-weight:500;opacity:.85;margin-top:10px;display:block;max-width:30ch}
.tw{color:#fff}.tk{color:#4a3113}
.case-info{padding:38px 40px;display:flex;flex-direction:column}
.ci-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.pill{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border-radius:100px;background:var(--bg-soft);color:var(--gray)}
.pill.hot{background:#ffede5;color:var(--accent)}
.ci-title{font-family:var(--ff-d);font-size:clamp(23px,2.4vw,30px);font-weight:700;letter-spacing:-.02em;line-height:1.12;margin-bottom:14px}
/* Card body: description (the case "challenge"), a horizontal metric row, and the
   read-case-study affordance. The clamp is visual only — the full text stays in the
   DOM so inline editing never truncates the stored value — and lifts on focus. */
.ci-desc{font-size:14.5px;color:var(--gray);line-height:1.7;margin-bottom:22px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.ci-desc:focus{-webkit-line-clamp:unset;overflow:visible}
.ci-metrics{display:flex;gap:26px;flex-wrap:wrap;margin-bottom:26px}
/* Transparent to layout so the editable-list region does not break the flex row. */
.ci-metrics-list{display:contents}
.cim .v{font-family:var(--ff-d);font-size:22px;font-weight:700;letter-spacing:-.02em}
.cim .k{font-size:11.5px;color:var(--gray-lt);margin-top:2px}
.ci-link{margin-top:auto;display:inline-flex;align-items:center;gap:10px;font-size:14px;font-weight:600;color:var(--ink)}
.ci-link .arr{width:36px;height:36px;border-radius:50%;background:var(--bg-soft);display:flex;align-items:center;justify-content:center;transition:all .3s}
.case:hover .ci-link .arr{background:var(--accent);color:#fff;transform:translateX(4px)}

/* COVER ART */
.art-osn{background:#0b1030}
.art-osn::before{content:'';position:absolute;left:-10%;top:-30%;width:70%;height:160%;background:radial-gradient(ellipse at center,rgba(64,87,255,.35),transparent 65%)}
.art-osn::after{content:'';position:absolute;right:8%;bottom:12%;width:120px;height:120px;border:2px solid rgba(120,140,255,.35);border-radius:50%}
.art-croda{background:#0d3b2e}
.art-croda::before{content:'';position:absolute;inset:0;background:linear-gradient(rgba(190,255,170,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(190,255,170,.09) 1px,transparent 1px);background-size:44px 44px}
.art-croda::after{content:'';position:absolute;right:-40px;top:-40px;width:220px;height:220px;background:#beff6c;border-radius:50%;opacity:.16}
.art-gautam{background:#f5e9d4}
.art-gautam::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-45deg,transparent 0 26px,rgba(122,84,32,.07) 26px 28px)}
.art-crm{background:#1c1233}
.art-crm::before{content:'';position:absolute;left:10%;right:10%;top:55%;height:2px;background:linear-gradient(90deg,transparent,#a66cff 40%,#a66cff 60%,transparent)}
.art-crm::after{content:'';position:absolute;left:10%;right:10%;top:70%;height:2px;background:linear-gradient(90deg,transparent,rgba(166,108,255,.4) 40%,rgba(166,108,255,.4) 60%,transparent)}
.art-frag{background:#3a1220}
.art-frag::before{content:'';position:absolute;right:-30px;bottom:-60px;width:260px;height:260px;background:radial-gradient(circle,rgba(255,120,150,.4),transparent 70%)}
.art-frag::after{content:'';position:absolute;left:12%;top:14%;width:90px;height:90px;background:radial-gradient(circle,rgba(255,180,120,.35),transparent 70%)}

/* EXPERIENCE */
#experience{background:var(--bg-soft)}
.xp{display:flex;flex-direction:column}
.xp-row{display:grid;grid-template-columns:200px 1fr;gap:28px;padding:28px 0;border-bottom:1px solid var(--line);align-items:start}
.xp-row:last-child{border-bottom:none}
.xp-date{font-size:13px;color:var(--gray-lt);font-weight:500}
.xp-role{font-family:var(--ff-d);font-size:20px;font-weight:700;letter-spacing:-.015em}
.xp-co{font-size:13.5px;color:var(--gray);margin-top:3px}
.xp-desc{font-size:14.5px;color:var(--gray);line-height:1.7;margin-top:12px}
.xp-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.xp-metrics{display:flex;flex-direction:column;gap:6px;margin-top:12px}
.xp-metric{font-size:13.5px;color:var(--gray);line-height:1.6;padding-left:20px;position:relative}
.xp-metric::before{content:'';position:absolute;left:0;top:9px;width:10px;height:2px;background:var(--accent)}

/* CARD GRID (education/certs/custom) */
.card-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:36px;transition:all .35s var(--ease);position:relative}
.card:hover{transform:translateY(-4px);box-shadow:0 24px 60px -28px rgba(14,14,14,.18)}
.card-badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:20px;background:#ffede5;color:var(--accent)}
.card-name{font-family:var(--ff-d);font-size:22px;font-weight:700;letter-spacing:-.02em;margin-bottom:8px;line-height:1.15}
.card-meta{font-size:14px;color:var(--gray);line-height:1.7;margin-bottom:10px}
.card-tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
.card-link{margin-top:14px;display:inline-flex;font-size:13px;font-weight:600;color:var(--accent)}

/* ACHIEVEMENTS */
.ach{display:flex;flex-direction:column}
.ach-row{display:grid;grid-template-columns:1fr auto;gap:24px;padding:24px 0;border-bottom:1px solid var(--line);align-items:baseline}
.ach-row:first-child{border-top:1px solid var(--line)}
.ach-title{font-family:var(--ff-d);font-size:18px;font-weight:700;letter-spacing:-.015em}
.ach-desc{font-size:14px;color:var(--gray);line-height:1.7;margin-top:6px}
.ach-year{font-size:13px;color:var(--accent);font-weight:600;flex-shrink:0}

/* ABOUT / SKILLS */
#about{background:var(--bg-soft)}
/* Skills: lede across the top, then the groups in an auto-filling grid.
   The old layout was two fixed columns — lede on the left, ALL groups stacked in
   one tall column on the right — so any portfolio with more than a couple of
   skill groups left the entire left half blank down the length of the section. */
.skills-lede{max-width:60ch;margin-bottom:56px}
.about-lede{font-family:var(--ff-d);font-size:clamp(21px,2.4vw,28px);font-weight:500;letter-spacing:-.015em;line-height:1.42}
.about-lede .o{color:var(--accent)}
.about-p{font-size:15px;color:var(--gray);line-height:1.8;margin-top:22px}
.tool-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:36px 40px;align-items:start}
.tool-group{break-inside:avoid}
.tg-h{font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gray-lt);margin-bottom:12px}
.tg-chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{font-size:13px;font-weight:500;padding:7px 15px;border-radius:100px;border:1px solid var(--line);color:var(--gray)}

/* CONTACT */
#contact{background:var(--dark);border-radius:28px;margin:0 20px 20px;color:#fff}
#contact .wrap{padding-top:96px;padding-bottom:96px;text-align:center}
.c-h{font-family:var(--ff-d);font-size:clamp(38px,6vw,76px);font-weight:800;letter-spacing:-.035em;line-height:1;margin-bottom:20px}
.c-h .o{color:var(--accent)}
.c-sub{font-size:16px;color:rgba(255,255,255,.55);max-width:46ch;margin:0 auto 40px;line-height:1.7}
.c-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.btn-acc{background:var(--accent);color:#fff}
.btn-acc:hover{background:#fff;color:var(--ink)}
.btn-ghost{border:1.5px solid rgba(255,255,255,.25);color:#fff;background:transparent}
.btn-ghost:hover{border-color:#fff}
.c-foot{display:flex;justify-content:center;gap:30px;margin-top:56px;font-size:13px;color:rgba(255,255,255,.4);flex-wrap:wrap}
.c-foot a{color:rgba(255,255,255,.6)}
.c-foot a:hover{color:#fff}

/* ── CASE DETAIL (click-through page per campaign) ──
   Server-rendered, one .cd-view per campaign, hidden until opened. Rendering it
   up front (rather than building it in JS) keeps every field inline-editable with
   normal data-paths and lets it survive the editor's iframe repaints. */
.cd-view{display:none}
.cd-view.open{display:block}
#case-container .cd{padding-top:120px}
.cd-back{background:none;border:none;cursor:pointer;font-size:13.5px;font-weight:600;color:var(--gray);display:inline-flex;gap:8px;align-items:center;margin-bottom:28px;padding:0;font-family:var(--ff-b);transition:color .2s}
.cd-back:hover{color:var(--accent)}
.cd-band{border-radius:24px;overflow:hidden;position:relative;padding:56px 52px;min-height:340px;display:flex;flex-direction:column;justify-content:flex-end;margin-bottom:26px}
.cd-band .art{position:absolute;inset:0}
.cd-band-in{position:relative;z-index:2;max-width:700px}
.cd-tag{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;opacity:.85;display:block;margin-bottom:16px}
.cd-title{font-family:var(--ff-d);font-size:clamp(34px,5vw,62px);font-weight:800;letter-spacing:-.03em;line-height:1}
.cd-facts{display:flex;border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:70px;flex-wrap:wrap}
.cd-fact{flex:1;min-width:160px;padding:18px 24px;border-right:1px solid var(--line)}
.cd-fact:last-child{border-right:none}
.cd-fact .k{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gray-lt);margin-bottom:5px}
.cd-fact .v{font-size:14.5px;font-weight:600}
.cd-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;margin-bottom:74px}
.cd-block h3{font-family:var(--ff-d);font-size:21px;font-weight:700;letter-spacing:-.015em;margin-bottom:18px;display:flex;align-items:center;gap:12px}
.cd-block h3 .num{font-size:12px;font-weight:600;color:var(--accent);letter-spacing:.08em}
.cd-block p{font-size:15.5px;color:var(--gray);line-height:1.8;margin-bottom:14px}
.cd-block ul{list-style:none;display:flex;flex-direction:column;gap:14px}
.cd-block li{font-size:15px;color:var(--gray);line-height:1.7;padding-left:24px;position:relative}
.cd-block li::before{content:'';position:absolute;left:0;top:10px;width:10px;height:2px;background:var(--accent)}
/* Empty-state hints for the case fields. These are ::before generated content,
   NOT DOM text, so an untouched placeholder can never be saved as the value. */
.cd-block p:empty::before,.ci-desc:empty::before{content:'Add the challenge behind this campaign…';color:var(--gray-lt)}
.cd-block ul:empty{min-height:26px;cursor:pointer}
.cd-block ul:empty::before{content:'Add what you did — one step per line…';color:var(--gray-lt);font-size:15px}
.cd-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px;margin-bottom:74px}
.res{border:1px solid var(--line);border-radius:16px;padding:26px;background:#fff}
.res .v{font-family:var(--ff-d);font-size:36px;font-weight:800;letter-spacing:-.03em;line-height:1}
.res .k{font-size:12.5px;color:var(--gray);margin-top:10px;line-height:1.5}
.res.todo{border-style:dashed;border-color:#f0c9a8;background:#fffbf6}
.res.todo .add{font-size:13px;font-weight:600;color:#c7722b;border:1.5px dashed #e8c49a;border-radius:8px;padding:6px 12px;display:inline-block}
/* Campaign gallery — real uploaded images; the dashed tile is an editor-only
   upload target and never ships to a published portfolio. */
.gal-h{font-family:var(--ff-d);font-size:21px;font-weight:700;letter-spacing:-.015em;margin-bottom:20px}
.gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:74px}
.gal{aspect-ratio:16/10;border-radius:14px;overflow:hidden;background:var(--bg-soft);position:relative}
.gal img{width:100%;height:100%;object-fit:cover;display:block}
.gal-add{aspect-ratio:16/10;border-radius:14px;border:1.5px dashed #dcdcd6;background:var(--bg-soft);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--gray-lt);font-size:13px;font-weight:500;text-align:center;padding:18px;cursor:pointer;transition:all .3s}
.gal-add small{font-size:11px;font-weight:400;opacity:.75}
.gal-add:hover{border-color:var(--accent);color:var(--accent)}
.cd-nav{display:flex;justify-content:space-between;gap:20px;border-top:1px solid var(--line);padding:36px 0 100px}
.cdn{background:none;border:none;cursor:pointer;text-align:left;padding:0;max-width:45%;font-family:var(--ff-b)}
.cdn .d{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gray-lt);display:block;margin-bottom:8px}
.cdn .t{font-family:var(--ff-d);font-size:19px;font-weight:700;letter-spacing:-.015em;line-height:1.25;color:var(--ink);transition:color .2s}
.cdn.nx{text-align:right}
.cdn:hover .t{color:var(--accent)}

/* EDIT CONTROLS */
.ce-add-btn{display:block;margin-top:24px;padding:11px 18px;border:1.5px dashed var(--line);border-radius:12px;background:var(--bg-soft);color:var(--accent);font-family:var(--ff-b);font-size:13px;font-weight:600;cursor:pointer;width:100%;text-align:center}
.ce-add-btn:hover{border-color:var(--accent)}
[data-item-wrap]{position:relative}
.ce-del-btn{display:none;position:absolute;top:14px;right:14px;width:24px;height:24px;border-radius:50%;border:none;background:var(--ink);color:#fff;font-size:12px;line-height:24px;text-align:center;cursor:pointer;z-index:10;padding:0}
[data-item-wrap]:hover .ce-del-btn{display:block}

@media(max-width:920px){
  .stats{grid-template-columns:1fr 1fr!important}
  .case,.case:nth-child(even){grid-template-columns:1fr}
  .case:nth-child(even) .case-cover{order:0}
  .card-grid{grid-template-columns:1fr}
  .xp-row{grid-template-columns:1fr;gap:8px}
  .sec-sub{display:none}
  .nav-links a:not(.nav-btn){display:none}.avail{display:none}
  .cd-grid{grid-template-columns:1fr}
  .gal-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:540px){.wrap{padding:0 18px}.stats{grid-template-columns:1fr 1fr}#contact{margin:0 10px 10px;border-radius:20px}.c-foot{flex-direction:column;gap:12px;align-items:center}
  .case-info{padding:24px 20px}
  .cd-band{padding:32px 24px;min-height:220px}
  .cd-facts{flex-direction:column}
  .cd-fact{border-right:none;border-bottom:1px solid var(--line)}
  .cd-fact:last-child{border-bottom:none}
  .cd-grid{gap:32px;margin-bottom:40px}
  .cd-results{grid-template-columns:1fr 1fr}
  .gal-grid{grid-template-columns:1fr 1fr;gap:10px}
  .gal-add{font-size:11px;padding:12px}
  .cd-nav{flex-direction:column;gap:20px;padding-bottom:60px}
  .cdn{max-width:100%}
  .cdn.nx{text-align:left}
}
`;
}

const MOMENTUM_SCRIPT = `<script>
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});
})();
(function(){
  /* Case-study view switching. Views are already in the DOM — we only toggle a
     class, so nothing is rebuilt and every field keeps its data-path binding. */
  var grid=document.getElementById('grid-view');
  var views=document.querySelectorAll('.cd-view');
  if(!grid||!views.length)return;
  function showGrid(){
    for(var i=0;i<views.length;i++)views[i].classList.remove('open');
    grid.style.display='';
  }
  function openCase(idx){
    var target=document.getElementById('case-'+idx);
    if(!target)return;
    for(var i=0;i<views.length;i++)views[i].classList.remove('open');
    target.classList.add('open');
    grid.style.display='none';
    window.scrollTo({top:0,behavior:'auto'});
    /* Reveals inside a case view never intersected while it was display:none. */
    target.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');});
  }
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-case-close]')){showGrid();return;}
    /* In the editor the whole card is also an edit surface: never hijack a click
       meant for an inline field, a list region, an upload zone or an add/delete
       button. Those all carry their own attributes/classes. */
    if(e.target.closest('[data-path],[data-list-path],[data-img-upload],.ce-del-btn,.ce-add-btn'))return;
    var trigger=e.target.closest('[data-case-open]');
    if(!trigger)return;
    e.preventDefault();
    openCase(trigger.getAttribute('data-case-open'));
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){showGrid();return;}
    if(e.key!=='Enter')return;
    var card=e.target.closest&&e.target.closest('.case[data-case-open]');
    if(card){e.preventDefault();openCase(card.getAttribute('data-case-open'));}
  });
  /* Nav/anchor links must restore the grid before scrolling to a section. */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(){
      var id=a.getAttribute('href').slice(1);
      if(!id||!document.getElementById(id))return;
      showGrid();
    });
  });
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

	const nameParts = v.name.split(/\s+/);
	const heroName = nameParts.length > 1
		? `${nameParts.slice(0, -1).join(' ')} <span class="o">${nameParts[nameParts.length - 1]}</span>`
		: `<span class="o">${v.name}</span>`;

	// HERO stats grid (dynamic column count)
	const statCells = [
		showYears ? `<div class="stat"><div class="stat-n">${statNum('years_experience', yearsExp)}+</div><div class="stat-l">Years Experience</div></div>` : '',
		showCampaigns ? `<div class="stat"><div class="stat-n">${statNum('campaigns_count', campaignsCount)}+</div><div class="stat-l">Campaigns Delivered</div></div>` : '',
		showRoas ? `<div class="stat"><div class="stat-n">${statNum('avg_roas', avgRoas)}&times;</div><div class="stat-l">Average ROAS</div></div>` : '',
		rolesCount > 0 ? `<div class="stat"><div class="stat-n">${rolesCount}</div><div class="stat-l">Roles &amp; Engagements</div></div>` : '',
	].filter(Boolean);
	const statsHtml = statCells.length ? `<div class="stats rv" style="grid-template-columns:repeat(${statCells.length},1fr)">${statCells.join('')}</div>` : '';

	// MARQUEE from flattened skills
	const allSkills = (v.skill_groups ?? []).flatMap(g => g.skills).filter(Boolean);
	const marqueeHtml = allSkills.length >= 4
		? `<section id="brands"><div class="brands-label rv">Capabilities &amp; toolkit</div>
<div class="marquee"><div class="marquee-track">${allSkills.map(s => `<span class="brand">${s}</span>`).join('')}</div><div class="marquee-track" aria-hidden="true">${allSkills.map(s => `<span class="brand">${s}</span>`).join('')}</div></div></section>` : '';

	// A performance metric is a free-text string like "45% YoY subscriber growth".
	// Split it into a big number + its label for the metric tiles. Same regex the
	// cover stat already used, so a card and its case page agree.
	const metricValue = (m: string): string => (m.match(/[\d.,]+[%x×+MK$]*/) || [m])[0];
	const metricLabel = (m: string): string => {
		const val = metricValue(m);
		const rest = m.replace(val, '').trim().replace(/^[–—-]\s*/, '');
		return rest || m;
	};

	// CAMPAIGNS (case cards)
	const campaignsHtml = !hidden.has('campaigns') && (v.campaigns?.length || em)
		? `<section class="sec" id="campaigns"><div class="wrap">
<div class="sec-head rv"><h2 class="sec-h">Selected work</h2><p class="sec-sub">Campaigns told the way they happened — challenge, approach, results.</p></div>
<div class="work-list">
${(v.campaigns ?? []).map((c, i) => {
			const art = ART[i % ART.length];
			const tone = art === 'art-gautam' ? 'tk' : 'tw';
			const headline = (c.performance_metrics ?? [])[0] || '';
			return `<article class="case rv" tabindex="0" data-case-open="${i}"${iw}>
${delBtn('campaigns', i)}
<div class="case-cover ${tone}">
<div class="art ${art}"></div>
${c.campaign_type ? `<span class="ct" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</span>` : ''}
<div class="cs">${headline ? `<span class="n">${metricValue(headline)}</span>` : ''}<span class="l">${headline || c.campaign_name}</span></div>
</div>
<div class="case-info">
<div class="ci-meta">${(c.channels_used ?? []).length ? `<span class="pill hot">${c.channels_used[0]}</span>` + (c.channels_used.slice(1).map(ch => `<span class="pill">${ch}</span>`).join('')) : ''}</div>
<h3 class="ci-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name || (em ? 'Campaign' : '')}</h3>
${(c.channels_used?.length) ? `<div class="ci-meta" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.map(ch => `<span class="pill">${ch}</span>`).join('')}</div>` : ''}
${(c.challenge || em) ? `<p class="ci-desc" ${ed(`campaigns.${i}.challenge`, true)}>${c.challenge}</p>` : ''}
<div class="ci-metrics">
${c.budget ? `<div class="cim"><div class="v" ${ed(`campaigns.${i}.budget`)}>${c.budget}</div><div class="k">Budget</div></div>` : ''}
${(c.performance_metrics?.length) ? `<div class="ci-metrics-list" ${le(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map(m => `<div class="cim"><div class="v">${metricValue(m)}</div><div class="k">${metricLabel(m)}</div></div>`).join('')}</div>` : ''}
</div>
<span class="ci-link">Read case study <span class="arr">&#8594;</span></span>
</div>
</article>`;
		}).join('\n')}
</div>
${addBtn('campaigns', 'Campaign')}
</div></section>` : '';

	// CASE DETAIL VIEWS — one per campaign, rendered up front, shown on demand.
	const caseCount = v.campaigns?.length ?? 0;
	const caseViews = (v.campaigns ?? []).map((c, i) => {
		const art = ART[i % ART.length];
		const tone = art === 'art-gautam' ? 'tk' : 'tw';
		const prev = (i - 1 + caseCount) % caseCount;
		const next = (i + 1) % caseCount;
		const facts = [
			c.campaign_type ? `<div class="cd-fact"><div class="k">Type</div><div class="v" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</div></div>` : '',
			c.budget ? `<div class="cd-fact"><div class="k">Budget</div><div class="v" ${ed(`campaigns.${i}.budget`)}>${c.budget}</div></div>` : '',
			c.channels_used?.length ? `<div class="cd-fact"><div class="k">Channels</div><div class="v" ${le(`campaigns.${i}.channels_used`)}>${c.channels_used.join(' · ')}</div></div>` : '',
		].filter(Boolean).join('');
		// Gallery: real uploaded images, plus an upload tile in the editor only.
		const tiles = (c.images ?? []).map(src => `<div class="gal"><img src="${src}" alt="${c.campaign_name}"></div>`).join('');
		const addTile = (em && (c.images?.length ?? 0) < 3)
			? `<div class="gal-add" ${_imgUpload(`campaigns.${i}.images`, em)}>&#9106;&nbsp; Add gallery image<small>A creative, screenshot, or deck slide</small></div>`
			: '';
		const gallery = (tiles || addTile)
			? `<div class="gal-h">Campaign gallery</div><div class="gal-grid">${tiles}${addTile}</div>`
			: '';
		return `<div class="cd-view" id="case-${i}"><div class="wrap cd">
<button class="cd-back" data-case-close>&#8592; All work</button>
<div class="cd-band ${tone}">
<div class="art ${art}"></div>
<div class="cd-band-in">
${c.campaign_type ? `<span class="cd-tag" ${ed(`campaigns.${i}.campaign_type`)}>${c.campaign_type}</span>` : ''}
<h1 class="cd-title" ${ed(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</h1>
</div>
</div>
${facts ? `<div class="cd-facts">${facts}</div>` : ''}
<div class="cd-grid">
${(c.challenge || em) ? `<div class="cd-block"><h3><span class="num">01</span>The challenge</h3><p ${ed(`campaigns.${i}.challenge`, true)}>${c.challenge}</p></div>` : ''}
${(c.approach?.length || em) ? `<div class="cd-block"><h3><span class="num">02</span>What I did</h3><ul ${le(`campaigns.${i}.approach`)}>${(c.approach ?? []).map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
</div>
<div class="cd-block" style="margin-bottom:20px"><h3><span class="num">03</span>Results</h3></div>
${(c.performance_metrics?.length)
			? `<div class="cd-results" ${le(`campaigns.${i}.performance_metrics`)}>${c.performance_metrics.map(m => `<div class="res"><div class="v">${metricValue(m)}</div><div class="k">${metricLabel(m)}</div></div>`).join('')}</div>`
			: (em ? `<div class="cd-results"><div class="res todo" ${le(`campaigns.${i}.performance_metrics`)}><span class="add">+ Add metric</span><div class="k">Performance metrics appear here</div></div></div>` : '')}
${gallery}
${caseCount > 1 ? `<div class="cd-nav">
<button class="cdn" data-case-open="${prev}"><span class="d">&#8592; Previous</span><span class="t">${v.campaigns[prev].campaign_name}</span></button>
<button class="cdn nx" data-case-open="${next}"><span class="d">Next &#8594;</span><span class="t">${v.campaigns[next].campaign_name}</span></button>
</div>` : ''}
</div></div>`;
	}).join('\n');

	// NOTE: the source design had per-role buttons linking a job to its case studies.
	// Those were hand-wired by its author; our model has no campaign↔experience
	// relation, and deriving one by matching the company name against campaign names
	// produced stray, truncated links on real data. Dropped deliberately (skill Z15:
	// no dead or invented controls). Case studies are reached by clicking a work card.

	// EXPERIENCE
	const experienceHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section class="sec" id="experience"><div class="wrap">
<div class="sec-head rv"><h2 class="sec-h">Experience</h2><p class="sec-sub">The full journey across brands, markets, and mandates.</p></div>
<div class="xp">
${v.experience.map((exp, i) => `<div class="xp-row rv"${iw}>
${delBtn('experience', i)}
<div class="xp-date">${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : ''}${(exp.start_date && exp.end_date) ? ' — ' : ''}${exp.end_date ? `<span ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : ''}</div>
<div>
<div class="xp-role" ${ed(`experience.${i}.role`)}>${exp.role || (em ? 'Role' : '')}</div>
${exp.company ? `<div class="xp-co"><span ${ed(`experience.${i}.company`)}>${exp.company}</span>${exp.location ? ` · <span ${ed(`experience.${i}.location`)}>${exp.location}</span>` : ''}</div>` : ''}
${exp.description ? `<div class="xp-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</div>` : ''}
${exp.channels_managed?.length ? `<div class="xp-chips" ${le(`experience.${i}.channels_managed`)}>${exp.channels_managed.map(c => `<span class="chip">${c}</span>`).join('')}</div>` : ''}
${exp.key_points?.length ? `<div class="xp-metrics" ${le(`experience.${i}.key_points`)}>${exp.key_points.map(k => `<div class="xp-metric">${k}</div>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</div></section>` : '';

	// SKILLS (tool-group chips)
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section class="sec" id="skills"><div class="wrap">
<div class="sec-head rv"><h2 class="sec-h">Skills &amp; tools</h2><p class="sec-sub">Strategy, channels, and the stack behind the numbers.</p></div>
${v.uniqueValue ? `<div class="skills-lede rv"><p class="about-lede" ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue}</p></div>` : ''}
<div class="tool-grid rv">
${v.skill_groups.map((g, gi) => `<div class="tool-group"${iw}>
${delBtn('skills', gi)}
<div class="tg-h" ${ed(`skills.${gi}.category`)}>${g.category}</div>
<div class="tg-chips" ${le(`skills.${gi}.skills`)}>${g.skills.map(s => `<span class="chip">${s}</span>`).join('')}</div>
</div>`).join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</div></section>` : '';

	// EDUCATION
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section class="sec" id="education"><div class="wrap">
<div class="sec-head rv"><h2 class="sec-h">Education</h2></div>
<div class="card-grid">
${v.education.map((edu, i) => `<div class="card rv"${iw}>
${delBtn('education', i)}
<span class="card-badge">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : ''}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : ''}</span>
<h3 class="card-name">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' — ')}</h3>
${edu.institution ? `<div class="card-meta"><span ${ed(`education.${i}.institution`)}>${edu.institution}</span>${edu.location ? ` · <span ${ed(`education.${i}.location`)}>${edu.location}</span>` : ''}</div>` : ''}
${edu.grade_or_score ? `<div class="card-tags"><span class="pill hot" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</span></div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</div></section>` : '';

	// CERTIFICATIONS
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section class="sec" id="certifications" style="background:var(--bg-soft)"><div class="wrap">
<div class="sec-head rv"><h2 class="sec-h">Certifications</h2></div>
<div class="card-grid">
${v.certifications.map((c, i) => `<div class="card rv"${iw}>
${delBtn('certifications', i)}
${c.year ? `<span class="card-badge" ${ed(`certifications.${i}.year`)}>${c.year}</span>` : ''}
<h3 class="card-name" ${ed(`certifications.${i}.name`)}>${c.name}</h3>
${c.issuer ? `<div class="card-meta" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>` : ''}
${c.url ? `<a href="${c.url}" class="card-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</div></section>` : '';

	// ACHIEVEMENTS
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section class="sec" id="achievements"><div class="wrap">
<div class="sec-head rv"><h2 class="sec-h">Achievements</h2></div>
<div class="ach">
${v.achievements.map((a, i) => `<div class="ach-row"${iw}>
${delBtn('achievements', i)}
<div><div class="ach-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>${a.description ? `<div class="ach-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}</div>
${a.year ? `<div class="ach-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</div></section>` : '';

	// CUSTOM SECTIONS
	const customHtml = (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, ci) => {
			if (!cs.items?.length && !em) return '';
			let inner = '';
			if (cs.display_type === 'list' || cs.display_type === 'timeline') {
				inner = `<div class="ach">${(cs.items ?? []).map((item, i) => `<div class="ach-row"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
<div>${item.label ? `<div class="ach-title" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</div>` : ''}${item.value ? `<div class="ach-desc" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}${item.tags?.length ? `<div class="card-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}</div>
${item.subtitle ? `<div class="ach-year" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</div>` : ''}
</div>`).join('\n')}</div>`;
			} else {
				inner = `<div class="card-grid">${(cs.items ?? []).map((item, i) => `<div class="card"${iw}>
${delBtn(`custom_sections.${ci}`, i)}
${item.subtitle ? `<span class="card-badge" ${ed(`custom_sections.${ci}.items.${i}.subtitle`)}>${item.subtitle}</span>` : ''}
${item.label ? `<h3 class="card-name" ${ed(`custom_sections.${ci}.items.${i}.label`)}>${item.label}</h3>` : ''}
${item.value ? `<div class="card-meta" ${ed(`custom_sections.${ci}.items.${i}.value`, true)}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="card-tags" ${le(`custom_sections.${ci}.items.${i}.tags`)}>${item.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="card-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}</div>`;
			}
			return `<section class="sec" id="${cs.section_id}"><div class="wrap">
<div class="sec-head rv"><h2 class="sec-h" ${v.edit_mode ? _editable(`custom_sections.${ci}.title`) : ''}>${cs.title}</h2></div>
${inner}
${addBtn(`custom_sections.${ci}.items`, 'Item')}
</div></section>`;
		}).filter(Boolean).join('\n')
		: '';

	const sectionMap: Record<string, string> = {
		campaigns: campaignsHtml, experience: experienceHtml, skills: skillsHtml,
		education: educationHtml, certifications: certsHtml, achievements: achievementsHtml,
		custom_sections: customHtml,
	};
	const orderedSections = order.filter(k => !hidden.has(k) && k in sectionMap).map(k => sectionMap[k]).filter(Boolean).join('\n');

	// CONTACT
	const footItems = [
		v.location ? `<span ${ed('profile.location')}>${v.location}</span>` : '',
		v.phone ? `<a href="tel:${v.phone}" ${ed('profile.phone')}>${v.phone}</a>` : '',
		v.email ? `<a href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a>` : '',
	].filter(Boolean).join('');
	const ctaBtns = [
		v.email ? `<a class="btn btn-acc" href="mailto:${v.email}">Email me</a>` : '',
		v.linkedin_url ? `<a class="btn btn-ghost" href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn &#8599;</a>` : '',
		v.portfolio_url ? `<a class="btn btn-ghost" href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Website &#8599;</a>` : '',
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
<nav><div class="nav-in">
<a href="#hero"><span class="logo" ${ed('profile.full_name')}>${v.name}</span></a>
<ul class="nav-links">
<li><a href="#campaigns">Work</a></li>
<li><a href="#experience">Experience</a></li>
<li><a href="#skills">Skills</a></li>
${v.email ? `<li><a class="nav-btn" href="mailto:${v.email}">Get in touch</a></li>` : ''}
</ul>
</div></nav>

<div id="grid-view">
<header id="hero"><div class="wrap">
<div class="kicker rv">${v.profile_headline ? `<span ${ed('profile.headline')}>${v.profile_headline}</span>` : 'Marketing &amp; Growth'}${v.location ? ` · ${v.location}` : ''}</div>
<h1 class="hero-h rv" ${ed('profile.full_name')}>${heroName}</h1>
${v.headline ? `<p class="hero-sub rv" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
${v.bio ? `<p class="hero-sub rv" ${ed('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="hero-cta rv">
<a class="btn btn-dark" href="#campaigns">View my work &#8595;</a>
${v.email ? `<a class="btn btn-line" href="mailto:${v.email}"><span ${_editable('profile.email')}>${v.email}</span></a>` : ''}
</div>
${statsHtml}
</div></header>

${marqueeHtml}
${orderedSections}

<section id="contact"><div class="wrap">
<h2 class="c-h rv">Let's grow <span class="o">something.</span></h2>
${v.bio ? `<p class="c-sub rv">${v.bio.slice(0, 150)}${v.bio.length > 150 ? '…' : ''}</p>` : `<p class="c-sub rv">Open to marketing &amp; growth leadership roles and consulting engagements.</p>`}
${ctaBtns ? `<div class="c-btns rv">${ctaBtns}</div>` : ''}
${footItems ? `<div class="c-foot rv">${footItems}</div>` : ''}
</div></section>
</div><!-- /grid-view -->

<div id="case-container">${caseViews}</div>

${MOMENTUM_SCRIPT}
${EDITOR_SCRIPT}
</body>
</html>`;
}
