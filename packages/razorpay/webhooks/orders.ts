import { logEventFromContext } from 'corsair/core';
import type { RazorpayWebhooks } from '..';
import { createRazorpayMatch, verifyRazorpayWebhookSignature } from './types';

export const paid: RazorpayWebhooks['orderPaid'] = {
	match: createRazorpayMatch('order.paid'),

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
		const order = event.payload.order.entity;
		const payment = event.payload.payment?.entity;

		if (ctx.db.orders) {
			try {
				await ctx.db.orders.upsertByEntityId(order.id, {
					...order,
					// created_at is a Unix timestamp in seconds; multiply by 1000 for ms
					createdAt: order.created_at
						? new Date(order.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Razorpay order (paid) to database:',
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
					'Failed to save Razorpay payment (order.paid) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'razorpay.webhook.order.paid',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: order.id,
			data: event,
		};
	},
};
