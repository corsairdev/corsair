import { NewsApiArticle, NewsApiSource } from './database';

export const NewsApiSchema = {
	version: '1.0.0',
	entities: {
		articles: NewsApiArticle,
		sources: NewsApiSource,
	},
} as const;
