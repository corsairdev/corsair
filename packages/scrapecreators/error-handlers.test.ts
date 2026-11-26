import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { parseTextJson } from './client';
import { errorHandlers } from './error-handlers';
import { scrapecreators } from './index';

// Error bodies as ScrapeCreators sends them (checked live 11-27).
const MISSING = {
	success: false,
	credits_remaining: 3807,
	credits_charged: 0,
	error: 'missing_parameter',
	errorStatus: 400,
	message: 'You must provide a handle or user_id',
};

function apiError(status: number, body: object = {}, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/tiktok/profile' },
		{
			url: 'https://api.scrapecreators.com/v1/tiktok/profile',
			ok: false,
			status,
			statusText: 'x',
			body,
		},
		'x',
		{ retryAfter },
	);
}

function handlerFor(error: Error) {
	return Object.entries(errorHandlers).find(([, h]) => h.match(error))?.[0];
}

function respondWith(status: number, body: unknown, type = 'application/json') {
	return jest.spyOn(globalThis, 'fetch').mockImplementation(
		async () =>
			new Response(typeof body === 'string' ? body : JSON.stringify(body), {
				status,
				headers: { 'content-type': type },
			}),
	);
}

beforeEach(() => {
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('error handler matching', () => {
	it.each([
		[402, 'INSUFFICIENT_CREDITS_ERROR'],
		[429, 'RATE_LIMIT_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'AUTH_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'BAD_REQUEST_ERROR'],
		[500, 'SERVER_ERROR'],
		[502, 'SERVER_ERROR'],
	])('status %d -> %s', (status, name) => {
		expect(handlerFor(apiError(status))).toBe(name);
	});

	it('falls back to the error code in the message', () => {
		expect(handlerFor(new Error('No handle (missing_parameter)'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(handlerFor(new Error('Invalid API key'))).toBe('AUTH_ERROR');
		expect(handlerFor(new Error('something else'))).toBe('DEFAULT');
	});

	it('leaves 429 retries to core and passes Retry-After on', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError(429, {}, 2000),
		);
		expect(result).toEqual({ maxRetries: 0, headersRetryAfterMs: 2000 });
	});

	it('never retries a client error', async () => {
		for (const name of [
			'INSUFFICIENT_CREDITS_ERROR',
			'AUTH_ERROR',
			'NOT_FOUND_ERROR',
			'BAD_REQUEST_ERROR',
		] as const) {
			await expect(
				(errorHandlers[name].handler as (e: Error) => Promise<unknown>)(
					apiError(400),
				),
			).resolves.toEqual({ maxRetries: 0 });
		}
	});
});

describe('errors through the plugin', () => {
	it("throws core's ApiError with ScrapeCreators' message and code", async () => {
		respondWith(400, MISSING);
		const api = createCorsair({
			plugins: [scrapecreators({ key: 'sc_test_key' })],
		}).scrapecreators.api;
		const error = await api.tiktok.profile({}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(400);
		expect((error as ApiError).message).toBe(
			'You must provide a handle or user_id (missing_parameter)',
		);
	});

	it('reports a bad key as a 401', async () => {
		const fetchMock = respondWith(401, {
			success: false,
			message: 'Invalid API key',
		});
		const api = createCorsair({
			plugins: [scrapecreators({ key: 'bad' })],
		}).scrapecreators.api;
		const error = await api.account.creditBalance({}).catch((e: unknown) => e);
		expect((error as ApiError).status).toBe(401);
		expect((error as ApiError).message).toBe('Invalid API key');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('drops the POST body from the error it throws', async () => {
		respondWith(400, {
			success: false,
			error: 'bad_request',
			message: 'Bad cursor',
		});
		const api = createCorsair({
			plugins: [scrapecreators({ key: 'sc_test_key' })],
		}).scrapecreators.api;
		const error = (await api.reddit
			.postComments({
				url: 'https://www.reddit.com/r/nasa/comments/x/y/',
				cursor: 'c'.repeat(3000),
			})
			.catch((e: unknown) => e)) as ApiError;
		expect(error.request.method).toBe('POST');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.message).toBe('Bad cursor (bad_request)');
	});

	it('shortens a very long provider message', async () => {
		respondWith(400, {
			success: false,
			error: 'bad_request',
			message: 'x'.repeat(1000),
		});
		const api = createCorsair({
			plugins: [scrapecreators({ key: 'sc_test_key' })],
		}).scrapecreators.api;
		const error = (await api.tiktok
			.profile({ handle: 'nasa' })
			.catch((e: unknown) => e)) as ApiError;
		expect(error.message.length).toBeLessThan(330);
	});
});

describe('parseTextJson', () => {
	it('parses JSON text and leaves anything else alone', () => {
		expect(parseTextJson('{"a":1}')).toEqual({ a: 1 });
		expect(parseTextJson(' [1] ')).toEqual([1]);
		expect(parseTextJson('not json')).toBe('not json');
		expect(parseTextJson('{broken')).toBe('{broken');
		expect(parseTextJson({ a: 1 })).toEqual({ a: 1 });
	});
});
