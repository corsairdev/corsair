import { logEventFromContext } from 'corsair/core';
import type { SerpapiEndpoints } from '../index';
import { auditPayload } from './logging';
import { serpapiSearch } from './shared';

/** Confirmed live: eBay's query parameter is `_nkw`, not `q`. */
export const ebaySearch: SerpapiEndpoints['marketplaceEbaySearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'ebay', input);
	await logEventFromContext(
		ctx,
		'serpapi.marketplace.ebaySearch',
		auditPayload(input, ['_sacat']),
		'completed',
	);
	return result;
};

/** Confirmed live: needs `query` or `cat_id`. */
export const walmartSearch: SerpapiEndpoints['marketplaceWalmartSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'walmart', input);
		await logEventFromContext(
			ctx,
			'serpapi.marketplace.walmartSearch',
			auditPayload(input, ['cat_id', 'store_id']),
			'completed',
		);
		return result;
	};

export const walmartProductReviews: SerpapiEndpoints['marketplaceWalmartProductReviews'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'walmart_product_reviews', input);
		await logEventFromContext(
			ctx,
			'serpapi.marketplace.walmartProductReviews',
			auditPayload(input, ['product_id', 'sort']),
			'completed',
		);
		return result;
	};

export const appleAppStoreSearch: SerpapiEndpoints['marketplaceAppleAppStoreSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'apple_app_store', input);
		await logEventFromContext(
			ctx,
			'serpapi.marketplace.appleAppStoreSearch',
			auditPayload(input, ['country']),
			'completed',
		);
		return result;
	};

/** Confirmed live: requires `find_loc` (a location), alongside an optional `find_desc` query term. */
export const yelpSearch: SerpapiEndpoints['marketplaceYelpSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'yelp', input);
	await logEventFromContext(
		ctx,
		'serpapi.marketplace.yelpSearch',
		{},
		'completed',
	);
	return result;
};

/** Confirmed live: needs `rid` (the restaurant id), not a free-text query. */
export const openTableReviews: SerpapiEndpoints['marketplaceOpenTableReviews'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'open_table_reviews', input);
		await logEventFromContext(
			ctx,
			'serpapi.marketplace.openTableReviews',
			auditPayload(input, ['rid']),
			'completed',
		);
		return result;
	};

export const facebookProfile: SerpapiEndpoints['marketplaceFacebookProfile'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'facebook_profile', input);
		await logEventFromContext(
			ctx,
			'serpapi.marketplace.facebookProfile',
			auditPayload(input, ['profile_id']),
			'completed',
		);
		return result;
	};
