import type { OpengraphEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

export const fetch: OpengraphEndpoints['scrapeFetch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrape.fetch',
			input: Inputs.scrapeFetch,
			output: Outputs.scrapeFetch,
		},
		input,
		({ url, ...query }) => ({
			method: 'GET',
			path: `/3.0/scrape/${segment(url)}`,
			query,
		}),
		{ log: ({ url }) => ({ url }) },
	);
