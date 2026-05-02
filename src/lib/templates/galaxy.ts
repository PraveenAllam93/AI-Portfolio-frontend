/**
 * Template: Galaxy
 * Dark purple gradient background (#0f172a → #581c87 → #0f172a), #c084fc accent.
 * Sticky nav, centered hero with gradient circular avatar (initials), two-column about,
 * experience cards with purple left border, skill grids, project cards, certifications,
 * education grid, contact strip. No JavaScript animations.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

function initials(name: string): string {
	const parts = name.split(' ');
	return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function socialLinksHtml(v: NormalizedData): string {
	const items: [keyof NormalizedData, string][] = [
		['linkedin_url', 'LinkedIn'],
		['github_url', 'GitHub'],
		['portfolio_url', 'Portfolio'],
		['twitter_url', 'Twitter'],
	];
	return items
		.filter(([key]) => !!v[key])
		.map(
			([key, label]) =>
				`<a href="${v[key]}" target="_blank" rel="noopener noreferrer">${label}</a>`
		)
		.join('');
}

function css(): string {
	return `
/* ============================================================
   Galaxy Template — dark purple gradient, #c084fc accent
   ============================================================ */

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #e2e8f0;
    background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
    min-height: 100vh;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 2px solid #c084fc; outline-offset: 2px; }

