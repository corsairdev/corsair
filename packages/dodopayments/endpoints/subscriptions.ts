import { logEventFromContext } from 'corsair/core';
import type { DodoPaymentsEndpoints } from '..';
import { makeDodoPaymentsRequest } from '../client';
import type { DodoPaymentsEndpointOutputs } from './types';

export const create: DodoPaymentsEndpoints['subscriptionsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['subscriptionsCreate']
	>('subscriptions', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.subscriptions.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: DodoPaymentsEndpoints['subscriptionsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['subscriptionsGet']
	>(`subscriptions/${input.id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.subscriptions.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancel: DodoPaymentsEndpoints['subscriptionsCancel'] = async (
	ctx,
	input,
) => {
	const result = await makeDodoPaymentsRequest<
		DodoPaymentsEndpointOutputs['subscriptionsCancel']
	>(`subscriptions/${input.id}/cancel`, ctx.key, { method: 'POST' });

	if (result.id && ctx.db.subscriptions) {
		try {
			await ctx.db.subscriptions.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created_at ? new Date(result.created_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save Dodo subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dodopayments.subscriptions.cancel',
		{ ...input },
		'completed',
	);
	return result;
};
