import { logEventFromContext } from 'corsair/core';
import type { DodoPaymentsEndpoints } from '..';
import { makeDodoPaymentsRequest } from '../client';
import type { DodoPaymentsEndpointOutputs } from './types';

export const create: DodoPaymentsEndpoints['customersCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['customersCreate']
	>('customers', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo customer to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.customers.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: DodoPaymentsEndpoints['customersGet'] = async (
	ctx,
	input,
) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['customersGet']
	>(`customers/${input.id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.customers) {
		try {
			await ctx.db.customers.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo customer to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.customers.get',
		{ ...input },
		'completed',
	);
	return result;
};
