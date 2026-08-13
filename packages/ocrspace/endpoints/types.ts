import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared response objects
// ---------------------------------------------------------------------------

// Every response object is `.loose()`: unknown provider fields are kept rather
// than stripped, so a field added by OCR.space (or one only some engines
// return, as `TextOrientation` was) still reaches the caller.
export const OcrWordSchema = z
	.object({
		WordText: z.string().nullable().optional(),
		Left: z.number().nullable().optional(),
		Top: z.number().nullable().optional(),
		Height: z.number().nullable().optional(),
		Width: z.number().nullable().optional(),
	})
	.loose();

export const OcrLineSchema = z
	.object({
		// Undocumented, but returned by engines 1 and 2 alongside the per-word
		// boxes. Engine 3 omits the per-line detail entirely.
		LineText: z.string().nullable().optional(),
		Words: z.array(OcrWordSchema).nullable().optional(),
		MaxHeight: z.number().nullable().optional(),
		MinTop: z.number().nullable().optional(),
	})
	.loose();

export const OcrTextOverlaySchema = z
	.object({
		Lines: z.array(OcrLineSchema).nullable().optional(),
		HasOverlay: z.boolean().nullable().optional(),
		Message: z.string().nullable().optional(),
	})
	.loose();

// OCR.space returns ErrorMessage as a bare string on some failures and as an
// array of strings on others, so both shapes have to be accepted.
export const OcrErrorMessageSchema = z
	.union([z.string(), z.array(z.string())])
	.nullable()
	.optional();

export const OcrParsedResultSchema = z
	.object({
		ParsedText: z.string().nullable().optional(),
		// Returned as a string (e.g. "0") whenever detectOrientation is used.
		TextOrientation: z.string().nullable().optional(),
		// 1 = success, 0 = file not found, -10 = parse error, -20 = timeout,
		// -30 = validation error, -99 = unknown error
		FileParseExitCode: z.number().int().nullable().optional(),
		TextOverlay: OcrTextOverlaySchema.nullable().optional(),
		ErrorMessage: OcrErrorMessageSchema,
		ErrorDetails: z.string().nullable().optional(),
	})
	.loose();

