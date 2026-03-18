import { logEventFromContext } from '../../utils/events';
import type { ZoomWebhooks } from '..';
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
						uuid: webinar.uuid,
						host_id: webinar.host_id,
						topic: webinar.topic,
						type: webinar.type,
						start_time: webinar.start_time,
						duration: webinar.duration,
						timezone: webinar.timezone,
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
