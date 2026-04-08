import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const create: RazorpayEndpoints['refundsCreate'] = async (ctx, input) => {
	const { paymentId, ...body } = input;
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['refundsCreate']>(
		`payments/${paymentId}/refund`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	if (result.id && ctx.db.refunds) {
		try {
			await ctx.db.refunds.upsertByEntityId(result.id, {
				...result,
				// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay refund to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.refunds.create',
		{ ...input },
		'completed',
	);
	return result;
};
