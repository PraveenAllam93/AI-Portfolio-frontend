/**
 * Template: Neon
 * Dark background (#050816 / #0a0e27), neon green (#00ff88) and cyan (#00d4ff) accents.
 * CSS-only animated floating particles background (NO JS required).
 * Sticky nav with gradient logo text. Two-column hero with circular gradient avatar.
 * Alternating left/right experience timeline with center vertical line.
 * Neon-border cards, glowing hover effects.
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
		['linkedin_url', 'LI'],
		['github_url', 'GH'],
		['portfolio_url', 'PF'],
		['twitter_url', 'TW'],
	];
	return items
		.filter(([key]) => !!v[key])
		.map(
			([key, label]) =>
				`<a href="${v[key]}" class="social-link" target="_blank" rel="noopener noreferrer">${label}</a>`
		)
		.join('');
}

function buildParticleCss(): string {
	const positions = [
		[10, 20], [25, 70], [40, 10], [55, 85], [70, 30],
		[85, 60], [15, 50], [60, 15], [30, 90], [80, 45],
		[50, 55], [90, 25], [5, 65], [45, 40], [75, 75],
		[20, 35], [65, 5], [35, 60], [92, 50], [12, 88],
	];
	const delays = [0, 4, 8, 2, 12, 6, 16, 3, 10, 7, 14, 1, 9, 5, 11, 13, 2, 17, 6, 15];
	const durations = [20, 25, 18, 22, 28, 15, 24, 19, 26, 17, 23, 21, 27, 16, 20, 25, 18, 22, 29, 14];
	const sizes = [4, 6, 3, 5, 4, 7, 3, 5, 6, 4, 3, 5, 4, 6, 5, 3, 7, 4, 5, 3];
	return positions
		.map(
			([left, top], i) =>
				`.particle.p${i + 1}{width:${sizes[i]}px;height:${sizes[i]}px;left:${left}%;top:${top}%;animation-delay:${delays[i]}s;animation-duration:${durations[i]}s;}`
		)
		.join('\n');
}

function css(): string {
	return `
/* ============================================================
   Neon Template — dark #050816 bg, #00ff88 green, #00d4ff cyan
   ============================================================ */

:root {
    --primary:   #00ff88;
    --secondary: #00d4ff;
    --dark:      #0a0e27;
    --darker:    #050816;
    --light:     #ffffff;
    --gray:      #8892b0;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', Arial, sans-serif;
    background: var(--darker);
    color: var(--light);
    overflow-x: hidden;
    min-height: 100vh;
}

a { color: inherit; text-decoration: none; }
a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

/* CSS-only Animated Background */
.bg-animation { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; pointer-events: none; }
.particle { position: absolute; background: var(--primary); border-radius: 50%; opacity: 0.25; animation: float 20s infinite ease-in-out; }
@keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    25%       { transform: translateY(-80px) translateX(40px); }
    50%       { transform: translateY(-40px) translateX(-40px); }
    75%       { transform: translateY(-120px) translateX(80px); }
}

/* Navigation */
nav {
    position: sticky; top: 0; width: 100%;
    background: rgba(10, 14, 39, 0.95);
    backdrop-filter: blur(20px);
    z-index: 1000;
    box-shadow: 0 5px 30px rgba(0, 255, 136, 0.08);
}
.nav-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 3rem; }
.nav-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 2px; flex-shrink: 0; }
.nav-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: var(--darker); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: bold; color: var(--primary); overflow: hidden; }
.nav-avatar-inner img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.nav-links { display: flex; list-style: none; gap: 2.5rem; }
.nav-links a { color: var(--gray); text-decoration: none; font-size: 0.92rem; position: relative; transition: color 0.3s; }
.nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: var(--primary); transition: width 0.3s; }
.nav-links a:hover { color: var(--primary); }
.nav-links a:hover::after { width: 100%; }

