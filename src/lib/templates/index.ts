/**
 * Template dispatcher — renders a portfolio to an HTML string client-side.
 *
 * Usage:
 *   import { renderPortfolio } from '$lib/templates';
 *   const htmlStr = renderPortfolio(templateId, parsedData, portfolioContent, category, sectionOrder, hiddenSections);
 *   // Then: <iframe srcdoc={htmlStr}>
 */

import { normalize } from './base';
import type { ParsedData, PortfolioContent } from '$lib/types/portfolio';

import { html as nebulaHtml }    from './nebula';
import { html as codexHtml }    from './codex';
import { html as neonHtml }     from './neon';
import { html as circuitHtml }  from './circuit';
import { html as navyGoldHtml } from './navy-gold';
import { html as cosmosHtml }   from './cosmos';
import { html as retroHtml }    from './retro';
import { html as luxeHtml }     from './luxe';
import { html as auroraHtml }   from './aurora';
import { html as quantumHtml }  from './quantum';
import { html as designerHtml }  from './designer';
import { html as designer2Html } from './designer-2';
import { html as marketingHtml } from './marketing';
import { html as glitchHtml }    from './glitch';
import { html as structuraHtml } from './structura';
import { html as blueprintHtml } from './blueprint';
import { html as precisionHtml } from './precision';

type TemplateRenderer = (v: ReturnType<typeof normalize>) => string;

const TEMPLATES: Record<string, TemplateRenderer> = {
	nebula:        nebulaHtml,
	codex:         codexHtml,
	neon:          neonHtml,
	circuit:       circuitHtml,
	glitch:        glitchHtml,
	'navy-gold':   navyGoldHtml,
	cosmos:        cosmosHtml,
	retro:         retroHtml,
	luxe:          luxeHtml,
	aurora:        auroraHtml,
	quantum:       quantumHtml,
	designer:      designerHtml,
	'designer-2':  designer2Html,
	marketing:     marketingHtml,
	structura:     structuraHtml,
	blueprint:     blueprintHtml,
	precision:     precisionHtml,
};

/** Default template used when templateId is missing or unknown. */
const DEFAULT_TEMPLATE = 'neon';

/** A stat field that a template shows and allows the user to override. */
export interface TemplateField {
	key: string;
	label: string;
	hint: string;
}

/**
 * Per-template list of override-able stat fields.
 * Templates not in this map (aurora, codex, luxe, nebula, quantum, retro)
 * have no computed stats and show no "Portfolio Fields" panel.
 */
export const TEMPLATE_FIELDS: Record<string, TemplateField[]> = {
	'navy-gold': [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown as "X+ Years Exp" in the hero stats bar' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "X+ Projects" in the hero stats bar' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown as "X+ Certs" in the hero stats bar (no + suffix)' },
	],
	neon: [
		{ key: 'roles_count',          label: 'Roles Count',          hint: 'Shown as "X+ Roles" in the About Me stats grid' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "X+ Projects" in the About Me stats grid' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About Me stats grid' },
		{ key: 'achievements_count',   label: 'Achievements Count',   hint: 'Shown in the About Me stats grid' },
	],
	circuit: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero stat bubbles and about section' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown in the hero stat bubbles and about section' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the about section stats' },
	],
	glitch: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero meta line and the About stat cards' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "X+ Projects Shipped" in the About stat cards' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stat cards' },
		{ key: 'achievements_count',   label: 'Achievements Count',   hint: 'Shown in the About stat cards' },
	],
	cosmos: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero section and achievement milestones' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "X+ Projects" in hero and milestones' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown as "X Certs" in hero and milestones' },
	],
	designer: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown as "X Years active" in the hero stats' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "X Shipped projects" in the hero stats' },
	],
	'designer-2': [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown as "X+ Years active" in the hero stats' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "X+ Projects" in the hero stats' },
		{ key: 'clients_count',    label: 'Clients Count',       hint: 'Shown as "X+ Clients" in the hero stats' },
	],
	marketing: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown as "X+ Yrs Experience" in the hero pills and the Impact section' },
		{ key: 'campaigns_count',  label: 'Campaigns Count',      hint: 'Shown as "X+ Campaigns" in the hero pills and the Impact section' },
		{ key: 'avg_roas',         label: 'Average ROAS (×)',     hint: 'Shown as "Nx Avg. ROAS" in the hero pills and the Impact section' },
	],
	structura: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown as "X+ Years of Professional Experience" in the hero and About panel' },
	],
	blueprint: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero stats bar' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "Projects Delivered" in the hero stats bar' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the hero stats bar' },
	],
	precision: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero stat bar and spec sheet' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "Projects Delivered" in the hero stat bar' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the hero stat bar' },
	],
};

/**
 * Templates that render a SEPARATE summary/section image (distinct from the hero
 * profile photo), uploaded from the edit page's "Portfolio Fields" tab and stored
 * as profile.summary_image.
 */
export const SUMMARY_IMAGE_TEMPLATES: ReadonlySet<string> = new Set(['structura']);

/**
 * Templates with an editable "Core Expertise" list, managed from the Portfolio
 * Fields tab and stored newline-joined as profile.core_expertise. Falls back to
 * the skill-group categories when empty.
 */
export const CORE_EXPERTISE_TEMPLATES: ReadonlySet<string> = new Set(['blueprint']);

