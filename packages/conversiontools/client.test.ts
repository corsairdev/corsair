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
		).catch((caught: unknown) => caught);

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
