import { z } from 'zod';
import { createCorsair } from '../core';
import { listAccounts } from '../core/account-lookup';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import type { CorsairTenantWrapper } from '../core/client';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { processManagedOAuthDelivery } from '../hub/managed-oauth';
import { setupCorsair } from '../setup';
import type { EndpointCtx } from './multi-account-fixtures';
import { dynamic } from './multi-account-fixtures';
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
		token: async (ctx: EndpointCtx) => ctx.keys.get_access_token(),
	},
} as unknown as CorsairPlugin;

describe('multiAccount off (default)', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: CorsairTenantWrapper<readonly [CorsairPlugin]>;
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
	});
	afterEach(() => env.cleanup());

	const deliver = (
		accessToken: string,
		account: { id: string; label?: string },
	) =>
		processManagedOAuthDelivery(corsair, {
			plugin: 'mail',
			tenantId: 't1',
			accessToken,
			account,
		});
	const database = () => getCorsairInternal(corsair).database!;
	const accountRows = () =>
		env.db.selectFrom('corsair_accounts').selectAll().execute();

	it('a second identity replaces the first: one row, new ref, label and token', async () => {
		await deliver('tok-a', { id: 'a', label: 'a@x.com' });
		await deliver('tok-b', { id: 'b', label: 'b@x.com' });
		expect(await accountRows()).toHaveLength(1);
		const [acct] = await listAccounts({
			db: env.db,
			kek: KEK,
			integrationId: (
				await env.db
					.selectFrom('corsair_integrations')
					.select('id')
					.executeTakeFirstOrThrow()
			).id,
			tenantId: 't1',
		});
		expect([acct?.ref, acct?.label]).toEqual(['b', 'b@x.com']);
		const t = dynamic<'mail'>(corsair).withTenant('t1');
		expect(await t.mail.api.token()).toBe('tok-b');
	});

	it('legacy tenant with two rows: unbound call uses the oldest, no throw', async () => {
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.executeTakeFirstOrThrow();
		for (const [ref, at, token] of [
			['a', '2026-01-01', 'tok-a'],
			['b', '2026-02-01', 'tok-b'],
		] as const) {
			const dek = generateDEK();
			await env.db
				.insertInto('corsair_accounts')
				.values({
					id: `acct-${ref}`,
					created_at: new Date(at),
					updated_at: new Date(at),
					tenant_id: 't1',
					integration_id: integ.id,
					config: encryptConfig({ account_ref: ref }, dek),
					dek: await encryptDEK(dek, KEK),
				})
				.execute();
			await createAccountKeyManager({
				authType: 'managed',
				integrationName: 'mail',
				tenantId: 't1',
				kek: KEK,
				database: database(),
				account: { ref },
			}).set_access_token(token);
		}
		const t = dynamic<'mail'>(corsair).withTenant('t1');
		expect(await t.mail.api.token()).toBe('tok-a');
	});
});
