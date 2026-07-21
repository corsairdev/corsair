// Verify processManagedOAuthDelivery enforces the custody rule:
// refresh token stays at Hub, the app caches only the access token.

const set_access_token = jest.fn().mockResolvedValue(undefined);
const set_refresh_token = jest.fn().mockResolvedValue(undefined);
const set_expires_at = jest.fn().mockResolvedValue(undefined);
const set_scope = jest.fn().mockResolvedValue(undefined);

const mockAccountKm = {
	set_access_token,
	set_refresh_token,
	set_expires_at,
	set_scope,
};

jest.mock('../core', () => ({
	createAccountKeyManager: () => mockAccountKm,
}));

jest.mock('../core/utils/corsair-instance', () => ({
	getCorsairInternal: () => ({
		database: {},
		kek: 'test-kek',
		plugins: [{ id: 'gmail' }],
		hub: undefined,
	}),
	requireCorsairPlugin: (_internal: unknown, pluginId: string) => ({
		id: pluginId,
		authConfig: undefined,
	}),
}));

jest.mock('../hub/internal/provision', () => ({
	ensureCorsairProvisionedForTenant: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../webhooks/resolve-oauth-tenant-link', () => ({
	resolveOAuthWebhookTenantLink: jest.fn().mockResolvedValue(undefined),
}));

import { processManagedOAuthDelivery } from '../hub/managed-oauth';

beforeEach(() => {
	jest.clearAllMocks();
});

test('processManagedOAuthDelivery sets access token but NEVER persists refresh token', async () => {
	await processManagedOAuthDelivery(
		{}, // corsair instance (mocked internally)
		{
			plugin: 'gmail',
			tenantId: 't1',
			accessToken: 'access-abc',
			refreshToken: 'refresh-SECRET',
			expiresIn: 3600,
			scope: 'email profile',
		},
	);

	expect(set_access_token).toHaveBeenCalledWith('access-abc');
	// Custody: refresh token must never be written app-side
	expect(set_refresh_token).not.toHaveBeenCalled();
	expect(set_expires_at).toHaveBeenCalled();
	expect(set_scope).toHaveBeenCalledWith('email profile');
});

test('processManagedOAuthDelivery works with no refresh token in payload', async () => {
	await processManagedOAuthDelivery(
		{},
		{
			plugin: 'gmail',
			tenantId: 't1',
			accessToken: 'access-xyz',
		},
	);

	expect(set_access_token).toHaveBeenCalledWith('access-xyz');
	expect(set_refresh_token).not.toHaveBeenCalled();
});
