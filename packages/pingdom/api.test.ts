import type { InternalPingdomPlugin } from './index';
import { pingdom } from './index';

/**
 * Live smoke: read-only, few calls. PINGDOM_API_TOKEN is generated inside
 * My Pingdom; without it the whole suite skips (a skipped run is not a
 * pass). Every answer goes through its output schema so a wrongly typed
 * field fails here rather than for a caller.
 */
const token = process.env.PINGDOM_API_TOKEN;
const describeIfKey = token ? describe : describe.skip;

if (!token) {
	console.warn(
		'PINGDOM_API_TOKEN not set; skipping live smoke tests (generate a token inside My Pingdom)',
	);
}

describeIfKey('pingdom live smoke', () => {
	const plugin: InternalPingdomPlugin = pingdom({ key: token as string });

	// The endpoints read the token off the context; a direct call supplies
	// it rather than going through the runtime.
	const ctx = { key: token as string, options: {} } as never;

	it('lists checks through the output schema', async () => {
		const page = await plugin.endpoints!.checks.list(ctx, {});
		expect(Array.isArray(page.checks)).toBe(true);
	});

	it('reads credits through the output schema', async () => {
		const credits = await plugin.endpoints!.tools.getCredits(ctx, {});
		expect(credits.credits).toBeDefined();
	});

	it('lists probes through the output schema', async () => {
		const probes = await plugin.endpoints!.tools.listProbes(ctx, {});
		expect(Array.isArray(probes.probes)).toBe(true);
	});

	it('lists maintenance windows through the output schema', async () => {
		const page = await plugin.endpoints!.maintenance.list(ctx, {});
		expect(Array.isArray(page.maintenance)).toBe(true);
	});
});
