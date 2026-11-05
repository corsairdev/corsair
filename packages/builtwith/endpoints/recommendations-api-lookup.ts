import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const recommendationsApiLookup: BuiltWithEndpoints['recommendationsApiLookup'] =
	async (ctx, rawInput) => {
		const input =
			BuiltWithEndpointInputSchemas.recommendationsApiLookup.parse(rawInput);
		const response = await makeBuiltWithRequest(
			'rec1/api.json',
			ctx.key,
			BuiltWithEndpointOutputSchemas.recommendationsApiLookup,
			{
				method: 'GET',
				query: {
					LOOKUP: input.lookup,
				},
			},
		);

		if (ctx.db.recommendations) {
			try {
				for (const rec of response.Recommendations ?? []) {
					for (const tech of rec.Recommendations ?? []) {
						const id = `${rec.Domain}|${tech.name}`;
						await ctx.db.recommendations.upsertByEntityId(id, {
							id,
							domain: rec.Domain,
							compiled: rec.Compiled,
							name: tech.name,
							link: tech.link,
							tag: tech.tag,
							categories: tech.categories,
							stars: tech.stars,
							match: tech.match,
						});
					}
				}
			} catch (error) {
				console.warn(
					'Failed to save BuiltWith recommendations to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'builtwith.recommendations.api.lookup',
			{ ...input },
			'completed',
		);

		return response;
	};
