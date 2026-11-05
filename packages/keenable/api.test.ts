// Live Keenable API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   KEENABLE_API_KEY=... pnpm test:live
//
// Both documented endpoints consume credits, so this file sits behind an
// explicit env gate and never runs on an accidentally exported key.
import { makeKeenableRequest } from './client';
import type { FetchResponse, SearchResponse } from './endpoints/types';
import { FetchResponseSchema, SearchResponseSchema } from './endpoints/types';

const LIVE_KEY = process.env.KEENABLE_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('keenable live API (env-gated)', () => {
	it('POST /v1/search returns ranked results', async () => {
		const res = await makeKeenableRequest<SearchResponse>(
			'/v1/search',
			LIVE_KEY,
			{
				method: 'POST',
				body: { query: 'keenable.ai', max_results: 1 },
			},
		);

		const parsed = SearchResponseSchema.parse(res);
		expect(parsed.query).toBe('keenable.ai');
		expect(parsed.results.length).toBeGreaterThanOrEqual(1);
		expect(typeof parsed.results[0]?.url).toBe('string');
	});

	it('GET /v1/fetch returns page markdown for a stable URL', async () => {
		// live=true keeps the test deterministic for pages that may not be in
		// the index yet (docs: an unindexed page otherwise returns 404).
		const res = await makeKeenableRequest<FetchResponse>(
			'/v1/fetch',
			LIVE_KEY,
			{
				method: 'GET',
				query: { url: 'https://example.com', live: true, max_chars: 2000 },
			},
		);

		const parsed = FetchResponseSchema.parse(res);
		expect(typeof parsed.url).toBe('string');
		expect(parsed.content.length).toBeGreaterThan(0);
	});
});
