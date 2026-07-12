/**
 * Template: Luxe Studio (Designer)
 * Dark luxury aesthetic — #0b0b0a bg, #d4ff3a chartreuse accent.
 * Instrument Serif + Space Grotesk + JetBrains Mono.
 * Film grain overlay, custom cursor (publish-only), scroll-reveal animations.
 * Designed for the `designer` profession category.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, _rangeEditable, _pairEditable, _imgUpload, EDITOR_SCRIPT, statShown } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

function yearsFromExperience(experience: NormalizedData['experience']): number {
	let earliest = Infinity;
	for (const exp of experience) {
		const m = exp.duration.match(/^(\d{4})/);
		if (m) {
			const y = parseInt(m[1], 10);
			if (y < earliest) earliest = y;
		}
	}
	if (earliest === Infinity || !isFinite(earliest)) return Math.max(1, experience.length);
	return Math.max(1, new Date().getFullYear() - earliest);
}

function css(): string {
	return `
:root{
  --bg:#0b0b0a;--bg-2:#111110;--ink:#efeae0;--ink-dim:#8a8780;
  --line:#22211f;--line-2:#2e2c28;--accent:#d4ff3a;--accent-ink:#0b0b0a;
  --serif:"Instrument Serif","Times New Roman",serif;
  --sans:"Space Grotesk",system-ui,sans-serif;
  --mono:"JetBrains Mono",ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--accent);color:var(--accent-ink)}
/* film grain */
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.06;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");}
/* cursor (only visible in publish mode via conditional injection) */
.d-cursor,.d-cursor-dot{position:fixed;top:0;left:0;pointer-events:none;z-index:70;transform:translate(-50%,-50%);will-change:transform}
.d-cursor{width:34px;height:34px;border:1px solid var(--ink);border-radius:50%;transition:width .25s,height .25s,background .25s,border-color .25s,opacity .2s}
.d-cursor-dot{width:4px;height:4px;background:var(--ink);border-radius:50%}
.d-cursor.is-hover{width:74px;height:74px;background:var(--accent);border-color:var(--accent);mix-blend-mode:difference}
@media(hover:none){.d-cursor,.d-cursor-dot{display:none}}
/* layout */
.wrap{max-width:1760px;margin:0 auto;padding:0 40px}
@media(max-width:760px){.wrap{padding:0 22px}}
/* nav */
.d-nav{position:sticky;top:0;left:0;right:0;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:22px 40px;background:rgba(11,11,10,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.d-nav .logo{font-family:var(--serif);font-style:italic;font-size:20px;letter-spacing:.01em}
.d-nav ul{display:flex;gap:28px;list-style:none;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.d-nav a{position:relative;color:var(--ink-dim);transition:color .2s}
.d-nav a:hover{color:var(--ink)}
.d-nav a::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:1px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.d-nav a:hover::after{transform:scaleX(1)}
@media(max-width:760px){.d-nav{padding:16px 22px}.d-nav ul{display:none}}
/* progress */
.d-progress{position:fixed;top:0;left:0;height:2px;background:var(--accent);width:0;z-index:80;transition:width .1s linear}
/* hero */
.d-hero{position:relative;min-height:100vh;padding:140px 40px 80px;display:flex;flex-direction:column;justify-content:space-between;border-bottom:1px solid var(--line)}
.d-hero .meta{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim)}
.d-hero h1{font-family:var(--serif);font-weight:400;line-height:.9;letter-spacing:-.03em;font-size:clamp(60px,13vw,220px);margin:60px 0 40px}
.d-hero h1 .it{font-style:italic;color:var(--ink-dim)}
.d-hero h1 .acc{color:var(--accent)}
.d-hero-row{display:grid;grid-template-columns:1.4fr .8fr .8fr;gap:60px;align-items:end;padding-top:40px;border-top:1px solid var(--line)}
.d-lede{font-family:var(--serif);font-style:italic;font-size:clamp(18px,2vw,26px);line-height:1.3;max-width:520px}
.d-lede em{font-style:normal;font-family:var(--sans);text-transform:uppercase;letter-spacing:.18em;font-size:11px;display:block;color:var(--ink-dim);margin-bottom:12px}
.d-stat{display:flex;flex-direction:column;gap:6px}
.d-stat .n{font-family:var(--serif);font-size:52px;line-height:1}
.d-stat .l{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim)}
.scroll-cue{position:absolute;left:40px;bottom:28px;display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim)}
.scroll-cue .bar{width:38px;height:1px;background:var(--ink-dim);position:relative;overflow:hidden}
.scroll-cue .bar::after{content:"";position:absolute;inset:0;background:var(--accent);transform:translateX(-100%);animation:slide 2.4s infinite cubic-bezier(.6,.1,.1,1)}
@keyframes slide{50%{transform:translateX(0)}100%{transform:translateX(100%)}}
@media(max-width:880px){.d-hero{padding:100px 22px 60px}.d-hero-row{grid-template-columns:1fr 1fr;gap:24px}.scroll-cue{left:22px}}
/* marquee */
.d-marquee{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;background:var(--bg);padding:16px 0;cursor:default}
.d-marquee .track{display:flex;gap:50px;white-space:nowrap;animation:marquee 40s linear infinite;font-family:var(--serif);font-style:italic;font-size:30px;color:var(--ink)}
.d-marquee .track span{display:inline-flex;align-items:center;gap:50px}
.d-marquee .track span::after{content:"✱";color:var(--accent);font-style:normal;font-size:16px}
@keyframes marquee{to{transform:translateX(-50%)}}
/* section base */
.d-sec{padding:120px 40px;border-bottom:1px solid var(--line);position:relative}
.d-sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;padding-bottom:50px;border-bottom:1px solid var(--line)}
.d-sec-num{font-family:var(--mono);font-size:12px;letter-spacing:.18em;color:var(--ink-dim);text-transform:uppercase}
.d-sec-title{font-family:var(--serif);font-size:clamp(40px,6vw,90px);line-height:.96;letter-spacing:-.02em}
.d-sec-title em{font-style:italic;color:var(--ink-dim)}
.d-eyebrow{display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:24px}
.d-eyebrow .dot{width:6px;height:6px;background:var(--accent);border-radius:50%;box-shadow:0 0 10px var(--accent)}
@media(max-width:760px){.d-sec{padding:80px 22px}.d-sec-head{flex-direction:column;padding-bottom:32px}}
/* about / bio */
.d-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px;padding-top:70px}
.d-about-grid p{font-family:var(--serif);font-size:clamp(20px,2vw,30px);line-height:1.32;max-width:24ch}
.d-about-side{display:flex;flex-direction:column;gap:30px}
.d-about-row{display:grid;grid-template-columns:130px 1fr;gap:20px;padding:18px 0;border-top:1px solid var(--line)}
.d-about-row:last-child{border-bottom:1px solid var(--line)}
.d-about-k{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim);padding-top:4px}
.d-about-v{font-family:var(--sans);font-size:15px;line-height:1.5}
@media(max-width:880px){.d-about-grid{grid-template-columns:1fr;gap:44px}}
/* work / projects */
.d-work{display:grid;grid-template-columns:1fr 1fr;gap:50px 70px;padding-top:70px}
.d-work-item{display:flex;flex-direction:column;gap:16px;position:relative}
.d-work-item:nth-child(even){margin-top:60px}
.d-work-thumb{position:relative;aspect-ratio:4/3;background:var(--bg-2);overflow:hidden;border:1px solid var(--line)}
.d-work-thumb .d-thumb-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--ink-dim);font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase}
.d-work-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.d-work-thumb .d-hover{position:absolute;inset:0;background:var(--accent);color:var(--accent-ink);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-style:italic;font-size:32px;clip-path:circle(0% at 50% 50%);transition:clip-path .5s cubic-bezier(.7,.05,.2,1)}
.d-work-item:hover .d-hover{clip-path:circle(120% at 50% 50%)}
.d-work-meta{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.d-work-title{font-family:var(--serif);font-size:clamp(26px,3.5vw,48px);line-height:1;letter-spacing:-.01em}
.d-work-tags{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);text-align:right;line-height:1.7}
.d-work-desc{font-family:var(--sans);color:var(--ink-dim);max-width:46ch;line-height:1.55;font-size:14px}
.d-work-link{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-top:8px;transition:gap .2s}
.d-work-link:hover{gap:14px}
@media(max-width:880px){.d-work{grid-template-columns:1fr;gap:44px}.d-work-item:nth-child(even){margin-top:0}}
/* design philosophy */
.d-philosophy{padding-top:60px}
.d-philosophy p{font-family:var(--serif);font-style:italic;font-size:clamp(22px,2.5vw,36px);line-height:1.35;max-width:60ch;color:var(--ink)}
/* software proficiency / tools */
.d-tools{padding-top:60px;display:flex;flex-wrap:wrap;gap:14px}
.d-tool-tag{font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:10px 18px;border:1px solid var(--line-2);color:var(--ink-dim);transition:all .25s}
.d-tool-tag:hover{border-color:var(--accent);color:var(--ink)}
/* timeline / experience */
.d-timeline{padding-top:70px;display:flex;flex-direction:column}
.d-t-row{display:grid;grid-template-columns:200px 1fr 200px;gap:32px;padding:42px 0;border-top:1px solid var(--line);align-items:baseline;transition:background .4s;position:relative}
.d-t-row:last-child{border-bottom:1px solid var(--line)}
.d-t-row:hover{background:linear-gradient(90deg,transparent,rgba(212,255,58,.04),transparent)}
.d-t-year{font-family:var(--serif);font-size:clamp(44px,6vw,90px);line-height:.9;letter-spacing:-.02em}
.d-t-body h4{font-family:var(--sans);font-size:20px;font-weight:500;letter-spacing:-.01em;margin-bottom:8px}
.d-t-body p{font-family:var(--sans);font-size:14px;color:var(--ink-dim);line-height:1.55;max-width:50ch}
.d-t-body ul{margin-top:10px;padding-left:18px;font-family:var(--sans);font-size:13px;color:var(--ink-dim);line-height:1.7}
.d-t-role{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim);text-align:right;line-height:1.7}
.d-t-role .now{color:var(--accent)}
@media(max-width:880px){.d-t-row{grid-template-columns:1fr;gap:12px}.d-t-role{text-align:left}}
/* skills grid */
.d-skill-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:50px;padding-top:70px}
.d-skill-col h5{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim);padding-bottom:16px;border-bottom:1px solid var(--line);margin-bottom:8px}
.d-skill-list{list-style:none;display:flex;flex-direction:column}
.d-skill-list li{display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;border-bottom:1px solid var(--line);font-family:var(--serif);font-size:22px;letter-spacing:-.005em;transition:color .25s,transform .35s}
.d-skill-list li:hover{color:var(--accent);transform:translateX(6px)}
@media(max-width:880px){.d-skill-grid{grid-template-columns:1fr;gap:32px}}
/* awards */
.d-awards{padding-top:60px;display:flex;flex-direction:column;gap:0}
.d-award-row{display:flex;align-items:baseline;gap:32px;padding:22px 0;border-bottom:1px solid var(--line);transition:background .3s}
.d-award-row:first-child{border-top:1px solid var(--line)}
.d-award-row:hover{background:rgba(212,255,58,.03)}
.d-award-title{font-family:var(--serif);font-size:22px;flex:1;letter-spacing:-.005em}
.d-award-body{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);min-width:160px}
.d-award-year{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--accent);min-width:60px;text-align:right}
.d-award-link{color:var(--accent);font-family:var(--mono);font-size:11px;margin-left:8px;opacity:.7;transition:opacity .2s}
.d-award-link:hover{opacity:1}
/* education */
.d-edu-list{padding-top:60px;display:flex;flex-direction:column;gap:0}
.d-edu-row{padding:28px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr auto;gap:24px;align-items:baseline}
.d-edu-row:first-child{border-top:1px solid var(--line)}
.d-edu-degree{font-family:var(--serif);font-size:22px;letter-spacing:-.005em}
.d-edu-field{font-family:var(--sans);font-size:14px;color:var(--ink-dim);margin-top:4px}
.d-edu-inst{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-dim);margin-top:6px}
.d-edu-year{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--ink-dim);text-align:right}
.d-edu-grade{font-family:var(--mono);font-size:11px;color:var(--accent);margin-top:4px}
/* certifications */
.d-cert-list{padding-top:60px;display:flex;flex-wrap:wrap;gap:20px}
.d-cert-card{border:1px solid var(--line-2);padding:20px 24px;display:flex;flex-direction:column;gap:6px;transition:border-color .25s}
.d-cert-card:hover{border-color:var(--accent)}
.d-cert-name{font-family:var(--sans);font-size:15px;font-weight:500}
.d-cert-issuer{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-dim)}
.d-cert-year{font-family:var(--mono);font-size:11px;color:var(--accent)}
/* achievements */
.d-ach-list{padding-top:60px;display:flex;flex-direction:column;gap:0}
.d-ach-row{padding:20px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr auto;gap:20px;align-items:baseline}
.d-ach-row:first-child{border-top:1px solid var(--line)}
.d-ach-title{font-family:var(--serif);font-size:20px}
.d-ach-desc{font-family:var(--sans);font-size:13px;color:var(--ink-dim);margin-top:4px;line-height:1.55}
.d-ach-year{font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--accent)}
/* custom sections */
.d-cs-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px;padding-top:48px}
.d-cs-card{border:1px solid var(--line-2);padding:24px;transition:border-color .25s;position:relative}
.d-cs-card:hover{border-color:var(--accent)}
.d-cs-card h3{font-family:var(--serif);font-size:22px;margin-bottom:6px}
.d-cs-card p{font-family:var(--sans);font-size:13px;color:var(--ink-dim);line-height:1.55;margin-top:4px}
.d-cs-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.d-cs-tag{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--line-2);color:var(--ink-dim)}
.d-cs-list-ul{padding-top:32px;list-style:none;display:flex;flex-direction:column;gap:0}
.d-cs-list-li{padding:16px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;align-items:baseline;position:relative}
.d-cs-list-li:first-child{border-top:1px solid var(--line)}
.d-cs-tl{padding-top:40px;display:flex;flex-direction:column;gap:0}
.d-cs-tl-row{display:grid;grid-template-columns:160px 1fr;gap:24px;padding:24px 0;border-bottom:1px solid var(--line);align-items:start;position:relative}
.d-cs-tl-row:first-child{border-top:1px solid var(--line)}
.d-cs-tl-sub{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
.d-cs-tl-label{font-family:var(--serif);font-size:20px}
.d-cs-tl-val{font-family:var(--sans);font-size:13px;color:var(--ink-dim);line-height:1.55;margin-top:6px}
/* contact */
.d-contact{padding:130px 40px 90px;border-bottom:1px solid var(--line);position:relative;overflow:hidden}
.d-contact .big{font-family:var(--serif);font-size:clamp(56px,11vw,180px);line-height:.88;letter-spacing:-.03em}
.d-contact .big em{font-style:italic;color:var(--ink-dim)}
.d-contact-row{display:grid;grid-template-columns:1.2fr .8fr;gap:70px;padding-top:70px;border-top:1px solid var(--line);margin-top:50px}
.d-contact-info{display:flex;flex-direction:column;gap:14px}
.d-contact-item{display:flex;align-items:center;gap:14px;font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-dim)}
.d-contact-item a{color:var(--ink);transition:color .2s}
.d-contact-item a:hover{color:var(--accent)}
.d-social-links{display:flex;gap:18px;margin-top:20px;flex-wrap:wrap}
.d-social-link{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim);padding:8px 14px;border:1px solid var(--line-2);transition:all .25s}
.d-social-link:hover{border-color:var(--accent);color:var(--accent)}
@media(max-width:880px){.d-contact{padding:80px 22px 60px}.d-contact-row{grid-template-columns:1fr;gap:40px}}
/* footer */
.d-foot{padding:40px 40px 32px;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim)}
.d-foot a:hover{color:var(--accent)}
@media(max-width:760px){.d-foot{flex-direction:column;align-items:flex-start;padding:32px 22px}}
/* reveal animations */
.reveal{opacity:0;transform:translateY(30px);transition:opacity .9s cubic-bezier(.2,.6,.2,1),transform .9s cubic-bezier(.2,.6,.2,1)}
.reveal.in{opacity:1;transform:none}
/* editing overlay */
[contenteditable]:hover{outline:2px dashed rgba(99,102,241,.45);border-radius:3px}
[contenteditable]:focus{outline:2px solid rgba(99,102,241,.85);border-radius:3px}
`;
}

function customSectionsHtml(v: NormalizedData, em: boolean): string {
	const hidden = v.hidden_sections;
	if (hidden.has('custom_sections') && !em) return '';
	if (!v.custom_sections?.length && !em) return '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number) =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string) =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	return (v.custom_sections ?? [])
		.map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			let inner = '';
			if (cs.display_type === 'cards') {
				inner = `<div class="d-cs-cards">
