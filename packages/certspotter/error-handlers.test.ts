import { ZodError } from 'zod';
import { CertSpotterAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	badCredentials,
	laggingClient,
	paymentRequired,
	queryTimeout,
	rateLimited,
} from './test-fixtures';

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

/**
 * Builds an error carrying a documented code, the way the client does when it
 * reads the provider's body.
 */
function codeError(
	status: number,
	code: string,
	options: { retryAfter?: number } = {},
) {
	const error = new CertSpotterAPIError(`Cert Spotter ${status} ${code}`, {
		status,
		...options,
	});
	// The code comes from the body, which the client keeps; set it directly so
	// the test does not have to reproduce the ApiError.
	Object.defineProperty(error, 'code', { value: code, enumerable: true });
	return error;
}

describe('Cert Spotter error handlers', () => {
	it('retries rate_limited with backoff', async () => {
		const error = codeError(429, 'rate_limited');
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 429 even with no code in the body', async () => {
		const error = new CertSpotterAPIError('Cert Spotter 429', { status: 429 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('honours Retry-After on a rate limit', async () => {
		const error = codeError(429, 'rate_limited', { retryAfter: 12000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 12000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['bad_credentials', 401],
		['disabled_credentials', 401],
		['unauthorized', 403],
	])('treats %s as an auth error', (code, status) => {
		expect(classify(codeError(status, code))).toBe('AUTH_ERROR');
	});

	it('does not retry an auth error', async () => {
		expect(await strategy(codeError(401, 'bad_credentials'))).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry payment_required', async () => {
		const error = codeError(400, 'payment_required');
		expect(classify(error)).toBe('QUOTA_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 402', () => {
		const error = new CertSpotterAPIError('Cert Spotter 402', { status: 402 });
		expect(classify(error)).toBe('QUOTA_ERROR');
	});

	it('does not retry a query timeout', async () => {
		// The plan's query limit is the problem, not the request.
		const error = codeError(400, 'timeout');
		expect(classify(error)).toBe('TIMEOUT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a lagging firehose client', () => {
		expect(classify(codeError(400, 'lagging_client'))).toBe('CONFLICT_ERROR');
	});

	it.each([400, 403, 404, 405])(
		'treats a bare %i as a validation error',
		(status) => {
			expect(classify(new CertSpotterAPIError('x', { status }))).toBe(
				'VALIDATION_ERROR',
			);
		},
	);

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx, which the provider says is safe with backoff', async () => {
		const error = new CertSpotterAPIError('Cert Spotter 503 service_outage', {
			status: 503,
		});
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
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

	it('classifies every documented non-success code', () => {
		// The full list from the reference's error table, so a new handler cannot
		// silently fall through to DEFAULT.
		const cases: [string, number][] = [
			['bad_credentials', 401],
			['disabled_credentials', 401],
			['unauthorized', 403],
			['payment_required', 400],
			['not_allowed_by_plan', 403],
			['rate_limited', 429],
			['timeout', 400],
			['lagging_client', 400],
			['bad_request', 400],
			['bad_query', 400],
			['missing_field', 400],
			['invalid_value', 400],
			['out_of_range', 400],
			['method_not_allowed', 405],
			['internal_error', 500],
			['service_outage', 503],
		];
		for (const [code, status] of cases) {
			expect(classify(codeError(status, code))).not.toBe('DEFAULT');
		}
		// The two fixture bodies used above are in that list.
		expect(paymentRequired.code).toBe('payment_required');
		expect(queryTimeout.code).toBe('timeout');
		expect(laggingClient.code).toBe('lagging_client');
		expect(paymentRequired.code).toBe('payment_required');
		expect(rateLimited.code).toBe('rate_limited');
		expect(badCredentials.code).toBe('bad_credentials');
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
