/**
 * Live checks against a real SerpApi account.
 *
 * Skipped unless `SERPAPI_API_KEY` is set, so CI and contributors without
 * credentials are unaffected. Every operation here is a read (a search or a
 * lookup) - this API has no writes at all, so nothing is created, changed
 * or deleted. The free tier is a monthly quota (250 searches), so this
 * suite is deliberately representative rather than exhaustive: one call per
 * distinct parameter-naming pattern confirmed during recon, plus all 3
 * utility endpoints and a couple of id-chaining checks.
 */
import { Engines, Marketplace, Search, Utilities } from './endpoints';

const apiKey = process.env.SERPAPI_API_KEY;

const describeLive = apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof Search.search>[0];

function makeCtx(): Ctx {
	return { key: apiKey ?? '' } as unknown as Ctx;
}

describeLive('SerpApi live API', () => {
	it('runs a real Google search and gets organic results', async () => {
		const result = await Search.search(makeCtx(), { q: 'corsair github' });

		expect(result.search_metadata.status).toBe('Success');
		expect(Array.isArray(result.organic_results)).toBe(true);
	});

	it('runs Google Play search with no query (confirmed live: q is optional)', async () => {
		const result = await Search.playSearch(makeCtx(), {});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs Google News search with no query (confirmed live: q is optional)', async () => {
		const result = await Search.newsSearch(makeCtx(), {});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs Google Shopping search', async () => {
		const result = await Search.shoppingSearch(makeCtx(), {
			q: 'wireless mouse',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs YouTube search using search_query, not q', async () => {
		const result = await Engines.youtubeSearch(makeCtx(), {
			search_query: 'lofi hip hop',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs Yahoo search using p, not q', async () => {
		const result = await Engines.yahooSearch(makeCtx(), {
			p: 'corsair github',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	/**
	 * `engines.yandexSearch`/`yandexImagesSearch` are deliberately not
	 * exercised live: confirmed twice that a real Yandex search via this
	 * provider can exceed the shared request layer's 20s default timeout
	 * (`packages/corsair/async-core/request.ts`) - a genuine external
	 * latency characteristic (Yandex is harder to scrape than most engines),
	 * not a code defect. The `text=` (not `q=`) parameter-name correctness
	 * is already proven structurally in `endpoints.test.ts`; adding a live
	 * check here would just be a flaky test that doesn't verify anything
	 * the mocked suite doesn't already cover.
	 */

	it('runs Naver search using query, not q, with the confirmed period filter', async () => {
		const result = await Engines.naverSearch(makeCtx(), {
			query: 'corsair',
			period: '1w',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs Bing search', async () => {
		const result = await Engines.bingSearch(makeCtx(), { q: 'corsair github' });
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs DuckDuckGo search', async () => {
		const result = await Engines.duckDuckGoSearch(makeCtx(), {
			q: 'corsair github',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs eBay search using _nkw, not q', async () => {
		const result = await Marketplace.ebaySearch(makeCtx(), {
			_nkw: 'vintage camera',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs Walmart search', async () => {
		const result = await Marketplace.walmartSearch(makeCtx(), {
			query: 'headphones',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs Apple App Store search', async () => {
		const result = await Marketplace.appleAppStoreSearch(makeCtx(), {
			term: 'notes app',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	it('runs Yelp search requiring find_loc', async () => {
		const result = await Marketplace.yelpSearch(makeCtx(), {
			find_loc: 'Austin, TX',
			find_desc: 'coffee',
		});
		expect(result.search_metadata.status).toBe('Success');
	});

	/**
	 * Chains a real result: gets a real Google Maps place, then fetches its
	 * business posts by `data_id` - proves `data_id`, not `q`, is the real
	 * required parameter for this operation, confirmed against a live id
	 * rather than a synthetic one.
	 */
	it("gets Google Maps results then fetches that place's posts by data_id", async () => {
		const maps = await Search.mapsSearch(makeCtx(), {
			q: 'Starbucks Austin TX',
		});
		const place = (
			maps as unknown as { local_results?: { data_id?: string }[] }
		).local_results?.find((r) => r.data_id);

		if (!place?.data_id) {
			console.warn(
				'[integration.test] skipping mapsPosts: no place with a data_id found',
			);
			return;
		}
		const posts = await Search.mapsPosts(makeCtx(), { data_id: place.data_id });
		expect(posts.search_metadata.status).toBe('Success');
	});

	it('gets available Google search locations', async () => {
		const result = await Utilities.locationOptions(makeCtx(), { q: 'austin' });
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty('name');
	});

	it('gets the supported Google domains list', async () => {
		const result = await Utilities.domainsList(makeCtx(), {});
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(100);
		expect(result[0]).toHaveProperty('domain');
	});

	/** Chains a real search's own id into a search-archive retrieval. */
	it('retrieves a just-run search from the archive by its own search id', async () => {
		const original = await Search.search(makeCtx(), { q: 'corsair github' });
		const archived = await Utilities.searchArchive(makeCtx(), {
			search_id: original.search_metadata.id,
		});
		expect(archived.search_metadata.id).toBe(original.search_metadata.id);
	});
});
