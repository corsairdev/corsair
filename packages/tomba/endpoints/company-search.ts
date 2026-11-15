import type { TombaEndpoints } from '..';
import { call } from './call';
import { TombaEndpointInputSchemas, TombaEndpointOutputSchemas } from './types';

/**
 * POST /reveal/search. Sending `query` makes Tomba generate the filters with a
 * model and ignore any `filters` sent alongside, which is why the schema allows
 * one or the other but the client sends both only as given.
 */
export const search: TombaEndpoints['companySearch'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.search',
			input: TombaEndpointInputSchemas.searchCompanies,
			output: TombaEndpointOutputSchemas.searchCompanies,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'reveal/search',
			body: {
				...(parsed.query === undefined ? {} : { query: parsed.query }),
				...(parsed.filters === undefined ? {} : { filters: parsed.filters }),
				...(parsed.page === undefined ? {} : { page: parsed.page }),
			},
		}),
		{
			log: (parsed, result) => ({
				has_query: parsed.query !== undefined,
				page: parsed.page ?? 1,
				companies: result.data.length,
			}),
		},
	);
