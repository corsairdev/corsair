import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FOLK_API_BASE,
	FolkAPIError,
	makeFolkRequest,
	redactSensitiveData,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function makeApiError(
	status: number,
	message: string,
	// `unknown` because HTTP response bodies can carry arbitrary JSON error payloads.
	body: unknown = {},
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'GET', url: '/people' },
		{
			url: 'https://api.folk.app/v1/people',
			ok: false,
			status,
			statusText: message,
			body,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('client.ts', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	describe('makeFolkRequest', () => {
		it('sends Authorization: Bearer <token> against the v1 base URL', async () => {
			mockRequest.mockResolvedValue({ data: { id: 'per_123' } });

			await makeFolkRequest('/people/per_123', 'folk-secret-token', {
				method: 'GET',
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
				BASE: FOLK_API_BASE,
				HEADERS: {
					Authorization: 'Bearer folk-secret-token',
					'Content-Type': 'application/json',
				},
			});
			expect(mockRequest.mock.calls[0]?.[1]).toEqual(
				expect.objectContaining({
					method: 'GET',
					url: '/people/per_123',
				}),
			);
		});

		it('passes query parameters and Idempotency-Key header when provided', async () => {
			mockRequest.mockResolvedValue({ data: { items: [] } });

			await makeFolkRequest('/people', 'token-abc', {
				method: 'POST',
				body: { firstName: 'Alice' },
				headers: { 'Idempotency-Key': 'idemp-uuid-1' },
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toMatchObject({
				Authorization: 'Bearer token-abc',
				'Idempotency-Key': 'idemp-uuid-1',
			});
			expect(mockRequest.mock.calls[0]?.[1]).toEqual(
				expect.objectContaining({
					method: 'POST',
					url: '/people',
					body: { firstName: 'Alice' },
				}),
			);
		});

		it('fails fast on an undefined or empty API key with AuthMissingError', async () => {
			await expect(
				makeFolkRequest('/people', undefined, { method: 'GET' }),
			).rejects.toThrow(AuthMissingError);

			await expect(
				makeFolkRequest('/people', '', { method: 'GET' }),
			).rejects.toThrow(AuthMissingError);

			await expect(
				makeFolkRequest('/people', '   ', { method: 'GET' }),
			).rejects.toThrow(AuthMissingError);

			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('wraps ApiError into FolkAPIError extracting status, code, and details', async () => {
			const errorPayload = {
				error: {
					code: 'RESOURCE_NOT_FOUND',
					message: 'Person not found',
					requestId: 'req-1234',
					details: { field: 'personId' },
				},
			};
			const apiErr = makeApiError(404, 'Not Found', errorPayload);
			mockRequest.mockRejectedValue(apiErr);

			// `unknown` because catch blocks receive an untyped rejection value before assertion.
			const caught: unknown = await makeFolkRequest(
				'/people/per_999',
				'token-test',
				{ method: 'GET' },
			).catch((e: unknown) => e);

			expect(caught).toBeInstanceOf(FolkAPIError);
			if (!(caught instanceof FolkAPIError)) {
				throw new Error('Expected FolkAPIError');
			}
			expect(caught.status).toBe(404);
			expect(caught.code).toBe('RESOURCE_NOT_FOUND');
			expect(caught.message).toBe('Person not found');
			expect(caught.requestId).toBe('req-1234');
			expect(caught.details).toEqual({ field: 'personId' });
		});

		it('redacts explicit API keys from thrown error messages', async () => {
			const secretKey = 'secret-api-token-xyz';
			const plainErr = new Error(`Connection failed with token: ${secretKey}`);
			mockRequest.mockRejectedValue(plainErr);

			// `unknown` because catch blocks receive an untyped rejection value before assertion.
			const caught: unknown = await makeFolkRequest('/users', secretKey, {
				method: 'GET',
			}).catch((e: unknown) => e);

			expect(caught).toBeInstanceOf(FolkAPIError);
			if (!(caught instanceof FolkAPIError)) {
				throw new Error('Expected FolkAPIError');
			}
			expect(caught.message).not.toContain(secretKey);
			expect(caught.message).toContain('[REDACTED]');
		});
	});

	describe('redactSensitiveData', () => {
		it('redacts keys containing sensitive keywords', () => {
			const input = {
				name: 'John',
				apiKey: 'super-secret',
				password: 'pass',
				token: 'tok-123',
				nested: {
					secret_access_key: 'nested-secret',
					publicField: 'safe',
				},
				array: [{ authorization: 'Bearer abc', id: '1' }],
			};

			// `unknown` because redactSensitiveData returns arbitrary sanitized JSON trees.
			const redacted: unknown = redactSensitiveData(input);
			expect(redacted).toEqual({
				name: 'John',
				apiKey: '[REDACTED]',
				password: '[REDACTED]',
				token: '[REDACTED]',
				nested: {
					secret_access_key: '[REDACTED]',
					publicField: 'safe',
				},
				array: [{ authorization: '[REDACTED]', id: '1' }],
			});
		});

		it('redacts explicit secret occurrences within strings', () => {
			const text = 'Failure sending key: token-val-987 to remote server';
			// `unknown` because redactSensitiveData returns arbitrary sanitized JSON trees.
			const result: unknown = redactSensitiveData(text, ['token-val-987']);
			expect(result).toBe('Failure sending key: [REDACTED] to remote server');
		});
	});

	describe('real-transport Retry-After handling', () => {
		it('extracts Retry-After header with real corsair/http transport', async () => {
			const actualHttp = jest.requireActual('corsair/http');
			const originalFetch = globalThis.fetch;

			globalThis.fetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				headers: new Headers({
					'content-type': 'application/json',
					'retry-after': '0',
				}),
				text: async () =>
					JSON.stringify({ error: { code: 'TOO_MANY_REQUESTS' } }),
				json: async () => ({ error: { code: 'TOO_MANY_REQUESTS' } }),
			});

			try {
				// `unknown` because catch blocks receive an untyped rejection value before assertion.
				const caught: unknown = await actualHttp
					.request(
						{
							BASE: FOLK_API_BASE,
							HEADERS: { Authorization: 'Bearer test' },
						},
						{ method: 'GET', url: '/credits' },
					)
					.catch((e: unknown) => e);

				expect(caught).toBeInstanceOf(actualHttp.ApiError);
				if (!(caught instanceof ApiError)) {
					throw new Error('Expected ApiError');
				}
				expect(caught.status).toBe(429);
				expect(caught.retryAfter).toBe(0);
			} finally {
				globalThis.fetch = originalFetch;
			}
		});
	});
});
