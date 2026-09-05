import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { makeCampaynRequest } from '../client';
import {
	DeleteListInputSchema,
	DeleteListResponseSchema,
	GetListsInputSchema,
	GetListsResponseSchema,
	UpdateListInputSchema,
	UpdateListResponseSchema,
} from './types';

export const getLists: CampaynEndpoints['getLists'] = async (ctx, rawInput) => {
	const input = GetListsInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>('lists.json', ctx.key, {
		method: 'GET',
	});
	const response = GetListsResponseSchema.parse(raw);

	await logEventFromContext(ctx, 'campayn.lists.getLists', input, 'completed');
	return response;
};

export const updateList: CampaynEndpoints['updateList'] = async (
	ctx,
	rawInput,
) => {
	const input = UpdateListInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>(
		`lists/${input.listId}.json`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				list_name: input.list_name,
				tags: input.tags,
			},
		},
	);
	const response = UpdateListResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.lists.updateList',
		{ listId: input.listId },
		'completed',
	);
	return response;
};

export const deleteList: CampaynEndpoints['deleteList'] = async (
	ctx,
	rawInput,
) => {
	const input = DeleteListInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest<unknown>(
		`lists/${input.listId}.json`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = DeleteListResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.lists.deleteList',
		{ listId: input.listId },
		'completed',
	);
	return response;
};
