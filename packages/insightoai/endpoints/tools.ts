import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const createToolfunction: InsightoaiEndpoints['createToolfunction'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['createToolfunction']
		>('/api/v1/toolfunction', ctx.key, {
			method: 'POST',
			body: input,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.tools.createToolfunction',
			{ toolId: input.tool_id },
			'completed',
		);
		return result;
	};

export const updateToolfunctionById: InsightoaiEndpoints['updateToolfunctionById'] =
	async (ctx, input) => {
		const { toolfunction_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['updateToolfunctionById']
		>(`/api/v1/toolfunction/${toolfunction_id}`, ctx.key, {
			method: 'PUT',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.tools.updateToolfunctionById',
			{ toolFunctionId: toolfunction_id },
			'completed',
		);
		return result;
	};

export const deleteToolfunctionById: InsightoaiEndpoints['deleteToolfunctionById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteToolfunctionById']
		>(`/api/v1/toolfunction/${input.toolfunction_id}`, ctx.key, {
			method: 'DELETE',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.tools.deleteToolfunctionById',
			{ toolFunctionId: input.toolfunction_id },
			'completed',
		);
		return result;
	};

export const readToolToolfunctionList: InsightoaiEndpoints['readToolToolfunctionList'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['readToolToolfunctionList']
		>(`/api/v1/tool/${input.tool_id}/tool_function/list`, ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.tools.readToolToolfunctionList',
			{ toolId: input.tool_id },
			'completed',
		);
		return result;
	};

export const updateToolById: InsightoaiEndpoints['updateToolById'] = async (
	ctx,
	input,
) => {
	const { tool_id, ...body } = input;
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['updateToolById']
	>(`/api/v1/tool/${tool_id}`, ctx.key, {
		method: 'PUT',
		body,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.tools.updateToolById',
		{ toolId: tool_id },
		'completed',
	);
	return result;
};

export const deleteToolById: InsightoaiEndpoints['deleteToolById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['deleteToolById']
	>(`/api/v1/tool/${input.tool_id}`, ctx.key, {
		method: 'DELETE',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.tools.deleteToolById',
		{ toolId: input.tool_id },
		'completed',
	);
	return result;
};

export const readToolFunctionInvokeLogList: InsightoaiEndpoints['readToolFunctionInvokeLogList'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['readToolFunctionInvokeLogList']
		>('/api/v1/tool_function_invoke_log/list', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
				size: input.size,
				conversation_id: input.conversation_id,
			},
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.tools.readToolFunctionInvokeLogList',
			{ conversationId: input.conversation_id },
			'completed',
		);
		return result;
	};

export const retrieveLinkedToolAndUser: InsightoaiEndpoints['retrieveLinkedToolAndUser'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['retrieveLinkedToolAndUser']
		>(`/api/v1/tool/${input.tool_id}/link_tool_user`, ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.tools.retrieveLinkedToolAndUser',
			{ toolId: input.tool_id },
			'completed',
		);
		return result;
	};

export const updateLinkToolUser: InsightoaiEndpoints['updateLinkToolUser'] =
	async (ctx, input) => {
		const { link_tool_user_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['updateLinkToolUser']
		>(`/api/v1/tool/link_tool_user/${link_tool_user_id}`, ctx.key, {
			method: 'PUT',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.tools.updateLinkToolUser',
			{ linkToolUserId: link_tool_user_id },
			'completed',
		);
		return result;
	};
