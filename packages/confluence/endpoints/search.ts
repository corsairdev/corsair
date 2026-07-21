import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from '../client';
import type { ConfluenceEndpoints } from '../index';
import { PagesSearchInputSchema, PagesSearchResponseSchema } from './types';

export const search: ConfluenceEndpoints['pagesSearch'] = async (
	ctx,
	input,
) => {
	const validated = PagesSearchInputSchema.parse(input);

	const cloudUrl =
		ctx.options.cloudUrl ?? (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeConfluenceRequest('search', ctx.key, cloudUrl, {
		method: 'GET',
		authType: ctx.options.authType,
		query: {
			cql: validated.cql,
			...(validated.cqlcontext && { cqlcontext: validated.cqlcontext }),
			...(validated.includeArchivedSpaces !== undefined && {
				includeArchivedSpaces: validated.includeArchivedSpaces,
			}),
			...(validated.limit !== undefined && { limit: validated.limit }),
			...(validated.start !== undefined && { start: validated.start }),
		},
	});

	await logEventFromContext(
		ctx,
		'confluence.pages.search',
		{ ...validated },
		'completed',
	);

	return PagesSearchResponseSchema.parse(result);
};
