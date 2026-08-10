import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSessionUser } from '$lib/server/cognito';
import { LIMIT_STATUS } from '$lib/server/limits';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, params }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const body = await request.json();
	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/status/${encodeURIComponent(params.uploadId)}/start-generation`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${idToken}`
			},
			body: JSON.stringify(body)
		}
	);

	const data = await upstream.json();

	// The authoritative portfolio-limit and paid-template gates live on this
	// endpoint. Forward the 402 payload so the wizard can show the upgrade
	// modal with the real limit rather than a generic failure.
	if (upstream.status === LIMIT_STATUS) return json(data, { status: LIMIT_STATUS });

	if (!upstream.ok) throw error(upstream.status, data?.error ?? 'Failed to start generation');
	return json(data);
};
