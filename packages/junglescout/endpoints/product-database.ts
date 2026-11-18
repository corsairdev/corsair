import { logEventFromContext } from 'corsair/core';
import type { JungleScoutEndpoints } from '..';
import { makeJungleScoutRequest } from '../client';
import {
	JungleScoutEndpointInputSchemas,
	JungleScoutEndpointOutputSchemas,
} from './types';

export const query: JungleScoutEndpoints['productDatabase.query'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JungleScoutEndpointInputSchemas['productDatabase.query'].parse(input);

	const queryParams: Record<string, string | number | boolean | undefined> = {
		marketplace: parsedInput.marketplace,
		sort: parsedInput.sort,
		'page[size]': parsedInput.page_size,
		'page[cursor]': parsedInput.page_cursor,
	};

	// `unknown` because JSON:API attributes object holds heterogeneous primitive and array filter values.
	const attributes: Record<string, unknown> = {
		include_keywords: parsedInput.include_keywords,
		exclude_keywords: parsedInput.exclude_keywords,
		categories: parsedInput.categories,
		product_tiers: parsedInput.product_tiers,
		seller_types: parsedInput.seller_types,
		exclude_top_brands: parsedInput.exclude_top_brands,
		exclude_unavailable_products: parsedInput.exclude_unavailable_products,
		min_price: parsedInput.min_price,
		max_price: parsedInput.max_price,
		min_net: parsedInput.min_net,
		max_net: parsedInput.max_net,
		min_rank: parsedInput.min_rank,
		max_rank: parsedInput.max_rank,
		min_sales: parsedInput.min_sales,
		max_sales: parsedInput.max_sales,
		min_revenue: parsedInput.min_revenue,
		max_revenue: parsedInput.max_revenue,
		min_reviews: parsedInput.min_reviews,
		max_reviews: parsedInput.max_reviews,
		min_rating: parsedInput.min_rating,
		max_rating: parsedInput.max_rating,
		min_weight: parsedInput.min_weight,
		max_weight: parsedInput.max_weight,
		min_sellers: parsedInput.min_sellers,
		max_sellers: parsedInput.max_sellers,
		min_lqs: parsedInput.min_lqs,
		max_lqs: parsedInput.max_lqs,
		min_updated_at: parsedInput.min_updated_at,
		max_updated_at: parsedInput.max_updated_at,
	};

	const cleanAttributes = Object.fromEntries(
		Object.entries(attributes).filter(([, v]) => v !== undefined),
	);

	const response = await makeJungleScoutRequest(
		'/api/product_database_query',
		ctx.key,
		{
			method: 'POST',
			query: queryParams,
			body: {
				data: {
					type: 'product_database_query',
					attributes: cleanAttributes,
				},
			},
			apiType: ctx.options?.apiType,
		},
	);

	const parsed =
		JungleScoutEndpointOutputSchemas['productDatabase.query'].parse(response);

	await logEventFromContext(
		ctx,
		'junglescout.productDatabase.query',
		{
			marketplace: parsedInput.marketplace,
		},
		'completed',
	);

	return parsed;
};

export const ProductDatabase = {
	query,
};
