// Live Felt API smoke test. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`; run it with:
//
//   FELT_API_KEY=... pnpm test:live
//
import { makeFeltRequest } from './client';
import type { UsersGetCurrentResponse } from './endpoints/types';
import { FeltEndpointOutputSchemas } from './endpoints/types';

const LIVE_KEY = process.env.FELT_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping Felt live API test: FELT_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Felt live API smoke test (env-gated)', () => {
	it('GET /user retrieves current user profile with valid API key', async () => {
		const res = await makeFeltRequest<UsersGetCurrentResponse>(
			'/user',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = FeltEndpointOutputSchemas.usersGetCurrent.parse(res);
		expect(parsed).toBeDefined();
		expect(typeof parsed.id).toBe('string');
		expect(parsed.id.length).toBeGreaterThan(0);
		// Ensure secret key is never leaked in the returned payload
		expect(JSON.stringify(parsed)).not.toContain(LIVE_KEY);
	});
});
