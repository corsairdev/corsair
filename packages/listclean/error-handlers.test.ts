import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { ListcleanRequest } from './client';
import { makeListcleanRequest } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	captureError,
	currentFetch,
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

// Widened to the core interface, whose handler and match take both arguments.
const handlers: CorsairErrorHandler = errorHandlers;

// Handlers match in key order, so the first entry whose match passes decides.
// unknown: each branch returns a different plan shape, so the decision is
// untyped until the assertion narrows it.
function decide(error: Error): { name: string; decision: unknown } {
	for (const [name, entry] of Object.entries(handlers)) {
		if (name === 'DEFAULT') continue;
		if (entry?.match(error, {} as never)) {
			return { name, decision: entry.handler(error, {} as never) };
		}
	}
	return {
		name: 'DEFAULT',
		decision: handlers.DEFAULT?.handler(error, {} as never),
	};
}

// unknown: same shape variety as decide(); assertions narrow each plan.
async function planOf(error: Error): Promise<{ name: string; plan: unknown }> {
	const { name, decision } = decide(error);
	return { name, plan: await (decision as Promise<{ maxRetries: number }>) };
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

/** The error the client throws for this answer, with its request facts attached. */
async function errorFrom(
	answer: Response | Error,
	request: Partial<ListcleanRequest> = {},
): Promise<Error> {
	if (answer instanceof Error) currentFetch().mockRejectedValueOnce(answer);
	else mockFetch(answer);
	const error = await captureError(
		makeListcleanRequest('lc-key', {
			method: 'GET',
			path: '/credits',
			replayable: true,
			...request,
		}),
	);
	if (!(error instanceof Error)) throw new Error('expected an Error');
	return error;
}

function status(code: number, message = 'failed'): Response {
	return jsonResponse({ success: 0, error_code: 0, message }, { status: code });
}

describe('Listclean error handlers', () => {
	it('leaves 429 retries to core and passes Retry-After through', async () => {
		const limited = new ApiError(
			{ method: 'GET', url: '/credits' },
			{
				url: '',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Slow',
			{ retryAfter: 3000 },
		);
		const { name, plan } = await planOf(limited);
		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(plan).toEqual({ maxRetries: 0, headersRetryAfterMs: 3000 });
	});

	it('does not retry a refused key (401)', async () => {
		const { name, plan } = await planOf(
			await errorFrom(status(401, 'Invalid token or token expired')),
		);
		expect(name).toBe('AUTH_ERROR');
		expect(plan).toEqual({ maxRetries: 0 });
	});

	it('does not retry invalid input (400) or a missing route (404)', async () => {
		const badRequest = await planOf(
			await errorFrom(status(400, 'Parameter emails is required')),
		);
		expect(badRequest.name).toBe('VALIDATION_ERROR');
		const notFound = await planOf(
			await errorFrom(
				new Response('<html>404</html>', {
					status: 404,
					headers: { 'Content-Type': 'text/html' },
				}),
			),
		);
		expect(notFound.name).toBe('VALIDATION_ERROR');
		expect(notFound.plan).toEqual({ maxRetries: 0 });
	});

	it('replays a read after a 5xx and never a billed or destructive call', async () => {
		const read = await planOf(await errorFrom(status(500)));
		expect(read.name).toBe('SERVER_ERROR');
		expect(read.plan).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		const billed = await planOf(
			await errorFrom(status(500), {
				path: '/verify/email/a%40example.com',
				replayable: false,
			}),
		);
		expect(billed.plan).toEqual({ maxRetries: 0 });

		const destroyed = await planOf(
			await errorFrom(status(503), {
				method: 'DELETE',
				path: '/lists/1',
				replayable: false,
			}),
		);
		expect(destroyed.plan).toEqual({ maxRetries: 0 });
	});

	it('replays a dropped connection only when the operation is replayable', async () => {
		const read = await planOf(await errorFrom(new TypeError('fetch failed')));
		expect(read.name).toBe('TRANSPORT_ERROR');
		expect(read.plan).toMatchObject({ maxRetries: 2 });

		const billed = await planOf(
			await errorFrom(new TypeError('fetch failed'), {
				method: 'POST',
				path: '/verify/email/batch',
				replayable: false,
			}),
		);
		expect(billed.plan).toEqual({ maxRetries: 0 });
	});

	it('sends a 200 envelope failure to DEFAULT with no retries', async () => {
		const { name, plan } = await planOf(
			await errorFrom(status(200, 'Insufficient credits')),
		);
		expect(name).toBe('DEFAULT');
		expect(plan).toEqual({ maxRetries: 0 });
	});

	it('sends an unexpected error to DEFAULT with no retries', async () => {
		const { name, plan } = await planOf(new Error('something else'));
		expect(name).toBe('DEFAULT');
		expect(plan).toEqual({ maxRetries: 0 });
	});

	it('lets a caller override a handler, adds unnamed builtins after, and keeps DEFAULT last', () => {
		const callerCustom: { match: (error: Error) => boolean } = {
			match: (error) => error.message.includes('custom'),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
			CUSTOM: {
				match: callerCustom.match,
				handler: async () => ({ maxRetries: 0 }),
			},
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
		});

		const keys = Object.keys(merged);
		// The caller's value wins the AUTH_ERROR slot, the builtin entries the
		// caller did not name survive, and DEFAULT closes the map.
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys.indexOf('CUSTOM')).toBeLessThan(
			keys.indexOf('RATE_LIMIT_ERROR'),
		);
		for (const builtin of [
			'RATE_LIMIT_ERROR',
			'SERVER_ERROR',
			'TRANSPORT_ERROR',
		]) {
			expect(merged[builtin]).toBeDefined();
		}
	});
});
