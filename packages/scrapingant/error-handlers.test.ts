import type { RetryStrategy } from 'corsair/core';
import { ScrapingAntAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Handler = {
	match: (error: Error) => boolean;
	handler: (error: Error) => Promise<RetryStrategy>;
};

type HandlerMap = Record<string, Handler>;
const handlers: HandlerMap = errorHandlers;

/**
 * Resolves the handler core would run: the first key whose `match` passes, in
 * key order, exactly as `handleCorsairError` does.
 */
function firstMatch(error: Error): string | undefined {
	return Object.keys(handlers).find((name) => handlers[name]?.match(error));
}

async function strategyFor(
	error: Error,
	handlersToUse: Record<string, Handler> = handlers,
): Promise<RetryStrategy> {
	const name = Object.keys(handlersToUse).find((key) =>
		handlersToUse[key]?.match(error),
	);
	const handler = handlersToUse[name ?? 'DEFAULT'];
	// A CorsairErrorHandler entry is a Partial, so the call needs both arguments.
	return (await handler?.handler(error)) ?? { maxRetries: 0 };
}

function apiError(
	status: number,
	detail: string,
	overrides: { transport?: boolean; timedOut?: boolean } = {},
) {
	return new ScrapingAntAPIError(`ScrapingAnt ${status}: ${detail}`, {
		status,
		detail,
		...overrides,
	});
}

describe('error handler selection', () => {
	it('sends an exhausted balance to no retry', async () => {
		const error = apiError(
			403,
			'Requests quota limit reached. Please visit https://app.scrapingant.com/subscriptions to upgrade your plan and get more requests',
		);

		expect(firstMatch(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('sends an IP allowlist block to no retry', async () => {
		const error = apiError(
			403,
			'Access denied from this IP address. Please visit https://app.scrapingant.com/whitelist to manage your IP whitelist settings',
		);

		expect(firstMatch(error)).toBe('IP_BLOCKED_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('sends a wrong key to no retry', async () => {
		const error = apiError(
			403,
			'API token is wrong. Please visit https://app.scrapingant.com/profile to check your token settings',
		);

		expect(firstMatch(error)).toBe('AUTH_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries the free-plan concurrency conflict with a wait', async () => {
		const error = apiError(
			409,
			'Free user concurrency limit reached. Please visit https://app.scrapingant.com/subscriptions to upgrade your plan and get more requests',
		);

		expect(firstMatch(error)).toBe('CONCURRENCY_LIMIT_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 3,
			retryStrategy: 'linear_4s',
		});
	});

	it('retries a detected browser once', async () => {
		const error = apiError(423, 'Our browser was detected by target site.');

		expect(firstMatch(error)).toBe('BOT_DETECTED_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_4s',
		});
	});

	it('retries an unreachable target once', async () => {
		const error = apiError(404, "This site can't be reached.");

		expect(firstMatch(error)).toBe('TARGET_UNREACHABLE_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_2s',
		});
	});

	it('retries a transport failure, which never reached the provider', async () => {
		const error = new ScrapingAntAPIError('connection reset', {
			transport: true,
		});

		expect(firstMatch(error)).toBe('NETWORK_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_2s',
		});
	});

	it('does not retry the client deadline, which may still be running', async () => {
		const error = new ScrapingAntAPIError('timed out', {
			transport: true,
			timedOut: true,
		});

		// TIMEOUT_ERROR has to sit before NETWORK_ERROR: it matches every
		// transport failure too, and a replay may pay for the same scrape twice.
		expect(firstMatch(error)).toBe('TIMEOUT_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a body that failed to read after the headers arrived', async () => {
		const error = new ScrapingAntAPIError('body read failed', {
			bodyReadFailed: true,
		});

		// The scrape ran and was charged; HEADERS already came back. Replaying
		// would pay for the same page twice.
		expect(firstMatch(error)).toBe('BODY_READ_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a body-read failure even when the deadline caused it', async () => {
		const error = new ScrapingAntAPIError('body read failed', {
			bodyReadFailed: true,
			timedOut: true,
		});

		// BODY_READ_ERROR is listed first, so neither TIMEOUT_ERROR nor
		// NETWORK_ERROR can claim this and replay a charged scrape.
		expect(firstMatch(error)).toBe('BODY_READ_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a 429 with the gateway Retry-After when one is sent', async () => {
		const error = new ScrapingAntAPIError('slow down', {
			status: 429,
			retryAfter: 3000,
		});

		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 3000,
		});
	});

	it('retries a 429 with backoff when it carries no Retry-After', async () => {
		const error = new ScrapingAntAPIError('slow down', { status: 429 });

		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('retries a 500 with exponential backoff', async () => {
		const error = apiError(500, 'Internal server error');

		expect(firstMatch(error)).toBe('SERVER_ERROR');
		expect(await strategyFor(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 503, which is a server failure too', async () => {
		const error = apiError(503, 'Service Unavailable');

		expect(firstMatch(error)).toBe('SERVER_ERROR');
	});

	it('does not retry a 422 parameter rejection', async () => {
		const error = apiError(422, 'Invalid proxy_type param value.');

		expect(firstMatch(error)).toBe('VALIDATION_ERROR');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a schema failure before the request is sent', async () => {
		const error = new Error('invalid input');
		error.name = 'ZodError';

		expect(firstMatch(error)).toBe('VALIDATION_ERROR');
	});

	it('leaves an unmatched failure to DEFAULT, which is last', async () => {
		const names = Object.keys(handlers);
		expect(names[names.length - 1]).toBe('DEFAULT');

		const error = new Error('something else');
		expect(firstMatch(error)).toBe('DEFAULT');
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps a caller handler in front of the builtin DEFAULT', async () => {
		const callerHandler: Handler = {
			match: (error: Error) => error.message === 'custom 599',
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: callerHandler,
		}) as HandlerMap;

		const error = new Error('custom 599');
		// A plain spread would keep the caller's value at the builtin's
		// position, which is after DEFAULT, so DEFAULT would claim it first.
		expect(Object.keys(merged).indexOf('CUSTOM_ERROR')).toBeLessThan(
			Object.keys(merged).indexOf('DEFAULT'),
		);
		expect(await strategyFor(error, merged)).toEqual({ maxRetries: 7 });
	});

	it('uses the caller DEFAULT when one is given and keeps it last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 4 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(
			await strategyFor(new Error('unmatched'), merged as HandlerMap),
		).toEqual({ maxRetries: 4 });
	});

	it('keeps every builtin handler the caller did not override', () => {
		const merged = mergeErrorHandlers(errorHandlers, {});
		for (const key of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(key);
		}
	});

	it('lets the caller replace a builtin of the same name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SERVER_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		const context = {
			pluginId: 'scrapingant',
			operation: 'scrape.html',
			input: {},
			originalError: new Error('x'),
		};
		expect(merged.SERVER_ERROR?.match(new Error('x'), context)).toBe(false);
	});

	it('returns the builtin map untouched when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toEqual(errorHandlers);
	});
});
