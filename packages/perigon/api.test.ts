import type { InternalPerigonPlugin } from './index';
import { perigon } from './index';

/**
 * Live smoke: read-only, few calls (each one is billable). PERIGON_API_KEY
 * comes from the Developers section of the Perigon account; without it the
 * whole suite skips (a skipped run is not a pass). Every answer goes through
 * its output schema so a wrongly typed field fails here rather than for a
 * caller.
 */
const apiKey = process.env.PERIGON_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PERIGON_API_KEY not set; skipping live smoke tests (create a key at https://www.perigon.io/sign-up and find it in the Developers section)',
	);
}

describeIfKey('perigon live smoke', () => {
	const plugin: InternalPerigonPlugin = perigon({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists articles through the output schema', async () => {
		const page = await plugin.endpoints!.articles.list(ctx, { size: 5 });
		expect(Array.isArray(page.articles)).toBe(true);
	});

	it('reads the account limits through the output schema', async () => {
		const limits = await plugin.endpoints!.limits.get(ctx, {});
		expect(limits.organizationName).toBeDefined();
	});
});
