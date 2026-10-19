import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { KLING_API_BASE, makeKlingRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/tasks' },
		{
			url: 'https://api-singapore.klingai.com/tasks',
			ok: false,
			status,
			statusText: message,
			body: { code: 1302 },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeKlingRequest', () => {
	it('sends Authorization: Bearer <apiKey> against the Kling base URL', async () => {
		mockRequest.mockResolvedValue({ code: 0 });

		await makeKlingRequest('/tasks', 'test-key-123', {
			method: 'GET',
			query: { task_ids: '1,2' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: KLING_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-key-123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/tasks',
				query: { task_ids: '1,2' },
			}),
		);
	});

	it('sends a JSON body for POST requests and omits query', async () => {
		mockRequest.mockResolvedValue({ code: 0 });

		await makeKlingRequest('/text-to-video/kling-2.6', 'test-key-123', {
			method: 'POST',
			body: { prompt: 'a cat' },
			query: { ignored: 'yes' },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/text-to-video/kling-2.6',
				body: { prompt: 'a cat' },
			}),
		);
		expect(mockRequest.mock.calls[0]?.[1]?.query).toBeUndefined();
	});

	it('omits the Authorization header when no key is provided', async () => {
		mockRequest.mockResolvedValue({ code: 0 });

		await makeKlingRequest('/tasks', undefined, { method: 'GET' });

		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ code: 0 });

		await expect(
			makeKlingRequest('/tasks', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeKlingRequest('/tasks', 'test-key', { method: 'GET' }),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});
});
