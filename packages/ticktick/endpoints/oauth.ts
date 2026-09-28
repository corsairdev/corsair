import { logEventFromContext } from 'corsair/core';
import type { TickTickEndpoints } from '../index';

export const generateAuthUrl: TickTickEndpoints['generateAuthUrl'] = async (
	ctx,
	input,
) => {
	const creds = await ctx.keys.get_integration_credentials();
	if (!creds.client_id) {
		throw new Error('TickTick client_id is not configured');
	}
	if (!creds.redirect_url) {
		throw new Error(
			'TickTick redirect_url is not configured; set it to the OAuth redirect URL registered for the app',
		);
	}

	// state must be unguessable per call — a constant value would let a
	// replayed authorization response be accepted across sessions (CSRF).
	// It is returned alongside the URL so the caller can verify it on redirect.
	const state = crypto.randomUUID();

	const params = new URLSearchParams({
		client_id: creds.client_id,
		scope: 'tasks:read tasks:write',
		response_type: 'code',
		redirect_uri: creds.redirect_url,
		state,
	});

	const url = `https://ticktick.com/oauth/authorize?${params.toString()}`;

	await logEventFromContext(
		ctx,
		'ticktick.oauth.generateAuthUrl',
		{ ...input },
		'completed',
	);
	return { url, state };
};
