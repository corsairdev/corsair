import { logEventFromContext } from '../../utils/events';
import type { GranolaWebhooks } from '..';
import {
	createGranolaMatch,
	verifyGranolaWebhookSignature,
} from './types';

export const created: GranolaWebhooks['noteCreated'] = {
	match: createGranolaMatch('note.created'),

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

		if (event.type !== 'note.created') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (ctx.db.notes) {
			try {
				const entity = await ctx.db.notes.upsertByEntityId(event.data.note_id, {
					id: event.data.note_id,
					title: event.data.title,
					summary: event.data.summary,
					attendees: event.data.attendees,
					tags: event.data.tags,
					created_at: event.data.created_at ? new Date(event.data.created_at) : undefined,
					started_at: event.data.started_at ? new Date(event.data.started_at) : undefined,
					ended_at: event.data.ended_at ? new Date(event.data.ended_at) : undefined,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save note to database:', error);
			}
		}

		await logEventFromContext(ctx, 'granola.webhook.note.created', { ...event }, 'completed');
		return { success: true, corsairEntityId, data: event };
	},
};

export const updated: GranolaWebhooks['noteUpdated'] = {
	match: createGranolaMatch('note.updated'),

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

		if (event.type !== 'note.updated') {
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
					summary: event.data.summary ?? existing?.data?.summary,
					tags: event.data.tags ?? existing?.data?.tags,
					updated_at: event.data.updated_at ? new Date(event.data.updated_at) : undefined,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update note in database:', error);
			}
		}

		await logEventFromContext(ctx, 'granola.webhook.note.updated', { ...event }, 'completed');
		return { success: true, corsairEntityId, data: event };
	},
};

export const deleted: GranolaWebhooks['noteDeleted'] = {
	match: createGranolaMatch('note.deleted'),

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

		if (event.type !== 'note.deleted') {
			return { success: true, data: undefined };
		}

		if (ctx.db.notes) {
			try {
				await ctx.db.notes.deleteByEntityId(event.data.note_id);
			} catch (error) {
				console.warn('Failed to delete note from database:', error);
			}
		}

		await logEventFromContext(ctx, 'granola.webhook.note.deleted', { ...event }, 'completed');
		return { success: true, data: event };
	},
};
