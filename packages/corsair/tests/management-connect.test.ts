import { createCorsair } from '../core';
import { encodeOAuthState, signState } from '../core/auth/state';
import { managementHandler } from '../core/management';
import type { CorsairPlugin } from '../core/plugins';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

// Casts: `as unknown as CorsairPlugin` on each fixture, `as any` on the
// createCorsair calls — see management-handler.test.ts for the rationale.
// The full CorsairPlugin interface is generic over runtime context that
// would require re-implementing half the library to satisfy in a unit test.

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

const apiKeyPlugin = {
	id: 'apikeyplugin',
	options: { authType: 'api_key' as const },
} as unknown as CorsairPlugin;

const KEK = 'test-kek-management-connect';
const CONNECT = {
	baseUrl: 'https://app.example.com/connect',
	redirectUri: 'https://app.example.com/oauth/callback',
};

async function readJson<T>(res: Response): Promise<T> {
	return (await res.json()) as T;
}

function makeCorsair(env: ReturnType<typeof createTestDatabase>) {
	return createCorsair({
		plugins: [slackOAuth],
		database: env.db,
		kek: KEK,
		connect: CONNECT,
	} as any);
}

describe('managementHandler — POST /connect/links', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('returns a signed connect URL when credentials are configured', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/links', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ plugin: 'slack' }),
			}),
		);
		expect(res.status).toBe(200);
		const body = await readJson<{ connectUrl: string; state: string }>(res);
		expect(body.state).toMatch(/\./); // signed (payload.signature)
		const url = new URL(body.connectUrl);
		expect(url.origin + url.pathname).toBe(CONNECT.baseUrl);
		expect(url.searchParams.get('state')).toBe(body.state);
	});

	it('returns 400 missing_credentials when client creds are unset', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/links', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ plugin: 'slack' }),
			}),
		);
		expect(res.status).toBe(400);
		const body = await readJson<{ error: string; missingFields: string[] }>(
			res,
		);
		expect(body.error).toBe('missing_credentials');
		expect(body.missingFields).toEqual(
			expect.arrayContaining(['client_id', 'client_secret']),
		);
	});

	it('400s when plugin field is missing', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/links', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({}),
			}),
		);
		expect(res.status).toBe(400);
		const body = await readJson<{ missingFields: string[] }>(res);
		expect(body.missingFields).toEqual(['plugin']);
	});

	it('400s when the plugin has no oauthConfig', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [apiKeyPlugin],
			database: env.db,
			kek: KEK,
			connect: CONNECT,
		} as any);

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/links', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ plugin: 'apikeyplugin' }),
			}),
		);
		expect(res.status).toBe(400);
	});

	it('500s when createCorsair was not given a connect config', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/links', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ plugin: 'slack' }),
			}),
		);
		expect(res.status).toBe(500);
		const body = await readJson<{ error: string }>(res);
		expect(body.error).toBe('connect_not_configured');
	});

	it('500s with connect_misconfigured when baseUrl is not a valid URL', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
			connect: { baseUrl: 'not-a-url', redirectUri: CONNECT.redirectUri },
		} as any);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/links', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ plugin: 'slack' }),
			}),
		);
		expect(res.status).toBe(500);
		const body = await readJson<{ error: string }>(res);
		expect(body.error).toBe('connect_misconfigured');
	});
});

describe('managementHandler — GET /connect/resolve', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('decodes a valid state and returns the OAuth URL', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const state = signState(encodeOAuthState('slack', 'default'), KEK);
		const handler = managementHandler(corsair);
		const res = await handler(
			new Request(
				`http://x/api/corsair/connect/resolve?state=${encodeURIComponent(state)}`,
				{ method: 'GET' },
			),
		);
		expect(res.status).toBe(200);
		const body = await readJson<{
			plugin: string;
			tenantId: string;
			providerName: string;
			oauthUrl: string;
		}>(res);
		expect(body.plugin).toBe('slack');
		expect(body.tenantId).toBe('default');
		expect(body.providerName).toBe('Slack');
		expect(body.oauthUrl).toContain('slack.com/oauth/v2/authorize');
		expect(body.oauthUrl).toContain('client_id=cid');
		expect(body.oauthUrl).toContain(
			`redirect_uri=${encodeURIComponent(CONNECT.redirectUri)}`,
		);
	});

	it('400s on a tampered state, without echoing the state value', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const tampered =
			signState(encodeOAuthState('slack', 'default'), KEK).slice(0, -5) +
			'XXXXX';
		const handler = managementHandler(corsair);
		const res = await handler(
			new Request(
				`http://x/api/corsair/connect/resolve?state=${encodeURIComponent(tampered)}`,
				{ method: 'GET' },
			),
		);
		expect(res.status).toBe(400);
		const raw = await res.text();
		// The state value carries the user's session for the OAuth dance — keep
		// it out of error bodies even though it's not strictly a secret.
		expect(raw).not.toContain(tampered);
	});

	it('400s when state is absent', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/resolve', { method: 'GET' }),
		);
		expect(res.status).toBe(400);
		const body = await readJson<{ missingFields: string[] }>(res);
		expect(body.missingFields).toEqual(['state']);
	});

	it('500s with connect_not_configured when createCorsair was not given a connect config', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/resolve?state=anything', {
				method: 'GET',
			}),
		);
		expect(res.status).toBe(500);
		const body = await readJson<{ error: string }>(res);
		// Must match the other connect routes' error code, not fall through to
		// the generic `resolve_failed`.
		expect(body.error).toBe('connect_not_configured');
	});
});

describe('managementHandler — POST /connect/oauth/callback', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('400s when code or state is missing', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/oauth/callback', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({}),
			}),
		);
		expect(res.status).toBe(400);
		const body = await readJson<{ missingFields: string[] }>(res);
		expect(body.missingFields).toEqual(
			expect.arrayContaining(['code', 'state']),
		);
	});

	it('400s on a tampered state', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const tampered =
			signState(encodeOAuthState('slack', 'default'), KEK).slice(0, -5) +
			'XXXXX';
		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/oauth/callback', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ code: 'abc', state: tampered }),
			}),
		);
		expect(res.status).toBe(400);
	});

	it('500s when createCorsair was not given a connect config', async () => {
		env = createTestDatabase();
		const corsair = createCorsair({
			plugins: [slackOAuth],
			database: env.db,
			kek: KEK,
		} as any);

		const handler = managementHandler(corsair);
		const res = await handler(
			new Request('http://x/api/corsair/connect/oauth/callback', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ code: 'abc', state: 'xyz' }),
			}),
		);
		expect(res.status).toBe(500);
		const body = await readJson<{ error: string }>(res);
		expect(body.error).toBe('connect_not_configured');
	});
});

describe('corsair.manage.connect — in-process parity', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('createLink returns the same shape as the HTTP route', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const link = await (corsair as any).manage.connect.createLink({
			plugin: 'slack',
			tenantId: 'team-x',
		});
		expect(link.state).toMatch(/\./);
		expect(link.connectUrl).toContain(CONNECT.baseUrl);
	});

	it('resolve decodes a state without hitting HTTP', async () => {
		env = createTestDatabase();
		const corsair = makeCorsair(env);
		await setupCorsair(corsair);
		await (corsair as any).keys.slack.set_client_id('cid');
		await (corsair as any).keys.slack.set_client_secret('csec');

		const link = await (corsair as any).manage.connect.createLink({
			plugin: 'slack',
		});
		const resolved = await (corsair as any).manage.connect.resolve(link.state);
		expect(resolved.plugin).toBe('slack');
		expect(resolved.tenantId).toBe('default');
	});
});
