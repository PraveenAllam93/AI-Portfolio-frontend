import type {
	PortfolioAnalytics,
	EditableField,
	PortfolioContent,
	PortfolioData,
	PortfolioConfig,
	SkillGroup
} from '$lib/types/portfolio';
import { readLimitError, type LimitError } from './entitlements';

interface ServiceResult<T = undefined> {
	ok: boolean;
	data?: T;
	error?: string;
	/**
	 * Set instead of a plain `error` when the backend answered 402
	 * LIMIT_EXCEEDED. Callers branch on this to open the upgrade modal rather
	 * than showing a failure toast — running out of plan allowance is an
	 * expected outcome, not a bug.
	 */
	limitError?: LimitError;
}

/**
 * Detect a plan-limit 402 and convert it to a ServiceResult.
 * Returns null when the response is not a limit error, so call sites read:
 *
 *   const limited = await asLimitResult(res);
 *   if (limited) return limited;
 */
async function asLimitResult(res: Response): Promise<ServiceResult<never> | null> {
	const limit = await readLimitError(res.clone());
	if (!limit) return null;
	return { ok: false, error: limit.error, limitError: limit };
}

// ─── Portfolio list ─────────────────────────────────────────────────────────

export interface PortfolioSummary {
	uploadId: string;
	templateId: string;
	status: string;
	portfolioPath: string;
	activeVersion: string | null;
	portfolioUrl: string | null;
	isLive: boolean;
	category: string;
	version: number;
	createdAt: string;
	updatedAt: string | null;
	/**
	 * Permanent public number — the {n} in /u/{username}/{n}.
	 * Assigned at first publish and never reused, so gaps are expected after a
	 * delete. Null for portfolios that have never been published.
	 */
	portfolioNumber: number | null;
	/** True when this portfolio answers the bare /u/{username}. */
	isMain: boolean;
	/** The bare /u/{username} URL — only set on the main portfolio. */
	mainUrl: string | null;
}

/** Point the bare /u/{username} at a different portfolio. */
export async function setMainPortfolio(portfolioNumber: number): Promise<ServiceResult> {
	try {
		const res = await fetch('/api/profile', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ mainPortfolioNumber: portfolioNumber })
		});
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			return { ok: false, error: data.message || data.error || 'Could not set main portfolio.' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function listPortfolios(
	userId: string
): Promise<ServiceResult<{ portfolios: PortfolioSummary[]; total: number }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}`);
		if (!res.ok) return { ok: false, error: 'Failed to list portfolios' };
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function togglePortfolioLive(
	userId: string,
	uploadId: string,
	isLive: boolean
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/toggle-live`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ isLive })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to toggle live' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function deletePortfolio(userId: string, uploadId: string): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}`, { method: 'DELETE' });
		if (!res.ok) {
			const err = await res.json().catch(() => ({})) as { error?: string; message?: string };
			return { ok: false, error: err.message ?? err.error ?? 'Failed to delete portfolio' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── Single portfolio ───────────────────────────────────────────────────────

export async function getPortfolioData(
	userId: string,
	uploadId: string
): Promise<ServiceResult<PortfolioData>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}`);
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
				hiddenSections: raw.hiddenSections ?? undefined,
				templateOverrides: raw.templateOverrides ?? undefined,
				fieldVisibility: raw.fieldVisibility ?? undefined,
				updatedAt: raw.updatedAt ?? null,
				lastPublishedAt: raw.lastPublishedAt ?? null
			}
		};
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function getPortfolioContent(
	userId: string,
	uploadId: string
): Promise<ServiceResult<PortfolioContent>> {
	const result = await getPortfolioData(userId, uploadId);
	if (!result.ok || !result.data) return { ok: false, error: result.error };
	return { ok: true, data: result.data.portfolioContent };
}

export async function getPortfolioAnalytics(
	userId: string,
	uploadId: string
): Promise<ServiceResult<PortfolioAnalytics>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/analytics`);
		// Analytics is paid-only — free users get 402, which the page renders as a
		// locked panel rather than an error.
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) return { ok: false, error: 'Failed to load analytics' };
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── Content edits ──────────────────────────────────────────────────────────

