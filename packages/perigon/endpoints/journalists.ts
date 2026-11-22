import type { PerigonEndpoints } from '..';
import { call } from './call';
import {
	PerigonEndpointInputSchemas as Inputs,
	PerigonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PerigonEndpoints['journalistsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'journalists.list',
			input: Inputs.journalistsList,
			output: Outputs.journalistsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/v1/journalists/all', query }),
		{ log: (_, page) => ({ count: page.results.length }) },
	);
