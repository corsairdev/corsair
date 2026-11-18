import { ZodError } from 'zod';
import { WoodpeckerCoAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { v1BadKey, v1Error, v1RateLimited, v2Domain } from './test-fixtures';

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
	// unknown: each case passes one of Woodpecker's four error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new WoodpeckerCoAPIError(`Woodpecker ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Woodpecker error handlers', () => {
	it('retries a v2 429 with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a v1 409 E_TOO_MANY_REQUESTS with backoff', async () => {
		const error = apiError(409, v1RateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['GET', 429],
		['POST', 429],
		['POST', 409],
	])(
		'retries a rate-limited %s %i, which never ran',
		async (method, status) => {
			const error = apiError(status, v1RateLimited, { method });
			expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		},
	);

	it('honours Retry-After when Woodpecker sends one', async () => {
		const error = apiError(409, v1RateLimited, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		'VALIDATION_FAILURE',
		'API_UNSUPPORTED_CAMPAIGN_FEATURES',
		'BRANCH_NOT_DELETABLE',
		'NOT_EDITABLE_STATUS',
	])('does not retry a v2 409 %s, which is no rate limit', async (code) => {
		const error = apiError(409, v2Domain(code, 'refused'));
		expect(classify(error)).toBe('CONFLICT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401 from either API version', async () => {
		for (const error of [apiError(401), apiError(401, v1BadKey)]) {
			expect(classify(error)).toBe('AUTH_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('does not retry a 403 from either API version', async () => {
		const bodies = [
			v1Error('E_NO_PERMISSION', 'Api access denied.'),
			v2Domain('MISSING_FEATURES', 'Upgrade your plan'),
		];
		for (const body of bodies) {
			const error = apiError(403, body);
			expect(classify(error)).toBe('PERMISSION_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
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
		const error = apiError(status, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'DELETE'])('does not replay a failed %s', async (method) => {
		const error = apiError(500, {}, { method });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a write that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new WoodpeckerCoAPIError(timeout.message, {
			cause: timeout,
			method: 'POST',
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});
