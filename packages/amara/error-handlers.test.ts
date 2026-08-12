import { AmaraAPIError } from './client';
import { errorHandlers } from './error-handlers';

function amaraError(status: number, retryAfter?: number): AmaraAPIError {
	const error = new AmaraAPIError(`Request failed with status ${status}`);
	Object.assign(error, { status, retryAfter });
	return error;
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

beforeEach(() => {
	jest.spyOn(console, 'error').mockImplementation(() => {});
	jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('errorHandlers', () => {
	it('routes a 429 to the rate-limit handler and retries with backoff', async () => {
		const error = amaraError(429, 2000);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 2000,
		});
	});

	it('treats 401 and 403 as auth failures that must not be retried', async () => {
		expect(route(amaraError(401))).toBe('AUTH_ERROR');
		expect(route(amaraError(403))).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('treats a 404 as not-found rather than a transient failure', async () => {
		expect(route(amaraError(404))).toBe('NOT_FOUND_ERROR');
		expect(await errorHandlers.NOT_FOUND_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to validation without retrying', async () => {
		expect(route(amaraError(400))).toBe('VALIDATION_ERROR');
		expect(route(amaraError(422))).toBe('VALIDATION_ERROR');
		expect(await errorHandlers.VALIDATION_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('retries 5xx responses with exponential backoff', async () => {
		expect(route(amaraError(503))).toBe('SERVER_ERROR');
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls back to DEFAULT for an error carrying no status', async () => {
		const error = new Error('socket hang up');

		expect(route(error)).toBe('DEFAULT');
		expect(await errorHandlers.DEFAULT.handler(error)).toEqual({
			maxRetries: 0,
		});
	});

	it('does not let message heuristics override a known non-matching status', () => {
		// 400 body mentioning "rate limit" must stay VALIDATION, not RATE_LIMIT.
		const error = amaraError(400);
		error.message = 'rate limit exceeded somehow';
		expect(route(error)).toBe('VALIDATION_ERROR');
	});
});
