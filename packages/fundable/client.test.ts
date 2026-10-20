import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FUNDABLE_API_BASE,
	makeFundableRequest,
	tryGetStoredKey,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/company' },
		{
			url: `${FUNDABLE_API_BASE}/company`,
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeFundableRequest', () => {
	it('sends Authorization: Bearer <apiKey> and targets the documented base URL', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await makeFundableRequest('/company', 'test-key-123', {
			method: 'GET',
			query: { domain: 'example.com' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: 'https://www.tryfundable.ai/api/v1',
			HEADERS: {
				Authorization: 'Bearer test-key-123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/company',
				query: { domain: 'example.com' },
			}),
		);
		// The transport's own retry loop is disabled so the plugin's error
		// handlers are the only owner of retries (no stacked retries on 429).
		expect(mockRequest.mock.calls[0]?.[2]).toEqual(
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
	});

	it('sends a JSON body for POST requests and omits it for GET', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await makeFundableRequest('/companies', 'test-key-123', {
			method: 'POST',
			body: { page: 0 },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/companies',
				body: { page: 0 },
			}),
		);

		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ success: true });

		await makeFundableRequest('/alerts', 'test-key-123', {
			method: 'GET',
			query: { alert_ids: 'abc' },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				body: undefined,
			}),
		);
	});

	it('makes unauthenticated requests without an Authorization header', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await makeFundableRequest('/location/search', undefined, {
			method: 'GET',
		});

		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await expect(
			makeFundableRequest('/company', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Rate limit exceeded', 60000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeFundableRequest('/company', 'test-key', { method: 'GET' }),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 60000,
		});
	});

	it('rethrows a non-Error rejection wrapped in FundableAPIError', async () => {
		mockRequest.mockRejectedValue('boom');

		await expect(
			makeFundableRequest('/company', 'test-key', { method: 'GET' }),
		).rejects.toThrow('Unknown error');
	});
});

describe('tryGetStoredKey', () => {
	it('returns the stored value when present', async () => {
		await expect(
			tryGetStoredKey(() => Promise.resolve('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('maps a null value to undefined', async () => {
		await expect(
			tryGetStoredKey(() => Promise.resolve(null)),
		).resolves.toBeUndefined();
	});

	it('treats a missing DEK as no stored key', async () => {
		await expect(
			tryGetStoredKey(() =>
				Promise.reject(
					new Error(
						'No DEK found for account (tenant: "t", integration: "fundable")',
					),
				),
			),
		).resolves.toBeUndefined();
	});

	it('propagates unrelated key-manager failures', async () => {
		await expect(
			tryGetStoredKey(() => Promise.reject(new Error('decryption failed'))),
		).rejects.toThrow('decryption failed');
	});
});
