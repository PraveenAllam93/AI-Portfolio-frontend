import type { PortfolioAnalytics, EditableField, PortfolioContent } from '$lib/types/portfolio';

interface ServiceResult<T = undefined> {
	ok: boolean;
	data?: T;
	error?: string;
}

export async function getPortfolioContent(
	userId: string
): Promise<ServiceResult<PortfolioContent>> {
	try {
		const res = await fetch(`/api/portfolio/${userId}`);
		if (!res.ok) return { ok: false, error: 'Failed to load portfolio content' };
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
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
		return { ok: true, data: await res.json() };
	} catch {
		return { ok: false, error: 'Network error' };
	}
}