${(cs.items ?? []).map((item, i) => `<div class="d-cs-card"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
${item.label ? `<h3 ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</h3>` : ''}
${item.subtitle ? `<p class="d-cert-issuer" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</p>` : ''}
${item.value ? `<p ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</p>` : ''}
${item.tags?.length ? `<div class="d-cs-tags" ${em ? _listEditable(`custom_sections.${csIdx}.items.${i}.tags`) : ''}>${item.tags.map(t => `<span class="d-cs-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="d-work-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
			} else if (cs.display_type === 'timeline') {
				inner = `<div class="d-cs-tl">
${(cs.items ?? []).map((item, i) => `<div class="d-cs-tl-row"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
<div>${item.subtitle ? `<div class="d-cs-tl-sub" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</div>` : ''}</div>
<div>
${item.label ? `<div class="d-cs-tl-label" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</div>` : ''}
${item.value ? `<div class="d-cs-tl-val" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</div>` : ''}
${item.tags?.length ? `<div class="d-cs-tags" ${em ? _listEditable(`custom_sections.${csIdx}.items.${i}.tags`) : ''}>${item.tags.map(t => `<span class="d-cs-tag">${t}</span>`).join('')}</div>` : ''}
</div>
</div>`).join('\n')}
</div>
${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
			} else {
				inner = `<ul class="d-cs-list-ul">
${(cs.items ?? []).map((item, i) => `<li class="d-cs-list-li"${iw}>
${delBtn(`custom_sections.${csIdx}`, i)}
<div>
${item.label ? `<div class="d-ach-title" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.label`) : ''}>${item.label}</div>` : ''}
${item.value ? `<div class="d-ach-desc" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.value`, true) : ''}>${item.value}</div>` : ''}
</div>
${item.subtitle ? `<div class="d-ach-year" ${em ? _editable(`custom_sections.${csIdx}.items.${i}.subtitle`) : ''}>${item.subtitle}</div>` : ''}
</li>`).join('\n')}
</ul>
${addBtn(`custom_sections.${csIdx}.items`, 'Item')}`;
			}
			return `<section id="${cs.section_id}" class="d-sec">
<div class="sec-eyebrow-row" style="padding-bottom:30px;border-bottom:1px solid var(--line);margin-bottom:0">
<div class="d-eyebrow"><span class="dot"></span><span>Custom section</span></div>
<h2 class="d-sec-title" style="margin-top:16px">${cs.title}</h2>
</div>
${inner}
</section>`;
		})
		.filter(Boolean)
		.join('\n');
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const hidden = v.hidden_sections;
	const order = v.section_order ?? DEFAULT_SECTION_ORDER;
	const ed = (path: string, multi = false): string => em ? _editable(path, multi) : '';
	const le = (path: string): string => em ? _listEditable(path) : '';
	const iw = em ? ' data-item-wrap' : '';
	const delBtn = (sec: string, i: number): string =>
		em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${i}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string): string =>
		em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';

	// Computed stats
	const yearsExp = v.template_overrides?.years_experience ?? yearsFromExperience(v.experience);
	const projectsCount = v.template_overrides?.projects_count ?? v.projects.length;

	// ── MARQUEE (decorative skill belt) ──────────────────────────────────────
	const allSkills: string[] = [];
	for (const g of v.skill_groups) allSkills.push(...g.skills.slice(0, 3));
	const marqueePart = allSkills.length
		? allSkills.map(s => `<span>${s}</span>`).join('')
		: '<span>Brand identity</span><span>Visual design</span><span>UX/UI</span><span>Typography</span><span>Illustration</span>';
	const marqueeTrack = `${marqueePart}${marqueePart}`;

	// ── PROJECTS ──────────────────────────────────────────────────────────────
	const projectsHtml = !hidden.has('projects') && (v.projects.length || em)
		? `<section id="projects" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Selected work</span></div>
<h2 class="d-sec-title">A short index of <em>recent</em> obsessions.</h2>
</div>
<div class="d-sec-num">Projects</div>
</div>
<div class="d-work">
${v.projects.map((p, i) => `<div class="d-work-item reveal"${iw} style="${i % 2 !== 0 ? 'margin-top:60px' : ''}">
${delBtn('projects', i)}
<div class="d-work-thumb" ${_imgUpload(`projects.${i}.images`, v.edit_mode, 'Upload image')}>
${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.title}" loading="lazy">` : `<div class="d-thumb-placeholder">[ project · ${String(i + 1).padStart(2, '0')} ]</div>`}
<div class="d-hover">view case →</div>
</div>
<div class="d-work-meta">
<div class="d-work-title" ${ed(`projects.${i}.title`)}>${p.title || 'Project'}</div>
${p.tech_stack?.length ? `<div class="d-work-tags" ${le(`projects.${i}.tech_stack`)}>${p.tech_stack.join('<br>')}</div>` : ''}
${p.software_used?.length ? `<div class="d-work-tags" ${le(`projects.${i}.software_used`)}>${p.software_used.join('<br>')}</div>` : ''}
</div>
${p.description ? `<p class="d-work-desc" ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${p.project_url ? `<a href="${p.project_url}" class="d-work-link" target="_blank" rel="noopener noreferrer">View project &#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>`
		: '';

	// ── EXPERIENCE (timeline) ─────────────────────────────────────────────────
	const experienceHtml = !hidden.has('experience') && (v.experience.length || em)
		? `<section id="experience" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Index — experience</span></div>
<h2 class="d-sec-title">A working life, in <em>chapters</em>.</h2>
</div>
<div class="d-sec-num">Experience</div>
</div>
<div class="d-timeline">
${v.experience.map((exp, i) => {
	const yearMatch = (exp.start_date || exp.duration).match(/(\d{4})/);
	const year = yearMatch ? yearMatch[1] : '';
	return `<div class="d-t-row reveal"${iw}>
${delBtn('experience', i)}
<div class="d-t-year">${year}</div>
<div class="d-t-body">
<h4 ${ed(`experience.${i}.role`)}>${exp.role || 'Role'}${exp.company ? ` — ${exp.company}` : ''}</h4>
${exp.description ? `<p ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul ${le(`experience.${i}.key_points`)}>${exp.key_points.map(kp => `<li>${kp}</li>`).join('')}</ul>` : ''}
</div>
<div class="d-t-role">
${exp.company ? `<span ${ed(`experience.${i}.company`)}>${exp.company}</span><br>` : ''}
${exp.start_date ? `<span ${ed(`experience.${i}.start_date`)}>${exp.start_date}</span>` : (em ? `<span ${ed(`experience.${i}.start_date`)}>Start</span>` : '')}${(exp.start_date && exp.end_date) ? ' – ' : ''}${exp.end_date ? `<span class="${exp.is_current ? 'now' : ''}" ${ed(`experience.${i}.end_date`)}>${exp.end_date}</span>` : (em ? `<span ${ed(`experience.${i}.end_date`)}>End</span>` : '')}
</div>
</div>`;
}).join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>`
		: '';

	// ── SKILLS ────────────────────────────────────────────────────────────────
	const skillsHtml = !hidden.has('skills') && (v.skill_groups.length || em)
		? `<section id="skills" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Capabilities</span></div>
<h2 class="d-sec-title">Tools, <em>well-worn</em>.</h2>
</div>
<div class="d-sec-num">Skills</div>
</div>
<div class="d-skill-grid">
${v.skill_groups.map((g, gi) => `<div class="d-skill-col reveal">
<h5>(${String.fromCharCode(97 + gi)}) ${g.category}</h5>
<ul class="d-skill-list" ${le(`skills.${gi}.skills`)}>
${g.skills.map(s => `<li>${s}</li>`).join('')}
</ul>
</div>`).join('\n')}
</div>
</section>`
		: '';

	// ── DESIGN PHILOSOPHY ────────────────────────────────────────────────────
	const designPhilosophyHtml = !hidden.has('design_philosophy') && (v.design_philosophy || em)
		? `<section id="design-philosophy" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Philosophy</span></div>
<h2 class="d-sec-title">The <em>why</em> behind the work.</h2>
</div>
<div class="d-sec-num">Design Thinking</div>
</div>
<div class="d-philosophy">
<p ${ed('design_philosophy', true)}>${v.design_philosophy || ''}</p>
</div>
</section>`
		: '';

	// ── SOFTWARE PROFICIENCY ─────────────────────────────────────────────────
	const softwareProficiencyHtml = !hidden.has('software_proficiency') && (v.software_proficiency?.length || em)
		? `<section id="software-proficiency" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Toolkit</span></div>
<h2 class="d-sec-title">Software, <em>mastered</em>.</h2>
</div>
<div class="d-sec-num">Tools</div>
</div>
<div class="d-tools" ${le('software_proficiency')}>
${(v.software_proficiency ?? []).map(t => `<span class="d-tool-tag">${t}</span>`).join('')}
</div>
${em ? '<p style="font-size:12px;color:var(--ink-dim);margin-top:14px;font-family:var(--mono)">Click tags to edit list</p>' : ''}
</section>`
		: '';

	// ── AWARDS ───────────────────────────────────────────────────────────────
	const awardsHtml = !hidden.has('awards') && (v.awards?.length || em)
		? `<section id="awards" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Recognition</span></div>
<h2 class="d-sec-title">Said, <em>kindly</em>.</h2>
</div>
<div class="d-sec-num">Awards</div>
</div>
<div class="d-awards">
${(v.awards ?? []).map((a, i) => `<div class="d-award-row"${iw}>
${delBtn('awards', i)}
<div class="d-award-title" ${ed(`awards.${i}.title`)}>${a.title}</div>
<div class="d-award-body" ${ed(`awards.${i}.awarding_body`)}>${a.awarding_body}</div>
<div class="d-award-year" ${ed(`awards.${i}.year`)}>${a.year}</div>
${a.url ? `<a href="${a.url}" class="d-award-link" target="_blank" rel="noopener noreferrer">&#8599;</a>` : ''}
</div>`).join('\n')}
</div>
${addBtn('awards', 'Award')}
</section>`
		: '';

	// ── EDUCATION ────────────────────────────────────────────────────────────
	const educationHtml = !hidden.has('education') && (v.education.length || em)
		? `<section id="education" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Formation</span></div>
<h2 class="d-sec-title">Where it <em>began</em>.</h2>
</div>
<div class="d-sec-num">Education</div>
</div>
<div class="d-edu-list">
${v.education.map((edu, i) => `<div class="d-edu-row"${iw}>
${delBtn('education', i)}
<div>
<div class="d-edu-degree">${_pairEditable(`education.${i}.degree`, edu.degree, `education.${i}.field_of_study`, edu.field_of_study, em, ' in ')}</div>
<div class="d-edu-inst" ${ed(`education.${i}.institution`)}>${edu.institution}</div>
${edu.grade_or_score ? `<div class="d-edu-grade" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</div>` : ''}
</div>
<div class="d-edu-year">${edu.start_year ? `<span ${ed(`education.${i}.start_year`)}>${edu.start_year}</span>` : (em ? `<span ${ed(`education.${i}.start_year`)}>Start</span>` : '')}${(edu.start_year && edu.end_year) ? ' – ' : ''}${edu.end_year ? `<span ${ed(`education.${i}.end_year`)}>${edu.end_year}</span>` : (em ? `<span ${ed(`education.${i}.end_year`)}>End</span>` : '')}</div>
</div>`).join('\n')}
</div>
${addBtn('education', 'Education')}
</section>`
		: '';

	// ── CERTIFICATIONS ────────────────────────────────────────────────────────
	const certificationsHtml = !hidden.has('certifications') && (v.certifications.length || em)
		? `<section id="certifications" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Credentials</span></div>
<h2 class="d-sec-title">Formally <em>recognized</em>.</h2>
</div>
<div class="d-sec-num">Certifications</div>
</div>
<div class="d-cert-list">
${v.certifications.map((c, i) => `<div class="d-cert-card"${iw}>
${delBtn('certifications', i)}
<div class="d-cert-name" ${ed(`certifications.${i}.name`)}>${c.name}</div>
<div class="d-cert-issuer" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</div>
${c.year ? `<div class="d-cert-year" ${ed(`certifications.${i}.year`)}>${c.year}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>`
		: '';

	// ── ACHIEVEMENTS ─────────────────────────────────────────────────────────
	const achievementsHtml = !hidden.has('achievements') && (v.achievements.length || em)
		? `<section id="achievements" class="d-sec">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Milestones</span></div>
<h2 class="d-sec-title">Moments that <em>mattered</em>.</h2>
</div>
<div class="d-sec-num">Achievements</div>
</div>
<div class="d-ach-list">
${v.achievements.map((a, i) => `<div class="d-ach-row"${iw}>
${delBtn('achievements', i)}
<div>
<div class="d-ach-title" ${ed(`achievements.${i}.title`)}>${a.title}</div>
${a.description ? `<div class="d-ach-desc" ${ed(`achievements.${i}.description`, true)}>${a.description}</div>` : ''}
</div>
${a.year ? `<div class="d-ach-year" ${ed(`achievements.${i}.year`)}>${a.year}</div>` : ''}
</div>`).join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>`
		: '';

	// ── CUSTOM SECTIONS ───────────────────────────────────────────────────────
	const customSections = customSectionsHtml(v, em);

	// ── CONTACT (always last) ─────────────────────────────────────────────────
	const socialLinks = [
		v.linkedin_url ? `<a href="${v.linkedin_url}" class="d-social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : '',
		v.github_url ? `<a href="${v.github_url}" class="d-social-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
		v.portfolio_url ? `<a href="${v.portfolio_url}" class="d-social-link" target="_blank" rel="noopener noreferrer">Portfolio</a>` : '',
		v.twitter_url ? `<a href="${v.twitter_url}" class="d-social-link" target="_blank" rel="noopener noreferrer">Twitter</a>` : '',
	].filter(Boolean).join('\n');

	// ── SECTION ORDER ─────────────────────────────────────────────────────────
	const sectionRenderers: Record<string, string> = {
		experience: experienceHtml,
		projects: projectsHtml,
		skills: skillsHtml,
		design_philosophy: designPhilosophyHtml,
		software_proficiency: softwareProficiencyHtml,
		awards: awardsHtml,
		education: educationHtml,
		certifications: certificationsHtml,
		achievements: achievementsHtml,
		custom_sections: customSections,
	};

	const orderedSections = order
		.filter(key => !hidden.has(key) && key in sectionRenderers)
		.map(key => sectionRenderers[key])
		.filter(Boolean)
		.join('\n');

	// ── CURSOR + INTERACTIVE JS (runs in both edit preview and published page) ─
	const cursorCss = 'body{cursor:none}';
	// Fallback so content is visible before the reveal observer fires on first paint.
	const editRevealCss = '.reveal{opacity:1;transform:none}';
	const cursorHtml = '<div class="d-cursor" id="d-cursor"></div><div class="d-cursor-dot" id="d-cursor-dot"></div>';
	const interactiveJs = `<script>
(function(){
  var cur=document.getElementById('d-cursor'),dot=document.getElementById('d-cursor-dot');
  if(!cur)return;
  var mx=window.innerWidth/2,my=window.innerHeight/2,cx=mx,cy=my;
  window.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';});
  if(window.__dRAF)cancelAnimationFrame(window.__dRAF);
  function tick(){cx+=(mx-cx)*0.18;cy+=(my-cy)*0.18;cur.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';window.__dRAF=requestAnimationFrame(tick);}
  tick();
  document.querySelectorAll('a,button,.d-work-item').forEach(function(el){
    el.addEventListener('mouseenter',function(){cur.classList.add('is-hover');});
    el.addEventListener('mouseleave',function(){cur.classList.remove('is-hover');});
  });
})();
(function(){
  var els=Array.from(document.querySelectorAll('.reveal'));
  function check(){var vh=window.innerHeight;for(var i=els.length-1;i>=0;i--){var r=els[i].getBoundingClientRect();if(r.top<vh*0.9&&r.bottom>0){els[i].classList.add('in');els.splice(i,1);}}}
  window.addEventListener('scroll',check,{passive:true});
  window.addEventListener('resize',check);
  check();setTimeout(check,400);
})();
var prog=document.getElementById('d-prog');
if(prog)window.addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-window.innerHeight;prog.style.width=((window.scrollY/h)*100)+'%';},{passive:true});
</script>`;

	// ── ABOUT BIO (always in hero) ────────────────────────────────────────────
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v.name} — Designer Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_URL}" rel="stylesheet">
<style>${css()}${cursorCss}${editRevealCss}</style>
${em ? EDITOR_SCRIPT : ''}
</head>
<body>
<div class="d-progress" id="d-prog"></div>
${cursorHtml}

