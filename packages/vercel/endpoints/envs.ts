import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelEndpoints } from '../index';
import type { VercelEndpointOutputs } from './types';

export const getEnvVariables: VercelEndpoints['envsGetEnvVariables'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['envsGetEnvVariables']
	>(`/v9/projects/${encodeURIComponent(input.idOrName)}/env`, ctx, {
		teamId: input.teamId,
	});

	if (result && result.envs && ctx.db.envs) {
		for (const env of result.envs) {
			await ctx.db.envs.upsertByEntityId(env.id, {
				...env,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'vercel.envs.getEnvVariables',
		{ ...input },
		'completed',
	);
	return result;
};

export const createEnvVariable: VercelEndpoints['envsCreateEnvVariable'] =
	async (ctx, input) => {
		const { idOrName, teamId, ...body } = input;
		const result = await makeAuthenticatedVercelRequest<
			VercelEndpointOutputs['envsCreateEnvVariable']
		>(`/v10/projects/${encodeURIComponent(idOrName)}/env`, ctx, {
			method: 'POST',
			body,
			teamId,
		});

		if (result && ctx.db.envs) {
			await ctx.db.envs.upsertByEntityId(result.id, {
				...result,
			});
		}

		await logEventFromContext(
			ctx,
			'vercel.envs.createEnvVariable',
			{ ...input },
			'completed',
		);
		return result;
	};
