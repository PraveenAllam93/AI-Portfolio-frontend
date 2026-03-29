/**
 * Template: Creative
 * Two-column layout — teal sidebar (contact + skills) + white main content.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

function css(): string {
	return `
/* ============================================================
   Creative Template — teal sidebar + white content area
   ============================================================ */

:root {
    --teal:         #0d9488;
    --teal-dark:    #0f766e;
    --teal-light:   #14b8a6;
    --teal-pale:    #ccfbf1;
    --text:         #1f2937;
    --text-mid:     #374151;
    --text-light:   #6b7280;
    --text-faint:   #9ca3af;
    --bg:           #f9fafb;
    --bg-card:      #ffffff;
    --border:       #e5e7eb;
    --border-dark:  #d1d5db;
    --sidebar-text: rgba(255,255,255,0.92);
    --sidebar-muted: rgba(255,255,255,0.65);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.65;
    background: var(--bg);
    color: var(--text);
}

a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }

.layout { display: flex; min-height: 100vh; }

.sidebar {
    width: 280px;
    flex-shrink: 0;
    background: linear-gradient(175deg, var(--teal) 0%, var(--teal-dark) 100%);
    color: white;
    padding: 2.5rem 1.75rem;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.2) transparent;
}

.sidebar-profile { margin-bottom: 2rem; }
.avatar {
    width: 60px; height: 60px; border-radius: 50%;
    background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; font-weight: 700; color: white; margin-bottom: 0.9rem;
}
.sidebar h1 { font-size: 1.25rem; font-weight: 700; color: white; margin-bottom: 0.25rem; line-height: 1.2; }
.sidebar-title { font-size: 0.825rem; color: var(--sidebar-muted); line-height: 1.4; }

.sidebar-section { margin-bottom: 1.75rem; }
.sidebar-heading {
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--teal-light); margin-bottom: 0.65rem;
}

.contact-row {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 0.4rem; font-size: 0.82rem; color: var(--sidebar-text);
}
.contact-icon { font-size: 0.75rem; opacity: 0.7; flex-shrink: 0; }
.contact-row a { color: var(--sidebar-text); word-break: break-all; transition: color 0.15s; }
.contact-row a:hover { color: white; }

.sidebar-links { display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.25rem; }
.sidebar-link {
    color: var(--sidebar-text); font-size: 0.82rem; font-weight: 500;
    padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; gap: 0.4rem; transition: color 0.15s, border-color 0.15s;
}
.sidebar-link:hover { color: white; border-bottom-color: rgba(255,255,255,0.5); }

.sidebar-skill-group { margin-bottom: 0.9rem; }
.sidebar-skill-group:last-child { margin-bottom: 0; }
.sidebar-skill-label {
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--teal-light); margin-bottom: 0.35rem;
}
.sidebar-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.skill-tag {
    background: rgba(255,255,255,0.15); color: white; padding: 0.2rem 0.55rem;
    border-radius: 4px; font-size: 0.75rem; font-weight: 500;
    border: 1px solid rgba(255,255,255,0.2); transition: background 0.2s; cursor: default;
}
.skill-tag:hover { background: rgba(255,255,255,0.28); }

.content { flex: 1; padding: 3rem 2.5rem; overflow: auto; max-width: calc(100% - 280px); }

section { margin-bottom: 2.75rem; }
h2 {
    font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 1.25rem;
    padding-bottom: 0.5rem; border-bottom: 2px solid var(--teal);
}

.about-text { font-size: 1rem; color: var(--text-light); line-height: 1.8; }

.exp-card, .edu-card {
    background: var(--bg-card); border-radius: 10px; padding: 1.4rem; margin-bottom: 0.9rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06); border-top: 3px solid transparent;
    transition: border-top-color 0.25s, box-shadow 0.25s, transform 0.2s;
}
.exp-card:last-child, .edu-card:last-child { margin-bottom: 0; }
.exp-card:hover, .edu-card:hover {
    border-top-color: var(--teal); box-shadow: 0 6px 20px rgba(13,148,136,0.12); transform: translateY(-2px);
}
.card-header { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.2rem; }
.card-header h3 { font-size: 1rem; font-weight: 600; color: var(--text); }
.card-company { font-size: 0.875rem; color: var(--text-light); }
.card-company::before { content: '·'; margin-right: 0.4rem; color: var(--text-faint); }
.card-meta { font-size: 0.78rem; color: var(--teal); font-weight: 500; margin-bottom: 0.5rem; }
.card-desc { font-size: 0.92rem; color: var(--text-light); margin-bottom: 0.4rem; }
.card-points { margin-top: 0.4rem; padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.2rem; }
.card-points li { font-size: 0.875rem; color: var(--text-light); }
.card-extra { font-size: 0.82rem; color: var(--text-light); margin-top: 0.4rem; }
.card-extra strong { color: var(--text-mid); font-weight: 500; }

