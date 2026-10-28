import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { InstantlyAPIError } from './client';
import {
	errorHandlers,
	mergeErrorHandlers,
	readRetryDelay,
	withReadRetries,
} from './error-handlers';

function apiError(status: number, retryAfter?: number) {
	return new InstantlyAPIError(`Instantly ${status}: failed`, {
		status,
		retryAfter,
		body: { statusCode: status, error: 'x', message: 'failed' },
	});
}

function wrapped(name: string) {
	const cause = new Error(name);
	cause.name = name;
	return new InstantlyAPIError(cause.message, { cause });
}

const timeoutError = () => wrapped('TimeoutError');
const abortError = () => wrapped('AbortError');
const networkError = () =>
	new InstantlyAPIError('fetch failed', {
		cause: new TypeError('fetch failed'),
	});

describe('readRetryDelay', () => {
	it('waits for Retry-After on a 429, up to three times', () => {
		expect(readRetryDelay(apiError(429, 5000), 'leads.list', 1)).toBe(5000);
		expect(readRetryDelay(apiError(429, 5000), 'leads.list', 3)).toBe(5000);
		expect(
			readRetryDelay(apiError(429, 5000), 'leads.list', 4),
		).toBeUndefined();
	});

	it('backs off when Retry-After is missing, and caps a long Retry-After', () => {
		expect(readRetryDelay(apiError(429), 'leads.list', 1)).toBe(1000);
		expect(readRetryDelay(apiError(429), 'leads.list', 2)).toBe(2000);
		expect(readRetryDelay(apiError(429, 600_000), 'leads.list', 1)).toBe(
			60_000,
		);
	});

	it('spaces emails.list retries 3 seconds apart (20 requests a minute)', () => {
		expect(readRetryDelay(apiError(429), 'emails.list', 1)).toBe(3000);
		expect(readRetryDelay(apiError(429), 'emails.list', 2)).toBe(3000);
	});

	it('retries 5xx twice, a timeout once and a network failure twice', () => {
		expect(readRetryDelay(apiError(503), 'accounts.list', 2)).toBe(2000);
		expect(readRetryDelay(apiError(504), 'accounts.list', 3)).toBeUndefined();
		expect(readRetryDelay(timeoutError(), 'accounts.list', 1)).toBe(2000);
		expect(readRetryDelay(timeoutError(), 'accounts.list', 2)).toBeUndefined();
		expect(readRetryDelay(networkError(), 'accounts.list', 2)).toBe(2000);
	});

	it('never retries a request the caller cancelled', () => {
		expect(readRetryDelay(abortError(), 'leads.list', 1)).toBeUndefined();
	});

	it.each([400, 401, 402, 403, 404, 422])('never retries a %i', (status) => {
		expect(readRetryDelay(apiError(status), 'leads.list', 1)).toBeUndefined();
	});

	it('never retries anything that is not an Instantly error', () => {
		expect(readRetryDelay(new ZodError([]), 'leads.list', 1)).toBeUndefined();
		expect(readRetryDelay('boom', 'leads.list', 1)).toBeUndefined();
	});
});

describe('withReadRetries', () => {
	const noWait = jest.fn(async (_ms: number) => undefined);
	beforeEach(() => noWait.mockClear());

	it('retries until the read succeeds', async () => {
		const send = jest
			.fn()
			.mockRejectedValueOnce(apiError(429, 1500))
			.mockRejectedValueOnce(apiError(502))
			.mockResolvedValueOnce({ items: [] });

		await expect(withReadRetries(send, 'leads.list', noWait)).resolves.toEqual({
			items: [],
		});
		expect(send).toHaveBeenCalledTimes(3);
		expect(noWait.mock.calls.map(([ms]) => ms)).toEqual([1500, 2000]);
	});

	it('gives up after the last retry and throws the error', async () => {
		const send = jest.fn().mockRejectedValue(apiError(500));
		await expect(
			withReadRetries(send, 'leads.list', noWait),
		).rejects.toMatchObject({ status: 500 });
		expect(send).toHaveBeenCalledTimes(3);
	});

	it('does not retry a cancelled request', async () => {
		const send = jest.fn().mockRejectedValue(abortError());
		await expect(withReadRetries(send, 'leads.list', noWait)).rejects.toThrow(
			'AbortError',
		);
		expect(send).toHaveBeenCalledTimes(1);
		expect(noWait).not.toHaveBeenCalled();
	});
});

