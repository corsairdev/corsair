import { z } from 'zod';
import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
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
		token: async (ctx: any) => ctx.keys.get_access_token(),
		note: async (ctx: any) => {
			await ctx.db.notes.upsertByEntityId('n1', { title: 'hi' });
			return true;
		},
	},
} as unknown as CorsairPlugin;

describe('withTenant account scope', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: any;
	beforeEach(async () => {
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [demo],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
		} as any);
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

	it("bound ref calls the provider with that account's token", async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const t = corsair.withTenant('t1', { accounts: { demo: 'b' } });
		expect(await t.demo.api.token()).toBe('tok-b');
	});

	it('unbound with two accounts rejects api calls with account_required naming both labels', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const err = await corsair
			.withTenant('t1')
			.demo.api.token()
			.catch((e: any) => e);
		expect(err.code).toBe('account_required');
		expect(err.message).toContain('a@x.com');
		expect(err.message).toContain('b@x.com');
	});

	it('unbound with one account works exactly as before', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		expect(await corsair.withTenant('t1').demo.api.token()).toBe('tok-a');
	});

	it('bound by email label works', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const t = corsair.withTenant('t1', { accounts: { demo: 'B@X.com' } });
		expect(await t.demo.api.token()).toBe('tok-b');
	});

	it('unknown account ref rejects with account_not_found', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const err = await corsair
			.withTenant('t1', { accounts: { demo: 'zed' } })
			.demo.api.token()
			.catch((e: any) => e);
		expect(err.code).toBe('account_not_found');
	});

	it('unbound resolution is not cached: a second account added later is noticed', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = corsair.withTenant('t1');
		expect(await t.demo.api.token()).toBe('tok-a');
		await addAccount('b', 'b@x.com', 'tok-b');
		const err = await t.demo.api.token().catch((e: any) => e);
		expect(err.code).toBe('account_required');
	});

	it('unbound ctx.db resolution is not cached either', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = corsair.withTenant('t1');
		await t.demo.api.note();
		await addAccount('b', 'b@x.com', 'tok-b');
		const err = await t.demo.api.note().catch((e: any) => e);
		expect(err.code).toBe('account_required');
	});

	it('withTenant with an unknown plugin id in accounts throws', () => {
		expect(() => corsair.withTenant('t1', { accounts: { nope: 'a' } })).toThrow(
			'withTenant: no plugin "nope"',
		);
	});

	it('ctx.db inside an endpoint writes to the bound account', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const idB = await addAccount('b', 'b@x.com', 'tok-b');
		await corsair.withTenant('t1', { accounts: { demo: 'b' } }).demo.api.note();
		const rows = await env.db
			.selectFrom('corsair_entities')
			.selectAll()
			.execute();
		expect(rows.map((r) => r.account_id)).toEqual([idB]);
	});

	it('withTenant(t) with no options leaves existing clients unchanged', async () => {
		await addAccount('a', 'a@x.com', 'tok-a');
		const t = corsair.withTenant('t1', {});
		expect(await t.demo.api.token()).toBe('tok-a');
		expect(await corsair.withTenant('t1').demo.api.token()).toBe('tok-a');
	});

	describe('without a kek', () => {
		let noKek: any;
		beforeEach(async () => {
			noKek = createCorsair({
				plugins: [demo],
				database: env.db,
				multiTenancy: true,
			} as any);
			await addAccount('a', 'a@x.com', 'tok-a');
		});

		it('naming an account throws', async () => {
			await expect(
				noKek.withTenant('t1', { accounts: { demo: 'a' } }).demo.api.note(),
			).rejects.toThrow('Selecting an account requires a kek');
		});

		it('unbound with one account uses the default row', async () => {
			await expect(noKek.withTenant('t1').demo.api.note()).resolves.toBe(true);
		});
	});
});
