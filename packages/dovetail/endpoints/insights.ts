import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const create: DovetailEndpoints['insightsCreate'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.title !== undefined) body.title = input.title;
	if (input.content !== undefined) body.content = input.content;
	if (input.content_type !== undefined) body.content_type = input.content_type;
	if (input.project_id !== undefined) body.project_id = input.project_id;
	if (input.folder_id !== undefined) body.folder_id = input.folder_id;
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsCreate']
	>('/v1/insights', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.insights.create',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const get: DovetailEndpoints['insightsGet'] = async (ctx, input) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsGet']
	>(`/v1/insights/${encodeURIComponent(input.insight_id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'dovetail.insights.get',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const list: DovetailEndpoints['insightsList'] = async (ctx, input) => {
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
		DovetailEndpointOutputs['insightsList']
	>('/v1/insights', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'dovetail.insights.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};

export const update: DovetailEndpoints['insightsUpdate'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.title !== undefined) body.title = input.title;
	if (input.folder_id !== undefined) body.folder_id = input.folder_id;
	if (input.cover_image_file_id !== undefined)
		body.cover_image_file_id = input.cover_image_file_id;
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsUpdate']
	>(`/v1/insights/${encodeURIComponent(input.insight_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.insights.update',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const deleteInsight: DovetailEndpoints['insightsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsDelete']
	>(`/v1/insights/${encodeURIComponent(input.insight_id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'dovetail.insights.delete',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const exportInsight: DovetailEndpoints['insightsExport'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsExport']
	>(
		`/v1/insights/${encodeURIComponent(input.insight_id)}/export/${encodeURIComponent(input.type)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.insights.export',
		{ id: result.data.id, type: input.type },
		'completed',
	);
	return result;
};

export const importFile: DovetailEndpoints['insightsImportFile'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.project_id !== undefined) body.project_id = input.project_id;
	if (input.folder_id !== undefined) body.folder_id = input.folder_id;
	if (input.url !== undefined) body.url = input.url;
	if (input.file_id !== undefined) body.file_id = input.file_id;
	if (input.mime_type !== undefined) body.mime_type = input.mime_type;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['insightsImportFile']
	>('/v1/insights/import/file', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.insights.importFile',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const listUserInsights: DovetailEndpoints['insightsListUserInsights'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean | undefined> = {};
		if (input.page?.limit !== undefined)
			query['page[limit]'] = input.page.limit;
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
			DovetailEndpointOutputs['insightsListUserInsights']
		>(`/v1/insights/user/${encodeURIComponent(input.user_id)}`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'dovetail.insights.listUserInsights',
			{ user_id: input.user_id, count: result.data.length },
			'completed',
		);
		return result;
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
