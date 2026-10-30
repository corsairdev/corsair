import { PdfcoEndpointsImpl } from './endpoints';
import { pdfcoEndpointMeta, pdfcoEndpointSchemas } from './index';

const PDF_URL = 'https://example.com/file.pdf';
const CTX = { key: 'test-key' };

let captured: { url: string; method: string; bodyText: string } | undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

// JUSTIFY unknown: mock HTTP payload boundary in tests; values are only
// serialized to a Response and re-validated through the real zod schemas.
function mockFetch(payload: unknown, status = 200): void {
	captured = undefined;
	global.fetch = async (input, init) => {
		captured = {
			url: String(input),
			method: init?.method ?? 'GET',
			bodyText: typeof init?.body === 'string' ? init.body : '',
		};
		return new Response(JSON.stringify(payload), {
			status,
			headers: { 'Content-Type': 'application/json' },
		});
	};
}

function pathOf(): string {
	return new URL(captured?.url ?? 'http://invalid').pathname;
}

function bodyOf(): unknown {
	if (!captured?.bodyText) return undefined;
	// JUSTIFY unknown: JSON.parse boundary in tests; only passed to
	// toMatchObject for structural assertions, never used as typed data.
	const parsed: unknown = JSON.parse(captured.bodyText);
	return parsed;
}

const okFile = {
	error: false,
	status: 200,
	url: 'https://example.com/out.pdf',
	pageCount: 1,
	name: 'out.pdf',
	remainingCredits: 100,
};

