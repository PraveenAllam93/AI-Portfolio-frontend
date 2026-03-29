/**
 * Template: Bold
 * Dark slate background, vibrant orange accents. High-impact design.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

function css(): string {
	return `
/* ============================================================
   Bold Template — dark slate, vibrant orange accent
   ============================================================ */

:root {
    --accent:       #f97316;
    --accent-glow:  rgba(249, 115, 22, 0.35);
    --bg:           #0f172a;
    --bg-card:      #1e293b;
    --bg-card-hov:  #263348;
    --text:         #f1f5f9;
    --text-mid:     #cbd5e1;
    --text-muted:   #94a3b8;
    --border:       #334155;
    --border-hov:   #475569;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.65;
    color: var(--text);
    background: var(--bg);
}

a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.container { max-width: 820px; margin: 0 auto; padding: 0 1.5rem; }

/* ---- Hero ---- */
.hero {
    background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
    padding: 5rem 0 4rem;
    border-bottom: 2px solid var(--accent);
    position: relative;
    overflow: hidden;
}
.hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
    pointer-events: none;
}
.hero-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--accent);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    margin-bottom: 1.25rem;
}
.hero h1 {
    font-size: 3.25rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 0.5rem;
    line-height: 1.1;
}
.hero-headline {
    font-size: 1.15rem;
    color: var(--text-muted);
    margin-bottom: 1.25rem;
}
.hero-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}
.hero-meta-text { font-size: 0.875rem; color: var(--text-muted); }
.social-links { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.social-links a {
    color: var(--text);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.35rem 0.9rem;
    border: 1px solid var(--border);
    border-radius: 5px;
    transition: all 0.25s;
}
.social-links a:hover {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 12px var(--accent-glow);
    transform: translateY(-1px);
}

/* ---- Main ---- */
main { padding: 4rem 0; }
section { margin-bottom: 4rem; }

h2 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 1.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
h2::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
}
.h2-accent { color: var(--accent); font-weight: 700; font-size: 1rem; }

/* ---- About ---- */
.about-text {
    font-size: 1.05rem;
    color: var(--text-muted);
    line-height: 1.8;
    max-width: 680px;
}

/* ---- Skills ---- */
.skill-group { margin-bottom: 1.1rem; }
.skill-group:last-child { margin-bottom: 0; }
.skill-group-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
}
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-tag {
    background: transparent;
    color: var(--accent);
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.82rem;
    font-weight: 500;
    border: 1px solid var(--accent);
    transition: all 0.2s;
    cursor: default;
}
.skill-tag:hover {
    background: var(--accent);
    color: var(--bg);
    box-shadow: 0 0 14px var(--accent-glow);
}

/* ---- Experience ---- */
.timeline-item {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 3px solid var(--border);
    transition: border-left-color 0.3s, background 0.3s, transform 0.2s;
}
.timeline-item:last-child { margin-bottom: 0; }
.timeline-item:hover {
    border-left-color: var(--accent);
    background: var(--bg-card-hov);
    transform: translateX(3px);
}
.tl-header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 0.25rem;
}
.tl-header h3 { font-size: 1rem; font-weight: 600; color: var(--text); }
.tl-company { font-size: 0.9rem; color: var(--text-muted); }
.tl-company::before { content: '·'; margin-right: 0.5rem; color: var(--border-hov); }
.tl-meta {
    font-size: 0.77rem;
    color: var(--accent);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}
.tl-desc { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 0.4rem; }
.tl-points {
    margin-top: 0.4rem;
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.tl-points li { font-size: 0.875rem; color: var(--text-muted); }
.exp-extra { font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem; }
.exp-extra strong { color: var(--text-mid); font-weight: 500; }

/* ---- Projects ---- */
.project-card {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 3px solid var(--border);
    transition: border-left-color 0.3s, background 0.3s, transform 0.2s;
}
.project-card:last-child { margin-bottom: 0; }
.project-card:hover {
    border-left-color: var(--accent);
    background: var(--bg-card-hov);
    transform: translateX(3px);
}
.proj-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
}
.proj-header h3 { font-size: 1rem; font-weight: 600; color: var(--text); }
.proj-links { display: flex; gap: 0.4rem; }
.proj-link {
    font-size: 0.775rem;
    font-weight: 500;
    padding: 0.2rem 0.55rem;
    border: 1px solid var(--border-hov);
    border-radius: 4px;
    color: var(--text-muted);
    transition: all 0.2s;
}
.proj-link:hover {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 8px var(--accent-glow);
}
.proj-category {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.4rem;
}
.design-concept {
    font-size: 0.9rem;
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: 0.4rem;
}
.proj-desc { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.6rem; }
.tech-tag {
    font-size: 0.775rem;
    color: var(--text-muted);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
}
.outcomes {
    margin-top: 0.5rem;
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.outcomes li { font-size: 0.85rem; color: var(--text-muted); }

/* ---- Design Philosophy ---- */
.philosophy {
    font-size: 1.05rem;
    color: var(--text-muted);
    font-style: italic;
    line-height: 1.8;
    max-width: 680px;
    padding-left: 1rem;
    border-left: 2px solid var(--accent);
}

/* ---- Education ---- */
.edu-item {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 0.75rem;
    border-left: 3px solid var(--border);
    transition: border-left-color 0.3s, transform 0.2s;
}
.edu-item:last-child { margin-bottom: 0; }
.edu-item:hover { border-left-color: var(--accent); transform: translateX(3px); }
.edu-item h3 { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.25rem; }
.edu-meta { font-size: 0.82rem; color: var(--accent); margin-bottom: 0.2rem; }
.edu-grade { font-size: 0.8rem; color: var(--text-muted); }

/* ---- Certifications ---- */
.cert-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
}
.cert-item:last-child { border-bottom: none; }
.cert-item h3 { font-size: 0.925rem; font-weight: 500; color: var(--text); }
.cert-item a { color: var(--accent); transition: opacity 0.15s; }
.cert-item a:hover { opacity: 0.75; }
.cert-meta { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }

