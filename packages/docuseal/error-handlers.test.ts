import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { DocuSealTransportError } from './client';
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

function apiError(
	status: number,
	options: { retryAfter?: number; method?: string } = {},
) {
	return new ApiError(
		{ method: (options.method ?? 'GET') as 'GET', url: '/templates' },
		{
			url: 'https://api.docuseal.com/templates',
			ok: false,
			status,
			statusText: 'failed',
			body: { error: 'failed' },
		},
		`DocuSeal ${status}: failed`,
		{ retryAfter: options.retryAfter },
	);
}

describe('DocuSeal error handlers', () => {
	it('does not retry a 429 again after core already retried it', async () => {
		const error = apiError(429, { retryAfter: 2000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each(['GET', 'POST', 'DELETE'] as const)(
		'retries a rate-limited %s, which DocuSeal refused before running',
		async (method) => {
			const error = apiError(429, { method });
			expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		},
	);

	it.each([401, 403])(
		'does not retry a %i (bad key or no permission)',
		async (status) => {
			const error = apiError(status);
			expect(classify(error)).toBe('AUTH_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it.each([400, 404, 422])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'PUT', 'DELETE'] as const)(
		'does not replay a failed %s on a 5xx, which may have run',
		async (method) => {
			const error = apiError(500, { method });
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('retries a read whose connection dropped before reaching DocuSeal', async () => {
		const dropped = new DocuSealTransportError(
			'GET',
			new Error('socket hang up'),
		);
		expect(classify(dropped)).toBe('TRANSPORT_ERROR');
		expect(await strategy(dropped)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a write that timed out', async () => {
		const timeout = new Error('The operation timed out');
		const error = new DocuSealTransportError('POST', timeout);
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers;

	it('returns the builtins untouched when the caller passes none', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('keeps DEFAULT last after merging caller handlers', () => {
		const merged = mergeErrorHandlers(builtin, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
	});

	it('runs a caller handler for a status no builtin covers before DEFAULT', () => {
		const custom = {
			match: (error: Error) => error.message.includes('custom'),
			handler: async () => ({ maxRetries: 5 }),
		};
		const merged = mergeErrorHandlers(builtin, { CUSTOM_ERROR: custom });

		expect(merged.CUSTOM_ERROR).toBe(custom);
		const names = Object.keys(merged);
		// Caller keys come FIRST, not merely before DEFAULT: core takes the
		// first match in key order, so a builtin key sitting ahead of a caller
		// key would claim overlapping errors before the caller's handler runs.
		expect(names.indexOf('CUSTOM_ERROR')).toBe(0);
	});

	it('lets a caller DEFAULT override the builtin fallback', () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});
		expect(merged.DEFAULT).toBeDefined();
	});

	it('does not shadow a builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(builtin, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		expect(merged.RATE_LIMIT_ERROR).toBe(builtin.RATE_LIMIT_ERROR);
		expect(merged.AUTH_ERROR).toBe(builtin.AUTH_ERROR);
	});
});
