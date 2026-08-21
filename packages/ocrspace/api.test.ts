import {
	assertOcrSuccess,
	flattenOcrErrorMessage,
	makeOcrSpaceGetRequest,
	makeOcrSpacePostRequest,
	OCRSPACE_MYAPI_BASE,
	OcrSpaceAPIError,
} from './client';
import { isSearchablePdfUrl } from './endpoints/parse';
import type {
	ConversionsResponse,
	OcrResponse,
	ParseImageUrlResponse,
	ParseResponse,
} from './endpoints/types';
import {
	OcrSpaceEndpointInputSchemas,
	OcrSpaceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ocrspace } from './index';

const TEST_API_KEY = process.env.OCRSPACE_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

const PNG_BASE64 =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const SUCCESS_RESPONSE: OcrResponse = {
	ParsedResults: [
		{
			ParsedText: 'Hello world',
			FileParseExitCode: 1,
			TextOverlay: {
				Lines: [
					{
						LineText: 'Hello world',
						Words: [
							{ WordText: 'Hello', Left: 10, Top: 20, Height: 15, Width: 40 },
						],
						MaxHeight: 15,
						MinTop: 20,
					},
				],
				HasOverlay: true,
				Message: null,
			},
			ErrorMessage: null,
			ErrorDetails: null,
		},
	],
	OCRExitCode: 1,
	IsErroredOnProcessing: false,
	ErrorMessage: null,
	ErrorDetails: null,
	ProcessingTimeInMilliseconds: '231',
};

describe('OCR.space input schemas', () => {
	it('accepts a valid parseImageUrl input', () => {
		const parsed = OcrSpaceEndpointInputSchemas.parseImageUrl.parse({
			url: 'https://example.com/receipt.jpg',
			language: 'eng',
			OCREngine: 2,
			isTable: true,
		});

		expect(parsed.url).toBe('https://example.com/receipt.jpg');
		expect(parsed.OCREngine).toBe(2);
	});

	it('rejects a two-letter language code', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parseImageUrl.parse({
				url: 'https://example.com/receipt.jpg',
				language: 'en',
			}),
		).toThrow(/three-letter/);
	});

	it('accepts "auto" as a language', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parseImageUrl.parse({
				url: 'https://example.com/receipt.jpg',
				language: 'auto',
				OCREngine: 3,
			}),
		).not.toThrow();
	});

	it('rejects "auto" on engine 1, which the provider does not support', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parseImageUrl.parse({
				url: 'https://example.com/receipt.jpg',
				language: 'auto',
				OCREngine: 1,
			}),
		).toThrow(/OCREngine 2 or 3/);

		// Omitted OCREngine defaults to 1 on the wire.
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				url: 'https://example.com/receipt.jpg',
				language: 'auto',
			}),
		).toThrow(/OCREngine 2 or 3/);
	});

	it('rejects an OCR engine outside 1-3', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parseImageUrl.parse({
				url: 'https://example.com/receipt.jpg',
				OCREngine: 4,
			}),
		).toThrow();
	});

	it('accepts exactly one parse source', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				url: 'https://example.com/receipt.jpg',
			}),
		).not.toThrow();

		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({ base64Image: PNG_BASE64 }),
		).not.toThrow();
	});

	it('rejects a parse call with no source', () => {
		expect(() => OcrSpaceEndpointInputSchemas.parse.parse({})).toThrow(
			/exactly one of url, file, or base64Image/,
		);
	});

	it('rejects a parse call with two sources', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				url: 'https://example.com/receipt.jpg',
				base64Image: PNG_BASE64,
			}),
		).toThrow(/exactly one of url, file, or base64Image/);
	});

	it('rejects a base64 payload without the data URI prefix', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				base64Image: 'iVBORw0KGgoAAAANSUhEUg==',
			}),
		).toThrow(/data URI prefix/);
	});

	it('rejects an empty or non-base64 payload after the data URI prefix', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				base64Image: 'data:image/png;base64,',
			}),
		).toThrow();

		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				base64Image: 'data:image/png;base64,not-valid!!!',
			}),
		).toThrow();

		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				base64Image: 'data:image/png;base64,A',
			}),
		).toThrow();
	});

	it('accepts a typed Blob without filetype', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				file: new Blob(['x'], { type: 'image/png' }),
			}),
		).not.toThrow();
	});

	it('accepts a File with a filename and no MIME type', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				file: new File(['x'], 'scan.png'),
			}),
		).not.toThrow();
	});

	it('rejects an untyped Blob unless filetype is set', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				file: new Blob(['x']),
			}),
		).toThrow(/filetype/);

		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				file: new Blob(['x']),
				filetype: 'PNG',
			}),
		).not.toThrow();
	});

	it('rejects engine 3 combined with searchable PDF output', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				url: 'https://example.com/scan.pdf',
				OCREngine: 3,
				isCreateSearchablePdf: true,
			}),
		).toThrow(/does not support isCreateSearchablePdf/);

		expect(() =>
			OcrSpaceEndpointInputSchemas.parseImageUrl.parse({
				url: 'https://example.com/scan.pdf',
				OCREngine: 3,
				isCreateSearchablePdf: true,
			}),
		).toThrow(/does not support isCreateSearchablePdf/);
	});

	it('allows engine 2 with searchable PDF output', () => {
		expect(() =>
			OcrSpaceEndpointInputSchemas.parse.parse({
				url: 'https://example.com/scan.pdf',
				OCREngine: 2,
				isCreateSearchablePdf: true,
			}),
		).not.toThrow();
	});

	it('accepts the documented conversions input', () => {
		expect(
			OcrSpaceEndpointInputSchemas.conversions.parse({ startDate: 'lastMonth' })
				.startDate,
		).toBe('lastMonth');

		expect(() =>
			OcrSpaceEndpointInputSchemas.conversions.parse({
				startDate: 'lastmonth',
			}),
		).toThrow();
	});
});

