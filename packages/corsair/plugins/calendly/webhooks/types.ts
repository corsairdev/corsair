import { z } from 'zod';
import crypto from 'crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from '../../../core';

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
	tracking: z.record(z.unknown()).optional(),
	questions_and_answers: z.array(z.record(z.unknown())).optional(),
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
	location: z.record(z.unknown()).optional(),
	invitees_counter: z
		.object({
			total: z.number(),
			active: z.number(),
			limit: z.number(),
		})
		.optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	event_memberships: z.array(z.record(z.unknown())).optional(),
	event_guests: z.array(z.record(z.unknown())).optional(),
});

const CalendlyWebhookBaseSchema = z.object({
	event: z.string(),
	time: z.string(),
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

export type InviteeCanceledPayload = z.infer<typeof InviteeCanceledPayloadSchema>;

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
			questions_and_answers: z.array(z.record(z.unknown())).optional(),
			tracking: z.record(z.unknown()).optional(),
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
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody.event === eventType;
	};
}

/**
 * Verifies Calendly webhook signature.
 * The Calendly-Webhook-Signature header is in the format: t=timestamp,v1=signature
 * The signature is HMAC-SHA256 of `timestamp.rawBody` using the signing key.
 */
export function verifyCalendlyWebhookSignature(
	request: WebhookRequest<unknown>,
	signingKey: string,
): { valid: boolean; error?: string } {
	if (!signingKey) {
		return { valid: false, error: 'Missing signing key' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return { valid: false, error: 'Missing raw body for signature verification' };
	}

	const headers = request.headers;
	// Calendly-Webhook-Signature header value
	const signatureHeader = Array.isArray(
		headers['calendly-webhook-signature'],
	)
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

	const expectedSignature = crypto
		.createHmac('sha256', signingKey)
		.update(`${timestamp}.${rawBody}`)
		.digest('hex');

	const isValid = crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expectedSignature),
	);

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
