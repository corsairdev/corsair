import 'dotenv/config';
import { z } from 'zod';
import { makeGiphyAnalyticsRequest, makeGiphyRequest } from './client';
import type {
	GiphyCategoriesResponse,
	GiphyChannelsResponse,
	GiphyListResponse,
	GiphyRandomIdResponse,
	GiphySingleResponse,
	GiphyTermsResponse,
	GiphyTrendingSearchesResponse,
	GiphyUploadResponse,
} from './endpoints/types';
import { GiphyEndpointOutputSchemas } from './endpoints/types';

// Live API tests in the style of packages/slack/api.test.ts: they call the
// real GIPHY API with a developer key. They are skipped unless GIPHY_API_KEY
// is set so CI stays green; run them locally with:
//   GIPHY_API_KEY=<key> pnpm --filter @corsair-dev/giphy test api.test.ts
// Upload tests additionally need GIPHY_UPLOAD_TEST_URL (a small public GIF
// URL) because beta keys cannot upload to a channel username.
const TEST_KEY = process.env.GIPHY_API_KEY;
const UPLOAD_TEST_URL = process.env.GIPHY_UPLOAD_TEST_URL;

const describeLive = TEST_KEY ? describe : describe.skip;

// The search response's per-item `analytics` object is preserved by the
// `.passthrough()` output schemas but is not part of the typed surface, so a
// narrow local schema extracts the pingback URL without any cast.
const AnalyticsUrlShape = z
	.object({
		analytics: z
			.object({
				onload: z.object({ url: z.string() }).passthrough(),
			})
			.passthrough(),
	})
	.passthrough();