/**
 * Templates with an editable contact tagline (static call-to-action copy, not
 * from the résumé), stored as profile.contact_tagline and shown in Portfolio Fields.
 */
export const CONTACT_TAGLINE_TEMPLATES: ReadonlySet<string> = new Set(['blueprint']);

/** Default contact tagline per template (shown until the user overrides it). */
export const DEFAULT_CONTACT_TAGLINE: Record<string, string> = {
	blueprint: 'Open to consulting engagements, full-time roles, and project-based collaborations across residential, commercial, and infrastructure sectors.',
};

/**
 * Per-template custom-section layout options. The edit page's "Display Type"
 * dropdown only offers these, and each template's html() honors them.
 * Every template can render 'cards' and 'list'; 'timeline' is listed only for
 * templates that have a timeline aesthetic to render it in.
 */
export const CUSTOM_DISPLAY_TYPES: Record<string, Array<'cards' | 'list' | 'timeline'>> = {
	neon:         ['cards', 'list', 'timeline'],
	nebula:       ['cards', 'list'],
	codex:        ['cards', 'list', 'timeline'],
	circuit:      ['cards', 'list', 'timeline'],
	glitch:       ['cards', 'list'],
	'navy-gold':  ['cards', 'list', 'timeline'],
	cosmos:       ['cards', 'list', 'timeline'],
	retro:        ['cards', 'list'],
	luxe:         ['list'],
	aurora:       ['cards', 'list'],
	quantum:      ['cards', 'list'],
	designer:     ['cards', 'list', 'timeline'],
	'designer-2': ['cards', 'list', 'timeline'],
	marketing:    ['cards', 'list', 'timeline'],
	structura:    ['cards', 'list'],
	blueprint:    ['cards', 'list'],
	precision:    ['cards', 'list', 'timeline'],
};

/** Layout options a template supports for custom sections (falls back to all three). */
export function customDisplayTypes(templateId: string | undefined | null): Array<'cards' | 'list' | 'timeline'> {
	return CUSTOM_DISPLAY_TYPES[(templateId ?? '').toLowerCase().trim()] ?? ['cards', 'list', 'timeline'];
}

/** Display metadata for each template — name, accent color swatch, and target profession. */
export const TEMPLATE_META: Record<string, { name: string; accent: string; profession: string }> = {
	neon:          { name: 'Neon',        accent: '#00ff88', profession: 'software_engineer' },
	nebula:        { name: 'Nebula',      accent: '#a855f7', profession: 'software_engineer' },
	codex:         { name: 'Codex',       accent: '#3b82f6', profession: 'software_engineer' },
	circuit:       { name: 'Circuit',     accent: '#06b6d4', profession: 'software_engineer' },
	glitch:        { name: 'Glitch',      accent: '#00ff94', profession: 'software_engineer' },
	'navy-gold':   { name: 'Navy Gold',   accent: '#f59e0b', profession: 'software_engineer' },
	cosmos:        { name: 'Cosmos',      accent: '#8b5cf6', profession: 'software_engineer' },
	retro:         { name: 'Retro',       accent: '#f97316', profession: 'software_engineer' },
	luxe:          { name: 'Luxe',        accent: '#d97706', profession: 'software_engineer' },
	aurora:        { name: 'Aurora',      accent: '#ef4444', profession: 'software_engineer' },
	quantum:       { name: 'Quantum',     accent: '#22d3ee', profession: 'software_engineer' },
	designer:      { name: 'Luxe Studio', accent: '#d4ff3a', profession: 'designer' },
	'designer-2':  { name: 'Clean Slate', accent: '#c8f560', profession: 'designer' },
	marketing:     { name: 'Campaign',    accent: '#c4536a', profession: 'marketing' },
	structura:     { name: 'Structura',   accent: '#3498db', profession: 'civil_engineer' },
	blueprint:     { name: 'Blueprint',   accent: '#c9973a', profession: 'civil_engineer' },
	precision:     { name: 'Precision',   accent: '#b8944a', profession: 'mechanical_engineer' },
};

function stripEditingUi(html: string): string {
	return html
		.replace(/<script data-editor>[\s\S]*?<\/script>/g, '')
		.replace(/ contenteditable="true" data-path="[^"]*"( data-multiline="true")?/g, '')
		.replace(/ data-list-path="[^"]*"/g, '')
		.replace(/ data-item-wrap/g, '')
		.replace(/<button\b[^>]*\bdata-del-section\b[^>]*>[\s\S]*?<\/button>/g, '')
		.replace(/<button\b[^>]*\bdata-add-section\b[^>]*>[\s\S]*?<\/button>/g, '');
}

export function renderPortfolio(
	templateId: string | undefined | null,
	parsedData: ParsedData,
	portfolioContent: PortfolioContent,
	category: string,
	sectionOrder?: string[],
	hiddenSections?: string[],
	templateOverrides?: Record<string, number | null>,
	publishMode?: boolean
): string {
	const id = (templateId ?? '').toLowerCase().trim();
	const renderer = TEMPLATES[id] ?? TEMPLATES[DEFAULT_TEMPLATE];
	const v = normalize(parsedData, portfolioContent, category, sectionOrder, hiddenSections, !(publishMode ?? false), templateOverrides);
	const rendered = renderer(v);
	return publishMode ? stripEditingUi(rendered) : rendered;
}
