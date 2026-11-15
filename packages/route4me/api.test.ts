/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * key. Every read goes through its operation's output schema, so a field the
 * schema gets wrong fails here rather than in a caller's hands.
 *
 * Run with `ROUTE4ME_API_KEY=... pnpm --filter @corsair-dev/route4me test:live`.
 */

import * as Contacts from './endpoints/contacts';
import * as Dispatch from './endpoints/dispatch';
import * as Optimizations from './endpoints/optimizations';
import * as Routes from './endpoints/routes';
import type { Route4meContext } from './index';

const apiKey = process.env.ROUTE4ME_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'ROUTE4ME_API_KEY is not set: the live Route4Me suite is skipped, not passing.',
	);
}

function liveContext(): Route4meContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as Route4meContext;
}

describeIfKey('live Route4Me API', () => {
	it('reads the account behind the key on the v5 host', async () => {
		const result = await Contacts.teamMe(liveContext() as never, {} as never);

		expect(result.member.member_id).toBeGreaterThan(0);
	});

	it('lists routes through the output schema', async () => {
		const result = await Routes.list(
			liveContext() as never,
			{
				per_page: 2,
			} as never,
		);

		expect(Array.isArray(result.routes)).toBe(true);
		// The cursor is a number or null, never an empty string.
		expect(result.next_page).not.toBe('');
	});

	it('lists vehicles, which this host answers as a bare array', async () => {
		const result = await Dispatch.vehiclesList(
			liveContext() as never,
			{
				with_multi_unit_fields: false,
			} as never,
		);

		expect(Array.isArray(result.vehicles)).toBe(true);
	});

	it('lists address book contacts', async () => {
		const result = await Contacts.addressesList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.addresses)).toBe(true);
		expect(typeof result.offset).toBe('number');
	});

	it('lists orders and optimization problems', async () => {
		const orders = await Dispatch.ordersList(
			liveContext() as never,
			{
				per_page: 2,
			} as never,
		);
		expect(Array.isArray(orders.orders)).toBe(true);

		const optimizations = await Optimizations.list(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(optimizations.optimizations)).toBe(true);
	});
});
