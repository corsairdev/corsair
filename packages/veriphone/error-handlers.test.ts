import { VeriphoneAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiErrorWithStatus(
	status: number,
	extra?: Partial<VeriphoneAPIError>,
): VeriphoneAPIError {
	const error = new VeriphoneAPIError('placeholder', status);
	Object.assign(error, { status, ...extra });
	return error;
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR', () => {
		const error = apiErrorWithStatus(429);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('exposes the Retry-After header for rate-limit errors', async () => {
		const error = apiErrorWithStatus(429, { retryAfter: 30_000 });

		const handler = errorHandlers.RATE_LIMIT_ERROR?.handler as (
			error: Error,
			context: never,
		) => Promise<{ maxRetries?: number; headersRetryAfterMs?: number }>;
		const result = await handler(error, {} as never);
		expect(result).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 30_000,
		});
	});

	it('classifies a 401 as AUTH_ERROR', () => {
		const error = apiErrorWithStatus(401, {
			body: {
				status: 'error',
				code: 401,
				message: 'API key or token required',
			},
		});
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('classifies a 402 as PAYMENT_REQUIRED_ERROR', () => {
		const error = apiErrorWithStatus(402);
		expect(matchedHandlerName(error)).toBe('PAYMENT_REQUIRED_ERROR');
	});

	it('classifies a 404 as NOT_FOUND_ERROR', () => {
		const error = apiErrorWithStatus(404);
		expect(matchedHandlerName(error)).toBe('NOT_FOUND_ERROR');
	});

	it('classifies a 500 as SERVER_ERROR', () => {
		const error = apiErrorWithStatus(500);
		expect(matchedHandlerName(error)).toBe('SERVER_ERROR');
	});

	it('falls through to DEFAULT for anything else', () => {
		const error = apiErrorWithStatus(418);
		expect(matchedHandlerName(error)).toBe('DEFAULT');
	});

	it('treats a raw message about rate limiting as RATE_LIMIT_ERROR', () => {
		const error = new VeriphoneAPIError('Rate limit exceeded', 429);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});
});
