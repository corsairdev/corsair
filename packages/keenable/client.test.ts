import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	KEENABLE_API_BASE,
	KeenableAPIError,
	makeKeenableRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v1/search' },
		{
			url: 'https://api.keenable.ai/v1/search',
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

describe('makeKeenableRequest', () => {
	it('sends X-API-Key and does not set TOKEN in config', async () => {
		mockRequest.mockResolvedValue({ results: [] });

		await makeKeenableRequest('/v1/search', 'keen_test_123', {
			method: 'POST',
			body: { query: 'keenable' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: KEENABLE_API_BASE,
			HEADERS: {
				'X-API-Key': 'keen_test_123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v1/search',
				body: { query: 'keenable' },
			}),
		);
	});

	it('sends GET query parameters for fetch', async () => {
		mockRequest.mockResolvedValue({ url: 'https://example.com', content: 'x' });

		await makeKeenableRequest('/v1/fetch', 'keen_test_123', {
			method: 'GET',
			query: { url: 'https://example.com', live: true },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/v1/fetch',
				query: { url: 'https://example.com', live: true },
			}),
		);
		expect(mockRequest.mock.calls[0]?.[1]?.body).toBeUndefined();
	});

	it('makes unauthenticated requests without the X-API-Key header', async () => {
		mockRequest.mockResolvedValue({ results: [] });

		await makeKeenableRequest('/v1/search', undefined, { method: 'POST' });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: KEENABLE_API_BASE,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'X-API-Key',
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ results: [] });

		await expect(
			makeKeenableRequest('/v1/search', '', { method: 'POST' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Rate limit exceeded', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeKeenableRequest('/v1/search', 'keen_test_123', { method: 'POST' }),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});

	it('wraps a non-Error throwable in KeenableAPIError', async () => {
		mockRequest.mockRejectedValue('boom');

		await expect(
			makeKeenableRequest('/v1/search', 'keen_test_123', { method: 'POST' }),
		).rejects.toThrow(KeenableAPIError);
	});
});
