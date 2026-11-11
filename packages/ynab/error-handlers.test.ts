import { ZodError } from 'zod';
import { YnabAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	badRequest,
	notFound,
	rateLimited,
	subscriptionLapsed,
	unauthorized,
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

function apiError(
	status: number,
	// unknown: each case passes one of the API's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new YnabAPIError(`YNAB ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('YNAB error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when YNAB sends one', async () => {
		const error = apiError(429, rateLimited, { retryAfter: 4000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401', async () => {
		const error = apiError(401, unauthorized);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats the unauthorized name as auth without a status', async () => {
		const error = new YnabAPIError('x', { body: unauthorized });
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('reports a 403 as a lapsed subscription, which no retry fixes', async () => {
		const error = apiError(403, subscriptionLapsed);
		expect(classify(error)).toBe('SUBSCRIPTION_LAPSED_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404', async () => {
		const error = apiError(404, notFound);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 409, 422])('does not retry a %i', async (status) => {
		const error = apiError(status, badRequest);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 5xx on a read', async () => {
		const error = apiError(500, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have gone through',
		async (method) => {
			expect(classify(apiError(500, {}, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
