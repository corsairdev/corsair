import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import { ApiError } from 'corsair/http';
import {
	makeAuthenticatedQuickBooksRequest,
	makeQuickBooksRequest,
	QUICKBOOKS_RATE_LIMIT_CONFIG,
	quickBooksApiBase,
} from './client';
import type { QuickBooksKeyBuilderContext } from './index';
import { quickbooks } from './index';

describe('QuickBooks HTTP client', () => {
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('uses the official production and sandbox hosts', () => {
		expect(quickBooksApiBase()).toBe('https://quickbooks.api.intuit.com/v3');
		expect(quickBooksApiBase('sandbox')).toBe(
			'https://sandbox-quickbooks.api.intuit.com/v3',
		);
	});

	it('uses Intuit’s documented 60-second rate-limit wait and Retry-After', () => {
		expect(QUICKBOOKS_RATE_LIMIT_CONFIG).toMatchObject({
			enabled: true,
			maxRetries: 1,
			initialRetryDelay: 60_000,
			headerNames: { retryAfter: 'retry-after' },
		});
	});

	it('sends bearer auth and JSON through the shared transport', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ Account: { Id: '35' } }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await makeQuickBooksRequest(
			'company/123/account',
			'access-token',
			{ method: 'POST', body: { Name: 'Operating Checking' } },
			'production',
		);

		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the provider request');
		expect(call[0]).toBe(
			'https://quickbooks.api.intuit.com/v3/company/123/account',
		);
		expect(new Headers(call[1]?.headers).get('authorization')).toBe(
			'Bearer access-token',
		);
		expect(new Headers(call[1]?.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(call[1]?.body).toBe('{"Name":"Operating Checking"}');
	});

	it('omits attachment bytes from propagated upload errors', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ Fault: { Error: [{ Message: 'rejected' }] } }),
				{
					status: 500,
					statusText: 'Internal Server Error',
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
		// unknown because rejected promises may carry arbitrary values; instanceof narrows the provider error.
		const failure = await makeAuthenticatedQuickBooksRequest(
			{ key: 'access-token' },
			'company/123/upload',
			{
				method: 'POST',
				formData: {
					file_content_01: new Blob(['private attachment bytes'], {
						type: 'application/pdf',
					}),
				},
			},
			'sandbox',
		).catch((caught: unknown) => caught);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(failure).toBeInstanceOf(ApiError);
		if (!(failure instanceof ApiError)) {
			throw new Error('Expected the provider HTTP error');
		}
		expect(failure.status).toBe(500);
		expect(failure.request.formData).toBeUndefined();
	});

	it('drops the recipient address and JSON body from propagated errors', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ Fault: { Error: [{ Message: 'Invalid email' }] } }),
				{
					status: 400,
					statusText: 'Bad Request',
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
		// unknown because rejected promises may carry arbitrary values; instanceof narrows the provider error.
		const failure = await makeAuthenticatedQuickBooksRequest(
			{ key: 'access-token' },
			'company/123/invoice/7/send',
			{
				method: 'POST',
				query: { sendTo: 'pat@example.com' },
				body: { BillEmail: { Address: 'pat@example.com' } },
			},
			'sandbox',
		).catch((caught: unknown) => caught);

		expect(failure).toBeInstanceOf(ApiError);
		if (!(failure instanceof ApiError)) {
			throw new Error('Expected the provider HTTP error');
		}
		expect(failure.status).toBe(400);
		expect(failure.body).toEqual({
			Fault: { Error: [{ Message: 'Invalid email' }] },
		});
		expect(JSON.stringify([failure.url, failure.request])).not.toContain(
			'pat@example.com',
		);
		expect(failure.request.query).toBeUndefined();
		expect(failure.request.body).toBeUndefined();
	});

	it('refreshes OAuth access tokens through Intuit with HTTP Basic client auth', async () => {
		const plugin = quickbooks({ environment: 'sandbox' });
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://appcenter.intuit.com/connect/oauth2',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
		);
		expect(plugin.oauthConfig?.scopes).toEqual([
			'com.intuit.quickbooks.accounting',
		]);
		expect(plugin.oauthConfig?.tokenAuthMethod).toBe('basic');
		const keys: QuickBooksKeyBuilderContext['keys'] = {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_access_token: async () => 'expired-access-token',
			set_access_token: jest.fn(async () => undefined),
			get_refresh_token: async () => 'refresh-token',
			set_refresh_token: jest.fn(async () => undefined),
			get_expires_at: async () => '1',
			set_expires_at: jest.fn(async () => undefined),
			get_scope: async () => null,
			set_scope: jest.fn(async () => undefined),
			get_webhook_signature: async () => null,
			set_webhook_signature: jest.fn(async () => undefined),
			get_integration_credentials: async () => ({
				client_id: 'client-id',
				client_secret: 'client-secret',
				redirect_url: null,
			}),
		};
		const context = {
			authType: 'oauth_2' as const,
			options: {
				authType: 'oauth_2' as const,
				environment: 'sandbox' as const,
			},
			tenantId: 'default',
			keys,
		} satisfies QuickBooksKeyBuilderContext;
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					access_token: 'fresh-access-token',
					refresh_token: 'rotated-refresh-token',
					expires_in: 3600,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
		if (!plugin.keyBuilder) throw new Error('Expected the OAuth key builder');
		await expect(plugin.keyBuilder(context, 'endpoint')).resolves.toBe(
			'fresh-access-token',
		);

		const call = fetchMock.mock.calls.at(0);
		expect(call).toBeDefined();
		if (!call) throw new Error('Expected the OAuth token request');
		expect(call[0]).toBe(
			'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
		);
		expect(new Headers(call[1]?.headers).get('authorization')).toBe(
			`Basic ${Buffer.from('client-id:client-secret').toString('base64')}`,
		);
		expect(String(call[1]?.body)).toContain('grant_type=refresh_token');
		expect(String(call[1]?.body)).toContain('refresh_token=refresh-token');
	});

	it('extracts Retry-After from the real Corsair transport without retrying twice', async () => {
		const corsairHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const config: OpenAPIConfig = {
			BASE: quickBooksApiBase('sandbox'),
			VERSION: '3',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: 'access-token',
		};
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ Fault: { Error: [{ Message: 'throttled' }] } }),
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				},
			),
		);
		// unknown because a rejected promise may carry any value; instanceof below narrows it.
		const failure = await corsairHttp
			.request(
				config,
				{ method: 'GET', url: 'company/123/query' },
				{ rateLimitConfig },
			)
			.catch((caught: unknown) => caught);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(failure).toBeInstanceOf(ApiError);
		if (failure instanceof ApiError) {
			expect(failure.status).toBe(429);
			expect(failure.retryAfter).toBe(4000);
		}
	});
});
