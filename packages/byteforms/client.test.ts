import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	BYTEFORMS_API_BASE,
	ByteFormsAPIError,
	makeByteFormsRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'form' },
		{
			url: `${BYTEFORMS_API_BASE}/form`,
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'failed', status: 'fail' },
		},
		status === 429 ? 'Too Many Requests' : 'Unauthorized',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeByteFormsRequest', () => {
	it('sends the raw API key in the Authorization header with no Bearer prefix', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeByteFormsRequest('form', 'secret-key');

		const [config] = lastCall();
		expect(config.BASE).toBe(BYTEFORMS_API_BASE);
		expect(config.HEADERS).toMatchObject({
			Authorization: 'secret-key',
			'Content-Type': 'application/json',
		});
		expect(config.TOKEN).toBeUndefined();
	});

	it('issues a GET with the endpoint path and passes query parameters', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeByteFormsRequest('form/responses/9', 'k', {
			method: 'GET',
			query: { limit: 10, order: 'desc' },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('GET');
		expect(options.url).toBe('form/responses/9');
		expect(options.query).toEqual({ limit: 10, order: 'desc' });
	});

	it('returns the parsed body on success', async () => {
		mockRequest.mockResolvedValue({ data: [], status: 'success' });

		const result = await makeByteFormsRequest<{ data: unknown[] }>('form', 'k');

		expect(result).toEqual({ data: [], status: 'success' });
	});

	it('sends a JSON body on write methods and omits query', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });

		await makeByteFormsRequest('form', 'k', {
			method: 'POST',
			body: { name: 'Demo', options: { theme: 'light' } },
		});

		const [, options] = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toEqual({
			name: 'Demo',
			options: { theme: 'light' },
		});
		expect(options.query).toBeUndefined();
		expect(options.mediaType).toContain('application/json');
	});

	it('does not send a body on GET or DELETE', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });

		await makeByteFormsRequest('form/1', 'k', { method: 'DELETE' });

		const [, options] = lastCall();
		expect(options.method).toBe('DELETE');
		expect(options.body).toBeUndefined();
	});

	it('passes the rate-limit configuration to the http client', async () => {
		mockRequest.mockResolvedValue({ data: {} });

		await makeByteFormsRequest('form', 'k');

		const [, options] = lastCall();
		expect(options).not.toHaveProperty('rateLimitConfig');
		const requestOptions = mockRequest.mock.calls[0]?.[2] as
			| { rateLimitConfig?: { enabled: boolean; maxRetries: number } }
			| undefined;
		expect(requestOptions?.rateLimitConfig).toMatchObject({
			enabled: true,
			maxRetries: 0,
		});
	});

	it('wraps an ApiError in ByteFormsAPIError, preserving status, retryAfter and cause', async () => {
		const original = apiError(429, 1500);
		mockRequest.mockRejectedValue(original);

		try {
			await makeByteFormsRequest('form', 'k');
			throw new Error('expected makeByteFormsRequest to throw');
		} catch (error) {
			const wrapped = error as ByteFormsAPIError;
			expect(wrapped).toBeInstanceOf(ByteFormsAPIError);
			expect(wrapped.status).toBe(429);
			expect(wrapped.code).toBe('429');
			expect(wrapped.retryAfter).toBe(1500);
			expect(wrapped.cause).toBe(original);
		}
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('wraps a non-ApiError failure without inventing a status', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		try {
			await makeByteFormsRequest('form', 'k');
			throw new Error('expected makeByteFormsRequest to throw');
		} catch (error) {
			const wrapped = error as ByteFormsAPIError;
			expect(wrapped).toBeInstanceOf(ByteFormsAPIError);
			expect(wrapped.message).toBe('socket hang up');
			expect(wrapped.status).toBeUndefined();
			expect(wrapped.retryAfter).toBeUndefined();
		}
	});

	it('wraps a thrown non-Error value as an unknown error', async () => {
		mockRequest.mockRejectedValue('not an error');

		await expect(makeByteFormsRequest('form', 'k')).rejects.toMatchObject({
			name: 'ByteFormsAPIError',
			message: 'Unknown error',
		});
	});
});
