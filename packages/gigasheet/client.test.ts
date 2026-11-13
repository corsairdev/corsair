import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	GIGASHEET_API_BASE,
	GigasheetAPIError,
	makeGigasheetRequest,
	redactSensitiveData,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function createApiError(
	status: number,
	message: string,
	options: {
		retryAfter?: number;
		// `unknown` because response bodies on errors can be untyped JSON structures.
		body?: unknown;
		// `unknown` because request bodies can contain arbitrary request payloads.
		requestBody?: unknown;
	} = {},
) {
	return new ApiError(
		{
			method: 'POST',
			url: '/upload/url',
			body: options.requestBody as Record<string, unknown> | undefined,
		},
		{
			url: 'https://api.gigasheet.com/upload/url',
			ok: false,
			status,
			statusText: message,
			body: options.body,
		},
		message,
		options.retryAfter === undefined
			? undefined
			: { retryAfter: options.retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeGigasheetRequest', () => {
	it('sends X-GIGASHEET-TOKEN header and targets base URL', async () => {
		mockRequest.mockResolvedValue({ username: 'testuser', authenticated: true });

		const res = await makeGigasheetRequest<{ username: string }>(
			'/user/whoami',
			'test-key-123',
			{
				method: 'GET',
			},
		);

		expect(res).toEqual({ username: 'testuser', authenticated: true });
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: GIGASHEET_API_BASE,
			HEADERS: {
				'X-GIGASHEET-TOKEN': 'test-key-123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/user/whoami',
		});
	});

	it('makes unauthenticated requests without X-GIGASHEET-TOKEN when key is undefined', async () => {
		mockRequest.mockResolvedValue({ username: '', authenticated: false });

		await makeGigasheetRequest('/user/whoami', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'X-GIGASHEET-TOKEN',
		);
	});

	it('throws AuthMissingError for an explicitly empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ Success: true });

		// `unknown` because a rejection error has no static type until asserted below.
		const error = await makeGigasheetRequest('/user/details', '', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError with retryAfter intact and redacts credentials from payload and error body', async () => {
		const rateLimited = createApiError(429, 'Too Many Requests', {
			retryAfter: 4000,
			body: {
				apiKey: 'secret_key_12345',
				token: 'secret_token_abc',
				message: 'Rate limit exceeded',
			},
			requestBody: {
				apiKey: 'secret_key_12345',
				url: 'https://example.com/data.csv',
			},
		});
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because caught error has no static type until checked.
		const error = await makeGigasheetRequest(
			'/upload/url',
			'test-key',
			{
				method: 'POST',
				body: { apiKey: 'secret_key_12345' },
			},
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		const apiErr = error as ApiError;
		expect(apiErr.status).toBe(429);
		expect(apiErr.retryAfter).toBe(4000);
		expect(apiErr.body).toEqual({
			apiKey: '[REDACTED]',
			token: '[REDACTED]',
			message: 'Rate limit exceeded',
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiErr)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('wraps unknown non-Error rejection values into GigasheetAPIError', async () => {
		mockRequest.mockRejectedValue('network socket hangup');

		// `unknown` because caught rejection has unknown type.
		const error = await makeGigasheetRequest('/user/whoami', 'test-key', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(GigasheetAPIError);
		expect((error as GigasheetAPIError).message).toBe(
			'Unknown error occurred',
		);
	});
});

describe('redactSensitiveData', () => {
	it('redacts sensitive fields recursively and ignores case and separators', () => {
		const sensitiveInput = {
			apiKey: 'key_123',
			X_GIGASHEET_TOKEN: 'token_xyz',
			Authorization: 'Bearer secret',
			clientEmail: 'bot@example.com',
			nested: {
				password: 'supersecretpassword',
				normalField: 'safeValue',
				tokenList: [{ token: 'abc' }, { safe: 42 }],
			},
		};

		const redacted = redactSensitiveData(sensitiveInput);

		expect(redacted).toEqual({
			apiKey: '[REDACTED]',
			X_GIGASHEET_TOKEN: '[REDACTED]',
			Authorization: '[REDACTED]',
			clientEmail: '[REDACTED]',
			nested: {
				password: '[REDACTED]',
				normalField: 'safeValue',
				tokenList: [{ token: '[REDACTED]' }, { safe: 42 }],
			},
		});
	});

	it('preserves primitives and nullish values', () => {
		expect(redactSensitiveData(null)).toBeNull();
		expect(redactSensitiveData(undefined)).toBeUndefined();
		expect(redactSensitiveData('hello')).toBe('hello');
		expect(redactSensitiveData(1234)).toBe(1234);
	});
});

describe('real transport Retry-After handling', () => {
	it('retries once with real corsair/http transport when 429 Retry-After is received', async () => {
		const originalFetch = global.fetch;
		const actualHttp = jest.requireActual('corsair/http');

		const mockFetch = jest
			.fn()
			.mockResolvedValueOnce({
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				headers: new Headers({
					'content-type': 'application/json',
					'retry-after': '0',
				}),
				json: async () => ({ Success: false, Message: 'Rate limit' }),
				text: async () =>
					JSON.stringify({ Success: false, Message: 'Rate limit' }),
			})
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: new Headers({
					'content-type': 'application/json',
				}),
				json: async () => ({
					username: 'testuser',
					authenticated: true,
				}),
				text: async () =>
					JSON.stringify({
						username: 'testuser',
						authenticated: true,
					}),
			});
		global.fetch = mockFetch;

		const config: OpenAPIConfig = {
			BASE: GIGASHEET_API_BASE,
			VERSION: '1.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { 'Content-Type': 'application/json' },
		};
		const requestOptions: ApiRequestOptions = {
			method: 'GET',
			url: '/user/whoami',
		};

		try {
			// `unknown` because real transport response is typed as Promise<unknown>.
			const result: unknown = await actualHttp.request(
				config,
				requestOptions,
			);
			expect(result).toEqual({ username: 'testuser', authenticated: true });
			expect(mockFetch).toHaveBeenCalledTimes(2);
		} finally {
			global.fetch = originalFetch;
		}
	});
});
