import { logEventFromContext } from 'corsair/core';
import { makeConvoloAiRequest } from '../client';
import type { ConvoloAiEndpointOutputs, ConvoloAiEndpoints } from '../index';

export const list: ConvoloAiEndpoints['widgetList'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['widgetList']
	>('api/v1/widgets', ctx.key, {
		method: 'GET',
		query: {
			searchString: input.searchString,
			status: input.status,
			page: input.page,
			itemsPerPage: input.itemsPerPage,
			sortBy: input.sortBy,
			sortDirection: input.sortDirection,
			statsDateFrom: input.statsDateFrom,
			statsDateTo: input.statsDateTo,
			needCallsAndVisitsStats: input.needCallsAndVisitsStats,
			createdDateFrom: input.createdDateFrom,
			createdDateTo: input.createdDateTo,
			isDelegate: input.isDelegate,
			isDeleted: input.isDeleted,
		},
	});

	await logEventFromContext(
		ctx,
		'convoloai.widget.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: ConvoloAiEndpoints['widgetCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['widgetCreate']
	>('api/v1/widgets', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.widget.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: ConvoloAiEndpoints['widgetGet'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['widgetGet']
	>(`api/v1/widgets/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'convoloai.widget.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: ConvoloAiEndpoints['widgetUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['widgetUpdate']
	>(`api/v1/widgets/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.widget.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateV2: ConvoloAiEndpoints['widgetUpdateV2'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['widgetUpdateV2']
	>(`api/v2/widgets/${encodeURIComponent(input.widgetId)}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'convoloai.widget.updateV2',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: ConvoloAiEndpoints['widgetDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['widgetDelete']
	>(`api/v1/widgets/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'convoloai.widget.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const toggle: ConvoloAiEndpoints['widgetToggle'] = async (
	ctx,
	input,
) => {
	const response = await makeConvoloAiRequest<
		ConvoloAiEndpointOutputs['widgetToggle']
	>(`api/v1/widgets/toggle/${input.id}/${input.new_state}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'convoloai.widget.toggle',
		{ ...input },
		'completed',
	);

	return response;
};

export const getHtmlSiteCode: ConvoloAiEndpoints['widgetGetHtmlSiteCode'] =
	async (ctx, input) => {
		const response = await makeConvoloAiRequest<
			ConvoloAiEndpointOutputs['widgetGetHtmlSiteCode']
		>(
			`api/v1/widgets/html-site-code/${encodeURIComponent(input.id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'convoloai.widget.getHtmlSiteCode',
			{ ...input },
			'completed',
		);

		return response;
	};

export const updateSettings: ConvoloAiEndpoints['widgetUpdateSettings'] =
	async (ctx, input) => {
		const response = await makeConvoloAiRequest<
			ConvoloAiEndpointOutputs['widgetUpdateSettings']
		>('api/v1/ext/update-widget-settings', ctx.key, {
			method: 'POST',
			query: {
				widget_key: input.widget_key,
				api_key: input.api_key,
			},
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'convoloai.widget.updateSettings',
			{ widget_key: '***', api_key: '***', body: input.body },
			'completed',
		);

		return response;
	};
