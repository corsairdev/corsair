import { logEventFromContext } from 'corsair/core';
import type { TeamsEndpoints } from '..';
import { makeTeamsRequest } from '../client';
import type { TeamsEndpointOutputs } from './types';

export const list: TeamsEndpoints['membersList'] = async (ctx, input) => {
	const { teamId, filter } = input;
	const query = {
		...(filter && { $filter: filter }),
	};

	const result = await makeTeamsRequest<TeamsEndpointOutputs['membersList']>(
		`teams/${teamId}/members`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.members) {
		try {
			for (const member of result.value) {
				await ctx.db.members.upsertByEntityId(member.id, {
					...member,
					id: member.id,
					teamId,
				});
			}
		} catch (error) {
			console.warn('Failed to save members to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.members.list', { teamId }, 'completed');
	return result;
};

export const get: TeamsEndpoints['membersGet'] = async (ctx, input) => {
	const { teamId, membershipId } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['membersGet']>(
		`teams/${teamId}/members/${membershipId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.members) {
		try {
			await ctx.db.members.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				teamId,
			});
		} catch (error) {
			console.warn('Failed to save member to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.members.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const add: TeamsEndpoints['membersAdd'] = async (ctx, input) => {
	const { teamId, userId, roles } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['membersAdd']>(
		`teams/${teamId}/members`,
		ctx.key,
		{
			method: 'POST',
			body: {
				'@odata.type': '#microsoft.graph.aadUserConversationMember',
				roles: roles ?? ['member'],
				'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${userId}')`,
			},
		},
	);

	if (result.id && ctx.db.members) {
		try {
			await ctx.db.members.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				teamId,
				// Fall back to the requested userId if the API doesn't echo it back
				userId: result.userId ?? userId,
			});
		} catch (error) {
			console.warn('Failed to save new member to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.members.add',
		{ teamId, userId },
		'completed',
	);
	return result;
};

export const remove: TeamsEndpoints['membersRemove'] = async (ctx, input) => {
	const { teamId, membershipId } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['membersRemove']>(
		`teams/${teamId}/members/${membershipId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.members) {
		try {
			await ctx.db.members.deleteByEntityId(membershipId);
		} catch (error) {
			console.warn('Failed to delete member from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.members.remove',
		{ ...input },
		'completed',
	);
	return result;
};
