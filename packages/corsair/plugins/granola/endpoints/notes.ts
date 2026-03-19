import { logEventFromContext } from '../../utils/events';
import type { GranolaEndpoints } from '..';
import { makeGranolaRequest } from '../client';
import type { GranolaEndpointOutputs } from './types';

export const get: GranolaEndpoints['notesGet'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['notesGet']>(
		`v1/notes/${input.note_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.note && ctx.db.notes) {
		try {
			await ctx.db.notes.upsertByEntityId(result.note.id, {
				...result.note,
				created_at: result.note.created_at ? new Date(result.note.created_at) : undefined,
				updated_at: result.note.updated_at ? new Date(result.note.updated_at) : undefined,
				started_at: result.note.started_at ? new Date(result.note.started_at) : undefined,
				ended_at: result.note.ended_at ? new Date(result.note.ended_at) : undefined,
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
				status: input.status,
				tag: input.tag,
			},
		},
	);

	if (result.notes && ctx.db.notes) {
		try {
			for (const note of result.notes) {
				await ctx.db.notes.upsertByEntityId(note.id, {
					...note,
					created_at: note.created_at ? new Date(note.created_at) : undefined,
					updated_at: note.updated_at ? new Date(note.updated_at) : undefined,
					started_at: note.started_at ? new Date(note.started_at) : undefined,
					ended_at: note.ended_at ? new Date(note.ended_at) : undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save notes to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.notes.list', { ...input }, 'completed');
	return result;
};

export const create: GranolaEndpoints['notesCreate'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['notesCreate']>(
		'v1/notes',
		ctx.key,
		{
			method: 'POST',
			body: {
				title: input.title,
				summary: input.summary,
				started_at: input.started_at,
				ended_at: input.ended_at,
				attendees: input.attendees,
				tags: input.tags,
			},
		},
	);

	if (result.note && ctx.db.notes) {
		try {
			await ctx.db.notes.upsertByEntityId(result.note.id, {
				...result.note,
				created_at: result.note.created_at ? new Date(result.note.created_at) : undefined,
				updated_at: result.note.updated_at ? new Date(result.note.updated_at) : undefined,
				started_at: result.note.started_at ? new Date(result.note.started_at) : undefined,
				ended_at: result.note.ended_at ? new Date(result.note.ended_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save note to database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.notes.create', { ...input }, 'completed');
	return result;
};

export const update: GranolaEndpoints['notesUpdate'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['notesUpdate']>(
		`v1/notes/${input.note_id}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				title: input.title,
				summary: input.summary,
				tags: input.tags,
			},
		},
	);

	if (result.note && ctx.db.notes) {
		try {
			await ctx.db.notes.upsertByEntityId(result.note.id, {
				...result.note,
				created_at: result.note.created_at ? new Date(result.note.created_at) : undefined,
				updated_at: result.note.updated_at ? new Date(result.note.updated_at) : undefined,
				started_at: result.note.started_at ? new Date(result.note.started_at) : undefined,
				ended_at: result.note.ended_at ? new Date(result.note.ended_at) : undefined,
			});
		} catch (error) {
			console.warn('Failed to update note in database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.notes.update', { ...input }, 'completed');
	return result;
};

export const deleteNote: GranolaEndpoints['notesDelete'] = async (ctx, input) => {
	const result = await makeGranolaRequest<GranolaEndpointOutputs['notesDelete']>(
		`v1/notes/${input.note_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.notes) {
		try {
			await ctx.db.notes.deleteByEntityId(input.note_id);
		} catch (error) {
			console.warn('Failed to delete note from database:', error);
		}
	}

	await logEventFromContext(ctx, 'granola.notes.delete', { ...input }, 'completed');
	return result;
};
