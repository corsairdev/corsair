// Live Imgix API tests. Excluded from default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// run it with:
//
//   IMGIX_API_KEY=... pnpm test:live
//
// Only performs read-only queries (sources.list, reports.list).
import { makeImgixRequest } from './client';
import { ImgixEndpointOutputSchemas } from './endpoints/types';

const LIVE_KEY = process.env.IMGIX_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping Imgix live tests because IMGIX_API_KEY environment variable is not set.',
	);
}

describeLive('Imgix live API (env-gated)', () => {
	it('GET /sources lists sources for the account', async () => {
		const res = await makeImgixRequest(LIVE_KEY, {
			method: 'GET',
			path: 'sources',
			query: { 'page[size]': 5 },
		});

		const parsed = ImgixEndpointOutputSchemas['sources.list'].parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('GET /reports lists analytics reports for the account', async () => {
		const res = await makeImgixRequest(LIVE_KEY, {
			method: 'GET',
			path: 'reports',
			query: { 'page[size]': 5 },
		});

		const parsed = ImgixEndpointOutputSchemas['reports.list'].parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
