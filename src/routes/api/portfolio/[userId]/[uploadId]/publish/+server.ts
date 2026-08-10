import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';
import { passThroughLimit } from '$lib/server/limits';

export const POST: RequestHandler = async ({ params, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) throw error(401, 'Not authenticated');
	if (user.userId !== params.userId) throw error(403, 'Forbidden');

	const apiBase = env.API_BASE_URL;
	if (!apiBase) throw error(500, 'API_BASE_URL is not configured');

	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(
		`${apiBase}/portfolio/${params.userId}/${params.uploadId}/publish`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'Content-Type': 'application/json'
			}
		}
	);

	// Daily publish cap — forward the 402 so the editor shows the upgrade path
	// and keeps the draft marked unpublished, rather than a failure toast.
	const limited = await passThroughLimit(upstream);
	if (limited) return limited;

	if (!upstream.ok) {
		const err = await upstream.json().catch(() => ({}));
		throw error(upstream.status, (err as { message?: string }).message ?? 'Failed to publish');
	}
	return json(await upstream.json());
};
