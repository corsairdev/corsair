import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { renewAccounts, renewSubscriptions } from '../oauth/renewal';
import { resolveAccountFromWebhookLink } from '../webhooks/tenant-links';
import { createTestDatabase } from './setup-db';

// The keys renewal hands subscribe are the account's key manager; these stubs read only its token.
type AccountKeys = { get_access_token(): Promise<string | null> };

const internalBase = {
	plugins: [] as any[],
	kek: 'k'.repeat(64),
	multiTenancy: true,
	database: { db: {} },
} as any;

describe('renewAccounts (BYO subscription renewal)', () => {
	it('re-subscribes every account whose plugin has subscribe, skips the rest', async () => {
		const called: string[] = [];
		const outlook = { id: 'outlook', subscribe: async () => ({}) };
		const github = { id: 'github' }; // no subscribe capability
		const result = await renewAccounts({
			corsair: {},
			internal: { ...internalBase, plugins: [outlook, github] },
			rows: [
				{ tenantId: 't1', integrationName: 'outlook' },
				{ tenantId: 't2', integrationName: 'outlook' },
				{ tenantId: 't1', integrationName: 'github' },
				{ tenantId: 't1', integrationName: 'unknown' },
			],
			subscribeAndReport: async (_c, plugin, tenantId, keys) => {
				expect((keys as AccountKeys).get_access_token).toBeDefined();
				called.push(`${plugin.id}/${tenantId}`);
				return undefined;
			},
		});

		expect(called).toEqual(['outlook/t1', 'outlook/t2']);
		expect(result).toEqual({
			renewed: ['outlook/t1', 'outlook/t2'],
			failed: [],
		});
	});

	it('primes the plugin keyBuilder before subscribing so expired tokens refresh', async () => {
		const order: string[] = [];
		const outlook = {
			id: 'outlook',
			subscribe: async () => ({}),
			keyBuilder: async (ctx: any, source: string) => {
				expect(ctx.authType).toBe('oauth_2');
				expect(ctx.keys.get_access_token).toBeDefined();
				expect(source).toBe('endpoint');
				// bookkeeping must be expired BEFORE the keyBuilder runs, so its
				// refresh branch always fires (stored expires_at can drift from
				// the real token under concurrent-write races)
				expect(await ctx.keys.get_expires_at()).toBe('0');
				order.push('keyBuilder');
				return 'fresh-token';
			},
		};
		const result = await renewAccounts({
			corsair: {},
			internal: { ...internalBase, plugins: [outlook] },
			rows: [{ tenantId: 't1', integrationName: 'outlook' }],
			subscribeAndReport: async () => {
				order.push('subscribe');
				return undefined;
			},
		});

		expect(order).toEqual(['keyBuilder', 'subscribe']);
		expect(result.renewed).toEqual(['outlook/t1']);
	});

	it('isolates per-account failures and tallies them', async () => {
		const outlook = { id: 'outlook', subscribe: async () => ({}) };
		const result = await renewAccounts({
			corsair: {},
			internal: { ...internalBase, plugins: [outlook] },
			rows: [
				{ tenantId: 'bad', integrationName: 'outlook' },
				{ tenantId: 'good', integrationName: 'outlook' },
			],
			subscribeAndReport: async (_c, _p, tenantId) => {
				if (tenantId === 'bad') throw new Error('provider 500');
				return undefined;
			},
		});

		expect(result).toEqual({
			renewed: ['outlook/good'],
			failed: ['outlook/bad'],
		});
	});

	it('primes a managed plugin with its authType AND hub, expiry forced', async () => {
		const seen: Array<{
			authType: string;
			hasHub: boolean;
			expiresAt: string;
		}> = [];
		const outlook = {
			id: 'outlook',
			options: { authType: 'managed' },
			authConfig: { managed: { account: ['subscription_id', 'client_state'] } },
			subscribe: async () => ({}),
			keyBuilder: async (ctx: any) => {
				// mirror the real managed keyBuilder branch, which throws without hub
				if (ctx.authType === 'managed' && !ctx.hub) {
					throw new Error('Hub config is required for managed auth');
				}
				seen.push({
					authType: ctx.authType,
					hasHub: !!ctx.hub,
					expiresAt: await ctx.keys.get_expires_at(),
				});
				return 'tok';
			},
		};
		const result = await renewAccounts({
			corsair: {},
			internal: {
				...internalBase,
				hub: { signingSecret: 's' },
				plugins: [outlook],
			},
			rows: [{ tenantId: 't1', integrationName: 'outlook' }],
			subscribeAndReport: async () => undefined,
		});

		expect(seen).toEqual([
			{ authType: 'managed', hasHub: true, expiresAt: '0' },
		]);
		expect(result.renewed).toEqual(['outlook/t1']);
	});
});

