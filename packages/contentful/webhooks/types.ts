import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';

export const ContentfulWebhookPayloadSchema = z
	.object({
		sys: z
			.object({
				type: z.string(),
				id: z.string(),
				space: z
					.object({
						sys: z.object({ id: z.string() }).passthrough(),
					})
					.passthrough()
					.optional(),
				environment: z
					.object({
						sys: z.object({ id: z.string() }).passthrough(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	})
	.passthrough();

export type ContentfulWebhookPayload = z.infer<
	typeof ContentfulWebhookPayloadSchema
>;

export type ContentfulWebhookOutputs = {
	entryPublish: ContentfulWebhookPayload;
	entryUnpublish: ContentfulWebhookPayload;
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

export function createContentfulMatch(topic: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headerTopic = request.headers['x-contentful-topic'];
		if (headerTopic && typeof headerTopic === 'string') {
			return headerTopic === topic;
		}
		return false;
	};
}

export function verifyContentfulWebhookSignature(
	request: WebhookRequest<ContentfulWebhookPayload>,
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

	const header = request.headers['x-contentful-signature'];
	const signatureHeader = Array.isArray(header) ? header[0] : header;

	if (!signatureHeader || typeof signatureHeader !== 'string') {
		return { valid: false, error: 'Missing x-contentful-signature header' };
	}

	try {
		const hmac = createHmac('sha256', secret);
		hmac.update(rawBody);
		const expectedSignature = hmac.digest('base64');

		const signatureBuffer = Buffer.from(signatureHeader, 'utf8');
		const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

		if (
			signatureBuffer.length === expectedBuffer.length &&
			timingSafeEqual(signatureBuffer, expectedBuffer)
		) {
			return { valid: true };
		}

		return { valid: false, error: 'Invalid webhook signature' };
	} catch (e) {
		return { valid: false, error: 'Error computing signature' };
	}
}
