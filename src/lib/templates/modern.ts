/**
 * Template: Modern
 * Clean blue gradient header, Inter typography, single-column layout.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

function css(): string {
	return `
/* ============================================================
   Modern Template — blue gradient, Inter, single-column
   ============================================================ */

:root {
    --primary:      #2563eb;
    --primary-dark: #1d4ed8;
    --text:         #1f2937;
    --text-light:   #6b7280;
    --bg:           #ffffff;
    --bg-alt:       #f9fafb;
    --border:       #e5e7eb;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: var(--text);
    background: var(--bg);
}

.container { max-width: 820px; margin: 0 auto; padding: 0 1.5rem; }

/* ── Hero ─────────────────────────────────────────────────── */
.hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 4.5rem 0;
    text-align: center;
}
.hero h1 {
    font-size: 2.75rem; font-weight: 700;
    letter-spacing: -0.02em; margin-bottom: 0.5rem;
}
.headline { font-size: 1.2rem; opacity: 0.9; margin-bottom: 0.4rem; }
.location { opacity: 0.75; margin-bottom: 1.75rem; font-size: 0.95rem; }
.links { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.links a {
    color: white; text-decoration: none;
    padding: 0.45rem 1.1rem;
    border: 1px solid rgba(255,255,255,0.35); border-radius: 6px;
    font-size: 0.9rem;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.links a:hover {
    background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.6);
    transform: translateY(-1px);
}

/* ── Sections ─────────────────────────────────────────────── */
main { padding: 3.5rem 0; }
section { margin-bottom: 3.5rem; }
h2 {
    font-size: 1.4rem; font-weight: 600; margin-bottom: 1.5rem;
    padding-bottom: 0.5rem; border-bottom: 2px solid var(--primary);
    color: var(--text);
}

/* About */
.about-text { font-size: 1.05rem; color: var(--text-light); line-height: 1.75; }

/* Skills */
.skill-group { margin-bottom: 1rem; }
.skill-group-label {
    font-size: 0.8rem; font-weight: 600; color: var(--primary);
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem;
}
.tag-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.skill-tag {
    background: var(--bg-alt); color: var(--text);
    padding: 0.4rem 0.9rem; border-radius: 20px;
    font-size: 0.875rem; border: 1px solid var(--border);
    transition: border-color 0.2s, background 0.2s;
}
.skill-tag:hover { border-color: var(--primary); background: #eff6ff; }

/* Experience */
.exp-item {
    margin-bottom: 2rem; padding: 1.5rem;
    background: var(--bg-alt); border-radius: 8px;
    border-left: 3px solid var(--primary);
    transition: box-shadow 0.2s, transform 0.2s;
}
.exp-item:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.1); transform: translateX(2px); }
.exp-header {
    display: flex; justify-content: space-between;
    align-items: baseline; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.2rem;
}
.exp-role { font-size: 1.05rem; font-weight: 600; }
.exp-company { font-size: 0.95rem; color: var(--primary); font-weight: 500; }
.exp-meta { color: var(--text-light); font-size: 0.85rem; margin-bottom: 0.5rem; }
.exp-desc { color: var(--text-light); font-size: 0.95rem; margin-bottom: 0.5rem; }
.exp-points { padding-left: 1.25rem; }
.exp-points li { margin-bottom: 0.25rem; color: var(--text-light); font-size: 0.9rem; }

/* Education */
.edu-item {
    background: var(--bg-alt); border-radius: 8px;
    padding: 1.25rem 1.5rem; margin-bottom: 1rem;
    border-left: 3px solid var(--primary);
}
.edu-item h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.2rem; }
.edu-meta { color: var(--text-light); font-size: 0.85rem; }
.edu-grade { color: var(--primary); font-size: 0.85rem; font-weight: 500; margin-top: 0.2rem; }

/* Projects */
.project-card {
    background: var(--bg-alt); border-radius: 8px;
    padding: 1.25rem 1.5rem; margin-bottom: 1rem;
    border-left: 3px solid var(--primary);
    transition: box-shadow 0.2s;
}
.project-card:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.1); }
.proj-header {
    display: flex; justify-content: space-between;
    align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.4rem;
}
.proj-header h3 { font-size: 1rem; font-weight: 600; }
.proj-link {
    font-size: 0.8rem; color: var(--primary); text-decoration: none;
    border: 1px solid var(--primary); padding: 0.2rem 0.6rem; border-radius: 4px;
}
.proj-desc { font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem; }
.tech-tag {
    font-size: 0.75rem; padding: 0.25rem 0.6rem;
    background: #eff6ff; color: var(--primary);
    border-radius: 4px; border: 1px solid #bfdbfe;
}
.outcomes { padding-left: 1.25rem; margin-top: 0.4rem; }
.outcomes li { font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.2rem; }

/* Certifications */
.cert-item {
    padding: 0.75rem 1rem; background: var(--bg-alt); border-radius: 6px;
    border-left: 3px solid var(--primary); margin-bottom: 0.5rem;
    display: flex; justify-content: space-between;
    align-items: center; flex-wrap: wrap; gap: 0.25rem;
}
.cert-name { font-size: 0.95rem; font-weight: 500; }
.cert-meta { font-size: 0.8rem; color: var(--text-light); }