describe('renewal per account', () => {
	const plugin = { id: 'outlook', subscribe: async () => ({}) };
	const kek = 'test-kek-with-at-least-32-characters!!';

	async function seedTwoAccounts(t: ReturnType<typeof createTestDatabase>) {
		const now = new Date('2026-01-01');
		const idek = generateDEK();
		await t.db
			.insertInto('corsair_integrations')
			.values({
				id: 'i1',
				created_at: now,
				updated_at: now,
				name: 'outlook',
				config: encryptConfig({}, idek),
				dek: await encryptDEK(idek, kek),
			})
			.execute();
		for (const id of ['a1', 'a2']) {
			const dek = generateDEK();
			await t.db
				.insertInto('corsair_accounts')
				.values({
					id,
					created_at: now,
					updated_at: now,
					tenant_id: 't1',
					integration_id: 'i1',
					config: encryptConfig({ access_token: `tok-${id}` }, dek),
					dek: await encryptDEK(dek, kek),
				})
				.execute();
		}
	}

	it('renewAccounts renews two accounts of one tenant separately, each with its own keys', async () => {
		const t = createTestDatabase();
		try {
			await seedTwoAccounts(t);
			const tokens: string[] = [];
			const result = await renewAccounts({
				corsair: {},
				internal: {
					...internalBase,
					kek,
					database: t.database,
					plugins: [plugin],
				},
				rows: [
					{ tenantId: 't1', integrationName: 'outlook', accountId: 'a1' },
					{ tenantId: 't1', integrationName: 'outlook', accountId: 'a2' },
				],
				subscribeAndReport: async (_c, _p, _t, keys) => {
					tokens.push(
						(await (keys as AccountKeys).get_access_token()) as string,
					);
					return undefined;
				},
			});
			expect(result).toEqual({
				renewed: ['outlook/t1/a1', 'outlook/t1/a2'],
				failed: [],
			});
			expect(tokens).toEqual(['tok-a1', 'tok-a2']);
		} finally {
			t.cleanup();
		}
	});

	it('saves each renewed webhook link on its own account', async () => {
		const t = createTestDatabase();
		try {
			await seedTwoAccounts(t);
			const rows = [
				{ tenantId: 't1', integrationName: 'outlook', accountId: 'a1' },
				{ tenantId: 't1', integrationName: 'outlook', accountId: 'a2' },
			];
			let n = 0;
			await renewAccounts({
				corsair: {},
				internal: {
					...internalBase,
					kek,
					database: t.database,
					plugins: [plugin],
				},
				rows,
				subscribeAndReport: async () => ({
					linkType: 'subscription_id',
					externalId: `sub-${++n}`,
				}),
			});
			for (const [i, id] of ['a1', 'a2'].entries()) {
				const found = await resolveAccountFromWebhookLink({
					database: t.database,
					kek,
					pluginId: 'outlook',
					linkType: 'subscription_id',
					externalId: `sub-${i + 1}`,
				});
				expect(found?.id).toBe(id);
			}
		} finally {
			t.cleanup();
		}
	});

	it('renewAccounts without accountId behaves as before', async () => {
		const result = await renewAccounts({
			corsair: {},
			internal: { ...internalBase, plugins: [plugin] },
			rows: [{ tenantId: 't1', integrationName: 'outlook' }],
			subscribeAndReport: async () => undefined,
		});
		expect(result.renewed).toEqual(['outlook/t1']);
	});

	it('one failing account does not stop the other', async () => {
		let n = 0;
		const result = await renewAccounts({
			corsair: {},
			internal: { ...internalBase, plugins: [plugin] },
			rows: [
				{ tenantId: 't1', integrationName: 'outlook', accountId: 'a1' },
				{ tenantId: 't1', integrationName: 'outlook', accountId: 'a2' },
			],
			subscribeAndReport: async () => {
				if (n++ === 0) throw new Error('boom');
				return undefined;
			},
		});
		expect(result).toEqual({
			renewed: ['outlook/t1/a2'],
			failed: ['outlook/t1/a1'],
		});
	});

	it('renewSubscriptions over the real db lists one row per account', async () => {
		const t = createTestDatabase();
		try {
			await seedTwoAccounts(t);
			const corsair = {
				[Symbol.for('corsair:internal')]: {
					plugins: [{ ...plugin, subscribe: async () => ({}) }],
					kek,
					multiTenancy: true,
					database: t.database,
				},
			};
			const result = await renewSubscriptions(corsair);
			// the stub corsair can't satisfy the real subscribeAndReport; only the
			// row listing is under test, so count attempts either way
			expect([...result.renewed, ...result.failed].sort()).toEqual([
				'outlook/t1/a1',
				'outlook/t1/a2',
			]);
		} finally {
			t.cleanup();
		}
	});
});
