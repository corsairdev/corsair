import { ZodError } from 'zod';
import { UptimeRobotAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	invalidToken,
	notFound,
	rateLimited,
	validationFailure,
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
	// unknown: each case passes one of UptimeRobot's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new UptimeRobotAPIError(`UptimeRobot ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('UptimeRobot error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when UptimeRobot sends one', async () => {
		const error = apiError(429, rateLimited, { retryAfter: 5000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
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
		const error = apiError(401, invalidToken);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats the invalid token code as an auth error without a status', async () => {
		const error = new UptimeRobotAPIError('failed', { body: invalidToken });
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a 403, which a plan upgrade would have to fix', async () => {
		const error = apiError(403, { code: '009-010', message: 'Plan limit.' });
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404', async () => {
		const error = apiError(404, notFound);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 422])('does not retry a %i', async (status) => {
		const error = apiError(status, validationFailure);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('replays a 5xx on a read', async () => {
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
			const error = apiError(500, {}, { method });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('does not replay a 5xx whose method is unknown', async () => {
		const error = apiError(500);
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something else');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});
