import { makeOcrWebServicePostRequest } from './client';
import { processDocument } from './endpoints/process-document';

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
