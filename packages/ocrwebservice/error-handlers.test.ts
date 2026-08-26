import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

const request = {
	method: 'POST',
	url: 'https://www.ocrwebservice.com/restservices/processDocument',
} as any;

const response = {
	url: 'https://www.ocrwebservice.com/restservices/processDocument',
	status: 429,
	statusText: 'Too Many Requests',
	body: null,
} as any;

describe('OCR Web Service error handlers', () => {
	it('retries rate-limit errors', async () => {
		const error = new ApiError(request, response, 'Rate limited', {
			retryAfter: 1000,
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);

		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBe(1000);
	});

	it('does not retry authentication errors', async () => {
		const authResponse = {
			url: 'https://www.ocrwebservice.com/restservices/processDocument',
			status: 401,
			statusText: 'Unauthorized',
			body: null,
		} as any;

		const error = new ApiError(request, authResponse, 'Unauthorized');

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.AUTH_ERROR.handler();

		expect(result.maxRetries).toBe(0);
	});

	it('uses the default handler for unknown errors', async () => {
		const error = new Error('Something went wrong');

		expect(errorHandlers.DEFAULT.match()).toBe(true);

		const result = await errorHandlers.DEFAULT.handler();

		expect(result.maxRetries).toBe(0);
	});
});
