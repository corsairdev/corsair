import type { InternalPersistiqPlugin } from './index';
import { persistiq } from './index';

/**
 * Live smoke: read-only, few calls. PERSISTIQ_API_KEY comes from the
 * PersistIQ integrations settings; without it the whole suite skips (a
 * skipped run is not a pass). Every answer goes through its output schema
 * so a wrongly typed field fails here rather than for a caller.
 */
const apiKey = process.env.PERSISTIQ_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PERSISTIQ_API_KEY not set; skipping live smoke tests (create a key in the PersistIQ integrations settings)',
	);
}

describeIfKey('persistiq live smoke', () => {
	const plugin: InternalPersistiqPlugin = persistiq({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists users through the output schema', async () => {
		const page = await plugin.endpoints!.users.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists leads through the output schema', async () => {
		const page = await plugin.endpoints!.leads.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists campaigns through the output schema', async () => {
		const page = await plugin.endpoints!.campaigns.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});
});
