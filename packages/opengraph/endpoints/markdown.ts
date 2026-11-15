import type { OpengraphEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

// format=json is forced so the response is the structured envelope the
// output schema parses; the default format returns a bare text/markdown body.
export const get: OpengraphEndpoints['markdownGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'markdown.get',
			input: Inputs.markdownGet,
			output: Outputs.markdownGet,
		},
		input,
		({ url, ...query }) => ({
			method: 'GET',
			path: `/3.0/markdown/${segment(url)}`,
			query: { ...query, format: 'json' },
		}),
		{ log: ({ url }) => ({ url }) },
	);
