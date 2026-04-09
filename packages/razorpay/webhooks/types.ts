import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';
import type {
	RazorpayOrderData,
	RazorpayPaymentData,
	RazorpayRefundData,
} from '../schema/database';
import {
	RazorpayOrderSchema,
	RazorpayPaymentSchema,
	RazorpayRefundSchema,
} from '../schema/database';

// Re-export data types for consumers
export type { RazorpayOrderData, RazorpayPaymentData, RazorpayRefundData };

const RazorpayEventBaseSchema = z.object({
	entity: z.literal('event'),
	account_id: z.string(),
	event: z.string(),
	contains: z.array(z.string()),
	created_at: z.number(),
});

export const RazorpayPaymentCapturedEventSchema =
	RazorpayEventBaseSchema.extend({
		event: z.literal('payment.captured'),
		payload: z.object({
			payment: z.object({
				entity: RazorpayPaymentSchema,
			}),
		}),
	});
export type RazorpayPaymentCapturedEvent = z.infer<
	typeof RazorpayPaymentCapturedEventSchema
>;

export const RazorpayPaymentFailedEventSchema = RazorpayEventBaseSchema.extend({
	event: z.literal('payment.failed'),
	payload: z.object({
		payment: z.object({
			entity: RazorpayPaymentSchema,
		}),
	}),
});
export type RazorpayPaymentFailedEvent = z.infer<
	typeof RazorpayPaymentFailedEventSchema
>;

export const RazorpayOrderPaidEventSchema = RazorpayEventBaseSchema.extend({
	event: z.literal('order.paid'),
	payload: z.object({
		order: z.object({
			entity: RazorpayOrderSchema,
		}),
		payment: z
			.object({
				entity: RazorpayPaymentSchema,
			})
			.optional(),
	}),
});
export type RazorpayOrderPaidEvent = z.infer<
	typeof RazorpayOrderPaidEventSchema
>;

export const RazorpayRefundProcessedEventSchema =
	RazorpayEventBaseSchema.extend({
		event: z.literal('refund.processed'),
		payload: z.object({
			refund: z.object({
				entity: RazorpayRefundSchema,
			}),
			payment: z
				.object({
					entity: RazorpayPaymentSchema,
				})
				.optional(),
		}),
	});
export type RazorpayRefundProcessedEvent = z.infer<
	typeof RazorpayRefundProcessedEventSchema
>;

export type RazorpayWebhookOutputs = {
	paymentCaptured: RazorpayPaymentCapturedEvent;
	paymentFailed: RazorpayPaymentFailedEvent;
	orderPaid: RazorpayOrderPaidEvent;
	refundProcessed: RazorpayRefundProcessedEvent;
};

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body !== 'string') return (body ?? {}) as Record<string, unknown>;
	try {
		return JSON.parse(body) as Record<string, unknown>;
	} catch {
		return {};
	}
}

export function createRazorpayMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!('x-razorpay-signature' in request.headers)) {
			return false;
		}
		const parsedBody = parseBody(request.body);
		return (
			typeof parsedBody.event === 'string' && parsedBody.event === eventType
		);
	};
}

// unknown is intentional: the generic webhook request body is not yet validated at this point
export function verifyRazorpayWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const sigHeader = Array.isArray(request.headers['x-razorpay-signature'])
		? request.headers['x-razorpay-signature'][0]
		: request.headers['x-razorpay-signature'];

	if (!sigHeader) {
		return { valid: false, error: 'Missing x-razorpay-signature header' };
	}

	const isValid = verifyHmacSignature(rawBody, secret, sigHeader);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
