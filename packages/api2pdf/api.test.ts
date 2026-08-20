import 'dotenv/config';
import {
	assertApi2PdfSuccess,
	buildPostPayload,
	makeApi2PdfRequest,
	makeApi2PdfTextRequest,
} from './client';
import { UtilityEndpoints } from './endpoints';
import type { Api2PdfJobResponse } from './endpoints/types';
import { Api2PdfEndpointOutputSchemas } from './endpoints/types';
import type { Api2PdfContext } from './index';

/** Minimal plugin context for live endpoint-handler tests. */
function testCtx(key: string): Api2PdfContext {
	return {
		key,
		// logEventFromContext only needs enough of ctx to no-op safely in tests
	} as Api2PdfContext;
}

const TEST_API_KEY = process.env.API2PDF_API_KEY;
const LIVE_TEST_FLAG =
	process.env.LIVE_TEST === '1' || process.env.LIVE_TEST === 'true';

/** Public sample PDF for merge/extract/compress tests. */
const SAMPLE_PDF =
	'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const testSuite = TEST_API_KEY && LIVE_TEST_FLAG ? describe : describe.skip;

testSuite('API2PDF API Type Tests', () => {
	describe('utility', () => {
		it('checkStatus returns plain text status', async () => {
			const status = await makeApi2PdfTextRequest('/status');
			const response = { status: status.trim() };

			Api2PdfEndpointOutputSchemas.checkStatus.parse(response);
			expect(response.status.length).toBeGreaterThan(0);
		});
	});

	describe('zebra', () => {
		it('generateBarcode returns correct type', async () => {
			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/zebra', {
					apiKey: TEST_API_KEY!,
					method: 'GET',
					query: {
						format: 'QR_CODE',
						value: 'https://corsair.dev',
						outputBinary: false,
					},
				}),
			);

			Api2PdfEndpointOutputSchemas.generateBarcode.parse(response);
			expect(response.Success).toBe(true);
		});
	});

	describe('chrome', () => {
		it('addHeaderFooter renders HTML to PDF', async () => {
			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/chrome/pdf/html', {
					apiKey: TEST_API_KEY!,
					method: 'POST',
					body: buildPostPayload(
						{ html: '<html><body><h1>Corsair API2PDF test</h1></body></html>' },
						{
							chromeOptions: {
								displayHeaderFooter: true,
								headerTemplate:
									'<div style="font-size:10px;width:100%;text-align:center;">Header</div>',
								footerTemplate:
									'<div style="font-size:10px;width:100%;text-align:center;">Page <span class="pageNumber"></span></div>',
							},
						},
					),
				}),
			);

			Api2PdfEndpointOutputSchemas.addHeaderFooter.parse(response);
			expect(response.Success).toBe(true);
			expect(response.FileUrl).toBeTruthy();
		});
	});

	describe('pdfsharp', () => {
		it('mergePdfs merges two PDFs', async () => {
			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/pdfsharp/merge', {
					apiKey: TEST_API_KEY!,
					method: 'POST',
					body: buildPostPayload({ urls: [SAMPLE_PDF, SAMPLE_PDF] }),
				}),
			);

			Api2PdfEndpointOutputSchemas.mergePdfs.parse(response);
			expect(response.Success).toBe(true);
		});

		it('extractPages extracts pages including negative indices', async () => {
			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>(
					'/pdfsharp/extract-pages',
					{
						apiKey: TEST_API_KEY!,
						method: 'POST',
						body: buildPostPayload({ url: SAMPLE_PDF, start: -1, end: -1 }),
					},
				),
			);

			Api2PdfEndpointOutputSchemas.extractPages.parse(response);
			expect(response.Success).toBe(true);
		});
	});

	describe('utility.delete', () => {
		it('deletePdf throws when Success is false for an unknown responseId', async () => {
			// Drive the real endpoint so assertApi2PdfSuccess throws on Success:false
			// instead of calling makeApi2PdfRequest directly (which bypasses it).
			await expect(
				UtilityEndpoints.deletePdf(testCtx(TEST_API_KEY!), {
					responseId: 'nonexistent-response-id',
				}),
			).rejects.toThrow();
		});
	});

	describe('libreoffice/opendataloader', () => {
		it('thumbnail renders a thumbnail from a PDF', async () => {
			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/libreoffice/thumbnail', {
					apiKey: TEST_API_KEY!,
					method: 'POST',
					body: buildPostPayload({ url: SAMPLE_PDF }),
				}),
			);

			Api2PdfEndpointOutputSchemas.libreOfficeThumbnail.parse(response);
			expect(response.Success).toBe(true);
		});

		it('pdfToHtml converts a PDF to HTML', async () => {
			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/opendataloader/html', {
					apiKey: TEST_API_KEY!,
					method: 'POST',
					body: buildPostPayload({ url: SAMPLE_PDF }),
				}),
			);

			Api2PdfEndpointOutputSchemas.opendataloaderPdfToHtml.parse(response);
			expect(response.Success).toBe(true);
		});
	});
});
