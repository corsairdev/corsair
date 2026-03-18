import { logEventFromContext } from '../../utils/events';
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
				id: result.id,
				username: result.username,
				fullName: result.fullName,
				email: result.email,
				avatarUrl: result.avatarUrl,
				initials: result.initials,
				memberType: result.memberType,
			});
		} catch (error) {
			console.warn('Failed to save member to database:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.members.get', { ...input }, 'completed');
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
						id: member.id,
						username: member.username,
						fullName: member.fullName,
						email: member.email,
						avatarUrl: member.avatarUrl,
						initials: member.initials,
						memberType: member.memberType,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save members to database:', error);
		}
	}

	await logEventFromContext(ctx, 'trello.members.list', { ...input }, 'completed');
	return result;
};
