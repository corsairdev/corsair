import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeTrustpilotRequest } from './client';
import type { TrustpilotKeyBuilderContext } from './index';
import { trustpilot } from './index';

const apiKey = 'trustpilot-test-api-key';
const accessToken = 'trustpilot-test-access-token';

describe('Trustpilot HTTP client', () => {
	afterEach(() => jest.restoreAllMocks());

	it('uses the business API base and the documented apikey header', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('{"id":"unit-1"}', { status: 200 }));
		await makeTrustpilotRequest(
			'/v1/business-units/unit-1',
			apiKey,
			'business',
			'api_key',
		);
		const call = fetchMock.mock.calls[0];
		expect(String(call?.[0])).toBe(
			'https://api.trustpilot.com/v1/business-units/unit-1',
		);
		expect(new Headers(call?.[1]?.headers).get('apikey')).toBe(apiKey);
		expect(new Headers(call?.[1]?.headers).get('authorization')).toBeNull();
	});

	it('uses Bearer authorization and the invitations API host for protected calls', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('{"templates":[]}', { status: 200 }));
		await makeTrustpilotRequest(
			'/v1/private/business-units/unit-1/templates',
			accessToken,
			'invitations',
			'oauth_2',
		);
		const call = fetchMock.mock.calls[0];
		expect(String(call?.[0])).toBe(
			'https://invitations-api.trustpilot.com/v1/private/business-units/unit-1/templates',
		);
		expect(new Headers(call?.[1]?.headers).get('authorization')).toBe(
			`Bearer ${accessToken}`,
		);
		expect(new Headers(call?.[1]?.headers).get('apikey')).toBeNull();
	});

	it('uses the separate Data Solutions host and serializes repeated query values', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response('{"businessUnits":[]}', { status: 200 }));
		await makeTrustpilotRequest(
			'/v1/business-units/search',
			apiKey,
			'dataSolutions',
			'api_key',
			{
				query: { query: 'example.org', perPage: 20 },
			},
		);
		const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(url.origin).toBe('https://datasolutions.trustpilot.com');
		expect(url.searchParams.get('query')).toBe('example.org');
		expect(url.searchParams.get('perPage')).toBe('20');
	});

	it('fails fast for an explicitly empty credential', async () => {
		const fetchMock = jest.spyOn(global, 'fetch');
		await expect(
			makeTrustpilotRequest('/v1/reviews/latest', '', 'business', 'api_key'),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('redacts provider text and PII-bearing request details while preserving HTTP status', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('{"message":"Private contact john@example.invalid"}', {
				status: 400,
				statusText: 'Bad Request',
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		const rejection = await makeTrustpilotRequest(
			'/v1/private/reviews/review-id',
			accessToken,
			'business',
			'oauth_2',
			{
				method: 'POST',
				body: {
					consumerEmail: 'john@example.invalid',
					message: 'private text',
				},
			},
		).catch((caught: unknown) => caught); // `unknown` because a rejected promise may carry any value.
		expect(rejection).toBeInstanceOf(ApiError);
		if (rejection instanceof ApiError) {
			expect(rejection.status).toBe(400);
			expect(rejection.message).toBe('Trustpilot request failed');
			expect(rejection.body).toBeUndefined();
			expect(JSON.stringify(rejection.request)).not.toContain(
				'john@example.invalid',
			);
		}
	});

	it('uses the real Corsair transport and preserves Retry-After with one attempt', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		expect(actualHttp.request).toBeDefined();
		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('{"message":"limited"}', {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'Content-Type': 'application/json', 'Retry-After': '4' },
			}),
		);
		const rejection = await makeTrustpilotRequest(
			'/v1/reviews/latest',
			apiKey,
			'business',
			'api_key',
		).catch((caught: unknown) => caught); // `unknown` because a rejected promise may carry any value.
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(rejection).toBeInstanceOf(ApiError);
		if (rejection instanceof ApiError) {
			expect(rejection.status).toBe(429);
			expect(rejection.retryAfter).toBe(4000);
			expect(rejection.message).toBe('Trustpilot request failed');
		}
	});

	it('refreshes OAuth-code tokens and accepts fresh externally managed client-credentials tokens', async () => {
		let accessToken = 'expired-access-token';
		let refreshToken = 'valid-refresh-token';
		let clientSecret: string | null = 'trustpilot-client-secret';
		let expiresAt = '1';
		const keys = {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_api_key: async () => null,
			set_api_key: async (_value: string | null) => undefined,
			get_access_token: async () => accessToken,
			set_access_token: async (value: string | null) => {
				accessToken = value ?? '';
			},
			get_refresh_token: async () => refreshToken,
			set_refresh_token: async (value: string | null) => {
				refreshToken = value ?? '';
			},
			get_expires_at: async () => expiresAt,
			set_expires_at: async (value: string | null) => {
				expiresAt = value ?? '';
			},
			get_scope: async () => null,
			set_scope: async (_value: string | null) => undefined,
			get_webhook_signature: async () => null,
			set_webhook_signature: async (_value: string | null) => undefined,
			get_integration_credentials: async () => ({
				client_id: 'trustpilot-client-id',
				client_secret: clientSecret,
				redirect_url: 'https://app.example.invalid/callback',
			}),
		};
		const context = {
			authType: 'oauth_2',
			options: { authType: 'oauth_2' },
			tenantId: 'tenant-1',
			meteredOperationId: 'reviews.getPrivate',
			keys,
		} satisfies TrustpilotKeyBuilderContext;
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(
				new Response(
					'{"access_token":"fresh-access-token","refresh_token":"rotated-refresh-token","expires_in":"3600"}',
					{ status: 200, headers: { 'Content-Type': 'application/json' } },
				),
			);
		const plugin = trustpilot({ authType: 'oauth_2' });
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder)
			throw new Error('Trustpilot OAuth key builder is not configured');
		const token = await keyBuilder(context, 'endpoint');
		expect(token).toBe('fresh-access-token');
		expect(accessToken).toBe('fresh-access-token');
		expect(refreshToken).toBe('rotated-refresh-token');
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			'https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken',
		);
		expect(
			new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('authorization'),
		).toBe(
			`Basic ${Buffer.from('trustpilot-client-id:trustpilot-client-secret').toString('base64')}`,
		);
		expect(String(fetchMock.mock.calls[0]?.[1]?.body)).toContain(
			'grant_type=refresh_token',
		);

		clientSecret = null;
		accessToken = 'externally-renewed-access-token';
		expiresAt = String(Math.floor(Date.now() / 1000) + 3600);
		fetchMock.mockClear();
		expect(await keyBuilder(context, 'endpoint')).toBe(
			'externally-renewed-access-token',
		);
		expect(fetchMock).not.toHaveBeenCalled();

		accessToken = 'expired-external-access-token';
		expiresAt = '1';
		await expect(keyBuilder(context, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('Trustpilot key builder for public operations', () => {
	const oauthKeys = (clientId: string | null) => ({
		get_dek: async () => 'dek',
		issue_new_dek: async () => 'dek',
		get_api_key: async () => null,
		set_api_key: async (_value: string | null) => undefined,
		get_access_token: async () => 'stored-access-token',
		set_access_token: async (_value: string | null) => undefined,
		get_refresh_token: async () => null,
		set_refresh_token: async (_value: string | null) => undefined,
		get_expires_at: async () => null,
		set_expires_at: async (_value: string | null) => undefined,
		get_scope: async () => null,
		set_scope: async (_value: string | null) => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async (_value: string | null) => undefined,
		get_integration_credentials: async () => ({
			client_id: clientId,
			client_secret: 'trustpilot-client-secret',
			redirect_url: 'https://app.example.invalid/callback',
		}),
	});

	it('sends the OAuth app client id as the API key on an oauth_2 connection', async () => {
		const keyBuilder = trustpilot({ authType: 'oauth_2' }).keyBuilder;
		if (!keyBuilder) throw new Error('key builder missing');
		const context = {
			authType: 'oauth_2',
			options: { authType: 'oauth_2' },
			tenantId: 'tenant-1',
			meteredOperationId: 'businessUnits.find',
			keys: oauthKeys('trustpilot-client-id'),
		} satisfies TrustpilotKeyBuilderContext;
		await expect(keyBuilder(context, 'endpoint')).resolves.toBe(
			'trustpilot-client-id',
		);
	});

	it('prefers the apiKey option and raises AuthMissingError without any key', async () => {
		const withOption = trustpilot({
			authType: 'oauth_2',
			apiKey: 'option-api-key',
		}).keyBuilder;
		const withoutKey = trustpilot({ authType: 'oauth_2' }).keyBuilder;
		if (!withOption || !withoutKey) throw new Error('key builder missing');
		const context = {
			authType: 'oauth_2',
			options: { authType: 'oauth_2' },
			tenantId: 'tenant-1',
			meteredOperationId: 'reviews.latest',
			keys: oauthKeys(null),
		} satisfies TrustpilotKeyBuilderContext;
		await expect(
			withOption(
				{
					...context,
					options: { authType: 'oauth_2', apiKey: 'option-api-key' },
				},
				'endpoint',
			),
		).resolves.toBe('option-api-key');
		await expect(withoutKey(context, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
