import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import type { ChannelCreatedEvent } from './types';
import { createSlackEventMatch } from './types';

export const created: SlackWebhooks['channelCreated'] = {
	match: createSlackEventMatch('channel_created'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'channel_created') {
			return {
				success: true,
				data: event as unknown as ChannelCreatedEvent,
			};
		}

		const channelEvent = event as ChannelCreatedEvent;

		console.log('📢 Slack Channel Created Event:', {
			id: channelEvent.channel.id,
			name: channelEvent.channel.name,
			creator: channelEvent.channel.creator,
		});

		if (ctx.db.channels && channelEvent.channel.id) {
			try {
				await ctx.db.channels.upsert(channelEvent.channel.id, {
					...channelEvent.channel,
					name_normalized: channelEvent.channel.name?.toLowerCase(),
					is_channel: true,
					is_group: false,
					is_im: false,
					is_mpim: false,
					is_archived: false,
					is_general: false,
					createdAt: channelEvent.channel.created
						? new Date(channelEvent.channel.created * 1000)
						: new Date(),
					is_member: false,
				});
			} catch (error) {
				console.warn('Failed to save channel to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.channelCreated',
			{ ...channelEvent },
			'completed',
		);

		return {
			success: true,
			data: channelEvent,
		};
	},
};
