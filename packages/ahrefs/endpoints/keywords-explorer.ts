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
