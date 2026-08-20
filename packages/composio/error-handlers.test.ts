import { ComposioAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Composio error handlers', () => {
	const rateLimit = errorHandlers.RATE_LIMIT_ERROR;
	const auth = errorHandlers.AUTH_ERROR;

	it('matches a 429 ComposioAPIError even with a generic message', () => {
		// makeComposioRequest wraps every ApiError into ComposioAPIError, so a
		// bare-429 body must still match via the structured status field.
		const error = new ComposioAPIError('upstream busy', 429);
		expect(rateLimit?.match(error, {} as never)).toBe(true);
	});

	it('matches rate-limit wording when no structured status exists', () => {
		expect(rateLimit?.match(new Error('Too many requests'), {} as never)).toBe(
			true,
		);
		expect(
			rateLimit?.match(new Error('you are rate limited'), {} as never),
		).toBe(true);
	});

	it('does not match an unrelated error', () => {
		expect(rateLimit?.match(new Error('not found'), {} as never)).toBe(false);
	});

	it('returns Retry-After delay when the error carries one', async () => {
		const error = new ComposioAPIError('rate limit exceeded', 429, 2500);
		const strategy = await rateLimit?.handler(error, {} as never);
		expect(strategy).toEqual({ maxRetries: 5, headersRetryAfterMs: 2500 });
	});

	it('falls back to exponential backoff without Retry-After', async () => {
		const error = new ComposioAPIError('rate limit exceeded', 429);
		const strategy = await rateLimit?.handler(error, {} as never);
		expect(strategy).toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches a 401 ComposioAPIError for AUTH_ERROR', () => {
		expect(auth?.match(new ComposioAPIError('bad key', 401), {} as never)).toBe(
			true,
		);
	});

	it('auth errors never retry', async () => {
		const strategy = await auth?.handler(
			new ComposioAPIError('unauthorized', 401),
			{} as never,
		);
		expect(strategy).toEqual({ maxRetries: 0 });
	});
});
