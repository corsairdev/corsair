import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const create: RazorpayEndpoints['payoutsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['payoutsCreate']
	>('payouts', ctx.key, { method: 'POST', body: input });

	if (result.id && ctx.db.payouts) {
		try {
			await ctx.db.payouts.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay payout to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.payouts.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: RazorpayEndpoints['payoutsGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['payoutsGet']
	>(`payouts/${input.id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.payouts) {
		try {
			await ctx.db.payouts.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay payout to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.payouts.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: RazorpayEndpoints['payoutsList'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['payoutsList']
	>('payouts', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (ctx.db.payouts) {
		for (const payout of result.items) {
			try {
				await ctx.db.payouts.upsertByEntityId(payout.id, {
					...payout,
					createdAt: payout.created_at
						? new Date(payout.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save Razorpay payout to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.payouts.list',
		{ ...input },
		'completed',
	);
	return result;
};
