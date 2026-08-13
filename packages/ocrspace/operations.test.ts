import { logEventFromContext } from 'corsair/core';
import {
	makeOcrSpaceGetRequest,
	makeOcrSpacePostRequest,
	OCRSPACE_MYAPI_BASE,
	OcrSpaceAPIError,
} from './client';
import { Account, Ocr } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return {
		...actual,
		makeOcrSpaceGetRequest: jest.fn(),
		makeOcrSpacePostRequest: jest.fn(),
	};
});

const mockGet = jest.mocked(makeOcrSpaceGetRequest);
const mockPost = jest.mocked(makeOcrSpacePostRequest);
const mockLog = jest.mocked(logEventFromContext);

const SUCCESS_RESPONSE = {
	ParsedResults: [{ ParsedText: 'Hello world', FileParseExitCode: 1 }],
	OCRExitCode: 1,
	IsErroredOnProcessing: false,
	ProcessingTimeInMilliseconds: '231',
};

const CONVERSIONS_RESPONSE = {
	count_total: 165,
	count_engine1: 120,
	count_engine2: 45,
	count_engine3: 0,
};

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function createContext(overrides: Record<string, unknown> = {}) {
	return {
		key: 'test-key',
		options: {},
		db: {
			ocrResults: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			conversions: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
		...overrides,
	};
}

describe('OCR.space endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('ocr.parseImageUrl calls GET /parse/imageurl and caches the result', async () => {
		mockGet.mockResolvedValue(SUCCESS_RESPONSE);
		const ctx = createContext();

		const result = await (Ocr.parseImageUrl as AnyEndpoint)(ctx, {
			url: 'https://example.com/receipt.jpg',
			OCREngine: 2,
			language: 'eng',
		});

		expect(mockGet).toHaveBeenCalledTimes(1);
		expect(mockGet).toHaveBeenCalledWith('/parse/imageurl', 'test-key', {
			query: {
				url: 'https://example.com/receipt.jpg',
				OCREngine: 2,
				language: 'eng',
			},
			baseUrl: undefined,
		});
		expect(result).toMatchObject({ OCRExitCode: 1 });
		expect(ctx.db.ocrResults.upsertByEntityId).toHaveBeenCalledWith(
			'https://example.com/receipt.jpg:2:eng',
			expect.objectContaining({
				text: 'Hello world',
				engine: 2,
				language: 'eng',
				exitCode: 1,
			}),
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'ocrspace.ocr.parseImageUrl',
			expect.any(Object),
			'completed',
		);
	});

	it('ocr.parse posts a URL to /parse/image and caches it', async () => {
		mockPost.mockResolvedValue(SUCCESS_RESPONSE);
		const ctx = createContext();

		await (Ocr.parse as AnyEndpoint)(ctx, {
			url: 'https://example.com/scan.png',
		});

		expect(mockPost).toHaveBeenCalledWith('/parse/image', 'test-key', {
			formData: { url: 'https://example.com/scan.png' },
			baseUrl: undefined,
		});
		expect(ctx.db.ocrResults.upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('ocr.parse does not cache a base64 payload', async () => {
		mockPost.mockResolvedValue(SUCCESS_RESPONSE);
		const ctx = createContext();

		await (Ocr.parse as AnyEndpoint)(ctx, {
			base64Image:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
		});
		expect(ctx.db.ocrResults.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('ocr.parse does not cache a file upload', async () => {
		mockPost.mockResolvedValue(SUCCESS_RESPONSE);
		const ctx = createContext();

		await (Ocr.parse as AnyEndpoint)(ctx, {
			file: new File(['x'], 'scan.png', { type: 'image/png' }),
		});
		expect(ctx.db.ocrResults.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('ocr.parseImageUrl rejects an empty OCR body', async () => {
		mockGet.mockResolvedValue({});
		const ctx = createContext();

		await expect(
			(Ocr.parseImageUrl as AnyEndpoint)(ctx, {
				url: 'https://example.com/receipt.jpg',
			}),
		).rejects.toBeInstanceOf(OcrSpaceAPIError);
		expect(ctx.db.ocrResults.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('ocr.parseImageUrl rejects a success exit code with no pages', async () => {
		mockGet.mockResolvedValue({ OCRExitCode: 1 });
		const ctx = createContext();

		await expect(
			(Ocr.parseImageUrl as AnyEndpoint)(ctx, {
				url: 'https://example.com/receipt.jpg',
			}),
		).rejects.toBeInstanceOf(OcrSpaceAPIError);
		expect(ctx.db.ocrResults.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('ocr.parseImageUrl rejects a failed-only page array', async () => {
		mockGet.mockResolvedValue({
			OCRExitCode: 1,
			ParsedResults: [{ FileParseExitCode: -10, ErrorMessage: 'Parse failed' }],
		});
		const ctx = createContext();

		await expect(
			(Ocr.parseImageUrl as AnyEndpoint)(ctx, {
				url: 'https://example.com/receipt.jpg',
			}),
		).rejects.toBeInstanceOf(OcrSpaceAPIError);
		expect(ctx.db.ocrResults.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('skips the cache for a partial OCRExitCode 2 result', async () => {
		mockGet.mockResolvedValue({
			OCRExitCode: 2,
			IsErroredOnProcessing: false,
			ParsedResults: [
				{ ParsedText: 'page one', FileParseExitCode: 1 },
				{ ParsedText: '', FileParseExitCode: -10 },
			],
		});
		const ctx = createContext();

		const result = await (Ocr.parseImageUrl as AnyEndpoint)(ctx, {
			url: 'https://example.com/multi.pdf',
		});

		expect(result).toMatchObject({ OCRExitCode: 2 });
		expect(ctx.db.ocrResults.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('account.conversions posts to the statistics host, not options.baseUrl', async () => {
		mockPost.mockResolvedValue(CONVERSIONS_RESPONSE);
		const ctx = createContext({
			options: { baseUrl: 'https://apipro1.ocr.space' },
		});

		const result = await (Account.conversions as AnyEndpoint)(ctx, {});

		expect(mockPost).toHaveBeenCalledWith('/conversions', 'test-key', {
			formData: {},
			baseUrl: OCRSPACE_MYAPI_BASE,
		});
		expect(result).toMatchObject({ count_total: 165 });
		expect(ctx.db.conversions.upsertByEntityId).toHaveBeenCalledWith(
			'currentMonth',
			expect.objectContaining({ total: 165, engine3: 0 }),
		);
	});

	it('account.conversions throws when the body has no counters', async () => {
		mockPost.mockResolvedValue({});
		const ctx = createContext();

		await expect(
			(Account.conversions as AnyEndpoint)(ctx, {}),
		).rejects.toBeInstanceOf(OcrSpaceAPIError);
		expect(ctx.db.conversions.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('rejects a drifted parse response before returning it', async () => {
		mockGet.mockResolvedValue({
			ParsedResults: 'not-an-array',
			OCRExitCode: 1,
		});
		const ctx = createContext();

		await expect(
			(Ocr.parseImageUrl as AnyEndpoint)(ctx, {
				url: 'https://example.com/receipt.jpg',
			}),
		).rejects.toThrow();
		expect(ctx.db.ocrResults.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('does not call the network when parse input is invalid', async () => {
		const ctx = createContext();

		await expect((Ocr.parse as AnyEndpoint)(ctx, {})).rejects.toThrow(
			/exactly one of url, file, or base64Image/,
		);
		expect(mockGet).not.toHaveBeenCalled();
		expect(mockPost).not.toHaveBeenCalled();
	});

	it('forwards options.baseUrl to the parse endpoints', async () => {
		mockGet.mockResolvedValue(SUCCESS_RESPONSE);
		const ctx = createContext({
			options: { baseUrl: 'https://apipro1.ocr.space' },
		});

		await (Ocr.parseImageUrl as AnyEndpoint)(ctx, {
			url: 'https://example.com/receipt.jpg',
		});

		expect(mockGet.mock.calls[0]?.[2]).toMatchObject({
			baseUrl: 'https://apipro1.ocr.space',
		});
	});
});
