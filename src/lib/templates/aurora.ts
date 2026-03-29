/**
 * Template: Aurora
 * Aurora borealis aesthetic. Deep gradient background, glassmorphism cards.
 * Typography: Syne + DM Sans. No JavaScript — 100% CSS animations.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap';

function css(): string {
	return `
/* ── Aurora Template ─────────────────────────────────────────── */

:root {
    --em:      #4ade80;
    --em-dim:  rgba(74,222,128,0.12);
    --em-glow: rgba(74,222,128,0.35);
    --cy:      #22d3ee;
    --cy-dim:  rgba(34,211,238,0.10);
    --glass:   rgba(255,255,255,0.07);
    --glass-b: rgba(255,255,255,0.12);
    --glass-h: rgba(255,255,255,0.12);
    --text:    #f0f9ff;
    --muted:   rgba(226,232,240,0.72);
    --dark-bg: #0f172a;
}

*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }

body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(-45deg, #0d1b2a, #0a4a4a, #1a0a3e, #0d2d5e, #063b2f, #1e1040);
    background-size: 400% 400%;
    color: var(--text); line-height: 1.65;
    overflow-x: hidden; position: relative; min-height: 100vh;
    animation: aurora-shift 14s ease infinite;
}
@keyframes aurora-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.bubble {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    border: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
}
.b1 { width:380px; height:380px; top:-80px; right:10%; background:rgba(74,222,128,0.04); animation:bubble-drift 22s ease-in-out infinite alternate; }
.b2 { width:260px; height:260px; bottom:15%; left:-60px; background:rgba(34,211,238,0.05); animation:bubble-drift 18s ease-in-out infinite alternate-reverse; animation-delay:-5s; }
.b3 { width:160px; height:160px; top:40%; right:5%; background:rgba(139,92,246,0.06); animation:bubble-drift 14s ease-in-out infinite alternate; animation-delay:-9s; }
.b4 { width:90px; height:90px; top:20%; left:15%; background:rgba(74,222,128,0.05); animation:bubble-drift 10s ease-in-out infinite alternate-reverse; animation-delay:-3s; }
@keyframes bubble-drift {
    0%   { transform: translate(0,0) scale(1) rotate(0deg); }
    33%  { transform: translate(18px,-22px) scale(1.04) rotate(5deg); }
    66%  { transform: translate(-12px,14px) scale(0.97) rotate(-3deg); }
    100% { transform: translate(10px,20px) scale(1.02) rotate(2deg); }
}

.container { max-width: 860px; margin: 0 auto; padding: 0 1.75rem; position: relative; z-index: 1; }

.hero { padding: 7rem 0 5rem; text-align: center; position: relative; z-index: 1; }
.hero-tag {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--em); background: rgba(74,222,128,0.1);
    border: 1px solid rgba(74,222,128,0.25);
    padding: 0.3rem 0.9rem; border-radius: 20px; margin-bottom: 1.75rem;
}
.hero-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.8rem,9vw,5.5rem); font-weight: 800;
    letter-spacing: -0.03em; line-height: 1.0; color: #fff;
    text-shadow: 0 0 60px rgba(74,222,128,0.3), 0 0 120px rgba(34,211,238,0.15);
    margin-bottom: 1.1rem;
}
.hero-headline { font-size: 1.2rem; font-weight: 300; color: var(--muted); margin-bottom: 0.5rem; }
.hero-location { font-size: 0.9rem; color: rgba(226,232,240,0.5); margin-bottom: 2.25rem; }
.hero-links { display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }
.hero-links a {
    text-decoration: none; font-family: 'Syne', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    padding: 0.6rem 1.4rem; border-radius: 8px;
    border: 1px solid var(--glass-b); color: var(--text);
    background: var(--glass); backdrop-filter: blur(16px);
    transition: border-color 0.22s, background 0.22s, transform 0.18s, box-shadow 0.22s;
}
.hero-links a:hover {
    border-color: var(--em); background: var(--em-dim); color: var(--em);
    box-shadow: 0 0 24px var(--em-glow); transform: translateY(-2px);
}

.wave-sep { width: 100%; line-height: 0; position: relative; z-index: 1; margin-top: -2px; }
.wave-sep svg { width: 100%; height: 60px; display: block; }

main { background: var(--dark-bg); padding: 4rem 0 5rem; position: relative; z-index: 1; }
section { margin-bottom: 4rem; animation: fade-up 0.6s ease-out both; }
@keyframes fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}

h2 {
    font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700;
    background: linear-gradient(135deg, var(--em), var(--cy));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    filter: drop-shadow(0 0 16px rgba(74,222,128,0.25));
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.75rem;
}
h2::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(74,222,128,0.3), rgba(34,211,238,0.1), transparent);
}

