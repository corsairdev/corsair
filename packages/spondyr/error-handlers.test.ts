import { ZodError } from 'zod';
import { SpondyrAPIError } from './client';
import {
	errorHandlers,
	mergeErrorHandlers,
	SpondyrOperationError,
} from './error-handlers';
import { badCredentials, noCredentials } from './test-fixtures';

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

function apiError(
	status: number,
	message = 'Spondyr failed',
	options: { retryAfter?: number; method?: string } = {},
) {
	return new SpondyrAPIError(message, { status, ...options });
}

describe('Spondyr error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After on a 429', async () => {
		expect(
			await strategy(apiError(429, 'slow down', { retryAfter: 5000 })),
		).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		[
			'an invalid key',
			'Spondyr 400: API Key is invalid! Application Token is invalid!',
		],
		[
			'a missing key',
			'Spondyr 400: API Key not specified! Application Token not specified!',
		],
	])(
		'treats %s as an auth error, not a validation error',
		(_label, message) => {
			// Spondyr reports both with the same 400 a bad field gets, so the text is
			// the only thing that tells them apart.
			expect(classify(apiError(400, message))).toBe('AUTH_ERROR');
		},
	);

	it('does not retry an auth error', async () => {
		expect(await strategy(apiError(400, 'API Key is invalid!'))).toEqual({
			maxRetries: 0,
		});
	});

	it('treats any other 400 as a validation error', async () => {
		expect(classify(apiError(400, 'Spondyr 400: Name is required'))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('does not retry a 404, which is how an unknown ReferenceID arrives', () => {
		expect(
			classify(apiError(404, 'Spondyr 404: Reference ID is invalid!')),
		).toBe('VALIDATION_ERROR');
	});

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a body that said ERROR', () => {
		expect(classify(new SpondyrOperationError('refused'))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(503, 'unavailable', { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a write, which may have delivered', () => {
		// POST /Spondyr generates and may deliver correspondence.
		expect(classify(apiError(500, 'failed', { method: 'POST' }))).toBe(
			'DEFAULT',
		);
	});

	it('does not replay a 5xx on a PUT', () => {
		expect(classify(apiError(500, 'failed', { method: 'PUT' }))).toBe(
			'DEFAULT',
		);
	});

	it('does not replay a 5xx whose method is unknown', () => {
		expect(classify(apiError(500))).toBe('DEFAULT');
	});

	it('leaves anything unrecognised to DEFAULT with no retry', async () => {
		expect(classify(new Error('socket hang up'))).toBe('DEFAULT');
		expect(await strategy(new Error('socket hang up'))).toEqual({
			maxRetries: 0,
		});
	});

	it('keeps DEFAULT last in the builtin map', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('still classifies the live error envelopes correctly', () => {
		// The bodies came from the API, not from the docs.
		for (const body of [badCredentials, noCredentials]) {
			const error = new SpondyrAPIError(`Spondyr 400: ${body.ErrorMessage}`, {
				status: 400,
			});
			expect(classify(error)).toBe('AUTH_ERROR');
		}
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps a caller handler reachable when the builtin has no match for it', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 7 }) },
		});

		const first = Object.keys(merged).find((key) =>
			merged[key as keyof typeof merged]?.match(new Error('x'), {} as never),
		);
		expect(first).toBe('CUSTOM');
	});

	it('keeps the caller DEFAULT last and winning', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 9,
		});
	});

	it('lets a caller override a builtin name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.RATE_LIMIT_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 1 });
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
