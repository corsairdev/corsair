import { request } from 'corsair/http';
import { bitbucket } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});
const mockRequest = request as jest.MockedFunction<typeof request>;
type RefreshableContext = { _refreshAuth?: () => Promise<string> };
type KeyBuilderFn = (ctx: unknown, source: 'endpoint') => Promise<string>;
function buildKey(plugin: { keyBuilder?: unknown }, ctx: unknown) {
	return (plugin.keyBuilder as unknown as KeyBuilderFn)(ctx, 'endpoint');
}
function keyBuilderContext() {
	const stored = {
		access_token: 'stored-access',
		expires_at: String(Math.floor(Date.now() / 1000) + 1800),
		refresh_token: 'stored-refresh',
	};
	const keys = {
		get_access_token: jest.fn(async () => stored.access_token),
		get_expires_at: jest.fn(async () => stored.expires_at),
		get_refresh_token: jest.fn(async () => stored.refresh_token),
		get_integration_credentials: jest.fn(async () => ({
			client_id: 'client',
			client_secret: 'secret',
		})),
		set_access_token: jest.fn(async (value: string) => {
			stored.access_token = value;
		}),
		set_expires_at: jest.fn(async (value: string) => {
			stored.expires_at = value;
		}),
		set_refresh_token: jest.fn(async (value: string) => {
			stored.refresh_token = value;
		}),
	};
	return { ctx: { authType: 'oauth_2', keys }, keys, stored };
}
describe('Bitbucket integration', () => {
	beforeEach(() => mockRequest.mockReset());
	it('uses OAuth 2.0 and intentionally exposes no webhooks', () => {
		const plugin = bitbucket({ key: 'test-token', authType: 'oauth_2' });
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://bitbucket.org/site/oauth2/authorize',
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});
	it('requests defaultBitbucketScopes unless the caller narrows them', () => {
		expect(bitbucket({}).oauthConfig?.scopes).toContain('repository:delete');
		expect(
			bitbucket({ scopes: ['account', 'repository'] }).oauthConfig?.scopes,
		).toEqual(['account', 'repository']);
	});
	it('collapses concurrent expired-token builds into one refresh', async () => {
		const plugin = bitbucket({});
		const { ctx, keys } = keyBuilderContext();
		ctx.keys.get_expires_at = jest.fn(async () =>
			String(Math.floor(Date.now() / 1000) - 10),
		);
		mockRequest.mockResolvedValueOnce({
			access_token: 'rotated-access',
			refresh_token: 'rotated-refresh',
			expires_in: 3600,
		});
		const tokens = await Promise.all([
			buildKey(plugin, ctx),
			buildKey(plugin, ctx),
			buildKey(plugin, ctx),
		]);
		expect(tokens).toEqual([
			'rotated-access',
			'rotated-access',
			'rotated-access',
		]);
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(keys.set_refresh_token).toHaveBeenCalledTimes(1);
	});
	it('collapses concurrent refreshes into a single token rotation', async () => {
		const plugin = bitbucket({});
		const { ctx, keys, stored } = keyBuilderContext();
		await buildKey(plugin, ctx);
		const refreshAuth = (ctx as RefreshableContext)._refreshAuth;
		expect(typeof refreshAuth).toBe('function');
		expect(mockRequest).not.toHaveBeenCalled();
		let resolveRefresh: ((value: unknown) => void) | undefined;
		mockRequest.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					resolveRefresh = resolve;
				}) as ReturnType<typeof request>,
		);
		const inFlight = [refreshAuth?.(), refreshAuth?.(), refreshAuth?.()];
		await Promise.resolve();
		resolveRefresh?.({
			access_token: 'rotated-access',
			refresh_token: 'rotated-refresh',
			expires_in: 3600,
		});
		const tokens = await Promise.all(inFlight);
		expect(tokens).toEqual([
			'rotated-access',
			'rotated-access',
			'rotated-access',
		]);
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(keys.set_refresh_token).toHaveBeenCalledTimes(1);
		expect(stored.refresh_token).toBe('rotated-refresh');
	});
	it('refreshes again after an in-flight refresh settles', async () => {
		const plugin = bitbucket({});
		const { ctx } = keyBuilderContext();
		await buildKey(plugin, ctx);
		const refreshAuth = (ctx as RefreshableContext)._refreshAuth;
		mockRequest
			.mockResolvedValueOnce({ access_token: 'first', expires_in: 3600 })
			.mockResolvedValueOnce({ access_token: 'second', expires_in: 3600 });
		await expect(refreshAuth?.()).resolves.toBe('first');
		await expect(refreshAuth?.()).resolves.toBe('second');
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});
	it('propagates a failed refresh to every concurrent caller and recovers', async () => {
		const plugin = bitbucket({});
		const { ctx } = keyBuilderContext();
		await buildKey(plugin, ctx);
		const refreshAuth = (ctx as RefreshableContext)._refreshAuth;
		mockRequest.mockRejectedValueOnce(new Error('invalid_grant'));
		const failures = [refreshAuth?.(), refreshAuth?.()];
		await expect(Promise.all(failures)).rejects.toThrow('invalid_grant');
		await Promise.allSettled(failures);
		expect(mockRequest).toHaveBeenCalledTimes(1);
		mockRequest.mockResolvedValueOnce({
			access_token: 'recovered',
			expires_in: 3600,
		});
		await expect(refreshAuth?.()).resolves.toBe('recovered');
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});
});
