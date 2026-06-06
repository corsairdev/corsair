import { createCorsair } from '../core';
import { managementHandler } from '../core/management';
import type { CorsairPlugin } from '../core/plugins';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

// ─────────────────────────────────────────────────────────────────────────────
// Test fixtures — minimal plugin stand-ins. 
// The management handler reads .id, .options.authType, and .oauthConfig; 
// ─────────────────────────────────────────────────────────────────────────────

const slackOAuth = {
	id: 'slack',
	options: { authType: 'oauth_2' as const },
	oauthConfig: {
		providerName: 'Slack',
		authUrl: 'https://slack.com/oauth/v2/authorize',
		tokenUrl: 'https://slack.com/api/oauth.v2.access',
		scopes: ['chat:write'],
	},
} as unknown as CorsairPlugin;

const gmailOAuth = {
	id: 'gmail',
	options: { authType: 'oauth_2' as const },
	oauthConfig: {
		providerName: 'Google',
		authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
		tokenUrl: 'https://oauth2.googleapis.com/token',
		scopes: ['https://www.googleapis.com/auth/gmail.send'],
		requiresRegisteredRedirect: true,
	},
} as unknown as CorsairPlugin;

const noAuthPlugin = {
	id: 'static',
	options: {},
} as unknown as CorsairPlugin;

const KEK = 'test-kek-management-handler';

function makeEnv() {
	return createTestDatabase();
}

async function ensurePermissionsTable(db: ReturnType<typeof createTestDatabase>['db']) {
	// SqliteDialect underlying connection — execute raw SQL via Kysely's schema
	await db.schema
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
}

async function readJson<T>(res: Response): Promise<T> {
	return (await res.json()) as T;
}

describe('managementHandler — /ok', () => {
	let env: ReturnType<typeof makeEnv>;
	afterEach(() => env?.cleanup?.());

	it('returns { ok: true }', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);

		const res = await handler(
			new Request('http://x/api/corsair/ok', { method: 'GET' }),
		);
		expect(res.status).toBe(200);
		expect(await readJson(res)).toEqual({ ok: true });
	});

	it('honors a custom basePath', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair, { basePath: '/v1/corsair' });

		const res = await handler(
			new Request('http://x/v1/corsair/ok', { method: 'GET' }),
		);
		expect(res.status).toBe(200);
	});

	it('returns 404 for an unknown path', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);

		const res = await handler(
			new Request('http://x/api/corsair/nope', { method: 'GET' }),
		);
		expect(res.status).toBe(404);
		const body = await readJson<{ error: string }>(res);
		expect(body.error).toBe('not_found');
	});
});

describe('managementHandler — /plugins', () => {
	let env: ReturnType<typeof makeEnv>;
	afterEach(() => env?.cleanup?.());

	it('lists all plugins with auth + oauth metadata', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth, noAuthPlugin],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);

		const res = await handler(
			new Request('http://x/api/corsair/plugins', { method: 'GET' }),
		);
		expect(res.status).toBe(200);
		const body = await readJson<
			Array<{
				id: string;
				authType: string | null;
				configured: boolean;
				missingFields: string[];
				oauth: unknown;
			}>
		>(res);

		expect(body).toHaveLength(2);
		const slack = body.find((p) => p.id === 'slack')!;
		expect(slack.authType).toBe('oauth_2');
		expect(slack.configured).toBe(false);
		expect(slack.missingFields).toEqual(
			expect.arrayContaining(['client_id', 'client_secret']),
		);
		expect(slack.oauth).toEqual({
			providerName: 'Slack',
			scopes: ['chat:write'],
			requiresRegisteredRedirect: false,
		});

		const stat = body.find((p) => p.id === 'static')!;
		expect(stat.authType).toBeNull();
		expect(stat.oauth).toBeNull();
	});

	it('reports configured=true once client_id and client_secret are set', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/plugins/slack', { method: 'GET' }),
		);
		const body = await readJson<{ configured: boolean; missingFields: string[] }>(res);
		expect(body.configured).toBe(true);
		expect(body.missingFields).toEqual(['redirect_url']);
	});

	it('404s when plugin id does not exist', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/plugins/unknown', { method: 'GET' }),
		);
		expect(res.status).toBe(404);
	});
});

