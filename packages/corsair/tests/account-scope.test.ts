import { z } from 'zod';
import { createCorsair } from '../core';
import { upsertAccount } from '../core/account-lookup';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import type { CorsairTenantWrapper } from '../core/client';
import { runWithMode } from '../core/permissions';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import type {
	DynamicTenant,
	EndpointCtx,
	NoteRow,
} from './multi-account-fixtures';
import {
	asSelectionError,
	dynamic,
	neverResolves,
} from './multi-account-fixtures';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

const demo = {
	id: 'demo',
	options: { authType: 'oauth_2' as const },
	authConfig: { oauth_2: { account: [] as const } },
	schema: {
		version: '1',
		entities: { notes: z.object({ title: z.string() }) },
	},
	endpoints: {
		token: async (ctx: EndpointCtx) => ctx.keys.get_access_token(),
		note: async (ctx: EndpointCtx) => {
			await ctx.db.notes.upsertByEntityId('n1', { title: 'hi' });
			return true;
		},
	},
} as unknown as CorsairPlugin;

describe('withTenant account scope', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: CorsairTenantWrapper<readonly [CorsairPlugin]>;
	const tenants = () => dynamic<'demo'>(corsair);
	beforeEach(async () => {
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [demo],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
			multiAccount: true,
		});
		getCorsairInternal(corsair).database!.isPg = false;
		await setupCorsair(corsair, { tenantId: 't1' });
		await env.db.deleteFrom('corsair_accounts').execute();
	});
	afterEach(() => env.cleanup());

	const database = () => getCorsairInternal(corsair).database!;
	const km = (ref?: string) =>
		createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'demo',
			tenantId: 't1',
			kek: KEK,
			database: database(),
			account: ref ? { ref } : undefined,
		});

	async function addAccount(
		ref: string,
		label: string,
		token: string,
		createdAt = new Date(ref === 'a' ? '2026-01-01' : '2026-02-01'),
	) {
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.where('name', '=', 'demo')
			.executeTakeFirstOrThrow();
		const dek = generateDEK();
		const id = `acct-${ref}`;
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id,
				created_at: createdAt,
				updated_at: createdAt,
				tenant_id: 't1',
				integration_id: integ.id,
				config: encryptConfig({ account_ref: ref, account_label: label }, dek),
				dek: await encryptDEK(dek, KEK),
			})
			.execute();
		await km(ref).set_access_token(token);
		return id;
	}

	// With multi-account off a reconnect hands the row to whoever signed in.
	it('a client bound to an account stops when its row passes to another identity', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = tenants().withTenant('t1', { accounts: { demo: 'a' } });
		expect(await t.demo.api.token()).toBe('tok-a');
		await upsertAccount({
			database: database(),
			kek: KEK,
			integrationName: 'demo',
			tenantId: 't1',
			identity: { id: 'b', label: 'b@x.com' },
			allowMany: false,
		});
		const err = asSelectionError(
			await t.demo.api.token().then(neverResolves, (e) => e),
		);
		expect(err.code).toBe('account_not_found');
	});

	it("a bound client's data writes follow its own account's mode", async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const scope = {
			mode: 'open' as const,
			accounts: { demo: { b: 'readonly' as const } },
		};
		await runWithMode(scope, async () => {
			const asA = tenants().withTenant('t1', { accounts: { demo: 'a' } });
			await expect(
				asA.demo.db.notes.upsertByEntityId('n1', { title: 'hi' }),
			).resolves.toBeDefined();
			const asB = tenants().withTenant('t1', { accounts: { demo: 'b' } });
			await expect(
				asB.demo.db.notes.upsertByEntityId('n2', { title: 'no' }),
			).rejects.toThrow();
		});
	});

	it("bound ref calls the provider with that account's token", async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const t = tenants().withTenant('t1', { accounts: { demo: 'b' } });
		expect(await t.demo.api.token()).toBe('tok-b');
	});

	describe('without a kek', () => {
		const noKek = () => {
			const c = createCorsair({
				plugins: [demo],
				database: env.db,
				multiTenancy: true,
				multiAccount: true,
			});
			getCorsairInternal(c).database!.isPg = false;
			return dynamic<'demo'>(c).withTenant('t1');
		};

		it('two unbound accounts throw account_required instead of picking the oldest', async () => {
			await addAccount('a', 'a@x.com', 'tok-a');
			await addAccount('b', 'b@x.com', 'tok-b');
			const err = asSelectionError(
				await noKek()
					.demo.api.note()
					.then(neverResolves, (e) => e),
			);
			expect(err.code).toBe('account_required');
			expect(err.accounts.map((a) => a.id).sort()).toEqual([
				'acct-a',
				'acct-b',
			]);
		});

		it('a single account still resolves', async () => {
			await addAccount('a', 'a@x.com', 'tok-a');
			expect(await noKek().demo.api.note()).toBe(true);
		});
	});

	it('unbound with two accounts rejects api calls with account_required naming both labels', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const err = await tenants()
			.withTenant('t1')
			.demo.api.token()
			.then(neverResolves, asSelectionError);
		expect(err.code).toBe('account_required');
		expect(err.message).toContain('a@x.com');
		expect(err.message).toContain('b@x.com');
	});

	it('unbound with one account works exactly as before', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		expect(await tenants().withTenant('t1').demo.api.token()).toBe('tok-a');
	});

	it('bound by email label works', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const t = tenants().withTenant('t1', { accounts: { demo: 'B@X.com' } });
		expect(await t.demo.api.token()).toBe('tok-b');
	});

	it('unknown account ref rejects with account_not_found', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const err = await tenants()
			.withTenant('t1', { accounts: { demo: 'zed' } })
			.demo.api.token()
			.then(neverResolves, asSelectionError);
		expect(err.code).toBe('account_not_found');
	});

	it('unbound resolution is not cached: a second account added later is noticed', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = tenants().withTenant('t1');
		expect(await t.demo.api.token()).toBe('tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const err = await t.demo.api.token().then(neverResolves, asSelectionError);
		expect(err.code).toBe('account_required');
	});

	it('unbound ctx.db resolution is not cached either', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = tenants().withTenant('t1');
		await t.demo.api.note();
		await addAccount('b', 'b@x.com', 'tok-b');
		const err = await t.demo.api.note().then(neverResolves, asSelectionError);
		expect(err.code).toBe('account_required');
	});

	it('a bound client follows a reconnected account instead of writing under the deleted id', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = tenants().withTenant('t1', { accounts: { demo: 'a' } });
		await t.demo.api.note();
		await env.db.deleteFrom('corsair_entities').execute();
		await env.db.deleteFrom('corsair_accounts').execute();
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.where('name', '=', 'demo')
			.executeTakeFirstOrThrow();
		const dek = generateDEK();
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id: 'acct-a2',
				created_at: new Date(),
				updated_at: new Date(),
				tenant_id: 't1',
				integration_id: integ.id,
				config: encryptConfig(
					{ account_ref: 'a', account_label: 'a@x.com' },
					dek,
				),
				dek: await encryptDEK(dek, KEK),
			})
			.execute();
		await t.demo.api.note();
		const rows = await env.db
			.selectFrom('corsair_entities')
			.select('account_id')
			.execute();
		expect(rows.map((r) => r.account_id)).toEqual(['acct-a2']);
	});

	it('withTenant with an unknown plugin id in accounts throws', () => {
		expect(() =>
			tenants().withTenant('t1', { accounts: { nope: 'a' } }),
		).toThrow('withTenant: no plugin "nope"');
	});

	it('ctx.db inside an endpoint writes to the bound account', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const idB = await addAccount('b', 'b@x.com', 'tok-b');
		await tenants()
			.withTenant('t1', { accounts: { demo: 'b' } })
			.demo.api.note();
		const rows = await env.db
			.selectFrom('corsair_entities')
			.selectAll()
			.execute();
		expect(rows.map((r) => r.account_id)).toEqual([idB]);
	});

	it('withTenant(t) with no options leaves existing clients unchanged', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = tenants().withTenant('t1', {});
		expect(await t.demo.api.token()).toBe('tok-a');
		expect(await tenants().withTenant('t1').demo.api.token()).toBe('tok-a');
	});

	describe('without a kek', () => {
		let noKek: CorsairTenantWrapper<readonly [CorsairPlugin]>;
		beforeEach(async () => {
			noKek = createCorsair({
				plugins: [demo],
				database: env.db,
				multiTenancy: true,
				multiAccount: true,
			});
			await addAccount('a', 'a@x.com', 'tok-a');
		});

		it('naming an account throws', async () => {
			await expect(
				dynamic<'demo'>(noKek)
					.withTenant('t1', { accounts: { demo: 'a' } })
					.demo.api.note(),
			).rejects.toThrow('Selecting an account requires a kek');
		});

		it('unbound with one account uses the default row', async () => {
			await expect(
				dynamic<'demo'>(noKek).withTenant('t1').demo.api.note(),
			).resolves.toBe(true);
		});
	});

	describe('api.db reads across accounts', () => {
		const notes = (t: DynamicTenant<'demo'>) => t.demo.db.notes;
		const bound = (ref: string) =>
			tenants().withTenant('t1', { accounts: { demo: ref } });
		const titles = (rows: { data: { title: string } }[]) =>
			rows.map((r) => r.data.title).sort();

		async function seed(counts: { a: number; b: number }) {
			await addAccount('a', 'a@x.com', 'tok-a');
			await addAccount('b', 'b@x.com', 'tok-b');
			for (let i = 0; i < counts.a; i++) {
				await notes(bound('a')).upsertByEntityId(`a${i}`, { title: `a${i}` });
			}
			for (let i = 0; i < counts.b; i++) {
				await notes(bound('b')).upsertByEntityId(`b${i}`, { title: `b${i}` });
			}
		}

		it("api.db.list across two unbound accounts returns both accounts' rows, each tagged with its label", async () => {
			await seed({ a: 1, b: 1 });
			const rows = await notes(tenants().withTenant('t1')).list();
			expect(
				rows.map((r: NoteRow) => [r.data.title, r.account]).sort(),
			).toEqual([
				['a0', 'a@x.com'],
				['b0', 'b@x.com'],
			]);
		});

		it('list with limit/offset pages over the merged set', async () => {
			await seed({ a: 3, b: 2 });
			const t = tenants().withTenant('t1');
			const page1 = await notes(t).list({ limit: 4 });
			const page2 = await notes(t).list({ limit: 4, offset: 4 });
			expect(page1).toHaveLength(4);
			expect(page2).toHaveLength(1);
			expect(titles([...page1, ...page2])).toEqual([
				'a0',
				'a1',
				'a2',
				'b0',
				'b1',
			]);
		});

		it('point lookups on a shared entity_id answer from the oldest account', async () => {
			await addAccount('a', 'a@x.com', 'tok-a');
			await addAccount('b', 'b@x.com', 'tok-b');
			// the newer account's row is the older row
			await notes(bound('b')).upsertByEntityId('dup', { title: 'from-b' });
			await new Promise((r) => setTimeout(r, 5));
			await notes(bound('a')).upsertByEntityId('dup', { title: 'from-a' });
			const t = tenants().withTenant('t1');
			const row = await notes(t).findByEntityId('dup');
			expect(row?.data.title).toBe('from-a');
			expect(row?.account).toBe('a@x.com');
			const [a] = await notes(bound('a')).findManyByEntityIds(['dup']);
			expect(await notes(t).findIdByEntityId('dup')).toBe(a?.id);
			expect(await notes(t).existsByEntityId('dup')).toBe(true);
			const many = await notes(t).findManyByEntityIds(['dup']);
			expect(many.map((r: NoteRow) => r.account).sort()).toEqual([
				'a@x.com',
				'b@x.com',
			]);
			const found = await notes(t).search({ entity_id: 'dup' });
			expect(found.map((r: NoteRow) => r.account).sort()).toEqual([
				'a@x.com',
				'b@x.com',
			]);
		});

		it('count sums both accounts', async () => {
			await seed({ a: 3, b: 2 });
			expect(await notes(tenants().withTenant('t1')).count()).toBe(5);
		});

		it('findByEntityId finds a row that lives in the second account', async () => {
			await seed({ a: 1, b: 1 });
			const row = await notes(tenants().withTenant('t1')).findByEntityId('b0');
			expect(row?.data.title).toBe('b0');
			expect(row?.account).toBe('b@x.com');
		});

		it('search with data filter spans accounts', async () => {
			await seed({ a: 1, b: 1 });
			const rows = await notes(tenants().withTenant('t1')).search({
				data: { title: { startsWith: 'b' } },
			});
			expect(titles(rows)).toEqual(['b0']);
			const all = await notes(tenants().withTenant('t1')).search({
				data: { title: { contains: '0' } },
			});
			expect(titles(all)).toEqual(['a0', 'b0']);
		});

		it('a client bound to one account returns only its rows, untagged', async () => {
			await seed({ a: 2, b: 1 });
			const rows = await notes(bound('a')).list();
			expect(titles(rows)).toEqual(['a0', 'a1']);
			expect(rows.every((r: NoteRow) => !('account' in r))).toBe(true);
		});

		it('single-account tenant returns rows with no account field', async () => {
			await addAccount('a', 'a@x.com', 'tok-a');
			await notes(bound('a')).upsertByEntityId('a0', { title: 'a0' });
			const rows = await notes(tenants().withTenant('t1')).list();
			expect(rows).toHaveLength(1);
			expect(rows[0]).not.toHaveProperty('account');
		});

		it('a single-account read does not decrypt the account identity', async () => {
			await addAccount('a', 'a@x.com', 'tok-a');
			await notes(bound('a')).upsertByEntityId('a0', { title: 'a0' });
			const spy = jest.spyOn(require('../core/auth/encryption'), 'decryptDEK');
			try {
				const rows = await notes(tenants().withTenant('t1')).list();
				expect(rows).toHaveLength(1);
				expect(spy).not.toHaveBeenCalled();
			} finally {
				spy.mockRestore();
			}
		});

		it('upsertByEntityId with two unbound accounts throws account_required; bound writes to that account', async () => {
			await seed({ a: 0, b: 0 });
			const err = await notes(tenants().withTenant('t1'))
				.upsertByEntityId('x', { title: 'x' })
				.then(neverResolves, asSelectionError);
			expect(err.code).toBe('account_required');
			await notes(bound('b')).upsertByEntityId('x', { title: 'x' });
			const rows = await env.db
				.selectFrom('corsair_entities')
				.select('account_id')
				.execute();
			expect(rows.map((r) => r.account_id)).toEqual(['acct-b']);
		});

		it('with encryptDataAtRest, rows from two accounts each decrypt with their own DEK', async () => {
			const enc = dynamic<'demo'>(
				createCorsair({
					plugins: [demo],
					database: env.db,
					kek: KEK,
					multiTenancy: true,
					multiAccount: true,
					encryptDataAtRest: true,
				}),
			);
			getCorsairInternal(enc).database!.isPg = false;
			await addAccount('a', 'a@x.com', 'tok-a');
			await addAccount('b', 'b@x.com', 'tok-b');
			for (const ref of ['a', 'b']) {
				await enc
					.withTenant('t1', { accounts: { demo: ref } })
					.demo.db.notes.upsertByEntityId(ref, { title: `t-${ref}` });
			}
			const rows = await enc.withTenant('t1').demo.db.notes.list();
			expect(titles(rows)).toEqual(['t-a', 't-b']);
			expect(rows.map((r: NoteRow) => r.account).sort()).toEqual([
				'a@x.com',
				'b@x.com',
			]);
		});
	});
});
