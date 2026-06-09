import type { ZohoMailWebhooks } from '../index';
import {
	getZohoWebhookSecretFromRequest,
	getZohoWebhookSignature,
} from './types';

/**
 * Zoho sends the webhook signing secret in `x-hook-secret` on the first POST
 * when an outgoing webhook is saved. A 200 response is required for Zoho to
 * persist the subscription; subsequent deliveries are signed with
 * `x-hook-signature` only.
 */
export const handshake: ZohoMailWebhooks['handshake'] = {
	match: (request) => {
		const headers = request.headers ?? {};
		return (
			getZohoWebhookSecretFromRequest(headers) !== undefined &&
			getZohoWebhookSignature(headers) === undefined
		);
	},

	handler: async (ctx, request) => {
		const hookSecret = getZohoWebhookSecretFromRequest(
			request.headers ?? {},
		);
		if (!hookSecret) {
			return {
				success: false,
				statusCode: 400,
				error: 'Missing x-hook-secret header',
			};
		}

		try {
			await ctx.keys.set_webhook_signature(hookSecret);
		} catch (error) {
			console.warn(
				'[corsair:zohomail] Failed to persist webhook secret:',
				error,
			);
		}

		return {
			success: true,
			data: { hookSecret },
		};
	},
};
