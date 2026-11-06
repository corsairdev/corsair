import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserAiKey: TurbotPipesEndpoints['createUserAiKey'] = async (
	ctx,
	input,
) => {
	const { user_handle, provider } = input;
	const { key, ..._rest } = input;
	void _rest;
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['createUserAiKey']
	>(`user/${pathSegment(user_handle)}/ai/key`, ctx.key, {
		method: 'POST',
		body: { provider, api_key: key },
	});
	// Log only identifiers; the AI provider key must never persist in event storage.
	await logEventFromContext(
		ctx,
		'turbotpipes.ai.create_user_key',
		{ user_handle, provider },
		'completed',
	);
	return response;
};

export const getUserAiKey: TurbotPipesEndpoints['getUserAiKey'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getUserAiKey']
	>(
		`user/${pathSegment(input.user_handle)}/ai/key/${pathSegment(input.provider)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'turbotpipes.ai.get_user_key',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const listUserAiKeys: TurbotPipesEndpoints['listUserAiKeys'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['listUserAiKeys']
	>(`user/${pathSegment(input.user_handle)}/ai/key`, ctx.key, {
		method: 'GET',
		query: pickQuery(input, ['limit', 'next_token']),
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.ai.list_user_keys',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const updateUserAiKey: TurbotPipesEndpoints['updateUserAiKey'] = async (
	ctx,
	input,
) => {
	const { user_handle, provider, key } = input;
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['updateUserAiKey']
	>(
		`user/${pathSegment(user_handle)}/ai/key/${pathSegment(provider)}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { api_key: key },
		},
	);
	// Log only identifiers; the AI provider key must never persist in event storage.
	await logEventFromContext(
		ctx,
		'turbotpipes.ai.update_user_key',
		{ user_handle, provider },
		'completed',
	);
	return response;
};

export const testUserAiKey: TurbotPipesEndpoints['testUserAiKey'] = async (
	ctx,
	input,
) => {
	const { user_handle, provider, key } = input;
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['testUserAiKey']
	>(
		`user/${pathSegment(user_handle)}/ai/key/${pathSegment(provider)}/test`,
		ctx.key,
		{
			method: 'POST',
			body: { api_key: key },
		},
	);
	// Log only identifiers; the AI provider key must never persist in event storage.
	await logEventFromContext(
		ctx,
		'turbotpipes.ai.test_user_key',
		{ user_handle, provider },
		'completed',
	);
	return response;
};

export const deleteOrgWorkspaceConversation: TurbotPipesEndpoints['deleteOrgWorkspaceConversation'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteOrgWorkspaceConversation']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/ai/conversation/${pathSegment(input.conversation_id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.delete_org_conversation',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceConversation: TurbotPipesEndpoints['getUserWorkspaceConversation'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceConversation']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/ai/conversation/${pathSegment(input.conversation_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.get_user_conversation',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const updateUserWorkspaceConversation: TurbotPipesEndpoints['updateUserWorkspaceConversation'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, conversation_id, title } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserWorkspaceConversation']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/ai/conversation/${pathSegment(conversation_id)}`,
			ctx.key,
			{ method: 'PATCH', body: { title } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.update_user_conversation',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConversations: TurbotPipesEndpoints['listUserWorkspaceConversations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConversations']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/ai/conversation`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.list_user_conversations',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const sendUserWorkspaceChatMessage: TurbotPipesEndpoints['sendUserWorkspaceChatMessage'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, message, conversation_id } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['sendUserWorkspaceChatMessage']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/ai/chat`,
			ctx.key,
			{
				method: 'POST',
				body: { message, conversation_id },
			},
		);
		// Log only identifiers; message content may carry sensitive data.
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.send_chat_message',
			{ user_handle, workspace_handle, conversation_id },
			'completed',
		);
		return response;
	};
