import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	LANGBASE_API_BASE,
	LANGBASE_RATE_LIMIT_CONFIG,
	makeLangbaseRequest,
} from './client';
import { errorHandlers } from './error-handlers';

const actualRequest =
	jest.requireActual<typeof import('corsair/http')>('corsair/http').request;

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const originalFetch = globalThis.fetch;

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/pipes' },
		{
			url: 'https://api.langbase.com/v1/pipes',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

afterEach(() => {
	globalThis.fetch = originalFetch;
});

describe('makeLangbaseRequest', () => {
	it('sends Authorization: Bearer <apiKey> header', async () => {
		mockRequest.mockResolvedValue({ pipes: [] });

		await makeLangbaseRequest('/pipes', 'test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LANGBASE_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-api-key',
				'Content-Type': 'application/json',
			},
		});
	});

	it('passes endpoint, method, body, and query parameters', async () => {
		mockRequest.mockResolvedValue({ completion: 'OK' });

		await makeLangbaseRequest('/pipes/run', 'test-key', {
			method: 'POST',
			body: { messages: [{ role: 'user', content: 'test' }] },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/pipes/run',
				body: { messages: [{ role: 'user', content: 'test' }] },
			}),
		);
		expect(mockRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: LANGBASE_RATE_LIMIT_CONFIG,
		});
	});

	it('throws AuthMissingError when key is explicitly empty without sending network request', async () => {
		mockRequest.mockResolvedValue({ pipes: [] });

		// `unknown` because rejection from missing auth throws an un-typed error before catch.
		await expect(
			makeLangbaseRequest('/pipes', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 4000);
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because catch returns unknown error instance.
		await expect(
			makeLangbaseRequest('/pipes', 'test-key', { method: 'GET' }),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('uses real transport to preserve Retry-After without a second retry loop', async () => {
		const fetchMock = jest.fn(
			async (_input: string | URL | Request, _init?: RequestInit) =>
				new Response(JSON.stringify({ error: 'rate limited' }), {
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				}),
		);
		globalThis.fetch = fetchMock;

		await expect(
			actualRequest(
				{
					BASE: LANGBASE_API_BASE,
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					HEADERS: { Accept: 'application/json' },
				},
				{ method: 'GET', url: '/pipes' },
				{ rateLimitConfig: LANGBASE_RATE_LIMIT_CONFIG },
			),
		).rejects.toMatchObject({ status: 429, retryAfter: 4_000 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
