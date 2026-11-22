import type { InternalPaystackPlugin } from './index';
import { paystack } from './index';

/**
 * Live smoke: read-only, few calls. PAYSTACK_SECRET_KEY is the sk_test_ or
 * sk_live_ key from Developers > API Keys & Webhooks; without it the whole
 * suite skips (a skipped run is not a pass). Every answer goes through its
 * output schema so a wrongly typed field fails here rather than for a
 * caller.
 */
const apiKey = process.env.PAYSTACK_SECRET_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PAYSTACK_SECRET_KEY not set; skipping live smoke tests (create a key at https://dashboard.paystack.com/#/settings/developers)',
	);
}

describeIfKey('paystack live smoke', () => {
	const plugin: InternalPaystackPlugin = paystack({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists transactions through the output schema', async () => {
		const page = await plugin.endpoints!.transactions.list(ctx, { perPage: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists customers through the output schema', async () => {
		const page = await plugin.endpoints!.customers.list(ctx, { perPage: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists plans through the output schema', async () => {
		const page = await plugin.endpoints!.plans.list(ctx, { perPage: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists refunds through the output schema', async () => {
		const page = await plugin.endpoints!.refunds.list(ctx, { perPage: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});
});
