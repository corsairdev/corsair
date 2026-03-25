import { logEventFromContext } from '../../utils/events';
import type { YoutubeWebhooks } from '..';
import { NewPlaylistItemEventSchema } from './types';

export const newPlaylistItem: YoutubeWebhooks['newPlaylistItem'] = {
	match: (request) => {
		// Matched by checking for the 'item' field characteristic of playlist item poll events
		// body is typed as unknown here because it can be raw string or pre-parsed object
		const body = request.body;
		if (typeof body === 'string') {
			try {
				// body arrives as raw string when not pre-parsed by middleware
				const parsed = JSON.parse(body) as Record<string, unknown>;
				return 'item' in parsed && !('activity' in parsed) && !('playlist' in parsed) && !('subscription' in parsed);
			} catch {
				return false;
			}
		}
		if (body && typeof body === 'object') {
			const obj = body as Record<string, unknown>;
			return 'item' in obj && !('activity' in obj) && !('playlist' in obj) && !('subscription' in obj);
		}
		return false;
	},

	handler: async (ctx, request) => {
		const event = request.payload;
		const parsed = NewPlaylistItemEventSchema.safeParse(event);

		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid playlist item event payload',
			};
		}

		const { item } = parsed.data;

		if (item.id && ctx.db.playlistItems) {
			try {
				await ctx.db.playlistItems.upsertByEntityId(item.id, {
					id: item.id,
					playlistId: item.snippet?.playlistId,
					videoId: item.snippet?.resourceId?.videoId ?? item.contentDetails?.videoId,
					title: item.snippet?.title,
					description: item.snippet?.description,
					position: item.snippet?.position,
					publishedAt: item.snippet?.publishedAt,
					channelId: item.snippet?.channelId,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save playlist item to database:', error);
			}
		}

		await logEventFromContext(ctx, 'youtube.webhook.newPlaylistItem', { itemId: item.id }, 'completed');

		return {
			success: true,
			data: parsed.data,
		};
	},
};
