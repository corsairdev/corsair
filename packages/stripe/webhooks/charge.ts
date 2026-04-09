import { logEventFromContext } from 'corsair/core';
import type { StripeWebhooks } from '..';
import { createStripeEventMatch, verifyStripeWebhookSignature } from './types';

export const succeeded: StripeWebhooks['chargeSucceeded'] = {
	match: createStripeEventMatch('charge.succeeded'),

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

		if (ctx.db.charges) {
			try {
				const charge = event.data.object;
				await ctx.db.charges.upsertByEntityId(charge.id, {
					...charge,
					createdAt: charge.created
						? new Date(charge.created * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save charge (succeeded) to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.charge.succeeded',
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

export const failed: StripeWebhooks['chargeFailed'] = {
	match: createStripeEventMatch('charge.failed'),

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

		if (ctx.db.charges) {
			try {
				const charge = event.data.object;
				await ctx.db.charges.upsertByEntityId(charge.id, {
					...charge,
					createdAt: charge.created
						? new Date(charge.created * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save charge (failed) to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.charge.failed',
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

export const refunded: StripeWebhooks['chargeRefunded'] = {
	match: createStripeEventMatch('charge.refunded'),

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

		if (ctx.db.charges) {
			try {
				const charge = event.data.object;
				await ctx.db.charges.upsertByEntityId(charge.id, {
					...charge,
					createdAt: charge.created
						? new Date(charge.created * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn('Failed to save charge (refunded) to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.charge.refunded',
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
