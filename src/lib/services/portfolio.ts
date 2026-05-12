import type {
	PortfolioAnalytics,
	EditableField,
	PortfolioContent,
	PortfolioData,
	PortfolioConfig,
	SkillGroup
} from '$lib/types/portfolio';

interface ServiceResult<T = undefined> {
	ok: boolean;
	data?: T;
	error?: string;
}

// Portfolio data fetch

/** Fetches portfolioContent + parsedData + category for the edit page. */
export async function getPortfolioData(userId: string): Promise<ServiceResult<PortfolioData>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}`);
		if (!res.ok) return { ok: false, error: 'Failed to load portfolio data' };
		const raw = await res.json();
		return {
			ok: true,
			data: {
				portfolioContent: raw.portfolioContent ?? { bio: '', headline: '', uniqueValue: '' },
				parsedData: raw.parsedData ?? {},
				category: raw.category ?? 'software_engineer',
				templateId: raw.templateId ?? undefined,
				sectionOrder: raw.sectionOrder ?? undefined,
				hiddenSections: raw.hiddenSections ?? undefined
			}
		};
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

/** Legacy helper kept for backwards compatibility. */
export async function getPortfolioContent(
	userId: string
): Promise<ServiceResult<PortfolioContent>> {
	const result = await getPortfolioData(userId);
	if (!result.ok || !result.data) return { ok: false, error: result.error };
	return { ok: true, data: result.data.portfolioContent };
}

export async function getPortfolioAnalytics(
	userId: string
): Promise<ServiceResult<PortfolioAnalytics>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/analytics`);
		if (!res.ok) return { ok: false, error: 'Failed to load analytics' };
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// Scalar field save (portfolioContent)

export async function savePortfolioContent(
	userId: string,
	field: EditableField,
	value: string
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/content`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ field, value })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { message?: string }).message ?? 'Failed to save' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// Section save (parsedData)

/**
 * Replace an entire section in parsedData.
 * data is the full updated array (or string / string[] for special sections).
 */
export async function savePortfolioSection(
	userId: string,
	section: string,
	data: unknown
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/content`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section, data })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return {
				ok: false,
				error: (err as { error?: string; message?: string }).error ?? 'Failed to save section'
			};
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// AI enhancement (scalar field)

export async function getAiEnhancement(
	userId: string,
	field: EditableField,
	instruction: string,
	currentValue: string
): Promise<ServiceResult<{ suggestion: string }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ field, instruction, currentValue })
		});
		if (!res.ok) return { ok: false, error: 'Failed to get suggestion' };
		const json = await res.json();
		return { ok: true, data: { suggestion: json.suggestedValue ?? '' } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// AI enhancement (section item)

export async function getAiItemEnhancement(
	userId: string,
	section: string,
	itemIndex: number,
	enhanceField: string,
	instruction: string
): Promise<ServiceResult<{ suggestion: string | string[] }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section, itemIndex, enhanceField, instruction })
		});
		if (!res.ok) return { ok: false, error: 'Failed to get suggestion' };
		const json = await res.json();
		return { ok: true, data: { suggestion: json.suggestedValue ?? '' } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// AI enhancement (skills with full context)

export async function getAiSkillsEnhancement(
	userId: string,
	instruction: string
): Promise<ServiceResult<{ suggestion: SkillGroup[] }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section: 'skills', instruction })
		});
		if (!res.ok) return { ok: false, error: 'Failed to get suggestion' };
		const json = await res.json();
		return { ok: true, data: { suggestion: json.suggestedValue ?? [] } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// Portfolio config (section order + visibility)

export async function updatePortfolioConfig(
	userId: string,
	config: Partial<PortfolioConfig>
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/content`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section: 'config', data: config })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to save config' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// Template change

export async function changeTemplate(userId: string, templateId: string): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/content`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ field: 'templateId', value: templateId })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to change template' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// Publish draft to live

export async function publishPortfolio(userId: string): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/publish`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to publish' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// Image upload

/**
 * Request a presigned PUT URL for uploading a portfolio image asset.
 * Returns uploadUrl (PUT to S3 directly) and imageUrl (CloudFront URL to persist).
 */
export async function getImageUploadUrl(
	userId: string,
	contentType: string
): Promise<ServiceResult<{ uploadUrl: string; imageUrl: string; expiresIn: number }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/image-upload-url`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contentType })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to get upload URL' };
		}
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// LLM portfolio suggestions

export interface LlmSuggestion {
	id: string;
	section: string;
	index?: number;
	field?: string;
	profileKey?: string;
	label: string;
	sublabel: string;
	instruction: string;
	priority: 'high' | 'medium' | 'low';
}

export async function getAiSuggestions(
	userId: string,
	currentState?: { parsedData: unknown; portfolioContent: unknown; category?: string }
): Promise<ServiceResult<{ suggestions: LlmSuggestion[] }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'analyze_and_suggest',
				...(currentState ?? {})
			})
		});
		if (!res.ok) return { ok: false, error: 'Failed to get suggestions' };
		const json = await res.json();
		return { ok: true, data: { suggestions: json.suggestions ?? [] } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// URL helpers

export function getPortfolioDraftUrl(userId: string, cloudFrontDomain: string): string {
	return `https://${cloudFrontDomain}/${userId}/draft/index.html`;
}

export function getPortfolioPublishedUrl(portfolioPath: string, cloudFrontDomain: string): string {
	return `https://${cloudFrontDomain}/${portfolioPath}/index.html`;
}
