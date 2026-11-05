import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const create: DovetailEndpoints['notesCreate'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.notesCreate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		project_id: parsed.project_id,
	};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.content !== undefined) body.content = parsed.content;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['notesCreate']
	>('/v1/notes', ctx.key, {
		method: 'POST',
		body,
	});
	const validated = DovetailEndpointOutputSchemas.notesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.notes.create',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const get: DovetailEndpoints['notesGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.notesGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['notesGet']
	>(`/v1/notes/${encodeURIComponent(parsed.note_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.notesGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.notes.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const list: DovetailEndpoints['notesList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.notesList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.project_id !== undefined)
		query['filter[project_id]'] = parsed.filter.project_id;
	if (parsed.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = parsed.filter.folder_id;
	if (parsed.filter?.created_at?.gt !== undefined)
		query['filter[created_at][gt]'] = parsed.filter.created_at.gt;
	if (parsed.filter?.created_at?.gte !== undefined)
		query['filter[created_at][gte]'] = parsed.filter.created_at.gte;
	if (parsed.filter?.created_at?.lt !== undefined)
		query['filter[created_at][lt]'] = parsed.filter.created_at.lt;
	if (parsed.filter?.created_at?.lte !== undefined)
		query['filter[created_at][lte]'] = parsed.filter.created_at.lte;
	if (parsed.sort !== undefined) query.sort = parsed.sort;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['notesList']
	>('/v1/notes', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.notesList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.notes.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};

export const update: DovetailEndpoints['notesUpdate'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.notesUpdate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['notesUpdate']
	>(`/v1/notes/${encodeURIComponent(parsed.note_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const validated = DovetailEndpointOutputSchemas.notesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.notes.update',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const deleteNote: DovetailEndpoints['notesDelete'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.notesDelete.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['notesDelete']
	>(`/v1/notes/${encodeURIComponent(parsed.note_id)}`, ctx.key, {
		method: 'DELETE',
	});
	const validated = DovetailEndpointOutputSchemas.notesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.notes.delete',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const exportNote: DovetailEndpoints['notesExport'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.notesExport.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['notesExport']
	>(
		`/v1/notes/${encodeURIComponent(parsed.note_id)}/export/${encodeURIComponent(parsed.type)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const validated = DovetailEndpointOutputSchemas.notesExport.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.notes.export',
		{ id: validated.data.id, type: parsed.type },
		'completed',
	);
	return validated;
};

export const importFile: DovetailEndpoints['notesImportFile'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.notesImportFile.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		project_id: parsed.project_id,
		title: parsed.title,
		url: parsed.url,
	};
	if (parsed.mime_type !== undefined) body.mime_type = parsed.mime_type;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['notesImportFile']
	>('/v1/notes/import/file', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.notesImportFile.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.notes.importFile',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const Notes = {
	create,
	get,
	list,
	update,
	delete: deleteNote,
	export: exportNote,
	importFile,
};
