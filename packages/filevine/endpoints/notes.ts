import { logEventFromContext } from 'corsair/core';
import { ensureFilevineOrgContext, makeFilevineRequest } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import {
	CreateNoteResponseSchema,
	ListProjectNotesResponseSchema,
	UpdateNoteResponseSchema,
} from './types';

export const list: FilevineEndpoints['listProjectNotes'] = async (
	ctx,
	input,
) => {
	await ensureFilevineOrgContext(ctx.key);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listProjectNotes']
	>(`/fv-app/v2/Projects/${input.projectId}/Notes`, ctx.key, {
		method: 'GET',
		query: {
			offset: input.offset,
			limit: input.limit,
			since: input.since,
		},
	});
	const parsed = ListProjectNotesResponseSchema.parse(result);
	if (parsed.items && ctx.db.notes) {
		for (const item of parsed.items) {
			try {
				await ctx.db.notes.upsertByEntityId(String(item.noteId), {
					id: item.noteId,
					noteId: item.noteId,
					projectId: item.projectId,
					body: item.body,
					kind: item.kind,
					pinned: item.pinned,
					authorId: item.authorId,
					mentions: item.mentions,
					attachedDocuments: item.attachedDocuments,
					createdDate: item.createdDate,
					modifiedDate: item.modifiedDate,
				});
			} catch {}
		}
	}
	await logEventFromContext(
		ctx,
		'filevine.notes.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const create: FilevineEndpoints['createNote'] = async (ctx, input) => {
	await ensureFilevineOrgContext(ctx.key);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['createNote']
	>('/fv-app/v2/Notes', ctx.key, {
		method: 'POST',
		body: {
			projectId: input.projectId,
			body: input.body,
			kind: input.kind,
			pinned: input.pinned,
			attachedDocuments: input.attachedDocuments,
		} as Record<string, unknown>,
	});
	const parsed = CreateNoteResponseSchema.parse(result);
	if (ctx.db.notes) {
		try {
			await ctx.db.notes.upsertByEntityId(String(parsed.noteId), {
				id: parsed.noteId,
				noteId: parsed.noteId,
				projectId: parsed.projectId,
				body: parsed.body,
				kind: parsed.kind,
				pinned: parsed.pinned,
				authorId: parsed.authorId,
				mentions: parsed.mentions,
				attachedDocuments: parsed.attachedDocuments,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.notes.create',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const update: FilevineEndpoints['updateNote'] = async (ctx, input) => {
	await ensureFilevineOrgContext(ctx.key);
	const { noteId, ...patch } = input;
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['updateNote']
	>(`/fv-app/v2/Notes/${noteId}`, ctx.key, {
		method: 'PATCH',
		body: patch as Record<string, unknown>,
	});
	const parsed = UpdateNoteResponseSchema.parse(result);
	if (ctx.db.notes) {
		try {
			await ctx.db.notes.upsertByEntityId(String(parsed.noteId), {
				id: parsed.noteId,
				noteId: parsed.noteId,
				projectId: parsed.projectId,
				body: parsed.body,
				kind: parsed.kind,
				pinned: parsed.pinned,
				authorId: parsed.authorId,
				mentions: parsed.mentions,
				attachedDocuments: parsed.attachedDocuments,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.notes.update',
		{ ...input },
		'completed',
	);
	return parsed;
};
