import type { SlackWebhooks } from '..';
import { createSlackEventMatch, verifySlackWebhookSignature } from './types';

export const challenge: SlackWebhooks['challenge'] = {
	match: createSlackEventMatch('url_verification'),
	handler: async (ctx, request) => {
		const signingSecret = ctx.options?.signingSecret;
		const verification = verifySlackWebhookSignature(request, signingSecret);

		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		if (!('challenge' in request.payload) || !request.payload.challenge) {
			return {
				success: false,
				data: undefined,
			};
		}

		return {
			success: true,
			returnToSender: true,
			data: {
				challenge: request.payload.challenge,
				type: 'url_verification',
			},
		};
	},
};
