import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeFiberyBinaryRequest,
	makeFiberyCommand,
	makeFiberyJsonRpc,
	makeFiberyRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const workspaceUrl = 'https://acme.fibery.io';

type OAuthAccessContext = Parameters<typeof getOAuthAccessToken>[0];

beforeEach(() => mockRequest.mockReset());

describe('Fibery HTTP client', () => {
	it('uses Token auth and the configured tenant origin', async () => {
		mockRequest.mockResolvedValue({ success: true, result: [] });
		await makeFiberyRequest('/api/commands', 'api-secret', {
			workspaceUrl,
			method: 'POST',
			body: { command: 'fibery.schema/query', args: {} },
		});
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: workspaceUrl,
			HEADERS: {
				Authorization: 'Token api-secret',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/api/commands',
			body: { command: 'fibery.schema/query', args: {} },
		});
	});

	it("leaves core's 429 retry on, since Fibery rate-limits at 3 requests a second", async () => {
		mockRequest.mockResolvedValue({ success: true, result: [] });
		await makeFiberyRequest('/api/commands', 'api-secret', {
			workspaceUrl,
			method: 'POST',
			body: { command: 'fibery.schema/query', args: {} },
		});
		const retries =
			mockRequest.mock.calls[0]?.[2]?.rateLimitConfig?.maxRetries ?? 3;
		expect(retries).toBeGreaterThan(0);
	});

	it('returns null for a JSON-RPC answer with no result (delete-views)', async () => {
		mockRequest.mockResolvedValue({ jsonrpc: '2.0' });
		await expect(
			makeFiberyJsonRpc('delete-views', { ids: [] }, 'api-secret', {
				workspaceUrl,
			}),
		).resolves.toBeNull();
	});

	it('uses Bearer auth for OAuth access tokens', async () => {
		mockRequest.mockResolvedValue({ success: true, result: {} });
		await makeFiberyRequest('/api/commands', 'oauth-secret', {
			workspaceUrl,
			authType: 'oauth_2',
			method: 'POST',
			body: { command: 'fibery.schema/query', args: {} },
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toMatchObject({
			Authorization: 'Bearer oauth-secret',
		});
	});

	it('refreshes an expired Fibery OAuth token using HTTP Basic client auth', async () => {
		let accessToken: string | null = 'expired-access-token';
		let refreshToken: string | null = 'stored-refresh-token';
		let expiresAt: string | null = '946684800';
		const keys: OAuthAccessContext['keys'] = {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_access_token: async () => accessToken,
			set_access_token: async (value) => {
				accessToken = value;
			},
			get_refresh_token: async () => refreshToken,
			set_refresh_token: async (value) => {
				refreshToken = value;
			},
			get_expires_at: async () => expiresAt,
			set_expires_at: async (value) => {
				expiresAt = value;
			},
			get_scope: async () => 'openid offline',
			set_scope: async () => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => undefined,
			get_integration_credentials: async () => ({
				client_id: 'fibery-client-id',
				client_secret: 'fibery-client-secret',
				redirect_url: 'https://app.invalid.test/oauth/callback',
			}),
		};
		const context: OAuthAccessContext = { keys, tenantId: 'fibery-tenant' };
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					access_token: 'fresh-access-token',
					refresh_token: 'rotated-refresh-token',
					expires_in: 3600,
				}),
				{ headers: { 'content-type': 'application/json' } },
			),
		);

		await expect(
			getOAuthAccessToken(context, {
				plugin: 'fibery',
				tokenUrl: 'https://auth.fibery.io/oauth2/token',
				tokenAuthMethod: 'basic',
			}),
		).resolves.toBe('fresh-access-token');

		const requestOptions = fetchSpy.mock.calls[0]?.[1];
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy.mock.calls[0]?.[0]).toBe(
			'https://auth.fibery.io/oauth2/token',
		);
		expect(new Headers(requestOptions?.headers).get('authorization')).toBe(
			`Basic ${btoa('fibery-client-id:fibery-client-secret')}`,
		);
		expect(String(requestOptions?.body)).toContain('grant_type=refresh_token');
		expect(accessToken).toBe('fresh-access-token');
		expect(refreshToken).toBe('rotated-refresh-token');
		fetchSpy.mockRestore();
	});

	it('rejects empty credentials and unsafe workspace URLs before network I/O', async () => {
		await expect(
			makeFiberyRequest('/api/commands', '', { workspaceUrl }),
		).rejects.toThrow(AuthMissingError);
		await expect(
			makeFiberyRequest('/api/commands', 'token', {
				workspaceUrl: 'http://acme.fibery.io',
			}),
		).rejects.toThrow('HTTPS');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('requires a workspace origin and rejects paths or embedded credentials', async () => {
		await expect(makeFiberyRequest('/api/commands', 'token')).rejects.toThrow(
			'workspaceUrl',
		);
		await expect(
			makeFiberyRequest('/api/commands', 'token', {
				workspaceUrl: 'https://user:pass@acme.fibery.io/path',
			}),
		).rejects.toThrow('origin');
	});

	it('retries a 429 through core and returns the later success', async () => {
		const realHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response('Too Many Requests', {
					status: 429,
					headers: { 'retry-after': '1' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ success: true, result: 3 }), {
					headers: { 'content-type': 'application/json' },
				}),
			);
		mockRequest.mockImplementation(realHttp.request);

		await expect(
			makeFiberyCommand(
				'fibery.entity/query',
				{
					query: {
						'q/from': 'CRM/Lead',
						'q/select': ['q/count', ['fibery/id']],
					},
				},
				'api-secret',
				{ workspaceUrl },
			),
		).resolves.toBe(3);
		expect(fetchSpy).toHaveBeenCalledTimes(2);
		fetchSpy.mockRestore();
	});

	it('preserves arbitrary binary file bytes as base64', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0, 255, 1]), {
				headers: { 'content-type': 'application/octet-stream' },
			}),
		);
		await expect(
			makeFiberyBinaryRequest(
				'/api/files/019dcf9a-c5ab-7292-9bdb-8956eea1b532',
				'api-secret',
				{
					workspaceUrl,
					method: 'GET',
				},
			),
		).resolves.toEqual({
			contentType: 'application/octet-stream',
			base64: 'AP8B',
		});
		fetchSpy.mockRestore();
	});

	it('unwraps command results and sanitizes provider errors without leaking credentials', async () => {
		mockRequest.mockResolvedValue({ success: true, result: { ok: true } });
		await expect(
			makeFiberyCommand('fibery.schema/query', {}, 'token', { workspaceUrl }),
		).resolves.toEqual({ ok: true });

		const transportError = new ApiError(
			{ method: 'POST', url: '/api/commands' },
			{
				url: `${workspaceUrl}/api/commands`,
				ok: false,
				status: 401,
				statusText: 'Unauthorized token',
				body: { token: 'token' },
			},
			'Unauthorized token',
		);
		mockRequest.mockRejectedValue(transportError);
		// `unknown` because a rejected promise can carry any thrown value; the checks below narrow it.
		const error = await makeFiberyRequest('/api/commands', 'token', {
			workspaceUrl,
		}).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 401 });
		if (!(error instanceof ApiError))
			throw new Error('Expected core ApiError.');
		expect(error.message).not.toContain('token');
		expect(error.body).toBeUndefined();
	});

	it("passes core's ApiError through without the sent command, query or reply", async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/api/commands',
					query: { q: 'jane@example.com' },
					body: {
						command: 'fibery.entity/create',
						args: { 'CRM/Email': 'jane@example.com' },
					},
				},
				{
					url: `${workspaceUrl}/api/commands?q=jane%40example.com`,
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { message: 'jane@example.com rejected' },
				},
				'jane@example.com rejected',
				{ retryAfter: 1500, rateLimitRemaining: 0 },
			),
		);
		// `unknown` because a rejected promise can carry any thrown value; the checks below narrow it.
		const error = await makeFiberyRequest('/api/commands', 'api-secret', {
			workspaceUrl,
			method: 'POST',
		}).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError))
			throw new Error('Expected core ApiError.');
		expect(error).toMatchObject({
			status: 429,
			retryAfter: 1500,
			rateLimitRemaining: 0,
		});
		expect(error.url).toBe(`${workspaceUrl}/api/commands`);
		expect(error.request.body).toBeUndefined();
		expect(error.request.query).toBeUndefined();
		expect(JSON.stringify({ ...error, message: error.message })).not.toContain(
			'jane',
		);
	});

	it('rejects a JSON-RPC answer that is not a 2.0 envelope', async () => {
		mockRequest.mockResolvedValue({});
		await expect(
			makeFiberyJsonRpc('delete-views', { ids: [] }, 'api-secret', {
				workspaceUrl,
			}),
		).rejects.toThrow('invalid JSON-RPC response');
	});
});