/* Hero */
.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 3rem; }
.hero-content { max-width: 1400px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.hero-text h1 { font-size: 3.5rem; line-height: 1.2; margin-bottom: 1rem; }
.gradient-text { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: 1.3rem; color: var(--gray); margin-bottom: 2rem; }
.hero-buttons { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.btn { padding: 1rem 2.5rem; border: none; border-radius: 50px; font-size: 1rem; font-weight: bold; transition: all 0.3s; text-decoration: none; display: inline-block; }
.btn-primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: var(--dark); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3); }
.btn-secondary { background: transparent; border: 2px solid var(--primary); color: var(--primary); }
.btn-secondary:hover { background: var(--primary); color: var(--dark); }
.hero-image-col { display: flex; justify-content: center; align-items: center; }
.image-wrapper { width: 350px; height: 350px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 5px; }
.image-inner { width: 100%; height: 100%; border-radius: 50%; background: var(--darker); display: flex; align-items: center; justify-content: center; font-size: 6rem; font-weight: bold; color: var(--primary); }

/* Sections */
section { padding: 100px 3rem; max-width: 1400px; margin: 0 auto; }
.section-title { font-size: 2.5rem; margin-bottom: 3.5rem; text-align: center; position: relative; }
.section-title::after { content: ''; position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 2px; }

/* About */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.about-text p { font-size: 1.05rem; line-height: 1.8; color: var(--gray); margin-bottom: 1.25rem; }
.about-text p:last-child { margin-bottom: 0; }
.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.stat-card { background: rgba(0,255,136,0.04); padding: 1.5rem; border-radius: 14px; border: 1px solid rgba(0,255,136,0.1); text-align: center; transition: all 0.3s; }
.stat-card:hover { transform: translateY(-8px); border-color: var(--primary); }
.stat-number { font-size: 2.5rem; font-weight: bold; color: var(--primary); display: block; line-height: 1; margin-bottom: 0.4rem; }
.stat-label { color: var(--gray); font-size: 0.85rem; }

/* Alternating Timeline */
.timeline { position: relative; padding: 2rem 0; }
.timeline::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--primary), var(--secondary)); transform: translateX(-50%); }
.tl-item { display: flex; justify-content: flex-end; padding-right: calc(50% + 2.5rem); margin-bottom: 2.5rem; position: relative; }
.tl-item.tl-right { justify-content: flex-start; padding-right: 0; padding-left: calc(50% + 2.5rem); }
.tl-item:last-child { margin-bottom: 0; }
.tl-item::after { content: ''; position: absolute; left: 50%; top: 1.75rem; width: 14px; height: 14px; border-radius: 50%; background: var(--primary); transform: translateX(-50%); box-shadow: 0 0 12px var(--primary); z-index: 1; }
.tl-card { background: rgba(0,255,136,0.04); border: 1px solid rgba(0,255,136,0.2); border-radius: 14px; padding: 1.75rem; width: 100%; transition: all 0.3s; }
.tl-card:hover { box-shadow: 0 0 25px rgba(0,255,136,0.12); border-color: rgba(0,255,136,0.5); }
.tl-card h3 { font-size: 1.25rem; color: var(--primary); margin-bottom: 0.35rem; }
.tl-company { color: var(--secondary); font-size: 1rem; margin-bottom: 0.3rem; }
.tl-date { color: var(--gray); font-size: 0.85rem; margin-bottom: 0.85rem; }
.tl-desc { color: var(--gray); font-size: 0.95rem; line-height: 1.65; margin-bottom: 0.5rem; }
.tl-points { padding-left: 1.2rem; color: var(--gray); font-size: 0.9rem; }
.tl-points li { margin-bottom: 0.25rem; }

/* Skills */
.skills-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
.skill-category { background: rgba(0,255,136,0.04); border: 1px solid rgba(0,255,136,0.2); border-radius: 14px; padding: 1.75rem; transition: all 0.3s; }
.skill-category:hover { box-shadow: 0 0 25px rgba(0,255,136,0.12); border-color: rgba(0,255,136,0.5); }
.skill-category h3 { font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--primary); }
.skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-tag { padding: 0.4rem 1rem; background: rgba(0,212,255,0.07); border: 1px solid rgba(0,212,255,0.3); border-radius: 20px; font-size: 0.85rem; color: var(--secondary); transition: all 0.2s; }
.skill-tag:hover { background: rgba(0,212,255,0.15); border-color: var(--secondary); box-shadow: 0 0 8px rgba(0,212,255,0.2); }

