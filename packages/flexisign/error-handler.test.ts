import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { FlexisignAPIError, makeFlexisignRequest } from './client';
import type { ListTemplatesResponse } from './endpoints/types';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function transportError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/templates/all' },
		{
			body: { message },
			ok: false,
			status,
			statusText: message,
			url: 'https://api.flexisign.io/v1/templates/all',
		},
		message,
		{ retryAfter: 2000 },
	);
}

describe('Flexisign error handlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('matches a raw 429 and returns retry strategy with Retry-After', async () => {
		const raw = transportError(429, 'Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(raw)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(raw);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBe(2000);
	});

	it('matches a 429 wrapped by the client through the real request path', async () => {
		mockRequest.mockRejectedValueOnce(transportError(429, 'Slow Down'));
		let caught: Error;
		try {
			await makeFlexisignRequest<ListTemplatesResponse>(
				'/v1/templates/all',
				'key',
			);
			throw new Error('expected makeFlexisignRequest to throw');
		} catch (error) {
			if (!(error instanceof Error)) throw new Error('expected an Error');
			caught = error;
		}

		expect(caught).toBeInstanceOf(FlexisignAPIError);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(caught);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBe(2000);
	});

	it('matches 401/403 auth failures without retries', async () => {
		expect(
			errorHandlers.AUTH_ERROR.match(transportError(401, 'Unauthorized')),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(transportError(403, 'Forbidden')),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('invalid_auth'))).toBe(
			true,
		);

		const strategy = await errorHandlers.AUTH_ERROR.handler();
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not classify unrelated errors as rate-limit or auth', () => {
		const notFound = transportError(404, 'Not Found');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(notFound)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(notFound)).toBe(false);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('boom'))).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(new Error('boom'))).toBe(false);
	});

	it('DEFAULT catches everything with no retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const strategy = await errorHandlers.DEFAULT.handler();
		expect(strategy.maxRetries).toBe(0);
	});

	it('satisfies the core handler contract', () => {
		const asContract: CorsairErrorHandler = errorHandlers;
		for (const entry of Object.values(asContract)) {
			expect(typeof entry?.match).toBe('function');
			expect(typeof entry?.handler).toBe('function');
		}
	});
});
