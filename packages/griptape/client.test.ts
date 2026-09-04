import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { GriptapeAPIError, makeGriptapeRequest } from './client';
import { griptape } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

const sampleRequest: ApiRequestOptions = {
	method: 'GET',
	url: 'assistants',
};

function apiErrorOf(
	status: number,
	statusText: string,
	retryAfterMs?: number,
): ApiError {
	const result: ApiResult = {
		url: 'https://cloud.griptape.ai/api/assistants',
		ok: false,
		status,
		statusText,
		body: { message: statusText },
	};
	return new ApiError(
		sampleRequest,
		result,
		statusText,
		retryAfterMs === undefined ? undefined : { retryAfter: retryAfterMs },
	);
}

describe('makeGriptapeRequest error handling', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('rethrows ApiError unchanged so status-based handlers keep working', async () => {
		const rateLimitError = apiErrorOf(429, 'Too Many Requests', 30000);
		mockRequest.mockRejectedValueOnce(rateLimitError);

		await expect(
			makeGriptapeRequest('assistants', 'test-api-key'),
		).rejects.toBe(rateLimitError);
	});

	it('keeps status and Retry-After readable on the rethrown rate-limit error', async () => {
		mockRequest.mockRejectedValueOnce(
			apiErrorOf(429, 'Too Many Requests', 45000),
		);

		const error = await makeGriptapeRequest('assistants', 'test-api-key').then(
			() => null,
			(error: unknown) => error,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			name: 'ApiError',
			status: 429,
			retryAfter: 45000,
		});
	});

	it('propagates authentication errors with their status code', async () => {
		const authError = apiErrorOf(401, 'Unauthorized');
		mockRequest.mockRejectedValueOnce(authError);

		await expect(makeGriptapeRequest('assistants', 'invalid-key')).rejects.toBe(
			authError,
		);
	});

	it('wraps non-API network failures as GriptapeAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('socket hang up'));

		const rejection = makeGriptapeRequest('assistants', 'test-api-key');

		await expect(rejection).rejects.toBeInstanceOf(GriptapeAPIError);
		await expect(rejection).rejects.toThrow('socket hang up');
	});

	it('maps non-Error rejections to GriptapeAPIError with a generic message', async () => {
		mockRequest.mockRejectedValueOnce('boom');

		await expect(
			makeGriptapeRequest('assistants', 'test-api-key'),
		).rejects.toEqual(new GriptapeAPIError('Unknown error'));
	});
});

describe('makeGriptapeRequest request wiring', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ assistants: [] });
	});

	it('returns the payload on success', async () => {
		const payload = { assistants: [{ assistant_id: 'a-1' }] };
		mockRequest.mockResolvedValueOnce(payload);

		await expect(
			makeGriptapeRequest('assistants', 'test-api-key'),
		).resolves.toBe(payload);
	});

	it('targets the Griptape Cloud base URL with a Bearer key header', async () => {
		await makeGriptapeRequest('assistants', 'test-api-key');

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://cloud.griptape.ai/api',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-api-key',
				}),
			}),
			expect.anything(),
		);
	});

	it('forwards query params on GET with no body', async () => {
		await makeGriptapeRequest('assistants', 'test-api-key', {
			method: 'GET',
			query: { page: 2, page_size: 25 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'assistants',
				query: { page: 2, page_size: 25 },
				body: undefined,
			}),
		);
	});

	it('forwards JSON bodies on POST with the JSON media type', async () => {
		const body = { name: 'Support Bot' };

		await makeGriptapeRequest('assistants', 'test-api-key', {
			method: 'POST',
			body,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'assistants',
				body,
				mediaType: 'application/json; charset=utf-8',
			}),
		);
	});

	it('forwards bodies on PUT and PATCH', async () => {
		await makeGriptapeRequest('buckets/b-1/assets', 'test-api-key', {
			method: 'PUT',
			body: { name: 'file.pdf' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PUT',
				body: { name: 'file.pdf' },
			}),
		);

		await makeGriptapeRequest('assistants/a-1', 'test-api-key', {
			method: 'PATCH',
			body: { description: 'updated' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				body: { description: 'updated' },
			}),
		);
	});

	it('sends no body on DELETE', async () => {
		await makeGriptapeRequest('assistants/a-1', 'test-api-key', {
			method: 'DELETE',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'DELETE', body: undefined }),
		);
	});
});

describe('griptape keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = griptape({ key: 'from-options' });

		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('from-options');
	});

	it('returns the stored api key when options.key is absent', async () => {
		const plugin = griptape();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'from-store' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('from-store');
	});

	it('throws AuthMissingError when the api key is missing', async () => {
		const plugin = griptape();

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('throws AuthMissingError for non-endpoint sources', async () => {
		const plugin = griptape({ key: 'from-options' });

		await expect(
			plugin.keyBuilder?.({ authType: 'api_key' } as never, 'webhook'),
		).rejects.toThrow(AuthMissingError);
	});
});
