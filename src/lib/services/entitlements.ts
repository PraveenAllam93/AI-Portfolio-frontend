/**
 * Plan limits, daily usage, and the shared upgrade-prompt plumbing.
 *
 * Everything here is presentation only. The backend re-checks every limit on
 * the endpoint that performs the action, so a tampered store can at worst make
 * the UI look wrong — it can never buy a free user a paid template or an extra
 * AI call.
 */

export interface EntitlementLimits {
	/** null = unlimited */
	portfolios: number | null;
	aiAnalyzePerDay: number | null;
	aiEnhancePerDay: number | null;
	publishesPerDay: number | null;
	projectImagesPerDay: number | null;
	analytics: boolean;
	allTemplates: boolean;
}

export interface EntitlementUsage {
	portfolios: number;
	aiAnalyze: number;
	aiEnhance: number;
	publishes: number;
	projectImages: number;
}

export interface Entitlements {
	plan: string;
	planLabel: string;
	/** ISO timestamp of the next UTC midnight, when daily counters roll over. */
	resetsAt: string;
	limits: EntitlementLimits;
	usage: EntitlementUsage;
	freeTemplates: string[];
}

/** The `limit` object inside a 402 LIMIT_EXCEEDED response. */
export interface LimitInfo {
	name: string;
	label: string;
	plan: string;
	limit: number | string | null;
	used?: number | null;
	resetsAt: string | null;
	templateId?: string;
}

export interface LimitError {
	error: string;
	code: 'LIMIT_EXCEEDED';
	limit: LimitInfo;
	upgradeTo: string;
}

/**
 * Optimistic fallback used only while the real entitlements are loading or if
 * the request fails.
 *
 * Deliberately PERMISSIVE: this drives nothing but presentation, and a
 * pessimistic default would flash locks and "0 credits left" at paying users on
 * every page load. The backend is what actually says no.
 */
export const UNKNOWN_ENTITLEMENTS: Entitlements = {
	plan: 'unknown',
	planLabel: '',
	resetsAt: '',
	limits: {
		portfolios: null,
		aiAnalyzePerDay: null,
		aiEnhancePerDay: null,
		publishesPerDay: null,
		projectImagesPerDay: null,
		analytics: true,
		allTemplates: true
	},
	usage: { portfolios: 0, aiAnalyze: 0, aiEnhance: 0, publishes: 0, projectImages: 0 },
	freeTemplates: []
};

export async function fetchEntitlements(): Promise<Entitlements | null> {
	try {
		const res = await fetch('/api/entitlements');
		if (!res.ok) return null;
		return (await res.json()) as Entitlements;
	} catch {
		return null;
	}
}

/**
 * Read a 402 body off a failed response, or null if it is not a limit error.
 *
 * Call sites use this to decide between "open the upgrade modal" and "show an
 * error toast", so it must not throw on a non-JSON body.
 */
export async function readLimitError(res: Response): Promise<LimitError | null> {
	if (res.status !== 402) return null;
	try {
		const data = await res.json();
		if (data && data.code === 'LIMIT_EXCEEDED') return data as LimitError;
		return null;
	} catch {
		return null;
	}
}

/** Remaining allowance for a daily counter. `null` limit means unlimited. */
export function remaining(limit: number | null, used: number): number | null {
	if (limit === null) return null;
	return Math.max(0, limit - used);
}

/** "resets in 6h" / "resets in 24m" for a counter-exhausted message. */
export function resetsInLabel(resetsAt: string | null | undefined): string {
	if (!resetsAt) return '';
	const ms = new Date(resetsAt).getTime() - Date.now();
	if (!Number.isFinite(ms) || ms <= 0) return 'shortly';
	const mins = Math.ceil(ms / 60000);
	if (mins < 60) return `${mins}m`;
	return `${Math.ceil(mins / 60)}h`;
}
