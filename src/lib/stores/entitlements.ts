import { writable, derived, get } from 'svelte/store';
import {
	fetchEntitlements,
	UNKNOWN_ENTITLEMENTS,
	type Entitlements,
	type LimitError
} from '$lib/services/entitlements';

interface EntitlementsState {
	data: Entitlements;
	loading: boolean;
	/** False until the first successful load — gate lock UI on this. */
	loaded: boolean;
}

function createEntitlementsStore() {
	const store = writable<EntitlementsState>({
		data: UNKNOWN_ENTITLEMENTS,
		loading: false,
		loaded: false
	});
	const { subscribe, set, update } = store;

	async function load(): Promise<void> {
		update((s) => ({ ...s, loading: true }));
		const data = await fetchEntitlements();
		if (data) {
			set({ data, loading: false, loaded: true });
		} else {
			// Keep whatever we had (or the permissive default) rather than
			// locking the UI because one request failed.
			update((s) => ({ ...s, loading: false }));
		}
	}

	/**
	 * Reload only if nothing has been loaded yet — for components that mount
	 * after the layout has already fetched.
	 */
	async function ensure(): Promise<void> {
		if (get(store).loaded) return;
		await load();
	}

	/**
	 * Apply the authoritative usage numbers from a 402 the backend just sent.
	 * Keeps the counter display honest even if the local optimistic count had
	 * drifted (another tab, a refund, a counter reset at midnight).
	 */
	function syncFromLimitError(err: LimitError): void {
		const { name, used } = err.limit;
		if (typeof used !== 'number') return;
		update((s) => {
			const usage = { ...s.data.usage };
			if (name === 'ai_analyze') usage.aiAnalyze = used;
			else if (name === 'ai_enhance') usage.aiEnhance = used;
			else if (name === 'publish') usage.publishes = used;
			else if (name === 'project_image') usage.projectImages = used;
			else if (name === 'portfolios') usage.portfolios = used;
			else return s;
			return { ...s, data: { ...s.data, usage } };
		});
	}

	/**
	 * Optimistically count one consumed unit so the on-screen "N left" updates
	 * immediately after a successful action, without a refetch.
	 */
	function consume(key: keyof Entitlements['usage'], amount = 1): void {
		update((s) => ({
			...s,
			data: { ...s.data, usage: { ...s.data.usage, [key]: s.data.usage[key] + amount } }
		}));
	}

	return { subscribe, load, ensure, syncFromLimitError, consume };
}

export const entitlements = createEntitlementsStore();

/** Convenience: the limits object on its own. */
export const limits = derived(entitlements, ($e) => $e.data.limits);

/** True once we know the plan AND it does not include every template. */
export const templatesRestricted = derived(
	entitlements,
	($e) => $e.loaded && !$e.data.limits.allTemplates
);

/** Set of template ids available on the current plan's free tier. */
export const freeTemplateIds = derived(
	entitlements,
	($e) => new Set($e.data.freeTemplates)
);
