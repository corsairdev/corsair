import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CLOUDLAYER_API_BASE,
	CLOUDLAYER_API_KEY_HEADER,
	CLOUDLAYER_API_V1_BASE,
	makeCloudlayerBinaryRequest,
	makeCloudlayerRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/jobs' },
		{
			url: 'https://api.cloudlayer.io/v2/jobs',
			ok: false,
			status,
			statusText: message,
			body: { statusCode: status, message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('makeCloudlayerRequest', () => {
	it('uses X-API-Key on v2 requests and forwards method, body, and query', async () => {
		mockedRequest.mockResolvedValue({ id: 'job-1', status: 'pending' });

		await makeCloudlayerRequest('/html/pdf', 'unit-test-key', {
			method: 'POST',
			body: { html: 'encoded-html', async: true },
			query: { dryRun: false },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDLAYER_API_BASE,
			HEADERS: {
				'X-API-Key': 'unit-test-key',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual({
			method: 'POST',
			url: '/html/pdf',
			body: { html: 'encoded-html', async: true },
			mediaType: 'application/json; charset=utf-8',
			query: { dryRun: false },
		});
	});

	it('sends multipart form parts without overriding the browser boundary', async () => {
		mockedRequest.mockResolvedValue({ id: 'job-2', status: 'pending' });
		const template = new Blob(['<h1>Invoice</h1>'], { type: 'text/html' });

		await makeCloudlayerRequest('/template/pdf', 'unit-test-key', {
			method: 'POST',
			formData: {
				template,
				data: JSON.stringify({ invoiceNumber: 'INV-2' }),
			},
		});

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDLAYER_API_BASE,
			HEADERS: { 'X-API-Key': 'unit-test-key' },
		});
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Content-Type',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/template/pdf',
			formData: {
				template,
				data: '{"invoiceNumber":"INV-2"}',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1]).not.toHaveProperty('body');
		expect(mockedRequest.mock.calls[0]?.[1]).not.toHaveProperty('mediaType');
	});

	it('uses the v1 base URL for the documented legacy jobs list', async () => {
		mockedRequest.mockResolvedValue([]);

		await makeCloudlayerRequest('/jobs', 'unit-test-key', {
			method: 'GET',
			apiVersion: 'v1',
			query: { limit: 10, startAfterId: 'job-0' },
		});

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDLAYER_API_V1_BASE,
			HEADERS: { [CLOUDLAYER_API_KEY_HEADER]: 'unit-test-key' },
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/jobs',
			query: { limit: 10, startAfterId: 'job-0' },
		});
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		await expect(makeCloudlayerRequest('/account', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rethrows 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 3000);
		mockedRequest.mockRejectedValue(rateLimited);

		await expect(makeCloudlayerRequest('/jobs', 'unit-test-key')).rejects.toBe(
			rateLimited,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 3000 });
	});

	it('returns synchronous v2 file bytes as a base64 artifact', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0x25, 0x50, 0x44, 0x46]), {
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);

		const result = await makeCloudlayerBinaryRequest(
			'/html/pdf',
			'unit-test-key',
			{
				method: 'POST',
				body: { html: 'encoded-html', async: false },
			},
		);

		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			'https://api.cloudlayer.io/v2/html/pdf',
		);
		expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': 'unit-test-key',
			},
			body: '{"html":"encoded-html","async":false}',
			credentials: 'omit',
		});
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('uses the v1 URL route and preserves retry-after on binary errors', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'Retry-After': '2' },
			}),
		);
		const url = 'https://capture.invalid/report?view=full';

		// Fetch rejections are untyped at runtime; narrow to ApiError below.
		const error = await makeCloudlayerBinaryRequest(
			'/url/image',
			'unit-test-key',
			{
				method: 'GET',
				apiVersion: 'v1',
				query: { url, timeout: 5000 },
			},
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected binary request to throw ApiError');
		}
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});

		const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(requestUrl.origin).toBe('https://api.cloudlayer.io');
		expect(requestUrl.pathname).toBe('/v1/url/image');
		expect(requestUrl.searchParams.get('url')).toBe(url);
		expect(requestUrl.searchParams.get('timeout')).toBe('5000');
	});
});
