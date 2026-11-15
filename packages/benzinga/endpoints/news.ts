import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './types';

export const getNews: BenzingaEndpoints['getNews'] = async (ctx, rawInput) => {
	const input = BenzingaEndpointInputSchemas.getNews.parse(rawInput);
	const raw = await makeBenzingaRequest<BenzingaEndpointOutputs['getNews']>(
		'/api/v2/news',
		ctx.key,
		{
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
	);
	const response = BenzingaEndpointOutputSchemas.getNews.parse(raw);

	// headline and abstract responses omit the body, so saving them would
	// overwrite a previously stored full article.
	if (input.displayOutput === undefined || input.displayOutput === 'full') {
		await persistEntities(ctx.db.newsArticles, response, (r) => String(r.id));
	}

	await logEventFromContext(
		ctx,
		'benzinga.news.get',
		{ ...input },
		'completed',
	);

	return response;
};
