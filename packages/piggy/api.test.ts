import type { InternalPiggyPlugin } from './index';
import { piggy } from './index';

/**
 * Live smoke: read-only, few calls. PIGGY_API_TOKEN is a Personal Access
 * Token created for a private app in the Piggy Business Dashboard; without
 * it the whole suite skips (a skipped run is not a pass). Every answer goes
 * through its output schema so a wrongly typed field fails here rather
 * than for a caller.
 */
const token = process.env.PIGGY_API_TOKEN;
const describeIfKey = token ? describe : describe.skip;

if (!token) {
	console.warn(
		'PIGGY_API_TOKEN not set; skipping live smoke tests (create a Personal Access Token in the Piggy Business Dashboard Marketplace)',
	);
}

describeIfKey('piggy live smoke', () => {
	const plugin: InternalPiggyPlugin = piggy({ key: token as string });

	// The endpoints read the token off the context; a direct call supplies
	// it rather than going through the runtime.
	const ctx = { key: token as string, options: {} } as never;

	it('lists contacts through the output schema', async () => {
		const page = await plugin.endpoints!.contacts.list(ctx, { limit: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('reads the loyalty program through the output schema', async () => {
		const program = await plugin.endpoints!.loyalty.getProgram(ctx, {});
		expect(program.data).toBeDefined();
	});

	it('lists business profiles through the output schema', async () => {
		const page = await plugin.endpoints!.businesses.listProfiles(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists webhook subscriptions through the output schema', async () => {
		const page = await plugin.endpoints!.webhooks.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});
});
