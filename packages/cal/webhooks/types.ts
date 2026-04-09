import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

const AttendeeSchema = z
	.object({
		name: z.string(),
		email: z.string(),
		timeZone: z.string().optional(),
		// Language configuration object with dynamic keys and values
		language: z.record(z.unknown()).optional(),
		absent: z.boolean().optional(),
	})
	.passthrough();

const HostSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		email: z.string().optional(),
		username: z.string().optional(),
		timeZone: z.string().optional(),
	})
	.passthrough();

const BookingDataSchema = z
	.object({
		bookingId: z.number().optional(),
		uid: z.string(),
		title: z.string().optional(),
		description: z.string().nullable().optional(),
		status: z.string().optional(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
		length: z.number().optional(),
		eventTypeId: z.number().optional(),
		meetingUrl: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		cancellationReason: z.string().nullable().optional(),
		reschedulingReason: z.string().nullable().optional(),
		rescheduledFromUid: z.string().nullable().optional(),
		attendees: z.array(AttendeeSchema).optional(),
		hosts: z.array(HostSchema).optional(),
		// Flexible metadata object containing arbitrary key-value pairs from Cal.com
		metadata: z.record(z.unknown()).nullable().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Webhook event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const BookingCreatedEventSchema = z.object({
	triggerEvent: z.literal('BOOKING_CREATED'),
	createdAt: z.string(),
	payload: BookingDataSchema,
});
export type BookingCreatedEvent = z.infer<typeof BookingCreatedEventSchema>;

export const BookingCancelledEventSchema = z.object({
	triggerEvent: z.literal('BOOKING_CANCELLED'),
	createdAt: z.string(),
	payload: BookingDataSchema,
});
export type BookingCancelledEvent = z.infer<typeof BookingCancelledEventSchema>;

export const BookingRescheduledEventSchema = z.object({
	triggerEvent: z.literal('BOOKING_RESCHEDULED'),
	createdAt: z.string(),
	payload: BookingDataSchema,
});
export type BookingRescheduledEvent = z.infer<
	typeof BookingRescheduledEventSchema
>;

export const MeetingEndedEventSchema = z.object({
	triggerEvent: z.literal('MEETING_ENDED'),
	createdAt: z.string(),
	payload: BookingDataSchema,
});
export type MeetingEndedEvent = z.infer<typeof MeetingEndedEventSchema>;

export const PingEventSchema = z.object({
	triggerEvent: z.literal('PING'),
	createdAt: z.string().optional(),
	// Ping payload can contain arbitrary test data
	payload: z.record(z.unknown()).optional(),
});
export type PingEvent = z.infer<typeof PingEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Webhook payload wrapper
// ─────────────────────────────────────────────────────────────────────────────

export interface CalWebhookPayload {
	triggerEvent: string;
	createdAt: string;
	payload: {
		uid: string;
		// Additional dynamic properties that may be included in the payload
		[key: string]: unknown;
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// CalWebhookOutputs
// ─────────────────────────────────────────────────────────────────────────────

export type CalWebhookOutputs = {
	bookingCreated: BookingCreatedEvent;
	bookingCancelled: BookingCancelledEvent;
	bookingRescheduled: BookingRescheduledEvent;
	meetingEnded: MeetingEndedEvent;
	ping: PingEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

// Parse webhook request body, handling both string and object formats
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createCalMatch(triggerEvent: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody.triggerEvent === triggerEvent;
	};
}

export function verifyCalWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No secret provided' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-cal-signature-256'])
		? headers['x-cal-signature-256'][0]
		: headers['x-cal-signature-256'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-cal-signature-256 header',
		};
	}

	const isValid = verifyHmacSignature(rawBody, secret, signature, 'sha256');
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
