import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	BlueprintsCreateInput,
	BlueprintsCreateResponse,
	BlueprintsDeleteInput,
	BlueprintsDeleteResponse,
	BlueprintsGetInput,
	BlueprintsGetResponse,
	BlueprintsListInput,
	BlueprintsListResponse,
	BlueprintsUpdateInput,
	BlueprintsUpdateResponse,
} from './types';
import {
	BlueprintsCreateResponseSchema,
	BlueprintsDeleteResponseSchema,
	BlueprintsGetResponseSchema,
	BlueprintsListResponseSchema,
	BlueprintsUpdateResponseSchema,
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
	input: BlueprintsListInput,
): Promise<BlueprintsListResponse> => {
	const response = await makeChatbotkitRequest<BlueprintsListResponse>(
		'blueprint/list',
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

	const parsed = BlueprintsListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.blueprints.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: BlueprintsGetInput,
): Promise<BlueprintsGetResponse> => {
	const response = await makeChatbotkitRequest<BlueprintsGetResponse>(
		`blueprint/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = BlueprintsGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.blueprints.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: BlueprintsCreateInput,
): Promise<BlueprintsCreateResponse> => {
	const response = await makeChatbotkitRequest<BlueprintsCreateResponse>(
		'blueprint/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = BlueprintsCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.blueprints.create',
		{ id: parsed.id, name: input.name },
		'completed',
	);
	return parsed;
};

export const update = async (
	ctx: ChatbotkitContext,
	input: BlueprintsUpdateInput,
): Promise<BlueprintsUpdateResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<BlueprintsUpdateResponse>(
		`blueprint/${encodeURIComponent(id)}/update`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = BlueprintsUpdateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.blueprints.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: BlueprintsDeleteInput,
): Promise<BlueprintsDeleteResponse> => {
	const response = await makeChatbotkitRequest<BlueprintsDeleteResponse>(
		`blueprint/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = BlueprintsDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.blueprints.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
