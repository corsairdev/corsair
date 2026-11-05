import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	ChatChannelsCreateDmInput,
	ChatChannelsCreateDmResponse,
	ChatChannelsCreateInput,
	ChatChannelsCreateLocationInput,
	ChatChannelsCreateLocationResponse,
	ChatChannelsCreateResponse,
	ChatChannelsDeleteInput,
	ChatChannelsDeleteResponse,
	ChatChannelsFollowersInput,
	ChatChannelsFollowersResponse,
	ChatChannelsGetInput,
	ChatChannelsGetResponse,
	ChatChannelsListInput,
	ChatChannelsListResponse,
	ChatChannelsMembersInput,
	ChatChannelsMembersResponse,
	ChatChannelsUpdateInput,
	ChatChannelsUpdateResponse,
	ChatMessagesCreateInput,
	ChatMessagesCreateResponse,
	ChatMessagesDeleteInput,
	ChatMessagesDeleteResponse,
	ChatMessagesListInput,
	ChatMessagesListResponse,
	ChatMessagesUpdateInput,
	ChatMessagesUpdateResponse,
	ChatReactionsCreateInput,
	ChatReactionsCreateResponse,
	ChatReactionsDeleteInput,
	ChatReactionsDeleteResponse,
	ChatReactionsGetInput,
	ChatReactionsGetResponse,
	ChatRepliesCreateInput,
	ChatRepliesCreateResponse,
	ChatRepliesGetInput,
	ChatRepliesGetResponse,
	ChatSubtypesInput,
	ChatSubtypesResponse,
	ChatTaggedUsersInput,
	ChatTaggedUsersResponse,
} from './types';

const V3 = { version: 'v3' } as const;

function channelsBase(workspace_id: string): string {
	return `workspaces/${workspace_id}/chat/channels`;
}

