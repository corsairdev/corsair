import type { GoogleAdsEndpoints } from '..';
import { call } from './call';
import {
	GoogleAdsEndpointInputSchemas as Inputs,
	GoogleAdsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `googleAdsFields:search` lists the queryable fields, which is how a caller
 * finds out what a GAQL statement may select. It takes no customer path.
 */
export const search: GoogleAdsEndpoints['googleAdsFieldsSearch'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'googleAdsFields.search',
			input: Inputs.googleAdsFieldsSearch,
			output: Outputs.googleAdsFieldsSearch,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: '/googleAdsFields:search',
			body: {
				query: input.query,
				...(input.pageSize === undefined || input.pageSize === null
					? {}
					: { pageSize: input.pageSize }),
				...(input.pageToken ? { pageToken: input.pageToken } : {}),
			},
		}),
		{ log: (result) => ({ fields: result.results?.length ?? 0 }) },
	);
