/**
 * Live checks against a Salesforce org.
 *
 * Skipped unless `SALESFORCE_ACCESS_TOKEN` and `SALESFORCE_INSTANCE_URL` are
 * set. Writes create a throwaway Account named with a corsair-live prefix and
 * delete it afterwards.
 */
import { Accounts, Contacts, SoqlSosl } from './endpoints';
import { SalesforceEndpointOutputSchemas as Outputs } from './endpoints/types';
import { SalesforceAccountEntity } from './schema/database';

const accessToken = process.env.SALESFORCE_ACCESS_TOKEN;
const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;

const describeLive = accessToken && instanceUrl ? describe : describe.skip;

type Ctx = Parameters<typeof Accounts.listAccounts>[0];

const upserts: { id: string; data: unknown }[] = [];

function makeStore() {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push({ id, data });
		},
		deleteByEntityId: async (_id: string) => true,
	};
}

function makeCtx(): Ctx {
	return {
		key: accessToken ?? '',
		options: { instanceUrl },
		db: {
			account: makeStore(),
			contact: makeStore(),
			lead: makeStore(),
			opportunity: makeStore(),
		},
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

describeLive('Salesforce live API', () => {
	beforeEach(() => {
		upserts.length = 0;
	});

	it('runs SOQL against Account and matches the query envelope', async () => {
		const result = await SoqlSosl.runSoqlQuery(makeCtx(), {
			q: 'SELECT Id, Name FROM Account LIMIT 5',
		});
		expect(() => Outputs.runSoqlQuery.parse(result)).not.toThrow();
		expect(typeof result.done).toBe('boolean');
		expect(Array.isArray(result.records)).toBe(true);
	});

	it('lists accounts and caches official-shaped rows', async () => {
		const result = await Accounts.listAccounts(makeCtx(), { limit: 5 });
		expect(() => Outputs.listAccounts.parse(result)).not.toThrow();
		if (result.records[0]) {
			expect(() =>
				SalesforceAccountEntity.parse(result.records[0]),
			).not.toThrow();
			expect(upserts[0]?.id).toBe((result.records[0] as { Id: string }).Id);
		}
	});

	it('creates, reads, updates, and deletes a throwaway account', async () => {
		const stamp = `corsair-live-${Date.now()}`;
		const created = await Accounts.createAccount(makeCtx(), { Name: stamp });
		expect(created.id).toMatch(/^[a-zA-Z0-9]{15,18}$/);

		try {
			const got = await Accounts.getAccount(makeCtx(), { id: created.id });
			expect(got.Name === stamp || got.Id === created.id).toBe(true);

			const updated = await Accounts.updateAccount(makeCtx(), {
				id: created.id,
				Phone: '555-0100',
			});
			expect(updated.success).toBe(true);
		} finally {
			const deleted = await Accounts.deleteAccount(makeCtx(), {
				id: created.id,
			});
			expect(deleted.success).toBe(true);
		}
	});

	it('lists contacts without throwing', async () => {
		const result = await Contacts.listContacts(makeCtx(), { limit: 5 });
		expect(() => Outputs.listContacts.parse(result)).not.toThrow();
	});
});
