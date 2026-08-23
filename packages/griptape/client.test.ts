import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { GriptapeAPIError, makeGriptapeRequest } from './client';

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
