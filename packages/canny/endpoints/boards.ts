import { logEventFromContext } from 'corsair/core';
import { makeCannyRequest } from '../client';
import type { CannyEndpoints } from '../index';
import { CannyEndpointInputSchemas, CannyEndpointOutputSchemas } from './types';

export const list: CannyEndpoints['boardsList'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.boardsList.parse(input);
	const raw = await makeCannyRequest<unknown>('boards/list', ctx.key, {
		method: 'POST',
		body: parsedInput ? { ...parsedInput } : {},
	});
	const response = CannyEndpointOutputSchemas.boardsList.parse(raw);

	if (ctx.db.boards && response.boards) {
		for (const board of response.boards) {
			try {
				await ctx.db.boards.upsertByEntityId(board.id, {
					id: board.id,
					name: board.name,
					created: new Date(board.created),
					isPrivate: board.isPrivate,
					postCount: board.postCount,
					privateComments: board.privateComments,
					url: board.url,
					token: board.token,
				});
			} catch (error) {
				console.warn('Failed to persist board to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'canny.boards.list',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const retrieve: CannyEndpoints['boardsRetrieve'] = async (
	ctx,
	input,
) => {
	const parsedInput = CannyEndpointInputSchemas.boardsRetrieve.parse(input);
	const raw = await makeCannyRequest<unknown>('boards/retrieve', ctx.key, {
		method: 'POST',
		body: { id: parsedInput.id },
	});
	const response = CannyEndpointOutputSchemas.boardsRetrieve.parse(raw);

	if (ctx.db.boards && response.id) {
		try {
			await ctx.db.boards.upsertByEntityId(response.id, {
				id: response.id,
				name: response.name,
				created: new Date(response.created),
				isPrivate: response.isPrivate,
				postCount: response.postCount,
				privateComments: response.privateComments,
				url: response.url,
				token: response.token,
			});
		} catch (error) {
			console.warn('Failed to persist board to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.boards.retrieve',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const Boards = {
	list,
	retrieve,
};
