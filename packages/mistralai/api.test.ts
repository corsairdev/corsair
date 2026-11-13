// Opt-in smoke test against the real API, read-only:
//   LIVE_TEST=1 MISTRAL_API_KEY=… pnpm --filter @corsair-dev/mistralai test api.test.ts
// CI skips api.test.ts; without both variables every test here is skipped.
import { createClient } from './test-fixtures';

const key = process.env.MISTRAL_API_KEY;
const live = process.env.LIVE_TEST === '1' && key ? describe : describe.skip;

live('Mistral AI live (read-only)', () => {
	it('lists the models the key can use', async () => {
		const { corsair, testDb } = await createClient({ key });
		try {
			const models = await corsair.mistralai.api.models.list({});
			expect(Array.isArray(models.data)).toBe(true);
			expect(models.data?.length).toBeGreaterThan(0);
			expect(typeof models.data?.[0]?.id).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});
});
