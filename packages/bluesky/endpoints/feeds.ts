import { logEventFromContext } from 'corsair/core';
import { makeBlueskyRequest } from '../client';
import type { BlueskyEndpoints } from '../index';
import type { BlueskyEndpointOutputs } from './types';

export const getTimeline: BlueskyEndpoints['timelineGet'] = async (
	ctx,
	input,
) => {
	const { algorithm, limit, cursor } = input;
	const apiKey = ctx.key;
	const handle = ctx.options.handle ?? (await ctx.keys.get_handle()) ?? '';

	const response = await makeBlueskyRequest<
		BlueskyEndpointOutputs['timelineGet']
	>('app.bsky.feed.getTimeline', apiKey, handle, {
		method: 'GET',
		query: {
			...(algorithm ? { algorithm } : {}),
			...(limit !== undefined ? { limit: String(limit) } : {}),
			...(cursor ? { cursor } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'bluesky.timeline.get',
		{ algorithm, limit, cursor },
		'completed',
	);

	return response;
};
