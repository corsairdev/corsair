import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	MINIMAX_API_BASE,
	MinimaxAPIError,
	makeMinimaxRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v1/text/chatcompletion_v2' },
		{
			url: 'https://api.minimax.io/v1/text/chatcompletion_v2',
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

describe('makeMinimaxRequest', () => {
	it('sends Authorization: Bearer <apiKey> and does not set TOKEN in config', async () => {
		mockRequest.mockResolvedValue({ id: 'chat-1' });

		await makeMinimaxRequest('/v1/text/chatcompletion_v2', 'test-key-123', {
			method: 'POST',
			body: { model: 'MiniMax-M2' },
			query: { trace: 'on' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: MINIMAX_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-key-123',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v1/text/chatcompletion_v2',
				body: { model: 'MiniMax-M2' },
				query: { trace: 'on' },
			}),
		);
		expect(mockRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
		});
	});

	it('defaults to GET and omits Authorization when no key is supplied', async () => {
		mockRequest.mockResolvedValue({ object: 'list', data: [] });

		await makeMinimaxRequest('/v1/models');

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/v1/models' }),
		);
	});

	it('throws AuthMissingError for an explicitly empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await expect(
			makeMinimaxRequest('/v1/models', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeMinimaxRequest('/v1/text/chatcompletion_v2', 'test-key', {
				method: 'POST',
			}),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});

	it('turns a non-zero base_resp status_code into a MinimaxAPIError', async () => {
		// MiniMax returns HTTP 200 with a non-zero base_resp.status_code on
		// failure; the client must surface it as a real error.
		mockRequest.mockResolvedValue({
			base_resp: { status_code: 2056, status_msg: 'usage limit exceeded' },
		});

		await expect(
			makeMinimaxRequest('/v1/text/chatcompletion_v2', 'test-key', {
				method: 'POST',
			}),
		).rejects.toMatchObject({
			name: 'MinimaxAPIError',
			message: 'usage limit exceeded',
			code: '2056',
		});

		expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(
				new Error('usage limit exceeded'),
			),
		).toBe(true);
	});

	it('returns the body unchanged when base_resp.status_code is zero', async () => {
		const body = {
			base_resp: { status_code: 0, status_msg: 'success' },
			id: 'chat-1',
		};
		mockRequest.mockResolvedValue(body);

		await expect(
			makeMinimaxRequest('/v1/text/chatcompletion_v2', 'test-key', {
				method: 'POST',
			}),
		).resolves.toBe(body);
	});

	it('wraps a non-Error rejection in a MinimaxAPIError', async () => {
		mockRequest.mockRejectedValue('boom');

		await expect(
			makeMinimaxRequest('/v1/models', 'test-key'),
		).rejects.toBeInstanceOf(MinimaxAPIError);
	});
});
