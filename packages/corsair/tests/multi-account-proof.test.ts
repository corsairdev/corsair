import { z } from 'zod';
import { createCorsair } from '../core';
import { disconnectConnection } from '../core/management/operations';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { processManagedOAuthDelivery } from '../hub/managed-oauth';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

jest.mock('../hub/report-connection-status', () => ({
	...jest.requireActual('../hub/report-connection-status'),
	reportPluginConnectionStatus: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../oauth/subscribe-report', () => ({
	subscribeAndReport: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../webhooks/resolve-oauth-tenant-link', () => ({
	resolveOAuthWebhookTenantLink: jest.fn().mockResolvedValue(null),
}));

const KEK = 'test-kek-with-at-least-32-characters!!';

const mail = {
	id: 'mail',
	options: { authType: 'managed' as const },
	authConfig: { managed: { account: [] as const } },
	schema: {
		version: '1',
		entities: { notes: z.object({ title: z.string() }) },
	},
	endpoints: {
		token: async (ctx: any) => ctx.keys.get_access_token(),
		note: async (ctx: any, input: { id: string }) => {
			await ctx.db.notes.upsertByEntityId(input.id, { title: input.id });
			return true;
		},
	},
} as unknown as CorsairPlugin;

describe('two accounts end to end', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: any;
	beforeEach(async () => {
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [mail],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
		} as any);
		getCorsairInternal(corsair).database!.isPg = false;
		await setupCorsair(corsair, { tenantId: 't1' });
		await setupCorsair(corsair, { tenantId: 'solo' });
	});
	afterEach(() => env.cleanup());

	const deliver = (
		tenantId: string,
		accessToken: string,
		account?: { id: string; label?: string },
	) =>
		processManagedOAuthDelivery(corsair, {
			plugin: 'mail',
			tenantId,
			accessToken,
			account,
		});

	it('routes, reads and disconnects per account', async () => {
		await deliver('t1', 'tok-a', { id: 'a', label: 'a@x.com' });
		await deliver('t1', 'tok-b', { id: 'b', label: 'b@x.com' });
		const t = corsair.withTenant('t1');
		const b = corsair.withTenant('t1', { accounts: { mail: 'b@x.com' } });
		const a = corsair.withTenant('t1', { accounts: { mail: 'a@x.com' } });

		const err = await t.mail.api.token().catch((e: any) => e);
		expect(err.code).toBe('account_required');
		expect(err.message).toContain('a@x.com');
		expect(err.message).toContain('b@x.com');
		expect(await b.mail.api.token()).toBe('tok-b');

		await a.mail.api.note({ id: 'from-a' });
		await b.mail.api.note({ id: 'from-b' });
		const rows = await t.mail.db.notes.list();
		expect(rows.map((r: any) => [r.data.title, r.account]).sort()).toEqual([
			['from-a', 'a@x.com'],
			['from-b', 'b@x.com'],
		]);

		const res = await disconnectConnection(getCorsairInternal(corsair), {
			plugin: 'mail',
			tenantId: 't1',
			account: 'a@x.com',
		});
		expect(res).toEqual({ ok: true, disconnected: true });

		expect(await b.mail.api.token()).toBe('tok-b');
		// one account left: unbound now resolves to it, untagged
		expect(await t.mail.api.token()).toBe('tok-b');
		const left = await t.mail.db.notes.list();
		expect(left.map((r: any) => r.data.title)).toEqual(['from-b']);
		expect('account' in left[0]).toBe(false);
		const gone = await a.mail.api.token().catch((e: any) => e);
		expect(gone.code).toBe('account_not_found');
	});

	it('a single-account tenant with no identity behaves as before', async () => {
		await deliver('solo', 'tok-solo');
		const t = corsair.withTenant('solo');
		expect(await t.mail.api.token()).toBe('tok-solo');
		await t.mail.api.note({ id: 'n' });
		const rows = await t.mail.db.notes.list();
		expect(rows).toHaveLength(1);
		expect('account' in rows[0]).toBe(false);
		const accounts = await env.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', 'solo')
			.execute();
		expect(accounts).toHaveLength(1);
	});
});