export async function savePortfolioContent(
	userId: string,
	uploadId: string,
	field: EditableField,
	value: string
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/content`, {
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

export async function savePortfolioSection(
	userId: string,
	uploadId: string,
	section: string,
	data: unknown
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/content`, {
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

export async function updatePortfolioConfig(
	userId: string,
	uploadId: string,
	config: Partial<PortfolioConfig>
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/content`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section: 'config', data: config })
		});
		// Switching to a paid template lands here as a 402.
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to save config' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function saveTemplateOverrides(
	userId: string,
	uploadId: string,
	overrides: Record<string, number | null>
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/content`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section: 'template_overrides', data: overrides })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to save template overrides' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── AI enhancement ─────────────────────────────────────────────────────────

export async function getAiEnhancement(
	userId: string,
	uploadId: string,
	field: EditableField,
	instruction: string,
	currentValue: string
): Promise<ServiceResult<{ suggestion: string }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ field, instruction, currentValue })
		});
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) return { ok: false, error: 'Failed to get suggestion' };
		const json = await res.json();
		return { ok: true, data: { suggestion: json.suggestedValue ?? '' } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function getAiItemEnhancement(
	userId: string,
	uploadId: string,
	section: string,
	itemIndex: number,
	enhanceField: string,
	instruction: string
): Promise<ServiceResult<{ suggestion: string | string[] }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section, itemIndex, enhanceField, instruction })
		});
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) return { ok: false, error: 'Failed to get suggestion' };
		const json = await res.json();
		return { ok: true, data: { suggestion: json.suggestedValue ?? '' } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function getAiSkillsEnhancement(
	userId: string,
	uploadId: string,
	instruction: string
): Promise<ServiceResult<{ suggestion: SkillGroup[] }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ section: 'skills', instruction })
		});
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) return { ok: false, error: 'Failed to get suggestion' };
		const json = await res.json();
		return { ok: true, data: { suggestion: json.suggestedValue ?? [] } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function getAiSuggestions(
	userId: string,
	uploadId: string,
	currentState?: { parsedData: unknown; portfolioContent: unknown; category?: string; suppressed?: string[] }
): Promise<ServiceResult<{ suggestions: LlmSuggestion[] }>> {
	// Previously this fell back to a userId-only route when uploadId was missing.
	// That route was removed: the backend has no /portfolio/{userId}/ai-enhance
	// path, so the fallback could only ever fail — and it was unreachable anyway
	// (the sole caller lives on /app/portfolio/[userId]/[uploadId]/edit, where
	// uploadId is always present). Fail explicitly instead of posting into a void.
	if (!uploadId) return { ok: false, error: 'Missing portfolio id' };

	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/ai-enhance`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'analyze_and_suggest',
				...(currentState ?? {})
			})
		});
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) {
			let detail = '';
			try { const b = await res.json(); detail = b?.message ?? b?.error ?? ''; } catch { /* ignore */ }
			return { ok: false, error: `Failed to get suggestions (${res.status})${detail ? ': ' + detail : ''}` };
		}
		const json = await res.json();
		return { ok: true, data: { suggestions: json.suggestions ?? [] } };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── Publish ─────────────────────────────────────────────────────────────────

export async function publishPortfolio(userId: string, uploadId: string): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/publish`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to publish' };
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── Image upload ─────────────────────────────────────────────────────────

export async function getImageUploadUrl(
	userId: string,
	uploadId: string,
	contentType: string
): Promise<ServiceResult<{ uploadUrl: string; imageUrl: string; expiresIn: number }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/image-upload-url`, {
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

export async function generateProjectImage(
	userId: string,
	uploadId: string,
	sectionKey: string,
	itemIdx: number
): Promise<ServiceResult<{ imageUrl: string }>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/project-image/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sectionKey, itemIdx })
		});
		const limited = await asLimitResult(res);
		if (limited) return limited;
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Image generation failed' };
		}
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── Custom section ──────────────────────────────────────────────────────────

export async function addCustomSection(
	userId: string,
	uploadId: string,
	text: string,
	title?: string
): Promise<
	ServiceResult<{
		action: string;
		targetSection?: string;
		item?: Record<string, unknown>;
		section?: unknown;
	}>
> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/custom-section`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text, ...(title ? { title } : {}) })
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return { ok: false, error: (err as { error?: string }).error ?? 'Failed to classify section' };
		}
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── Versions ────────────────────────────────────────────────────────────────

export interface PortfolioVersion {
	versionId: string;
	version: number;
	portfolioPath: string;
	portfolioUrl?: string;
	templateId: string;
	createdAt: string;
	isActive: boolean;
}

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

export async function listVersions(
	userId: string,
	uploadId: string
): Promise<
	ServiceResult<{ versions: PortfolioVersion[]; activeVersion: string | null; portfolioIsLive: boolean; total: number }>
> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/versions`);
		if (!res.ok) return { ok: false, error: 'Could not load your portfolio versions.' };
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function activateVersion(
	userId: string,
	uploadId: string,
	versionId: string
): Promise<ServiceResult> {
	try {
		const res = await fetch(
			`/api/portfolio/${userId}/${uploadId}/versions/${versionId}/activate`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			}
		);
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return {
				ok: false,
				error: (err as { message?: string }).message ?? 'Could not activate version.'
			};
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

export async function deleteVersion(
	userId: string,
	uploadId: string,
	versionId: string
): Promise<ServiceResult> {
	try {
		const res = await fetch(`/api/portfolio/${userId}/${uploadId}/versions/${versionId}`, {
			method: 'DELETE'
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return {
				ok: false,
				error: (err as { message?: string }).message ?? 'Could not delete version.'
			};
		}
		return { ok: true };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}

// ─── URL helpers ─────────────────────────────────────────────────────────────

export function getPortfolioDraftUrl(
	userId: string,
	uploadId: string,
	cloudFrontDomain: string
): string {
	return `https://${cloudFrontDomain}/${userId}/${uploadId}/draft/index.html`;
}

export function getPortfolioPublishedUrl(portfolioPath: string, cloudFrontDomain: string): string {
	return `https://${cloudFrontDomain}/${portfolioPath}/index.html`;
}
