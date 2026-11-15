import { ZodError } from 'zod';
import { UserlistAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	rateLimited,
	tooLarge,
	unauthorized,
	unprocessable,
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
	// unknown: each case passes one of the Push API's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new UserlistAPIError(`Userlist ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Userlist error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Userlist sends one', async () => {
		const error = apiError(429, rateLimited, { retryAfter: 3000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a rate-limited write, which never ran', async () => {
		expect(classify(apiError(429, rateLimited, { method: 'POST' }))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('does not retry a 401', async () => {
		const error = apiError(401, unauthorized);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats the unauthorized code as auth without a status', async () => {
		const error = new UserlistAPIError('failed', { body: unauthorized });
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a 403, which a plan change would have to fix', async () => {
		expect(classify(apiError(403, { code: 'forbidden' }))).toBe(
			'PERMISSION_ERROR',
		);
	});

	it('does not retry a 404', async () => {
		expect(classify(apiError(404, { code: 'not_found' }))).toBe(
			'NOT_FOUND_ERROR',
		);
	});

	it('does not retry a 413, since the same body will always be refused', async () => {
		const error = apiError(413, tooLarge);
		expect(classify(error)).toBe('PAYLOAD_TOO_LARGE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422', async () => {
		const error = apiError(422, unprocessable);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it.each([500, 502, 503])(
		'does not replay a %i, since a write may already be queued',
		async (status) => {
			const error = apiError(status, {}, { method: 'POST' });
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('something else'))).toBe('DEFAULT');
	});
});
