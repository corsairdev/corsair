import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from '../client';
import type { ConfluenceEndpoints } from '../index';
import type { ConfluenceEndpointOutputs } from './types';

export const search: ConfluenceEndpoints['pagesSearch'] = async (
	ctx,
	input,
) => {
	const cloudUrl =
		ctx.options.cloudUrl ?? (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeConfluenceRequest<
		ConfluenceEndpointOutputs['pagesSearch']
	>('search', ctx.key, cloudUrl, {
		method: 'GET',
		query: {
			cql: input.cql,
			...(input.cqlcontext && { cqlcontext: input.cqlcontext }),
			...(input.includeArchivedSpaces !== undefined && {
				includeArchivedSpaces: input.includeArchivedSpaces,
			}),
			...(input.limit !== undefined && { limit: input.limit }),
			...(input.start !== undefined && { start: input.start }),
		},
	});

	await logEventFromContext(
		ctx,
		'confluence.pages.search',
		{ ...input },
		'completed',
	);

	return result;
};
