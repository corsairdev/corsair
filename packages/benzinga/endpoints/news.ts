import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const getNews: BenzingaEndpoints['getNews'] = async (ctx, input) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['getNews']
	>('/api/v2/news', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			pageSize: input.pageSize,
			displayOutput: input.displayOutput,
			date: input.date,
			dateFrom: input.dateFrom,
			dateTo: input.dateTo,
			updatedSince: input.updatedSince,
			publishedSince: input.publishedSince,
			sort: input.sort,
			isin: input.isin,
			cusips: input.cusips,
			tickers: input.tickers,
			primaryTickers: input.primaryTickers,
			channels: input.channels,
			topics: input.topics,
			topic_group_by: input.topic_group_by,
			authors: input.authors,
			content_types: input.content_types,
			format: input.format,
			importance: input.importance,
			importanceRank: input.importanceRank,
			region: input.region,
		},
	});

	await logEventFromContext(
		ctx,
		'benzinga.news.get',
		{ ...input },
		'completed',
	);

	return response;
};
