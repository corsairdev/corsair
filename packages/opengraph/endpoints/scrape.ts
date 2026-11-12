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
		{
			// The reference shows a JSON envelope, but the live API answers with
			// the page itself as text/plain; wrap it so both forms parse.
			shape: (raw) => (typeof raw === 'string' ? { htmlContent: raw } : raw),
			log: ({ url }) => ({ url }),
		},
	);
