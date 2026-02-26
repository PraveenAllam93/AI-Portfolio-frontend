/**
 * Server-only Cognito utilities.
 * This file lives in src/lib/server/ — SvelteKit enforces it cannot be
 * imported from client-side code, keeping secrets off the browser.
 */
import {
	CognitoIdentityProviderClient,
	AdminInitiateAuthCommand,
	InitiateAuthCommand,
	SignUpCommand,
	ConfirmSignUpCommand,
	ResendConfirmationCodeCommand,
	type AuthenticationResultType
} from '@aws-sdk/client-cognito-identity-provider';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

// ─── Cognito client ───────────────────────────────────────────────────────────

function getClient() {
	const profile = env.AWS_PROFILE;
	return new CognitoIdentityProviderClient({
		region: env.COGNITO_REGION ?? 'us-east-1',
		...(profile && { credentials: fromIni({ profile }) })
	});
}

function clientId(): string {
	if (!env.COGNITO_CLIENT_ID) throw new Error('COGNITO_CLIENT_ID is not set');
	return env.COGNITO_CLIENT_ID;
}

function userPoolId(): string {
	if (!env.COGNITO_USER_POOL_ID) throw new Error('COGNITO_USER_POOL_ID is not set');
	return env.COGNITO_USER_POOL_ID;
}

// ─── Auth operations ──────────────────────────────────────────────────────────

export async function cognitoLogin(email: string, password: string) {
	return getClient().send(
		new AdminInitiateAuthCommand({
			AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
			ClientId: clientId(),
			UserPoolId: userPoolId(),
			AuthParameters: { USERNAME: email, PASSWORD: password }
		})
	);
}

export async function cognitoRefresh(refreshToken: string) {
	return getClient().send(
		new InitiateAuthCommand({
			AuthFlow: 'REFRESH_TOKEN_AUTH',
			ClientId: clientId(),
			AuthParameters: { REFRESH_TOKEN: refreshToken }
		})
	);
}

export async function cognitoSignUp(email: string, password: string, name: string) {
	return getClient().send(
		new SignUpCommand({
			ClientId: clientId(),
			Username: email,
			Password: password,
			UserAttributes: [
				{ Name: 'email', Value: email },
				{ Name: 'name', Value: name }
			]
		})
	);
}

export async function cognitoConfirm(email: string, code: string) {
	return getClient().send(
		new ConfirmSignUpCommand({
			ClientId: clientId(),
			Username: email,
			ConfirmationCode: code
		})
	);
}

export async function cognitoResendCode(email: string) {
	return getClient().send(
		new ResendConfirmationCodeCommand({
			ClientId: clientId(),
			Username: email
		})
	);
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export interface SessionUser {
	userId: string;
	email: string;
	name: string;
}

/** Decode JWT payload without verifying signature (payload is plain Base64url JSON). */
function decodeJwt(token: string): Record<string, unknown> | null {
	try {
		const [, payload] = token.split('.');
		return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
	} catch {
		return null;
	}
}

export function decodeIdToken(token: string): SessionUser | null {
	const payload = decodeJwt(token);
	if (!payload || typeof payload.sub !== 'string') return null;
	return {
		userId: payload.sub,
		email: typeof payload.email === 'string' ? payload.email : '',
		name:
			typeof payload.name === 'string'
				? payload.name
				: typeof payload.email === 'string'
					? payload.email
					: ''
	};
}

export function isTokenExpired(token: string): boolean {
	const payload = decodeJwt(token);
	if (!payload || typeof payload.exp !== 'number') return true;
	return Date.now() / 1000 >= payload.exp;
}

// ─── Cookie management ────────────────────────────────────────────────────────

const BASE_OPTS = {
	httpOnly: true,
	secure: !dev,       // false on localhost, true in production
	sameSite: 'lax' as const,
	path: '/'
};

export function setAuthCookies(cookies: Cookies, result: AuthenticationResultType) {
	const { IdToken, AccessToken, RefreshToken, ExpiresIn = 3600 } = result;
	if (IdToken) cookies.set('id_token', IdToken, { ...BASE_OPTS, maxAge: ExpiresIn });
	if (AccessToken) cookies.set('access_token', AccessToken, { ...BASE_OPTS, maxAge: ExpiresIn });
	if (RefreshToken)
		cookies.set('refresh_token', RefreshToken, { ...BASE_OPTS, maxAge: 30 * 24 * 60 * 60 });
}

export function clearAuthCookies(cookies: Cookies) {
	for (const name of ['id_token', 'access_token', 'refresh_token']) {
		cookies.delete(name, { path: '/' });
	}
}

/**
 * Read the id_token cookie. If it's expired and a refresh_token exists,
 * transparently refresh and rewrite cookies. Returns null if unauthenticated.
 */
export async function getSessionUser(cookies: Cookies): Promise<SessionUser | null> {
	const idToken = cookies.get('id_token');

	if (idToken && !isTokenExpired(idToken)) {
		return decodeIdToken(idToken);
	}

	// Token missing or expired — try refresh
	const refreshToken = cookies.get('refresh_token');
	if (!refreshToken) return null;

	try {
		const res = await cognitoRefresh(refreshToken);
		if (!res.AuthenticationResult) return null;
		setAuthCookies(cookies, res.AuthenticationResult);
		const newIdToken = res.AuthenticationResult.IdToken;
		return newIdToken ? decodeIdToken(newIdToken) : null;
	} catch {
		clearAuthCookies(cookies);
		return null;
	}
}

// ─── Error parsing ────────────────────────────────────────────────────────────

export function parseCognitoError(err: unknown): string {
	if (err instanceof Error) {
		switch (err.name) {
			case 'NotAuthorizedException':
				return 'Incorrect email or password.';
			case 'UserNotFoundException':
				return 'No account found with this email.';
			case 'UserNotConfirmedException':
				return 'Please confirm your email before logging in.';
			case 'UsernameExistsException':
				return 'An account with this email already exists.';
			case 'InvalidPasswordException':
				return 'Password must be at least 8 characters and include a number and symbol.';
			case 'CodeMismatchException':
				return 'Invalid confirmation code. Please try again.';
			case 'ExpiredCodeException':
				return 'Confirmation code has expired. Please request a new one.';
			case 'LimitExceededException':
				return 'Too many attempts. Please wait a few minutes.';
			case 'TooManyRequestsException':
				return 'Too many requests. Please slow down and try again.';
			default:
				return err.message || 'An unexpected error occurred.';
		}
	}
	return 'An unexpected error occurred.';
}