/* Achievements & Awards */
.achievement-item, .award-item {
    padding: 1rem 1.25rem; background: var(--bg-alt);
    border-radius: 6px; border-left: 3px solid var(--primary); margin-bottom: 0.6rem;
}
.achievement-item h3, .award-item h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem; }
.achievement-item p, .award-item p { font-size: 0.875rem; color: var(--text-light); }
.award-body { font-size: 0.8rem; color: var(--primary); font-weight: 500; margin-top: 0.1rem; }

/* Design Philosophy */
.philosophy {
    font-size: 1.05rem; color: var(--text-light); line-height: 1.85;
    padding: 1.25rem 1.5rem; background: var(--bg-alt);
    border-radius: 8px; border-left: 3px solid var(--primary);
}

/* Campaigns */
.campaign-card {
    background: var(--bg-alt); border-radius: 8px;
    padding: 1.25rem 1.5rem; margin-bottom: 1rem;
    border-left: 3px solid var(--primary);
}
.campaign-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
.campaign-type { font-size: 0.8rem; color: var(--primary); font-weight: 500; margin-bottom: 0.4rem; }
.campaign-desc { font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.4rem; }
.campaign-metrics { padding-left: 1.25rem; }
.campaign-metrics li { font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.2rem; }

/* Financial Modeling */
.fm-item {
    background: var(--bg-alt); border-radius: 6px;
    padding: 1rem 1.25rem; border-left: 3px solid var(--primary); margin-bottom: 0.6rem;
}
.fm-item h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.3rem; }
.fm-tools { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.3rem; }
.fm-outcome { font-size: 0.875rem; color: var(--text-light); }

/* Investment Portfolios */
.ip-item {
    background: var(--bg-alt); border-radius: 6px;
    padding: 1rem 1.25rem; border-left: 3px solid var(--primary); margin-bottom: 0.6rem;
}
.ip-item h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; }
.ip-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.3rem; }
.ip-stat { font-size: 0.85rem; color: var(--text-light); }
.ip-stat strong { color: var(--primary); }

/* Footer */
footer {
    background: var(--bg-alt); padding: 2rem 0; text-align: center;
    color: var(--text-light); font-size: 0.85rem; border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
    .hero h1 { font-size: 2rem; }
    .headline { font-size: 1.05rem; }
    h2 { font-size: 1.2rem; }
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
	const groups = v.skill_groups
		.map((g, i) => {
			const tags = g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('');
			if (!g.category && !tags) return '';
			return (
				`<div class="skill-group" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="skills" data-del-index="${i}">×</button>` +
				(g.category ? `<p class="skill-group-label" ${_editable(`skills.${i}.category`)}>${g.category}</p>` : '') +
				(tags ? `<div class="tag-row" ${_listEditable(`skills.${i}.skills`)}>${tags}</div>` : '') +
				`</div>`
			);
		})
		.filter(Boolean)
		.join('');
	return groups + `<button class="ce-add-btn" data-add-section="skills">+ Add Skill Group</button>`;
}

