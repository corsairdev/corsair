import {
	AccountSelectionError,
	listAccounts,
	resolveAccount,
} from '../core/account-lookup';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

type TestDb = ReturnType<typeof createTestDatabase>;

async function seedIntegration(t: TestDb) {
	const now = new Date('2026-01-01');
	const dek = generateDEK();
	await t.database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integ-gmail',
			created_at: now,
			updated_at: now,
			name: 'gmail',
			config: encryptConfig({}, dek),
			dek: await encryptDEK(dek, KEK),
		})
		.execute();
}

async function seedAccount(
	t: TestDb,
	id: string,
	createdAt: string,
	opts: {
		ref?: string;
		label?: string;
		tenantId?: string;
		legacy?: boolean;
		dek?: string | null;
	} = {},
) {
	const at = new Date(createdAt);
	const dek = generateDEK();
	const config = opts.legacy
		? {}
		: encryptConfig(
				{
					...(opts.ref ? { account_ref: opts.ref } : {}),
					...(opts.label ? { account_label: opts.label } : {}),
				},
				dek,
			);
	await t.database.db
		.insertInto('corsair_accounts')
		.values({
			id,
			created_at: at,
			updated_at: at,
			tenant_id: opts.tenantId ?? 't1',
			integration_id: 'integ-gmail',
			config,
			dek: opts.dek !== undefined ? opts.dek : await encryptDEK(dek, KEK),
		})
		.execute();
}

const input = (t: TestDb, ref?: string) => ({
	db: t.db,
	kek: KEK,
	integrationId: 'integ-gmail',
	tenantId: 't1',
	ref,
});

describe('listAccounts / resolveAccount', () => {
	let t: TestDb;
	beforeEach(async () => {
		t = createTestDatabase();
		await seedIntegration(t);
	});
	afterEach(() => t.cleanup());

	async function seedTwo() {
		await seedAccount(t, 'new', '2026-02-01', {
			ref: 'r-new',
			label: 'new@x.com',
		});
		await seedAccount(t, 'old', '2026-01-01', {
			ref: 'r-old',
			label: 'old@x.com',
		});
	}

	test('listAccounts returns both accounts oldest-first with decrypted ref and label', async () => {
		await seedTwo();
		const list = await listAccounts(input(t));
		expect(list.map((a) => a.id)).toEqual(['old', 'new']);
		expect(list.map((a) => a.ref)).toEqual(['r-old', 'r-new']);
		expect(list.map((a) => a.label)).toEqual(['old@x.com', 'new@x.com']);
	});

	test('listAccounts leaves ref/label undefined for a legacy row (config {}) and a null-dek row', async () => {
		await seedAccount(t, 'legacy', '2026-01-01', { legacy: true });
		await seedAccount(t, 'nodek', '2026-01-02', { ref: 'r', dek: null });
		const list = await listAccounts(input(t));
		expect(list.map((a) => [a.ref, a.label])).toEqual([
			[undefined, undefined],
			[undefined, undefined],
		]);
	});

	test('resolveAccount with no ref and one account returns it without decrypting', async () => {
		await seedAccount(t, 'solo', '2026-01-01', {
			legacy: true,
			dek: 'not-a-real-dek',
		});
		expect((await resolveAccount(input(t)))?.id).toBe('solo');
	});

	test('resolveAccount with no ref and two accounts throws account_required naming both labels', async () => {
		await seedTwo();
		const err = await resolveAccount(input(t)).catch((e) => e);
		expect(err).toBeInstanceOf(AccountSelectionError);
		expect(err.code).toBe('account_required');
		expect(err.message).toContain('old@x.com, new@x.com');
		expect(err.message).toBe(
			'Plugin "gmail" has 2 accounts for tenant "t1": old@x.com, new@x.com. Name one with withTenant(tenantId, { accounts: { gmail: "<account>" } }).',
		);
		expect(err.accounts).toHaveLength(2);
	});

	test('resolveAccount matches by provider id', async () => {
		await seedTwo();
		expect((await resolveAccount(input(t, 'r-new')))?.id).toBe('new');
	});

	test('resolveAccount matches by email label (case-insensitive)', async () => {
		await seedTwo();
		expect((await resolveAccount(input(t, 'OLD@x.com')))?.id).toBe('old');
	});

	test('resolveAccount matches by row id', async () => {
		await seedTwo();
		expect((await resolveAccount(input(t, 'new')))?.id).toBe('new');
	});

	test('resolveAccount with an unknown ref throws account_not_found listing accounts', async () => {
		await seedTwo();
		const err = await resolveAccount(input(t, 'zed')).catch((e) => e);
		expect(err).toBeInstanceOf(AccountSelectionError);
		expect(err.code).toBe('account_not_found');
		expect(err.message).toBe(
			'No account "zed" for "gmail" (tenant "t1"). Accounts: old@x.com, new@x.com.',
		);
	});

	test('resolveAccount returns undefined when the tenant has no account', async () => {
		expect(await resolveAccount(input(t))).toBeUndefined();
	});

	test("resolveAccount ignores other tenants' accounts", async () => {
		await seedAccount(t, 'other', '2026-01-01', {
			ref: 'r',
			label: 'o@x.com',
			tenantId: 't2',
		});
		expect(await resolveAccount(input(t))).toBeUndefined();
	});
});
