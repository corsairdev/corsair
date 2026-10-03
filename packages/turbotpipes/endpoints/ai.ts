import { logEventFromContext } from 'corsair/core';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';
import { makeTurbotPipesRequest } from '../client';

export const createUserAiKey: TurbotPipesEndpoints['createUserAiKey'] = async (ctx, input) => {
	const { user_handle, ...body } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['createUserAiKey']>(
		`user/${user_handle}/ai_key`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.create_user_key', { ...input }, 'completed');
	return response;
};

export const getUserAiKey: TurbotPipesEndpoints['getUserAiKey'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getUserAiKey']>(
		`user/${input.user_handle}/ai_key/${input.key_id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.get_user_key', { ...input }, 'completed');
	return response;
};

export const listUserAiKeys: TurbotPipesEndpoints['listUserAiKeys'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['listUserAiKeys']>(
		`user/${input.user_handle}/ai_key`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.list_user_keys', { ...input }, 'completed');
	return response;
};

export const updateUserAiKey: TurbotPipesEndpoints['updateUserAiKey'] = async (ctx, input) => {
	const { user_handle, key_id, ...body } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['updateUserAiKey']>(
		`user/${user_handle}/ai_key/${key_id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.update_user_key', { ...input }, 'completed');
	return response;
};

export const testUserAiKey: TurbotPipesEndpoints['testUserAiKey'] = async (ctx, input) => {
	const { user_handle, ...body } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['testUserAiKey']>(
		`user/${user_handle}/ai_key/test`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.test_user_key', { ...input }, 'completed');
	return response;
};

export const deleteOrgWorkspaceConversation: TurbotPipesEndpoints['deleteOrgWorkspaceConversation'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['deleteOrgWorkspaceConversation']>(
		`org/${input.org_handle}/workspace/${input.workspace_handle}/conversation/${input.conversation_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.delete_org_conversation', { ...input }, 'completed');
	return response;
};

export const getUserWorkspaceConversation: TurbotPipesEndpoints['getUserWorkspaceConversation'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getUserWorkspaceConversation']>(
		`user/${input.user_handle}/workspace/${input.workspace_handle}/conversation/${input.conversation_id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.get_user_conversation', { ...input }, 'completed');
	return response;
};

export const updateUserWorkspaceConversation: TurbotPipesEndpoints['updateUserWorkspaceConversation'] = async (ctx, input) => {
	const { user_handle, workspace_handle, conversation_id, title } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['updateUserWorkspaceConversation']>(
		`user/${user_handle}/workspace/${workspace_handle}/conversation/${conversation_id}`,
		ctx.key,
		{ method: 'PATCH', body: { title } },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.update_user_conversation', { ...input }, 'completed');
	return response;
};

export const listUserWorkspaceConversations: TurbotPipesEndpoints['listUserWorkspaceConversations'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['listUserWorkspaceConversations']>(
		`user/${input.user_handle}/workspace/${input.workspace_handle}/conversation`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.list_user_conversations', { ...input }, 'completed');
	return response;
};

export const sendUserWorkspaceChatMessage: TurbotPipesEndpoints['sendUserWorkspaceChatMessage'] = async (ctx, input) => {
	const { user_handle, workspace_handle, message, conversation_id } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['sendUserWorkspaceChatMessage']>(
		`user/${user_handle}/workspace/${workspace_handle}/chat`,
		ctx.key,
		{ method: 'POST', body: { message, conversation_id } },
	);
	await logEventFromContext(ctx, 'turbotpipes.ai.send_chat_message', { ...input }, 'completed');
	return response;
};
