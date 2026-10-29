import { logEventFromContext } from 'corsair/core';
import { makeChatbotkitRequest } from '../client';
import type { ChatbotkitContext } from '../index';
import type {
	DatasetsCreateInput,
	DatasetsCreateResponse,
	DatasetsDeleteInput,
	DatasetsDeleteResponse,
	DatasetsGetInput,
	DatasetsGetResponse,
	DatasetsListInput,
	DatasetsListResponse,
	DatasetsSearchInput,
	DatasetsSearchResponse,
	DatasetsUpdateInput,
	DatasetsUpdateResponse,
} from './types';
import {
	DatasetsCreateResponseSchema,
	DatasetsDeleteResponseSchema,
	DatasetsGetResponseSchema,
	DatasetsListResponseSchema,
	DatasetsSearchResponseSchema,
	DatasetsUpdateResponseSchema,
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
	input: DatasetsListInput,
): Promise<DatasetsListResponse> => {
	const response = await makeChatbotkitRequest<DatasetsListResponse>(
		'dataset/list',
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

	const parsed = DatasetsListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.datasets.list',
		{ cursor: input.cursor, limit: input.limit, order: input.order },
		'completed',
	);
	return parsed;
};

export const get = async (
	ctx: ChatbotkitContext,
	input: DatasetsGetInput,
): Promise<DatasetsGetResponse> => {
	const response = await makeChatbotkitRequest<DatasetsGetResponse>(
		`dataset/${encodeURIComponent(input.id)}/fetch`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = DatasetsGetResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.datasets.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

export const create = async (
	ctx: ChatbotkitContext,
	input: DatasetsCreateInput,
): Promise<DatasetsCreateResponse> => {
	const response = await makeChatbotkitRequest<DatasetsCreateResponse>(
		'dataset/create',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	const parsed = DatasetsCreateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.datasets.create',
		{ id: parsed.id, name: input.name },
		'completed',
	);
	return parsed;
};

export const update = async (
	ctx: ChatbotkitContext,
	input: DatasetsUpdateInput,
): Promise<DatasetsUpdateResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<DatasetsUpdateResponse>(
		`dataset/${encodeURIComponent(id)}/update`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = DatasetsUpdateResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.datasets.update',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const del = async (
	ctx: ChatbotkitContext,
	input: DatasetsDeleteInput,
): Promise<DatasetsDeleteResponse> => {
	const response = await makeChatbotkitRequest<DatasetsDeleteResponse>(
		`dataset/${encodeURIComponent(input.id)}/delete`,
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);

	const parsed = DatasetsDeleteResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.datasets.delete',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

export const search = async (
	ctx: ChatbotkitContext,
	input: DatasetsSearchInput,
): Promise<DatasetsSearchResponse> => {
	const { id, ...body } = input;
	const response = await makeChatbotkitRequest<DatasetsSearchResponse>(
		`dataset/${encodeURIComponent(id)}/search`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	const parsed = DatasetsSearchResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'chatbotkit.datasets.search',
		{ id },
		'completed',
	);
	return parsed;
};
