import { Search1APISchema } from './schema';

describe('Search1API schema', () => {
	it('declares a semver version', () => {
		expect(Search1APISchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares the searchResults entity', () => {
		expect(Object.keys(Search1APISchema.entities)).toEqual(['searchResults']);
	});

	it('accepts a stored result row', () => {
		const parsed = Search1APISchema.entities.searchResults.parse({
			title: 'Corsair',
			link: 'https://example.com',
			snippet: 'integration layer',
			content: 'full text',
			publishedDate: '2026-01-02',
			service: 'google',
			query: 'corsair',
			createdAt: new Date(),
		});

		expect(parsed.link).toBe('https://example.com');
		expect(parsed.publishedDate).toBeInstanceOf(Date);
	});

	it('rejects rows without the required fields', () => {
		expect(() =>
			Search1APISchema.entities.searchResults.parse({
				link: 'https://example.com',
				snippet: 'no title',
			}),
		).toThrow();
	});
});
