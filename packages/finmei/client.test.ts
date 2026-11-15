import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FINMEI_API_BASE,
	FINMEI_RATE_LIMIT_CONFIG,
	FinmeiAPIError,
	makeFinmeiBinaryRequest,
	makeFinmeiRequest,
	parseRetryAfterMs,
	redactSensitiveData,
	sanitizeErrorMessage,
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
	// `unknown` because mock error body reflects untrusted remote response payloads of varying types.
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

	it('passes core ApiError through with credentials redacted from its body', async () => {
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

		expect(caught).toBeInstanceOf(ApiError);
		const apiErr = caught as ApiError;
		expect(apiErr.status).toBe(401);
		// `unknown` because apiErr.body is sanitized untrusted record.
		const details = apiErr.body as Record<string, unknown>;
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
			undefined,
			{ maxRetries: 0 },
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FinmeiAPIError);
		const err = caught as FinmeiAPIError;
		expect(err.status).toBe(429);
		expect(err.retryAfter).toBe(3000);
		// `unknown` because error details are typed unknown.
		const details = err.details as Record<string, unknown>;
		expect(details.api_key).toBe('[REDACTED]');
	});

	it('retries binary request on 429 and gives up when budget is exhausted', async () => {
		const rateLimited = () =>
			new Response(JSON.stringify({ message: 'Rate limit' }), {
				status: 429,
				headers: { 'retry-after': '0' },
			});
		const fetchSpy = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => rateLimited());

		// `unknown` because rejection has no static type.
		const caught: unknown = await makeFinmeiBinaryRequest(
			'/invoices/123/download',
			'test-token',
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FinmeiAPIError);
		const err = caught as FinmeiAPIError;
		expect(err.status).toBe(429);
		// Initial attempt + 2 retries = 3 calls
		expect(fetchSpy).toHaveBeenCalledTimes(3);
	});

	it('binary request recovers after 429 retry', async () => {
		const rateLimited = new Response(
			JSON.stringify({ message: 'Rate limit' }),
			{
				status: 429,
				headers: { 'retry-after': '0' },
			},
		);
		const rawBytes = Buffer.from('PDF_CONTENT');
		const ab = rawBytes.buffer.slice(
			rawBytes.byteOffset,
			rawBytes.byteOffset + rawBytes.byteLength,
		);
		const successResponse = new Response(ab, {
			status: 200,
			headers: { 'content-type': 'application/pdf' },
		});

		jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce(rateLimited)
			.mockResolvedValueOnce(successResponse);

		const result = await makeFinmeiBinaryRequest(
			'/invoices/123/download',
			'test-token',
		);
		expect(result.contentType).toBe('application/pdf');
		expect(result.size).toBe(rawBytes.byteLength);
	});

	it('reads plain-text error details from non-OK binary responses', async () => {
		const plainTextResponse = new Response('Plain text error explanation', {
			status: 500,
			headers: { 'content-type': 'text/plain' },
		});
		jest.spyOn(global, 'fetch').mockResolvedValue(plainTextResponse);

		// `unknown` because rejection has no static type.
		const caught: unknown = await makeFinmeiBinaryRequest(
			'/invoices/123/download',
			'test-token',
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FinmeiAPIError);
		const err = caught as FinmeiAPIError;
		expect(err.details).toBe('Plain text error explanation');
	});

	it('sanitizes error.message to redact credentials and tokens', async () => {
		const apiErr = makeApiError(
			422,
			'Validation failed for api_key=secret-123 and Bearer my-secret-token and token: super-secret',
		);
		mockRequest.mockRejectedValue(apiErr);

		// `unknown` because rejection has no static type.
		const caught: unknown = await makeFinmeiRequest(
			'/invoices',
			'custom-api-key',
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(ApiError);
		const err = caught as ApiError;
		expect(err.message).not.toContain('secret-123');
		expect(err.message).not.toContain('my-secret-token');
		expect(err.message).not.toContain('super-secret');
		expect(err.message).toContain('[REDACTED]');
	});

	it('redacts credentials echoed in provider messages and response details', async () => {
		const credential = 'finmei-live-secret-credential-42';
		const apiErr = makeApiError(
			422,
			`Validation failed for credential ${credential}`,
			2500,
			{
				message: `The credential ${credential} is invalid`,
				api_key: credential,
			},
		);
		mockRequest.mockRejectedValue(apiErr);

		// `unknown` because rejection from makeFinmeiRequest has no static type.
		const caught: unknown = await makeFinmeiRequest('/invoices').catch(
			(err: unknown) => err,
		);

		expect(caught).toBeInstanceOf(ApiError);
		const err = caught as ApiError;
		expect(err.status).toBe(422);
		expect(err.retryAfter).toBe(2500);
		expect(err.isRateLimitError()).toBe(false);
		expect(err.message).not.toContain(credential);
		expect(JSON.stringify(err)).not.toContain(credential);
		expect(err.body).toMatchObject({ api_key: '[REDACTED]' });
	});

	it('leaves the sent invoice body and query off the ApiError', async () => {
		const sentBody = {
			buyer: { name: 'Jane Customer', email: 'jane@example.com' },
		};
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/invoices',
					body: sentBody,
					query: { search: 'Jane' },
				},
				{
					url: `${FINMEI_API_BASE}/invoices?search=Jane`,
					ok: false,
					status: 422,
					statusText: 'Unprocessable Content',
					body: { message: 'The products.0.units field is required.' },
				},
				'Unprocessable Content',
			),
		);

		// `unknown` because rejection from makeFinmeiRequest has no static type.
		const caught: unknown = await makeFinmeiRequest('/invoices', 'key-1', {
			method: 'POST',
			body: sentBody,
			query: { search: 'Jane' },
		}).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(ApiError);
		const err = caught as ApiError;
		expect(err.request.body).toBeUndefined();
		expect(err.request.query).toBeUndefined();
		expect(JSON.stringify(err)).not.toContain('Jane');
		expect(JSON.stringify(err)).not.toContain('jane@example.com');
		expect(err.body).toEqual({
			message: 'The products.0.units field is required.',
		});
	});

	it('redacts every copy of a secret named in a download error body', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					token: 'secondary-secret',
					message: 'bad secondary-secret',
				}),
				{ status: 400, headers: { 'content-type': 'application/json' } },
			),
		);

		// `unknown` because rejection has no static type.
		const caught: unknown = await makeFinmeiBinaryRequest(
			'/invoices/123/download',
			'test-token',
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FinmeiAPIError);
		expect(JSON.stringify((caught as FinmeiAPIError).details)).not.toContain(
			'secondary-secret',
		);
	});

	it('parseRetryAfterMs converts retry-after header to milliseconds', () => {
		const res = new Response(null, { headers: { 'retry-after': '5' } });
		expect(parseRetryAfterMs(res)).toBe(5000);
		const noHeader = new Response(null);
		expect(parseRetryAfterMs(noHeader)).toBeUndefined();
	});

	it('sanitizeErrorMessage redacts known credentials, bearer tokens, and explicit apiKey', () => {
		const raw =
			'Invalid Bearer foo.bar.baz with apiKey=abc12345 and token="secret"';
		expect(sanitizeErrorMessage(raw, 'custom-key')).toBe(
			'Invalid Bearer [REDACTED] with apiKey=[REDACTED] and token="[REDACTED]"',
		);
		expect(sanitizeErrorMessage('Error with custom-key', 'custom-key')).toBe(
			'Error with [REDACTED]',
		);
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
