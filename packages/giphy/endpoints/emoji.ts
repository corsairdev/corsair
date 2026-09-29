import { logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import { resolveApiKey } from './auth';
import type { GiphyEndpointOutputs } from './types';
import { GiphyListResponseSchema } from './types';

// Emoji lives on the v2 surface (api.giphy.com/v2/emoji), not under /v1.
// See https://developers.giphy.com/docs/api/endpoint/#emoji
export const get: GiphyEndpoints['emojiGet'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		limit: input?.limit,
		offset: input?.offset,
		customer_id: input?.customer_id,
	};

	const rawResponse = await makeGiphyRequest<GiphyEndpointOutputs['emojiGet']>(
		'/emoji',
		apiKey,
		{ query, base: 'v2' },
	);

	const response = GiphyListResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.emoji.get',
		{ limit: input?.limit },
		'completed',
	);

	return response;
};

export const variations: GiphyEndpoints['emojiVariations'] = async (
	ctx,
	input,
) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['emojiVariations']
	>(`/emoji/${input.gif_id}/variations`, apiKey, { query, base: 'v2' });

	const response = GiphyListResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.emoji.variations',
		{ gif_id: input.gif_id },
		'completed',
	);

	return response;
};

export const Emoji = {
	get,
	variations,
};
