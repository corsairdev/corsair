import 'dotenv/config';
import { Api2PdfEndpointOutputSchemas } from './endpoints/types';
import type { Api2PdfContext } from './index';

/**
 * Endpoints are imported lazily inside `beforeAll`. A static import would pull
 * in `corsair/core` at module load, which cannot be evaluated under ESM jest —
 * that would fail the file even when this suite is skipped.
 */
type Endpoints = typeof import('./endpoints');

let ChromeEndpoints: Endpoints['ChromeEndpoints'];
let LibreOfficeEndpoints: Endpoints['LibreOfficeEndpoints'];
let PdfSharpEndpoints: Endpoints['PdfSharpEndpoints'];
let UtilityEndpoints: Endpoints['UtilityEndpoints'];
let ZebraEndpoints: Endpoints['ZebraEndpoints'];

const TEST_API_KEY = process.env.API2PDF_API_KEY;
const LIVE_TEST_FLAG =
	process.env.LIVE_TEST === '1' || process.env.LIVE_TEST === 'true';

/** Public sample PDF used as input for the URL-based operations. */
const SAMPLE_PDF =
	'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

/**
 * Minimal plugin context. `pdfJobs` is left undefined so `cachePdfJob` short-
 * circuits — these tests exercise the HTTP surface, not persistence.
 */
function testCtx(): Api2PdfContext {
	return {
		key: TEST_API_KEY,
		options: { authType: 'api_key' },
		db: {},
	} as unknown as Api2PdfContext;
}

const testSuite = TEST_API_KEY && LIVE_TEST_FLAG ? describe : describe.skip;

testSuite('API2PDF live API', () => {
	beforeAll(async () => {
		({
			ChromeEndpoints,
			LibreOfficeEndpoints,
			PdfSharpEndpoints,
			UtilityEndpoints,
			ZebraEndpoints,
		} = await import('./endpoints'));
	});

	describe('utility', () => {
		it('checkStatus returns a plain-text status', async () => {
			const response = await UtilityEndpoints.checkStatus(testCtx(), {});

			Api2PdfEndpointOutputSchemas.checkStatus.parse(response);
			expect(response.status.length).toBeGreaterThan(0);
		});

		it('deletePdf removes a PDF that was just generated', async () => {
			const created = await PdfSharpEndpoints.mergePdfs(testCtx(), {
				urls: [SAMPLE_PDF, SAMPLE_PDF],
			});
			expect(created.ResponseId).toBeTruthy();

			const response = await UtilityEndpoints.deletePdf(testCtx(), {
				responseId: created.ResponseId as string,
			});

			Api2PdfEndpointOutputSchemas.deletePdf.parse(response);
		});

		it('deletePdf rejects an unknown responseId', async () => {
			await expect(
				UtilityEndpoints.deletePdf(testCtx(), {
					responseId: 'nonexistent-response-id',
				}),
			).rejects.toThrow();
		});
	});

	describe('pdfsharp', () => {
		it('mergePdfs merges two PDFs', async () => {
			const response = await PdfSharpEndpoints.mergePdfs(testCtx(), {
				urls: [SAMPLE_PDF, SAMPLE_PDF],
			});

			Api2PdfEndpointOutputSchemas.mergePdfs.parse(response);
			expect(response.Success).toBe(true);
			expect(response.FileUrl).toBeTruthy();
		});

		it('extractPages extracts the first page', async () => {
			const response = await PdfSharpEndpoints.extractPages(testCtx(), {
				url: SAMPLE_PDF,
				start: 0,
				end: 0,
			});

			Api2PdfEndpointOutputSchemas.extractPages.parse(response);
			expect(response.Success).toBe(true);
		});

		it('optimizePdf compresses a PDF', async () => {
			const response = await PdfSharpEndpoints.optimizePdf(testCtx(), {
				url: SAMPLE_PDF,
			});

			Api2PdfEndpointOutputSchemas.optimizePdf.parse(response);
			expect(response.Success).toBe(true);
		});

		it('watermarkPdf stamps text onto a PDF', async () => {
			const response = await PdfSharpEndpoints.watermarkPdf(testCtx(), {
				url: SAMPLE_PDF,
				text: 'CORSAIR TEST',
			});

			Api2PdfEndpointOutputSchemas.watermarkPdf.parse(response);
			expect(response.Success).toBe(true);
		});
	});

	describe('chrome', () => {
		it('addHeaderFooter renders HTML to PDF with a header and footer', async () => {
			const response = await ChromeEndpoints.addHeaderFooter(testCtx(), {
				html: '<html><body><h1>Corsair API2PDF test</h1></body></html>',
				headerTemplate:
					'<div style="font-size:10px;width:100%;text-align:center;">Header</div>',
				footerTemplate:
					'<div style="font-size:10px;width:100%;text-align:center;">Page <span class="pageNumber"></span></div>',
			});

			Api2PdfEndpointOutputSchemas.addHeaderFooter.parse(response);
			expect(response.Success).toBe(true);
			expect(response.FileUrl).toBeTruthy();
		});
	});

	describe('libreoffice', () => {
		it('thumbnail renders a preview image of a PDF', async () => {
			const response = await LibreOfficeEndpoints.thumbnail(testCtx(), {
				url: SAMPLE_PDF,
			});

			Api2PdfEndpointOutputSchemas.libreOfficeThumbnail.parse(response);
			expect(response.Success).toBe(true);
		});

		it('pdfToHtml converts a PDF to HTML', async () => {
			const response = await LibreOfficeEndpoints.pdfToHtml(testCtx(), {
				url: SAMPLE_PDF,
			});

			Api2PdfEndpointOutputSchemas.libreOfficePdfToHtml.parse(response);
			expect(response.Success).toBe(true);
		});
	});

	describe('zebra', () => {
		it('generateBarcode returns a QR code file URL', async () => {
			const response = await ZebraEndpoints.generateBarcode(testCtx(), {
				format: 'QR_CODE',
				value: 'https://corsair.dev',
			});

			Api2PdfEndpointOutputSchemas.generateBarcode.parse(response);
			expect(response.Success).toBe(true);
			expect(response.FileUrl).toBeTruthy();
		});
	});
});
