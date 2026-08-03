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
import { html as voltageHtml }   from './voltage';
import { html as nimbusHtml }    from './nimbus';
import { html as citrusHtml }    from './citrus';
import { html as consoleHtml }   from './console';
import { html as neuralHtml }    from './neural';
import { html as fluxHtml }      from './flux';
import { html as monolithHtml }  from './monolith';
import { html as helixHtml }     from './helix';
import { html as orbitHtml }     from './orbit';
import { html as irisHtml }      from './iris';
import { html as terminalHtml }  from './terminal';
import { html as beaconHtml }    from './beacon';
import { html as structuraHtml } from './structura';
import { html as blueprintHtml } from './blueprint';
import { html as precisionHtml } from './precision';
import { html as torqueHtml }    from './torque';
import { html as ledgerHtml }    from './ledger';
import { html as sterlingHtml }  from './sterling';
import { html as momentumHtml }  from './momentum';
import { html as apexHtml }      from './apex';
import { html as bloomHtml }     from './bloom';
import { html as signalHtml }    from './signal';
import { html as vantageHtml }   from './vantage';
import { html as canopyHtml }    from './canopy';
import { html as atelierHtml }   from './atelier';
import { html as terraHtml }     from './terra';
import { html as emberHtml }     from './ember';
import { html as folioHtml }     from './folio';
import { html as obsidianHtml }  from './obsidian';
import { html as museHtml }      from './muse';
import { html as prismHtml }     from './prism';
import { html as salonHtml }     from './salon';

type TemplateRenderer = (v: ReturnType<typeof normalize>) => string;

const TEMPLATES: Record<string, TemplateRenderer> = {
	nebula:        nebulaHtml,
	codex:         codexHtml,
	neon:          neonHtml,
	circuit:       circuitHtml,
	glitch:        glitchHtml,
	voltage:       voltageHtml,
	nimbus:        nimbusHtml,
	citrus:        citrusHtml,
	console:       consoleHtml,
	neural:        neuralHtml,
	flux:          fluxHtml,
	monolith:      monolithHtml,
	helix:         helixHtml,
	orbit:         orbitHtml,
	iris:          irisHtml,
	terminal:      terminalHtml,
	beacon:        beaconHtml,
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
	torque:        torqueHtml,
	ledger:        ledgerHtml,
	sterling:      sterlingHtml,
	momentum:      momentumHtml,
	apex:          apexHtml,
	bloom:         bloomHtml,
	signal:        signalHtml,
	vantage:       vantageHtml,
	canopy:        canopyHtml,
	atelier:       atelierHtml,
	terra:         terraHtml,
	ember:         emberHtml,
	folio:         folioHtml,
	obsidian:      obsidianHtml,
	muse:          museHtml,
	prism:         prismHtml,
	salon:         salonHtml,
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
	voltage: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown as "Experience" in the hero meta bar' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "X+ Shipped" in the hero meta bar' },
	],
	nimbus: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stats grid and a floating hero chip' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About stats grid and a floating hero chip' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stats grid' },
	],
	citrus: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stats trio' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown as "Projects shipped" in the About stats trio' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stats trio' },
	],
	console: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stat cards' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About stat cards' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stat cards' },
	],
	neural: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the hero meta grid' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown as "X+ Shipped" in the hero meta grid' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the hero meta grid' },
	],
	flux: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stat cards + a floating hero badge' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About stat cards + a floating hero badge' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stat cards' },
	],
	monolith: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the hero meta row' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown as "X+ Shipped" in the hero meta row' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the hero meta row' },
	],
	helix: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stat cards' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About stat cards' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stat cards' },
	],
	orbit: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About mission-log stat cards' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About mission-log stat cards' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About mission-log stat cards' },
	],
	iris: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stat cards' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About stat cards' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stat cards' },
	],
	terminal: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stat cards' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About stat cards' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stat cards' },
	],
	beacon: [
		{ key: 'years_experience',     label: 'Years of Experience', hint: 'Shown in the About stat cards' },
		{ key: 'projects_count',       label: 'Projects Count',      hint: 'Shown in the About stat cards' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the About stat cards' },
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
	torque: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown as "X+ Years Exp." in the hero stats' },
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "X+ Projects Done" in the hero stats' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown as "X+ Certifications" in the hero stats' },
	],
	ledger: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero meta, ledger card, and stats row' },
		{ key: 'models_count',         label: 'Financial Models',     hint: 'Shown as "Models Built" in the hero meta and the stats row' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the hero meta and the stats row' },
	],
	sterling: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero stats and the About badge' },
		{ key: 'models_count',         label: 'Financial Models',     hint: 'Shown as "Models Built" in the hero stats' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the hero stats' },
	],
	momentum: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the hero stat grid' },
		{ key: 'campaigns_count',  label: 'Campaigns Count',     hint: 'Shown as "Campaigns Delivered" in the hero stat grid' },
		{ key: 'avg_roas',         label: 'Average ROAS (×)',    hint: 'Shown as "Average ROAS" in the hero stat grid' },
	],
	apex: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the hero metric cards and About stats' },
		{ key: 'campaigns_count',  label: 'Campaigns Count',     hint: 'Shown in the hero metric cards and About stats' },
		{ key: 'avg_roas',         label: 'Average ROAS (×)',    hint: 'Shown in the hero metric cards, About stats, and the floating badge' },
	],
	bloom: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the hero stats, mini KPIs, and the About tag' },
		{ key: 'campaigns_count',  label: 'Campaigns Count',     hint: 'Shown in the hero stats and the Impact band' },
		{ key: 'avg_roas',         label: 'Average ROAS (×)',    hint: 'Shown in the hero stats, floating chips, and the About tag' },
	],
	signal: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the About stat block' },
		{ key: 'campaigns_count',  label: 'Campaigns Count',     hint: 'Shown as "Campaigns shipped" in the About stat block' },
		{ key: 'avg_roas',         label: 'Average ROAS (×)',    hint: 'Shown as "Avg. campaign ROAS" in the About stat block' },
	],
	vantage: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the hero KPI row and the About stat card' },
		{ key: 'campaigns_count',  label: 'Campaigns Count',     hint: 'Shown in the hero KPI row' },
		{ key: 'avg_roas',         label: 'Average ROAS (×)',    hint: 'Shown in the hero KPI row' },
	],
	canopy: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the metrics band, About badge, and floating post cards' },
		{ key: 'campaigns_count',  label: 'Campaigns Count',     hint: 'Shown in the metrics band and floating post cards' },
		{ key: 'avg_roas',         label: 'Average ROAS (×)',    hint: 'Shown in the metrics band and floating post cards' },
	],
	atelier: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the hero stat grid' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "Projects Shipped" in the hero stat grid' },
	],
	terra: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the About photo badge' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Computed count of featured projects' },
	],
	ember: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the About stat row' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "Projects" in the About stat row' },
	],
	folio: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the About stat grid' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "Projects" in the About stat grid' },
	],
	obsidian: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the About stats' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "Projects" in the About stats' },
	],
	muse: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the About fact strip' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "Projects" in the About fact strip' },
	],
	prism: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Shown in the About stat cards' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Shown as "Projects" in the About stat cards' },
	],
	salon: [
		{ key: 'years_experience', label: 'Years of Experience', hint: 'Computed years of experience' },
		{ key: 'projects_count',   label: 'Projects Count',      hint: 'Computed count of projects' },
	],
};

