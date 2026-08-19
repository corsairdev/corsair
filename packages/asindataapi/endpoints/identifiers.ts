import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

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
	const raw = await makeAsinDataApiRequest<unknown>('request', ctx.key, {
		query: { ...input, type: 'product' },
	});

	const response =
		AsinDataApiEndpointOutputSchemas.identifiersResolve.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.identifiers.resolve',
		{ gtin: input.gtin },
		'completed',
	);

	return response as AsinDataApiEndpointOutputs['identifiersResolve'];
};

export const Identifiers = { resolve };
