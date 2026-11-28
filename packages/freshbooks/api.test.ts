import { freshbooksEndpointsNested as fb } from './endpoints/catalog';
import type { FreshBooksContext } from './index';

// Live suite against a real FreshBooks account (a trial works). Needs
// FRESHBOOKS_ACCESS_TOKEN (an OAuth access token of an app with the plugin's
// scopes); the account and business ids come from users.me. Reads, plus one
// client and one time entry that it creates and deletes again. It sends no
// email and records no payment. Never runs in CI (the *api.test.ts pattern).

const TOKEN = process.env.FRESHBOOKS_ACCESS_TOKEN;
const run = TOKEN ? describe : describe.skip;
if (!TOKEN) {
	console.warn(
		'[freshbooks] FRESHBOOKS_ACCESS_TOKEN is not set: skipping the live suite',
	);
}

function ctx(): FreshBooksContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('live'),
		key: TOKEN ?? '',
		options: {},
		keys: {},
		db: {},
		// `unknown` because the live context fills only the fields the endpoints read.
	} as unknown as FreshBooksContext;
}

run('FreshBooks live', () => {
	jest.setTimeout(60_000);

	it('reads the identity and its business', async () => {
		const me = await fb.users.me(ctx(), {});
		expect(me.business_memberships?.length).toBeGreaterThan(0);
	});

	it.each([
		['clients.list', () => fb.clients.list(ctx(), { per_page: 5 })],
		['invoices.list', () => fb.invoices.list(ctx(), { per_page: 5 })],
		['estimates.list', () => fb.estimates.list(ctx(), { per_page: 5 })],
		['expenses.list', () => fb.expenses.list(ctx(), { per_page: 5 })],
		['items.list', () => fb.items.list(ctx(), { per_page: 5 })],
		['taxes.list', () => fb.taxes.list(ctx(), {})],
		['payments.list', () => fb.payments.list(ctx(), { per_page: 5 })],
		['expenseCategories.list', () => fb.expenseCategories.list(ctx(), {})],
		['projects.list', () => fb.projects.list(ctx(), {})],
		['services.list', () => fb.services.list(ctx(), {})],
		['timeEntries.list', () => fb.timeEntries.list(ctx(), {})],
		['teamMembers.list', () => fb.teamMembers.list(ctx(), {})],
		['callbacks.list', () => fb.callbacks.list(ctx(), {})],
		['ledgerAccounts.list', () => fb.ledgerAccounts.list(ctx(), {})],
		['reports.accountsAging', () => fb.reports.accountsAging(ctx(), {})],
	])('%s', async (_name, call) => {
		await expect(call()).resolves.toBeDefined();
	});

	it('creates, reads, changes and deletes a client', async () => {
		const created = await fb.clients.create(ctx(), {
			client: {
				fname: 'Corsair',
				lname: 'Live Test',
				organization: 'Corsair live suite',
			},
		});
		const id = (created.client as { id?: number } | undefined)?.id;
		expect(id).toBeDefined();
		try {
			const read = await fb.clients.get(ctx(), { clientId: String(id) });
			expect((read.client as { organization?: string }).organization).toBe(
				'Corsair live suite',
			);
			await fb.clients.update(ctx(), {
				clientId: String(id),
				client: { organization: 'Corsair live suite (edited)' },
			});
		} finally {
			await fb.clients.delete(ctx(), { clientId: String(id) });
		}
	});

	it('logs and deletes a time entry', async () => {
		const created = await fb.timeEntries.create(ctx(), {
			time_entry: {
				is_logged: true,
				duration: 600,
				started_at: new Date().toISOString(),
				note: 'Corsair live suite',
			},
		});
		const id = (created.time_entry as { id?: number } | undefined)?.id;
		expect(id).toBeDefined();
		await fb.timeEntries.delete(ctx(), { timeEntryId: String(id) });
	});
});
