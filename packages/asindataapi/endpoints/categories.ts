import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * Retrieve Amazon category data and products within a category.
 *
 * Uses `GET /request?type=category` on the Product Data API.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/category
 */
const get: AsinDataApiEndpoints['categoriesGet'] = async (ctx, input) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['categoriesGet']
	>('request', ctx.key, {
		query: { ...input, type: 'category' },
	});

	await logEventFromContext(
		ctx,
		'asindataapi.categories.get',
		{ category_id: input.category_id, url: input.url },
		'completed',
	);

	return response;
};

export const Categories = { get };
