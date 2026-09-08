import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import * as crypto from 'crypto';
import { z } from 'zod';

// ── Xero Webhook Event Schema ──────────────────────────────────────────────────

export const XeroWebhookEventItemSchema = z
	.object({
		resourceUrl: z.string(),
		resourceId: z.string(),
		eventDateUtc: z.string(),
		eventType: z.string(),
		eventCategory: z.string(),
		tenantId: z.string(),
		tenantType: z.string(),
	})
	.loose();

export type XeroWebhookEventItem = z.infer<typeof XeroWebhookEventItemSchema>;

export const XeroWebhookPayloadSchema = z
	.object({
		events: z.array(XeroWebhookEventItemSchema),
		lastEventSequence: z.number().optional(),
		firstEventSequence: z.number().optional(),
		entropy: z.string().optional(),
	})
	.loose();

export type XeroWebhookPayload = z.infer<typeof XeroWebhookPayloadSchema>;

export const XeroInvoiceEventSchema = XeroWebhookPayloadSchema;
export const XeroContactEventSchema = XeroWebhookPayloadSchema;
export const XeroGenericEventSchema = XeroWebhookPayloadSchema;

export type XeroInvoiceEvent = z.infer<typeof XeroInvoiceEventSchema>;
export type XeroContactEvent = z.infer<typeof XeroContactEventSchema>;
export type XeroGenericEvent = z.infer<typeof XeroGenericEventSchema>;

export type XeroWebhookOutputs = {
	invoiceCreated: XeroInvoiceEvent;
	invoiceUpdated: XeroInvoiceEvent;
	contactCreated: XeroContactEvent;
	contactUpdated: XeroContactEvent;
	event: XeroGenericEvent;
};

// ── Helpers & Signature Verification ──────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

/**
 * Creates a webhook matcher that checks if an incoming Xero webhook
 * contains events matching a given category and optional eventType (CREATE/UPDATE).
 */
export function createXeroEventMatch(
	category?: 'INVOICE' | 'CONTACT',
	eventType?: 'CREATE' | 'UPDATE',
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headers = request.headers;
		if (!('x-xero-signature' in headers)) {
			return false;
		}
		const body = parseBody(request.body);
		if (!body || !Array.isArray(body.events)) {
			return false;
		}
		if (!category) {
			return true;
		}
		return body.events.some((event: any) => {
			const categoryMatches =
				String(event.eventCategory).toUpperCase() === category;
			if (!eventType) return categoryMatches;
			return (
				categoryMatches && String(event.eventType).toUpperCase() === eventType
			);
		});
	};
}

/**
 * Verifies a Xero webhook signature.
 * Header: `x-xero-signature: <base64-encoded HMAC-SHA256 of raw body>`
 */
export function verifyXeroWebhookSignature(
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
	const sigHeader = Array.isArray(headers['x-xero-signature'])
		? headers['x-xero-signature'][0]
		: headers['x-xero-signature'];

	if (!sigHeader) {
		return { valid: false, error: 'Missing x-xero-signature header' };
	}

	let isValid = false;
	try {
		const expectedBase64 = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('base64');
		isValid =
			crypto.timingSafeEqual(
				Buffer.from(sigHeader),
				Buffer.from(expectedBase64),
			) || verifyHmacSignature(rawBody, secret, sigHeader);
	} catch {
		isValid = false;
	}

	if (!isValid) {
		return { valid: false, error: 'Invalid Xero webhook signature' };
	}

	return { valid: true };
}
