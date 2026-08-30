import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	ConversationsCompleteInput,
	ConversationsCompleteResponse,
	ConversationsCreateInput,
	ConversationsCreateResponse,
	ConversationsDeleteInput,
	ConversationsDeleteResponse,
	ConversationsGetInput,
	ConversationsGetResponse,
	ConversationsListInput,
	ConversationsListResponse,
	ConversationsUpdateInput,
	ConversationsUpdateResponse,
} from './types';
import {
	ConversationsCompleteResponseSchema,
	ConversationsCreateResponseSchema,
	ConversationsDeleteResponseSchema,
	ConversationsGetResponseSchema,
	ConversationsListResponseSchema,
	ConversationsUpdateResponseSchema,
} from './types';

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	) as Record<string, string | number | boolean>;
}

export const list = async (
	ctx: ChatbotkitContext,
	input: ConversationsListInput,
): Promise<ConversationsListResponse> => {
	const response = await makeChatbotkitRequest<ConversationsListResponse>(
		'conversation/list',
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				cursor: input.cursor,
				take: input.limit,
				order: input.order,
			}),
		},
	);

	const parsed = ConversationsListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.conversations.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: ConversationsGetInput,
): Promise<ConversationsGetResponse> => {
	const response = await makeChatbotkitRequest<ConversationsGetResponse>(
		`conversation/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = ConversationsGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.conversations.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: ConversationsCreateInput,
): Promise<ConversationsCreateResponse> => {
	const response = await makeChatbotkitRequest<ConversationsCreateResponse>(
		'conversation/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = ConversationsCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.conversations.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const update = async (
	ctx: ChatbotkitContext,
	input: ConversationsUpdateInput,
): Promise<ConversationsUpdateResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<ConversationsUpdateResponse>(
		`conversation/${encodeURIComponent(id)}/update`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = ConversationsUpdateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.conversations.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: ConversationsDeleteInput,
): Promise<ConversationsDeleteResponse> => {
	const response = await makeChatbotkitRequest<ConversationsDeleteResponse>(
		`conversation/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = ConversationsDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.conversations.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const complete = async (
	ctx: ChatbotkitContext,
	input: ConversationsCompleteInput,
): Promise<ConversationsCompleteResponse> => {
	const { id, text } = input;
	const response = await makeChatbotkitRequest<ConversationsCompleteResponse>(
		`conversation/${encodeURIComponent(id)}/complete`,
		ctx.key,
		{
			method: 'POST',
			body: { text },
		},
	);

	const parsed = ConversationsCompleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.conversations.complete',
		{ id },
		'completed',
	);
	return parsed;
};
