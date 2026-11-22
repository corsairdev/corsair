import type { InternalPilvioPlugin } from './index';
import { pilvio } from './index';

/**
 * Live smoke: read-only, few calls. PILVIO_API_TOKEN comes from the Pilvio
 * user interface; without it the whole suite skips (a skipped run is not a
 * pass). Every answer goes through its output schema so a wrongly typed
 * field fails here rather than for a caller.
 */
const token = process.env.PILVIO_API_TOKEN;
const describeIfKey = token ? describe : describe.skip;

if (!token) {
	console.warn(
		'PILVIO_API_TOKEN not set; skipping live smoke tests (create an API token in the Pilvio user interface)',
	);
}

describeIfKey('pilvio live smoke', () => {
	const plugin: InternalPilvioPlugin = pilvio({ key: token as string });

	// The endpoints read the token off the context; a direct call supplies
	// it rather than going through the runtime.
	const ctx = { key: token as string, options: {} } as never;

	it('reads the user through the output schema', async () => {
		const user = await plugin.endpoints!.account.getUser(ctx, {});
		expect(user.id).toBeDefined();
	});

	it('lists locations through the output schema', async () => {
		const locations = await plugin.endpoints!.config.listLocations(ctx, {});
		expect(Array.isArray(locations)).toBe(true);
	});

	it('lists VMs through the output schema', async () => {
		const vms = await plugin.endpoints!.vm.list(ctx, {});
		expect(Array.isArray(vms)).toBe(true);
	});

	it('lists buckets through the output schema', async () => {
		const buckets = await plugin.endpoints!.storage.buckets.list(ctx, {});
		expect(Array.isArray(buckets)).toBe(true);
	});

	it('reads the pricing policy through the output schema', async () => {
		const policy = await plugin.endpoints!.config.getPricingPolicy(ctx, {});
		expect(Array.isArray(policy.policy)).toBe(true);
	});
});
