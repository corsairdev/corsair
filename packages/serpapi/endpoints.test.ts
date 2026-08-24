/**
 * Exercises all 48 endpoint wrappers: the query parameters each one builds
 * (especially the `engine` value and each engine's real, live-confirmed
 * primary parameter name), and what reaches the event log. Network access
 * is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import { Engines, Marketplace, Search, Utilities } from './endpoints';
import { serpapiEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof Search.search>[0];

function makeCtx(): Ctx {
	return { key: 'test-serpapi-key' } as unknown as Ctx;
}

let lastUrl = '';
let lastMethod = '';

const RESPONSE_BODY = {
	search_metadata: { id: 'test-id', status: 'Success' },
	organic_results: [{ position: 1, title: 'Test result' }],
};

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, expected `engine=` or path substring, a real required param it must send] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	[
		'search.search',
		(c) => Search.search(c, { q: 'test' }),
		'engine=google',
		'q=test',
	],
	[
		'search.imageSearch',
		(c) => Search.imageSearch(c, { q: 'cats' }),
		'engine=google_images',
		'q=cats',
	],
	[
		'search.imagesLightSearch',
		(c) => Search.imagesLightSearch(c, { q: 'cats' }),
		'engine=google_images_light',
		'q=cats',
	],
	[
		'search.videosLightSearch',
		(c) => Search.videosLightSearch(c, { q: 'cats' }),
		'engine=google_videos_light',
		'q=cats',
	],
	[
		'search.mapsSearch',
		(c) => Search.mapsSearch(c, { q: 'coffee' }),
		'engine=google_maps',
		'q=coffee',
	],
	[
		'search.mapsPosts',
		(c) => Search.mapsPosts(c, { data_id: 'abc123' }),
		'engine=google_maps_posts',
		'data_id=abc123',
	],
	[
		'search.jobsSearch',
		(c) => Search.jobsSearch(c, { q: 'engineer' }),
		'engine=google_jobs',
		'q=engineer',
	],
	[
		'search.playSearch',
		(c) => Search.playSearch(c, {}),
		'engine=google_play',
		'',
	],
	[
		'search.playProduct',
		(c) => Search.playProduct(c, { product_id: 'com.example.app' }),
		'engine=google_play_product',
		'product_id=com.example.app',
	],
	[
		'search.scholarSearch',
		(c) => Search.scholarSearch(c, { q: 'machine learning' }),
		'engine=google_scholar',
		'q=machine learning',
	],
	[
		'search.scholarAuthor',
		(c) => Search.scholarAuthor(c, { author_id: 'abc' }),
		'engine=google_scholar_author',
		'author_id=abc',
	],
	[
		'search.scholarCite',
		(c) => Search.scholarCite(c, { q: 'result-id' }),
		'engine=google_scholar_cite',
		'q=result-id',
	],
	[
		'search.trendsSearch',
		(c) => Search.trendsSearch(c, { q: 'ai' }),
		'engine=google_trends',
		'q=ai',
	],
	[
		'search.financeSearch',
		(c) => Search.financeSearch(c, { q: 'GOOG:NASDAQ' }),
		'engine=google_finance',
		'q=GOOG:NASDAQ',
	],
	[
		'search.newsSearch',
		(c) => Search.newsSearch(c, {}),
		'engine=google_news',
		'',
	],
	[
		'search.shoppingSearch',
		(c) => Search.shoppingSearch(c, { q: 'shoes' }),
		'engine=google_shopping',
		'q=shoes',
	],
	[
		'search.hotelSearch',
		(c) => Search.hotelSearch(c, { q: 'hotels in NYC' }),
		'engine=google_hotels',
		'q=hotels in NYC',
	],
	[
		'search.hotelsAutocomplete',
		(c) => Search.hotelsAutocomplete(c, { q: 'Austin' }),
		'engine=google_hotels_autocomplete',
		'q=Austin',
	],
	[
		'search.eventSearch',
		(c) => Search.eventSearch(c, { q: 'concerts' }),
		'engine=google_events',
		'q=concerts',
	],
	[
		'search.localServicesSearch',
		(c) => Search.localServicesSearch(c, { q: 'plumber' }),
		'engine=google_local_services',
		'q=plumber',
	],
	[
		'search.forumsSearch',
		(c) => Search.forumsSearch(c, { q: 'reddit' }),
		'engine=google_forums',
		'q=reddit',
	],
	[
		'search.lensSearch',
		(c) => Search.lensSearch(c, { url: 'https://example.com/img.jpg' }),
		'engine=google_lens',
		'url=https://example.com/img.jpg',
	],
	[
		'search.lightSearch',
		(c) => Search.lightSearch(c, { q: 'test' }),
		'engine=google_light',
		'q=test',
	],
	[
		'search.aboutThisResult',
		(c) => Search.aboutThisResult(c, { q: 'https://example.com' }),
		'engine=google_about_this_result',
		'q=https://example.com',
	],
	[
		'search.patentDetails',
		(c) => Search.patentDetails(c, { patent_id: 'patent/US123' }),
		'engine=google_patents_details',
		'',
	],
	[
		'search.imagesRelatedContent',
		(c) => Search.imagesRelatedContent(c, { related_content_id: 'abc' }),
		'engine=google_images_related_content',
		'related_content_id=abc',
	],

	[
		'engines.bingSearch',
		(c) => Engines.bingSearch(c, { q: 'test' }),
		'engine=bing',
		'q=test',
	],
	[
		'engines.bingMaps',
		(c) => Engines.bingMaps(c, { q: 'coffee' }),
		'engine=bing_maps',
		'q=coffee',
	],
	[
		'engines.duckDuckGoSearch',
		(c) => Engines.duckDuckGoSearch(c, { q: 'test' }),
		'engine=duckduckgo',
		'q=test',
	],
	[
		'engines.duckDuckGoMaps',
		(c) => Engines.duckDuckGoMaps(c, { q: 'coffee' }),
		'engine=duckduckgo_maps',
		'q=coffee',
	],
	[
		'engines.duckDuckGoLightSearch',
		(c) => Engines.duckDuckGoLightSearch(c, { q: 'test' }),
		'engine=duckduckgo_light',
		'q=test',
	],
	[
		'engines.yahooSearch',
		(c) => Engines.yahooSearch(c, { p: 'test' }),
		'engine=yahoo',
		'p=test',
	],
	[
		'engines.yahooVideos',
		(c) => Engines.yahooVideos(c, { p: 'test' }),
		'engine=yahoo_videos',
		'p=test',
	],
	[
		'engines.yandexSearch',
		(c) => Engines.yandexSearch(c, { text: 'test' }),
		'engine=yandex',
		'text=test',
	],
	[
		'engines.yandexImagesSearch',
		(c) => Engines.yandexImagesSearch(c, { text: 'test' }),
		'engine=yandex_images',
		'text=test',
	],
	[
		'engines.naverSearch',
		(c) => Engines.naverSearch(c, { query: 'test' }),
		'engine=naver',
		'query=test',
	],
	[
		'engines.baiduSearch',
		(c) => Engines.baiduSearch(c, { q: 'test' }),
		'engine=baidu',
		'q=test',
	],
	[
		'engines.youtubeSearch',
		(c) => Engines.youtubeSearch(c, { search_query: 'lofi' }),
		'engine=youtube',
		'search_query=lofi',
	],

	[
		'marketplace.ebaySearch',
		(c) => Marketplace.ebaySearch(c, { _nkw: 'camera' }),
		'engine=ebay',
		'_nkw=camera',
	],
	[
		'marketplace.walmartSearch',
		(c) => Marketplace.walmartSearch(c, { query: 'tv' }),
		'engine=walmart',
		'query=tv',
	],
	[
		'marketplace.walmartProductReviews',
		(c) => Marketplace.walmartProductReviews(c, { product_id: '123' }),
		'engine=walmart_product_reviews',
		'product_id=123',
	],
	[
		'marketplace.appleAppStoreSearch',
		(c) => Marketplace.appleAppStoreSearch(c, { term: 'notes app' }),
		'engine=apple_app_store',
		'term=notes app',
	],
	[
		'marketplace.yelpSearch',
		(c) => Marketplace.yelpSearch(c, { find_loc: 'Austin, TX' }),
		'engine=yelp',
		'find_loc=Austin, TX',
	],
	[
		'marketplace.openTableReviews',
		(c) => Marketplace.openTableReviews(c, { rid: '456' }),
		'engine=open_table_reviews',
		'rid=456',
	],
	[
		'marketplace.facebookProfile',
		(c) => Marketplace.facebookProfile(c, { profile_id: 'zuck' }),
		'engine=facebook_profile',
		'profile_id=zuck',
	],
];

describe('operation routing (search-based operations)', () => {
	for (const [name, invoke, expectedEngine, expectedParam] of OPERATIONS) {
		it(`${name} issues GET /search with ${expectedEngine}`, async () => {
			const ctx = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe('GET');
			expect(lastUrl).toContain('/search');
			const params = new URL(lastUrl).searchParams;
			expect(params.get('engine')).toBe(expectedEngine.replace(/^engine=/, ''));
			if (expectedParam) {
				const eq = expectedParam.indexOf('=');
				expect(params.get(expectedParam.slice(0, eq))).toBe(
					expectedParam.slice(eq + 1),
				);
			}
		});
	}
});

describe('operation routing (utility operations - distinct paths, not /search)', () => {
	it('utilities.locationOptions issues GET /locations.json', async () => {
		global.fetch = (async (url: unknown) => {
			lastUrl = String(url);
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => [{ id: '1', name: 'Austin' }],
				text: async () => '[]',
			};
		}) as unknown as typeof global.fetch;

		const ctx = makeCtx();
		const result = await Utilities.locationOptions(ctx, { q: 'austin' });

		expect(lastUrl).toContain('/locations.json');
		expect(lastUrl).not.toContain('/search');
		expect(lastUrl).toContain('q=austin');
		expect(result).toEqual([{ id: '1', name: 'Austin' }]);
	});

	it('utilities.searchArchive issues GET /searches/{search_id}.json', async () => {
		const ctx = makeCtx();
		await Utilities.searchArchive(ctx, {
			search_id: 'aabbccddeeff001122334455',
		});

		expect(lastUrl).toContain('/searches/aabbccddeeff001122334455.json');
		expect(lastUrl).not.toContain('/search?');
	});

	it('utilities.domainsList issues GET /google-domains.json', async () => {
		global.fetch = (async (url: unknown) => {
			lastUrl = String(url);
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => [{ domain: 'google.com' }],
				text: async () => '[]',
			};
		}) as unknown as typeof global.fetch;

		const ctx = makeCtx();
		const result = await Utilities.domainsList(ctx, {});

		expect(lastUrl).toContain('/google-domains.json');
		expect(result).toEqual([{ domain: 'google.com' }]);
	});
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = new Set(Object.keys(serpapiEndpointSchemas));
		const exercised = new Set([
			...OPERATIONS.map(([name]) => name),
			'utilities.locationOptions',
			'utilities.searchArchive',
			'utilities.domainsList',
		]);

		expect(registered.size).toBe(48);
		expect([...registered].sort()).toEqual([...exercised].sort());
	});
});

describe('engine parameter name correctness', () => {
	/**
	 * Every one of these confirmed live: the engine's real primary query
	 * parameter is NOT `q`, so an endpoint sending `q` instead would
	 * silently fail against the real API (the provider would just say
	 * "missing required parameter") even though it looks identical to every
	 * other engine wrapper in this file.
	 */
	it('Yahoo uses p, not q', async () => {
		const ctx = makeCtx();
		await Engines.yahooSearch(ctx, { p: 'test' });
		expect(lastUrl).toContain('p=test');
		expect(new URL(lastUrl).searchParams.get('q')).toBeNull();
	});

	it('Yandex uses text, not q', async () => {
		const ctx = makeCtx();
		await Engines.yandexSearch(ctx, { text: 'test' });
		expect(lastUrl).toContain('text=test');
		expect(new URL(lastUrl).searchParams.get('q')).toBeNull();
	});

	it('Naver uses query, not q', async () => {
		const ctx = makeCtx();
		await Engines.naverSearch(ctx, { query: 'test' });
		expect(lastUrl).toContain('query=test');
		expect(new URL(lastUrl).searchParams.get('q')).toBeNull();
	});

	it('YouTube uses search_query, not q', async () => {
		const ctx = makeCtx();
		await Engines.youtubeSearch(ctx, { search_query: 'lofi' });
		expect(lastUrl).toContain('search_query=lofi');
		expect(new URL(lastUrl).searchParams.get('q')).toBeNull();
	});

	it('eBay uses _nkw, not q', async () => {
		const ctx = makeCtx();
		await Marketplace.ebaySearch(ctx, { _nkw: 'camera' });
		expect(lastUrl).toContain('_nkw=camera');
		expect(new URL(lastUrl).searchParams.get('q')).toBeNull();
	});

	it('Google Lens uses url, not q', async () => {
		const ctx = makeCtx();
		await Search.lensSearch(ctx, { url: 'https://example.com/img.jpg' });
		expect(new URL(lastUrl).searchParams.get('url')).toBe(
			'https://example.com/img.jpg',
		);
		expect(new URL(lastUrl).searchParams.get('q')).toBeNull();
	});

	it('Google Maps Posts uses data_id, not q', async () => {
		const ctx = makeCtx();
		await Search.mapsPosts(ctx, { data_id: 'abc123' });
		expect(lastUrl).toContain('data_id=abc123');
		expect(new URL(lastUrl).searchParams.get('q')).toBeNull();
	});
});

