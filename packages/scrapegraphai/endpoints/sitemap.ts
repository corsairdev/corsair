import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type { SitemapHistoryResponse } from './types';

export const history: ScrapegraphAiEndpoints['sitemapHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<SitemapHistoryResponse>(
		'v1/history/sitemap',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.sitemap.history',
		{ ...input },
		'completed',
	);
	return response;
};
