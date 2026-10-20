import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const socialApiLookup: BuiltWithEndpoints['socialApiLookup'] = async (
	ctx,
	rawInput,
) => {
	const input = BuiltWithEndpointInputSchemas.socialApiLookup.parse(rawInput);
	const response = await makeBuiltWithRequest(
		'social1/api.json',
		ctx.key,
		BuiltWithEndpointOutputSchemas.socialApiLookup,
		{
			method: 'GET',
			query: {
				LOOKUP: input.lookup,
			},
		},
	);

	if (ctx.db.socialLinks) {
		try {
			for (const social of response.Socials ?? []) {
				for (const result of social.Results ?? []) {
					for (const domain of result.Domains ?? []) {
						const id = `${result.SocialUrl}|${domain.Root}`;
						await ctx.db.socialLinks.upsertByEntityId(id, {
							id,
							socialUrl: result.SocialUrl,
							root: domain.Root,
							builtWithRank: domain.BuiltWithRank,
						});
					}
				}
			}
		} catch (error) {
			console.warn('Failed to save BuiltWith social links to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'builtwith.social.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
