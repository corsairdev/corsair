import { createHmac, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { setupCorsair } from '../setup';
import { processCorsair } from '../tunnel/index';
import { processWebhook } from '../webhooks/index';
import { setWebhookTenantLink } from '../webhooks/tenant-links';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

function signedHeaders(body: string, secret: string) {
	return {
		'x-corsair-signature': `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`,
		'x-corsair-timestamp': String(Math.floor(Date.now() / 1000)),
		'x-corsair-nonce': randomUUID(),
	};
}

const teamOf = (request: { body: unknown }) =>
	(request.body as { team_id?: string }).team_id;

const slack = {
	id: 'slack',
	options: { authType: 'oauth_2' as const },
	authConfig: { oauth_2: { account: [] as const } },
	schema: {
		version: '1',
		entities: { notes: z.object({ title: z.string() }) },
	},
	pluginWebhookMatcher: () => true,
	pluginTenantWebhookMatcher: (request: { body: unknown }) => {
		const externalId = teamOf(request);
		return externalId ? { linkType: 'team_id', externalId } : null;
	},
	webhooks: {
		events: {
			message: {
				match: () => true,
				handler: async (ctx: any) => {
					await ctx.db.notes.upsertByEntityId('n1', { title: 'hi' });
					return { success: true };
				},
			},
		},
	},
} as unknown as CorsairPlugin;

describe('webhooks run as the account the delivery matched', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let corsair: any;
	beforeEach(async () => {
		env = createTestDatabase();
		corsair = createCorsair({
			plugins: [slack],
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

	async function addAccount(
		id: string,
		tenantId: string,
		team?: string,
		createdAt = new Date(id === 'acct-a' ? '2026-01-01' : '2026-02-01'),
	) {
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.where('name', '=', 'slack')
			.executeTakeFirstOrThrow();
		const dek = generateDEK();
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id,
				created_at: createdAt,
				updated_at: createdAt,
				tenant_id: tenantId,
				integration_id: integ.id,
				config: encryptConfig({ account_ref: id }, dek),
				dek: await encryptDEK(dek, KEK),
			})
			.execute();
		if (team) {
			await setWebhookTenantLink({
				database: database(),
				kek: KEK,
				pluginId: 'slack',
				tenantId,
				accountId: id,
				link: { linkType: 'team_id', externalId: team },
			});
		}
	}

	const entityAccounts = async () =>
		(
			await env.db.selectFrom('corsair_entities').select('account_id').execute()
		).map((r) => r.account_id);

	const headers = { 'content-type': 'application/json' };

	it('a delivery for team B stores its entity under account B', async () => {
		await addAccount('acct-a', 't1', 'TA');
		await addAccount('acct-b', 't1', 'TB');
		const result = await processWebhook(corsair, headers, { team_id: 'TB' });
		expect(result.response?.success).toBe(true);
		expect(await entityAccounts()).toEqual(['acct-b']);
	});

	it('a delivery for team A stores under account A', async () => {
		await addAccount('acct-a', 't1', 'TA');
		await addAccount('acct-b', 't1', 'TB');
		await processWebhook(corsair, headers, { team_id: 'TA' });
		expect(await entityAccounts()).toEqual(['acct-a']);
	});

	it('a delivery whose link matches no account for an explicit tenant behaves as today', async () => {
		await addAccount('acct-a', 't1', 'TA');
		await addAccount('acct-b', 't1', 'TB');
		const result = await processWebhook(
			corsair,
			headers,
			{ team_id: 'ZZ' },
			{ tenantId: 't1' },
		);
		// Unbound with two accounts: ctx.db has no account to use.
		expect(result.response?.success).toBe(false);
		expect(result.response?.error).toContain('2 accounts');
		expect(await entityAccounts()).toEqual([]);
	});

	it('tunnel webhook with linkType/externalId binds the account', async () => {
		await addAccount('acct-a', 't1', 'TA');
		await addAccount('acct-b', 't1', 'TB');
		const secret = 'tunnel-signing-secret';
		const body = JSON.stringify({
			type: 'webhook',
			payload: {
				headers,
				body: JSON.stringify({ team_id: 'TB' }),
				plugin: 'slack',
				linkType: 'team_id',
				externalId: 'TB',
				tenantId: 't1',
			},
		});
		const ack = await processCorsair(
			corsair,
			{ headers: signedHeaders(body, secret), body },
			{ signingSecret: secret },
		);
		expect(ack.status).toBe('ok');
		expect(await entityAccounts()).toEqual(['acct-b']);
	});

	it('an account link whose tenant differs from the explicit tenant is ignored', async () => {
		await addAccount('acct-a', 't1', 'TA');
		await addAccount('acct-b', 't1', 'TB');
		await addAccount('acct-other', 't2', 'TO');
		const secret = 'tunnel-signing-secret';
		const body = JSON.stringify({
			type: 'webhook',
			payload: {
				headers,
				body: JSON.stringify({ team_id: 'TO' }),
				plugin: 'slack',
				linkType: 'team_id',
				externalId: 'TO',
				tenantId: 't1',
			},
		});
		const ack = await processCorsair(
			corsair,
			{ headers: signedHeaders(body, secret), body },
			{ signingSecret: secret },
		);
		// t1 stays unbound (two accounts), so the handler is refused rather than
		// run as t2's account.
		expect(ack.status).toBe('failed');
		expect(await entityAccounts()).toEqual([]);
	});

	it('single account, no link: unchanged', async () => {
		await addAccount('acct-a', 't1');
		const result = await processWebhook(
			corsair,
			headers,
			{ team_id: 'ZZ' },
			{ tenantId: 't1' },
		);
		expect(result.response?.success).toBe(true);
		expect(await entityAccounts()).toEqual(['acct-a']);
	});
});
