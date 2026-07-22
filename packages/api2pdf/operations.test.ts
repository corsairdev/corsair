import { logEventFromContext } from 'corsair/core';
import { makeApi2PdfRequest, makeApi2PdfTextRequest } from './client';
import {
	ChromeEndpoints,
	LibreOfficeEndpoints,
	PdfSharpEndpoints,
	UtilityEndpoints,
	ZebraEndpoints,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return {
		...actual,
		makeApi2PdfRequest: jest.fn(),
		makeApi2PdfTextRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeApi2PdfRequest);
const mockTextRequest = jest.mocked(makeApi2PdfTextRequest);
const mockLog = jest.mocked(logEventFromContext);

// Endpoint closures are heterogeneous; unknown avoids inventing a fake shared
// Ctx/Input union just for the table-driven cases below.
type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

const SAMPLE_PDF =
	'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const jobOk = {
	Success: true,
	FileUrl: 'https://example.com/out.pdf',
	ResponseId: 'resp-1',
	Cost: 0.01,
	MbOut: 0.1,
	Error: null,
};

function createContext() {
	return {
		key: 'test-api-key',
		options: { authType: 'api_key' as const },
		db: {
			pdfJobs: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

describe('API2PDF endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		// Table rows mix endpoint inputs; Record avoids a mega discriminated union.
		input?: Record<string, unknown>;
		path: string;
		method: string;
		text?: boolean;
		// Mocked HTTP payloads differ per endpoint (text status vs job JSON).
		response?: unknown;
	}> = [
		{
			name: 'utility.checkStatus',
			fn: UtilityEndpoints.checkStatus as AnyEndpoint,
			input: {},
			path: '/status',
			method: 'GET',
			text: true,
			response: 'OK\n',
		},
		{
			name: 'utility.deletePdf',
			fn: UtilityEndpoints.deletePdf as AnyEndpoint,
			input: { responseId: 'resp-1' },
			path: '/file/resp-1',
			method: 'DELETE',
			response: { Success: true },
		},
		{
			name: 'pdfsharp.mergePdfs',
			fn: PdfSharpEndpoints.mergePdfs as AnyEndpoint,
			input: { urls: [SAMPLE_PDF, SAMPLE_PDF] },
			path: '/pdfsharp/merge',
			method: 'POST',
			response: jobOk,
		},
		{
			name: 'pdfsharp.extractPages',
			fn: PdfSharpEndpoints.extractPages as AnyEndpoint,
			input: { url: SAMPLE_PDF, start: 0, end: 1 },
			path: '/pdfsharp/extract-pages',
			method: 'POST',
			response: jobOk,
		},
		{
			name: 'pdfsharp.reorderPages',
			fn: PdfSharpEndpoints.reorderPages as AnyEndpoint,
			input: { url: SAMPLE_PDF, pages: [0] },
			path: '/pdfsharp/reorder-pages',
			method: 'POST',
			response: jobOk,
		},
		{
			name: 'pdfsharp.optimizePdf',
			fn: PdfSharpEndpoints.optimizePdf as AnyEndpoint,
			input: { url: SAMPLE_PDF },
			path: '/pdfsharp/compress',
			method: 'POST',
			response: jobOk,
		},
		{
			name: 'chrome.addHeaderFooter',
			fn: ChromeEndpoints.addHeaderFooter as AnyEndpoint,
			input: { html: '<html><body>hi</body></html>' },
			path: '/chrome/pdf/html',
			method: 'POST',
			response: jobOk,
		},
		{
			name: 'libreoffice.thumbnail',
			fn: LibreOfficeEndpoints.thumbnail as AnyEndpoint,
			input: { url: SAMPLE_PDF },
			path: '/libreoffice/thumbnail',
			method: 'POST',
			response: jobOk,
		},
		{
			name: 'libreoffice.pdfToHtml',
			fn: LibreOfficeEndpoints.pdfToHtml as AnyEndpoint,
			input: { url: SAMPLE_PDF },
			path: '/libreoffice/pdf-to-html',
			method: 'POST',
			response: jobOk,
		},
		{
			name: 'zebra.generateBarcode',
			fn: ZebraEndpoints.generateBarcode as AnyEndpoint,
			input: { format: 'QR_CODE', value: 'https://corsair.dev' },
			path: '/zebra',
			method: 'GET',
			response: jobOk,
		},
	];

	it.each(cases)(
		'$name drives the endpoint closure against $path',
		async ({ fn, input, path, method, text, response }) => {
			if (text) {
				mockTextRequest.mockResolvedValueOnce(String(response));
			} else {
				mockRequest.mockResolvedValueOnce(response);
			}

			const ctx = createContext();
			const result = await fn(ctx, input ?? {});

			if (text) {
				expect(mockTextRequest).toHaveBeenCalledWith(
					path,
					expect.objectContaining({ apiKey: ctx.key }),
				);
				expect(result).toEqual({ status: 'OK' });
			} else {
				expect(mockRequest).toHaveBeenCalledWith(
					path,
					expect.objectContaining({
						apiKey: ctx.key,
						method,
					}),
				);
				expect(result).toEqual(response);
			}

			expect(mockLog).toHaveBeenCalled();
		},
	);

	it('utility.deletePdf throws when Success is false', async () => {
		mockRequest.mockResolvedValueOnce({
			Success: false,
			Error: 'file not found',
		});

		const ctx = createContext();
		await expect(
			(UtilityEndpoints.deletePdf as AnyEndpoint)(ctx, {
				responseId: 'missing-id',
			}),
		).rejects.toThrow('file not found');
		expect(mockLog).not.toHaveBeenCalled();
	});
});
