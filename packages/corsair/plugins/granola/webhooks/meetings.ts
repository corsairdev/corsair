import { logEventFromContext } from '../../utils/events';
import type { GranolaWebhooks } from '..';
import {
	createGranolaMatch,
	verifyGranolaWebhookSignature,
} from './types';

export const started: GranolaWebhooks['meetingStarted'] = {
	match: createGranolaMatch('meeting.started'),

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

		if (event.type !== 'meeting.started') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (ctx.db.notes) {
			try {
				const entity = await ctx.db.notes.upsertByEntityId(event.data.note_id, {
					id: event.data.note_id,
					title: event.data.title,
					attendees: event.data.attendees,
					status: 'active',
					started_at: event.data.started_at
						? new Date(event.data.started_at)
						: undefined,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save meeting to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'granola.webhook.meeting.started',
			{ ...event },
			'completed',
		);
		return { success: true, corsairEntityId, data: event };
	},
};

export const ended: GranolaWebhooks['meetingEnded'] = {
	match: createGranolaMatch('meeting.ended'),

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

		if (event.type !== 'meeting.ended') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (ctx.db.notes) {
			try {
				const existing = await ctx.db.notes.findByEntityId(event.data.note_id);
				const entity = await ctx.db.notes.upsertByEntityId(event.data.note_id, {
					...(existing?.data ?? {}),
					id: event.data.note_id,
					title: event.data.title ?? existing?.data?.title,
					attendees: event.data.attendees ?? existing?.data?.attendees,
					status: 'completed',
					started_at: event.data.started_at
						? new Date(event.data.started_at)
						: existing?.data?.started_at,
					ended_at: event.data.ended_at ? new Date(event.data.ended_at) : undefined,
					duration_seconds: event.data.duration_seconds,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update meeting in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'granola.webhook.meeting.ended',
			{ ...event },
			'completed',
		);
		return { success: true, corsairEntityId, data: event };
	},
};
