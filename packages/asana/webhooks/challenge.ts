import crypto from 'crypto';
import type { AsanaWebhooks } from '../index';

// ── Asana Webhook Challenge ───────────────────────────────────────────────────
// Asana sends a POST with X-Hook-Secret header and empty body {} when a webhook
// is first registered. The server must respond with the same X-Hook-Secret value
// echoed back as a response header.
//
// This handler places the secret in returnToSender['X-Hook-Secret'].
// The consuming application MUST read this value and set it as the
// X-Hook-Secret HTTP response header (not in the body).
//
// This endpoint is unauthenticated — anything that can reach the webhook URL can
// send an X-Hook-Secret header. A secret is therefore only persisted when the
// account has none stored yet; otherwise an attacker could install a signing key
// they control and forge events the other Asana handlers would accept.
//
// Once configured, a secret is never replaced, including for a legitimate
// re-registration: Corsair stores one webhook_signature per account while Asana
// issues one per webhook, so there is no safe way to rotate here. Rotation needs
// per-webhook secret storage in core.

/** Constant-time compare. Length may short-circuit; length is not sensitive. */
function secretsMatch(a: string, b: string): boolean {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) {
		return false;
	}
	return crypto.timingSafeEqual(aBuf, bBuf);
}

export const challenge: AsanaWebhooks['challenge'] = {
	match: (request) => {
		return (
			'x-hook-secret' in request.headers &&
			typeof request.headers['x-hook-secret'] === 'string'
		);
	},

	handler: async (ctx, request) => {
		const hookSecret = request.headers['x-hook-secret'];
		if (!hookSecret || typeof hookSecret !== 'string') {
			return {
				success: false,
				statusCode: 400,
				error: 'Missing X-Hook-Secret header',
			};
		}

		const storedSecret = await ctx.keys.get_webhook_signature();

		if (storedSecret) {
			// Asana retries the handshake if it does not get a timely 200, so the
			// same secret arriving again is legitimate — echo it back without
			// rewriting storage. A different value belongs to no handshake Corsair
			// started, so refuse it and do not echo the sender's value back.
			if (!secretsMatch(storedSecret, hookSecret)) {
				// Logged so operators can tell an attack from a blocked
				// re-registration; both land here.
				console.warn(
					'[corsair:asana] Rejected X-Hook-Secret for an account that already has one configured',
				);
				return {
					success: false,
					statusCode: 401,
					error: 'Webhook signing secret is already configured',
				};
			}

			return {
				success: true,
				responseHeaders: {
					'X-Hook-Secret': storedSecret,
				},
				data: { hookSecret: storedSecret },
			};
		}

		try {
			await ctx.keys.set_webhook_signature(hookSecret);
		} catch (error) {
			// Echoing a secret we failed to store would leave Asana signing events
			// with a key this account cannot verify.
			console.warn(
				'[corsair:asana] Failed to persist webhook secret:',
				error instanceof Error ? error.message : String(error),
			);
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to persist webhook secret',
			};
		}

		return {
			success: true,
			// Asana requires X-Hook-Secret echoed back as a response header, not in the body.
			responseHeaders: {
				'X-Hook-Secret': hookSecret,
			},
			data: { hookSecret },
		};
	},
};
