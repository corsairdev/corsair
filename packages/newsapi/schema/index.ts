import { NewsApiArticleEntity, NewsApiSourceEntity } from './database';

export const NewsApiSchema = {
	version: '1.0.0',
	entities: {
		articles: NewsApiArticleEntity,
		sources: NewsApiSourceEntity,
	},
} as const;
