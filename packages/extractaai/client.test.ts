import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	EXTRACTAAI_API_BASE,
	EXTRACTAAI_RATE_LIMIT_CONFIG,
	ExtractaaiAPIError,
	makeExtractaaiRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function buildApiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: `${EXTRACTAAI_API_BASE}/credits` },
		{
			ok: false,
			status,
			statusText: message,
			url: `${EXTRACTAAI_API_BASE}/credits`,
			body: { status: 'error', message },
		},
		message,
	);
}

describe('makeExtractaaiRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('rejects blank API keys before calling the transport', async () => {
		await expect(makeExtractaaiRequest('credits', '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		await expect(
			makeExtractaaiRequest('credits', '   '),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('targets the documented base URL with Bearer auth from TOKEN', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'ok', credits: 50 });

		const result = await makeExtractaaiRequest<{ credits: number }>(
			'credits',
			'test-api-key',
		);

		expect(result).toEqual({ status: 'ok', credits: 50 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: EXTRACTAAI_API_BASE,
				TOKEN: 'test-api-key',
			}),
			expect.objectContaining({ method: 'GET', url: '/credits' }),
			{ rateLimitConfig: EXTRACTAAI_RATE_LIMIT_CONFIG },
		);
	});

	it('sends JSON bodies for POST, PATCH, and DELETE', async () => {
		mockRequest.mockResolvedValue({});

		await makeExtractaaiRequest('createExtraction', 'k', {
			method: 'POST',
			body: { extractionDetails: { name: 'x' } },
		});
		await makeExtractaaiRequest('updateExtraction', 'k', {
			method: 'PATCH',
			body: { extractionId: 'e' },
		});
		await makeExtractaaiRequest('deleteExtraction', 'k', {
			method: 'DELETE',
			body: { extractionId: 'e' },
		});

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: { extractionDetails: { name: 'x' } },
			}),
			expect.anything(),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				body: { extractionId: 'e' },
			}),
			expect.anything(),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				body: { extractionId: 'e' },
			}),
			expect.anything(),
		);
	});

	it('disables transport-level retries so the binder controls backoff', () => {
		expect(EXTRACTAAI_RATE_LIMIT_CONFIG.enabled).toBe(true);
		expect(EXTRACTAAI_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
	});

	it('wraps provider ApiErrors with status preserved', async () => {
		const apiError = buildApiError(400, 'Language is required');
		mockRequest.mockRejectedValueOnce(apiError);

		const failure = makeExtractaaiRequest('createExtraction', 'k', {
			method: 'POST',
			body: { extractionDetails: { name: 'x' } },
		});
		await expect(failure).rejects.toBeInstanceOf(ExtractaaiAPIError);
		await expect(failure).rejects.toMatchObject({
			message: 'Language is required',
			status: 400,
		});
	});

	it('wraps generic errors without losing the message', async () => {
		mockRequest.mockRejectedValueOnce(new Error('socket hang up'));

		await expect(makeExtractaaiRequest('credits', 'k')).rejects.toMatchObject({
			name: 'ExtractaaiAPIError',
			message: 'socket hang up',
		});
	});

	it('wraps non-Error rejections with an unknown-error message', async () => {
		mockRequest.mockRejectedValueOnce('boom');

		await expect(makeExtractaaiRequest('credits', 'k')).rejects.toMatchObject({
			message: 'Unknown error',
		});
	});
});
