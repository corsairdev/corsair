import { ApiError } from 'corsair/http';
import { ImgBBAPIError } from './client';
import { errorHandlers } from './error-handlers';

function createMockApiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	const request = {
		url: 'https://api.imgbb.com/1/upload',
		method: 'POST' as const,
	};
	const response = {
		url: 'https://api.imgbb.com/1/upload',
		status,
		statusText: status === 429 ? 'Too Many Requests' : 'Error',
		body: { error: { message, code: status === 401 ? 100 : undefined } },
		ok: false,
		headers: {} as any,
	};
	return new ApiError(request, response, message, { retryAfter });
}

describe('ImgBB errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches 429 status from ApiError and extracts retryAfter', async () => {
			const error = createMockApiError(429, 'Too many requests', 60);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
			expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 60 });
		});

		it('matches ImgBBAPIError with status 429', async () => {
			const error = new ImgBBAPIError('Rate limited', 429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches rate limit messages in generic errors', async () => {
			const error = new Error('rate_limited by provider');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches 401 and 403 ApiError', async () => {
			const error401 = createMockApiError(401, 'Unauthorized');
			const error403 = createMockApiError(403, 'Forbidden');

			expect(errorHandlers.AUTH_ERROR.match(error401)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(error403)).toBe(true);
		});

		it('matches code 100 (Invalid API v1 key) from ImgBBAPIError', async () => {
			const error = new ImgBBAPIError('Invalid API v1 key.', 100);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

			const result = await errorHandlers.AUTH_ERROR.handler(error);
			expect(result).toEqual({ maxRetries: 0 });
		});

		it('matches auth-related error message phrases', async () => {
			expect(errorHandlers.AUTH_ERROR.match(new Error('Invalid API key'))).toBe(
				true,
			);
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('Invalid API v1 key.')),
			).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(new Error('Missing API key'))).toBe(
				true,
			);
			expect(
				errorHandlers.AUTH_ERROR.match(new Error('Unauthorized access')),
			).toBe(true);
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches 400 Bad Request error', async () => {
			const error = createMockApiError(400, 'Bad Request');
			expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);

			const result = await errorHandlers.BAD_REQUEST_ERROR.handler(error);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});

	describe('DEFAULT', () => {
		it('matches any unhandled error', async () => {
			const genericError = new Error('Something unexpected happened');
			expect(errorHandlers.DEFAULT.match(genericError)).toBe(true);

			const result = await errorHandlers.DEFAULT.handler(genericError);
			expect(result).toEqual({ maxRetries: 0 });
		});
	});
});
