import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const create: DovetailEndpoints['insightsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.insightsCreate.parse(input);
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
		DovetailEndpointOutputs['insightsCreate']
	>('/v1/insights', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.insightsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.insights.create',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const get: DovetailEndpoints['insightsGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.insightsGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsGet']
	>(`/v1/insights/${encodeURIComponent(parsed.insight_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.insightsGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.insights.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const list: DovetailEndpoints['insightsList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.insightsList.parse(input);
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
		DovetailEndpointOutputs['insightsList']
	>('/v1/insights', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.insightsList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.insights.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};

export const update: DovetailEndpoints['insightsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.insightsUpdate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.folder_id !== undefined) body.folder_id = parsed.folder_id;
	if (parsed.cover_image_file_id !== undefined)
		body.cover_image_file_id = parsed.cover_image_file_id;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsUpdate']
	>(`/v1/insights/${encodeURIComponent(parsed.insight_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.insightsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.insights.update',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const deleteInsight: DovetailEndpoints['insightsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.insightsDelete.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsDelete']
	>(`/v1/insights/${encodeURIComponent(parsed.insight_id)}`, ctx.key, {
		method: 'DELETE',
	});
	const validated =
		DovetailEndpointOutputSchemas.insightsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.insights.delete',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const exportInsight: DovetailEndpoints['insightsExport'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.insightsExport.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsExport']
	>(
		`/v1/insights/${encodeURIComponent(parsed.insight_id)}/export/${encodeURIComponent(parsed.type)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const validated =
		DovetailEndpointOutputSchemas.insightsExport.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.insights.export',
		{ id: validated.data.id, type: parsed.type },
		'completed',
	);
	return validated;
};

export const importFile: DovetailEndpoints['insightsImportFile'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.insightsImportFile.parse(input);
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
		DovetailEndpointOutputs['insightsImportFile']
	>('/v1/insights/import/file', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.insightsImportFile.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.insights.importFile',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const listUserInsights: DovetailEndpoints['insightsListUserInsights'] =
	async (ctx, input) => {
		const parsed =
			DovetailEndpointInputSchemas.insightsListUserInsights.parse(input);
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
			DovetailEndpointOutputs['insightsListUserInsights']
		>(`/v1/insights/user/${encodeURIComponent(parsed.user_id)}`, ctx.key, {
			method: 'GET',
			query,
		});
		const validated =
			DovetailEndpointOutputSchemas.insightsListUserInsights.parse(response);

		await logEventFromContext(
			ctx,
			'dovetail.insights.listUserInsights',
			{ user_id: parsed.user_id, count: validated.data.length },
			'completed',
		);
		return validated;
	};

export const Insights = {
	create,
	get,
	list,
	update,
	delete: deleteInsight,
	export: exportInsight,
	importFile,
	listUserInsights,
};
