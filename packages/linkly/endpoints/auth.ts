import type { LinklyEndpoints } from '..';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const test: LinklyEndpoints['authTest'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'auth.test',
			input: Inputs.authTest,
			output: Outputs.authTest,
		},
		input,
		() => ({
			// POST, as Linkly's MCP server sends it; it changes nothing.
			method: 'POST',
			path: '/api/v1/test',
			replaySafe: true,
		}),
	);
