import { ApiError } from 'corsair/http';
import { RemoetAPIError } from './client';
import { errorHandlers, isRemoetDailyCapError } from './error-handlers';

/**
 * Builds the error the client throws: the core transport's fixed status text
 * is replaced by Remoet's `body.message`, which the client copies over.
 */
function remoetError(
	status: number,
	transportMessage: string,
	// The shape of Remoet's error body; only `message` is read.
	body: {
		statusCode?: number;
		message?: string;
		error?: string;
		limit?: number;
	},
	retryAfter?: number,
): RemoetAPIError {
	const cause = new ApiError(
		{ method: 'GET', url: '/user/full' },
		{
			url: 'https://api.remoet.dev/user/full',
			ok: false,
			status,
			statusText: transportMessage,
			body,
		},
		transportMessage,
		{ retryAfter },
	);
	return new RemoetAPIError(body.message ?? transportMessage, { cause });
}

const perMinute = () =>
	remoetError(
		429,
		'Too Many Requests',
		{
			statusCode: 429,
			message: 'Rate limit exceeded',
			error: 'Too Many Requests',
		},
		37_000,
	);

const dailyCap = () =>
	remoetError(429, 'Too Many Requests', {
		statusCode: 429,
		message:
			'Daily API request limit reached (500/day). This is an abuse threshold, not a product gate: if you are hitting it legitimately, get in touch.',
		limit: 500,
	});

const withStatus = (status: number, message: string) =>
	remoetError(status, message, { statusCode: status, message });

describe('Remoet error handlers', () => {
	it('matches both kinds of 429 as rate-limit errors', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(perMinute())).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(dailyCap())).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(withStatus(404, 'Not Found')),
		).toBe(false);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(false);
	});

	it('tells the daily cap apart from the per-minute limit', () => {
		expect(isRemoetDailyCapError(dailyCap())).toBe(true);
		expect(isRemoetDailyCapError(perMinute())).toBe(false);
		expect(
			isRemoetDailyCapError(withStatus(400, 'Daily API request limit reached')),
		).toBe(false);
	});

	it('retries the per-minute limit after the X-RateLimit-Reset delay', async () => {
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(perMinute()),
		).resolves.toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff_jitter',
			headersRetryAfterMs: 37_000,
		});
	});

	it('does not retry the daily cap', async () => {
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(dailyCap()),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry auth failures', async () => {
		expect(
			errorHandlers.AUTH_ERROR.match(withStatus(401, 'Invalid API Key')),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(withStatus(404, 'Not Found'))).toBe(
			false,
		);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry not-found, bad-request or star conflicts', async () => {
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(
				withStatus(404, 'Link tree not found'),
			),
		).toBe(true);
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				withStatus(400, 'url query parameter is required'),
			),
		).toBe(true);
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				withStatus(409, 'Company already starred'),
			),
		).toBe(true);
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('uses the default handler for anything else', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
