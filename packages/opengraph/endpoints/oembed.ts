import type { OpengraphEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

export const get: OpengraphEndpoints['oembedGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'oembed.get',
			input: Inputs.oembedGet,
			output: Outputs.oembedGet,
		},
		input,
		({ url, ...query }) => ({
			method: 'GET',
			path: `/3.0/oembed/${segment(url)}`,
			query,
		}),
		{ log: ({ url }) => ({ url }) },
	);
