import { NewsApiSchema } from './schema';
import { NewsApiArticle, NewsApiSource } from './schema/database';

describe('NewsApi schema', () => {
	it('declares a semver version', () => {
		expect(NewsApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all registered entities', () => {
		expect(Object.keys(NewsApiSchema.entities).sort()).toEqual([
			'articles',
			'sources',
		]);
	});

	describe('entity parsing', () => {
		it('parses an Article record keyed by url', () => {
			const article = NewsApiArticle.parse({
				url: 'https://example.com/article',
				source: { id: 'example-source', name: 'Example' },
				author: 'Jane Doe',
				title: 'Test article',
				description: 'A test article',
				publishedAt: '2026-08-24T00:00:00Z',
				content: 'Content body',
			});
			expect(article.url).toBe('https://example.com/article');
			expect(article.source?.id).toBe('example-source');
			expect(article.publishedAt).toBeInstanceOf(Date);
		});

		it('parses a Source record carrying required fields', () => {
			const source = NewsApiSource.parse({
				id: 'bbc-news',
				name: 'BBC News',
				description: 'BBC News description',
				url: 'https://bbc.co.uk',
				category: 'general',
				language: 'en',
				country: 'gb',
			});
			expect(source.id).toBe('bbc-news');
			expect(source.category).toBe('general');
		});
	});

	describe('unrecognised fields are tolerated', () => {
		it('keeps extra unknown fields on article', () => {
			const article = NewsApiArticle.parse({
				url: 'https://example.com/article',
				extra_field: 'xyz',
			});
			expect((article as any).extra_field).toBe('xyz');
		});

		it('keeps extra unknown fields on source', () => {
			const source = NewsApiSource.parse({
				id: 'bbc-news',
				name: 'BBC News',
				popularity_rank: 3,
			});
			expect((source as any).popularity_rank).toBe(3);
		});
	});
});
