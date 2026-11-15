import type { OpengraphEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpengraphEndpointInputSchemas as Inputs,
	OpengraphEndpointOutputSchemas as Outputs,
} from './types';

export const get: OpengraphEndpoints['siteGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'site.get',
			input: Inputs.siteGet,
			output: Outputs.siteGet,
		},
		input,
		({ url, ...query }) => ({
			method: 'GET',
			path: `/3.0/site/${segment(url)}`,
			query,
		}),
		{ log: ({ url }) => ({ url }) },
	);
