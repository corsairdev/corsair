import * as crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
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

// Monday board / integration webhooks put an HS256 JWT in Authorization,
// signed with the app Signing Secret (or Client Secret for lifecycle events).
// See https://developer.monday.com/apps/docs/authorization-header
// This is NOT a body HMAC — treating the JWT as an HMAC digest 401s real traffic.

function base64UrlEncode(buf: Buffer): string {
	return buf
		.toString('base64')
		.replace(/=+$/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

function base64UrlDecode(input: string): Buffer {
	const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
	const padded = normalized.padEnd(
		normalized.length + ((4 - (normalized.length % 4)) % 4),
		'=',
	);
	return Buffer.from(padded, 'base64');
}

function timingSafeEqualString(a: string, b: string): boolean {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) return false;
	return crypto.timingSafeEqual(aBuf, bBuf);
}

function verifyMondayJwt(
	token: string,
	secret: string,
): { valid: boolean; error?: string } {
	const parts = token.split('.');
	if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
		return { valid: false, error: 'Invalid Authorization JWT' };
	}

	const [headerB64, payloadB64, signatureB64] = parts;

	try {
		const header = JSON.parse(base64UrlDecode(headerB64).toString('utf8')) as {
			alg?: string;
		};
		if (header.alg !== 'HS256') {
			return { valid: false, error: 'Unsupported JWT algorithm' };
		}
	} catch {
		return { valid: false, error: 'Invalid Authorization JWT' };
	}

	const expectedSig = base64UrlEncode(
		crypto
			.createHmac('sha256', secret)
			.update(`${headerB64}.${payloadB64}`)
			.digest(),
	);

	if (!timingSafeEqualString(expectedSig, signatureB64)) {
		return { valid: false, error: 'Invalid signature' };
	}

	try {
		const payload = JSON.parse(
			base64UrlDecode(payloadB64).toString('utf8'),
		) as { exp?: number };
		if (
			typeof payload.exp === 'number' &&
			Math.floor(Date.now() / 1000) >= payload.exp
		) {
			return { valid: false, error: 'Token expired' };
		}
	} catch {
		return { valid: false, error: 'Invalid Authorization JWT' };
	}

	return { valid: true };
}

export function verifyMondayWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const headers = request.headers;
	const authHeader = Array.isArray(headers['authorization'])
		? headers['authorization'][0]
		: headers['authorization'];

	if (!authHeader) {
		return { valid: false, error: 'Missing Authorization header' };
	}

	// RFC 9110: auth scheme token is case-insensitive ("Bearer" / "bearer" / …).
	const token = authHeader.replace(/^Bearer\s+/i, '');

	return verifyMondayJwt(token, secret);
}
