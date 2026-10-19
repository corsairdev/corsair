// Live MrScraper API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`; run it with:
//
//   MRSCRAPER_API_KEY=... pnpm test:live
//
// Only read-only Platform API endpoints are exercised here so a live run never
// spends scrape tokens.
import { makeMrscraperRequest } from './client';
import {
	AccountGetResponseSchema,
	ResultsListResponseSchema,
} from './endpoints/types';

const LIVE = process.env.MRSCRAPER_API_KEY ?? '';
const describeLive = LIVE.length > 0 ? describe : describe.skip;

describeLive('mrscraper live API (env-gated)', () => {
	it('GET /subscription-accounts returns the account', async () => {
		const res = await makeMrscraperRequest<unknown>(
			'/subscription-accounts',
			LIVE,
			{ method: 'GET' },
		);

		const parsed = AccountGetResponseSchema.parse(res);
		expect(typeof parsed.data.id).toBe('string');
	});

	it('GET /results returns a paginated page', async () => {
		const res = await makeMrscraperRequest<unknown>('/results', LIVE, {
			method: 'GET',
			query: { page: 1, pageSize: 5 },
		});

		const parsed = ResultsListResponseSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
