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

	const redirectUri = creds.redirect_url || '';
	const params = new URLSearchParams({
		client_id: creds.client_id,
		scope: 'tasks:read tasks:write',
		response_type: 'code',
		redirect_uri: redirectUri,
		state: 'state',
	});

	const url = `https://ticktick.com/oauth/authorize?${params.toString()}`;

	await logEventFromContext(
		ctx,
		'ticktick.oauth.generateAuthUrl',
		{ ...input },
		'completed',
	);
	return { url };
};
