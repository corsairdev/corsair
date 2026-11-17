import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { platePostForm } from '../client';
import type { PlateRecognizerContext } from '../context';
import type { ReadPlateInput, ReadPlateResponse } from './types';
import { ReadPlateInputSchema, ReadPlateResponseSchema } from './types';

export const readPlate: CorsairEndpoint<
	PlateRecognizerContext,
	ReadPlateInput,
	ReadPlateResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('platerecognizer', 'api_key');
	}
	const parsed = ReadPlateInputSchema.parse(input);
	// `unknown` until ReadPlateResponseSchema parses it: untrusted provider JSON.
	const body = await platePostForm<unknown>(ctx.key, '/v1/plate-reader/', {
		upload: parsed.upload,
		upload_url: parsed.uploadUrl,
		regions: parsed.regions,
		camera_id: parsed.cameraId,
		timestamp: parsed.timestamp,
		mmc: parsed.mmc === undefined ? undefined : String(parsed.mmc),
		direction:
			parsed.direction === undefined ? undefined : String(parsed.direction),
		config:
			parsed.config === undefined ? undefined : JSON.stringify(parsed.config),
	});
	const result = ReadPlateResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'platerecognizer.plates.read',
		{ count: result.results.length },
		'completed',
	);
	return result;
};
