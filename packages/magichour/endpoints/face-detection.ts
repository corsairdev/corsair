import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

export const detect: MagicHourEndpoints['faceDetectionDetect'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.faceDetectionDetect.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['faceDetectionDetect']
	>('/v1/face-detection', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed =
		MagicHourEndpointOutputSchemas.faceDetectionDetect.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.faceDetection.detect',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const getDetails: MagicHourEndpoints['faceDetectionGetDetails'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.faceDetectionGetDetails.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['faceDetectionGetDetails']
	>(`/v1/face-detection/${parsedInput.id}`, ctx.key, { method: 'GET' });

	const parsed =
		MagicHourEndpointOutputSchemas.faceDetectionGetDetails.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.faceDetection.getDetails',
		{ id: parsedInput.id, faceCount: parsed.faces.length },
		'completed',
	);

	return parsed;
};
