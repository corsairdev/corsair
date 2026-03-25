import type { StravaWebhooks } from '..';
import { createStravaMatch } from './types';

export const activityCreate: StravaWebhooks['activityCreate'] = {
	match: createStravaMatch('activity', 'create'),

	handler: async (ctx, request) => {
		// Strava webhook payload type is narrowed by the matcher — safe to cast to the specific event type
		const event = request.payload as import('./types').ActivityCreateEvent;

		if (ctx.db.activities) {
			try {
				await ctx.db.activities.upsertByEntityId(String(event.object_id), {
					id: event.object_id,
				});
			} catch (error) {
				console.warn('Failed to save activity to database from webhook:', error);
			}
		}

		return {
			success: true,
			corsairEntityId: String(event.object_id),
			data: event,
		};
	},
};

export const activityUpdate: StravaWebhooks['activityUpdate'] = {
	match: createStravaMatch('activity', 'update'),

	handler: async (ctx, request) => {
		// Strava webhook payload type is narrowed by the matcher — safe to cast to the specific event type
		const event = request.payload as import('./types').ActivityUpdateEvent;

		if (ctx.db.activities) {
			try {
				await ctx.db.activities.upsertByEntityId(String(event.object_id), {
					id: event.object_id,
				});
			} catch (error) {
				console.warn('Failed to update activity in database from webhook:', error);
			}
		}

		return {
			success: true,
			corsairEntityId: String(event.object_id),
			data: event,
		};
	},
};

export const activityDelete: StravaWebhooks['activityDelete'] = {
	match: createStravaMatch('activity', 'delete'),

	handler: async (_ctx, request) => {
		// Strava webhook payload type is narrowed by the matcher — safe to cast to the specific event type
		const event = request.payload as import('./types').ActivityDeleteEvent;

		return {
			success: true,
			corsairEntityId: String(event.object_id),
			data: event,
		};
	},
};
