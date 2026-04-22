import { logEventFromContext } from 'corsair/core';
import { makeStripeRequest } from '../client';
import type { StripeEndpoints } from '../index';
import type { StripeEndpointOutputs } from './types';

export const get: StripeEndpoints['balanceGet'] = async (ctx, input) => {
	const result = await makeStripeRequest<StripeEndpointOutputs['balanceGet']>(
		'balance',
		ctx.key,
		{ method: 'GET' },
	);

	if (ctx.db.balance) {
		try {
			await ctx.db.balance.upsertByEntityId('balance', {
				id: 'balance',
				...result,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save balance to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.balance.get',
		{ ...input },
		'completed',
	);
	return result;
};
