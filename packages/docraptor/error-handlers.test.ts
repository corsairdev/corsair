import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { throttleError } from './test-fixtures';

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
	message: string,
	options: { retryAfter?: number; method?: string } = {},
) {
	// DocRaptor's errors come as XML; the message sits in the body.
	return new ApiError(
		{
			method: (options.method ?? 'GET') as 'GET',
			url: '/status/abc',
		},
		{
			url: 'https://api.docraptor.com/status/abc',
			ok: false,
			status,
			statusText: '',
			body: `<errors><error>${message}</error></errors>`,
		},
		message,
		options.retryAfter === undefined
			? undefined
			: { retryAfter: options.retryAfter },
	);
}

describe('DocRaptor error handlers', () => {
	it('retries the 403 concurrency throttle once on a GET read', async () => {
		const error = apiError(403, throttleError, { method: 'GET' });
		expect(classify(error)).toBe('THROTTLE_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 1,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('passes a Retry-After header through the throttle handler', async () => {
		const error = apiError(403, throttleError, {
			method: 'GET',
			retryAfter: 1500,
		});
		const plan = await strategy(error);
		expect(plan.maxRetries).toBe(1);
		// Only a plan type that core reads a delay from; the header is the
		// fixed delay applied verbatim.
		expect((plan as { headersRetryAfterMs?: number }).headersRetryAfterMs).toBe(
			1500,
		);
	});

	it.each([
		['POST', 'documents.createAsync'],
		['PATCH', 'documents.expire'],
	])('does not retry the throttle on a %s write', (method) => {
		const error = apiError(403, throttleError, { method });
		expect(classify(error)).not.toBe('THROTTLE_ERROR');
	});

	it('treats a 403 without the throttle message as a permission error', async () => {
		const error = apiError(403, 'Please provide a valid API key.', {
			method: 'GET',
		});
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('never retries a 401', async () => {
		const error = apiError(401, 'Please provide a valid API key.');
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('never retries a 400 or 404', async () => {
		for (const status of [400, 404]) {
			const error = apiError(status, 'nope');
			expect(classify(error)).toBe('VALIDATION_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('never retries a schema rejection', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('replays a 5xx on a GET read with backoff', async () => {
		const error = apiError(503, 'service unavailable', { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		[
			'POST',
			'a failed-looking create may have gone through and has no idempotency key',
		],
		['PATCH', 'expire permanently removes a hosted document'],
	])('does not replay a 5xx %s: %s', (method) => {
		const error = apiError(500, 'boom', { method });
		expect(classify(error)).toBe('DEFAULT');
		expect(classify(error)).not.toBe('SERVER_ERROR');
	});

	it('does not replay a transport failure (no status, method unknown)', () => {
		expect(classify(new TypeError('fetch failed'))).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	const context = {
		pluginId: 'docraptor',
		operation: 'documents.status',
		input: {},
		originalError: new Error('original'),
	};
	const builtin = errorHandlers;

	it('keeps DEFAULT last and caller keys first', () => {
		const merged = mergeErrorHandlers(builtin, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(
			names.indexOf('THROTTLE_ERROR'),
		);
		for (const name of Object.keys(builtin)) {
			expect(names).toContain(name);
		}
	});

	it('gives a caller handler for an uncovered status the position, not DEFAULT', () => {
		const callerHandler = {
			match: (error: Error) =>
				error instanceof ApiError && error.status === 418,
			handler: async () => ({ maxRetries: 4 }),
		};
		const merged = mergeErrorHandlers(builtin, { TEAPOT_ERROR: callerHandler });
		// First match in key order wins; TEAPOT_ERROR must sit before DEFAULT.
		const teapot = apiError(418, "I'm a teapot");
		const first = (Object.keys(merged) as HandlerName[]).find((key) =>
			merged[key]?.match(teapot, context),
		);
		expect(first).toBe('TEAPOT_ERROR');
	});

	it('lets the caller replace a builtin handler by key', () => {
		const merged = mergeErrorHandlers(builtin, {
			SERVER_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		expect(
			merged.SERVER_ERROR?.handler(undefined as never, context),
		).resolves.toEqual({ maxRetries: 9 });
	});

	it('uses the caller DEFAULT when one is given', () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 5 }) },
		});
		expect(
			merged.DEFAULT?.handler(new Error('anything'), context),
		).resolves.toEqual({ maxRetries: 5 });
	});

	it('returns the builtin map untouched without a caller', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});
});
