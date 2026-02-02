import type { SlackWebhooks } from '..';
import type {
	FileCreatedEvent,
	FilePublicEvent,
	FileSharedEvent,
} from './types';
import { createSlackEventMatch } from './types';

export const created: SlackWebhooks['fileCreated'] = {
	match: createSlackEventMatch('file_created'),

	handler: async (ctx, request) => {
		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event.type !== 'file_created') {
			return {
				success: true,
				data: event as unknown as FileCreatedEvent,
			};
		}

		const fileEvent = event as FileCreatedEvent;

		console.log('📄 Slack File Created Event:', {
			fileId: fileEvent.file_id,
			userId: fileEvent.user_id,
		});

		if (ctx.db.files && fileEvent.file_id) {
			try {
				await ctx.db.files.upsert(fileEvent.file_id, {
					id: fileEvent.file_id,
					user: fileEvent.user_id,
					created: parseFloat(fileEvent.event_ts),
					timestamp: parseFloat(fileEvent.event_ts),
				});
			} catch (error) {
				console.warn('Failed to save file to database:', error);
			}
		}

		return {
			success: true,
			data: fileEvent,
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
				data: event as unknown as FilePublicEvent,
			};
		}

		const fileEvent = event as FilePublicEvent;

		console.log('🌐 Slack File Public Event:', {
			fileId: fileEvent.file_id,
			userId: fileEvent.user_id,
		});

		if (ctx.db.files && fileEvent.file_id) {
			try {
				await ctx.db.files.upsert(fileEvent.file_id, {
					id: fileEvent.file_id,
					user: fileEvent.user_id,
				});
			} catch (error) {
				console.warn('Failed to update file in database:', error);
			}
		}

		return {
			success: true,
			data: fileEvent,
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
				data: event as unknown as FileSharedEvent,
			};
		}

		const fileEvent = event as FileSharedEvent;

		console.log('📎 Slack File Shared Event:', {
			fileId: fileEvent.file_id,
			userId: fileEvent.user_id,
			channelId: fileEvent.channel_id,
		});

		if (ctx.db.files && fileEvent.file_id) {
			try {
				await ctx.db.files.upsert(fileEvent.file_id, {
					id: fileEvent.file_id,
					user: fileEvent.user_id,
				});
			} catch (error) {
				console.warn('Failed to update file in database:', error);
			}
		}

		return {
			success: true,
			data: fileEvent,
		};
	},
};