describeLive('Giphy live API', () => {
	const apiKey = TEST_KEY ?? '';

	it('gifs.search returns a parsed gif list', async () => {
		const response = await makeGiphyRequest<GiphyListResponse>(
			'/gifs/search',
			apiKey,
			{ query: { q: 'cats', limit: 3 } },
		);
		const parsed = GiphyEndpointOutputSchemas.gifsSearch.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('gifs.trending returns a parsed gif list', async () => {
		const response = await makeGiphyRequest<GiphyListResponse>(
			'/gifs/trending',
			apiKey,
			{ query: { limit: 3 } },
		);
		const parsed = GiphyEndpointOutputSchemas.gifsTrending.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('gifs.translate returns a single gif', async () => {
		const response = await makeGiphyRequest<GiphySingleResponse>(
			'/gifs/translate',
			apiKey,
			{ query: { s: 'cheeseburger' } },
		);
		const parsed = GiphyEndpointOutputSchemas.gifsTranslate.parse(response);
		expect(parsed.data.id).toBeDefined();
	});

	it('gifs.random returns a single gif', async () => {
		const response = await makeGiphyRequest<GiphySingleResponse>(
			'/gifs/random',
			apiKey,
			{ query: { tag: 'cats' } },
		);
		const parsed = GiphyEndpointOutputSchemas.gifsRandom.parse(response);
		expect(parsed.data.id).toBeDefined();
	});

	it('gifs.getById and gifs.getByIds round-trip a known id', async () => {
		const search = await makeGiphyRequest<GiphyListResponse>(
			'/gifs/search',
			apiKey,
			{ query: { q: 'cats', limit: 1 } },
		);
		const gifId =
			GiphyEndpointOutputSchemas.gifsSearch.parse(search).data[0]?.id;
		expect(gifId).toBeDefined();
		if (!gifId) return;

		const single = await makeGiphyRequest<GiphySingleResponse>(
			`/gifs/${gifId}`,
			apiKey,
		);
		expect(GiphyEndpointOutputSchemas.gifsGetById.parse(single).data.id).toBe(
			gifId,
		);

		const multi = await makeGiphyRequest<GiphyListResponse>('/gifs', apiKey, {
			query: { ids: gifId },
		});
		expect(
			GiphyEndpointOutputSchemas.gifsGetByIds.parse(multi).data[0]?.id,
		).toBe(gifId);
	});

	it('gifs.upload accepts a public source url', async () => {
		if (!UPLOAD_TEST_URL) {
			console.warn('Skipping upload test: GIPHY_UPLOAD_TEST_URL is not set');
			return;
		}
		const response = await makeGiphyRequest<GiphyUploadResponse>(
			'/gifs',
			apiKey,
			{
				method: 'POST',
				base: 'upload',
				query: { source_image_url: UPLOAD_TEST_URL, tags: 'test' },
			},
		);
		const parsed = GiphyEndpointOutputSchemas.gifsUpload.parse(response);
		expect(parsed.data.id).toBeDefined();
	});

	it('stickers.search returns a parsed sticker list', async () => {
		const response = await makeGiphyRequest<GiphyListResponse>(
			'/stickers/search',
			apiKey,
			{ query: { q: 'dogs', limit: 3 } },
		);
		const parsed = GiphyEndpointOutputSchemas.stickersSearch.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('stickers.trending returns a parsed sticker list', async () => {
		const response = await makeGiphyRequest<GiphyListResponse>(
			'/stickers/trending',
			apiKey,
			{ query: { limit: 3 } },
		);
		const parsed = GiphyEndpointOutputSchemas.stickersTrending.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('stickers.translate returns a single sticker', async () => {
		const response = await makeGiphyRequest<GiphySingleResponse>(
			'/stickers/translate',
			apiKey,
			{ query: { s: 'party' } },
		);
		const parsed = GiphyEndpointOutputSchemas.stickersTranslate.parse(response);
		expect(parsed.data.id).toBeDefined();
	});

	it('stickers.random returns a single sticker', async () => {
		const response = await makeGiphyRequest<GiphySingleResponse>(
			'/stickers/random',
			apiKey,
			{ query: { tag: 'dance' } },
		);
		const parsed = GiphyEndpointOutputSchemas.stickersRandom.parse(response);
		expect(parsed.data.id).toBeDefined();
	});

	it('emoji.get returns emoji from the v2 surface', async () => {
		const response = await makeGiphyRequest<GiphyListResponse>(
			'/emoji',
			apiKey,
			{ base: 'v2', query: { limit: 3 } },
		);
		const parsed = GiphyEndpointOutputSchemas.emojiGet.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('emoji.variations returns variations for an emoji with variants', async () => {
		const emoji = await makeGiphyRequest<GiphyListResponse>('/emoji', apiKey, {
			base: 'v2',
			query: { limit: 25 },
		});
		const withVariants = GiphyEndpointOutputSchemas.emojiGet
			.parse(emoji)
			.data.find((item) => {
				const variationCount = z
					.object({ variation_count: z.number().optional() })
					.passthrough()
					.parse(item).variation_count;
				return (variationCount ?? 0) > 0;
			});
		if (!withVariants) {
			console.warn('Skipping variations test: no emoji with variants found');
			return;
		}
		const response = await makeGiphyRequest<GiphyListResponse>(
			`/emoji/${withVariants.id}/variations`,
			apiKey,
			{ base: 'v2' },
		);
		const parsed = GiphyEndpointOutputSchemas.emojiVariations.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('categories.list returns categories with subcategories', async () => {
		const response = await makeGiphyRequest<GiphyCategoriesResponse>(
			'/gifs/categories',
			apiKey,
		);
		const parsed = GiphyEndpointOutputSchemas.categoriesList.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('categories.getById returns subcategories for a known category', async () => {
		const response = await makeGiphyRequest<GiphyCategoriesResponse>(
			'/gifs/categories/actions',
			apiKey,
		);
		const parsed = GiphyEndpointOutputSchemas.categoriesGetById.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
		expect(parsed.data[0]?.name).toBeDefined();
	});

	it('categories.gifs returns paginated gifs for a known category', async () => {
		const response = await makeGiphyRequest<GiphyListResponse>(
			'/gifs/categories/actions/gifs',
			apiKey,
			{ query: { limit: 2 } },
		);
		const parsed = GiphyEndpointOutputSchemas.categoriesGifs.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
		expect(parsed.pagination?.count).toBe(2);
	});

	it('tags.autocomplete suggests completions', async () => {
		const response = await makeGiphyRequest<GiphyTermsResponse>(
			'/gifs/search/tags',
			apiKey,
			{ query: { q: 'cat' } },
		);
		const parsed = GiphyEndpointOutputSchemas.tagsAutocomplete.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('tags.trending returns trending search terms', async () => {
		const response = await makeGiphyRequest<GiphyTrendingSearchesResponse>(
			'/trending/searches',
			apiKey,
		);
		const parsed = GiphyEndpointOutputSchemas.tagsTrending.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('tags.related returns tags related to a term', async () => {
		const response = await makeGiphyRequest<GiphyTermsResponse>(
			'/tags/related/cat',
			apiKey,
		);
		const parsed = GiphyEndpointOutputSchemas.tagsRelated.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('channels.search returns matching channels', async () => {
		const response = await makeGiphyRequest<GiphyChannelsResponse>(
			'/channels/search',
			apiKey,
			{ query: { q: 'nba' } },
		);
		const parsed = GiphyEndpointOutputSchemas.channelsSearch.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('randomid.get generates an identifier', async () => {
		const response = await makeGiphyRequest<GiphyRandomIdResponse>(
			'/randomid',
			apiKey,
		);
		const parsed = GiphyEndpointOutputSchemas.randomIdGet.parse(response);
		expect(parsed.data.random_id.length).toBeGreaterThan(0);
	});

	it('analytics.register accepts a pingback from a search result', async () => {
		const search = await makeGiphyRequest<GiphyListResponse>(
			'/gifs/search',
			apiKey,
			{ query: { q: 'cats', limit: 1 } },
		);
		const first = GiphyEndpointOutputSchemas.gifsSearch.parse(search).data[0];
		if (!first) return;
		const pingback = AnalyticsUrlShape.parse(first).analytics?.onload?.url;
		if (!pingback) {
			console.warn('Skipping analytics test: no pingback url in response');
			return;
		}
		await expect(
			makeGiphyAnalyticsRequest(pingback, {
				customer_id: 'live-test-user',
				ts: Date.now(),
			}),
		).resolves.toBeUndefined();
	});
});
