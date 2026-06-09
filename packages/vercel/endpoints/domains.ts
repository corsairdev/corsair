import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelEndpoints } from '../index';
import type { VercelEndpointOutputs } from './types';

export const getDomains: VercelEndpoints['domainsGetDomains'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.limit) query.limit = input.limit;
	if (input.until) query.until = input.until;
	if (input.since) query.since = input.since;

	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['domainsGetDomains']
	>('/v5/domains', ctx, { query, teamId: input.teamId });

	if (result && result.domains && ctx.db.domains) {
		for (const domain of result.domains) {
			await ctx.db.domains.upsertByEntityId(domain.name, {
				...domain,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'vercel.domains.getDomains',
		{ ...input },
		'completed',
	);
	return result;
};

export const getProjectDomains: VercelEndpoints['domainsGetProjectDomains'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean | undefined> = {};
		if (input.limit) query.limit = input.limit;
		if (input.until) query.until = input.until;
		if (input.since) query.since = input.since;

		const result = await makeAuthenticatedVercelRequest<
			VercelEndpointOutputs['domainsGetProjectDomains']
		>(`/v9/projects/${encodeURIComponent(input.idOrName)}/domains`, ctx, {
			query,
			teamId: input.teamId,
		});

		if (result && result.domains && ctx.db.domains) {
			for (const domain of result.domains) {
				await ctx.db.domains.upsertByEntityId(domain.name, {
					...domain,
					id: domain.name,
				});
			}
		}

		await logEventFromContext(
			ctx,
			'vercel.domains.getProjectDomains',
			{ ...input },
			'completed',
		);
		return result;
	};
