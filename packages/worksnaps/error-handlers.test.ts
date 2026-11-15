import { ZodError } from 'zod';
import { WorksnapsAPIError } from './client';
import { errorHandlers } from './error-handlers';

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
	// The API sends no error body at all, so the status is the whole input.
	return new WorksnapsAPIError(`Worksnaps ${status}: failed`, {
		status,
		...options,
	});
}

describe('Worksnaps error handlers', () => {
	it('retries a 429 with backoff', async () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(apiError(429, { retryAfter: 900 }))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 900,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('reports a 403 as needing the partner token', async () => {
		const error = apiError(403);
		// Privileged calls such as user creation need the partner token, so this
		// is the expected answer for a normal key rather than a bad one.
		expect(classify(error)).toBe('PARTNER_TOKEN_REQUIRED_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404', async () => {
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry a 400', async () => {
		const error = apiError(400);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 5xx on a read', async () => {
		const error = apiError(500, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'PUT', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have gone through',
		async (method) => {
			expect(classify(apiError(500, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