.edu-card h3 { font-size: 0.975rem; font-weight: 600; margin-bottom: 0.2rem; }
.edu-meta { font-size: 0.82rem; color: var(--teal); margin-bottom: 0.15rem; }
.edu-grade { font-size: 0.8rem; color: var(--text-faint); }

.project-card {
    background: var(--bg-card); border-radius: 10px; padding: 1.4rem; margin-bottom: 0.9rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06); border-top: 3px solid transparent;
    transition: border-top-color 0.25s, box-shadow 0.25s, transform 0.2s;
}
.project-card:last-child { margin-bottom: 0; }
.project-card:hover {
    border-top-color: var(--teal); box-shadow: 0 6px 20px rgba(13,148,136,0.12); transform: translateY(-2px);
}
.proj-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.proj-header h3 { font-size: 1rem; font-weight: 600; color: var(--text); }
.proj-links { display: flex; gap: 0.4rem; }
.proj-link { font-size: 0.77rem; font-weight: 500; padding: 0.2rem 0.55rem; border: 1px solid var(--border-dark); border-radius: 4px; color: var(--text-mid); transition: all 0.15s; }
.proj-link:hover { border-color: var(--teal); color: var(--teal); }
.proj-category { display: inline-block; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--teal); margin-bottom: 0.35rem; }
.design-concept { font-size: 0.9rem; color: var(--text-mid); font-style: italic; margin-bottom: 0.4rem; }
.proj-desc { font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.55rem; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tech-tag { font-size: 0.775rem; color: var(--text-mid); padding: 0.2rem 0.5rem; border-radius: 3px; background: var(--bg); border: 1px solid var(--border); }
.outcomes { margin-top: 0.5rem; padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.2rem; }
.outcomes li { font-size: 0.85rem; color: var(--text-light); }

.philosophy { font-size: 1rem; color: var(--text-mid); font-style: italic; line-height: 1.8; padding-left: 1rem; border-left: 3px solid var(--teal); }

.campaign-card {
    background: var(--bg-card); border-radius: 10px; padding: 1.25rem 1.4rem; margin-bottom: 0.9rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06); border-top: 3px solid transparent;
    transition: border-top-color 0.25s, box-shadow 0.2s, transform 0.2s;
}
.campaign-card:last-child { margin-bottom: 0; }
.campaign-card:hover { border-top-color: var(--teal); box-shadow: 0 4px 16px rgba(13,148,136,0.1); transform: translateY(-2px); }
.campaign-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.3rem; }
.camp-meta { font-size: 0.78rem; color: var(--teal); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem; }
.camp-channels { font-size: 0.875rem; color: var(--text-light); margin-bottom: 0.35rem; }
.camp-metrics { padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.3rem; }
.camp-metrics li { font-size: 0.85rem; color: var(--text-light); }

.fm-item { background: var(--bg-card); border-radius: 10px; padding: 1.25rem 1.4rem; margin-bottom: 0.9rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border-top: 3px solid transparent; transition: border-top-color 0.25s, box-shadow 0.2s, transform 0.2s; }
.fm-item:last-child { margin-bottom: 0; }
.fm-item:hover { border-top-color: var(--teal); box-shadow: 0 4px 16px rgba(13,148,136,0.1); transform: translateY(-2px); }
.fm-item h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.3rem; }
.fm-tools { font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.25rem; }
.fm-outcome { font-size: 0.9rem; color: var(--text-mid); }

.ip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
.ip-card { background: var(--bg-card); padding: 1rem 1.1rem; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border-top: 3px solid transparent; transition: border-top-color 0.25s, box-shadow 0.2s; }
.ip-card:hover { border-top-color: var(--teal); box-shadow: 0 4px 12px rgba(13,148,136,0.1); }
.ip-card h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; }
.ip-meta, .ip-return { font-size: 0.825rem; color: var(--text-light); margin-top: 0.2rem; }