/* Navigation */
nav {
    position: sticky;
    top: 0;
    width: 100%;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
}
nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 20px;
}
.nav-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #c084fc, #ec4899); padding: 2px; flex-shrink: 0; }
.nav-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #c084fc; overflow: hidden; }
.nav-avatar-inner img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
nav ul { display: flex; list-style: none; gap: 2rem; }
nav a { color: #cbd5e1; text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
nav a:hover { color: #c084fc; }

/* Hero Section */
.hero { padding: 100px 20px 80px; text-align: center; }
.hero-avatar {
    width: 150px;
    height: 150px;
    margin: 0 auto 2rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #c084fc, #ec4899);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: bold;
    color: white;
    overflow: hidden;
}
.hero-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.hero h2 { font-size: 3rem; margin-bottom: 1rem; color: #fff; }
.hero p.hero-headline { font-size: 1.3rem; color: #cbd5e1; margin-bottom: 2rem; }
.btn-group { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn { padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s; display: inline-block; }
.btn-primary { background: #9333ea; color: white; }
.btn-primary:hover { background: #7e22ce; transform: translateY(-2px); }
.btn-secondary { border: 2px solid #c084fc; color: #c084fc; }
.btn-secondary:hover { background: #c084fc; color: white; }

/* Section Styles */
section { padding: 80px 20px; }
.bg-dark { background: rgba(30, 41, 59, 0.5); }
.section-title {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 1rem;
}
.section-title::before {
    content: '';
    width: 40px;
    height: 40px;
    background: #c084fc;
    border-radius: 8px;
    display: inline-block;
    flex-shrink: 0;
}

/* About */
.about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.about-text p { margin-bottom: 1.5rem; color: #cbd5e1; }
.facts-box { background: rgba(15, 23, 42, 0.5); padding: 2rem; border-radius: 12px; }
.facts-box h4 { font-size: 1.3rem; margin-bottom: 1.5rem; color: #fff; }
.facts-box ul { list-style: none; }
.facts-box li { padding: 0.5rem 0; color: #cbd5e1; border-bottom: 1px solid rgba(192,132,252,0.1); }
.facts-box li:last-child { border-bottom: none; }

/* Experience */
.experience-item {
    background: rgba(30, 41, 59, 0.5);
    padding: 2rem;
    border-radius: 12px;
    border-left: 4px solid #c084fc;
    margin-bottom: 2rem;
    transition: transform 0.2s;
}
.experience-item:last-child { margin-bottom: 0; }
.experience-item:hover { transform: translateX(4px); }
.experience-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.experience-item h4 { font-size: 1.5rem; color: #fff; }
.experience-period { color: #c084fc; font-size: 0.9rem; white-space: nowrap; }
.experience-company { color: #94a3b8; margin-bottom: 0.5rem; }
.experience-desc { color: #cbd5e1; margin-bottom: 0.75rem; }
.experience-points { margin-top: 0.5rem; padding-left: 1.25rem; color: #cbd5e1; }
.experience-points li { margin-bottom: 0.3rem; font-size: 0.9rem; }

/* Skills */
.skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.skill-category { background: rgba(15, 23, 42, 0.5); padding: 2rem; border-radius: 12px; }
.skill-category h4 { font-size: 1.3rem; margin-bottom: 1.5rem; color: #fff; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-tag { background: rgba(147,51,234,0.2); color: #e9d5ff; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; transition: background 0.2s; }
.skill-tag:hover { background: rgba(147,51,234,0.4); }

/* Projects */
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.project-card { background: rgba(30,41,59,0.5); padding: 2rem; border-radius: 12px; transition: transform 0.3s; display: flex; flex-direction: column; }
.project-card:hover { transform: translateY(-5px); }
.project-card h4 { font-size: 1.3rem; margin-bottom: 1rem; color: #fff; }
.project-card .proj-desc { color: #cbd5e1; margin-bottom: 1.5rem; flex-grow: 1; }
.project-tech { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.tech-tag { background: rgba(147,51,234,0.2); color: #e9d5ff; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; }
.proj-list-block { margin-bottom: 1rem; }
.proj-list-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #a78bfa; margin-bottom: 0.4rem; }
.proj-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3rem; }
.proj-list li { color: #cbd5e1; font-size: 0.88rem; padding-left: 1rem; position: relative; }
.proj-list li::before { content: '›'; position: absolute; left: 0; color: #a78bfa; }
.project-links { display: flex; gap: 1rem; margin-top: auto; }
.proj-link { color: #c084fc; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
.proj-link:hover { color: #e9d5ff; }

/* Certifications */
.cert-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 2rem; }
.cert-item { background: rgba(15,23,42,0.5); padding: 2rem; border-radius: 12px; display: flex; gap: 1rem; align-items: flex-start; transition: transform 0.2s; }
.cert-item:hover { transform: translateY(-3px); }
.cert-icon { font-size: 2rem; flex-shrink: 0; }
.cert-content h4 { font-size: 1.2rem; color: #fff; margin-bottom: 0.5rem; }
.cert-content p { color: #94a3b8; font-size: 0.9rem; }
.cert-year { color: #c084fc; font-size: 0.9rem; display: block; margin-top: 0.25rem; }

/* Education */
.edu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.edu-item { background: rgba(30,41,59,0.5); padding: 2rem; border-radius: 12px; transition: transform 0.2s; }
.edu-item:hover { transform: translateY(-3px); }
.edu-item h4 { font-size: 1.2rem; color: #fff; margin-bottom: 0.5rem; }
.edu-inst { color: #c084fc; font-size: 0.95rem; margin-bottom: 0.25rem; }
.edu-year { color: #94a3b8; font-size: 0.9rem; }
.edu-grade { color: #94a3b8; font-size: 0.85rem; margin-top: 0.25rem; }

/* Achievements */
.achievement-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
.achievement-item { background: rgba(30,41,59,0.5); padding: 1.5rem 2rem; border-radius: 12px; transition: transform 0.2s; }
.achievement-item:hover { transform: translateY(-3px); }
.achievement-item h4 { color: #fff; font-size: 1rem; margin-bottom: 0.25rem; }
.achievement-item p { color: #94a3b8; font-size: 0.9rem; }
.ach-year { color: #c084fc; font-size: 0.8rem; }

/* Contact */
.contact-info-container { display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; }
.contact-item { display: flex; align-items: center; gap: 1rem; color: #cbd5e1; }
.contact-icon { font-size: 1.5rem; width: 2rem; text-align: center; flex-shrink: 0; }
.social-links { display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap; }
.social-links a { padding: 0.5rem 1.25rem; background: rgba(192,132,252,0.2); border: 1px solid rgba(192,132,252,0.4); border-radius: 20px; color: #c084fc; font-size: 0.9rem; transition: all 0.3s; }
.social-links a:hover { background: #c084fc; color: white; }

/* Specialty sections */
.award-item, .campaign-card, .fm-item { background: rgba(30,41,59,0.5); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #c084fc; margin-bottom: 1.5rem; color: #cbd5e1; }
.award-item:last-child, .campaign-card:last-child, .fm-item:last-child { margin-bottom: 0; }
.award-item h4, .campaign-card h4, .fm-item h4 { color: #fff; font-size: 1.1rem; margin-bottom: 0.5rem; }
.ip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.ip-card { background: rgba(30,41,59,0.5); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(192,132,252,0.2); transition: border-color 0.2s; }
.ip-card:hover { border-color: #c084fc; }

/* Footer */
footer { display: none; }

/* Responsive */
@media (max-width: 768px) {
    nav ul { display: none; }
    .hero h2 { font-size: 2rem; }
    .section-title { font-size: 2rem; }
    .projects-grid, .skills-grid, .cert-grid, .edu-grid { grid-template-columns: 1fr; }
}
`;
}

export function html(v: NormalizedData): string {
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const NAV_LABELS: Record<string, string> = {
		experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certifications', achievements: 'Achievements',
		awards: 'Awards', campaigns: 'Campaigns', financial_modeling: 'Financial Modeling',
		investment_portfolios: 'Investment Portfolios',
	};
	const navAnchors: [string, string][] = [];
	if (v.bio || v.location || v.email || v.phone) navAnchors.push(['about', 'About']);
	for (const key of order) {
		if (!hidden.has(key) && key in NAV_LABELS) {
			const dataKey = key === 'skills' ? 'skill_groups' : key;
			const data = (v as Record<string, unknown>)[dataKey];
			if (data && (Array.isArray(data) ? data.length > 0 : Boolean(data))) {
				navAnchors.push([key, NAV_LABELS[key]]);
			}
		}
	}
	if (v.email || v.phone || v.location || v.linkedin_url || v.github_url) navAnchors.push(['contact', 'Contact']);
	const navItems = navAnchors.map(([anchor, label]) => `<li><a href="#${anchor}">${label}</a></li>`).join('');

	const inits = initials(v.name);

	// About section
	const facts: string[] = [];
	if (v.location) facts.push(`&#128205; ${v.location}`);
	if (v.email) facts.push(`&#9993; ${v.email}`);
	if (v.phone) facts.push(`&#128241; ${v.phone}`);
	if (v.education?.length) {
		const edu = v.education[0];
		const deg = [edu.degree, edu.field_of_study].filter(Boolean).join(' in ');
		if (deg) facts.push(`&#127891; ${deg}`);
	}
	const factsHtml = facts.length
		? `<div class="facts-box"><h4>Quick Facts</h4><ul>${facts.map((f) => `<li>${f}</li>`).join('')}</ul></div>`
		: '';
	const aboutHtml =
		v.bio || factsHtml
			? `<section id="about" class="bg-dark">
<div class="container">
<h3 class="section-title">About Me</h3>
<div class="about-grid">
${v.bio ? `<div class="about-text"><p ${_editable('portfolio.bio', true)}>${v.bio}</p></div>` : ''}
${factsHtml}
</div>
</div>
</section>`
			: '';

	// Experience
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience">
<div class="container">
<h3 class="section-title">Experience</h3>
${v.experience
	.map(
		(exp, i) => `<div class="experience-item" data-item-wrap>
<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
<div class="experience-header">
<div>
<h4 ${_editable(`experience.${i}.role`)}>${exp.role}</h4>
${exp.company ? `<p class="experience-company" ${_editable(`experience.${i}.company`)}>${exp.company}</p>` : ''}
</div>
${exp.duration ? `<span class="experience-period" ${_editable(`experience.${i}.duration`)}>${exp.duration}</span>` : ''}
</div>
${exp.description ? `<p class="experience-desc" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="experience-points" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>`
	)
	.join('\n')}
<button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>
</div>
</section>`
		: '';

	// Skills
	const skillsHtml = !hidden.has('skills') && v.skill_groups?.length
		? `<section id="skills" class="bg-dark">
<div class="container">
<h3 class="section-title">Skills</h3>
<div class="skills-grid">
${v.skill_groups
	.map(
		(g, i) => `<div class="skill-category" data-item-wrap>
<button class="ce-del-btn" data-del-section="skills" data-del-index="${i}">&#x2715;</button>
<h4 ${_editable(`skills.${i}.category`)}>${g.category}</h4>
<div class="skill-tags" ${_listEditable(`skills.${i}.skills`)}>${g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>`
	)
	.join('\n')}
</div>
<button class="ce-add-btn" data-add-section="skills">+ Add Skill Group</button>
</div>
</section>`
		: '';

	// Projects
	const projectsHtml = !hidden.has('projects') && v.projects?.length
		? `<section id="projects">
<div class="container">
<h3 class="section-title">Projects</h3>
<div class="projects-grid">
${v.projects
	.map((p, i) => {
		const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
		const tags = techSource.map((t) => `<span class="tech-tag">${t}</span>`).join('');
		const links = [
			p.github_repo ? `<a href="${p.github_repo}" class="proj-link" target="_blank" rel="noopener noreferrer">GitHub</a>` : '',
			p.project_url ? `<a href="${p.project_url}" class="proj-link" target="_blank" rel="noopener noreferrer">Live</a>` : '',
		]
			.filter(Boolean)
			.join('');
		const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const respHtml = resp.length ? `<div class="proj-list-block"><p class="proj-list-label">Responsibilities</p><ul class="proj-list" ${_listEditable(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : '';
			const outHtml = outcomes.length ? `<div class="proj-list-block"><p class="proj-list-label">Outcomes</p><ul class="proj-list" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : '';
			return `<div class="project-card" data-item-wrap>
<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
<h4 ${_editable(`projects.${i}.title`)}>${p.title}</h4>
${p.description ? `<p class="proj-desc" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${respHtml}${outHtml}
${tags ? `<div class="project-tech" ${_listEditable(`projects.${i}.tech_stack`)}>${tags}</div>` : ''}
${links ? `<div class="project-links">${links}</div>` : ''}
</div>`;
	})
	.join('\n')}
</div>
<button class="ce-add-btn" data-add-section="projects">+ Add Project</button>
</div>
</section>`
		: '';

	// Education
	const educationHtml = !hidden.has('education') && v.education?.length
		? `<section id="education" class="bg-dark">
<div class="container">
<h3 class="section-title">Education</h3>
<div class="edu-grid">
${v.education
	.map(
		(edu, i) => {
			const degField = [edu.degree, edu.field_of_study].filter(Boolean).join(' in ');
			const title = degField || edu.institution;
			return `<div class="edu-item" data-item-wrap>
<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
<h4 ${_editable(`education.${i}.degree`)}>${title}</h4>
${edu.institution ? `<p class="edu-inst" ${_editable(`education.${i}.institution`)}>${edu.institution}</p>` : ''}
${edu.year_range ? `<p class="edu-year" ${_editable(`education.${i}.year_range`)}>${edu.year_range}</p>` : ''}
${edu.grade_or_score ? `<p class="edu-grade" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</p>` : ''}
</div>`;
		}
	)
	.join('\n')}
</div>
<button class="ce-add-btn" data-add-section="education">+ Add Education</button>
</div>
</section>`
		: '';

	// Certifications
	const certsHtml = !hidden.has('certifications') && v.certifications?.length
		? `<section id="certifications">
<div class="container">
<h3 class="section-title">Certifications</h3>
<div class="cert-grid">
${v.certifications
	.map(
		(c, i) => {
			const nameHtml = c.url
				? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>`
				: c.name;
			return `<div class="cert-item" data-item-wrap>
<button class="ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
<div class="cert-icon">&#127942;</div>
<div class="cert-content">
<h4>${nameHtml}</h4>
${c.issuer ? `<p ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</p>` : ''}
${c.year ? `<span class="cert-year" ${_editable(`certifications.${i}.year`)}>${c.year}</span>` : ''}
</div>
</div>`;
		}
	)
	.join('\n')}
</div>
<button class="ce-add-btn" data-add-section="certifications">+ Add Certification</button>
</div>
</section>`
		: '';

	// Achievements
	const achievementsHtml = !hidden.has('achievements') && v.achievements?.length
		? `<section id="achievements" class="bg-dark">
<div class="container">
<h3 class="section-title">Achievements</h3>
<div class="achievement-grid">
${v.achievements
	.map(
		(a, i) => `<div class="achievement-item" data-item-wrap>
<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
<h4><span ${_editable(`achievements.${i}.title`)}>${a.title}</span>${a.year ? `<span class="ach-year"> &middot; ${a.year}</span>` : ''}</h4>
${a.description ? `<p ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>`
	)
	.join('\n')}
</div>
<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</div>
</section>`
		: '';

	// Contact
	const socialHtml = socialLinksHtml(v);
	const contactHtml =
		v.email || v.phone || v.location || socialHtml
			? `<section id="contact" class="bg-dark">
<div class="container">
<h3 class="section-title">Contact</h3>
<div class="contact-info-container">
${v.email ? `<div class="contact-item"><span class="contact-icon">&#9993;</span><span ${_editable('profile.email')}>${v.email}</span></div>` : ''}
${v.phone ? `<div class="contact-item"><span class="contact-icon">&#128241;</span><span ${_editable('profile.phone')}>${v.phone}</span></div>` : ''}
${v.location ? `<div class="contact-item"><span class="contact-icon">&#128205;</span><span ${_editable('profile.location')}>${v.location}</span></div>` : ''}
${socialHtml ? `<div class="social-links">${socialHtml}</div>` : ''}
</div>
</div>
</section>`
			: '';

	// Build ordered sections
	const sectionRenderers: Record<string, string> = {
		experience: expHtml,
		skills: skillsHtml,
		projects: projectsHtml,
		education: educationHtml,
		certifications: certsHtml,
		achievements: achievementsHtml,
	};

	const orderedContent = order
		.filter((key) => !hidden.has(key) && key in sectionRenderers)
		.map((key) => sectionRenderers[key])
		.filter(Boolean)
		.join('\n');

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
<nav>
    <div class="container">
        <div class="nav-avatar"><div class="nav-avatar-inner">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : initials(v.name)}</div></div>
        <ul>${navItems}</ul>
    </div>
</nav>
<section class="hero">
    <div class="container">
        <div class="hero-avatar">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : inits}</div>
        <h2 ${_editable('profile.full_name')}>${v.name}</h2>
        ${v.headline ? `<p class="hero-headline" ${_editable('portfolio.headline')}>${v.headline}</p>` : ''}
        <div class="btn-group">
            <a href="#contact" class="btn btn-primary">Get In Touch</a>
            <a href="#projects" class="btn btn-secondary">View Work</a>
        </div>
    </div>
</section>
<main>
    ${aboutHtml}
    ${orderedContent}
    ${contactHtml}
</main>
<footer></footer>
${EDITOR_SCRIPT}
</body>
</html>`;
}
