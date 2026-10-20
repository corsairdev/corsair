import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type {
	TripadvisorPlaceResponse,
	TripadvisorReviewsResponse,
	TripadvisorSearchResponse,
} from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Tripadvisor operations, documented at
// https://litescrape.com/docs/tripadvisor-search,
// https://litescrape.com/docs/tripadvisor-place and
// https://litescrape.com/docs/tripadvisor-reviews.

export const search: LitescrapeEndpoints['tripadvisorSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.tripadvisorSearch.parse(input);

	const response = await makeLitescrapeRequest<TripadvisorSearchResponse>(
		'/api/tripadvisor/search',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.tripadvisorSearch.parse(response);

	// Never log the raw query: search terms are user content. Record only the
	// shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.tripadvisor.search',
		{ resultCount: parsed.search_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const place: LitescrapeEndpoints['tripadvisorPlace'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.tripadvisorPlace.parse(input);

	const response = await makeLitescrapeRequest<TripadvisorPlaceResponse>(
		'/api/tripadvisor/place',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.tripadvisorPlace.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.tripadvisor.place',
		{ hasPlace: Boolean(parsed.place_results) },
		'completed',
	);

	return parsed;
};

export const reviews: LitescrapeEndpoints['tripadvisorReviews'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.tripadvisorReviews.parse(input);

	const response = await makeLitescrapeRequest<TripadvisorReviewsResponse>(
		'/api/tripadvisor/reviews',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.tripadvisorReviews.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.tripadvisor.reviews',
		{ reviewCount: parsed.reviews?.length ?? 0 },
		'completed',
	);

	return parsed;
};
