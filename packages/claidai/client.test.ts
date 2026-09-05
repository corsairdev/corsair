import { ApiError, request } from 'corsair/http';
import { ClaidAiAPIError, makeClaidAiRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

// Narrow jest mock typing only; test-only, never exported.
const mockRequest = request as jest.Mock;

function apiError(status: number) {
	return new ApiError(
		{ method: 'GET', url: 'storage/storage-types' },
		{
			url: 'https://api.claid.ai/v1/storage/storage-types',
			ok: false,
			status,
			statusText: 'Too Many Requests',
			body: {},
		},
		'Too Many Requests',
		{ retryAfter: 1000 },
	);
}

describe('Claid.ai API client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ data: [] });
	});

	it('sends Bearer auth against the Claid.ai base URL', async () => {
		await makeClaidAiRequest('storage/storage-types', 'test-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.claid.ai/v1',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: 'storage/storage-types' }),
		);
	});

	it('forwards body on POST and query on GET', async () => {
		await makeClaidAiRequest('image/edit', 'test-key', {
			method: 'POST',
			body: { input: 'https://example.com/a.png' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: { input: 'https://example.com/a.png' },
			}),
		);

		await makeClaidAiRequest('storage/storages', 'test-key', {
			method: 'GET',
			query: { limit: 10 },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				query: { limit: 10 },
			}),
		);
	});

	it('fails fast when the API key is missing', async () => {
		await expect(
			makeClaidAiRequest('storage/storage-types', ''),
		).rejects.toThrow(ClaidAiAPIError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError as-is so 429 metadata survives', async () => {
		mockRequest.mockRejectedValueOnce(apiError(429));
		const err: unknown = await makeClaidAiRequest(
			'storage/storage-types',
			'test-key',
		).catch((e: unknown) => e);
		expect(err).toBeInstanceOf(ApiError);
		// Narrowed by the instanceof check above; test-only, never exported.
		const apiErr = err as ApiError;
		expect(apiErr.status).toBe(429);
		expect(apiErr.retryAfter).toBe(1000);
	});

	it('wraps generic errors in ClaidAiAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('boom'));
		await expect(
			makeClaidAiRequest('storage/storage-types', 'test-key'),
		).rejects.toThrow(ClaidAiAPIError);
	});
});
