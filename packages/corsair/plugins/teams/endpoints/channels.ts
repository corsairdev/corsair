import type { TeamsEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeTeamsRequest } from '../client';
import type { TeamsEndpointOutputs } from './types';

export const list: TeamsEndpoints['channelsList'] = async (ctx, input) => {
	const { teamId, filter } = input;
	const query = {
		...(filter && { '$filter': filter }),
	};

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsList']>(
		`teams/${teamId}/channels`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.channels) {
		try {
			for (const channel of result.value) {
				await ctx.db.channels.upsertByEntityId(channel.id, {
					id: channel.id,
					teamId,
					displayName: channel.displayName,
					description: channel.description,
					email: channel.email ?? undefined,
					webUrl: channel.webUrl ?? undefined,
					membershipType: channel.membershipType ?? undefined,
					isFavoriteByDefault: channel.isFavoriteByDefault,
					createdDateTime: channel.createdDateTime ?? undefined,
					createdAt: channel.createdDateTime ? new Date(channel.createdDateTime) : undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save channels to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.channels.list', { ...input }, 'completed');
	return result;
};

export const get: TeamsEndpoints['channelsGet'] = async (ctx, input) => {
	const { teamId, channelId } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsGet']>(
		`teams/${teamId}/channels/${channelId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.id, {
				id: result.id,
				teamId,
				displayName: result.displayName,
				description: result.description,
				email: result.email ?? undefined,
				webUrl: result.webUrl ?? undefined,
				membershipType: result.membershipType ?? undefined,
				isFavoriteByDefault: result.isFavoriteByDefault,
				createdDateTime: result.createdDateTime ?? undefined,
				createdAt: result.createdDateTime ? new Date(result.createdDateTime) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.channels.get', { ...input }, 'completed');
	return result;
};

export const create: TeamsEndpoints['channelsCreate'] = async (ctx, input) => {
	const { teamId, ...body } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsCreate']>(
		`teams/${teamId}/channels`,
		ctx.key,
		{
			method: 'POST',
			body: { ...body } as Record<string, unknown>,
		},
	);

	if (result.id && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(result.id, {
				id: result.id,
				teamId,
				displayName: result.displayName,
				description: result.description,
				email: result.email ?? undefined,
				webUrl: result.webUrl ?? undefined,
				membershipType: result.membershipType ?? undefined,
				isFavoriteByDefault: result.isFavoriteByDefault,
				createdDateTime: result.createdDateTime ?? undefined,
				createdAt: result.createdDateTime ? new Date(result.createdDateTime) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save new channel to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.channels.create', { ...input }, 'completed');
	return result;
};

export const update: TeamsEndpoints['channelsUpdate'] = async (ctx, input) => {
	const { teamId, channelId, ...body } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsUpdate']>(
		`teams/${teamId}/channels/${channelId}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { ...body } as Record<string, unknown>,
		},
	);

	if (ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(channelId, {
				...body,
				id: channelId,
				teamId,
			});
		} catch (error) {
			console.warn('Failed to update channel in database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.channels.update', { ...input }, 'completed');
	return result;
};

export const remove: TeamsEndpoints['channelsDelete'] = async (ctx, input) => {
	const { teamId, channelId } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsDelete']>(
		`teams/${teamId}/channels/${channelId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.channels) {
		try {
			await ctx.db.channels.deleteByEntityId(channelId);
		} catch (error) {
			console.warn('Failed to delete channel from database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.channels.delete', { ...input }, 'completed');
	return result;
};