describe('managementHandler — /tenants', () => {
	let env: ReturnType<typeof makeEnv>;
	afterEach(() => env?.cleanup?.());

	it('returns [default] when DB has no accounts', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);

		const res = await handler(
			new Request('http://x/api/corsair/tenants', { method: 'GET' }),
		);
		const body = await readJson<Array<{ id: string }>>(res);
		expect(body.map((t) => t.id)).toEqual(['default']);
	});

	it('lists distinct tenant ids from accounts (always including default)', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
		} as any);

		const now = new Date();
		await env.db
			.insertInto('corsair_integrations')
			.values({
				id: 'i1',
				created_at: now,
				updated_at: now,
				name: 'slack',
				config: {} as any,
			} as any)
			.execute();
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id: 'a1',
				created_at: now,
				updated_at: now,
				tenant_id: 'acme',
				integration_id: 'i1',
				config: {} as any,
				dek: 'somedek',
			} as any)
			.execute();

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/tenants', { method: 'GET' }),
		);
		const body = await readJson<
			Array<{ id: string; connectedPlugins: string[] }>
		>(res);
		const ids = body.map((t) => t.id).sort();
		expect(ids).toEqual(['acme', 'default']);
		const acme = body.find((t) => t.id === 'acme')!;
		expect(acme.connectedPlugins).toEqual(['slack']);
	});

	it('POST /tenants returns the implicit tenant; rejects empty id', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);

		const ok = await handler(
			new Request('http://x/api/corsair/tenants', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: 'new-tenant' }),
			}),
		);
		expect(ok.status).toBe(200);
		const body = await readJson<{ id: string; accounts: unknown[] }>(ok);
		expect(body.id).toBe('new-tenant');
		expect(body.accounts).toEqual([]);

		const bad = await handler(
			new Request('http://x/api/corsair/tenants', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: '' }),
			}),
		);
		expect(bad.status).toBe(400);
		const badBody = await readJson<{ error: string; missingFields?: string[] }>(bad);
		expect(badBody.error).toBe('bad_request');
		expect(badBody.missingFields).toEqual(['id']);
	});

	it('GET /tenants/:id returns derived shape (no 404 for empty tenant)', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);

		const res = await handler(
			new Request('http://x/api/corsair/tenants/anything', { method: 'GET' }),
		);
		expect(res.status).toBe(200);
		const body = await readJson<{ id: string; accounts: unknown[] }>(res);
		expect(body).toEqual({
			id: 'anything',
			accounts: [],
			connectedPlugins: [],
		});
	});
});

describe('managementHandler — /connection-status', () => {
	let env: ReturnType<typeof makeEnv>;
	afterEach(() => env?.cleanup?.());

	it('reports missing_credentials when integration creds are unset', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth, gmailOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);

		const res = await handler(
			new Request('http://x/api/corsair/connection-status', { method: 'GET' }),
		);
		const body = await readJson<Record<string, string>>(res);
		expect(body.slack).toBe('missing_credentials');
		expect(body.gmail).toBe('missing_credentials');
	});

	it('reports not_connected when creds present but no account for tenant', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
			multiTenancy: true,
		} as any);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connection-status?tenantId=default', {
				method: 'GET',
			}),
		);
		const body = await readJson<Record<string, string>>(res);
		expect(body.slack).toBe('not_connected');
	});

	it('defaults to tenantId=default when query is absent', async () => {
		env = makeEnv();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);
		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connection-status', { method: 'GET' }),
		);
		expect(res.status).toBe(200);
	});
});

describe('managementHandler — /permissions', () => {
	let env: ReturnType<typeof makeEnv>;
	afterEach(() => env?.cleanup?.());

	it('returns permission by id and by token, 404s on unknown', async () => {
		env = makeEnv();
		await ensurePermissionsTable(env.db);
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);

		const now = new Date();
		await env.db
			.insertInto('corsair_permissions')
			.values({
				id: 'perm-1',
				created_at: now,
				updated_at: now,
				token: 'tok-abc',
				plugin: 'slack',
				endpoint: 'sendMessage',
				args: '{}',
				tenant_id: 'default',
				status: 'pending',
				expires_at: new Date(Date.now() + 60000).toISOString(),
			} as any)
			.execute();

		const handler = managementHandler(corsair);

		const byId = await handler(
			new Request('http://x/api/corsair/permissions/perm-1', { method: 'GET' }),
		);
		expect(byId.status).toBe(200);
		const idBody = await readJson<{ id: string; token: string }>(byId);
		expect(idBody.id).toBe('perm-1');
		expect(idBody.token).toBe('tok-abc');

		const byTok = await handler(
			new Request('http://x/api/corsair/permissions/by-token/tok-abc', {
				method: 'GET',
			}),
		);
		expect(byTok.status).toBe(200);

		const missing = await handler(
			new Request('http://x/api/corsair/permissions/nope', { method: 'GET' }),
		);
		expect(missing.status).toBe(404);
	});
});
