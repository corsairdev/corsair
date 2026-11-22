import type { InternalPasscreatorPlugin } from './index';
import { passcreator } from './index';

/**
 * Live smoke: read-only, few calls. PASSCREATOR_API_KEY comes from the
 * Passcreator account settings; without it the whole suite skips (a skipped
 * run is not a pass). Every answer goes through its output schema so a
 * wrongly typed field fails here rather than for a caller.
 */
const apiKey = process.env.PASSCREATOR_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PASSCREATOR_API_KEY not set; skipping live smoke tests (create a key under Account > API in the Passcreator app)',
	);
}

describeIfKey('passcreator live smoke', () => {
	const plugin: InternalPasscreatorPlugin = passcreator({
		key: apiKey as string,
	});

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists pass templates through the output schema', async () => {
		const templates = await plugin.endpoints!.templates.list(ctx, {});
		expect(Array.isArray(templates)).toBe(true);
	});

	it('lists active webhook subscriptions through the output schema', async () => {
		const hooks = await plugin.endpoints!.webhooks.list(ctx, {});
		expect(Array.isArray(hooks)).toBe(true);
	});

	it('reads the signature public key through the output schema', async () => {
		const key = await plugin.endpoints!.webhooks.getPublicKey(ctx, {});
		expect(key.publicKey).toContain('BEGIN PUBLIC KEY');
	});
});
