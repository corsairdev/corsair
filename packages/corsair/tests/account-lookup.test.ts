import {
	findAccountRow,
	resolveIntegrationAndAccount,
} from '../core/account-lookup';
import { createTestDatabase } from './setup-db';

type TestDb = ReturnType<typeof createTestDatabase>;

async function seedIntegration(database: TestDb['database']) {
	const now = new Date('2026-01-01');
	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integ-gmail',
			created_at: now,
			updated_at: now,
			name: 'gmail',
			config: '{}',
			dek: null,
		})
		.execute();
	return { id: 'integ-gmail' };
}

async function seedAccount(
	database: TestDb['database'],
	id: string,
	createdAt: string,
	tenantId = 't1',
) {
	const at = new Date(createdAt);
	await database.db
		.insertInto('corsair_accounts')
		.values({
			id,
			created_at: at,
			updated_at: at,
			tenant_id: tenantId,
			integration_id: 'integ-gmail',
			config: '{}',
			dek: null,
		})
		.execute();
}

describe('findAccountRow', () => {
	let t: TestDb;
	beforeEach(() => {
		t = createTestDatabase();
	});
	afterEach(() => t.cleanup());

	test('returns the oldest account when a tenant has two for one integration', async () => {
		const integ = await seedIntegration(t.database);
		await seedAccount(t.database, 'acct-new', '2026-02-01');
		await seedAccount(t.database, 'acct-old', '2026-01-01');
		const row = await findAccountRow(t.db, {
			tenantId: 't1',
			integrationId: integ.id,
		});
		expect(row?.id).toBe('acct-old');
	});

	test('breaks created_at ties by id', async () => {
		const integ = await seedIntegration(t.database);
		await seedAccount(t.database, 'b', '2026-01-01');
		await seedAccount(t.database, 'a', '2026-01-01');
		expect(
			(await findAccountRow(t.db, { tenantId: 't1', integrationId: integ.id }))
				?.id,
		).toBe('a');
	});

	test('ignores other tenants', async () => {
		const integ = await seedIntegration(t.database);
		await seedAccount(t.database, 'other', '2026-01-01', 't2');
		expect(
			await findAccountRow(t.db, { tenantId: 't1', integrationId: integ.id }),
		).toBeUndefined();
	});

	test('resolveIntegrationAndAccount returns the oldest account', async () => {
		await seedIntegration(t.database);
		await seedAccount(t.database, 'acct-new', '2026-02-01');
		await seedAccount(t.database, 'acct-old', '2026-01-01');
		const r = await resolveIntegrationAndAccount({
			database: t.database,
			integrationName: 'gmail',
			tenantId: 't1',
		});
		expect(r.accountId).toBe('acct-old');
	});
});
