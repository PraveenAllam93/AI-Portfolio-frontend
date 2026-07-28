/**
 * Client-side auth service.
 * All calls proxy through SvelteKit +server.ts routes.
 * Cognito is never called from the browser — tokens live in HttpOnly cookies.
 */

export interface AuthUser {
	userId: string;
	name: string;
	email: string;
	/** True for an anonymous "Try for free" guest (not yet a real account). */
	isGuest?: boolean;
	/** Public handle used in portfolio URLs. Null for guests. */
	username: string | null;
}

export interface SignUpParams {
	name: string;
	username: string;
	email: string;
	password: string;
}

export interface LoginParams {
	/** Username or email address. */
	identifier: string;
	password: string;
}

export interface AuthResult<T = void> {
	success: boolean;
	data?: T;
	error?: string;
}

/** Extract a human-readable message from a failed SvelteKit API response. */
async function _errorMessage(res: Response, fallback: string): Promise<string> {
	try {
		const data = await res.json();
		return data.message || data.error || fallback;
	} catch {
		return fallback;
	}
}

export async function login({ identifier, password }: LoginParams): Promise<AuthResult<AuthUser>> {
	const res = await fetch('/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});

	if (!res.ok) {
		return { success: false, error: await _errorMessage(res, 'Login failed.') };
	}

	const data = await res.json();
	return { success: true, data: data.user };
}

export async function register({
	name,
	username,
	email,
	password
}: SignUpParams): Promise<AuthResult<{ needsConfirmation: boolean }>> {
	const res = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, username, email, password })
	});

	if (!res.ok) {
		return { success: false, error: await _errorMessage(res, 'Sign up failed.') };
	}

	const data = await res.json();
	return { success: true, data: { needsConfirmation: data.needsConfirmation } };
}

export interface UsernameCheck {
	available: boolean;
	reason: string;
	/** True when the backend could not be reached and availability is unknown. */
	unverified?: boolean;
}

/**
 * Advisory availability check for the signup form.
 * The real decision is made server-side when the account is created.
 */
export async function checkUsername(username: string): Promise<UsernameCheck> {
	try {
		const res = await fetch(`/api/auth/username-check?username=${encodeURIComponent(username)}`);
		if (!res.ok) return { available: true, reason: '', unverified: true };
		return await res.json();
	} catch {
		return { available: true, reason: '', unverified: true };
	}
}

export async function confirmEmail(email: string, code: string): Promise<AuthResult> {
	const res = await fetch('/api/auth/confirm', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, code })
	});

	if (!res.ok) {
		return { success: false, error: await _errorMessage(res, 'Confirmation failed.') };
	}

	return { success: true };
}

export async function resendConfirmationCode(email: string): Promise<AuthResult> {
	const res = await fetch('/api/auth/resend-code', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	});

	if (!res.ok) {
		return { success: false, error: await _errorMessage(res, 'Could not resend code.') };
	}

	return { success: true };
}

/** `identifier` may be a username or an email address. */
export async function forgotPassword(identifier: string): Promise<AuthResult> {
	const res = await fetch('/api/auth/forgot-password', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier })
	});

	if (!res.ok) {
		return { success: false, error: await _errorMessage(res, 'Could not send reset email.') };
	}

	return { success: true };
}

/** `identifier` may be a username or an email address. */
export async function resetPassword(
	identifier: string,
	code: string,
	newPassword: string
): Promise<AuthResult> {
	const res = await fetch('/api/auth/reset-password', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, code, newPassword })
	});

	if (!res.ok) {
		return { success: false, error: await _errorMessage(res, 'Password reset failed.') };
	}

	return { success: true };
}

export async function logout(): Promise<void> {
	await fetch('/api/auth/logout', { method: 'POST' });
}

export async function getAuthUser(): Promise<AuthUser | null> {
	const res = await fetch('/api/auth/me');
	if (!res.ok) return null;
	const data = await res.json();
	return data.user ?? null;
}
