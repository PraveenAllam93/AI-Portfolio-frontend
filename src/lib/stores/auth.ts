import { writable } from 'svelte/store';
import type { AuthUser } from '$lib/services/auth';

interface AuthState {
	user: AuthUser | null;
	loading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		loading: true
	});

	return {
		subscribe,
		setUser: (user: AuthUser | null) =>
			update((state) => ({ ...state, user, loading: false })),
		setLoading: (loading: boolean) =>
			update((state) => ({ ...state, loading })),
		clear: () => set({ user: null, loading: false })
	};
}

export const authStore = createAuthStore();
