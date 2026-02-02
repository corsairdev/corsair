import { logEventFromContext } from '../../utils/events';
import type { PostHogWebhooks } from '..';
import { createPostHogMatch } from './types';
import { v7 } from 'uuid';

export const eventCaptured: PostHogWebhooks['eventCaptured'] = {
	match: createPostHogMatch(),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (!event.event || !event.distinct_id) {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📊 PostHog Event Captured:', {
			event: event.event,
			distinct_id: event.distinct_id,
			timestamp: event.timestamp,
		});

		if (ctx.db.events && event.distinct_id) {
			try {
				const eventId = event.uuid || v7();
				await ctx.db.events.upsert(eventId, {
					...event,
					id: eventId,
					createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
				});
			} catch (error) {
				console.warn('Failed to save event to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'posthog.webhook.eventCaptured',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
