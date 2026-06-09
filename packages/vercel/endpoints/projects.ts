import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelEndpoints } from '../index';
import type { VercelEndpointOutputs } from './types';

export const getProjects: VercelEndpoints['projectsGetProjects'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.limit) query.limit = input.limit;
	if (input.until) query.until = input.until;
	if (input.since) query.since = input.since;

	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['projectsGetProjects']
	>('/v9/projects', ctx, { query, teamId: input.teamId });

	if (result && result.projects && ctx.db.projects) {
		for (const project of result.projects) {
			await ctx.db.projects.upsertByEntityId(project.id, {
				...project,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'vercel.projects.getProjects',
		{ ...input },
		'completed',
	);
	return result;
};

export const getProject: VercelEndpoints['projectsGetProject'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['projectsGetProject']
	>(`/v9/projects/${encodeURIComponent(input.idOrName)}`, ctx, {
		teamId: input.teamId,
	});

	if (result && ctx.db.projects) {
		await ctx.db.projects.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'vercel.projects.getProject',
		{ ...input },
		'completed',
	);
	return result;
};
