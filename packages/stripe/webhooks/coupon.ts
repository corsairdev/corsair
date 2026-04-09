import { logEventFromContext } from 'corsair/core';
import type { StripeWebhooks } from '..';
import { createStripeEventMatch, verifyStripeWebhookSignature } from './types';

export const created: StripeWebhooks['couponCreated'] = {
	match: createStripeEventMatch('coupon.created'),

	handler: async (ctx, request) => {
		const verification = verifyStripeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (ctx.db.coupons) {
			try {
				const coupon = event.data.object;
				await ctx.db.coupons.upsertByEntityId(coupon.id, {
					...coupon,
					createdAt: coupon.created
						? new Date(coupon.created * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save coupon (created) to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.coupon.created',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.object.id,
			data: event,
		};
	},
};

export const deleted: StripeWebhooks['couponDeleted'] = {
	match: createStripeEventMatch('coupon.deleted'),

	handler: async (ctx, request) => {
		const verification = verifyStripeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (ctx.db.coupons) {
			try {
				await ctx.db.coupons.deleteByEntityId(event.data.object.id);
			} catch (error) {
				console.warn('Failed to delete coupon from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.coupon.deleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.object.id,
			data: event,
		};
	},
};
