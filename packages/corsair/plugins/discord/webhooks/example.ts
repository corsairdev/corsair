import { logEventFromContext } from '../../utils/events';
import type { DiscordWebhooks } from '..';
import { createDiscordMatch, verifyDiscordWebhookSignature } from './types';

export const example: DiscordWebhooks['example'] = {
	match: createDiscordMatch('example'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyDiscordWebhookSignature(request, webhookSecret);
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

		console.log('📦 Discord Example Event:', {
			id: event.data.id,
		});

		await logEventFromContext(
			ctx,
			'discord.webhook.example',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
