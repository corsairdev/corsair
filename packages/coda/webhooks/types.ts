import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const CodaWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type CodaWebhookPayload = z.infer<typeof CodaWebhookPayloadSchema>;

export const ExampleEventSchema = CodaWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type CodaWebhookOutputs = {
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

export function createCodaMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyCodaWebhookSignature(
	request: WebhookRequest<CodaWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No secret provided' };
	}

	const signature = request.headers['x-webhook-signature'];
	const normalizedSignature = Array.isArray(signature)
		? signature[0]
		: signature;

	if (!normalizedSignature) {
		return { valid: false, error: 'Missing x-webhook-signature header' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const isValid = verifyHmacSignature(
		rawBody,
		secret,
		normalizedSignature,
		'sha256',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
