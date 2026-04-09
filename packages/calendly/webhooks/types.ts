import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const CalendlyInviteePayloadSchema = z.object({
	uri: z.string(),
	email: z.string(),
	name: z.string(),
	status: z.enum(['active', 'canceled']).optional(),
	event: z.string(),
	timezone: z.string().optional(),
	created_at: z.string(),
	updated_at: z.string(),
	cancel_url: z.string().optional(),
	reschedule_url: z.string().optional(),
	// Tracking metadata shape varies by source (UTM params, custom fields, etc.)
	tracking: z.record(z.unknown()).optional(),
	// Each Q&A entry structure differs by question type (text, radio, checkbox, etc.)
	questions_and_answers: z.array(z.record(z.unknown())).optional(),
	// Payment details vary by processor and plan; no stable schema in Calendly's public API
	payment: z.record(z.unknown()).nullable().optional(),
	no_show: z.object({ uri: z.string() }).nullable().optional(),
	rescheduled: z.boolean().optional(),
	old_invitee: z.string().nullable().optional(),
	new_invitee: z.string().nullable().optional(),
	routing_form_submission: z.string().nullable().optional(),
});

const CalendlyEventPayloadSchema = z.object({
	uri: z.string(),
	name: z.string().optional(),
	status: z.enum(['active', 'canceled']).optional(),
	start_time: z.string(),
	end_time: z.string(),
	event_type: z.string(),
	location: z
		.object({
			type: z.string(),
			location: z.string().optional(),
			join_url: z.string().optional(),
		})
		.optional(),
	invitees_counter: z
		.object({
			total: z.number(),
			active: z.number(),
			limit: z.number(),
		})
		.optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	// Membership entries include plan-specific fields (host type, role, etc.) not in the public schema
	event_memberships: z.array(z.record(z.unknown())).optional(),
	// Guest entries vary; additional fields may appear without documentation
	event_guests: z.array(z.record(z.unknown())).optional(),
});

const CalendlyWebhookBaseSchema = z.object({
	event: z.string(),
	time: z.string(),
	// Base payload is open-ended; event-specific schemas narrow this via .extend()
	payload: z.record(z.unknown()),
});

// ── Event-specific payload schemas ────────────────────────────────────────────

export const InviteeCreatedPayloadSchema = CalendlyWebhookBaseSchema.extend({
	event: z.literal('invitee.created'),
	payload: CalendlyInviteePayloadSchema.extend({
		scheduled_event: CalendlyEventPayloadSchema.optional(),
		invitee_scheduled_by: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		// Reconfirmation object shape is undocumented in Calendly's public API
		reconfirmation: z.record(z.unknown()).nullable().optional(),
		scheduling_method: z.string().nullable().optional(),
		text_reminder_number: z.string().nullable().optional(),
	}),
});

export type InviteeCreatedPayload = z.infer<typeof InviteeCreatedPayloadSchema>;

export const InviteeCanceledPayloadSchema = CalendlyWebhookBaseSchema.extend({
	event: z.literal('invitee.canceled'),
	payload: CalendlyInviteePayloadSchema.extend({
		scheduled_event: CalendlyEventPayloadSchema.optional(),
		invitee_scheduled_by: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		// Reconfirmation object shape is undocumented in Calendly's public API
		reconfirmation: z.record(z.unknown()).nullable().optional(),
		scheduling_method: z.string().nullable().optional(),
		text_reminder_number: z.string().nullable().optional(),
		cancellation: z
			.object({
				canceled_by: z.string(),
				reason: z.string().optional(),
				canceler_type: z.string(),
			})
			.nullable()
			.optional(),
	}),
});

export type InviteeCanceledPayload = z.infer<
	typeof InviteeCanceledPayloadSchema
>;

export const InviteeNoShowCreatedPayloadSchema =
	CalendlyWebhookBaseSchema.extend({
		event: z.literal('invitee_no_show.created'),
		payload: z.object({
			uri: z.string(),
			invitee: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
		}),
	});

export type InviteeNoShowCreatedPayload = z.infer<
	typeof InviteeNoShowCreatedPayloadSchema
>;

export const RoutingFormSubmissionCreatedPayloadSchema =
	CalendlyWebhookBaseSchema.extend({
		event: z.literal('routing_form_submission.created'),
		payload: z.object({
			uri: z.string(),
			routing_form: z.string(),
			// Each Q&A entry differs by question type; no fixed schema in Calendly's docs
			questions_and_answers: z.array(z.record(z.unknown())).optional(),
			// UTM/source tracking fields vary by integration and campaign
			tracking: z.record(z.unknown()).optional(),
			// Routing result structure depends on the form's routing rules configuration
			result: z.record(z.unknown()).optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		}),
	});

export type RoutingFormSubmissionCreatedPayload = z.infer<
	typeof RoutingFormSubmissionCreatedPayloadSchema
>;

