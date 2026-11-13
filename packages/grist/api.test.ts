// Live Grist API smoke tests. Excluded from default runs by
// testPathIgnorePatterns in jest.config.cjs; run explicitly with:
//
//   GRIST_API_KEY=... pnpm test:live
//
import { makeGristRequest } from './client';
import {
	OrgsListOutputSchema,
	ProfileGetOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.GRIST_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (!LIVE_KEY) {
	console.warn(
		'Skipping Grist live API tests: GRIST_API_KEY environment variable is not set.',
	);
}

describeLive('Grist live API (env-gated smoke tests)', () => {
	it('GET /orgs returns accessible organizations for the live key', async () => {
		const res = await makeGristRequest<unknown>('/orgs', LIVE_KEY, {
			method: 'GET',
		});
		const parsed = OrgsListOutputSchema.parse(res);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('GET /profile/user returns user profile for the live key', async () => {
		const res = await makeGristRequest<unknown>('/profile/user', LIVE_KEY, {
			method: 'GET',
		});
		const parsed = ProfileGetOutputSchema.parse(res);
		expect(typeof parsed.id).toBe('number');
		expect(typeof parsed.name).toBe('string');
	});
});
