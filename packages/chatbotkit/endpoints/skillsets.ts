import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	SkillsetsCreateInput,
	SkillsetsCreateResponse,
	SkillsetsDeleteInput,
	SkillsetsDeleteResponse,
	SkillsetsGetInput,
	SkillsetsGetResponse,
	SkillsetsListInput,
	SkillsetsListResponse,
	SkillsetsUpdateInput,
	SkillsetsUpdateResponse,
} from './types';
import {
	SkillsetsCreateResponseSchema,
	SkillsetsDeleteResponseSchema,
	SkillsetsGetResponseSchema,
	SkillsetsListResponseSchema,
	SkillsetsUpdateResponseSchema,
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
	input: SkillsetsListInput,
): Promise<SkillsetsListResponse> => {
	const response = await makeChatbotkitRequest<SkillsetsListResponse>(
		'skillset/list',
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

	const parsed = SkillsetsListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.skillsets.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: SkillsetsGetInput,
): Promise<SkillsetsGetResponse> => {
	const response = await makeChatbotkitRequest<SkillsetsGetResponse>(
		`skillset/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = SkillsetsGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.skillsets.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: SkillsetsCreateInput,
): Promise<SkillsetsCreateResponse> => {
	const response = await makeChatbotkitRequest<SkillsetsCreateResponse>(
		'skillset/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = SkillsetsCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.skillsets.create',
		{ id: parsed.id, name: input.name },
		'completed',
	);
	return parsed;
};

export const update = async (
	ctx: ChatbotkitContext,
	input: SkillsetsUpdateInput,
): Promise<SkillsetsUpdateResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<SkillsetsUpdateResponse>(
		`skillset/${encodeURIComponent(id)}/update`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = SkillsetsUpdateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.skillsets.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: SkillsetsDeleteInput,
): Promise<SkillsetsDeleteResponse> => {
	const response = await makeChatbotkitRequest<SkillsetsDeleteResponse>(
		`skillset/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = SkillsetsDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.skillsets.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
