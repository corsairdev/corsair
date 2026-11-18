import { NewsApiSchema } from './schema';
import { NewsApiArticleEntity, NewsApiSourceEntity } from './schema/database';

describe('NewsAPI schema', () => {
	it('declares articles and sources', () => {
		expect(NewsApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(NewsApiSchema.entities).sort()).toEqual([
			'articles',
			'sources',
		]);
	});

	it('rejects an article with no url id', () => {
		expect(NewsApiArticleEntity.safeParse({ title: 'Hello' }).success).toBe(
			false,
		);
		expect(
			NewsApiSourceEntity.parse({ id: 'bbc-news', name: 'BBC' }).name,
		).toBe('BBC');
	});
});
