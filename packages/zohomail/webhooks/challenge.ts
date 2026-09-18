import crypto from 'node:crypto';
import type { ZohoMailWebhooks } from '../index';
import {
	createZohoMailHandshakeMatch,
	getZohoWebhookSecretFromRequest,
	getZohoWebhookSignature,
	verifyZohoWebhookSignature,
} from './types';

function secretsMatch(a: string, b: string): boolean {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) {
		return false;
	}
	return crypto.timingSafeEqual(aBuf, bBuf);
}

let handshakeClaim: Promise<void> = Promise.resolve();

function withHandshakeClaim<T>(fn: () => Promise<T>): Promise<T> {
	const run = handshakeClaim.then(fn, fn);
	handshakeClaim = run.then(
		() => undefined,
		() => undefined,
	);
	return run;
}

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

		return withHandshakeClaim(async () => {
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

			if (existingSecret && secretsMatch(existingSecret, hookSecret)) {
				return {
					success: true,
					data: { hookSecret },
				};
			}

			const signature = getZohoWebhookSignature(headers);
			const rawBody = request.rawBody;

			if (!signature) {
				return {
					success: false,
					statusCode: 401,
					error: existingSecret
						? 'Cannot overwrite existing secret without a valid signature'
						: 'Cannot persist a new secret without a valid signature',
				};
			}
			if (!rawBody) {
				return {
					success: false,
					statusCode: 401,
					error: 'Missing raw body for signature verification',
				};
			}

			const verifySecret = existingSecret ?? hookSecret;
			if (!verifyZohoWebhookSignature(rawBody, verifySecret, signature)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid signature',
				};
			}

			if (!existingSecret) {
				let claimedSecret: string | undefined;
				try {
					claimedSecret = (await ctx.keys.get_webhook_signature()) ?? undefined;
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
				if (claimedSecret) {
					if (secretsMatch(claimedSecret, hookSecret)) {
						return {
							success: true,
							data: { hookSecret },
						};
					}
					return {
						success: false,
						statusCode: 401,
						error: 'Cannot overwrite existing secret without a valid signature',
					};
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

			try {
				const storedSecret =
					(await ctx.keys.get_webhook_signature()) ?? undefined;
				if (!storedSecret || !secretsMatch(storedSecret, hookSecret)) {
					return {
						success: false,
						statusCode: 401,
						error: 'Cannot overwrite existing secret without a valid signature',
					};
				}
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

			return {
				success: true,
				data: { hookSecret },
			};
		});
	},
};
