import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	IGNISIGN_API_BASE,
	makeIgnisignBinaryRequest,
	makeIgnisignRequest,
	sanitizeData,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function createApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v4/signature-requests/one-call-sign' },
		{
			url: `${IGNISIGN_API_BASE}/v4/signature-requests/one-call-sign`,
			ok: false,
			status,
			statusText: message,
			body: { message, status },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
	jest.restoreAllMocks();
});

describe('makeIgnisignRequest', () => {
	it('sends Authorization: Bearer <apiKey> and default headers', async () => {
		mockRequest.mockResolvedValue({ _id: 'sig_123' });

		await makeIgnisignRequest(
			'/v4/signature-requests/one-call-sign',
			'sk_dev_app123_sec',
			{
				method: 'POST',
				body: { title: 'Test Request' },
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: IGNISIGN_API_BASE,
			HEADERS: {
				Authorization: 'Bearer sk_dev_app123_sec',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v4/signature-requests/one-call-sign',
				body: { title: 'Test Request' },
			}),
		);
	});

	it('sends multipart form data without a JSON Content-Type', async () => {
		mockRequest.mockResolvedValue({ _id: 'doc_1' });
		const file = new File(['x'], 'a.pdf', { type: 'application/pdf' });

		await makeIgnisignRequest('/v4/documents/doc_1/file', 'sk_dev_app_sec', {
			method: 'POST',
			formData: { file },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).not.toHaveProperty('Content-Type');
		expect(options).toEqual(
			expect.objectContaining({ method: 'POST', formData: { file } }),
		);
		expect(options).not.toHaveProperty('mediaType');
		expect(options).not.toHaveProperty('body');
	});

	it('makes unauthenticated requests without Authorization header when key is undefined', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeIgnisignRequest('/v4/applications/appId_1/context', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		mockRequest.mockResolvedValue({ valid: true });

		// `unknown` because rejection value has no static type.
		const error: unknown = await makeIgnisignRequest(
			'/v4/signature-requests/one-call-sign',
			'',
			{ method: 'POST' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('redacts sensitive fields from ApiError body on failure', async () => {
		const rawApiError = new ApiError(
			{ method: 'POST', url: '/v4/signers' },
			{
				url: `${IGNISIGN_API_BASE}/v4/signers`,
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					message: 'Validation failed',
					authSecret: 'super-secret-pass',
					nested: {
						apiKey: 'sk_test_123',
						token: 'secret-token',
					},
				},
			},
			'Validation failed',
		);
		mockRequest.mockRejectedValue(rawApiError);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignRequest(
			'/v4/signers',
			'sk_dev_app123_sec',
			{ method: 'POST' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		const typedError = error as ApiError;
		expect(typedError.status).toBe(400);
		expect(typedError.body).toEqual({ message: 'Validation failed' });
	});

	it('keeps only the error code and message from the body, dropping the echoed context', async () => {
		// IgniSign errors are `{ errorCode, message?, context? }`; `context` can
		// echo the signer that was sent.
		const contextError = new ApiError(
			{ method: 'POST', url: '/v4/signers' },
			{
				url: `${IGNISIGN_API_BASE}/v4/signers`,
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					errorCode: 'SIGNER_INPUT_INVALID',
					message: 'Signer input is invalid',
					context: {
						firstName: 'Jane',
						lastName: 'Doe',
						phoneNumber: '+33612345678',
					},
					signer: { firstName: 'Jane' },
				},
			},
			'Signer input is invalid',
		);
		mockRequest.mockRejectedValue(contextError);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignRequest('/v4/signers', 'key', {
			method: 'POST',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		const typedError = error as ApiError;
		expect(typedError.body).toEqual({
			errorCode: 'SIGNER_INPUT_INVALID',
			message: 'Signer input is invalid',
		});
		const serialized = `${typedError.message} ${JSON.stringify(typedError.body)}`;
		expect(serialized).not.toContain('Jane');
		expect(serialized).not.toContain('+33612345678');
	});

	it('masks the signer values the caller sent when the message repeats them', async () => {
		const echoError = new ApiError(
			{ method: 'POST', url: '/v4/signers' },
			{
				url: `${IGNISIGN_API_BASE}/v4/signers`,
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: {
					errorCode: 'SIGNER_INPUT_INVALID',
					message: 'Signer Jane Doe +33612345678 is invalid (EN)',
				},
			},
			'Signer Jane Doe +33612345678 is invalid (EN)',
		);
		mockRequest.mockRejectedValue(echoError);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignRequest('/v4/signers', 'key', {
			method: 'POST',
			body: {
				firstName: 'Jane',
				lastName: 'Doe',
				phoneNumber: '+33612345678',
				language: 'EN',
				metadata: { nickname: 'Janie' },
			},
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		const typedError = error as ApiError;
		const expected =
			'Signer [REDACTED] [REDACTED] [REDACTED] is invalid ([REDACTED])';
		expect(typedError.message).toBe(expected);
		expect(typedError.body).toEqual({
			errorCode: 'SIGNER_INPUT_INVALID',
			message: expected,
		});
	});

	it('leaves the echoed context out of the fallback message too', async () => {
		const rawBody = {
			errorCode: 'SIGNER_INPUT_INVALID',
			context: { lastName: 'Doe', phoneNumber: '+33612345678' },
		};
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/v4/signers' },
				{
					url: `${IGNISIGN_API_BASE}/v4/signers`,
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: rawBody,
				},
				`Generic Error: status: 400; body: ${JSON.stringify(rawBody)}`,
			),
		);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignRequest('/v4/signers', 'key', {
			method: 'POST',
		}).catch((caught: unknown) => caught);

		const message = (error as ApiError).message;
		expect(message).toContain('SIGNER_INPUT_INVALID');
		expect(message).not.toContain('Doe');
		expect(message).not.toContain('+33612345678');
	});

	it('builds the error message from the redacted body when it has no message field', async () => {
		const detailError = new ApiError(
			{ method: 'POST', url: '/v4/signers' },
			{
				url: `${IGNISIGN_API_BASE}/v4/signers`,
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: { detail: 'Signer jane.doe@example.com is invalid' },
			},
			// Core copies `detail` into the message.
			'Signer jane.doe@example.com is invalid',
		);
		const rawBody = { code: 'SIGNER_CONFLICT', authSecret: 'raw-auth-secret' };
		const genericError = new ApiError(
			{ method: 'POST', url: '/v4/signers' },
			{
				url: `${IGNISIGN_API_BASE}/v4/signers`,
				ok: false,
				status: 409,
				statusText: 'Conflict',
				body: rawBody,
			},
			// Core's fallback message embeds the whole raw body.
			`Generic Error: status: 409; status text: Conflict; body: ${JSON.stringify(rawBody, null, 2)}`,
		);
		mockRequest
			.mockRejectedValueOnce(detailError)
			.mockRejectedValueOnce(genericError);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const first: unknown = await makeIgnisignRequest('/v4/signers', 'key', {
			method: 'POST',
		}).catch((caught: unknown) => caught);
		// `unknown` because rejection value has no static type; assertions narrow it.
		const second: unknown = await makeIgnisignRequest('/v4/signers', 'key', {
			method: 'POST',
		}).catch((caught: unknown) => caught);

		expect(first).toBeInstanceOf(ApiError);
		expect((first as ApiError).message).toBe(
			'Signer [REDACTED_EMAIL] is invalid',
		);
		expect(second).toBeInstanceOf(ApiError);
		const secondMessage = (second as ApiError).message;
		expect(secondMessage).not.toContain('raw-auth-secret');
		expect(secondMessage).toContain('409');
		expect(secondMessage).toContain('SIGNER_CONFLICT');
	});

	it('rethrows 429 ApiError preserving status and retryAfter', async () => {
		const rateLimitError = createApiError(429, 'Too many requests', 5000);
		mockRequest.mockRejectedValue(rateLimitError);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignRequest(
			'/v4/signature-requests/one-call-sign',
			'test-key',
			{ method: 'POST' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		const typedError = error as ApiError;
		expect(typedError.status).toBe(429);
		expect(typedError.retryAfter).toBe(5000);
	});
});

describe('sanitizeData', () => {
	it('handles primitives, arrays and objects cleanly without leaking secrets', () => {
		expect(sanitizeData(null)).toBeNull();
		expect(sanitizeData(undefined)).toBeUndefined();
		expect(sanitizeData('sample')).toBe('sample');
		expect(sanitizeData(123)).toBe(123);
		expect(sanitizeData(true)).toBe(true);

		const sensitiveObj = {
			email: 'test@example.com',
			apiKey: 'secret1',
			token: 'secret2',
			authSecret: 'secret3',
			privateKey: 'secret4',
			safeField: 'visible',
		};
		expect(sanitizeData(sensitiveObj)).toEqual({
			email: '[REDACTED_EMAIL]',
			apiKey: '[REDACTED]',
			token: '[REDACTED]',
			authSecret: '[REDACTED]',
			privateKey: '[REDACTED]',
			safeField: 'visible',
		});
	});

	it('removes email addresses from provider error messages', () => {
		expect(
			sanitizeData({
				message: 'Signer jane.doe+x@example.co.uk already exists',
				context: { emails: ['a@b.io'] },
			}),
		).toEqual({
			message: 'Signer [REDACTED_EMAIL] already exists',
			context: { emails: ['[REDACTED_EMAIL]'] },
		});
	});
});

describe('makeIgnisignBinaryRequest', () => {
	it('throws AuthMissingError on empty key without fetching', async () => {
		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignBinaryRequest(
			'/v4/documents/doc_1/file',
			'',
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(AuthMissingError);
	});

	it('returns binary structure with base64 and contentType on successful fetch', async () => {
		const fakePdfBytes = Buffer.from('%PDF-1.4 mock content');
		const fakeResponse = new Response(fakePdfBytes, {
			status: 200,
			headers: { 'content-type': 'application/pdf' },
		});
		jest.spyOn(global, 'fetch').mockResolvedValue(fakeResponse);

		const result = await makeIgnisignBinaryRequest(
			'/v4/documents/doc_1/file',
			'sk_test_key',
		);

		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: fakePdfBytes.toString('base64'),
			size: fakePdfBytes.byteLength,
		});
	});

	it('throws ApiError with retryAfter on HTTP 429 binary response', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
			Promise.resolve(
				new Response(null, {
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'retry-after': '0' },
				}),
			),
		);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignBinaryRequest(
			'/v4/documents/doc_1/file',
			'sk_test_key',
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(0);
		}
		expect(fetchSpy).toHaveBeenCalledTimes(3);
	});

	it('retries a safe GET download after the Retry-After delay', async () => {
		jest.useFakeTimers();
		const fetchSpy = jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce(
				new Response(null, {
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'retry-after': '2' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(Buffer.from('document'), {
					status: 200,
					headers: { 'content-type': 'application/pdf' },
				}),
			);

		const download = makeIgnisignBinaryRequest(
			'/v4/documents/doc_1/file',
			'sk_test_key',
		);
		await jest.advanceTimersByTimeAsync(0);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		await jest.advanceTimersByTimeAsync(1999);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		await jest.advanceTimersByTimeAsync(1);
		await expect(download).resolves.toMatchObject({
			kind: 'binary',
			contentType: 'application/pdf',
		});
		expect(fetchSpy).toHaveBeenCalledTimes(2);
		jest.useRealTimers();
	});

	it('returns the 429 at once when Retry-After is longer than the wait budget', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'retry-after': '120' },
			}),
		);

		await expect(
			makeIgnisignBinaryRequest('/v4/documents/doc_1/file', 'sk_test_key'),
		).rejects.toMatchObject({ status: 429, retryAfter: 120_000 });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('does not retry a POST binary request after 429', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'retry-after': '0' },
			}),
		);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await makeIgnisignBinaryRequest(
			'/v4/documents/doc_1/file',
			'sk_test_key',
			{ method: 'POST' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});

describe('real-transport rate-limit handling', () => {
	it('extracts Retry-After correctly in real transport', async () => {
		// `unknown` because jest.requireActual returns untrusted module surface.
		const realHttp: unknown = jest.requireActual('corsair/http');
		const realRequest = (realHttp as { request: typeof request }).request;

		jest.spyOn(global, 'fetch').mockImplementation(() =>
			Promise.resolve(
				new Response(JSON.stringify({ message: 'Rate limited' }), {
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				}),
			),
		);

		// `unknown` because rejection value has no static type; assertions narrow it.
		const error: unknown = await realRequest(
			{
				BASE: 'https://api.ignisign.io',
				VERSION: '4.0.0',
				HEADERS: {},
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit' as const,
			},
			{
				method: 'GET',
				url: '/v4/signature-requests',
			},
			{
				rateLimitConfig: {
					enabled: true,
					maxRetries: 0,
					initialRetryDelay: 0,
					backoffMultiplier: 1,
					headerNames: { retryAfter: 'retry-after' },
				},
			},
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		const typedError = error as ApiError;
		expect(typedError.status).toBe(429);
		expect(typedError.retryAfter).toBe(4000);
	});
});
