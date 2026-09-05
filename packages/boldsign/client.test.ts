import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeBoldsignRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const KEY = 'test-key';

function apiError(status: number, message: string): ApiError {
	const requestOptions = {
		method: 'GET',
		url: '/v1/document/list',
	} satisfies ApiRequestOptions;
	const result = {
		url: 'https://api.boldsign.com/v1/document/list',
		ok: false,
		status,
		statusText: 'error',
		body: {},
	} satisfies ApiResult;
	return new ApiError(requestOptions, result, message);
}

describe('makeBoldsignRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it('sends a Bearer token for oauth_2 (the sole auth type) against the production base URL', async () => {
		await makeBoldsignRequest(
			'/v1/document/list',
			{ key: KEY, authType: 'oauth_2' },
			{ method: 'GET' },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.boldsign.com',
				HEADERS: expect.objectContaining({ Authorization: `Bearer ${KEY}` }),
			}),
			expect.objectContaining({ method: 'GET', url: '/v1/document/list' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 3,
				}),
			}),
		);
	});

	it('sends a Bearer header for oauth_2 auth', async () => {
		await makeBoldsignRequest(
			'/v1/document/list',
			{ key: KEY, authType: 'oauth_2' },
			{ method: 'GET' },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({ Authorization: `Bearer ${KEY}` }),
			}),
			expect.anything(),
			expect.anything(),
		);
	});

	it('defaults a bare string key and missing authType to oauth_2 (the plugin default)', async () => {
		await makeBoldsignRequest('/v1/document/list', KEY, { method: 'GET' });
		await makeBoldsignRequest(
			'/v1/document/list',
			{ key: KEY },
			{ method: 'GET' },
		);

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				HEADERS: expect.objectContaining({ Authorization: `Bearer ${KEY}` }),
			}),
			expect.anything(),
			expect.anything(),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				HEADERS: expect.objectContaining({ Authorization: `Bearer ${KEY}` }),
			}),
			expect.anything(),
			expect.anything(),
		);
	});

	it('sends query params without a body on GET', async () => {
		await makeBoldsignRequest(
			'/v1/document/list',
			{ key: KEY, authType: 'oauth_2' },
			{ method: 'GET', query: { page: 1, pageSize: 20 } },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/v1/document/list',
				query: { page: 1, pageSize: 20 },
				body: undefined,
			}),
			expect.anything(),
		);
	});

	it('sends the JSON body on POST and normalizes a missing leading slash', async () => {
		await makeBoldsignRequest(
			'v1/document/send',
			{ key: KEY, authType: 'oauth_2' },
			{ method: 'POST', body: { Title: 'NDA' } },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/v1/document/send',
				body: { Title: 'NDA' },
				mediaType: 'application/json; charset=utf-8',
			}),
			expect.anything(),
		);
	});

	it('forwards query params on mutation requests, not just GET', async () => {
		await makeBoldsignRequest(
			'/v1/document/extendExpiry',
			{ key: KEY, authType: 'oauth_2' },
			{
				method: 'PATCH',
				query: { documentId: 'doc_1' },
				body: { NewExpiryValue: '2022-12-15' },
			},
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'PATCH',
				url: '/v1/document/extendExpiry',
				query: { documentId: 'doc_1' },
				body: { NewExpiryValue: '2022-12-15' },
			}),
			expect.anything(),
		);
	});

	it('omits the JSON media type for FormData bodies', async () => {
		const form = new FormData();
		form.append('Title', 'NDA');

		await makeBoldsignRequest(
			'/v1/document/send',
			{ key: KEY, authType: 'oauth_2' },
			{ method: 'POST', body: form },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.not.objectContaining({
					'Content-Type': expect.anything(),
				}),
			}),
			expect.objectContaining({ method: 'POST', mediaType: undefined }),
			expect.anything(),
		);
	});

	it('propagates transport ApiErrors to the plugin error handlers', async () => {
		mockRequest.mockRejectedValue(apiError(429, 'Too Many Requests'));

		await expect(
			makeBoldsignRequest('/v1/document/list', {
				key: KEY,
				authType: 'oauth_2',
			}),
		).rejects.toBeInstanceOf(ApiError);
	});
});
