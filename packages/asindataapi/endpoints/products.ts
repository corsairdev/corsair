import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

/**
 * Retrieve Amazon product details by ASIN, Amazon URL, or GTIN/ISBN/UPC/EAN.
 *
 * Uses `GET /request?type=product` on the Product Data API.
 * The `gtin` param enables automatic GTIN→ASIN conversion.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/product
 */
const get: AsinDataApiEndpoints['productsGet'] = async (ctx, input) => {
	const raw = await makeAsinDataApiRequest<unknown>('request', ctx.key, {
		query: { ...input, type: 'product' },
	});

	const response = AsinDataApiEndpointOutputSchemas.productsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.products.get',
		{ asin: input.asin, gtin: input.gtin, url: input.url },
		'completed',
	);

	return response as AsinDataApiEndpointOutputs['productsGet'];
};

export const Products = { get };