const context: ErrorContext = {
	pluginId: 'instantly',
	operation: 'leads.list',
	input: {},
	originalError: new Error('x'),
};

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(handlers: CorsairErrorHandler, error: Error): string {
	const name = Object.keys(handlers).find((key) =>
		handlers[key]?.match(error, context),
	);
	if (!name) throw new Error('a catch-all should always match');
	return name;
}

describe('Corsair error handlers', () => {
	it('prefixes every key and keeps the catch-all last', () => {
		const names = Object.keys(errorHandlers);
		for (const name of names) expect(name).toMatch(/^INSTANTLY_/);
		expect(names).not.toContain('DEFAULT');
		expect(names.at(-1)).toBe('INSTANTLY_FALLBACK');
	});

	it.each([
		[apiError(400), 'INSTANTLY_VALIDATION'],
		[new ZodError([]), 'INSTANTLY_VALIDATION'],
		[apiError(401), 'INSTANTLY_AUTH'],
		[apiError(402), 'INSTANTLY_PLAN'],
		[apiError(403), 'INSTANTLY_PERMISSION'],
		[apiError(404), 'INSTANTLY_NOT_FOUND'],
		[apiError(429), 'INSTANTLY_RATE_LIMIT'],
		[apiError(504), 'INSTANTLY_SERVER'],
		[timeoutError(), 'INSTANTLY_TIMEOUT'],
		[abortError(), 'INSTANTLY_CANCELLED'],
		[networkError(), 'INSTANTLY_NETWORK'],
		[new Error('odd'), 'INSTANTLY_FALLBACK'],
	])(
		'classifies %p as %s and never asks Corsair to retry',
		async (error, name) => {
			expect(classify(errorHandlers, error)).toBe(name);
			const entry = errorHandlers[name as keyof typeof errorHandlers];
			expect(await entry.handler()).toEqual({ maxRetries: 0 });
		},
	);

	it("does not take a root DEFAULT's position when core merges handlers", () => {
		// core/client/index.ts merges { ...rootErrorHandlers, ...plugin.errorHandlers }.
		const rootDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		};
		const merged: CorsairErrorHandler = {
			...{ DEFAULT: rootDefault },
			...mergeErrorHandlers(errorHandlers, undefined),
		};
		expect(merged.DEFAULT).toBe(rootDefault);
		expect(Object.keys(merged).at(-1)).toBe('INSTANTLY_FALLBACK');
	});
});

describe('mergeErrorHandlers', () => {
	const never = {
		match: () => false,
		handler: async () => ({ maxRetries: 0 }),
	};
	const always = {
		match: () => true,
		handler: async () => ({ maxRetries: 1 }),
	};

	it("puts the caller's handlers first and the catch-all last", () => {
		const merged = mergeErrorHandlers(errorHandlers, { QUOTA_ERROR: never });
		const names = Object.keys(merged);
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).toContain('INSTANTLY_RATE_LIMIT');
		expect(names.at(-1)).toBe('INSTANTLY_FALLBACK');
	});

	it('files a caller DEFAULT under INSTANTLY_FALLBACK, last', () => {
		const merged = mergeErrorHandlers(errorHandlers, { DEFAULT: always });
		expect(merged.DEFAULT).toBeUndefined();
		expect(merged.INSTANTLY_FALLBACK).toBe(always);
		expect(Object.keys(merged).at(-1)).toBe('INSTANTLY_FALLBACK');
		expect(classify(merged, apiError(429))).toBe('INSTANTLY_RATE_LIMIT');
	});

	it('lets the caller override a built-in handler by its key', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			INSTANTLY_RATE_LIMIT: always,
		});
		expect(merged.INSTANTLY_RATE_LIMIT).toBe(always);
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
