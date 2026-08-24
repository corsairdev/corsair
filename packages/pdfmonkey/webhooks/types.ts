import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const PDFMonkeyWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type PDFMonkeyWebhookPayload = z.infer<
	typeof PDFMonkeyWebhookPayloadSchema
>;

export const ExampleEventSchema = PDFMonkeyWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type PDFMonkeyWebhookOutputs = {
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

export function createPDFMonkeyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyPDFMonkeyWebhookSignature(
	request: WebhookRequest<PDFMonkeyWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	const signature = request.headers['x-signature'];
	if (!signature) {
		return { valid: false, error: 'Missing signature header' };
	}
	// TODO: Implement proper HMAC-SHA256 signature verification using the secret
	// For now, reject since verification is not implemented
	return {
		valid: false,
		error: 'Webhook signature verification not implemented',
	};
}
