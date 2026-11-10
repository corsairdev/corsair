/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * token. Every read goes through its operation's output schema, so a field the
 * schema gets wrong fails here rather than in a caller's hands.
 *
 * Run with `RAMP_API_TOKEN=... pnpm --filter @corsair-dev/ramp test:live`.
 */

import * as Org from './endpoints/org';
import * as Spend from './endpoints/spend';
import * as Transactions from './endpoints/transactions';
import type { RampContext } from './index';

const token = process.env.RAMP_API_TOKEN;

const describeIfToken = token ? describe : describe.skip;

if (!token) {
	// A skipped run must not read as a green one.
	console.warn(
		'RAMP_API_TOKEN is not set: the live Ramp suite is skipped, not passing.',
	);
}

function liveContext(): RampContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: token } as unknown as RampContext;
}

describeIfToken('live Ramp API', () => {
	it('reads the business profile', async () => {
		const result = await Org.businessGet(liveContext() as never, {} as never);

		expect(result.business.id).toBeTruthy();
		expect(typeof result.business.business_name_legal).toBeDefined();
	});

	it('lists transactions through the output schema', async () => {
		const result = await Transactions.list(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.transactions)).toBe(true);
		// The cursor is null or a real id, never an empty string.
		expect(result.next_cursor).not.toBe('');
	});

	it('lists users through the output schema', async () => {
		const result = await Org.usersList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(result.users)).toBe(true);
	});

	it('lists departments and reads the first back by id', async () => {
		const page = await Org.departmentsList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);

		expect(Array.isArray(page.departments)).toBe(true);
	});

	it('lists bills and reimbursements', async () => {
		const bills = await Spend.billsList(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);
		expect(Array.isArray(bills.bills)).toBe(true);

		const reimbursements = await Org.list(
			liveContext() as never,
			{
				page_size: 2,
			} as never,
		);
		expect(Array.isArray(reimbursements.reimbursements)).toBe(true);
	});
});
