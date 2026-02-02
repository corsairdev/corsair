import type { PostHogWebhooks } from '..';
import type { EventCapturedEvent } from './types';
import { createPostHogMatch } from './types';

export const eventCaptured: PostHogWebhooks['eventCaptured'] = {
	match: createPostHogMatch(),

	handler: async (ctx, request) => {
		const event = request.payload as EventCapturedEvent;

		if (!event.event || !event.distinct_id) {
			return {
				success: true,
				data: event as unknown as EventCapturedEvent,
			};
		}

		console.log('📊 PostHog Event Captured:', {
			event: event.event,
			distinct_id: event.distinct_id,
			timestamp: event.timestamp,
		});

		if (ctx.db.events && event.distinct_id) {
			try {
				const eventId = event.uuid || `${Date.now()}-${Math.random()}`;
				await ctx.db.events.upsert(eventId, {
					id: eventId,
					event: event.event,
					distinct_id: event.distinct_id,
					timestamp: event.timestamp,
					uuid: event.uuid,
					properties: event.properties,
					createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
				});
			} catch (error) {
				console.warn('Failed to save event to database:', error);
			}
		}

		return {
			success: true,
			data: event,
		};
	},
};
