import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
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
	data: z.record(z.string(), z.unknown()),
});
export type SpotifyWebhookPayload = z.infer<typeof SpotifyWebhookPayloadSchema>;

/**
 * Spotify does not offer a public webhook API, so no webhook handlers are
 * registered. See https://github.com/spotify/web-api/issues/538
 */
export type SpotifyWebhookOutputs = Record<string, never>;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

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
		return { valid: false, error: 'Missing webhook secret' };
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
