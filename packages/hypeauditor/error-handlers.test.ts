import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { HypeAuditorAPIError, HypeAuditorTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = Exclude<keyof typeof errorHandlers, 'DEFAULT'>;

const handlers: CorsairErrorHandler = errorHandlers;

function entry(name: keyof CorsairErrorHandler) {
	const found = handlers[name];
	if (!found) throw new Error(`No handler registered as ${name}`);
	return found;
}

const context: ErrorContext = {
	pluginId: 'hypeauditor',
	operation: 'reports.youtube',
	input: {},
	originalError: new Error('placeholder'),
};

function failure(
	status: number | undefined,
	options: { code?: number; replayable?: boolean; retryAfter?: number } = {},
): HypeAuditorAPIError {
	return new HypeAuditorAPIError('boom', {
		status,
		code: options.code,
		retryAfter: options.retryAfter,
		method: 'GET',
		replayable: options.replayable ?? true,
	});
}

async function decide(
	name: HandlerName,
	error: Error,
): Promise<{ maxRetries?: number; headersRetryAfterMs?: number }> {
	const named = entry(name);
	if (!named.match(error, context)) {
		throw new Error(`${name} does not match ${error.message}`);
	}
	return named.handler(error, context);
}

describe('error handlers', () => {
	it('classifies each documented failure status to one handler', () => {
		const cases: Array<[number, HandlerName]> = [
			[402, 'QUOTA_ERROR'],
			[403, 'AUTH_ERROR'],
			[404, 'NOT_FOUND_ERROR'],
			[405, 'METHOD_NOT_ALLOWED_ERROR'],
			[400, 'BAD_REQUEST_ERROR'],
			[429, 'RATE_LIMIT_ERROR'],
			[500, 'SERVER_ERROR'],
		];

		for (const [status, expected] of cases) {
			const matching = (
				Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
			).filter((key) => entry(key).match(failure(status), context));
			expect(matching.filter((key) => key !== 'DEFAULT')).toEqual([expected]);
		}
	});

	// 402 is an exhausted balance or an expired subscription, so no retry helps.
	it('never retries a 402', async () => {
		expect(await decide('QUOTA_ERROR', failure(402))).toEqual({
			maxRetries: 0,
		});
	});

	it('treats body code 3 as a wrong action name', async () => {
		// A 405 with code 3 is `Unknown method passed`, which is a plugin defect.
		expect(
			entry('METHOD_NOT_ALLOWED_ERROR').match(
				failure(405, { code: 3 }),
				context,
			),
		).toBe(true);
		expect(
			await decide('METHOD_NOT_ALLOWED_ERROR', failure(405, { code: 3 })),
		).toEqual({
			maxRetries: 0,
		});
	});

	it('treats body code 4 as an auth failure even on another status', async () => {
		expect(entry('AUTH_ERROR').match(failure(400, { code: 4 }), context)).toBe(
			true,
		);
	});

	it('does not retry a 403, a 404 or a refused input', async () => {
		for (const [name, error] of [
			['AUTH_ERROR', failure(403)],
			['NOT_FOUND_ERROR', failure(404)],
			[
				'BAD_REQUEST_ERROR',
				Object.assign(new Error('invalid input'), { name: 'ZodError' }),
			],
		] as Array<[HandlerName, Error]>) {
			expect([name, (await decide(name, error)).maxRetries]).toEqual([name, 0]);
		}
	});

	it('retries a 429 and waits the Retry-After it was given', async () => {
		expect(
			await decide('RATE_LIMIT_ERROR', failure(429, { retryAfter: 5000 })),
		).toEqual({ maxRetries: 3, headersRetryAfterMs: 5000 });
	});

	it('falls back to backoff when a 429 has no Retry-After', async () => {
		expect(await decide('RATE_LIMIT_ERROR', failure(429))).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	// The central rule: a read that may have spent a credit is not replayed.
	it('replays a 5xx only for a free read', async () => {
		expect(
			(await decide('SERVER_ERROR', failure(500, { replayable: true })))
				.maxRetries,
		).toBe(2);
		expect(
			(await decide('SERVER_ERROR', failure(500, { replayable: false })))
				.maxRetries,
		).toBe(0);
	});

	it('replays a dropped connection only for a free read', async () => {
		const freeRead = new HypeAuditorTransportError('reset', false, true);
		const chargedRead = new HypeAuditorTransportError('reset', false, false);

		expect(entry('NETWORK_ERROR').match(freeRead, context)).toBe(true);
		expect((await decide('NETWORK_ERROR', freeRead)).maxRetries).toBe(2);
		expect((await decide('NETWORK_ERROR', chargedRead)).maxRetries).toBe(0);
	});

	it('routes a timeout to TIMEOUT_ERROR, with the same replay rule', async () => {
		const timedOut = new HypeAuditorTransportError('timeout', true, false);

		expect(entry('TIMEOUT_ERROR').match(timedOut, context)).toBe(true);
		expect(entry('NETWORK_ERROR').match(timedOut, context)).toBe(false);
		expect((await decide('TIMEOUT_ERROR', timedOut)).maxRetries).toBe(0);
	});

	it('has a DEFAULT that stops everything else', async () => {
		const result = await entry('DEFAULT').handler(
			new Error('anything'),
			context,
		);
		expect(result).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	function resolve(
		merged: CorsairErrorHandler,
		error: Error,
	): string | undefined {
		return Object.keys(merged).find(
			(name) => name !== 'DEFAULT' && merged[name]?.match(error, context),
		);
	}

	it('returns the builtin map untouched when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('keeps DEFAULT last and lets a caller key run', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_TEAPOT: {
				match: (error) => error.message === 'teapot',
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(resolve(merged, new Error('teapot'))).toBe('CUSTOM_TEAPOT');
		expect(resolve(merged, failure(403))).toBe('AUTH_ERROR');
	});
});
