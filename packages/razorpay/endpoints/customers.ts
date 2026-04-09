import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const create: RazorpayEndpoints['customersCreate'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['customersCreate']>(
		'customers',
		ctx.key,
		{ method: 'POST', body: input },
	);

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay customer to database:', error);
		}
	}

	await logEventFromContext(ctx, 'razorpay.customers.create', { ...input }, 'completed');
	return result;
};

export const get: RazorpayEndpoints['customersGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<RazorpayEndpointOutputs['customersGet']>(
		`customers/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
				createdAt: result.created_at
					? new Date(result.created_at * 1000)
					: undefined,
			});
		} catch (error) {
			console.warn('Failed to save Razorpay customer to database:', error);
		}
	}

	await logEventFromContext(ctx, 'razorpay.customers.get', { ...input }, 'completed');
	return result;
};
