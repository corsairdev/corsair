import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type {
	GooglePlayAppsResponse,
	GooglePlayBooksResponse,
	GooglePlayGamesResponse,
	GooglePlayMoviesResponse,
	GooglePlayProductResponse,
	GooglePlayReviewsResponse,
} from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Google Play operations (all Alpha), documented at
// https://litescrape.com/docs/google-play-apps, /docs/google-play-games,
// /docs/google-play-books, /docs/google-play-movies, /docs/google-play-product
// and /docs/google-play-reviews.

export const apps: LitescrapeEndpoints['googlePlayApps'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googlePlayApps.parse(input);

	const response = await makeLitescrapeRequest<GooglePlayAppsResponse>(
		'/api/google/play/apps',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.googlePlayApps.parse(response);

	// Never log the query or category: they are user content. Record only the
	// shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.googlePlay.apps',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const games: LitescrapeEndpoints['googlePlayGames'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googlePlayGames.parse(input);

	const response = await makeLitescrapeRequest<GooglePlayGamesResponse>(
		'/api/google/play/games',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googlePlayGames.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.googlePlay.games',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const books: LitescrapeEndpoints['googlePlayBooks'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googlePlayBooks.parse(input);

	const response = await makeLitescrapeRequest<GooglePlayBooksResponse>(
		'/api/google/play/books',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googlePlayBooks.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.googlePlay.books',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const movies: LitescrapeEndpoints['googlePlayMovies'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googlePlayMovies.parse(input);

	const response = await makeLitescrapeRequest<GooglePlayMoviesResponse>(
		'/api/google/play/movies',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googlePlayMovies.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.googlePlay.movies',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const product: LitescrapeEndpoints['googlePlayProduct'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googlePlayProduct.parse(input);

	const response = await makeLitescrapeRequest<GooglePlayProductResponse>(
		'/api/google/play/product',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googlePlayProduct.parse(response);

	// Never log the product id: it is user-selected. Record only the shape of
	// the result.
	await logEventFromContext(
		ctx,
		'litescrape.googlePlay.product',
		{ reviewCount: parsed.reviews?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const reviews: LitescrapeEndpoints['googlePlayReviews'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googlePlayReviews.parse(input);

	const response = await makeLitescrapeRequest<GooglePlayReviewsResponse>(
		'/api/google/play/reviews',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googlePlayReviews.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.googlePlay.reviews',
		{ reviewCount: parsed.reviews?.length ?? 0 },
		'completed',
	);

	return parsed;
};
