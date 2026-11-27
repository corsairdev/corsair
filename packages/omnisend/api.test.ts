import { campaignsList, contactsList, templatesList } from './endpoints';
import type { OmnisendContext } from './index';

/**
 * Live smoke tests against the real API. Gated on `OMNISEND_API_KEY`.
 *
 * These call the endpoint functions, so every response flows through its
 * output schema (`Outputs.<op>.parse`) against a real payload. All three calls
 * are read-only: no creates, no sends, no events. A key lives at
 * app.omnisend.com under Store settings, API keys, and is shown only once.
 *
 * Omnisend has no sandbox, so point this at a test store rather than a
 * production one. The brand's rate limits are shared across every key, which
 * is why the suite stays at three small reads.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/omnisend test:live`.
 */
const API_KEY = process.env.OMNISEND_API_KEY;

const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'OMNISEND_API_KEY is not set, so the Omnisend live smoke tests are skipped. Create a key at app.omnisend.com under Store settings, API keys, and export it to run them.',
	);
}

// Safe: the endpoints read only ctx.key and log through ctx.
const ctx = { key: API_KEY, database: undefined } as unknown as OmnisendContext; // unknown: only ctx.key is read.

describeIfKey('Omnisend live API', () => {
	it('lists contacts through the endpoint and its output schema', async () => {
		// The first live call, so this is what proves the mandatory
		// Omnisend-Version header is actually accepted.
		const result = await contactsList(ctx, { limit: 2 });
		expect(Array.isArray(result.contacts)).toBe(true);
		expect(result.contacts.length).toBeLessThanOrEqual(2);
	});

	it('lists campaigns through the endpoint and its output schema', async () => {
		const result = await campaignsList(ctx, { limit: 2 });
		expect(Array.isArray(result.campaigns)).toBe(true);
		expect(result.campaigns.length).toBeLessThanOrEqual(2);
	});

	it('lists templates through the endpoint and its output schema', async () => {
		const result = await templatesList(ctx, { limit: 2 });
		expect(Array.isArray(result.templates)).toBe(true);
		expect(result.templates.length).toBeLessThanOrEqual(2);
	});
});