/**
 * Templates that render a SEPARATE summary/section image (distinct from the hero
 * profile photo), uploaded from the edit page's "Portfolio Fields" tab and stored
 * as profile.summary_image.
 */
export const SUMMARY_IMAGE_TEMPLATES: ReadonlySet<string> = new Set(['structura', 'citrus', 'bloom', 'vantage', 'canopy']);

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
 * Per-template custom-section layout options — the edit page's "Display Type"
 * dropdown only offers these. VERIFIED against each template's html(): an
 * option is listed ONLY when the template actually branches on display_type
 * and renders that layout. Most templates render a single fixed layout for
 * custom sections; for those, exactly one option is listed so the dropdown
 * never offers a choice that silently does nothing.
 */
export const CUSTOM_DISPLAY_TYPES: Record<string, Array<'cards' | 'list' | 'timeline'>> = {
	// Full three-way branching
	neon:         ['cards', 'list', 'timeline'],
	codex:        ['cards', 'list', 'timeline'],
	circuit:      ['cards', 'list', 'timeline'],
	'navy-gold':  ['cards', 'list', 'timeline'],
	cosmos:       ['cards', 'list', 'timeline'],
	designer:     ['cards', 'list', 'timeline'],
	'designer-2': ['cards', 'list', 'timeline'],
	marketing:    ['cards', 'list', 'timeline'],
	precision:    ['cards', 'list', 'timeline'],
	// Two-way (cards vs list)
	nebula:       ['cards', 'list'],
	glitch:       ['cards', 'list'],
	retro:        ['cards', 'list'],
	aurora:       ['cards', 'list'],
	quantum:      ['cards', 'list'],
	structura:    ['cards', 'list'],
	blueprint:    ['cards', 'list'],
	momentum:     ['cards', 'list'],
	// Single fixed layout — card grid
	voltage:      ['cards'],
	nimbus:       ['cards'],
	console:      ['cards'],
	flux:         ['cards'],
	helix:        ['cards'],
	orbit:        ['cards'],
	iris:         ['cards'],
	terminal:     ['cards'],
	beacon:       ['cards'],
	torque:       ['cards'],
	ledger:       ['cards'],
	sterling:     ['cards'],
	apex:         ['cards'],
	bloom:        ['cards'],
	signal:       ['cards'],
	vantage:      ['cards'],
	canopy:       ['cards'],
	atelier:      ['cards'],
	terra:        ['cards'],
	ember:        ['cards'],
	folio:        ['cards'],
	obsidian:     ['cards'],
	muse:         ['cards'],
	prism:        ['cards'],
	salon:        ['cards'],
	// Single fixed layout — vertical list
	luxe:         ['list'],
	monolith:     ['list'],
	neural:       ['list'],
	// Single fixed layout — timeline
	citrus:       ['timeline'],
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
	voltage:       { name: 'Voltage',     accent: '#e8ff5a', profession: 'software_engineer' },
	nimbus:        { name: 'Nimbus',      accent: '#5b8bff', profession: 'software_engineer' },
	citrus:        { name: 'Citrus',      accent: '#ff5b2e', profession: 'software_engineer' },
	console:       { name: 'Console',     accent: '#29b6e8', profession: 'software_engineer' },
	neural:        { name: 'Neural',      accent: '#b8502c', profession: 'software_engineer' },
	flux:          { name: 'Flux',        accent: '#00d9ff', profession: 'software_engineer' },
	monolith:      { name: 'Monolith',    accent: '#d4c9b0', profession: 'software_engineer' },
	helix:         { name: 'Helix',       accent: '#4d9fff', profession: 'software_engineer' },
	orbit:         { name: 'Orbit',       accent: '#00f5ff', profession: 'software_engineer' },
	iris:          { name: 'Iris',        accent: '#5b47e0', profession: 'software_engineer' },
	terminal:      { name: 'Terminal',    accent: '#00c896', profession: 'software_engineer' },
	beacon:        { name: 'Beacon',      accent: '#6366f1', profession: 'software_engineer' },
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
	torque:        { name: 'Torque',      accent: '#1A3A5C', profession: 'mechanical_engineer' },
	ledger:        { name: 'Ledger',      accent: '#BE6134', profession: 'finance' },
	sterling:      { name: 'Sterling',    accent: '#D4AF37', profession: 'finance' },
	momentum:      { name: 'Momentum',    accent: '#FF4D00', profession: 'marketing' },
	apex:          { name: 'Apex',        accent: '#2563EB', profession: 'marketing' },
	bloom:         { name: 'Bloom',       accent: '#6E9993', profession: 'marketing' },
	signal:        { name: 'Signal',      accent: '#FF4B3A', profession: 'marketing' },
	vantage:       { name: 'Vantage',     accent: '#D4AF37', profession: 'marketing' },
	canopy:        { name: 'Canopy',      accent: '#2A5C52', profession: 'marketing' },
	atelier:       { name: 'Atelier',     accent: '#1f1f1f', profession: 'designer' },
	terra:         { name: 'Terra',       accent: '#c9a96e', profession: 'designer' },
	ember:         { name: 'Ember',       accent: '#b8402f', profession: 'designer' },
	folio:         { name: 'Folio',       accent: '#2f4a3d', profession: 'designer' },
	obsidian:      { name: 'Obsidian',    accent: '#d4af6d', profession: 'designer' },
	muse:          { name: 'Muse',        accent: '#a9c6ea', profession: 'designer' },
	prism:         { name: 'Prism',       accent: '#4a90c4', profession: 'designer' },
	salon:         { name: 'Salon',       accent: '#d4af37', profession: 'designer' },
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
	fieldVisibility?: Record<string, boolean>,
	publishMode?: boolean
): string {
	const id = (templateId ?? '').toLowerCase().trim();
	const renderer = TEMPLATES[id] ?? TEMPLATES[DEFAULT_TEMPLATE];
	const v = normalize(parsedData, portfolioContent, category, sectionOrder, hiddenSections, !(publishMode ?? false), templateOverrides, fieldVisibility);
	const rendered = renderer(v);
	return publishMode ? stripEditingUi(rendered) : rendered;
}
