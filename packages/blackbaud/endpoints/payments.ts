import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const getPaymentTransaction: BlackbaudEndpoints['getPaymentTransaction'] =
	async (ctx, input) => {
		const response = await makeBlackbaudRequest<
			BlackbaudEndpointOutputs['getPaymentTransaction']
		>(
			`payments/v1/transactions/${encodeURIComponent(input.transaction_id)}`,
			ctx.key,
			{
				method: 'GET',
				subscriptionKey: ctx.options.subscriptionKey,
			},
		);

		await logEventFromContext(
			ctx,
			'blackbaud.payments.get_transaction',
			{ transaction_id: input.transaction_id },
			'completed',
		);
		return response;
	};