<!-- NAV -->
<nav class="d-nav">
<a href="#top" class="logo" ${ed('profile.full_name')}>${v.name}</a>
<ul>
<li><a href="#projects">Work</a></li>
<li><a href="#experience">Index</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
</nav>

<!-- HERO -->
<header class="d-hero" id="top">
<div class="meta">
<span ${ed('profile.location')}>${v.location || 'Designer'}</span>
<span>Portfolio</span>
<span>&copy; ${new Date().getFullYear()} ${v.name}</span>
</div>

<h1>
<span ${ed('profile.full_name')}>${v.name}</span><br>
<span class="it" ${ed('portfolio.headline')}>${v.headline || v.profile_headline || 'Designer &amp; creator'}</span>
</h1>

<div class="d-hero-row">
<div class="d-lede">
<em>— Manifesto</em>
<span ${ed('portfolio.bio', true)}>${v.bio || 'Creative professional building thoughtful digital experiences.'}</span>
</div>
${statShown(v, 'years_experience', yearsExp) ? `<div class="d-stat">
<span class="n" ${ed('template_overrides.years_experience')}>${yearsExp}</span>
<span class="l">Years active</span>
</div>` : ''}
${statShown(v, 'projects_count', projectsCount) ? `<div class="d-stat">
<span class="n" ${ed('template_overrides.projects_count')}>${projectsCount}</span>
<span class="l">Shipped projects</span>
</div>` : ''}
</div>

