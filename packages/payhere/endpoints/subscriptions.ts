import type { PayhereEndpoints } from '..';
import { call } from './call';
import {
	PayhereEndpointInputSchemas as Inputs,
	PayhereEndpointOutputSchemas as Outputs,
} from './types';

export const list: PayhereEndpoints['subscriptionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.list',
			input: Inputs.subscriptionsList,
			output: Outputs.subscriptionsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v1/subscriptions', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
