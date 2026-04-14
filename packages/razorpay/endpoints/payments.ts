import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const get: RazorpayEndpoints['paymentsGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['paymentsGet']
	>(`payments/${input.id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.payments) {
		try {
			await ctx.db.payments.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay payment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.payments.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: RazorpayEndpoints['paymentsList'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['paymentsList']
	>('payments', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (ctx.db.payments) {
		for (const payment of result.items) {
			try {
				await ctx.db.payments.upsertByEntityId(payment.id, {
					...payment,
					createdAt: payment.created_at
						? new Date(payment.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save Razorpay payment to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.payments.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const capture: RazorpayEndpoints['paymentsCapture'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['paymentsCapture']
	>(`payments/${id}/capture`, ctx.key, {
		method: 'POST',
		body,
	});

	if (result.id && ctx.db.payments) {
		try {
			await ctx.db.payments.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay payment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.payments.capture',
		{ ...input },
		'completed',
	);
	return result;
};
