import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import * as crypto from 'node:crypto';
import { z } from 'zod';

export const AeroleadsWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type AeroleadsWebhookPayload = z.infer<
	typeof AeroleadsWebhookPayloadSchema
>;

export const ExampleEventSchema = AeroleadsWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type AeroleadsWebhookOutputs = {
	example: ExampleEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
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

export function createAeroleadsMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyAeroleadsWebhookSignature(
	request: WebhookRequest<AeroleadsWebhookPayload>,
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
	const headerValue = Array.isArray(headers['x-aeroleads-signature'])
		? headers['x-aeroleads-signature'][0]
		: headers['x-aeroleads-signature'];

	if (!headerValue) {
		return {
			valid: false,
			error: 'Missing x-aeroleads-signature header',
		};
	}

	// TODO(provider-doc-needed): Confirm the exact signature format with
	// AeroLeads' public docs. The current implementation assumes HMAC-SHA256
	// over the raw request body, with the signature transmitted as either a
	// raw hex digest or `sha256=<hex>`. AeroLeads did not publish a public
	// signing spec at scaffold time, so this is the conventional default and
	// must be verified before production traffic.
	const expectedHex = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');

	const providedHex = String(headerValue)
		.toLowerCase()
		.replace(/^sha256=/, '')
		.trim();

	// timingSafeEqual requires equal-length buffers; short-circuit on length
	// mismatch before comparing to avoid throwing inside the try block.
	if (providedHex.length !== expectedHex.length) {
		return { valid: false, error: 'Invalid signature' };
	}

	try {
		const isValid = crypto.timingSafeEqual(
			Buffer.from(providedHex, 'hex'),
			Buffer.from(expectedHex, 'hex'),
		);
		return isValid ? { valid: true } : { valid: false, error: 'Invalid signature' };
	} catch {
		return { valid: false, error: 'Invalid signature' };
	}
}
