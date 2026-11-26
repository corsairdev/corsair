import { getOAuthAccessToken } from 'corsair/core';
import { attachManagedRefreshAuth, getManagedAccessToken } from 'corsair/hub';
import { googledocs } from './index';

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

const keys = {
	get_access_token: async () => null,
	get_refresh_token: async () => null,
	get_expires_at: async () => null,
};

async function buildKey(authType: 'oauth_2' | 'managed', hub?: object) {
	const plugin = googledocs({ authType });
	if (!plugin.keyBuilder) throw new Error('keyBuilder is required');
	const ctx = {
		authType,
		options: plugin.options,
		tenantId: 'tenant-1',
		hub,
		keys,
	};
	// The key manager is faked with the getters the keyBuilder reads.
	return plugin.keyBuilder(ctx as never, 'endpoint' as never);
}

beforeEach(() => jest.clearAllMocks());

describe('googledocs managed auth', () => {
	it('gets the token from Hub when Corsair manages the Google app', async () => {
		const hub = { apiUrl: 'https://hub.example' };
		managedAccess.mockResolvedValue({ accessToken: 'managed-token' } as never);
		await expect(buildKey('managed', hub)).resolves.toBe('managed-token');
		expect(managedAccess).toHaveBeenCalledWith(
			expect.objectContaining({
				plugin: 'googledocs',
				tenantId: 'tenant-1',
				hub,
			}),
		);
		expect(attachRefresh).toHaveBeenCalledTimes(1);
		expect(oauthAccess).not.toHaveBeenCalled();
	});

	it('says Hub config is missing instead of a bare auth error', async () => {
		await expect(buildKey('managed')).rejects.toThrow(
			/auth-missing:googledocs:managed/,
		);
		expect(managedAccess).not.toHaveBeenCalled();
	});

	it('keeps the own-app path on Google directly', async () => {
		oauthAccess.mockResolvedValue('own-token' as never);
		await expect(buildKey('oauth_2')).resolves.toBe('own-token');
		expect(oauthAccess).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ plugin: 'googledocs' }),
		);
		expect(managedAccess).not.toHaveBeenCalled();
	});
});
