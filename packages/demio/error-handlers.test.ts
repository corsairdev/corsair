import type { CorsairErrorHandler } from 'corsair/core';
import { DemioAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	dailyLimit,
	eventNotFound,
	inactiveAccount,
	rateLimited,
	serverFault,
	unauthorized,
} from './test-fixtures';

/** Builds the error the client would raise for a documented response. */
function apiError(
	status: number,
	body: { messages?: string[]; errors?: string[] },
	method = 'GET',
): DemioAPIError {
	return new DemioAPIError(`Demio ${status}`, {
		status,
		method,
		messages: body.messages,
		errors: body.errors,
	});
}

/** Finds the first handler that matches, the way core resolves them. */
async function resolve(error: Error) {
	for (const [name, entry] of Object.entries(errorHandlers)) {
		if (!entry.match(error)) continue;
		return { name, result: await entry.handler(error) };
	}
	throw new Error('No handler matched, which DEFAULT should prevent');
}

describe('error handler classification', () => {
	it('treats the per-minute limit as retryable', async () => {
		const { name, result } = await resolve(apiError(417, rateLimited));

		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	// Both limits share a status, so the daily allowance has to win on its
	// message or the client spends three attempts on a permanent failure.
	it('never retries a spent daily allowance', async () => {
		const { name, result } = await resolve(apiError(417, dailyLimit));

		expect(name).toBe('QUOTA_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a rejected credential', async () => {
		const { name, result } = await resolve(apiError(401, unauthorized));

		expect(name).toBe('AUTH_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	// 403 carries two unrelated meanings and only the body separates them.
	it('reads an inactive account as an auth problem', async () => {
		const { name } = await resolve(apiError(403, inactiveAccount));

		expect(name).toBe('AUTH_ERROR');
	});

	it('reads an id the account may not use as a permission problem', async () => {
		const { name } = await resolve(
			apiError(403, { errors: ["You haven't access to this Event"] }),
		);

		expect(name).toBe('PERMISSION_ERROR');
	});

	it('does not retry a rejected payload', async () => {
		const { name, result } = await resolve(
			apiError(400, { errors: ['Email is not valid'] }, 'POST'),
		);

		expect(name).toBe('VALIDATION_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a missing or filtered-out event', async () => {
		const { name, result } = await resolve(apiError(404, eventNotFound));

		expect(name).toBe('VALIDATION_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a schema failure before any request', async () => {
		const zodLike = Object.assign(new Error('Invalid input'), {
			name: 'ZodError',
		});

		const { name } = await resolve(zodLike);

		expect(name).toBe('VALIDATION_ERROR');
	});
});

describe('server failures', () => {
	it('retries a 500 on a read', async () => {
		const { name, result } = await resolve(apiError(500, serverFault, 'GET'));

		expect(name).toBe('SERVER_ERROR');
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	// A registration that failed this way may already exist at Demio, and the
	// API takes no idempotency key, so replaying it could duplicate a registrant.
	it('never replays a write', async () => {
		const { name, result } = await resolve(apiError(500, serverFault, 'POST'));

		expect(name).toBe('DEFAULT');
		expect(result.maxRetries).toBe(0);
	});

	it('never replays a PUT', async () => {
		const { name } = await resolve(apiError(502, serverFault, 'PUT'));

		expect(name).toBe('DEFAULT');
	});
});

describe('unrecognised failures', () => {
	it('falls back to no retry', async () => {
		const { name, result } = await resolve(new Error('something odd'));

		expect(name).toBe('DEFAULT');
		expect(result.maxRetries).toBe(0);
	});

	it('keeps DEFAULT last so a specific handler is reached first', async () => {
		const names = Object.keys(errorHandlers);
		expect(names.at(-1)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers;

	it('returns the builtins unchanged when the caller adds nothing', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	// A caller's handler for a status no builtin covers has to run, and a plain
	// spread would keep the builtin position where DEFAULT claims it first.
	it('puts a caller handler before DEFAULT so it can match', async () => {
		const custom = {
			CUSTOM: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		} as CorsairErrorHandler;

		const merged = mergeErrorHandlers(builtin, custom);
		const names = Object.keys(merged);

		expect(names[0]).toBe('CUSTOM');
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('keeps the caller value for a handler both declare', async () => {
		const custom = {
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		} as CorsairErrorHandler;

		const merged = mergeErrorHandlers(builtin, custom);
		const result = await merged.RATE_LIMIT_ERROR?.handler(
			new Error('x'),
			// never: the handler under test ignores its context argument.
			{} as never,
		);

		expect(result).toEqual({ maxRetries: 9 });
	});

	it('uses the caller DEFAULT when one is given', async () => {
		const custom = {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 4 }),
			},
		} as CorsairErrorHandler;

		const merged = mergeErrorHandlers(builtin, custom);
		const result = await merged.DEFAULT?.handler(new Error('x'), {} as never);

		expect(result).toEqual({ maxRetries: 4 });
	});

	it('keeps every builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(builtin, {} as CorsairErrorHandler);

		for (const name of Object.keys(builtin)) {
			expect(merged).toHaveProperty(name);
		}
	});
});
