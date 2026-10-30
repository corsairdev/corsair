import { logEventFromContext } from 'corsair/core';
import type { ApiBibleEndpoints } from '..';
import { makeApiBibleRequest } from '../client';
import type { ApiBibleEndpointOutputs } from './types';

/**
 * Search for verses in a Bible version.
 * API: GET /bibles/{bibleId}/search?query={query}
 * Docs: https://api.bible and https://api.bible/search-api
 */
export const query: ApiBibleEndpoints['searchQuery'] = async (ctx, input) => {
	const response = await makeApiBibleRequest<
		ApiBibleEndpointOutputs['searchQuery']
	>(`bibles/${input.bibleId}/search`, ctx.key, {
		query: {
			query: input.query,
			limit: input.limit,
			offset: input.offset,
			sort: input.sort,
		},
	});

	await logEventFromContext(
		ctx,
		'apibible.search.query',
		{ ...input },
		'completed',
	);

	return response;
};
