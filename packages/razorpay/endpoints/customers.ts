import { logEventFromContext } from 'corsair/core';
import type { RazorpayEndpoints } from '..';
import { makeRazorpayRequest } from '../client';
import type { RazorpayEndpointOutputs } from './types';

export const create: RazorpayEndpoints['customersCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['customersCreate']
	>('customers', ctx.key, { method: 'POST', body: input });

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

	await logEventFromContext(
		ctx,
		'razorpay.customers.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: RazorpayEndpoints['customersGet'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['customersGet']
	>(`customers/${input.id}`, ctx.key, { method: 'GET' });

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

	await logEventFromContext(
		ctx,
		'razorpay.customers.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: RazorpayEndpoints['customersList'] = async (ctx, input) => {
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['customersList']
	>('customers', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (ctx.db.customers) {
		for (const customer of result.items) {
			try {
				await ctx.db.customers.upsertByEntityId(customer.id, {
					...customer,
					// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
					createdAt: customer.created_at
						? new Date(customer.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save Razorpay customer to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'razorpay.customers.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: RazorpayEndpoints['customersUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeRazorpayRequest<
		RazorpayEndpointOutputs['customersUpdate']
	>(`customers/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});

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

	await logEventFromContext(
		ctx,
		'razorpay.customers.update',
		{ ...input },
		'completed',
	);
	return result;
};
