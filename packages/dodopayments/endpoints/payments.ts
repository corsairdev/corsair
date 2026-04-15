import { logEventFromContext } from 'corsair/core';
import type { DodoPaymentsEndpoints } from '..';
import { makeDodoPaymentsRequest } from '../client';
import type { DodoPaymentsEndpointOutputs } from './types';

export const create: DodoPaymentsEndpoints['paymentsCreate'] = async (ctx, input) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['paymentsCreate']
	>('payments', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.id && ctx.db.payments) {
		try {
			await ctx.db.payments.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo payment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.payments.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: DodoPaymentsEndpoints['paymentsGet'] = async (ctx, input) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['paymentsGet']
	>(`payments/${input.id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.payments) {
		try {
			await ctx.db.payments.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo payment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.payments.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: DodoPaymentsEndpoints['paymentsList'] = async (ctx, input) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['paymentsList']
	>('payments', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (ctx.db.payments && result.data) {
		for (const payment of result.data) {
			try {
				await ctx.db.payments.upsertByEntityId(payment.id, {
					...payment,
					createdAt: payment.created_at ? new Date(payment.created_at) : undefined,
				});
			} catch (error) {
				console.warn('Failed to save Dodo payment to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.payments.list',
		{ ...input },
		'completed',
	);
	return result;
};
