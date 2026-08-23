import { jest } from '@jest/globals';
import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	ChromeEndpoints,
	LibreOfficeEndpoints,
	PdfSharpEndpoints,
	UtilityEndpoints,
	ZebraEndpoints,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

/**
 * Only the transport is mocked, so every assertion below exercises the real
 * client: auth header construction, `buildPostPayload` (including its
 * `inline: true` default and `options` mapping) and `assertApi2PdfSuccess`.
 * The client narrows with `instanceof ApiError`, so the mock must export a
 * real constructor.
 */
jest.mock('corsair/http', () => {
	class MockApiError extends Error {
		status: number;
		statusText: string;
		body: unknown;
		retryAfter: number | undefined;

		constructor(
			status: number,
			message: string,
			statusText = '',
			body: unknown = undefined,
			retryAfter: number | undefined = undefined,
		) {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.statusText = statusText;
			this.body = body;
			this.retryAfter = retryAfter;
		}
	}

	return { ApiError: MockApiError, request: jest.fn() };
});

const requestMock = request as unknown as jest.Mock<
	(config: unknown, options: unknown) => Promise<unknown>
>;
const mockLog = logEventFromContext as unknown as jest.Mock<
	() => Promise<void>
>;

/** The mocked constructor, typed for the shape these tests build. */
const ApiErrorCtor = ApiError as unknown as new (
	status: number,
	message: string,
	statusText?: string,
	body?: unknown,
	retryAfter?: number,
) => Error;

/** Endpoint closures are strongly typed per-operation; this drives them uniformly. */
function call(fn: unknown, ctx: unknown, input?: unknown): Promise<unknown> {
	return (fn as (c: unknown, i: unknown) => Promise<unknown>)(ctx, input);
}

const SAMPLE_PDF =
	'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const jobOk = {
	Success: true,
	FileUrl: 'https://example.com/out.pdf',
	ResponseId: 'resp-1',
	Cost: 0.01,
	MbOut: 0.1,
	Seconds: 0.4,
	Error: null,
};

const upsert = jest.fn(async () => undefined);

function createContext(): unknown {
	return {
		key: 'test-api-key',
		options: { authType: 'api_key' as const },
		db: { pdfJobs: { upsertByEntityId: upsert } },
	};
}

function lastCall() {
	const call = requestMock.mock.calls.at(-1);
	if (!call) throw new Error('request was never called');
	return {
		config: call[0] as { BASE: string; HEADERS: Record<string, string> },
		options: call[1] as {
			method: string;
			url: string;
			body?: Record<string, unknown>;
			query?: Record<string, unknown>;
		},
	};
}

beforeEach(() => {
	jest.clearAllMocks();
});

