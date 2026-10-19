import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeOctenRequest, OCTEN_API_BASE } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeOctenRequest', () => {
	it('sends the key as x-api-key and unwraps the envelope data', async () => {
		mockRequest.mockResolvedValue({
			code: 0,
			msg: 'success',
			data: { query: 'openai', results: [{ title: 'T' }] },
			request_id: 'req_1',
		});

		const result = await makeOctenRequest('/search', 'test-key-123', {
			method: 'POST',
			body: { query: 'openai' },
		});

		expect(result).toEqual({ query: 'openai', results: [{ title: 'T' }] });
		expect(mockRequest).toHaveBeenCalledTimes(1);

		const config = mockRequest.mock.calls[0]?.[0];
		expect(config).toMatchObject({
			BASE: OCTEN_API_BASE,
			HEADERS: {
				'x-api-key': 'test-key-123',
				'Content-Type': 'application/json',
			},
		});
		expect(config).not.toHaveProperty('TOKEN');
		expect(config?.HEADERS).not.toHaveProperty('Authorization');

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/search',
				body: { query: 'openai' },
			}),
		);

		// The transport's own retry loop is disabled so the plugin's error
		// handlers are the single owner of retries.
		expect(mockRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: expect.objectContaining({
				maxRetries: 0,
				isRateLimitError: expect.any(Function),
			}),
		});
	});

	it('returns the raw body for non-enveloped endpoints', async () => {
		const raw = {
			id: 'vid_1',
			model: 'minimax/minimax-h3',
			status: 'queued',
			created: 1,
		};
		mockRequest.mockResolvedValue(raw);

		const result = await makeOctenRequest('/v1/videos', 'test-key', {
			method: 'POST',
			body: { model: 'minimax/minimax-h3', prompt: 'a canyon' },
			envelope: false,
		});

		expect(result).toEqual(raw);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({
			code: 0,
			msg: 'success',
			data: {},
			request_id: 'req_2',
		});

		await expect(
			makeOctenRequest('/search', '', { method: 'POST' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('surfaces a non-zero envelope code as an ApiError even on HTTP 200', async () => {
		mockRequest.mockResolvedValue({
			code: 401,
			msg: 'Invalid API key',
			request_id: 'req_3',
		});

		let caught: Error | undefined;
		try {
			await makeOctenRequest('/search', 'bad-key', {
				method: 'POST',
				body: { query: 'openai' },
			});
		} catch (error) {
			// Failures from the client are `ApiError`s; narrow to `Error` here
			// rather than storing the catch binding's `unknown`.
			if (error instanceof Error) caught = error;
		}

		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError)) throw new Error('expected ApiError');
		expect(caught.status).toBe(401);
		expect(caught.message).toBe('Invalid API key');
		expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(true);
	});

	it('routes an envelope rate-limit code through RATE_LIMIT_ERROR', async () => {
		mockRequest.mockResolvedValue({
			code: 429,
			msg: 'Too many requests',
			request_id: 'req_4',
		});

		let caught: Error | undefined;
		try {
			await makeOctenRequest('/search', 'test-key', {
				method: 'POST',
				body: { query: 'openai' },
			});
		} catch (error) {
			// Failures from the client are `ApiError`s; narrow to `Error` here
			// rather than storing the catch binding's `unknown`.
			if (error instanceof Error) caught = error;
		}

		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError)) throw new Error('expected ApiError');
		expect(caught.status).toBe(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(caught),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });
	});

	it('rethrows a transport 429 ApiError with retryAfter intact', async () => {
		const rateLimited = new ApiError(
			{ method: 'POST', url: '/search' },
			{
				url: 'https://api.octen.ai/search',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 3000 },
		);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeOctenRequest('/search', 'test-key', {
				method: 'POST',
				body: { query: 'openai' },
			}),
		).rejects.toBe(rateLimited);

		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});
});
