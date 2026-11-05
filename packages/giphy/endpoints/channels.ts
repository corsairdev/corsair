import { logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import { resolveApiKey } from './auth';
import type { GiphyEndpointOutputs } from './types';
import { GiphyChannelsResponseSchema } from './types';

// Channel Search — https://developers.giphy.com/docs/api/endpoint/#channel-search
// GET /v1/channels/search
export const search: GiphyEndpoints['channelsSearch'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		q: input.q,
		limit: input.limit,
		offset: input.offset,
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['channelsSearch']
	>('/channels/search', apiKey, { query });

	const response = GiphyChannelsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.channels.search',
		{ q: input.q },
		'completed',
	);

	return response;
};

export const Channels = {
	search,
};
