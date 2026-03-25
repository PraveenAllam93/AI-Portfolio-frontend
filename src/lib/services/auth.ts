/**
 * Client-side auth service.
 * All calls proxy through SvelteKit +server.ts routes.
 * Cognito is never called from the browser — tokens live in HttpOnly cookies.
 */

export interface AuthUser {
	userId: string;
	name: string;
	email: string;
}

export interface SignUpParams {
	name: string;
	email: string;
	password: string;
}

export interface LoginParams {
	email: string;
	password: string;
}

export interface AuthResult<T = void> {
	success: boolean;
	data?: T;
	error?: string;
}

export async function login({ email, password }: LoginParams): Promise<AuthResult<AuthUser>> {
	const res = await fetch('/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});

	if (!res.ok) {
		const text = await res.text();
		return { success: false, error: text || 'Login failed.' };
	}

	const data = await res.json();
	return { success: true, data: data.user };
}

export async function register({
	name,
	email,
	password
}: SignUpParams): Promise<AuthResult<{ needsConfirmation: boolean }>> {
	const res = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, email, password })
	});

	if (!res.ok) {
		const text = await res.text();
		return { success: false, error: text || 'Sign up failed.' };
	}

	const data = await res.json();
	return { success: true, data: { needsConfirmation: data.needsConfirmation } };
}

export async function confirmEmail(email: string, code: string): Promise<AuthResult> {
	const res = await fetch('/api/auth/confirm', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, code })
	});

	if (!res.ok) {
		const text = await res.text();
		return { success: false, error: text || 'Confirmation failed.' };
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
		const text = await res.text();
		return { success: false, error: text || 'Could not resend code.' };
	}

	return { success: true };
}

export async function forgotPassword(email: string): Promise<AuthResult> {
	const res = await fetch('/api/auth/forgot-password', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	});

	if (!res.ok) {
		const text = await res.text();
		return { success: false, error: text || 'Could not send reset email.' };
	}

	return { success: true };
}

export async function resetPassword(
	email: string,
	code: string,
	newPassword: string
): Promise<AuthResult> {
	const res = await fetch('/api/auth/reset-password', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, code, newPassword })
	});

	if (!res.ok) {
		const text = await res.text();
		return { success: false, error: text || 'Password reset failed.' };
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
