import { logEventFromContext } from 'corsair/core';
import { makeBlueskyRequest } from '../client';
import type { BlueskyEndpoints } from '../index';
import type { BlueskyEndpointOutputs } from './types';

export const get: BlueskyEndpoints['profileGet'] = async (ctx, input) => {
	const { actor } = input;
	const apiKey = ctx.key;
	const handle = ctx.options.handle ?? (await ctx.keys.get_handle()) ?? '';

	const response = await makeBlueskyRequest<
		BlueskyEndpointOutputs['profileGet']
	>('app.bsky.actor.getProfile', apiKey, handle, {
		method: 'GET',
		query: { actor },
	});

	await logEventFromContext(ctx, 'bluesky.profile.get', { actor }, 'completed');

	return response;
};
