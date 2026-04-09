import { logEventFromContext } from 'corsair/core';
import type { TeamsEndpoints } from '..';
import { makeTeamsRequest } from '../client';
import type { TeamsEndpointOutputs } from './types';

export function toChannelRecord(
	channel: TeamsEndpointOutputs['channelsGet'],
	teamId: string,
) {
	// Destructure nullable fields so the spread captures only non-null-coerced extras
	const { email, webUrl, membershipType, createdDateTime, ...rest } = channel;
	return {
		...rest,
		id: channel.id,
		teamId,
		email: email ?? undefined,
		webUrl: webUrl ?? undefined,
		membershipType: membershipType ?? undefined,
		createdDateTime: createdDateTime ?? undefined,
		createdAt: createdDateTime ? new Date(createdDateTime) : undefined,
	};
}

export const list: TeamsEndpoints['channelsList'] = async (ctx, input) => {
	const { teamId, filter } = input;
	const query = {
		...(filter && { $filter: filter }),
	};

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsList']>(
		`teams/${teamId}/channels`,
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.channels) {
		try {
			for (const channel of result.value) {
				await ctx.db.channels.upsertByEntityId(
					channel.id,
					toChannelRecord(channel, teamId),
				);
			}
		} catch (error) {
			console.warn('Failed to save channels to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.channels.list',
		{ ...input },
		'completed',
	);
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
			await ctx.db.channels.upsertByEntityId(
				result.id,
				toChannelRecord(result, teamId),
			);
		} catch (error) {
			console.warn('Failed to save channel to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.channels.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TeamsEndpoints['channelsCreate'] = async (ctx, input) => {
	const { teamId, ...body } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsCreate']>(
		`teams/${teamId}/channels`,
		ctx.key,
		{
			method: 'POST',
			// Zod-inferred body type (input minus teamId) isn't assignable to Record<string, unknown> without a cast
			body: { ...body } as Record<string, unknown>,
		},
	);

	if (result.id && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(
				result.id,
				toChannelRecord(result, teamId),
			);
		} catch (error) {
			console.warn('Failed to save new channel to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'teams.channels.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TeamsEndpoints['channelsUpdate'] = async (ctx, input) => {
	const { teamId, channelId, ...body } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['channelsUpdate']>(
		`teams/${teamId}/channels/${channelId}`,
		ctx.key,
		{
			method: 'PATCH',
			// Zod-inferred body type (input minus teamId/channelId) isn't assignable to Record<string, unknown> without a cast
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

	await logEventFromContext(
		ctx,
		'teams.channels.update',
		{ ...input },
		'completed',
	);
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

	await logEventFromContext(
		ctx,
		'teams.channels.delete',
		{ ...input },
		'completed',
	);
	return result;
};
