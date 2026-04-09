import { logEventFromContext } from 'corsair/core';
import type { TrelloEndpoints } from '..';
import { makeTrelloRequest } from '../client';
import type { TrelloEndpointOutputs } from './types';

export const get: TrelloEndpoints['membersGet'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['membersGet']>(
		`members/${input.memberId}`,
		ctx.key,
		{
			method: 'GET',
			query: { fields: input.fields },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.members) {
		try {
			await ctx.db.members.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save member to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.members.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: TrelloEndpoints['membersList'] = async (ctx, input) => {
	const result = await makeTrelloRequest<TrelloEndpointOutputs['membersList']>(
		`boards/${input.boardId}/members`,
		ctx.key,
		{
			method: 'GET',
			query: { filter: input.filter },
		},
		ctx.options.trelloApiKey,
	);

	if (result && ctx.db.members) {
		try {
			for (const member of result) {
				if (member.id) {
					await ctx.db.members.upsertByEntityId(member.id, {
						...member,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save members to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'trello.members.list',
		{ ...input },
		'completed',
	);
	return result;
};
