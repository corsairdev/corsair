import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type { BingMapsResponse, BingSearchResponse } from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Bing operations, documented at https://litescrape.com/docs/bing-search and
// https://litescrape.com/docs/bing-maps.

export const search: LitescrapeEndpoints['bingSearch'] = async (ctx, input) => {
	const parsedInput = LitescrapeEndpointInputSchemas.bingSearch.parse(input);

	const response = await makeLitescrapeRequest<BingSearchResponse>(
		'/api/bing/search',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.bingSearch.parse(response);

	// Never log the raw query: search terms are user content. Record only the
	// shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.bing.search',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const maps: LitescrapeEndpoints['bingMaps'] = async (ctx, input) => {
	const parsedInput = LitescrapeEndpointInputSchemas.bingMaps.parse(input);

	const response = await makeLitescrapeRequest<BingMapsResponse>(
		'/api/bing/maps',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.bingMaps.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.bing.maps',
		{
			resultCount: parsed.local_results?.length ?? 0,
			hasPlace: Boolean(parsed.place_results),
		},
		'completed',
	);

	return parsed;
};
