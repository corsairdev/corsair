import { logEventFromContext } from 'corsair/core';
import type { DodoPaymentsWebhooks } from '..';
import { createDodoMatch, verifyDodoWebhookSignature } from './types';

export const succeeded: DodoPaymentsWebhooks['paymentSucceeded'] = {
	match: createDodoMatch('payment.succeeded'),

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
		const payment = event.data;

		if (ctx.db.payments) {
			try {
				await ctx.db.payments.upsertByEntityId(payment.id, {
					...payment,
					createdAt: payment.created_at
						? new Date(payment.created_at)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Dodo payment (succeeded) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'dodopayments.webhook.payment.succeeded',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: payment.id,
			data: event,
		};
	},
};

export const failed: DodoPaymentsWebhooks['paymentFailed'] = {
	match: createDodoMatch('payment.failed'),

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
		const payment = event.data;

		if (ctx.db.payments) {
			try {
				await ctx.db.payments.upsertByEntityId(payment.id, {
					...payment,
					createdAt: payment.created_at
						? new Date(payment.created_at)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Dodo payment (failed) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'dodopayments.webhook.payment.failed',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: payment.id,
			data: event,
		};
	},
};
