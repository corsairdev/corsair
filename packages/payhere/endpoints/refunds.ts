import type { PayhereEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	PayhereEndpointInputSchemas as Inputs,
	PayhereEndpointOutputSchemas as Outputs,
} from './types';

export const create: PayhereEndpoints['refundsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'refunds.create',
			input: Inputs.refundsCreate,
			output: Outputs.refundsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v1/refunds', body }),
		{
			shape: (raw, { payment_id, amount }) => {
				expectEmptyBody(raw, 'refunds.create');
				return { paymentId: payment_id, amount, success: true };
			},
			log: (_, result) => ({
				paymentId: result.paymentId,
				amount: result.amount,
			}),
		},
	);
