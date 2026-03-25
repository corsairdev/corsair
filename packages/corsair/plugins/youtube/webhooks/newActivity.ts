import { logEventFromContext } from '../../utils/events';
import type { YoutubeWebhooks } from '..';
import { NewActivityEventSchema } from './types';

export const newActivity: YoutubeWebhooks['newActivity'] = {
	match: (request) => {
		// YouTube polling triggers are matched by checking for the 'activity' field in the payload
		// body is typed as unknown here because it can be raw string or pre-parsed object
		const body = request.body;
		if (typeof body === 'string') {
			try {
				// body arrives as raw string when not pre-parsed by middleware
				const parsed = JSON.parse(body) as Record<string, unknown>;
				return 'activity' in parsed;
			} catch {
				return false;
			}
		}
		if (body && typeof body === 'object') {
			return 'activity' in (body as Record<string, unknown>);
		}
		return false;
	},

	handler: async (ctx, request) => {
		const event = request.payload;
		const parsed = NewActivityEventSchema.safeParse(event);

		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid activity event payload',
			};
		}

		const { activity } = parsed.data;

		if (activity.id && ctx.db.activities) {
			try {
				await ctx.db.activities.upsertByEntityId(activity.id, {
					id: activity.id,
					channelId: activity.snippet?.channelId,
					type: activity.snippet?.type,
					publishedAt: activity.snippet?.publishedAt,
					title: activity.snippet?.title,
					description: activity.snippet?.description,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save activity to database:', error);
			}
		}

		await logEventFromContext(ctx, 'youtube.webhook.newActivity', { activityId: activity.id }, 'completed');

		return {
			success: true,
			data: parsed.data,
		};
	},
};