/* Projects */
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; }
.project-card { background: rgba(0,255,136,0.03); border-radius: 18px; overflow: hidden; border: 1px solid rgba(0,255,136,0.1); transition: all 0.4s; }
.project-card:hover { transform: translateY(-12px); border-color: var(--primary); box-shadow: 0 20px 50px rgba(0,255,136,0.15); }
.project-header { height: 120px; background: linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,212,255,0.15)); display: flex; align-items: center; justify-content: center; }
.project-emoji { font-size: 3rem; }
.project-content { padding: 1.75rem; }
.project-content h3 { font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--light); }
.project-content p { color: var(--gray); line-height: 1.6; margin-bottom: 1.25rem; font-size: 0.95rem; }
.project-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
.tag { padding: 0.35rem 0.9rem; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.3); border-radius: 20px; font-size: 0.8rem; color: var(--secondary); }
.proj-list-block { margin-bottom: 1rem; }
.proj-list-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--secondary); margin-bottom: 0.4rem; }
.proj-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3rem; }
.proj-list li { font-size: 0.85rem; color: var(--gray); padding-left: 1rem; position: relative; }
.proj-list li::before { content: '›'; position: absolute; left: 0; color: var(--primary); }
.project-links { display: flex; gap: 1rem; }
.project-link { color: var(--primary); text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
.project-link:hover { color: var(--secondary); }

/* Certifications */
.cert-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.cert-card { background: rgba(0,255,136,0.04); padding: 2rem; border-radius: 14px; border: 1px solid rgba(0,255,136,0.1); transition: all 0.3s; }
.cert-card:hover { border-color: var(--primary); transform: scale(1.03); box-shadow: 0 0 20px rgba(0,255,136,0.1); }
.cert-icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
.cert-card h3 { font-size: 1.15rem; margin-bottom: 0.5rem; color: var(--light); }
.cert-issuer { color: var(--secondary); font-size: 0.9rem; margin-bottom: 0.35rem; }
.cert-year { color: var(--gray); font-size: 0.85rem; }

/* Education */
.edu-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.edu-card { background: rgba(0,255,136,0.04); padding: 2rem; border-radius: 14px; border: 1px solid rgba(0,255,136,0.2); transition: all 0.3s; }
.edu-card:hover { border-color: rgba(0,255,136,0.5); box-shadow: 0 0 25px rgba(0,255,136,0.12); }
.edu-card h3 { font-size: 1.15rem; color: var(--primary); margin-bottom: 0.5rem; }
.edu-institution { color: var(--light); font-size: 0.95rem; margin-bottom: 0.3rem; }
.edu-year { color: var(--gray); font-size: 0.85rem; }
.edu-grade { color: var(--gray); font-size: 0.82rem; margin-top: 0.25rem; }

/* Achievements */
.achievements-list { display: flex; flex-direction: column; gap: 1.25rem; }
.achievement-item { background: rgba(0,255,136,0.04); border: 1px solid rgba(0,255,136,0.2); border-radius: 14px; padding: 1.75rem; display: flex; gap: 1rem; align-items: flex-start; transition: all 0.3s; }
.achievement-item:hover { box-shadow: 0 0 25px rgba(0,255,136,0.12); border-color: rgba(0,255,136,0.5); }
.ach-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 0.55rem; flex-shrink: 0; box-shadow: 0 0 6px var(--primary); }
.achievement-item h4 { color: var(--light); font-size: 1rem; margin-bottom: 0.25rem; }
.ach-year { color: var(--primary); font-size: 0.8rem; }
.achievement-item p { color: var(--gray); font-size: 0.9rem; margin-top: 0.25rem; }

