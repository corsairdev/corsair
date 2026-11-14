import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FIREBERRY_API_BASE,
	makeFireberryRequest,
	makeFireberryUploadRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

beforeEach(() => mockRequest.mockReset());

describe('Fireberry HTTP client', () => {
	it('uses tokenid header for REST and Batch endpoints', async () => {
		mockRequest.mockResolvedValue({ success: true });
		await makeFireberryRequest('/api/record/account', 'test-key', {
			method: 'POST',
			body: { accountname: 'Example' },
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: FIREBERRY_API_BASE,
			HEADERS: { tokenid: 'test-key', 'Content-Type': 'application/json' },
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/api/record/account',
			body: { accountname: 'Example' },
		});
	});

	it('uses tokenid query auth on Metadata API calls', async () => {
		mockRequest.mockResolvedValue({ success: true, data: [], message: '' });
		await makeFireberryRequest('/metadata/records', 'metadata-key', {
			metadata: true,
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'tokenid',
		);
		expect(mockRequest.mock.calls[0]?.[1]?.query).toEqual({
			tokenid: 'metadata-key',
		});
	});

	it('rejects empty credentials before transport', async () => {
		await expect(
			makeFireberryRequest('/api/record/account', ''),
		).rejects.toThrow(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sanitizes propagated provider errors while keeping retry metadata', async () => {
		const apiError = new ApiError(
			{
				method: 'POST',
				url: '/api/record/account',
				body: { emailaddress1: 'private@example.test' },
			},
			{
				url: 'https://api.fireberry.com/api/record/account',
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: { email: 'private@example.test' },
			},
			'Customer record exposed: private CRM value',
			{ retryAfter: 4000 },
		);
		mockRequest.mockRejectedValue(apiError);
		// `unknown` because a rejected promise may carry any JavaScript value.
		const result = await makeFireberryRequest(
			'/api/record/account',
			'test-key',
		).catch((error: unknown) => error);
		expect(result).toBeInstanceOf(ApiError);
		expect(result).toMatchObject({
			status: 422,
			retryAfter: 4000,
			message: 'Fireberry request failed with status 422',
		});
		if (result instanceof ApiError) {
			expect(result.body).toBeUndefined();
			expect(result.request.body).toBeUndefined();
		}
		expect(JSON.stringify(result)).not.toContain('private');
	});

	it('keeps the metadata tokenid query off the rebuilt ApiError', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'GET',
					url: '/metadata/records',
					query: { tokenid: 'secret-key-123' },
				},
				{
					url: 'https://api.fireberry.com/metadata/records?tokenid=secret-key-123',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { message: 'bad token secret-key-123' },
				},
				'bad token secret-key-123',
			),
		);
		// `unknown` because a rejected promise may carry any JavaScript value.
		const result = await makeFireberryRequest(
			'/metadata/records',
			'secret-key-123',
			{ metadata: true },
		).catch((error: unknown) => error);
		expect(result).toBeInstanceOf(ApiError);
		if (result instanceof ApiError) {
			expect(result.status).toBe(401);
			expect(result.url).toBe('https://api.fireberry.com/metadata/records');
			expect(result.request.query).toBeUndefined();
		}
		expect(JSON.stringify(result)).not.toContain('secret-key-123');
	});

	it('extracts Retry-After with the real shared transport without transport retries', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response('{}', { status: 429, headers: { 'Retry-After': '4' } }),
			);
		// `unknown` because the real transport rejects with a runtime error value.
		const caught = await actualHttp
			.request(
				{
					BASE: FIREBERRY_API_BASE,
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					HEADERS: {},
				},
				{ method: 'GET', url: '/api/record/account' },
				{
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 0,
						backoffMultiplier: 1,
						headerNames: { retryAfter: 'retry-after' },
					},
				},
			)
			.catch((error: unknown) => error);
		expect(caught).toMatchObject({ status: 429, retryAfter: 4000 });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		fetchSpy.mockRestore();
	});

	it('uploads the documented multipart file field with tokenid authentication', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('{}', { status: 200 }));
		await makeFireberryUploadRequest(
			'1',
			'record-id',
			'readme.txt',
			'SGVsbG8=',
			'secret-key',
		);
		expect(fetchSpy.mock.calls[0]?.[0]).toBe(
			`${FIREBERRY_API_BASE}/api/v2/record/1/record-id/files`,
		);
		expect(fetchSpy.mock.calls[0]?.[1]?.method).toBe('POST');
		expect(fetchSpy.mock.calls[0]?.[1]?.headers).toEqual({
			tokenid: 'secret-key',
		});
		const body = fetchSpy.mock.calls[0]?.[1]?.body;
		if (!(body instanceof FormData))
			throw new Error('Upload did not use multipart FormData');
		expect(body.get('file')).toMatchObject({ name: 'readme.txt' });
		fetchSpy.mockRestore();
	});
});
