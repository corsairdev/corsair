import 'dotenv/config';
import { Account, RemoveBackground } from './endpoints';
import type { RemovebgContext } from './index';

/**
 * Live suite. Excluded from CI by filename; run with a real key, either via
 * a local .env (REMOVE_BG_API_KEY=...) or inline:
 *   REMOVE_BG_API_KEY=... pnpm test:live
 */

const TEST_API_KEY = process.env.REMOVE_BG_API_KEY;

const ctx = { key: TEST_API_KEY } as unknown as RemovebgContext;

// Sample image published by remove.bg (their /example.jpg asset).
const SAMPLE_IMAGE = 'https://www.remove.bg/example.jpg';

const maybeDescribe = TEST_API_KEY ? describe : describe.skip;

maybeDescribe('remove.bg live API', () => {
	it('fetches the account credit balance', async () => {
		const account = await Account.get(ctx, {});

		expect(account.data.attributes.credits.total).toBeGreaterThanOrEqual(0);
	});

	it('removes the background from a sample image', async () => {
		const result = await RemoveBackground.remove(ctx, {
			imageUrl: SAMPLE_IMAGE,
			size: 'preview',
		});

		expect(typeof result.data.result_b64).toBe('string');
		expect(result.data.result_b64.length).toBeGreaterThan(0);
	});

	// No live test for Improvement.submit: it files a real report against
	// remove.bg's Improvement program, and the sample image here isn't actually
	// mis-processed. That behavior is covered by mocked tests in
	// endpoints.test.ts instead.
});
