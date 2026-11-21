import type { PaystackEndpoints } from '..';
import { call } from './call';
import {
	PaystackEndpointInputSchemas as Inputs,
	PaystackEndpointOutputSchemas as Outputs,
} from './types';

export const create: PaystackEndpoints['refundsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'refunds.create',
			input: Inputs.refundsCreate,
			output: Outputs.refundsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/refund', body }),
		{
			log: (_, result) => ({
				refundId: result.data.id ?? undefined,
				status: result.data.status ?? undefined,
			}),
		},
	);

export const list: PaystackEndpoints['refundsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'refunds.list',
			input: Inputs.refundsList,
			output: Outputs.refundsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/refund', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PaystackEndpoints['refundsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'refunds.get',
			input: Inputs.refundsGet,
			output: Outputs.refundsGet,
		},
		input,
		({ refundId }) => ({ method: 'GET', path: `/refund/${refundId}` }),
		{ log: (_, result) => ({ refundId: result.data.id ?? undefined }) },
	);
