import crypto from 'node:crypto';
import { z } from 'zod';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

// ─────────────────────────────────────────────────────────────────────────────
// Base payload
// ─────────────────────────────────────────────────────────────────────────────

export interface GranolaWebhookPayload {
	type: string;
	created_at: string;
	// Payload data shape varies by event type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Attendee sub-type
// ─────────────────────────────────────────────────────────────────────────────

export interface GranolaAttendee {
	id?: string;
	name?: string;
	email?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Note events
// ─────────────────────────────────────────────────────────────────────────────

export interface NoteCreatedEvent extends GranolaWebhookPayload {
	type: 'note.created';
	data: {
		note_id: string;
		title?: string;
		summary?: string;
		created_at?: string;
		started_at?: string;
		ended_at?: string;
		attendees?: GranolaAttendee[];
		tags?: string[];
	};
}

export interface NoteUpdatedEvent extends GranolaWebhookPayload {
	type: 'note.updated';
	data: {
		note_id: string;
		title?: string;
		summary?: string;
		updated_at?: string;
		tags?: string[];
	};
}

export interface NoteDeletedEvent extends GranolaWebhookPayload {
	type: 'note.deleted';
	data: {
		note_id: string;
		deleted_at?: string;
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Transcript events
// ─────────────────────────────────────────────────────────────────────────────

export interface TranscriptReadyEvent extends GranolaWebhookPayload {
	type: 'transcript.ready';
	data: {
		transcript_id: string;
		note_id: string;
		full_text?: string;
		segments?: Array<{
			speaker?: string;
			text?: string;
			start_time?: number;
			end_time?: number;
		}>;
		created_at?: string;
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Meeting events
// ─────────────────────────────────────────────────────────────────────────────

export interface MeetingStartedEvent extends GranolaWebhookPayload {
	type: 'meeting.started';
	data: {
		note_id: string;
		title?: string;
		started_at?: string;
		attendees?: GranolaAttendee[];
	};
}

export interface MeetingEndedEvent extends GranolaWebhookPayload {
	type: 'meeting.ended';
	data: {
		note_id: string;
		title?: string;
		started_at?: string;
		ended_at?: string;
		duration_seconds?: number;
		attendees?: GranolaAttendee[];
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook output map
// ─────────────────────────────────────────────────────────────────────────────

export type GranolaWebhookOutputs = {
	noteCreated: NoteCreatedEvent;
	noteUpdated: NoteUpdatedEvent;
	noteDeleted: NoteDeletedEvent;
	transcriptReady: TranscriptReadyEvent;
	meetingStarted: MeetingStartedEvent;
	meetingEnded: MeetingEndedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Zod payload schemas (used in webhookSchemas for MCP discovery)
// ─────────────────────────────────────────────────────────────────────────────

const AttendeeSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
});

const BasePayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
});

export const NoteCreatedPayloadSchema = BasePayloadSchema.extend({
	type: z.literal('note.created'),
	data: z.object({
		note_id: z.string(),
		title: z.string().optional(),
		summary: z.string().optional(),
		created_at: z.string().optional(),
		started_at: z.string().optional(),
		ended_at: z.string().optional(),
		attendees: z.array(AttendeeSchema).optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const NoteUpdatedPayloadSchema = BasePayloadSchema.extend({
	type: z.literal('note.updated'),
	data: z.object({
		note_id: z.string(),
		title: z.string().optional(),
		summary: z.string().optional(),
		updated_at: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const NoteDeletedPayloadSchema = BasePayloadSchema.extend({
	type: z.literal('note.deleted'),
	data: z.object({
		note_id: z.string(),
		deleted_at: z.string().optional(),
	}),
});

export const TranscriptReadyPayloadSchema = BasePayloadSchema.extend({
	type: z.literal('transcript.ready'),
	data: z.object({
		transcript_id: z.string(),
		note_id: z.string(),
		full_text: z.string().optional(),
		segments: z
			.array(
				z.object({
					speaker: z.string().optional(),
					text: z.string().optional(),
					start_time: z.number().optional(),
					end_time: z.number().optional(),
				}),
			)
			.optional(),
		created_at: z.string().optional(),
	}),
});

export const MeetingStartedPayloadSchema = BasePayloadSchema.extend({
	type: z.literal('meeting.started'),
	data: z.object({
		note_id: z.string(),
		title: z.string().optional(),
		started_at: z.string().optional(),
		attendees: z.array(AttendeeSchema).optional(),
	}),
});

export const MeetingEndedPayloadSchema = BasePayloadSchema.extend({
	type: z.literal('meeting.ended'),
	data: z.object({
		note_id: z.string(),
		title: z.string().optional(),
		started_at: z.string().optional(),
		ended_at: z.string().optional(),
		duration_seconds: z.number().optional(),
		attendees: z.array(AttendeeSchema).optional(),
	}),
});

// ─────────────────────────────────────────────────────────────────────────────
// Event response schemas (what webhook handlers return as `data`)
// ─────────────────────────────────────────────────────────────────────────────

export const NoteCreatedEventSchema = NoteCreatedPayloadSchema;
export const NoteUpdatedEventSchema = NoteUpdatedPayloadSchema;
export const NoteDeletedEventSchema = NoteDeletedPayloadSchema;
export const TranscriptReadyEventSchema = TranscriptReadyPayloadSchema;
export const MeetingStartedEventSchema = MeetingStartedPayloadSchema;
export const MeetingEndedEventSchema = MeetingEndedPayloadSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Matcher factory
// ─────────────────────────────────────────────────────────────────────────────

// `unknown` here because the raw webhook body may be a string or pre-parsed object
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createGranolaMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// `body` may be a raw string or already-parsed object
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const parsed = parseBody(request.body) as Record<string, any>;
		return parsed?.type === eventType;
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Signature verification (HMAC-SHA256)
// ─────────────────────────────────────────────────────────────────────────────

export function verifyGranolaWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	const rawBody = request.rawBody;
	if (!rawBody) {
		return { valid: false, error: 'Missing raw body for signature verification' };
	}

	const headers = request.headers;
	// Headers may be a string or string array; normalise to a single string
	const signature = Array.isArray(headers['x-granola-signature'])
		? headers['x-granola-signature'][0]
		: headers['x-granola-signature'];

	if (!signature) {
		return { valid: false, error: 'Missing x-granola-signature header' };
	}

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');

	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
		return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
	} catch {
		return { valid: false, error: 'Signature comparison failed' };
	}
}
