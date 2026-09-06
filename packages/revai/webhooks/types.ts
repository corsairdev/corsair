import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const RevAIWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type RevAIWebhookPayload = z.infer<typeof RevAIWebhookPayloadSchema>;

export const ExampleEventSchema = RevAIWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type RevAIWebhookOutputs = {
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

export function createRevAIMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyRevAIWebhookSignature(
	request: WebhookRequest<RevAIWebhookPayload> | RawWebhookRequest,
	secret: string,
): { valid: boolean; error?: string } {
	if ('hubVerified' in request && request.hubVerified) return { valid: true };
	let authHeader = request.headers['authorization'];
	if (Array.isArray(authHeader)) authHeader = authHeader[0];
	if (!authHeader || typeof authHeader !== 'string')
		return { valid: false, error: 'Missing Authorization header' };

	const token = authHeader.replace(/^Bearer\s+/i, '');
	if (token === secret) {
		return { valid: true };
	}
	return { valid: false, error: 'Invalid token' };
}
