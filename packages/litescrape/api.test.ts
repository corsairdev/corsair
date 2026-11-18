// Live LiteScrape API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs` (--testPathPattern=api\.test\.ts);
// run them with:
//
//   LITESCRAPE_API_KEY=ls_live_... pnpm test:live
//
// Every call spends a credit, so this file never runs on an exported key by
// accident. The request shapes mirror https://litescrape.com/docs/reference.
import { makeLitescrapeRequest } from './client';
import type {
	GoogleSearchResponse,
	KeysStatusResponse,
	WebFetchResponse,
} from './endpoints/types';
import {
	GoogleSearchResponseSchema,
	KeysStatusResponseSchema,
	WebFetchResponseSchema,
} from './endpoints/types';

const LIVE = process.env.LITESCRAPE_API_KEY ?? '';
const describeLive = LIVE.length > 0 ? describe : describe.skip;

describeLive('litescrape live API (env-gated)', () => {
	it('GET /api/keys/status returns the key accounting payload', async () => {
		const res = await makeLitescrapeRequest<KeysStatusResponse>(
			'/api/keys/status',
			LIVE,
			{ method: 'GET' },
		);

		const parsed = KeysStatusResponseSchema.parse(res);
		expect(typeof parsed.remaining_calls).toBe('number');
		expect(typeof parsed.status).toBe('string');
	});

	it('GET /api/google/search returns organic results', async () => {
		const res = await makeLitescrapeRequest<GoogleSearchResponse>(
			'/api/google/search',
			LIVE,
			{ method: 'GET', query: { q: 'coffee' } },
		);

		const parsed = GoogleSearchResponseSchema.parse(res);
		expect(Array.isArray(parsed.organic_results)).toBe(true);
	});

	it('GET /api/web/fetch renders a public page', async () => {
		const res = await makeLitescrapeRequest<WebFetchResponse>(
			'/api/web/fetch',
			LIVE,
			{ method: 'GET', query: { url: 'https://example.com' } },
		);

		const parsed = WebFetchResponseSchema.parse(res);
		expect(typeof parsed.url).toBe('string');
	});
});
