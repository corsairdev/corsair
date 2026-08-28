import { logEventFromContext } from 'corsair/core';
import type { SourcegraphEndpoints } from '..';
import { makeSourcegraphRequest } from '../client';
import type { SourcegraphEndpointOutputs } from './types';

export const search: SourcegraphEndpoints['search'] = async (ctx, input) => {
	const response = await makeSourcegraphRequest<
		SourcegraphEndpointOutputs['search']
	>('/.api/search/stream', ctx.key, {
		method: 'GET',
		query: {
			q: input.q,
		},
	});

	await logEventFromContext(
		ctx,
		'sourcegraph.search',
		{ ...input },
		'completed',
	);
	return response;
};
