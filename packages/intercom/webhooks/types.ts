import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

// ── Base Payload ──────────────────────────────────────────────────────────────

export interface IntercomWebhookPayload {
	type: string;
	topic: string;
	// id is null for ping events sent during initial webhook setup
	id: string | null;
	app_id: string;
	created_at: number;
	first_sent_at: number;
	data: {
		type: string;
		// item is dynamic per topic
		item: Record<string, unknown>;
	};
}

// ── Event Interfaces ──────────────────────────────────────────────────────────

export interface ContactCreatedEvent extends IntercomWebhookPayload {
	topic: 'contact.user.created';
	data: {
		type: string;
		item: {
			type: string;
			id: string;
			email?: string;
			name?: string;
			role?: string;
			created_at?: number;
		};
	};
}

export interface ContactDeletedEvent extends IntercomWebhookPayload {
	topic: 'contact.user.deleted';
	data: {
		type: string;
		item: {
			type: string;
			id: string;
			deleted: boolean;
		};
	};
}

export interface ContactTagCreatedEvent extends IntercomWebhookPayload {
	topic: 'contact.user.tag.created';
	data: {
		type: string;
		item: {
			type: string;
			id: string;
			tag_id: string;
			contact_id: string;
			// dynamic fields from Intercom webhook payload
			[key: string]: unknown;
		};
	};
}

export interface ConversationCreatedEvent extends IntercomWebhookPayload {
	topic: 'conversation.admin.created';
	data: {
		type: string;
		item: {
			type: string;
			id: string;
			created_at?: number;
			state?: string;
			source?: {
				type?: string;
				id?: string;
				body?: string;
				author?: {
					type?: string;
					id?: string;
				};
			};
		};
	};
}

export interface ConversationAssignedEvent extends IntercomWebhookPayload {
	topic: 'conversation.admin.assigned';
	data: {
		type: string;
		item: {
			type: string;
			id: string;
			assignee?: {
				type?: string;
				id?: number;
			};
			// dynamic fields from Intercom webhook payload
			[key: string]: unknown;
		};
	};
}

export interface ConversationClosedEvent extends IntercomWebhookPayload {
	topic: 'conversation.admin.closed';
	data: {
		type: string;
		item: {
			type: string;
			id: string;
			state: string;
			// dynamic fields from Intercom webhook payload
			[key: string]: unknown;
		};
	};
}

// Sent by Intercom when a webhook URL is first registered for initial setup verification
export interface PingEvent extends IntercomWebhookPayload {
	topic: 'ping';
	id: null;
	data: {
		type: string;
		item: {
			type: 'ping';
			message: string;
		};
	};
}

// ── Output Type Map ───────────────────────────────────────────────────────────

export type IntercomWebhookOutputs = {
	contactCreated: ContactCreatedEvent;
	contactDeleted: ContactDeletedEvent;
	contactTagCreated: ContactTagCreatedEvent;
	conversationCreated: ConversationCreatedEvent;
	conversationAssigned: ConversationAssignedEvent;
	conversationClosed: ConversationClosedEvent;
	ping: PingEvent;
};

// ── Zod Schemas for webhook schemas map ──────────────────────────────────────

const IntercomWebhookPayloadSchema = z.object({
	type: z.string(),
	topic: z.string(),
	// id is null for ping events sent during initial webhook setup
	id: z.string().nullable(),
	app_id: z.string(),
	created_at: z.number(),
	first_sent_at: z.number().optional(),
	data: z.object({
		type: z.string().optional(),
		item: z.record(z.unknown()),
	}),
});

export const ContactCreatedPayloadSchema = IntercomWebhookPayloadSchema;
export const ContactCreatedEventSchema = z.object({
	id: z.string(),
	email: z.string().optional(),
	name: z.string().optional(),
	role: z.string().optional(),
	created_at: z.number().optional(),
});

export const ContactDeletedPayloadSchema = IntercomWebhookPayloadSchema;
export const ContactDeletedEventSchema = z.object({
	id: z.string(),
	deleted: z.boolean().optional(),
});

export const ContactTagCreatedPayloadSchema = IntercomWebhookPayloadSchema;
export const ContactTagCreatedEventSchema = z.object({
	id: z.string(),
	tag_id: z.string().optional(),
	contact_id: z.string().optional(),
});

export const ConversationCreatedPayloadSchema = IntercomWebhookPayloadSchema;
export const ConversationCreatedEventSchema = z.object({
	id: z.string(),
	created_at: z.number().optional(),
	state: z.string().optional(),
});

export const ConversationAssignedPayloadSchema = IntercomWebhookPayloadSchema;
export const ConversationAssignedEventSchema = z.object({
	id: z.string(),
	assignee: z
		.object({
			type: z.string().optional(),
			id: z.number().nullable().optional(),
		})
		.optional(),
});

export const ConversationClosedPayloadSchema = IntercomWebhookPayloadSchema;
export const ConversationClosedEventSchema = z.object({
	id: z.string(),
	state: z.string().optional(),
});

export const PingPayloadSchema = IntercomWebhookPayloadSchema;
export const PingEventSchema = z.object({
	type: z.literal('ping'),
	message: z.string(),
});

// ── Match Helper ──────────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return {};
		}
	}
	if (body && typeof body === 'object') {
		return body as Record<string, unknown>;
	}
	return {};
}

export function createIntercomMatch(topic: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody.topic === topic;
	};
}

// ── Signature Verification ────────────────────────────────────────────────────

export function verifyIntercomWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	// Use rawBody for signature verification to match the original hashed bytes
	const body = request.rawBody ?? JSON.stringify(request.payload);
	const signatureHeader = request.headers['x-hub-signature'];
	// x-hub-signature can be a string or string[]
	const signature = Array.isArray(signatureHeader)
		? signatureHeader[0]
		: signatureHeader;

	if (!signature) {
		return { valid: false, error: 'Missing x-hub-signature header' };
	}

	const expectedSignature = `sha1=${crypto
		.createHmac('sha1', secret)
		.update(body)
		.digest('hex')}`;

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
