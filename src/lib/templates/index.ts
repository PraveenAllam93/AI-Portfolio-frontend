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
import { html as meridianHtml }  from './meridian';
import { html as cambriaHtml }   from './cambria';
import { html as verdantHtml }   from './verdant';
import { html as havenHtml }     from './haven';
import { html as solaceHtml }    from './solace';
import { html as quillHtml }     from './quill';
import { html as journalHtml }   from './journal';
import { html as atriumHtml }    from './atrium';
import { html as clarionHtml }   from './clarion';
import { html as cadenceHtml }   from './cadence';

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
	meridian:      meridianHtml,
	cambria:       cambriaHtml,
	verdant:       verdantHtml,
	haven:         havenHtml,
	solace:        solaceHtml,
	quill:         quillHtml,
	journal:       journalHtml,
	atrium:        atriumHtml,
	clarion:       clarionHtml,
	cadence:       cadenceHtml,
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
		{ key: 'projects_count',       label: 'Projects Count',       hint: 'Shown as "Projects Completed" in the About stats row' },
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown as "Years Experience" in the About stats row' },
		{ key: 'certifications_count', label: 'Credentials Count',    hint: 'Shown as "Credentials" in the About stats row (defaults to the number of certifications)' },
	],
	meridian: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown as "X+ Years Experience" in the hero stats row' },
		{ key: 'clients_count',        label: 'Client Engagements',   hint: 'Shown as "X+ Client Engagements" in the hero stats row (defaults to the number of engagements)' },
		{ key: 'certifications_count', label: 'Certifications Count', hint: 'Shown in the hero stats row' },
	],
	cambria: [
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown in the hero stats bar under the intro' },
		{ key: 'clients_count',        label: 'Clients Served',       hint: 'Shown as "X+ Clients Served" in the hero stats bar (defaults to the number of engagements)' },
		{ key: 'certifications_count', label: 'Credentials Count',    hint: 'Shown as "Credentials" in the hero stats bar' },
	],
	verdant: [
		{ key: 'clients_count',        label: 'Engagements Delivered', hint: 'Shown in the hero stat row (defaults to the number of engagements)' },
		{ key: 'certifications_count', label: 'Credentials Held',      hint: 'Shown in the hero stat row' },
		{ key: 'years_experience',     label: 'Years of Experience',   hint: 'Shown in the hero stat row' },
	],
	haven: [
		{ key: 'years_experience',     label: 'Years in HR',           hint: 'Shown in the hero stat row under the intro' },
		{ key: 'campaigns_count',      label: 'Programmes Led',        hint: 'Shown as "Programmes Led" (defaults to the number of HR programmes)' },
		{ key: 'roles_count',          label: 'Organisations',         hint: 'Shown as "Organisations" (defaults to the number of roles)' },
	],
	solace: [
		{ key: 'years_experience',     label: 'Years Experience',      hint: 'Shown in the hero glass stat cards and the About metrics' },
		{ key: 'campaigns_count',      label: 'Programmes Led',        hint: 'Shown in the hero stat cards (defaults to the number of HR programmes)' },
		{ key: 'roles_count',          label: 'Organisations',         hint: 'Shown in the hero stat cards (defaults to the number of roles)' },
		{ key: 'certifications_count', label: 'Certifications',        hint: 'Shown in the hero stat cards and About metrics' },
	],
	journal: [
		{ key: 'years_experience',     label: 'Years of Experience',   hint: 'Shown in the dark stats strip below the hero' },
		{ key: 'campaigns_count',      label: 'Programmes Built',      hint: 'Shown in the stats strip (defaults to the number of HR programmes)' },
		{ key: 'roles_count',          label: 'Roles Held',            hint: 'Shown in the stats strip (defaults to the number of roles)' },
		{ key: 'certifications_count', label: 'Credentials Earned',    hint: 'Shown in the stats strip' },
	],
	atrium: [
		{ key: 'years_experience',     label: 'Years in HR',           hint: 'Shown in the bordered stat cells under the hero' },
		{ key: 'campaigns_count',      label: 'Programmes Delivered',  hint: 'Shown in the stat cells (defaults to the number of HR programmes)' },
		{ key: 'roles_count',          label: 'Roles Held',            hint: 'Shown in the stat cells (defaults to the number of roles)' },
		{ key: 'certifications_count', label: 'Credentials',           hint: 'Shown in the stat cells' },
	],
	clarion: [
		{ key: 'years_experience',     label: 'Years Selling',        hint: 'Shown as "Years Selling" in the dark pipeline strip under the hero' },
		{ key: 'deals_count',          label: 'Deals Closed',         hint: 'Shown in the pipeline strip (defaults to the number of deals)' },
		{ key: 'clients_count',        label: 'Accounts Owned',       hint: 'Shown in the pipeline strip (defaults to the number of distinct client names across your deals)' },
		{ key: 'certifications_count', label: 'Certifications',       hint: 'Shown in the pipeline strip' },
	],
	cadence: [
		{ key: 'quota_attainment',     label: 'Quota Attainment (%)', hint: 'Drives the circular gauge below the intro. Defaults to the first percentage found in a role\'s Quota Attainment field; set to 0 to hide the gauge' },
		{ key: 'years_experience',     label: 'Years of Experience',  hint: 'Shown as "Years carrying a number" in the KPI cards beside the gauge' },
		{ key: 'deals_count',          label: 'Deals Closed',         hint: 'Shown as "Deals & accounts closed" in the KPI cards (defaults to the number of deals)' },
	],
};

