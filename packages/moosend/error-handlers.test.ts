import { ZodError } from 'zod';
import { MoosendAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

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

function envelopeError(code: number, options: { retryAfter?: number } = {}) {
	return new MoosendAPIError(`Moosend ${code}: failed`, {
		code,
		moosendError: 'SOMETHING_FAILED',
		...options,
	});
}

function apiError(
	status: number,
	options: { retryAfter?: number; method?: string; replayable?: boolean } = {},
) {
	return new MoosendAPIError(`Moosend ${status}`, {
		status,
		...options,
	});
}

describe('Moosend error handlers', () => {
	it('retries a gateway 429 with backoff', async () => {
		const error = apiError(429, { retryAfter: 5000, replayable: true });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('treats envelope code 104 as an auth error', async () => {
		const error = new MoosendAPIError('Moosend 104: API_KEY_NOT_VALID', {
			code: 104,
			moosendError: 'API_KEY_NOT_VALID',
		});
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('classifies envelope errors behind a 200 as validation failures', async () => {
		const error = envelopeError(209);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('classifies a gateway 404 as a validation failure', async () => {
		const error = apiError(404, { replayable: true });
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, { method: 'GET', replayable: true });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'DELETE'])('does not replay a failed %s', async (method) => {
		const error = apiError(503, { method, replayable: false });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure on a read', async () => {
		const cause = new TypeError('fetch failed');
		const error = new MoosendAPIError(cause.message, {
			replayable: true,
		});
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a transport failure on a write', async () => {
		const error = new MoosendAPIError('fetch failed', {
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
