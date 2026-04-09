import { logEventFromContext } from 'corsair/core';
import type { TrelloEndpoints } from '..';
import { makeTrelloRequest } from '../client';
import type { TrelloEndpointOutputs } from './types';

export const get: TrelloEndpoints['checklistsGet'] = async (ctx, input) => {
	const { checklistId, ...queryParams } = input;
	const result = await makeTrelloRequest<
		TrelloEndpointOutputs['checklistsGet']
	>(
		`checklists/${checklistId}`,
		ctx.key,
		{
			method: 'GET',
			query: queryParams,
		},
		ctx.options.trelloApiKey,
	);

	await logEventFromContext(
		ctx,
		'trello.checklists.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TrelloEndpoints['checklistsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTrelloRequest<
		TrelloEndpointOutputs['checklistsCreate']
	>(
		'checklists',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
		ctx.options.trelloApiKey,
	);

	await logEventFromContext(
		ctx,
		'trello.checklists.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const del: TrelloEndpoints['checklistsDelete'] = async (ctx, input) => {
	const result = await makeTrelloRequest<
		TrelloEndpointOutputs['checklistsDelete']
	>(
		`checklists/${input.checklistId}`,
		ctx.key,
		{
			method: 'DELETE',
		},
		ctx.options.trelloApiKey,
	);

	await logEventFromContext(
		ctx,
		'trello.checklists.delete',
		{ ...input },
		'completed',
	);
	return result;
};