describe('Pdfco endpoints hit documented paths', () => {
	it('fileUpload calls POST /v1/file/upload/url', async () => {
		mockFetch(okFile);
		const out = await PdfcoEndpointsImpl.fileUpload(CTX, { url: PDF_URL });
		expect(pathOf()).toBe('/v1/file/upload/url');
		expect(captured?.method).toBe('POST');
		expect(bodyOf()).toMatchObject({ url: PDF_URL });
		expect(out.url).toBe(okFile.url);
	});

	it('fileUploadBase64 calls POST /v1/file/upload/base64', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.fileUploadBase64(CTX, {
			file: 'aGVsbG8=',
			name: 'hello.txt',
		});
		expect(pathOf()).toBe('/v1/file/upload/base64');
		expect(bodyOf()).toMatchObject({ file: 'aGVsbG8=' });
	});

	it('pdfToJson calls POST /v1/pdf/convert/to/json', async () => {
		mockFetch({ ...okFile, body: '{"pages":[]}' });
		const out = await PdfcoEndpointsImpl.pdfToJson(CTX, { url: PDF_URL });
		expect(pathOf()).toBe('/v1/pdf/convert/to/json');
		expect(bodyOf()).toMatchObject({ url: PDF_URL });
		expect(out.body).toBe('{"pages":[]}');
	});

	it('pdfToCsv calls POST /v1/pdf/convert/to/csv', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfToCsv(CTX, { url: PDF_URL, pages: '0-' });
		expect(pathOf()).toBe('/v1/pdf/convert/to/csv');
		expect(bodyOf()).toMatchObject({ url: PDF_URL, pages: '0-' });
	});

	it('pdfToHtml calls POST /v1/pdf/convert/to/html', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfToHtml(CTX, { url: PDF_URL });
		expect(pathOf()).toBe('/v1/pdf/convert/to/html');
	});

	it('pdfToImage selects the endpoint from format', async () => {
		mockFetch({ ...okFile, urls: ['https://example.com/1.png'] });
		await PdfcoEndpointsImpl.pdfToImage(CTX, { url: PDF_URL });
		expect(pathOf()).toBe('/v1/pdf/convert/to/png');

		mockFetch({ ...okFile, urls: ['https://example.com/1.jpg'] });
		await PdfcoEndpointsImpl.pdfToImage(CTX, {
			url: PDF_URL,
			format: 'jpg',
		});
		expect(pathOf()).toBe('/v1/pdf/convert/to/jpg');
	});

	it('pdfToText calls POST /v1/pdf/convert/to/text', async () => {
		mockFetch({ ...okFile, body: 'hello' });
		const out = await PdfcoEndpointsImpl.pdfToText(CTX, {
			url: PDF_URL,
			inline: true,
		});
		expect(pathOf()).toBe('/v1/pdf/convert/to/text');
		expect(out.body).toBe('hello');
	});

	it('pdfToXls and pdfToXlsx call their documented paths', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfToXls(CTX, { url: PDF_URL });
		expect(pathOf()).toBe('/v1/pdf/convert/to/xls');

		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfToXlsx(CTX, { url: PDF_URL });
		expect(pathOf()).toBe('/v1/pdf/convert/to/xlsx');
	});

	it('pdfToXml calls POST /v1/pdf/convert/to/xml', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfToXml(CTX, { url: PDF_URL });
		expect(pathOf()).toBe('/v1/pdf/convert/to/xml');
	});

	it('excel conversions call /v1/xls/convert/to/*', async () => {
		const xlsUrl = 'https://example.com/workbook.xlsx';
		const cases = [
			['csv', PdfcoEndpointsImpl.excelToCsv, '/v1/xls/convert/to/csv'],
			['html', PdfcoEndpointsImpl.excelToHtml, '/v1/xls/convert/to/html'],
			['json', PdfcoEndpointsImpl.excelToJson, '/v1/xls/convert/to/json'],
			['txt', PdfcoEndpointsImpl.excelToText, '/v1/xls/convert/to/txt'],
			['xml', PdfcoEndpointsImpl.excelToXml, '/v1/xls/convert/to/xml'],
		] as const;
		for (const [, fn, expectedPath] of cases) {
			mockFetch(okFile);
			await fn(CTX, { url: xlsUrl });
			expect(pathOf()).toBe(expectedPath);
			expect(bodyOf()).toMatchObject({ url: xlsUrl });
		}
	});

	it('pdfFromHtml calls POST /v1/pdf/convert/from/html', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfFromHtml(CTX, {
			html: '<h1>Hello</h1>',
			paperSize: 'A4',
		});
		expect(pathOf()).toBe('/v1/pdf/convert/from/html');
		expect(bodyOf()).toMatchObject({ html: '<h1>Hello</h1>' });
	});

	it('pdfFromEmail calls POST /v1/pdf/convert/from/email', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfFromEmail(CTX, {
			url: 'https://example.com/message.eml',
		});
		expect(pathOf()).toBe('/v1/pdf/convert/from/email');
	});

	it('pdfFromText calls POST /v1/pdf/convert/from/doc', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfFromText(CTX, {
			url: 'https://example.com/notes.txt',
		});
		expect(pathOf()).toBe('/v1/pdf/convert/from/doc');
	});

	it('pdfAdd calls POST /v1/pdf/edit/add', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfAdd(CTX, {
			url: PDF_URL,
			annotations: [{ text: 'Hello', x: 10, y: 20, pages: '0-' }],
		});
		expect(pathOf()).toBe('/v1/pdf/edit/add');
		expect(bodyOf()).toMatchObject({
			annotations: [{ text: 'Hello', x: 10, y: 20 }],
		});
	});

	it('pdfMerge calls POST /v1/pdf/merge', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfMerge(CTX, {
			url: 'https://example.com/1.pdf,https://example.com/2.pdf',
		});
		expect(pathOf()).toBe('/v1/pdf/merge');
	});

	it('pdfSplit calls POST /v1/pdf/split', async () => {
		mockFetch({
			...okFile,
			urls: ['https://example.com/1.pdf'],
		});
		const out = await PdfcoEndpointsImpl.pdfSplit(CTX, {
			url: PDF_URL,
			pages: '1-2',
		});
		expect(pathOf()).toBe('/v1/pdf/split');
		expect(bodyOf()).toMatchObject({ pages: '1-2' });
		expect(out.urls).toHaveLength(1);
	});

	it('pdfDeletePages calls POST /v1/pdf/edit/delete-pages', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfDeletePages(CTX, {
			url: PDF_URL,
			pages: '1-2',
		});
		expect(pathOf()).toBe('/v1/pdf/edit/delete-pages');
		expect(bodyOf()).toMatchObject({ pages: '1-2' });
	});

	it('pdfRotate calls POST /v1/pdf/edit/rotate', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfRotate(CTX, {
			url: PDF_URL,
			angle: 90,
		});
		expect(pathOf()).toBe('/v1/pdf/edit/rotate');
		expect(bodyOf()).toMatchObject({ angle: 90 });
	});

	it('pdfFind calls POST /v1/pdf/find', async () => {
		mockFetch({
			error: false,
			status: 200,
			body: [{ text: 'invoice', pageIndex: 0 }],
			pageCount: 1,
		});
		const out = await PdfcoEndpointsImpl.pdfFind(CTX, {
			url: PDF_URL,
			searchString: 'invoice',
		});
		expect(pathOf()).toBe('/v1/pdf/find');
		expect(bodyOf()).toMatchObject({ searchString: 'invoice' });
		expect(out.body?.[0]?.text).toBe('invoice');
	});

	it('pdfSearchAndReplaceText calls POST /v1/pdf/edit/replace-text', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfSearchAndReplaceText(CTX, {
			url: PDF_URL,
			searchString: 'old',
			replaceString: 'new',
		});
		expect(pathOf()).toBe('/v1/pdf/edit/replace-text');
		expect(bodyOf()).toMatchObject({
			searchString: 'old',
			replaceString: 'new',
		});
	});

	it('pdfSearchAndDeleteText calls POST /v1/pdf/edit/delete-text', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfSearchAndDeleteText(CTX, {
			url: PDF_URL,
			searchString: 'secret',
		});
		expect(pathOf()).toBe('/v1/pdf/edit/delete-text');
	});

	it('pdfInfoReader calls POST /v1/pdf/info', async () => {
		mockFetch({
			error: false,
			status: 200,
			info: { PageCount: 3, Author: 'Ada' },
		});
		const out = await PdfcoEndpointsImpl.pdfInfoReader(CTX, {
			url: PDF_URL,
		});
		expect(pathOf()).toBe('/v1/pdf/info');
		expect(out.info?.PageCount).toBe(3);
	});

	it('pdfFormsInfoReader calls POST /v1/pdf/info/fields', async () => {
		mockFetch({
			error: false,
			status: 200,
			info: { PageCount: 1 },
			fields: [{ FieldName: 'name', Type: 'EditBox' }],
		});
		const out = await PdfcoEndpointsImpl.pdfFormsInfoReader(CTX, {
			url: PDF_URL,
		});
		expect(pathOf()).toBe('/v1/pdf/info/fields');
		expect(out.fields?.[0]?.FieldName).toBe('name');
	});

	it('pdfExtractAttachments calls POST /v1/pdf/attachments/extract', async () => {
		mockFetch({
			...okFile,
			urls: ['https://example.com/attachment.zip'],
		});
		const out = await PdfcoEndpointsImpl.pdfExtractAttachments(CTX, {
			url: PDF_URL,
		});
		expect(pathOf()).toBe('/v1/pdf/attachments/extract');
		expect(out.urls).toHaveLength(1);
	});

	it('pdfChangeTextSearchable calls POST /v1/pdf/makesearchable', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.pdfChangeTextSearchable(CTX, {
			url: PDF_URL,
			lang: 'eng',
		});
		expect(pathOf()).toBe('/v1/pdf/makesearchable');
		expect(bodyOf()).toMatchObject({ lang: 'eng' });
	});

	it('documentParser calls POST /v1/pdf/documentparser', async () => {
		mockFetch({
			...okFile,
			body: { objects: [{ total: '10' }], templateName: 'invoice' },
		});
		const out = await PdfcoEndpointsImpl.documentParser(CTX, {
			url: PDF_URL,
			templateId: '123',
		});
		expect(pathOf()).toBe('/v1/pdf/documentparser');
		expect(bodyOf()).toMatchObject({ templateId: '123' });
		expect(out.body?.templateName).toBe('invoice');
	});

	it('jobCheck posts the documented jobid field', async () => {
		mockFetch({ status: 'working', remainingCredits: 100 });
		const out = await PdfcoEndpointsImpl.jobCheck(CTX, {
			jobId: 'job-1',
		});
		expect(pathOf()).toBe('/v1/job/check');
		expect(bodyOf()).toMatchObject({ jobid: 'job-1' });
		expect(out.status).toBe('working');
	});

	it('barcodeGenerate calls POST /v1/barcode/generate', async () => {
		mockFetch(okFile);
		await PdfcoEndpointsImpl.barcodeGenerate(CTX, {
			type: 'QRCode',
			value: 'abcdef123456',
		});
		expect(pathOf()).toBe('/v1/barcode/generate');
		expect(bodyOf()).toMatchObject({ type: 'QRCode' });
	});

	it('accountBalance calls GET /v1/account/credit/balance', async () => {
		mockFetch({ remainingCredits: 10, error: false });
		const out = await PdfcoEndpointsImpl.accountBalance(CTX, {});
		expect(pathOf()).toBe('/v1/account/credit/balance');
		expect(captured?.method).toBe('GET');
		expect(out.remainingCredits).toBe(10);
	});

	it('rejects invalid inputs before any HTTP call', async () => {
		mockFetch(okFile);
		await expect(
			PdfcoEndpointsImpl.pdfMerge(CTX, { url: 'not-a-url' }),
		).rejects.toThrow();
		await expect(
			PdfcoEndpointsImpl.pdfSplit(CTX, { url: PDF_URL, pages: '' }),
		).rejects.toThrow();
		await expect(
			PdfcoEndpointsImpl.jobCheck(CTX, { jobId: '' }),
		).rejects.toThrow();
		expect(captured).toBeUndefined();
	});

	it('registers every endpoint in schemas and meta', () => {
		expect(Object.keys(PdfcoEndpointsImpl).sort()).toEqual(
			Object.keys(pdfcoEndpointSchemas).sort(),
		);
		expect(Object.keys(PdfcoEndpointsImpl).sort()).toEqual(
			Object.keys(pdfcoEndpointMeta).sort(),
		);
		expect(Object.keys(PdfcoEndpointsImpl)).toHaveLength(34);
	});
});
