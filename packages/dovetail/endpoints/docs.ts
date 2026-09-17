import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const create: DovetailEndpoints['docsCreate'] = async (ctx, input) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.title !== undefined) body.title = input.title;
	if (input.content !== undefined) body.content = input.content;
	if (input.content_type !== undefined) body.content_type = input.content_type;
	if (input.project_id !== undefined) body.project_id = input.project_id;
	if (input.folder_id !== undefined) body.folder_id = input.folder_id;
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['docsCreate']
	>('/v1/docs', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.docs.create',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const get: DovetailEndpoints['docsGet'] = async (ctx, input) => {
	const result = await makeDovetailRequest<DovetailEndpointOutputs['docsGet']>(
		`/v1/docs/${encodeURIComponent(input.doc_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.docs.get',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const list: DovetailEndpoints['docsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.project_id !== undefined)
		query['filter[project_id]'] = input.filter.project_id;
	if (input.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = input.filter.folder_id;
	if (input.filter?.title !== undefined)
		query['filter[title]'] = input.filter.title;
	if (input.filter?.created_at?.gt !== undefined)
		query['filter[created_at][gt]'] = input.filter.created_at.gt;
	if (input.filter?.created_at?.gte !== undefined)
		query['filter[created_at][gte]'] = input.filter.created_at.gte;
	if (input.filter?.created_at?.lt !== undefined)
		query['filter[created_at][lt]'] = input.filter.created_at.lt;
	if (input.filter?.created_at?.lte !== undefined)
		query['filter[created_at][lte]'] = input.filter.created_at.lte;
	if (input.sort !== undefined) query.sort = input.sort;

	const result = await makeDovetailRequest<DovetailEndpointOutputs['docsList']>(
		'/v1/docs',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.docs.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};

export const update: DovetailEndpoints['docsUpdate'] = async (ctx, input) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.title !== undefined) body.title = input.title;
	if (input.folder_id !== undefined) body.folder_id = input.folder_id;
	if (input.cover_image_file_id !== undefined)
		body.cover_image_file_id = input.cover_image_file_id;
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['docsUpdate']
	>(`/v1/docs/${encodeURIComponent(input.doc_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.docs.update',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const deleteDoc: DovetailEndpoints['docsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['docsDelete']
	>(`/v1/docs/${encodeURIComponent(input.doc_id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'dovetail.docs.delete',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const exportDoc: DovetailEndpoints['docsExport'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['docsExport']
	>(
		`/v1/docs/${encodeURIComponent(input.doc_id)}/export/${encodeURIComponent(input.type)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.docs.export',
		{ id: result.data.id, type: input.type },
		'completed',
	);
	return result;
};

export const importFile: DovetailEndpoints['docsImportFile'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: input.title,
	};
	if (input.project_id !== undefined) body.project_id = input.project_id;
	if (input.folder_id !== undefined) body.folder_id = input.folder_id;
	if (input.url !== undefined) body.url = input.url;
	if (input.file_id !== undefined) body.file_id = input.file_id;
	if (input.mime_type !== undefined) body.mime_type = input.mime_type;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['docsImportFile']
	>('/v1/docs/import/file', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.docs.importFile',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const listUserDocs: DovetailEndpoints['docsListUserDocs'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.project_id !== undefined)
		query['filter[project_id]'] = input.filter.project_id;
	if (input.filter?.folder_id !== undefined)
		query['filter[folder_id]'] = input.filter.folder_id;
	if (input.filter?.title !== undefined)
		query['filter[title]'] = input.filter.title;
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
		DovetailEndpointOutputs['docsListUserDocs']
	>(`/v1/docs/user/${encodeURIComponent(input.user_id)}`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'dovetail.docs.listUserDocs',
		{ user_id: input.user_id, count: result.data.length },
		'completed',
	);
	return result;
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
