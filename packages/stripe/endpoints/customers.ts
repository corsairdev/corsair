import { logEventFromContext } from 'corsair/core';
import type { StripeEndpoints } from '..';
import { makeStripeRequest } from '../client';
import type { StripeEndpointOutputs } from './types';

export const create: StripeEndpoints['customersCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeStripeRequest<
		StripeEndpointOutputs['customersCreate']
	>('customers', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save new customer to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.customers.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteCustomer: StripeEndpoints['customersDelete'] = async (
	ctx,
	input,
) => {
	const { id } = input;
	const result = await makeStripeRequest<
		StripeEndpointOutputs['customersDelete']
	>(`customers/${id}`, ctx.key, { method: 'DELETE' });

	if (ctx.db.customers) {
		try {
			await ctx.db.customers.deleteByEntityId(id);
		} catch (error) {
			console.warn('Failed to delete customer from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.customers.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: StripeEndpoints['customersGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeStripeRequest<StripeEndpointOutputs['customersGet']>(
		`customers/${id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save customer to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.customers.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: StripeEndpoints['customersList'] = async (ctx, input) => {
	const result = await makeStripeRequest<
		StripeEndpointOutputs['customersList']
	>('customers', ctx.key, {
		method: 'GET',
		query: { ...input },
	});

	if (result.data && ctx.db.customers) {
		try {
			for (const customer of result.data) {
				await ctx.db.customers.upsertByEntityId(customer.id, {
					...customer,
					createdAt: customer.created
						? new Date(customer.created * 1000)
						: undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save customers to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.customers.list',
		{ ...input },
		'completed',
	);
	return result;
};
