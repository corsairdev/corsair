import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
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
	>(`user/${user_handle}/ai/key`, ctx.key, {
		method: 'POST',
		body: { provider, key },
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
	>(`user/${input.user_handle}/ai/key/${input.provider}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.ai.get_user_key',
		{ ...input },
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
	>(`user/${input.user_handle}/ai/key`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.ai.list_user_keys',
		{ ...input },
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
	>(`user/${user_handle}/ai/key/${provider}`, ctx.key, {
		method: 'PATCH',
		body: { key },
	});
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
	>(`user/${user_handle}/ai/key/${provider}/test`, ctx.key, {
		method: 'POST',
		body: { key },
	});
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
			`org/${input.org_handle}/workspace/${input.workspace_handle}/ai/conversation/${input.conversation_id}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.delete_org_conversation',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceConversation: TurbotPipesEndpoints['getUserWorkspaceConversation'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceConversation']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/ai/conversation/${input.conversation_id}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.get_user_conversation',
			{ ...input },
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
			`user/${user_handle}/workspace/${workspace_handle}/ai/conversation/${conversation_id}`,
			ctx.key,
			{ method: 'PATCH', body: { title } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.update_user_conversation',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConversations: TurbotPipesEndpoints['listUserWorkspaceConversations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConversations']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/ai/conversation`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.list_user_conversations',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sendUserWorkspaceChatMessage: TurbotPipesEndpoints['sendUserWorkspaceChatMessage'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, message, conversation_id } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['sendUserWorkspaceChatMessage']
		>(`user/${user_handle}/workspace/${workspace_handle}/ai/chat`, ctx.key, {
			method: 'POST',
			body: { message, conversation_id },
		});
		// Log only identifiers; message content may carry sensitive data.
		await logEventFromContext(
			ctx,
			'turbotpipes.ai.send_chat_message',
			{ user_handle, workspace_handle, conversation_id },
			'completed',
		);
		return response;
	};
