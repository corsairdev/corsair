/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * token. Every read goes through its operation's output schema, so a field the
 * schema gets wrong fails here rather than in a caller's hands.
 *
 * Run with `RENTMAN_API_TOKEN=... pnpm --filter @corsair-dev/rentman test:live`.
 */

import * as Catalog from './endpoints/catalog';
import * as Contacts from './endpoints/contacts';
import * as People from './endpoints/people';
import type { RentmanContext } from './index';

const token = process.env.RENTMAN_API_TOKEN;

const describeIfToken = token ? describe : describe.skip;

if (!token) {
	// A skipped run must not read as a green one.
	console.warn(
		'RENTMAN_API_TOKEN is not set: the live Rentman suite is skipped, not passing.',
	);
}

function liveContext(): RentmanContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: token } as unknown as RentmanContext;
}

describeIfToken('live Rentman API', () => {
	it('lists contacts through the output schema', async () => {
		const result = await Contacts.list(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.contacts)).toBe(true);
		expect(result.next_cursor).not.toBe('');
	});

	it('lists projects through the output schema', async () => {
		const result = await Catalog.projectsList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.projects)).toBe(true);
	});

	it('lists equipment through the output schema', async () => {
		const result = await Catalog.equipmentList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.equipment)).toBe(true);
	});

	it('lists crew and invoices', async () => {
		const crew = await People.crewList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(crew.crew)).toBe(true);

		const invoices = await People.invoicesList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(invoices.invoices)).toBe(true);
	});
});
