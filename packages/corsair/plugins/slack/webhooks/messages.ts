import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import { createSlackEventMatch } from './types';

export const message: SlackWebhooks['message'] = {
	match: createSlackEventMatch('message'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'message') {
			return {
				success: true,
				data: undefined,
			};
		}

		if (ctx.db.messages && event.ts) {
			try {
				await ctx.db.messages.upsert(event.ts, {
					...event,
					id: event.ts,
					authorId: 'user' in event ? event.user : undefined,
					createdAt: event.ts
						? new Date(parseFloat(event.ts) * 1000)
						: new Date(),
				});
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
			data: event,
		};
	},
};
