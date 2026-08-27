import type { SlackbotWebhooks } from '../index';
import { matchUrlVerification, verifySlackbotWebhookSignature } from './types';

export const challenge: SlackbotWebhooks['challenge'] = {
	match: matchUrlVerification,

	handler: async (ctx, request) => {
		const verification = verifySlackbotWebhookSignature(
			request,
			ctx.options?.signingSecret ?? ctx.key,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

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
