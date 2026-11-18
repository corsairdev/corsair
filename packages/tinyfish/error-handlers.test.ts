import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { z } from 'zod';
import { TinyFishError } from './client';
import { errorHandlers } from './error-handlers';

// The handlers object narrows each match/handler arity; go through the
// framework type so every entry has the uniform (error, context) signature.
const handlers: CorsairErrorHandler = errorHandlers;

function handlerFor(key: string) {
	const entry = handlers[key];
	if (!entry) throw new Error(`missing error handler: ${key}`);
	return entry;
}

function context(originalError: Error): ErrorContext {
	return {
		pluginId: 'tinyfish',
		operation: 'tinyfish.agent.run',
		input: {},
		originalError,
	};
}

async function strategyFor(key: string, error: Error) {
	return handlerFor(key).handler(error, context(error));
}

describe('tinyfish error handlers', () => {
	it('matches zod and invalid-input failures as VALIDATION_ERROR', () => {
		const zodError = new z.ZodError([]);
		expect(
			handlerFor('VALIDATION_ERROR').match(zodError, context(zodError)),
		).toBe(true);

		const unprocessable = new TinyFishError('bad input', { status: 422 });
		expect(
			handlerFor('VALIDATION_ERROR').match(
				unprocessable,
				context(unprocessable),
			),
		).toBe(true);

		const coded = new TinyFishError('bad input', {
			status: 400,
			body: { error: { code: 'INVALID_INPUT', message: 'url is required' } },
		});
		expect(handlerFor('VALIDATION_ERROR').match(coded, context(coded))).toBe(
			true,
		);
	});

	it('retries rate-limited calls with the server delay', async () => {
		const error = new TinyFishError('rate limited', {
			status: 429,
			body: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Slow down' } },
			retryAfter: 1500,
		});
		expect(handlerFor('RATE_LIMIT_ERROR').match(error, context(error))).toBe(
			true,
		);
		await expect(strategyFor('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a daily-limit 429 and surfaces its reset time', async () => {
		const error = new TinyFishError('Daily allowance used', {
			status: 429,
			body: {
				error: {
					code: 'DAILY_LIMIT_EXCEEDED',
					message: 'Daily allowance used',
					details: {
						capability: 'big_search_completion',
						window: 'pacific_day',
						resets_at: '2026-09-10T07:00:00.000Z',
					},
				},
			},
		});
		expect(handlerFor('DAILY_LIMIT_ERROR').match(error, context(error))).toBe(
			true,
		);
		await expect(strategyFor('DAILY_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.message).toBe(
			'Daily allowance used (resets at 2026-09-10T07:00:00.000Z)',
		);

		// The daily allowance arrives as a 429 like a per-minute cap, so the
		// non-retryable handler must win the first-match dispatch.
		const names = Object.keys(handlers);
		expect(names.indexOf('DAILY_LIMIT_ERROR')).toBeLessThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
	});

	it('keeps daily-limit codes out of the retryable rate-limit matcher', () => {
		const coded = new TinyFishError('call failed', {
			status: 400,
			body: { error: { code: 'DAILY_LIMIT_EXCEEDED', message: 'Done' } },
		});
		expect(handlerFor('RATE_LIMIT_ERROR').match(coded, context(coded))).toBe(
			false,
		);
	});

	it('sends a 500 carrying rate-limit text to the no-retry server handler', async () => {
		const error = new TinyFishError('call failed', {
			status: 500,
			body: { message: 'Too many requests' },
		});
		expect(handlerFor('RATE_LIMIT_ERROR').match(error, context(error))).toBe(
			false,
		);

		// Same first-match dispatch the framework runs over the handler keys.
		const winner = Object.keys(handlers).find((name) =>
			handlers[name]?.match(error, context(error)),
		);
		expect(winner).toBe('SERVER_ERROR');
		await expect(strategyFor('SERVER_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a profile-setup conflict briefly with backoff', async () => {
		const conflict = new TinyFishError('Setup session is busy', {
			status: 409,
			body: {
				error: { code: 'RETRY_REQUIRED', message: 'Setup session is busy' },
			},
		});
		expect(
			handlerFor('RETRY_REQUIRED_ERROR').match(conflict, context(conflict)),
		).toBe(true);
		await expect(
			strategyFor('RETRY_REQUIRED_ERROR', conflict),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		const codedOnly = new TinyFishError('Retry required', {
			body: { error: { code: 'RETRY_REQUIRED', message: 'Retry required' } },
		});
		expect(
			handlerFor('RETRY_REQUIRED_ERROR').match(codedOnly, context(codedOnly)),
		).toBe(true);
		expect(
			handlerFor('RETRY_REQUIRED_ERROR').match(
				new TinyFishError('Not a conflict', { status: 400 }),
				context(new TinyFishError('Not a conflict', { status: 400 })),
			),
		).toBe(false);
	});

	it('does not retry auth failures', async () => {
		const error = new TinyFishError('Unauthorized', { status: 401 });
		expect(handlerFor('AUTH_ERROR').match(error, context(error))).toBe(true);
		await expect(strategyFor('AUTH_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});

		const bodyOnly = new TinyFishError('Request failed', {
			status: 400,
			body: { error: { code: 'MISSING_API_KEY', message: 'No key' } },
		});
		expect(handlerFor('AUTH_ERROR').match(bodyOnly, context(bodyOnly))).toBe(
			true,
		);
	});

	it('does not retry forbidden features', async () => {
		const error = new TinyFishError('Forbidden', { status: 403 });
		expect(handlerFor('FORBIDDEN_ERROR').match(error, context(error))).toBe(
			true,
		);

		const coded = new TinyFishError('Request failed', {
			status: 400,
			body: {
				error: { code: 'FEATURE_NOT_AVAILABLE', message: 'Research is off' },
			},
		});
		expect(handlerFor('FORBIDDEN_ERROR').match(coded, context(coded))).toBe(
			true,
		);
		await expect(strategyFor('FORBIDDEN_ERROR', coded)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry an empty wallet', async () => {
		const error = new TinyFishError('Payment required', { status: 402 });
		expect(
			handlerFor('PAYMENT_REQUIRED_ERROR').match(error, context(error)),
		).toBe(true);
		await expect(strategyFor('PAYMENT_REQUIRED_ERROR', error)).resolves.toEqual(
			{ maxRetries: 0 },
		);

		const coded = new TinyFishError('Request failed', {
			status: 400,
			body: {
				error: { code: 'INSUFFICIENT_CREDITS', message: 'Top up first' },
			},
		});
		expect(
			handlerFor('PAYMENT_REQUIRED_ERROR').match(coded, context(coded)),
		).toBe(true);
	});

	it('maps 404s without retrying and leaves 400s alone', async () => {
		const notFound = new TinyFishError('Not found', { status: 404 });
		expect(
			handlerFor('NOT_FOUND_ERROR').match(notFound, context(notFound)),
		).toBe(true);
		await expect(strategyFor('NOT_FOUND_ERROR', notFound)).resolves.toEqual({
			maxRetries: 0,
		});

		const badRequest = new TinyFishError('Bad Request', { status: 400 });
		expect(
			handlerFor('NOT_FOUND_ERROR').match(badRequest, context(badRequest)),
		).toBe(false);
	});

	it('does not replay server failures (a run may be mid-step)', async () => {
		for (const status of [500, 502, 503]) {
			const error = new TinyFishError('Server error', { status });
			expect(handlerFor('SERVER_ERROR').match(error, context(error))).toBe(
				true,
			);
			await expect(strategyFor('SERVER_ERROR', error)).resolves.toEqual({
				maxRetries: 0,
			});
		}
		const clientError = new TinyFishError('bad', { status: 400 });
		expect(
			handlerFor('SERVER_ERROR').match(clientError, context(clientError)),
		).toBe(false);
	});

	it('does not replay timeouts for the same billing reason', async () => {
		for (const message of [
			'Request timeout',
			'operation timed out',
			'aborted',
		]) {
			const error = new TinyFishError(message);
			expect(handlerFor('TIMEOUT_ERROR').match(error, context(error))).toBe(
				true,
			);
			await expect(strategyFor('TIMEOUT_ERROR', error)).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('falls back to no retries for anything unmatched', async () => {
		const error = new Error('something else');
		expect(handlerFor('DEFAULT').match(error, context(error))).toBe(true);
		await expect(strategyFor('DEFAULT', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
