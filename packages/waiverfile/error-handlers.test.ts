import { ZodError } from 'zod';
import { WaiverFileAPIError, WaiverFileConfigurationError } from './client';
import { errorHandlers } from './error-handlers';
import { badRequest, invalidKey, routeNotFound } from './test-fixtures';

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
	return new WaiverFileAPIError(`WaiverFile ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('WaiverFile error handlers', () => {
	it('retries a 429 with backoff', async () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(apiError(429, {}, { retryAfter: 500 }))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('treats the 400 Invalid message as an auth failure, not a validation one', async () => {
		// This is the important one: a bad key is a 400 on this API, so the
		// status alone would misclassify it.
		const error = apiError(400, invalidKey);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats 401 and 403 as auth failures', async () => {
		expect(classify(apiError(401, {}))).toBe('AUTH_ERROR');
		expect(classify(apiError(403, {}))).toBe('AUTH_ERROR');
	});

	it('treats a malformed key slot as a configuration error', async () => {
		const error = new WaiverFileConfigurationError('bad key');
		expect(classify(error)).toBe('CONFIGURATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats 404 as not found, which is a missing route here', async () => {
		const error = apiError(404, routeNotFound);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a genuine 400 as a validation failure', async () => {
		const error = apiError(400, badRequest);
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

	it.each(['POST', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have gone through',
		async (method) => {
			expect(classify(apiError(500, {}, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