/* Contact */
.contact-info-container { display: flex; flex-direction: column; gap: 1.25rem; max-width: 600px; margin: 0 auto; }
.contact-item { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem 1.5rem; background: rgba(0,255,136,0.04); border-radius: 14px; border: 1px solid rgba(0,255,136,0.1); transition: all 0.3s; }
.contact-item:hover { transform: translateX(8px); border-color: var(--primary); }
.contact-icon { font-size: 1.8rem; color: var(--primary); flex-shrink: 0; }
.contact-details h4 { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray); margin-bottom: 0.2rem; }
.contact-details p { color: var(--light); font-size: 1rem; }
.social-links { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; }
.social-link { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.3); border-radius: 50%; color: var(--primary); text-decoration: none; font-size: 0.8rem; font-weight: 600; transition: all 0.3s; }
.social-link:hover { background: var(--primary); color: var(--dark); transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,255,136,0.25); }

/* Specialty sections */
.award-item, .campaign-card, .fm-item { background: rgba(0,255,136,0.04); padding: 1.75rem; border-radius: 14px; border: 1px solid rgba(0,255,136,0.15); margin-bottom: 1.5rem; transition: all 0.3s; }
.award-item:last-child, .campaign-card:last-child, .fm-item:last-child { margin-bottom: 0; }
.award-item:hover, .campaign-card:hover, .fm-item:hover { border-color: var(--primary); box-shadow: 0 0 20px rgba(0,255,136,0.1); }
.award-item h4, .campaign-card h4, .fm-item h4 { color: var(--primary); font-size: 1.1rem; margin-bottom: 0.5rem; }
.ip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
.ip-card { background: rgba(0,212,255,0.04); padding: 1.5rem; border-radius: 14px; border: 1px solid rgba(0,212,255,0.15); transition: all 0.3s; }
.ip-card:hover { border-color: var(--secondary); box-shadow: 0 0 20px rgba(0,212,255,0.1); }

/* Footer */
footer { text-align: center; padding: 3rem; border-top: 1px solid rgba(0,255,136,0.1); color: var(--gray); font-size: 0.9rem; }

/* Responsive */
@media (max-width: 1024px) {
    .hero-content { grid-template-columns: 1fr; text-align: center; }
    .hero-buttons { justify-content: center; }
    .hero-image-col { display: none; }
    .about-grid { grid-template-columns: 1fr; }
    .skills-container { grid-template-columns: 1fr; }
    .timeline::before { left: 20px; }
    .tl-item, .tl-item.tl-right { justify-content: flex-start; padding-left: 60px; padding-right: 0; }
    .tl-item::after { left: 20px; transform: none; }
}
@media (max-width: 768px) {
    .nav-links { display: none; }
    section { padding: 60px 1.5rem; }
    .hero { padding: 2rem 1.5rem; min-height: auto; padding-top: 80px; }
    .hero-text h1 { font-size: 2.5rem; }
    .projects-grid { grid-template-columns: 1fr; }
}

/* Profile photo */
.avatar-photo { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }

