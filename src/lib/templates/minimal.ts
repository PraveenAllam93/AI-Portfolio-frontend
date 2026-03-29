/**
 * Template: Minimal
 * Ultra-clean monochrome design. White hero with bold black bottom border.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

function css(): string {
	return `
/* ============================================================
   Minimal Template — monochrome, no gradients, clean typography
   ============================================================ */

:root {
    --ink:        #111827;
    --ink-mid:    #374151;
    --ink-light:  #6b7280;
    --ink-faint:  #9ca3af;
    --bg:         #ffffff;
    --bg-alt:     #f9fafb;
    --border:     #e5e7eb;
    --border-dark: #d1d5db;
    --accent:     #111827;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.65;
    color: var(--ink);
    background: var(--bg);
}

a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.container { max-width: 820px; margin: 0 auto; padding: 0 1.5rem; }

/* ---- Hero ---- */
.hero {
    background: var(--bg);
    padding: 4rem 0 3rem;
    border-bottom: 2.5px solid var(--ink);
}
.hero h1 {
    font-size: 2.75rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--ink);
    margin-bottom: 0.4rem;
}
.headline {
    font-size: 1.1rem;
    color: var(--ink-mid);
    font-weight: 400;
    margin-bottom: 1.25rem;
}
.hero-meta {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
}
.hero-meta-text {
    font-size: 0.875rem;
    color: var(--ink-light);
}
.social-links { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.social-links a {
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--border-dark);
    border-radius: 4px;
    color: var(--ink-mid);
    transition: border-color 0.15s, color 0.15s;
}
.social-links a:hover { border-color: var(--ink); color: var(--ink); }

/* ---- Main content ---- */
main { padding: 3.5rem 0; }

section { margin-bottom: 3.5rem; }

h2 {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}
h2::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
}

/* ---- About ---- */
.about p {
    font-size: 1.05rem;
    color: var(--ink-mid);
    line-height: 1.8;
    max-width: 680px;
}

/* ---- Skills ---- */
.skill-group { margin-bottom: 1.25rem; }
.skill-group:last-child { margin-bottom: 0; }
.skill-group-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 0.5rem;
}
.tag-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.skill-tag {
    background: transparent;
    color: var(--ink-mid);
    padding: 0.25rem 0.65rem;
    border-radius: 4px;
    font-size: 0.825rem;
    border: 1px solid var(--border-dark);
    transition: background 0.15s, color 0.15s;
}
.skill-tag:hover { background: var(--ink); color: white; border-color: var(--ink); }

