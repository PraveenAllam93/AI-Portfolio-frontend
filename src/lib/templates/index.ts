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

import { html as minimalHtml }   from './minimal';
import { html as modernHtml }    from './modern';
import { html as boldHtml }      from './bold';
import { html as creativeHtml }  from './creative';
import { html as auroraHtml }    from './aurora';
import { html as executiveHtml } from './executive';
import { html as luxuryHtml }    from './luxury';
import { html as nebulaHtml }    from './nebula';

type TemplateRenderer = (v: ReturnType<typeof normalize>) => string;

const TEMPLATES: Record<string, TemplateRenderer> = {
	minimal:   minimalHtml,
	modern:    modernHtml,
	bold:      boldHtml,
	creative:  creativeHtml,
	aurora:    auroraHtml,
	executive: executiveHtml,
	luxury:    luxuryHtml,
	nebula:    nebulaHtml,
};

/** Default template used when templateId is missing or unknown. */
const DEFAULT_TEMPLATE = 'modern';

export function renderPortfolio(
	templateId: string | undefined | null,
	parsedData: ParsedData,
	portfolioContent: PortfolioContent,
	category: string,
	sectionOrder?: string[],
	hiddenSections?: string[]
): string {
	const id = (templateId ?? '').toLowerCase().trim();
	const renderer = TEMPLATES[id] ?? TEMPLATES[DEFAULT_TEMPLATE];
	const v = normalize(parsedData, portfolioContent, category, sectionOrder, hiddenSections);
	return renderer(v);
}
