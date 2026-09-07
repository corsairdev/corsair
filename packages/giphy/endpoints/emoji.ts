import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import type { GiphyEndpointOutputs } from './types';
import { GiphyListResponseSchema } from './types';

export const get: GiphyEndpoints['emojiGet'] = async (ctx, input) => {
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const query: Record<string, string | number | boolean | undefined> = {
		limit: input?.limit,
		offset: input?.offset,
	};

	const rawResponse = await makeGiphyRequest<GiphyEndpointOutputs['emojiGet']>(
		'/emoji',
		apiKey,
		{ query },
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
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['emojiVariations']
	>(`/emoji/${input.gif_id}/variations`, apiKey);

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
