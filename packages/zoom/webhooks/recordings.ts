import { logEventFromContext } from 'corsair/core';
import type { ZoomWebhooks } from '..';
import { createZoomEventMatch, verifyZoomWebhookSignature } from './types';

export const completed: ZoomWebhooks['recordingCompleted'] = {
	match: createZoomEventMatch('recording.completed'),

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

		if (event.event !== 'recording.completed') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		const recording = event.payload.object;
		if (ctx.db.recordings && recording.recording_files) {
			try {
				for (const file of recording.recording_files) {
					if (file.id) {
						const entity = await ctx.db.recordings.upsertByEntityId(file.id, {
							...file,
							meeting_id: String(recording.id ?? ''),
						});
						if (!corsairEntityId) {
							corsairEntityId = entity?.id || '';
						}
					}
				}
			} catch (error) {
				console.warn('Failed to save recording to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.recording.completed',
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
