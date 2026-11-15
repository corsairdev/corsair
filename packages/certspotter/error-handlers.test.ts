import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
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
	// Widened: every handler here ignores the error, but core passes it.
	const handler: (error: Error) => Promise<unknown> =
		errorHandlers[classify(error)].handler;
	return handler(error);
}

/**
 * Builds core's ApiError the way request() does, with the provider's body
 * carrying a documented code.
 */
function apiError(
	status: number,
	// unknown: the provider's error body, or anything a proxy sends.
	body: unknown = {},
	options: { retryAfter?: number } = {},
) {
	return new ApiError(
		{ method: 'GET', url: 'issuances' },
		{
			url: 'https://api.certspotter.com/v1/issuances',
			ok: false,
			status,
			statusText: '',
			body,
		},
		`Cert Spotter ${status}`,
		options,
	);
}

function codeError(
	status: number,
	code: string,
	options: { retryAfter?: number } = {},
) {
	return apiError(status, { code, message: code }, options);
}

describe('Cert Spotter error handlers', () => {
	it('does not replay a rate limit core already retried', async () => {
		const error = codeError(429, 'rate_limited');
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a rate_limited code as a rate limit whatever the status', () => {
		expect(classify(codeError(403, 'rate_limited'))).toBe('RATE_LIMIT_ERROR');
	});

	it('retries a 429 even with no code in the body', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
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
		const error = apiError(402);
		expect(classify(error)).toBe('QUOTA_ERROR');
	});

	it('does not retry a query timeout', async () => {
		// The plan's query limit is the problem, not the request.
		const error = codeError(400, 'timeout');
		expect(classify(error)).toBe('TIMEOUT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry not_allowed_by_plan', () => {
		expect(classify(codeError(403, 'not_allowed_by_plan'))).toBe('QUOTA_ERROR');
	});

	it('does not replay a lagging firehose client', () => {
		expect(classify(codeError(400, 'lagging_client'))).toBe('CONFLICT_ERROR');
	});

	it.each([400, 403, 404, 405])(
		'treats a bare %i as a validation error',
		(status) => {
			expect(classify(apiError(status))).toBe('VALIDATION_ERROR');
		},
	);

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx, which the provider says is safe with backoff', async () => {
		const error = codeError(503, 'service_outage');
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
