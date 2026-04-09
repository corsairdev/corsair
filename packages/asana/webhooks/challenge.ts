import type { AsanaWebhooks } from '..';

// ── Asana Webhook Challenge ───────────────────────────────────────────────────
// Asana sends a POST with X-Hook-Secret header and empty body {} when a webhook
// is first registered. The server must respond with the same X-Hook-Secret value
// echoed back as a response header.
//
// This handler places the secret in returnToSender['X-Hook-Secret'].
// The consuming application MUST read this value and set it as the
// X-Hook-Secret HTTP response header (not in the body).

export const challenge: AsanaWebhooks['challenge'] = {
	match: (request) => {
		return (
			'x-hook-secret' in request.headers &&
			typeof request.headers['x-hook-secret'] === 'string'
		);
	},

	handler: async (_ctx, request) => {
		const hookSecret = request.headers['x-hook-secret'];
		if (!hookSecret || typeof hookSecret !== 'string') {
			return {
				success: false,
				error: 'Missing X-Hook-Secret header',
			};
		}

		_ctx.keys.set_webhook_signature(hookSecret);

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
