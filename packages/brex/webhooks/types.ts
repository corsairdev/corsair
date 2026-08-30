import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/** Official webhook envelope. https://developer.brex.com/guides/webhooks */
export const BrexWebhookEventSchema = z
	.object({
		event_type: z.string(),
		event_id: z.string().optional(),
		company_id: z.string().optional(),
		data: z.unknown().optional(),
	})
	.loose();
export type BrexWebhookEvent = z.infer<typeof BrexWebhookEventSchema>;

export type BrexWebhookOutputs = {
	userUpdated: BrexWebhookEvent;
};

export function createBrexEventMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body =
			typeof request.body === 'string'
				? (JSON.parse(request.body) as Record<string, unknown>)
				: (request.body as Record<string, unknown> | undefined);
		return body?.event_type === eventType;
	};
}

export function hasBrexWebhookHeaders(
	headers: Record<string, string | string[] | undefined>,
): boolean {
	const names = new Set(Object.keys(headers).map((key) => key.toLowerCase()));
	return (
		names.has('webhook-id') &&
		names.has('webhook-timestamp') &&
		names.has('webhook-signature')
	);
}

const SIGNATURE_TOLERANCE_SEC = 300;

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const value = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(value)) return value[0];
	return value;
}

function signaturesFromHeader(header: string): string[] {
	return header
		.split(/\s+/)
		.map((part) => {
			const [version, signature] = part.split(',', 2);
			return version === 'v1' && signature ? signature : undefined;
		})
		.filter((value): value is string => Boolean(value));
}

function digest(secret: string, content: string): Buffer {
	return createHmac('sha256', secret).update(content).digest();
}

/**
 * Official verification:
 * signed_content = `${Webhook-Id}.${Webhook-Timestamp}.${rawBody}`
 * https://developer.brex.com/guides/webhooks
 */
export function verifyBrexWebhookSignature(
	request: Pick<WebhookRequest<unknown>, 'headers' | 'rawBody' | 'hubVerified'>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) return { valid: true };
	if (!secret) return { valid: false, error: 'missing webhook secret' };

	const id = headerValue(request.headers, 'webhook-id');
	const timestamp = headerValue(request.headers, 'webhook-timestamp');
	const signatureHeader = headerValue(request.headers, 'webhook-signature');
	if (!id || !timestamp || !signatureHeader) {
		return { valid: false, error: 'missing webhook signature headers' };
	}

	const ts = Number(timestamp);
	if (!Number.isFinite(ts)) {
		return { valid: false, error: 'invalid webhook timestamp' };
	}
	const skew = Math.abs(Date.now() / 1000 - ts);
	if (skew > SIGNATURE_TOLERANCE_SEC) {
		return { valid: false, error: 'webhook timestamp outside tolerance' };
	}

	const candidates = signaturesFromHeader(signatureHeader);
	if (candidates.length === 0) {
		return { valid: false, error: 'malformed webhook signature' };
	}

	const expected = digest(
		secret,
		`${id}.${timestamp}.${request.rawBody ?? ''}`,
	);
	for (const candidate of candidates) {
		const provided = Buffer.from(candidate, 'base64');
		if (
			provided.length === expected.length &&
			timingSafeEqual(provided, expected)
		) {
			return { valid: true };
		}
	}
	return { valid: false, error: 'webhook signature mismatch' };
}
