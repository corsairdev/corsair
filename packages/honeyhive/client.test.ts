import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	HONEYHIVE_API_BASE,
	HoneyHiveAPIError,
	makeHoneyHiveRequest,
	redactApiErrorInPlace,
	redactSensitiveData,
} from './client';

jest.mock('corsair/http', () => {
	// `unknown` because jest.requireActual returns an untyped module object.
	const actual = jest.requireActual('corsair/http') as Record<string, unknown>;
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function makeApiError(
	status: number,
	message: string,
	body?: Record<string, unknown>,
	requestBody?: Record<string, unknown>,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{
			method: 'POST',
			url: '/v1/events',
			// `unknown` because ApiRequestOptions.body accepts arbitrary serializable payload.
			body: requestBody as unknown,
		},
		{
			url: 'https://api.honeyhive.ai/v1/events',
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

describe('makeHoneyHiveRequest', () => {
	it('sends Authorization: Bearer <apiKey> and default baseUrl', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const result = await makeHoneyHiveRequest<{ success: boolean }>(
			'/v1/events',
			'test-api-key-123',
			{
				method: 'POST',
				body: { event_name: 'test-event' },
			},
		);

		expect(result).toEqual({ success: true });
		expect(mockRequest).toHaveBeenCalledTimes(1);

		const [config, reqOptions] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: HONEYHIVE_API_BASE,
			HEADERS: expect.objectContaining({
				Authorization: 'Bearer test-api-key-123',
				'Content-Type': 'application/json',
			}),
		});
		expect(reqOptions).toMatchObject({
			method: 'POST',
			url: '/v1/events',
			body: { event_name: 'test-event' },
		});
	});

	it('allows overriding the baseUrl and timeout', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await makeHoneyHiveRequest('/v1/sessions', 'test-key', {
			baseUrl: 'https://staging.api.honeyhive.ai',
			timeout: 5000,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.BASE).toBe('https://staging.api.honeyhive.ai');
		expect(config?.TIMEOUT).toBe(5000);
	});

	it('makes unauthenticated requests without Authorization header when key is undefined', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeHoneyHiveRequest('/v1/status', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('throws AuthMissingError when key is explicitly an empty string', async () => {
		await expect(
			makeHoneyHiveRequest('/v1/events', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('serializes query parameters properly', async () => {
		mockRequest.mockResolvedValue({ events: [] });

		await makeHoneyHiveRequest('/v1/events', 'test-key', {
			method: 'GET',
			query: { project_id: 'proj-123', limit: 20 },
		});

		const [, reqOptions] = mockRequest.mock.calls[0] ?? [];
		expect(reqOptions?.query).toEqual({
			project_id: 'proj-123',
			limit: 20,
		});
		expect(reqOptions?.body).toBeUndefined();
	});

	it('wraps non-ApiError into HoneyHiveAPIError', async () => {
		// `unknown` because non-standard error throwing simulates arbitrary runtime failures.
		mockRequest.mockRejectedValue('network dropped');

		// `unknown` because caught rejection values have no static type before runtime assertions.
		const caught: unknown = await makeHoneyHiveRequest(
			'/v1/events',
			'test-key',
		).catch(
			// `unknown` because rejection parameter has no static type.
			(e: unknown) => e,
		);

		expect(caught).toBeInstanceOf(HoneyHiveAPIError);
		expect((caught as HoneyHiveAPIError).message).toBe('Unknown error');
	});
});

describe('Credential and secret redaction', () => {
	it('redacts sensitive keys recursively from payload objects', () => {
		const payload = {
			project_id: 'proj-1',
			apiKey: 'secret-key-value',
			auth: {
				authorization: 'Bearer super-secret',
				nested: {
					password: 'my-password',
					normal: 'safe-value',
				},
			},
			list: [{ token: 'jwt-token' }, { name: 'item' }],
		};

		const sanitized = redactSensitiveData(payload, 'secret-key-value');
		expect(sanitized).toEqual({
			project_id: 'proj-1',
			apiKey: '[REDACTED]',
			auth: {
				authorization: '[REDACTED]',
				nested: {
					password: '[REDACTED]',
					normal: 'safe-value',
				},
			},
			list: [{ token: '[REDACTED]' }, { name: 'item' }],
		});
	});

	it('redacts apiKey string occurrences from arbitrary values', () => {
		const raw = 'Request failed for apiKey secret-12345 in URL';
		const sanitized = redactSensitiveData(raw, 'secret-12345');
		expect(sanitized).toBe('Request failed for apiKey [REDACTED] in URL');
	});

	it('redacts ApiError in place without replacing the instance', () => {
		const error = makeApiError(
			401,
			'Invalid key: hh-secret-token',
			{ error: 'Unauthorized', token: 'hh-secret-token' },
			{ apiKey: 'hh-secret-token', safeField: 'test' },
		);

		const result = redactApiErrorInPlace(error, 'hh-secret-token');

		// Must preserve referential equality and class prototype
		expect(result).toBe(error);
		expect(result).toBeInstanceOf(ApiError);
		expect(result.message).toBe('Invalid key: [REDACTED]');
		expect(result.body).toEqual({
			error: 'Unauthorized',
			token: '[REDACTED]',
		});
		expect(result.request?.body).toEqual({
			apiKey: '[REDACTED]',
			safeField: 'test',
		});
	});

	it('redacts ApiError when request or body is undefined', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/test' },
			{ url: '/test', ok: false, status: 500, statusText: 'Error', body: {} },
			'Error with secret-key-xyz',
		);

		const result = redactApiErrorInPlace(error, 'secret-key-xyz');
		expect(result).toBe(error);
		expect(result.message).toBe('Error with [REDACTED]');
	});
});

describe('Transport rate limit handling', () => {
	it('preserves 429 status and retryAfter on propagated ApiError', async () => {
		const rateLimitError = makeApiError(429, 'Too Many Requests', {}, {}, 3500);
		mockRequest.mockRejectedValue(rateLimitError);

		// `unknown` because a caught rejection value has no static type.
		const error: unknown = await makeHoneyHiveRequest(
			'/v1/events',
			'test-key',
		).catch(
			// `unknown` because rejection parameter has no static type.
			(e: unknown) => e,
		);

		expect(error).toBe(rateLimitError);
		expect((error as ApiError).status).toBe(429);
		expect((error as ApiError).retryAfter).toBe(3500);
	});

	it('verifies real corsair/http transport extracts 429 Retry-After correctly', async () => {
		// `unknown` because jest.requireActual returns an untyped module object.
		const actualHttp = jest.requireActual('corsair/http') as {
			request: <T>(config: OpenAPIConfig, options: unknown) => Promise<T>;
		};

		const originalFetch = global.fetch;
		try {
			// `unknown` because the mock fetch function substitutes global.fetch with minimal mock response.
			global.fetch = jest.fn().mockImplementation(async () => {
				return {
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					url: 'https://api.honeyhive.ai/v1/events',
					headers: new Headers({
						'Content-Type': 'application/json',
						'retry-after': '4',
					}),
					json: async () => ({ error: 'rate_limit' }),
					text: async () => JSON.stringify({ error: 'rate_limit' }),
				};
			}) as unknown as typeof global.fetch;

			const config: OpenAPIConfig = {
				BASE: 'https://api.honeyhive.ai',
				VERSION: '1.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				HEADERS: {},
				TIMEOUT: 5000,
			};

			// `unknown` because caught error has no static type before assertions.
			const error: unknown = await actualHttp
				.request(config, {
					method: 'GET',
					url: '/v1/events',
				})
				// `unknown` because rejection parameter has no static type.
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(429);
			// 4 seconds Retry-After parsed into 4000ms
			expect((error as ApiError).retryAfter).toBe(4000);
		} finally {
			global.fetch = originalFetch;
		}
	});
});
