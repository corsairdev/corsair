import {
	AnalyticsRegisterInputSchema,
	CategoriesGetByIdInputSchema,
	CategoriesGifsInputSchema,
	ChannelsSearchInputSchema,
	GifsSearchInputSchema,
	GifsTranslateInputSchema,
	GifsTrendingInputSchema,
	GifsUploadInputSchema,
	GiphyChannelsResponseSchema,
	GiphyRandomIdResponseSchema,
	GiphyRatingSchema,
	GiphyTermsResponseSchema,
	GiphyTrendingSearchesResponseSchema,
	GiphyUploadResponseSchema,
	TagsAutocompleteInputSchema,
	TagsRelatedInputSchema,
} from './endpoints/types';
import { GiphySchema } from './schema';
import { GiphyCategory, GiphyGif } from './schema/database';

describe('Giphy schema', () => {
	it('declares a semver version', () => {
		expect(GiphySchema.version).toBeDefined();
		expect(GiphySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GiphySchema.entities).toBe('object');
		expect(GiphySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GiphySchema.entities))).toBe(true);
		for (const entity of Object.values(GiphySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates stored gif entities with optional fields', () => {
		const parsed = GiphyGif.parse({
			id: '3oEjI6SIIHBdRxXI40',
			title: 'Funny Cat GIF',
			createdAt: new Date('2024-01-01'),
		});
		expect(parsed.id).toBe('3oEjI6SIIHBdRxXI40');
		expect(() => GiphyGif.parse({})).toThrow();
	});

	it('validates stored category entities with optional fields', () => {
		const parsed = GiphyCategory.parse({
			name: 'actions',
			subcategories: ['applause'],
		});
		expect(parsed.name).toBe('actions');
		expect(() => GiphyCategory.parse({})).toThrow();
	});
});

