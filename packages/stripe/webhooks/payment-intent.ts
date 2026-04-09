import { logEventFromContext } from 'corsair/core';
import type { StripeWebhooks } from '..';
import { createStripeEventMatch, verifyStripeWebhookSignature } from './types';

export const succeeded: StripeWebhooks['paymentIntentSucceeded'] = {
	match: createStripeEventMatch('payment_intent.succeeded'),

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

		if (ctx.db.paymentIntents) {
			try {
				const pi = event.data.object;
				await ctx.db.paymentIntents.upsertByEntityId(pi.id, {
					...pi,
					createdAt: pi.created ? new Date(pi.created * 1000) : undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save payment intent (succeeded) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.payment_intent.succeeded',
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

export const failed: StripeWebhooks['paymentIntentFailed'] = {
	match: createStripeEventMatch('payment_intent.payment_failed'),

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

		if (ctx.db.paymentIntents) {
			try {
				const pi = event.data.object;
				await ctx.db.paymentIntents.upsertByEntityId(pi.id, {
					...pi,
					createdAt: pi.created ? new Date(pi.created * 1000) : undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save payment intent (failed) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'stripe.webhook.payment_intent.payment_failed',
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
