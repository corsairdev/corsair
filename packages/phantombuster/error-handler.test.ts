import { ApiError } from 'corsair/http';
import { PhantomBusterAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message?: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/test' },
		{
			url: '/test',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message ?? `status ${status}` },
		},
		message ?? `request failed with status ${status}`,
	);
}

function matchedHandlerName(error: Error): string {
	const found = Object.keys(errorHandlers).find((key) =>
		// why safe: key comes from Object.keys of the same object.
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (found === undefined) throw new Error('no handler matched');
	return found;
}

describe('phantombuster errorHandlers', () => {
	it('classifies a 429 ApiError as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies a wrapped 429 PhantomBusterAPIError as RATE_LIMIT_ERROR', () => {
		const wrapped = new PhantomBusterAPIError('rate limited', '429', {
			cause: apiError(429, 'rate_limited'),
		});
		expect(matchedHandlerName(wrapped)).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies 401/403 as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiError(401))).toBe('AUTH_ERROR');
		expect(matchedHandlerName(apiError(403))).toBe('AUTH_ERROR');
	});

	it('classifies invalid_key message as AUTH_ERROR', () => {
		expect(matchedHandlerName(new Error('invalid_key'))).toBe('AUTH_ERROR');
	});

	it('falls through to DEFAULT for anything else', () => {
		expect(matchedHandlerName(new Error('boom'))).toBe('DEFAULT');
	});

	it('returns maxRetries: 0 for AUTH_ERROR and DEFAULT', async () => {
		const auth = await errorHandlers.AUTH_ERROR.handler();
		expect(auth.maxRetries).toBe(0);

		const def = await errorHandlers.DEFAULT.handler();
		expect(def.maxRetries).toBe(0);
	});

	it('returns retry guidance for RATE_LIMIT_ERROR', async () => {
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429),
		);
		expect(strategy.maxRetries).toBe(5);
	});
});
