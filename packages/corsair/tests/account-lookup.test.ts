import {
	findAccountRow,
	resolveIntegrationAndAccount,
} from '../core/account-lookup';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import { createCorsairOrm } from '../db/orm';
import { ensureIntegrationAccountRow } from '../hub/internal/account';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

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
			config: {},
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
			config: {},
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

describe('pick-first sites use the oldest account', () => {
	let t: TestDb;
	beforeEach(() => {
		t = createTestDatabase();
	});
	afterEach(() => t.cleanup());

	test('account key manager writes tokens to the oldest account', async () => {
		const at = new Date('2026-01-01');
		const integDek = generateDEK();
		await t.database.db
			.insertInto('corsair_integrations')
			.values({
				id: 'integ-gmail',
				created_at: at,
				updated_at: at,
				name: 'gmail',
				config: encryptConfig({}, integDek),
				dek: await encryptDEK(integDek, KEK),
			})
			.execute();
		// newer row inserted first so insertion order cannot mask the bug
		const seeds: [string, string][] = [
			['acct-new', '2026-02-01'],
			['acct-old', '2026-01-01'],
		];
		for (const [id, created] of seeds) {
			const dek = generateDEK();
			const when = new Date(created);
			await t.database.db
				.insertInto('corsair_accounts')
				.values({
					id,
					created_at: when,
					updated_at: when,
					tenant_id: 't1',
					integration_id: 'integ-gmail',
					config: encryptConfig({}, dek),
					dek: await encryptDEK(dek, KEK),
				})
				.execute();
		}
		const initial = await t.database.db
			.selectFrom('corsair_accounts')
			.select(['id', 'config'])
			.execute();
		const before = Object.fromEntries(initial.map((r) => [r.id, r.config]));

		const km = createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'gmail',
			tenantId: 't1',
			kek: KEK,
			database: t.database,
		});
		await km.set_access_token('tok');

		const after = Object.fromEntries(
			(
				await t.database.db
					.selectFrom('corsair_accounts')
					.select(['id', 'config'])
					.execute()
			).map((r) => [r.id, r.config]),
		);
		expect(after['acct-old']).not.toBe(before['acct-old']);
		expect(after['acct-new']).toBe(before['acct-new']);
	});

	test('orm accounts.findByTenantAndIntegration returns the oldest account', async () => {
		await seedIntegration(t.database);
		await seedAccount(t.database, 'acct-new', '2026-02-01');
		await seedAccount(t.database, 'acct-old', '2026-01-01');
		const orm = createCorsairOrm(t.database);
		expect(
			(await orm.accounts.findByTenantAndIntegration('t1', 'gmail'))?.id,
		).toBe('acct-old');
	});

	test('ensureIntegrationAccountRow still inserts exactly one row', async () => {
		await seedIntegration(t.database);
		await ensureIntegrationAccountRow(t.database, 'gmail', 't1', KEK);
		await ensureIntegrationAccountRow(t.database, 'gmail', 't1', KEK);
		const rows = await t.database.db
			.selectFrom('corsair_accounts')
			.select('id')
			.where('tenant_id', '=', 't1')
			.execute();
		expect(rows).toHaveLength(1);
	});
});
