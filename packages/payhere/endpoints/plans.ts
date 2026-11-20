import type { PayhereEndpoints } from '..';
import { call } from './call';
import {
	PayhereEndpointInputSchemas as Inputs,
	PayhereEndpointOutputSchemas as Outputs,
} from './types';

export const list: PayhereEndpoints['plansList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'plans.list',
			input: Inputs.plansList,
			output: Outputs.plansList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v1/plans', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