describe('Giphy shared schemas', () => {
	it('restricts ratings to the documented values', () => {
		expect(GiphyRatingSchema.parse('g')).toBe('g');
		expect(() => GiphyRatingSchema.parse('y')).toThrow();
	});

	it('requires a query for gif search', () => {
		expect(GifsSearchInputSchema.parse({ q: 'cats' }).q).toBe('cats');
		expect(() => GifsSearchInputSchema.parse({})).toThrow();
	});

	it('enforces the documented search contract', () => {
		// q max 50 chars, integer pagination, search offset max 4999.
		expect(() => GifsSearchInputSchema.parse({ q: 'x'.repeat(51) })).toThrow();
		expect(() =>
			GifsSearchInputSchema.parse({ q: 'cats', limit: 2.5 }),
		).toThrow();
		expect(() =>
			GifsSearchInputSchema.parse({ q: 'cats', offset: 5000 }),
		).toThrow();
		expect(
			GifsSearchInputSchema.parse({ q: 'cats', limit: 10, offset: 20 }).limit,
		).toBe(10);
	});

	it('caps trending offset at the documented 499', () => {
		expect(() => GifsTrendingInputSchema.parse({ offset: 500 })).toThrow();
		expect(GifsTrendingInputSchema.parse({ offset: 100 }).offset).toBe(100);
	});

	it('rejects more than five channel ids', () => {
		expect(
			GifsSearchInputSchema.parse({ q: 'cats', channel_ids: '1,2,3,4,5' })
				.channel_ids,
		).toBe('1,2,3,4,5');
		expect(() =>
			GifsSearchInputSchema.parse({ q: 'cats', channel_ids: '1,2,3,4,5,6' }),
		).toThrow();
	});

	it('bounds translate weirdness to 0-10', () => {
		expect(
			GifsTranslateInputSchema.parse({ s: 'hi', weirdness: 5 }).weirdness,
		).toBe(5);
		expect(() =>
			GifsTranslateInputSchema.parse({ s: 'hi', weirdness: 11 }),
		).toThrow();
	});

	it('requires a tag term for autocomplete', () => {
		expect(TagsAutocompleteInputSchema.parse({ q: 'cat' }).q).toBe('cat');
		expect(() => TagsAutocompleteInputSchema.parse({})).toThrow();
	});

	it('requires a term for related tags', () => {
		expect(TagsRelatedInputSchema.parse({ term: 'cat' }).term).toBe('cat');
		expect(() => TagsRelatedInputSchema.parse({})).toThrow();
	});

	it('caps channel search limit at 50 per the docs', () => {
		expect(ChannelsSearchInputSchema.parse({ q: 'nba' }).q).toBe('nba');
		expect(() =>
			ChannelsSearchInputSchema.parse({ q: 'nba', limit: 51 }),
		).toThrow();
	});

	it('requires a category id for get-by-id and gifs', () => {
		expect(
			CategoriesGetByIdInputSchema.parse({ category_id: 'actions' })
				.category_id,
		).toBe('actions');
		expect(() => CategoriesGetByIdInputSchema.parse({})).toThrow();
		expect(
			CategoriesGifsInputSchema.parse({ category_id: 'actions', limit: 2 })
				.limit,
		).toBe(2);
		expect(() => CategoriesGifsInputSchema.parse({})).toThrow();
	});

	it('parses term lists for autocomplete and related tags', () => {
		const parsed = GiphyTermsResponseSchema.parse({
			data: [{ name: 'cats' }],
			meta: { status: 200, msg: 'OK' },
		});
		expect(parsed.data[0]?.name).toBe('cats');
	});

	it('parses trending searches as plain strings', () => {
		const parsed = GiphyTrendingSearchesResponseSchema.parse({
			data: ['cats', 'dogs'],
			meta: { status: 200, msg: 'OK' },
		});
		expect(parsed.data).toEqual(['cats', 'dogs']);
	});

	it('parses channel search responses', () => {
		const parsed = GiphyChannelsResponseSchema.parse({
			data: [{ id: 1, slug: 'nba', display_name: 'NBA' }],
			meta: { status: 200, msg: 'OK' },
		});
		expect(parsed.data[0]?.display_name).toBe('NBA');
	});

	it('parses random id responses', () => {
		const parsed = GiphyRandomIdResponseSchema.parse({
			data: { random_id: 'abc123' },
			meta: { status: 200, msg: 'OK' },
		});
		expect(parsed.data.random_id).toBe('abc123');
	});

	it('requires exactly one upload source', () => {
		expect(
			GifsUploadInputSchema.parse({
				source_image_url: 'https://example.com/a.gif',
			}).source_image_url,
		).toBe('https://example.com/a.gif');
		expect(
			GifsUploadInputSchema.parse({ file_base64: 'Z2lmLWJ5dGVz' }).file_base64,
		).toBe('Z2lmLWJ5dGVz');
		expect(() => GifsUploadInputSchema.parse({})).toThrow();
		expect(() =>
			GifsUploadInputSchema.parse({
				file_base64: 'Z2lmLWJ5dGVz',
				source_image_url: 'https://example.com/a.gif',
			}),
		).toThrow();
	});

	it('parses upload responses by content id', () => {
		const parsed = GiphyUploadResponseSchema.parse({
			data: { id: 'new-gif-id' },
			meta: { status: 200, msg: 'OK' },
		});
		expect(parsed.data.id).toBe('new-gif-id');
	});

	it('only accepts HTTPS GIPHY analytics pingback urls', () => {
		expect(
			AnalyticsRegisterInputSchema.parse({
				pingback_url:
					'https://giphy-analytics.giphy.com/v2/pingback_simple?analytics_response_payload=abc&action_type=SEEN',
				customer_id: 'user-1',
			}).customer_id,
		).toBe('user-1');
		expect(() =>
			AnalyticsRegisterInputSchema.parse({
				pingback_url: 'https://example.com/ping',
				customer_id: 'user-1',
			}),
		).toThrow();
		expect(() =>
			AnalyticsRegisterInputSchema.parse({
				pingback_url:
					'http://giphy-analytics.giphy.com/v2/pingback_simple?analytics_response_payload=abc&action_type=SEEN',
				customer_id: 'user-1',
			}),
		).toThrow();
	});

	it('rejects non-base64 upload content', () => {
		expect(() =>
			GifsUploadInputSchema.parse({ file_base64: 'not-base64!!!' }),
		).toThrow();
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test (see endpoints.test.ts and api.test.ts).
