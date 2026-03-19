import { logEventFromContext } from '../../utils/events';
import type { GranolaWebhooks } from '..';
import {
	createGranolaMatch,
	verifyGranolaWebhookSignature,
} from './types';

export const ready: GranolaWebhooks['transcriptReady'] = {
	match: createGranolaMatch('transcript.ready'),

	handler: async (ctx, request) => {
		const verification = verifyGranolaWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'transcript.ready') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (ctx.db.transcripts) {
			try {
				const entity = await ctx.db.transcripts.upsertByEntityId(
					event.data.transcript_id,
					{
						id: event.data.transcript_id,
						note_id: event.data.note_id,
						full_text: event.data.full_text,
						segments: event.data.segments,
						created_at: event.data.created_at
							? new Date(event.data.created_at)
							: undefined,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save transcript to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'granola.webhook.transcript.ready',
			{ ...event },
			'completed',
		);
		return { success: true, corsairEntityId, data: event };
	},
};