/* Project image slideshow (CSS-only) */
.proj-imgs { position: relative; overflow: hidden; }
.proj-imgs .proj-slide { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; }
.proj-imgs-1 .proj-slide { opacity: 1; animation: none; }
.proj-imgs-2 .proj-slide { animation: projShow2 6s infinite; }
.proj-imgs-2 .proj-slide:nth-child(2) { animation-delay: -3s; }
.proj-imgs-3 .proj-slide { animation: projShow3 9s infinite; }
.proj-imgs-3 .proj-slide:nth-child(2) { animation-delay: -6s; }
.proj-imgs-3 .proj-slide:nth-child(3) { animation-delay: -3s; }
@keyframes projShow2 { 0%, 47% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes projShow3 { 0%, 30% { opacity: 1; } 33%, 100% { opacity: 0; } }
`;
}

export function html(v: NormalizedData): string {
	const em = v.edit_mode;
	const ed = (p: string, ml = false) => em ? _editable(p, ml) : '';
	const led = (p: string) => em ? _listEditable(p) : '';
	const delBtn = (sec: string, idx: number) => em ? `<button class="ce-del-btn" data-del-section="${sec}" data-del-index="${idx}">&#x2715;</button>` : '';
	const addBtn = (sec: string, label: string) => em ? `<button class="ce-add-btn" data-add-section="${sec}">+ Add ${label}</button>` : '';
	const iw = em ? ' data-item-wrap' : '';
	const edScript = em ? EDITOR_SCRIPT : '';
	const order = v.section_order?.length ? v.section_order : DEFAULT_SECTION_ORDER;
	const hidden = v.hidden_sections ?? new Set<string>();

	const NAV_LABELS: Record<string, string> = {
		experience: 'Experience', skills: 'Skills', projects: 'Projects',
		education: 'Education', certifications: 'Certifications',
		achievements: 'Achievements', awards: 'Awards',
		campaigns: 'Campaigns', financial_modeling: 'Financial Modeling',
		investment_portfolios: 'Investment Portfolios',
		design_philosophy: 'Design Philosophy', software_proficiency: 'Software Proficiency',
	};
	const navAnchors: [string, string][] = [];
	if (v.bio) navAnchors.push(['about', 'About']);
	for (const key of order) {
		if (hidden.has(key)) continue;
		if (key === 'custom_sections') {
			for (const cs of v.custom_sections ?? []) {
				if (cs.items?.length || em) navAnchors.push([cs.section_id, cs.title]);
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
	if (v.email || v.phone || v.location) navAnchors.push(['contact', 'Contact']);
	const navItems = navAnchors
		.map(([anchor, label]) => `<li><a href="#${anchor}">${label}</a></li>`)
		.join('');

	const inits = initials(v.name);
	const avatarInner = v.profile_image
		? `<img src="${v.profile_image}" alt="${v.name}" class="avatar-photo">`
		: inits;
	const particleCss = buildParticleCss();

	// Particles HTML
	const particlesHtml = Array.from({ length: 20 }, (_, i) => `<div class="particle p${i + 1}"></div>`).join('');

	// About
	const experienceCount = v.experience?.length ?? 0;
	const projectsCount = v.projects?.length ?? 0;
	const certsCount = v.certifications?.length ?? 0;
	const achCount = v.achievements?.length ?? 0;

	const stats: string[] = [];
	if (experienceCount) stats.push(`<div class="stat-card"><span class="stat-number">${experienceCount}+</span><span class="stat-label">Roles</span></div>`);
	if (projectsCount) stats.push(`<div class="stat-card"><span class="stat-number">${projectsCount}+</span><span class="stat-label">Projects</span></div>`);
	if (certsCount) stats.push(`<div class="stat-card"><span class="stat-number">${certsCount}</span><span class="stat-label">Certifications</span></div>`);
	if (achCount) stats.push(`<div class="stat-card"><span class="stat-number">${achCount}</span><span class="stat-label">Achievements</span></div>`);

	const aboutHtml = v.bio
		? `<section id="about">
<h2 class="section-title">About Me</h2>
<div class="about-grid">
<div class="about-text"><p ${ed('portfolio.bio', true)}>${v.bio}</p></div>
${stats.length ? `<div class="stats-grid">${stats.join('')}</div>` : ''}
</div>
</section>`
		: '';

	// Experience — alternating timeline
	const expHtml = !hidden.has('experience') && (v.experience?.length || em)
		? `<section id="experience">
<h2 class="section-title">Experience</h2>
<div class="timeline">
${v.experience
	.map(
		(exp, i) => {
			const side = i % 2 !== 0 ? 'tl-right' : '';
			return `<div class="tl-item ${side}">
<div class="tl-card"${iw}>
${delBtn('experience', i)}
<h3 ${ed(`experience.${i}.role`)}>${exp.role}</h3>
${exp.company ? `<p class="tl-company" ${ed(`experience.${i}.company`)}>${exp.company}</p>` : ''}
${exp.duration ? `<p class="tl-date" ${ed(`experience.${i}.duration`)}>${exp.duration}</p>` : ''}
${exp.description ? `<p class="tl-desc" ${ed(`experience.${i}.description`, true)}>${exp.description}</p>` : ''}
${exp.key_points?.length ? `<ul class="tl-points" ${led(`experience.${i}.key_points`)}>${exp.key_points.map((k) => `<li>${k}</li>`).join('')}</ul>` : ''}
</div>
</div>`;
		}
	)
	.join('\n')}
</div>
${addBtn('experience', 'Experience')}
</section>`
		: '';

	// Skills
	const skillsHtml = !hidden.has('skills') && (v.skill_groups?.length || em)
		? `<section id="skills">
<h2 class="section-title">Skills</h2>
<div class="skills-container">
${v.skill_groups
	.map(
		(g, i) => `<div class="skill-category"${iw}>
${delBtn('skills', i)}
<h3 ${ed(`skills.${i}.category`)}>${g.category}</h3>
<div class="skill-tags" ${led(`skills.${i}.skills`)}>${g.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}</div>
</div>`
	)
	.join('\n')}
</div>
${addBtn('skills', 'Skill Group')}
</section>`
		: '';

	// Projects
	const emojis = ['&#128736;', '&#128202;', '&#128172;', '&#127760;', '&#128295;', '&#127919;'];
	const projectsHtml = !hidden.has('projects') && (v.projects?.length || em)
		? `<section id="projects">
<h2 class="section-title">Featured Projects</h2>
<div class="projects-grid">
${v.projects
	.map((p, i) => {
		const techSource = p.tech_stack?.length ? p.tech_stack : p.software_used ?? [];
		const tags = techSource.map((t) => `<span class="tag">${t}</span>`).join('');
		const links = [
			p.project_url ? `<a href="${p.project_url}" class="project-link" target="_blank" rel="noopener noreferrer">View Demo &#8594;</a>` : '',
			p.github_repo ? `<a href="${p.github_repo}" class="project-link" target="_blank" rel="noopener noreferrer">GitHub &#8594;</a>` : '',
		]
			.filter(Boolean)
			.join('');
		const emoji = emojis[i % emojis.length];
		const imgs = p.images ?? [];
		let projectHeader: string;
		if (imgs.length === 0) {
			projectHeader = `<div class="project-header"><span class="project-emoji">${emoji}</span></div>`;
		} else if (imgs.length === 1) {
			projectHeader = `<div class="project-header proj-imgs proj-imgs-1"><img class="proj-slide" src="${imgs[0]}" alt="${p.title}"></div>`;
		} else {
			const n = Math.min(imgs.length, 3);
			const slides = imgs.slice(0, n).map((url) => `<img class="proj-slide" src="${url}" alt="${p.title}">`).join('');
			projectHeader = `<div class="project-header proj-imgs proj-imgs-${n}">${slides}</div>`;
		}
		const resp = p.responsibilities ?? [];
			const outcomes = p.measurable_outcomes ?? [];
			const respHtml = resp.length ? `<div class="proj-list-block"><p class="proj-list-label">Responsibilities</p><ul class="proj-list" ${led(`projects.${i}.responsibilities`)}>${resp.map((r) => `<li>${r}</li>`).join('')}</ul></div>` : '';
			const outHtml = outcomes.length ? `<div class="proj-list-block"><p class="proj-list-label">Outcomes</p><ul class="proj-list" ${led(`projects.${i}.measurable_outcomes`)}>${outcomes.map((o) => `<li>${o}</li>`).join('')}</ul></div>` : '';
			return `<div class="project-card"${iw}>
${delBtn('projects', i)}
${projectHeader}
<div class="project-content">
<h3 ${ed(`projects.${i}.title`)}>${p.title}</h3>
${p.description ? `<p ${ed(`projects.${i}.description`, true)}>${p.description}</p>` : ''}
${respHtml}${outHtml}
${tags ? `<div class="project-tags" ${led(`projects.${i}.tech_stack`)}>${tags}</div>` : ''}
${links ? `<div class="project-links">${links}</div>` : ''}
</div>
</div>`;
	})
	.join('\n')}
