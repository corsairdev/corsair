import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	FilesCreateInput,
	FilesCreateResponse,
	FilesDeleteInput,
	FilesDeleteResponse,
	FilesGetInput,
	FilesGetResponse,
	FilesListInput,
	FilesListResponse,
} from './types';
import {
	FilesCreateResponseSchema,
	FilesDeleteResponseSchema,
	FilesGetResponseSchema,
	FilesListResponseSchema,
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
	input: FilesListInput,
): Promise<FilesListResponse> => {
	const response = await makeChatbotkitRequest<FilesListResponse>(
		'file/list',
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

	const parsed = FilesListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.files.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: FilesGetInput,
): Promise<FilesGetResponse> => {
	const response = await makeChatbotkitRequest<FilesGetResponse>(
		`file/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = FilesGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.files.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: FilesCreateInput,
): Promise<FilesCreateResponse> => {
	const response = await makeChatbotkitRequest<FilesCreateResponse>(
		'file/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = FilesCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.files.create',
		{ id: parsed.id, name: input.name },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: FilesDeleteInput,
): Promise<FilesDeleteResponse> => {
	const response = await makeChatbotkitRequest<FilesDeleteResponse>(
		`file/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = FilesDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.files.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};
