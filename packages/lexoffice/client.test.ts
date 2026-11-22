import { AuthMissingError } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	compactQuery,
	LEXOFFICE_API_BASE,
	LEXOFFICE_NO_TRANSPORT_RETRIES,
	makeLexofficeRequest,
	sanitizeApiError,
	toLexofficeFileResponse,
} from './client';
import { FileDownloadResponseSchema } from './endpoints/types';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/profile' },
		{
			url: 'https://api.lexware.io/v1/profile',
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
	mockedRequest.mockReset();
});

describe('makeLexofficeRequest', () => {
	it('uses a non-empty fallback for binary downloads without Content-Type', () => {
		const result = toLexofficeFileResponse({
			bytes: new Uint8Array([0, 255, 17]),
			contentType: null,
		});

		expect(FileDownloadResponseSchema.parse(result)).toEqual({
			kind: 'binary',
			contentType: 'application/octet-stream',
			base64: 'AP8R',
			sizeBytes: 3,
		});
		expect(
			toLexofficeFileResponse({
				bytes: new Uint8Array([1]),
				contentType: 'application/pdf',
			}).contentType,
		).toBe('application/pdf');
	});

	it('uses the v1 base URL and Authorization: Bearer header', async () => {
		mockedRequest.mockResolvedValue({ organizationId: 'org-123' });

		await makeLexofficeRequest('/profile', 'test-api-key', {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: LEXOFFICE_API_BASE,
			VERSION: '1.0.0',
			HEADERS: {
				Authorization: 'Bearer test-api-key',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/profile' }),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('sends POST body and compacts query parameters', async () => {
		mockedRequest.mockResolvedValue({ id: 'res-1' });

		await makeLexofficeRequest('/contacts', 'test-api-key', {
			method: 'POST',
			body: { version: 0 },
			query: { page: 1, size: undefined },
		});

		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/contacts',
				body: { version: 0 },
				query: { page: 1 },
			}),
		);
	});

	it('uses multipart form data without forcing a JSON content type', async () => {
		mockedRequest.mockResolvedValue({ id: 'file-1', voucherId: 'v-1' });
		const file = new File(['%PDF-1.4'], 'receipt.pdf', {
			type: 'application/pdf',
		});

		await makeLexofficeRequest('/files', 'test-api-key', {
			method: 'POST',
			formData: { file, type: 'voucher' },
		});

		expect(mockedRequest.mock.calls[0]?.[0].HEADERS).not.toHaveProperty(
			'Content-Type',
		);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/files',
			formData: { file, type: 'voucher' },
			mediaType: undefined,
		});
	});

	it('real transport keeps upload multipart and file downloads byte-exact', async () => {
		const actualHttp = jest.requireActual<{ request: typeof request }>(
			'corsair/http',
		);
		const originalFetch = global.fetch;
		let observedHeaders: Headers | undefined;
		let observedBody: FormData | undefined;
		const mockFetch = jest.fn(
			async (_input: Request | URL | string, init?: RequestInit) => {
				observedHeaders = new Headers(init?.headers);
				if (init?.body instanceof FormData) observedBody = init.body;
				return new Response(JSON.stringify({ id: 'file-1' }), {
					status: 202,
					headers: { 'Content-Type': 'application/json' },
				});
			},
		);
		global.fetch = mockFetch;

		try {
			const config = {
				BASE: LEXOFFICE_API_BASE,
				VERSION: '1',
				HEADERS: { Authorization: 'Bearer test-api-key' },
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit' as const,
			};
			await actualHttp.request<{ id: string }>(
				config,
				{
					method: 'POST',
					url: '/files',
					formData: {
						file: new File(['%PDF-1.4'], 'receipt.pdf', {
							type: 'application/pdf',
						}),
						type: 'voucher',
					},
				},
				{ rateLimitConfig: LEXOFFICE_NO_TRANSPORT_RETRIES },
			);
			expect(observedHeaders?.get('Content-Type')).not.toBe(
				'application/json; charset=utf-8',
			);
			expect(observedBody).toBeInstanceOf(FormData);
			expect(observedBody?.get('type')).toBe('voucher');
			expect(observedBody?.get('file')).toBeInstanceOf(Blob);

			const bytes = new Uint8Array([0, 255, 17]);
			mockFetch.mockResolvedValueOnce(
				new Response(bytes, {
					status: 200,
					headers: { 'Content-Type': 'application/pdf' },
				}),
			);
			const downloaded = await actualHttp.request<BinaryResponse>(
				config,
				{
					method: 'GET',
					url: '/files/file-1',
					responseType: 'binary',
					headers: { Accept: '*/*' },
				},
				{ rateLimitConfig: LEXOFFICE_NO_TRANSPORT_RETRIES },
			);
			expect(Array.from(downloaded.bytes)).toEqual([0, 255, 17]);
			expect(downloaded.contentType).toBe('application/pdf');
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('omits undefined query values via compactQuery', () => {
		expect(
			compactQuery({
				page: 0,
				size: 25,
				email: undefined,
			}),
		).toEqual({
			page: 0,
			size: 25,
		});
	});

	it('throws AuthMissingError for an empty key without sending a request', async () => {
		await expect(makeLexofficeRequest('/profile', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2000);
		mockedRequest.mockRejectedValue(rateLimited);

		// `unknown` because rejection value has no static type
		const caught = await makeLexofficeRequest('/profile', 'test-api-key').catch(
			(err: unknown) => err,
		);

		expect(caught).toBe(rateLimited);
		if (caught instanceof ApiError) {
			expect(caught.status).toBe(429);
			expect(caught.retryAfter).toBe(2000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(caught),
			).resolves.toEqual({
				maxRetries: 5,
				headersRetryAfterMs: 2000,
			});
		}
	});

	it('sanitizes ApiError payloads without losing status or retry metadata', () => {
		const err = new ApiError(
			{
				method: 'POST',
				url: '/contacts',
				headers: { authorization: 'Bearer secret-token' },
				query: { apikey: 'secret-key' },
				body: {
					apiKey: 'secret',
					name: 'Acme',
					email: 'customer@example.com',
				},
			},
			{
				url: 'https://api.lexware.io/v1/contacts',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { token: 'echoed-token', message: 'invalid' },
			},
			'provider echoed customer@example.com and secret-token',
		);

		const sanitized = sanitizeApiError(err);
		expect(sanitized).toBe(err);
		expect(err.stack).not.toContain('customer@example.com');
		expect(err.stack).not.toContain('secret-token');
		expect(err.url).toBe(LEXOFFICE_API_BASE);
		expect(err.status).toBe(400);
		expect(err.request.url).toBe(LEXOFFICE_API_BASE);
		expect(err.request.headers).toBeUndefined();
		expect(err.request.query).toBeUndefined();
		expect(err.request.body).toBeUndefined();
		expect(err.body).toEqual({ message: 'invalid' });
		expect(err.message).toBe('Lexware API request failed: invalid');

		const plainError = new Error('regular error');
		expect(sanitizeApiError(plainError)).toBe(plainError);
	});

	it('keeps Lexware validation messages and issue keys an agent can act on', () => {
		const notAcceptable = new ApiError(
			{ method: 'POST', url: '/invoices', body: { address: { name: 'Acme' } } },
			{
				url: 'https://api.lexware.io/v1/invoices',
				ok: false,
				status: 406,
				statusText: 'Not Acceptable',
				// Trimmed from a live 406 on a 18% tax rate (11-21).
				body: {
					status: 406,
					error: 'Not Acceptable',
					path: '/v1/invoices',
					traceId: '86dec2837e5f',
					message:
						'Invalid taxRatePercentage or does not match booking date or country code.',
				},
			},
			'Not Acceptable',
		);
		sanitizeApiError(notAcceptable);
		expect(notAcceptable.status).toBe(406);
		expect(notAcceptable.message).toBe(
			'Lexware API request failed: Invalid taxRatePercentage or does not match booking date or country code.',
		);
		expect(notAcceptable.request.body).toBeUndefined();

		const badRequest = new ApiError(
			{ method: 'POST', url: '/contacts' },
			{
				url: 'https://api.lexware.io/v1/contacts',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					IssueList: [
						{
							i18nKey: 'missing_entity',
							source: 'company and person',
							type: 'validation_failure',
						},
						{ i18nKey: 'invalid_value', source: 'customer@example.com' },
					],
				},
			},
			'Bad Request',
		);
		sanitizeApiError(badRequest);
		expect(badRequest.body).toEqual({
			message: 'Lexware API request failed',
			IssueList: [
				{
					i18nKey: 'missing_entity',
					source: 'company and person',
					type: 'validation_failure',
				},
				{ i18nKey: 'invalid_value' },
			],
		});
		expect(JSON.stringify(badRequest.body)).not.toContain('example.com');
	});

	it('preserves retryAfter from HTTP response in real transport', async () => {
		const actualHttp = jest.requireActual<{
			request: typeof request;
		}>('corsair/http');
		const originalFetch = global.fetch;

		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({ 'retry-after': '3' }),
			json: async () => ({ message: 'Rate limit exceeded' }),
			text: async () => JSON.stringify({ message: 'Rate limit exceeded' }),
		});
		global.fetch = mockFetch;

		try {
			// `unknown` because caught error has untyped rejection
			let caughtError: unknown;
			try {
				await actualHttp.request(
					{
						BASE: 'https://api.lexware.io/v1',
						VERSION: '1.0.0',
						HEADERS: {},
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
					},
					{ method: 'GET', url: '/profile' },
					{ rateLimitConfig: LEXOFFICE_NO_TRANSPORT_RETRIES },
				);
			} catch (err: unknown) {
				// `unknown` because catch variable has no static type
				caughtError = err;
			}

			expect(caughtError).toBeInstanceOf(ApiError);
			expect(mockFetch).toHaveBeenCalledTimes(1);
			if (caughtError instanceof ApiError) {
				expect(caughtError.status).toBe(429);
				expect(caughtError.retryAfter).toBe(3000);
			}
		} finally {
			global.fetch = originalFetch;
		}
	});
});