/**
 * Found during the follow-up verification round: confirmed live via each
 * param's presence (or absence) in the API's own echoed-back
 * `search_parameters`, a stronger signal than a bare 200 status (which
 * SerpApi returns even for silently-ignored extra params).
 */
describe('parameters confirmed during the verification round', () => {
	it('search.mapsPosts accepts next_page_token for pagination', async () => {
		const ctx = makeCtx();
		await Search.mapsPosts(ctx, {
			data_id: 'abc123',
			next_page_token: 'token123',
		});
		expect(lastUrl).toContain('next_page_token=token123');
	});

	it('engines.naverSearch accepts period for time-based filtering', async () => {
		const ctx = makeCtx();
		await Engines.naverSearch(ctx, { query: 'test', period: '1w' });
		expect(lastUrl).toContain('period=1w');
	});

	it('search.search rejects num over the confirmed max of 100', () => {
		const result = serpapiEndpointSchemas['search.search'].input.safeParse({
			q: 'test',
			num: 150,
		});
		expect(result.success).toBe(false);
	});

	it('search.search accepts num at the confirmed max of 100', () => {
		const result = serpapiEndpointSchemas['search.search'].input.safeParse({
			q: 'test',
			num: 100,
		});
		expect(result.success).toBe(true);
	});

	it('rejects blank required strings', () => {
		expect(
			serpapiEndpointSchemas['search.search'].input.safeParse({ q: '' })
				.success,
		).toBe(false);
		expect(
			serpapiEndpointSchemas['search.search'].input.safeParse({ q: '   ' })
				.success,
		).toBe(false);
		expect(
			serpapiEndpointSchemas['search.scholarSearch'].input.safeParse({
				q: '',
			}).success,
		).toBe(false);
		expect(
			serpapiEndpointSchemas['utilities.searchArchive'].input.safeParse({
				search_id: 'abc123',
			}).success,
		).toBe(false);
	});

	it('rejects non-http Lens urls', () => {
		expect(
			serpapiEndpointSchemas['search.lensSearch'].input.safeParse({
				url: 'file:///tmp/x.jpg',
			}).success,
		).toBe(false);
	});

	/**
	 * Confirmed live: these are NOT real parameters despite catalog prose
	 * suggesting otherwise (`hl`/`location` never appear in the API's own
	 * echoed-back `search_parameters` for these engines) - deliberately NOT
	 * added to the schemas, and this test locks that decision in.
	 */
	it('does not accept unconfirmed catalog-suggested params for Yahoo/YouTube/Walmart/eBay', () => {
		expect(
			serpapiEndpointSchemas['engines.yahooSearch'].input.safeParse({
				p: 'test',
				hl: 'en',
			}).success,
		).toBe(true); // extra unknown keys are simply stripped, not rejected
		expect(
			'hl' in serpapiEndpointSchemas['engines.yahooSearch'].input.shape,
		).toBe(false);
		expect(
			'location' in serpapiEndpointSchemas['engines.youtubeSearch'].input.shape,
		).toBe(false);
		expect(
			'location' in
				serpapiEndpointSchemas['marketplace.walmartSearch'].input.shape,
		).toBe(false);
		expect(
			'location' in
				serpapiEndpointSchemas['marketplace.ebaySearch'].input.shape,
		).toBe(false);
	});
});

