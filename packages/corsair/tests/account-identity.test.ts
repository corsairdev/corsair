import {
	AccountSelectionError,
	listAccounts,
	resolveAccount,
	upsertAccount,
} from '../core/account-lookup';
import {
	decryptConfig,
	decryptDEK,
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
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

	test('resolveAccount with a label matching two accounts throws account_required', async () => {
		await seedAccount(t, 'x1', '2026-01-01', {
			ref: 'r1',
			label: 'same@x.com',
		});
		await seedAccount(t, 'x2', '2026-01-02', {
			ref: 'r2',
			label: 'same@x.com',
		});
		const err = await resolveAccount(input(t, 'SAME@x.com')).catch((e) => e);
		expect(err).toBeInstanceOf(AccountSelectionError);
		expect(err.code).toBe('account_required');
		expect(err.message).toBe(
			'Label "SAME@x.com" matches 2 accounts for "gmail" (tenant "t1"): r1, r2. Name one by its id.',
		);
		expect((await resolveAccount(input(t, 'x2')))?.id).toBe('x2');
		expect((await resolveAccount(input(t, 'r1')))?.id).toBe('x1');
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

describe('upsertAccount', () => {
	let t: TestDb;
	beforeEach(async () => {
		t = createTestDatabase();
		await seedIntegration(t);
	});
	afterEach(() => t.cleanup());

	const up = (identity?: { id: string; label?: string }) =>
		upsertAccount({
			database: t.database,
			kek: KEK,
			integrationName: 'gmail',
			tenantId: 't1',
			identity,
			allowMany: true,
		});
	const rowCount = async () =>
		(await t.database.db.selectFrom('corsair_accounts').select('id').execute())
			.length;
	const list = () => listAccounts(input(t));

	test('no identity inserts one row and returns it again on the second call', async () => {
		const a = await up();
		const b = await up();
		expect(a.created).toBe(true);
		expect(b).toEqual({ accountId: a.accountId, created: false });
		expect(await rowCount()).toBe(1);
	});

	test('same identity twice yields one row and refreshes the label', async () => {
		const a = await up({ id: 'r1', label: 'old@x.com' });
		const b = await up({ id: 'r1', label: 'new@x.com' });
		expect(b).toEqual({ accountId: a.accountId, created: false });
		const [acct] = await list();
		expect(acct?.ref).toBe('r1');
		expect(acct?.label).toBe('new@x.com');
		expect(await rowCount()).toBe(1);
	});

	test('a new identity inserts a second row; listAccounts returns both oldest-first', async () => {
		const a = await up({ id: 'r1', label: 'a@x.com' });
		await new Promise((r) => setTimeout(r, 5));
		const b = await up({ id: 'r2', label: 'b@x.com' });
		expect(b.created).toBe(true);
		expect((await list()).map((x) => x.id)).toEqual([a.accountId, b.accountId]);
	});

	test('a legacy ref-less row is adopted by the first identity and not duplicated', async () => {
		await seedAccount(t, 'legacy', '2026-01-01', { legacy: true });
		const r = await up({ id: 'r1', label: 'a@x.com' });
		expect(r).toEqual({ accountId: 'legacy', created: false });
		const [acct] = await list();
		expect([acct?.ref, acct?.label]).toEqual(['r1', 'a@x.com']);
		expect(acct?.dek).not.toBeNull();
		expect(await rowCount()).toBe(1);
	});

	test('adopting a row keeps its stored tokens alongside ref and label', async () => {
		const dek = generateDEK();
		const at = new Date('2026-01-01');
		await t.database.db
			.insertInto('corsair_accounts')
			.values({
				id: 'tok',
				created_at: at,
				updated_at: at,
				tenant_id: 't1',
				integration_id: 'integ-gmail',
				config: encryptConfig({ access_token: 'secret' }, dek),
				dek: await encryptDEK(dek, KEK),
			})
			.execute();
		await up({ id: 'r1', label: 'a@x.com' });
		const [acct] = await list();
		const plain = decryptConfig(
			JSON.parse(acct?.config as string),
			await decryptDEK(acct?.dek as string, KEK),
		);
		expect(plain).toEqual({
			access_token: 'secret',
			account_ref: 'r1',
			account_label: 'a@x.com',
		});
	});

	test('adopting a null-dek row keeps its plaintext config and seals it', async () => {
		const at = new Date('2026-01-01');
		await t.database.db
			.insertInto('corsair_accounts')
			.values({
				id: 'plain',
				created_at: at,
				updated_at: at,
				tenant_id: 't1',
				integration_id: 'integ-gmail',
				config: { access_token: 'secret' },
				dek: null,
			})
			.execute();
		await up({ id: 'r1', label: 'a@x.com' });
		const [acct] = await list();
		expect(acct?.dek).not.toBeNull();
		const plain = decryptConfig(
			JSON.parse(acct?.config as string),
			await decryptDEK(acct?.dek as string, KEK),
		);
		expect(plain).toEqual({
			access_token: 'secret',
			account_ref: 'r1',
			account_label: 'a@x.com',
		});
	});

	test('reconnecting without a label keeps the stored label', async () => {
		await up({ id: 'r1', label: 'a@x.com' });
		await up({ id: 'r1' });
		expect((await list())[0]?.label).toBe('a@x.com');
	});

	test('adoption skips rows that already have a ref', async () => {
		await seedAccount(t, 'a', '2026-01-01', { ref: 'rA', label: 'a@x.com' });
		await seedAccount(t, 'blank', '2026-01-02', { legacy: true });
		const r = await up({ id: 'rB', label: 'b@x.com' });
		expect(r).toEqual({ accountId: 'blank', created: false });
		expect(await rowCount()).toBe(2);
	});

	test('the sixth identity throws account_limit and writes nothing', async () => {
		for (let n = 1; n <= 5; n++) await up({ id: `r${n}`, label: `${n}@x.com` });
		const err = await up({ id: 'r6' }).catch((e) => e);
		expect(err).toBeInstanceOf(AccountSelectionError);
		expect(err.code).toBe('account_limit');
		expect(err.message).toBe(
			'Account limit reached: tenant "t1" already has 5 accounts for "gmail".',
		);
		expect(await rowCount()).toBe(5);
	});

	test('five concurrent connects of the same identity leave one row', async () => {
		await Promise.all(
			Array.from({ length: 5 }, () => up({ id: 'r1', label: 'a@x.com' })),
		);
		expect(await rowCount()).toBe(1);
	});

	test('no identity with two existing accounts returns the oldest without inserting', async () => {
		await seedAccount(t, 'new', '2026-02-01', { ref: 'r2' });
		await seedAccount(t, 'old', '2026-01-01', { ref: 'r1' });
		expect(await up()).toEqual({ accountId: 'old', created: false });
		expect(await rowCount()).toBe(2);
	});

	test('unknown integration keeps the existing error', async () => {
		await expect(
			upsertAccount({
				database: t.database,
				kek: KEK,
				integrationName: 'nope',
				tenantId: 't1',
				allowMany: true,
			}),
		).rejects.toThrow("Integration 'nope' not found. Run setupCorsair first.");
	});
});

describe('account key manager scope', () => {
	let t: TestDb;
	beforeEach(async () => {
		t = createTestDatabase();
		await seedIntegration(t);
		await seedAccount(t, 'a-old', '2026-01-01', {
			ref: 'old@x.com',
			label: 'Old',
		});
		await seedAccount(t, 'a-new', '2026-02-01', {
			ref: 'new@x.com',
			label: 'New',
		});
	});
	afterEach(() => t.cleanup());

	const km = (account?: { ref?: string }) =>
		createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'gmail',
			tenantId: 't1',
			kek: KEK,
			database: t.database,
			account,
		});
	const storedConfig = async (id: string) => {
		const row = await t.database.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
		const raw =
			typeof row.config === 'string' ? JSON.parse(row.config) : row.config;
		return decryptConfig(raw, await decryptDEK(row.dek!, KEK));
	};
	const storedToken = async (id: string) =>
		(await storedConfig(id)).access_token;

	test("account scope by provider id writes and reads that account's token only", async () => {
		const m = km({ ref: 'new@x.com' });
		await m.set_access_token('tok-new');
		expect(await m.get_access_token()).toBe('tok-new');
		expect(await storedToken('a-new')).toBe('tok-new');
		expect(await storedToken('a-old')).toBeUndefined();
	});

	test('account scope by row id works', async () => {
		const m = km({ ref: 'a-old' });
		await m.set_access_token('tok-old');
		expect(await storedToken('a-old')).toBe('tok-old');
		expect(await storedToken('a-new')).toBeUndefined();
	});

	test('account scope with no ref and two accounts throws account_required on get_access_token', async () => {
		await expect(km({}).get_access_token()).rejects.toMatchObject({
			code: 'account_required',
		});
	});

	test('account scope with no ref and one account behaves like the default', async () => {
		await t.database.db
			.deleteFrom('corsair_accounts')
			.where('id', '=', 'a-new')
			.execute();
		const m = km({});
		await m.set_access_token('tok');
		expect(await m.get_access_token()).toBe('tok');
		expect(await storedToken('a-old')).toBe('tok');
	});

	test('unknown ref throws account_not_found', async () => {
		await expect(
			km({ ref: 'nobody@x.com' }).get_access_token(),
		).rejects.toMatchObject({ code: 'account_not_found' });
	});

	test('an unscoped manager still writes to the oldest account', async () => {
		await km().set_access_token('tok');
		expect(await storedToken('a-old')).toBe('tok');
		expect(await storedToken('a-new')).toBeUndefined();
	});

	test('a long-lived unscoped scope notices a second account added later', async () => {
		await t.database.db
			.deleteFrom('corsair_accounts')
			.where('id', '=', 'a-new')
			.execute();
		const m = km({});
		await m.set_access_token('tok');
		expect(await m.get_access_token()).toBe('tok');
		await seedAccount(t, 'a-late', '2026-03-01', { ref: 'late@x.com' });
		await expect(m.get_access_token()).rejects.toMatchObject({
			code: 'account_required',
		});
	});

	test('set_access_token keeps account_ref and account_label in the sealed config', async () => {
		await km({ ref: 'new@x.com' }).set_access_token('tok');
		const cfg = await storedConfig('a-new');
		expect(cfg).toMatchObject({
			access_token: 'tok',
			account_ref: 'new@x.com',
			account_label: 'New',
		});
	});
});

describe('public entry exports', () => {
	it('exposes AccountSelectionError for instanceof checks', async () => {
		const entry = await import('../core');
		const own = await import('../core/account-lookup');
		const err = new own.AccountSelectionError('account_required', 'x');
		expect(err instanceof entry.AccountSelectionError).toBe(true);
	});
});
