import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSessionUser } from '$lib/server/cognito';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = await getSessionUser(cookies);
	if (!user) {
		throw error(401, 'Not authenticated');
	}

	const apiBase = env.API_BASE_URL;
	if (!apiBase) {
		throw error(500, 'API_BASE_URL is not configured');
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid request body');
	}

	// Forward the id_token to the backend for its own auth check
	const idToken = cookies.get('id_token') ?? '';

	const upstream = await fetch(`${apiBase}/upload/presigned-url`, {
		method: 'POST',
		headers: {
			Authorization: idToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	const text = await upstream.text();

	if (!upstream.ok) {
		throw error(upstream.status, text || 'Upstream request failed');
	}

	let data: unknown;
	try {
		data = JSON.parse(text);
	} catch {
		throw error(502, 'Invalid response from upstream');
	}

	return json(data);
};
