import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { HELPWISE_APP_BASE, makeHelpwiseRequest } from '../client';
import type {
	ConversationsGetResponse,
	ConversationsListResponse,
	StandardActionResponse,
} from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const close: HelpwiseEndpoint<'conversations.close'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.close'].parse(input);
	const response = await makeHelpwiseRequest<StandardActionResponse>(
		'/conversations/action/close',
		ctx.key,
		{
			method: 'PUT',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.close'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.close',
		{ count: parsedInput.ids.length },
		'completed',
	);
	return parsed;
};

export const moveToInbox: HelpwiseEndpoint<
	'conversations.moveToInbox'
> = async (ctx, input) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.moveToInbox'].parse(input);
	const response = await makeHelpwiseRequest<StandardActionResponse>(
		'/conversations/action/moveToInbox',
		ctx.key,
		{
			method: 'PUT',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.moveToInbox'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.moveToInbox',
		{ count: parsedInput.ids.length },
		'completed',
	);
	return parsed;
};

export const spam: HelpwiseEndpoint<'conversations.spam'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.spam'].parse(input);
	const response = await makeHelpwiseRequest<StandardActionResponse>(
		'/conversations/action/spam',
		ctx.key,
		{
			method: 'PUT',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.spam'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.spam',
		{ count: parsedInput.ids.length },
		'completed',
	);
	return parsed;
};

export const trash: HelpwiseEndpoint<'conversations.trash'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.trash'].parse(input);
	const response = await makeHelpwiseRequest<StandardActionResponse>(
		'/conversations/action/trash',
		ctx.key,
		{
			method: 'PUT',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.trash'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.trash',
		{ count: parsedInput.ids.length },
		'completed',
	);
	return parsed;
};

export const deleteConversation: HelpwiseEndpoint<
	'conversations.delete'
> = async (ctx, input) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.delete'].parse(input);
	const response = await makeHelpwiseRequest<StandardActionResponse>(
		'/conversations/action/delete',
		ctx.key,
		{
			method: 'PUT',
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.delete',
		{ count: parsedInput.ids.length },
		'completed',
	);
	return parsed;
};

export const list: HelpwiseEndpoint<'conversations.list'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.list'].parse(input);

	const query: Record<string, string | number | number[] | undefined> = {};
	if (parsedInput.inboxIds && parsedInput.inboxIds.length > 0) {
		// Core repeats an array key once per value: inboxIds[]=1&inboxIds[]=2.
		query['inboxIds[]'] = parsedInput.inboxIds;
	}
	if (parsedInput.labelId !== undefined) {
		query.labelId = parsedInput.labelId;
	}
	if (parsedInput.limit !== undefined) {
		query.limit = parsedInput.limit;
	}
	if (parsedInput.pageToken !== undefined) {
		query.pageToken = parsedInput.pageToken;
	}

	const response = await makeHelpwiseRequest<ConversationsListResponse>(
		'/conversations',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.list'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.list',
		{ count: parsed.threads.length },
		'completed',
	);
	return parsed;
};

export const get: HelpwiseEndpoint<'conversations.get'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.get'].parse(input);

	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.labelId !== undefined) {
		query.labelId = parsedInput.labelId;
	}
	if (parsedInput.limit !== undefined) {
		query.limit = parsedInput.limit;
	}
	if (parsedInput.pageToken !== undefined) {
		query.pageToken = parsedInput.pageToken;
	}

	const response = await makeHelpwiseRequest<ConversationsGetResponse>(
		`/inboxes/${encodeURIComponent(parsedInput.inboxId)}/conversations/${encodeURIComponent(parsedInput.conversationId)}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.get'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.get',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const assign: HelpwiseEndpoint<'conversations.assign'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpwiseEndpointInputSchemas['conversations.assign'].parse(input);
	const response = await makeHelpwiseRequest<StandardActionResponse>(
		'/dev-apis/threads/assign',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed =
		HelpwiseEndpointOutputSchemas['conversations.assign'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.conversations.assign',
		{ threadId: parsedInput.thread_id, assignedTo: parsedInput.assigned_to },
		'completed',
	);
	return parsed;
};
