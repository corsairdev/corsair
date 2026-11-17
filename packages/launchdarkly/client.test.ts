import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	LAUNCHDARKLY_API_BASE,
	LAUNCHDARKLY_API_VERSION,
	LaunchDarklyAPIError,
	makeLaunchDarklyRequest,
	RATE_LIMIT_CONFIG,
	redactSensitiveFields,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = jest.mocked(request);

describe('LaunchDarkly client', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('sends request with Authorization header and correct base URL', async () => {
		mockedRequest.mockResolvedValueOnce({ items: [] });

		await makeLaunchDarklyRequest('/api/v2/projects', 'test-api-token', {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LAUNCHDARKLY_API_BASE,
			VERSION: '2.0',
			HEADERS: {
				Authorization: 'test-api-token',
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'LD-API-Version': LAUNCHDARKLY_API_VERSION,
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/api/v2/projects',
		});
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	});

	it('makes public unauthenticated request without Authorization header', async () => {
		mockedRequest.mockResolvedValueOnce({ links: {} });

		await makeLaunchDarklyRequest('/api/v2', undefined, {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError when apiKey is explicitly empty', async () => {
		await expect(
			makeLaunchDarklyRequest('/api/v2/projects', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('compactQuery removes undefined query parameters', () => {
		expect(
			compactQuery({
				limit: 10,
				offset: undefined,
				filter: 'key:test',
				kind: ['flag', 'segment'],
			}),
		).toEqual({
			limit: 10,
			filter: 'key:test',
			kind: ['flag', 'segment'],
		});

		expect(compactQuery(undefined)).toBeUndefined();
		expect(compactQuery({ a: undefined, b: undefined })).toBeUndefined();
	});

	it('redacts sensitive fields from request and response in ApiError', async () => {
		const rawApiError = new ApiError(
			{
				method: 'POST',
				url: '/api/v2/tokens',
				headers: { Authorization: 'test-secret' },
				query: { email: 'person@example.com' },
				body: {
					name: 'test-token',
					apiKey: 'secret-token-value',
					password: 'my-password',
					normalField: 'visible-data',
				},
			},
			{
				url: 'https://app.launchdarkly.com/api/v2/tokens',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					message: 'Error',
					code: 'invalid_request',
					token: 'leak-in-error',
				},
			},
			'Request failed with 400',
		);

		mockedRequest.mockRejectedValueOnce(rawApiError);

		// `unknown` because catch receives an untyped rejection that we narrow below.
		let caughtError: unknown;
		try {
			await makeLaunchDarklyRequest('/api/v2/tokens', 'test-key', {
				method: 'POST',
			});
		} catch (e: unknown) {
			// `unknown` because caught error has unknown type until narrowed.
			caughtError = e;
		}

		expect(caughtError).toBeInstanceOf(ApiError);
		if (!(caughtError instanceof ApiError)) {
			throw new Error('Expected sanitized LaunchDarkly ApiError');
		}
		const sanitized = caughtError;
		expect(sanitized.status).toBe(400);
		expect(sanitized.request.url).toBe('/api/v2');
		expect(sanitized.request.query).toBeUndefined();
		expect(sanitized.request.headers?.Authorization).toBe('[REDACTED]');
		expect(sanitized.request.body).toBeUndefined();
		expect(sanitized.body).toEqual({
			code: 'invalid_request',
		});
	});

	it('redactSensitiveFields handles nested objects and arrays', () => {
		const input = {
			clientEmail: 'service@example.com',
			items: [{ secret: 'very-secret', name: 'safe-item' }],
			nested: {
				sessionToken: 'token123',
				safeKey: 42,
			},
			contactEmail: 'person@example.com',
		};

		const sanitized = redactSensitiveFields(input);
		expect(sanitized).toEqual({
			clientEmail: '[REDACTED]',
			items: [{ secret: '[REDACTED]', name: 'safe-item' }],
			nested: {
				sessionToken: '[REDACTED]',
				safeKey: 42,
			},
			contactEmail: '[REDACTED]',
		});
	});

	it('wraps generic non-Error thrown exceptions in LaunchDarklyAPIError', async () => {
		mockedRequest.mockRejectedValueOnce('A non-error string failure');

		await expect(
			makeLaunchDarklyRequest('/api/v2/projects', 'key', { method: 'GET' }),
		).rejects.toThrow(LaunchDarklyAPIError);
	});

	it('executes real transport rateLimitConfig with Retry-After header extraction', async () => {
		const originalFetch = global.fetch;
		const actualHttp = jest.requireActual('corsair/http');
		let fetchCallCount = 0;

		const mockedFetch: typeof fetch = async (_input, _init) => {
			fetchCallCount++;
			return new Response(
				JSON.stringify({ code: 'rate_limited', message: 'Too Many Requests' }),
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				},
			);
		};
		global.fetch = mockedFetch;

		const config: OpenAPIConfig = {
			BASE: LAUNCHDARKLY_API_BASE,
			VERSION: '2.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { 'Content-Type': 'application/json' },
		};

		const requestOptions: ApiRequestOptions = {
			method: 'GET',
			url: '/api/v2/projects',
		};

		// `unknown` because caught error has unknown type until narrowed.
		let caught: unknown;
		try {
			await actualHttp.request(config, requestOptions, {
				rateLimitConfig: RATE_LIMIT_CONFIG,
			});
		} catch (err: unknown) {
			// `unknown` because caught error has unknown type until narrowed.
			caught = err;
		} finally {
			global.fetch = originalFetch;
		}

		expect(fetchCallCount).toBe(1);
		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError)) {
			throw new Error('Expected transport to produce an ApiError');
		}
		const apiErr = caught;
		expect(apiErr.status).toBe(429);
		expect(apiErr.retryAfter).toBe(4000);
	});
});
