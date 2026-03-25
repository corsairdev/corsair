import { logEventFromContext } from '../../utils/events';
import type { YoutubeWebhooks } from '..';
import { NewPlaylistEventSchema } from './types';

export const newPlaylist: YoutubeWebhooks['newPlaylist'] = {
	match: (request) => {
		// Matched by checking for the 'playlist' field characteristic of new playlist poll events
		// body is typed as unknown here because it can be raw string or pre-parsed object
		const body = request.body;
		if (typeof body === 'string') {
			try {
				// body arrives as raw string when not pre-parsed by middleware
				const parsed = JSON.parse(body) as Record<string, unknown>;
				return 'playlist' in parsed;
			} catch {
				return false;
			}
		}
		if (body && typeof body === 'object') {
			return 'playlist' in (body as Record<string, unknown>);
		}
		return false;
	},

	handler: async (ctx, request) => {
		const event = request.payload;
		const parsed = NewPlaylistEventSchema.safeParse(event);

		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid playlist event payload',
			};
		}

		const { playlist } = parsed.data;

		if (playlist.id && ctx.db.playlists) {
			try {
				await ctx.db.playlists.upsertByEntityId(playlist.id, {
					id: playlist.id,
					title: playlist.snippet?.title,
					description: playlist.snippet?.description,
					channelId: playlist.snippet?.channelId,
					privacyStatus: playlist.status?.privacyStatus,
					itemCount: playlist.contentDetails?.itemCount,
					publishedAt: playlist.snippet?.publishedAt,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save playlist to database:', error);
			}
		}

		await logEventFromContext(ctx, 'youtube.webhook.newPlaylist', { playlistId: playlist.id }, 'completed');

		return {
			success: true,
			data: parsed.data,
		};
	},
};
