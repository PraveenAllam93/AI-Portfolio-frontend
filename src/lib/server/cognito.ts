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
	ForgotPasswordCommand,
	ConfirmForgotPasswordCommand,
	AdminCreateUserCommand,
	AdminSetUserPasswordCommand,
	type AuthenticationResultType
} from '@aws-sdk/client-cognito-identity-provider';
import { randomUUID, randomBytes } from 'node:crypto';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

/**
 * Reserved, non-routable email domain for anonymous "Try for free" guests.
 * Guest Cognito users are `guest-<uuid>@<GUEST_EMAIL_DOMAIN>`. MUST match the
 * backend GUEST_EMAIL_DOMAIN (terraform var of the same name).
 */
export const GUEST_EMAIL_DOMAIN = env.GUEST_EMAIL_DOMAIN ?? 'guest.aifolio.internal';

export function isGuestEmail(email: string | undefined | null): boolean {
	return !!email && email.toLowerCase().endsWith('@' + GUEST_EMAIL_DOMAIN);
}

// ─── Cognito client ───────────────────────────────────────────────────────────

function getClient() {
	return new CognitoIdentityProviderClient({
		region: env.COGNITO_REGION ?? 'us-east-1'
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

export async function cognitoForgotPassword(email: string) {
	return getClient().send(
		new ForgotPasswordCommand({
			ClientId: clientId(),
			Username: email
		})
	);
}

export async function cognitoResetPassword(email: string, code: string, newPassword: string) {
	return getClient().send(
		new ConfirmForgotPasswordCommand({
			ClientId: clientId(),
			Username: email,
			ConfirmationCode: code,
			Password: newPassword
		})
	);
}

// ─── Anonymous guest ("Try for free") ─────────────────────────────────────────

/** Generate a strong random password that satisfies the pool's password policy. */
function randomPassword(): string {
	// Guarantee one of each class the policy may require, then pad with entropy.
	const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
	const lower = 'abcdefghijkmnpqrstuvwxyz';
	const digit = '23456789';
	const symbol = '!@#$%^&*-_';
	const pick = (set: string) => set[randomBytes(1)[0] % set.length];
	const filler = randomBytes(24).toString('base64').replace(/[^A-Za-z0-9]/g, '');
	return pick(upper) + pick(lower) + pick(digit) + pick(symbol) + filler;
}

/**
 * Create an anonymous guest and return an authenticated session for them.
 *
 * The guest is a real Cognito user with a reserved, non-routable placeholder
 * email (`guest-<uuid>@GUEST_EMAIL_DOMAIN`). Because MessageAction is SUPPRESS
 * and email_verified is set manually, no mail is ever sent and the address need
 * not be real. The whole validated pipeline then runs unchanged for the guest;
 * only publishing is gated (draft-only) until they create a real account.
 *
 * Returns the AuthenticationResult (id/access/refresh tokens) plus the guest's
 * email so the caller can persist it.
 */
export async function cognitoCreateGuest(): Promise<{
	result: AuthenticationResultType;
	email: string;
}> {
	const client = getClient();
	const email = `guest-${randomUUID()}@${GUEST_EMAIL_DOMAIN}`;
	const password = randomPassword();

	await client.send(
		new AdminCreateUserCommand({
			UserPoolId: userPoolId(),
			Username: email,
			MessageAction: 'SUPPRESS', // never email the placeholder address
			UserAttributes: [
				{ Name: 'email', Value: email },
				{ Name: 'email_verified', Value: 'true' },
				{ Name: 'name', Value: 'Guest' }
			]
		})
	);

	// AdminCreateUser leaves the user in FORCE_CHANGE_PASSWORD; set a permanent
	// password so ADMIN_USER_PASSWORD_AUTH succeeds immediately.
	await client.send(
		new AdminSetUserPasswordCommand({
			UserPoolId: userPoolId(),
			Username: email,
			Password: password,
			Permanent: true
		})
	);

	const auth = await client.send(
		new AdminInitiateAuthCommand({
			AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
			ClientId: clientId(),
			UserPoolId: userPoolId(),
			AuthParameters: { USERNAME: email, PASSWORD: password }
		})
	);

	if (!auth.AuthenticationResult) {
		throw new Error('Guest authentication failed');
	}
	return { result: auth.AuthenticationResult, email };
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export interface SessionUser {
	userId: string;
	email: string;
	name: string;
	/** True when this is an anonymous "Try for free" guest (placeholder email). */
	isGuest: boolean;
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
	const email = typeof payload.email === 'string' ? payload.email : '';
	return {
		userId: payload.sub,
		email,
		name:
			typeof payload.name === 'string'
				? payload.name
				: email || '',
		isGuest: isGuestEmail(email)
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
	secure: !dev, // false on localhost, true in production
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

// The guest's Cognito sub, persisted separately from the auth cookies so it
// survives them being overwritten when the guest later logs in as a real user.
// The claim step reads this to know which guest namespace to migrate.
const GUEST_UID_COOKIE = 'guest_uid';

export function setGuestUid(cookies: Cookies, guestSub: string) {
	cookies.set(GUEST_UID_COOKIE, guestSub, {
		...BASE_OPTS,
		maxAge: 3 * 24 * 60 * 60 // 3 days — matches the backend guest reaper TTL
	});
}

export function getGuestUid(cookies: Cookies): string | undefined {
	return cookies.get(GUEST_UID_COOKIE);
}

export function clearGuestUid(cookies: Cookies) {
	cookies.delete(GUEST_UID_COOKIE, { path: '/' });
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
			case 'InvalidParameterException':
				return 'Invalid input. Please check your details and try again.';
			default:
				return err.message || 'An unexpected error occurred.';
		}
	}
	return 'An unexpected error occurred.';
}