describe('OCR.space response schemas', () => {
	it('parses a successful response including the text overlay', () => {
		const parsed = OcrSpaceEndpointOutputSchemas.parse.parse(SUCCESS_RESPONSE);

		expect(parsed.OCRExitCode).toBe(1);
		expect(parsed.ParsedResults?.[0]?.ParsedText).toBe('Hello world');
		expect(
			parsed.ParsedResults?.[0]?.TextOverlay?.Lines?.[0]?.Words?.[0],
		).toEqual({ WordText: 'Hello', Left: 10, Top: 20, Height: 15, Width: 40 });
		expect(parsed.ParsedResults?.[0]?.TextOverlay?.Lines?.[0]?.LineText).toBe(
			'Hello world',
		);
	});

	it('keeps unknown provider fields instead of stripping them', () => {
		const parsed = OcrSpaceEndpointOutputSchemas.parse.parse({
			...SUCCESS_RESPONSE,
			SomeNewField: 'kept',
		});

		expect(parsed.SomeNewField).toBe('kept');
	});

	it('parses an ErrorMessage supplied as an array', () => {
		const parsed = OcrSpaceEndpointOutputSchemas.parse.parse({
			OCRExitCode: 3,
			IsErroredOnProcessing: true,
			ErrorMessage: ['File failed to load', 'Retry with a smaller file'],
		});

		expect(Array.isArray(parsed.ErrorMessage)).toBe(true);
	});

	it('parses a conversions response using the live field names', () => {
		const parsed = OcrSpaceEndpointOutputSchemas.conversions.parse({
			count_total: 165,
			count_engine1: 120,
			count_engine2: 45,
			count_engine3: 0,
		});

		expect(parsed.count_total).toBe(165);
		expect(parsed.count_engine3).toBe(0);
	});

	it('keeps unknown fields nested inside ParsedResults', () => {
		// Nested objects are loose too — `TextOrientation` was a real field that
		// a strict nested schema would have silently dropped.
		const parsed = OcrSpaceEndpointOutputSchemas.parse.parse({
			ParsedResults: [{ ParsedText: 'x', SomeFutureField: 'kept' }],
			OCRExitCode: 1,
		});

		expect(parsed.ParsedResults?.[0]?.SomeFutureField).toBe('kept');
	});

	it('parses the TextOrientation field returned by the provider', () => {
		const parsed = OcrSpaceEndpointOutputSchemas.parse.parse({
			ParsedResults: [
				{ ParsedText: 'x', TextOrientation: '0', FileParseExitCode: 1 },
			],
			OCRExitCode: 1,
			IsErroredOnProcessing: false,
		});

		expect(parsed.ParsedResults?.[0]?.TextOrientation).toBe('0');
	});
});