<div class="scroll-cue"><span>Scroll</span><span class="bar"></span><span>continue</span></div>
</header>

<!-- SKILLS MARQUEE -->
${allSkills.length ? `<div class="d-marquee" aria-hidden="true">
<div class="track">${marqueeTrack}</div>
</div>` : ''}

<!-- ABOUT -->
<section class="d-sec" id="about">
<div class="d-sec-head">
<div>
<div class="d-eyebrow"><span class="dot"></span><span>Introduction</span></div>
<h2 class="d-sec-title">A studio built on <em>care</em>.</h2>
</div>
<div class="d-sec-num">About</div>
</div>
<div class="d-about-grid reveal">
<div>
<p ${ed('portfolio.uniqueValue', true)}>${v.uniqueValue || 'I create brand systems, products, and software that feel deliberate — never noisy, never disposable.'}</p>
</div>
<div class="d-about-side">
${v.location ? `<div class="d-about-row"><span class="d-about-k">Based in</span><span class="d-about-v" ${ed('profile.location')}>${v.location}</span></div>` : ''}
${v.email ? `<div class="d-about-row"><span class="d-about-k">Email</span><span class="d-about-v"><a href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a></span></div>` : ''}
${v.phone ? `<div class="d-about-row"><span class="d-about-k">Phone</span><span class="d-about-v" ${ed('profile.phone')}>${v.phone}</span></div>` : ''}
</div>
</div>
</section>

<!-- ORDERED SECTIONS -->
${orderedSections}

<!-- CONTACT -->
<section class="d-contact" id="contact">
<div class="d-eyebrow"><span class="dot"></span><span>Let's begin</span></div>
<div class="big">
Have a <em>bold</em><br>
project? Let's<br>
make something<br>
that <em>lasts.</em>
</div>
<div class="d-contact-row">
<div class="d-contact-info">
${v.email ? `<div class="d-contact-item">Email — <a href="mailto:${v.email}" ${ed('profile.email')}>${v.email}</a></div>` : ''}
${v.phone ? `<div class="d-contact-item">Phone — <a href="tel:${v.phone}" ${ed('profile.phone')}>${v.phone}</a></div>` : ''}
</div>
<div>${socialLinks ? `<div class="d-social-links">${socialLinks}</div>` : ''}</div>
</div>
</section>

<!-- FOOTER -->
<footer class="d-foot">
<span>&copy; ${new Date().getFullYear()} ${v.name}. All rights reserved.</span>
<span style="color:var(--accent)">Designer Portfolio</span>
</footer>

${interactiveJs}
</body>
</html>`;
}