describe('API2PDF endpoint routing', () => {
	const cases: Array<{
		name: string;
		fn: unknown;
		input: Record<string, unknown>;
		method: string;
		url: string;
		body?: Record<string, unknown>;
		query?: Record<string, unknown>;
	}> = [
		{
			name: 'utility.deletePdf',
			fn: UtilityEndpoints.deletePdf,
			input: { responseId: 'resp 1/x' },
			method: 'DELETE',
			url: '/file/resp%201%2Fx',
		},
		{
			name: 'pdfsharp.mergePdfs',
			fn: PdfSharpEndpoints.mergePdfs,
			input: { urls: [SAMPLE_PDF, SAMPLE_PDF] },
			method: 'POST',
			url: '/pdfsharp/merge',
			body: { inline: true, urls: [SAMPLE_PDF, SAMPLE_PDF] },
		},
		{
			name: 'pdfsharp.extractPages',
			fn: PdfSharpEndpoints.extractPages,
			input: { url: SAMPLE_PDF, start: 0, end: 1 },
			method: 'POST',
			url: '/pdfsharp/extract-pages',
			body: { inline: true, url: SAMPLE_PDF, start: 0, end: 1 },
		},
		{
			name: 'pdfsharp.optimizePdf',
			fn: PdfSharpEndpoints.optimizePdf,
			input: { url: SAMPLE_PDF, fileName: 'small.pdf' },
			method: 'POST',
			url: '/pdfsharp/compress',
			body: { inline: true, url: SAMPLE_PDF, fileName: 'small.pdf' },
		},
		{
			name: 'pdfsharp.watermarkPdf',
			fn: PdfSharpEndpoints.watermarkPdf,
			input: { url: SAMPLE_PDF, text: 'DRAFT', opacity: 0.5, rotation: 45 },
			method: 'POST',
			url: '/pdfsharp/watermark',
			body: {
				inline: true,
				url: SAMPLE_PDF,
				text: 'DRAFT',
				opacity: 0.5,
				rotation: 45,
			},
		},
		{
			name: 'chrome.addHeaderFooter',
			fn: ChromeEndpoints.addHeaderFooter,
			input: { html: '<p>hi</p>', headerTemplate: '<b>H</b>' },
			method: 'POST',
			url: '/chrome/pdf/html',
			body: {
				inline: true,
				html: '<p>hi</p>',
				options: { displayHeaderFooter: true, headerTemplate: '<b>H</b>' },
			},
		},
		{
			name: 'libreoffice.thumbnail',
			fn: LibreOfficeEndpoints.thumbnail,
			input: { url: SAMPLE_PDF },
			method: 'POST',
			url: '/libreoffice/thumbnail',
			body: { inline: true, url: SAMPLE_PDF },
		},
		{
			name: 'libreoffice.pdfToHtml',
			fn: LibreOfficeEndpoints.pdfToHtml,
			input: { url: SAMPLE_PDF },
			method: 'POST',
			url: '/libreoffice/pdf-to-html',
			body: { inline: true, url: SAMPLE_PDF },
		},
		{
			name: 'zebra.generateBarcode',
			fn: ZebraEndpoints.generateBarcode,
			input: {
				format: 'QR_CODE',
				value: 'https://corsair.dev',
				showLabel: true,
			},
			method: 'GET',
			url: '/zebra',
			query: {
				format: 'QR_CODE',
				value: 'https://corsair.dev',
				showlabel: true,
				outputBinary: false,
			},
		},
	];

	it.each(cases)(
		'$name calls $method $url with the documented payload',
		async ({ fn, input, method, url, body, query }) => {
			requestMock.mockResolvedValueOnce(jobOk);

			const result = await call(fn, createContext(), input);
			const sent = lastCall();

			expect(sent.config.BASE).toBe('https://v2.api2pdf.com');
			expect(sent.config.HEADERS.Authorization).toBe('test-api-key');
			expect(sent.options.method).toBe(method);
			expect(sent.options.url).toBe(url);

			if (body) {
				expect(sent.options.body).toEqual(body);
			}
			if (query) {
				expect(sent.options.query).toMatchObject(query);
			}

			expect(result).toEqual(jobOk);
			expect(mockLog).toHaveBeenCalledTimes(1);
		},
	);

	it('utility.checkStatus hits /status and trims the plain-text body', async () => {
		requestMock.mockResolvedValueOnce('OK\n');

		const result = await call(
			UtilityEndpoints.checkStatus,
			createContext(),
			{},
		);

		expect(lastCall().options.url).toBe('/status');
		expect(lastCall().options.method).toBe('GET');
		expect(result).toEqual({ status: 'OK' });
		expect(mockLog).toHaveBeenCalledTimes(1);
	});

	it('caches every job response, including Seconds, keyed by ResponseId', async () => {
		requestMock.mockResolvedValueOnce(jobOk);

		await call(PdfSharpEndpoints.mergePdfs, createContext(), {
			urls: [SAMPLE_PDF, SAMPLE_PDF],
		});

		expect(upsert).toHaveBeenCalledWith(
			'resp-1',
			expect.objectContaining({
				operation: 'mergePdfs',
				responseId: 'resp-1',
				fileUrl: 'https://example.com/out.pdf',
				success: true,
				cost: 0.01,
				mbOut: 0.1,
				seconds: 0.4,
			}),
		);
	});

	it('passes negative extract-pages offsets through unchanged', async () => {
		requestMock.mockResolvedValueOnce(jobOk);

		await call(PdfSharpEndpoints.extractPages, createContext(), {
			url: SAMPLE_PDF,
			start: -1,
			end: -1,
		});

		expect(lastCall().options.body).toEqual({
			inline: true,
			url: SAMPLE_PDF,
			start: -1,
			end: -1,
		});
	});

	it('omits extract-pages offsets that are not supplied', async () => {
		requestMock.mockResolvedValueOnce(jobOk);

		await call(PdfSharpEndpoints.extractPages, createContext(), {
			url: SAMPLE_PDF,
		});

		expect(lastCall().options.body).toEqual({ inline: true, url: SAMPLE_PDF });
	});

	it('omits optional watermark styling fields when they are not supplied', async () => {
		requestMock.mockResolvedValueOnce(jobOk);

		await call(PdfSharpEndpoints.watermarkPdf, createContext(), {
			url: SAMPLE_PDF,
			text: 'DRAFT',
		});

		expect(lastCall().options.body).toEqual({
			inline: true,
			url: SAMPLE_PDF,
			text: 'DRAFT',
		});
	});

	it('honours an explicit inline:false instead of forcing the default', async () => {
		requestMock.mockResolvedValueOnce(jobOk);

		await call(PdfSharpEndpoints.optimizePdf, createContext(), {
			url: SAMPLE_PDF,
			inline: false,
		});

		expect(lastCall().options.body).toMatchObject({ inline: false });
	});

	it('throws and skips logging when the API reports Success:false', async () => {
		requestMock.mockResolvedValueOnce({
			Success: false,
			Error: 'file not found',
		});

		await expect(
			call(UtilityEndpoints.deletePdf, createContext(), {
				responseId: 'missing-id',
			}),
		).rejects.toThrow('file not found');

		expect(mockLog).not.toHaveBeenCalled();
	});

	it('wraps transport ApiError as Api2PdfAPIError, preserving status', async () => {
		requestMock.mockRejectedValueOnce(
			new ApiErrorCtor(429, 'Too Many Requests', 'Too Many Requests', null, 30),
		);

		const error = (await call(PdfSharpEndpoints.mergePdfs, createContext(), {
			urls: [SAMPLE_PDF, SAMPLE_PDF],
		}).catch((e: unknown) => e)) as Error & { status?: number };

		expect(error.name).toBe('Api2PdfAPIError');
		expect(error.status).toBe(429);
		expect(mockLog).not.toHaveBeenCalled();
	});
});