export const EventTypeUpdatedPayloadSchema = CalendlyWebhookBaseSchema.extend({
	event: z.literal('event_type.updated'),
	payload: z.object({
		uri: z.string(),
		name: z.string().optional(),
		active: z.boolean().optional(),
		slug: z.string().optional(),
		scheduling_url: z.string().optional(),
		duration: z.number().optional(),
		kind: z.string().optional(),
		color: z.string().optional(),
		updated_at: z.string().optional(),
	}),
});

export type EventTypeUpdatedPayload = z.infer<
	typeof EventTypeUpdatedPayloadSchema
>;

export const UserUpdatedPayloadSchema = CalendlyWebhookBaseSchema.extend({
	event: z.literal('user.updated'),
	payload: z.object({
		uri: z.string(),
		name: z.string().optional(),
		email: z.string().optional(),
		slug: z.string().optional(),
		timezone: z.string().optional(),
		scheduling_url: z.string().optional(),
		updated_at: z.string().optional(),
	}),
});

export type UserUpdatedPayload = z.infer<typeof UserUpdatedPayloadSchema>;

// ── CalendlyWebhookOutputs ────────────────────────────────────────────────────

export type CalendlyWebhookOutputs = {
	inviteeCreated: InviteeCreatedPayload;
	inviteeCanceled: InviteeCanceledPayload;
	inviteeNoShow: InviteeNoShowCreatedPayload;
	routingFormSubmission: RoutingFormSubmissionCreatedPayload;
	eventTypeUpdated: EventTypeUpdatedPayload;
	userUpdated: UserUpdatedPayload;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

// body arrives as either a raw JSON string (from HTTP middleware) or a pre-parsed object
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

/**
 * Creates a matcher for a Calendly webhook event type.
 * Calendly sends the event name in the top-level `event` field.
 */
export function createCalendlyEventMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		try {
			// parseBody returns unknown; cast is safe because valid Calendly payloads are always JSON objects
			const parsedBody = parseBody(request.body) as Record<string, unknown>;
			return parsedBody.event === eventType;
		} catch {
			// Malformed body cannot match any event type
			return false;
		}
	};
}

/**
 * Verifies Calendly webhook signature.
 * The Calendly-Webhook-Signature header is in the format: t=timestamp,v1=signature
 * The signature is HMAC-SHA256 of `timestamp.rawBody` using the signing key.
 */
// WebhookRequest<unknown>: signature verification only reads rawBody/headers; the typed body is irrelevant here
export function verifyCalendlyWebhookSignature(
	request: WebhookRequest<unknown>,
	signingKey: string,
): { valid: boolean; error?: string } {
	try {
		if (!signingKey) {
			return { valid: false, error: 'Missing signing key' };
		}

		const rawBody = request.rawBody;
		if (!rawBody) {
			return {
				valid: false,
				error: 'Missing raw body for signature verification',
			};
		}

		const headers = request.headers;
		// Calendly-Webhook-Signature header value
		const signatureHeader = Array.isArray(headers['calendly-webhook-signature'])
			? headers['calendly-webhook-signature'][0]
			: headers['calendly-webhook-signature'];

		if (!signatureHeader) {
			return {
				valid: false,
				error: 'Missing Calendly-Webhook-Signature header',
			};
		}

		// Parse "t=<timestamp>,v1=<signature>"
		const parts = signatureHeader.split(',');
		let timestamp: string | undefined;
		let signature: string | undefined;

		for (const part of parts) {
			if (part.startsWith('t=')) {
				timestamp = part.slice(2);
			} else if (part.startsWith('v1=')) {
				signature = part.slice(3);
			}
		}

		if (!timestamp || !signature) {
			return {
				valid: false,
				error: 'Malformed Calendly-Webhook-Signature header',
			};
		}

		// Reject requests whose timestamp is more than 5 minutes old to prevent replay attacks.
		// Calendly embeds the Unix timestamp (seconds) in the signature header so we can validate freshness.
		const timestampMs = parseInt(timestamp, 10) * 1000;
		if (
			isNaN(timestampMs) ||
			Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000
		) {
			return { valid: false, error: 'Webhook timestamp is too old or invalid' };
		}

		const expectedSignature = crypto
			.createHmac('sha256', signingKey)
			.update(`${timestamp}.${rawBody}`)
			.digest('hex');

		// Decode from hex so we compare raw bytes, not UTF-8 representations of hex digits.
		// timingSafeEqual requires equal-length buffers; a length mismatch means the signature
		// is structurally invalid and we treat it as a failure.
		const sigBuf = Buffer.from(signature, 'hex');
		const expectedBuf = Buffer.from(expectedSignature, 'hex');
		if (sigBuf.length !== expectedBuf.length) {
			return { valid: false, error: 'Invalid signature' };
		}
		const isValid = crypto.timingSafeEqual(sigBuf, expectedBuf);

		if (!isValid) {
			return { valid: false, error: 'Invalid signature' };
		}

		return { valid: true };
	} catch (error) {
		console.error('Signature verification failed (internal):', error);
		return { valid: false, error: 'Signature verification failed' };
	}
}
