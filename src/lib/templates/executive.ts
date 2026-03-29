/**
 * Template: Executive (Premium)
 * Dark green gradient hero. Gold H2 headings. Timeline experience. Formal, refined.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

function css(): string {
	return `
/* ============================================================
   Executive Template — dark green hero, gold accents, formal
   ============================================================ */

:root {
    --green:        #166534;
    --green-dark:   #14532d;
    --gold:         #b45309;
    --gold-light:   #d97706;
    --text:         #1c1917;
    --text-light:   #57534e;
    --bg:           #fafaf9;
    --bg-alt:       #f5f5f4;
    --border:       #d6d3d1;
    --border-light: #e7e5e4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.65; color: var(--text); background: var(--bg);
}

.container { max-width: 820px; margin: 0 auto; padding: 0 1.75rem; }

.hero {
    background: linear-gradient(140deg, var(--green-dark) 0%, var(--green) 100%);
    color: white; padding: 5rem 0 4rem;
}
.hero-label {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 1rem;
}
.hero h1 {
    font-size: 2.75rem; font-weight: 700; letter-spacing: -0.025em;
    margin-bottom: 0.5rem; line-height: 1.15;
}
.headline { font-size: 1.1rem; color: rgba(255,255,255,0.8); margin-bottom: 2rem; font-weight: 300; }
.hero-meta { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.location { font-size: 0.875rem; color: rgba(255,255,255,0.65); }
.links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.links a {
    color: white; text-decoration: none; font-size: 0.85rem; font-weight: 500;
    padding: 0.4rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px;
    letter-spacing: 0.02em; transition: all 0.25s;
}
.links a:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.6); transform: translateY(-1px); }

main { padding: 4rem 0; }
section { margin-bottom: 4rem; }

h2 {
    font-size: 1.3rem; font-weight: 600; color: var(--gold);
    margin-bottom: 1.75rem; position: relative; padding-bottom: 0.6rem;
    display: inline-block;
}
h2::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 2px; background: var(--gold);
    transition: width 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
}
section:hover h2::after { width: 100%; }

.about-text { font-size: 1.05rem; color: var(--text-light); line-height: 1.85; max-width: 700px; }

.skill-group { margin-bottom: 1rem; }
.skill-group-label { font-size: 0.78rem; font-weight: 600; color: var(--gold); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-tag {
    background: var(--bg-alt); color: var(--text-light);
    padding: 0.35rem 0.85rem; border-radius: 4px;
    font-size: 0.85rem; border: 1px solid var(--border); transition: all 0.2s;
}
.skill-tag:hover { border-color: var(--gold); color: var(--gold); background: #fef3c7; }

.timeline { position: relative; padding-left: 1.5rem; }
.timeline::before {
    content: ''; position: absolute; left: 0; top: 6px; bottom: 0;
    width: 2px; background: var(--border-light);
}
.exp-item { position: relative; padding-left: 1.5rem; margin-bottom: 2.5rem; transition: padding-left 0.2s; }
.exp-item::before {
    content: ''; position: absolute; left: -1.5rem; top: 6px;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--border); border: 2px solid var(--bg);
    transition: background 0.2s, box-shadow 0.2s;
}
.exp-item:hover::before { background: var(--gold); box-shadow: 0 0 0 3px rgba(180,83,9,0.15); }
.exp-role { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.1rem; }
.exp-company { font-size: 0.9rem; color: var(--gold); font-weight: 500; }
.exp-meta { font-size: 0.8rem; color: var(--gold); font-weight: 500; margin-bottom: 0.6rem; letter-spacing: 0.04em; }
.exp-desc { color: var(--text-light); font-size: 0.93rem; margin-bottom: 0.4rem; }
.exp-points { padding-left: 1.1rem; }
.exp-points li { color: var(--text-light); font-size: 0.88rem; margin-bottom: 0.2rem; }

.edu-item {
    background: var(--bg-alt); border-radius: 6px; padding: 1.25rem 1.5rem;
    margin-bottom: 1rem; border-left: 3px solid var(--gold); transition: box-shadow 0.2s;
}
.edu-item:hover { box-shadow: 0 4px 12px rgba(180,83,9,0.08); }
.edu-item h3 { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.2rem; }
.edu-meta { font-size: 0.85rem; color: var(--gold); font-weight: 500; }
.edu-grade { font-size: 0.85rem; color: var(--text-light); margin-top: 0.2rem; }

.content-card {
    background: var(--bg-alt); border-radius: 6px; padding: 1.25rem 1.5rem;
    margin-bottom: 1rem; border-left: 3px solid var(--gold); transition: box-shadow 0.2s;
}
.content-card:hover { box-shadow: 0 4px 12px rgba(180,83,9,0.08); }
.content-card h3 { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.25rem; }
.card-meta { font-size: 0.82rem; color: var(--gold); font-weight: 500; margin-bottom: 0.4rem; }
.card-body { font-size: 0.9rem; color: var(--text-light); line-height: 1.7; }
.card-list { padding-left: 1.1rem; margin-top: 0.4rem; }
.card-list li { font-size: 0.875rem; color: var(--text-light); margin-bottom: 0.2rem; }

.tech-tag {
    font-size: 0.75rem; padding: 0.2rem 0.55rem; border-radius: 3px;
    background: #fef3c7; color: var(--gold); border: 1px solid #fde68a;
}

.cert-item {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 0.25rem;
    padding: 0.75rem 1rem; margin-bottom: 0.5rem;
    background: var(--bg-alt); border-left: 3px solid var(--gold); border-radius: 4px;
}
.cert-name { font-size: 0.95rem; font-weight: 500; color: var(--text); }
.cert-meta { font-size: 0.8rem; color: var(--text-light); }

.ach-item, .award-item {
    padding: 1rem 1.25rem; background: var(--bg-alt); border-radius: 6px;
    border-left: 3px solid var(--gold); margin-bottom: 0.6rem;
}
.ach-item h3, .award-item h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem; }
.ach-item p, .award-item p { font-size: 0.875rem; color: var(--text-light); }
.award-body { font-size: 0.8rem; color: var(--gold); font-weight: 500; margin-bottom: 0.1rem; }