/* ---- Achievements ---- */
.achievement-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border);
}
.achievement-item:last-child { border-bottom: none; }
.ach-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.2rem;
}
.ach-header h3 { font-size: 0.95rem; font-weight: 600; color: var(--text); }
.ach-header a { color: var(--accent); }
.ach-year { font-size: 0.775rem; color: var(--text-muted); }
.ach-desc { font-size: 0.875rem; color: var(--text-muted); }

/* ---- Awards ---- */
.award-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border);
}
.award-item:last-child { border-bottom: none; }
.award-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.2rem;
}
.award-header h3 { font-size: 0.95rem; font-weight: 600; color: var(--text); }
.award-header a { color: var(--accent); }
.award-year { font-size: 0.775rem; color: var(--text-muted); }
.award-body { font-size: 0.875rem; color: var(--text-muted); }

/* ---- Campaigns ---- */
.campaign-card {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 0.75rem;
    border-left: 3px solid var(--border);
    transition: border-left-color 0.3s, transform 0.2s;
}
.campaign-card:last-child { margin-bottom: 0; }
.campaign-card:hover { border-left-color: var(--accent); transform: translateX(3px); }
.campaign-card h3 { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.3rem; }
.camp-meta {
    font-size: 0.77rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.4rem;
}
.camp-channels { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.4rem; }
.camp-metrics {
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.3rem;
}
.camp-metrics li { font-size: 0.85rem; color: var(--text-muted); }

/* ---- Financial Modeling ---- */
.fm-item {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 0.75rem;
    border-left: 3px solid var(--border);
    transition: border-left-color 0.3s, transform 0.2s;
}
.fm-item:last-child { margin-bottom: 0; }
.fm-item:hover { border-left-color: var(--accent); transform: translateX(3px); }
.fm-item h3 { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 0.3rem; }
.fm-tools { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem; }
.fm-outcome { font-size: 0.9rem; color: var(--text-mid); }

/* ---- Investment Portfolios ---- */
.ip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
}
.ip-card {
    background: var(--bg-card);
    padding: 1.1rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    transition: border-color 0.2s;
}
.ip-card:hover { border-color: var(--accent); }
.ip-card h3 { font-size: 0.9rem; font-weight: 600; color: var(--text); margin-bottom: 0.4rem; }
.ip-meta, .ip-return { font-size: 0.825rem; color: var(--text-muted); margin-top: 0.2rem; }

/* ---- Footer ---- */
footer {
    border-top: 1px solid var(--border);
    padding: 2.5rem 0;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.85rem;
}

/* ---- Responsive ---- */
@media (max-width: 640px) {
    .hero h1 { font-size: 2.25rem; }
    .hero-headline { font-size: 1rem; }
    .hero-meta { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
    .proj-header { flex-direction: column; gap: 0.5rem; }
    .tl-header { flex-direction: column; gap: 0.1rem; }
    .tl-company::before { display: none; }
    .ip-grid { grid-template-columns: 1fr; }
}
`;
}

function section(title: string, content: string): string {
	if (!content) return '';
	return `<section><h2><span class="h2-accent">//</span> ${title}</h2>${content}</section>`;
}

function heroEl(v: NormalizedData): string {
	const headlineHtml = v.headline ? `<p class="hero-headline" ${_editable('profile.headline')}>${v.headline}</p>` : '';
	const metaHtml = `<span class="hero-meta-text"><span ${_editable('profile.location')}>${v.location}</span>${v.phone ? ` · <span ${_editable('profile.phone')}>${v.phone}</span>` : ''}</span>`;
	let links = '';
	if (v.linkedin_url) links += `<a href="${v.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
	if (v.github_url) links += `<a href="${v.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
	if (v.portfolio_url) links += `<a href="${v.portfolio_url}" target="_blank" rel="noopener noreferrer">Portfolio</a>`;
	if (v.twitter_url) links += `<a href="${v.twitter_url}" target="_blank" rel="noopener noreferrer">Twitter</a>`;
	if (v.email) links += `<a href="mailto:${v.email}">Email</a>`;
	const socialHtml = links ? `<div class="social-links">${links}</div>` : '';
	const metaRow = metaHtml || socialHtml ? `<div class="hero-meta">${metaHtml}${socialHtml}</div>` : '';
	return `<header class="hero"><div class="container"><div class="hero-badge">Portfolio</div><h1 ${_editable('profile.full_name')}>${v.name}</h1>${headlineHtml}${metaRow}</div></header>`;
}

function about(v: NormalizedData): string {
	return v.bio ? `<p class="about-text" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : '';
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
    ${heroEl(v)}
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
