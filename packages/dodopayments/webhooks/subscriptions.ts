import { logEventFromContext } from 'corsair/core';
import type { DodoPaymentsWebhooks } from '..';
import { createDodoMatch, verifyDodoWebhookSignature } from './types';

export const active: DodoPaymentsWebhooks['subscriptionActive'] = {
	match: createDodoMatch('subscription.active'),

	handler: async (ctx, request) => {
		const verification = verifyDodoWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const subscription = event.data;

		if (ctx.db.subscriptions) {
			try {
				await ctx.db.subscriptions.upsertByEntityId(subscription.id, {
					...subscription,
					createdAt: subscription.created_at
						? new Date(subscription.created_at)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Dodo subscription (active) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'dodopayments.webhook.subscription.active',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: subscription.id,
			data: event,
		};
	},
};

export const cancelled: DodoPaymentsWebhooks['subscriptionCancelled'] = {
	match: createDodoMatch('subscription.cancelled'),

	handler: async (ctx, request) => {
		const verification = verifyDodoWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const subscription = event.data;

		if (ctx.db.subscriptions) {
			try {
				await ctx.db.subscriptions.upsertByEntityId(subscription.id, {
					...subscription,
					createdAt: subscription.created_at
						? new Date(subscription.created_at)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Dodo subscription (cancelled) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'dodopayments.webhook.subscription.cancelled',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: subscription.id,
			data: event,
		};
	},
};