/**
 * Templates that render a SEPARATE summary/section image (distinct from the hero
 * profile photo), uploaded from the edit page's "Portfolio Fields" tab and stored
 * as profile.summary_image.
 */
export const SUMMARY_IMAGE_TEMPLATES: ReadonlySet<string> = new Set(['structura', 'citrus', 'bloom', 'vantage', 'canopy', 'meridian', 'cambria', 'verdant', 'haven', 'solace', 'quill', 'terra', 'salon']);

/**
 * Templates that render a THIRD image (profile.secondary_image), on top of the
 * hero photo and the summary image. Currently only salon, whose About section is
 * an overlapping two-image composition.
 */
export const SECONDARY_IMAGE_TEMPLATES: ReadonlySet<string> = new Set(['salon']);

/**
 * Per-template wording for the two auxiliary image upload cards.
 *
 * summary_image/secondary_image are generic slots — each template decides where
 * the image actually lands, so the default "About / Summary section" copy is
 * wrong for templates that use the slot for something else (terra puts it behind
 * the hero). Override here so the card never describes the wrong place; anything
 * absent falls back to the default below.
 */
export interface ImageFieldCopy {
	label: string;
	hint: string;
}

export const DEFAULT_SUMMARY_IMAGE_COPY: ImageFieldCopy = {
	label: 'Summary Image',
	hint: 'A separate image shown in your About / Summary section (not your hero profile photo).'
};

export const SUMMARY_IMAGE_COPY: Record<string, ImageFieldCopy> = {
	terra: {
		label: 'Hero Background',
		hint: 'The full-screen photo behind your name at the top of the page. Separate from your profile photo — a room, building or workspace shot works best. Without one the hero shows a warm gradient.'
	},
	salon: {
		label: 'About Image — Main',
		hint: 'The larger image in your About section, sitting at the top right of the pair.'
	}
};

export const DEFAULT_SECONDARY_IMAGE_COPY: ImageFieldCopy = {
	label: 'Secondary Image',
	hint: 'An additional image used by this template.'
};

export const SECONDARY_IMAGE_COPY: Record<string, ImageFieldCopy> = {
	salon: {
		label: 'About Image — Overlap',
		hint: 'The smaller image overlapping the bottom left of the main one. Leave empty to show the main image on its own.'
	}
};

/**
 * Templates with an editable "Core Expertise" list, managed from the Portfolio
 * Fields tab and stored newline-joined as profile.core_expertise. Falls back to
 * the skill-group categories when empty.
 */
export const CORE_EXPERTISE_TEMPLATES: ReadonlySet<string> = new Set(['blueprint', 'meridian', 'cambria', 'verdant', 'haven', 'solace']);

/**
 * Templates with an editable contact tagline (static call-to-action copy, not
 * from the résumé), stored as profile.contact_tagline and shown in Portfolio Fields.
 */
export const CONTACT_TAGLINE_TEMPLATES: ReadonlySet<string> = new Set(['blueprint', 'meridian', 'cambria', 'verdant', 'haven', 'solace', 'quill', 'journal', 'atrium', 'clarion', 'cadence']);

