// Live Listen Notes API tests. Excluded from default runs by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\\.test\\.ts"); run with:
//
//   LISTENNOTES_API_KEY=... pnpm test:live
//
import { makeListennotesRequest } from './client';
import type { GenresListResponse, SearchResponse } from './endpoints/types';
import {
	GenresListResponseSchema,
	SearchResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.LISTENNOTES_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping live Listen Notes API tests because LISTENNOTES_API_KEY is not set. Set LISTENNOTES_API_KEY to run live tests.',
	);
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Listen Notes live API (env-gated)', () => {
	it('GET /genres returns the genres list', async () => {
		const res = await makeListennotesRequest<GenresListResponse>(
			'/genres',
			LIVE_KEY,
			{
				method: 'GET',
				query: { top_level_only: 1 },
			},
		);

		const parsed = GenresListResponseSchema.parse(res);
		expect(Array.isArray(parsed.genres)).toBe(true);
		expect(parsed.genres.length).toBeGreaterThan(0);
		for (const genre of parsed.genres) {
			expect(typeof genre.id).toBe('number');
			expect(typeof genre.name).toBe('string');
		}
	});

	it('GET /search returns matching results', async () => {
		const res = await makeListennotesRequest<SearchResponse>(
			'/search',
			LIVE_KEY,
			{
				method: 'GET',
				query: { q: 'technology', page_size: 2 },
			},
		);

		const parsed = SearchResponseSchema.parse(res);
		expect(typeof parsed.total).toBe('number');
		expect(Array.isArray(parsed.results)).toBe(true);
	});
});
