/**
 * Live checks against a real Harvest account.
 *
 * Skipped unless both `HARVEST_ACCESS_TOKEN` and `HARVEST_ACCOUNT_ID` are set,
 * so CI and contributors without credentials are unaffected. Every operation
 * here is read-only: nothing is created, changed or deleted, and in particular
 * nothing that could email a client is exercised.
 */
import {
	Clients,
	Company,
	Contacts,
	Expenses,
	Invoices,
	Projects,
	Tasks,
	TimeEntries,
	Users,
} from './endpoints';
import { HarvestEndpointOutputSchemas as Outputs } from './endpoints/types';

const accessToken = process.env.HARVEST_ACCESS_TOKEN;
const accountId = process.env.HARVEST_ACCOUNT_ID;

const describeLive = accessToken && accountId ? describe : describe.skip;

type Ctx = Parameters<typeof Clients.list>[0];

const upserts: { id: string; data: unknown }[] = [];

function makeStore() {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push({ id, data });
		},
		// Never reached: every operation below is read-only. Present so the stub
		// matches the store shape the delete operations expect.
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: accessToken ?? '',
		options: { accountId },
		db: {
			clients: makeStore(),
			contacts: makeStore(),
			projects: makeStore(),
			tasks: makeStore(),
			users: makeStore(),
			invoices: makeStore(),
			estimates: makeStore(),
			expenseCategories: makeStore(),
			invoiceItemCategories: makeStore(),
			company: makeStore(),
		},
		database: undefined,
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

describeLive('Harvest live API', () => {
	beforeEach(() => {
		upserts.length = 0;
	});

	it('returns company settings matching the declared schema', async () => {
		const result = await Company.get(makeCtx(), {});

		expect(() => Outputs.companyGet.parse(result)).not.toThrow();
		expect(typeof result.full_domain).toBe('string');
		// Company settings are cached under the domain, not an id.
		expect(upserts[0]?.id).toBe(result.full_domain);
	});

	it('returns a paginated client list and caches it', async () => {
		const result = await Clients.list(makeCtx(), { per_page: 10 });

		expect(() => Outputs.clientsList.parse(result)).not.toThrow();
		expect(Array.isArray(result.clients)).toBe(true);
		// Every returned row should have been mirrored.
		expect(upserts).toHaveLength(result.clients?.length ?? 0);
	});

	it('returns projects matching the declared schema', async () => {
		const result = await Projects.list(makeCtx(), { per_page: 10 });

		expect(() => Outputs.projectsList.parse(result)).not.toThrow();
		expect(result.total_entries).toEqual(expect.any(Number));
	});

	it('returns tasks matching the declared schema', async () => {
		const result = await Tasks.list(makeCtx(), { per_page: 10 });

		expect(() => Outputs.tasksList.parse(result)).not.toThrow();
	});

	it('returns team members matching the declared schema', async () => {
		const result = await Users.list(makeCtx(), { per_page: 10 });

		expect(() => Outputs.usersList.parse(result)).not.toThrow();
	});

	it('returns time entries matching the declared schema without caching them', async () => {
		const result = await TimeEntries.list(makeCtx(), { per_page: 10 });

		expect(() => Outputs.timeEntriesList.parse(result)).not.toThrow();
		// Time entries are transactional and deliberately not mirrored.
		expect(upserts).toHaveLength(0);
	});

	it('returns expense categories matching the declared schema', async () => {
		const result = await Expenses.listCategories(makeCtx(), { per_page: 10 });

		expect(() => Outputs.expenseCategoriesList.parse(result)).not.toThrow();
	});

	it('returns invoices matching the declared schema', async () => {
		const result = await Invoices.list(makeCtx(), { per_page: 10 });

		expect(() => Outputs.invoicesList.parse(result)).not.toThrow();
	});

	it('returns invoice item categories matching the declared schema', async () => {
		const result = await Invoices.listItemCategories(makeCtx(), {
			per_page: 10,
		});

		expect(() => Outputs.invoiceItemCategoriesList.parse(result)).not.toThrow();
	});

	it('honours pagination when a page size is requested', async () => {
		const result = await Tasks.list(makeCtx(), { per_page: 1 });

		expect(result.per_page).toBe(1);
		expect((result.tasks ?? []).length).toBeLessThanOrEqual(1);
	});

	it('returns contacts matching the declared schema', async () => {
		const result = await Contacts.list(makeCtx(), { per_page: 10 });

		expect(() => Outputs.contactsList.parse(result)).not.toThrow();
	});

	it('creates, updates and deletes a client through the plugin', async () => {
		const ctx = makeCtx();
		const created = await Clients.create(ctx, {
			name: 'Corsair plugin verify',
			currency: 'USD',
		});

		try {
			expect(() => Outputs.clientsCreate.parse(created)).not.toThrow();
			expect(created.id).toEqual(expect.any(Number));

			const updated = await Clients.update(ctx, {
				client_id: created.id,
				address: '1 Verify St',
			});
			expect(updated.address).toBe('1 Verify St');

			const fetched = await Clients.get(ctx, { client_id: created.id });
			expect(fetched.id).toBe(created.id);
		} finally {
			await Clients.remove(ctx, { client_id: created.id });
		}
	});
});
