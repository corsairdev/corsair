import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/**
 * Benzinga Data Webhook Engine delivery shape.
 * https://docs.benzinga.com/webhook-reference/overview
 * Every delivery carries a unique `X-BZ-Delivery` header for deduplication;
 * the JSON body carries `id`, `api_version` (`webhook/v1`) and `kind`
 * (e.g. `News/v1`, `Earnings/v1`).
 */
export const BenzingaWebhookPayloadSchema = z
	.object({
		id: z.string(),
		api_version: z.string(),
		kind: z.string(),
		data: z.record(z.string(), z.unknown()),
	})
	.loose();

export type BenzingaWebhookPayload = z.infer<
	typeof BenzingaWebhookPayloadSchema
>;

export type BenzingaWebhookOutputs = {
	data: BenzingaWebhookPayload;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
			// `parsed` is `unknown` because JSON.parse returns untyped data;
			// the object check below justifies treating it as a record.
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

function readHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const direct = headers[name];
	if (typeof direct === 'string') return direct;
	if (Array.isArray(direct)) return direct[0];
	const lowered = headers[name.toLowerCase()];
	if (typeof lowered === 'string') return lowered;
	if (Array.isArray(lowered)) return lowered[0];
	return undefined;
}

/**
 * Benzinga signs every delivery with HMAC-SHA256 over the raw request body
 * bytes using the webhook API key as secret, sent as
 * `X-Bz-Signature: sha256=<hex digest>`.
 * https://docs.benzinga.com/webhook-reference/overview
 */
export function computeBenzingaSignature(
	rawBody: string,
	secret: string,
): string {
	return createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
}

export function verifyBenzingaWebhookSignature(
	request: WebhookRequest<BenzingaWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}
	if (request.hubVerified === true) {
		return { valid: true };
	}
	const signatureHeader = readHeader(request.headers, 'X-Bz-Signature');
	if (!signatureHeader) {
		return { valid: false, error: 'Missing X-Bz-Signature header' };
	}
	const received = signatureHeader.startsWith('sha256=')
		? signatureHeader.slice('sha256='.length)
		: signatureHeader;
	const rawBody = request.rawBody ?? JSON.stringify(request.payload ?? {});
	const expected = computeBenzingaSignature(rawBody, secret);
	const receivedBuffer = Buffer.from(received, 'utf8');
	const expectedBuffer = Buffer.from(expected, 'utf8');
	if (
		receivedBuffer.length !== expectedBuffer.length ||
		!timingSafeEqual(receivedBuffer, expectedBuffer)
	) {
		return { valid: false, error: 'Signature verification failed' };
	}
	return { valid: true };
}

export function createBenzingaMatch(kind: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const deliveryId =
			readHeader(request.headers, 'X-BZ-Delivery') ??
			readHeader(request.headers, 'X-Bz-Signature');
		if (!deliveryId) return false;
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.kind === kind;
	};
}

export function matchBenzingaDataWebhook(request: RawWebhookRequest): boolean {
	const deliveryId =
		readHeader(request.headers, 'X-BZ-Delivery') ??
		readHeader(request.headers, 'X-Bz-Signature');
	if (!deliveryId) return false;
	const parsedBody = parseBody(request.body);
	if (parsedBody === null) return false;
	return (
		typeof parsedBody.id === 'string' &&
		typeof parsedBody.kind === 'string' &&
		parsedBody.data !== undefined
	);
}
