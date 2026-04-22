import { logEventFromContext } from 'corsair/core';
import type { SpotifyWebhooks } from '../index';
import { createSpotifyMatch, verifySpotifyWebhookSignature } from './types';

export const example: SpotifyWebhooks['example'] = {
	match: createSpotifyMatch('example'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySpotifyWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'example') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📦 Spotify Example Event:', {
			id: event.data.id,
		});

		await logEventFromContext(
			ctx,
			'spotify.webhook.example',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
