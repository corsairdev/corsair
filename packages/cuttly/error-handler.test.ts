import { CuttlyAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Cutt.ly RATE_LIMIT_ERROR', () => {
	it('matches a 429 CuttlyAPIError and forwards retryAfter', async () => {
		const error = new CuttlyAPIError(
			'Too many requests',
			undefined,
			429,
			60000,
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 60000 });
	});

	it('matches rate-limit messages when the HTTP status is omitted', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new CuttlyAPIError('Rate limited by Cutt.ly'),
			),
		).toBe(true);
	});

	it('does not match a generic transport error', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new CuttlyAPIError('fetch failed')),
		).toBe(false);
	});
});

describe('Cutt.ly AUTH_ERROR', () => {
	it('matches an HTTP 401 response', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new CuttlyAPIError('Unauthorized', undefined, 401),
			),
		).toBe(true);
	});

	it('matches provider status 4 (invalid API key) on shorten', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new CuttlyAPIError('Cutt.ly rejected the API key', 4),
			),
		).toBe(true);
	});

	it('returns maxRetries 0 for auth errors', async () => {
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('Cutt.ly BAD_REQUEST_ERROR', () => {
	it('matches an HTTP 400 response', () => {
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				new CuttlyAPIError('Bad request', undefined, 400),
			),
		).toBe(true);
	});

	it('matches provider validation codes without catching invalid keys', () => {
		for (const code of [0, 2, 3, 5, 6, 8]) {
			expect(
				errorHandlers.BAD_REQUEST_ERROR.match(
					new CuttlyAPIError(`provider status ${code}`, code),
				),
			).toBe(true);
		}
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				new CuttlyAPIError('Cutt.ly rejected the API key', 4),
			),
		).toBe(false);
	});

	it('matches provider bad-request messages', () => {
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				new CuttlyAPIError(
					'The requested Cutt.ly custom alias is already in use',
					3,
				),
			),
		).toBe(true);
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				new CuttlyAPIError('Cutt.ly monthly link limit reached', 8),
			),
		).toBe(true);
	});

	it('routes wrapped transport errors past BAD_REQUEST to DEFAULT', () => {
		const transport = new CuttlyAPIError('fetch failed');

		expect(errorHandlers.BAD_REQUEST_ERROR.match(transport)).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('returns maxRetries 0 for bad requests', async () => {
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('Cutt.ly DEFAULT error handler', () => {
	it('matches any fallback error and returns maxRetries 0', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
