import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type {
	AppleAppStoreProductResponse,
	AppleAppStoreReviewsResponse,
	AppleAppStoreSearchResponse,
} from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Apple App Store operations (all Alpha), documented at
// https://litescrape.com/docs/apple-app-store-search,
// https://litescrape.com/docs/apple-app-store-product and
// https://litescrape.com/docs/apple-app-store-reviews.

export const search: LitescrapeEndpoints['appleAppStoreSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.appleAppStoreSearch.parse(input);

	const response = await makeLitescrapeRequest<AppleAppStoreSearchResponse>(
		'/api/apple/app-store/search',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.appleAppStoreSearch.parse(response);

	// Never log the search term: it is user content. Record only the shape of
	// the result.
	await logEventFromContext(
		ctx,
		'litescrape.appleAppStore.search',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const product: LitescrapeEndpoints['appleAppStoreProduct'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.appleAppStoreProduct.parse(input);

	const response = await makeLitescrapeRequest<AppleAppStoreProductResponse>(
		'/api/apple/app-store/product',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.appleAppStoreProduct.parse(response);

	// Never log the product id: it is user-selected. Record only the shape of
	// the result.
	await logEventFromContext(
		ctx,
		'litescrape.appleAppStore.product',
		{ versionCount: parsed.version_history?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const reviews: LitescrapeEndpoints['appleAppStoreReviews'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.appleAppStoreReviews.parse(input);

	const response = await makeLitescrapeRequest<AppleAppStoreReviewsResponse>(
		'/api/apple/app-store/reviews',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.appleAppStoreReviews.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.appleAppStore.reviews',
		{ reviewCount: parsed.reviews?.length ?? 0 },
		'completed',
	);

	return parsed;
};
