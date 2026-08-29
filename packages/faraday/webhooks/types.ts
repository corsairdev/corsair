import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/**
 * Official Faraday webhook payload.
 * https://faraday.ai/docs/reference/createwebhookendpoint
 */
export const FaradayWebhookPayloadSchema = z.object({
	timestamp: z.string(),
	type: z
		.enum(['resource.ready_with_update', 'resource.errored'])
		.or(z.string()),
	data: z.object({
		account_id: z.string(),
		resource_id: z.string(),
		resource_type: z.string(),
	}),
});

export type FaradayWebhookPayload = z.infer<typeof FaradayWebhookPayloadSchema>;

export const ResourceReadyEventSchema = FaradayWebhookPayloadSchema.extend({
	type: z.literal('resource.ready_with_update'),
});

export type ResourceReadyEvent = z.infer<typeof ResourceReadyEventSchema>;

export type FaradayWebhookOutputs = {
	resourceReady: ResourceReadyEvent;
};

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

export function createFaradayMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

function firstHeader(
	headers: Record<string, string | string[] | undefined>,
	names: string[],
): string | undefined {
	for (const name of names) {
		const value = headers[name] ?? headers[name.toLowerCase()];
		if (Array.isArray(value)) return value[0];
		if (typeof value === 'string' && value) return value;
	}
	return undefined;
}

/** Standard Webhooks default tolerance. https://github.com/standard-webhooks/standard-webhooks */
export const FARADAY_WEBHOOK_TOLERANCE_SECONDS = 300;

// ponytail: in-memory replay cache; persist if Faraday retries across processes
const seenMessageIds = new Map<string, number>();

export function resetFaradayWebhookReplayCache(): void {
	seenMessageIds.clear();
}

function pruneReplayCache(now: number): void {
	for (const [id, exp] of seenMessageIds) {
		if (exp < now) seenMessageIds.delete(id);
	}
}

function reserveMessageId(msgId: string, expiresAt: number): boolean {
	const now = Math.floor(Date.now() / 1000);
	pruneReplayCache(now);
	if (seenMessageIds.has(msgId)) return false;
	seenMessageIds.set(msgId, expiresAt);
	return true;
}

export function releaseFaradayWebhookMessageId(msgId: string): void {
	seenMessageIds.delete(msgId);
}

export function faradayWebhookMessageId(
	headers: Record<string, string | string[] | undefined>,
): string | undefined {
	return firstHeader(headers, ['svix-id', 'webhook-id']);
}

function signingBody(
	request: WebhookRequest<FaradayWebhookPayload>,
): string | undefined {
	if (typeof request.rawBody === 'string' && request.rawBody.length > 0) {
		return request.rawBody;
	}
	const body = (request as { body?: unknown }).body;
	return typeof body === 'string' && body.length > 0 ? body : undefined;
}

function secretBytes(secret: string): Buffer {
	const raw = secret.startsWith('whsec_') ? secret.slice(6) : secret;
	const decoded = Buffer.from(raw, 'base64');
	return decoded.length > 0 ? decoded : Buffer.from(secret);
}

/**
 * Faraday webhooks use Standard Webhooks / Svix.
 * Headers: svix-id, svix-timestamp, svix-signature
 */
export function verifyFaradayWebhookSignature(
	request: WebhookRequest<FaradayWebhookPayload>,
	secret: string,
	nowSeconds = Math.floor(Date.now() / 1000),
): { valid: boolean; error?: string } {
	if (request.hubVerified) {
		return { valid: true };
	}
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const msgId = firstHeader(request.headers, ['svix-id', 'webhook-id']);
	const timestamp = firstHeader(request.headers, [
		'svix-timestamp',
		'webhook-timestamp',
	]);
	const signatureHeader = firstHeader(request.headers, [
		'svix-signature',
		'webhook-signature',
	]);

	if (!msgId || !timestamp || !signatureHeader) {
		return {
			valid: false,
			error: 'Missing Standard Webhooks signature headers',
		};
	}
	const rawBody = signingBody(request);
	if (!rawBody) {
		return { valid: false, error: 'Missing raw request body' };
	}

	if (!/^[0-9]+$/.test(timestamp)) {
		return { valid: false, error: 'Invalid webhook timestamp' };
	}
	const timestampSeconds = Number.parseInt(timestamp, 10);
	if (!Number.isFinite(timestampSeconds)) {
		return { valid: false, error: 'Invalid webhook timestamp' };
	}
	if (
		Math.abs(nowSeconds - timestampSeconds) > FARADAY_WEBHOOK_TOLERANCE_SECONDS
	) {
		return {
			valid: false,
			error: 'Webhook timestamp is too old (possible replay attack)',
		};
	}

	const signedContent = `${msgId}.${timestamp}.${rawBody}`;
	const expected = createHmac('sha256', secretBytes(secret))
		.update(signedContent)
		.digest('base64');

	const candidates = signatureHeader.split(/[,\s]+/).filter(Boolean);
	const ok = candidates.some((part) => {
		const sig = part.includes(',')
			? part.slice(part.indexOf(',') + 1)
			: part.replace(/^v1[=,]/, '');
		const actual = Buffer.from(sig);
		const wanted = Buffer.from(expected);
		return actual.length === wanted.length && timingSafeEqual(actual, wanted);
	});
	if (!ok) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	if (
		!reserveMessageId(
			msgId,
			timestampSeconds + FARADAY_WEBHOOK_TOLERANCE_SECONDS,
		)
	) {
		return { valid: false, error: 'Replay: webhook message id already used' };
	}

	return { valid: true };
}
