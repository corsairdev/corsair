import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { LAPOSTA_API_BASE, makeLapostaRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/list' },
		{
			url: 'https://api.laposta.nl/v2/list',
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

describe('makeLapostaRequest', () => {
	it('sends HTTP Basic Auth with API key as username and empty password', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeLapostaRequest('/list', 'test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const expectedBasic = Buffer.from('test-api-key:').toString('base64');
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LAPOSTA_API_BASE,
			HEADERS: {
				Authorization: `Basic ${expectedBasic}`,
				'Content-Type': 'application/json',
			},
		});
	});

	it('passes endpoint, method, body, and query parameters', async () => {
		mockRequest.mockResolvedValue({ member: { id: 'm1' } });

		await makeLapostaRequest('/member', 'test-key', {
			method: 'POST',
			body: { email: 'user@example.com' },
			query: { list_id: 'l1' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/member',
				body: { email: 'user@example.com' },
				query: { list_id: 'l1' },
			}),
		);
	});

	it('throws AuthMissingError when key is explicitly empty without sending network request', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		// `unknown` because rejection from missing auth throws an un-typed error before catch.
		await expect(
			makeLapostaRequest('/list', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 4000);
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because catch returns unknown error instance.
		await expect(
			makeLapostaRequest('/list', 'test-key', { method: 'GET' }),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 4000,
		});
	});
});
