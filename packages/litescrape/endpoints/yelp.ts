import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type { YelpReviewsResponse, YelpSearchResponse } from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Yelp operations, documented at https://litescrape.com/docs/yelp-search and
// https://litescrape.com/docs/yelp-reviews.

export const search: LitescrapeEndpoints['yelpSearch'] = async (ctx, input) => {
	const parsedInput = LitescrapeEndpointInputSchemas.yelpSearch.parse(input);

	const response = await makeLitescrapeRequest<YelpSearchResponse>(
		'/api/yelp/search',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.yelpSearch.parse(response);

	// Never log the search terms or location: they are user content. Record
	// only the shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.yelp.search',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const reviews: LitescrapeEndpoints['yelpReviews'] = async (
	ctx,
	input,
) => {
	const parsedInput = LitescrapeEndpointInputSchemas.yelpReviews.parse(input);

	const response = await makeLitescrapeRequest<YelpReviewsResponse>(
		'/api/yelp/reviews',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.yelpReviews.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.yelp.reviews',
		{ reviewCount: parsed.reviews?.length ?? 0 },
		'completed',
	);

	return parsed;
};
