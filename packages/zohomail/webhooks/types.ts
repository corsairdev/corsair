import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Event schema
//
// Zoho Mail outgoing webhooks POST the email event directly in the body (no
// secondary fetch needed, unlike Gmail's PubSub → history reconciliation).
// @see https://www.zoho.com/mail/help/dev-platform/webhook.html
// ─────────────────────────────────────────────────────────────────────────────

export const ZohoMailWebhookEventSchema = z
	.object({
		messageId: z.coerce.string().optional(),
		folderId: z.coerce.string().optional(),
		subject: z.string().optional(),
		summary: z.string().optional(),
		html: z.string().optional(),
		fromAddress: z.string().optional(),
		toAddress: z.string().optional(),
		ccAddress: z.string().optional(),
		sender: z.string().optional(),
		sentDateInGMT: z.coerce.string().optional(),
		receivedTime: z.coerce.string().optional(),
		size: z.union([z.string(), z.number()]).optional(),
	})
	.loose();
export type ZohoMailWebhookEvent = z.infer<typeof ZohoMailWebhookEventSchema>;

export const ZohoMailChallengePayloadSchema = z.object({}).loose();
export type ZohoMailChallengePayload = z.infer<
	typeof ZohoMailChallengePayloadSchema
>;

export const ZohoMailChallengeResponseSchema = z.object({
	hookSecret: z.string(),
});

export type ZohoMailEventName = 'handshake' | 'messageReceived';

export type ZohoMailWebhookOutputs = {
	handshake: { hookSecret: string };
	messageReceived: ZohoMailWebhookEvent;
};

/** Coerce Zoho entity IDs (string or number) to a stable string key. */
export function zohoEntityId(
	value: string | number | undefined | null,
): string | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	return String(value);
}

/**
 * Read an ID from raw JSON without losing precision on large numeric literals.
 * Falls back to the parsed payload value when raw body is unavailable.
 */
export function resolveZohoId(
	rawBody: string | undefined,
	key: string,
	parsed: string | number | undefined,
): string | undefined {
	if (rawBody) {
		const re = new RegExp(`"${key}"\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|[0-9]+)`);
		const match = rawBody.match(re);
		if (match?.[1]) {
			const token = match[1];
			if (token.startsWith('"')) {
				try {
					return JSON.parse(token) as string;
				} catch {
					return token.slice(1, -1);
				}
			}
			return token;
		}
	}
	return zohoEntityId(parsed);
}

// ─────────────────────────────────────────────────────────────────────────────
// Signature verification
//
// Zoho signs each request with `x-hook-signature` = base64 HMAC-SHA256 of the
// full raw request body, keyed by `x-hook-secret`. The secret is delivered in
// the header of the first ("handshake") request and must be stored as the
// plugin's webhook secret; subsequent requests carry only the signature.
// ─────────────────────────────────────────────────────────────────────────────

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const raw = headers[name];
	return Array.isArray(raw) ? raw[0] : raw;
}

export function getZohoWebhookSignature(
	headers: Record<string, string | string[] | undefined>,
): string | undefined {
	return headerValue(headers, 'x-hook-signature');
}

export function getZohoWebhookSecretFromRequest(
	headers: Record<string, string | string[] | undefined>,
): string | undefined {
	return headerValue(headers, 'x-hook-secret');
}

export function verifyZohoWebhookSignature(
	rawBody: string,
	secret: string,
	signature: string,
): boolean {
	if (!secret || !signature || !rawBody) {
		return false;
	}

	const expected = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('base64');

	try {
		const a = Buffer.from(signature);
		const b = Buffer.from(expected);
		return a.length === b.length && crypto.timingSafeEqual(a, b);
	} catch {
		return false;
	}
}

/**
 * Matches signed Zoho Mail email deliveries (`x-hook-signature` present).
 * Handshake requests (`x-hook-secret` only) are routed to `challenge.handshake`.
 */
export function createZohoMailMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headers = request.headers ?? {};
		if (getZohoWebhookSignature(headers) === undefined) {
			return false;
		}

		const body = (
			typeof request.body === 'string' ? safeParse(request.body) : request.body
		) as Record<string, unknown> | undefined;

		return (
			!!body &&
			(typeof body.messageId !== 'undefined' ||
				typeof body.summary !== 'undefined' ||
				typeof body.subject !== 'undefined')
		);
	};
}

function safeParse(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return undefined;
	}
}

export type ZohoMailWebhookRequest = WebhookRequest<ZohoMailWebhookEvent>;
