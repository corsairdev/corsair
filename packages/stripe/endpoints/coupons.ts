import { logEventFromContext } from 'corsair/core';
import type { StripeEndpoints } from '..';
import { makeStripeRequest } from '../client';
import type { StripeEndpointOutputs } from './types';

export const create: StripeEndpoints['couponsCreate'] = async (ctx, input) => {
	const result = await makeStripeRequest<
		StripeEndpointOutputs['couponsCreate']
	>('coupons', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (result.id && ctx.db.coupons) {
		try {
			await ctx.db.coupons.upsertByEntityId(result.id, {
				...result,
				createdAt: result.created ? new Date(result.created * 1000) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save new coupon to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.coupons.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: StripeEndpoints['couponsList'] = async (ctx, input) => {
	const result = await makeStripeRequest<StripeEndpointOutputs['couponsList']>(
		'coupons',
		ctx.key,
		{
			method: 'GET',
			query: { ...input },
		},
	);

	if (result.data && ctx.db.coupons) {
		try {
			for (const coupon of result.data) {
				await ctx.db.coupons.upsertByEntityId(coupon.id, {
					...coupon,
					createdAt: coupon.created
						? new Date(coupon.created * 1000)
						: undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save coupons to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'stripe.coupons.list',
		{ ...input },
		'completed',
	);
	return result;
};