.achievement-item { padding: 0.7rem 0; border-bottom: 1px solid var(--border); }
.achievement-item:last-child { border-bottom: none; }
.ach-header { display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.2rem; }
.ach-header h3 { font-size: 0.95rem; font-weight: 600; }
.ach-header a { color: var(--teal); border-bottom: 1px solid transparent; transition: border-color 0.15s; }
.ach-header a:hover { border-bottom-color: var(--teal); }
.ach-year { font-size: 0.775rem; color: var(--text-faint); }
.ach-desc { font-size: 0.875rem; color: var(--text-light); }

.award-item { padding: 0.7rem 0; border-bottom: 1px solid var(--border); }
.award-item:last-child { border-bottom: none; }
.award-header { display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.2rem; }
.award-header h3 { font-size: 0.95rem; font-weight: 600; }
.award-header a { color: var(--teal); border-bottom: 1px solid transparent; transition: border-color 0.15s; }
.award-header a:hover { border-bottom-color: var(--teal); }
.award-year { font-size: 0.775rem; color: var(--text-faint); }
.award-body { font-size: 0.875rem; color: var(--text-light); }

.cert-item { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
.cert-item:last-child { border-bottom: none; }
.cert-item h3 { font-size: 0.925rem; font-weight: 500; }
.cert-item a { color: var(--teal); }
.cert-meta { font-size: 0.8rem; color: var(--text-faint); white-space: nowrap; }

footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); text-align: center; color: var(--text-faint); font-size: 0.8rem; }

@media (max-width: 768px) {
    .layout { flex-direction: column; }
    .sidebar { width: 100%; height: auto; position: static; }
    .content { max-width: 100%; padding: 2rem 1.25rem; }
    .ip-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
    .ip-grid { grid-template-columns: 1fr; }
    .proj-header { flex-direction: column; gap: 0.5rem; }
}
`;
}

function sidebarContact(v: NormalizedData): string {
	let rows = '';
	if (v.location) rows += `<div class="contact-row"><span class="contact-icon">⌖</span><span ${_editable('profile.location')}>${v.location}</span></div>`;
	if (v.phone) rows += `<div class="contact-row"><span class="contact-icon">☎</span><span ${_editable('profile.phone')}>${v.phone}</span></div>`;
	if (v.email) rows += `<div class="contact-row"><span class="contact-icon">✉</span><a href="mailto:${v.email}">${v.email}</a></div>`;
	let links = '';
	if (v.linkedin_url) links += `<a href="${v.linkedin_url}" class="sidebar-link" target="_blank" rel="noopener noreferrer">↗ LinkedIn</a>`;
	if (v.github_url) links += `<a href="${v.github_url}" class="sidebar-link" target="_blank" rel="noopener noreferrer">↗ GitHub</a>`;
	if (v.portfolio_url) links += `<a href="${v.portfolio_url}" class="sidebar-link" target="_blank" rel="noopener noreferrer">↗ Portfolio</a>`;
	if (v.twitter_url) links += `<a href="${v.twitter_url}" class="sidebar-link" target="_blank" rel="noopener noreferrer">↗ Twitter</a>`;
	if (links) rows += `<div class="sidebar-links">${links}</div>`;
	if (!rows) return '';
	return `<div class="sidebar-section"><h3 class="sidebar-heading">Contact</h3>${rows}</div>`;
}

function sidebarSkills(v: NormalizedData): string {
	if (!v.skill_groups.length) return '';
	const parts = v.skill_groups
		.map((g, i) => {
			const tags = g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('');
			if (!g.category && !tags) return '';
			return (
				`<div class="sidebar-skill-group" data-item-wrap>` +
				`<button class="ce-del-btn" data-del-section="skills" data-del-index="${i}">×</button>` +
				(g.category ? `<p class="sidebar-skill-label" ${_editable(`skills.${i}.category`)}>${g.category}</p>` : '') +
				(tags ? `<div class="sidebar-tags" ${_listEditable(`skills.${i}.skills`)}>${tags}</div>` : '') +
				`</div>`
			);
		})
		.filter(Boolean)
		.join('');
	return `<div class="sidebar-section"><h3 class="sidebar-heading">Skills</h3>${parts}<button class="ce-add-btn" data-add-section="skills">+ Add Skill Group</button></div>`;
}

function section(title: string, content: string): string {
	if (!content) return '';
	return `<section><h2>${title}</h2>${content}</section>`;
}

function about(v: NormalizedData): string {
	return v.bio ? `<p class="about-text" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : '';
}

