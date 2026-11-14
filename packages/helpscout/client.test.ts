import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	HELPSCOUT_API_BASE,
	HelpScoutAPIError,
	makeHelpscoutRequest,
	redactApiErrorInPlace,
} from './client';
import type { HelpScoutEndpointOutputs } from './endpoints/types';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function buildApiError(
	status: number,
	message: string,
	retryAfter?: number,
	// `unknown` because requestPayload can model arbitrary test payloads.
	requestPayload?: Record<string, unknown>,
	// `unknown` because errorBody can take any provider JSON error shape.
	errorBody?: unknown,
): ApiError {
	return new ApiError(
		{
			method: 'POST',
			url: '/conversations',
			headers: {
				Authorization: 'Bearer secret-api-key-12345',
				'Content-Type': 'application/json',
			},
			body: requestPayload ?? {
				subject: 'Test',
				apiKey: 'secret-api-key-12345',
				password: 'secret-password',
			},
		},
		{
			url: 'https://api.helpscout.net/v2/conversations',
			ok: false,
			status,
			statusText: message,
			body: errorBody ?? {
				error: 'invalid_request',
				message: 'Bad key secret-api-key-12345',
			},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Help Scout Client & Transport', () => {
	describe('makeHelpscoutRequest', () => {
		it('sends Authorization: Bearer <apiKey> header with base URL and config', async () => {
			mockRequest.mockResolvedValueOnce({ id: 101 });

			await makeHelpscoutRequest('/mailboxes', 'my-helpscout-key', {
				method: 'GET',
				query: { page: 1 },
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
				BASE: HELPSCOUT_API_BASE,
				HEADERS: {
					Authorization: 'Bearer my-helpscout-key',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			});
			expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
				method: 'GET',
				url: '/mailboxes',
				query: { page: 1 },
			});
		});

		it('makes keyless requests without Authorization header when apiKey is undefined', async () => {
			mockRequest.mockResolvedValueOnce({});

			await makeHelpscoutRequest('/status', undefined, {
				method: 'GET',
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
				'Authorization',
			);
		});

		it('fails fast on an explicitly empty key by throwing AuthMissingError without calling transport', async () => {
			await expect(
				makeHelpscoutRequest('/mailboxes', '   ', { method: 'GET' }),
			).rejects.toThrow(AuthMissingError);

			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('parses string response as JSON when server returns string payload', async () => {
			mockRequest.mockResolvedValueOnce(
				JSON.stringify({ _embedded: { mailboxes: [] } }),
			);

			const result = await makeHelpscoutRequest<
				HelpScoutEndpointOutputs['mailboxes.list']
			>('/mailboxes', 'valid-key', { method: 'GET' });

			expect(result).toEqual({ _embedded: { mailboxes: [] } });
		});

		it('wraps non-ApiError non-Error failures in HelpScoutAPIError', async () => {
			mockRequest.mockRejectedValueOnce('raw-string-failure');

			// `unknown` because caught rejection value has no static type.
			const err: unknown = await makeHelpscoutRequest(
				'/mailboxes',
				'valid-key',
				{
					method: 'GET',
				},
			).catch((e: unknown) => e);

			expect(err).toBeInstanceOf(HelpScoutAPIError);
			expect((err as HelpScoutAPIError).message).toBe(
				'Unknown Help Scout error',
			);
		});
	});

	describe('Credential Redaction In-Place', () => {
		it('redacts credentials in-place without replacing ApiError instance', async () => {
			const apiKey = 'secret-api-key-12345';
			const rawError = buildApiError(
				400,
				'Error with secret-api-key-12345 and Bearer secret-api-key-12345',
				undefined,
				{
					token: 'super-secret-token',
					clientSecret: 'shhh',
					normalField: 'safe-value',
				},
				{
					echoedKey: apiKey,
					nested: {
						authPassword: 'hidden-password',
					},
				},
			);

			mockRequest.mockRejectedValueOnce(rawError);

			// `unknown` because caught rejection value has no static type until checked.
			const caught: unknown = await makeHelpscoutRequest(
				'/conversations',
				apiKey,
				{
					method: 'POST',
				},
			).catch((e: unknown) => e);

			// Identity preserved: exact same ApiError instance
			expect(caught).toBe(rawError);
			expect(caught instanceof ApiError).toBe(true);

			const err = caught as ApiError;
			expect(err.status).toBe(400);

			// Message redacted
			expect(err.message).not.toContain(apiKey);
			expect(err.message).toContain('[redacted]');

			// Headers redacted
			expect(err.request?.headers?.Authorization).toBe('[redacted]');

			// `unknown` because request body is parsed as dynamic JSON in tests.
			const reqBody = err.request?.body as Record<string, unknown>;
			expect(reqBody.token).toBe('[redacted]');
			expect(reqBody.clientSecret).toBe('[redacted]');
			expect(reqBody.normalField).toBe('safe-value');

			// `unknown` because response body is parsed as dynamic JSON in tests.
			const resBody = err.body as Record<string, unknown>;
			expect(resBody.echoedKey).toBe('[redacted]');
			// `unknown` because nested properties are dynamic untyped objects.
			const nestedRes = resBody.nested as Record<string, unknown>;
			expect(nestedRes.authPassword).toBe('[redacted]');
		});

		it('redactApiErrorInPlace safely handles errors without request or body', () => {
			const minimalError = new ApiError(
				{ method: 'GET', url: '/test' },
				{
					url: 'https://api.helpscout.net/v2/test',
					ok: false,
					status: 500,
					statusText: 'Server Error',
					body: undefined,
				},
				'Failed request secret123',
			);

			redactApiErrorInPlace(minimalError, 'secret123');
			expect(minimalError.message).toBe('Failed request [redacted]');
			expect(minimalError.status).toBe(500);
		});
	});

	describe('Real Transport Rate-Limit Test', () => {
		it('preserves status and parses retryAfter using real transport against HTTP 429', async () => {
			// `jest.requireActual` tests the genuine corsair/http transport
			const { request: actualRequest } = jest.requireActual<{
				request: typeof request;
			}>('corsair/http');

			const originalFetch = global.fetch;
			const mockFetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				headers: new Headers({
					'Retry-After': '4',
					'Content-Type': 'application/json',
				}),
				json: () =>
					Promise.resolve({
						error: 'rate_limited',
						message: 'Too many requests',
					}),
			});

			global.fetch = mockFetch;

			try {
				const config = {
					BASE: 'https://api.helpscout.net/v2',
					VERSION: '2.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit' as const,
					HEADERS: {
						'Content-Type': 'application/json',
					},
				};

				// Single-owner rate limiting transport configuration
				const RATE_LIMIT_CONFIG = {
					enabled: true,
					maxRetries: 0,
					initialRetryDelay: 0,
					backoffMultiplier: 1,
					headerNames: { retryAfter: 'retry-after' },
				};

				// `unknown` because rejection from actualRequest has no static type.
				const caught: unknown = await actualRequest(
					config,
					{ method: 'GET', url: '/mailboxes' },
					{ rateLimitConfig: RATE_LIMIT_CONFIG },
				).catch((e: unknown) => e);

				expect(caught).toBeInstanceOf(ApiError);
				const apiErr = caught as ApiError;
				expect(apiErr.status).toBe(429);
				expect(apiErr.retryAfter).toBe(4000);
				expect(mockFetch).toHaveBeenCalledTimes(1);
			} finally {
				global.fetch = originalFetch;
			}
		});
	});
});
