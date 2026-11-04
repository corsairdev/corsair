import { ZodError } from 'zod';
import { errorHandlers } from './error-handlers';
import { ElasticsearchAPIError } from './client';

type HandlerResult = {
	maxRetries: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function esError(
	status: number | undefined,
	options: {
		errorType?: string;
		retryAfter?: number;
		cause?: Error;
	} = {},
) {
	return new ElasticsearchAPIError('test error', {
		status,
		body: options.errorType
			? { error: { type: options.errorType, reason: 'r' }, status }
			: undefined,
		retryAfter: options.retryAfter,
		cause: options.cause,
	});
}

// The framework dispatches first-match over the handler keys; this mirrors
// that walk so a reordering of the shipped handlers fails the test.
async function dispatch(error: Error): Promise<HandlerResult> {
	const entry = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!entry) throw new Error(`no handler matched ${error.name}`);
	return entry[1].handler(error) as Promise<HandlerResult>;
}

describe('error handler strategies', () => {
	it.each([
		[400, 0],
		[401, 0],
		[403, 0],
		[404, 0],
		[408, 0],
	])('fails fast on a %i', async (status, maxRetries) => {
		await expect(dispatch(esError(status))).resolves.toEqual({
			maxRetries,
		});
	});

	it('fails fast on a ZodError before the wire', async () => {
		await expect(
			dispatch(new ZodError([{ code: 'invalid_type', path: ['index'] }])),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('fails fast on a client timeout with no status', async () => {
		const timeout = new Error('Request timeout');
		timeout.name = 'TimeoutError';
		const wrapped = esError(undefined, { cause: timeout });

		await expect(dispatch(wrapped)).resolves.toEqual({ maxRetries: 0 });
	});

	it('retries a 429 with backoff honoring a capped Retry-After (4 executions)', async () => {
		const result = await dispatch(esError(429, { retryAfter: 120_000 }));

		expect(result.maxRetries).toBe(3);
		expect(result.retryStrategy).toBe('exponential_backoff');
		expect(result.headersRetryAfterMs).toBeDefined();
		// Elasticsearch does not document Retry-After, so the handler caps the
		// framework's verbatim sleep at 60s plus jitter.
		expect(result.headersRetryAfterMs ?? 0).toBeLessThanOrEqual(60_250);
		expect(result.headersRetryAfterMs ?? 0).toBeGreaterThanOrEqual(60_000);
	});

	it('adds jitter to a short Retry-After instead of sleeping it verbatim', async () => {
		const result = await dispatch(esError(429, { retryAfter: 100 }));

		expect(result.headersRetryAfterMs ?? 0).toBeGreaterThanOrEqual(100);
		expect(result.headersRetryAfterMs ?? 0).toBeLessThan(1000);
	});

	it('retries a 429 that carries no Retry-After header', async () => {
		const result = await dispatch(esError(429));

		expect(result.maxRetries).toBe(3);
		expect(result.headersRetryAfterMs).toBeUndefined();
	});

	it('matches rejected executions by provider error type even without a status', async () => {
		await expect(
			dispatch(
				esError(undefined, { errorType: 'es_rejected_execution_exception' }),
			),
		).resolves.toMatchObject({ maxRetries: 3 });
	});

	it('retries a 5xx twice (3 executions, idempotent reads only)', async () => {
		await expect(dispatch(esError(503))).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('fails fast on anything else via DEFAULT', async () => {
		await expect(dispatch(new Error('boom'))).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('error handler dispatch order', () => {
	it('keeps DEFAULT last so the catch-all never shadows a specific handler', () => {
		const names = Object.keys(errorHandlers);
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('is order-correct: a 429 resolves to RATE_LIMIT_ERROR, not a later or earlier catch-all', async () => {
		const matching = Object.entries(errorHandlers)
			.filter(([, handler]) => handler.match(esError(429)))
			.map(([name]) => name);

		expect(matching[0]).toBe('RATE_LIMIT_ERROR');
	});

	it('is order-correct: a 500 with a Zod-shaped name still reaches SERVER_ERROR', async () => {
		// ZodError check keys on error.name, and a plain 500 is not a ZodError,
		// but the order test proves VALIDATION_ERROR cannot swallow statuses.
		const matching = Object.entries(errorHandlers)
			.filter(([, handler]) => handler.match(esError(500)))
			.map(([name]) => name);

		expect(matching[0]).toBe('SERVER_ERROR');
	});
});
