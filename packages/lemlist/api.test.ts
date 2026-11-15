// Live Lemlist API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   LEMLIST_API_KEY=... pnpm test:live
//
// Only read-only operations are called to prevent mutating account data.

import { makeLemlistRequest } from './client';
import type {
	TeamGetCreditsResponse,
	TeamGetResponse,
} from './endpoints/types';
import {
	TeamGetCreditsResponseSchema,
	TeamGetResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.LEMLIST_API_KEY ?? '';

if (!LIVE_KEY) {
	console.warn(
		'Skipping live Lemlist tests: LEMLIST_API_KEY environment variable is not set',
	);
}

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Lemlist Live API (env-gated)', () => {
	it('GET /team returns authenticated team details', async () => {
		const res = await makeLemlistRequest<TeamGetResponse>('/team', LIVE_KEY, {
			method: 'GET',
		});

		const parsed = TeamGetResponseSchema.parse(res);
		expect(typeof parsed._id).toBe('string');
	});

	it('GET /team/credits returns remaining credits', async () => {
		const res = await makeLemlistRequest<TeamGetCreditsResponse>(
			'/team/credits',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = TeamGetCreditsResponseSchema.parse(res);
		expect(typeof parsed.credits).toBe('number');
	});
});
