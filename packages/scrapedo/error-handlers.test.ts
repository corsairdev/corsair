import type { ErrorContext, RetryStrategy } from 'corsair/core';
import { ScrapeDoAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type CorsairHandler = {
	match: (error: Error, context: ErrorContext) => boolean;
	handler: (error: Error, context: ErrorContext) => Promise<RetryStrategy>;
};

function contextFor(error: Error): ErrorContext {
	return {
		pluginId: 'scrapedo',
		operation: 'scrape.html',
		input: {},
		originalError: error,
	};
}

function firstMatch(error: Error): string | undefined {
	return Object.keys(errorHandlers).find((name) =>
		// A CorsairErrorHandler entry is a Partial, so the call needs both arguments.
		(errorHandlers as Record<string, CorsairHandler | undefined>)[name]?.match(
			error,
			contextFor(error),
		),
	);
}

async function strategyFor(error: Error): Promise<RetryStrategy> {
	const handlers = errorHandlers as Record<string, CorsairHandler | undefined>;
	const name = Object.keys(handlers).find((key) =>
		handlers[key]?.match(error, contextFor(error)),
	);
	return (
		(await handlers[name ?? 'DEFAULT']?.handler(error, contextFor(error))) ?? {
			maxRetries: 0,
		}
	);
}

function apiError(
	status: number,
	overrides: {
		method?: string;
		transport?: boolean;
		timedOut?: boolean;
		causes?: string[];
		message?: string;
	} = {},
): ScrapeDoAPIError {
	return new ScrapeDoAPIError(`Scrape.do ${status}`, {
		status,
		method: overrides.method ?? 'GET',
		...overrides,
	});
}

describe('error handler selection', () => {
	it('does not retry a 401, which the docs warn gets the IP throttled', async () => {
		const error = apiError(401);
		expect(firstMatch(error)).toBe('AUTH_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 510 the caller cancelled', async () => {
		const error = apiError(510);
		expect(firstMatch(error)).toBe('CLIENT_CANCELLED_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 429 on a read, which the docs say is not charged', async () => {
		const error = apiError(429);
		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'linear_2s',
		});
	});

	it('uses Retry-After on a 429 when one came back', async () => {
		const error = new ScrapeDoAPIError('slow', {
			status: 429,
			retryAfter: 1500,
			method: 'GET',
		});
		expect(await strategyFor(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1500,
		});
	});

	it('does not retry a 429 on a forwarded write', async () => {
		const error = apiError(429, { method: 'POST' });
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure on a read', async () => {
		const error = apiError(0, { transport: true });
		expect(firstMatch(error)).toBe('NETWORK_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_2s',
		});
	});

	it('does not replay a transport failure on a POST', async () => {
		const error = apiError(0, { transport: true, method: 'POST' });
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry the client deadline', async () => {
		const error = apiError(0, { transport: true, timedOut: true });
		// TIMEOUT_ERROR sits before NETWORK_ERROR, which would otherwise replay it.
		expect(firstMatch(error)).toBe('TIMEOUT_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 502 on a read, which the docs ask for', async () => {
		const error = apiError(502);
		expect(firstMatch(error)).toBe('SERVER_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 502 on a POST', async () => {
		const error = apiError(502, { method: 'POST' });
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400 whether it was Scrape.do or the target', async () => {
		expect(await strategyFor(apiError(400))).toEqual({ maxRetries: 0 });
		expect(
			await strategyFor(apiError(400, { causes: ['target refused'] })),
		).toEqual({ maxRetries: 0 });
		expect(firstMatch(apiError(400))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a schema failure', async () => {
		const error = new Error('invalid');
		error.name = 'ZodError';
		expect(firstMatch(error)).toBe('VALIDATION_ERROR');
	});

	it('leaves an unmatched failure to DEFAULT, which is last', () => {
		const names = Object.keys(errorHandlers);
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(firstMatch(new Error('something else'))).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps a caller handler in front of the builtin DEFAULT', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: {
				match: (error: Error) => error.message === 'custom',
				handler: async () => ({ maxRetries: 7 }),
			},
			// unknown: mergeErrorHandlers returns a CorsairErrorHandler, and the test
			// needs the same narrowed handler shape used above.
		}) as unknown as Record<string, CorsairHandler>;

		expect(Object.keys(merged).indexOf('CUSTOM_ERROR')).toBeLessThan(
			Object.keys(merged).indexOf('DEFAULT'),
		);
		const error = new Error('custom');
		const handler = merged.CUSTOM_ERROR;
		expect(await handler?.handler(error, contextFor(error))).toEqual({
			maxRetries: 7,
		});
	});

	it('uses the caller DEFAULT and keeps it last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 4 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});

	it('keeps every builtin the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {});
		for (const key of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(key);
		}
	});
});
