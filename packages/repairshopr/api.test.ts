/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * key and subdomain. Every read goes through its operation's output schema.
 *
 * Run with `REPAIRSHOPR_API_KEY=... REPAIRSHOPR_SUBDOMAIN=... pnpm --filter
 * @corsair-dev/repairshopr test:live`.
 */

import * as Catalog from './endpoints/catalog';
import * as Customers from './endpoints/customers';
import * as Tickets from './endpoints/tickets';
import type { RepairshoprContext } from './index';

const apiKey = process.env.REPAIRSHOPR_API_KEY;
const subdomain = process.env.REPAIRSHOPR_SUBDOMAIN;

const describeIfKey = apiKey && subdomain ? describe : describe.skip;

if (!(apiKey && subdomain)) {
	// A skipped run must not read as a green one.
	console.warn(
		`REPAIRSHOPR_API_KEY and REPAIRSHOPR_SUBDOMAIN are needed: ${
			apiKey ? 'subdomain' : 'key'
		} is missing, so the live RepairShopr suite is skipped, not passing.`,
	);
}

function liveContext(): RepairshoprContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key` and the subdomain, so the fixture is cast.
	return {
		key: apiKey,
		options: { subdomain },
	} as unknown as RepairshoprContext;
}

describeIfKey('live RepairShopr API', () => {
	it('lists customers through the output schema', async () => {
		const result = await Customers.list(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);

		expect(Array.isArray(result.customers)).toBe(true);
	});

	it('lists tickets through the output schema', async () => {
		const result = await Tickets.list(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);

		expect(Array.isArray(result.tickets)).toBe(true);
	});

	it('lists invoices through the output schema', async () => {
		const result = await Catalog.invoicesList(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);

		expect(Array.isArray(result.invoices)).toBe(true);
	});

	it('reads the first customer back by id', async () => {
		const page = await Customers.list(
			liveContext() as never,
			{
				page: 1,
			} as never,
		);

		const first = page.customers[0];
		if (first?.id !== undefined && first.id !== null) {
			const one = await Customers.get(
				liveContext() as never,
				{
					customer_id: first.id,
				} as never,
			);
			expect(one.customer.id).toBe(first.id);
		}
	});
});