export const OcrResponseSchema = z
	.object({
		// One entry per page for PDFs; a single entry for images.
		ParsedResults: z.array(OcrParsedResultSchema).nullable().optional(),
		// 1 = success, 2 = partial success, 3 = failed, 4 = fatal error
		OCRExitCode: z.number().int().nullable().optional(),
		IsErroredOnProcessing: z.boolean().nullable().optional(),
		ErrorMessage: OcrErrorMessageSchema,
		ErrorDetails: z.string().nullable().optional(),
		// Download link for a generated searchable PDF, valid for one hour. When
		// no searchable PDF was requested the provider still populates this
		// field, with an explanatory sentence rather than a URL.
		SearchablePDFURL: z.string().nullable().optional(),
		// Documented as a string, but accepted as a number too so a numeric
		// value from any engine cannot fail validation of a good response.
		ProcessingTimeInMilliseconds: z
			.union([z.string(), z.number()])
			.nullable()
			.optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Shared request options
// ---------------------------------------------------------------------------

export const OcrEngineSchema = z.union([
	z.literal(1),
	z.literal(2),
	z.literal(3),
]);

// Spread into both parse inputs so the two endpoints cannot drift apart.
const ocrOptionsShape = {
	// OCR.space language codes are always three letters ("eng", never "en").
	// "auto" is accepted by engines 2 and 3 only.
	language: z
		.string()
		.regex(/^([a-z]{3}|auto)$/, {
			message:
				'language must be a three-letter OCR.space code (e.g. "eng") or "auto".',
		})
		.optional(),
	OCREngine: OcrEngineSchema.optional(),
	isOverlayRequired: z.boolean().optional(),
	detectOrientation: z.boolean().optional(),
	scale: z.boolean().optional(),
	isTable: z.boolean().optional(),
	isCreateSearchablePdf: z.boolean().optional(),
	isSearchablePdfHideTextLayer: z.boolean().optional(),
	filetype: z.enum(['PDF', 'GIF', 'PNG', 'JPG', 'TIF', 'BMP']).optional(),
};

// Engine 3 does not support searchable PDF output. Rejecting the combination
// locally avoids burning a conversion on a request that cannot succeed.
function searchablePdfIsSupported(input: {
	OCREngine?: number;
	isCreateSearchablePdf?: boolean;
}): boolean {
	return !(input.OCREngine === 3 && input.isCreateSearchablePdf === true);
}

const SEARCHABLE_PDF_ENGINE_MESSAGE =
	'OCREngine 3 does not support isCreateSearchablePdf. Use engine 1 or 2.';

// "auto" is engines 2 and 3 only. Omitted OCREngine is engine 1 on the wire.
function autoLanguageIsSupported(input: {
	OCREngine?: number;
	language?: string;
}): boolean {
	if (input.language !== 'auto') {
		return true;
	}
	return input.OCREngine === 2 || input.OCREngine === 3;
}

const AUTO_LANGUAGE_ENGINE_MESSAGE =
	'language "auto" is only supported on OCREngine 2 or 3.';

const TYPED_BLOB_MIMES = new Set([
	'application/pdf',
	'image/gif',
	'image/png',
	'image/jpeg',
	'image/jpg',
	'image/tiff',
	'image/tif',
	'image/bmp',
]);

const BASE64_DATA_URI =
	/^data:(image\/[a-z0-9.+-]+|application\/pdf);base64,([A-Za-z0-9+/]+={0,2})$/i;

function base64ImageIsValid(value: string): boolean {
	const payload = BASE64_DATA_URI.exec(value)?.[2];
	return payload !== undefined && payload.length % 4 === 0;
}

function blobUploadIsTyped(input: { file?: Blob; filetype?: string }): boolean {
	if (input.file === undefined || input.filetype !== undefined) {
		return true;
	}
	if (
		typeof File !== 'undefined' &&
		input.file instanceof File &&
		input.file.name.length > 0
	) {
		return true;
	}
	return TYPED_BLOB_MIMES.has(input.file.type.toLowerCase());
}

const UNTYPED_BLOB_MESSAGE =
	'Untyped Blob uploads require filetype. Pass a typed Blob or set filetype.';

// ---------------------------------------------------------------------------
// ocr.parseImageUrl — GET /parse/imageurl
// ---------------------------------------------------------------------------

export const ParseImageUrlInputSchema = z
	.object({
		url: z.url(),
		...ocrOptionsShape,
	})
	.refine(searchablePdfIsSupported, {
		message: SEARCHABLE_PDF_ENGINE_MESSAGE,
	})
	.refine(autoLanguageIsSupported, {
		message: AUTO_LANGUAGE_ENGINE_MESSAGE,
	});

export const ParseImageUrlResponseSchema = OcrResponseSchema;

// ---------------------------------------------------------------------------
// ocr.parse — POST /parse/image
// ---------------------------------------------------------------------------

export const ParseInputSchema = z
	.object({
		url: z.url().optional(),
		// Prefer a `File` over a bare `Blob`: multipart uploads carry the
		// filename, and OCR.space uses the extension to detect the file type. A
		// `Blob` is sent without one, so pair it with an explicit `filetype`.
		//
		// Note: `z.instanceof()` carries no JSON Schema representation, so this
		// field surfaces as `unknown` in generated introspection and docs. The
		// binary payload cannot be expressed in JSON Schema either way.
		file: z.instanceof(Blob).optional(),
		// The provider requires the data URI prefix, e.g.
		// "data:image/png;base64,iVBORw0KGgo..."
		base64Image: z
			.string()
			.refine(base64ImageIsValid, {
				message:
					'base64Image must include the data URI prefix and a valid base64 payload.',
			})
			.optional(),
		...ocrOptionsShape,
	})
	.refine(
		(input) => {
			const provided = [input.url, input.file, input.base64Image].filter(
				(value) => value !== undefined,
			);
			return provided.length === 1;
		},
		{ message: 'Provide exactly one of url, file, or base64Image.' },
	)
	.refine(searchablePdfIsSupported, {
		message: SEARCHABLE_PDF_ENGINE_MESSAGE,
	})
	.refine(autoLanguageIsSupported, {
		message: AUTO_LANGUAGE_ENGINE_MESSAGE,
	})
	.refine(blobUploadIsTyped, {
		message: UNTYPED_BLOB_MESSAGE,
	});

export const ParseResponseSchema = OcrResponseSchema;

// ---------------------------------------------------------------------------
// account.conversions — POST https://myapi.ocr.space/conversions
// ---------------------------------------------------------------------------

export const ConversionsInputSchema = z.object({
	// "lastMonth" is the only documented value and the provider treats the
	// parameter name as case-sensitive.
	startDate: z.literal('lastMonth').optional(),
});

// Field names verified against a live response. The provider documentation
// describes these as "Engine1"/"Engine2"/"Total", but the service actually
// returns snake_cased `count_*` keys and includes an engine 3 counter.
export const ConversionsResponseSchema = z
	.object({
		count_total: z.number().nullable().optional(),
		count_engine1: z.number().nullable().optional(),
		count_engine2: z.number().nullable().optional(),
		count_engine3: z.number().nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type OcrWord = z.infer<typeof OcrWordSchema>;
export type OcrLine = z.infer<typeof OcrLineSchema>;
export type OcrTextOverlay = z.infer<typeof OcrTextOverlaySchema>;
export type OcrParsedResult = z.infer<typeof OcrParsedResultSchema>;
export type OcrResponse = z.infer<typeof OcrResponseSchema>;

export type ParseImageUrlInput = z.infer<typeof ParseImageUrlInputSchema>;
export type ParseImageUrlResponse = z.infer<typeof ParseImageUrlResponseSchema>;

export type ParseInput = z.infer<typeof ParseInputSchema>;
export type ParseResponse = z.infer<typeof ParseResponseSchema>;

export type ConversionsInput = z.infer<typeof ConversionsInputSchema>;
export type ConversionsResponse = z.infer<typeof ConversionsResponseSchema>;

export type OcrSpaceEndpointInputs = {
	parseImageUrl: ParseImageUrlInput;
	parse: ParseInput;
	conversions: ConversionsInput;
};

export type OcrSpaceEndpointOutputs = {
	parseImageUrl: ParseImageUrlResponse;
	parse: ParseResponse;
	conversions: ConversionsResponse;
};

export const OcrSpaceEndpointInputSchemas = {
	parseImageUrl: ParseImageUrlInputSchema,
	parse: ParseInputSchema,
	conversions: ConversionsInputSchema,
} as const;

export const OcrSpaceEndpointOutputSchemas = {
	parseImageUrl: ParseImageUrlResponseSchema,
	parse: ParseResponseSchema,
	conversions: ConversionsResponseSchema,
} as const;
