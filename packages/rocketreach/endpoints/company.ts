import type { RocketReachEndpoints } from '..';
import { call } from './call';
import {
	RocketReachEndpointInputSchemas as Inputs,
	RocketReachEndpointOutputSchemas as Outputs,
} from './types';

export const lookup: RocketReachEndpoints['companyLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.lookup',
			input: Inputs.companyLookup,
			output: Outputs.companyLookup,
		},
		input,
		({ domain, id, name, linkedin_url, ticker }) => ({
			method: 'GET',
			path: '/company/lookup/',
			query: {
				domain,
				id: id === undefined ? undefined : String(id),
				name,
				linkedin_url,
				ticker,
			},
			// The docs say a company lookup spends a lookup credit, so a retry after
			// a 5xx could charge twice.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				companyId: result.id ?? undefined,
				name: result.name ?? undefined,
				employees: result.num_employees ?? undefined,
			}),
		},
	);

export const search: RocketReachEndpoints['companySearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.search',
			input: Inputs.companySearch,
			output: Outputs.companySearch,
		},
		input,
		({ query, start, page_size, order_by }) => ({
			method: 'POST',
			path: '/searchCompany',
			body: { query, start, page_size, order_by },
			replayable: true,
		}),
		{
			log: (_, result) => ({ results: result.length }),
		},
	);