.bio { font-size: 1.05rem; color: var(--muted); line-height: 1.9; font-weight: 300; }
.glass-panel {
    background: var(--glass); border: 1px solid var(--glass-b);
    border-radius: 16px; padding: 1.75rem 2rem;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
}

.skill-group { margin-bottom: 1rem; }
.skill-group-label {
    font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 600;
    color: var(--em); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.4rem;
}
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-tag {
    font-family: 'Syne', sans-serif; font-size: 0.78rem; font-weight: 600;
    padding: 0.38rem 0.95rem; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1); color: rgba(226,232,240,0.7);
    background: rgba(255,255,255,0.05); backdrop-filter: blur(8px);
    cursor: default; transition: border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.skill-tag:hover {
    border-color: var(--em); color: var(--em);
    background: var(--em-dim); box-shadow: 0 0 16px var(--em-glow); transform: translateY(-2px);
}

.card {
    background: var(--glass); border: 1px solid var(--glass-b);
    border-radius: 14px; padding: 1.6rem 1.8rem; margin-bottom: 1rem;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    transition: background 0.25s, border-color 0.25s, transform 0.2s, box-shadow 0.25s;
}
.card:hover {
    background: var(--glass-h); border-color: rgba(74,222,128,0.3);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 20px var(--em-glow);
}
.card-title {
    font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    color: var(--text); margin-bottom: 0.2rem;
}
.card-sub { opacity: 0.55; font-weight: 400; }
.card-meta { font-size: 0.78rem; font-weight: 500; color: var(--em); letter-spacing: 0.04em; margin-bottom: 0.75rem; }
.card-body { font-size: 0.92rem; color: var(--muted); line-height: 1.75; font-weight: 300; }
.card-list { margin-top: 0.65rem; padding-left: 0; list-style: none; }
.card-list li {
    font-size: 0.88rem; color: var(--muted); margin-bottom: 0.3rem;
    padding-left: 1.1rem; position: relative; font-weight: 300;
}
.card-list li::before { content: '▸'; position: absolute; left: 0; color: var(--em); font-size: 0.7rem; top: 0.1em; }

.tech-tag {
    font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 4px;
    background: rgba(74,222,128,0.1); color: var(--em);
    border: 1px solid rgba(74,222,128,0.2);
}

.cert-row {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 0.25rem;
    padding: 0.75rem 1.25rem; margin-bottom: 0.5rem;
    background: var(--glass); border: 1px solid var(--glass-b); border-radius: 8px;
    backdrop-filter: blur(12px);
}
.cert-name { font-size: 0.95rem; font-weight: 500; }
.cert-meta { font-size: 0.8rem; color: var(--em); }

.philosophy { font-size: 1.05rem; color: var(--muted); line-height: 1.85; font-weight: 300; }

.ip-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.4rem; }
.ip-stat { font-size: 0.85rem; color: var(--muted); }
.ip-stat strong { color: var(--em); }

footer { background: var(--dark-bg); padding: 3rem 0; text-align: center; position: relative; z-index: 1; border-top: 1px solid rgba(255,255,255,0.06); }
.footer-text { font-size: 0.8rem; color: rgba(226,232,240,0.35); letter-spacing: 0.05em; }

@media (max-width: 640px) {
    .hero { padding: 4rem 0 3rem; }
    .hero-name { font-size: 2.4rem; }
    .card { padding: 1.25rem; }
    .b1, .b2, .b3, .b4 { display: none; }
}
`;
}

function section(title: string, content: string): string {
	if (!content) return '';
	return `<section><h2>${title}</h2>${content}</section>`;
}

function about(v: NormalizedData): string {
	if (!v.bio) return '';
	return `<div class="glass-panel"><p class="bio" ${_editable('portfolio.bio', true)}>${v.bio}</p></div>`;
}

function skills(v: NormalizedData): string {
	const groups = v.skill_groups.map((g, i) => {
		const tags = g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('');
		if (!g.category && !tags) return '';
		return (
			`<div class="skill-group" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="skills" data-del-index="${i}">×</button>` +
			(g.category ? `<p class="skill-group-label" ${_editable(`skills.${i}.category`)}>${g.category}</p>` : '') +
			(tags ? `<div class="tag-row" ${_listEditable(`skills.${i}.skills`)}>${tags}</div>` : '') +
			`</div>`
		);
	}).filter(Boolean).join('');
	if (!groups) return '';
	return groups + `<button class="ce-add-btn" data-add-section="skills">+ Add Skill Group</button>`;
}

function experience(v: NormalizedData): string {
	if (!v.experience.length) return '';
	const items = v.experience.map((exp, i) => {
		const metaParts = [exp.duration, exp.location].filter(Boolean);
		const meta = metaParts.join(' · ');
		const points = exp.key_points.map((p) => `<li>${p}</li>`).join('');
		return (
			`<div class="card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">×</button>` +
			`<p class="card-title"><span ${_editable(`experience.${i}.role`)}>${exp.role}</span> <span class="card-sub">at <span ${_editable(`experience.${i}.company`)}>${exp.company}</span></span></p>` +
			`<p class="card-meta">${meta}</p>` +
			(exp.description ? `<p class="card-body" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : '') +
			(points ? `<ul class="card-list" ${_listEditable(`experience.${i}.key_points`)}>${points}</ul>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>`;
}