describe('output validation', () => {
	it('rejects a response whose types have drifted', () => {
		// Endpoints parse responses through these schemas before returning, so a
		// drifted payload fails at the boundary instead of reaching the caller.
		expect(() =>
			OcrSpaceEndpointOutputSchemas.parse.parse({
				ParsedResults: 'not-an-array',
				OCRExitCode: 1,
			}),
		).toThrow();

		expect(() =>
			OcrSpaceEndpointOutputSchemas.parse.parse({
				ParsedResults: [{ ParsedText: 42 }],
				OCRExitCode: 1,
			}),
		).toThrow();

		expect(() =>
			OcrSpaceEndpointOutputSchemas.conversions.parse({
				count_total: 'many',
			}),
		).toThrow();
	});

	it('accepts a well-formed response unchanged', () => {
		expect(() =>
			OcrSpaceEndpointOutputSchemas.parse.parse(SUCCESS_RESPONSE),
		).not.toThrow();
	});
});

describe('isSearchablePdfUrl', () => {
	it('recognises a real searchable PDF link', () => {
		expect(
			isSearchablePdfUrl('https://pdf-78.ocr.space/SearchablePDF/abc.pdf'),
		).toBe(true);
	});

	it('rejects the placeholder sentence the provider sends otherwise', () => {
		// SearchablePDFURL is always populated, so a truthiness check would
		// wrongly record every parse as having produced a searchable PDF.
		expect(
			isSearchablePdfUrl(
				'Searchable PDF not generated as it was not requested.',
			),
		).toBe(false);
		expect(isSearchablePdfUrl(undefined)).toBe(false);
	});
});

describe('assertOcrSuccess', () => {
	it('passes a successful response through', () => {
		expect(() => assertOcrSuccess(SUCCESS_RESPONSE)).not.toThrow();
	});

	it('throws when the provider flags an error on a HTTP 200 response', () => {
		expect(() =>
			assertOcrSuccess({
				OCRExitCode: 3,
				IsErroredOnProcessing: true,
				ErrorMessage: 'File size exceeds the maximum allowed',
			}),
		).toThrow(OcrSpaceAPIError);
	});

	it('carries the provider message and exit code on the thrown error', () => {
		try {
			assertOcrSuccess({
				OCRExitCode: 4,
				IsErroredOnProcessing: true,
				ErrorMessage: ['Fatal parsing failure'],
			});
			throw new Error('assertOcrSuccess should have thrown');
		} catch (error) {
			expect(error).toBeInstanceOf(OcrSpaceAPIError);
			expect((error as OcrSpaceAPIError).message).toBe('Fatal parsing failure');
			expect((error as OcrSpaceAPIError).ocrExitCode).toBe(4);
			expect((error as OcrSpaceAPIError).status).toBeUndefined();
		}
	});

	it('allows a partial success through so parsed pages are not discarded', () => {
		const partial: OcrResponse = {
			OCRExitCode: 2,
			IsErroredOnProcessing: false,
			ParsedResults: [
				{ ParsedText: 'page one', FileParseExitCode: 1 },
				{ ParsedText: '', FileParseExitCode: -10 },
			],
		};

		expect(() => assertOcrSuccess(partial)).not.toThrow();
		expect(partial.ParsedResults?.[0]?.ParsedText).toBe('page one');
	});

	it('falls back to the per-page error message when the top level has none', () => {
		expect(() =>
			assertOcrSuccess({
				OCRExitCode: 3,
				IsErroredOnProcessing: true,
				ParsedResults: [
					{ FileParseExitCode: -30, ErrorMessage: 'Unsupported file type' },
				],
			}),
		).toThrow(/Unsupported file type/);
	});

	it('uses a later page error when page 0 has none', () => {
		expect(() =>
			assertOcrSuccess({
				OCRExitCode: 3,
				IsErroredOnProcessing: true,
				ParsedResults: [
					{ FileParseExitCode: 1, ParsedText: 'ok' },
					{ FileParseExitCode: -10, ErrorMessage: 'Page two timed out' },
				],
			}),
		).toThrow(/Page two timed out/);
	});

	it('throws on a structurally empty response', () => {
		expect(() => assertOcrSuccess({})).toThrow(OcrSpaceAPIError);
		expect(() =>
			assertOcrSuccess({
				SearchablePDFURL:
					'Searchable PDF not generated as it was not requested.',
			}),
		).toThrow(OcrSpaceAPIError);
	});

	it('throws when a success exit code has no parsed pages', () => {
		expect(() => assertOcrSuccess({ OCRExitCode: 1 })).toThrow(
			OcrSpaceAPIError,
		);
		expect(() =>
			assertOcrSuccess({ OCRExitCode: 2, ParsedResults: [] }),
		).toThrow(OcrSpaceAPIError);
	});

	it('throws when every parsed page failed', () => {
		expect(() =>
			assertOcrSuccess({
				OCRExitCode: 1,
				ParsedResults: [
					{ FileParseExitCode: -10, ErrorMessage: 'Parse failed' },
				],
			}),
		).toThrow(OcrSpaceAPIError);
		expect(() =>
			assertOcrSuccess({
				OCRExitCode: 2,
				ParsedResults: [
					{ FileParseExitCode: -20, ErrorMessage: 'Timed out' },
					{ FileParseExitCode: -30, ErrorMessage: 'Invalid file' },
				],
			}),
		).toThrow(OcrSpaceAPIError);
	});

	it('allows a successful OCR with empty page text', () => {
		expect(() =>
			assertOcrSuccess({
				OCRExitCode: 1,
				IsErroredOnProcessing: false,
				ParsedResults: [{ ParsedText: '', FileParseExitCode: 1 }],
			}),
		).not.toThrow();
	});
});

