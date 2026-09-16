import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type {
	AgenticScraperGetLiveSessionUrlResponse,
	AgenticScraperHistoryResponse,
} from './types';

export const history: ScrapegraphAiEndpoints['agenticScraperHistory'] = async (
	ctx,
	input,
) => {
	const response =
		await makeScrapegraphAiRequest<AgenticScraperHistoryResponse>(
			'v1/history/agentic-scraper',
			ctx.key,
			{ method: 'GET', query: { ...input } },
		);

	await logEventFromContext(
		ctx,
		'scrapegraphai.agenticScraper.history',
		{ ...input },
		'completed',
	);
	return response;
};

export const getLiveSessionUrl: ScrapegraphAiEndpoints['agenticScraperGetLiveSessionUrl'] =
	async (ctx, input) => {
		const response =
			await makeScrapegraphAiRequest<AgenticScraperGetLiveSessionUrlResponse>(
				'v1/get-live-session-url',
				ctx.key,
				{ method: 'POST', body: input },
			);

		await logEventFromContext(
			ctx,
			'scrapegraphai.agenticScraper.getLiveSessionUrl',
			{ ...input },
			'completed',
		);
		return response;
	};
