import { PdfcoSchema } from './schema';
import { PdfcoEndpointInputSchemas } from './endpoints/types';
import { fileUpload } from './endpoints/file-upload';
import { pdfToJson } from './endpoints/pdf-to-json';
import { pdfMerge } from './endpoints/pdf-merge';
import { pdfSplit } from './endpoints/pdf-split';
import { documentParser } from './endpoints/document-parser';

describe('Pdfco schema', () => {
	it('declares a semver version', () => {
		expect(PdfcoSchema.version).toBeDefined();
		expect(PdfcoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PdfcoSchema.entities).toBe('object');
		expect(PdfcoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PdfcoSchema.entities))).toBe(true);
		Object.values(PdfcoSchema.entities).forEach((entity: any) => {
			expect(entity).toBeDefined();
		});
	});
});

describe('Endpoints', () => {
	it('exports fileUpload', () => expect(fileUpload).toBeDefined());
	it('exports pdfToJson', () => expect(pdfToJson).toBeDefined());
	it('exports pdfMerge', () => expect(pdfMerge).toBeDefined());
	it('exports pdfSplit', () => expect(pdfSplit).toBeDefined());
	it('exports documentParser', () => expect(documentParser).toBeDefined());

	it('validates fileUpload inputs', () => {
		expect(() => PdfcoEndpointInputSchemas.fileUpload.parse({ url: 'invalid' })).toThrow();
		expect(PdfcoEndpointInputSchemas.fileUpload.parse({ url: 'https://example.com/file.pdf' })).toBeDefined();
	});

	it('validates pdfToJson inputs', () => {
		expect(() => PdfcoEndpointInputSchemas.pdfToJson.parse({ url: 'invalid' })).toThrow();
		expect(PdfcoEndpointInputSchemas.pdfToJson.parse({ url: 'https://example.com/file.pdf' })).toBeDefined();
	});

	it('validates pdfMerge inputs', () => {
		expect(() => PdfcoEndpointInputSchemas.pdfMerge.parse({ url: 123 })).toThrow();
		expect(() => PdfcoEndpointInputSchemas.pdfMerge.parse({ url: 'not-a-url' })).toThrow();
		expect(PdfcoEndpointInputSchemas.pdfMerge.parse({ url: 'https://example.com/1.pdf,https://example.com/2.pdf' })).toBeDefined();
	});

	it('validates pdfSplit inputs', () => {
		expect(() => PdfcoEndpointInputSchemas.pdfSplit.parse({ url: 'invalid', pages: '1-2' })).toThrow();
		expect(PdfcoEndpointInputSchemas.pdfSplit.parse({ url: 'https://example.com/file.pdf', pages: '1,2' })).toBeDefined();
	});

	it('validates documentParser inputs', () => {
		expect(() => PdfcoEndpointInputSchemas.documentParser.parse({ url: 'invalid', templateId: '123' })).toThrow();
		expect(PdfcoEndpointInputSchemas.documentParser.parse({ url: 'https://example.com/file.pdf', templateId: '123' })).toBeDefined();
	});
});
