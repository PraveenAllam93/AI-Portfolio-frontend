import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	cognitoLogin,
	setAuthCookies,
	decodeIdToken,
	parseCognitoError
} from '$lib/server/cognito';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let identifier: string, password: string;

	try {
		const body = await request.json();
		// `email` is still accepted so older clients keep working.
		identifier = body.identifier ?? body.email;
		password = body.password;
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!identifier || !password) {
		throw error(400, 'Username or email, and password are required');
	}

	try {
		const res = await cognitoLogin(identifier, password);

		if (!res.AuthenticationResult) {
			throw error(401, 'Authentication failed');
		}

		setAuthCookies(cookies, res.AuthenticationResult);

		const user = res.AuthenticationResult.IdToken
			? decodeIdToken(res.AuthenticationResult.IdToken)
			: null;

		return json({ success: true, user });
	} catch (err) {
		// Re-throw SvelteKit errors as-is
		if (err instanceof Error && 'status' in err) throw err;
		throw error(401, parseCognitoError(err));
	}
};
