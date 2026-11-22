import type { InternalPexelsPlugin } from './index';
import { pexels } from './index';

/**
 * Live smoke: read-only, few calls (each one counts against the monthly
 * quota). PEXELS_API_KEY comes from the Pexels API keys page; without it the
 * whole suite skips (a skipped run is not a pass). Every answer goes through
 * its output schema so a wrongly typed field fails here rather than for a
 * caller.
 */
const apiKey = process.env.PEXELS_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PEXELS_API_KEY not set; skipping live smoke tests (create a key at https://www.pexels.com/api/keys/)',
	);
}

describeIfKey('pexels live smoke', () => {
	const plugin: InternalPexelsPlugin = pexels({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('searches photos through the output schema', async () => {
		const page = await plugin.endpoints!.photos.search(ctx, {
			query: 'nature',
			per_page: 5,
		});
		expect(Array.isArray(page.photos)).toBe(true);
	});

	it('lists curated photos through the output schema', async () => {
		const page = await plugin.endpoints!.photos.curated(ctx, { per_page: 5 });
		expect(Array.isArray(page.photos)).toBe(true);
	});
});