describe('flattenOcrErrorMessage', () => {
	it('joins an array of messages', () => {
		expect(flattenOcrErrorMessage(['one', 'two'])).toBe('one two');
	});

	it('returns undefined for empty input', () => {
		expect(flattenOcrErrorMessage(null)).toBeUndefined();
		expect(flattenOcrErrorMessage([])).toBeUndefined();
	});
});

describe('error handler classification', () => {
	// Mirrors how the framework picks a handler: first matching key wins, so
	// this also covers the ordering between the handlers.
	function classify(error: Error): string {
		for (const [name, handler] of Object.entries(errorHandlers)) {
			if (handler.match(error)) {
				return name;
			}
		}
		return 'NONE';
	}

	// Failures reported inside a HTTP 200 body arrive with no status attached,
	// so they can only be classified from the message text.
	function bodyError(message: string, exitCode = 3): OcrSpaceAPIError {
		return new OcrSpaceAPIError(message, { ocrExitCode: exitCode });
	}

	function httpError(
		status: number,
		message: string,
		body?: unknown,
	): Error & { status: number; body?: unknown } {
		const error = new Error(message) as Error & {
			status: number;
			body?: unknown;
		};
		error.status = status;
		error.body = body;
		return error;
	}

	it('treats a daily quota message as a rate limit', () => {
		expect(
			classify(
				bodyError(
					'You may only perform this action upto maximum 500 number of times within 86400 seconds',
				),
			),
		).toBe('RATE_LIMIT_ERROR');
	});

	it('treats HTTP 403 throttle as a rate limit, not a bad API key', () => {
		// OCR.space throttling is HTTP 403. The transport sets message to
		// "Forbidden"; the real phrase lives on the body.
		expect(
			classify(
				httpError(
					403,
					'Forbidden',
					'You may only perform this action upto maximum 10 number of times within 600 seconds',
				),
			),
		).toBe('RATE_LIMIT_ERROR');

		expect(classify(httpError(403, 'Forbidden'))).toBe('RATE_LIMIT_ERROR');
	});

	it('does not treat HTTP 403 as an auth failure', () => {
		expect(classify(httpError(403, 'Forbidden'))).not.toBe('AUTH_ERROR');
		expect(classify(httpError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
	});

	it('does not retry a monthly conversion limit as a rate limit', () => {
		expect(classify(bodyError('Monthly conversion limit reached'))).toBe(
			'BAD_REQUEST_ERROR',
		);
	});

	it('does not treat a "429" buried in a file-size message as a rate limit', () => {
		expect(
			classify(bodyError('File size 429kb exceeds the maximum allowed')),
		).toBe('BAD_REQUEST_ERROR');
	});

	it('does not treat a file size rejection as a rate limit', () => {
		// "maximum" appears in both quota and file-size messages; only the
		// former may be retried, since retrying an oversized file just burns
		// more conversions.
		const classification = classify(
			bodyError('File size exceeds the maximum allowed'),
		);

		expect(classification).not.toBe('RATE_LIMIT_ERROR');
		expect(classification).toBe('BAD_REQUEST_ERROR');
	});

	it('classifies any other provider-level parse failure as a bad request', () => {
		expect(classify(bodyError('Unable to recognize the file type'))).toBe(
			'BAD_REQUEST_ERROR',
		);
	});

	it('classifies an invalid key as an auth error', () => {
		expect(classify(bodyError('The API key is invalid', 3))).toBe('AUTH_ERROR');
	});

	it('classifies a zod validation failure without retrying it', () => {
		let zodError: Error | undefined;
		try {
			OcrSpaceEndpointInputSchemas.parse.parse({});
		} catch (error) {
			zodError = error as Error;
		}

		expect(zodError).toBeDefined();
		expect(classify(zodError as Error)).toBe('VALIDATION_ERROR');
	});

	it('keeps DEFAULT last so caller-supplied handlers stay reachable', () => {
		// handleCorsairError picks the first matching key in insertion order and
		// DEFAULT matches everything, so DEFAULT must sort last after a merge.
		const plugin = ocrspace({
			errorHandlers: {
				CUSTOM_ERROR: {
					match: (error: Error) => error.message.includes('custom'),
					handler: async () => ({ maxRetries: 7 }),
				},
			},
		});

		expect(plugin.errorHandlers).toBeDefined();
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys).toContain('CUSTOM_ERROR');
		expect(keys.indexOf('CUSTOM_ERROR')).toBeLessThan(keys.indexOf('DEFAULT'));
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for an unrecognised error', () => {
		expect(classify(new Error('something unexpected'))).toBe('DEFAULT');
	});

	it('does not stack handler retries on transport retries', async () => {
		// The auth handler logs by design; silence it so the suite output stays
		// clean rather than showing what looks like a failure.
		const logged = jest.spyOn(console, 'error').mockImplementation(() => {});
		const authError = bodyError('invalid api key');
		const rateLimit = await errorHandlers.RATE_LIMIT_ERROR.handler();
		const auth = await errorHandlers.AUTH_ERROR.handler(authError, {
			pluginId: 'ocrspace',
			operation: 'ocr.parse',
			input: {},
			originalError: authError,
		});

		expect(rateLimit.maxRetries).toBe(0);
		expect(auth.maxRetries).toBe(0);
		expect(logged).toHaveBeenCalled();
		logged.mockRestore();
	});
});

describeIfApiKey('OCR.space API type tests', () => {
	it('parseImageUrl returns the expected shape', async () => {
		const response = await makeOcrSpaceGetRequest<ParseImageUrlResponse>(
			'/parse/imageurl',
			TEST_API_KEY,
			{
				query: {
					url: 'https://dl.a9t9.com/ocr/solarcell.jpg',
					language: 'eng',
					OCREngine: 2,
				},
			},
		);

		OcrSpaceEndpointOutputSchemas.parseImageUrl.parse(response);
		expect(response.OCRExitCode).toBe(1);
		expect(response.ParsedResults?.length).toBeGreaterThan(0);
	});

	it('parse extracts text from a URL over the POST endpoint', async () => {
		const response = await makeOcrSpacePostRequest<ParseResponse>(
			'/parse/image',
			TEST_API_KEY,
			{
				formData: {
					url: 'https://dl.a9t9.com/ocr/solarcell.jpg',
					OCREngine: 2,
				},
			},
		);

		OcrSpaceEndpointOutputSchemas.parse.parse(response);
		expect(response.OCRExitCode).toBe(1);
		expect(response.ParsedResults?.[0]?.ParsedText).toContain('Solar cell');
	});

	it('parse accepts a base64 data URI', async () => {
		const response = await makeOcrSpacePostRequest<ParseResponse>(
			'/parse/image',
			TEST_API_KEY,
			{ formData: { base64Image: PNG_BASE64 } },
		);

		OcrSpaceEndpointOutputSchemas.parse.parse(response);
		expect(response.IsErroredOnProcessing).toBe(false);
	});

	it('conversions returns per-engine counters with no parameters', async () => {
		// Exercises the empty-body path: an empty multipart payload is rejected
		// by the provider with HTTP 411.
		const response = await makeOcrSpacePostRequest<ConversionsResponse>(
			'/conversions',
			TEST_API_KEY,
			{ baseUrl: OCRSPACE_MYAPI_BASE },
		);

		OcrSpaceEndpointOutputSchemas.conversions.parse(response);
		expect(typeof response.count_total).toBe('number');
	});

	it('conversions accepts the lastMonth parameter', async () => {
		const response = await makeOcrSpacePostRequest<ConversionsResponse>(
			'/conversions',
			TEST_API_KEY,
			{ formData: { startDate: 'lastMonth' }, baseUrl: OCRSPACE_MYAPI_BASE },
		);

		OcrSpaceEndpointOutputSchemas.conversions.parse(response);
		expect(typeof response.count_total).toBe('number');
	});
});
