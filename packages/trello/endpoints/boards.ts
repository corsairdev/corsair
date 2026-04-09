import { logEventFromContext } from 'corsair/core';
import type { TrelloEndpoints } from '..';
import { makeTrelloRequest } from '../client';
import type { TrelloEndpointOutputs } from './types';

export const get: TrelloEndpoints['boardsGet'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['boardsGet']>(
		`boards/${input.boardId}`,
		ctx.key,
		{
			method: 'GET',
			query: { fields: input.fields },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.boards) {
		try {
			await ctx.db.boards.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save board to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.boards.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: TrelloEndpoints['boardsList'] = async (ctx, input) => {
	const memberId = input.memberId ?? 'me';

	const result = await makeTrelloRequest<TrelloEndpointOutputs['boardsList']>(
		`members/${memberId}/boards`,
		ctx.key,
		{
			method: 'GET',
			query: {
				filter: input.filter,
				fields: input.fields,
			},
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.boards) {
		try {
			for (const board of result) {
				if (board.id) {
					await ctx.db.boards.upsertByEntityId(board.id, {
						...board,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save boards to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.boards.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TrelloEndpoints['boardsCreate'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['boardsCreate']>(
		'boards',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.boards) {
		try {
			await ctx.db.boards.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save board to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.boards.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TrelloEndpoints['boardsUpdate'] = async (ctx, input) => {
	const { boardId, ...body } = input;

	const result = await makeTrelloRequest<TrelloEndpointOutputs['boardsUpdate']>(
		`boards/${boardId}`,
		ctx.key,
		{
			method: 'PUT',
			body: { ...body },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.boards) {
		try {
			await ctx.db.boards.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to update board in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.boards.update',
		{ boardId },
		'completed',
	);
	return result;
};

export const del: TrelloEndpoints['boardsDelete'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['boardsDelete']>(
		`boards/${input.boardId}`,
		ctx.key,
		{
			method: 'DELETE',
		},
		ctx.options.trelloApiKey,
	);

	if (ctx.db.boards) {
		try {
			const existing = await ctx.db.boards.findByEntityId(input.boardId);
			if (existing) {
				await ctx.db.boards.upsertByEntityId(input.boardId, {
					...existing.data,
					closed: true,
				});
			}
		} catch (error) {
			console.warn('Failed to update board in database after deletion:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.boards.delete',
		{ ...input },
		'completed',
	);
	return result;
};
