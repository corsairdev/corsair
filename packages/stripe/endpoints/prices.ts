import { logEventFromContext } from 'corsair/core';
import type { StripeEndpoints } from '..';
import { makeStripeRequest } from '../client';
import type { StripeEndpointOutputs } from './types';

export const create: StripeEndpoints['pricesCreate'] = async (ctx, input) => {
	const result = await makeStripeRequest<StripeEndpointOutputs['pricesCreate']>(
		'prices',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	if (result.id && ctx.db.prices) {
		try {
			await ctx.db.prices.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save new price to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.prices.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: StripeEndpoints['pricesList'] = async (ctx, input) => {
	const result = await makeStripeRequest<StripeEndpointOutputs['pricesList']>(
		'prices',
		ctx.key,
		{
			method: 'GET',
			query: { ...input },
		},
	);

	if (result.data && ctx.db.prices) {
		try {
			for (const price of result.data) {
				await ctx.db.prices.upsertByEntityId(price.id, {
					...price,
					createdAt: price.created ? new Date(price.created * 1000) : undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save prices to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.prices.list',
		{ ...input },
		'completed',
	);
	return result;
};
