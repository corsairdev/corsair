import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ── Stripe resource sub-schemas ───────────────────────────────────────────────

export const StripeChargeDataSchema = z
	.object({
		id: z.string(),
		object: z.literal('charge'),
		amount: z.number(),
		currency: z.string(),
		status: z.string(),
		customer: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		paid: z.boolean().optional(),
		refunded: z.boolean().optional(),
		created: z.number().optional(),
		payment_intent: z.string().nullable().optional(),
		failure_code: z.string().nullable().optional(),
		failure_message: z.string().nullable().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();
export type StripeChargeData = z.infer<typeof StripeChargeDataSchema>;

export const StripeCustomerDataSchema = z
	.object({
		id: z.string(),
		object: z.literal('customer'),
		email: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		balance: z.number().optional(),
		created: z.number().optional(),
		livemode: z.boolean().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();
export type StripeCustomerData = z.infer<typeof StripeCustomerDataSchema>;

export const StripePaymentIntentDataSchema = z
	.object({
		id: z.string(),
		object: z.literal('payment_intent'),
		amount: z.number(),
		currency: z.string(),
		status: z.string(),
		customer: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		created: z.number().optional(),
		payment_method: z.string().nullable().optional(),
		client_secret: z.string().nullable().optional(),
		canceled_at: z.number().nullable().optional(),
		cancellation_reason: z.string().nullable().optional(),
		metadata: z.record(z.string()).optional(),
		last_payment_error: z
			.object({
				code: z.string().optional(),
				message: z.string().optional(),
				type: z.string().optional(),
			})
			.nullable()
			.optional(),
	})
	.passthrough();
export type StripePaymentIntentData = z.infer<
	typeof StripePaymentIntentDataSchema
>;

export const StripeCouponDataSchema = z
	.object({
		id: z.string(),
		object: z.literal('coupon'),
		name: z.string().nullable().optional(),
		amount_off: z.number().nullable().optional(),
		percent_off: z.number().nullable().optional(),
		currency: z.string().nullable().optional(),
		duration: z.string().optional(),
		duration_in_months: z.number().nullable().optional(),
		max_redemptions: z.number().nullable().optional(),
		times_redeemed: z.number().optional(),
		valid: z.boolean().optional(),
		created: z.number().optional(),
		livemode: z.boolean().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();
export type StripeCouponData = z.infer<typeof StripeCouponDataSchema>;

// ── Stripe webhook event envelope ─────────────────────────────────────────────

const StripeEventBaseSchema = z.object({
	id: z.string(),
	object: z.literal('event'),
	api_version: z.string().nullable().optional(),
	created: z.number(),
	livemode: z.boolean(),
	type: z.string(),
	request: z
		.object({
			id: z.string().nullable().optional(),
			idempotency_key: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});

// ── Typed event schemas ────────────────────────────────────────────────────────

export const StripeChargeSucceededEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('charge.succeeded'),
	data: z.object({
		object: StripeChargeDataSchema,
	}),
});
export type StripeChargeSucceededEvent = z.infer<
	typeof StripeChargeSucceededEventSchema
>;

export const StripeChargeFailedEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('charge.failed'),
	data: z.object({
		object: StripeChargeDataSchema,
	}),
});
export type StripeChargeFailedEvent = z.infer<
	typeof StripeChargeFailedEventSchema
>;

export const StripeChargeRefundedEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('charge.refunded'),
	data: z.object({
		object: StripeChargeDataSchema,
	}),
});
export type StripeChargeRefundedEvent = z.infer<
	typeof StripeChargeRefundedEventSchema
>;

export const StripeCustomerCreatedEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('customer.created'),
	data: z.object({
		object: StripeCustomerDataSchema,
	}),
});
export type StripeCustomerCreatedEvent = z.infer<
	typeof StripeCustomerCreatedEventSchema
>;

export const StripeCustomerDeletedEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('customer.deleted'),
	data: z.object({
		object: StripeCustomerDataSchema,
	}),
});
export type StripeCustomerDeletedEvent = z.infer<
	typeof StripeCustomerDeletedEventSchema
>;

export const StripeCustomerUpdatedEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('customer.updated'),
	data: z.object({
		object: StripeCustomerDataSchema,
	}),
});
export type StripeCustomerUpdatedEvent = z.infer<
	typeof StripeCustomerUpdatedEventSchema
>;

export const StripePaymentIntentSucceededEventSchema =
	StripeEventBaseSchema.extend({
		type: z.literal('payment_intent.succeeded'),
		data: z.object({
			object: StripePaymentIntentDataSchema,
		}),
	});
export type StripePaymentIntentSucceededEvent = z.infer<
	typeof StripePaymentIntentSucceededEventSchema
>;

export const StripePaymentIntentFailedEventSchema =
	StripeEventBaseSchema.extend({
		type: z.literal('payment_intent.payment_failed'),
		data: z.object({
			object: StripePaymentIntentDataSchema,
		}),
	});
