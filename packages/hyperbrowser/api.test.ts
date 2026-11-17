// Live Hyperbrowser API tests. Excluded from default runs by
// `testPathIgnorePatterns` in `jest.config.cjs`; run with:
//
//   HYPERBROWSER_API_KEY=... pnpm test:live
//
// Only safe, read-only calls (listing profiles/sessions) are made here
// so live test runs do not launch chargeable cloud browser VMs.

import { makeHyperbrowserRequest } from './client';
import type { ListProfilesOutput, ListSessionsOutput } from './endpoints/types';
import {
	ListProfilesOutputSchema,
	ListSessionsOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.HYPERBROWSER_API_KEY ?? '';
if (!LIVE_KEY) {
	// Greptile / R8 convention: warn when skipped due to missing live credentials.
	console.warn(
		'Skipping Hyperbrowser live API tests: HYPERBROWSER_API_KEY is not set',
	);
}

const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Hyperbrowser live API (env-gated)', () => {
	it('GET /api/profiles lists profiles for the authenticated account', async () => {
		const res = await makeHyperbrowserRequest<ListProfilesOutput>(
			'/api/profiles',
			LIVE_KEY,
			{ method: 'GET', query: { limit: 5 } },
		);

		const parsed = ListProfilesOutputSchema.parse(res);
		expect(Array.isArray(parsed.profiles)).toBe(true);
	});

	it('GET /api/sessions lists sessions for the authenticated account', async () => {
		const res = await makeHyperbrowserRequest<ListSessionsOutput>(
			'/api/sessions',
			LIVE_KEY,
			{ method: 'GET', query: { page: 1 } },
		);

		const parsed = ListSessionsOutputSchema.parse(res);
		expect(Array.isArray(parsed.sessions)).toBe(true);
	});
});
