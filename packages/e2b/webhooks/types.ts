import { z } from 'zod';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';

// Base webhook payload — TODO: update to match actual E2b webhook shape
export const E2bWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.unknown()),
});
export type E2bWebhookPayload = z.infer<typeof E2bWebhookPayloadSchema>;

// TODO: Add event-specific schemas here.
// Example:
// export const SomeEventSchema = z.object({
// 	type: z.literal('some.event'),
// 	created_at: z.string(),
// 	data: z.object({ id: z.string() }).catchall(z.unknown()),
// });
// export type SomeEvent = z.infer<typeof SomeEventSchema>;

export type E2bWebhookOutputs = {
	// TODO: Add webhook event output types here once you know the event types
	// example: someEvent: SomeEvent;
};

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createE2bEventMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body) as Record<string, unknown>;
		return typeof parsed.type === 'string' && parsed.type === eventType;
	};
}

export function verifyE2bWebhookSignature(
	request: WebhookRequest<E2bWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement actual webhook signature verification.
	// Check the E2b docs for the signing algorithm and header name.
	// Common patterns:
	//   HMAC-SHA256: verifyHmacSignature(rawBody, secret, signature)
	//   Svix: verifyHmacSignatureWithPrefix(rawBody, secret, signature, 'sha256=')
	if (!secret) return { valid: false, error: 'No webhook secret configured' };
	return { valid: true };
}
