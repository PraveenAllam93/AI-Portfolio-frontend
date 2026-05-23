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
import { html as galaxyHtml }   from './galaxy';
import { html as codexHtml }    from './codex';
import { html as neonHtml }     from './neon';
import { html as circuitHtml }  from './circuit';
import { html as navyGoldHtml } from './navy-gold';
import { html as cosmosHtml }   from './cosmos';
import { html as retroHtml }    from './retro';
import { html as luxeHtml }     from './luxe';
import { html as auroraHtml }   from './aurora';
import { html as quantumHtml }  from './quantum';

type TemplateRenderer = (v: ReturnType<typeof normalize>) => string;

const TEMPLATES: Record<string, TemplateRenderer> = {
	nebula:      nebulaHtml,
	galaxy:      galaxyHtml,
	codex:       codexHtml,
	neon:        neonHtml,
	circuit:     circuitHtml,
	'navy-gold': navyGoldHtml,
	cosmos:      cosmosHtml,
	retro:       retroHtml,
	luxe:        luxeHtml,
	aurora:      auroraHtml,
	quantum:     quantumHtml,
};

/** Default template used when templateId is missing or unknown. */
const DEFAULT_TEMPLATE = 'neon';

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
	publishMode?: boolean
): string {
	const id = (templateId ?? '').toLowerCase().trim();
	const renderer = TEMPLATES[id] ?? TEMPLATES[DEFAULT_TEMPLATE];
	const v = normalize(parsedData, portfolioContent, category, sectionOrder, hiddenSections, !(publishMode ?? false));
	const rendered = renderer(v);
	return publishMode ? stripEditingUi(rendered) : rendered;
}
