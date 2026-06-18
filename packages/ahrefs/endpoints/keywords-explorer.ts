import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type { KeywordsOverviewResponse } from './types';

export const overview: AhrefsEndpoints['keywordsOverview'] = async (
	ctx,
	input,
) => {
	const keywords = Array.isArray(input.keywords)
		? input.keywords.join(',')
		: input.keywords;

	const response = await makeAhrefsRequest<KeywordsOverviewResponse>(
		'/keywords-explorer/overview',
		ctx.key,
		{
			query: {
				...input,
				keywords,
			},
		},
	);

	// Sync keywords to database
	for (const keyword of response.keywords) {
		if (!keyword.keyword) continue;

		try {
			const entityId = [
				input.target || 'global',
				input.country,
				keyword.keyword,
			].join(':');

			await ctx.db.keywords.upsertByEntityId(entityId, {
				...keyword,
				target: input.target,
				country: input.country,
				date: new Date().toISOString().split('T')[0], // current date
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[ahrefs] Failed to save keyword ${keyword.keyword}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'ahrefs.keywordsExplorer.overview',
		{
			country: input.country,
			keywords,
			keyword_list_id: input.keyword_list_id,
			target: input.target,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};
