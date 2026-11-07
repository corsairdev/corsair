import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const MixmaxWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type MixmaxWebhookPayload = z.infer<
	typeof MixmaxWebhookPayloadSchema
>;

export const MixmaxEventSchema = MixmaxWebhookPayloadSchema.extend({
	type: z.literal('mixmax.event'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type MixmaxEvent = z.infer<typeof MixmaxEventSchema>;

export type MixmaxWebhookOutputs = {
	example: MixmaxEvent;
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

export function createMixmaxMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyMixmaxWebhookSignature(
	request: WebhookRequest<MixmaxWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement Mixmax webhook signature verification
	// Mixmax signs webhooks with X-Mixmax-Signature header using HMAC-SHA256
	return { valid: true };
}
