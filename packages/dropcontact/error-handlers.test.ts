import type { ErrorContext, RetryStrategy } from 'corsair/core';
import { DropcontactAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	rateLimited,
	tooManyRecords,
	unauthorized,
	validationError,
	webhookNothingToDelete,
} from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// unknown: the builtin map is a Partial over a wide key union; this view states
// the one signature core calls it with.
type Entry = {
	match: (error: Error, context: ErrorContext) => boolean;
	handler: (error: Error, context: ErrorContext) => Promise<RetryStrategy>;
};
const handlers = errorHandlers as unknown as Record<HandlerName, Entry>; // unknown: see Entry.

// unknown: the handlers read only the error; core builds the real context.
const context = {} as ErrorContext;

/** Mirrors core: the first handler whose match() passes, in key order. */
function classify(error: Error): HandlerName {
	const name = (Object.keys(handlers) as HandlerName[]).find((key) =>
		handlers[key].match(error, context),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return handlers[classify(error)].handler(error, context);
}

function apiError(
	status: number | undefined,
	// unknown: each case passes one of Dropcontact's error envelopes.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new DropcontactAPIError(`Dropcontact ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('AUTH_ERROR', () => {
	it('does not retry a 401', async () => {
		const error = apiError(401, unauthorized);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('PERMISSION_ERROR', () => {
	it('does not retry a 403 for an account not set up for the API', async () => {
		const error = apiError(403, {
			error: true,
			success: false,
			reason: 'Unknown account',
		});
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('VALIDATION_ERROR', () => {
	it('does not retry a 400', async () => {
		const error = apiError(400, tooManyRecords);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422 from FastAPI', async () => {
		expect(classify(apiError(422, validationError))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a ZodError raised before the request', async () => {
		const error = new Error('invalid input');
		error.name = 'ZodError';
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});
});

describe('NOT_FOUND_ERROR', () => {
	it('does not retry nothing-to-delete, which is already the goal', async () => {
		const error = apiError(404, webhookNothingToDelete);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry any other 404', async () => {
		expect(classify(apiError(404, { detail: 'Not Found' }))).toBe(
			'NOT_FOUND_ERROR',
		);
	});
});

describe('RATE_LIMIT_ERROR', () => {
	it('retries a 429', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2_000,
		});
	});

	it('lets a real Retry-After override the fallback', async () => {
		expect(
			await strategy(apiError(429, rateLimited, { retryAfter: 5_000 })),
		).toMatchObject({ headersRetryAfterMs: 5_000 });
	});

	it('retries a 429 whose body carries nothing', async () => {
		// The docs also use 429 for a temporary fault on their side.
		expect(classify(apiError(429, '<html>Too Many</html>'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});
});

describe('SERVER_ERROR', () => {
	it('replays a 5xx', async () => {
		const error = apiError(503, { detail: 'Service Unavailable' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not catch a 4xx', async () => {
		expect(classify(apiError(400, tooManyRecords))).not.toBe('SERVER_ERROR');
	});
});

describe('TIMEOUT_ERROR and NETWORK_ERROR', () => {
	it('replays a dropped GET', async () => {
		const error = apiError(undefined, {}, { method: 'GET' });
		error.name = 'TimeoutError';
		expect(classify(error)).toBe('TIMEOUT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 2 });
	});

	it('does not replay a dropped write', async () => {
		// Enrichment spends credits, so a request that may have landed is not
		// sent again.
		const error = apiError(undefined, {}, { method: 'POST' });
		expect(classify(error)).toBe('NETWORK_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('replays a dropped PUT only through the network handler rules', async () => {
		const error = apiError(undefined, {}, { method: 'PUT' });
		expect(classify(error)).toBe('NETWORK_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('DEFAULT', () => {
	it('is last in key order', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('matches an error no other handler claims', async () => {
		const error = new Error('something else');
		error.name = 'SomeOtherError';
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtin map when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: { match: () => false, handler: async () => ({}) },
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('puts a caller handler first so it is the one that runs', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_500: {
				match: (error: Error) =>
					error instanceof DropcontactAPIError && error.status === 502,
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		expect(Object.keys(merged)[0]).toBe('MY_500');
		expect(await merged.MY_500?.handler(apiError(502), context)).toEqual({
			maxRetries: 7,
		});
	});

	it('lets a caller replace a builtin and moves it first', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SERVER_ERROR: { match: () => false, handler: async () => ({}) },
		});
		expect(merged.SERVER_ERROR?.match(new Error('x'), context)).toBe(false);
		expect(Object.keys(merged)[0]).toBe('SERVER_ERROR');
		expect(merged.AUTH_ERROR).toBe(errorHandlers.AUTH_ERROR);
	});

	it('uses the caller DEFAULT when one is given', () => {
		const callerDefault = { match: () => true, handler: async () => ({}) };
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
