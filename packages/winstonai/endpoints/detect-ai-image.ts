import { logEventFromContext } from 'corsair/core';
import type { WinstonaiEndpoints } from '..';
import { makeWinstonaiRequest } from '../client';
import {
	toDetectEventPayload,
	WinstonaiEndpointInputSchemas,
	WinstonaiEndpointOutputSchemas,
} from './types';

export const detectAiImage: WinstonaiEndpoints['detectAiImage'] = async (
	ctx,
	input,
) => {
	const parsed = WinstonaiEndpointInputSchemas.detectAiImage.parse(input);

	const response = await makeWinstonaiRequest('/image-detection', ctx.key, {
		schema: WinstonaiEndpointOutputSchemas.detectAiImage,
		body: {
			url: parsed.url,
			version: parsed.version,
		},
	});

	await logEventFromContext(
		ctx,
		'winstonai.detect.aiImage',
		toDetectEventPayload(parsed),
		'completed',
	);

	return response;
};
