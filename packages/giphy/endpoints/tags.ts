import { logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import { resolveApiKey } from './auth';
import type { GiphyEndpointOutputs } from './types';
import {
	GiphyTermsResponseSchema,
	GiphyTrendingSearchesResponseSchema,
} from './types';

// Autocomplete — https://developers.giphy.com/docs/api/endpoint/#autocomplete
// GET /v1/gifs/search/tags
export const autocomplete: GiphyEndpoints['tagsAutocomplete'] = async (
	ctx,
	input,
) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		q: input.q,
		limit: input.limit,
		offset: input.offset,
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['tagsAutocomplete']
	>('/gifs/search/tags', apiKey, { query });

	const response = GiphyTermsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.tags.autocomplete',
		{ q: input.q },
		'completed',
	);

	return response;
};

// Trending Search Terms — https://developers.giphy.com/docs/api/endpoint/#trending-search-terms
// GET /v1/trending/searches — `data` is a plain string array.
export const trending: GiphyEndpoints['tagsTrending'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		customer_id: input?.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['tagsTrending']
	>('/trending/searches', apiKey, { query });

	const response = GiphyTrendingSearchesResponseSchema.parse(rawResponse);

	await logEventFromContext(ctx, 'giphy.tags.trending', {}, 'completed');

	return response;
};

// Search Suggestions — https://developers.giphy.com/docs/api/endpoint/#search-suggestions
// GET /v1/tags/related/<term>
export const related: GiphyEndpoints['tagsRelated'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['tagsRelated']
	>(`/tags/related/${encodeURIComponent(input.term)}`, apiKey, { query });

	const response = GiphyTermsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.tags.related',
		{ term: input.term },
		'completed',
	);

	return response;
};

export const Tags = {
	autocomplete,
	trending,
	related,
};
