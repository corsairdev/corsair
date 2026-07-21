import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';

import type { RetailedContext } from '..';
import { makeRetailedRequest } from '../client';
import type { RetailedEndpointInputs, RetailedEndpointOutputs } from './types';
import { RetailedEndpointOutputSchemas } from './types';

export const search: CorsairEndpoint<
	RetailedContext,
	RetailedEndpointInputs['searchProducts'],
	RetailedEndpointOutputs['searchProducts']
> = async (ctx, input) => {
	const query: Record<string, string | number> = {};

	if (input.name) {
		query['where[or][0][and][0][name][equals]'] = input.name;
	}

	if (input.sku) {
		query['where[or][0][and][0][sku][equals]'] = input.sku;
	}

	if (input.page) {
		query.page = input.page;
	}

	if (input.sort) {
		query.sort = input.sort;
	}

	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['searchProducts']
	>('db/products', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = RetailedEndpointOutputSchemas.searchProducts.parse(response);

	await logEventFromContext(ctx, 'retailed.products.search', {}, 'completed');

	return parsed;
};
