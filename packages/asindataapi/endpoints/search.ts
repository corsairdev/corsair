import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiEndpoints } from '..';
import { makeAsinDataApiRequest } from '../client';
import type { AsinDataApiEndpointOutputs } from './types';
import { AsinDataApiEndpointOutputSchemas } from './types';

/**
 * Search Amazon products by keywords across any Amazon domain.
 *
 * Uses `GET /request?type=search` on the Product Data API.
 * Docs: https://docs.trajectdata.com/asindataapi/product-data-api/parameters/search
 */
const get: AsinDataApiEndpoints['searchGet'] = async (ctx, input) => {
	const raw = await makeAsinDataApiRequest<unknown>('request', ctx.key, {
		query: { ...input, type: 'search' },
	});

	const response = AsinDataApiEndpointOutputSchemas.searchGet.parse(raw);

	await logEventFromContext(
		ctx,
		'asindataapi.search.get',
		{ search_term: input.search_term, url: input.url },
		'completed',
	);

	return response as AsinDataApiEndpointOutputs['searchGet'];
};

export const Search = { get };
