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
	const body = await platePostForm<unknown>(ctx.key, '/v1/plate-reader/', {
		upload: parsed.upload,
		regions: parsed.regions,
		camera_id: parsed.cameraId,
		mmc: parsed.mmc === undefined ? undefined : String(parsed.mmc),
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
