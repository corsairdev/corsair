import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

const MondayBaseEventSchema = z.object({
	userId: z.number(),
	originalTriggerUuid: z.string().nullable().optional(),
	boardId: z.number(),
	groupId: z.string().optional(),
	pulseId: z.number().optional(),
	pulseName: z.string().optional(),
	app: z.string().optional(),
	type: z.string(),
	triggerTime: z.string().optional(),
	subscriptionId: z.number().optional(),
	triggerUuid: z.string().optional(),
});

// ── Webhook Payload Schemas ───────────────────────────────────────────────────

export const MondayChallengePayloadSchema = z.object({
	challenge: z.string(),
});

export const MondayItemCreatedPayloadSchema = z.object({
	event: MondayBaseEventSchema.extend({
		type: z.literal('create_pulse'),
	}),
});

export const MondayColumnValueChangedPayloadSchema = z.object({
	event: MondayBaseEventSchema.extend({
		type: z.literal('change_column_value'),
		columnId: z.string(),
		columnType: z.string().optional(),
		columnTitle: z.string().optional(),
		// any: Monday.com column values are polymorphic JSON objects
		value: z.unknown(),
		// any: Monday.com column values are polymorphic JSON objects
		previousValue: z.unknown().optional(),
	}),
});

export const MondayStatusChangedPayloadSchema = z.object({
	event: MondayBaseEventSchema.extend({
		type: z.literal('change_status_column_value'),
		columnId: z.string(),
		columnType: z.string().optional(),
		columnTitle: z.string().optional(),
		// any: Monday.com status values are polymorphic JSON objects
		value: z.unknown(),
		// any: Monday.com status values are polymorphic JSON objects
		previousValue: z.unknown().optional(),
	}),
});

// ── Event Types ───────────────────────────────────────────────────────────────

export type MondayChallengePayload = z.infer<
	typeof MondayChallengePayloadSchema
>;
export type ItemCreatedEvent = z.infer<typeof MondayItemCreatedPayloadSchema>;
export type ColumnValueChangedEvent = z.infer<
	typeof MondayColumnValueChangedPayloadSchema
>;
export type StatusChangedEvent = z.infer<
	typeof MondayStatusChangedPayloadSchema
>;

// ── Webhook Outputs Type ──────────────────────────────────────────────────────

export type MondayWebhookOutputs = {
	challenge: MondayChallengePayload;
	itemCreated: ItemCreatedEvent;
	columnValueChanged: ColumnValueChangedEvent;
	statusChanged: StatusChangedEvent;
};

// ── Match Helpers ─────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body);
		} catch {
			return undefined;
		}
	}
	return body;
}
export function createMondayChallengeMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// any: raw body is unknown until parsed
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		if (!parsedBody || typeof parsedBody !== 'object') {
			return false;
		}
		return typeof parsedBody.challenge === 'string';
	};
}

export function createMondayMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// any: raw body is unknown until parsed
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		if (!parsedBody || typeof parsedBody !== 'object') {
			return false;
		}
		const event = parsedBody.event;
		if (event && typeof event === 'object' && 'type' in event) {
			return (event as Record<string, unknown>).type === eventType;
		}
		return false;
	};
}

// ── Signature Verification ────────────────────────────────────────────────────

export function verifyMondayWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const authHeader = Array.isArray(headers['authorization'])
		? headers['authorization'][0]
		: headers['authorization'];

	if (!authHeader) {
		return { valid: false, error: 'Missing Authorization header' };
	}

	const isValid = verifyHmacSignature(rawBody, secret, authHeader, 'sha256');
	return isValid
		? { valid: true }
		: { valid: false, error: 'Invalid signature' };
}
