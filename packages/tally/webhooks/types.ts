import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ── Tally webhook field schema ────────────────────────────────────────────────

const TallyWebhookFieldSchema = z
	.object({
		key: z.string(),
		label: z.string().optional(),
		type: z.string().optional(),
		value: z.unknown().optional(),
		options: z.array(z.unknown()).optional(),
		rows: z.array(z.unknown()).optional(),
		columns: z.array(z.unknown()).optional(),
	})
	.passthrough();

// ── Tally FORM_RESPONSE event schema ──────────────────────────────────────────

export const TallyFormResponseEventSchema = z.object({
	eventId: z.string(),
	eventType: z.literal('FORM_RESPONSE'),
	createdAt: z.string(),
	data: z.object({
		responseId: z.string().optional(),
		submissionId: z.string(),
		respondentId: z.string().nullable().optional(),
		formId: z.string(),
		formName: z.string().optional(),
		createdAt: z.string().optional(),
		fields: z.array(TallyWebhookFieldSchema),
	}),
});

export type TallyFormResponseEvent = z.infer<
	typeof TallyFormResponseEventSchema
>;

// ── Webhook payload base ──────────────────────────────────────────────────────

export interface TallyWebhookPayload {
	eventId: string;
	eventType: string;
	createdAt: string;
	data: Record<string, unknown>;
}

// ── Webhook output map ────────────────────────────────────────────────────────

export type TallyWebhookOutputs = {
	formResponse: TallyFormResponseEvent;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return null;
		}
	}
	if (body && typeof body === 'object' && !Array.isArray(body)) {
		return body as Record<string, unknown>;
	}
	return null;
}

/**
 * Verifies a Tally webhook signature.
 * Tally sends: tally-signature header containing SHA-256 HMAC of the JSON body,
 * base64-encoded, using the signing secret as the key.
 */
export function verifyTallyWebhookSignature(
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
	const sigHeader = Array.isArray(headers['tally-signature'])
		? headers['tally-signature'][0]
		: headers['tally-signature'];

	if (!sigHeader) {
		return { valid: false, error: 'Missing tally-signature header' };
	}

	const isValid = verifyHmacSignature(rawBody, secret, sigHeader);

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

/**
 * Creates a webhook matcher that checks if an incoming request is a Tally
 * event of the specified type.
 */
export function createTallyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!('tally-signature' in request.headers)) {
			return false;
		}
		const body = parseBody(request.body);
		return body !== null && body.eventType === eventType;
	};
}
