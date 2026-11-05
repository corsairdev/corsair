import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function mockApiError(status: number, message: string): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: '/datasets/list',
	};
	const response: ApiResult = {
		url: '/datasets/list',
		ok: false,
		status,
		statusText: status === 429 ? 'Too Many Requests' : 'Error',
		body: {},
	};
	return new ApiError(request, response, message);
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies HTTP 429 as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(mockApiError(429, 'too many requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('does not treat a 429 buried in a file-size message as a rate limit', () => {
		expect(matchedHandlerName(new Error('payload is 429kb'))).toBe('DEFAULT');
	});

	it('classifies HTTP 401 as AUTH_ERROR', () => {
		expect(matchedHandlerName(mockApiError(401, 'unauthorized'))).toBe(
			'AUTH_ERROR',
		);
	});

	it('returns maxRetries 0 for AUTH_ERROR and DEFAULT', async () => {
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
		expect(await errorHandlers.DEFAULT.handler()).toEqual({ maxRetries: 0 });
	});
});
