// Live Ignisign API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   IGNISIGN_API_KEY=... pnpm test:live
//
// Read-only smoke checks: skips when unset, never logs keys.

import { appScopeFromKey, makeIgnisignRequest } from './client';
import type { ApplicationContext } from './endpoints/types';
import { ApplicationContextSchema } from './endpoints/types';

const LIVE_KEY = process.env.IGNISIGN_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (!LIVE_KEY) {
	console.warn(
		'Skipping live Ignisign tests because IGNISIGN_API_KEY is not set.',
	);
}

describeLive('Ignisign live API (env-gated)', () => {
	it('GET /v4/applications/:appId/context returns application context', async () => {
		const appId =
			process.env.IGNISIGN_APP_ID || appScopeFromKey(LIVE_KEY)?.appId || '';
		const res = await makeIgnisignRequest<ApplicationContext>(
			`/v4/applications/${encodeURIComponent(appId)}/context`,
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = ApplicationContextSchema.parse(res);
		expect(parsed.appId ?? appId).toBe(appId);
		// appName is nullable in the schema; check its type only when present.
		if (parsed.appName != null) {
			expect(typeof parsed.appName).toBe('string');
		}
	});
});
