import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	HYPERBROWSER_API_BASE,
	makeHyperbrowserRequest,
	RATE_LIMIT_CONFIG,
	redactApiErrorInPlace,
	redactCredentials,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	// `unknown` because requireActual returns an untyped module record before type-casting.
	const actual = jest.requireActual('corsair/http') as Record<string, unknown>;
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
	body: Record<string, unknown> = {},
	requestBody?: Record<string, unknown>,
) {
	return new ApiError(
		{ method: 'POST', url: '/api/session', body: requestBody },
		{
			url: 'https://api.hyperbrowser.ai/api/session',
			ok: false,
			status,
			statusText: message,
			body,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeHyperbrowserRequest', () => {
	it('sends x-api-key header and correct request options', async () => {
		mockRequest.mockResolvedValue({ id: 'sess_123' });

		await makeHyperbrowserRequest('/api/session', 'hb_test_key_123', {
			method: 'POST',
			body: { useStealth: true },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: HYPERBROWSER_API_BASE,
			HEADERS: {
				'x-api-key': 'hb_test_key_123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/api/session',
				body: { useStealth: true },
			}),
		);
	});

	it('makes unauthenticated requests without x-api-key header', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeHyperbrowserRequest('/api/status', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: HYPERBROWSER_API_BASE,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'x-api-key',
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		await expect(
			makeHyperbrowserRequest('/api/session', '', { method: 'POST' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError with status and retryAfter preserved and credentials redacted', async () => {
		const rawError = apiError(
			429,
			'Rate limit exceeded for key hb_secret_123',
			5000,
			{
				error: 'Quota exceeded for key hb_secret_123',
				apiKey: 'hb_secret_123',
			},
			{ proxyServerPassword: 'super_secret_password' },
		);
		mockRequest.mockRejectedValue(rawError);

		// `unknown` because rejection values have no static type; assertions below verify it.
		const thrown = await makeHyperbrowserRequest(
			'/api/session',
			'hb_secret_123',
			{
				method: 'POST',
			},
		).catch((err: unknown) => err);

		expect(thrown).toBe(rawError);
		expect(thrown).toBeInstanceOf(ApiError);
		expect(rawError.status).toBe(429);
		expect(rawError.retryAfter).toBe(5000);
		expect(rawError.message).not.toContain('hb_secret_123');
		expect(rawError.message).toContain('[redacted]');
		expect(rawError.body).toEqual({
			error: 'Quota exceeded for key [redacted]',
			apiKey: '[redacted]',
		});
		expect(rawError.request.body).toEqual({
			proxyServerPassword: '[redacted]',
		});
	});
});

describe('redaction helpers', () => {
	it('redacts sensitive fields and matching api key string', () => {
		const payload = {
			name: 'Session',
			apiKey: 'secret_key_val',
			nested: {
				proxyServerPassword: 'pass',
				token: 'tok',
				notes: 'Contains secret_key_val in text',
			},
			array: ['secret_key_val', 'safe_item'],
		};

		// `unknown` because payload can be any arbitrary data structure.
		const result: unknown = redactCredentials(payload, 'secret_key_val');
		expect(result).toEqual({
			name: 'Session',
			apiKey: '[redacted]',
			nested: {
				proxyServerPassword: '[redacted]',
				token: '[redacted]',
				notes: 'Contains [redacted] in text',
			},
			array: ['[redacted]', 'safe_item'],
		});
	});

	it('redacts in-place on ApiError without replacing the instance', () => {
		const error = apiError(
			401,
			'Invalid key secret_abc',
			undefined,
			{ message: 'Key secret_abc is unauthorized' },
			{ token: 'secret_abc' },
		);

		const returned = redactApiErrorInPlace(error, 'secret_abc');
		expect(returned).toBe(error);
		expect(error.message).toBe('Invalid key [redacted]');
		expect(error.body).toEqual({ message: 'Key [redacted] is unauthorized' });
		expect(error.request.body).toEqual({ token: '[redacted]' });
	});

	it('redacts proxyServerPassword and sensitive fields from error.message when echoed in transport errors', () => {
		const error = apiError(
			422,
			'Validation failed for {"proxyServerPassword":"super_secret_proxy_pass","url":"https://example.com"}',
			undefined,
			{ error: 'Unprocessable Entity' },
			{ proxyServerPassword: 'super_secret_proxy_pass' },
		);

		redactApiErrorInPlace(error, 'some_api_key');
		expect(error.message).not.toContain('super_secret_proxy_pass');
		expect(error.message).toContain('[redacted]');
		expect(error.request.body).toEqual({ proxyServerPassword: '[redacted]' });
	});
});

describe('real-transport rate-limiting with Retry-After', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('parses Retry-After from 429 response using real transport', async () => {
		// Use real request function from corsair/http
		// `unknown` because requireActual returns untyped module exports.
		const actualHttp = jest.requireActual('corsair/http') as {
			request: typeof request;
		};

		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Retry-After': '4',
			}),
			json: async () => ({ error: 'rate limited' }),
			text: async () => JSON.stringify({ error: 'rate limited' }),
		});

		// `unknown` because a rejected promise value has no static type in TypeScript.
		const caughtError = await actualHttp
			.request(
				{
					BASE: 'https://api.hyperbrowser.ai',
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					HEADERS: {},
				},
				{
					method: 'GET',
					url: '/api/sessions',
				},
				{
					rateLimitConfig: RATE_LIMIT_CONFIG,
				},
			)
			.catch((err: unknown) => err);

		expect(caughtError).toBeInstanceOf(ApiError);
		const err = caughtError as ApiError;
		expect(err.status).toBe(429);
		expect(err.retryAfter).toBe(4000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(err)).resolves.toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 4000,
			retryStrategy: 'exponential_backoff',
		});
	});
});
