import type { CorsairErrorHandler } from 'corsair/core';
import { RedcircleAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Decision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function rcError(init: {
	status?: number;
	message?: string;
	retryAfter?: number;
	method?: string;
	replayable?: boolean;
}): RedcircleAPIError {
	return new RedcircleAPIError(init.message ?? 'failed', init);
}

/** Widens the concrete handlers so a shared caller can invoke them. */
function asHandlerMap(handlers: typeof errorHandlers): CorsairErrorHandler {
	return handlers;
}

async function decide(
	handlers: CorsairErrorHandler,
	name: string,
	error: Error,
): Promise<Decision | undefined> {
	const entry = handlers[name];
	if (!entry?.handler) return undefined;
	return entry.handler(error, {} as never);
}

function claims(
	handlers: CorsairErrorHandler,
	name: string,
	error: Error,
): boolean {
	return handlers[name]?.match?.(error, {} as never) === true;
}

function firstMatch(
	handlers: CorsairErrorHandler,
	error: Error,
): string | undefined {
	return Object.entries(handlers).find(([, entry]) =>
		entry?.match?.(error, {} as never),
	)?.[0];
}

const handlers = asHandlerMap(errorHandlers);

describe('quota handling', () => {
	it('matches a 402 and never retries it', async () => {
		const error = rcError({ status: 402 });

		expect(claims(handlers, 'QUOTA_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'QUOTA_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});

	it('stops before the rate-limit handler', () => {
		expect(firstMatch(handlers, rcError({ status: 402 }))).toBe('QUOTA_ERROR');
	});
});

describe('rate limit handling', () => {
	it('retries a 429 with exponential backoff', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rcError({ status: 429 }),
		);

		expect(result?.maxRetries).toBe(3);
		expect(result?.retryStrategy).toBe('exponential_backoff');
	});

	it('passes the delay through when one was read', async () => {
		const result = await decide(
			handlers,
			'RATE_LIMIT_ERROR',
			rcError({ status: 429, retryAfter: 5_000 }),
		);

		expect(result?.headersRetryAfterMs).toBe(5_000);
	});
});

describe('incident handling', () => {
	it('surfaces long incident delays without waiting or retrying early', async () => {
		const error = rcError({ status: 503, retryAfter: 3_600_000 });
		const result = await decide(handlers, 'INCIDENT_ERROR', error);
		expect(result?.maxRetries).toBe(0);
		expect(error.retryAfter).toBe(3_600_000);
	});

	it('retries a 503, which RedCircle says was not charged', async () => {
		const error = rcError({
			status: 503,
			retryAfter: 5_000,
			replayable: false,
		});

		expect(claims(handlers, 'INCIDENT_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'INCIDENT_ERROR', error);
		expect(result?.maxRetries).toBe(2);
		expect(result?.headersRetryAfterMs).toBe(5_000);
	});

	it('prefers the incident handler over the generic server one', () => {
		// A 503 is documented as uncharged, so it is replayable even for a write,
		// which the server handler would have gated.
		const error = rcError({ status: 503, replayable: false });
		expect(firstMatch(handlers, error)).toBe('INCIDENT_ERROR');
	});
});

describe('auth handling', () => {
	it('matches a 401 and does not retry it', async () => {
		const error = rcError({ status: 401 });

		expect(claims(handlers, 'AUTH_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'AUTH_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});
});

describe('validation handling', () => {
	it('matches a 400 and a zod rejection', () => {
		expect(claims(handlers, 'VALIDATION_ERROR', rcError({ status: 400 }))).toBe(
			true,
		);
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';
		expect(claims(handlers, 'VALIDATION_ERROR', zodError)).toBe(true);
	});
});

describe('not-found handling', () => {
	it('matches a 404 and does not retry it', async () => {
		const error = rcError({ status: 404 });

		expect(claims(handlers, 'NOT_FOUND_ERROR', error)).toBe(true);
		const result = await decide(handlers, 'NOT_FOUND_ERROR', error);
		expect(result?.maxRetries).toBe(0);
	});
});

describe('server handling', () => {
	it('retries transport failures only for replayable calls', () => {
		expect(firstMatch(handlers, rcError({ replayable: true }))).toBe(
			'SERVER_ERROR',
		);
		expect(firstMatch(handlers, rcError({ replayable: false }))).toBe(
			'DEFAULT',
		);
	});

	it('replays a 500 read', async () => {
		const result = await decide(
			handlers,
			'SERVER_ERROR',
			rcError({ status: 500, method: 'GET', replayable: true }),
		);

		expect(result?.maxRetries).toBe(2);
	});

	it('does not replay a 500 on a call that is not replayable', () => {
		const error = rcError({ status: 500, replayable: false });

		expect(claims(handlers, 'SERVER_ERROR', error)).toBe(false);
		expect(firstMatch(handlers, error)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin map untouched when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('runs a caller handler for a case no builtin covers', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_500: {
				match: (error: Error) => error.message === 'special',
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		expect(firstMatch(merged, new Error('special'))).toBe('CUSTOM_500');
		const result = await decide(merged, 'CUSTOM_500', new Error('special'));
		expect(result?.maxRetries).toBe(7);
	});

	it('lets a caller override a builtin of the same name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});

		expect(claims(merged, 'AUTH_ERROR', rcError({ status: 401 }))).toBe(false);
	});
});
