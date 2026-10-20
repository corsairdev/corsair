import type { ApolloEndpoints } from '..';
import { saveNews } from './cache';
import { call } from './call';

export const search: ApolloEndpoints['newsSearch'] = async (ctx, input) => {
	const result = await call(
		ctx,
		'newsSearch',
		'news.search',
		'POST',
		'news_articles/search',
		input,
	);
	await saveNews(ctx, result.news_articles);
	return result;
};
