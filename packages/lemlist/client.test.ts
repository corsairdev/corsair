import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	basicAuthHeader,
	compactQuery,
	LEMLIST_API_BASE,
	LEMLIST_RATE_LIMIT_CONFIG,
	makeLemlistRequest,
	sanitizeApiError,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

// `unknown` because a rejected promise may contain any value; instanceof narrows it.
function expectApiError(value: unknown): asserts value is ApiError {
	expect(value).toBeInstanceOf(ApiError);
	if (!(value instanceof ApiError)) {
		throw new Error('Expected an ApiError');
	}
}

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{
			method: 'GET',
			url: '/team',
			body: { email: 'private@example.com', secret: 'super-secret-key' },
			query: { email: 'private@example.com' },
			headers: { Authorization: 'Basic secret-header' },
		},
		{
			url: 'https://api.lemlist.com/api/team?apiKey=super-secret-key',
			ok: false,
			status,
			statusText: message,
			body: {
				error: message,
				email: 'private@example.com',
				code: 'BAD_REQUEST',
			},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('client.ts', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	describe('basicAuthHeader', () => {
		it('formats raw API key as HTTP Basic with empty username', () => {
			const key = 'test_api_key_123';
			const expected = `Basic ${Buffer.from(`:${key}`).toString('base64')}`;
			expect(basicAuthHeader(key)).toBe(expected);
		});

		it('formats API key that already has a leading colon', () => {
			const key = ':test_api_key_123';
			const expected = `Basic ${Buffer.from(key).toString('base64')}`;
			expect(basicAuthHeader(key)).toBe(expected);
		});

		it('treats a preformatted header as a raw API key instead of forwarding it', () => {
			const existing = 'Basic dXNlcjpwYXNz';
			expect(basicAuthHeader(existing)).toBe(
				`Basic ${Buffer.from(`:${existing}`).toString('base64')}`,
			);
		});
	});

	describe('compactQuery', () => {
		it('drops undefined keys and preserves defined keys', () => {
			const query = {
				offset: 0,
				limit: 50,
				state: undefined,
			};
			expect(compactQuery(query)).toEqual({ offset: 0, limit: 50 });
		});

		it('returns undefined if all values are undefined', () => {
			expect(compactQuery({ state: undefined })).toBeUndefined();
			expect(compactQuery(undefined)).toBeUndefined();
		});
	});

	describe('sanitizeApiError', () => {
		it('preserves the ApiError while redacting sensitive data', () => {
			const err = makeApiError(400, 'Bad Request', 1000);
			const sanitized = sanitizeApiError(err);
			expect(sanitized).toBe(err);
			expect(sanitized.request.body).toEqual({
				email: '[REDACTED]',
				secret: '[REDACTED]',
			});
			expect(sanitized.request.query).toEqual({ email: '[REDACTED]' });
			expect(sanitized.request.headers).toEqual({
				Authorization: '[REDACTED]',
			});
			expect(sanitized.request.url).toBe('/team');
			expect(sanitized.url).toBe('https://api.lemlist.com/api/team');
			expect(sanitized.body).toEqual({
				error: 'Bad Request',
				email: '[REDACTED]',
				code: 'BAD_REQUEST',
			});
			expect(sanitized.message).not.toContain('super-secret-key');
			expect(sanitized.message).not.toContain('private@example.com');
			expect(sanitized.status).toBe(400);
			expect(sanitized.retryAfter).toBe(1000);
		});

		it('preserves useful provider details while removing echoed API keys', () => {
			const error = makeApiError(
				400,
				'Invalid request for key-secret-1234567890',
			);
			const sanitized = sanitizeApiError(error, 'key-secret-1234567890');

			expect(sanitized.message).toBe('Invalid request for [REDACTED]');
			expect(sanitized.body).toMatchObject({
				code: 'BAD_REQUEST',
				email: '[REDACTED]',
			});
			expect(sanitized).toBe(error);
			expect(JSON.stringify(sanitized.body)).not.toContain(
				'key-secret-1234567890',
			);
		});
	});

	describe('makeLemlistRequest', () => {
		it('sends correct base URL, headers and rate limit config', async () => {
			mockRequest.mockResolvedValue({ _id: 'tea_123' });

			await makeLemlistRequest('/team', 'test_key', {
				method: 'GET',
				query: { version: 'v2' },
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const config = mockRequest.mock.calls[0]?.[0];
			const reqOptions = mockRequest.mock.calls[0]?.[1];
			const extra = mockRequest.mock.calls[0]?.[2];

			expect(config).toMatchObject({
				BASE: LEMLIST_API_BASE,
				VERSION: '2.0.0',
				TIMEOUT: 20000,
				HEADERS: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: basicAuthHeader('test_key'),
				},
			});
			expect(config).not.toHaveProperty('TOKEN');
			expect(reqOptions).toEqual(
				expect.objectContaining({
					method: 'GET',
					url: '/team',
					query: { version: 'v2' },
				}),
			);
			expect(extra).toEqual({
				rateLimitConfig: LEMLIST_RATE_LIMIT_CONFIG,
			});
		});

		it('throws AuthMissingError when key is empty', async () => {
			await expect(
				makeLemlistRequest('/team', '', { method: 'GET' }),
			).rejects.toThrow(AuthMissingError);
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('forwards a configured timeout to the transport', async () => {
			mockRequest.mockResolvedValue({ _id: 'tea_123' });

			await makeLemlistRequest('/team', 'test_key', {
				method: 'GET',
				timeout: 60000,
			});

			expect(mockRequest.mock.calls[0]?.[0]?.TIMEOUT).toBe(60000);
		});

		it('preserves and sanitizes ApiError before re-throwing', async () => {
			const err = makeApiError(429, 'Too Many Requests', 4000);
			mockRequest.mockRejectedValue(err);

			// unknown because rejection values have no static type; expectApiError narrows the caught value.
			const thrown = await makeLemlistRequest('/team', 'key').catch(
				(caught: unknown) => caught,
			);

			expectApiError(thrown);
			expect(thrown).toBe(err);
			expect(thrown.status).toBe(429);
			expect(thrown.retryAfter).toBe(4000);
			expect(thrown.request.body).toEqual({
				email: '[REDACTED]',
				secret: '[REDACTED]',
			});
		});

		it('sanitizes transport Error messages before propagating them', async () => {
			const stdErr = new Error('Network failure for private@example.com');
			mockRequest.mockRejectedValue(stdErr);

			await expect(makeLemlistRequest('/team', 'key')).rejects.toThrow(
				'Lemlist API transport failed',
			);
		});

		it('sanitizes non-Error rejection values', async () => {
			mockRequest.mockRejectedValue('unexpected string error');

			await expect(makeLemlistRequest('/team', 'key')).rejects.toThrow(
				'Lemlist API transport failed',
			);
		});
	});

	describe('real transport rate-limit retry extraction', () => {
		const originalFetch = global.fetch;

		afterEach(() => {
			global.fetch = originalFetch;
		});

		it('extracts Retry-After header with zero transport retries', async () => {
			const actualHttp =
				jest.requireActual<typeof import('corsair/http')>('corsair/http');
			const actualRequest = actualHttp.request;

			let fetchCount = 0;
			global.fetch = jest.fn().mockImplementation(async () => {
				fetchCount++;
				return new Response(JSON.stringify({ error: 'Too many requests' }), {
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				});
			});

			const config: OpenAPIConfig = {
				BASE: LEMLIST_API_BASE,
				VERSION: '2.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				HEADERS: {},
			};
			const options: ApiRequestOptions = {
				method: 'GET',
				url: '/team',
			};

			// unknown because rejection values have no static type; expectApiError narrows the caught value.
			const caught = await actualRequest(config, options, {
				rateLimitConfig: LEMLIST_RATE_LIMIT_CONFIG,
			}).catch((err: unknown) => err);

			expect(fetchCount).toBe(1);
			expectApiError(caught);
			expect(caught.status).toBe(429);
			expect(caught.retryAfter).toBe(4000);
		});
	});
});
