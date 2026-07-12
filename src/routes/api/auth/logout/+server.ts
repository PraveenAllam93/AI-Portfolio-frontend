import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearAuthCookies, clearGuestUid } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ cookies }) => {
	clearAuthCookies(cookies);
	clearGuestUid(cookies);
	return json({ success: true });
};
