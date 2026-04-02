import { logEventFromContext } from '../../utils/events';
import type { AhrefsEndpoints } from '..';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpointOutputs } from './types';

export const getOverview: AhrefsEndpoints['serpOverview'] = async (ctx, input) => {
	const result = await makeAhrefsRequest<AhrefsEndpointOutputs['serpOverview']>(
		'/v3/serp-overview',
		ctx.key,
		{ query: { ...input } },
	);

	if (result.successful && result.data?.results && ctx.db.keywords) {
		try {
			// Persist the target keyword's SERP position data
			await ctx.db.keywords.upsertByEntityId(`serp:${input.keyword}:${input.country}`, {
				id: `serp:${input.keyword}:${input.country}`,
				keyword: input.keyword,
				country: input.country,
				fetchedAt: new Date(),
			});

			// Also store each SERP result URL as a keyword record for tracking
			for (const serpItem of result.data.results) {
				// serpItem is Record<string, unknown>; url identifies the ranking page
				const url = serpItem['url'] as string | undefined;
				const position = serpItem['position'] as number | undefined;
				if (url) {
					await ctx.db.keywords.upsertByEntityId(
						`serp:${input.keyword}:${input.country}:${url}`,
						{
							id: `serp:${input.keyword}:${input.country}:${url}`,
							keyword: input.keyword,
							country: input.country,
							// Store position as volume proxy for ranking context
							...(position !== undefined ? { volume: position } : {}),
							fetchedAt: new Date(),
						},
					);
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save SERP overview:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.serp.getOverview', { ...input }, 'completed');
	return result;
};
