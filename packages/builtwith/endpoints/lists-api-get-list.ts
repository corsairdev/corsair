import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const listsApiGetList: BuiltWithEndpoints['listsApiGetList'] = async (
	ctx,
	rawInput,
) => {
	const input = BuiltWithEndpointInputSchemas.listsApiGetList.parse(rawInput);
	const query: Record<string, string> = {
		TECH: input.tech,
	};

	if (input.otherTechs?.length) query.OTHERTECHS = input.otherTechs.join(',');
	if (input.all) query.ALL = 'yes';
	if (input.country) query.COUNTRY = input.country;
	if (input.meta) query.META = 'yes';
	if (input.offset) query.OFFSET = input.offset;
	if (input.since) query.SINCE = input.since;

	const response = await makeBuiltWithRequest(
		'lists13/api.json',
		ctx.key,
		BuiltWithEndpointOutputSchemas.listsApiGetList,
		{
			method: 'GET',
			query,
		},
	);

	if (response.Results && ctx.db.listSites) {
		try {
			for (const site of response.Results) {
				const id = `${input.tech}|${site.D}`;
				await ctx.db.listSites.upsertByEntityId(id, {
					id,
					tech: input.tech,
					domain: site.D,
					locations: site.LOS,
					firstDetected: site.FD,
					lastDetected: site.LD,
					monthlySpend: site.S,
					skuCount: site.SKU,
					salesRevenue: site.R,
					socialFollowers: site.F,
					employees: site.E,
					pageRank: site.A,
					trancoRank: site.Q,
					majesticRank: site.M,
					umbrellaRank: site.U,
					meta: site.META,
				});
			}
		} catch (error) {
			console.warn('Failed to save BuiltWith list sites to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'builtwith.lists.api.get_list',
		{ ...input },
		'completed',
	);

	return response;
};
