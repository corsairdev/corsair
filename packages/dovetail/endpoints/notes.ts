import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const create: DovetailEndpoints['notesCreate'] = async (ctx, input) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		project_id: input.project_id,
	};
	if (input.title !== undefined) body.title = input.title;
	if (input.content !== undefined) body.content = input.content;
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['notesCreate']
	>('/v1/notes', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.notes.create',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const get: DovetailEndpoints['notesGet'] = async (ctx, input) => {
	const result = await makeDovetailRequest<DovetailEndpointOutputs['notesGet']>(
		`/v1/notes/${encodeURIComponent(input.note_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.notes.get',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const list: DovetailEndpoints['notesList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.project_id !== undefined)
		query['filter[project_id]'] = input.filter.project_id;
	if (input.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = input.filter.folder_id;
	if (input.filter?.created_at?.gt !== undefined)
		query['filter[created_at][gt]'] = input.filter.created_at.gt;
	if (input.filter?.created_at?.gte !== undefined)
		query['filter[created_at][gte]'] = input.filter.created_at.gte;
	if (input.filter?.created_at?.lt !== undefined)
		query['filter[created_at][lt]'] = input.filter.created_at.lt;
	if (input.filter?.created_at?.lte !== undefined)
		query['filter[created_at][lte]'] = input.filter.created_at.lte;
	if (input.sort !== undefined) query.sort = input.sort;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['notesList']
	>('/v1/notes', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'dovetail.notes.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};

export const update: DovetailEndpoints['notesUpdate'] = async (ctx, input) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.title !== undefined) body.title = input.title;
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['notesUpdate']
	>(`/v1/notes/${encodeURIComponent(input.note_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.notes.update',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const deleteNote: DovetailEndpoints['notesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['notesDelete']
	>(`/v1/notes/${encodeURIComponent(input.note_id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'dovetail.notes.delete',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const exportNote: DovetailEndpoints['notesExport'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['notesExport']
	>(
		`/v1/notes/${encodeURIComponent(input.note_id)}/export/${encodeURIComponent(input.type)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.notes.export',
		{ id: result.data.id, type: input.type },
		'completed',
	);
	return result;
};

export const importFile: DovetailEndpoints['notesImportFile'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		project_id: input.project_id,
	};
	if (input.url !== undefined) body.url = input.url;
	if (input.file_id !== undefined) body.file_id = input.file_id;
	if (input.mime_type !== undefined) body.mime_type = input.mime_type;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['notesImportFile']
	>('/v1/notes/import/file', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.notes.importFile',
		{ id: result.data.id },
		'completed',
	);
	return result;
};
