import { logEventFromContext } from 'corsair/core';
import type { FirefliesWebhooks } from '..';
import { createFirefliesMatch, verifyFirefliesWebhookSignature } from './types';

export const transcriptionComplete: FirefliesWebhooks['transcriptionComplete'] =
	{
		match: createFirefliesMatch('Transcription'),

		handler: async (ctx, request) => {
			const webhookSecret = ctx.key;
			const verification = verifyFirefliesWebhookSignature(
				request,
				webhookSecret,
			);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}

			const event = request.payload;

			if (event.eventType !== 'Transcription') {
				return {
					success: true,
					data: undefined,
				};
			}

			let corsairEntityId = '';

			if (ctx.db.transcripts && event.meetingId) {
				try {
					const entity = await ctx.db.transcripts.upsertByEntityId(
						event.meetingId,
						{
							id: event.meetingId,
						},
					);
					corsairEntityId = entity?.id || '';
				} catch (error) {
					console.warn('Failed to save transcript to database:', error);
				}
			}

			await logEventFromContext(
				ctx,
				'fireflies.webhook.transcriptionComplete',
				{ meetingId: event.meetingId, eventType: event.eventType },
				'completed',
			);

			return {
				success: true,
				corsairEntityId,
				data: event,
			};
		},
	};

export const transcriptProcessing: FirefliesWebhooks['transcriptProcessing'] = {
	match: createFirefliesMatch('TranscriptProcessing'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyFirefliesWebhookSignature(
			request,
			webhookSecret,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.eventType !== 'TranscriptProcessing') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'fireflies.webhook.transcriptProcessing',
			{ meetingId: event.meetingId, eventType: event.eventType },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
