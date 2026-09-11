import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type { ScrapeHistoryResponse } from './types';

export const history: ScrapegraphAiEndpoints['scrapeHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<ScrapeHistoryResponse>(
		'v1/history/scrape',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.scrape.history',
		{ ...input },
		'completed',
	);
	return response;
};
