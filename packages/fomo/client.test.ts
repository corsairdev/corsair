import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FOMO_API_BASE,
	FomoAPIError,
	makeFomoRequest,
	redactMessage,
	redactValue,
} from './client';
import { errorHandlers } from './error-handlers';
import { fomo } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
	// `unknown` because error response bodies can contain arbitrary JSON fields.
	body?: Record<string, unknown>,
	// `unknown` because request bodies can contain arbitrary JSON fields.
	requestBody?: Record<string, unknown>,
) {
	return new ApiError(
		{ method: 'POST', url: '/applications/me/events', body: requestBody },
		{
			url: 'https://api.fomo.com/api/v1/applications/me/events',
			ok: false,
			status,
			statusText: message,
			body: body ?? {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeFomoRequest client', () => {
	it('sends Authorization: Token <token> and correct base URL', async () => {
		mockRequest.mockResolvedValue({ id: 1 });

		await makeFomoRequest('/applications/me/events', 'my-auth-token', {
			method: 'POST',
			body: { title: 'Test Event' },
			query: { version: '1' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: FOMO_API_BASE,
			HEADERS: {
				Authorization: 'Token my-auth-token',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/applications/me/events',
				body: { title: 'Test Event' },
				query: { version: '1' },
			}),
		);
	});

	it('makes unauthenticated requests without Authorization header when key is undefined', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeFomoRequest('/status', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError when key is explicitly empty string without sending request', async () => {
		// `unknown` because caught rejection value has no static type before runtime assertion.
		const error = await makeFomoRequest('/applications/me/events', '', {
			method: 'GET',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows 429 ApiError preserving retryAfter and status', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3500);
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because caught rejection value has no static type before runtime assertion.
		const error = await makeFomoRequest('/applications/me/events', 'token', {
			method: 'GET',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(3500);
		}
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);

		// Error handler returns 0 retries because corsair/http transport owns rate-limit retries
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('redacts credentials from error body, message, and request payloads', async () => {
		const errorWithSecrets = apiError(
			400,
			'Bad Request with apiKey=secret_123 and Token token_abc',
			undefined,
			{
				error: 'Invalid',
				api_key: 'super-secret-key-123',
				token: 'sensitive-token-abc',
				client_secret: 'secret-xyz',
			},
			{
				auth_token: 'leak-token',
				normal_field: 'safe',
			},
		);
		mockRequest.mockRejectedValue(errorWithSecrets);

		// `unknown` because caught rejection value has no static type before runtime assertion.
		const caught = await makeFomoRequest(
			'/applications/me/events',
			'my-token',
			{
				method: 'POST',
			},
		).catch((e: unknown) => e);

		expect(caught).toBeInstanceOf(ApiError);
		if (caught instanceof ApiError) {
			expect(caught.message).toContain('[REDACTED]');
			expect(caught.message).not.toContain('secret_123');
			expect(caught.message).not.toContain('token_abc');
			// `unknown` because body property is an untyped JSON record on ApiError.
			const bodyRecord = caught.body as Record<string, unknown>;
			expect(bodyRecord.api_key).toBe('[REDACTED]');
			expect(bodyRecord.token).toBe('[REDACTED]');
			expect(bodyRecord.client_secret).toBe('[REDACTED]');
			// `unknown` because request body property is untyped JSON on ApiRequestOptions.
			const reqRecord = caught.request.body as Record<string, unknown>;
			expect(reqRecord.auth_token).toBe('[REDACTED]');
			expect(reqRecord.normal_field).toBe('safe');
		}
	});

	it('redactValue handles primitives, arrays, and nested structures', () => {
		expect(redactValue(null)).toBeNull();
		expect(redactValue('simple string')).toBe('simple string');
		expect(redactValue(12345)).toBe(12345);

		const nested = {
			user: {
				name: 'John',
				apiKey: '12345678',
				password: 'secretpassword',
			},
			list: [{ token: 'abc' }, { label: 'public' }],
		};

		// `unknown` because redactValue accepts arbitrary untrusted JSON values.
		const redacted = redactValue(nested);
		expect(redacted).toBeDefined();
		if (typeof redacted === 'object' && redacted !== null) {
			// `unknown` because properties of untyped record are untrusted JSON values.
			const record = redacted as Record<string, unknown>;
			// `unknown` because user field is an arbitrary nested object.
			const user = record.user as Record<string, unknown>;
			expect(user.apiKey).toBe('[REDACTED]');
			expect(user.password).toBe('[REDACTED]');
			expect(user.name).toBe('John');
		}
	});

	it('redactMessage redacts bearer tokens, query credentials, and specific keys', () => {
		expect(
			redactMessage('Failed with Token abcd-1234-xyz and secret', 'secret'),
		).toBe('Failed with Token [REDACTED] and [REDACTED]');
		expect(
			redactMessage(
				'Error accessing https://api.fomo.com?api_key=secret-key&page=1',
			),
		).toBe('Error accessing https://api.fomo.com?api_key=[REDACTED]&page=1');
	});

	it('wraps non-ApiError in Error with redacted message', async () => {
		mockRequest.mockRejectedValue(new Error('Network offline with my-token'));

		// `unknown` because caught rejection value has no static type before runtime assertion.
		const caught = await makeFomoRequest(
			'/applications/me/events',
			'my-token',
		).catch((e: unknown) => e);

		expect(caught).toBeInstanceOf(Error);
		if (caught instanceof Error) {
			expect(caught.message).toBe('Network offline with [REDACTED]');
		}
	});

	it('wraps non-Error throwables in FomoAPIError', async () => {
		mockRequest.mockRejectedValue('string rejection');

		// `unknown` because caught rejection value has no static type before runtime assertion.
		const caught = await makeFomoRequest(
			'/applications/me/events',
			'token',
		).catch((e: unknown) => e);

		expect(caught).toBeInstanceOf(FomoAPIError);
		if (caught instanceof FomoAPIError) {
			expect(caught.message).toBe('Unknown error');
		}
	});

	it('real-transport extracts Retry-After from 429 and does not loop', async () => {
		const originalFetch = global.fetch;
		const mockFetch = jest.fn().mockImplementation(() =>
			Promise.resolve(
				new Response(JSON.stringify({ error: 'rate_limited' }), {
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'retry-after': '4',
						'content-type': 'application/json',
					},
				}),
			),
		);
		global.fetch = mockFetch;

		// `unknown` because jest.requireActual returns untyped module exports.
		const actualHttp = jest.requireActual('corsair/http') as {
			request: typeof request;
		};

		// `unknown` because caught rejection value has no static type before runtime assertion.
		const caught = await actualHttp
			.request(
				{
					BASE: FOMO_API_BASE,
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					HEADERS: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				},
				{
					method: 'GET',
					url: '/applications/me/events',
				},
			)
			.catch((e: unknown) => e);

		global.fetch = originalFetch;

		// Default transport config retries 3 times for 429 errors (1 initial + 3 retries = 4 calls)
		expect(mockFetch).toHaveBeenCalledTimes(4);
		expect(caught).toBeInstanceOf(ApiError);
		if (caught instanceof ApiError) {
			expect(caught.status).toBe(429);
			expect(caught.retryAfter).toBe(4000);
		}
	});
});

describe('keyBuilder', () => {
	it('returns configured options.key', async () => {
		const plugin = fomo({ key: 'configured-key' });
		expect(plugin.keyBuilder).toBeDefined();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		// `unknown` because ctx mock satisfies keyBuilder context requirements.
		const ctx = {
			keys: {
				get_api_key: async () => 'keys-service-key',
				get_dek: async () => 'dek',
				issue_new_dek: async () => 'dek',
				set_api_key: async () => {},
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => {},
			},
		};
		// `unknown` because ctx satisfies FomoKeyBuilderContext at runtime.
		const key = await plugin.keyBuilder(ctx as never, 'endpoint');
		expect(key).toBe('configured-key');
	});

	it('throws AuthMissingError when options.key is empty string', async () => {
		const plugin = fomo({ key: '' });
		expect(plugin.keyBuilder).toBeDefined();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		const ctx = {
			keys: {
				get_api_key: async () => 'keys-service-key',
				get_dek: async () => 'dek',
				issue_new_dek: async () => 'dek',
				set_api_key: async () => {},
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => {},
			},
		};
		await expect(
			plugin.keyBuilder(ctx as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns key from ctx.keys when options.key is not provided', async () => {
		const plugin = fomo({});
		expect(plugin.keyBuilder).toBeDefined();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		const ctx = {
			keys: {
				get_api_key: async () => 'keys-service-key',
				get_dek: async () => 'dek',
				issue_new_dek: async () => 'dek',
				set_api_key: async () => {},
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => {},
			},
		};
		const key = await plugin.keyBuilder(ctx as never, 'endpoint');
		expect(key).toBe('keys-service-key');
	});

	it('throws AuthMissingError when ctx.keys is missing or returns empty string', async () => {
		const plugin = fomo({});
		expect(plugin.keyBuilder).toBeDefined();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		const ctxWithoutKeys = {};
		await expect(
			plugin.keyBuilder(ctxWithoutKeys as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);

		const ctxWithEmptyKey = {
			keys: {
				get_api_key: async () => '',
				get_dek: async () => 'dek',
				issue_new_dek: async () => 'dek',
				set_api_key: async () => {},
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => {},
			},
		};
		await expect(
			plugin.keyBuilder(ctxWithEmptyKey as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns empty string for non-endpoint sources', async () => {
		const plugin = fomo({ key: 'configured-key' });
		expect(plugin.keyBuilder).toBeDefined();
		if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
		const ctx = {};
		const key = await plugin.keyBuilder(ctx as never, 'webhook');
		expect(key).toBe('');
	});
});
