import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type {
	GoogleAdsResponse,
	GoogleAiModeResponse,
	GoogleAiOverviewResponse,
	GoogleLocalResponse,
	GoogleSearchResponse,
	GoogleShoppingProductResponse,
	GoogleShoppingResponse,
} from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Google operations, documented at https://litescrape.com/docs/google-search,
// /docs/google-ai-overview, /docs/google-ai-mode, /docs/google-ads,
// /docs/google-local, /docs/google-shopping and /docs/google-shopping-product.

export const search: LitescrapeEndpoints['googleSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput = LitescrapeEndpointInputSchemas.googleSearch.parse(input);

	const response = await makeLitescrapeRequest<GoogleSearchResponse>(
		'/api/google/search',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.googleSearch.parse(response);

	// Never log the raw query: search terms are user content. Record only the
	// shape of the result.
	await logEventFromContext(
		ctx,
		'litescrape.google.search',
		{ resultCount: parsed.organic_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const aiOverview: LitescrapeEndpoints['googleAiOverview'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googleAiOverview.parse(input);

	const response = await makeLitescrapeRequest<GoogleAiOverviewResponse>(
		'/api/google/ai-overview',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed =
		LitescrapeEndpointOutputSchemas.googleAiOverview.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.google.aiOverview',
		{ hasOverview: Boolean(parsed.ai_overview) },
		'completed',
	);

	return parsed;
};

export const aiMode: LitescrapeEndpoints['googleAiMode'] = async (
	ctx,
	input,
) => {
	const parsedInput = LitescrapeEndpointInputSchemas.googleAiMode.parse(input);

	const response = await makeLitescrapeRequest<GoogleAiModeResponse>(
		'/api/google/ai-mode',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.googleAiMode.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.google.aiMode',
		{ textBlockCount: parsed.text_blocks?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const ads: LitescrapeEndpoints['googleAds'] = async (ctx, input) => {
	const parsedInput = LitescrapeEndpointInputSchemas.googleAds.parse(input);

	const response = await makeLitescrapeRequest<GoogleAdsResponse>(
		'/api/google/ads',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.googleAds.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.google.ads',
		{ adCount: parsed.ads?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const local: LitescrapeEndpoints['googleLocal'] = async (ctx, input) => {
	const parsedInput = LitescrapeEndpointInputSchemas.googleLocal.parse(input);

	const response = await makeLitescrapeRequest<GoogleLocalResponse>(
		'/api/google/local',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.googleLocal.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.google.local',
		{ resultCount: parsed.local_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const shopping: LitescrapeEndpoints['googleShopping'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LitescrapeEndpointInputSchemas.googleShopping.parse(input);

	const response = await makeLitescrapeRequest<GoogleShoppingResponse>(
		'/api/google/shopping',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.googleShopping.parse(response);

	await logEventFromContext(
		ctx,
		'litescrape.google.shopping',
		{ resultCount: parsed.shopping_results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const shoppingProduct: LitescrapeEndpoints['googleShoppingProduct'] =
	async (ctx, input) => {
		const parsedInput =
			LitescrapeEndpointInputSchemas.googleShoppingProduct.parse(input);

		const response = await makeLitescrapeRequest<GoogleShoppingProductResponse>(
			'/api/google/shopping/product',
			ctx.key,
			{ method: 'GET', query: { ...parsedInput } },
		);

		const parsed =
			LitescrapeEndpointOutputSchemas.googleShoppingProduct.parse(response);

		await logEventFromContext(
			ctx,
			'litescrape.google.shoppingProduct',
			{ offerCount: parsed.offers?.length ?? 0 },
			'completed',
		);

		return parsed;
	};
