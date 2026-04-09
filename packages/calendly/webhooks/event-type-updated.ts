import { logEventFromContext } from 'corsair/core';
import type { CalendlyWebhooks } from '..';
import {
	createCalendlyEventMatch,
	verifyCalendlyWebhookSignature,
} from './types';

export const eventTypeUpdated: CalendlyWebhooks['eventTypeUpdated'] = {
	match: createCalendlyEventMatch('event_type.updated'),

	handler: async (ctx, request) => {
		const signingKey = ctx.key;
		const verification = verifyCalendlyWebhookSignature(request, signingKey);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload;

		if (payload.event !== 'event_type.updated') {
			return { success: true, data: undefined };
		}

		const eventType = payload.payload;

		if (ctx.db.eventTypes && eventType.uri) {
			try {
				const uriParts = eventType.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				const existing = await ctx.db.eventTypes.findByEntityId(id);
				if (existing) {
					await ctx.db.eventTypes.upsertByEntityId(id, {
						...existing.data,
						...eventType,
						updated_at: eventType.updated_at
							? new Date(eventType.updated_at)
							: null,
					});
				}
			} catch (error) {
				console.warn('Failed to update event type in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.webhook.eventTypeUpdated',
			{ event_type_uri: eventType.uri },
			'completed',
		);

		return { success: true, data: payload };
	},
};