function experience(v: NormalizedData): string {
	if (!v.experience.length) return '';
	const items = v.experience.map((exp, i) => {
		const metaParts = [exp.duration, exp.location].filter(Boolean);
		const kpHtml = exp.key_points.map((k) => `<li>${k}</li>`).join('');
		let extra = '';
		if (exp.channels_managed.length) extra += `<p class="card-extra"><strong>Channels:</strong> ${exp.channels_managed.join(', ')}</p>`;
		if (exp.financial_metrics_managed.length) extra += `<p class="card-extra"><strong>Key metrics:</strong> ${exp.financial_metrics_managed.join(', ')}</p>`;
		const companyHtml = exp.company ? `<span class="card-company" ${_editable(`experience.${i}.company`)}>${exp.company}</span>` : '';
		const metaHtml = metaParts.length ? `<p class="card-meta">${metaParts.join(' · ')}</p>` : '';
		const descHtml = exp.description ? `<p class="card-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : '';
		const kpListHtml = kpHtml ? `<ul class="card-points" ${_listEditable(`experience.${i}.key_points`)}>${kpHtml}</ul>` : '';
		return (
			`<div class="exp-card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">×</button>` +
			`<div class="card-header"><h3 ${_editable(`experience.${i}.role`)}>${exp.role}</h3>${companyHtml}</div>` +
			`${metaHtml}${descHtml}${kpListHtml}${extra}` +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>`;
}

function education(v: NormalizedData): string {
	if (!v.education.length) return '';
	const items = v.education.map((edu, i) => {
		const degreeField = [edu.degree, edu.field_of_study].filter(Boolean).join(' in ');
		const instParts = [edu.institution, edu.year_range].filter(Boolean);
		const gradeHtml = edu.grade_or_score ? `<p class="edu-grade">${edu.grade_or_score}</p>` : '';
		const metaHtml = instParts.length ? `<p class="edu-meta">${instParts.join(' · ')}</p>` : '';
		return (
			`<div class="edu-card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`education.${i}.degree`)}>${degreeField || edu.institution}</h3>` +
			`${metaHtml}${gradeHtml}` +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="education">+ Add Education</button>`;
}

function certifications(v: NormalizedData): string {
	if (!v.certifications.length) return '';
	const items = v.certifications.map((c, i) => {
		const name = c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>` : c.name;
		const meta = [c.issuer, c.year].filter(Boolean).join(' · ');
		return (
			`<div class="cert-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="certifications" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`certifications.${i}.name`)}>${name}</h3>` +
			(meta ? `<span class="cert-meta">${meta}</span>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="certifications">+ Add Certification</button>`;
}

function achievements(v: NormalizedData): string {
	if (!v.achievements.length) return '';
	const items = v.achievements.map((a, i) => {
		const title = a.url ? `<a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title}</a>` : a.title;
		const yearHtml = a.year ? `<span class="ach-year">${a.year}</span>` : '';
		const descHtml = a.description ? `<p class="ach-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : '';
		return (
			`<div class="achievement-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">×</button>` +
			`<div class="ach-header"><h3 ${_editable(`achievements.${i}.title`)}>${title}</h3>${yearHtml}</div>` +
			`${descHtml}` +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>`;
}

function projects(v: NormalizedData): string {
	if (!v.projects.length) return '';
	const items = v.projects.map((p, i) => {
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
		return (
			`<div class="project-card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">×</button>` +
			`<div class="proj-header"><h3 ${_editable(`projects.${i}.title`)}>${p.title}</h3>${linksHtml ? `<div class="proj-links">${linksHtml}</div>` : ''}</div>` +
			`${categoryHtml}${conceptHtml}` +
			(p.description ? `<p class="proj-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : '') +
			(tagsHtml ? `<div class="tag-row" ${_listEditable(`projects.${i}.tech_stack`)}>${tagsHtml}</div>` : '') +
			(respHtml ? `<ul class="outcomes" ${_listEditable(`projects.${i}.responsibilities`)}>${respHtml}</ul>` : '') +
			(outcomesHtml ? `<ul class="outcomes" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${outcomesHtml}</ul>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="projects">+ Add Project</button>`;
}

function designPhilosophy(v: NormalizedData): string {
	return v.design_philosophy ? `<p class="philosophy" ${_editable('design_philosophy', true)}>${v.design_philosophy}</p>` : '';
}

function softwareProficiency(v: NormalizedData): string {
	if (!v.software_proficiency.length) return '';
	const tags = v.software_proficiency.map((s) => `<span class="tech-tag">${s}</span>`).join('');
	return `<div class="tag-row">${tags}</div>`;
}

function awards(v: NormalizedData): string {
	if (!v.awards.length) return '';
	const items = v.awards.map((a, i) => {
		const title = a.url ? `<a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title}</a>` : a.title;
		const yearHtml = a.year ? `<span class="award-year">${a.year}</span>` : '';
		const bodyHtml = a.awarding_body ? `<p class="award-body">${a.awarding_body}</p>` : '';
		return (
			`<div class="award-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="awards" data-del-index="${i}">×</button>` +
			`<div class="award-header"><h3 ${_editable(`awards.${i}.title`)}>${title}</h3>${yearHtml}</div>` +
			`${bodyHtml}` +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="awards">+ Add Award</button>`;
}

function campaigns(v: NormalizedData): string {
	if (!v.campaigns.length) return '';
	const items = v.campaigns.map((c, i) => {
		const metaParts = [c.campaign_type, c.budget ? `Budget: ${c.budget}` : ''].filter(Boolean);
		const channels = c.channels_used.join(', ');
		const metricsHtml = c.performance_metrics.map((m) => `<li>${m}</li>`).join('');
		return (
			`<div class="campaign-card" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="campaigns" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`campaigns.${i}.campaign_name`)}>${c.campaign_name}</h3>` +
			(metaParts.length ? `<p class="camp-meta">${metaParts.join(' · ')}</p>` : '') +
			(channels ? `<p class="camp-channels">Channels: ${channels}</p>` : '') +
			(metricsHtml ? `<ul class="camp-metrics" ${_listEditable(`campaigns.${i}.performance_metrics`)}>${metricsHtml}</ul>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="campaigns">+ Add Campaign</button>`;
}

function financialModeling(v: NormalizedData): string {
	if (!v.financial_modeling.length) return '';
	const items = v.financial_modeling.map((fm, i) => {
		const tools = fm.tools_used.join(', ');
		return (
			`<div class="fm-item" data-item-wrap>` +
			`<button class="ce-del-btn" data-del-section="financial_modeling" data-del-index="${i}">×</button>` +
			`<h3 ${_editable(`financial_modeling.${i}.model_type`)}>${fm.model_type}</h3>` +
			(tools ? `<p class="fm-tools" ${_listEditable(`financial_modeling.${i}.tools_used`)}>Tools: ${tools}</p>` : '') +
			(fm.outcome ? `<p class="fm-outcome" ${_editable(`financial_modeling.${i}.outcome`, true)}>${fm.outcome}</p>` : '') +
			`</div>`
		);
	}).join('');
	return items + `<button class="ce-add-btn" data-add-section="financial_modeling">+ Add Model</button>`;
}

function investmentPortfolios(v: NormalizedData): string {
	if (!v.investment_portfolios.length) return '';
	const cards = v.investment_portfolios.map((ip, i) => (
		`<div class="ip-card" data-item-wrap>` +
		`<button class="ce-del-btn" data-del-section="investment_portfolios" data-del-index="${i}">×</button>` +
		`<h3 ${_editable(`investment_portfolios.${i}.portfolio_type`)}>${ip.portfolio_type}</h3>` +
		(ip.assets_under_management ? `<p class="ip-meta">AUM: ${ip.assets_under_management}</p>` : '') +
		(ip.performance_return ? `<p class="ip-return">Return: ${ip.performance_return}</p>` : '') +
		`</div>`
	)).join('');
	return `<div class="ip-grid">${cards}</div><button class="ce-add-btn" data-add-section="investment_portfolios">+ Add Portfolio</button>`;
}

const SECTION_RENDERERS: Record<string, [string, (v: NormalizedData) => string]> = {
	experience: ['Experience', experience],
	projects: ['Projects', projects],
	// skills rendered in sidebar
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
	const mainSections = [aboutHtml, contentSections].filter(Boolean).join('\n');
	const avatarLetter = v.name ? v.name[0].toUpperCase() : 'P';

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
<div class="layout">
    <aside class="sidebar">
        <div class="sidebar-profile">
            <div class="avatar">${avatarLetter}</div>
            <h1 ${_editable('profile.full_name')}>${v.name}</h1>
            ${v.headline ? `<p class="sidebar-title" ${_editable('profile.headline')}>${v.headline}</p>` : ''}
        </div>
        ${sidebarContact(v)}
        ${sidebarSkills(v)}
    </aside>
    <main class="content">
        ${mainSections}
        <footer><p>Generated with AI Portfolio Builder</p></footer>
    </main>
</div>
${EDITOR_SCRIPT}
</body>
</html>`;
}
