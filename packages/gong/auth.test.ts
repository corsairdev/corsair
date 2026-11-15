import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';
import { listWorkspaces } from './endpoints/workspaces';
import type { GongPluginOptions } from './index';
import { gong, gongAuthConfig } from './index';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);

type StoredKeys = {
	apiKey?: string | null;
	apiKeySecret?: string | null;
	accessToken?: string | null;
	expiresAt?: string | null;
};

async function buildKey(
	options: GongPluginOptions,
	stored: StoredKeys = {},
	source: 'endpoint' | 'webhook' = 'endpoint',
): Promise<string> {
	const plugin = gong(options);
	if (!plugin.keyBuilder) throw new Error('Gong keyBuilder is required');
	const ctx = {
		authType: options.authType ?? 'api_key',
		options: plugin.options,
		tenantId: 'default',
		keys: {
			get_api_key: async () => stored.apiKey ?? null,
			get_api_key_secret: async () => stored.apiKeySecret ?? null,
			get_access_token: async () => stored.accessToken ?? null,
			get_expires_at: async () => stored.expiresAt ?? null,
		},
	};
	// The key manager is faked with the four getters the keyBuilder reads.
	return plugin.keyBuilder(ctx as never, source);
}

const nowSeconds = () => Math.floor(Date.now() / 1000);

describe('Gong credentials', () => {
	beforeEach(() => mockedRequest.mockReset());

	it('declares the access key secret as a stored connection field', () => {
		expect(gongAuthConfig.api_key.account).toEqual(['api_key_secret']);
		expect(gong().authConfig).toBe(gongAuthConfig);
	});

	it('builds the key from a stored access key and stored secret', async () => {
		await expect(
			buildKey({}, { apiKey: 'AK', apiKeySecret: 'SECRET' }),
		).resolves.toBe('AK:SECRET');
	});

	it('sends a stored key pair as HTTP Basic without any secret in the options', async () => {
		mockedRequest.mockResolvedValue({ requestId: 'r', workspaces: [] });
		const key = await buildKey({}, { apiKey: 'AK', apiKeySecret: 'SE:CR.ET' });
		await listWorkspaces(
			{
				key,
				options: { authType: 'api_key' },
				$getAccountId: async () => 'account',
			},
			{},
		);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.gong.io',
				USERNAME: 'AK',
				PASSWORD: 'SE:CR.ET',
			}),
			expect.objectContaining({ method: 'GET', url: '/v2/workspaces' }),
		);
	});

	it('prefers the key pair given in the plugin options', async () => {
		await expect(
			buildKey(
				{ accessKey: 'OPTION-AK', accessKeySecret: 'OPTION-SECRET' },
				{ apiKey: 'AK', apiKeySecret: 'SECRET' },
			),
		).resolves.toBe('OPTION-AK:OPTION-SECRET');
		await expect(
			buildKey({ key: 'OPTION-AK', accessKeySecret: 'OPTION-SECRET' }),
		).resolves.toBe('OPTION-AK:OPTION-SECRET');
	});

	it.each([
		['no key and no secret', {}],
		['a key without a secret', { apiKey: 'AK' }],
		['a secret without a key', { apiKeySecret: 'SECRET' }],
	])('asks for a connection with %s', async (_label, stored) => {
		await expect(buildKey({}, stored)).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('does not build a key for webhooks', async () => {
		await expect(
			buildKey({}, { apiKey: 'AK', apiKeySecret: 'SECRET' }, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns a stored OAuth token while it is valid', async () => {
		await expect(
			buildKey(
				{ authType: 'oauth_2' },
				{ accessToken: 'token', expiresAt: String(nowSeconds() + 3600) },
			),
		).resolves.toBe('token');
		await expect(
			buildKey({ authType: 'oauth_2' }, { accessToken: 'token' }),
		).resolves.toBe('token');
		await expect(
			buildKey({ authType: 'oauth_2', key: 'own-token' }),
		).resolves.toBe('own-token');
	});

	it('asks for a new connection when the stored OAuth token has expired', async () => {
		await expect(
			buildKey(
				{ authType: 'oauth_2' },
				{ accessToken: 'token', expiresAt: String(nowSeconds() - 10) },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			buildKey(
				{ authType: 'oauth_2' },
				{ accessToken: 'token', expiresAt: 'not-a-number' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(buildKey({ authType: 'oauth_2' })).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
