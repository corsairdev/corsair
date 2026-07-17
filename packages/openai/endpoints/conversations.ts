import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	ConversationsCreateItemsResponse,
	ConversationsCreateResponse,
	ConversationsDeleteItemResponse,
	ConversationsDeleteResponse,
	ConversationsGetItemResponse,
	ConversationsListItemsResponse,
	ConversationsUpdateResponse,
} from '../schema/conversations';

// --- Conversations ---

export const create: OpenaiEndpoints['conversationsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ConversationsCreateResponse>(
		'conversations',
		ctx.key,
		{
			method: 'POST',
			body: {
				items: input.items,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.conversations.create',
		{ metadata: input.metadata },
		'completed',
	);
	return result;
};

export const update: OpenaiEndpoints['conversationsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ConversationsUpdateResponse>(
		`conversations/${input.conversationId}`,
		ctx.key,
		{
			method: 'POST',
			body: { metadata: input.metadata },
		},
	);

	await logEventFromContext(
		ctx,
		'openai.conversations.update',
		{ conversationId: input.conversationId },
		'completed',
	);
	return result;
};

export const deleteConversation: OpenaiEndpoints['conversationsDelete'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<ConversationsDeleteResponse>(
			`conversations/${input.conversationId}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'openai.conversations.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

// --- Conversation Items ---

export const createItems: OpenaiEndpoints['conversationsCreateItems'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ConversationsCreateItemsResponse>(
		`conversations/${input.conversationId}/items`,
		ctx.key,
		{
			method: 'POST',
			body: { items: input.items, include: input.include },
		},
	);

	await logEventFromContext(
		ctx,
		'openai.conversations.createItems',
		{ conversationId: input.conversationId },
		'completed',
	);
	return result;
};

export const listItems: OpenaiEndpoints['conversationsListItems'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ConversationsListItemsResponse>(
		`conversations/${input.conversationId}/items`,
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				order: input.order,
				after: input.after,
				// OpenAI expects repeated keys (`include=a&include=b`), not a
				// comma-joined string. corsair/http serializes string[] that way.
				include: input.include,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.conversations.listItems',
		{ conversationId: input.conversationId },
		'completed',
	);
	return result;
};

export const getItem: OpenaiEndpoints['conversationsGetItem'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ConversationsGetItemResponse>(
		`conversations/${input.conversationId}/items/${input.itemId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.conversations.getItem',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteItem: OpenaiEndpoints['conversationsDeleteItem'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ConversationsDeleteItemResponse>(
		`conversations/${input.conversationId}/items/${input.itemId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.conversations.deleteItem',
		{ ...input },
		'completed',
	);
	return result;
};
