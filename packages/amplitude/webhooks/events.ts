import { logEventFromContext } from 'corsair/core';
import type { AmplitudeWebhooks } from '..';
import { createAmplitudeMatch, verifyAmplitudeWebhookSignature } from './types';

export const track: AmplitudeWebhooks['eventsTrack'] = {
	match: createAmplitudeMatch('event.track'),

	handler: async (ctx, request) => {
		const verification = verifyAmplitudeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload.data;

		if (!event) {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (ctx.db.events) {
			try {
				const entityId =
					event.event_id ?? event.insert_id ?? String(event.time);
				const entity = await ctx.db.events.upsertByEntityId(entityId, {
					...event,
					id: entityId,
					createdAt: new Date(event.time),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save event to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'amplitude.webhook.events.track',
			{ ...event },
			'completed',
		);

		return { success: true, corsairEntityId, data: event };
	},
};

export const identify: AmplitudeWebhooks['eventsIdentify'] = {
	match: createAmplitudeMatch('event.identify'),

	handler: async (ctx, request) => {
		const verification = verifyAmplitudeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload.data;

		if (!event) {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (ctx.db.users) {
			try {
				const userId =
					event.user_id ??
					event.device_id ??
					event.insert_id ??
					String(event.time);
				const entity = await ctx.db.users.upsertByEntityId(userId, {
					id: userId,
					user_id: event.user_id,
					user_properties: event.user_properties,
					platform: event.platform,
					createdAt: new Date(event.time),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'amplitude.webhook.events.identify',
			{ ...event },
			'completed',
		);

		return { success: true, corsairEntityId, data: event };
	},
};
