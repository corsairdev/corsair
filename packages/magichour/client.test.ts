import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	MAGIC_HOUR_API_BASE,
	MagicHourAPIError,
	makeMagicHourRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v1/ai-talking-photo' },
		{
			url: 'https://api.magichour.ai/v1/ai-talking-photo',
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

describe('makeMagicHourRequest', () => {
	it('targets the Magic Hour base URL and sends a Bearer token header', async () => {
		mockRequest.mockResolvedValue({ id: 'proj_1', credits_charged: 3 });

		await makeMagicHourRequest('/v1/ai-talking-photo', 'test-key-123', {
			method: 'POST',
			body: { assets: { image_file_path: 'a.png' } },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		// The transport's own retry loop is disabled so the plugin's error
		// handlers stay the single owner of retries.
		expect(mockRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: expect.objectContaining({
				enabled: true,
				maxRetries: 0,
			}),
		});
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: MAGIC_HOUR_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-key-123',
				'Content-Type': 'application/json',
			},
		});
		// The transport authenticates via HEADERS; the OpenAPI TOKEN field must
		// stay unset so the key never leaks into a query string or cookie.
		expect(mockRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v1/ai-talking-photo',
				body: { assets: { image_file_path: 'a.png' } },
			}),
		);
	});

	it('omits the Authorization header when no key is supplied', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeMagicHourRequest('/v1/account', undefined, { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: MAGIC_HOUR_API_BASE,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('drops the body for GET requests', async () => {
		mockRequest.mockResolvedValue({});

		await makeMagicHourRequest('/v1/account', 'key', {
			method: 'GET',
			body: { should_be_ignored: true },
		});

		expect(mockRequest.mock.calls[0]?.[1]?.body).toBeUndefined();
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ id: 'proj_1', credits_charged: 3 });

		await expect(
			makeMagicHourRequest('/v1/account', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		try {
			await makeMagicHourRequest('/v1/account', '', { method: 'GET' });
		} catch (error) {
			expect(error).toBeInstanceOf(AuthMissingError);
			if (error instanceof AuthMissingError) {
				expect(error.pluginId).toBe('magichour');
				expect(error.authType).toBe('api_key');
			}
		}

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeMagicHourRequest('/v1/ai-talking-photo', 'test-key', {
				method: 'POST',
			}),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 3000,
		});
	});

	it('wraps a non-Error rejection in MagicHourAPIError', async () => {
		mockRequest.mockRejectedValue('boom');

		await expect(
			makeMagicHourRequest('/v1/account', 'test-key', { method: 'GET' }),
		).rejects.toThrow(MagicHourAPIError);
	});
});