export async function channelsList(
	ctx: ClickupRequestContext,
	input: ChatChannelsListInput,
): Promise<ChatChannelsListResponse> {
	const { workspace_id, ...query } = input;
	const response = await makeClickupRequest<ChatChannelsListResponse>(
		channelsBase(workspace_id),
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsList',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function channelsGet(
	ctx: ClickupRequestContext,
	input: ChatChannelsGetInput,
): Promise<ChatChannelsGetResponse> {
	const response = await makeClickupRequest<ChatChannelsGetResponse>(
		`${channelsBase(input.workspace_id)}/${input.channel_id}`,
		ctx.key,
		{ method: 'GET', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsGet',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}

export async function channelsCreate(
	ctx: ClickupRequestContext,
	input: ChatChannelsCreateInput,
): Promise<ChatChannelsCreateResponse> {
	const { workspace_id, ...body } = input;
	const response = await makeClickupRequest<ChatChannelsCreateResponse>(
		channelsBase(workspace_id),
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsCreate',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function channelsCreateLocation(
	ctx: ClickupRequestContext,
	input: ChatChannelsCreateLocationInput,
): Promise<ChatChannelsCreateLocationResponse> {
	const { workspace_id, ...body } = input;
	const response = await makeClickupRequest<ChatChannelsCreateLocationResponse>(
		`${channelsBase(workspace_id)}/location`,
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsCreateLocation',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function channelsCreateDm(
	ctx: ClickupRequestContext,
	input: ChatChannelsCreateDmInput,
): Promise<ChatChannelsCreateDmResponse> {
	const { workspace_id, ...body } = input;
	const response = await makeClickupRequest<ChatChannelsCreateDmResponse>(
		`${channelsBase(workspace_id)}/direct_message`,
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsCreateDm',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function channelsUpdate(
	ctx: ClickupRequestContext,
	input: ChatChannelsUpdateInput,
): Promise<ChatChannelsUpdateResponse> {
	const { workspace_id, channel_id, ...body } = input;
	const response = await makeClickupRequest<ChatChannelsUpdateResponse>(
		`${channelsBase(workspace_id)}/${channel_id}`,
		ctx.key,
		{ method: 'PATCH', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsUpdate',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function channelsDelete(
	ctx: ClickupRequestContext,
	input: ChatChannelsDeleteInput,
): Promise<ChatChannelsDeleteResponse> {
	const response = await makeClickupRequest<ChatChannelsDeleteResponse>(
		`${channelsBase(input.workspace_id)}/${input.channel_id}`,
		ctx.key,
		{ method: 'DELETE', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsDelete',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}

export async function channelsMembers(
	ctx: ClickupRequestContext,
	input: ChatChannelsMembersInput,
): Promise<ChatChannelsMembersResponse> {
	const response = await makeClickupRequest<ChatChannelsMembersResponse>(
		`${channelsBase(input.workspace_id)}/${input.channel_id}/members`,
		ctx.key,
		{ method: 'GET', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsMembers',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}

export async function channelsFollowers(
	ctx: ClickupRequestContext,
	input: ChatChannelsFollowersInput,
): Promise<ChatChannelsFollowersResponse> {
	const { workspace_id, channel_id, ...query } = input;
	const response = await makeClickupRequest<ChatChannelsFollowersResponse>(
		`${channelsBase(workspace_id)}/${channel_id}/followers`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.channelsFollowers',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function messagesList(
	ctx: ClickupRequestContext,
	input: ChatMessagesListInput,
): Promise<ChatMessagesListResponse> {
	const { workspace_id, channel_id, ...query } = input;
	const response = await makeClickupRequest<ChatMessagesListResponse>(
		`${channelsBase(workspace_id)}/${channel_id}/messages`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.messagesList',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function messagesCreate(
	ctx: ClickupRequestContext,
	input: ChatMessagesCreateInput,
): Promise<ChatMessagesCreateResponse> {
	const { workspace_id, channel_id, ...body } = input;
	const response = await makeClickupRequest<ChatMessagesCreateResponse>(
		`${channelsBase(workspace_id)}/${channel_id}/messages`,
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.messagesCreate',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function messagesUpdate(
	ctx: ClickupRequestContext,
	input: ChatMessagesUpdateInput,
): Promise<ChatMessagesUpdateResponse> {
	const { workspace_id, message_id, ...body } = input;
	const response = await makeClickupRequest<ChatMessagesUpdateResponse>(
		`workspaces/${workspace_id}/chat/messages/${message_id}`,
		ctx.key,
		{ method: 'PATCH', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.messagesUpdate',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function messagesDelete(
	ctx: ClickupRequestContext,
	input: ChatMessagesDeleteInput,
): Promise<ChatMessagesDeleteResponse> {
	const response = await makeClickupRequest<ChatMessagesDeleteResponse>(
		`workspaces/${input.workspace_id}/chat/messages/${input.message_id}`,
		ctx.key,
		{ method: 'DELETE', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.messagesDelete',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}

export async function repliesGet(
	ctx: ClickupRequestContext,
	input: ChatRepliesGetInput,
): Promise<ChatRepliesGetResponse> {
	const { workspace_id, message_id, ...query } = input;
	const response = await makeClickupRequest<ChatRepliesGetResponse>(
		`workspaces/${workspace_id}/chat/messages/${message_id}/replies`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.repliesGet',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function repliesCreate(
	ctx: ClickupRequestContext,
	input: ChatRepliesCreateInput,
): Promise<ChatRepliesCreateResponse> {
	const { workspace_id, message_id, ...body } = input;
	const response = await makeClickupRequest<ChatRepliesCreateResponse>(
		`workspaces/${workspace_id}/chat/messages/${message_id}/replies`,
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.repliesCreate',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function reactionsGet(
	ctx: ClickupRequestContext,
	input: ChatReactionsGetInput,
): Promise<ChatReactionsGetResponse> {
	const { workspace_id, message_id, ...query } = input;
	const response = await makeClickupRequest<ChatReactionsGetResponse>(
		`workspaces/${workspace_id}/chat/messages/${message_id}/reactions`,
		ctx.key,
		{ method: 'GET', ...V3, query },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.reactionsGet',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function reactionsCreate(
	ctx: ClickupRequestContext,
	input: ChatReactionsCreateInput,
): Promise<ChatReactionsCreateResponse> {
	const { workspace_id, message_id, ...body } = input;
	const response = await makeClickupRequest<ChatReactionsCreateResponse>(
		`workspaces/${workspace_id}/chat/messages/${message_id}/reactions`,
		ctx.key,
		{ method: 'POST', ...V3, body },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.reactionsCreate',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function reactionsDelete(
	ctx: ClickupRequestContext,
	input: ChatReactionsDeleteInput,
): Promise<ChatReactionsDeleteResponse> {
	const { workspace_id, message_id, reaction } = input;
	const response = await makeClickupRequest<ChatReactionsDeleteResponse>(
		`workspaces/${workspace_id}/chat/messages/${message_id}/reactions/${reaction}`,
		ctx.key,
		{ method: 'DELETE', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.reactionsDelete',
		{ workspace_id },
		'completed',
	);
	return response;
}

export async function taggedUsers(
	ctx: ClickupRequestContext,
	input: ChatTaggedUsersInput,
): Promise<ChatTaggedUsersResponse> {
	const response = await makeClickupRequest<ChatTaggedUsersResponse>(
		`workspaces/${input.workspace_id}/chat/messages/${input.message_id}/tagged_users`,
		ctx.key,
		{ method: 'GET', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.taggedUsers',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}

export async function subtypes(
	ctx: ClickupRequestContext,
	input: ChatSubtypesInput,
): Promise<ChatSubtypesResponse> {
	const response = await makeClickupRequest<ChatSubtypesResponse>(
		`workspaces/${input.workspace_id}/comments/types/${input.comment_type}/subtypes`,
		ctx.key,
		{ method: 'GET', ...V3 },
	);

	await logEventFromContext(
		ctx,
		'clickup.chat.subtypes',
		{ workspace_id: input.workspace_id },
		'completed',
	);
	return response;
}