/** Default contact tagline per template (shown until the user overrides it). */
export const DEFAULT_CONTACT_TAGLINE: Record<string, string> = {
	blueprint: 'Open to consulting engagements, full-time roles, and project-based collaborations across residential, commercial, and infrastructure sectors.',
	haven: "Whether you're looking for an HR leader, a strategic advisor, or a speaking engagement, I'd love to hear from you.",
	solace: "Whether you're scaling a startup, transforming a legacy culture, or building a world-class people function — I'd love to explore how we can work together.",
	quill: 'Open to Opportunities',
	journal: "Let's build a workplace people love.",
	atrium: 'Open to opportunities',
	meridian: "Ready to gain financial clarity? Whether you need tax strategy, audit support, or fractional CFO services — let's talk.",
	cambria: "Whether you need a one-time consultation or an ongoing advisory partnership, I'm here to help you make sense of your finances — and make them work harder for you.",
	verdant: 'Available for accounting engagements, statutory reporting, and reconciliation clean-up projects.',
	clarion: "Let's talk pipeline — where it is now, and where it should be next quarter.",
	cadence: "Let's talk pipeline — where it is now, and where it should be next quarter.",
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
	meridian:     ['cards', 'list', 'timeline'],
	cambria:      ['cards', 'list', 'timeline'],
	verdant:      ['cards', 'list', 'timeline'],
	clarion:      ['cards', 'list', 'timeline'],
	cadence:      ['cards', 'list', 'timeline'],
	haven:        ['cards', 'list', 'timeline'],
	solace:       ['cards', 'list', 'timeline'],
	quill:        ['cards', 'list', 'timeline'],
	journal:      ['cards', 'list', 'timeline'],
	atrium:       ['cards', 'list', 'timeline'],
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
	meridian:      { name: 'Meridian',    accent: '#c6a15b', profession: 'accountant' },
	cambria:       { name: 'Cambria',     accent: '#b8935a', profession: 'accountant' },
	verdant:       { name: 'Verdant',     accent: '#B4823F', profession: 'accountant' },
	haven:         { name: 'Haven',       accent: '#7a9e8e', profession: 'hr' },
	solace:        { name: 'Solace',      accent: '#C7A17A', profession: 'hr' },
	quill:         { name: 'Quill',       accent: '#d7b998', profession: 'hr' },
	journal:       { name: 'Journal',     accent: '#9C4258', profession: 'hr' },
	atrium:        { name: 'Atrium',      accent: '#C89B5C', profession: 'hr' },
	clarion:       { name: 'Clarion',     accent: '#AD8636', profession: 'sales' },
	cadence:       { name: 'Cadence',     accent: '#AD7A2C', profession: 'sales' },
};

/**
 * Templates included on the free plan — one per profession, three for software
 * engineering (which has 23 templates, against 2 for several others).
 *
 * This is a PRESENTATION fallback used before the entitlements request lands.
 * The authoritative list is `freeTemplates` from GET /entitlements, which comes
 * straight from the backend's FREE_TEMPLATES set — that is the copy that
 * actually gates anything. Prefer the store (`freeTemplateIds`) wherever it is
 * available, and keep this in sync with
 * src/lambdas/auth/entitlements.py FREE_TEMPLATES.
 */
export const FREE_TEMPLATE_IDS: ReadonlySet<string> = new Set([
	'nebula', 'codex', 'neon',   // software_engineer
	'designer',                   // designer  (Luxe Studio)
	'marketing',                  // marketing (Campaign)
	'sterling',                   // finance
	'blueprint',                  // civil_engineer
	'torque',                     // mechanical_engineer
	'meridian',                   // accountant
	'haven',                      // hr
	'clarion'                     // sales
]);

/** True when `templateId` is included on the free plan. */
export function isFreeTemplate(templateId: string, freeIds?: ReadonlySet<string>): boolean {
	const ids = freeIds && freeIds.size > 0 ? freeIds : FREE_TEMPLATE_IDS;
	return ids.has(templateId);
}

/**
 * Reorder so free templates come first, preserving the existing relative order
 * within each group.
 *
 * Done at render rather than by rewriting the source lists because the free set
 * changes independently of the catalogue: hand-ordered lists would silently rot
 * the next time a template moves tier. It also means the first item a free user
 * sees — and the default the upload carousel lands on at index 0 — is always
 * one they can actually use.
 */
export function sortFreeFirst<T>(
	items: T[],
	idOf: (item: T) => string,
	freeIds?: ReadonlySet<string>
): T[] {
	const free: T[] = [];
	const paid: T[] = [];
	for (const item of items) {
		(isFreeTemplate(idOf(item), freeIds) ? free : paid).push(item);
	}
	return [...free, ...paid];
}

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
