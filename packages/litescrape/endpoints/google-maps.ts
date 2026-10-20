import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type {
	GoogleContributorReviewsResponse,
	GoogleMapsPhotoMetaResponse,
	GoogleMapsPopularTimesResponse,
	GoogleMapsPostsResponse,
	GoogleMapsResponse,
	GoogleMapsReviewsResponse,
} from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Google Maps operations, documented at https://litescrape.com/docs/google-maps,
// /docs/google-maps-reviews, /docs/google-contributor-reviews,
// /docs/google-maps-popular-times, /docs/google-maps-posts and
// /docs/google-maps-photo-meta.

export const search: LitescrapeEndpoints['googleMapsSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googleMapsSearch.parse(input);

	const response = await makeLitescrapeRequest<GoogleMapsResponse>(
		'/api/google/maps',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googleMapsSearch.parse(response);

	// Never log the query or place identifiers: they are user content. Record
	// only the shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.googleMaps.search',
		{
			resultCount: parsed.local_results?.length ?? 0,
			hasPlace: Boolean(parsed.place_results),
		},
		'completed',
	);

	return parsed;
};

export const reviews: LitescrapeEndpoints['googleMapsReviews'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googleMapsReviews.parse(input);

	const response = await makeLitescrapeRequest<GoogleMapsReviewsResponse>(
		'/api/google/reviews',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googleMapsReviews.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.googleMaps.reviews',
		{ reviewCount: parsed.reviews?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const contributorReviews: LitescrapeEndpoints['googleMapsContributorReviews'] =
	async (ctx, input) => {
		const parsedInput =
			LitescrapeEndpointInputSchemas.googleMapsContributorReviews.parse(input);

		const response =
			await makeLitescrapeRequest<GoogleContributorReviewsResponse>(
				'/api/google/contributor-reviews',
				ctx.key,
				{ method: 'GET', query: { ...parsedInput } },
			);

		const parsed =
			LitescrapeEndpointOutputSchemas.googleMapsContributorReviews.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'litescrape.googleMaps.contributorReviews',
			{ reviewCount: parsed.reviews?.length ?? 0 },
			'completed',
		);

		return parsed;
	};

export const popularTimes: LitescrapeEndpoints['googleMapsPopularTimes'] =
	async (ctx, input) => {
		const parsedInput =
			LitescrapeEndpointInputSchemas.googleMapsPopularTimes.parse(input);

		const response =
			await makeLitescrapeRequest<GoogleMapsPopularTimesResponse>(
				'/api/google/maps/popular-times',
				ctx.key,
				{ method: 'GET', query: { ...parsedInput } },
			);

		const parsed =
			LitescrapeEndpointOutputSchemas.googleMapsPopularTimes.parse(response);

		await logEventFromContext(
			ctx,
			'litescrape.googleMaps.popularTimes',
			{ hasPopularTimes: Boolean(parsed.popular_times) },
			'completed',
		);

		return parsed;
	};

export const posts: LitescrapeEndpoints['googleMapsPosts'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googleMapsPosts.parse(input);

	const response = await makeLitescrapeRequest<GoogleMapsPostsResponse>(
		'/api/google/maps/posts',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googleMapsPosts.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.googleMaps.posts',
		{ postCount: parsed.posts?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const photoMeta: LitescrapeEndpoints['googleMapsPhotoMeta'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googleMapsPhotoMeta.parse(input);

	const response = await makeLitescrapeRequest<GoogleMapsPhotoMetaResponse>(
		'/api/google/maps/photo-meta',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googleMapsPhotoMeta.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.googleMaps.photoMeta',
		{ hasPhoto: Boolean(parsed.photo) },
		'completed',
	);

	return parsed;
};
