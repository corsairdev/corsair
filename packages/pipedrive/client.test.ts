import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makePipedriveBinaryRequest,
	makePipedriveRequest,
	PIPEDRIVE_API_BASE,
	PIPEDRIVE_API_V1_BASE,
	PIPEDRIVE_RATE_LIMIT_CONFIG,
	withOAuthRetry,
} from './client';
import type { PipedriveKeyBuilderContext } from './index';
import { pipedrive } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/deals', query: { api_token: 'secret-token' } },
		{
			url: `${PIPEDRIVE_API_BASE}/deals?api_token=secret-token`,
			ok: false,
			status,
			statusText: 'Request failed',
			body: { error: 'Request failed' },
		},
		'Pipedrive request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => mockedRequest.mockReset());

describe('Pipedrive HTTP client', () => {
	it('uses the documented x-api-token header and configured v2 base URL', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makePipedriveRequest('/deals', 'test-token', 'api_key', {
			method: 'GET',
			query: { limit: 50 },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: PIPEDRIVE_API_BASE,
				VERSION: '2.0.0',
				HEADERS: {
					'Content-Type': 'application/json',
					'x-api-token': 'test-token',
				},
			}),
			expect.objectContaining({
				url: '/deals',
				query: { limit: 50 },
			}),
			expect.objectContaining({ rateLimitConfig: PIPEDRIVE_RATE_LIMIT_CONFIG }),
		);
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
	});

	it('uses Bearer authentication for OAuth without a token query parameter', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makePipedriveRequest('/deals', 'oauth-token', 'oauth_2');
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			TOKEN: 'oauth-token',
		});
		expect(mockedRequest.mock.calls[0]?.[1]?.query).toBeUndefined();
	});

	it('uses the v1 server and preserves URL-encoded request bodies', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makePipedriveRequest('/files/remote', 'test-token', 'api_key', {
			method: 'POST',
			body: 'remote_url=https%3A%2F%2Ffiles.example.invalid%2Freport.pdf',
			apiVersion: 'v1',
			contentType: 'application/x-www-form-urlencoded',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: PIPEDRIVE_API_V1_BASE,
				VERSION: '1.0.0',
				HEADERS: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'x-api-token': 'test-token',
				},
			}),
			expect.objectContaining({
				url: '/files/remote',
				method: 'POST',
				body: 'remote_url=https%3A%2F%2Ffiles.example.invalid%2Freport.pdf',
				mediaType: 'application/x-www-form-urlencoded',
			}),
			expect.anything(),
		);
	});

	it('downloads v1 files as bounded base64 and uses the configured token header', async () => {
		const originalFetch = globalThis.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(new Uint8Array([80, 68]), {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);
		globalThis.fetch = fetchMock;
		try {
			await expect(
				makePipedriveBinaryRequest(
					'/files/7/download',
					'test-token',
					'api_key',
					{
						method: 'GET',
						apiVersion: 'v1',
					},
				),
			).resolves.toEqual({
				content_type: 'application/pdf',
				base64: 'UEQ=',
				byte_length: 2,
			});
			expect(fetchMock).toHaveBeenCalledWith(
				`${PIPEDRIVE_API_V1_BASE}/files/7/download`,
				expect.objectContaining({
					method: 'GET',
					redirect: 'manual',
					headers: expect.any(Headers),
				}),
			);
			const request = fetchMock.mock.calls[0]?.[1];
			expect(new Headers(request?.headers).get('x-api-token')).toBe(
				'test-token',
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('rejects cross-origin file redirects before forwarding the API token', async () => {
		const originalFetch = globalThis.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(null, {
				status: 302,
				headers: { Location: 'https://attacker.example.invalid/collect' },
			}),
		);
		globalThis.fetch = fetchMock;
		try {
			const rejection = await makePipedriveBinaryRequest(
				'/files/7/download',
				'test-token',
				'api_key',
				{ method: 'GET', apiVersion: 'v1' },
			).catch(
				// `unknown` because a rejected fetch promise may contain any JavaScript value.
				(error: unknown) => error,
			);
			expect(rejection).toBeInstanceOf(ApiError);
			if (!(rejection instanceof ApiError))
				throw new Error('Expected ApiError');
			expect(rejection.status).toBe(302);
			expect(JSON.stringify(rejection)).not.toContain(
				'attacker.example.invalid',
			);
			expect(JSON.stringify(rejection)).not.toContain('test-token');
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledWith(
				expect.stringContaining('/files/7/download'),
				expect.objectContaining({ redirect: 'manual' }),
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('follows same-provider redirects without leaving Pipedrive origins', async () => {
		const originalFetch = globalThis.fetch;
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce(
				new Response(null, {
					status: 302,
					headers: {
						Location: 'https://app.pipedrive.com/api/v1/files/7/download',
					},
				}),
			)
			.mockResolvedValueOnce(
				new Response(new Uint8Array([80, 68]), {
					status: 200,
					headers: { 'Content-Type': 'application/pdf' },
				}),
			);
		globalThis.fetch = fetchMock;
		try {
			await expect(
				makePipedriveBinaryRequest(
					'/files/7/download',
					'test-token',
					'api_key',
					{
						method: 'GET',
						apiVersion: 'v1',
					},
				),
			).resolves.toMatchObject({ base64: 'UEQ=', byte_length: 2 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(fetchMock.mock.calls[1]?.[0]).toBe(
				'https://app.pipedrive.com/api/v1/files/7/download',
			);
			for (const [, requestOptions] of fetchMock.mock.calls) {
				expect(requestOptions?.redirect).toBe('manual');
				expect(new Headers(requestOptions?.headers).get('x-api-token')).toBe(
					'test-token',
				);
			}
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('preserves rate-limit reset metadata for binary-download errors', async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = jest.fn().mockResolvedValue(
			new Response('private provider details', {
				status: 429,
				headers: { 'x-ratelimit-reset': '2' },
			}),
		);
		try {
			const rejection = await makePipedriveBinaryRequest(
				'/files/7/download',
				'test-token',
				'api_key',
				{ method: 'GET', apiVersion: 'v1' },
			).catch(
				// `unknown` because a rejected fetch promise may contain any value.
				(error: unknown) => error,
			);
			expect(rejection).toBeInstanceOf(ApiError);
			if (!(rejection instanceof ApiError))
				throw new Error('Expected ApiError');
			expect(rejection.status).toBe(429);
			expect(rejection.retryAfter).toBe(2000);
			expect(JSON.stringify(rejection)).not.toContain(
				'private provider details',
			);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('lets multipart image requests set their own boundary and omits binary data from errors', async () => {
		const formData = new FormData();
		formData.append(
			'data',
			new Blob(['private image bytes'], { type: 'image/png' }),
		);
		mockedRequest.mockResolvedValueOnce({ success: true });
		await makePipedriveRequest('/products/52/images', 'test-token', 'api_key', {
			method: 'POST',
			body: formData,
		});
		const config = mockedRequest.mock.calls[0]?.[0];
		const requestOptions = mockedRequest.mock.calls[0]?.[1];
		expect(config?.HEADERS).toEqual({ 'x-api-token': 'test-token' });
		expect(requestOptions?.mediaType).toBeUndefined();
		expect(requestOptions?.body).toBe(formData);

		const unsafeRequest = {
			method: 'POST' as const,
			url: '/products/52/images',
			body: formData,
		};
		const apiError = new ApiError(
			unsafeRequest,
			{
				url: `${PIPEDRIVE_API_BASE}/products/52/images`,
				ok: false,
				status: 429,
				statusText: 'Rate limited',
				body: { error: 'Rate limited' },
			},
			'Pipedrive request failed',
			{ retryAfter: 4000 },
		);
		mockedRequest.mockRejectedValueOnce(apiError);
		const rejection = await makePipedriveRequest(
			'/products/52/images',
			'test-token',
			'api_key',
			{ method: 'POST', body: formData },
		).catch(
			// `unknown` because a Promise rejection may contain any JavaScript value.
			(error: unknown) => error,
		);
		expect(rejection).toBeInstanceOf(ApiError);
		expect(rejection).toBe(apiError);
		if (!(rejection instanceof ApiError)) throw new Error('Expected ApiError');
		expect(rejection.status).toBe(429);
		expect(rejection.retryAfter).toBe(4000);
		expect(rejection.body).toEqual({ error: 'Rate limited' });
		expect(rejection.request).not.toHaveProperty('body');
	});

	it('fails fast for a missing credential', async () => {
		await expect(makePipedriveRequest('/deals', '', 'api_key')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('redacts ApiError request values while preserving the original error', async () => {
		const rateLimited = apiError(429, 4000);
		mockedRequest.mockRejectedValue(rateLimited);
		const rejection = await makePipedriveRequest(
			'/deals',
			'test-token',
			'api_key',
		).catch(
			// `unknown` because a Promise rejection may contain any JavaScript value.
			(error: unknown) => error,
		);
		expect(rejection).toBe(rateLimited);
		if (!(rejection instanceof ApiError)) throw new Error('Expected ApiError');
		expect(rejection.status).toBe(429);
		expect(rejection.retryAfter).toBe(4000);
		expect(rejection.request).not.toHaveProperty('body');
		expect(rejection.request).not.toHaveProperty('query');
		expect(rejection.body).toEqual({ error: 'Request failed' });
		expect(rejection.url).toBe(`${PIPEDRIVE_API_BASE}/deals`);
		expect(JSON.stringify(rejection.request)).not.toContain('secret-token');
		expect(JSON.stringify(mockedRequest.mock.calls[0]?.[1])).not.toContain(
			'test-token',
		);
	});

	it('extracts Pipedrive burst reset with the real shared transport', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const originalFetch = globalThis.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'x-ratelimit-reset': '4',
				},
			}),
		);
		globalThis.fetch = fetchMock;
		try {
			const rejection = await actualHttp
				.request(
					{
						BASE: PIPEDRIVE_API_BASE,
						VERSION: '2.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
					},
					{
						method: 'GET',
						url: '/deals',
						query: {},
					},
					{ rateLimitConfig: PIPEDRIVE_RATE_LIMIT_CONFIG },
				)
				.catch(
					// `unknown` because a Promise rejection may contain any JavaScript value.
					(error: unknown) => error,
				);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(rejection).toBeInstanceOf(ApiError);
			if (!(rejection instanceof ApiError))
				throw new Error('Expected ApiError');
			expect(rejection.retryAfter).toBe(4000);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it('configures Pipedrive OAuth and refreshes expired and rejected access tokens', async () => {
		const plugin = pipedrive({ authType: 'oauth_2' });
		expect(plugin.oauthConfig).toEqual({
			providerName: 'Pipedrive',
			authUrl: 'https://oauth.pipedrive.com/oauth/authorize',
			tokenUrl: 'https://oauth.pipedrive.com/oauth/token',
			tokenAuthMethod: 'basic',
			scopes: [
				'activities:full',
				'activities:read',
				'admin',
				'base',
				'contact-fields:full',
				'contacts:full',
				'contacts:read',
				'deal-fields:full',
				'deals:full',
				'deals:read',
				'goals:full',
				'goals:read',
				'leads:full',
				'leads:read',
				'mail:full',
				'mail:read',
				'messengers-integration',
				'phone-integration',
				'product-fields:full',
				'products:full',
				'products:read',
				'project-fields:full',
				'projects:full',
				'projects:read',
				'recents:read',
				'search:read',
				'users:read',
				'video-calls',
			],
		});

		let accessToken: string | null = 'expired-access-token';
		let refreshToken: string | null = 'initial-refresh-token';
		let expiresAt: string | null = '1';
		const writes: string[] = [];
		const keys = {
			get_dek: async () => 'test-dek',
			issue_new_dek: async () => 'test-dek',
			get_access_token: async () => accessToken,
			set_access_token: async (value: string | null) => {
				accessToken = value;
				if (value) writes.push(`access:${value}`);
			},
			get_refresh_token: async () => refreshToken,
			set_refresh_token: async (value: string | null) => {
				refreshToken = value;
				if (value) writes.push(`refresh:${value}`);
			},
			get_expires_at: async () => expiresAt,
			set_expires_at: async (value: string | null) => {
				expiresAt = value;
				writes.push('expires');
			},
			get_scope: async () => null,
			set_scope: async () => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async () => undefined,
			get_integration_credentials: async () => ({
				client_id: 'pipedrive-client-id',
				client_secret: 'pipedrive-client-secret',
				redirect_url: null,
			}),
		} satisfies PipedriveKeyBuilderContext['keys'];
		const context = {
			authType: 'oauth_2',
			options: { authType: 'oauth_2' },
			tenantId: 'test-tenant',
			keys,
		} satisfies PipedriveKeyBuilderContext;
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('Expected the Pipedrive key builder');
		const originalFetch = globalThis.fetch;
		const requests: { url: string; init: RequestInit }[] = [];
		const responseBodies = [
			{
				access_token: 'fresh-access-token',
				refresh_token: 'rotated-refresh-token',
				expires_in: 3600,
			},
			{
				access_token: 'forced-access-token',
				refresh_token: 'second-rotated-refresh-token',
				expires_in: 3600,
			},
		];
		globalThis.fetch = async (input, init) => {
			requests.push({ url: String(input), init: init ?? {} });
			const body = responseBodies.shift();
			if (!body) throw new Error('Unexpected extra OAuth refresh request');
			return new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};
		try {
			await expect(keyBuilder(context, 'endpoint')).resolves.toBe(
				'fresh-access-token',
			);
			expect(requests).toHaveLength(1);
			expect(requests[0]?.url).toBe('https://oauth.pipedrive.com/oauth/token');
			expect(new Headers(requests[0]?.init.headers).get('Authorization')).toBe(
				`Basic ${Buffer.from(
					'pipedrive-client-id:pipedrive-client-secret',
				).toString('base64')}`,
			);
			expect(
				Object.fromEntries(new URLSearchParams(String(requests[0]?.init.body))),
			).toEqual({
				grant_type: 'refresh_token',
				refresh_token: 'initial-refresh-token',
			});
			expect(accessToken).toBe('fresh-access-token');
			expect(refreshToken).toBe('rotated-refresh-token');
			expect(writes).toContain('access:fresh-access-token');
			expect(writes).toContain('refresh:rotated-refresh-token');

			// `unknown` because the shared OAuth helper installs this internal hook dynamically.
			const refreshAuth: unknown = Reflect.get(context, '_refreshAuth');
			expect(typeof refreshAuth).toBe('function');
			if (typeof refreshAuth !== 'function') {
				throw new Error('Expected the OAuth helper to install a refresh hook');
			}
			await expect(refreshAuth()).resolves.toBe('forced-access-token');
			expect(requests).toHaveLength(2);
			expect(
				Object.fromEntries(new URLSearchParams(String(requests[1]?.init.body))),
			).toEqual({
				grant_type: 'refresh_token',
				refresh_token: 'rotated-refresh-token',
			});
			expect(accessToken).toBe('forced-access-token');
			expect(refreshToken).toBe('second-rotated-refresh-token');
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});

describe('Pipedrive request errors', () => {
	it('drops a JSON write body (customer fields) from the ApiError', async () => {
		const sent = { name: 'Private Person', notes: 'confidential note' };
		const apiError = new ApiError(
			{ method: 'POST', url: '/persons', body: sent },
			{
				url: `${PIPEDRIVE_API_BASE}/persons`,
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { success: false, error: 'Invalid field' },
			},
			'Bad Request',
		);
		mockedRequest.mockRejectedValueOnce(apiError);
		const error = await makePipedriveRequest(
			'/persons',
			'test-token',
			'api_key',
			{
				method: 'POST',
				body: sent,
			},
			// `unknown`: a rejection can carry any value; the next lines check it is an ApiError.
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toBe(apiError);
		expect(error).toMatchObject({
			status: 400,
			body: { success: false, error: 'Invalid field' },
		});
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		expect(error.request.body).toBeUndefined();
		expect(error.request.query).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('confidential note');
	});
});

describe('withOAuthRetry', () => {
	it('refreshes once after a 401 and resends the write with the new token', async () => {
		const endpoint = jest
			.fn()
			.mockRejectedValueOnce(apiError(401))
			.mockResolvedValueOnce({ success: true });
		const refresh = jest.fn().mockResolvedValue('fresh-token');
		const wrapped = withOAuthRetry(endpoint);
		await expect(
			wrapped({ key: 'stale-token', _refreshAuth: refresh }, { title: 'x' }),
		).resolves.toEqual({ success: true });
		expect(refresh).toHaveBeenCalledTimes(1);
		expect(endpoint).toHaveBeenLastCalledWith(
			expect.objectContaining({ key: 'fresh-token' }),
			{ title: 'x' },
		);
	});

	it('rethrows a 401 when no refresh is installed (API token)', async () => {
		const endpoint = jest.fn().mockRejectedValue(apiError(401));
		await expect(
			withOAuthRetry(endpoint)({ key: 'api-token' }, {}),
		).rejects.toMatchObject({ status: 401 });
		expect(endpoint).toHaveBeenCalledTimes(1);
	});

	it('does not retry other errors', async () => {
		const endpoint = jest.fn().mockRejectedValue(apiError(500));
		const refresh = jest.fn();
		await expect(
			withOAuthRetry(endpoint)({ key: 't', _refreshAuth: refresh }, {}),
		).rejects.toMatchObject({ status: 500 });
		expect(refresh).not.toHaveBeenCalled();
	});
});
