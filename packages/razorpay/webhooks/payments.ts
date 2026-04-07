import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { RazorpayContext } from '..';
import {
	createRazorpayMatch,
	type RazorpayPaymentCapturedEvent,
	type RazorpayPaymentFailedEvent,
	verifyRazorpayWebhookSignature,
} from './types';

export const captured: CorsairWebhook<
	RazorpayContext,
	RazorpayPaymentCapturedEvent,
	RazorpayPaymentCapturedEvent
> = {
	match: createRazorpayMatch('payment.captured'),

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
		const payment = event.payload.payment.entity;

		if (ctx.db.payments) {
			try {
				await ctx.db.payments.upsertByEntityId(payment.id, {
					...payment,
					createdAt: payment.created_at
						? new Date(payment.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Razorpay payment (captured) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'razorpay.webhook.payment.captured',
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

export const failed: CorsairWebhook<
	RazorpayContext,
	RazorpayPaymentFailedEvent,
	RazorpayPaymentFailedEvent
> = {
	match: createRazorpayMatch('payment.failed'),

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
		const payment = event.payload.payment.entity;

		if (ctx.db.payments) {
			try {
				await ctx.db.payments.upsertByEntityId(payment.id, {
					...payment,
					createdAt: payment.created_at
						? new Date(payment.created_at * 1000)
						: undefined,
				});
			} catch (error) {
				console.warn(
					'Failed to save Razorpay payment (failed) to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'razorpay.webhook.payment.failed',
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
