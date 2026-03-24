import { z } from 'zod';
import crypto from 'crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from '../../../core';

// ── Webhook Payload Types ─────────────────────────────────────────────────────

export interface TypeformWebhookPayload {
	event_id: string;
	event_type: string;
	form_response: TypeformFormResponseData;
}

export interface TypeformFormResponseData {
	form_id: string;
	token: string;
	submitted_at: string;
	landed_at: string;
	// hidden fields have dynamic string keys set by the form creator
	hidden?: Record<string, string>;
	calculated?: { score?: number };
	definition?: {
		id?: string;
		title?: string;
		// fields vary per form and have no fixed schema at the webhook level
		fields?: Array<Record<string, unknown>>;
	};
	// answers vary per field type and cannot be fully typed statically
	answers?: Array<Record<string, unknown>>;
	variables?: Array<{ key?: string; type?: string; text?: string; number?: number }>;
	metadata?: {
		browser?: string;
		referer?: string;
		platform?: string;
		network_id?: string;
		user_agent?: string;
	};
}

export interface TypeformFormResponseEvent extends TypeformWebhookPayload {
	event_type: 'form_response';
	form_response: TypeformFormResponseData;
}

// ── Webhook Output Types ──────────────────────────────────────────────────────

export type TypeformWebhookOutputs = {
	formResponse: TypeformFormResponseEvent;
};

// ── Zod Schemas for Webhook Payloads ─────────────────────────────────────────

export const TypeformFormResponsePayloadSchema = z.object({
	event_id: z.string(),
	event_type: z.string(),
	form_response: z.object({
		form_id: z.string(),
		token: z.string(),
		submitted_at: z.string(),
		landed_at: z.string(),
		// hidden fields have dynamic keys; typed as string record
		hidden: z.record(z.string()).optional(),
		calculated: z.object({ score: z.number().optional() }).optional(),
		definition: z
			.object({
				id: z.string().optional(),
				title: z.string().optional(),
				// fields within definition have variable shape per form
				fields: z.array(z.record(z.unknown())).optional(),
			})
			.optional(),
		// answers have dynamic shape depending on each field's type
		answers: z.array(z.record(z.unknown())).optional(),
		variables: z
			.array(
				z.object({
					key: z.string().optional(),
					type: z.string().optional(),
					text: z.string().optional(),
					number: z.number().optional(),
				}),
			)
			.optional(),
		metadata: z
			.object({
				browser: z.string().optional(),
				referer: z.string().optional(),
				platform: z.string().optional(),
				network_id: z.string().optional(),
				user_agent: z.string().optional(),
			})
			.optional(),
	}),
});

export const TypeformFormResponseEventSchema = TypeformFormResponsePayloadSchema;

// ── Helpers ───────────────────────────────────────────────────────────────────

export function createTypeformMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// Parse raw body to check event_type before full payload parsing
		const body =
			typeof request.body === 'string'
				? (JSON.parse(request.body) as Record<string, unknown>)
				: (request.body as Record<string, unknown>);
		return body?.event_type === eventType;
	};
}

/**
 * Verifies a Typeform webhook signature.
 * Typeform signs the raw request body using HMAC-SHA256 and base64-encodes the result.
 * The signature is sent in the `Typeform-Signature` header as `sha256=<base64_hmac>`.
 * Uses rawBody from the WebhookRequest for accurate HMAC computation.
 */
export function verifyTypeformWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	const headers = request.headers;
	// Headers can be string | string[] | undefined; normalize to string
	const signatureHeaderRaw =
		headers['typeform-signature'] ?? headers['Typeform-Signature'];
	const signatureHeader = Array.isArray(signatureHeaderRaw)
		? signatureHeaderRaw[0]
		: signatureHeaderRaw;

	if (!signatureHeader) {
		return { valid: false, error: 'Missing Typeform-Signature header' };
	}

	if (!signatureHeader.startsWith('sha256=')) {
		return { valid: false, error: 'Invalid signature format' };
	}

	const receivedSignature = signatureHeader.slice('sha256='.length);

	// Prefer rawBody for exact bytes; fall back to re-serializing the payload
	const bodyToSign =
		request.rawBody ?? JSON.stringify(request.payload);

	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(bodyToSign)
		.digest('base64');

	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(receivedSignature),
			Buffer.from(expectedSignature),
		);
		return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
	} catch {
		return { valid: false, error: 'Signature comparison failed' };
	}
}
