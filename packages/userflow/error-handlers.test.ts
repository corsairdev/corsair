import { ZodError } from 'zod';
import { UserflowAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	invalidEnvKey,
	invalidPersonalKey,
	pendingInvite,
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

function apiError(
	status: number,
	// unknown: each case passes one of Userflow's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new UserflowAPIError(`Userflow ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Userflow error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Userflow sends one', async () => {
		const error = apiError(429, rateLimited, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['GET', 'POST', 'PATCH', 'DELETE'])(
		'retries a rate-limited %s, which was refused before it ran',
		async (method) => {
			expect(classify(apiError(429, rateLimited, { method }))).toBe(
				'RATE_LIMIT_ERROR',
			);
		},
	);

	it('does not retry a 401', async () => {
		const error = apiError(401, invalidEnvKey);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry the personal-key code, which needs a different key', async () => {
		const error = apiError(401, invalidPersonalKey);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats the env-key code as auth even without a status', async () => {
		const error = new UserflowAPIError('failed', { body: invalidEnvKey });
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a 403, which a permission change would have to fix', async () => {
		const error = apiError(403, {
			error: { code: 'forbidden', message: 'No' },
		});
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404', async () => {
		const error = apiError(404, {
			error: { code: 'not_found', message: 'No' },
		});
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 405, 406, 415])('does not retry a %i', async (status) => {
		expect(classify(apiError(status, pendingInvite))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 500 on a read', async () => {
		const error = apiError(500, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('replays a 503 after 15 seconds of queueing', async () => {
		const error = apiError(503, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'PATCH', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have gone through',
		async (method) => {
			expect(classify(apiError(500, {}, { method }))).toBe('SERVER_ERROR');
			expect(await strategy(apiError(500, {}, { method }))).toEqual({
				maxRetries: 0,
			});
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('something else'))).toBe('DEFAULT');
	});
});
