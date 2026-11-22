import type { PayhereEndpoints } from '..';
import { call } from './call';
import {
	PayhereEndpointInputSchemas as Inputs,
	PayhereEndpointOutputSchemas as Outputs,
} from './types';

export const list: PayhereEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v1/customers', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PayhereEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ customerId }) => ({
			method: 'GET',
			path: `/api/v1/customers/${customerId}`,
		}),
		{ log: (_, result) => ({ customerId: result.data.id }) },
	);
