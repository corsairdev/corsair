import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * Resolve a GTIN/ISBN/UPC/EAN identifier to an ASIN.
 *
 * Internally uses `GET /request?type=product&gtin=...` on the Product Data API.
 * The API converts the code to an ASIN and returns the product.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/product
 */
const resolve: AsinDataApiEndpoints['identifiersResolve'] = async (
	ctx,
	input,
) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['identifiersResolve']
	>('request', ctx.key, {
		query: { ...input, type: 'product' },
	});

	await logEventFromContext(
		ctx,
		'asindataapi.identifiers.resolve',
		{ gtin: input.gtin },
		'completed',
	);

	return response;
};

export const Identifiers = { resolve };
