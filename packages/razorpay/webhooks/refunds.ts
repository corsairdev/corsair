import { logEventFromContext } from 'corsair/core';
import type { RazorpayWebhooks } from '..';
import { createRazorpayMatch, verifyRazorpayWebhookSignature } from './types';

export const processed: RazorpayWebhooks['refundProcessed'] = {
	match: createRazorpayMatch('refund.processed'),

	handler: async (ctx, request) => {
		const verification = verifyRazorpayWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const refund = event.payload.refund.entity;
		const payment = event.payload.payment?.entity;

		if (ctx.db.refunds) {
			try {
				await ctx.db.refunds.upsertByEntityId(refund.id, {
					...refund,
					// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
					createdAt: refund.created_at
						? new Date(refund.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Razorpay refund (processed) to database:',
					error,
				);
			}
		}

		if (payment && ctx.db.payments) {
			try {
				await ctx.db.payments.upsertByEntityId(payment.id, {
					...payment,
					// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
					createdAt: payment.created_at
						? new Date(payment.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Razorpay payment (refund.processed) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'razorpay.webhook.refund.processed',
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
