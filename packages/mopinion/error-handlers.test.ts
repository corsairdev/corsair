import { ZodError } from 'zod';
import { MopinionAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { validationProblem } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return errorHandlers[classify(error)].handler(error);
}

function problem(
	status: number,
	errorCode: number,
	options: { retryAfter?: number; method?: string; replayable?: boolean } = {},
) {
	return new MopinionAPIError(`Mopinion ${status}: failed`, {
		status,
		body: { ...validationProblem, status, error_code: errorCode },
		...options,
	});
}

describe('Mopinion error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = problem(429, 100, { replayable: true });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Mopinion sends one', async () => {
		const error = problem(429, 100, { retryAfter: 4000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401 or the invalid-credentials error code 18', async () => {
		for (const error of [
			problem(401, 18),
			// The docs warn statuses can repeat for different problems, so an
			// error_code 18 behind another status is still an auth failure.
			problem(400, 18),
		]) {
			expect(classify(error)).toBe('AUTH_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('does not retry a 403', async () => {
		const error = problem(403, 24);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404, 406, 422])('does not retry a %i', async (status) => {
		const error = problem(status, 30);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = problem(status, 99, { method: 'GET', replayable: true });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a non-replayable 5xx', async () => {
		const error = problem(503, 99, { replayable: false });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure on a read', async () => {
		const error = new MopinionAPIError('fetch failed', {
			replayable: true,
		});
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a transport failure on a non-replayable request', async () => {
		const error = new MopinionAPIError('fetch failed', {
			replayable: false,
		});
		expect(classify(error)).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			OVERLOADED_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('OVERLOADED_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('lets a caller override DEFAULT and keeps it last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtin handlers unchanged when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
