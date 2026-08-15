import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * Retrieve product offers, pricing, availability, and seller information.
 *
 * Uses `GET /request?type=offers` on the Product Data API.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/offers
 */
const get: AsinDataApiEndpoints['offersGet'] = async (ctx, input) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['offersGet']
	>('request', ctx.key, {
		query: { ...input, type: 'offers' },
	});

	await logEventFromContext(
		ctx,
		'asindataapi.offers.get',
		{ asin: input.asin, url: input.url },
		'completed',
	);

	return response;
};

export const Offers = { get };
