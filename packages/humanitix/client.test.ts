import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeHumanitixRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/events' },
		{
			body: { message },
			ok: false,
			status,
			statusText: message,
			url: 'https://api.humanitix.com/v1/events',
		},
		message,
	);
}

describe('makeHumanitixRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends x-api-key against the Humanitix v1 base URL', async () => {
		mockRequest.mockResolvedValueOnce({
			total: 0,
			page: 1,
			pageSize: 2,
			events: [],
		});

		await makeHumanitixRequest('/events', 'test-key', {
			method: 'GET',
			query: { page: 1 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.humanitix.com/v1',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({ 'x-api-key': 'test-key' }),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/events',
				query: { page: 1 },
			}),
		);
	});

	it('rejects empty keys before calling the transport', async () => {
		await expect(makeHumanitixRequest('/events', '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError so 429 keeps status and retryAfter', async () => {
		const err = apiError(429, 'Too Many Requests');
		mockRequest.mockRejectedValueOnce(err);

		await expect(makeHumanitixRequest('/events', 'test-key')).rejects.toBe(err);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler(err)).resolves.toEqual(
			expect.objectContaining({ maxRetries: 5 }),
		);
	});
});
