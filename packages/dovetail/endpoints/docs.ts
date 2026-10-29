import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const create: DovetailEndpoints['docsCreate'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.docsCreate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.content !== undefined) body.content = parsed.content;
	if (parsed.content_type !== undefined)
		body.content_type = parsed.content_type;
	if (parsed.project_id !== undefined) body.project_id = parsed.project_id;
	if (parsed.folder_id !== undefined) body.folder_id = parsed.folder_id;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['docsCreate']
	>('/v1/docs', ctx.key, {
		method: 'POST',
		body,
	});
	const validated = DovetailEndpointOutputSchemas.docsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.create',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const get: DovetailEndpoints['docsGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.docsGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['docsGet']
	>(`/v1/docs/${encodeURIComponent(parsed.doc_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.docsGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const list: DovetailEndpoints['docsList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.docsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.project_id !== undefined)
		query['filter[project_id]'] = parsed.filter.project_id;
	if (parsed.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = parsed.filter.folder_id;
	if (parsed.filter?.title !== undefined)
		query['filter[title]'] = parsed.filter.title;
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
		DovetailEndpointOutputs['docsList']
	>('/v1/docs', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.docsList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};

export const update: DovetailEndpoints['docsUpdate'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.docsUpdate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.folder_id !== undefined) body.folder_id = parsed.folder_id;
	if (parsed.cover_image_file_id !== undefined)
		body.cover_image_file_id = parsed.cover_image_file_id;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['docsUpdate']
	>(`/v1/docs/${encodeURIComponent(parsed.doc_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const validated = DovetailEndpointOutputSchemas.docsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.update',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const deleteDoc: DovetailEndpoints['docsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.docsDelete.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['docsDelete']
	>(`/v1/docs/${encodeURIComponent(parsed.doc_id)}`, ctx.key, {
		method: 'DELETE',
	});
	const validated = DovetailEndpointOutputSchemas.docsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.delete',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const exportDoc: DovetailEndpoints['docsExport'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.docsExport.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['docsExport']
	>(
		`/v1/docs/${encodeURIComponent(parsed.doc_id)}/export/${encodeURIComponent(parsed.type)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const validated = DovetailEndpointOutputSchemas.docsExport.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.export',
		{ id: validated.data.id, type: parsed.type },
		'completed',
	);
	return validated;
};

export const importFile: DovetailEndpoints['docsImportFile'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.docsImportFile.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: parsed.title,
	};
	if (parsed.project_id !== undefined) body.project_id = parsed.project_id;
	if (parsed.folder_id !== undefined) body.folder_id = parsed.folder_id;
	if (parsed.url !== undefined) body.url = parsed.url;
	if (parsed.file_id !== undefined) body.file_id = parsed.file_id;
	if (parsed.mime_type !== undefined) body.mime_type = parsed.mime_type;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['docsImportFile']
	>('/v1/docs/import/file', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.docsImportFile.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.importFile',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const listUserDocs: DovetailEndpoints['docsListUserDocs'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.docsListUserDocs.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.project_id !== undefined)
		query['filter[project_id]'] = parsed.filter.project_id;
	if (parsed.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = parsed.filter.folder_id;
	if (parsed.filter?.title !== undefined)
		query['filter[title]'] = parsed.filter.title;
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
		DovetailEndpointOutputs['docsListUserDocs']
	>(`/v1/docs/user/${encodeURIComponent(parsed.user_id)}`, ctx.key, {
		method: 'GET',
		query,
	});
	const validated =
		DovetailEndpointOutputSchemas.docsListUserDocs.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.docs.listUserDocs',
		{ user_id: parsed.user_id, count: validated.data.length },
		'completed',
	);
	return validated;
};

export const Docs = {
	create,
	get,
	list,
	update,
	delete: deleteDoc,
	export: exportDoc,
	importFile,
	listUserDocs,
};
