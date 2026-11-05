import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const create: DovetailEndpoints['dataCreate'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.dataCreate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		project_id: parsed.project_id,
	};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.content !== undefined) body.content = parsed.content;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['dataCreate']
	>('/v1/data', ctx.key, {
		method: 'POST',
		body,
	});
	const validated = DovetailEndpointOutputSchemas.dataCreate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.data.create',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const get: DovetailEndpoints['dataGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.dataGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['dataGet']
	>(`/v1/data/${encodeURIComponent(parsed.data_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.dataGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.data.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const list: DovetailEndpoints['dataList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.dataList.parse(input);
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
		DovetailEndpointOutputs['dataList']
	>('/v1/data', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.dataList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.data.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};

export const update: DovetailEndpoints['dataUpdate'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.dataUpdate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['dataUpdate']
	>(`/v1/data/${encodeURIComponent(parsed.data_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const validated = DovetailEndpointOutputSchemas.dataUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.data.update',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const deleteData: DovetailEndpoints['dataDelete'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.dataDelete.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['dataDelete']
	>(`/v1/data/${encodeURIComponent(parsed.data_id)}`, ctx.key, {
		method: 'DELETE',
	});
	const validated = DovetailEndpointOutputSchemas.dataDelete.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.data.delete',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const exportData: DovetailEndpoints['dataExport'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.dataExport.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.include_file_content !== undefined) {
		query.include_file_content = parsed.include_file_content;
	}

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['dataExport']
	>(
		`/v1/data/${encodeURIComponent(parsed.data_id)}/export/${encodeURIComponent(parsed.type)}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const validated = DovetailEndpointOutputSchemas.dataExport.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.data.export',
		{ id: validated.data.id, type: parsed.type },
		'completed',
	);
	return validated;
};

export const importFile: DovetailEndpoints['dataImportFile'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.dataImportFile.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		project_id: parsed.project_id,
		title: parsed.title,
	};
	if (parsed.url !== undefined) body.url = parsed.url;
	if (parsed.file_id !== undefined) body.file_id = parsed.file_id;
	if (parsed.mime_type !== undefined) body.mime_type = parsed.mime_type;
	if (parsed.author_id !== undefined) body.author_id = parsed.author_id;
	if (parsed.created_at !== undefined) body.created_at = parsed.created_at;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['dataImportFile']
	>('/v1/data/import/file', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.dataImportFile.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.data.importFile',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const Data = {
	create,
	get,
	list,
	update,
	delete: deleteData,
	export: exportData,
	importFile,
};
