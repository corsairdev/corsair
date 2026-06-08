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
		messageId: z.string().optional(),
		folderId: z.string().optional(),
		subject: z.string().optional(),
		summary: z.string().optional(),
		html: z.string().optional(),
		fromAddress: z.string().optional(),
		toAddress: z.string().optional(),
		ccAddress: z.string().optional(),
		sender: z.string().optional(),
		sentDateInGMT: z.string().optional(),
		receivedTime: z.string().optional(),
		size: z.union([z.string(), z.number()]).optional(),
	})
	.loose();
export type ZohoMailWebhookEvent = z.infer<typeof ZohoMailWebhookEventSchema>;

export type ZohoMailEventName = 'messageReceived';

export type ZohoMailWebhookOutputs = {
	messageReceived: ZohoMailWebhookEvent;
};

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
 * Matches incoming Zoho Mail webhook deliveries by the presence of the Zoho hook
 * headers plus an email identifier in the body. Used for routing only — the
 * handler performs the actual cryptographic verification.
 */
export function createZohoMailMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headers = request.headers ?? {};
		const hasHookHeader =
			getZohoWebhookSignature(headers) !== undefined ||
			getZohoWebhookSecretFromRequest(headers) !== undefined;
		if (!hasHookHeader) {
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
