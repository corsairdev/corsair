import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import { createSlackEventMatch } from './types';

export const created: SlackWebhooks['channelCreated'] = {
	match: createSlackEventMatch('channel_created'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'channel_created') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📢 Slack Channel Created Event:', {
			id: event.channel.id,
			name: event.channel.name,
			creator: event.channel.creator,
		});

		if (ctx.db.channels && event.channel.id) {
			try {
				await ctx.db.channels.upsert(event.channel.id, {
					...event.channel,
					createdAt: event.channel.created
						? new Date(event.channel.created * 1000)
						: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save channel to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.channelCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
