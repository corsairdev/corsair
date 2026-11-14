import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CONVERSIONTOOLS_API_BASE,
	ConversiontoolsDownloadError,
	makeConversiontoolsDownloadByIdRequest,
	makeConversiontoolsDownloadFromLinkRequest,
	makeConversiontoolsRequest,
} from './client';
import { errorHandlers } from './error-handlers';
import { MAX_BINARY_DOWNLOAD_BYTES } from './limits';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);
const FILE_ID = '0123456789abcdef0123456789abcdef';
const TASK_ID = 'fedcba9876543210fedcba9876543210';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/tasks' },
		{
			url: `${CONVERSIONTOOLS_API_BASE}/tasks`,
			ok: false,
			status,
			statusText: message,
			body: { error: message },
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

describe('makeConversiontoolsRequest', () => {
	it('uses Bearer auth and disables automatic 429 retries', async () => {
		mockedRequest.mockResolvedValue({ error: null, task_id: TASK_ID });

		await makeConversiontoolsRequest('/tasks', 'test-key', {
			method: 'POST',
			body: { type: 'convert.xml_to_json', options: { file_id: FILE_ID } },
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CONVERSIONTOOLS_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-key',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/tasks',
				body: {
					type: 'convert.xml_to_json',
					options: { file_id: FILE_ID },
				},
				mediaType: 'application/json; charset=utf-8',
			}),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: { enabled: true, maxRetries: 0 },
		});
	});

	it('accepts a transfer timeout without changing the short JSON default', async () => {
		mockedRequest.mockResolvedValue({ error: null });

		await makeConversiontoolsRequest('/files', 'test-key', {
			method: 'POST',
			formData: { file: new Blob(['xml']) },
			timeoutMs: 42_000,
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.TIMEOUT).toBe(42_000);

		mockedRequest.mockReset();
		mockedRequest.mockResolvedValue({ error: null });
		await makeConversiontoolsRequest('/tasks', 'test-key', { method: 'GET' });
		expect(mockedRequest.mock.calls[0]?.[0]?.TIMEOUT).toBe(20_000);
	});

	it('omits Authorization for public endpoints', async () => {
		mockedRequest.mockResolvedValue({ error: null, count: 0, conversions: [] });

		await makeConversiontoolsRequest('/conversions', undefined, {
			method: 'GET',
			query: { input: 'xml', ai: false },
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(
			CONVERSIONTOOLS_API_BASE,
		);
		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/conversions',
				query: { input: 'xml', ai: false },
			}),
		);
	});

	it('encodes multipart files without overriding the multipart boundary', async () => {
		mockedRequest.mockResolvedValue({ error: null, file_id: FILE_ID });
		const file = new Blob(['xml'], { type: 'application/xml' });

		await makeConversiontoolsRequest('/files', 'test-key', {
			method: 'POST',
			formData: { file },
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Content-Type',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/files',
				formData: { file },
			}),
		);
	});

	it('supports the provider upload-session origin for raw Blob requests', async () => {
		mockedRequest.mockResolvedValue({
			file_id: FILE_ID,
			filename: 'a.xml',
			size: 3,
		});
		const file = new Blob(['xml']);

		await makeConversiontoolsRequest(
			'/v1/upload-sessions/session-id',
			undefined,
			{
				method: 'PUT',
				body: file,
				baseUrl: 'https://api.conversiontools.io',
			},
		);

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(
			'https://api.conversiontools.io',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'PUT',
				url: '/v1/upload-sessions/session-id',
				body: file,
			}),
		);
	});

	it('throws AuthMissingError for an explicitly empty key', async () => {
		await expect(
			makeConversiontoolsRequest('/tasks', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('passes 429 ApiErrors and retryAfter through unchanged', async () => {
		const rateLimited = apiError(429, 'Rate limit exceeded', 2500);
		mockedRequest.mockRejectedValue(rateLimited);

		await expect(
			makeConversiontoolsRequest('/tasks', 'test-key', { method: 'POST' }),
		).rejects.toBe(rateLimited);
		expect(rateLimited.retryAfter).toBe(2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 2500 });
	});

	it('redacts upload-session URLs and IDs from propagated ApiErrors', async () => {
		const sessionId = 'one-time-session-secret';
		const sessionPath = `/v1/upload-sessions/${sessionId}`;
		const sessionUrl = `https://api.conversiontools.io${sessionPath}`;
		const rawError = new ApiError(
			{ method: 'PUT', url: sessionPath },
			{
				url: sessionUrl,
				ok: false,
				status: 500,
				statusText: `Failure at ${sessionId}`,
				body: { error: `Could not upload to ${sessionUrl}` },
			},
			`Request to ${sessionUrl} failed`,
		);
		mockedRequest.mockRejectedValue(rawError);

		const error = await makeConversiontoolsRequest(sessionPath, undefined, {
			method: 'PUT',
			body: new Blob(['xml']),
			baseUrl: 'https://api.conversiontools.io',
		}) // `unknown` because a rejection value has no static type; assertions below narrow it.
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (error instanceof ApiError) {
			expect(error.status).toBe(500);
			expect(error.url).toBe(
				'https://api.conversiontools.io/v1/upload-sessions/[REDACTED]',
			);
			expect(error.request.url).toBe('/v1/upload-sessions/[REDACTED]');
			expect(error.body).toEqual({
				error: 'Could not upload to [REDACTED_UPLOAD_SESSION_URL]',
			});
			expect(JSON.stringify(error)).not.toContain(sessionId);
			expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		}
	});

	it('redacts upload-session URLs from non-ApiError network failures', async () => {
		const sessionId = 'one-time-session-secret';
		const sessionPath = `/v1/upload-sessions/${sessionId}`;
		const sessionUrl = `https://api.conversiontools.io${sessionPath}`;
		mockedRequest.mockRejectedValue(
			new Error(`Network failure at ${sessionUrl}`),
		);

		const error = await makeConversiontoolsRequest(sessionPath, undefined, {
			method: 'PUT',
			body: new Blob(['xml']),
			baseUrl: 'https://api.conversiontools.io',
		}) // `unknown` because a rejection value has no static type; assertions below narrow it.
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(Error);
		if (error instanceof Error) {
			expect(error.message).not.toContain(sessionId);
			expect(error.message).toContain('[REDACTED_UPLOAD_SESSION_URL]');
		}
	});
});

describe('binary download requests', () => {
	it('downloads a file with Bearer auth and preserves arbitrary bytes', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0x00, 0x80, 0xff]), {
				headers: {
					'content-type': 'application/pdf',
					'content-disposition': 'attachment; filename="result.pdf"',
				},
			}),
		);

		const result = await makeConversiontoolsDownloadByIdRequest(
			'0123456789abcdef0123456789abcdef',
			'test-download-key',
		);

		expect(fetchSpy).toHaveBeenCalledWith(
			`${CONVERSIONTOOLS_API_BASE}/files/0123456789abcdef0123456789abcdef`,
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({
					Authorization: 'Bearer test-download-key',
				}),
			}),
		);
		expect(result).toEqual({
			contentBase64: 'AID/',
			contentType: 'application/pdf',
			contentDisposition: 'attachment; filename="result.pdf"',
			size: 3,
		});
	});

	it('uses the configurable transfer timeout for binary downloads', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response(new Uint8Array([0x41])));
		const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');

		await makeConversiontoolsDownloadByIdRequest(
			'0123456789abcdef0123456789abcdef',
			'test-download-key',
			42_000,
		);

		expect(timeoutSpy).toHaveBeenCalledWith(42_000);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('rejects a response over the documented base64-output bound', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array(MAX_BINARY_DOWNLOAD_BYTES + 1), {
				headers: {
					'content-length': String(MAX_BINARY_DOWNLOAD_BYTES + 1),
				},
			}),
		);

		const error = await makeConversiontoolsDownloadByIdRequest(
			'0123456789abcdef0123456789abcdef',
			'test-download-key',
		) // `unknown` because a rejection value has no static type; assertions below narrow it.
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ConversiontoolsDownloadError);
		if (error instanceof ConversiontoolsDownloadError) {
			expect(error.status).toBe(413);
			expect(error.message).toContain('10 MiB');
		}
	});

	it('counts streamed bytes when Content-Length is absent', async () => {
		const chunkSize = Math.floor(MAX_BINARY_DOWNLOAD_BYTES / 2) + 1;
		const body = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(new Uint8Array(chunkSize));
				controller.enqueue(new Uint8Array(chunkSize));
				controller.close();
			},
		});
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body));

		const error = await makeConversiontoolsDownloadFromLinkRequest(
			'abcdef0123456789abcdef0123456789',
		) // `unknown` because a rejection value has no static type; assertions below narrow it.
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ConversiontoolsDownloadError);
		if (error instanceof ConversiontoolsDownloadError) {
			expect(error.status).toBe(413);
		}
	});

	it('follows a temporary download ID without Authorization', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0x41]), {
				headers: { 'content-type': 'text/plain' },
			}),
		);

		const result = await makeConversiontoolsDownloadFromLinkRequest(
			'abcdef0123456789abcdef0123456789',
		);

		expect(fetchSpy).toHaveBeenCalledWith(
			`${CONVERSIONTOOLS_API_BASE}/files/abcdef0123456789abcdef0123456789/download`,
			expect.objectContaining({
				method: 'GET',
				headers: { Accept: 'application/octet-stream' },
			}),
		);
		expect(fetchSpy.mock.calls[0]?.[1]?.headers).not.toHaveProperty(
			'Authorization',
		);
		expect(result).toEqual({
			contentBase64: 'QQ==',
			contentType: 'text/plain',
			contentDisposition: undefined,
			size: 1,
		});
	});

	it('routes HTTP 429 as a sanitized typed error without retrying', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('private response body test-download-key', {
				status: 429,
			}),
		);

		// Promise rejections are untyped at runtime; narrow before reading status.
		const error = await makeConversiontoolsDownloadByIdRequest(
			'0123456789abcdef0123456789abcdef',
			'test-download-key',
		) // `unknown` because a rejection value has no static type; assertions below narrow it.
			.catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ConversiontoolsDownloadError);
		if (error instanceof ConversiontoolsDownloadError) {
			expect(error.status).toBe(429);
			expect(error.message).not.toContain('private response body');
			expect(error.message).not.toContain('test-download-key');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(error),
			).resolves.toEqual({ maxRetries: 0 });
		}
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('does not send a request with an explicitly empty API key', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch');

		await expect(
			makeConversiontoolsDownloadByIdRequest(
				'0123456789abcdef0123456789abcdef',
				'',
			),
		).rejects.toThrow(AuthMissingError);
		expect(fetchSpy).not.toHaveBeenCalled();
	});
});
