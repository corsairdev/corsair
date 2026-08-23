import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	BotsCreateInput,
	BotsCreateResponse,
	BotsDeleteInput,
	BotsDeleteResponse,
	BotsDownvoteInput,
	BotsDownvoteResponse,
	BotsGetInput,
	BotsGetResponse,
	BotsListInput,
	BotsListResponse,
	BotsUpdateInput,
	BotsUpdateResponse,
	BotsUpvoteInput,
	BotsUpvoteResponse,
} from './types';
import {
	BotsCreateResponseSchema,
	BotsDeleteResponseSchema,
	BotsDownvoteResponseSchema,
	BotsGetResponseSchema,
	BotsListResponseSchema,
	BotsUpdateResponseSchema,
	BotsUpvoteResponseSchema,
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
	input: BotsListInput,
): Promise<BotsListResponse> => {
	const response = await makeChatbotkitRequest<BotsListResponse>(
		'bot/list',
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

	const parsed = BotsListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: BotsGetInput,
): Promise<BotsGetResponse> => {
	const response = await makeChatbotkitRequest<BotsGetResponse>(
		`bot/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = BotsGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: BotsCreateInput,
): Promise<BotsCreateResponse> => {
	const response = await makeChatbotkitRequest<BotsCreateResponse>(
		'bot/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = BotsCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.create',
		{ id: parsed.id, name: input.name },
		'completed',
	);
	return parsed;
};

export const update = async (
	ctx: ChatbotkitContext,
	input: BotsUpdateInput,
): Promise<BotsUpdateResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<BotsUpdateResponse>(
		`bot/${encodeURIComponent(id)}/update`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = BotsUpdateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: BotsDeleteInput,
): Promise<BotsDeleteResponse> => {
	const response = await makeChatbotkitRequest<BotsDeleteResponse>(
		`bot/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = BotsDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const upvote = async (
	ctx: ChatbotkitContext,
	input: BotsUpvoteInput,
): Promise<BotsUpvoteResponse> => {
	const response = await makeChatbotkitRequest<BotsUpvoteResponse>(
		`bot/${encodeURIComponent(input.id)}/upvote`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = BotsUpvoteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.upvote',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const downvote = async (
	ctx: ChatbotkitContext,
	input: BotsDownvoteInput,
): Promise<BotsDownvoteResponse> => {
	const response = await makeChatbotkitRequest<BotsDownvoteResponse>(
		`bot/${encodeURIComponent(input.id)}/downvote`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = BotsDownvoteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.bots.downvote',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
