import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const getDatasourceById: InsightoaiEndpoints['getDatasourceById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getDatasourceById']
		>(`/api/v1/datasource/${input.datasource_id}`, ctx.key, {
			method: 'GET',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.datasources.getDatasourceById',
			{ datasourceId: input.datasource_id },
			'completed',
		);
		return result;
	};

export const getListOfDatasources: InsightoaiEndpoints['getListOfDatasources'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getListOfDatasources']
		>('/api/v1/datasource', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.datasources.getListOfDatasources',
			{},
			'completed',
		);
		return result;
	};

export const getListOfDataSourcesLinkedToAssistantId: InsightoaiEndpoints['getListOfDataSourcesLinkedToAssistantId'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getListOfDataSourcesLinkedToAssistantId']
		>(`/api/v1/assistant/${input.assistant_id}/data-sources`, ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.datasources.getListOfDataSourcesLinkedToAssistantId',
			{ assistantId: input.assistant_id },
			'completed',
		);
		return result;
	};

export const deleteLinkedAssistantDatasource: InsightoaiEndpoints['deleteLinkedAssistantDatasource'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteLinkedAssistantDatasource']
		>(
			`/api/v1/datasource/${input.datasource_id}/assistant/${input.assistant_id}`,
			ctx.key,
			{ method: 'DELETE', authType: ctx.options.authType },
		);

		await logEventFromContext(
			ctx,
			'insightoai.datasources.deleteLinkedAssistantDatasource',
			{ assistantId: input.assistant_id, datasourceId: input.datasource_id },
			'completed',
		);
		return result;
	};

export const createTag: InsightoaiEndpoints['createTag'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createTag']
	>('/api/v1/tag', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.datasources.createTag',
		{},
		'completed',
	);
	return result;
};

export const readTagList: InsightoaiEndpoints['readTagList'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['readTagList']
	>('/api/v1/tag/list', ctx.key, {
		method: 'GET',
		query: { page: input.page, size: input.size },
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.datasources.readTagList',
		{},
		'completed',
	);
	return result;
};

export const deleteTagById: InsightoaiEndpoints['deleteTagById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['deleteTagById']
	>(`/api/v1/tag/${input.tag_id}`, ctx.key, {
		method: 'DELETE',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.datasources.deleteTagById',
		{ tagId: input.tag_id },
		'completed',
	);
	return result;
};

export const deleteLinkTagEntityById: InsightoaiEndpoints['deleteLinkTagEntityById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteLinkTagEntityById']
		>(`/api/v1/link_tag_entity/${input.link_tag_entity_id}`, ctx.key, {
			method: 'DELETE',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.datasources.deleteLinkTagEntityById',
			{ linkTagEntityId: input.link_tag_entity_id },
			'completed',
		);
		return result;
	};
