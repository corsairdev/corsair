import type { CorsairErrorHandler } from 'corsair/core';
import type { BonsaiAPIError } from './client';
import { makeBonsaiRequest } from './client';
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

import type { ApiRequestOptions } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const mockRequest = jest.mocked(request);

const VALID_CREDENTIALS = JSON.stringify({
	apiKey: 'test-key',
	apiSecret: 'test-secret',
});

const apiResponse = (status: number, statusText: string) => ({
	url: 'https://api.bonsai.io/test',
	ok: false,
	status,
	statusText,
	body: {},
});

const requestOptions = (): ApiRequestOptions => ({
	method: 'GET',
	url: '/test',
});

async function catchWrappedError(): Promise<Error> {
	try {
		await makeBonsaiRequest('/test', VALID_CREDENTIALS, { method: 'GET' });
	} catch (error) {
		if (error instanceof Error) return error;
	}
	throw new Error('expected makeBonsaiRequest to reject');
}

describe('Bonsai Error Handlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('rate-limit matching through the real client path', () => {
		it('matches a 429 that the client wrapped in BonsaiAPIError', async () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(429, 'Too Many Requests'),
				'Too Many Requests',
				{ retryAfter: 30 },
			);
			mockRequest.mockRejectedValue(transportError);

			const caught = await catchWrappedError();
			expect(caught.name).toBe('BonsaiAPIError');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
		});

		it('surfaces retry-after from a wrapped 429', async () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(429, 'Too Many Requests'),
				'Too Many Requests',
				{ retryAfter: 30 },
			);
			mockRequest.mockRejectedValue(transportError);

			const caught = await catchWrappedError();
			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(caught);
			expect(strategy.maxRetries).toBe(5);
			expect(strategy.retryStrategy).toBe('exponential_backoff');
			expect(strategy.headersRetryAfterMs).toBe(30);
		});

		it('matches a wrapped 429 even when the message has no rate-limit keywords', async () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(429, 'Slow Down'),
				'Slow Down',
				{ retryAfter: 45 },
			);
			mockRequest.mockRejectedValue(transportError);

			const caught = await catchWrappedError();
			expect(caught.name).toBe('BonsaiAPIError');
			expect((caught as BonsaiAPIError).status).toBe(429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);

			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(caught);
			expect(strategy.maxRetries).toBe(5);
			expect(strategy.retryStrategy).toBe('exponential_backoff');
			expect(strategy.headersRetryAfterMs).toBe(45);
		});

		it('matches a raw 429 ApiError even when the message has no rate-limit keywords', () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(429, 'Slow Down'),
				'Slow Down',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(transportError)).toBe(true);
		});

		it('matches a raw 429 ApiError before any wrapping', () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(429, 'Too Many Requests'),
				'Too Many Requests',
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(transportError)).toBe(true);
		});
	});

	describe('auth matching through the real client path', () => {
		it('matches a 401 that the client wrapped in BonsaiAPIError', async () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(401, 'Unauthorized'),
				'Unauthorized',
			);
			mockRequest.mockRejectedValue(transportError);

			const caught = await catchWrappedError();
			expect(caught.name).toBe('BonsaiAPIError');
			expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(true);

			const strategy = await errorHandlers.AUTH_ERROR.handler();
			expect(strategy.maxRetries).toBe(0);
		});
	});

	describe('server and forbidden statuses', () => {
		it('classifies a wrapped 500 as SERVER_ERROR', async () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(500, 'Internal Server Error'),
				'boom',
			);
			mockRequest.mockRejectedValue(transportError);

			const caught = await catchWrappedError();
			expect(errorHandlers.SERVER_ERROR.match(caught)).toBe(true);
			const strategy = await errorHandlers.SERVER_ERROR.handler();
			expect(strategy.maxRetries).toBe(3);
			expect(strategy.retryStrategy).toBe('exponential_backoff');
		});

		it('classifies a wrapped 403 as AUTH_ERROR', async () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(403, 'Forbidden'),
				'Forbidden',
			);
			mockRequest.mockRejectedValue(transportError);

			const caught = await catchWrappedError();
			expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(true);
		});
	});

	describe('non-matching statuses fall through', () => {
		it('does not classify a 404 as rate limit or auth error', async () => {
			const transportError = new ApiError(
				requestOptions(),
				apiResponse(404, 'Not Found'),
				'Not Found',
			);
			mockRequest.mockRejectedValue(transportError);

			const caught = await catchWrappedError();
			expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(false);
			expect(errorHandlers.AUTH_ERROR.match(caught)).toBe(false);
			expect(errorHandlers.SERVER_ERROR.match(caught)).toBe(false);
			expect(errorHandlers.DEFAULT.match()).toBe(true);
		});
	});

	describe('message fallbacks still hold', () => {
		it('matches rate limits by message text', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
			).toBe(true);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
			).toBe(true);
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(
					new Error('please rate limit yourself'),
				),
			).toBe(true);
		});

		it('does not match unrelated errors by message text', () => {
			expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(
				false,
			);
			expect(errorHandlers.AUTH_ERROR.match(new Error('boom'))).toBe(false);
		});

		it('matches auth errors by message text', () => {
			expect(errorHandlers.AUTH_ERROR.match(new Error('unauthorized'))).toBe(
				true,
			);
			expect(errorHandlers.AUTH_ERROR.match(new Error('invalid_auth'))).toBe(
				true,
			);
		});
	});

	it('satisfies the core handler contract', () => {
		const asContract: CorsairErrorHandler = errorHandlers;
		for (const entry of Object.values(asContract)) {
			expect(typeof entry?.match).toBe('function');
			expect(typeof entry?.handler).toBe('function');
		}
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
