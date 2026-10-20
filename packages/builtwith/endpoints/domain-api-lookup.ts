import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const domainApiLookup: BuiltWithEndpoints['domainApiLookup'] = async (
	ctx,
	rawInput,
) => {
	const input = BuiltWithEndpointInputSchemas.domainApiLookup.parse(rawInput);
	const query: Record<string, string> = {
		LOOKUP: input.lookup,
	};

	if (input.hidedl) query.HIDEDL = 'yes';
	if (input.hidetext) query.HIDETEXT = 'yes';
	if (input.liveonly) query.LIVEONLY = 'yes';
	if (input.nometa) query.NOMETA = 'yes';
	if (input.nopii) query.NOPII = 'yes';
	if (input.noattr) query.NOATTR = 'yes';
	if (input.trust) query.TRUST = 'yes';
	if (input.fdrange) query.FDRANGE = input.fdrange;
	if (input.ldrange) query.LDRANGE = input.ldrange;

	const response = await makeBuiltWithRequest(
		'v26/api.json',
		ctx.key,
		BuiltWithEndpointOutputSchemas.domainApiLookup,
		{
			method: 'GET',
			query,
		},
	);

	if (ctx.db.domains || ctx.db.domainTechnologies) {
		try {
			for (const entry of response.Results ?? []) {
				const domain = entry.Lookup;
				if (!domain) continue;
				await ctx.db.domains?.upsertByEntityId(domain, {
					id: domain,
					lookup: domain,
					isDb: entry.Result?.IsDB,
					spend: entry.Result?.Spend,
					salesRevenue: entry.Result?.SalesRevenue,
					meta: entry.Meta,
					attributes: entry.Attributes,
					firstIndexed: entry.FirstIndexed,
					lastIndexed: entry.LastIndexed,
				});
				for (const path of entry.Result?.Paths ?? []) {
					for (const tech of path.Technologies ?? []) {
						const id = `${domain}|${path.SubDomain ?? ''}|${tech.Name}`;
						await ctx.db.domainTechnologies?.upsertByEntityId(id, {
							id,
							domain,
							subDomain: path.SubDomain,
							name: tech.Name,
							technologyId: tech.Id,
							parent: tech.Parent,
							description: tech.Description,
							link: tech.Link,
							confidence: tech.confidence,
							isPremium: tech.IsPremium,
							tag: tech.Tag,
							categories: tech.Categories,
							firstDetected: tech.FirstDetected,
							lastDetected: tech.LastDetected,
						});
					}
				}
			}
		} catch (error) {
			console.warn('Failed to save BuiltWith domains to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'builtwith.domain.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
