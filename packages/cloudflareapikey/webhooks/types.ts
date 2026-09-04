import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export const CloudflareApiKeyWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type CloudflareApiKeyWebhookPayload = z.infer<
	typeof CloudflareApiKeyWebhookPayloadSchema
>;

export const ExampleEventSchema = CloudflareApiKeyWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type CloudflareApiKeyWebhookOutputs = {
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

export function createCloudflareApiKeyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyCloudflareApiKeyWebhookSignature(
	request: WebhookRequest<CloudflareApiKeyWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) return { valid: true };
	if (!secret) return { valid: false, error: 'Webhook secret is not configured' };

	const rawBody = request.rawBody;
	if (rawBody == null) return { valid: false, error: 'Missing raw body for signature verification' };

	const header = request.headers['webhook-signature'] ?? request.headers['cf-webhook-auth'];
	const signatureHeader = Array.isArray(header) ? header[0] : header;
	if (!signatureHeader) return { valid: false, error: 'Missing webhook signature header' };

	const expected = createHmac('sha256', secret).update(rawBody).digest();
	const candidates = signatureHeader
		.split(/[ ,]/)
		.map((value) => value.replace(/^v1=/, '').trim())
		.filter(Boolean)
		.flatMap((value) => {
			const values = [value];
			try {
				values.push(Buffer.from(value, 'hex').toString('base64'));
			} catch {
				// Keep the original candidate for comparison below.
			}
			return values;
		});

	for (const candidate of candidates) {
		for (const encoded of [candidate, Buffer.from(candidate, 'base64').toString('hex')]) {
			const actual = Buffer.from(encoded, 'hex');
			if (actual.length === expected.length && timingSafeEqual(actual, expected)) {
				return { valid: true };
			}
		}
	}

	return { valid: false, error: 'Invalid webhook signature' };
}
