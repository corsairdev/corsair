import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';

/**
 * Search Amazon products by keywords across any Amazon domain.
 *
 * Uses `GET /request?type=search` on the Product Data API.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/search
 */
const get: AsinDataApiEndpoints['searchGet'] = async (ctx, input) => {
	const response = await makeAsinDataApiRequest<
		AsinDataApiEndpointOutputs['searchGet']
	>('request', ctx.key, {
		query: { ...input, type: 'search' },
	});

	await logEventFromContext(
		ctx,
		'asindataapi.search.get',
		{ search_term: input.search_term, url: input.url },
		'completed',
	);

	return response;
};

export const Search = { get };
