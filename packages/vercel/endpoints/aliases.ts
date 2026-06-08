import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelEndpoints } from '../index';
import type { VercelEndpointOutputs } from './types';

export const getAliases: VercelEndpoints['aliasesGetAliases'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.limit) query.limit = input.limit;
	if (input.until) query.until = input.until;
	if (input.since) query.since = input.since;

	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['aliasesGetAliases']
	>('/v4/aliases', ctx, { query, teamId: input.teamId });

	if (result && result.aliases && ctx.db.aliases) {
		for (const alias of result.aliases) {
			await ctx.db.aliases.upsertByEntityId(alias.uid, {
				...alias,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'vercel.aliases.getAliases',
		{ ...input },
		'completed',
	);
	return result;
};

export const assignAlias: VercelEndpoints['aliasesAssignAlias'] = async (
	ctx,
	input,
) => {
	const { deploymentId, teamId, ...body } = input;
	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['aliasesAssignAlias']
	>(`/v2/deployments/${encodeURIComponent(deploymentId)}/aliases`, ctx, {
		method: 'POST',
		body,
		teamId,
	});

	if (result && ctx.db.aliases) {
		await ctx.db.aliases.upsertByEntityId(result.uid, {
			...result,
			deploymentId,
		});
	}

	await logEventFromContext(
		ctx,
		'vercel.aliases.assignAlias',
		{ ...input },
		'completed',
	);
	return result;
};
