import 'dotenv/config';
import {
	assertApi2PdfSuccess,
	buildPostPayload,
	makeApi2PdfRequest,
	makeApi2PdfTextRequest,
} from './client';
import type { Api2PdfJobResponse } from './endpoints/types';
import { Api2PdfEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.API2PDF_API_KEY;

/** Public sample PDF for merge/extract/compress tests. */
const SAMPLE_PDF =
	'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

describe('API2PDF API Type Tests', () => {
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
			if (!TEST_API_KEY) {
				console.warn('Skipping: API2PDF_API_KEY not set');
				return;
			}

			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/zebra', {
					apiKey: TEST_API_KEY,
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
			if (!TEST_API_KEY) return;

			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/chrome/pdf/html', {
					apiKey: TEST_API_KEY,
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
		it('optimizePdf compresses a PDF', async () => {
			if (!TEST_API_KEY) return;

			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/pdfsharp/compress', {
					apiKey: TEST_API_KEY,
					method: 'POST',
					body: buildPostPayload({ url: SAMPLE_PDF }),
				}),
			);

			Api2PdfEndpointOutputSchemas.optimizePdf.parse(response);
			expect(response.Success).toBe(true);
		});

		it('mergePdfs merges two PDFs', async () => {
			if (!TEST_API_KEY) return;

			const response = assertApi2PdfSuccess(
				await makeApi2PdfRequest<Api2PdfJobResponse>('/pdfsharp/merge', {
					apiKey: TEST_API_KEY,
					method: 'POST',
					body: buildPostPayload({ urls: [SAMPLE_PDF, SAMPLE_PDF] }),
				}),
			);

			Api2PdfEndpointOutputSchemas.mergePdfs.parse(response);
			expect(response.Success).toBe(true);
		});
	});
});
