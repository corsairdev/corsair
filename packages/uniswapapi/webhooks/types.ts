import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// Uniswap Trading API does not support webhooks.
// Swap/order status is polled via GET /v1/swap_status and /v1/order_status.
// These stubs satisfy the plugin interface.

export const UniswapApiWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type UniswapApiWebhookPayload = z.infer<
	typeof UniswapApiWebhookPayloadSchema
>;

export type UniswapApiWebhookOutputs = Record<string, never>;

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

export function createUniswapApiMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyUniswapApiWebhookSignature(
	request: WebhookRequest<UniswapApiWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// No-op: Uniswap Trading API does not use webhooks
	return { valid: true };
}
