import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const createWidget: InsightoaiEndpoints['createWidget'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createWidget']
	>('/api/v1/widget', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.widgets.createWidget',
		{ widgetType: input.widget_type, assistantId: input.assistant_id },
		'completed',
	);
	return result;
};

export const getWidgetById: InsightoaiEndpoints['getWidgetById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['getWidgetById']
	>(`/api/v1/widget/${input.widget_id}`, ctx.key, {
		method: 'GET',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.widgets.getWidgetById',
		{ widgetId: input.widget_id },
		'completed',
	);
	return result;
};

export const deleteWidgetById: InsightoaiEndpoints['deleteWidgetById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['deleteWidgetById']
	>(`/api/v1/widget/${input.widget_id}`, ctx.key, {
		method: 'DELETE',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.widgets.deleteWidgetById',
		{ widgetId: input.widget_id },
		'completed',
	);
	return result;
};

export const getListOfWidgetsLinkedToAssistantId: InsightoaiEndpoints['getListOfWidgetsLinkedToAssistantId'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getListOfWidgetsLinkedToAssistantId']
		>(`/api/v1/assistant/${input.assistant_id}/widgets`, ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.widgets.getListOfWidgetsLinkedToAssistantId',
			{ assistantId: input.assistant_id },
			'completed',
		);
		return result;
	};

export const listChannels: InsightoaiEndpoints['listChannels'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['listChannels']
	>('/api/v1/channel/list', ctx.key, {
		method: 'GET',
		query: { page: input.page, size: input.size },
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.widgets.listChannels',
		{},
		'completed',
	);
	return result;
};

export const getListOfConversations: InsightoaiEndpoints['getListOfConversations'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getListOfConversations']
		>('/api/v1/conversation', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
				size: input.size,
				date_to: input.date_to,
				date_from: input.date_from,
				intent_id: input.intent_id,
				assistant_id: input.assistant_id,
				includes_voice: input.includes_voice,
			},
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.widgets.getListOfConversations',
			{ assistantId: input.assistant_id },
			'completed',
		);
		return result;
	};
