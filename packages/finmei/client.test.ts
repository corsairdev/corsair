import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FINMEI_API_BASE,
	FINMEI_RATE_LIMIT_CONFIG,
	FinmeiAPIError,
	makeFinmeiBinaryRequest,
	makeFinmeiRequest,
	redactSensitiveData,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	// `unknown` because jest.requireActual returns module surface with untyped exports.
	const actual: Record<string, unknown> = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function makeApiError(
	status: number,
	message: string,
	retryAfter?: number,
	body?: unknown,
) {
	return new ApiError(
		{ method: 'GET', url: '/invoices' },
		{
			url: `${FINMEI_API_BASE}/invoices`,
			ok: false,
			status,
			statusText: message,
			// `unknown` because mock error body reflects untrusted remote response.
			body: body as unknown,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
	jest.restoreAllMocks();
});

describe('makeFinmeiRequest', () => {
	it('sends Authorization: Bearer <apiKey> in headers', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeFinmeiRequest('/invoices', 'test-token-xyz', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: FINMEI_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-token-xyz',
				Accept: 'application/json',
			},
		});
	});

	it('throws AuthMissingError when apiKey is explicitly empty string without making request', async () => {
		await expect(
			makeFinmeiRequest('/invoices', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends unauthenticated request when apiKey is undefined', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeFinmeiRequest('/currencies', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('forwards body and query options for JSON requests', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'inv-1' } });

		await makeFinmeiRequest('/invoices', 'test-token', {
			method: 'POST',
			body: { currency: 'USD' },
			query: { draft: true },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: FINMEI_API_BASE }),
			expect.objectContaining({
				method: 'POST',
				url: '/invoices',
				body: { currency: 'USD' },
				query: { draft: true },
				mediaType: 'application/json',
			}),
			expect.objectContaining({ rateLimitConfig: FINMEI_RATE_LIMIT_CONFIG }),
		);
	});

	it('supports formData for multipart uploads', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'exp-1' } });

		const dummyBlob = new Blob(['sample-data'], { type: 'text/plain' });
		await makeFinmeiRequest('/expenses', 'test-token', {
			method: 'POST',
			formData: { file: dummyBlob, total: '10' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: FINMEI_API_BASE }),
			expect.objectContaining({
				method: 'POST',
				url: '/expenses',
				formData: { file: dummyBlob, total: '10' },
			}),
			expect.anything(),
		);
	});

	it('rethrows ApiError wrapped as FinmeiAPIError with sanitized credentials in details', async () => {
		const sensitiveBody = {
			error: 'Invalid key provided',
			apiKey: 'secret_live_key_9999',
			token: 'bearer_token_xyz',
			nested: {
				password: 'supersecretpassword',
				normalKey: 'visible value',
			},
		};
		const error = makeApiError(401, 'Unauthorized', undefined, sensitiveBody);
		mockRequest.mockRejectedValue(error);

		// `unknown` because rejection from makeFinmeiRequest has no static type.
		const caught: unknown = await makeFinmeiRequest(
			'/invoices',
			'bad-token',
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FinmeiAPIError);
		const apiErr = caught as FinmeiAPIError;
		expect(apiErr.status).toBe(401);
		// `unknown` because apiErr.details is sanitized untrusted record.
		const details = apiErr.details as Record<string, unknown>;
		expect(details.apiKey).toBe('[REDACTED]');
		expect(details.token).toBe('[REDACTED]');
		// `unknown` because nested details must be narrowed to record.
		const nested = details.nested as Record<string, unknown>;
		expect(nested.password).toBe('[REDACTED]');
		expect(nested.normalKey).toBe('visible value');
	});
});

describe('redactSensitiveData', () => {
	it('handles primitives and recurses safely', () => {
		expect(redactSensitiveData(null)).toBeNull();
		expect(redactSensitiveData(undefined)).toBeUndefined();
		expect(redactSensitiveData(123)).toBe(123);
		expect(redactSensitiveData('safe-string')).toBe('safe-string');

		const obj = {
			authorization: 'Bearer 123',
			sec_ret_key: 'topsecret',
			data: [1, { apikey: 'abc', count: 5 }],
		};
		// `unknown` because return from redactSensitiveData is untrusted and cast to record for assertions.
		const redacted = redactSensitiveData(obj) as Record<string, unknown>;
		expect(redacted.authorization).toBe('[REDACTED]');
		// `unknown` because array element in data must be narrowed to record.
		const arrayItem = (redacted.data as unknown[])[1] as Record<
			string,
			unknown
		>;
		expect(arrayItem.apikey).toBe('[REDACTED]');
		expect(arrayItem.count).toBe(5);
	});
});

describe('makeFinmeiBinaryRequest', () => {
	it('throws AuthMissingError when apiKey is explicitly empty', async () => {
		await expect(
			makeFinmeiBinaryRequest('/invoices/123/download', ''),
		).rejects.toThrow(AuthMissingError);
	});

	it('downloads binary data and returns base64 and contentType', async () => {
		const rawBytes = Buffer.from('PDF_SAMPLE_CONTENT');
		const ab = rawBytes.buffer.slice(
			rawBytes.byteOffset,
			rawBytes.byteOffset + rawBytes.byteLength,
		);
		const mockResponse = new Response(ab, {
			status: 200,
			headers: { 'content-type': 'application/pdf' },
		});
		jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

		const result = await makeFinmeiBinaryRequest(
			'/invoices/123/download',
			'test-token',
			{ format: 'pdf' },
		);

		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: rawBytes.toString('base64'),
			size: rawBytes.byteLength,
		});
	});

	it('handles non-OK response with Retry-After and sanitized error details', async () => {
		const mockResponse = new Response(
			JSON.stringify({ message: 'Rate limit hit', api_key: 'secret' }),
			{
				status: 429,
				headers: {
					'content-type': 'application/json',
					'retry-after': '3',
				},
			},
		);
		jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

		// `unknown` because rejection has no static type.
		const caught: unknown = await makeFinmeiBinaryRequest(
			'/invoices/123/download',
			'test-token',
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FinmeiAPIError);
		const err = caught as FinmeiAPIError;
		expect(err.status).toBe(429);
		expect(err.retryAfter).toBe(3000);
		// `unknown` because error details are typed unknown.
		const details = err.details as Record<string, unknown>;
		expect(details.api_key).toBe('[REDACTED]');
	});
});

describe('Real transport Retry-After extraction', () => {
	it('extracts retryAfter from 429 response using real transport', async () => {
		// `unknown` because requireActual returns untyped module exports.
		const actualHttp: Record<string, unknown> =
			jest.requireActual('corsair/http');
		const realRequest = actualHttp.request as typeof request;

		const createMockResponse = () =>
			new Response(JSON.stringify({ message: 'Rate limit exceeded' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'content-type': 'application/json',
					'retry-after': '4',
				},
			});
		jest
			.spyOn(global, 'fetch')
			.mockImplementation(() => Promise.resolve(createMockResponse()));

		// `unknown` because error thrown by real transport has no static type.
		const caught: unknown = await realRequest(
			{
				BASE: FINMEI_API_BASE,
				VERSION: '1.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				HEADERS: {},
			},
			{ method: 'GET', url: '/invoices' },
			{ rateLimitConfig: { ...FINMEI_RATE_LIMIT_CONFIG, maxRetries: 0 } },
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(ApiError);
		const apiErr = caught as ApiError;
		expect(apiErr.status).toBe(429);
		expect(apiErr.retryAfter).toBe(4000);

		// Verify that errorHandlers.RATE_LIMIT_ERROR matches and returns maxRetries: 0
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiErr)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
