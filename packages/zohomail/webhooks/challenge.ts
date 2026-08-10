import type { ZohoMailWebhooks } from '../index';
import {
	createZohoMailHandshakeMatch,
	getZohoWebhookSecretFromRequest,
	getZohoWebhookSignature,
	verifyZohoWebhookSignature,
} from './types';

/**
 * Zoho delivers `x-hook-secret` on the first POST when an outgoing webhook is
 * saved. That value becomes the HMAC key for `x-hook-signature` on all
 * requests (including the first). A 200 is required for Zoho to persist the
 * subscription.
 *
 * The endpoint is unauthenticated, so the secret is only persisted when the
 * account has none stored yet; a different secret for an already-configured
 * account is refused rather than overwriting a signing key an attacker could
 * then forge events with.
 * @see https://www.zoho.com/mail/help/dev-platform/webhook.html#secure-webhooks
 */
export const handshake: ZohoMailWebhooks['handshake'] = {
	match: createZohoMailHandshakeMatch(),

	handler: async (ctx, request) => {
		const headers = request.headers ?? {};
		const hookSecret = getZohoWebhookSecretFromRequest(headers);
		if (!hookSecret) {
			return {
				success: false,
				statusCode: 400,
				error: 'Missing x-hook-secret header',
			};
		}

		try {
			await ctx.keys.set_webhook_signature_if_absent(hookSecret);
		} catch (error) {
			// The store throws this exact message only when a different secret is
			// already configured; refuse rather than overwrite a signing key an
			// attacker could then forge events with.
			if (
				error instanceof Error &&
				error.message === 'Webhook signature already configured'
			) {
				console.warn(
					'[corsair:zohomail] Rejected x-hook-secret for an account that already has one configured',
				);
				return {
					success: false,
					statusCode: 401,
					error: 'Webhook signing secret is already configured',
				};
			}
			console.warn(
				'[corsair:zohomail] Failed to persist webhook secret:',
				error instanceof Error ? error.message : String(error),
			);
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to persist webhook secret',
			};
		}

		const signature = getZohoWebhookSignature(headers);
		if (signature) {
			const rawBody = request.rawBody;
			if (!rawBody) {
				return {
					success: false,
					statusCode: 401,
					error: 'Missing raw body for signature verification',
				};
			}
			if (!verifyZohoWebhookSignature(rawBody, hookSecret, signature)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid signature',
				};
			}
		}

		return {
			success: true,
			data: { hookSecret },
		};
	},
};
