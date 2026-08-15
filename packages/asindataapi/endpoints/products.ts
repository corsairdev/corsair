import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * Retrieve Amazon product details by ASIN, Amazon URL, or GTIN/ISBN/UPC/EAN.
 *
 * Uses `GET /request?type=product` on the Product Data API.
 * The `gtin` param enables automatic GTIN→ASIN conversion.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/product
 */
const get: AsinDataApiEndpoints['productsGet'] = async (ctx, input) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['productsGet']
	>('request', ctx.key, {
		query: { ...input, type: 'product' },
	});

	await logEventFromContext(
		ctx,
		'asindataapi.products.get',
		{ asin: input.asin, gtin: input.gtin, url: input.url },
		'completed',
	);

	return response;
};

export const Products = { get };
