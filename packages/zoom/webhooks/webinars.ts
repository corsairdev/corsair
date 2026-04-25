import { logEventFromContext } from 'corsair/core';
import type { ZoomWebhooks } from '../index';
import { createZoomEventMatch, verifyZoomWebhookSignature } from './types';

export const started: ZoomWebhooks['webinarStarted'] = {
	match: createZoomEventMatch('webinar.started'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyZoomWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event !== 'webinar.started') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		const webinar = event.payload.object;
		if (ctx.db.webinars && webinar.id) {
			try {
				const entity = await ctx.db.webinars.upsertByEntityId(
					String(webinar.id),
					{
						...webinar,
						id: webinar.id ? Number(webinar.id) : undefined,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save webinar to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.webinar.started',
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