function education(v: NormalizedData): string {
	if (!v.education.length) return '';
	const items = v.education.map((edu, i) => {
		let degree = edu.degree;
		if (edu.field_of_study) degree = `${degree} in ${edu.field_of_study}`;
		const metaParts = [edu.institution, edu.year_range].filter(Boolean);
		const meta = metaParts.join(' · ');
		return (
			`<div class="card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">×</button>` +
			`<p class="card-title" ${_editable(`education.${i}.degree`)}>${degree}</p>` +
			`<p class="card-meta">${meta}</p>` +
			(edu.grade_or_score ? `<p class="card-body">${edu.grade_or_score}</p>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="education">+ Add Education</button>`;
}

function projects(v: NormalizedData): string {
	if (!v.projects.length) return '';
	const items = v.projects.map((p, i) => {
		const url = p.project_url || p.github_repo;
		const link = url
			? ` <a href="${url}" target="_blank" rel="noopener noreferrer" style="font-size:0.78rem;color:var(--em);text-decoration:none;border:1px solid rgba(74,222,128,0.35);padding:0.15rem 0.55rem;border-radius:4px;">Link</a>`
			: '';
		const tags = (p.tech_stack.length ? p.tech_stack : p.software_used).map((t) => `<span class="tech-tag">${t}</span>`).join('');
		const respLis = p.responsibilities.map((r) => `<li>${r}</li>`).join('');
		const outcomeLis = p.measurable_outcomes.map((o) => `<li>${o}</li>`).join('');
		return (
			`<div class="card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">×</button>` +
			`<p class="card-title"><span ${_editable(`projects.${i}.title`)}>${p.title}</span>${link}</p>` +
			(p.description ? `<p class="card-body" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : '') +
			(tags ? `<div class="tag-row" style="margin-top:0.5rem" ${_listEditable(`projects.${i}.tech_stack`)}>${tags}</div>` : '') +
			(respLis ? `<ul class="card-list" ${_listEditable(`projects.${i}.responsibilities`)}>${respLis}</ul>` : '') +
			(outcomeLis ? `<ul class="card-list" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${outcomeLis}</ul>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="projects">+ Add Project</button>`;
}

function certifications(v: NormalizedData): string {
	if (!v.certifications.length) return '';
	const items = v.certifications.map((c, i) => {
		const metaParts = [c.issuer, c.year].filter(Boolean);
		const meta = metaParts.join(' · ');
		return (
			`<div class="cert-row" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="certifications" data-del-index="${i}">×</button>` +
			`<span class="cert-name" ${_editable(`certifications.${i}.name`)}>${c.name}</span>` +
			(meta ? `<span class="cert-meta">${meta}</span>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="certifications">+ Add Certification</button>`;
}

function achievements(v: NormalizedData): string {
	if (!v.achievements.length) return '';
	const items = v.achievements.map((a, i) => (
		`<div class="card" data-item-wrap>` +
		`<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">×</button>` +
		`<p class="card-title" ${_editable(`achievements.${i}.title`)}>${a.title}</p>` +
		(a.description ? `<p class="card-body" ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : '') +
		`</div>`
	)).join('');
	return items + `<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>`;
}

function awards(v: NormalizedData): string {
	if (!v.awards.length) return '';
	const items = v.awards.map((a, i) => {
		const meta = [a.awarding_body, a.year].filter(Boolean).join(' · ');
		return (
			`<div class="card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="awards" data-del-index="${i}">×</button>` +
			`<p class="card-title" ${_editable(`awards.${i}.title`)}>${a.title}</p>` +
			(meta ? `<p class="card-meta">${meta}</p>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="awards">+ Add Award</button>`;
}

function designPhilosophy(v: NormalizedData): string {
	return v.design_philosophy ? `<div class="glass-panel"><p class="philosophy" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p></div>` : '';
}

function softwareProficiency(v: NormalizedData): string {
	if (!v.software_proficiency.length) return '';
	const tags = v.software_proficiency.map((s) => `<span class="skill-tag">${s}</span>`).join('');
	return `<div class="tag-row">${tags}</div>`;
}

function campaigns(v: NormalizedData): string {
	if (!v.campaigns.length) return '';
	const items = v.campaigns.map((c, i) => {
		const channels = c.channels_used.join(', ');
		const budget = c.budget;
		const metaParts = [c.campaign_type, budget ? `Budget: ${budget}` : '', channels ? `Channels: ${channels}` : ''].filter(Boolean);
		const meta = metaParts.join(' · ');
		const metrics = c.performance_metrics.map((m) => `<li>${m}</li>`).join('');
		return (
			`<div class="card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="campaigns" data-del-index="${i}">×</button>` +
			`<p class="card-title" ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</p>` +
			(meta ? `<p class="card-meta">${meta}</p>` : '') +
			(metrics ? `<ul class="card-list" ${_listEditable(`campaigns.${i}.performance_metrics`)}>${metrics}</ul>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="campaigns">+ Add Campaign</button>`;
}

function financialModeling(v: NormalizedData): string {
	if (!v.financial_modeling.length) return '';
	const items = v.financial_modeling.map((fm, i) => {
		const tools = fm.tools_used.map((t) => `<span class="tech-tag">${t}</span>`).join('');
		return (
			`<div class="card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">×</button>` +
			`<p class="card-title" ${_editable(`financial_modeling.${i}.model_type`)}>${fm.model_type}</p>` +
			(tools ? `<div class="tag-row" style="margin:0.5rem 0" ${_listEditable(`financial_modeling.${i}.tools_used`)}>${tools}</div>` : '') +
			(fm.outcome ? `<p class="card-body" ${_editable(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="financial_modeling">+ Add Model</button>`;
}

function investmentPortfolios(v: NormalizedData): string {
	if (!v.investment_portfolios.length) return '';
	const items = v.investment_portfolios.map((ip, i) => (
		`<div class="card" data-item-wrap>` +
		`<button class="ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">×</button>` +
		`<p class="card-title" ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type}</p>` +
		`<div class="ip-stats">` +
		(ip.assets_under_management ? `<span class="ip-stat"><strong>AUM:</strong> ${ip.assets_under_management}</span>` : '') +
		(ip.performance_return ? `<span class="ip-stat"><strong>Return:</strong> ${ip.performance_return}</span>` : '') +
		`</div></div>`
	)).join('');
	return items + `<button class="ce-add-btn" data-add-section="investment_portfolios">+ Add Portfolio</button>`;
}

const SECTION_RENDERERS: Record<string, [string, (v: NormalizedData) => string]> = {
	experience: ['Experience', experience],
	projects: ['Projects', projects],
	skills: ['Skills', skills],
	education: ['Education', education],
	certifications: ['Certifications', certifications],
	achievements: ['Achievements', achievements],
	awards: ['Awards', awards],
	campaigns: ['Campaigns', campaigns],
	financial_modeling: ['Financial Modeling', financialModeling],
	investment_portfolios: ['Investment Portfolios', investmentPortfolios],
	design_philosophy: ['Design Philosophy', designPhilosophy],
	software_proficiency: ['Software Proficiency', softwareProficiency]
};

export function html(v: NormalizedData): string {
	let links = '';
	if (v.linkedin_url) links += `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
	if (v.github_url) links += `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
	if (v.portfolio_url) links += `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>`;
	if (v.email) links += `<a href="mailto:${v.email}">Email</a>`;
	const locationHtml = v.location
		? `<p class="hero-location"><span ${_editable('profile.location')}>${v.location}</span>${v.phone ? ` · <span ${_editable('profile.phone')}>${v.phone}</span>` : ''}</p>`
		: '';

	const order = v.section_order.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections;
	const aboutHtml = section('About', about(v));
	const contentSections = order
		.filter((key) => !hidden.has(key) && key in SECTION_RENDERERS)
		.map((key) => {
			const [label, renderer] = SECTION_RENDERERS[key];
			return section(label, renderer(v));
		}).filter(Boolean).join('\n');
	const sections = [aboutHtml, contentSections].filter(Boolean).join('\n');

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${v.name} - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${FONTS_URL}" rel="stylesheet">
    <style>${css()}</style>
</head>
<body>
    <div class="bubble b1" aria-hidden="true"></div>
    <div class="bubble b2" aria-hidden="true"></div>
    <div class="bubble b3" aria-hidden="true"></div>
    <div class="bubble b4" aria-hidden="true"></div>

    <header class="hero">
        <div class="container">
            <div class="hero-tag">Portfolio</div>
            <h1 class="hero-name" ${_editable('profile.full_name')}>${v.name}</h1>
            <p class="hero-headline" ${_editable('profile.headline')}>${v.headline}</p>
            ${locationHtml}
            <div class="hero-links">${links}</div>
        </div>
    </header>

    <div class="wave-sep" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="rgba(15,23,42,0.9)"/>
        </svg>
    </div>

    <main class="container">
        ${sections}
    </main>

    <footer>
        <div class="container">
            <p class="footer-text">Built with AI Portfolio Builder</p>
        </div>
    </footer>
${EDITOR_SCRIPT}
</body>
</html>`;
}
