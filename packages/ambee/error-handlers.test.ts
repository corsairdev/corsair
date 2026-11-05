import { AmbeeAPIError } from './client';
import { errorHandlers } from './error-handlers';

function ambeeError(status: number, retryAfter?: number): AmbeeAPIError {
	const error = new AmbeeAPIError(`Request failed with status ${status}`);
	Object.assign(error, { status, retryAfter });
	return error;
}

/** Mirrors how corsair picks a handler: first matching entry wins. */
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
		const error = ambeeError(429, 2000);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: 2000,
		});
	});

	it('treats 401 and 403 as auth failures that must not be retried', async () => {
		expect(route(ambeeError(401))).toBe('AUTH_ERROR');
		expect(route(ambeeError(403))).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('treats a 404 as an out-of-coverage location rather than a transient failure', async () => {
		expect(route(ambeeError(404))).toBe('NOT_FOUND_ERROR');
		expect(await errorHandlers.NOT_FOUND_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to validation without retrying', async () => {
		expect(route(ambeeError(400))).toBe('VALIDATION_ERROR');
		expect(route(ambeeError(422))).toBe('VALIDATION_ERROR');
		expect(await errorHandlers.VALIDATION_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('retries 5xx responses with exponential backoff', async () => {
		expect(route(ambeeError(503))).toBe('SERVER_ERROR');
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

	it('still recognises a rate limit when only the message carries the signal', () => {
		expect(route(new Error('Ambee returned 429 rate limit exceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('does not let digits in the message override an explicit status', () => {
		const error = ambeeError(503);
		error.message = 'upstream failed for postalCode 560429 with body 404';
		expect(route(error)).toBe('SERVER_ERROR');
	});
});