</div>
${addBtn('projects', 'Project')}
</section>`
		: '';

	// Education
	const educationHtml = !hidden.has('education') && (v.education?.length || em)
		? `<section id="education">
<h2 class="section-title">Education</h2>
<div class="edu-container">
${v.education
	.map(
		(edu, i) => {
			const degField = [edu.degree, edu.field_of_study].filter(Boolean).join(' in ');
			const title = degField || edu.institution;
			return `<div class="edu-card"${iw}>
${delBtn('education', i)}
<h3 ${ed(`education.${i}.degree`)}>${title}</h3>
${edu.institution ? `<p class="edu-institution" ${ed(`education.${i}.institution`)}>${edu.institution}</p>` : ''}
${edu.year_range ? `<p class="edu-year" ${ed(`education.${i}.year_range`)}>${edu.year_range}</p>` : ''}
${edu.grade_or_score ? `<p class="edu-grade" ${ed(`education.${i}.grade_or_score`)}>${edu.grade_or_score}</p>` : ''}
</div>`;
		}
	)
	.join('\n')}
</div>
${addBtn('education', 'Education')}
</section>`
		: '';

	// Certifications
	const certIcons = ['&#127942;', '&#127891;', '&#9883;', '&#128190;', '&#127937;', '&#128295;'];
	const certsHtml = !hidden.has('certifications') && (v.certifications?.length || em)
		? `<section id="certifications">
