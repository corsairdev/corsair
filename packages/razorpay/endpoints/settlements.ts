import { logEventFromContext } from 'corsair/core';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpoints } from '../index';
import type { RazorpayEndpointOutputs } from './types';

export const list: RazorpayEndpoints['settlementsList'] = async (
	ctx,
	input,
) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['settlementsList']
	>('settlements', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.id && ctx.db.settlements) {
		try {
			await ctx.db.settlements.upsertByEntityId(result.id, {
				...result,
				// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay settlement to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.settlements.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: RazorpayEndpoints['settlementsGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['settlementsGet']
	>(`settlements/${input.id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.settlements) {
		try {
			await ctx.db.settlements.upsertByEntityId(result.id, {
				...result,
				// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay settlement to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.settlements.get',
		{ ...input },
		'completed',
	);
	return result;
};
