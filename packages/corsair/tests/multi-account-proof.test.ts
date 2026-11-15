import { z } from 'zod';
import { createCorsair } from '../core';
import type { CorsairTenantWrapper } from '../core/client';
import { disconnectConnection } from '../core/management/operations';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { processManagedOAuthDelivery } from '../hub/managed-oauth';
import { setupCorsair } from '../setup';
import type { EndpointCtx, NoteRow } from './multi-account-fixtures';
import {
	asSelectionError,
	dynamic,
	neverResolves,
} from './multi-account-fixtures';
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

// A minimal plugin literal; the full CorsairPlugin generics are not needed here.
const mail = {
	id: 'mail',
	options: { authType: 'managed' as const },
	authConfig: { managed: { account: [] as const } },
	schema: {
		version: '1',
		entities: { notes: z.object({ title: z.string() }) },
	},
	endpoints: {
		token: async (ctx: EndpointCtx) => ctx.keys.get_access_token(),
		note: async (ctx: EndpointCtx, input: { id: string }) => {
			await ctx.db.notes.upsertByEntityId(input.id, { title: input.id });
			return true;
		},
	},
} as unknown as CorsairPlugin;

describe('two accounts end to end', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: CorsairTenantWrapper<readonly [CorsairPlugin]>;
	const tenants = () => dynamic<'mail'>(corsair);
	beforeEach(async () => {
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [mail],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
		});
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
		const t = tenants().withTenant('t1');
		const b = tenants().withTenant('t1', { accounts: { mail: 'b@x.com' } });
		const a = tenants().withTenant('t1', { accounts: { mail: 'a@x.com' } });

		const err = await t.mail.api.token().then(neverResolves, asSelectionError);
		expect(err.code).toBe('account_required');
		expect(err.message).toContain('a@x.com');
		expect(err.message).toContain('b@x.com');
		expect(await b.mail.api.token()).toBe('tok-b');

		await a.mail.api.note({ id: 'from-a' });
		await b.mail.api.note({ id: 'from-b' });
		const rows = await t.mail.db.notes.list();
		expect(rows.map((r: NoteRow) => [r.data.title, r.account]).sort()).toEqual([
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
		expect(left.map((r: NoteRow) => r.data.title)).toEqual(['from-b']);
		expect(left[0]).not.toHaveProperty('account');
		const gone = await a.mail.api.token().then(neverResolves, asSelectionError);
		expect(gone.code).toBe('account_not_found');
	});

	it('a single-account tenant with no identity behaves as before', async () => {
		await deliver('solo', 'tok-solo');
		const t = tenants().withTenant('solo');
		expect(await t.mail.api.token()).toBe('tok-solo');
		await t.mail.api.note({ id: 'n' });
		const rows = await t.mail.db.notes.list();
		expect(rows).toHaveLength(1);
		expect(rows[0]).not.toHaveProperty('account');
		const accounts = await env.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', 'solo')
			.execute();
		expect(accounts).toHaveLength(1);
	});
});
