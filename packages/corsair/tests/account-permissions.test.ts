import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import type { CorsairTenantWrapper } from '../core/client';
import {
	PermissionRequiredError,
	runReadonly,
	runWithMode,
} from '../core/permissions';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import { asSelectionError, neverResolves } from './multi-account-fixtures';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

type Api = {
	list(): Promise<string>;
	post(): Promise<string>;
	purge(): Promise<string>;
};
type Tenant = { demo: { api: Api } };

const demo = {
	id: 'demo',
	options: {
		authType: 'oauth_2' as const,
		permissions: {
			mode: 'cautious',
			accounts: { a: 'open', b: 'readonly' },
		},
	},
	authConfig: { oauth_2: { account: [] as const } },
	schema: { version: '1', entities: {} },
	endpointMeta: {
		list: { riskLevel: 'read' },
		post: { riskLevel: 'write' },
		purge: { riskLevel: 'destructive' },
	},
	endpoints: {
		list: async () => 'listed',
		post: async () => 'posted',
		purge: async () => 'purged',
	},
} as unknown as CorsairPlugin;

describe('permission mode per account', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: CorsairTenantWrapper<readonly [CorsairPlugin]>;
	const tenant = (account?: string) =>
		(
			corsair as unknown as {
				withTenant(t: string, o?: unknown): Tenant;
			}
		).withTenant('t1', account ? { accounts: { demo: account } } : undefined)
			.demo.api;

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
		// Where a held call records its approval.
		await env.db.schema
			.createTable('corsair_permissions')
			.ifNotExists()
			.addColumn('id', 'text', (c) => c.primaryKey())
			.addColumn('created_at', 'integer', (c) => c.notNull())
			.addColumn('updated_at', 'integer', (c) => c.notNull())
			.addColumn('token', 'text', (c) => c.notNull())
			.addColumn('plugin', 'text', (c) => c.notNull())
			.addColumn('endpoint', 'text', (c) => c.notNull())
			.addColumn('args', 'text', (c) => c.notNull())
			.addColumn('tenant_id', 'text', (c) => c.notNull())
			.addColumn('status', 'text', (c) => c.notNull())
			.addColumn('expires_at', 'text', (c) => c.notNull())
			.addColumn('error', 'text')
			.execute();
		await addAccount('a', 'ops@x.com', '2026-01-01');
		await addAccount('b', 'Account 2', '2026-02-01');
		await addAccount('c', 'sales@x.com', '2026-03-01');
	});
	afterEach(() => env.cleanup());

	async function addAccount(ref: string, label: string, at: string) {
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.where('name', '=', 'demo')
			.executeTakeFirstOrThrow();
		const dek = generateDEK();
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id: `acct-${ref}`,
				created_at: new Date(at),
				updated_at: new Date(at),
				tenant_id: 't1',
				integration_id: integ.id,
				config: encryptConfig({ account_ref: ref, account_label: label }, dek),
				dek: await encryptDEK(dek, KEK),
			})
			.execute();
	}

	it('an account set to open runs what the app mode would hold for approval', async () => {
		await expect(tenant('ops@x.com').purge()).resolves.toBe('purged');
	});

	it('an account with no mode of its own takes the app mode', async () => {
		await expect(tenant('sales@x.com').post()).resolves.toBe('posted');
		await expect(tenant('sales@x.com').purge()).rejects.toThrow(
			PermissionRequiredError,
		);
	});

	it('a mode follows the account however the call names it', async () => {
		await expect(tenant('b').post()).rejects.toThrow(PermissionRequiredError);
		await expect(tenant('Account 2').list()).resolves.toBe('listed');
	});

	it("the caller's readonly still holds on an open account", async () => {
		await runReadonly(async () => {
			await expect(tenant('ops@x.com').post()).rejects.toThrow();
		});
	});

	it('an unnamed account among several is refused before any check', async () => {
		const err = asSelectionError(
			await tenant()
				.list()
				.then(neverResolves, (e) => e),
		);
		expect(err.code).toBe('account_required');
	});

	// The caller's side, which is how Lug sets a link's modes.
	describe("in the caller's scope", () => {
		const scope = {
			mode: 'strict' as const,
			accounts: { demo: { c: 'open' as const } },
		};

		it("an account's own mode in the scope stands in for the scope's default", async () => {
			await runWithMode(scope, async () => {
				await expect(tenant('sales@x.com').post()).resolves.toBe('posted');
			});
		});

		it("the scope's default still holds for an account it doesn't name", async () => {
			// sales is open in the scope, but the plugin's cautious still holds
			// its destructive calls: each side only tightens the other.
			await runWithMode(scope, async () => {
				await expect(tenant('sales@x.com').purge()).rejects.toThrow(
					PermissionRequiredError,
				);
			});
		});

		it('an outer readonly is never loosened by an inner open', async () => {
			await runReadonly(() =>
				runWithMode(scope, async () => {
					await expect(tenant('sales@x.com').post()).rejects.toThrow();
				}),
			);
		});
	});

	// A label can be a display name its owner renames; it must not pick up a mode.
	it('a mode keyed by label applies to no one', async () => {
		await runWithMode(
			{ mode: 'strict', accounts: { demo: { 'sales@x.com': 'open' } } },
			async () => {
				await expect(tenant('sales@x.com').post()).rejects.toThrow(
					PermissionRequiredError,
				);
			},
		);
	});

	it('an account whose identity cannot be read takes the strictest mode', async () => {
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.where('name', '=', 'demo')
			.executeTakeFirstOrThrow();
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id: 'acct-unread',
				created_at: new Date('2026-04-01'),
				updated_at: new Date('2026-04-01'),
				tenant_id: 't1',
				integration_id: integ.id,
				config: {},
				dek: null,
			})
			.execute();
		await expect(tenant('acct-unread').post()).rejects.toThrow();
		await expect(tenant('acct-unread').list()).resolves.toBe('listed');
	});
});
