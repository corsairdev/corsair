import { logEventFromContext } from 'corsair/core';
import type { FlutterwaveEndpoints } from '..';
import { makeFlutterwaveRequest } from '../client';
import type { FlutterwaveEndpointOutputs } from './types';

export const initializePayment: FlutterwaveEndpoints['initializePayment'] =
	async (ctx, input) => {
		const response = await makeFlutterwaveRequest<
			FlutterwaveEndpointOutputs['initializePayment']
		>('payments', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'flutterwave.payment.initialize',
			{
				tx_ref: input.tx_ref,
				amount: input.amount,
				currency: input.currency,
			},
			'completed',
		);

		return response;
	};
