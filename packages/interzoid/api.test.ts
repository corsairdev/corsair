// Live Interzoid API smoke tests. Excluded from the default jest run by
// `testPathIgnorePatterns` in `jest.config.cjs`; run explicitly via:
//
//   INTERZOID_API_KEY=... pnpm test:live
//
import { makeInterzoidRequest } from './client';
import type { GetRemainingCreditsOutput } from './endpoints/types';
import { GetRemainingCreditsOutputSchema } from './endpoints/types';

const LIVE_KEY = process.env.INTERZOID_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping live Interzoid tests: INTERZOID_API_KEY not set');
}

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Interzoid live API smoke test (env-gated)', () => {
	it('GET /getremainingcredits retrieves account credits balance', async () => {
		const res = await makeInterzoidRequest<GetRemainingCreditsOutput>(
			'/getremainingcredits',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = GetRemainingCreditsOutputSchema.parse(res);
		expect(parsed.Code).toBe('Success');
		// A trial balance can be 0; overage shows as a negative number.
		expect(Number.isFinite(Number(parsed.Credits))).toBe(true);
	});
});
