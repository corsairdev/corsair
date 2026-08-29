import {
	ArynAPIError,
	makeArynBinaryRequest,
	makeArynRequest,
	parseArynRetryAfterMs,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {
		constructor(
			request: unknown,
			response: {
				url: string;
				status: number;
				statusText: string;
				body: unknown;
			},
			message: string,
			rateLimitInfo?: { retryAfter?: number },
		) {
			super(message);
			this.name = 'ApiError';
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.body = response.body;
			this.request = request;
			this.retryAfter = rateLimitInfo?.retryAfter;
		}
		url: string;
		status: number;
		statusText: string;
		body: unknown;
		request: unknown;
		retryAfter?: number;
	},
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

import { ApiError, request } from 'corsair/http';

const mockRequest = jest.mocked(request);

const apiError = (status: number, statusText: string, retryAfter?: number) =>
	new ApiError(
		{ method: 'GET', url: '/test' },
		{
			url: 'https://api.aryn.ai/test',
			ok: false,
			status,
			statusText,
			body: {},
		},
		`Request failed with status ${status}`,
		{ retryAfter },
	);

describe('Aryn error handlers', () => {
	it('matches 429 ArynAPIError as rate limit', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new ArynAPIError('Request failed with status 429', undefined, 429),
			),
		).toBe(true);
	});

	it('matches 429 ApiError message text as rate limit', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many')),
		).toBe(true);
	});

	it('matches rate-limited message text as rate limit', () => {
		const error = new Error('rate_limited by upstream');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('retries rate limit errors with the Retry-After value', async () => {
		const decision = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new ArynAPIError('Request failed with status 429', undefined, 429, 1200),
		);
		expect(decision.maxRetries).toBeGreaterThan(0);
		expect(decision.headersRetryAfterMs).toBe(1200);
	});

	it('does not retry auth errors', async () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new ArynAPIError('Request failed with status 401', undefined, 401),
			),
		).toBe(true);
		const decision = await errorHandlers.AUTH_ERROR.handler();
		expect(decision.maxRetries).toBe(0);
	});

	it('has a catch-all DEFAULT handler that never retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const decision = await errorHandlers.DEFAULT.handler();
		expect(decision.maxRetries).toBe(0);
	});

	it('makeArynRequest wraps unknown transport failures in ArynAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));
		await expect(makeArynRequest('/v1/async/list', 'k')).rejects.toThrow(
			'network down',
		);
	});

	it('makeArynRequest preserves status and retryAfter from ApiError', async () => {
		mockRequest.mockRejectedValueOnce(apiError(429, 'Too Many', 2000));
		const error = await makeArynRequest('/v1/async/list', 'k').catch(
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(ArynAPIError);
		const arynError = error as ArynAPIError;
		expect(arynError.status).toBe(429);
		expect(arynError.retryAfter).toBe(2000);
	});

	it('binary request exposes status and Retry-After on failure', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response('rate limited', {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'Retry-After': '30' },
			}),
		);

		const error = await makeArynBinaryRequest('/test/binary', 'k').catch(
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(ArynAPIError);
		const arynError = error as ArynAPIError;
		expect(arynError.status).toBe(429);
		expect(arynError.retryAfter).toBe(30_000);
		fetchMock.mockRestore();
	});

	it('parseArynRetryAfterMs converts seconds to milliseconds', () => {
		const response = new Response(null, {
			headers: { 'Retry-After': '15' },
		});
		expect(parseArynRetryAfterMs(response)).toBe(15_000);
		const noHeader = new Response(null);
		expect(parseArynRetryAfterMs(noHeader)).toBeUndefined();
	});
});
