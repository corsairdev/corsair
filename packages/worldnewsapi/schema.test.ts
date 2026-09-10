import { SearchNewsInputSchema, TopNewsInputSchema } from './endpoints/types';
import {
	WorldNewsArticle,
	WorldNewsExtractedArticle,
	WorldNewsGeoCoordinate,
	WorldNewsSource,
} from './schema/database';

describe('World News API Schema Tests', () => {
	it('validates WorldNewsArticle entity', () => {
		const validArticle = {
			id: 12345,
			title: 'Test Article Title',
			text: 'Full article text content here.',
			summary: 'Short summary',
			url: 'https://example.com/article/12345',
			image: 'https://example.com/img.jpg',
			video: null,
			publish_date: '2026-08-31 10:00:00',
			author: 'Jane Doe',
			authors: ['Jane Doe'],
			category: 'technology',
			language: 'en',
			source_country: 'us',
			sentiment: 0.5,
		};

		const parsed = WorldNewsArticle.parse(validArticle);
		expect(parsed.id).toBe(12345);
		expect(parsed.title).toBe('Test Article Title');
	});

	it('validates WorldNewsExtractedArticle entity', () => {
		const validExtracted = {
			url: 'https://example.com/article/extracted',
			title: 'Extracted Article',
			text: 'Content...',
			publish_date: '2026-08-31',
			authors: ['Author 1'],
			language: 'en',
			source_country: 'gb',
			sentiment: 0.2,
		};

		const parsed = WorldNewsExtractedArticle.parse(validExtracted);
		expect(parsed.url).toBe('https://example.com/article/extracted');
	});

	it('validates WorldNewsGeoCoordinate entity', () => {
		const validCoord = {
			location: 'Tokyo, Japan',
			latitude: 35.652832,
			longitude: 139.839478,
			city: 'Tokyo',
		};

		const parsed = WorldNewsGeoCoordinate.parse(validCoord);
		expect(parsed.latitude).toBe(35.652832);
		expect(parsed.city).toBe('Tokyo');
	});

	it('validates WorldNewsSource entity', () => {
		const validSource = {
			name: 'BBC News',
			url: 'https://www.bbc.co.uk',
			language: 'en',
			country: 'gb',
		};

		const parsed = WorldNewsSource.parse(validSource);
		expect(parsed.name).toBe('BBC News');
	});

	it('rejects impossible top-news calendar dates', () => {
		expect(
			TopNewsInputSchema.safeParse({
				sourceCountry: 'us',
				language: 'en',
				date: '2026-99-99',
			}).success,
		).toBe(false);
	});

	it('requires at least one search-news filter', () => {
		expect(SearchNewsInputSchema.safeParse({}).success).toBe(false);
		expect(SearchNewsInputSchema.safeParse({ language: 'en' }).success).toBe(
			true,
		);
	});
});