export type StripePaymentIntentFailedEvent = z.infer<
	typeof StripePaymentIntentFailedEventSchema
>;

export const StripeCouponCreatedEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('coupon.created'),
	data: z.object({
		object: StripeCouponDataSchema,
	}),
});
export type StripeCouponCreatedEvent = z.infer<
	typeof StripeCouponCreatedEventSchema
>;

export const StripeCouponDeletedEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('coupon.deleted'),
	data: z.object({
		object: StripeCouponDataSchema,
	}),
});
export type StripeCouponDeletedEvent = z.infer<
	typeof StripeCouponDeletedEventSchema
>;

export const StripePingEventSchema = StripeEventBaseSchema.extend({
	type: z.literal('v2.core.event_destination.ping'),
	// unknown: ping event data.object is unstructured; Stripe does not document its shape
	data: z.object({ object: z.record(z.unknown()) }),
});
export type StripePingEvent = z.infer<typeof StripePingEventSchema>;

// ── Webhook output map ────────────────────────────────────────────────────────

export type StripeWebhookOutputs = {
	chargeSucceeded: StripeChargeSucceededEvent;
	chargeFailed: StripeChargeFailedEvent;
	chargeRefunded: StripeChargeRefundedEvent;
	customerCreated: StripeCustomerCreatedEvent;
	customerDeleted: StripeCustomerDeletedEvent;
	customerUpdated: StripeCustomerUpdatedEvent;
	paymentIntentSucceeded: StripePaymentIntentSucceededEvent;
	paymentIntentFailed: StripePaymentIntentFailedEvent;
	couponCreated: StripeCouponCreatedEvent;
	couponDeleted: StripeCouponDeletedEvent;
	ping: StripePingEvent;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

// Using 'unknown' because the webhook body can be a raw Buffer, string, or
// already-parsed object depending on the HTTP framework in use; the caller
// is responsible for narrowing the type after calling this helper.
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

/**
 * Verifies a Stripe webhook signature.
 * Stripe sends: stripe-signature: t=TIMESTAMP,v1=SIGNATURE
 * Signed payload format: `${timestamp}.${rawBody}`
 */
// unknown: the webhook payload type is generic at this layer; callers receive a typed payload after schema parsing
export function verifyStripeWebhookSignature(
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

	const headers = request.headers;
	const sigHeader = Array.isArray(headers['stripe-signature'])
		? headers['stripe-signature'][0]
		: headers['stripe-signature'];

	if (!sigHeader) {
		return { valid: false, error: 'Missing stripe-signature header' };
	}

	// Parse t=TIMESTAMP,v1=SIGNATURE from the header
	const parts = sigHeader.split(',');
	let timestamp: string | undefined;
	const v1Signatures: string[] = [];

	for (const part of parts) {
		if (part.startsWith('t=')) {
			timestamp = part.slice(2);
		} else if (part.startsWith('v1=')) {
			v1Signatures.push(part.slice(3));
		}
	}

	if (!timestamp || v1Signatures.length === 0) {
		return { valid: false, error: 'Malformed stripe-signature header' };
	}

	const STRIPE_TIMESTAMP_TOLERANCE_MS = 300_000; // 5 minutes

	const webhookTime = parseInt(timestamp, 10) * 1000;
	if (Math.abs(Date.now() - webhookTime) > STRIPE_TIMESTAMP_TOLERANCE_MS) {
		return {
			valid: false,
			error: 'Webhook timestamp is too old (possible replay attack)',
		};
	}

	// Stripe sends pretty-printed JSON (2-space indent). If the body was parsed
	// and re-stringified to compact form, the lengths won't match and the HMAC
	// will fail. Detect this via content-length and retry with pretty formatting.
	// Type assertion: headers['content-length'] is string | string[] | undefined; undefined is guarded by the ternary
	const contentLength = request.headers['content-length']
		? parseInt(request.headers['content-length'] as string, 10)
		: null;

	const candidates: string[] = [rawBody];
	if (contentLength && rawBody.length !== contentLength) {
		try {
			const pretty = JSON.stringify(JSON.parse(rawBody), null, 2);
			if (pretty.length === contentLength) {
				candidates.push(pretty);
			}
		} catch {
			// rawBody is not valid JSON — keep only the original candidate
		}
	}

	const isValid = candidates.some((body) =>
		v1Signatures.some((sig) =>
			verifyHmacSignature(`${timestamp}.${body}`, secret, sig),
		),
	);

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

/**
 * Creates a webhook matcher that checks if an incoming request is a Stripe
 * event of the specified type.
 */
export function createStripeEventMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!('stripe-signature' in request.headers)) {
			return false;
		}
		// Type assertion: parseBody returns unknown; asserting to Record<string, unknown> to access body.type for event matching
		const body = parseBody(request.body) as Record<string, unknown>;
		return body.type === eventType;
	};
}
