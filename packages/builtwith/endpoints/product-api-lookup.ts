import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const productApiLookup: BuiltWithEndpoints['productApiLookup'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number> = {
		QUERY: input.query,
	};

	if (input.limit !== undefined) query.LIMIT = input.limit;
	if (input.page !== undefined) query.PAGE = input.page;

	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['productApiLookup']
	>('productv1/api.json', ctx.key, {
		method: 'GET',
		query,
	});

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
