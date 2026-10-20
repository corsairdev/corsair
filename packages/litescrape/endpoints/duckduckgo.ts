import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type { DuckduckgoMapsResponse, DuckduckgoSearchResponse } from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// DuckDuckGo operations, documented at
// https://litescrape.com/docs/duckduckgo-search and
// https://litescrape.com/docs/duckduckgo-maps.

export const search: LitescrapeEndpoints['duckduckgoSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.duckduckgoSearch.parse(input);

	const response = await makeLitescrapeRequest<DuckduckgoSearchResponse>(
		'/api/duckduckgo/search',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.duckduckgoSearch.parse(response);

	// Never log the raw query: search terms are user content. Record only the
	// shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.duckduckgo.search',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const maps: LitescrapeEndpoints['duckduckgoMaps'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.duckduckgoMaps.parse(input);

	const response = await makeLitescrapeRequest<DuckduckgoMapsResponse>(
		'/api/duckduckgo/maps',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.duckduckgoMaps.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.duckduckgo.maps',
		{ resultCount: parsed.local_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};
