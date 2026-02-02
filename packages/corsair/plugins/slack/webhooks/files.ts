import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';

import { createSlackEventMatch } from './types';

export const created: SlackWebhooks['fileCreated'] = {
	match: createSlackEventMatch('file_created'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'file_created') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📄 Slack File Created Event:', {
			fileId: event.file_id,
			userId: event.user_id,
		});

		if (ctx.db.files && event.file_id) {
			try {
				await ctx.db.files.upsert(event.file_id, {
					id: event.file_id,
					user: event.user_id,
					created: parseFloat(event.event_ts),
					timestamp: parseFloat(event.event_ts),
				});
			} catch (error) {
				console.warn('Failed to save file to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.fileCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const publicFile: SlackWebhooks['filePublic'] = {
	match: createSlackEventMatch('file_public'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'file_public') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🌐 Slack File Public Event:', {
			fileId: event.file_id,
			userId: event.user_id,
		});

		if (ctx.db.files && event.file_id) {
			try {
				await ctx.db.files.upsert(event.file_id, {
					id: event.file_id,
					user: event.user_id,
				});
			} catch (error) {
				console.warn('Failed to update file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.filePublic',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const shared: SlackWebhooks['fileShared'] = {
	match: createSlackEventMatch('file_shared'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'file_shared') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📎 Slack File Shared Event:', {
			fileId: event.file_id,
			userId: event.user_id,
			channelId: event.channel_id,
		});

		if (ctx.db.files && event.file_id) {
			try {
				await ctx.db.files.upsert(event.file_id, {
					id: event.file_id,
					user: event.user_id,
				});
			} catch (error) {
				console.warn('Failed to update file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.fileShared',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
