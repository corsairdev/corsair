import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	TasksCreateInput,
	TasksCreateResponse,
	TasksDeleteInput,
	TasksDeleteResponse,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksUpdateInput,
	TasksUpdateResponse,
} from './types';
import {
	TasksCreateResponseSchema,
	TasksDeleteResponseSchema,
	TasksGetResponseSchema,
	TasksListResponseSchema,
	TasksUpdateResponseSchema,
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
	input: TasksListInput,
): Promise<TasksListResponse> => {
	const response = await makeChatbotkitRequest<TasksListResponse>(
		'task/list',
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

	const parsed = TasksListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.tasks.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: TasksGetInput,
): Promise<TasksGetResponse> => {
	const response = await makeChatbotkitRequest<TasksGetResponse>(
		`task/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = TasksGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.tasks.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: TasksCreateInput,
): Promise<TasksCreateResponse> => {
	const response = await makeChatbotkitRequest<TasksCreateResponse>(
		'task/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = TasksCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.tasks.create',
		{ id: parsed.id, name: input.name },
		'completed',
	);
	return parsed;
};

export const update = async (
	ctx: ChatbotkitContext,
	input: TasksUpdateInput,
): Promise<TasksUpdateResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<TasksUpdateResponse>(
		`task/${encodeURIComponent(id)}/update`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = TasksUpdateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.tasks.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: TasksDeleteInput,
): Promise<TasksDeleteResponse> => {
	const response = await makeChatbotkitRequest<TasksDeleteResponse>(
		`task/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = TasksDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.tasks.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
