import { v7 } from 'uuid';
import { logEventFromContext } from '../../utils/events';
import type { PostHogWebhooks } from '..';
import { createPostHogMatch, verifyPostHogWebhookSignature } from './types';

export const eventCaptured: PostHogWebhooks['eventCaptured'] = {
	match: createPostHogMatch(),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyPostHogWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

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

		let corsairEntityId = '';

		if (ctx.db.events && event.distinct_id) {
			try {
				// PostHog docs use a uuid v7 so if we don't receive a uuid, then we create a uuid v7
				const eventId = event.uuid || v7();
				const entity = await ctx.db.events.upsertByEntityId(eventId, {
					...event,
					id: eventId,
					createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
				});

				corsairEntityId = entity?.id || '';
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
			corsairEntityId,
			data: event,
		};
	},
};
