/**
 * Template: Codex
 * Light blue/white background (linear-gradient #f0f9ff → #e0f2fe), blue primary (#2563eb),
 * purple accent (#7c3aed). Poppins font + Roboto Mono for code-blocks.
 * Sticky frosted glass header. Two-column hero (text left, circular avatar right).
 * Code-block styled skill cards with dark header and mono font. White cards throughout.
 * Contact section with gradient background. No JavaScript animations.
 */

import type { NormalizedData } from './base';
import { DEFAULT_SECTION_ORDER, _editable, _listEditable, EDITOR_SCRIPT } from './base';

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400&display=swap';

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
				`<a href="${v[key]}" class="link-card" target="_blank" rel="noopener noreferrer">${label}</a>`
		)
		.join('');
}

function css(): string {
	return `
/* ============================================================
   Codex Template — light blue/white, Poppins, blue accent #2563eb
   ============================================================ */

:root {
    --primary:      #2563eb;
    --primary-dark: #1d4ed8;
    --secondary:    #0f172a;
    --accent:       #7c3aed;
    --light:        #f8fafc;
    --gray:         #64748b;
    --gray-light:   #e2e8f0;
    --code-bg:      #1e293b;
    --section-bg:   #f8fafc;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.7;
    color: var(--secondary);
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    min-height: 100vh;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

/* Header */
header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    position: sticky;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; }
.nav-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); padding: 2px; flex-shrink: 0; }
.nav-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: var(--primary); overflow: hidden; }
.nav-avatar-inner img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.nav-links { display: flex; list-style: none; gap: 30px; }
.nav-links a { text-decoration: none; color: var(--secondary); font-weight: 500; font-size: 1rem; transition: all 0.3s ease; padding: 8px 16px; border-radius: 20px; }
.nav-links a:hover { background-color: var(--primary); color: white; }

/* Hero */
.hero { padding: 80px 0; }
.hero-inner { display: flex; align-items: center; gap: 60px; flex-wrap: wrap; }
.hero-content { flex: 1; min-width: 300px; }
.hero-image { flex: 1; min-width: 280px; display: flex; justify-content: center; align-items: center; }
.profile-img-container { position: relative; width: 300px; height: 300px; }
.profile-img-bg {
    position: absolute;
    width: 110%; height: 110%;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    top: -5%; left: -5%;
    z-index: 1;
    animation: pulse 3s infinite;
}
@keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
.profile-initials {
    width: 100%; height: 100%;
    border-radius: 50%;
    background: white;
    border: 8px solid white;
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4.5rem;
    font-weight: 700;
    color: var(--primary);
    font-family: 'Poppins', sans-serif;
}
h1 { font-size: 3.5rem; font-weight: 700; color: var(--secondary); margin-bottom: 10px; line-height: 1.2; }
.title { font-size: 1.8rem; color: var(--primary); margin-bottom: 25px; font-weight: 500; }
.hero-text { font-size: 1.1rem; color: var(--gray); margin-bottom: 35px; max-width: 550px; }
.btn-group { display: flex; gap: 15px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 8px; background-color: var(--primary); color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; border: 2px solid var(--primary); font-size: 1rem; font-family: 'Poppins', sans-serif; }
.btn:hover { background-color: white; color: var(--primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
.btn-outline { background-color: transparent; color: var(--primary); }
.btn-outline:hover { background-color: var(--primary); color: white; }

/* Sections */
.section { padding: 80px 0; }
.section-title { font-size: 2.5rem; font-weight: 700; color: var(--secondary); margin-bottom: 50px; position: relative; display: inline-block; }
.section-title::after { content: ''; position: absolute; left: 0; bottom: -10px; width: 70px; height: 4px; background-color: var(--primary); border-radius: 2px; }

/* About */
.about-content { background: white; border-radius: 20px; padding: 50px; box-shadow: 0 15px 40px rgba(0,0,0,0.05); }
.about-text-para { font-size: 1.1rem; color: var(--secondary); line-height: 1.8; margin-bottom: 16px; }
.about-text-para:last-child { margin-bottom: 0; }

/* Experience Timeline */
.timeline { position: relative; max-width: 900px; margin: 40px auto 0; }
.timeline::before { content: ''; position: absolute; left: 50%; transform: translateX(-50%); width: 4px; height: 100%; background-color: var(--gray-light); border-radius: 2px; }
.timeline-item { position: relative; margin-bottom: 50px; width: 45%; }
.timeline-item:nth-child(odd) { left: 0; }
.timeline-item:nth-child(even) { left: 55%; }
.timeline-dot { position: absolute; width: 20px; height: 20px; background-color: var(--primary); border-radius: 50%; top: 15px; z-index: 2; }
.timeline-item:nth-child(odd) .timeline-dot { right: -10px; transform: translateX(50%); }
.timeline-item:nth-child(even) .timeline-dot { left: -10px; transform: translateX(-50%); }
.experience-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.3s ease; }
.experience-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
.experience-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; flex-wrap: wrap; gap: 8px; }
.experience-title { font-size: 1.3rem; font-weight: 600; color: var(--secondary); }
.experience-company { color: var(--primary); font-weight: 500; margin-bottom: 5px; }
.experience-date { background-color: var(--gray-light); color: var(--secondary); padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; white-space: nowrap; }
.experience-description { color: var(--gray); margin-bottom: 12px; font-size: 0.95rem; }
.experience-tech { display: flex; flex-wrap: wrap; gap: 8px; }
.tech-tag { background-color: var(--gray-light); color: var(--secondary); padding: 5px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 500; }

/* Skills — code-block style */
.skills-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 30px; }
.skill-card { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s ease; }
.skill-card:hover { transform: translateY(-10px); }
.skill-card-header { background-color: var(--code-bg); padding: 16px 20px; }
.skill-card-title { font-size: 1rem; font-weight: 600; color: #f1fa8c; font-family: 'Roboto Mono', monospace; margin: 0; }
.skill-card-body { padding: 20px; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag { background-color: rgba(37,99,235,0.08); color: var(--primary); border: 1px solid rgba(37,99,235,0.2); padding: 5px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; }
.skill-tag:hover { background-color: var(--primary); color: white; }

/* Projects */
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; margin-top: 40px; }
.project-card { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.08); transition: all 0.4s ease; display: flex; flex-direction: column; }
.project-card:hover { transform: translateY(-15px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
.project-content { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; }
.project-title { font-size: 1.3rem; font-weight: 600; color: var(--secondary); margin-bottom: 12px; }
.project-description { color: var(--gray); margin-bottom: 18px; font-size: 0.95rem; flex-grow: 1; }
.project-tech { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.proj-list-block { margin-bottom: 16px; }
.proj-list-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--primary); margin-bottom: 6px; }
.proj-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.proj-list li { font-size: 0.875rem; color: var(--gray); padding-left: 14px; position: relative; line-height: 1.5; }
.proj-list li::before { content: '›'; position: absolute; left: 0; color: var(--primary); font-weight: 700; }
.project-links { display: flex; gap: 15px; margin-top: auto; }
.project-link { color: var(--primary); text-decoration: none; font-weight: 500; font-size: 0.9rem; transition: color 0.2s ease; }
.project-link:hover { color: var(--primary-dark); }

/* Certifications */
.certifications-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
.certification-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.3s ease; }
.certification-card:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
.certification-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 12px; }
.certification-icon { width: 52px; height: 52px; background-color: rgba(37,99,235,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
.certification-title { font-size: 1.15rem; font-weight: 600; color: var(--secondary); margin-bottom: 4px; }
.certification-issuer { color: var(--gray); font-size: 0.9rem; }
.certification-date { color: var(--primary); font-weight: 500; margin-top: 4px; font-size: 0.85rem; }

/* Education */
.education-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 40px; }
.education-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.3s ease; }
.education-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
.education-degree { font-size: 1.2rem; font-weight: 600; color: var(--secondary); margin-bottom: 8px; }
.education-institution { color: var(--primary); font-weight: 500; font-size: 1rem; margin-bottom: 4px; }
.education-year { color: var(--gray); font-size: 0.9rem; margin-bottom: 4px; }
.education-grade { color: var(--gray); font-size: 0.85rem; }

/* Achievements */
.achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 40px; }
.achievement-card { background: white; border-radius: 15px; padding: 25px 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.3s; }
.achievement-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
.achievement-title { font-size: 1rem; font-weight: 600; color: var(--secondary); margin-bottom: 4px; }
.achievement-year { color: var(--primary); font-size: 0.85rem; font-weight: 500; }
.achievement-desc { color: var(--gray); font-size: 0.9rem; margin-top: 4px; }

/* Contact Section */
.contact-section-wrap { background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: white; padding: 80px 0; }
.contact-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 50px; position: relative; display: inline-block; }
.contact-title::after { content: ''; position: absolute; left: 0; bottom: -10px; width: 70px; height: 4px; background: rgba(255,255,255,0.6); border-radius: 2px; }
.contact-container { display: flex; flex-wrap: wrap; gap: 40px; }
.contact-info { flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 20px; }
.contact-item { display: flex; align-items: center; gap: 20px; }
.contact-icon { width: 50px; height: 50px; background-color: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
.contact-details h3 { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.75; margin-bottom: 2px; }
.contact-details p { font-size: 1rem; font-weight: 500; }
.links-container { flex: 1; min-width: 260px; }
.links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }
.link-card { display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: rgba(255,255,255,0.1); padding: 22px 14px; border-radius: 14px; text-decoration: none; color: white; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.2); font-weight: 500; font-size: 0.95rem; }
.link-card:hover { background-color: rgba(255,255,255,0.2); transform: translateY(-5px); }

/* Specialty sections */
.award-item, .campaign-card, .fm-item { background: white; border-radius: 15px; padding: 25px 30px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-left: 4px solid var(--primary); transition: transform 0.3s; }
.award-item:last-child, .campaign-card:last-child, .fm-item:last-child { margin-bottom: 0; }
.award-item:hover, .campaign-card:hover, .fm-item:hover { transform: translateY(-3px); }
.award-item h4, .campaign-card h4, .fm-item h4 { font-size: 1.1rem; color: var(--secondary); margin-bottom: 6px; }
.ip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-top: 30px; }
.ip-card { background: white; border-radius: 15px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid var(--gray-light); transition: all 0.2s; }
.ip-card:hover { border-color: var(--primary); transform: translateY(-3px); }

/* Profile photo in hero circle and about section */
.profile-photo { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }

/* Footer */
footer { display: none; }

/* Responsive */
@media (max-width: 992px) {
    h1 { font-size: 2.8rem; }
    .title { font-size: 1.5rem; }
    .timeline::before { left: 30px; }
    .timeline-item { width: 100%; left: 0 !important; padding-left: 60px; }
    .timeline-item:nth-child(odd) .timeline-dot,
    .timeline-item:nth-child(even) .timeline-dot { left: 20px; right: auto; transform: none; }
}
@media (max-width: 768px) {
    .hero-inner { flex-direction: column; }
    .nav-links { display: none; }
    h1 { font-size: 2.2rem; }
    .about-content { padding: 30px; }
    .contact-section-wrap { padding: 50px 0; }
    .projects-grid { grid-template-columns: 1fr; }
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
	if (v.bio) navAnchors.push(['about', 'About']);
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (key === 'custom_sections') {
			for (const cs of v.custom_sections ?? []) {
				if (cs.items?.length) navAnchors.push([cs.section_id, cs.title]);
			}
			continue;
		}
		if (key in NAV_LABELS) {
			const dataKey = key === 'skills' ? 'skill_groups' : key;
			const data = (v as unknown as Record<string, unknown>)[dataKey];
			if (data && (Array.isArray(data) ? data.length > 0 : Boolean(data))) {
				navAnchors.push([key, NAV_LABELS[key]]);
			}
		}
	}
	if (v.email || v.phone || v.location || v.linkedin_url || v.github_url) navAnchors.push(['contact', 'Contact']);
	const navItems = navAnchors.map(([anchor, label]) => `<li><a href="#${anchor}">${label}</a></li>`).join('');

	const inits = initials(v.name);

	// Hero
	const heroHtml = `<section class="hero">
<div class="container">
<div class="hero-inner">
<div class="hero-content">
<h1 ${_editable('profile.full_name')}>${v.name}</h1>
${v.headline ? `<div class="title" ${_editable('portfolio.headline')}>${v.headline}</div>` : ''}
${v.bio ? `<p class="hero-text" ${_editable('portfolio.bio', true)}>${v.bio}</p>` : ''}
<div class="btn-group">
    <a href="#contact" class="btn">Get In Touch</a>
    <a href="#projects" class="btn btn-outline">View Projects</a>
</div>
</div>
<div class="hero-image">
<div class="profile-img-container">
    <div class="profile-img-bg"></div>
    <div class="profile-initials">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}" class="profile-photo">` : inits}</div>
