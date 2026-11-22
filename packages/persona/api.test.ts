import type { InternalPersonaPlugin } from './index';
import { persona } from './index';

/**
 * Live smoke: read-only, few calls. PERSONA_API_KEY is the environment API
 * key from the Persona dashboard (sandbox or production); without it the
 * whole suite skips (a skipped run is not a pass). Every answer goes through
 * its output schema so a wrongly typed field fails here rather than for a
 * caller.
 */
const apiKey = process.env.PERSONA_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PERSONA_API_KEY not set; skipping live smoke tests (create an environment key at https://app.withpersona.com/dashboard/settings/api-keys)',
	);
}

describeIfKey('persona live smoke', () => {
	const plugin: InternalPersonaPlugin = persona({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists inquiries through the output schema', async () => {
		const page = await plugin.endpoints!.inquiries.list(ctx, { pageSize: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists accounts through the output schema', async () => {
		const page = await plugin.endpoints!.accounts.list(ctx, { pageSize: 5 });
		expect(Array.isArray(page.data)).toBe(true);
	});

	it('lists inquiry templates through the output schema', async () => {
		const page = await plugin.endpoints!.inquiryTemplates.list(ctx, {});
		expect(Array.isArray(page.data)).toBe(true);
	});
});
