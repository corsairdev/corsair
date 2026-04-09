import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base webhook payload schema
 *
 * CONFIGURATION:
 * Update this to match your provider's webhook payload structure.
 * Most providers include a 'type' field and 'data' field, but the structure may vary.
 */
export const SpotifyWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.unknown()),
});
export type SpotifyWebhookPayload = z.infer<typeof SpotifyWebhookPayloadSchema>;

/**
 * Webhook Event Schemas
 *
 * CONFIGURATION:
 * - Replace ExampleEvent with your actual webhook event types
 * - Each event type should extend SpotifyWebhookPayload
 * - Add all event-specific fields in the data object
 *
 * Example:
 * export const UserCreatedEventSchema = SpotifyWebhookPayloadSchema.extend({
 *   type: z.literal('user.created'),
 *   data: z.object({
 *     user_id: z.string(),
 *     email: z.string(),
 *     name: z.string(),
 *   }),
 * });
 * export type UserCreatedEvent = z.infer<typeof UserCreatedEventSchema>;
 */
export const ExampleEventSchema = SpotifyWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
			// TODO: Add your event data fields here
		})
		.catchall(z.unknown()),
});
export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

/**
 * Webhook Outputs Type
 *
 * Maps each webhook key to its event type.
 * This is used by the plugin system for type inference.
 *
 * CONFIGURATION:
 * - Replace 'example' with your actual webhook keys
 * - Add all your webhooks here
 * - Each key should match a webhook in your webhooks/ directory
 */
export type SpotifyWebhookOutputs = {
	example: ExampleEvent;
	// TODO: Add more webhooks as you implement them
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

/**
 * Creates a matcher function for a specific event type
 *
 * CONFIGURATION:
 * This function is used to match incoming webhooks to the correct handler.
 * Most providers use a 'type' field, but you may need to customize this.
 */
export function createSpotifyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return typeof parsedBody.type === 'string' && parsedBody.type === eventType;
	};
}

/**
 * Webhook Signature Verification
 *
 * WEBHOOK CONFIGURATION:
 * Implement signature verification based on your provider's method.
 */
export function verifySpotifyWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const signatureHeader = request.headers['x-spotify-signature'];
	const signature =
		typeof signatureHeader === 'string'
			? signatureHeader
			: Array.isArray(signatureHeader)
				? signatureHeader[0]
				: undefined;

	if (!signature) {
		return { valid: false, error: 'Missing signature header' };
	}

	const payloadString =
		request.rawBody ||
		(typeof request.payload === 'string'
			? request.payload
			: JSON.stringify(request.payload));

	try {
		const crypto = require('crypto');
		const expectedSignature = crypto
			.createHmac('sha256', secret)
			.update(payloadString)
			.digest('hex');

		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);

		return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
	} catch (error) {
		return { valid: false, error: 'Signature verification failed' };
	}
}
