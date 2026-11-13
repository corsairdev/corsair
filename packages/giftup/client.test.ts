import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	encodeGiftUpPathId,
	GIFTUP_API_BASE,
	GiftUpAPIError,
	makeGiftUpRequest,
	redactApiErrorInPlace,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function makeApiError(
	status: number,
	message: string,
	options: {
		retryAfter?: number;
		requestHeaders?: Record<string, string>;
		// `unknown` because requestBody accepts arbitrary test payloads
		requestBody?: unknown;
		// `unknown` because responseBody accepts arbitrary test payloads
		responseBody?: unknown;
	} = {},
): ApiError {
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/ping',
		headers: options.requestHeaders,
		// `unknown` because ApiRequestOptions accepts untrusted request payload
		body: options.requestBody,
	};
	return new ApiError(
		requestOptions,
		{
			url: 'https://api.giftup.app/ping',
			ok: false,
			status,
			statusText: message,
			// `unknown` because response body can be any JSON payload
			body: options.responseBody ?? {},
		},
		message,
		options.retryAfter === undefined
			? undefined
			: { retryAfter: options.retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Gift Up! client', () => {
	it('sends Authorization: Bearer <apiKey> and default headers', async () => {
		mockRequest.mockResolvedValue('pong');

		await makeGiftUpRequest('/ping', 'test-key-123', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const callConfig = mockRequest.mock.calls[0]?.[0];
		const callOptions = mockRequest.mock.calls[0]?.[1];

		expect(callConfig).toMatchObject({
			BASE: GIFTUP_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-key-123',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		expect(callOptions).toMatchObject({
			method: 'GET',
			url: '/ping',
		});
	});

	it('uses application/json-patch+json Content-Type for PATCH requests', async () => {
		mockRequest.mockResolvedValue({ id: '123' });

		await makeGiftUpRequest('/gift-cards/ABC', 'test-key', {
			method: 'PATCH',
			body: [{ op: 'replace', path: '/title', value: 'New title' }],
		});

		const callConfig = mockRequest.mock.calls[0]?.[0];
		expect(callConfig?.HEADERS).toMatchObject({
			'Content-Type': 'application/json-patch+json',
		});
	});

	it('sends x-giftup-testmode header when testMode is true', async () => {
		mockRequest.mockResolvedValue('pong');

		await makeGiftUpRequest('/ping', 'test-key', {
			method: 'GET',
			testMode: true,
		});

		const callConfig = mockRequest.mock.calls[0]?.[0];
		expect(callConfig?.HEADERS).toMatchObject({
			'x-giftup-testmode': 'true',
		});
	});

	it('throws AuthMissingError when apiKey is missing or empty', async () => {
		await expect(
			makeGiftUpRequest('/ping', undefined, { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		await expect(
			makeGiftUpRequest('/ping', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('skips auth check and Authorization header when auth is false', async () => {
		mockRequest.mockResolvedValue('pong');

		await makeGiftUpRequest('/ping', undefined, {
			method: 'GET',
			auth: false,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const callConfig = mockRequest.mock.calls[0]?.[0];
		expect(callConfig?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('compactQuery drops undefined values', () => {
		const compacted = compactQuery({
			a: 'value',
			b: undefined,
			c: 123,
			d: false,
		});
		expect(compacted).toEqual({
			a: 'value',
			c: 123,
			d: false,
		});
		expect(compactQuery(undefined)).toBeUndefined();
	});

	it('encodeGiftUpPathId properly encodes special characters', () => {
		expect(encodeGiftUpPathId('card/123+456')).toBe('card%2F123%2B456');
		expect(encodeGiftUpPathId(42)).toBe('42');
	});

	it('redacts credentials in-place from ApiError request and body', () => {
		const error = makeApiError(400, 'Bad Request', {
			requestHeaders: {
				Authorization: 'Bearer secret-token-value',
				Accept: 'application/json',
			},
			requestBody: {
				apiKey: 'secret-token-value',
				token: 'nested-token',
				name: 'John Doe',
			},
			responseBody: {
				message: 'Invalid key: secret-token-value',
				details: {
					apiKey: 'secret-token-value',
				},
			},
		});

		redactApiErrorInPlace(error, ['secret-token-value']);

		expect(error.request?.headers?.Authorization).toBe('[redacted]');
		const reqBody = error.request?.body;
		if (typeof reqBody === 'object' && reqBody !== null) {
			expect(Reflect.get(reqBody, 'apiKey')).toBe('[redacted]');
			expect(Reflect.get(reqBody, 'token')).toBe('[redacted]');
			expect(Reflect.get(reqBody, 'name')).toBe('John Doe');
		}

		const resBody = error.body;
		if (typeof resBody === 'object' && resBody !== null) {
			expect(Reflect.get(resBody, 'message')).toBe('Invalid key: [redacted]');
		}
	});

	it('wraps generic non-ApiError in GiftUpAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('Network failure'));

		await expect(
			makeGiftUpRequest('/ping', 'test-key', { method: 'GET' }),
		).rejects.toThrow(GiftUpAPIError);
	});

	it('rethrows ApiError with retryAfter intact and single-owner rate limiting', async () => {
		const rateLimited = makeApiError(429, 'Too Many Requests', {
			retryAfter: 3000,
		});
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because caught rejection has no static type
		const err = await makeGiftUpRequest('/ping', 'test-key', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(err).toBe(rateLimited);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);

		const handlerResult =
			await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited);
		expect(handlerResult).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 3000,
		});
	});

	it('real transport preserves Retry-After: 4 on a 429 response', async () => {
		const actualModule = jest.requireActual('corsair/http');
		const realRequest = actualModule.request;
		const originalFetch = globalThis.fetch;

		globalThis.fetch = jest.fn(
			async () =>
				new Response(JSON.stringify({ error: 'rate limited' }), {
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'retry-after': '4' },
				}),
		);

		try {
			// `unknown` because caught rejection has no static type
			const caught = await realRequest(
				{
					BASE: 'https://api.giftup.app',
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					HEADERS: {},
				},
				{
					method: 'GET',
					url: '/ping',
				},
			).catch((e: unknown) => e);

			expect(caught).toBeInstanceOf(ApiError);
			if (caught instanceof ApiError) {
				expect(caught.status).toBe(429);
				expect(caught.retryAfter).toBe(4000);
			}
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
