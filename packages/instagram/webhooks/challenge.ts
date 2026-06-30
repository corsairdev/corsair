import { logEventFromContext } from 'corsair/core';
import type { InstagramWebhooks } from '../index';
import {
	createInstagramWebhookMatcher,
	extractMetaWebhookChallenge,
	InstagramUrlVerificationEventSchema,
} from './types';

export const url_verification: InstagramWebhooks['url_verification'] = {
	match: createInstagramWebhookMatcher('url_verification'),
	handler: async (ctx, request) => {
		const challengeRequest = extractMetaWebhookChallenge({
			query: request.query,
			body: request.payload,
		});

		if (!challengeRequest) {
			return {
				success: false,
				data: undefined,
			};
		}

		const expectedVerifyToken = ctx.options.webhookVerifyToken;
		if (
			!expectedVerifyToken ||
			challengeRequest.verifyToken !== expectedVerifyToken
		) {
			return {
				success: false,
				error: 'Invalid verification token',
			};
		}

		const event = InstagramUrlVerificationEventSchema.parse({
			type: 'url_verification',
			challenge: challengeRequest.challenge,
		});

		await logEventFromContext(
			ctx,
			'instagram.webhook.url_verification',
			{ mode: challengeRequest.mode },
			'completed',
		);

		return {
			success: true,
			returnToSender: {
				validationToken: challengeRequest.challenge,
			},
			responseHeaders: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
			data: event,
		};
	},
};