<h2 class="section-title">Certifications</h2>
<div class="cert-container">
${v.certifications
	.map(
		(c, i) => {
			const nameHtml = c.url
				? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a>`
				: c.name;
			const icon = certIcons[i % certIcons.length];
			return `<div class="cert-card"${iw}>
${delBtn('certifications', i)}
<span class="cert-icon">${icon}</span>
<h3>${nameHtml}</h3>
${c.issuer ? `<p class="cert-issuer" ${ed(`certifications.${i}.issuer`)}>${c.issuer}</p>` : ''}
${c.year ? `<p class="cert-year" ${ed(`certifications.${i}.year`)}>${c.year}</p>` : ''}
</div>`;
		}
	)
	.join('\n')}
</div>
${addBtn('certifications', 'Certification')}
</section>`
		: '';

	// Achievements
	const achievementsHtml = !hidden.has('achievements') && (v.achievements?.length || em)
		? `<section id="achievements">
<h2 class="section-title">Achievements</h2>
<div class="achievements-list">
${v.achievements
	.map(
		(a, i) => {
			return `<div class="achievement-item"${iw}>
${delBtn('achievements', i)}
<span class="ach-dot"></span>
<div>
<h4><span ${ed(`achievements.${i}.title`)}>${a.title}</span>${a.year ? `<span class="ach-year"> &middot; ${a.year}</span>` : ''}</h4>
${a.description ? `<p ${ed(`achievements.${i}.description`, true)}>${a.description}</p>` : ''}
</div>
</div>`;
		}
	)
	.join('\n')}
</div>
${addBtn('achievements', 'Achievement')}
</section>`
		: '';

	// Contact
	const infoItems = [
		v.email ? `<div class="contact-item"><div class="contact-icon">&#9993;</div><div class="contact-details"><h4>Email</h4><p ${ed('profile.email')}>${v.email}</p></div></div>` : '',
		v.phone ? `<div class="contact-item"><div class="contact-icon">&#128241;</div><div class="contact-details"><h4>Phone</h4><p ${ed('profile.phone')}>${v.phone}</p></div></div>` : '',
		v.location ? `<div class="contact-item"><div class="contact-icon">&#128205;</div><div class="contact-details"><h4>Location</h4><p ${ed('profile.location')}>${v.location}</p></div></div>` : '',
	].filter(Boolean);
	const socialHtml = socialLinksHtml(v);
	const contactHtml =
		infoItems.length || socialHtml
			? `<section id="contact">
<h2 class="section-title">Get In Touch</h2>
<div class="contact-info-container">
${infoItems.join('\n')}
${socialHtml ? `<div class="social-links">${socialHtml}</div>` : ''}
</div>
</section>`
			: '';

	// Custom sections
	const customSectionsHtml = !hidden.has('custom_sections') && (v.custom_sections?.length || em)
		? (v.custom_sections ?? []).map((cs, csIdx) => {
			if (!cs.items?.length && !em) return '';
			let inner = '';
			if (cs.display_type === 'cards') {
				inner = `<div class="projects-grid">
${(cs.items ?? []).map((item, i) => `<div class="project-card"${iw}>
${delBtn(`custom_sections.${csIdx}.items`, i)}
${item.label ? `<h3>${item.label}</h3>` : ''}
${item.subtitle ? `<p class="tl-company">${item.subtitle}</p>` : ''}
${item.value ? `<p class="tl-desc">${item.value}</p>` : ''}
${item.tags?.length ? `<div class="skill-tags">${item.tags.map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="project-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>`).join('\n')}
</div>`;
			} else if (cs.display_type === 'timeline') {
				inner = `<div class="timeline">
${(cs.items ?? []).map((item, i) => {
const side = i % 2 !== 0 ? 'tl-right' : '';
return `<div class="tl-item ${side}">
<div class="tl-card"${iw}>
${delBtn(`custom_sections.${csIdx}.items`, i)}
${item.label ? `<h3>${item.label}</h3>` : ''}
${item.subtitle ? `<p class="tl-company">${item.subtitle}</p>` : ''}
${item.value ? `<p class="tl-desc">${item.value}</p>` : ''}
${item.tags?.length ? `<div class="skill-tags">${item.tags.map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="project-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>
</div>`;
}).join('\n')}
</div>`;
			} else {
				// list
				inner = `<div class="achievements-list">
${(cs.items ?? []).map((item, i) => `<div class="achievement-item"${iw}>
${delBtn(`custom_sections.${csIdx}.items`, i)}
<span class="ach-dot"></span>
<div>
${item.label ? `<h4>${item.label}${item.subtitle ? `<span class="ach-year"> &middot; ${item.subtitle}</span>` : ''}</h4>` : ''}
${item.value ? `<p>${item.value}</p>` : ''}
${item.tags?.length ? `<div class="skill-tags">${item.tags.map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div>` : ''}
${item.url ? `<a href="${item.url}" class="project-link" target="_blank" rel="noopener noreferrer">View &#8599;</a>` : ''}
</div>
</div>`).join('\n')}
</div>`;
			}
			return `<section id="${cs.section_id}">
<h2 class="section-title">${cs.title}</h2>
${inner}
${em ? `<button class="ce-add-btn" data-add-section="custom_sections.${csIdx}.items">+ Add Item</button>` : ''}
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
    <title>${v.name} - Portfolio</title>
    <link href="${FONTS_URL}" rel="stylesheet">
    <style>${css()}
${particleCss}
</style>
</head>
<body>
<div class="bg-animation" aria-hidden="true">${particlesHtml}</div>
<nav>
    <div class="nav-container">
        <div class="nav-avatar"><div class="nav-avatar-inner">${v.profile_image ? `<img src="${v.profile_image}" alt="${v.name}">` : initials(v.name)}</div></div>
        <ul class="nav-links">${navItems}</ul>
    </div>
</nav>
<section class="hero" id="home">
    <div class="hero-content">
        <div class="hero-text">
            <h1>Hi, I'm <span class="gradient-text" ${ed('profile.full_name')}>${v.name}</span></h1>
            ${v.headline ? `<p class="hero-subtitle" ${ed('portfolio.headline')}>${v.headline}</p>` : ''}
            <div class="hero-buttons">
                <a href="#contact" class="btn btn-primary">Hire Me</a>
                <a href="#projects" class="btn btn-secondary">View Work</a>
            </div>
        </div>
        <div class="hero-image-col">
            <div class="image-wrapper">
                <div class="image-inner">${avatarInner}</div>
            </div>
        </div>
    </div>
</section>
<main>
    ${aboutHtml}
    ${orderedContent}
    ${contactHtml}
</main>
<footer></footer>
${edScript}
</body>
</html>`;
}