describe('event log', () => {
	it('keeps the search query out of the payload', async () => {
		const ctx = makeCtx();
		await Search.search(ctx, { q: 'sensitive query text' });

		expect(mockLogEvent).toHaveBeenCalled();
		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).not.toHaveProperty('q');
		expect(JSON.stringify(payload)).not.toContain('sensitive query text');
	});

	it('keeps the Lens image URL out of the payload', async () => {
		const ctx = makeCtx();
		await Search.lensSearch(ctx, { url: 'https://example.com/private.jpg' });

		expect(mockLogEvent).toHaveBeenCalled();
		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(JSON.stringify(payload)).not.toContain('private.jpg');
	});

	it('logs structural identifiers for a lookup', async () => {
		const ctx = makeCtx();
		await Search.playProduct(ctx, { product_id: 'com.example.app' });

		expect(mockLogEvent).toHaveBeenCalled();
		const payload = mockLogEvent.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).toEqual({ product_id: 'com.example.app' });
	});
});

describe('error envelope', () => {
	it('throws when the 200 body includes an error field', async () => {
		global.fetch = (async (url: unknown) => {
			lastUrl = String(url);
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => ({
					search_metadata: { id: '1', status: 'Error' },
					error: 'Google has not returned any results for this query.',
				}),
				text: async () => '',
			};
		}) as unknown as typeof global.fetch;

		await expect(Search.search(makeCtx(), { q: 'test' })).rejects.toThrow(
			'Google has not returned any results for this query.',
		);
	});
});
