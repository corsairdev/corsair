import { ZodError } from 'zod';
import { CommCareAPIError } from './client';
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
	return errorHandlers[classify(error)].handler();
}

function apiError(status: number, options: { replaySafe?: boolean } = {}) {
	return new CommCareAPIError(`CommCare ${status}: failed`, {
		status,
		...options,
	});
}

describe('CommCare error handlers', () => {
	it.each([401])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([410, 422])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('GONE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])(
		'retries a flagged read that got a %i',
		async (status) => {
			const error = apiError(status, { replaySafe: true });
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(await strategy(error)).toEqual({
				maxRetries: 2,
				retryStrategy: 'exponential_backoff',
			});
		},
	);

	it('does not replay an unflagged 5xx, whatever the method', async () => {
		const error = apiError(503);
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a timeout, whose effect is unknown', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new CommCareAPIError(timeout.message, { cause: timeout });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last when the caller adds handlers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(merged.MY_ERROR).toBeDefined();
	});
});
