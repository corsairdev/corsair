import { logEventFromContext } from '../../utils/events';
import type { TrelloEndpoints } from '..';
import { makeTrelloRequest } from '../client';
import type { TrelloEndpointOutputs } from './types';

export const get: TrelloEndpoints['cardsGet'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['cardsGet']>(
		`cards/${input.cardId}`,
		ctx.key,
		{
			method: 'GET',
			query: { fields: input.fields },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.cards) {
		try {
			await ctx.db.cards.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				desc: result.desc,
				closed: result.closed,
				idBoard: result.idBoard,
				idList: result.idList,
				pos: result.pos,
				due: result.due,
				dueComplete: result.dueComplete,
				url: result.url,
				shortUrl: result.shortUrl,
				idMembers: result.idMembers,
				idLabels: result.idLabels,
			});
		} catch (error) {
			console.warn('Failed to save card to database:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.cards.get', { ...input }, 'completed');
	return result;
};

export const list: TrelloEndpoints['cardsList'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['cardsList']>(
		`lists/${input.listId}/cards`,
		ctx.key,
		{
			method: 'GET',
			query: {
				filter: input.filter,
				fields: input.fields,
				limit: input.limit,
				before: input.before,
				since: input.since,
			},
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.cards) {
		try {
			for (const card of result) {
				if (card.id) {
					await ctx.db.cards.upsertByEntityId(card.id, {
						id: card.id,
						name: card.name,
						desc: card.desc,
						closed: card.closed,
						idBoard: card.idBoard,
						idList: card.idList,
						pos: card.pos,
						due: card.due,
						dueComplete: card.dueComplete,
						url: card.url,
						shortUrl: card.shortUrl,
						idMembers: card.idMembers,
						idLabels: card.idLabels,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save cards to database:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.cards.list', { ...input }, 'completed');
	return result;
};

export const create: TrelloEndpoints['cardsCreate'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['cardsCreate']>(
		'cards',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.cards) {
		try {
			await ctx.db.cards.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				desc: result.desc,
				closed: result.closed,
				idBoard: result.idBoard,
				idList: result.idList,
				pos: result.pos,
				due: result.due,
				dueComplete: result.dueComplete,
				url: result.url,
				shortUrl: result.shortUrl,
				idMembers: result.idMembers,
				idLabels: result.idLabels,
			});
		} catch (error) {
			console.warn('Failed to save card to database:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.cards.create', { ...input }, 'completed');
	return result;
};

export const update: TrelloEndpoints['cardsUpdate'] = async (ctx, input) => {
	const { cardId, ...body } = input;

	const result = await makeTrelloRequest<TrelloEndpointOutputs['cardsUpdate']>(
		`cards/${cardId}`,
		ctx.key,
		{
			method: 'PUT',
			body: { ...body },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.cards) {
		try {
			await ctx.db.cards.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				desc: result.desc,
				closed: result.closed,
				idBoard: result.idBoard,
				idList: result.idList,
				pos: result.pos,
				due: result.due,
				dueComplete: result.dueComplete,
				url: result.url,
				shortUrl: result.shortUrl,
				idMembers: result.idMembers,
				idLabels: result.idLabels,
			});
		} catch (error) {
			console.warn('Failed to update card in database:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.cards.update', { cardId }, 'completed');
	return result;
};

export const del: TrelloEndpoints['cardsDelete'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['cardsDelete']>(
		`cards/${input.cardId}`,
		ctx.key,
		{
			method: 'DELETE',
		},
		ctx.options.trelloApiKey,
	);

	if (ctx.db.cards) {
		try {
			const existing = await ctx.db.cards.findByEntityId(input.cardId);
			if (existing) {
				await ctx.db.cards.upsertByEntityId(input.cardId, {
					...existing.data,
					closed: true,
				});
			}
		} catch (error) {
			console.warn('Failed to update card in database after deletion:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.cards.delete', { ...input }, 'completed');
	return result;
};

export const move: TrelloEndpoints['cardsMove'] = async (ctx, input) => {
	const { cardId, ...body } = input;

	const result = await makeTrelloRequest<TrelloEndpointOutputs['cardsMove']>(
		`cards/${cardId}`,
		ctx.key,
		{
			method: 'PUT',
			body: { ...body },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.cards) {
		try {
			await ctx.db.cards.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				desc: result.desc,
				closed: result.closed,
				idBoard: result.idBoard,
				idList: result.idList,
				pos: result.pos,
				due: result.due,
				dueComplete: result.dueComplete,
				url: result.url,
				shortUrl: result.shortUrl,
				idMembers: result.idMembers,
				idLabels: result.idLabels,
			});
		} catch (error) {
			console.warn('Failed to update card in database after move:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.cards.move', { cardId, idList: input.idList }, 'completed');
	return result;
};
