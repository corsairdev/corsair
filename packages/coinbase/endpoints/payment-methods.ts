import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { CoinbaseEndpoints } from '..';
import { makeCoinbaseRequest } from '../client';
import { CoinbasePagination, CoinbasePaymentMethod } from '../schema';

export const listPaymentMethods: CoinbaseEndpoints['paymentMethodsList'] =
	async (ctx, input) => {
		const response = await makeCoinbaseRequest('/v2/payment-methods', ctx.key, {
			schema: z.object({
				pagination: CoinbasePagination.optional(),
				data: z.array(CoinbasePaymentMethod),
			}),
			query: {
				limit: input.limit,
				starting_after: input.starting_after,
				ending_before: input.ending_before,
				order: input.order,
			},
		});
		await logEventFromContext(
			ctx,
			'coinbase.paymentMethods.list',
			input,
			'completed',
		);
		return response;
	};
