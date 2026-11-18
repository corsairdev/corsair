import type { PloidEndpoints } from '../index';
import { callPloid } from './call';
import type { SearchResponse } from './types';
import {
	SearchCandidatesInputSchema,
	SearchCandidatesResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
} from './types';

// The 200 and 202 bodies are both loose objects, so a property check does not
// narrow the union; the array guard does.
function inlineResultCount(data: SearchResponse['data']): number {
	if (!('results' in data)) return 0;
	const results = data.results;
	return Array.isArray(results) ? results.length : 0;
}

export const search: PloidEndpoints['search'] = async (ctx, input) => {
	return callPloid(
		ctx,
		'ploid.search.search',
		SearchInputSchema,
		SearchResponseSchema,
		input,
		(validated) => ({ method: 'POST', url: '/v1/search', body: validated }),
		(validated, response) => ({
			type: validated.type ?? 'auto',
			num_results: validated.num_results ?? 10,
			returned: inlineResultCount(response.data),
			became_async: 'set_id' in response.data,
		}),
	);
};

export const searchCandidates: PloidEndpoints['searchCandidates'] = async (
	ctx,
	input,
) => {
	return callPloid(
		ctx,
		'ploid.search.candidates',
		SearchCandidatesInputSchema,
		SearchCandidatesResponseSchema,
		input,
		(validated) => ({
			method: 'POST',
			url: '/v1/search/candidates',
			body: validated,
		}),
		(validated, response) => ({
			returned: response.data.returned,
			limit: validated.limit ?? 5,
		}),
	);
};
