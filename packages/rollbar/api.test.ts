/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * token. Every read goes through its operation's output schema.
 *
 * Run with `ROLLBAR_ACCESS_TOKEN=... pnpm --filter @corsair-dev/rollbar test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { RollbarContext } from './index';

const apiKey = process.env.ROLLBAR_ACCESS_TOKEN;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'ROLLBAR_ACCESS_TOKEN is not set: the live Rollbar suite is skipped, not passing.',
	);
}

function liveContext(): RollbarContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as RollbarContext;
}

describeIfKey('live Rollbar API', () => {
	it('lists projects through the output schema', async () => {
		const result = await Endpoints.projectsList(
			liveContext() as never,
			{} as never,
		);

		expect(Array.isArray(result.projects)).toBe(true);
	});

	it('lists items through the output schema', async () => {
		const result = await Endpoints.itemsList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.items)).toBe(true);
	});

	it('reads the first item back by id', async () => {
		const page = await Endpoints.itemsList(
			liveContext() as never,
			{
				limit: 1,
			} as never,
		);

		const first = page.items[0];
		if (first?.id === undefined || first.id === null) return;

		const one = await Endpoints.itemsGet(
			liveContext() as never,
			{
				item_id: first.id,
			} as never,
		);
		expect(one.item.id).toBe(first.id);
	});

	it('lists deploys through the output schema', async () => {
		const result = await Endpoints.deploysList(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);

		expect(Array.isArray(result.deploys)).toBe(true);
	});
});
