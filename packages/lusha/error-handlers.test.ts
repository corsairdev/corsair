import { ApiError } from 'corsair/http';
import { makeLushaRequest } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { outOfCreditsBody, rateLimitedBody } from './test-fixtures';
import {
	currentFetch,
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

function handler(name: keyof typeof errorHandlers) {
	return errorHandlers[name];
}

/** The first handler whose match passes, the way core picks one. */
function pick(error: Error): string {
	for (const [name, entry] of Object.entries(errorHandlers)) {
		if (entry.match(error)) return name;
	}
	return 'none';
}

/** An error built the way client.ts builds it for an HTTP status. */
// unknown: the response body is arbitrary JSON.
async function httpError(
	status: number,
	body: unknown,
	replayable = false,
): Promise<Error> {
	mockFetch(jsonResponse(body, { status }));
	return makeLushaRequest('key', {
		method: replayable ? 'GET' : 'POST',
		path: '/v3/test',
		body: replayable ? undefined : {},
		replayable,
	}).then(
		() => {
			throw new Error('expected a failure');
		},
		(caught: Error) => caught,
	);
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Lusha error handler matching', () => {
	it('sends 402 to the fatal credit handler', async () => {
		const error = await httpError(402, outOfCreditsBody);
		expect(error).toBeInstanceOf(ApiError);
		expect(pick(error)).toBe('OUT_OF_CREDITS_ERROR');
		await expect(
			handler('OUT_OF_CREDITS_ERROR').handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a 429 again: core request() already retried it', async () => {
		// Core makes four attempts (one plus three retries) before throwing.
		for (let attempt = 0; attempt < 3; attempt++) {
			mockFetch(jsonResponse(rateLimitedBody, { status: 429 }));
		}
		const error = await httpError(429, rateLimitedBody, true);
		expect(currentFetch()).toHaveBeenCalledTimes(4);
		expect(pick(error)).toBe('RATE_LIMIT_ERROR');
		await expect(handler('RATE_LIMIT_ERROR').handler(error)).resolves.toEqual({
			maxRetries: 0,
		});
	}, 20_000);

	it.each([
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[400, 'VALIDATION_ERROR'],
		[404, 'VALIDATION_ERROR'],
		[409, 'VALIDATION_ERROR'],
		[451, 'VALIDATION_ERROR'],
	])('sends %i to %s with no retry', async (status, name) => {
		const error = await httpError(status, { statusCode: status, message: 'x' });
		expect(pick(error)).toBe(name);
		await expect(
			handler(name as keyof typeof errorHandlers).handler(error),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a 5xx only when the request was a free read', async () => {
		const free = await httpError(503, { statusCode: 503 }, true);
		const metered = await httpError(503, { statusCode: 503 }, false);
		expect(pick(free)).toBe('SERVER_ERROR');
		expect(pick(metered)).toBe('SERVER_ERROR');
		await expect(handler('SERVER_ERROR').handler(free)).resolves.toMatchObject({
			maxRetries: 2,
		});
		await expect(
			handler('SERVER_ERROR').handler(metered),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('retries a network failure only when the request was a free read', async () => {
		currentFetch().mockRejectedValueOnce(new TypeError('fetch failed'));
		const free = await makeLushaRequest('key', {
			method: 'GET',
			path: '/v3/account/usage',
			replayable: true,
		}).catch((caught: Error) => caught);
		currentFetch().mockRejectedValueOnce(new TypeError('fetch failed'));
		const metered = await makeLushaRequest('key', {
			method: 'POST',
			path: '/v3/contacts/enrich',
			body: { ids: ['1'] },
		}).catch((caught: Error) => caught);
		expect(pick(free as Error)).toBe('NETWORK_ERROR');
		await expect(
			handler('NETWORK_ERROR').handler(free as Error),
		).resolves.toMatchObject({ maxRetries: 2 });
		await expect(
			handler('NETWORK_ERROR').handler(metered as Error),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('sends input validation errors to VALIDATION_ERROR', () => {
		const error = new Error('bad input');
		error.name = 'ZodError';
		expect(pick(error)).toBe('VALIDATION_ERROR');
	});
});

describe('mergeErrorHandlers', () => {
	it('puts caller handlers first and keeps DEFAULT last', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 5 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_HANDLER: custom,
		});
		const names = Object.keys(merged);
		expect(names[0]).toBe('MY_HANDLER');
		expect(names[names.length - 1]).toBe('DEFAULT');
	});

	it('lets a caller replace a builtin and DEFAULT', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: custom,
			DEFAULT: custom,
		});
		expect(merged.AUTH_ERROR).toBe(custom);
		expect(merged.DEFAULT).toBe(custom);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtins unchanged with no caller handlers', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
