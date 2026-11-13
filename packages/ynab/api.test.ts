/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a token.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `YNAB_ACCESS_TOKEN=... pnpm --filter @corsair-dev/ynab test:live`.
 *
 * Read-only: nothing here creates, edits or deletes a transaction. YNAB issues
 * personal access tokens for your own account only; reaching other people's budgets
 * needs OAuth, which this plugin does not implement.
 */
import { Budgets, Months, Transactions } from './endpoints';
import type { YnabContext } from './index';

const token = process.env.YNAB_ACCESS_TOKEN;

const describeIfKey = token ? describe : describe.skip;

if (!token) {
	// A skipped run must not read as a green one.
	console.warn(
		'YNAB_ACCESS_TOKEN is not set: the live YNAB suite is skipped, not passing.',
	);
}

function liveContext(): YnabContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: token } as unknown as YnabContext;
}

describeIfKey('live YNAB API', () => {
	it('lists budgets through the output schema', async () => {
		const result = await Budgets.list(liveContext() as never, {} as never);

		expect(Array.isArray(result.data.budgets)).toBe(true);
	});

	it('reads one budget through the output schema', async () => {
		const list = await Budgets.list(liveContext() as never, {} as never);
		const id = list.data.budgets?.[0]?.id;
		if (!id) return;

		const one = await Budgets.get(
			liveContext() as never,
			{
				budgetId: id,
			} as never,
		);

		expect(one.data.budget?.id).toBe(id);
	});

	it('reads the first month, which needs yyyy-MM-01', async () => {
		const list = await Budgets.list(liveContext() as never, {} as never);
		const id = list.data.budgets?.[0]?.id;
		if (!id) return;

		const budget = await Budgets.get(
			liveContext() as never,
			{
				budgetId: id,
			} as never,
		);
		const month = budget.data.budget?.first_month;
		if (!month) return;

		const one = await Months.get(
			liveContext() as never,
			{
				budgetId: id,
				month,
			} as never,
		);

		expect(one.data.month?.month).toBe(month);
	});

	it('lists transactions through the output schema', async () => {
		const list = await Budgets.list(liveContext() as never, {} as never);
		const id = list.data.budgets?.[0]?.id;
		if (!id) return;

		const result = await Transactions.list(
			liveContext() as never,
			{
				budgetId: id,
			} as never,
		);

		expect(Array.isArray(result.data.transactions)).toBe(true);
	});

	it('never exposes the token in a returned object', async () => {
		const result = await Budgets.list(liveContext() as never, {} as never);

		expect(JSON.stringify(result)).not.toContain(token as string);
	});
});