.philosophy { font-size: 1.05rem; color: var(--text-light); line-height: 1.85; }

.ip-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.4rem; }
.ip-stat { font-size: 0.85rem; color: var(--text-light); }
.ip-stat strong { color: var(--gold); }

footer {
    background: var(--bg-alt); border-top: 1px solid var(--border);
    padding: 2rem 0; text-align: center; color: var(--text-light); font-size: 0.8rem;
}

@media (max-width: 640px) {
    .hero h1 { font-size: 2rem; }
    .hero-meta { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    .timeline { padding-left: 1rem; }
}
`;
}

function section(title: string, content: string): string {
	if (!content) return '';
	return `<section><h2>${title}</h2>${content}</section>`;
}

function about(v: NormalizedData): string {
	return v.bio ? `<p class="about-text" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : '';
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
			`<div class="exp-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">×</button>` +
			`<p class="exp-role" ${_editable(`experience.${i}.role`)}>${exp.role}</p>` +
			`<p class="exp-company" ${_editable(`experience.${i}.company`)}>${exp.company}</p>` +
			`<p class="exp-meta">${meta}</p>` +
			(exp.description ? `<p class="exp-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : '') +
			(points ? `<ul class="exp-points" ${_listEditable(`experience.${i}.key_points`)}>${points}</ul>` : '') +
			`</div>`
		);
	}).join('');
	return `<div class="timeline">${items}</div><button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>`;
}

function education(v: NormalizedData): string {
	if (!v.education.length) return '';
	const items = v.education.map((edu, i) => {
		let degree = edu.degree;
		if (edu.field_of_study) degree = `${degree} in ${edu.field_of_study}`;
		const metaParts = [edu.institution, edu.year_range].filter(Boolean);
		return (
			`<div class="edu-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`education.${i}.degree`)}>${degree}</h3>` +
			`<p class="edu-meta">${metaParts.join(' · ')}</p>` +
			(edu.grade_or_score ? `<p class="edu-grade">${edu.grade_or_score}</p>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="education">+ Add Education</button>`;
}

function projects(v: NormalizedData): string {
	if (!v.projects.length) return '';
	const items = v.projects.map((p, i) => {
		const url = p.project_url || p.github_repo;
		const linkHtml = url
			? ` <a href="${url}" target="_blank" rel="noopener noreferrer" style="font-size:0.78rem;color:var(--gold);text-decoration:none;border:1px solid var(--gold);padding:0.15rem 0.5rem;border-radius:3px;">Link</a>`
			: '';
		const tags = (p.tech_stack.length ? p.tech_stack : p.software_used).map((t) => `<span class="tech-tag">${t}</span>`).join('');
		const respLis = p.responsibilities.map((r) => `<li>${r}</li>`).join('');
		const outcomeLis = p.measurable_outcomes.map((o) => `<li>${o}</li>`).join('');
		return (
			`<div class="content-card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`projects.${i}.title`)}>${p.title}${linkHtml}</h3>` +
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
			`<div class="cert-item" data-item-wrap>` +
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
		`<div class="ach-item" data-item-wrap>` +
		`<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">×</button>` +
		`<h3 ${_editable(`achievements.${i}.title`)}>${a.title}</h3>` +
		(a.description ? `<p ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : '') +
		`</div>`
	)).join('');
	return items + `<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>`;
}

function awards(v: NormalizedData): string {
	if (!v.awards.length) return '';
	const items = v.awards.map((a, i) => {
		const body = a.awarding_body;
		const year = a.year;
		return (
			`<div class="award-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="awards" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`awards.${i}.title`)}>${a.title}</h3>` +
			(body || year ? `<p class="award-body">${body}${body && year ? ` · ${year}` : year}</p>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="awards">+ Add Award</button>`;
}

function designPhilosophy(v: NormalizedData): string {
	return v.design_philosophy ? `<p class="philosophy" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p>` : '';
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
		const metaParts = [c.campaign_type, c.budget ? `Budget: ${c.budget}` : '', channels ? `Channels: ${channels}` : ''].filter(Boolean);
		const meta = metaParts.join(' · ');
		const metrics = c.performance_metrics.map((m) => `<li>${m}</li>`).join('');
		return (
			`<div class="content-card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="campaigns" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</h3>` +
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
			`<div class="content-card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`financial_modeling.${i}.model_type`)}>${fm.model_type}</h3>` +
			(tools ? `<div class="tag-row" style="margin:0.4rem 0" ${_listEditable(`financial_modeling.${i}.tools_used`)}>${tools}</div>` : '') +
			(fm.outcome ? `<p class="card-body" ${_editable(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="financial_modeling">+ Add Model</button>`;
}

function investmentPortfolios(v: NormalizedData): string {
	if (!v.investment_portfolios.length) return '';
	const items = v.investment_portfolios.map((ip, i) => (
		`<div class="content-card" data-item-wrap>` +
		`<button class="ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">×</button>` +
		`<h3 ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type}</h3>` +
		`<div class="ip-stats">` +
		(ip.assets_under_management ? `<span class="ip-stat"><strong>AUM:</strong> ${ip.assets_under_management}</span>` : '') +
		(ip.performance_return ? `<span class="ip-stat"><strong>Return:</strong> ${ip.performance_return}</span>` : '') +
		`</div></div>`
	)).join('');
	return items + `<button class="ce-add-btn" data-add-section="investment_portfolios">+ Add Portfolio</button>`;
}

const SECTION_RENDERERS: Record<string, [string, (v: NormalizedData) => string]> = {
	experience: ['Professional Experience', experience],
	projects: ['Projects', projects],
	skills: ['Core Competencies', skills],
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
	const locationSpan = v.location ? `<span ${_editable('profile.location')}>${v.location}</span>` : '';
	const phoneSpan = v.phone ? ` · <span ${_editable('profile.phone')}>${v.phone}</span>` : '';
	const contact = locationSpan + phoneSpan;
	let links = '';
	if (v.linkedin_url) links += `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
	if (v.github_url) links += `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
	if (v.portfolio_url) links += `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>`;
	if (v.email) links += `<a href="mailto:${v.email}">Email</a>`;

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
    <link href="${FONTS_URL}" rel="stylesheet">
    <style>${css()}</style>
</head>
<body>
    <header class="hero">
        <div class="container">
            <p class="hero-label">Professional Portfolio</p>
            <h1 ${_editable('profile.full_name')}>${v.name}</h1>
            <p class="headline" ${_editable('profile.headline')}>${v.headline}</p>
            <div class="hero-meta">
                <span class="location">${contact}</span>
                <div class="links">${links}</div>
            </div>
        </div>
    </header>
    <main class="container">
        ${sections}
    </main>
    <footer>
        <div class="container">
            <p>Generated with AI Portfolio Builder</p>
        </div>
    </footer>
${EDITOR_SCRIPT}
</body>
</html>`;
}
