import {
	PdfcoEndpointInputSchemas,
	PdfcoEndpointOutputSchemas,
} from './endpoints/types';
import { PdfcoSchema } from './schema';

const PDF_URL = 'https://example.com/file.pdf';

describe('Pdfco schema', () => {
	it('declares a semver version', () => {
		expect(PdfcoSchema.version).toBeDefined();
		expect(PdfcoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PdfcoSchema.entities).toBe('object');
		expect(PdfcoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PdfcoSchema.entities))).toBe(true);
	});
});

describe('Pdfco input schemas accept documented inputs', () => {
	it('validates fileUpload inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.fileUpload.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.fileUpload.parse({ url: PDF_URL }),
		).toBeDefined();
	});

	it('validates fileUploadBase64 inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.fileUploadBase64.parse({ file: '' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.fileUploadBase64.parse({
				file: 'aGVsbG8=',
				name: 'hello.txt',
			}),
		).toBeDefined();
	});

	it('validates pdfToJson inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToJson.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfToJson.parse({ url: PDF_URL }),
		).toBeDefined();
	});

	it('validates pdfToCsv inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToCsv.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfToCsv.parse({
				url: PDF_URL,
				pages: '0-',
				inline: true,
			}),
		).toBeDefined();
	});

	it('validates pdfToHtml inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToHtml.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfToHtml.parse({ url: PDF_URL }),
		).toBeDefined();
	});

	it('validates pdfToImage inputs (format optional; png used when omitted)', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToImage.parse({ url: 'invalid' }),
		).toThrow();
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToImage.parse({
				url: PDF_URL,
				format: 'gif',
			}),
		).toThrow();
		const parsed = PdfcoEndpointInputSchemas.pdfToImage.parse({
			url: PDF_URL,
		});
		expect(parsed.format).toBeUndefined();
		expect(
			PdfcoEndpointInputSchemas.pdfToImage.parse({
				url: PDF_URL,
				format: 'jpg',
			}).format,
		).toBe('jpg');
	});

	it('validates pdfToText inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToText.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfToText.parse({ url: PDF_URL }),
		).toBeDefined();
	});

	it('validates pdfToXls and pdfToXlsx inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToXls.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfToXls.parse({ url: PDF_URL }),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.pdfToXlsx.parse({ url: PDF_URL }),
		).toBeDefined();
	});

	it('validates pdfToXml inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfToXml.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfToXml.parse({ url: PDF_URL }),
		).toBeDefined();
	});

	it('validates excel conversion inputs', () => {
		const xlsUrl = 'https://example.com/workbook.xlsx';
		expect(() =>
			PdfcoEndpointInputSchemas.excelToCsv.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.excelToCsv.parse({ url: xlsUrl }),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.excelToHtml.parse({ url: xlsUrl }),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.excelToJson.parse({ url: xlsUrl }),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.excelToText.parse({ url: xlsUrl }),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.excelToXml.parse({ url: xlsUrl }),
		).toBeDefined();
	});

	it('validates pdfFromHtml inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfFromHtml.parse({ html: '' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfFromHtml.parse({
				html: '<h1>Hello</h1>',
				paperSize: 'A4',
				orientation: 'Portrait',
			}),
		).toBeDefined();
	});

	it('validates pdfFromEmail inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfFromEmail.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfFromEmail.parse({
				url: 'https://example.com/message.eml',
			}),
		).toBeDefined();
	});

	it('validates pdfFromText inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfFromText.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfFromText.parse({
				url: 'https://example.com/notes.txt',
			}),
		).toBeDefined();
	});

	it('validates pdfAdd inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfAdd.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfAdd.parse({
				url: PDF_URL,
				annotations: [{ text: 'Hello', x: 10, y: 20, pages: '0-' }],
				images: [{ url: 'https://example.com/logo.png', x: 1, y: 2 }],
				fields: [{ fieldName: 'name', text: 'Ada' }],
			}),
		).toBeDefined();
	});

	it('validates pdfMerge inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfMerge.parse({ url: 123 }),
		).toThrow();
		expect(() =>
			PdfcoEndpointInputSchemas.pdfMerge.parse({ url: 'not-a-url' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfMerge.parse({
				url: 'https://example.com/1.pdf,https://example.com/2.pdf',
			}),
		).toBeDefined();
	});

	it('validates pdfSplit inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfSplit.parse({ url: 'invalid' }),
		).toThrow();
		expect(() =>
			PdfcoEndpointInputSchemas.pdfSplit.parse({
				url: PDF_URL,
				pages: '',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfSplit.parse({
				url: PDF_URL,
				pages: '1,2',
			}),
		).toBeDefined();
	});

	it('validates pdfDeletePages inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfDeletePages.parse({
				url: PDF_URL,
				pages: '',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfDeletePages.parse({
				url: PDF_URL,
				pages: '1-2',
			}),
		).toBeDefined();
	});

	it('validates pdfRotate inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfRotate.parse({
				url: PDF_URL,
				angle: 45,
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfRotate.parse({
				url: PDF_URL,
				pages: '0-2,4',
				angle: 90,
			}),
		).toBeDefined();
	});

	it('validates pdfFind inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfFind.parse({
				url: PDF_URL,
				searchString: '',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfFind.parse({
				url: PDF_URL,
				searchString: 'invoice',
			}),
		).toBeDefined();
	});

	it('validates pdfSearchAndReplaceText inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfSearchAndReplaceText.parse({
				url: PDF_URL,
				searchString: 'old',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfSearchAndReplaceText.parse({
				url: PDF_URL,
				searchString: 'old',
				replaceString: 'new',
			}),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.pdfSearchAndReplaceText.parse({
				url: PDF_URL,
				searchStrings: ['a', 'b'],
				replaceStrings: ['c', 'd'],
			}),
		).toBeDefined();
		expect(() =>
			PdfcoEndpointInputSchemas.pdfSearchAndReplaceText.parse({
				url: PDF_URL,
				searchStrings: ['a', 'b'],
				replaceStrings: ['c'],
			}),
		).toThrow();
		expect(() =>
			PdfcoEndpointInputSchemas.pdfSearchAndReplaceText.parse({
				url: PDF_URL,
				searchStrings: [],
				replaceStrings: [],
			}),
		).toThrow();
	});

	it('accepts profiles as an object with nested values or a JSON string', () => {
		expect(
			PdfcoEndpointInputSchemas.pdfToJson.parse({
				url: PDF_URL,
				profiles: { Angle: 3, ExtractionArea: ['0', '0', '100', '100'] },
			}),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.pdfToJson.parse({
				url: PDF_URL,
				profiles: "{'Angle': 3}",
			}),
		).toBeDefined();
	});

	it('validates pdfSearchAndDeleteText inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfSearchAndDeleteText.parse({
				url: PDF_URL,
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfSearchAndDeleteText.parse({
				url: PDF_URL,
				searchString: 'secret',
			}),
		).toBeDefined();
	});

	it('validates pdfInfoReader and pdfFormsInfoReader inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfInfoReader.parse({ url: 'invalid' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfInfoReader.parse({ url: PDF_URL }),
		).toBeDefined();
		expect(
			PdfcoEndpointInputSchemas.pdfFormsInfoReader.parse({ url: PDF_URL }),
		).toBeDefined();
	});

	it('validates pdfExtractAttachments inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfExtractAttachments.parse({
				url: 'invalid',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfExtractAttachments.parse({
				url: PDF_URL,
			}),
		).toBeDefined();
	});

	it('validates pdfChangeTextSearchable inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.pdfChangeTextSearchable.parse({
				url: 'invalid',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.pdfChangeTextSearchable.parse({
				url: PDF_URL,
				lang: 'eng',
			}),
		).toBeDefined();
	});

	it('validates documentParser inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.documentParser.parse({
				url: 'invalid',
				templateId: '123',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.documentParser.parse({
				url: PDF_URL,
				templateId: '123',
			}),
		).toBeDefined();
	});

	it('validates jobCheck inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.jobCheck.parse({ jobId: '' }),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.jobCheck.parse({ jobId: 'abc-123' }),
		).toBeDefined();
	});

	it('validates barcodeGenerate inputs', () => {
		expect(() =>
			PdfcoEndpointInputSchemas.barcodeGenerate.parse({
				type: 'QRCode',
				value: '',
			}),
		).toThrow();
		expect(
			PdfcoEndpointInputSchemas.barcodeGenerate.parse({
				type: 'QRCode',
				value: 'abcdef123456',
			}),
		).toBeDefined();
	});

	it('validates accountBalance inputs', () => {
		expect(PdfcoEndpointInputSchemas.accountBalance.parse({})).toBeDefined();
	});
});

