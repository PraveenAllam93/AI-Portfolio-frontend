import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	cognitoLogin,
	setAuthCookies,
	decodeIdToken,
	parseCognitoError
} from '$lib/server/cognito';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let email: string, password: string;

	try {
		({ email, password } = await request.json());
	} catch {
		throw error(400, 'Invalid request body');
	}

	if (!email || !password) {
		throw error(400, 'Email and password are required');
	}

	try {
		const res = await cognitoLogin(email, password);

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
