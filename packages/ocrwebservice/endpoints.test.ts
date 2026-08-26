import { makeOcrWebServicePostRequest } from './client';
import { processDocument } from './endpoints/process-document';
import { ProcessDocumentInputSchema } from './endpoints/types';

jest.mock('./client', () => ({
	makeOcrWebServicePostRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const mockedRequest = makeOcrWebServicePostRequest as jest.MockedFunction<
	typeof makeOcrWebServicePostRequest
>;

describe('OCR Web Service processDocument endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends the uploaded document to the OCR Web Service endpoint', async () => {
		const file = new Blob(['test document'], { type: 'text/plain' });

		const providerResponse = {
			ErrorMessage: null,
			OCRText: [['Hello from OCR']],
			OutputFileUrl: null,
			AvailablePages: 1,
			ProcessedPages: 1,
		};

		mockedRequest.mockResolvedValue(providerResponse);

		const ctx = {
			key: 'test-user:test-license',
			options: {},
		} as any;

		const result = await processDocument(ctx, {
			file,
			language: 'english',
			gettext: true,
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);

		expect(mockedRequest).toHaveBeenCalledWith(
			'/restservices/processDocument',
			'test-user:test-license',
			expect.objectContaining({
				formData: expect.objectContaining({
					file,
				}),
			}),
		);

		expect(result).toEqual(providerResponse);
	});

	it('throws when the provider returns an OCR error', async () => {
		const file = new Blob(['bad document'], { type: 'text/plain' });

		mockedRequest.mockResolvedValue({
			ErrorMessage: 'Unable to process document',
			OCRText: null,
			OutputFileUrl: null,
			AvailablePages: 1,
			ProcessedPages: 0,
		});

		const ctx = {
			key: 'test-user:test-license',
			options: {},
		} as any;

		await expect(
			processDocument(ctx, {
				file,
				language: 'english',
				gettext: true,
			}),
		).rejects.toThrow('OCR Web Service failed: Unable to process document');
	});
});
describe('OCR Web Service outputformat validation', () => {
	const file = new Blob(['test document'], {
		type: 'application/pdf',
	});

	it('accepts all supported single output formats', () => {
		const formats = [
			'pdf',
			'doc',
			'xls',
			'rtf',
			'txt',
			'pdfimg',
			'docx',
			'xlsx',
		];

		for (const outputformat of formats) {
			expect(() =>
				ProcessDocumentInputSchema.parse({
					file,
					outputformat,
				}),
			).not.toThrow();
		}
	});

	it('accepts two comma-separated output formats', () => {
		expect(() =>
			ProcessDocumentInputSchema.parse({
				file,
				outputformat: 'pdf,txt',
			}),
		).not.toThrow();

		expect(() =>
			ProcessDocumentInputSchema.parse({
				file,
				outputformat: 'docx,xlsx',
			}),
		).not.toThrow();
	});

	it('rejects more than two output formats', () => {
		expect(() =>
			ProcessDocumentInputSchema.parse({
				file,
				outputformat: 'pdf,txt,docx',
			}),
		).toThrow();
	});

	it('rejects unsupported output formats', () => {
		expect(() =>
			ProcessDocumentInputSchema.parse({
				file,
				outputformat: 'invalid',
			}),
		).toThrow();
	});

	it('rejects empty output format values', () => {
		expect(() =>
			ProcessDocumentInputSchema.parse({
				file,
				outputformat: '',
			}),
		).toThrow();

		expect(() =>
			ProcessDocumentInputSchema.parse({
				file,
				outputformat: 'pdf,',
			}),
		).toThrow();

		expect(() =>
			ProcessDocumentInputSchema.parse({
				file,
				outputformat: ',pdf',
			}),
		).toThrow();
	});
});
