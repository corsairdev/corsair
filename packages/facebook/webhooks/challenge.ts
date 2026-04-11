import type { FacebookWebhooks } from '..';
import {
	createFacebookChallengeMatch,
	extractFacebookChallenge,
} from './types';

export const challenge: FacebookWebhooks['challenge'] = {
	match: createFacebookChallengeMatch(),

	handler: async (ctx, request) => {
		const challengePayload = extractFacebookChallenge(request.payload);
		if (!challengePayload) {
			return {
				success: false,
				error: 'Missing Facebook webhook challenge payload',
			};
		}

		// Payload type is not inferred narrowly enough to expose the optional hub verify-token fields on the parsed webhook request.
		const body = request.payload as {
			['hub.verify_token']?: string;
			hub?: { verify_token?: string };
		};

		const providedVerifyToken =
			body['hub.verify_token'] ?? body.hub?.verify_token;
		const configuredVerifyToken =
			ctx.options.webhookVerifyToken ??
			(await ctx.keys.get_webhook_signature());

		if (
			configuredVerifyToken &&
			providedVerifyToken !== configuredVerifyToken
		) {
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