/* ---- Experience ---- */
.timeline-item {
    margin-bottom: 2.25rem;
    padding-bottom: 2.25rem;
    border-bottom: 1px solid var(--border);
}
.timeline-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.tl-header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 0.2rem;
}
.tl-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--ink);
}
.tl-company {
    font-size: 0.9rem;
    color: var(--ink-mid);
}
.tl-company::before { content: '·'; margin-right: 0.6rem; color: var(--ink-faint); }
.tl-meta {
    font-size: 0.78rem;
    color: var(--ink-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.6rem;
}
.tl-desc {
    font-size: 0.95rem;
    color: var(--ink-mid);
    margin-bottom: 0.5rem;
}
.tl-points {
    margin-top: 0.5rem;
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.tl-points li { font-size: 0.875rem; color: var(--ink-light); }
.exp-extra {
    font-size: 0.825rem;
    color: var(--ink-light);
    margin-top: 0.4rem;
}
.exp-extra strong { color: var(--ink-mid); font-weight: 500; }

/* ---- Projects ---- */
.project-card {
    margin-bottom: 1.75rem;
    padding: 1.25rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: border-color 0.2s;
}
.project-card:hover { border-color: var(--border-dark); }
.project-card:last-child { margin-bottom: 0; }
.proj-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
}
.proj-header h3 { font-size: 1rem; font-weight: 600; color: var(--ink); }
.proj-links { display: flex; gap: 0.4rem; }
.proj-link {
    font-size: 0.775rem;
    font-weight: 500;
    padding: 0.2rem 0.55rem;
    border: 1px solid var(--border-dark);
    border-radius: 4px;
    color: var(--ink-mid);
    transition: all 0.15s;
}
.proj-link:hover { border-color: var(--ink); color: var(--ink); }
.proj-category {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-bottom: 0.4rem;
}
.design-concept {
    font-size: 0.9rem;
    color: var(--ink-mid);
    font-style: italic;
    margin-bottom: 0.5rem;
}
.proj-desc { font-size: 0.9rem; color: var(--ink-mid); margin-bottom: 0.6rem; }
.tech-tag {
    font-size: 0.775rem;
    color: var(--ink-mid);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    background: var(--bg-alt);
    border: 1px solid var(--border);
}
.outcomes {
    margin-top: 0.6rem;
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.outcomes li { font-size: 0.85rem; color: var(--ink-light); }

/* ---- Design Philosophy ---- */
.philosophy {
    font-size: 1.05rem;
    color: var(--ink-mid);
    font-style: italic;
    line-height: 1.8;
    max-width: 680px;
    padding-left: 1rem;
    border-left: 2px solid var(--border-dark);
}

/* ---- Campaigns (Marketing) ---- */
.campaign-card {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    border: 1px solid var(--border);
    border-radius: 8px;
}
.campaign-card:last-child { margin-bottom: 0; }
.campaign-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.3rem; }
.camp-meta {
    font-size: 0.8rem;
    color: var(--ink-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.4rem;
}
.camp-channels { font-size: 0.875rem; color: var(--ink-mid); margin-bottom: 0.4rem; }
.camp-metrics {
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.4rem;
}
.camp-metrics li { font-size: 0.85rem; color: var(--ink-light); }

/* ---- Financial Modeling (Finance) ---- */
.fm-item {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
}
.fm-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.fm-item h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.3rem; }
.fm-tools { font-size: 0.85rem; color: var(--ink-light); margin-bottom: 0.3rem; }
.fm-outcome { font-size: 0.9rem; color: var(--ink-mid); }

/* ---- Investment Portfolios (Finance) ---- */
.ip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}
.ip-card {
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
}
.ip-card h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; }
.ip-meta, .ip-return { font-size: 0.825rem; color: var(--ink-mid); margin-top: 0.2rem; }

/* ---- Achievements ---- */
.achievement-item {
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
}
.achievement-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.ach-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
    flex-wrap: wrap;
}
.ach-header h3 { font-size: 0.95rem; font-weight: 600; }
.ach-header a { border-bottom: 1px solid var(--border-dark); transition: border-color 0.15s; }
.ach-header a:hover { border-color: var(--ink); }
.ach-year {
    font-size: 0.775rem;
    color: var(--ink-faint);
    font-variant-numeric: tabular-nums;
}
.ach-desc { font-size: 0.875rem; color: var(--ink-light); }

/* ---- Awards (Designer) ---- */
.award-item {
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
}
.award-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.award-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.2rem;
    flex-wrap: wrap;
}
.award-header h3 { font-size: 0.95rem; font-weight: 600; }
.award-header a { border-bottom: 1px solid var(--border-dark); transition: border-color 0.15s; }
.award-header a:hover { border-color: var(--ink); }
.award-year { font-size: 0.775rem; color: var(--ink-faint); }
.award-body { font-size: 0.875rem; color: var(--ink-light); }

/* ---- Education ---- */
.edu-item {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
}
.edu-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.edu-item h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.2rem; }
.edu-meta { font-size: 0.85rem; color: var(--ink-light); margin-bottom: 0.2rem; }
.edu-grade { font-size: 0.825rem; color: var(--ink-faint); }

