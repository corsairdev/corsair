// Opt-in smoke test against the Square sandbox, read-only:
//   LIVE_TEST=1 SQUARE_ACCESS_TOKEN=… pnpm --filter @corsair-dev/square test api.test.ts
// The token must be a sandbox access token. CI skips api.test.ts; without both
// variables every test here is skipped.
import { createClient } from './test-fixtures';

const token = process.env.SQUARE_ACCESS_TOKEN;
const live = process.env.LIVE_TEST === '1' && token ? describe : describe.skip;

live('Square sandbox live (read-only)', () => {
	it('lists the locations of the sandbox account', async () => {
		const { corsair, testDb } = await createClient({
			key: token,
			environment: 'sandbox',
		});
		try {
			const out = await corsair.square.api.locations.list({});
			expect(Array.isArray(out.locations)).toBe(true);
			expect(out.locations?.length).toBeGreaterThan(0);
			expect(typeof out.locations?.[0]?.id).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});
});
