import { logEventFromContext } from 'corsair/core';
import type { StripeEndpoints } from '..';
import { makeStripeRequest } from '../client';
import type { StripeEndpointOutputs } from './types';

export const create: StripeEndpoints['paymentIntentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeStripeRequest<
		StripeEndpointOutputs['paymentIntentsCreate']
	>('payment_intents', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (result.id && ctx.db.paymentIntents) {
		try {
			await ctx.db.paymentIntents.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save new payment intent to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.paymentIntents.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: StripeEndpoints['paymentIntentsGet'] = async (ctx, input) => {
	const { id } = input;
	const result = await makeStripeRequest<
		StripeEndpointOutputs['paymentIntentsGet']
	>(`payment_intents/${id}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.paymentIntents) {
		try {
			await ctx.db.paymentIntents.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save payment intent to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.paymentIntents.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: StripeEndpoints['paymentIntentsList'] = async (
	ctx,
	input,
) => {
	const result = await makeStripeRequest<
		StripeEndpointOutputs['paymentIntentsList']
	>('payment_intents', ctx.key, {
		method: 'GET',
		query: { ...input },
	});

	if (result.data && ctx.db.paymentIntents) {
		try {
			for (const pi of result.data) {
				await ctx.db.paymentIntents.upsertByEntityId(pi.id, {
					...pi,
					createdAt: pi.created ? new Date(pi.created * 1000) : undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save payment intents to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.paymentIntents.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: StripeEndpoints['paymentIntentsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeStripeRequest<
		StripeEndpointOutputs['paymentIntentsUpdate']
	>(`payment_intents/${id}`, ctx.key, {
		method: 'POST',
		body: { ...body },
	});

	if (result.id && ctx.db.paymentIntents) {
		try {
			await ctx.db.paymentIntents.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to update payment intent in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.paymentIntents.update',
		{ ...input },
		'completed',
	);
	return result;
};
