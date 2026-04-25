import { logEventFromContext } from 'corsair/core';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpoints } from '../index';
import type { RazorpayEndpointOutputs } from './types';

export const create: RazorpayEndpoints['refundsCreate'] = async (
	ctx,
	input,
) => {
	const { paymentId, ...body } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['refundsCreate']
	>(`payments/${paymentId}/refund`, ctx.key, {
		method: 'POST',
		body,
	});

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

export const get: RazorpayEndpoints['refundsGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['refundsGet']
	>(`payments/${input.paymentId}/refunds/${input.refundId}`, ctx.key, {
		method: 'GET',
	});

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
		'razorpay.refunds.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: RazorpayEndpoints['refundsList'] = async (ctx, input) => {
	const { paymentId, ...query } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['refundsList']
	>(`payments/${paymentId}/refunds`, ctx.key, {
		method: 'GET',
		query,
	});

	if (ctx.db.refunds) {
		for (const refund of result.items) {
			try {
				await ctx.db.refunds.upsertByEntityId(refund.id, {
					...refund,
					// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
					createdAt: refund.created_at
						? new Date(refund.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save Razorpay refund to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.refunds.list',
		{ ...input },
		'completed',
	);
	return result;
};
