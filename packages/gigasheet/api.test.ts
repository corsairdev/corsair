// Live Gigasheet API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   GIGASHEET_API_KEY=... pnpm test:live
//
// All live calls in this file are read-only and safe to execute.
import { makeGigasheetRequest } from './client';
import {
	DatasetsListOutputSchema,
	type DatasetsListResponse,
	UserGetDetailsOutputSchema,
	type UserGetDetailsResponse,
	UserGetEnrichmentCreditsOutputSchema,
	type UserGetEnrichmentCreditsResponse,
	UserGetSpaceUsedOutputSchema,
	type UserGetSpaceUsedResponse,
	UserWhoamiOutputSchema,
	type UserWhoamiResponse,
} from './endpoints/types';

const LIVE_KEY = process.env.GIGASHEET_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping Gigasheet live API tests: GIGASHEET_API_KEY is not set.',
	);
}

describeLive('Gigasheet live API (env-gated, read-only)', () => {
	it('GET /user/whoami returns user info for authenticated key', async () => {
		const res = await makeGigasheetRequest<UserWhoamiResponse>(
			'/user/whoami',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = UserWhoamiOutputSchema.parse(res);
		expect(typeof parsed.username).toBe('string');
		expect(parsed.authenticated).toBe(true);
	});

	it('GET /user/details returns authenticated user profile details', async () => {
		const res = await makeGigasheetRequest<UserGetDetailsResponse>(
			'/user/details',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = UserGetDetailsOutputSchema.parse(res);
		expect(typeof parsed).toBe('object');
	});

	it('GET /user/space-used returns numeric bytes used', async () => {
		// `unknown` because /user/space-used returns either raw integer or object.
		const raw = await makeGigasheetRequest<unknown>(
			'/user/space-used',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const normalized =
			typeof raw === 'number'
				? { bytesUsed: raw }
				: typeof raw === 'object' && raw !== null && 'bytesUsed' in raw
					? (raw as { bytesUsed: number })
					: { bytesUsed: 0 };

		const parsed = UserGetSpaceUsedOutputSchema.parse(normalized);
		expect(typeof parsed.bytesUsed).toBe('number');
		expect(parsed.bytesUsed).toBeGreaterThanOrEqual(0);
	});

	it('GET /user/enrichment-credits returns credit usage', async () => {
		const res = await makeGigasheetRequest<UserGetEnrichmentCreditsResponse>(
			'/user/enrichment-credits',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = UserGetEnrichmentCreditsOutputSchema.parse(res);
		expect(typeof parsed.Limit).toBe('number');
		expect(typeof parsed.Used).toBe('number');
	});

	it('GET /library/ lists library files for user', async () => {
		const res = await makeGigasheetRequest<DatasetsListResponse>(
			'/library/',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = DatasetsListOutputSchema.parse(res);
		expect(Array.isArray(parsed)).toBe(true);
	});
});
