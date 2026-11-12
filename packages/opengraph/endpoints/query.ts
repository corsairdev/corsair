import type { OpengraphEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

// The endpoint accepts GET with query parameters or POST with a JSON body;
// POST carries the responseStructure object without stringifying it.
export const run: OpengraphEndpoints['queryRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'query.run',
			input: Inputs.queryRun,
			output: Outputs.queryRun,
		},
		input,
		({ url, ...body }) => ({
			method: 'POST',
			path: `/3.0/query/${segment(url)}`,
			body,
		}),
		{ log: ({ url }) => ({ url }) },
	);
