import type { LoomioEndpoints } from '..';
import { call } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
	relatedQuery,
} from './types';

export const query: LoomioEndpoints['searchQuery'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'search.query',
			input: Inputs.searchQuery,
			output: Outputs.searchQuery,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/search',
			query: {
				query: parsed.query,
				group_id: parsed.group_id,
				org_id: parsed.org_id,
				types: parsed.types?.join(','),
				tag: parsed.tag,
				author_id: parsed.author_id,
				order: parsed.order,
				...relatedQuery(parsed),
			},
		}),
		// The query text can hold personal data; log the count only.
		{ log: (_, result) => ({ count: result.search_results.length }) },
	);
