import { AuthMissingError } from './errors/auth-missing';

const getManagedAccessToken = jest.fn();
const attachManagedRefreshAuth = jest.fn();
jest.mock('../../hub/managed-auth', () => ({
	getManagedAccessToken: (...a: unknown[]) => getManagedAccessToken(...a),
	attachManagedRefreshAuth: (...a: unknown[]) => attachManagedRefreshAuth(...a),
}));

import { resolveBindingKey } from './resolve-binding-key';

const hub = { apiUrl: 'https://hub.test' } as never;
const keys = { marker: 'account-keys' } as never;

beforeEach(() => {
	getManagedAccessToken.mockReset().mockResolvedValue({
		accessToken: 'managed-token',
		expiresAt: 0,
		refreshed: false,
	});
	attachManagedRefreshAuth.mockReset().mockResolvedValue(undefined);
});

test('managed authType resolves the token via Hub, not the plugin keyBuilder', async () => {
	const keyBuilder = jest.fn();
	const key = await resolveBindingKey(
		{ authType: 'managed', keys, hub, tenantId: 't1' },
		{ id: 'gmail', keyBuilder },
		'endpoint',
	);
	expect(key).toBe('managed-token');
	expect(getManagedAccessToken).toHaveBeenCalledWith({
		keys,
		hub,
		plugin: 'gmail',
		tenantId: 't1',
	});
	expect(keyBuilder).not.toHaveBeenCalled();
});

test('non-managed authType falls through to the plugin keyBuilder', async () => {
	const keyBuilder = jest.fn().mockResolvedValue('oauth-token');
	const key = await resolveBindingKey(
		{ authType: 'oauth_2', keys, hub, tenantId: 't1' },
		{ id: 'gmail', keyBuilder },
		'webhook',
	);
	expect(key).toBe('oauth-token');
	expect(keyBuilder).toHaveBeenCalledWith(
		expect.objectContaining({ authType: 'oauth_2' }),
		'webhook',
	);
	expect(getManagedAccessToken).not.toHaveBeenCalled();
});

test('managed without a hub config throws AuthMissingError', async () => {
	await expect(
		resolveBindingKey(
			{ authType: 'managed', keys, hub: undefined, tenantId: 't1' },
			{ id: 'gmail', keyBuilder: jest.fn() },
			'endpoint',
		),
	).rejects.toBeInstanceOf(AuthMissingError);
});

test('managed without a key store throws AuthMissingError and never calls getManagedAccessToken', async () => {
	await expect(
		resolveBindingKey(
			{ authType: 'managed', keys: undefined, hub, tenantId: 't1' },
			{ id: 'gmail', keyBuilder: jest.fn() },
			'endpoint',
		),
	).rejects.toBeInstanceOf(AuthMissingError);
	expect(getManagedAccessToken).not.toHaveBeenCalled();
});
