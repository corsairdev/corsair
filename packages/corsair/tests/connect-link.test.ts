import { AuthMissingError } from '../core/auth/errors/auth-missing';
import {
	decodeOAuthState,
	encodeOAuthState,
	signState,
	verifyAndDecodeState,
} from '../core/auth/state';
import { bindEndpointsRecursively } from '../core/endpoints/bind';

describe('AuthMissingError', () => {
	it('sets name, pluginId, authType, and default message', () => {
		const err = new AuthMissingError('gmail', 'oauth_2');
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(AuthMissingError);
		expect(err.name).toBe('AuthMissingError');
		expect(err.pluginId).toBe('gmail');
		expect(err.authType).toBe('oauth_2');
		expect(err.message).toBe('[auth-missing:gmail:oauth_2]');
	});

	it('accepts a custom message', () => {
		const err = new AuthMissingError('gmail', 'oauth_2', 'custom message');
		expect(err.message).toBe('custom message');
		expect(err.pluginId).toBe('gmail');
		expect(err.authType).toBe('oauth_2');
	});
});

describe('OAuth state utilities', () => {
	const kek = 'test-kek-value-for-signing';

	it('round-trips encode/decode', () => {
		const encoded = encodeOAuthState('gmail', 'tenant-1');
		const decoded = decodeOAuthState(encoded);
		expect(decoded).toMatchObject({ plugin: 'gmail', tenantId: 'tenant-1' });
		expect(typeof decoded!.iat).toBe('number');
	});

	it('signs and verifies state', () => {
		const payload = encodeOAuthState('slack', 'tenant-2');
		const signed = signState(payload, kek);
		const decoded = verifyAndDecodeState(signed, kek);
		expect(decoded).toMatchObject({ plugin: 'slack', tenantId: 'tenant-2' });
	});

	it('rejects tampered state', () => {
		const payload = encodeOAuthState('slack', 'tenant-2');
		const signed = signState(payload, kek);
		const tampered = signed.slice(0, -5) + 'XXXXX';
		const decoded = verifyAndDecodeState(tampered, kek);
		expect(decoded).toBeNull();
	});

	it('returns null for invalid state', () => {
		expect(decodeOAuthState('not-valid-base64!!!')).toBeNull();
		expect(verifyAndDecodeState('', kek)).toBeNull();
	});

	it('rejects expired state', () => {
		const oldPayload = Buffer.from(
			JSON.stringify({
				plugin: 'gmail',
				tenantId: 't1',
				iat: Date.now() - 11 * 60 * 1000,
			}),
		).toString('base64url');
		const signed = signState(oldPayload, kek);
		expect(verifyAndDecodeState(signed, kek)).toBeNull();
	});
});

describe('connect-link generation in endpoint binding', () => {
	const kek = 'test-kek-for-connect-link';

	function createBoundEndpoint(opts: {
		keyBuilder?: (ctx: any, source: string) => Promise<string>;
		manualConfig?: any;
	}) {
		const endpoints = {
			sendEmail: async (_ctx: any, _args: any) => 'sent',
		};

		const tree: Record<string, unknown> = {};
		bindEndpointsRecursively({
			endpoints,
			hooks: undefined,
			ctx: {},
			tree,
			pluginId: 'gmail',
			errorHandlers: {},
			currentPath: [],
			keyBuilder: opts.keyBuilder,
			manualConfig: opts.manualConfig,
		});

		return tree.sendEmail as (args?: unknown) => Promise<unknown>;
	}

	it('does not generate connect link when keyBuilder returns empty string', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => '',
			manualConfig: {
				baseUrl: 'https://myapp.com/connect',
				redirectUri: 'https://myapp.com/api/callback',
				oauthConfig: {
					providerName: 'Google',
					authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
				},
				kek,
				tenantId: 'tenant-1',
			},
		});

		// keyBuilder returning empty is no longer intercepted - endpoint runs with no key
		const result = await boundFn({ to: 'user@example.com' });
		expect(result).toBe('sent');
	});

	it('generates connect link when keyBuilder throws AuthMissingError', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => {
				throw new AuthMissingError('gmail', 'oauth_2');
			},
			manualConfig: {
				baseUrl: 'https://myapp.com/connect',
				redirectUri: 'https://myapp.com/api/callback',
				oauthConfig: {
					providerName: 'Google',
					authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
				},
				kek,
				tenantId: 'tenant-1',
			},
		});

		try {
			await boundFn();
			fail('Expected error to be thrown');
		} catch (err: any) {
			expect(err.message).toContain('[auth-missing:gmail]');
			expect(err.message).toContain('https://myapp.com/connect');
		}
	});

	it('propagates non-AuthMissingError from keyBuilder even with manualConfig', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => {
				throw new Error('Account not found for tenant "tenant-1"');
			},
			manualConfig: {
				baseUrl: 'https://myapp.com/connect',
				redirectUri: 'https://myapp.com/api/callback',
				oauthConfig: {
					providerName: 'Google',
					authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
				},
				kek,
				tenantId: 'tenant-1',
			},
		});

		await expect(boundFn()).rejects.toThrow('Account not found');
	});

	it('uses custom onAuthMissing callback', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => {
				throw new AuthMissingError('gmail', 'oauth_2');
			},
			manualConfig: {
				baseUrl: 'https://myapp.com/connect',
				redirectUri: 'https://myapp.com/api/callback',
				oauthConfig: {
					providerName: 'Google',
					authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
				},
				kek,
				tenantId: 'tenant-1',
				onAuthMissing: ({
					plugin,
					connectUrl,
				}: {
					plugin: string;
					connectUrl: string;
					state: string;
				}) => `Please connect ${plugin}: ${connectUrl}`,
			},
		});

		try {
			await boundFn();
			fail('Expected error to be thrown');
		} catch (err: any) {
			expect(err.message).toContain('Please connect gmail');
			expect(err.message).toContain('https://myapp.com/connect');
		}
	});

	it('does not intercept errors when manualConfig is not set', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => {
				throw new Error('Account not found');
			},
		});

		await expect(boundFn()).rejects.toThrow('Account not found');
	});

	it('does not intercept errors when plugin has no oauthConfig', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => {
				throw new Error('Account not found');
			},
			manualConfig: {
				baseUrl: 'https://myapp.com/connect',
				redirectUri: 'https://myapp.com/api/callback',
				oauthConfig: undefined,
				kek,
				tenantId: 'tenant-1',
			},
		});

		await expect(boundFn()).rejects.toThrow('Account not found');
	});

	it('does not intercept unrelated errors when manualConfig is set', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => {
				throw new Error('Network timeout');
			},
			manualConfig: {
				baseUrl: 'https://myapp.com/connect',
				redirectUri: 'https://myapp.com/api/callback',
				oauthConfig: {
					providerName: 'Google',
					authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
				},
				kek,
				tenantId: 'tenant-1',
			},
		});

		await expect(boundFn()).rejects.toThrow('Network timeout');
	});

	it('does not generate connect link for api_key AuthMissingError', async () => {
		const boundFn = createBoundEndpoint({
			keyBuilder: async () => {
				throw new AuthMissingError('slack', 'api_key');
			},
			manualConfig: {
				baseUrl: 'https://myapp.com/connect',
				redirectUri: 'https://myapp.com/api/callback',
				oauthConfig: {
					providerName: 'Slack',
					authUrl: 'https://slack.com/oauth/v2/authorize',
				},
				kek,
				tenantId: 'tenant-1',
			},
		});

		await expect(boundFn()).rejects.toThrow('[auth-missing:slack:api_key]');
	});
});
