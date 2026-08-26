import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import * as crypto from 'crypto';
import { z } from 'zod';

export const BrandfetchWebhookPayloadSchema = z.object({
	type: z.string(),
	timestamp: z.string(),
	urn: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type BrandfetchWebhookPayload = z.infer<
	typeof BrandfetchWebhookPayloadSchema
>;

export const ExampleEventSchema = BrandfetchWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type BrandfetchWebhookOutputs = {
	example: ExampleEvent;
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

export function createBrandfetchMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyBrandfetchWebhookSignature(
	request: WebhookRequest<BrandfetchWebhookPayload>,
	secret: string,
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

	const readHeader = (name: string): string | undefined => {
		const normalizedName = name.toLowerCase();
		const header = Object.entries(headers).find(
			([key]) => key.toLowerCase() === normalizedName,
		);
		if (!header) return undefined;
		const [, value] = header;
		return Array.isArray(value) ? value[0] : value;
	};

	const webhookId = readHeader('webhook-id');
	const webhookTimestamp = readHeader('webhook-timestamp');
	const signatureHeader = readHeader('webhook-signature');
	const signatureAlgorithm = readHeader('webhook-signature-algorithm');

	if (!webhookId) {
		return { valid: false, error: 'Missing webhook-id header' };
	}

	if (!webhookTimestamp) {
		return { valid: false, error: 'Missing webhook-timestamp header' };
	}

	if (!signatureHeader) {
		return { valid: false, error: 'Missing webhook-signature header' };
	}

	if (!signatureAlgorithm) {
		return {
			valid: false,
			error: 'Missing webhook-signature-algorithm header',
		};
	}

	const normalizedAlgorithm = signatureAlgorithm.toLowerCase();
	if (
		normalizedAlgorithm !== 'sha256' &&
		normalizedAlgorithm !== 'hmac-sha256'
	) {
		return { valid: false, error: 'Unsupported webhook signature algorithm' };
	}

	const WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000;
	const parsedTimestamp = Number.parseInt(webhookTimestamp, 10);
	const timestampMs =
		parsedTimestamp < 10_000_000_000 ? parsedTimestamp * 1000 : parsedTimestamp;
	if (
		Number.isNaN(timestampMs) ||
		Math.abs(Date.now() - timestampMs) > WEBHOOK_TOLERANCE_MS
	) {
		return { valid: false, error: 'Webhook timestamp out of tolerance window' };
	}

	// webhook-signature header format: space-separated "v1,<hex>" entries.
	const signatures = signatureHeader
		.split(' ')
		.map((part) => part.trim())
		.filter(Boolean)
		.flatMap((part) => {
			const [version, signature] = part.split(',', 2);
			if (!signature) return [];
			return version === 'v1' && /^[a-f0-9]{64}$/i.test(signature)
				? [signature]
				: [];
		});
	if (signatures.length === 0) {
		return { valid: false, error: 'Malformed webhook-signature header' };
	}

	const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
	const expected = crypto
		.createHmac('sha256', secret)
		.update(signedContent)
		.digest('hex');

	const isValid = signatures.some((signature) => {
		const received = Buffer.from(signature, 'hex');
		const expectedBuffer = Buffer.from(expected, 'hex');
		return (
			received.length === expectedBuffer.length &&
			crypto.timingSafeEqual(received, expectedBuffer)
		);
	});

	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
