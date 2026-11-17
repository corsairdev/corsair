import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { attachManagedRefreshAuth, getManagedAccessToken } from 'corsair/hub';
import type { VercelPluginOptions } from './index';
import { VERCEL_OAUTH_TOKEN_URL, vercel, vercelAuthConfig } from './index';
import { resolveVercelOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	getOAuthAccessToken: jest.fn(),
}));
jest.mock('corsair/hub', () => ({
	...jest.requireActual('corsair/hub'),
	getManagedAccessToken: jest.fn(),
	attachManagedRefreshAuth: jest.fn(),
}));

const oauthAccess = jest.mocked(getOAuthAccessToken);
const managedAccess = jest.mocked(getManagedAccessToken);
const attachRefresh = jest.mocked(attachManagedRefreshAuth);

type Stored = {
	apiKey?: string | null;
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken?: string | null;
	webhookSignature?: string | null;
};

function buildCtx(options: VercelPluginOptions, stored: Stored, hub?: object) {
	const plugin = vercel(options);
	return {
		plugin,
		ctx: {
			authType: options.authType ?? 'api_key',
			options: plugin.options,
			tenantId: 'tenant-1',
			hub,
			keys: {
				get_api_key: async () => stored.apiKey ?? null,
				get_access_token: async () => stored.accessToken ?? null,
				get_expires_at: async () => stored.expiresAt ?? null,
				get_refresh_token: async () => stored.refreshToken ?? null,
				get_webhook_signature: async () => stored.webhookSignature ?? null,
			},
		},
	};
}

async function buildKey(
	options: VercelPluginOptions,
	stored: Stored = {},
	source: 'endpoint' | 'webhook' = 'endpoint',
	hub?: object,
): Promise<string> {
	const { plugin, ctx } = buildCtx(options, stored, hub);
	if (!plugin.keyBuilder) throw new Error('keyBuilder is required');
	// The key manager is faked with the getters the keyBuilder reads.
	return plugin.keyBuilder(ctx as never, source);
}

beforeEach(() => jest.clearAllMocks());

describe('Vercel credentials', () => {
	it('keeps team_id as a connection field for every auth type', () => {
		expect(vercelAuthConfig.api_key.account).toEqual(['team_id']);
		expect(vercelAuthConfig.oauth_2.account).toEqual(['team_id']);
		expect(vercelAuthConfig.managed.account).toEqual(['team_id']);
	});

	it('uses the stored access token for api_key', async () => {
		await expect(buildKey({}, { apiKey: 'vercel-token' })).resolves.toBe(
			'vercel-token',
		);
	});

	it('asks for a connection when no access token is stored', async () => {
		await expect(buildKey({}, {})).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('prefers a key passed in the plugin options', async () => {
		await expect(
			buildKey({ key: 'from-options' }, { apiKey: 'stored' }),
		).resolves.toBe('from-options');
	});

	it('returns the webhook secret for webhook verification', async () => {
		await expect(
			buildKey({}, { webhookSignature: 'whsec' }, 'webhook'),
		).resolves.toBe('whsec');
		await expect(
			buildKey({ webhookSecret: 'opt-secret' }, {}, 'webhook'),
		).resolves.toBe('opt-secret');
		await expect(buildKey({}, {}, 'webhook')).rejects.toThrow(
			/webhook_signature/,
		);
	});

	it('sends a non-expiring integration token as stored, without refreshing', async () => {
		await expect(
			buildKey({ authType: 'oauth_2' }, { accessToken: 'integration-token' }),
		).resolves.toBe('integration-token');
		expect(oauthAccess).not.toHaveBeenCalled();
	});

	it('refreshes an expiring OAuth token through core with the Vercel token URL', async () => {
		oauthAccess.mockResolvedValueOnce('fresh-token');
		await expect(
			buildKey(
				{ authType: 'oauth_2' },
				{ accessToken: 'old', expiresAt: '1', refreshToken: 'vcr_1' },
			),
		).resolves.toBe('fresh-token');
		expect(oauthAccess).toHaveBeenCalledWith(expect.anything(), {
			plugin: 'vercel',
			tokenUrl: VERCEL_OAUTH_TOKEN_URL,
		});
	});

	it('uses an expiring token without a refresh token until it expires', async () => {
		const later = String(Math.floor(Date.now() / 1000) + 3600);
		await expect(
			buildKey(
				{ authType: 'oauth_2' },
				{ accessToken: 'vca_1', expiresAt: later },
			),
		).resolves.toBe('vca_1');
		await expect(
			buildKey(
				{ authType: 'oauth_2' },
				{ accessToken: 'vca_1', expiresAt: '1' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(buildKey({ authType: 'oauth_2' }, {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(oauthAccess).not.toHaveBeenCalled();
	});

	it('gets managed tokens from Hub and arms the 401 refresh', async () => {
		managedAccess.mockResolvedValueOnce({
			accessToken: 'managed-token',
			expiresAt: 0,
			refreshed: false,
		});
		const hub = { url: 'https://hub.example' };
		await expect(
			buildKey({ authType: 'managed' }, {}, 'endpoint', hub),
		).resolves.toBe('managed-token');
		expect(managedAccess).toHaveBeenCalledWith(
			expect.objectContaining({ plugin: 'vercel', tenantId: 'tenant-1', hub }),
		);
		expect(attachRefresh).toHaveBeenCalled();
	});

	it('requires Hub config for managed auth', async () => {
		await expect(buildKey({ authType: 'managed' }, {})).rejects.toThrow(
			/Hub config is required/,
		);
	});
});

describe('OAuth install team', () => {
	it('saves the team from the token response', async () => {
		await expect(
			resolveVercelOAuthWebhookTenantLink({
				access_token: 'x',
				team_id: 'team_abc',
			}),
		).resolves.toEqual({ linkType: 'team_id', externalId: 'team_abc' });
	});

	it('ignores a teamId from the install redirect, which the OAuth state does not cover', async () => {
		await expect(
			resolveVercelOAuthWebhookTenantLink({
				access_token: 'x',
				team_id: null,
				teamId: 'team_someone_else',
			}),
		).resolves.toBeNull();
	});

	it('saves nothing for a personal-account install', async () => {
		await expect(
			resolveVercelOAuthWebhookTenantLink({ access_token: 'x', team_id: null }),
		).resolves.toBeNull();
	});

	it('is wired into the plugin', () => {
		expect(vercel().oauthWebhookTenantLinkResolver).toBe(
			resolveVercelOAuthWebhookTenantLink,
		);
	});
});
