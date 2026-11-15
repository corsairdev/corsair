import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
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
	// Widened: these handlers ignore the error, but core passes it.
	const handler: (error: Error) => Promise<unknown> =
		errorHandlers[classify(error)].handler;
	return handler(error);
}

/** Core's ApiError, built the way request() builds it. */
function apiError(
	status: number,
	options: {
		providerMessage?: string;
		retryAfter?: number;
		method?: 'GET' | 'POST';
		url?: string;
	} = {},
) {
	return new ApiError(
		{
			method: options.method ?? 'GET',
			url: options.url ?? 'api/computer/list',
		},
		{
			url: `https://www.triggercmd.com/${options.url ?? 'api/computer/list'}`,
			ok: false,
			status,
			statusText: '',
			body:
				options.providerMessage === undefined
					? undefined
					: { err: options.providerMessage },
		},
		`TRIGGERcmd ${status}`,
		{ retryAfter: options.retryAfter },
	);
}

describe('TRIGGERcmd error handlers', () => {
	it('does not replay a 429 core already retried', async () => {
		const error = apiError(429, { retryAfter: 15000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry the 401 Invalid Token', async () => {
		const error = apiError(401, { providerMessage: 'Invalid Token!' });
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401 with no Authorization header', async () => {
		const error = apiError(401, {
			providerMessage: 'No Authorization header was found',
		});
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a 404, which means the route is wrong', async () => {
		const error = apiError(404);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on a read', async () => {
		const error = apiError(503, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a command run on a 5xx', () => {
		// A replay could run the command twice on the computer.
		expect(classify(apiError(500, { method: 'POST' }))).toBe('DEFAULT');
	});

	it('does not replay a panel trigger on a 5xx, though it is a GET', () => {
		// panels.trigger runs the button's command, so a replay could run it twice.
		expect(
			classify(apiError(503, { method: 'GET', url: 'api/panel/trigger' })),
		).toBe('DEFAULT');
	});

	it('does not replay a 5xx that is not core ApiError', () => {
		expect(classify(new Error('500 upstream'))).toBe('DEFAULT');
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
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 9,
		});
	});

	it('lets a caller override a builtin name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SERVER_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.SERVER_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 1 });
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