function experience(v: NormalizedData): string {
	const items = v.experience
		.map((exp, i) => {
			const metaParts = [exp.duration, exp.location].filter(Boolean);
			const meta = metaParts.join(' · ');
			const points = exp.key_points.map((p) => `<li>${p}</li>`).join('');
			return (
				`<div class="exp-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">×</button>` +
				`<div class="exp-header">` +
				`<h3 class="exp-role" ${_editable(`experience.${i}.role`)}>${exp.role}</h3>` +
				`<span class="exp-company" ${_editable(`experience.${i}.company`)}>${exp.company}</span>` +
				`</div>` +
				`<p class="exp-meta">${meta}</p>` +
				(exp.description ? `<p class="exp-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : '') +
				(points ? `<ul class="exp-points" ${_listEditable(`experience.${i}.key_points`)}>${points}</ul>` : '') +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>`;
}

function education(v: NormalizedData): string {
	const items = v.education
		.map((edu, i) => {
			let degree = edu.degree;
			if (edu.field_of_study) degree = `${degree} in ${edu.field_of_study}`;
			const metaParts = [edu.institution, edu.year_range].filter(Boolean);
			const meta = metaParts.join(' · ');
			return (
				`<div class="edu-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`education.${i}.degree`)}>${degree}</h3>` +
				`<p class="edu-meta">${meta}</p>` +
				(edu.grade_or_score ? `<p class="edu-grade">${edu.grade_or_score}</p>` : '') +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="education">+ Add Education</button>`;
}

function projects(v: NormalizedData): string {
	const items = v.projects
		.map((p, i) => {
			const url = p.project_url || p.github_repo;
			const link = url
				? `<a href="${url}" class="proj-link" target="_blank" rel="noopener noreferrer">Link</a>`
				: '';
			const tags = (p.tech_stack.length ? p.tech_stack : p.software_used)
				.map((t) => `<span class="tech-tag">${t}</span>`)
				.join('');
			const respLis = p.responsibilities.map((r) => `<li>${r}</li>`).join('');
			const outcomeLis = p.measurable_outcomes.map((o) => `<li>${o}</li>`).join('');
			return (
				`<div class="project-card" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">×</button>` +
				`<div class="proj-header"><h3 ${_editable(`projects.${i}.title`)}>${p.title}</h3>${link}</div>` +
				(p.description ? `<p class="proj-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : '') +
				(tags ? `<div class="tag-row" ${_listEditable(`projects.${i}.tech_stack`)}>${tags}</div>` : '') +
				(respLis ? `<ul class="outcomes" ${_listEditable(`projects.${i}.responsibilities`)}>${respLis}</ul>` : '') +
				(outcomeLis ? `<ul class="outcomes" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${outcomeLis}</ul>` : '') +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="projects">+ Add Project</button>`;
}

function certifications(v: NormalizedData): string {
	const items = v.certifications
		.map((c, i) => {
			const metaParts = [c.issuer, c.year].filter(Boolean);
			const meta = metaParts.join(' · ');
			return (
				`<div class="cert-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="certifications" data-del-index="${i}">×</button>` +
				`<span class="cert-name" ${_editable(`certifications.${i}.name`)}>${c.name}</span>` +
				(meta ? `<span class="cert-meta">${meta}</span>` : '') +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="certifications">+ Add Certification</button>`;
}

function achievements(v: NormalizedData): string {
	const items = v.achievements
		.map((a, i) => (
			`<div class="achievement-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`achievements.${i}.title`)}>${a.title}</h3>` +
			(a.description ? `<p ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : '') +
			`</div>`
		))
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>`;
}

function awards(v: NormalizedData): string {
	const items = v.awards
		.map((a, i) => {
			const body = a.awarding_body;
			const year = a.year;
			return (
				`<div class="award-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="awards" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`awards.${i}.title`)}>${a.title}</h3>` +
				(body || year ? `<p class="award-body">${body}${body && year ? ` · ${year}` : year}</p>` : '') +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="awards">+ Add Award</button>`;
}

function designPhilosophy(v: NormalizedData): string {
	return v.design_philosophy
		? `<p class="philosophy" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p>`
		: '';
}

function softwareProficiency(v: NormalizedData): string {
	if (!v.software_proficiency.length) return '';
	const tags = v.software_proficiency.map((s) => `<span class="skill-tag">${s}</span>`).join('');
	return `<div class="tag-row" ${_listEditable('design_philosophy_software')}>${tags}</div>`;
}

function campaigns(v: NormalizedData): string {
	const items = v.campaigns
		.map((c, i) => {
			const channels = c.channels_used.join(', ');
			const descParts = [
				channels ? `Channels: ${channels}` : '',
				c.budget ? `Budget: ${c.budget}` : ''
			].filter(Boolean);
			const desc = descParts.join(' · ');
			const metrics = c.performance_metrics.map((m) => `<li>${m}</li>`).join('');
			return (
				`<div class="campaign-card" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="campaigns" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</h3>` +
				(c.campaign_type ? `<p class="campaign-type">${c.campaign_type}</p>` : '') +
				(desc ? `<p class="campaign-desc">${desc}</p>` : '') +
				(metrics ? `<ul class="campaign-metrics" ${_listEditable(`campaigns.${i}.performance_metrics`)}>${metrics}</ul>` : '') +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="campaigns">+ Add Campaign</button>`;
}

function financialModeling(v: NormalizedData): string {
	const items = v.financial_modeling
		.map((fm, i) => {
			const tools = fm.tools_used.map((t) => `<span class="tech-tag">${t}</span>`).join('');
			return (
				`<div class="fm-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`financial_modeling.${i}.model_type`)}>${fm.model_type}</h3>` +
				(tools ? `<div class="fm-tools tag-row" ${_listEditable(`financial_modeling.${i}.tools_used`)}>${tools}</div>` : '') +
				(fm.outcome ? `<p class="fm-outcome" ${_editable(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : '') +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="financial_modeling">+ Add Model</button>`;
}

function investmentPortfolios(v: NormalizedData): string {
	const items = v.investment_portfolios
		.map((ip, i) => (
			`<div class="ip-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type}</h3>` +
			`<div class="ip-stats">` +
			(ip.assets_under_management ? `<span class="ip-stat"><strong>AUM:</strong> ${ip.assets_under_management}</span>` : '') +
			(ip.performance_return ? `<span class="ip-stat"><strong>Return:</strong> ${ip.performance_return}</span>` : '') +
			`</div></div>`
		))
		.join('');
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
	const contactParts = [v.location, v.phone].filter(Boolean);
	const contact = contactParts.join(' · ');

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
		})
		.filter(Boolean)
		.join('\n');
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
            <h1 ${_editable('profile.full_name')}>${v.name}</h1>
            <p class="headline" ${_editable('profile.headline')}>${v.headline}</p>
            <p class="location"><span ${_editable('profile.location')}>${v.location}</span>${v.phone ? ` · <span ${_editable('profile.phone')}>${v.phone}</span>` : ''}</p>
            <div class="links">${links}</div>
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
