import { logEventFromContext } from '../../utils/events';
import type { GranolaEndpoints } from '..';
import { makeGranolaRequest } from '../client';
import type { GranolaEndpointOutputs } from './types';

export const get: GranolaEndpoints['notesGet'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['notesGet']>(
		`v1/notes/${input.note_id}`,
		ctx.key,
		{
			method: 'GET',
			query: input.include ? { include: input.include } : undefined,
		},
	);

	if (result.note && ctx.db.notes) {
		try {
			const note = result.note;
			await ctx.db.notes.upsertByEntityId(note.id, {
				id: note.id,
				title: note.title ?? undefined,
				summary: note.summary_text,
				created_at: note.created_at ? new Date(note.created_at) : undefined,
				updated_at: note.updated_at ? new Date(note.updated_at) : undefined,
				attendees: note.attendees,
			});
		} catch (error) {
			console.warn('Failed to save note to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.notes.get', { ...input }, 'completed');
	return result;
};

export const list: GranolaEndpoints['notesList'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['notesList']>(
		'v1/notes',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				cursor: input.cursor,
				start_date: input.start_date,
				end_date: input.end_date,
			},
		},
	);

	if (result.notes && ctx.db.notes) {
		try {
			for (const note of result.notes) {
				await ctx.db.notes.upsertByEntityId(note.id, {
					id: note.id,
					title: note.title ?? undefined,
					summary: note.summary_text,
					created_at: note.created_at ? new Date(note.created_at) : undefined,
					updated_at: note.updated_at ? new Date(note.updated_at) : undefined,
					attendees: note.attendees,
				});
			}
		} catch (error) {
			console.warn('Failed to save notes to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.notes.list', { ...input }, 'completed');
	return result;
};
