import type { InternalParmaPlugin } from './index';
import { parma } from './index';

type KeyBuilder = NonNullable<InternalParmaPlugin['keyBuilder']>;

type Stored = {
	token: string | null;
	expiresAt?: string | null;
	refreshToken?: string | null;
};

function context(
	authType: 'api_key' | 'oauth_2',
	{ token, expiresAt = null, refreshToken = null }: Stored,
) {
	const keys = {
		get_api_key: jest.fn(async () => token),
		get_access_token: jest.fn(async () => token),
		get_expires_at: jest.fn(async () => expiresAt),
		get_refresh_token: jest.fn(async () => refreshToken),
		get_integration_credentials: jest.fn(async () => ({
			client_id: 'client-id',
			client_secret: 'client-secret',
		})),
		set_access_token: jest.fn(async (_value: string) => {}),
		set_expires_at: jest.fn(async (_value: string) => {}),
		set_refresh_token: jest.fn(async (_value: string) => {}),
		set_scope: jest.fn(async (_value: string) => {}),
	};
	return {
		// This isolated key-builder test supplies only the credential methods it
		// exercises; constructing a full tenant key manager would require storage.
		ctx: {
			authType,
			keys,
			tenantId: `tenant-${Math.random()}`,
		} as unknown as Parameters<KeyBuilder>[0],
		keys,
	};
}

const inOneHour = () => String(Math.floor(Date.now() / 1000) + 3600);
const anHourAgo = () => String(Math.floor(Date.now() / 1000) - 3600);

afterEach(() => jest.restoreAllMocks());

test('uses the stored API token', async () => {
	const { ctx, keys } = context('api_key', { token: 'stored-token' });
	const plugin: InternalParmaPlugin = parma({ authType: 'api_key' });
	await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe(
		'stored-token',
	);
	expect(keys.get_api_key).toHaveBeenCalledTimes(1);
	expect(keys.get_access_token).not.toHaveBeenCalled();
});

test('uses a fresh stored OAuth access token without calling Parma', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	const { ctx } = context('oauth_2', {
		token: 'fresh-token',
		expiresAt: inOneHour(),
		refreshToken: 'refresh-token',
	});
	const plugin: InternalParmaPlugin = parma({ authType: 'oauth_2' });
	await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe(
		'fresh-token',
	);
	expect(fetchMock).not.toHaveBeenCalled();
});

test('refreshes an expired OAuth access token at Parma and stores the new one', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(
			JSON.stringify({
				access_token: 'new-token',
				token_type: 'Bearer',
				expires_in: 7200,
				refresh_token: 'new-refresh-token',
				scope: 'full',
				created_at: 1712704690,
			}),
			{ status: 200, headers: { 'content-type': 'application/json' } },
		),
	);
	const { ctx, keys } = context('oauth_2', {
		token: 'expired-token',
		expiresAt: anHourAgo(),
		refreshToken: 'refresh-token',
	});
	const plugin: InternalParmaPlugin = parma({ authType: 'oauth_2' });
	await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe('new-token');
	expect(fetchMock).toHaveBeenCalledTimes(1);
	const [url, init] = fetchMock.mock.calls[0]!;
	expect(String(url)).toBe('https://app.parma.ai/oauth/token');
	const body = new URLSearchParams(String(init?.body));
	expect(body.get('grant_type')).toBe('refresh_token');
	expect(body.get('refresh_token')).toBe('refresh-token');
	expect(keys.set_access_token).toHaveBeenCalledWith('new-token');
	expect(keys.set_refresh_token).toHaveBeenCalledWith('new-refresh-token');
});

test('asks for a reconnect when an expired OAuth token has no refresh token', async () => {
	const { ctx } = context('oauth_2', {
		token: 'expired-token',
		expiresAt: anHourAgo(),
	});
	const plugin: InternalParmaPlugin = parma({ authType: 'oauth_2' });
	await expect(plugin.keyBuilder!(ctx, 'endpoint')).rejects.toThrow(
		/auth-missing:parma/,
	);
});

test('declares Parma OAuth endpoints for the connect flow', () => {
	expect(parma().oauthConfig).toMatchObject({
		authUrl: 'https://app.parma.ai/oauth/authorize',
		tokenUrl: 'https://app.parma.ai/oauth/token',
		scopes: ['full'],
	});
});

test('rejects missing stored API credentials', async () => {
	const { ctx } = context('api_key', { token: null });
	const plugin: InternalParmaPlugin = parma({ authType: 'api_key' });
	await expect(plugin.keyBuilder!(ctx, 'endpoint')).rejects.toThrow();
});

test('uses an explicit key without reading stored credentials', async () => {
	const { ctx, keys } = context('oauth_2', { token: null });
	const plugin: InternalParmaPlugin = parma({
		authType: 'oauth_2',
		key: 'explicit',
	});
	await expect(plugin.keyBuilder!(ctx, 'endpoint')).resolves.toBe('explicit');
	expect(keys.get_access_token).not.toHaveBeenCalled();
});
