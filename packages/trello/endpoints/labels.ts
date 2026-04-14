import { logEventFromContext } from 'corsair/core';
import type { TrelloEndpoints } from '..';
import { makeTrelloRequest } from '../client';
import type { TrelloEndpointOutputs } from './types';

export const list: TrelloEndpoints['labelsList'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['labelsList']>(
		`boards/${input.boardId}/labels`,
		ctx.key,
		{
			method: 'GET',
			query: {
				fields: input.fields,
				limit: input.limit,
			},
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.labels) {
		try {
			for (const label of result) {
				if (label.id) {
					await ctx.db.labels.upsertByEntityId(label.id, {
						...label,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save labels to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.labels.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TrelloEndpoints['labelsCreate'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['labelsCreate']>(
		'labels',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.labels) {
		try {
			await ctx.db.labels.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save label to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.labels.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TrelloEndpoints['labelsUpdate'] = async (ctx, input) => {
	const { labelId, ...body } = input;

	const result = await makeTrelloRequest<TrelloEndpointOutputs['labelsUpdate']>(
		`labels/${labelId}`,
		ctx.key,
		{
			method: 'PUT',
			body: { ...body },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.labels) {
		try {
			await ctx.db.labels.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to update label in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.labels.update',
		{ labelId },
		'completed',
	);
	return result;
};

export const del: TrelloEndpoints['labelsDelete'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['labelsDelete']>(
		`labels/${input.labelId}`,
		ctx.key,
		{
			method: 'DELETE',
		},
		ctx.options.trelloApiKey,
	);

	await logEventFromContext(
		ctx,
		'trello.labels.delete',
		{ ...input },
		'completed',
	);
	return result;
};
