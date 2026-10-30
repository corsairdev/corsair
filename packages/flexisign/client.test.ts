import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { FlexisignAPIError, makeFlexisignRequest } from './client';
import type { ListTemplatesResponse } from './endpoints/types';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v1/templates/all' },
		{
			body: { message },
			ok: false,
			status,
			statusText: message,
			url: 'https://api.flexisign.io/v1/templates/all',
		},
		message,
	);
}

describe('makeFlexisignRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends GET with api-key header against the FlexiSign base URL', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success' });
		const result = await makeFlexisignRequest<{ status: string }>(
			'/v1/templates/all',
			'test-key',
		);

		expect(result).toEqual({ status: 'success' });
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.flexisign.io',
				HEADERS: expect.objectContaining({ 'api-key': 'test-key' }),
			}),
			expect.objectContaining({ method: 'GET', url: '/v1/templates/all' }),
		);
	});

	it('forwards pagination query params on GET', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success' });
		await makeFlexisignRequest('/v1/templates/all', 'test-key', {
			method: 'GET',
			query: { page: 2, limit: 10 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { page: 2, limit: 10 },
			}),
		);
	});

	it('rejects empty keys before calling the transport', async () => {
		await expect(
			makeFlexisignRequest('/v1/templates/all', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeFlexisignRequest('/v1/templates/all', '   '),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('wraps ApiError preserving status for error-handler routing', async () => {
		mockRequest.mockRejectedValueOnce(apiError(401, 'Unauthorized'));

		const caught: ListTemplatesResponse | Error =
			await makeFlexisignRequest<ListTemplatesResponse>(
				'/v1/templates/all',
				'bad-key',
			).catch((error: Error) => error);
		expect(caught).toBeInstanceOf(FlexisignAPIError);
		if (caught instanceof FlexisignAPIError) {
			expect(caught.status).toBe(401);
			expect(caught.message).toBe('Unauthorized');
		} else {
			throw new Error('expected FlexisignAPIError');
		}
	});

	it('wraps standard errors without losing the message', async () => {
		mockRequest.mockRejectedValueOnce(new Error('Network offline'));
		await expect(
			makeFlexisignRequest('/v1/templates/all', 'key'),
		).rejects.toThrow('Network offline');
	});

	it('wraps non-error rejections in FlexisignAPIError', async () => {
		mockRequest.mockRejectedValueOnce('string failure');
		await expect(
			makeFlexisignRequest('/v1/templates/all', 'key'),
		).rejects.toThrow('Unknown error');
	});
});
