import {
	makeOcrWebServiceGetRequest,
	makeOcrWebServicePostRequest,
	makeOcrWebServiceRequest,
	parseCredentials,
} from './client';
import { getCredentials, getInformation, log } from './endpoints/account';
import { recognize } from './endpoints/process-document';
import { RecognizeInputSchema } from './endpoints/types';
import { ocrwebservice } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeOcrWebServicePostRequest: jest.fn(),
		makeOcrWebServiceGetRequest: jest.fn(),
		makeOcrWebServiceRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

const mockedPost = makeOcrWebServicePostRequest as jest.MockedFunction<
	typeof makeOcrWebServicePostRequest
>;
const mockedGet = makeOcrWebServiceGetRequest as jest.MockedFunction<
	typeof makeOcrWebServiceGetRequest
>;
const mockedRequest = makeOcrWebServiceRequest as jest.MockedFunction<
	typeof makeOcrWebServiceRequest
>;

const ctx = { key: 'test-user:test-license', options: {} } as any;

describe('OCR Web Service credentials', () => {
	it('parses username:licenseCode from the stored key', () => {
		expect(parseCredentials('acme:license-1')).toEqual({
			username: 'acme',
			licenseCode: 'license-1',
		});
	});

	it('rejects keys without a license code', () => {
		expect(() => parseCredentials('only-user')).toThrow('username:licenseCode');
	});
});

describe('OCR Web Service account endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns credentials from connection metadata', async () => {
		await expect(getCredentials(ctx, {})).resolves.toEqual({
			user_name: 'test-user',
		});
		expect(mockedGet).not.toHaveBeenCalled();
	});

	it('GETs getAccountInformation', async () => {
		mockedGet.mockResolvedValue({
			ErrorMessage: '',
			AvailablePages: 20,
			MaxPages: 25,
			SubcriptionPlan: 'TRIAL',
			ExpirationDate: '12/31/2026',
			LastProcessingTime: '8/27/2026',
		});

		const result = await getInformation(ctx, {});

		expect(mockedGet).toHaveBeenCalledWith(
			'/restservices/getAccountInformation',
			'test-user:test-license',
		);
		expect(result.AvailablePages).toBe(20);
		expect(result.SubcriptionPlan).toBe('TRIAL');
	});

	it('POSTs SOAP logs for a date range', async () => {
		mockedRequest.mockResolvedValue(
			'<?xml version="1.0"?><OCRWebServiceLogResult>line-one</OCRWebServiceLogResult>',
		);

		const result = await log(ctx, {
			from_date: '2026-08-01',
			to_date: '2026-08-27',
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'/services/OCRWebService.asmx/OCRWebServiceLog',
			'test-user:test-license',
			expect.objectContaining({
				method: 'POST',
				basicAuth: false,
				accept: 'text/xml',
				body: expect.stringContaining('from_date=2026-08-01'),
			}),
		);
		expect(result).toEqual({ data: 'line-one' });
	});

	it('rejects impossible log dates', async () => {
		await expect(
			log(ctx, {
				from_date: '2026-02-31',
				to_date: '2026-08-27',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('OCR Web Service recognize endpoint', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('POSTs the document body to processDocument', async () => {
		const file = new Blob(['test document'], { type: 'text/plain' });
		const providerResponse = {
			ErrorMessage: null,
			OCRText: [['Hello from OCR']],
			OutputFileUrl: null,
			AvailablePages: 1,
			ProcessedPages: 1,
		};

		mockedPost.mockResolvedValue(providerResponse);

		const result = await recognize(ctx, {
			file,
			language: 'english',
			gettext: true,
		});

		expect(mockedPost).toHaveBeenCalledWith(
			'/restservices/processDocument',
			'test-user:test-license',
			expect.objectContaining({
				body: file,
				query: expect.objectContaining({
					language: 'english',
					gettext: true,
				}),
			}),
		);
		expect(result).toEqual(providerResponse);
	});

	it('upgrades http output URLs on ocrwebservice.com to https', async () => {
		const file = new Blob(['test document'], { type: 'text/plain' });
		mockedPost.mockResolvedValue({
			ErrorMessage: null,
			OCRText: [['Hello from OCR']],
			OutputFileUrl:
				'http://www.ocrwebservice.com/uploads/_restservice/out.doc',
			AvailablePages: 1,
			ProcessedPages: 1,
		});

		const result = await recognize(ctx, {
			file,
			language: 'english',
			gettext: true,
		});

		expect(result.OutputFileUrl).toBe(
			'https://www.ocrwebservice.com/uploads/_restservice/out.doc',
		);
	});

	it('rejects insecure output URLs on unknown hosts', async () => {
		const file = new Blob(['test document'], { type: 'text/plain' });
		mockedPost.mockResolvedValue({
			ErrorMessage: null,
			OCRText: [['Hello from OCR']],
			OutputFileUrl: 'http://evil.example/steal.doc',
			AvailablePages: 1,
			ProcessedPages: 1,
		});

		await expect(
			recognize(ctx, {
				file,
				language: 'english',
				gettext: true,
			}),
		).rejects.toThrow('OCR output URL must be HTTPS');
	});

	it('throws when the provider returns an OCR error', async () => {
		const file = new Blob(['bad document'], { type: 'text/plain' });

		mockedPost.mockResolvedValue({
			ErrorMessage: 'Unable to process document',
			OCRText: null,
			OutputFileUrl: null,
			AvailablePages: 1,
			ProcessedPages: 0,
		});

		await expect(
			recognize(ctx, {
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
				RecognizeInputSchema.parse({
					file,
					outputformat,
				}),
			).not.toThrow();
		}
	});

	it('accepts two comma-separated output formats', () => {
		expect(() =>
			RecognizeInputSchema.parse({
				file,
				outputformat: 'pdf,txt',
			}),
		).not.toThrow();
	});

	it('rejects more than two output formats', () => {
		expect(() =>
			RecognizeInputSchema.parse({
				file,
				outputformat: 'pdf,txt,docx',
			}),
		).toThrow();
	});

	it('rejects unsupported output formats', () => {
		expect(() =>
			RecognizeInputSchema.parse({
				file,
				outputformat: 'invalid',
			}),
		).toThrow();
	});
});

describe('OCR Web Service plugin registration', () => {
	it('maps the four OCR Web Service ops', () => {
		const plugin = ocrwebservice();
		expect(Object.keys(plugin.endpointSchemas ?? {})).toEqual([
			'account.getCredentials',
			'account.getInformation',
			'account.log',
			'ocr.recognize',
		]);
	});
});
