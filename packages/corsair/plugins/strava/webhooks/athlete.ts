import type { StravaWebhooks } from '..';
import { createStravaMatch } from './types';

export const athleteUpdate: StravaWebhooks['athleteUpdate'] = {
	match: createStravaMatch('athlete', 'update'),

	handler: async (ctx, request) => {
		// Strava webhook payload type is narrowed by the matcher — safe to cast to the specific event type
		const event = request.payload as import('./types').AthleteUpdateEvent;

		if (ctx.db.athletes) {
			try {
				await ctx.db.athletes.upsertByEntityId(String(event.object_id), {
					id: event.object_id,
				});
			} catch (error) {
				console.warn('Failed to update athlete in database from webhook:', error);
			}
		}

		return {
			success: true,
			corsairEntityId: String(event.object_id),
			data: event,
		};
	},
};
