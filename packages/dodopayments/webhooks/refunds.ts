import { logEventFromContext } from 'corsair/core';
import type { DodoPaymentsWebhooks } from '..';
import { createDodoMatch, verifyDodoWebhookSignature } from './types';

export const succeeded: DodoPaymentsWebhooks['refundSucceeded'] = {
	match: createDodoMatch('refund.succeeded'),

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
		const refund = event.data;

		if (ctx.db.refunds) {
			try {
				await ctx.db.refunds.upsertByEntityId(refund.id, {
					...refund,
					createdAt: refund.created_at ? new Date(refund.created_at) : undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Dodo refund (succeeded) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'dodopayments.webhook.refund.succeeded',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: refund.id,
			data: event,
		};
	},
};
