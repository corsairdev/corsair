import type { FacebookWebhooks } from '..';
import {
	createFacebookChallengeMatch,
	getFacebookHubFields,
	extractFacebookChallenge,
	parseFacebookWebhookBody,
} from './types';

export const challenge: FacebookWebhooks['challenge'] = {
	match: createFacebookChallengeMatch(),

	handler: async (ctx, request) => {
		const payload = parseFacebookWebhookBody(request.payload);
		const challengePayload = extractFacebookChallenge(payload);
		if (!challengePayload) {
			return {
				success: false,
				error: 'Missing Facebook webhook challenge payload',
			};
		}

		const { verifyToken: providedVerifyToken } = getFacebookHubFields(payload);
		const configuredVerifyToken =
			ctx.options.webhookVerifyToken ??
			(await ctx.keys.get_webhook_verify_token());

		if (!configuredVerifyToken) {
			return {
				success: false,
				statusCode: 500,
				error: 'Missing Facebook webhook verify token',
			};
		}

		if (providedVerifyToken !== configuredVerifyToken) {
			return {
				success: false,
				statusCode: 403,
				error: 'Invalid Facebook webhook verify token',
			};
		}

		return {
			success: true,
			returnToSender: challengePayload,
			data: challengePayload,
		};
	},
};
