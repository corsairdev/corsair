import { logEventFromContext } from 'corsair/core';
import type { TrelloEndpoints } from '..';
import { makeTrelloRequest } from '../client';
import type { TrelloEndpointOutputs } from './types';

export const get: TrelloEndpoints['listsGet'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['listsGet']>(
		`lists/${input.listId}`,
		ctx.key,
		{
			method: 'GET',
			query: { fields: input.fields },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save list to database:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.lists.get', { ...input }, 'completed');
	return result;
};

export const list: TrelloEndpoints['listsList'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['listsList']>(
		`boards/${input.boardId}/lists`,
		ctx.key,
		{
			method: 'GET',
			query: { filter: input.filter },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.lists) {
		try {
			for (const trelloList of result) {
				if (trelloList.id) {
					await ctx.db.lists.upsertByEntityId(trelloList.id, {
						...trelloList,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save lists to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.lists.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TrelloEndpoints['listsCreate'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['listsCreate']>(
		'lists',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save list to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.lists.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TrelloEndpoints['listsUpdate'] = async (ctx, input) => {
	const { listId, ...body } = input;

	const result = await makeTrelloRequest<TrelloEndpointOutputs['listsUpdate']>(
		`lists/${listId}`,
		ctx.key,
		{
			method: 'PUT',
			body: { ...body },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to update list in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.lists.update',
		{ listId },
		'completed',
	);
	return result;
};

export const archive: TrelloEndpoints['listsArchive'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['listsArchive']>(
		`lists/${input.listId}/closed`,
		ctx.key,
		{
			method: 'PUT',
			body: { value: true },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.lists) {
		try {
			await ctx.db.lists.upsertByEntityId(result.id, {
				...result,
				closed: true,
			});
		} catch (error) {
			console.warn('Failed to update list in database after archive:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.lists.archive',
		{ ...input },
		'completed',
	);
	return result;
};