/* ---- Certifications ---- */
.cert-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
}
.cert-item:last-child { border-bottom: none; }
.cert-item h3 { font-size: 0.925rem; font-weight: 500; }
.cert-item a { border-bottom: 1px solid var(--border-dark); transition: border-color 0.15s; }
.cert-item a:hover { border-color: var(--ink); }
.cert-meta { font-size: 0.8rem; color: var(--ink-faint); white-space: nowrap; }

/* ---- Footer ---- */
footer {
    border-top: 1px solid var(--border);
    padding: 2rem 0;
    text-align: center;
    color: var(--ink-faint);
    font-size: 0.8rem;
}

/* ---- Responsive ---- */
@media (max-width: 640px) {
    .hero h1 { font-size: 2rem; }
    .hero-meta { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    .proj-header { flex-direction: column; gap: 0.5rem; }
    .tl-header { flex-direction: column; gap: 0.15rem; }
    .tl-company::before { display: none; }
    .ip-grid { grid-template-columns: 1fr; }
}
`;
}

function section(title: string, content: string): string {
	if (!content) return '';
	return `<section><h2><span>${title}</span></h2>${content}</section>`;
}

function hero(v: NormalizedData): string {
	const headlineHtml = v.headline ? `<p class="headline" ${_editable('profile.headline')}>${v.headline}</p>` : '';
	const metaHtml = `<span class="hero-meta-text"><span ${_editable('profile.location')}>${v.location}</span>${v.phone ? ` · <span ${_editable('profile.phone')}>${v.phone}</span>` : ''}</span>`;
	const links = socialLinks(v);
	const socialHtml = links ? `<div class="social-links">${links}</div>` : '';
	const metaRow = metaHtml || socialHtml ? `<div class="hero-meta">${metaHtml}${socialHtml}</div>` : '';
	return `<header class="hero"><div class="container"><h1 ${_editable('profile.full_name')}>${v.name}</h1>${headlineHtml}${metaRow}</div></header>`;
}

function socialLinks(v: NormalizedData): string {
	let out = '';
	if (v.linkedin_url) out += `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
	if (v.github_url) out += `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
	if (v.portfolio_url) out += `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>`;
	if (v.twitter_url) out += `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Twitter</a>`;
	if (v.email) out += `<a href="mailto:${v.email}">Email</a>`;
	return out;
}

function about(v: NormalizedData): string {
	return v.bio ? `<p ${_editable('portfolio.bio', true)}>${v.bio}</p>` : '';
}

function skills(v: NormalizedData): string {
	if (!v.skill_groups.length) return '';
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
	if (!v.experience.length) return '';
	const items = v.experience
		.map((exp, i) => {
			const metaParts = [exp.duration, exp.location].filter(Boolean);
			const kpHtml = exp.key_points.map((k) => `<li>${k}</li>`).join('');
			let extra = '';
			if (exp.channels_managed.length)
				extra += `<p class="exp-extra"><strong>Channels:</strong> ${exp.channels_managed.join(', ')}</p>`;
			if (exp.financial_metrics_managed.length)
				extra += `<p class="exp-extra"><strong>Key metrics:</strong> ${exp.financial_metrics_managed.join(', ')}</p>`;
			const companyHtml = exp.company ? `<span class="tl-company" ${_editable(`experience.${i}.company`)}>${exp.company}</span>` : '';
			const metaHtml = metaParts.length ? `<p class="tl-meta">${metaParts.join(' · ')}</p>` : '';
			const descHtml = exp.description ? `<p class="tl-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : '';
			const kpListHtml = kpHtml ? `<ul class="tl-points" ${_listEditable(`experience.${i}.key_points`)}>${kpHtml}</ul>` : '';
			return (
				`<div class="timeline-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">×</button>` +
				`<div class="tl-header"><h3 ${_editable(`experience.${i}.role`)}>${exp.role}</h3>${companyHtml}</div>` +
				`${metaHtml}${descHtml}${kpListHtml}${extra}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>`;
}

function education(v: NormalizedData): string {
	if (!v.education.length) return '';
	const items = v.education
		.map((edu, i) => {
			const degreeField = [edu.degree, edu.field_of_study].filter(Boolean).join(' in ');
			const instParts = [edu.institution, edu.year_range].filter(Boolean);
			const gradeHtml = edu.grade_or_score ? `<p class="edu-grade">${edu.grade_or_score}</p>` : '';
			const metaHtml = instParts.length ? `<p class="edu-meta">${instParts.join(' · ')}</p>` : '';
			return (
				`<div class="edu-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`education.${i}.degree`)}>${degreeField || edu.institution}</h3>` +
				`${metaHtml}${gradeHtml}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="education">+ Add Education</button>`;
}

function certifications(v: NormalizedData): string {
	if (!v.certifications.length) return '';
	const items = v.certifications
		.map((c, i) => {
			const name = c.url
				? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>`
				: c.name;
			const meta = [c.issuer, c.year].filter(Boolean).join(' · ');
			const metaHtml = meta ? `<span class="cert-meta">${meta}</span>` : '';
			return (
				`<div class="cert-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="certifications" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`certifications.${i}.name`)}>${name}</h3>` +
				`${metaHtml}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="certifications">+ Add Certification</button>`;
}

function achievements(v: NormalizedData): string {
	if (!v.achievements.length) return '';
	const items = v.achievements
		.map((a, i) => {
			const title = a.url
				? `<a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title}</a>`
				: a.title;
			const yearHtml = a.year ? `<span class="ach-year">${a.year}</span>` : '';
			const descHtml = a.description ? `<p class="ach-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : '';
			return (
				`<div class="achievement-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">×</button>` +
				`<div class="ach-header"><h3 ${_editable(`achievements.${i}.title`)}>${title}</h3>${yearHtml}</div>` +
				`${descHtml}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>`;
}

function projects(v: NormalizedData): string {
	if (!v.projects.length) return '';
	const items = v.projects
		.map((p, i) => {
			const linksHtml = [
				p.github_repo ? `<a href="${p.github_repo}" class="proj-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
				p.project_url ? `<a href="${p.project_url}" class="proj-link" target="_blank" rel="noopener noreferrer">Live</a>` : ''
			].filter(Boolean).join('');
			const tagSource = p.tech_stack.length ? p.tech_stack : p.software_used;
			const tagsHtml = tagSource.map((t) => `<span class="tech-tag">${t}</span>`).join('');
			const categoryHtml = p.project_category ? `<span class="proj-category">${p.project_category}</span>` : '';
			const conceptHtml = p.design_concept ? `<p class="design-concept">${p.design_concept}</p>` : '';
			const respHtml = p.responsibilities.map((r) => `<li>${r}</li>`).join('');
			const outcomesHtml = p.measurable_outcomes.map((o) => `<li>${o}</li>`).join('');
			const projLinksDiv = linksHtml ? `<div class="proj-links">${linksHtml}</div>` : '';
			const descHtml = p.description ? `<p class="proj-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : '';
			const tagsRowHtml = tagsHtml ? `<div class="tag-row" ${_listEditable(`projects.${i}.tech_stack`)}>${tagsHtml}</div>` : '';
			const respListHtml = respHtml ? `<ul class="outcomes" ${_listEditable(`projects.${i}.responsibilities`)}>${respHtml}</ul>` : '';
			const outcomesListHtml = outcomesHtml ? `<ul class="outcomes" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${outcomesHtml}</ul>` : '';
			return (
				`<div class="project-card" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">×</button>` +
				`<div class="proj-header"><h3 ${_editable(`projects.${i}.title`)}>${p.title}</h3>${projLinksDiv}</div>` +
				`${categoryHtml}${conceptHtml}${descHtml}${tagsRowHtml}${respListHtml}${outcomesListHtml}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="projects">+ Add Project</button>`;
}

function designPhilosophy(v: NormalizedData): string {
	return v.design_philosophy ? `<p class="philosophy" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p>` : '';
}

function softwareProficiency(v: NormalizedData): string {
	if (!v.software_proficiency.length) return '';
	const tags = v.software_proficiency.map((s) => `<span class="skill-tag">${s}</span>`).join('');
	return `<div class="tag-row">${tags}</div>`;
}

function awards(v: NormalizedData): string {
	if (!v.awards.length) return '';
	const items = v.awards
		.map((a, i) => {
			const title = a.url
				? `<a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title}</a>`
				: a.title;
			const yearHtml = a.year ? `<span class="award-year">${a.year}</span>` : '';
			const bodyHtml = a.awarding_body ? `<p class="award-body">${a.awarding_body}</p>` : '';
			return (
				`<div class="award-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="awards" data-del-index="${i}">×</button>` +
				`<div class="award-header"><h3 ${_editable(`awards.${i}.title`)}>${title}</h3>${yearHtml}</div>` +
				`${bodyHtml}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="awards">+ Add Award</button>`;
}

function campaigns(v: NormalizedData): string {
	if (!v.campaigns.length) return '';
	const items = v.campaigns
		.map((c, i) => {
			const metaParts = [c.campaign_type, c.budget ? `Budget: ${c.budget}` : ''].filter(Boolean);
			const channels = c.channels_used.join(', ');
			const metricsHtml = c.performance_metrics.map((m) => `<li>${m}</li>`).join('');
			const campMetaHtml = metaParts.length ? `<p class="camp-meta">${metaParts.join(' · ')}</p>` : '';
			const campChannelsHtml = channels ? `<p class="camp-channels">Channels: ${channels}</p>` : '';
			const campMetricsHtml = metricsHtml ? `<ul class="camp-metrics" ${_listEditable(`campaigns.${i}.performance_metrics`)}>${metricsHtml}</ul>` : '';
			return (
				`<div class="campaign-card" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="campaigns" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</h3>` +
				`${campMetaHtml}${campChannelsHtml}${campMetricsHtml}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="campaigns">+ Add Campaign</button>`;
}

function financialModeling(v: NormalizedData): string {
	if (!v.financial_modeling.length) return '';
	const items = v.financial_modeling
		.map((fm, i) => {
			const tools = fm.tools_used.join(', ');
			const toolsHtml = tools ? `<p class="fm-tools" ${_listEditable(`financial_modeling.${i}.tools_used`)}>Tools: ${tools}</p>` : '';
			const outcomeHtml = fm.outcome ? `<p class="fm-outcome" ${_editable(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : '';
			return (
				`<div class="fm-item" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`financial_modeling.${i}.model_type`)}>${fm.model_type}</h3>` +
				`${toolsHtml}${outcomeHtml}` +
				`</div>`
			);
		})
		.join('');
	return items + `<button class="ce-add-btn" data-add-section="financial_modeling">+ Add Model</button>`;
}

function investmentPortfolios(v: NormalizedData): string {
	if (!v.investment_portfolios.length) return '';
	const cards = v.investment_portfolios
		.map((ip, i) => {
			const aumHtml = ip.assets_under_management ? `<p class="ip-meta">AUM: ${ip.assets_under_management}</p>` : '';
			const retHtml = ip.performance_return ? `<p class="ip-return">Return: ${ip.performance_return}</p>` : '';
			return (
				`<div class="ip-card" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">×</button>` +
				`<h3 ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type}</h3>` +
				`${aumHtml}${retHtml}` +
				`</div>`
			);
		})
		.join('');
	return `<div class="ip-grid">${cards}</div><button class="ce-add-btn" data-add-section="investment_portfolios">+ Add Portfolio</button>`;
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
    ${hero(v)}
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
