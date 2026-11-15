import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type {
	AppleMapsPlacesResponse,
	AppleMapsReviewsResponse,
} from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Apple Maps operations, documented at
// https://litescrape.com/docs/apple-maps-places and
// https://litescrape.com/docs/apple-maps-reviews.

export const places: LitescrapeEndpoints['appleMapsPlaces'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.appleMapsPlaces.parse(input);

	const response = await makeLitescrapeRequest<AppleMapsPlacesResponse>(
		'/api/apple/maps/places',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.appleMapsPlaces.parse(response);

	// Never log the raw MUIDs: they identify user-selected places. Record only
	// the shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.appleMaps.places',
		{ placeCount: parsed.place_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const reviews: LitescrapeEndpoints['appleMapsReviews'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.appleMapsReviews.parse(input);

	const response = await makeLitescrapeRequest<AppleMapsReviewsResponse>(
		'/api/apple/maps/reviews',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.appleMapsReviews.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.appleMaps.reviews',
		{ reviewCount: parsed.reviews?.length ?? 0 },
		'completed',
	);

	return parsed;
};
