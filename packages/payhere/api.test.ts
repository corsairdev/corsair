import type { InternalPayherePlugin } from './index';
import { payhere } from './index';

/**
 * Live smoke: read-only, few calls. PAYHERE_API_KEY comes from the merchants
 * admin integrations section; without it the whole suite skips (a skipped
 * run is not a pass). Every answer goes through its output schema so a
 * wrongly typed field fails here rather than for a caller.
 */
const apiKey = process.env.PAYHERE_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PAYHERE_API_KEY not set; skipping live smoke tests (create a key under Integrations in the Payhere merchants admin)',
	);
}

describeIfKey('payhere live smoke', () => {
	const plugin: InternalPayherePlugin = payhere({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('reads the authenticated user through the output schema', async () => {
		const result = await plugin.endpoints!.user.get(ctx, {});
		expect(result.data.id).toBeDefined();
	});

	it('reads the company through the output schema', async () => {
		const result = await plugin.endpoints!.company.get(ctx, {});
		expect(result.data.id).toBeDefined();
	});

	it('lists payments through the output schema', async () => {
		const page = await plugin.endpoints!.payments.list(ctx, { per_page: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists plans through the output schema', async () => {
		const page = await plugin.endpoints!.plans.list(ctx, { per_page: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});
});
