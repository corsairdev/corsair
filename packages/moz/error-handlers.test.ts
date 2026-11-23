import type { CorsairErrorHandler } from 'corsair/core';
import { MozAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// unknown: a rejection can carry any shape; each case builds a MozAPIError
// with exactly the fields its matcher needs.
function mozError(
	options: ConstructorParameters<typeof MozAPIError>[1] = {},
): MozAPIError {
	return new MozAPIError('Moz error', options);
}

type HandlerEntry = (typeof errorHandlers)[keyof typeof errorHandlers];
type HandlerOutcome = { maxRetries: number } & {
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

function firstMatch(error: Error): HandlerEntry | undefined {
	return Object.values(errorHandlers).find((entry) => entry.match(error));
}

async function retriesFor(error: Error): Promise<number> {
	const entry = firstMatch(error);
	const outcome = (await entry?.handler(error)) as HandlerOutcome | undefined;
	return outcome?.maxRetries ?? 0;
}

describe('error handlers', () => {
	it('never retries a failed authentication (-32651 / 401)', async () => {
		expect(await retriesFor(mozError({ code: -32651, status: 401 }))).toBe(0);
		expect(await retriesFor(mozError({ status: 401 }))).toBe(0);
	});

	it('never retries an exhausted quota (-32670 / 403)', async () => {
		expect(await retriesFor(mozError({ code: -32670, status: 403 }))).toBe(0);
		expect(await retriesFor(mozError({ status: 403 }))).toBe(0);
	});

	it('never retries validation failures (-32652, -32601, -32655, 400, 413)', async () => {
		expect(await retriesFor(mozError({ code: -32652, status: 400 }))).toBe(0);
		expect(await retriesFor(mozError({ code: -32601, status: 400 }))).toBe(0);
		expect(await retriesFor(mozError({ code: -32655, status: 404 }))).toBe(0);
		expect(await retriesFor(mozError({ status: 400 }))).toBe(0);
		expect(await retriesFor(mozError({ status: 413 }))).toBe(0);
	});

	it('retries both 429 kinds, honouring a real Retry-After header', async () => {
		const perMethod = mozError({
			code: -32658,
			status: 429,
			retryAfter: 60000,
		});
		expect(await retriesFor(perMethod)).toBe(3);
		const outcome = (await firstMatch(perMethod)?.handler(perMethod)) as
			| HandlerOutcome
			| undefined;
		// The header value is applied verbatim as a fixed delay.
		expect(outcome?.headersRetryAfterMs).toBe(60000);
		expect(outcome?.retryStrategy).toBe('exponential_backoff');

		const edge = mozError({ code: -32650, status: 429 });
		expect(await retriesFor(edge)).toBe(3);
		const edgeOutcome = (await firstMatch(edge)?.handler(edge)) as
			| HandlerOutcome
			| undefined;
		// The edge limit sends no Retry-After, so backoff carries the wait.
		expect(edgeOutcome?.headersRetryAfterMs).toBeUndefined();
	});

	it('retries server errors only for replayable reads', async () => {
		expect(
			await retriesFor(
				mozError({ code: -32603, status: 500, replayable: true }),
			),
		).toBe(2);
		expect(
			await retriesFor(
				mozError({ code: -32603, status: 500, replayable: false }),
			),
		).toBe(0);
		expect(await retriesFor(mozError({ status: 500 }))).toBe(0);
	});

	it('retries transport failures on reads and not on the job start', async () => {
		expect(await retriesFor(mozError({ replayable: true }))).toBe(2);
		expect(await retriesFor(mozError({ replayable: false }))).toBe(0);
	});

	it('falls back to DEFAULT for anything else', async () => {
		expect(await retriesFor(mozError({ code: -99999, status: 418 }))).toBe(0);
	});

	it('keeps DEFAULT last when a caller merges handlers', () => {
		const caller: CorsairErrorHandler = {
			CUSTOM_ERROR: {
				match: (error: Error) => error.message.includes('custom'),
				handler: async () => ({ maxRetries: 5 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, caller);
		const keys = Object.keys(merged);
		// Caller keys come first, builtin DEFAULT stays last.
		expect(keys[0]).toBe('CUSTOM_ERROR');
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});

	it('lets a caller replace DEFAULT and keeps theirs last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 7 }) },
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		const outcome = (await merged.DEFAULT?.handler(
			new Error('anything'),
			{} as never,
		)) as HandlerOutcome | undefined;
		// The caller's DEFAULT wins over the builtin's.
		expect(outcome?.maxRetries).toBe(7);
	});
});
