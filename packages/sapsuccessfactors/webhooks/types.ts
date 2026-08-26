import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// Base webhook payload — TODO: update to match actual Sapsuccessfactors webhook shape
export const SapsuccessfactorsWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});
export type SapsuccessfactorsWebhookPayload = z.infer<
	typeof SapsuccessfactorsWebhookPayloadSchema
>;

// TODO: Add event-specific schemas here.
// Example:
// export const SomeEventSchema = z.object({
// 	type: z.literal('some.event'),
// 	created_at: z.string(),
// 	data: z.object({ id: z.string() }).catchall(z.unknown()),
// });
// export type SomeEvent = z.infer<typeof SomeEventSchema>;

export type SapsuccessfactorsWebhookOutputs = {
	// TODO: Add webhook event output types here once you know the event types
	// example: someEvent: SomeEvent;
};

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createSapsuccessfactorsEventMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body) as Record<string, unknown>;
		return typeof parsed.type === 'string' && parsed.type === eventType;
	};
}

export function verifySapsuccessfactorsWebhookSignature(
	request: WebhookRequest<SapsuccessfactorsWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement actual webhook signature verification.
	// Check the Sapsuccessfactors docs for the signing algorithm and header name.
	// Common patterns:
	//   HMAC-SHA256: verifyHmacSignature(rawBody, secret, signature)
	//   Svix: verifyHmacSignatureWithPrefix(rawBody, secret, signature, 'sha256=')
	if (!secret) return { valid: false, error: 'No webhook secret configured' };
	return { valid: true };
}
