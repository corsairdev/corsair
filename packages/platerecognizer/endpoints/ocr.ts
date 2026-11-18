import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { plateGet, platePostForm } from '../client';
import type { PlateRecognizerContext } from '../context';
import type {
	GetStatisticsInput,
	GetStatisticsResponse,
	ReadOcrInput,
	ReadOcrResponse,
} from './types';
import {
	GetStatisticsInputSchema,
	GetStatisticsResponseSchema,
	ReadOcrInputSchema,
	ReadOcrResponseSchema,
} from './types';

/** The OCR reader takes 20 to 30 s per image, past core's 20 s default. */
const OCR_TIMEOUT_MS = 120_000;

/** Read a VIN, trailer id, odometer, container, boat number or C-TPAT seal from an image. */
export const readOcr: CorsairEndpoint<
	PlateRecognizerContext,
	ReadOcrInput,
	ReadOcrResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('platerecognizer', 'api_key');
	}
	const parsed = ReadOcrInputSchema.parse(input);
	// `unknown` until ReadOcrResponseSchema parses it: untrusted provider JSON.
	const body = await platePostForm<unknown>(
		ctx.key,
		'/v1/ocr/reader/',
		{
			type: parsed.type,
			upload: parsed.upload,
			upload_url: parsed.uploadUrl,
			camera_id: parsed.cameraId,
			timestamp: parsed.timestamp,
		},
		OCR_TIMEOUT_MS,
	);
	const result = ReadOcrResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'platerecognizer.ocr.read',
		{ type: parsed.type, count: result.results.length },
		'completed',
	);
	return result;
};

/** OCR calls used this period and the plan's limit. */
export const getOcrUsage: CorsairEndpoint<
	PlateRecognizerContext,
	GetStatisticsInput,
	GetStatisticsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('platerecognizer', 'api_key');
	}
	GetStatisticsInputSchema.parse(input ?? {});
	// `unknown` until GetStatisticsResponseSchema parses it: untrusted provider JSON.
	const body = await plateGet<unknown>(ctx.key, '/v1/ocr/statistics/');
	const result = GetStatisticsResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'platerecognizer.ocr.getUsage',
		{},
		'completed',
	);
	return result;
};