</div>
</div>
</div>
</div>
</section>`;

	// About
	const aboutHtml = v.bio
		? `<section id="about" class="section">
<div class="container">
<h2 class="section-title">About Me</h2>
<div class="about-content">
<p class="about-text-para" ${_editable('portfolio.bio', true)}>${v.bio}</p>
</div>
</div>
</section>`
		: '';

	// Experience
	const expHtml = !hidden.has('experience') && v.experience?.length
		? `<section id="experience" class="section" style="background-color:var(--section-bg);">
<div class="container">
<h2 class="section-title">Work Experience</h2>
<div class="timeline">
${v.experience
	.map(
		(exp, i) => `<div class="timeline-item" data-item-wrap>
<button class="ce-del-btn" data-del-section="experience" data-del-index="${i}">&#x2715;</button>
<div class="timeline-dot"></div>
<div class="experience-card">
<div class="experience-header">
<div>
<h3 class="experience-title" ${_editable(`experience.${i}.role`)}>${exp.role}</h3>
${exp.company ? `<p class="experience-company" ${_editable(`experience.${i}.company`)}>${exp.company}</p>` : ''}
</div>
${exp.duration ? `<span class="experience-date" ${_editable(`experience.${i}.duration`)}>${exp.duration}</span>` : ''}
</div>
${exp.description ? `<p class="experience-description" ${_editable(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<div class="experience-tech" ${_listEditable(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<span class="tech-tag">${k}</span>`).join('')}</div>` : ''}
</div>
</div>`
	)
	.join('\n')}
</div>
<button class="ce-add-btn" data-add-section="experience">+ Add Experience</button>
</div>
</section>`
		: '';

	// Skills — code-block style
	const skillsHtml = !hidden.has('skills') && v.skill_groups?.length
		? `<section id="skills" class="section">
<div class="container">
<h2 class="section-title">Skills &amp; Expertise</h2>
<div class="skills-container">
${v.skill_groups
	.map(
		(g, i) => `<div class="skill-card" data-item-wrap>
<button class="ce-del-btn" data-del-section="skills" data-del-index="${i}">&#x2715;</button>
<div class="skill-card-header">
<h3 class="skill-card-title">// <span ${_editable(`skills.${i}.category`)}>${g.category}</span></h3>
</div>
<div class="skill-card-body">
<div class="skill-tags" ${_listEditable(`skills.${i}.skills`)}>${g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>
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
		? `<section id="projects" class="section" style="background-color:var(--section-bg);">
<div class="container">
<h2 class="section-title">Featured Projects</h2>
<div class="projects-grid">
${v.projects
	.map((p, i) => {
		const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
		const tags = techSource.map((t) => `<span class="tech-tag">${t}</span>`).join('');
		const links = [
			p.project_url ? `<a href="${p.project_url}" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo</a>` : '',
			p.github_repo ? `<a href="${p.github_repo}" class="project-link" target="_blank" rel="noopener noreferrer">Source Code</a>` : '',
		]
			.filter(Boolean)
			.join('');
		const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const respHtml = resp.length ? `<div class="proj-list-block"><p class="proj-list-label">Responsibilities</p><ul class="proj-list" ${_listEditable(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : '';
			const outHtml = outcomes.length ? `<div class="proj-list-block"><p class="proj-list-label">Outcomes</p><ul class="proj-list" ${_listEditable(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : '';
			return `<div class="project-card" data-item-wrap>
<button class="ce-del-btn" data-del-section="projects" data-del-index="${i}">&#x2715;</button>
<div class="project-content">
<h3 class="project-title" ${_editable(`projects.${i}.title`)}>${p.title}</h3>
${p.description ? `<p class="project-description" ${_editable(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${respHtml}${outHtml}
${tags ? `<div class="project-tech">${tags}</div>` : ''}
${links ? `<div class="project-links">${links}</div>` : ''}
</div>
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
		? `<section id="education" class="section">
<div class="container">
<h2 class="section-title">Education</h2>
<div class="education-container">
${v.education
	.map(
		(edu, i) => {
			const degField = [edu.degree, edu.field_of_study].filter(Boolean).join(' in ');
			const title = degField || edu.institution;
			return `<div class="education-card" data-item-wrap>
<button class="ce-del-btn" data-del-section="education" data-del-index="${i}">&#x2715;</button>
<h3 class="education-degree" ${_editable(`education.${i}.degree`)}>${title}</h3>
${edu.institution ? `<p class="education-institution" ${_editable(`education.${i}.institution`)}>${edu.institution}</p>` : ''}
${edu.year_range ? `<p class="education-year" ${_editable(`education.${i}.year_range`)}>${edu.year_range}</p>` : ''}
${edu.grade_or_score ? `<p class="education-grade" ${_editable(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</p>` : ''}
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
		? `<section id="certifications" class="section" style="background-color:var(--section-bg);">
<div class="container">
<h2 class="section-title">Certifications</h2>
<div class="certifications-container">
${v.certifications
	.map(
		(c, i) => {
			const nameHtml = c.url
				? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>`
				: c.name;
			return `<div class="certification-card" data-item-wrap>
<button class="ce-del-btn" data-del-section="certifications" data-del-index="${i}">&#x2715;</button>
<div class="certification-header">
<div class="certification-icon">&#127942;</div>
<div>
<h3 class="certification-title">${nameHtml}</h3>
${c.issuer ? `<p class="certification-issuer" ${_editable(`certifications.${i}.issuer`)}>${c.issuer}</p>` : ''}
${c.year ? `<p class="certification-date" ${_editable(`certifications.${i}.year`)}>${c.year}</p>` : ''}
</div>
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
		? `<section id="achievements" class="section">
<div class="container">
<h2 class="section-title">Achievements</h2>
<div class="achievements-grid">
${v.achievements
	.map(
		(a, i) => `<div class="achievement-card" data-item-wrap>
<button class="ce-del-btn" data-del-section="achievements" data-del-index="${i}">&#x2715;</button>
<p class="achievement-title"><span ${_editable(`achievements.${i}.title`)}>${a.title}</span>${a.year ? `<span class="achievement-year"> &middot; ${a.year}</span>` : ''}</p>
${a.description ? `<p class="achievement-desc" ${_editable(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>`
	)
	.join('\n')}
</div>
<button class="ce-add-btn" data-add-section="achievements">+ Add Achievement</button>
</div>
</section>`
		: '';

	// Contact
	const infoItems = [
		v.email ? `<div class="contact-item"><div class="contact-icon">&#9993;</div><div class="contact-details"><h3>Email</h3><p ${_editable('profile.email')}>${v.email}</p></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-icon">&#128241;</div><div class="contact-details"><h3>Phone</h3><p ${_editable('profile.phone')}>${v.phone}</p></div></div>` : '',
		v.location ? `<div class="contact-item"><div class="contact-icon">&#128205;</div><div class="contact-details"><h3>Location</h3><p ${_editable('profile.location')}>${v.location}</p></div></div>` : '',
	].filter(Boolean);
	const socialHtml = socialLinksHtml(v);
	const contactHtml =
		infoItems.length || socialHtml
			? `<section id="contact" class="contact-section-wrap">
<div class="container">
<h2 class="contact-title">Get In Touch</h2>
<div class="contact-container">
<div class="contact-info">${infoItems.join('\n')}</div>
${socialHtml ? `<div class="links-container"><div class="links-grid">${socialHtml}</div></div>` : ''}
</div>
</div>
</section>`
			: '';

	// Custom sections
	const customSectionsHtml = !hidden.has('custom_sections') && (v.custom_sections?.length ?? 0) > 0
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length) return '';
			const items = cs.items.map((item, i) => `<div class="project-card" data-item-wrap>
<button class="ce-del-btn" data-del-section="custom_sections" data-del-index="${i}">&#x2715;</button>
${item.label ? `<h3 class="project-title">${item.label}</h3>` : ''}
${item.subtitle ? `<p class="project-description">${item.subtitle}</p>` : ''}
${item.value ? `<p class="project-description">${item.value}</p>` : ''}
${item.tags?.length ? `<div class="project-tech">${item.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="project-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n');
			return `<section id="${cs.section_id}">
<div class="section-header"><h2>${cs.title}</h2></div>
<div class="projects-grid">${items}</div>
<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>
</section>`;
		}).filter(Boolean).join('\n')
		: '';

	// Build ordered sections
	const sectionRenderers: Record<string, string> = {
		experience: expHtml,
		skills: skillsHtml,
		projects: projectsHtml,
		education: educationHtml,
		certifications: certsHtml,
		achievements: achievementsHtml,
		custom_sections: customSectionsHtml,
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
    <title>${v.name} | Portfolio</title>
    <link href="${FONTS_URL}" rel="stylesheet">
    <style>${css()}</style>
</head>
<body>
<header>
    <div class="container">
        <nav>
            <div class="nav-avatar"><div class="nav-avatar-inner">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : initials(v.name)}</div></div>
            <ul class="nav-links">${navItems}</ul>
        </nav>
    </div>
</header>
${heroHtml}
<main>
    ${aboutHtml}
    ${orderedContent}
</main>
${contactHtml}
<footer></footer>
${EDITOR_SCRIPT}
</body>
</html>`;
}
