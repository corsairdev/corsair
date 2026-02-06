import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import { createSlackEventMatch, verifySlackWebhookSignature } from './types';

export const message: SlackWebhooks['message'] = {
	match: createSlackEventMatch('message'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifySlackWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event?.type !== 'message') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.messages && event.ts) {
			try {
				const entity = await ctx.db.messages.upsertByEntityId(event.ts, {
					...event,
					id: event.ts,
					authorId: 'user' in event ? event.user : undefined,
					createdAt: event.ts
						? new Date(parseFloat(event.ts) * 1000)
						: new Date(),
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.message',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
