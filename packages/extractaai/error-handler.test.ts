import { ApiError } from 'corsair/http';
import { ExtractaaiAPIError } from './client';
import { errorHandlers } from './error-handlers';

function buildApiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.extracta.ai/api/v1/credits' },
		{
			ok: false,
			status,
			statusText: message,
			url: 'https://api.extracta.ai/api/v1/credits',
			body: { status: 'error', message },
		},
		message,
	);
}

describe('Extracta.ai error handlers', () => {
	it('RATE_LIMIT_ERROR matches 429 and retries with backoff', async () => {
		const error = buildApiError(429, 'Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(3);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	it('RATE_LIMIT_ERROR matches rate-limit messages without a status', async () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new Error('Rate limit exceeded, retry later'),
			),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Something else')),
		).toBe(false);
	});

	it('AUTH_ERROR matches 401 and never retries', async () => {
		const error = buildApiError(401, 'Unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('AUTH_ERROR matches invalid-key messages', async () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('Invalid API key'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('Not found'))).toBe(false);
	});

	it('PERMISSION_ERROR matches 403 and never retries', async () => {
		const error = buildApiError(403, 'Forbidden');
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.PERMISSION_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('NOT_FOUND_ERROR matches 404 and "does not exist" messages', async () => {
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(buildApiError(404, 'Not Found')),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(
				new ExtractaaiAPIError('Extraction does not exist', '400', {
					status: 400,
				}),
			),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(
				new ExtractaaiAPIError('Classification does not exist', '400', {
					status: 400,
				}),
			),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new Error('Server exploded')),
		).toBe(false);
	});

	it('BAD_REQUEST_ERROR matches 400/422 and validation messages', async () => {
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				buildApiError(400, 'Invalid request'),
			),
		).toBe(true);
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				new ExtractaaiAPIError('Language is required', '400', {
					status: 400,
				}),
			),
		).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(new Error('All good'))).toBe(
			false,
		);

		const result = await errorHandlers.BAD_REQUEST_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('SERVER_ERROR matches 5xx and retries twice with backoff', async () => {
		const error = buildApiError(500, 'Internal Server Error');
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result.maxRetries).toBe(2);
		expect(result.retryStrategy).toBe('exponential_backoff');
		expect(errorHandlers.SERVER_ERROR.match(new Error('fine'))).toBe(false);
	});

	it('DEFAULT matches everything and never retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);

		const result = await errorHandlers.DEFAULT.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('preserves status and retry metadata on wrapped ApiErrors', () => {
		const wrapped = new ExtractaaiAPIError('Too Many Requests', '429', {
			status: 429,
			retryAfter: 2000,
		});
		expect(wrapped.status).toBe(429);
		expect(wrapped.retryAfter).toBe(2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(wrapped)).toBe(true);
	});
});
