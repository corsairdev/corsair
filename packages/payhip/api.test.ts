import type { InternalPayhipPlugin } from './index';
import { payhip } from './index';

/**
 * Live smoke: read-only, few calls. PAYHIP_API_KEY comes from Developer
 * Settings in the Payhip account; without it the whole suite skips (a
 * skipped run is not a pass). Every answer goes through its output schema
 * so a wrongly typed field fails here rather than for a caller.
 */
const apiKey = process.env.PAYHIP_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PAYHIP_API_KEY not set; skipping live smoke tests (view your key under Developer Settings at https://payhip.com)',
	);
}

describeIfKey('payhip live smoke', () => {
	const plugin: InternalPayhipPlugin = payhip({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists coupons through the output schema', async () => {
		const page = await plugin.endpoints!.coupons.list(ctx, { limit: 5 });
		expect(Array.isArray(page.data.coupons)).toBe(true);
	});
});
