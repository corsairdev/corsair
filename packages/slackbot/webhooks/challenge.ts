import type { SlackbotWebhooks } from '../index';
import { matchUrlVerification } from './types';

/**
 * Answers Slack's one-time URL verification handshake.
 *
 * This is not a subscribable event: Slack POSTs it when the Events API request
 * URL is first saved and refuses to enable the endpoint unless the `challenge`
 * value is echoed back. It is deliberately exempt from signature verification —
 * the handshake is what establishes the endpoint, and the payload carries no
 * workspace data.
 */
export const challenge: SlackbotWebhooks['challenge'] = {
	match: matchUrlVerification,

	handler: async (_ctx, request) => {
		const payload = request.payload as { challenge?: string };

		if (!payload?.challenge) {
			return {
				success: false,
				statusCode: 400,
				error: 'url_verification payload carried no challenge',
			};
		}

		return {
			success: true,
			returnToSender: { challenge: payload.challenge },
			data: { type: 'url_verification' as const, challenge: payload.challenge },
		};
	},
};
