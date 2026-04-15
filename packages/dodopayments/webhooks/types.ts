import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';
import type {
	DodoPaymentData,
	DodoRefundData,
	DodoSubscriptionData,
} from '../schema/database';
import {
	DodoPaymentSchema,
	DodoRefundSchema,
	DodoSubscriptionSchema,
} from '../schema/database';

export type { DodoPaymentData, DodoRefundData, DodoSubscriptionData };

const DodoEventBaseSchema = z.object({
	event: z.string(),
	created_at: z.string().optional(),
});

export const DodoPaymentSucceededEventSchema = DodoEventBaseSchema.extend({
	event: z.literal('payment.succeeded'),
	data: DodoPaymentSchema,
});
export type DodoPaymentSucceededEvent = z.infer<
	typeof DodoPaymentSucceededEventSchema
>;

export const DodoPaymentFailedEventSchema = DodoEventBaseSchema.extend({
	event: z.literal('payment.failed'),
	data: DodoPaymentSchema,
});
export type DodoPaymentFailedEvent = z.infer<
	typeof DodoPaymentFailedEventSchema
>;

export const DodoSubscriptionActiveEventSchema = DodoEventBaseSchema.extend({
	event: z.literal('subscription.active'),
	data: DodoSubscriptionSchema,
});
export type DodoSubscriptionActiveEvent = z.infer<
	typeof DodoSubscriptionActiveEventSchema
>;

export const DodoSubscriptionCancelledEventSchema = DodoEventBaseSchema.extend({
	event: z.literal('subscription.cancelled'),
	data: DodoSubscriptionSchema,
});
export type DodoSubscriptionCancelledEvent = z.infer<
	typeof DodoSubscriptionCancelledEventSchema
>;

export const DodoRefundSucceededEventSchema = DodoEventBaseSchema.extend({
	event: z.literal('refund.succeeded'),
	data: DodoRefundSchema,
});
export type DodoRefundSucceededEvent = z.infer<
	typeof DodoRefundSucceededEventSchema
>;

export type DodoPaymentsWebhookOutputs = {
	paymentSucceeded: DodoPaymentSucceededEvent;
	paymentFailed: DodoPaymentFailedEvent;
	subscriptionActive: DodoSubscriptionActiveEvent;
	subscriptionCancelled: DodoSubscriptionCancelledEvent;
	refundSucceeded: DodoRefundSucceededEvent;
};

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body !== 'string') return (body ?? {}) as Record<string, unknown>;
	try {
		return JSON.parse(body) as Record<string, unknown>;
	} catch {
		return {};
	}
}

export function createDodoMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!('webhook-signature' in request.headers)) {
			return false;
		}
		const parsedBody = parseBody(request.body);
		return (
			typeof parsedBody.event === 'string' && parsedBody.event === eventType
		);
	};
}

export function verifyDodoWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) return { valid: false, error: 'Missing webhook secret' };

	const rawBody = request.rawBody;
	if (!rawBody) return { valid: false, error: 'Missing raw body' };

	const webhookId = Array.isArray(request.headers['webhook-id'])
		? request.headers['webhook-id'][0]
		: request.headers['webhook-id'];
	const webhookTimestamp = Array.isArray(request.headers['webhook-timestamp'])
		? request.headers['webhook-timestamp'][0]
		: request.headers['webhook-timestamp'];
	const sigHeader = Array.isArray(request.headers['webhook-signature'])
		? request.headers['webhook-signature'][0]
		: request.headers['webhook-signature'];

	if (!webhookId || !webhookTimestamp || !sigHeader) {
		return { valid: false, error: 'Missing required webhook headers' };
	}

	// Dodo signed content format per docs: {webhook-id}.{webhook-timestamp}.{raw_body}
	const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;

	// webhook-signature header format is "v1,<hex>" - strip version prefix
	const signatures = sigHeader.split(' ');
	const isValid = signatures.some((sig) => {
		const hexSig = sig.startsWith('v1,') ? sig.slice(3) : sig;
		return verifyHmacSignature(signedContent, secret, hexSig);
	});

	if (!isValid) return { valid: false, error: 'Invalid signature' };
	return { valid: true };
}
