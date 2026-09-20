import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import * as http from 'corsair/http';
import { ApiError } from 'corsair/http';
import { makeTavilyMcpRequest, TavilyMcpAPIError } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');

	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = http.request as jest.MockedFunction<typeof http.request>;

/** Returns the arguments of the first `request` call, failing loudly if absent. */
function firstCallArgs(): Parameters<typeof http.request> {
	const call = mockedRequest.mock.calls[0];
	if (!call) {
		throw new Error('expected corsair/http request to have been called');
	}
	return call;
}

const requestOptions: ApiRequestOptions = { method: 'POST', url: 'search' };

function buildApiError(
	status: number,
	message: string,
	rateLimitInfo?: {
		retryAfter?: number;
		rateLimitReset?: number;
		rateLimitRemaining?: number;
		rateLimitLimit?: number;
	},
): ApiError {
	const result: ApiResult = {
		url: 'https://api.tavily.com/search',
		ok: false,
		status,
		statusText: message,
		body: { detail: { error: message } },
	};

	return new ApiError(requestOptions, result, message, rateLimitInfo);
}

describe('makeTavilyMcpRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('request mapping', () => {
		it('sends the Tavily base URL and bearer auth header', async () => {
			mockedRequest.mockResolvedValueOnce({ results: [] });

			await makeTavilyMcpRequest('search', 'tvly-test-key', {
				method: 'POST',
				body: { query: 'hello' },
			});

			const [config] = firstCallArgs();
			expect(config.BASE).toBe('https://api.tavily.com');
			expect(config.TOKEN).toBe('tvly-test-key');
			expect(config.HEADERS).toEqual({ 'Content-Type': 'application/json' });
		});

		it('sends a body for POST', async () => {
			mockedRequest.mockResolvedValueOnce({ results: [] });

			await makeTavilyMcpRequest('search', 'tvly-test-key', {
				method: 'POST',
				body: { query: 'hello' },
			});

			const [, options] = firstCallArgs();
			expect(options).toMatchObject({
				method: 'POST',
				url: 'search',
				body: { query: 'hello' },
			});
		});

		it('omits the body for GET', async () => {
			mockedRequest.mockResolvedValueOnce({ status: 'completed' });

			await makeTavilyMcpRequest('research/abc-123', 'tvly-test-key', {
				method: 'GET',
				body: { ignored: 'yes' },
			});

			const [, options] = firstCallArgs();
			expect(options).toMatchObject({
				method: 'GET',
				url: 'research/abc-123',
			});
			expect(options.body).toBeUndefined();
		});

		it('defaults to GET when no method is given', async () => {
			mockedRequest.mockResolvedValueOnce({ ok: true });

			await makeTavilyMcpRequest('research/abc-123', 'tvly-test-key');

			const [, options] = firstCallArgs();
			expect(options.method).toBe('GET');
		});

		it('returns the parsed response body unchanged', async () => {
			const payload = { query: 'hello', results: [{ url: 'https://a.com' }] };
			mockedRequest.mockResolvedValueOnce(payload);

			const response = await makeTavilyMcpRequest('search', 'tvly-test-key', {
				method: 'POST',
				body: { query: 'hello' },
			});

			expect(response).toEqual(payload);
		});
	});

	describe('error handling', () => {
		it('preserves status and retryAfter from a 429 ApiError', async () => {
			mockedRequest.mockRejectedValueOnce(
				buildApiError(429, 'Too Many Requests', {
					retryAfter: 30_000,
					rateLimitLimit: 100,
					rateLimitRemaining: 0,
					rateLimitReset: 1_700_000_000,
				}),
			);

			expect.assertions(6);

			try {
				await makeTavilyMcpRequest('search', 'tvly-test-key', {
					method: 'POST',
				});
			} catch (error) {
				const apiError = error as TavilyMcpAPIError;
				expect(apiError).toBeInstanceOf(TavilyMcpAPIError);
				expect(apiError.status).toBe(429);
				expect(apiError.retryAfter).toBe(30_000);
				expect(apiError.rateLimitLimit).toBe(100);
				expect(apiError.rateLimitRemaining).toBe(0);
				expect(apiError.rateLimitReset).toBe(1_700_000_000);
			}
		});

		it('preserves the underlying ApiError as the cause', async () => {
			const cause = buildApiError(401, 'Unauthorized');
			mockedRequest.mockRejectedValueOnce(cause);

			await expect(
				makeTavilyMcpRequest('search', 'tvly-test-key', { method: 'POST' }),
			).rejects.toMatchObject({
				name: 'TavilyMcpAPIError',
				status: 401,
				statusText: 'Unauthorized',
				cause,
			});
		});

		it('wraps a plain Error without inventing status metadata', async () => {
			mockedRequest.mockRejectedValueOnce(new Error('socket hang up'));

			expect.assertions(3);

			try {
				await makeTavilyMcpRequest('search', 'tvly-test-key', {
					method: 'POST',
				});
			} catch (error) {
				const apiError = error as TavilyMcpAPIError;
				expect(apiError).toBeInstanceOf(TavilyMcpAPIError);
				expect(apiError.message).toBe('socket hang up');
				expect(apiError.status).toBeUndefined();
			}
		});

		it('wraps a non-Error rejection', async () => {
			mockedRequest.mockRejectedValueOnce('boom');

			await expect(
				makeTavilyMcpRequest('search', 'tvly-test-key', { method: 'POST' }),
			).rejects.toThrow('Unknown Tavily API error');
		});
	});
});

describe('errorHandlers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	async function wrapError(cause: Error): Promise<TavilyMcpAPIError> {
		mockedRequest.mockRejectedValueOnce(cause);

		try {
			await makeTavilyMcpRequest('search', 'tvly-test-key', { method: 'POST' });
		} catch (error) {
			return error as TavilyMcpAPIError;
		}

		// Outside the try, so this sentinel cannot be swallowed by the catch above.
		throw new Error('expected the request to reject');
	}

	it('matches a wrapped 429 and forwards the provider retry delay', async () => {
		const error = await wrapError(
			buildApiError(429, 'Too Many Requests', { retryAfter: 12_000 }),
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 12_000,
		});
	});

	it('matches a rate limit by message when status is absent', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Rate limit exceeded')),
		).toBe(true);
	});

	it('does not retry auth failures', async () => {
		const error = await wrapError(buildApiError(401, 'Unauthorized'));

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats 403 as an auth failure', async () => {
		const error = await wrapError(buildApiError(403, 'Forbidden'));

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('does not retry server errors', async () => {
		const error = await wrapError(buildApiError(503, 'Service Unavailable'));

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not classify a 429 as an auth or server error', async () => {
		const error = await wrapError(buildApiError(429, 'Too Many Requests'));

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(false);
	});
});
