import { logEventFromContext } from 'corsair/core';
import type { CodyEndpoints } from '..';
import { makeCodyRequest } from '../client';
import type { SearchResponse } from './types';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

const SEARCH_QUERY = `query ($query: String!) {
	search(query: $query, version: V3) {
		results {
			matchCount
		}
	}
}`;

export const get: CodyEndpoints['search'] = async (ctx, input) => {
	const parsed = CodyEndpointInputSchemas.search.parse(input);
	const response = await makeCodyRequest<SearchResponse>(
		'/.api/graphql',
		ctx.key,
		{
			method: 'POST',
			authScheme: ctx.options.authType === 'oauth_2' ? 'Bearer' : 'token',
			body: { query: SEARCH_QUERY, variables: { query: parsed.query } },
		},
	);

	const validated = CodyEndpointOutputSchemas.search.parse(response);

	await logEventFromContext(ctx, 'cody.search.get', { ...parsed }, 'completed');

	return validated;
};
