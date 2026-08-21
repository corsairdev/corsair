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

		let existingSecret: string | undefined;
		try {
			existingSecret = (await ctx.keys.get_webhook_signature()) ?? undefined;
		} catch (error) {
			console.warn(
				'[corsair:zohomail] Failed to retrieve existing webhook secret:',
				error,
			);
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to retrieve existing webhook secret',
			};
		}

		if (existingSecret === hookSecret) {
			return {
				success: true,
				data: { hookSecret },
			};
		}

		const signature = getZohoWebhookSignature(headers);

		if (existingSecret) {
			if (!signature) {
				return {
					success: false,
					statusCode: 401,
					error: 'Cannot overwrite existing secret without a valid signature',
				};
			}
			const rawBody = request.rawBody;
			if (!rawBody) {
				return {
					success: false,
					statusCode: 401,
					error: 'Missing raw body for signature verification',
				};
			}
			if (!verifyZohoWebhookSignature(rawBody, existingSecret, signature)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid signature',
				};
			}
		} else {
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
		}

		try {
			await ctx.keys.set_webhook_signature(hookSecret);
		} catch (error) {
			console.warn(
				'[corsair:zohomail] Failed to persist webhook secret:',
				error,
			);
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to persist webhook secret',
			};
		}

		return {
			success: true,
			data: { hookSecret },
		};
	},
};
