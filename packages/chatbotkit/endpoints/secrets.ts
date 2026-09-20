import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	SecretsCreateInput,
	SecretsCreateResponse,
	SecretsDeleteInput,
	SecretsDeleteResponse,
	SecretsGetInput,
	SecretsGetResponse,
	SecretsListInput,
	SecretsListResponse,
	SecretsUpdateInput,
	SecretsUpdateResponse,
} from './types';
import {
	SecretsCreateResponseSchema,
	SecretsDeleteResponseSchema,
	SecretsGetResponseSchema,
	SecretsListResponseSchema,
	SecretsUpdateResponseSchema,
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
	input: SecretsListInput,
): Promise<SecretsListResponse> => {
	const response = await makeChatbotkitRequest<SecretsListResponse>(
		'secret/list',
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

	const parsed = SecretsListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.secrets.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: SecretsGetInput,
): Promise<SecretsGetResponse> => {
	const response = await makeChatbotkitRequest<SecretsGetResponse>(
		`secret/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = SecretsGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.secrets.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: SecretsCreateInput,
): Promise<SecretsCreateResponse> => {
	const response = await makeChatbotkitRequest<SecretsCreateResponse>(
		'secret/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = SecretsCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.secrets.create',
		{ id: parsed.id, name: input.name },
		'completed',
	);
	return parsed;
};

export const update = async (
	ctx: ChatbotkitContext,
	input: SecretsUpdateInput,
): Promise<SecretsUpdateResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<SecretsUpdateResponse>(
		`secret/${encodeURIComponent(id)}/update`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = SecretsUpdateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.secrets.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: SecretsDeleteInput,
): Promise<SecretsDeleteResponse> => {
	const response = await makeChatbotkitRequest<SecretsDeleteResponse>(
		`secret/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = SecretsDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.secrets.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
