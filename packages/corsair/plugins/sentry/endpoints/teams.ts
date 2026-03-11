import { logEventFromContext } from '../../utils/events';
import type { SentryEndpoints } from '..';
import type { SentryEndpointOutputs } from './types';
import { makeSentryRequest } from '../client';

export const get: SentryEndpoints['teamsGet'] = async (ctx, input) => {
	const response = await makeSentryRequest<SentryEndpointOutputs['teamsGet']>(
		`teams/${input.organizationSlug}/${input.teamSlug}/`,
		ctx.key,
		{ method: 'GET' },
	);

	if (response && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(response.id, {
				...response,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save team to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.teams.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: SentryEndpoints['teamsList'] = async (ctx, input) => {
	const response = await makeSentryRequest<SentryEndpointOutputs['teamsList']>(
		`organizations/${input.organizationSlug}/teams/`,
		ctx.key,
		{
			method: 'GET',
			query: {
				cursor: input.cursor,
			},
		},
	);

	if (response && ctx.db.teams) {
		try {
			for (const team of response) {
				await ctx.db.teams.upsertByEntityId(team.id, {
					...team,
					dateCreated: team.dateCreated
						? new Date(team.dateCreated)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to save teams to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.teams.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: SentryEndpoints['teamsCreate'] = async (ctx, input) => {
	const { organizationSlug, ...createData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['teamsCreate']
	>(`organizations/${organizationSlug}/teams/`, ctx.key, {
		method: 'POST',
		body: createData as Record<string, unknown>,
	});

	if (response && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(response.id, {
				...response,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save team to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.teams.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: SentryEndpoints['teamsUpdate'] = async (ctx, input) => {
	const { organizationSlug, teamSlug, ...updateData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['teamsUpdate']
	>(`teams/${organizationSlug}/${teamSlug}/`, ctx.key, {
		method: 'PUT',
		body: updateData as Record<string, unknown>,
	});

	if (response && ctx.db.teams) {
		try {
			await ctx.db.teams.upsertByEntityId(response.id, {
				...response,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to update team in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.teams.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteTeam: SentryEndpoints['teamsDelete'] = async (
	ctx,
	input,
) => {
	await makeSentryRequest<void>(
		`teams/${input.organizationSlug}/${input.teamSlug}/`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'sentry.teams.delete',
		{ ...input },
		'completed',
	);
	return true;
};
