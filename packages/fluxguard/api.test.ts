/**
 * Live smoke tests against the real Fluxguard API. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/fluxguard test:live`.
 *
 * Read-only: it never adds a page, starts a crawl or touches a webhook, so it
 * is safe to run against an account with live monitoring.
 */
import { fluxguard } from './index';

const KEY = process.env.FLUXGUARD_API_KEY;
const describeIfKey = KEY ? describe : describe.skip;

describeIfKey('Fluxguard live smoke', () => {
	const plugin = fluxguard({ key: KEY });

	it('reads the account', async () => {
		const account = await plugin.endpoints!.account.get(
			// Safe: the endpoint reads only the key from the context.
			{ key: KEY! } as never,
			{},
		);

		expect(typeof account.id).toBe('string');
		expect(account.id.length).toBeGreaterThan(0);
		expect(
			typeof account.credits === 'number' || account.credits === null,
		).toBe(true);
	});

	it('lists webhooks as an array', async () => {
		const result = await plugin.endpoints!.webhooks.list(
			{ key: KEY! } as never,
			{},
		);

		expect(Array.isArray(result.webhooks)).toBe(true);
	});

	it('lists categories as an array', async () => {
		const result = await plugin.endpoints!.categories.list(
			{ key: KEY! } as never,
			{},
		);

		expect(Array.isArray(result.categories)).toBe(true);
	});

	it('reads a sample delivery', async () => {
		const result = await plugin.endpoints!.webhooks.sample(
			{ key: KEY! } as never,
			{},
		);

		expect(Array.isArray(result.samples)).toBe(true);
		expect(result.samples.length).toBeGreaterThan(0);
	});
});
