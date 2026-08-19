import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

/**
 * Retrieve Amazon category data and products within a category.
 *
 * Uses `GET /request?type=category` on the Product Data API.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/category
 */
const get: AsinDataApiEndpoints['categoriesGet'] = async (ctx, input) => {
	const raw = await makeAsinDataApiRequest<unknown>('request', ctx.key, {
		query: { ...input, type: 'category' },
	});

	const response = AsinDataApiEndpointOutputSchemas.categoriesGet.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.categories.get',
		{ category_id: input.category_id, url: input.url },
		'completed',
	);

	return response as AsinDataApiEndpointOutputs['categoriesGet'];
};

export const Categories = { get };
