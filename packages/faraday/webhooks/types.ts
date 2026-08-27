import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const FaradayWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type FaradayWebhookPayload = z.infer<
	typeof FaradayWebhookPayloadSchema
>;

export const ExampleEventSchema = FaradayWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type FaradayWebhookOutputs = {
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

export function createFaradayMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

import * as crypto from 'crypto';

export function verifyFaradayWebhookSignature(
	request: WebhookRequest<FaradayWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified) {
		return { valid: true };
	}

	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const signatureHeader = request.headers['x-faraday-signature'];
	const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

	if (!signature || typeof signature !== 'string') {
		return { valid: false, error: 'Missing x-faraday-signature header' };
	}

	if (!request.rawBody) {
		return { valid: false, error: 'Missing raw request body' };
	}

	try {
		const hmac = crypto.createHmac('sha256', secret);
		hmac.update(request.rawBody, 'utf8');
		const expectedSignature = hmac.digest('hex');

		let actualSignature = signature;
		if (actualSignature.startsWith('sha256=')) {
			actualSignature = actualSignature.slice(7);
		} else if (actualSignature.startsWith('v1=')) {
			actualSignature = actualSignature.slice(3);
		}

		const actualBuffer = Buffer.from(actualSignature, 'hex');
		const expectedBuffer = Buffer.from(expectedSignature, 'hex');

		if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
			return { valid: false, error: 'Invalid webhook signature' };
		}

		return { valid: true };
	} catch (err) {
		return { valid: false, error: 'Signature verification error' };
	}
}
