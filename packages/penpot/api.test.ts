import type { InternalPenpotPlugin } from './index';
import { penpot } from './index';

/**
 * Live smoke: read-only, few calls. PENPOT_API_TOKEN is an access token
 * generated under account settings (API access tokens) on
 * design.penpot.app.
 * Without a token the whole suite skips (a skipped run is not a pass).
 * Every answer goes through its output schema so a wrongly typed field
 * fails here rather than for a caller.
 */
const apiKey = process.env.PENPOT_API_TOKEN;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PENPOT_API_TOKEN not set; skipping live smoke tests (generate an access token under Account settings > API access tokens)',
	);
}

describeIfKey('penpot live smoke', () => {
	const plugin: InternalPenpotPlugin = penpot({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('lists teams through the output schema', async () => {
		const teams = await plugin.endpoints!.teams.list(ctx, {});
		expect(Array.isArray(teams)).toBe(true);
	});

	it('lists all projects through the output schema', async () => {
		const projects = await plugin.endpoints!.projects.listAll(ctx, {});
		expect(Array.isArray(projects)).toBe(true);
	});
});
