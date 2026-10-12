import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeBenzingaRequest } from './client';
import { errorHandlers } from './error-handlers';

const fetchSpy = jest.spyOn(globalThis, 'fetch');

function jsonResponse(body: object, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: { 'Content-Type': 'application/json', ...init.headers },
	});
}

function lastFetch(): { url: string; init: RequestInit | undefined } {
	const call = fetchSpy.mock.calls.at(-1);
	const [input, init] = call ?? [];
	return { url: String(input), init };
}

function errorContext(error: Error): ErrorContext {
	return {
		pluginId: 'benzinga',
		operation: 'benzinga.news.get',
		input: {},
		originalError: error,
	};
}

describe('makeBenzingaRequest', () => {
	afterEach(() => {
		fetchSpy.mockReset();
		jest.useRealTimers();
	});

	it('sends a GET with the token query param and JSON Accept header', async () => {
		fetchSpy.mockResolvedValue(jsonResponse([{ id: 1 }]));

		const result = await makeBenzingaRequest('/api/v2/news', 'test-key', {
			pageSize: 2,
			tickers: 'AAPL',
			channels: undefined,
		});

		expect(result).toEqual([{ id: 1 }]);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const { url, init } = lastFetch();
		expect(url).toBe(
			'https://api.benzinga.com/api/v2/news?pageSize=2&tickers=AAPL&token=test-key',
		);
		expect(init?.method).toBe('GET');
		expect(init?.body).toBeUndefined();
		const headers = new Headers(init?.headers);
		expect(headers.get('Accept')).toBe('application/json');
		expect(headers.get('Authorization')).toBeNull();
	});

	it('surfaces a 401 as ApiError that the auth handler stops on', async () => {
		fetchSpy.mockResolvedValue(
			jsonResponse(
				{ message: 'Invalid or missing authentication token' },
				{ status: 401, statusText: 'Unauthorized' },
			),
		);

		const error = await makeBenzingaRequest('/api/v2/news', 'bad-key').then(
			() => undefined,
			(rejection: Error) => rejection,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error instanceof ApiError && error.status).toBe(401);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		if (!error) throw new Error('expected a rejection');
		expect(errorHandlers.AUTH_ERROR.match(error, errorContext(error))).toBe(
			true,
		);
		await expect(
			errorHandlers.AUTH_ERROR.handler(error, errorContext(error)),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('honours Retry-After on 429 and hands the delay to the rate-limit handler', async () => {
		jest.useFakeTimers();
		fetchSpy.mockImplementation(async () =>
			jsonResponse(
				{ message: 'Too Many Requests' },
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'Retry-After': '2' },
				},
			),
		);

		const pending = makeBenzingaRequest('/api/v2/news', 'test-key').then(
			() => undefined,
			(rejection: Error) => rejection,
		);
		await jest.advanceTimersByTimeAsync(5_999);
		expect(fetchSpy).toHaveBeenCalledTimes(3);
		await jest.advanceTimersByTimeAsync(1);
		const error = await pending;

		expect(fetchSpy).toHaveBeenCalledTimes(4);
		expect(error).toBeInstanceOf(ApiError);
		expect(error instanceof ApiError && error.status).toBe(429);
		expect(error instanceof ApiError && error.retryAfter).toBe(2000);
		if (!error) throw new Error('expected a rejection');
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(error, errorContext(error)),
		).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error, errorContext(error)),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('wraps network failures in BenzingaAPIError', async () => {
		fetchSpy.mockRejectedValue(new TypeError('fetch failed'));

		await expect(
			makeBenzingaRequest('/api/v2/news', 'test-key'),
		).rejects.toMatchObject({
			name: 'BenzingaAPIError',
			message: 'fetch failed',
		});
	});
});
