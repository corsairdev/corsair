import type { CorsairErrorHandler } from 'corsair/core';
import type { BonsaiAPIError } from './client';
import { makeBonsaiRequest } from './client';
import { errorHandlers } from './error-handlers';

// Mirror the real corsair/http surface so `instanceof` checks inside
// error-handlers.ts and client.ts resolve against the same mocked class.
// The `request`/`body` fields are typed `unknown` (not `any`) because the
// handlers only ever read `url`, `status`, `statusText` and `retryAfter`; we
// stay strict (unknown) rather than copying the real ApiError's `any`.
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
// eslint-disable-next-line import/first
import { ApiError, request } from 'corsair/http';

// `jest.mocked()` returns the same reference with the jest mock types applied,
// so no type assertion is needed to type the mocked `request`.
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
		// Narrowing instead of an assertion: makeBonsaiRequest only ever throws
		// Error instances (BonsaiAPIError extends Error), so `instanceof` is both
		// type-safe and runtime-safe here.
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
			// Regression test: the transport throws ApiError('Too Many Requests'),
			// the client rewraps it as BonsaiAPIError, and the handler must still
			// classify it as a rate limit. Neither the message nor the error type
			// alone would match without the dual-check.
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
			expect(strategy.headersRetryAfterMs).toBe(30);
		});

		it('matches a wrapped 429 even when the message has no rate-limit keywords', async () => {
			// Exact review scenario: an exhausted 429 whose message carries neither
			// '429' nor 'rate_limited' (nor any other keyword). Classification must
			// come from the preserved status metadata, never the message text, and
			// the provider's retryAfter must reach the retry strategy.
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
