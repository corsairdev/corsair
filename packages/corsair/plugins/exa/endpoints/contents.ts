import { logEventFromContext } from '../../utils/events';
import type { ExaEndpoints } from '..';
import { makeExaRequest } from '../client';
import type { ExaEndpointOutputs } from './types';

export const getContents: ExaEndpoints['contentsGet'] = async (ctx, input) => {
	const result = await makeExaRequest<ExaEndpointOutputs['contentsGet']>(
		'contents',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	if (result.results && ctx.db.searchResults) {
		try {
			for (const searchResult of result.results) {
				await ctx.db.searchResults.upsertByEntityId(searchResult.id, {
					...searchResult,
					createdAt: searchResult.publishedDate
						? new Date(searchResult.publishedDate)
						: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save contents to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.contents.get',
		{ idCount: input.ids.length },
		'completed',
	);
	return result;
};
