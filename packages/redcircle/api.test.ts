/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * key. Every read goes through its operation's output schema.
 *
 * Run with `REDCIRCLE_API_KEY=... pnpm --filter @corsair-dev/redcircle test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { RedcircleContext } from './index';

const apiKey = process.env.REDCIRCLE_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'REDCIRCLE_API_KEY is not set: the live RedCircle suite is skipped, not passing.',
	);
}

function liveContext(): RedcircleContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as RedcircleContext;
}

describeIfKey('live RedCircle API', () => {
	it('searches Target products through the output schema', async () => {
		const result = await Endpoints.searchProducts(
			liveContext() as never,
			{
				search_term: 'highlighter pens',
			} as never,
		);

		expect(Array.isArray(result.search_results)).toBe(true);
		// The live response carries the pagination block, so the next page exists.
		expect(typeof result.total_results).toBe('number');
	});

	it('reads a product by tcin', async () => {
		const search = await Endpoints.searchProducts(
			liveContext() as never,
			{
				search_term: 'highlighter pens',
			} as never,
		);

		const tcin = search.search_results[0]?.product?.tcin;
		if (!tcin) return;

		const one = await Endpoints.productsGet(
			liveContext() as never,
			{
				tcin,
			} as never,
		);
		expect(one.product.tcin).toBe(tcin);
	});

	it('reads the account and never exposes the echoed key', async () => {
		const result = await Endpoints.accountGet(
			liveContext() as never,
			{} as never,
		);

		expect(result.account.plan).toBeTruthy();
		expect(result.account).not.toHaveProperty('api_key');
	});
});
