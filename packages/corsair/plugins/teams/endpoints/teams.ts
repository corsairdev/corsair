import type { TeamsEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeTeamsRequest } from '../client';
import type { TeamsEndpointOutputs } from './types';

export const list: TeamsEndpoints['teamsList'] = async (ctx, input) => {
	const { filter, select, top, skipToken } = input;
	const query = {
		...(filter && { '$filter': filter }),
		...(select && { '$select': select }),
		...(top && { '$top': top }),
		...(skipToken && { '$skiptoken': skipToken }),
	};

	const result = await makeTeamsRequest<TeamsEndpointOutputs['teamsList']>(
		'teams',
		ctx.key,
		{ method: 'GET', query },
	);

	if (result.value && ctx.db.teams) {
		try {
			for (const team of result.value) {
				await ctx.db.teams.upsertByEntityId(team.id, {
					id: team.id,
					displayName: team.displayName,
					description: team.description,
					internalId: team.internalId ?? undefined,
					classification: team.classification,
					specialization: team.specialization ?? undefined,
					visibility: team.visibility ?? undefined,
					webUrl: team.webUrl ?? undefined,
					isArchived: team.isArchived ?? undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save teams to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.teams.list', { ...input }, 'completed');
	return result;
};

export const get: TeamsEndpoints['teamsGet'] = async (ctx, input) => {
	const result = await makeTeamsRequest<TeamsEndpointOutputs['teamsGet']>(
		`teams/${input.teamId}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(result.id, {
				id: result.id,
				displayName: result.displayName,
				description: result.description,
				internalId: result.internalId ?? undefined,
				classification: result.classification,
				specialization: result.specialization ?? undefined,
				visibility: result.visibility ?? undefined,
				webUrl: result.webUrl ?? undefined,
				isArchived: result.isArchived ?? undefined,
			});
		} catch (error) {
			console.warn('Failed to save team to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.teams.get', { ...input }, 'completed');
	return result;
};

export const create: TeamsEndpoints['teamsCreate'] = async (ctx, input) => {
	const result = await makeTeamsRequest<TeamsEndpointOutputs['teamsCreate']>(
		'teams',
		ctx.key,
		{
			method: 'POST',
			body: { ...input } as Record<string, unknown>,
		},
	);

	if (result?.id && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(result.id, {
				id: result.id,
				displayName: result.displayName,
				description: result.description,
			});
		} catch (error) {
			console.warn('Failed to save new team to database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.teams.create', { ...input }, 'completed');
	return result ?? {};
};

export const update: TeamsEndpoints['teamsUpdate'] = async (ctx, input) => {
	const { teamId, ...body } = input;

	const result = await makeTeamsRequest<TeamsEndpointOutputs['teamsUpdate']>(
		`teams/${teamId}`,
		ctx.key,
		{
			method: 'PATCH',
			body: { ...body } as Record<string, unknown>,
		},
	);

	if (ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(teamId, {
				...body,
				id: teamId,
			});
		} catch (error) {
			console.warn('Failed to update team in database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.teams.update', { ...input }, 'completed');
	return result;
};

export const remove: TeamsEndpoints['teamsDelete'] = async (ctx, input) => {
	const result = await makeTeamsRequest<TeamsEndpointOutputs['teamsDelete']>(
		`teams/${input.teamId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.teams) {
		try {
			await ctx.db.teams.deleteByEntityId(input.teamId);
		} catch (error) {
			console.warn('Failed to delete team from database:', error);
		}
	}

	await logEventFromContext(ctx, 'teams.teams.delete', { ...input }, 'completed');
	return result;
};
