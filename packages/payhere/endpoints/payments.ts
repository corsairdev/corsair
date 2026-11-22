import type { PayhereEndpoints } from '..';
import { call } from './call';
import {
	PayhereEndpointInputSchemas as Inputs,
	PayhereEndpointOutputSchemas as Outputs,
} from './types';

export const list: PayhereEndpoints['paymentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'payments.list',
			input: Inputs.paymentsList,
			output: Outputs.paymentsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v1/payments', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
