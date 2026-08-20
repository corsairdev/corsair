export {};

// @ts-expect-error
jest.unstable_mockModule('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

// @ts-expect-error
jest.unstable_mockModule('./client', () => {
	return {
		makeApi2PdfRequest: jest.fn(),
		makeApi2PdfTextRequest: jest.fn(),
		assertApi2PdfSuccess: (res: any) => {
			if (res.Success === false) throw new Error(res.Error);
			return res;
		},
		buildPostPayload: (base: any, opts: any) =>
			JSON.stringify({ ...base, ...opts }),
	};
});

const { logEventFromContext } = await import('corsair/core');
const { makeApi2PdfRequest, makeApi2PdfTextRequest } = await import('./client');
const {
	ChromeEndpoints,
	LibreOfficeEndpoints,
	PdfSharpEndpoints,
	UtilityEndpoints,
	ZebraEndpoints,
} = await import('./endpoints');

const mockRequest = jest.mocked(makeApi2PdfRequest);
const mockTextRequest = jest.mocked(makeApi2PdfTextRequest);
const mockLog = jest.mocked(logEventFromContext);

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
		input?: Record<string, unknown>;
		path: string;
		method: string;
		text?: boolean;
		response?: unknown;
		expectedPayload?: any;
		expectedQuery?: any;
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
			expectedPayload: JSON.stringify({ urls: [SAMPLE_PDF, SAMPLE_PDF] }),
		},
		{
			name: 'pdfsharp.extractPages',
			fn: PdfSharpEndpoints.extractPages as AnyEndpoint,
			input: { url: SAMPLE_PDF, start: 0, end: 1 },
			path: '/pdfsharp/extract-pages',
			method: 'POST',
			response: jobOk,
			expectedPayload: JSON.stringify({ url: SAMPLE_PDF, start: 0, end: 1 }),
		},
		{
			name: 'chrome.addHeaderFooter',
			fn: ChromeEndpoints.addHeaderFooter as AnyEndpoint,
			input: { html: '<html><body>hi</body></html>' },
			path: '/chrome/pdf/html',
			method: 'POST',
			response: jobOk,
			expectedPayload: JSON.stringify({ html: '<html><body>hi</body></html>' }),
		},
		{
			name: 'libreoffice.thumbnail',
			fn: LibreOfficeEndpoints.thumbnail as AnyEndpoint,
			input: { url: SAMPLE_PDF },
			path: '/libreoffice/thumbnail',
			method: 'POST',
			response: jobOk,
			expectedPayload: JSON.stringify({ url: SAMPLE_PDF }),
		},
		{
			name: 'opendataloader.pdfToHtml',
			fn: LibreOfficeEndpoints.opendataloaderPdfToHtml as AnyEndpoint,
			input: { url: SAMPLE_PDF },
			path: '/opendataloader/html',
			method: 'POST',
			response: jobOk,
			expectedPayload: JSON.stringify({ url: SAMPLE_PDF }),
		},
		{
			name: 'zebra.generateBarcode',
			fn: ZebraEndpoints.generateBarcode as AnyEndpoint,
			input: { format: 'QR_CODE', value: 'https://corsair.dev' },
			path: '/zebra',
			method: 'GET',
			response: jobOk,
			expectedQuery: { format: 'QR_CODE', value: 'https://corsair.dev' },
		},
	];

	it.each(cases)(
		'$name drives the endpoint closure against $path',
		async ({
			fn,
			input,
			path,
			method,
			text,
			response,
			expectedPayload,
			expectedQuery,
		}) => {
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
				const expectedOptions: Record<string, any> = {
					apiKey: ctx.key,
					method,
				};
				if (expectedPayload) expectedOptions.body = expectedPayload;
				if (expectedQuery)
					expectedOptions.query = expect.objectContaining(expectedQuery);

				expect(mockRequest).toHaveBeenCalledWith(
					path,
					expect.objectContaining(expectedOptions),
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
