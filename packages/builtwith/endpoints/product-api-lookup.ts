import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const productApiLookup: BuiltWithEndpoints['productApiLookup'] = async (
	ctx,
	rawInput,
) => {
	const input = BuiltWithEndpointInputSchemas.productApiLookup.parse(rawInput);
	const query: Record<string, string | number> = {
		QUERY: input.query,
	};

	if (input.limit !== undefined) query.LIMIT = input.limit;
	if (input.page !== undefined) query.PAGE = input.page;

	const response = await makeBuiltWithRequest(
		'productv1/api.json',
		ctx.key,
		BuiltWithEndpointOutputSchemas.productApiLookup,
		{
			method: 'GET',
			query,
		},
	);

	if (response.shops && ctx.db.products) {
		try {
			for (const shop of response.shops) {
				for (const product of shop.Products ?? []) {
					const id = `${shop.Domain}|${product.Url ?? product.Title}`;
					await ctx.db.products.upsertByEntityId(id, {
						id,
						shop: shop.Domain,
						title: product.Title,
						url: product.Url,
						indexed: product.Indexed,
						firstIndexed: product.FirstIndexed,
						price: product.Price,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save BuiltWith products to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'builtwith.product.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
