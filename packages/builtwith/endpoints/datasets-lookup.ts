import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const datasetsLookup: BuiltWithEndpoints['datasetsLookup'] = async (
	ctx,
	rawInput,
) => {
	const input = BuiltWithEndpointInputSchemas.datasetsLookup.parse(rawInput);
	const response = await makeBuiltWithRequest(
		'trends/v6/api.json',
		ctx.key,
		BuiltWithEndpointOutputSchemas.datasetsLookup,
		{
			method: 'GET',
			query: {
				TECH: input.tech,
				DATE: input.date,
			},
		},
	);

	const tech = response.Tech;
	if (tech && ctx.db.technologies) {
		try {
			await ctx.db.technologies.upsertByEntityId(tech.name, {
				id: tech.name,
				name: tech.name,
				description: tech.description,
				link: tech.link,
				icon: tech.icon,
				isPremium: tech.is_premium,
				tag: tech.tag,
				categories: tech.categories,
				trendsLink: tech.trends_link,
				coverage: tech.coverage && {
					tenK: tech.coverage.ten_k,
					hundredK: tech.coverage.hundred_k,
					million: tech.coverage.milly,
					live: tech.coverage.live,
					expired: tech.coverage.expired,
				},
			});
		} catch (error) {
			console.warn('Failed to save BuiltWith technology to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'builtwith.datasets.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
