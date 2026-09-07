import { logEventFromContext } from 'corsair/core';
import type { ZenserpEndpoints } from '..';
import { makeZenserpRequest } from '../client';
import {
	BingSearchInputSchema,
	GoogleSearchInputSchema,
	ReverseImageSearchInputSchema,
	SearchResponseSchema,
	YandexSearchInputSchema,
} from './types';

export const google: ZenserpEndpoints['searchGoogle'] = async (
	ctx,
	rawInput,
) => {
	const input = GoogleSearchInputSchema.parse(rawInput);
	const response = SearchResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/search', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'zenserp.search.google',
		{ q: input.q },
		'completed',
	);
	return response;
};

export const bing: ZenserpEndpoints['searchBing'] = async (ctx, rawInput) => {
	const input = BingSearchInputSchema.parse(rawInput);
	const response = SearchResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/search', ctx.key, {
			...input,
			search_engine: 'bing.com',
		}),
	);
	await logEventFromContext(
		ctx,
		'zenserp.search.bing',
		{ q: input.q },
		'completed',
	);
	return response;
};

export const yandex: ZenserpEndpoints['searchYandex'] = async (
	ctx,
	rawInput,
) => {
	const input = YandexSearchInputSchema.parse(rawInput);
	const response = SearchResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/search', ctx.key, {
			...input,
			search_engine: 'yandex.com',
		}),
	);
	await logEventFromContext(
		ctx,
		'zenserp.search.yandex',
		{ q: input.q },
		'completed',
	);
	return response;
};

export const reverseImage: ZenserpEndpoints['searchReverseImage'] = async (
	ctx,
	rawInput,
) => {
	const input = ReverseImageSearchInputSchema.parse(rawInput);
	const response = SearchResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/search', ctx.key, {
			image_url: input.imageUrl,
			location: input.location,
			gl: input.gl,
			hl: input.hl,
		}),
	);
	await logEventFromContext(
		ctx,
		'zenserp.search.reverseImage',
		{ imageUrl: input.imageUrl },
		'completed',
	);
	return response;
};
