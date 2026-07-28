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
	ListUsersCommand,
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
	// Credentials are passed explicitly rather than left to the SDK's default
	// chain. The chain reads process.env, but SvelteKit exposes .env through
	// $env/dynamic/private — the values do not reliably reach process.env, and
	// dotenv will not override anything already exported in the shell. Either
	// gap surfaces as "The security token included in the request is invalid".
	//
	// In production, leave AWS_ACCESS_KEY_ID unset: this falls through to the
	// default chain and picks up the task/instance IAM role automatically.
	const credentials =
		env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
			? {
					accessKeyId: env.AWS_ACCESS_KEY_ID,
					secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
					...(env.AWS_SESSION_TOKEN ? { sessionToken: env.AWS_SESSION_TOKEN } : {})
				}
			: undefined;

	return new CognitoIdentityProviderClient({
		region: env.COGNITO_REGION ?? 'us-east-1',
		...(credentials ? { credentials } : {})
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

// ─── Identifier resolution ────────────────────────────────────────────────────

/**
 * A Cognito Username that cannot exist in this pool. Real Usernames here are
 * UUIDs (the pool uses username_attributes = ["email"]), and our own handles
 * must start with a letter or number, so nothing can collide with this.
 */
const IMPOSSIBLE_USERNAME = '__nonexistent__';

/**
 * Resolve whatever the user typed into the value Cognito expects as `Username`.
 *
 * The pool is configured with username_attributes = ["email"], so a Cognito
 * user's Username *is* its sub and an email works directly. A handle does not,
 * so we look it up: `preferred_username` is a standard attribute and therefore
 * searchable through ListUsers (custom attributes are not — that is precisely
 * why the handle is stored on this attribute).
 *
 * Returns null when the handle matches no account. Callers must treat that the
 * same as a wrong password, so this never becomes a username oracle.
 */
export async function resolveIdentifier(identifier: string): Promise<string | null> {
	const value = identifier.trim();
	if (!value) return null;

	// Emails are accepted by Cognito as-is.
	if (value.includes('@')) return value.toLowerCase();

	const handle = value.toLowerCase();

	// Quote-escape defensively: the filter syntax is string-delimited, and an
	// unescaped quote would otherwise let input break out of the predicate.
	const escaped = handle.replace(/"/g, '\\"');

	const res = await getClient().send(
		new ListUsersCommand({
			UserPoolId: userPoolId(),
			Filter: `preferred_username = "${escaped}"`,
			Limit: 1
		})
	);

	const user = res.Users?.[0];
	if (!user) return null;

	// Username === sub for this pool type; prefer the explicit sub attribute.
	return user.Attributes?.find((a) => a.Name === 'sub')?.Value ?? user.Username ?? null;
}

// ─── Auth operations ──────────────────────────────────────────────────────────

/** `identifier` may be an email address or a username. */
export async function cognitoLogin(identifier: string, password: string) {
	const username = await resolveIdentifier(identifier);

	// Unknown handle: hand Cognito something that cannot exist so it produces the
	// same error a wrong password does. Returning early with a distinct error
	// would reveal which handles are registered.
	const resolved = username ?? IMPOSSIBLE_USERNAME;

	return getClient().send(
		new AdminInitiateAuthCommand({
			AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
			ClientId: clientId(),
			UserPoolId: userPoolId(),
			AuthParameters: { USERNAME: resolved, PASSWORD: password }
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

export async function cognitoSignUp(
	email: string,
	password: string,
	name: string,
	username: string
) {
	return getClient().send(
		new SignUpCommand({
			ClientId: clientId(),
			Username: email,
			Password: password,
			UserAttributes: [
				{ Name: 'email', Value: email },
				{ Name: 'name', Value: name },
				// Claimed atomically by the PreSignUp trigger, which fails the
				// whole sign-up if the handle is already taken.
				{ Name: 'preferred_username', Value: username }
			]
		})
	);
}

/**
 * The remaining flows all accept an email address or a username.
 *
 * Each resolves the identifier first. When a handle is unknown, the raw input
 * is passed through unchanged so Cognito returns its own UserNotFoundException
 * — the callers already convert that into a neutral response, so an unknown
 * handle is indistinguishable from an unknown email.
 */

export async function cognitoConfirm(identifier: string, code: string) {
	const username = (await resolveIdentifier(identifier)) ?? identifier;
	return getClient().send(
		new ConfirmSignUpCommand({
			ClientId: clientId(),
			Username: username,
			ConfirmationCode: code
		})
	);
}

export async function cognitoResendCode(identifier: string) {
	const username = (await resolveIdentifier(identifier)) ?? identifier;
	return getClient().send(
		new ResendConfirmationCodeCommand({
			ClientId: clientId(),
			Username: username
		})
	);
}

export async function cognitoForgotPassword(identifier: string) {
	const username = (await resolveIdentifier(identifier)) ?? identifier;
	return getClient().send(
		new ForgotPasswordCommand({
			ClientId: clientId(),
			Username: username
		})
	);
}

export async function cognitoResetPassword(
	identifier: string,
	code: string,
	newPassword: string
) {
	const username = (await resolveIdentifier(identifier)) ?? identifier;
	return getClient().send(
		new ConfirmForgotPasswordCommand({
			ClientId: clientId(),
			Username: username,
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
	/**
	 * Public handle used in portfolio URLs.
	 *
	 * Stored on Cognito as the standard `preferred_username` attribute, so it
	 * rides along on the ID token (no round trip to build a URL) and is
	 * searchable via ListUsers (which is how username logins resolve).
	 *
	 * DynamoDB remains the authority for uniqueness; this is a searchable copy
	 * and can lag by up to one token lifetime after a rename. That is safe — the
	 * old handle stays resolvable as a tombstone, and the rename endpoint forces
	 * a token refresh so the UI updates immediately.
	 *
	 * Null for guests and any account created before usernames existed.
	 */
	username: string | null;
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
		isGuest: isGuestEmail(email),
		username:
			typeof payload.preferred_username === 'string' ? payload.preferred_username : null
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

// The guest's OWN tokens, kept under distinct names so they survive the real
// login overwriting id_token/access_token/refresh_token. The claim step forwards
// the guest ACCESS token to the backend, which validates it (Cognito GetUser) to
// PROVE the caller owns the guest session — a leaked guest sub alone can no
// longer be used to claim someone else's draft.
const GUEST_ACCESS_TOKEN_COOKIE = 'guest_access_token';
const GUEST_REFRESH_TOKEN_COOKIE = 'guest_refresh_token';
const GUEST_MAX_AGE = 3 * 24 * 60 * 60; // 3 days — matches the backend guest reaper TTL

export function setGuestUid(cookies: Cookies, guestSub: string) {
	cookies.set(GUEST_UID_COOKIE, guestSub, { ...BASE_OPTS, maxAge: GUEST_MAX_AGE });
}

/** Persist the guest's own access + refresh tokens for the later claim step. */
export function setGuestTokens(cookies: Cookies, result: AuthenticationResultType) {
	if (result.AccessToken)
		cookies.set(GUEST_ACCESS_TOKEN_COOKIE, result.AccessToken, { ...BASE_OPTS, maxAge: GUEST_MAX_AGE });
	if (result.RefreshToken)
		cookies.set(GUEST_REFRESH_TOKEN_COOKIE, result.RefreshToken, { ...BASE_OPTS, maxAge: GUEST_MAX_AGE });
}

export function getGuestUid(cookies: Cookies): string | undefined {
	return cookies.get(GUEST_UID_COOKIE);
}

/**
 * Return a currently-valid guest ACCESS token for the claim call, refreshing it
 * with the stored guest refresh token if it has expired. Returns null when there
 * is no usable guest session.
 */
export async function getValidGuestAccessToken(cookies: Cookies): Promise<string | null> {
	const accessToken = cookies.get(GUEST_ACCESS_TOKEN_COOKIE);
	if (accessToken && !isTokenExpired(accessToken)) return accessToken;

	const refreshToken = cookies.get(GUEST_REFRESH_TOKEN_COOKIE);
	if (!refreshToken) return null;
	try {
		const res = await cognitoRefresh(refreshToken);
		const fresh = res.AuthenticationResult?.AccessToken;
		if (!fresh) return null;
		cookies.set(GUEST_ACCESS_TOKEN_COOKIE, fresh, { ...BASE_OPTS, maxAge: GUEST_MAX_AGE });
		return fresh;
	} catch {
		return null;
	}
}

export function clearGuestUid(cookies: Cookies) {
	cookies.delete(GUEST_UID_COOKIE, { path: '/' });
	cookies.delete(GUEST_ACCESS_TOKEN_COOKIE, { path: '/' });
	cookies.delete(GUEST_REFRESH_TOKEN_COOKIE, { path: '/' });
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

/**
 * Cognito wraps anything a Lambda trigger throws in a UserLambdaValidationException
 * whose message looks like:
 *
 *   "PreSignUp failed with error That username is already taken.."
 *
 * The trigger's messages are written to be user-facing, so pull the original
 * back out rather than showing the wrapper.
 */
function unwrapTriggerError(message: string): string | null {
	const match = message.match(/failed with error\s+(.*?)\.?\s*$/i);
	if (!match) return null;
	const inner = match[1].trim();
	return inner ? (inner.endsWith('.') ? inner : `${inner}.`) : null;
}

export function parseCognitoError(err: unknown): string {
	if (err instanceof Error) {
		if (err.name === 'UserLambdaValidationException') {
			return unwrapTriggerError(err.message) ?? 'Could not complete signup. Please try again.';
		}

		switch (err.name) {
			case 'NotAuthorizedException':
				return 'Incorrect username/email or password.';
			case 'UserNotFoundException':
				return 'No account found with those details.';
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
