import { ApiError } from 'corsair/http';
import { CloudflareBrowserRenderingHTTPError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/accounts/account-123/browser-run/crawl/job-123' },
		{
			url: 'https://api.cloudflare.com/client/v4/accounts/account-123/browser-run/crawl/job-123',
			ok: false,
			status,
			statusText: message,
			body: { success: false, errors: [{ code: status, message }] },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function matchedHandler(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (match === undefined) throw new Error('No error handler matched');
	return match[0];
}

describe('Cloudflare Browser Run error handlers', () => {
	it('maps 429 to rate-limit handling and forwards retryAfter', async () => {
		const limited = apiError(429, 'Rate limit exceeded', 1500);
		expect(matchedHandler(limited)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(limited),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 1500,
		});
	});

	it('maps binary REST HTTP errors and never retries them', async () => {
		const limited = new CloudflareBrowserRenderingHTTPError(
			'Cloudflare Browser Run binary request failed with HTTP 429',
			429,
			3000,
		);
		const forbidden = new CloudflareBrowserRenderingHTTPError(
			'Cloudflare Browser Run binary request failed with HTTP 403',
			403,
		);

		expect(matchedHandler(limited)).toBe('RATE_LIMIT_ERROR');
		expect(matchedHandler(forbidden)).toBe('AUTH_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(limited),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 3000 });
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('maps authentication failures without retries', async () => {
		const unauthorized = apiError(401, 'Unauthorized');
		expect(matchedHandler(unauthorized)).toBe('AUTH_ERROR');
		expect(matchedHandler(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('maps bad requests and not-found errors', async () => {
		const badRequest = apiError(400, 'Bad Request');
		const notFound = apiError(404, 'Not Found');
		expect(matchedHandler(badRequest)).toBe('BAD_REQUEST_ERROR');
		expect(matchedHandler(notFound)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unrecognized errors to the default handler', async () => {
		const serverError = apiError(500, 'Internal Server Error');
		expect(matchedHandler(serverError)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