describe('Pdfco output schemas parse documented responses', () => {
	it('parses a standard file response', () => {
		const parsed = PdfcoEndpointOutputSchemas.pdfMerge.parse({
			url: 'https://example.com/out.pdf',
			pageCount: 2,
			error: false,
			status: 200,
			name: 'out.pdf',
			remainingCredits: 100,
		});
		expect(parsed.url).toBe('https://example.com/out.pdf');
		expect(parsed.error).toBe(false);
	});

	it('defaults error to false when omitted', () => {
		const parsed = PdfcoEndpointOutputSchemas.pdfToJson.parse({
			url: 'https://example.com/out.json',
		});
		expect(parsed.error).toBe(false);
	});

	it('parses a multi-url response', () => {
		const parsed = PdfcoEndpointOutputSchemas.pdfSplit.parse({
			urls: ['https://example.com/1.pdf', 'https://example.com/2.pdf'],
			error: false,
			status: 200,
		});
		expect(parsed.urls).toHaveLength(2);
	});

	it('parses a job check response', () => {
		const parsed = PdfcoEndpointOutputSchemas.jobCheck.parse({
			status: 'working',
			remainingCredits: 100,
		});
		expect(parsed.status).toBe('working');
	});

	it('parses an account balance response', () => {
		const parsed = PdfcoEndpointOutputSchemas.accountBalance.parse({
			remainingCredits: 42,
			error: false,
		});
		expect(parsed.remainingCredits).toBe(42);
	});

	it('parses a find response with matches', () => {
		const parsed = PdfcoEndpointOutputSchemas.pdfFind.parse({
			body: [{ text: 'invoice', pageIndex: 0, left: 1, top: 2 }],
			error: false,
			status: 200,
		});
		expect(parsed.body).toHaveLength(1);
		expect(parsed.body?.[0]?.text).toBe('invoice');
	});

	it('parses an info response', () => {
		const parsed = PdfcoEndpointOutputSchemas.pdfInfoReader.parse({
			info: { PageCount: 3, Author: 'Ada' },
			error: false,
			status: 200,
		});
		expect(parsed.info?.PageCount).toBe(3);
	});

	it('parses a document parser response with elapsed and array values', () => {
		const parsed = PdfcoEndpointOutputSchemas.documentParser.parse({
			body: {
				objects: [{ total: '10', rectangle: [1, 2, 3, 4] }],
				elapsed: 1.5,
				templateName: 'invoice',
			},
			error: false,
			status: 200,
		});
		expect(parsed.body?.elapsed).toBe(1.5);
		expect(parsed.body?.objects?.[0]?.rectangle).toEqual([1, 2, 3, 4]);
	});
});
