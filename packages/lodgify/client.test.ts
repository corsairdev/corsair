import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	LODGIFY_API_BASE,
	LodgifyAPIError,
	makeLodgifyRequest,
	sanitizeApiError,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v2/properties' },
		{
			url: 'https://api.lodgify.com/v2/properties',
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

describe('makeLodgifyRequest', () => {
	it('sends X-ApiKey header and JSON headers', async () => {
		mockRequest.mockResolvedValue({ items: [] });

		await makeLodgifyRequest('/v2/properties', 'test-api-key-123', {
			method: 'GET',
			query: { page: 1, size: 20 },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LODGIFY_API_BASE,
			HEADERS: {
				'X-ApiKey': 'test-api-key-123',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/v2/properties',
				query: { page: 1, size: 20 },
			}),
		);
	});

	it('throws AuthMissingError when key is explicitly empty', async () => {
		mockRequest.mockResolvedValue({ items: [] });

		// `unknown` because catch receives untrusted rejection type
		const error: unknown = await makeLodgifyRequest('/v2/properties', '', {
			method: 'GET',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('keeps Retry-After on the ApiError from the real transport', async () => {
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		mockRequest.mockImplementation((config, options, requestOptions) =>
			actualRequest(config, options, requestOptions),
		);
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'Too Many Requests' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);

		// `unknown` because catch receives untrusted rejection type
		const error: unknown = await makeLodgifyRequest(
			'/v2/properties',
			'unit-test-key',
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected the transport to throw ApiError');
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.retryAfter).toBe(4000);
		expect(error.isRateLimitError()).toBe(true);

		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 2, headersRetryAfterMs: 4000 });

		fetchMock.mockRestore();
	});

	it('redacts credentials and sensitive values from ApiError via sanitizeApiError', () => {
		const secretKey = 'super-secret-key-12345';
		const rawError = new ApiError(
			{
				method: 'POST',
				url: '/v2/reservations/bookings',
				body: { apikey: secretKey, guest: { name: 'Alice' } },
				headers: { 'X-ApiKey': secretKey },
			},
			{
				url: 'https://api.lodgify.com/v2/reservations/bookings',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {
					message: `Invalid request with key ${secretKey}`,
					secret: 'hidden-secret',
				},
			},
			`Error with key ${secretKey}`,
			{ retryAfter: 3500 },
		);

		const sanitized = sanitizeApiError(rawError, secretKey);

		expect(sanitized.message).toBe('Lodgify request failed (HTTP 429)');
		expect(sanitized.stack).not.toContain(secretKey);
		expect(sanitized.stack).not.toContain('Alice');
		expect(sanitized.status).toBe(429);
		expect(sanitized.retryAfter).toBe(3500);
		expect(sanitized.url).toBe(
			'https://api.lodgify.com/v2/reservations/bookings',
		);
		expect(sanitized.request.url).toBe('/v2/reservations/bookings');
		expect(sanitized).toBe(rawError);
		expect(sanitized.request.body).toBeUndefined();
		expect(sanitized.request.headers).toEqual({});
		expect(sanitized.body).toEqual({});
		expect(JSON.stringify(sanitized)).not.toContain('Alice');
		expect(JSON.stringify(sanitized)).not.toContain('guest@example.com');
		expect(JSON.stringify(sanitized)).not.toContain(secretKey);
	});

	it('wraps generic non-ApiError in LodgifyAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('Network connection failed'));

		// `unknown` because catch receives untrusted rejection type
		const error: unknown = await makeLodgifyRequest(
			'/v2/properties',
			'test-key',
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(LodgifyAPIError);
		if (!(error instanceof LodgifyAPIError)) {
			throw new Error('Expected the generic Lodgify error');
		}
		expect(error.message).toBe('Lodgify request failed');
	});
});
