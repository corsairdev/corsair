import { logEventFromContext } from 'corsair/core';
import {
	assertOcrSuccess,
	makeOcrSpaceGetRequest,
	makeOcrSpacePostRequest,
} from '../client';
import type { OcrSpaceContext, OcrSpaceEndpoints } from '../index';
import type {
	OcrResponse,
	ParseImageUrlResponse,
	ParseResponse,
} from './types';
import {
	ParseImageUrlInputSchema,
	ParseImageUrlResponseSchema,
	ParseInputSchema,
	ParseResponseSchema,
} from './types';

/**
 * `ParsedResults` holds one entry per page of a PDF. The joined text is stored
 * for the cache only — the endpoints return the provider response untouched.
 */
function joinPages(response: OcrResponse): string {
	return (response.ParsedResults ?? [])
		.map((result) => result.ParsedText ?? '')
		.join('\n');
}

export function isSearchablePdfUrl(value: string | null | undefined): boolean {
	return typeof value === 'string' && value.startsWith('http');
}

function pageCount(response: OcrResponse): number {
	return response.ParsedResults?.length ?? 0;
}

// The provider reports this as a string; keep it numeric in the cache.
function processingTimeMs(response: OcrResponse): number | undefined {
	const raw = response.ProcessingTimeInMilliseconds;
	if (raw === null || raw === undefined || raw === '') {
		return undefined;
	}
	const parsed = typeof raw === 'number' ? raw : Number.parseInt(raw, 10);
	return Number.isNaN(parsed) ? undefined : parsed;
}

async function cacheResult(
	ctx: OcrSpaceContext,
	source: string,
	input: {
		OCREngine?: number;
		language?: string;
		isCreateSearchablePdf?: boolean;
	},
	response: OcrResponse,
): Promise<void> {
	// OCRExitCode 2 is a partial PDF: some pages parsed, some did not.
	// Caching that as a complete result would serve incomplete text on a later
	// read. Callers still get the partial payload back from the endpoint.
	if (response.OCRExitCode === 2) {
		return;
	}

	const engine = input.OCREngine ?? 1;
	const language = input.language ?? 'eng';
	// Engine and language change the extracted text, so they are part of the
	// key — otherwise re-reading the same image with a different engine would
	// silently overwrite the previous result.
	const entityId = [source, engine, language].join(':');

	try {
		await ctx.db.ocrResults.upsertByEntityId(entityId, {
			source,
			engine,
			language,
			text: joinPages(response),
			pageCount: pageCount(response),
			exitCode: response.OCRExitCode ?? null,
			// The provider fills SearchablePDFURL with an explanatory sentence
			// when no searchable PDF was requested, so presence alone is not a
			// signal that one exists.
			isSearchablePdf: isSearchablePdfUrl(response.SearchablePDFURL),
			processingTimeMs: processingTimeMs(response) ?? null,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn(`[ocrspace] Failed to cache OCR result for ${source}:`, error);
	}
}

export const parseImageUrl: OcrSpaceEndpoints['parseImageUrl'] = async (
	ctx,
	input,
) => {
	// endpointSchemas are metadata for introspection and are not applied by the
	// framework, so inputs are validated here to keep the declared contract and
	// the runtime behaviour in step.
	const validatedInput = ParseImageUrlInputSchema.parse(input);

	const rawResponse = await makeOcrSpaceGetRequest<ParseImageUrlResponse>(
		'/parse/imageurl',
		ctx.key,
		{ query: validatedInput, baseUrl: ctx.options.baseUrl },
	);

	// Responses are validated against the declared output schema so callers
	// never receive a payload that violates the exported contract.
	const response = ParseImageUrlResponseSchema.parse(rawResponse);

	assertOcrSuccess(response);

	await cacheResult(ctx, validatedInput.url, validatedInput, response);

	await logEventFromContext(
		ctx,
		'ocrspace.ocr.parseImageUrl',
		{
			url: validatedInput.url,
			engine: validatedInput.OCREngine ?? 1,
			language: validatedInput.language ?? 'eng',
			pages: pageCount(response),
		},
		'completed',
	);

	return response;
};

export const parse: OcrSpaceEndpoints['parse'] = async (ctx, input) => {
	const { url, file, base64Image, ...options } = ParseInputSchema.parse(input);

	const formData: Record<string, unknown> = { ...options };
	if (url !== undefined) {
		formData.url = url;
	}
	if (file !== undefined) {
		formData.file = file;
	}
	if (base64Image !== undefined) {
		formData.base64Image = base64Image;
	}

	const rawResponse = await makeOcrSpacePostRequest<ParseResponse>(
		'/parse/image',
		ctx.key,
		{ formData, baseUrl: ctx.options.baseUrl },
	);

	const response = ParseResponseSchema.parse(rawResponse);

	assertOcrSuccess(response);

	// Only URL-sourced parses are cached: hashing a multi-megabyte base64 or
	// file payload to build an entityId costs more than the cache is worth.
	if (url !== undefined) {
		await cacheResult(ctx, url, options, response);
	}

	await logEventFromContext(
		ctx,
		'ocrspace.ocr.parse',
		{
			// `base64Image` and `file` are the payload itself and are never logged.
			source:
				url !== undefined ? 'url' : file !== undefined ? 'file' : 'base64',
			...(url !== undefined && { url }),
			engine: options.OCREngine ?? 1,
			language: options.language ?? 'eng',
			pages: pageCount(response),
		},
		'completed',
	);

	return response;
};
