import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

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
	variables?: Array<{
		key?: string;
		type?: string;
		text?: string;
		number?: number;
	}>;
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

export const TypeformFormResponsePayloadSchema = z
	.object({
		event_id: z.string(),
		event_type: z.string(),
		form_response: z
			.object({
				form_id: z.string(),
				token: z.string(),
				submitted_at: z.string(),
				landed_at: z.string(),
				// hidden fields have dynamic keys; typed as string record
				hidden: z.record(z.string()).optional(),
				calculated: z
					.object({ score: z.number().optional() })
					.passthrough()
					.optional(),
				definition: z
					.object({
						id: z.string().optional(),
						title: z.string().optional(),
						// fields within definition have variable shape per form
						fields: z.array(z.record(z.unknown())).optional(),
					})
					.passthrough()
					.optional(),
				// answers have dynamic shape depending on each field's type
				answers: z.array(z.record(z.unknown())).optional(),
				variables: z
					.array(
						z
							.object({
								key: z.string().optional(),
								type: z.string().optional(),
								text: z.string().optional(),
								number: z.number().optional(),
							})
							.passthrough(),
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
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const TypeformFormResponseEventSchema =
	TypeformFormResponsePayloadSchema;

// ── Helpers ───────────────────────────────────────────────────────────────────

export function createTypeformMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// Parse raw body to check event_type before full payload parsing
		const body =
			typeof request.body === 'string'
				? // Type assertion needed because JSON.parse returns unknown
					(JSON.parse(request.body) as Record<string, unknown>)
				: (request.body as Record<string, unknown>);
		return body?.event_type === eventType;
	};
}

/**
 * Verifies a Typeform webhook signature.
 * Typeform signs the raw request body using HMAC-SHA256 and base64-encodes the result.
 * The signature is sent in the `Typeform-Signature` header as `sha256=<base64_hmac>`.
 *
 * Typeform signs compact JSON with a trailing newline (`body\n`). The webhook pipeline
 * re-serialises the parsed body without that newline, so the HMAC is computed over
 * several candidates (compact, compact+LF, compact+CRLF, 2-space pretty) until one
 * matches.
 */
export function verifyTypeformWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const headers = request.headers;
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

	const rawBody = request.rawBody ?? JSON.stringify(request.payload);

	const candidates: string[] = [rawBody, rawBody + '\n', rawBody + '\r\n'];
	try {
		const pretty = JSON.stringify(JSON.parse(rawBody), null, 2);
		if (pretty !== rawBody) {
			candidates.push(pretty);
		}
	} catch {
		// not valid JSON; keep only the compact candidates
	}

	const computeSignature = (body: string) =>
		crypto.createHmac('sha256', secret).update(body).digest('base64');

	const isValid = candidates.some((body) => {
		const expected = computeSignature(body);
		try {
			return crypto.timingSafeEqual(
				Buffer.from(receivedSignature),
				Buffer.from(expected),
			);
		} catch {
			return false;
		}
	});

	return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
}
