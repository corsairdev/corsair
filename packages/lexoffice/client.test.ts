import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	LEXOFFICE_API_BASE,
	LEXOFFICE_NO_TRANSPORT_RETRIES,
	makeLexofficeRequest,
	redactSensitiveData,
	sanitizeApiError,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/profile' },
		{
			url: 'https://api.lexoffice.io/v1/profile',
			ok: false,
			status,
			statusText: message,
			body: { message, status },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeLexofficeRequest', () => {
	it('uses the v1 base URL and Authorization: Bearer header', async () => {
		mockedRequest.mockResolvedValue({ organizationId: 'org-123' });

		await makeLexofficeRequest('/profile', 'test-api-key', {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LEXOFFICE_API_BASE,
			VERSION: '1.0.0',
			HEADERS: {
				Authorization: 'Bearer test-api-key',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/profile' }),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('sends POST body and compacts query parameters', async () => {
		mockedRequest.mockResolvedValue({ id: 'res-1' });

		await makeLexofficeRequest('/contacts', 'test-api-key', {
			method: 'POST',
			body: { version: 0 },
			query: { page: 1, size: undefined },
		});

		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/contacts',
				body: { version: 0 },
				query: { page: 1 },
			}),
		);
	});

	it('omits undefined query values via compactQuery', () => {
		expect(
			compactQuery({
				page: 0,
				size: 25,
				email: undefined,
			}),
		).toEqual({
			page: 0,
			size: 25,
		});
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		await expect(makeLexofficeRequest('/profile', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2000);
		mockedRequest.mockRejectedValue(rateLimited);

		// `unknown` because rejection value has no static type
		const caught = await makeLexofficeRequest('/profile', 'test-api-key').catch(
			(err: unknown) => err,
		);

		expect(caught).toBeInstanceOf(ApiError);
		if (caught instanceof ApiError) {
			expect(caught.status).toBe(429);
			expect(caught.retryAfter).toBe(2000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(caught),
			).resolves.toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 2000,
			});
		}
	});

	it('redacts sensitive fields in sanitizeApiError and redactSensitiveData', () => {
		const sensitiveData = {
			apiKey: 'secret-key-123',
			password: 'my-password',
			nested: {
				token: 'bearer-token',
				regular: 'safe-value',
			},
			list: [{ clientEmail: 'bot@example.com' }, 'text'],
		};

		// `unknown` because redactSensitiveData accepts untyped data structures
		const redacted: unknown = redactSensitiveData(sensitiveData);
		expect(redacted).toEqual({
			apiKey: '[redacted]',
			password: '[redacted]',
			nested: {
				token: '[redacted]',
				regular: 'safe-value',
			},
			list: [{ clientEmail: '[redacted]' }, 'text'],
		});

		const err = new ApiError(
			{
				method: 'POST',
				url: '/contacts',
				body: { apiKey: 'secret', name: 'Acme' },
			},
			{
				url: 'https://api.lexoffice.io/v1/contacts',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { token: 'echoed-token', message: 'invalid' },
			},
			'Bad Request',
		);

		const sanitized = sanitizeApiError(err);
		expect(sanitized.request.body).toEqual({
			apiKey: '[redacted]',
			name: 'Acme',
		});
		expect(sanitized.body).toEqual({
			token: '[redacted]',
			message: 'invalid',
		});
	});

	it('preserves retryAfter from HTTP response in real transport', async () => {
		const actualHttp = jest.requireActual<{
			request: typeof request;
		}>('corsair/http');
		const originalFetch = global.fetch;

		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({ 'retry-after': '3' }),
			json: async () => ({ message: 'Rate limit exceeded' }),
			text: async () => JSON.stringify({ message: 'Rate limit exceeded' }),
		});
		global.fetch = mockFetch;

		try {
			// `unknown` because caught error has untyped rejection
			let caughtError: unknown;
			try {
				await actualHttp.request(
					{
						BASE: 'https://api.lexoffice.io/v1',
						VERSION: '1.0.0',
						HEADERS: {},
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
					},
					{ method: 'GET', url: '/profile' },
					{ rateLimitConfig: LEXOFFICE_NO_TRANSPORT_RETRIES },
				);
			} catch (err: unknown) {
				// `unknown` because catch variable has no static type
				caughtError = err;
			}

			expect(caughtError).toBeInstanceOf(ApiError);
			expect(mockFetch).toHaveBeenCalledTimes(1);
			if (caughtError instanceof ApiError) {
				expect(caughtError.status).toBe(429);
				expect(caughtError.retryAfter).toBe(3000);
			}
		} finally {
			global.fetch = originalFetch;
		}
	});
});
